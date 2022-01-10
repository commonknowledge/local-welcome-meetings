import { useRoom } from '../data/room'
import { useUser } from '../data/auth'
import { isWithinInterval, addSeconds } from 'date-fns'
import qs from 'query-string'

enum Options {
  TRUE = 'on',
  FALSE = 'off',
}

export function VideoCall() {
  const { profile, session } = useUser()
  const { room } = useRoom()

  if (!room) return <div />

  const startSession = async () => {
    if (!!session && profile?.canLeadSessions) {
      await fetch('/api/whereby', {
        method: 'POST',
        body: JSON.stringify({
          roomSlug: room.slug,
          token: session.access_token,
        }),
      })
    }
  }

  if (
    room.wherebyMeetingId &&
    room.wherebyHostRoomUrl &&
    room.wherebyRoomUrl &&
    room.wherebyStartDate &&
    room.wherebyEndDate &&
    isWithinInterval(addSeconds(new Date(), 30), {
      start: new Date(room.wherebyStartDate),
      end: new Date(room.wherebyEndDate),
    })
  ) {
    return (
      <iframe
        key={room.wherebyMeetingId}
        src={qs.stringifyUrl({
          url: profile?.canLeadSessions
            ? room.wherebyHostRoomUrl
            : room.wherebyRoomUrl,
          query: {
            logo: Options.FALSE,
            precallReview: Options.TRUE,
            personality: Options.TRUE,
            background: Options.FALSE,
            screenshare: Options.TRUE,
            chat: Options.TRUE,
            people: Options.TRUE,
            leaveButton: Options.FALSE,
            pipButton: Options.FALSE,
            breakout: Options.TRUE,
            timer: Options.TRUE,
          },
        })}
        allow='camera; microphone; fullscreen; speaker; display-capture'
        className='w-full h-full absolute top-0 left-0'
      ></iframe>
    )
  } else {
    return (
      <div className='flex flex-col justify-center items-center w-full h-full'>
        {profile?.canLeadSessions ? (
          <button
            data-attr='video-start'
            className='button'
            onClick={startSession}
          >
            Start session
          </button>
        ) : (
          <div className='max-w-xs text-center'>
            Waiting for the session to be started by an ADHD Together leader.
          </div>
        )}
      </div>
    )
  }
}
