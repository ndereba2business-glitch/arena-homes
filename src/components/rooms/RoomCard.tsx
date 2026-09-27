import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { availabilityLabel, type Room } from '@/data/rooms'
import { formatKsh } from '@/lib/format'
import Img from '@/components/ui/Img'

const dot = { available: 'bg-[#3f8f5a]', limited: 'bg-clay', waitlist: 'bg-taupe' } as const

/**
 * Room card. The whole card is one link (to the detail page, carrying any
 * search state along). `stay="short"` leads with the nightly rate.
 */
export default function RoomCard({
  room,
  query = '',
  stay = 'long',
  sizes = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 82vw',
  index,
}: {
  room: Room
  query?: string
  stay?: 'long' | 'short'
  sizes?: string
  index?: number
}) {
  const nightly = stay === 'short' && room.pricing.nightly
  return (
    <Link
      to={`/rooms/${room.slug}${query ? `?${query}` : ''}`}
      className="group block focus-visible:outline-offset-4"
      aria-label={`${room.name} — from ${formatKsh(nightly ? room.pricing.nightly! : room.pricing.monthly)} per ${nightly ? 'night' : room.pricing.per === 'bed' ? 'bed per month' : 'month'}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone">
        <Img
          src={room.images[0].src}
          alt={room.images[0].alt}
          fill
          sizes={sizes}
          className="transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0 opacity-60 transition-opacity duration-700 group-hover:opacity-100" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-2 bg-paper/92 px-2.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur">
          <span className={`h-1.5 w-1.5 rounded-full ${dot[room.availability.status]}`} aria-hidden="true" />
          {availabilityLabel(room)}
        </span>
        {index !== undefined && (
          <span className="tabular absolute right-4 top-3.5 text-xs font-medium text-paper/80">{String(index + 1).padStart(2, '0')}</span>
        )}

        {/* hover reveal: key features */}
        <ul className="absolute inset-x-4 bottom-4 flex flex-wrap gap-1.5">
          {room.highlights.map((h, i) => (
            <li
              key={h}
              className="translate-y-2 border border-paper/30 px-2.5 py-1 text-[0.6875rem] font-medium text-paper opacity-100 backdrop-blur-sm transition-[opacity,transform] duration-500 ease-[var(--ease-expo)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100"
              style={{ transitionDelay: `${i * 45}ms` }}
            >
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-[2rem] leading-none tracking-[-0.01em]">{room.name}</h3>
          <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-xs text-taupe">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {room.occupancy === 1 ? '1 person' : `Up to ${room.occupancy}`}
          </span>
        </div>
        <p className="mt-2 text-sm text-taupe">{room.kicker}</p>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-rule pt-4">
          <p className="leading-tight">
            <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-taupe">From</span>
            <span className="tabular text-lg font-semibold">
              {formatKsh(nightly ? room.pricing.nightly! : room.pricing.monthly)}
            </span>
            <span className="text-sm text-taupe">
              {' '}
              / {nightly ? 'night' : room.pricing.per === 'bed' ? 'bed · month' : 'month'}
            </span>
          </p>
          <span className="flex items-center gap-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em]">
            View room
            <span className="relative block h-px w-6 bg-ink transition-[width] duration-500 ease-[var(--ease-expo)] group-hover:w-10" aria-hidden="true">
              <span className="absolute -right-px -top-[3px] h-[7px] w-[7px] rotate-45 border-r border-t border-ink" />
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}
