import {
  Armchair,
  BookOpen,
  Car,
  Cctv,
  CookingPot,
  Droplets,
  ShieldCheck,
  Sofa,
  Sunset,
  WashingMachine,
  Wifi,
  Wrench,
  Zap,
  BedDouble,
  type LucideIcon,
} from 'lucide-react'
import type { Photo } from './images'

/** Amenities told as short stories, each with a photograph. */
export const featuredAmenities: {
  id: string
  eyebrow: string
  title: string
  body: string
  photo: Photo
}[] = [
  {
    id: 'wifi',
    eyebrow: 'Connected',
    title: 'Wi-Fi that keeps up with deadline week.',
    body: 'Fibre to every floor with access points on each corridor. Stream a lecture, upload an assignment and call home on the same night without watching a loading bar.',
    photo: { src: 'amenity-wifi', alt: 'Laptop and open notebook on a desk lit by a warm lamp' },
  },
  {
    id: 'security',
    eyebrow: 'Secure',
    title: 'One way in. Someone always on the gate.',
    body: 'A manned gate around the clock, CCTV on every entrance and shared space, and access for residents only. Visitors are signed in — and your parents can stop worrying.',
    photo: { src: 'amenity-gate', alt: 'Controlled vehicle entrance with a boom barrier and signage' },
  },
  {
    id: 'study',
    eyebrow: 'Focused',
    title: 'Study rooms for when your room isn’t enough.',
    body: 'Quiet study rooms with long desks, good light and sockets at every seat. Open late, and far enough from the lounge that exam season stays quiet.',
    photo: { src: 'amenity-study', alt: 'Student reading in a quiet study room lined with bookshelves' },
  },
  {
    id: 'laundry',
    eyebrow: 'Handled',
    title: 'Laundry downstairs, not a Saturday chore.',
    body: 'Washers and dryers on site, with drying lines on the roof for the Nakuru sun. Put a load in, go to class, come back to clean clothes.',
    photo: { src: 'amenity-laundry', alt: 'Row of front-loading washing machines in a clean laundry room' },
  },
  {
    id: 'rooftop',
    eyebrow: 'Together',
    title: 'A rooftop and a lounge that feel like yours.',
    body: 'A furnished resident lounge for movie nights and group work, and a rooftop terrace with a view of the Menengai ridge for the evenings in between.',
    photo: { src: 'amenity-rooftop', alt: 'Rooftop terrace with a table, laptop and loungers at sunset' },
  },
]

/** Every amenity, shown as a compact index. */
export const amenityIndex: { label: string; detail: string; icon: LucideIcon }[] = [
  { label: 'High-speed Wi-Fi', detail: 'Fibre, every floor', icon: Wifi },
  { label: '24/7 security', detail: 'Manned gate', icon: ShieldCheck },
  { label: 'CCTV', detail: 'Entrances & shared spaces', icon: Cctv },
  { label: 'Backup power', detail: 'Generator for common areas', icon: Zap },
  { label: 'Reliable water', detail: 'Borehole + storage tanks', icon: Droplets },
  { label: 'Laundry', detail: 'Washers, dryers & lines', icon: WashingMachine },
  { label: 'Study rooms', detail: 'Quiet, open late', icon: BookOpen },
  { label: 'Parking', detail: 'Secure, on site', icon: Car },
  { label: 'Fully furnished', detail: 'Move in with a suitcase', icon: BedDouble },
  { label: 'Resident lounge', detail: 'TV, sofas, games', icon: Sofa },
  { label: 'Kitchens', detail: 'Shared & in-unit', icon: CookingPot },
  { label: 'Rooftop terrace', detail: 'Evenings with a view', icon: Sunset },
  { label: 'Common areas', detail: 'Cleaned daily', icon: Armchair },
  { label: 'On-site caretaker', detail: 'Repairs handled fast', icon: Wrench },
]
