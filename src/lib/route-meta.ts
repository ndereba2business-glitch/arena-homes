import { contact, site } from '@/config/site'
import { imageSrc } from '@/data/images'
import { rooms, type Room } from '@/data/rooms'
import { formatKsh } from './format'

/**
 * Title / description / share image for every route, in one place.
 * Used at runtime by useSeo() and at build time by scripts/prerender.mjs,
 * which bakes them into each route's static HTML for link previews.
 */
export interface RouteMeta {
  path: string
  /** Page title without the brand suffix; omitted on the homepage. */
  title?: string
  description: string
  image?: string
}

export const pageTitle = (title?: string) =>
  title ? `${title} | ${site.name}` : `${site.name} — Furnished Student Rooms & Apartments in ${contact.location.area}`

export const staticMeta = {
  home: { path: '/', description: site.description },
  rooms: {
    path: '/rooms',
    title: 'Rooms & Apartments',
    description: `Compare single rooms, shared rooms, bedsitters, studios and one- and two-bedroom apartments at ${site.name}, ${contact.location.area}. Fully furnished, with Wi-Fi and 24/7 security.`,
  },
  gallery: {
    path: '/gallery',
    title: 'Gallery',
    description: `Photos of the rooms, apartments, common areas and amenities at ${site.name}, ${contact.location.area}.`,
    image: imageSrc('exterior-garden', 1600),
  },
  book: {
    path: '/book',
    title: 'Book a Stay or Viewing',
    description: `Reserve a furnished room or apartment at ${site.name}, ${contact.location.area}, or book a free viewing. No payment online — we confirm everything with you first.`,
  },
} satisfies Record<string, RouteMeta>

export const roomMeta = (room: Room): RouteMeta => ({
  path: `/rooms/${room.slug}`,
  title: `${room.name} — from ${formatKsh(room.pricing.monthly)}/month`,
  description: `${room.summary} ${room.sizeSqm} m², sleeps ${room.occupancy}. ${site.name}, ${contact.location.area}.`,
  image: imageSrc(room.images[0].src, 1600),
})

export const allRouteMeta = (): RouteMeta[] => [...Object.values(staticMeta), ...rooms.map(roomMeta)]

export const isConcept = site.isConcept
export const siteUrl = site.url
