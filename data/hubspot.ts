import { Client } from '@hubspot/api-client'
import { formatISO, startOfDay } from 'date-fns'
import env from 'env-var'
import qs from 'query-string'

const HUBSPOT_PRIVATE_APP_TOKEN = env
  .get('HUBSPOT_PRIVATE_APP_TOKEN')
  .required()
  .asString()

export const hubspotV3 = new Client({ accessToken: HUBSPOT_PRIVATE_APP_TOKEN })

export const hubspotV1 = async (path: string) => {
  const url = qs.stringifyUrl({
    url: `https://api.hubapi.com/contacts/v1${path}`,
  })
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
  return await res.json()
}

export const getHubspotContactsInList = async (listId: string | number) => {
  return (await hubspotV1(
    `/lists/${listId}/contacts/all`,
  )) as HubspotContactListResponse
}

export const getDetailsForContact = (contact: Contact) => {
  const contactData = contact['identity-profiles'].reduce((acc, profile) => {
    profile.identities.forEach((identity) => {
      acc[identity.type] ??= []
      acc[identity.type].push(identity)
      acc[identity.type].sort(
        (a, b) =>
          Number(a['is-primary'] ?? false) - Number(b['is-primary'] ?? false),
      )
    })
    return acc
  }, {} as { EMAIL: Identity[]; [type: string]: Identity[] })

  return contactData
}

export const formatProperties = (properties: { [key: string]: any }) => {
  for (const key in properties) {
    const value = properties[key]
    if (value instanceof Date) {
      properties[key] = formatISO(startOfDay(value), { representation: 'date' })
    }
  }
  return properties
}

export async function updateHubspotContact(
  id: string,
  properties: { [key: string]: any },
) {
  return await hubspotV3.crm.contacts.basicApi
    .update(id, {
      properties: formatProperties(properties),
    })
    .catch((e) => {
      if (e.response?.body) {
        console.error(e.response.body)
      } else {
        console.error(e)
      }
    })
}

export interface HubspotContactListResponse {
  contacts: Contact[]
  'has-more': boolean
  'vid-offset': number
}

export interface Contact {
  addedAt: number
  vid: number
  'canonical-vid': number
  'merged-vids': number[]
  'portal-id': number
  'is-contact': boolean
  properties: Properties
  'form-submissions': FormSubmission[]
  'identity-profiles': IdentityProfile[]
  'merge-audits': MergeAudit[]
}

export interface FormSubmission {
  'conversion-id': string
  timestamp: number
  'form-id': string
  'portal-id': number
  'page-url': string
  'page-title': string
  title: string
  'form-type': string
  'meta-data': any[]
  'contact-associated-by'?: ContactAssociatedBy[]
}

export enum ContactAssociatedBy {
  Email = 'EMAIL',
  LeadGUID = 'LEAD_GUID',
}

export interface IdentityProfile {
  vid: number
  'saved-at-timestamp': number
  'deleted-changed-timestamp': number
  identities: Identity[]
}

export interface Identity {
  type: ContactAssociatedBy
  value: string
  timestamp: number
  'is-primary'?: boolean
  'is-secondary'?: boolean
}

export interface MergeAudit {
  'canonical-vid': number
  'vid-to-merge': number
  timestamp: number
  'entity-id': string
  'user-id': number
  'num-properties-moved': number
  merged_from_email: MergedEmail
  merged_to_email: MergedEmail
  'first-name': string
  'last-name': string
}

export interface MergedEmail {
  value: string
  'source-type': string
  'source-id': string
  'source-label': null
  'source-vids'?: number[]
  'updated-by-user-id': null
  timestamp: number
  selected: boolean
}

export interface Properties {
  firstname: Firstname
  lastmodifieddate: Firstname
  lastname: Firstname
}

export interface Firstname {
  value: string
}
