import type { Photo } from './images'

/**
 * ROOMS & UNITS
 * ------------------------------------------------------------------
 * One entry per unit type. Prices are SAMPLE figures for the concept —
 * TODO(client): replace pricing, sizes and availability with real data
 * (or load them from the booking backend — see src/lib/booking.ts).
 */

export type RoomType = 'single' | 'shared' | 'bedsitter' | 'studio' | 'one-bedroom' | 'two-bedroom'

export type AvailabilityStatus = 'available' | 'limited' | 'waitlist'

export interface Room {
  slug: string
  type: RoomType
  name: string
  /** One-line positioning shown under the name. */
  kicker: string
  summary: string
  description: string[]
  pricing: {
    /** KSh per month */
    monthly: number
    /** 'bed' for shared rooms, where rent is per occupant. */
    per: 'room' | 'bed'
    /** KSh per night, when the unit is offered for short stays. */
    nightly?: number
  }
  sizeSqm: number
  occupancy: number
  bed: string
  bathroom: string
  /** Four short features shown on cards. */
  highlights: string[]
  inRoom: string[]
  furnishing: string[]
  availability: {
    status: AvailabilityStatus
    unitsLeft?: number
    note?: string
  }
  bestFor: string
  images: Photo[]
}

export const rooms: Room[] = [
  {
    slug: 'single-room',
    type: 'single',
    name: 'Single Room',
    kicker: 'Your own room, your own routine.',
    summary: 'A private, furnished room with an ensuite shower and a proper desk — built for students who want quiet and privacy.',
    description: [
      'Everything a semester needs, nothing it doesn’t. The single room gives you a door that locks, a bed that isn’t a bunk, and a desk wide enough for a laptop, notes and a cup of tea at the same time.',
      'Large windows keep it bright through the day, blackout curtains keep it dark when you need to sleep in, and the ensuite means no queue for the shower before an 8 a.m.',
    ],
    pricing: { monthly: 15500, per: 'room' },
    sizeSqm: 11,
    occupancy: 1,
    bed: '4 × 6 bed with orthopaedic mattress',
    bathroom: 'Private ensuite shower',
    highlights: ['Private room', 'Fully furnished', 'Fibre Wi-Fi', 'Study desk'],
    inRoom: ['Ensuite shower & WC', 'Study desk & ergonomic chair', 'Built-in wardrobe', 'Blackout curtains', 'Reading lamp', 'Multiple power sockets + USB'],
    furnishing: ['Bed & mattress', 'Desk & chair', 'Wardrobe', 'Curtains', 'Bedside shelf'],
    availability: { status: 'available', unitsLeft: 6 },
    bestFor: 'Students',
    images: [
      { src: 'single-1', alt: 'Bright single room with a made bed, rug and a desk by the window' },
      { src: 'single-2', alt: 'Single room with a study desk, lamp and wall shelf beside the bed' },
      { src: 'single-3', alt: 'Close-up of a wooden study desk and cushioned chair' },
    ],
  },
  {
    slug: 'shared-room',
    type: 'shared',
    name: 'Shared Room',
    kicker: 'Two beds, one room, half the rent.',
    summary: 'A spacious twin room shared by two residents, each with their own bed, desk and lockable wardrobe.',
    description: [
      'The most affordable way to live at Arena Homes without giving up comfort. Each resident gets their own side of the room — bed, desk, storage and reading light — so sharing never means squeezing.',
      'Rooms are matched by gender and, where possible, by course and year. Come with a friend and we’ll put you together.',
    ],
    pricing: { monthly: 9500, per: 'bed' },
    sizeSqm: 16,
    occupancy: 2,
    bed: 'Two 3.5 × 6 beds',
    bathroom: 'Ensuite, shared by the two residents',
    highlights: ['Twin room', 'Rent per bed', 'Fibre Wi-Fi', 'Own desk each'],
    inRoom: ['Two beds with mattresses', 'Two desks & chairs', 'Two lockable wardrobes', 'Ensuite shower & WC', 'Individual reading lights'],
    furnishing: ['Beds & mattresses', 'Desks & chairs', 'Lockable wardrobes', 'Curtains'],
    availability: { status: 'limited', unitsLeft: 4, note: '4 beds left for the next intake' },
    bestFor: 'Students on a budget',
    images: [
      { src: 'shared-1', alt: 'Twin room with two single beds either side of a window and a desk between them' },
      { src: 'shared-2', alt: 'Shared room with two made beds, bedside lamps and a sliding door onto a balcony' },
      { src: 'shared-3', alt: 'Twin room with two made beds and a large window onto the garden' },
    ],
  },
  {
    slug: 'bedsitter',
    type: 'bedsitter',
    name: 'Bedsitter',
    kicker: 'Self-contained, without the big-apartment rent.',
    summary: 'A self-contained room with its own kitchenette and bathroom — your own front door, your own cooking.',
    description: [
      'The classic Kenyan bedsitter, done properly. Sleep, study and cook in one well-planned room, with a separate bathroom and a kitchenette that has room to actually prepare a meal.',
      'Popular with final-year students and young professionals who want independence without paying for space they won’t use.',
    ],
    pricing: { monthly: 17500, per: 'room' },
    sizeSqm: 18,
    occupancy: 1,
    bed: '4 × 6 bed with orthopaedic mattress',
    bathroom: 'Private bathroom',
    highlights: ['Self-contained', 'Kitchenette', 'Private bathroom', 'Fibre Wi-Fi'],
    inRoom: ['Kitchenette with two-plate cooker', 'Fridge', 'Sink & storage', 'Private shower & WC', 'Study desk', 'Wardrobe'],
    furnishing: ['Bed & mattress', 'Desk & chair', 'Wardrobe', 'Fridge', 'Cooker', 'Curtains'],
    availability: { status: 'available', unitsLeft: 3 },
    bestFor: 'Final-year students & young professionals',
    images: [
      { src: 'bedsitter-1', alt: 'Bedsitter with a double bed, framed prints and a desk behind a glass partition' },
      { src: 'bedsitter-2', alt: 'Compact kitchenette with a hexagon-tile splashback, two-plate cooker, microwave and fridge' },
      { src: 'bedsitter-3', alt: 'Private bathroom with a glass shower enclosure, grey tiles and a dark vanity' },
    ],
  },
  {
    slug: 'studio',
    type: 'studio',
    name: 'Studio',
    kicker: 'A full apartment, cleverly compact.',
    summary: 'An open-plan studio with a proper kitchen, dining table and queen bed — available monthly or by the night.',
    description: [
      'Our most-requested unit. Light floods in from both ends, a slatted screen separates the sleeping area from the kitchen, and there’s a dining table for two that doubles as a workspace.',
      'Book it monthly for a long stay, or by the night when you’re in Nakuru for work, graduation or a visit.',
    ],
    pricing: { monthly: 24000, per: 'room', nightly: 4500 },
    sizeSqm: 26,
    occupancy: 2,
    bed: '5 × 6 queen bed',
    bathroom: 'Private bathroom',
    highlights: ['Open-plan', 'Full kitchen', 'Queen bed', 'Short stays'],
    inRoom: ['Kitchen with oven & hob', 'Fridge', 'Dining table for two', 'Private shower & WC', 'Smart TV', 'Wardrobe & entry storage'],
    furnishing: ['Queen bed & mattress', 'Dining table & chairs', 'Kitchenware', 'Bedding & towels (short stays)', 'Curtains'],
    availability: { status: 'limited', unitsLeft: 2 },
    bestFor: 'Young professionals & short stays',
    images: [
      { src: 'studio-1', alt: 'Open-plan studio with a queen bed, dining table and kitchen with green tiles' },
      { src: 'studio-2', alt: 'Studio bed seen past a glass dining table and slatted room divider' },
      { src: 'studio-3', alt: 'Studio kitchen with white cabinets, green tile splashback and built-in oven' },
      { src: 'studio-4', alt: 'Studio entrance with a smart lock looking through to the kitchen' },
      { src: 'studio-5', alt: 'Long view through the studio from the living area to the kitchen and front door' },
    ],
  },
  {
    slug: 'one-bedroom',
    type: 'one-bedroom',
    name: 'One Bedroom',
    kicker: 'Room to live, not just to sleep.',
    summary: 'A separate bedroom, a proper living room and a full kitchen — a furnished apartment ready from day one.',
    description: [
      'For when you’ve outgrown a single room. The one-bedroom separates living from sleeping, with a lounge big enough to host friends and a kitchen you’ll actually want to cook in.',
      'Fully furnished down to the kitchenware, so moving in is a suitcase and an afternoon. Available monthly or for short stays.',
    ],
    pricing: { monthly: 34000, per: 'room', nightly: 6500 },
    sizeSqm: 42,
    occupancy: 2,
    bed: '5 × 6 queen bed',
    bathroom: 'Private bathroom',
    highlights: ['Separate lounge', 'Full kitchen', 'Balcony', 'Short stays'],
    inRoom: ['Separate bedroom', 'Lounge with sofa & smart TV', 'Full kitchen with oven', 'Fridge', 'Balcony', 'Private bathroom'],
    furnishing: ['Queen bed & mattress', 'Sofa & coffee table', 'Dining set', 'Kitchenware', 'Wardrobe', 'Curtains'],
    availability: { status: 'available', unitsLeft: 3 },
    bestFor: 'Couples & professionals',
    images: [
      { src: 'onebed-1', alt: 'Living room with an olive-green sofa, round coffee table and floor lamp' },
      { src: 'onebed-2', alt: 'Bright bedroom with a double bed, bench and tall windows' },
      { src: 'onebed-3', alt: 'Kitchen with white tiles, pans on a rail and a window over the sink' },
      { src: 'onebed-4', alt: 'Dark-tiled bathroom with a floating vanity and a round mirror' },
    ],
  },
  {
    slug: 'two-bedroom',
    type: 'two-bedroom',
    name: 'Two Bedroom',
    kicker: 'Share with a friend, or spread out.',
    summary: 'Two bedrooms, a master ensuite and an open living space — ideal for two sharers or a small family.',
    description: [
      'The largest unit at Arena Homes. Two genuine bedrooms of similar size mean no arguments about who gets the good room, and the master has its own ensuite.',
      'Split the rent with a friend for one of the best-value ways to live well in Nakuru, or book it by the night for visiting family.',
    ],
    pricing: { monthly: 48000, per: 'room', nightly: 9500 },
    sizeSqm: 68,
    occupancy: 4,
    bed: 'Two 5 × 6 beds',
    bathroom: 'Master ensuite + guest bathroom',
    highlights: ['2 bedrooms', 'Master ensuite', 'Open living', 'Up to 4 guests'],
    inRoom: ['Two bedrooms', 'Master ensuite + guest bathroom', 'Open-plan lounge & dining', 'Full kitchen', 'Balcony', 'Smart TV'],
    furnishing: ['Two queen beds', 'Sofa set', 'Dining set for four', 'Kitchenware', 'Wardrobes', 'Curtains'],
    availability: { status: 'waitlist', note: 'Join the waitlist for the next vacancy' },
    bestFor: 'Sharers & families',
    images: [
      { src: 'twobed-1', alt: 'Open living room with a tan leather sofa, cushions and plants' },
      { src: 'twobed-2', alt: 'Living room with a grey sectional sofa and a large abstract artwork' },
      { src: 'twobed-3', alt: 'White kitchen with a built-in oven, breakfast counter and pendant lights' },
      { src: 'twobed-4', alt: 'Bathroom with a walk-in glass shower, grey stone tiles and a backlit mirror' },
    ],
  },
]

export const roomTypeLabels: Record<RoomType, string> = {
  single: 'Single room',
  shared: 'Shared room',
  bedsitter: 'Bedsitter',
  studio: 'Studio',
  'one-bedroom': 'One-bedroom',
  'two-bedroom': 'Two-bedroom',
}

export const getRoom = (slug: string | undefined) => rooms.find((r) => r.slug === slug)

export const getRoomByType = (type: string | null | undefined) => rooms.find((r) => r.type === type)

export const availabilityLabel = (room: Room) => {
  const a = room.availability
  if (a.status === 'waitlist') return 'Waitlist'
  if (a.status === 'limited') return a.unitsLeft ? `${a.unitsLeft} left` : 'Limited'
  return 'Available'
}

export const minPrice = Math.min(...rooms.map((r) => r.pricing.monthly))
export const maxPrice = Math.max(...rooms.map((r) => r.pricing.monthly))
