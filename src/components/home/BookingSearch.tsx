import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import { locations } from '@/config/site'
import { roomTypeLabels, rooms, type RoomType } from '@/data/rooms'
import { addDays, todayISO } from '@/lib/format'
import { defaultSearch, stayLengths, writeSearch, type SearchState } from '@/lib/search'

const shortStayTypes = new Set(rooms.filter((r) => r.pricing.nightly).map((r) => r.type))

/**
 * Search bar: where, when, how long, how many, what kind of space.
 * Submits to /rooms with the state in the URL.
 * `variant="hero"` overlaps the hero; `variant="inline"` sits in a page header.
 */
export default function BookingSearch({
  initial,
  variant = 'hero',
}: {
  initial?: Partial<SearchState>
  variant?: 'hero' | 'inline'
}) {
  const navigate = useNavigate()
  const uid = useId()
  const [s, setS] = useState<SearchState>({ ...defaultSearch(), ...initial })
  const set = (patch: Partial<SearchState>) => setS((prev) => ({ ...prev, ...patch }))
  const today = todayISO()

  const setStay = (stay: SearchState['stay']) => {
    const patch: Partial<SearchState> = { stay }
    if (stay === 'short' && s.type && !shortStayTypes.has(s.type)) patch.type = ''
    set(patch)
  }

  const setCheckIn = (checkIn: string) => {
    const patch: Partial<SearchState> = { checkIn }
    if (s.checkOut && checkIn && s.checkOut <= checkIn) patch.checkOut = addDays(checkIn, 2)
    set(patch)
  }

  const typeOptions = (Object.keys(roomTypeLabels) as RoomType[]).filter((t) => s.stay === 'long' || shortStayTypes.has(t))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/rooms?${writeSearch(s)}`)
  }

  const cell = 'relative flex min-h-[4.25rem] flex-col justify-center px-4 py-2.5 lg:px-5'
  const control =
    'w-full appearance-none bg-transparent pt-1 text-[0.9375rem] font-medium text-ink outline-none placeholder:text-taupe/70'
  const hero = variant === 'hero'

  return (
    <form
      onSubmit={onSubmit}
      aria-label="Search rooms"
      className={`relative bg-paper text-ink ${hero ? 'shadow-[0_40px_80px_-40px_rgba(19,17,14,.45)]' : 'border border-rule'}`}
    >
      {/* stay type */}
      <div className="flex items-center justify-between gap-4 border-b border-rule px-4 lg:px-5">
        <div role="radiogroup" aria-label="Length of stay" className="flex">
          {(
            [
              ['long', 'Monthly'],
              ['short', 'Short stay'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={s.stay === value}
              onClick={() => setStay(value)}
              className={`relative mr-6 h-12 text-[0.75rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                s.stay === value ? 'text-ink' : 'text-taupe hover:text-ink'
              }`}
            >
              {label}
              <span
                className={`absolute inset-x-0 -bottom-px h-0.5 bg-clay transition-transform duration-500 ease-[var(--ease-expo)] ${
                  s.stay === value ? 'scale-x-100' : 'scale-x-0'
                }`}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>
        <p className="hidden text-xs text-taupe sm:block">
          {s.stay === 'long' ? 'Semesters, academic years & long lets' : 'Nightly stays in studios & apartments'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_0.9fr_1.1fr_auto]">
        <label className={`${cell} col-span-2 border-b border-rule lg:col-span-1 lg:border-b-0 lg:border-r`}>
          <span className="field-label">Location</span>
          <select value={s.location} onChange={(e) => set({ location: e.target.value })} className={`${control} select-chevron -mr-4 lg:-mr-5`}>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <label className={`${cell} border-b border-r border-rule lg:border-b-0`}>
          <span className="field-label">{s.stay === 'long' ? 'Move-in' : 'Check-in'}</span>
          <input type="date" min={today} value={s.checkIn} onChange={(e) => setCheckIn(e.target.value)} className={control} />
        </label>

        {s.stay === 'long' ? (
          <label className={`${cell} border-b border-rule lg:border-b-0 lg:border-r`}>
            <span className="field-label">Stay</span>
            <select value={s.months} onChange={(e) => set({ months: Number(e.target.value) })} className={`${control} select-chevron -mr-4 lg:-mr-5`}>
              {stayLengths.map((m) => (
                <option key={m} value={m}>
                  {m === 4 ? '4 mo · semester' : m === 9 ? '9 mo · full year' : `${m} months`}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label className={`${cell} border-b border-rule lg:border-b-0 lg:border-r`}>
            <span className="field-label">Check-out</span>
            <input
              type="date"
              min={s.checkIn ? addDays(s.checkIn, 1) : addDays(today, 1)}
              value={s.checkOut}
              onChange={(e) => set({ checkOut: e.target.value })}
              className={control}
            />
          </label>
        )}

        <div className={`${cell} border-r border-rule`}>
          <span className="field-label" id={`${uid}-guests`}>
            Guests
          </span>
          <div className="flex items-center justify-between pt-0.5" role="group" aria-labelledby={`${uid}-guests`}>
            <button
              type="button"
              onClick={() => set({ guests: Math.max(1, s.guests - 1) })}
              disabled={s.guests <= 1}
              aria-label="Fewer guests"
              className="-ml-2 grid h-9 w-9 place-items-center rounded-full text-taupe transition-colors hover:text-ink disabled:opacity-30"
            >
              <Minus className="h-4 w-4" />
            </button>
            <output className="tabular text-[0.9375rem] font-medium" aria-live="polite">
              {s.guests}
            </output>
            <button
              type="button"
              onClick={() => set({ guests: Math.min(6, s.guests + 1) })}
              disabled={s.guests >= 6}
              aria-label="More guests"
              className="-mr-2 grid h-9 w-9 place-items-center rounded-full text-taupe transition-colors hover:text-ink disabled:opacity-30"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <label className={cell}>
          <span className="field-label">Room type</span>
          <select value={s.type} onChange={(e) => set({ type: e.target.value as RoomType | '' })} className={`${control} select-chevron -mr-4 lg:-mr-5`}>
            <option value="">Any type</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {roomTypeLabels[t]}
              </option>
            ))}
          </select>
        </label>

        <div className="col-span-2 border-t border-rule p-2 lg:col-span-1 lg:border-t-0">
          <button type="submit" className="btn btn-ink h-full min-h-14! w-full lg:px-8!">
            Find your space <ArrowRight className="btn-arrow h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  )
}
