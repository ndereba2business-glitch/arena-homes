import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { rooms, type Room } from '@/data/rooms'
import SectionHeading from '@/components/ui/SectionHeading'
import RoomGrid from '@/components/rooms/RoomGrid'

const filters: { id: string; label: string; test: (r: Room) => boolean }[] = [
  { id: 'all', label: 'All spaces', test: () => true },
  { id: 'students', label: 'For students', test: (r) => ['single', 'shared', 'bedsitter'].includes(r.type) },
  { id: 'apartments', label: 'Apartments', test: (r) => ['studio', 'one-bedroom', 'two-bedroom'].includes(r.type) },
  { id: 'short', label: 'Short stays', test: (r) => Boolean(r.pricing.nightly) },
]

export default function RoomExplorer() {
  const [active, setActive] = useState('all')
  const filter = filters.find((f) => f.id === active)!
  const list = rooms.filter(filter.test)

  return (
    <section id="rooms" aria-labelledby="rooms-title" className="bg-paper py-24 md:py-36">
      <div className="shell">
        <SectionHeading
          id="rooms-title"
          eyebrow="Rooms & units"
          title={
            <>
              Find your <em className="italic">space.</em>
            </>
          }
          aside={
            <Link to="/rooms" className="group inline-flex items-center gap-2 text-sm font-semibold">
              <span className="link-line-static">Compare all rooms</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        >
          Six ways to live at Arena Homes — from a bed in a shared room to a two-bedroom apartment. Every one furnished, secure and
          connected.
        </SectionHeading>

        <div role="group" aria-label="Filter rooms" className="no-scrollbar -mx-4 mt-12 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 md:mt-16">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={active === f.id}
              onClick={() => setActive(f.id)}
              className={`h-10 shrink-0 rounded-full border px-4 text-[0.8125rem] font-medium transition-colors duration-300 ${
                active === f.id ? 'border-ink bg-ink text-paper' : 'border-rule text-ink hover:border-ink/40'
              }`}
            >
              {f.label}
              <span className={`tabular ml-2 text-xs ${active === f.id ? 'text-paper/60' : 'text-taupe'}`}>
                {rooms.filter(f.test).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 md:mt-10" key={active}>
        <RoomGrid rooms={list} stay={active === 'short' ? 'short' : 'long'} query={active === 'short' ? 'stay=short' : ''} />
      </div>
    </section>
  )
}
