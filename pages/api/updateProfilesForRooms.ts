import { withSentry } from '@sentry/nextjs'
import { strict as assert } from 'assert'
import env from 'env-var'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  getDetailsForContact,
  getHubspotContactsInList,
} from '../../data/hubspot'
import { upsertUserProfile } from '../../data/leader'
import { supabase } from '../../data/supabase'
import { Room, RoomPermission, RoomPermissionType } from '../../types/app'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rooms = await supabase.from<Room>('room').select('*')
  assert(Array.isArray(rooms.data), 'Couldnt fetch rooms')

  const oldPermissions = await supabase
    .from<RoomPermission>('roompermission')
    .select('*')
  assert(Array.isArray(oldPermissions.data), 'Couldnt fetch permissions')

  for (const room of rooms.data) {
    /** Upsert room leader's profiles from Hubspot */

    const hubspotLeaderListId =
      room.hubspotLeaderListId ||
      env.get('HUBSPOT_LEADER_LIST_ID').required().asInt()
    // eslint-disable-next-line no-await-in-loop
    const { contacts } = await getHubspotContactsInList(hubspotLeaderListId)

    // eslint-disable-next-line no-await-in-loop
    const roomLeaderProfiles = await upsertUserProfile(
      contacts.map((contact) => ({
        email: getDetailsForContact(contact).EMAIL?.[0].value,
        hubspotContactId: contact.vid as any,
        firstName: contact.properties.firstname.value,
        lastName: contact.properties.lastname.value,
        canLeadSessions: true,
      })),
    )

    assert(roomLeaderProfiles.body?.length, 'Couldnt upsert roomLeaderProfiles')

    /** Rebuild room permissions */

    // Add permissions for new roomLeaderProfiles

    // eslint-disable-next-line no-await-in-loop
    const currentPermissions = await supabase
      .from<RoomPermission>('roompermission')
      .select('*')
      .match({
        roomId: room.id,
        type: RoomPermissionType.Lead,
      })

    const futurePermissions = roomLeaderProfiles.body.map((profile) => ({
      roomId: room.id,
      profileId: profile.id,
      type: RoomPermissionType.Lead,
    }))

    // update permissions
    supabase
      .from<RoomPermission>('roompermission')
      .insert(
        futurePermissions.filter(
          (p) =>
            !currentPermissions.body?.some(
              (cP) => cP.profileId === p.profileId,
            ),
        ),
      )

    // Leaders no longer in this group will have the permission deleted
    supabase
      .from<RoomPermission>('roompermission')
      .delete()
      .match({
        roomId: room.id,
        type: RoomPermissionType.Lead,
      })
      .match({
        profileId: currentPermissions.body
          ?.filter(
            (cp) =>
              !futurePermissions.some((fp) => fp.profileId === cp.profileId),
          )
          .map((cp) => cp.profileId),
      })
  }

  // console.debug("Room permissions and profiles updated OK")

  res.status(200).end()
}

export default withSentry(handler)
