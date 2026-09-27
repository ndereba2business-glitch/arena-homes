import type { ImageName } from './images'

export const galleryCategories = ['Rooms', 'Exterior', 'Common Areas', 'Amenities', 'Lifestyle'] as const
export type GalleryCategory = (typeof galleryCategories)[number]

export interface GalleryItem {
  src: ImageName
  alt: string
  category: GalleryCategory
}

/** Order matters: it's the editorial sequence of the masonry grid. */
export const gallery: GalleryItem[] = [
  { src: 'exterior-garden', alt: 'Low-rise apartment building behind landscaped gardens and palms', category: 'Exterior' },
  { src: 'studio-1', alt: 'Open-plan studio with a queen bed, dining table and kitchen', category: 'Rooms' },
  { src: 'life-friends', alt: 'Two residents laughing together on a sofa', category: 'Lifestyle' },
  { src: 'amenity-lounge', alt: 'Resident lounge with a leather sofa, gallery wall and plants', category: 'Common Areas' },
  { src: 'single-1', alt: 'Bright single room with a desk by the window', category: 'Rooms' },
  { src: 'amenity-wifi', alt: 'Desk with laptop and lamp in the evening', category: 'Amenities' },
  { src: 'exterior-night', alt: 'Apartment building at night with warm light in the windows', category: 'Exterior' },
  { src: 'onebed-1', alt: 'One-bedroom living room with olive sofa and floor lamp', category: 'Rooms' },
  { src: 'life-student', alt: 'Student working on a laptop', category: 'Lifestyle' },
  { src: 'amenity-kitchen', alt: 'Shared kitchen with sage and terracotta cabinets', category: 'Common Areas' },
  { src: 'shared-1', alt: 'Twin room with two beds and a desk under the window', category: 'Rooms' },
  { src: 'exterior-courtyard', alt: 'Landscaped courtyard between apartment blocks', category: 'Exterior' },
  { src: 'amenity-rooftop', alt: 'Rooftop terrace with loungers at sunset', category: 'Common Areas' },
  { src: 'life-reading', alt: 'Resident reading with a cup of tea', category: 'Lifestyle' },
  { src: 'amenity-laundry', alt: 'On-site laundry room with washing machines', category: 'Amenities' },
  { src: 'studio-3', alt: 'Studio kitchen with green tile splashback', category: 'Rooms' },
  { src: 'exterior-palms', alt: 'Apartment block rising behind tropical gardens', category: 'Exterior' },
  { src: 'amenity-study', alt: 'Quiet study room with bookshelves', category: 'Amenities' },
  { src: 'life-campus', alt: 'Students chatting on a campus balcony', category: 'Lifestyle' },
  { src: 'twobed-1', alt: 'Two-bedroom apartment living room with tan sofa', category: 'Rooms' },
  { src: 'amenity-gate', alt: 'Controlled entrance with boom barrier', category: 'Amenities' },
  { src: 'life-lake', alt: 'Rhinos grazing in Lake Nakuru National Park', category: 'Lifestyle' },
  { src: 'onebed-2', alt: 'Bright bedroom with tall windows', category: 'Rooms' },
  { src: 'bedsitter-1', alt: 'Bedsitter with bed and desk area', category: 'Rooms' },
]
