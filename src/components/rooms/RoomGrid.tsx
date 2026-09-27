import type { Room } from '@/data/rooms'
import { delay } from '@/components/ui/Motion'
import RoomCard from './RoomCard'

/**
 * Rooms laid out as a swipeable rail on phones (like a booking app) and a
 * grid from tablet up. `layout="grid"` keeps the grid at every size.
 */
export default function RoomGrid({
  rooms,
  query,
  stay,
  layout = 'rail',
}: {
  rooms: Room[]
  query?: string
  stay?: 'long' | 'short'
  layout?: 'rail' | 'grid'
}) {
  const rail = layout === 'rail'
  return (
    <ul
      className={
        rail
          ? 'rail no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 sm:overflow-visible sm:px-8 lg:grid-cols-3 lg:gap-x-8 lg:px-8 xl:px-14 min-[94rem]:mx-auto min-[94rem]:max-w-[94rem]'
          : 'grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8'
      }
    >
      {rooms.map((room, i) => (
        <li
          key={room.slug}
          data-reveal
          style={delay((i % 3) * 110)}
          className={rail ? 'w-[82vw] max-w-[24rem] shrink-0 snap-start sm:w-auto sm:max-w-none' : ''}
        >
          <RoomCard room={room} query={query} stay={stay} index={i} />
        </li>
      ))}
    </ul>
  )
}
