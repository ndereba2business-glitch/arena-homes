/**
 * NEARBY PLACES
 * ------------------------------------------------------------------
 * Travel times are INDICATIVE placeholders for the concept (the property
 * address is not yet fixed). `confirmed: false` makes the UI label them.
 * TODO(client): replace with measured times from the real address.
 *
 * `x` / `y` position each pin on the illustrated map (0–100, % of map box).
 */

export type PlaceCategory = 'Education' | 'Shopping' | 'Food' | 'Transport' | 'Health' | 'Leisure'

export interface Place {
  name: string
  category: PlaceCategory
  minutes: number
  mode: 'walk' | 'drive'
  confirmed: boolean
  x: number
  y: number
}

export const nearby: Place[] = [
  { name: 'Egerton University — Nakuru Town Campus', category: 'Education', minutes: 8, mode: 'drive', confirmed: false, x: 70, y: 30 },
  { name: 'Kabarak University', category: 'Education', minutes: 30, mode: 'drive', confirmed: false, x: 12, y: 12 },
  { name: 'Nakuru CBD', category: 'Transport', minutes: 5, mode: 'drive', confirmed: false, x: 58, y: 52 },
  { name: 'Main matatu stage', category: 'Transport', minutes: 6, mode: 'drive', confirmed: false, x: 64, y: 60 },
  { name: 'Westside Mall', category: 'Shopping', minutes: 7, mode: 'drive', confirmed: false, x: 34, y: 46 },
  { name: 'Supermarket & market', category: 'Shopping', minutes: 5, mode: 'walk', confirmed: false, x: 48, y: 40 },
  { name: 'Restaurants & cafés', category: 'Food', minutes: 5, mode: 'walk', confirmed: false, x: 38, y: 24 },
  { name: 'Nakuru Level 5 Hospital', category: 'Health', minutes: 8, mode: 'drive', confirmed: false, x: 76, y: 48 },
  { name: 'Lake Nakuru National Park', category: 'Leisure', minutes: 12, mode: 'drive', confirmed: false, x: 44, y: 84 },
]

/** Where the property sits on the illustrated map. */
export const propertyPin = { x: 44, y: 34 }
