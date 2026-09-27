import type { Photo } from './images'

/** Editorial copy for the homepage. Kept here so a new client means new data, not new components. */

export const intro = {
  eyebrow: 'The property',
  title: 'Not just somewhere to sleep.',
  body: [
    'Arena Homes is purpose-built accommodation in Nakuru for students and young professionals who want more from where they live — rooms that are actually comfortable, a building that is properly secure, and a location that keeps campus, town and everything in between close.',
    'Every space arrives furnished and connected. You bring your things; we take care of the Wi-Fi, the water, the security and the maintenance.',
  ],
  photo: { src: 'intro-corner', alt: 'Warm, sunlit corner of a furnished room with a plant, table and chairs' } as Photo,
  facts: [
    { value: '24/7', label: 'Security', detail: 'Manned gate and CCTV, every hour of the year.' },
    { value: 'Fibre', label: 'Reliable Wi-Fi', detail: 'In every room, included in the rent.' },
    { value: 'Ready', label: 'Furnished rooms', detail: 'Bed, desk, storage — move in with a suitcase.' },
    { value: 'Central', label: 'Prime location', detail: 'Minutes from campus, the CBD and the malls.' },
  ],
}

export const experience: {
  title: string
  body: string
  photo: Photo
}[] = [
  {
    title: 'Wake up comfortable.',
    body: 'Proper mattresses, blackout curtains and morning light on your own schedule. The kind of sleep that makes an 8 a.m. survivable.',
    photo: { src: 'exp-morning', alt: 'Morning sun falling across a bed through a tall window with curtains' },
  },
  {
    title: 'Study without distractions.',
    body: 'A real desk in every room, quiet hours that are actually enforced, and Wi-Fi that doesn’t drop when everyone gets home.',
    photo: { src: 'exp-study', alt: 'Evening study corner with a desk lamp, shelves and plants' },
  },
  {
    title: 'Come home feeling secure.',
    body: 'A lit path from the gate to your door, a guard who knows your face, and a building that only residents can walk into.',
    photo: { src: 'exp-entrance', alt: 'Softly lit entrance path with a wall lantern and plants at night' },
  },
  {
    title: 'Stay connected to the city.',
    body: 'Campus, the CBD, the matatu stage and your favourite nyama choma spot are all a short ride away — and the lake is there for weekends.',
    photo: { src: 'exp-town', alt: 'A matatu driving along a tree-lined road through Nakuru town' },
  },
]

/** House rules shown on every room page. TODO(client): confirm. */
export const houseRules = [
  'Quiet hours from 10 p.m. to 6 a.m.',
  'Visitors sign in at the gate and leave by 9 p.m.',
  'No smoking anywhere inside the building',
  'No pets, except assistance animals',
  'Leave shared kitchens and lounges as you’d want to find them',
  'Rent is due by the 5th of each month',
]

export const bookingCta = {
  title: 'Your next home is closer than you think.',
  body: 'Check availability, choose your space and take the first step toward moving in.',
  photo: { src: 'cta-evening', alt: 'Furnished apartment living room at dusk, lit by warm lamps' } as Photo,
}
