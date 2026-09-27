import { locations } from '@/config/site'
import type { RoomType } from '@/data/rooms'
import { addDays, todayISO } from './format'
import type { StayMode } from './booking'

/**
 * Search / booking state that travels in the URL, so a search from the hero
 * bar pre-fills the rooms page and then each room's reservation panel:
 *   /rooms?stay=long&in=2026-10-01&months=6&guests=1&type=studio
 */
export interface SearchState {
  location: string
  stay: StayMode
  /** move-in / check-in */
  checkIn: string
  /** short stays */
  checkOut: string
  /** long stays */
  months: number
  guests: number
  type: RoomType | ''
}

export const stayLengths = [3, 4, 6, 9, 12] as const

export const defaultSearch = (): SearchState => ({
  location: locations[0].id,
  stay: 'long',
  checkIn: '',
  checkOut: '',
  months: 4,
  guests: 1,
  type: '',
})

export function readSearch(params: URLSearchParams): SearchState {
  const d = defaultSearch()
  const guests = Number(params.get('guests'))
  const months = Number(params.get('months'))
  return {
    location: params.get('location') ?? d.location,
    stay: params.get('stay') === 'short' ? 'short' : 'long',
    checkIn: params.get('in') ?? '',
    checkOut: params.get('out') ?? '',
    months: months > 0 ? months : d.months,
    guests: guests > 0 ? Math.min(guests, 6) : d.guests,
    type: (params.get('type') as RoomType) ?? '',
  }
}

/** Serialises only what differs from the defaults, keeping shared links short. */
export function writeSearch(s: Partial<SearchState>) {
  const d = defaultSearch()
  const p = new URLSearchParams()
  if (s.type) p.set('type', s.type)
  if (s.stay === 'short') p.set('stay', 'short')
  if (s.checkIn) p.set('in', s.checkIn)
  if (s.stay === 'short' && s.checkOut) p.set('out', s.checkOut)
  if (s.stay !== 'short' && s.months && s.months !== d.months) p.set('months', String(s.months))
  if (s.guests && s.guests > 1) p.set('guests', String(s.guests))
  if (s.location && s.location !== d.location) p.set('location', s.location)
  return p.toString()
}

/** Sensible default dates: move-in on the 1st of next month; short stays from tomorrow. */
export const suggestedMoveIn = () => {
  const d = new Date()
  return `${d.getMonth() === 11 ? d.getFullYear() + 1 : d.getFullYear()}-${String(((d.getMonth() + 1) % 12) + 1).padStart(2, '0')}-01`
}
export const suggestedCheckIn = () => addDays(todayISO(), 1)
