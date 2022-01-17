import { useUser } from '../data/auth'
import { Room } from '../types/app'
import { RoomRow } from './RoomRow'

export default function RoomList({ rooms }: { rooms: Room[] }) {
  const { profile } = useUser()

  return (
    <section className='space-y-4 divide-y divide-gray-200'>
      {rooms.map((room) => (
        <RoomRow key={room.id} room={room} profile={profile} />
      ))}
    </section>
  )
}
