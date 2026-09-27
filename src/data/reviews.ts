/**
 * RESIDENT REVIEWS
 * ------------------------------------------------------------------
 * SAMPLE reviews that show the layout. `isSample: true` labels them in the UI.
 * TODO(client): replace with genuine reviews (with residents' permission) and
 * set isSample to false — or load from Google reviews.
 */

export interface Review {
  id: string
  name: string
  roomSlug: string
  detail: string
  quote: string
  isSample: boolean
}

export const featuredQuote = 'Finally, a place that actually feels like home.'

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Wanjiru M.',
    roomSlug: 'single-room',
    detail: 'Second-year student',
    quote: 'I moved from a hostel where the Wi-Fi died every evening. Here I can actually finish assignments in my room, and the desk is big enough for my notes and laptop.',
    isSample: true,
  },
  {
    id: 'r2',
    name: 'Brian O.',
    roomSlug: 'studio',
    detail: 'Young professional',
    quote: 'Viewing on Saturday, moved in on Monday. The studio came with everything — I bought a kettle and that was it.',
    isSample: true,
  },
  {
    id: 'r3',
    name: 'Achieng’ A.',
    roomSlug: 'shared-room',
    detail: 'First-year student',
    quote: 'My parents were worried about security. After they saw the gate and met the caretaker, they stopped calling every night.',
    isSample: true,
  },
  {
    id: 'r4',
    name: 'Kevin K.',
    roomSlug: 'bedsitter',
    detail: 'Final-year student',
    quote: 'Water every day, power in the corridors during outages, and repairs sorted the same week. Small things, but they matter.',
    isSample: true,
  },
  {
    id: 'r5',
    name: 'Faith C.',
    roomSlug: 'one-bedroom',
    detail: 'Stayed three months for work',
    quote: 'Quiet, clean and close to town. I booked a one-bedroom for a contract and extended twice.',
    isSample: true,
  },
]
