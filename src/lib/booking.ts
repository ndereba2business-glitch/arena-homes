import { getRoom, type AvailabilityStatus } from '@/data/rooms'

/**
 * BOOKING SERVICE
 * ------------------------------------------------------------------
 * The UI only talks to the two functions below. For the concept they run
 * in "demo" mode: availability is read from src/data/rooms.ts and requests
 * resolve with a reference number.
 *
 * To connect a real backend (property-management system, CRM, email, or a
 * serverless function), set VITE_BOOKING_API in .env — e.g.
 *   VITE_BOOKING_API=https://api.example.com/bookings
 * and the functions will call:
 *   GET  {VITE_BOOKING_API}/availability?room=<slug>&from=<date>  → AvailabilityResult
 *   POST {VITE_BOOKING_API}/requests   (JSON BookingRequest)       → BookingResponse
 * Nothing else in the app needs to change.
 */

export type StayMode = 'long' | 'short'

export interface BookingRequest {
  kind: 'reservation' | 'viewing'
  roomSlug?: string
  stay: StayMode
  /** Move-in date (long stay) or check-in date (short stay), YYYY-MM-DD. */
  moveIn: string
  /** Long stays only. */
  months?: number
  /** Short stays only, YYYY-MM-DD. */
  checkOut?: string
  guests: number
  /** Viewings only, e.g. 'Morning (9–12)'. */
  viewingSlot?: string
  name: string
  /** Normalised to +254… */
  phone: string
  email?: string
  notes?: string
}

export interface BookingResponse {
  reference: string
  status: 'received' | 'waitlisted'
}

export interface AvailabilityResult {
  status: AvailabilityStatus
  unitsLeft?: number
  message: string
}

const API = import.meta.env.VITE_BOOKING_API as string | undefined

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function checkAvailability(roomSlug: string, from: string): Promise<AvailabilityResult> {
  if (API) {
    const res = await fetch(`${API}/availability?room=${encodeURIComponent(roomSlug)}&from=${from}`)
    if (!res.ok) throw new Error('Availability check failed')
    return res.json()
  }
  await wait(650)
  const room = getRoom(roomSlug)
  const a = room?.availability ?? { status: 'waitlist' as const }
  const message =
    a.status === 'waitlist'
      ? 'Fully let for these dates. Leave your details and we’ll offer you the next vacancy.'
      : a.status === 'limited'
        ? `Good news — ${a.unitsLeft ?? 'a few'} ${a.unitsLeft === 1 ? 'unit is' : 'units are'} still available. Add your details to reserve.`
        : 'Good news — this space is available. Add your details to reserve.'
  return { status: a.status, unitsLeft: a.unitsLeft, message }
}

export async function submitBooking(req: BookingRequest): Promise<BookingResponse> {
  if (API) {
    const res = await fetch(`${API}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    })
    if (!res.ok) throw new Error('Request failed')
    return res.json()
  }
  await wait(900)
  const room = req.roomSlug ? getRoom(req.roomSlug) : undefined
  const reference = `AH-${Date.now().toString(36).slice(-5).toUpperCase()}`
  return { reference, status: room?.availability.status === 'waitlist' ? 'waitlisted' : 'received' }
}

/**
 * Accepts the ways Kenyans write mobile numbers — 0712 345 678, 712345678,
 * +254 712 345 678, 254712345678 (and 01… numbers) — and returns +2547XXXXXXXX,
 * or null if it isn't a valid Kenyan mobile number.
 */
export function normalizeKenyanPhone(input: string) {
  const digits = input.replace(/[^\d]/g, '')
  const local = digits.startsWith('254') ? digits.slice(3) : digits.startsWith('0') ? digits.slice(1) : digits
  return /^[17]\d{8}$/.test(local) ? `+254${local}` : null
}

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
