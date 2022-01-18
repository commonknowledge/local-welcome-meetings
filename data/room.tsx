import { SupabaseRealtimePayload } from '@supabase/supabase-js'
import qs from 'query-string'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Room } from '../types/app'
import { usePrevious } from '../utils/hooks'
import { NO_OP } from '../utils/utils'
import { Page } from './slideshow'
import { supabase } from './supabase'

export async function getAllRooms(): Promise<Room[]> {
  const rooms = await supabase.from<Room>('room').select('*')

  return rooms.body || []
}

export async function getRoomBySlug(slug: string) {
  const rooms = await supabase.from<Room>('room').select('*').eq('slug', slug)

  return rooms.body?.[0] || null
}

export const createRoom = async (sp: Omit<Room, 'id' | 'updatedAt'>) => {
  return await supabase.from<Room>('room').insert(sp)
}

/**
 * Trigger the subscription.
 * The returned function can be called to unsubscribe.
 */
export function subscribeToRoomBySlug(
  slug: string,
  callback: (payload: SupabaseRealtimePayload<Room>) => void,
) {
  const subscription = supabase
    .from<Room>(`room:slug=eq.${slug}`)
    .on('*', callback)
    .subscribe()

  return () => supabase.removeSubscription(subscription)
}

export function subscribeToRooms(
  callback: (payload: SupabaseRealtimePayload<Room>) => void,
) {
  const subscription = supabase.from<Room>(`room`).on('*', callback).subscribe()

  return () => supabase.removeSubscription(subscription)
}

export const useRooms = (defaultValue: Room[] = []) => {
  const [rooms, setRooms] = useState<Room[]>(defaultValue)
  useEffect(() => {
    async function getRooms() {
      setRooms(await getAllRooms())
    }
    if (!defaultValue) getRooms()
    const unsubscribe = subscribeToRooms(async function onChange() {
      setRooms(await getAllRooms())
    })
    return () => void unsubscribe()
  }, [defaultValue])
  return rooms
}

export function updateRoom(roomSlug: string, room: Partial<Room>) {
  return supabase.from<Room>('room').update(room).eq('slug', roomSlug)
}

export async function deleteRoom(id: string) {
  return supabase.from<Room>('room').delete().match({ id })
}

export interface IRoomContext {
  room: Room | null
  slides: Page[]
  updateRoom: (room: Partial<Room>) => void
}

export const RoomContext = createContext<IRoomContext>({
  room: null,
  slides: [],
  updateRoom: NO_OP,
})

export function RoomContextProvider({
  slug,
  initialData,
  children,
}: {
  slug: string
  initialData?: { room?: Room; slides?: Page[] }
  children: any
}) {
  const [room, setRoom] = useState<Room | null>(initialData?.room || null)
  const [slides, setSlides] = useState<Page[]>(initialData?.slides || [])

  useEffect(
    function listenForRoomChanges() {
      const unsubscribe = subscribeToRoomBySlug(
        slug,
        function onChange(payload) {
          if (payload.eventType !== 'UPDATE') return
          setRoom(payload.new)
        },
      )
      return () => void unsubscribe()
    },
    [slug],
  )

  const _updateRoom = useCallback(
    async (newRoom: Partial<Room>) => {
      const res = await updateRoom(slug, newRoom)
      if (res.body?.[0]) {
        setRoom(res.body[0])
      }
    },
    [slug],
  )

  const loadSlides = useCallback(
    async (slideshowName: string) => {
      const res = await fetch(
        qs.stringifyUrl({ url: '/api/slides', query: { slideshowName } }),
      )
      const { slides: newSlides } = await res.json()
      if (!newSlides) return
      setSlides(newSlides)
      _updateRoom({ currentSlideIndex: 0 })
    },
    [_updateRoom],
  )

  const prevSlideshowName = usePrevious(room?.slideshowName)

  useEffect(
    function listenForSlideshowChanges() {
      if (!!room?.slideshowName && room?.slideshowName !== prevSlideshowName) {
        loadSlides(room?.slideshowName)
      }
    },
    [room, prevSlideshowName, loadSlides],
  )

  return (
    <RoomContext.Provider
      value={{
        room,
        slides,
        updateRoom: _updateRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  return useContext(RoomContext)
}
