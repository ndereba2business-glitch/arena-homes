/**
 * ARENA HOMES — PROPERTY CONFIGURATION
 * ------------------------------------------------------------------
 * Every business-specific fact the site shows is set here or in
 * /src/data. To re-skin this site for another accommodation client:
 *
 *   1. Update `site`, `contact`, `socials`, `policies` below.
 *   2. Replace rooms, amenities, nearby places, reviews and FAQs in /src/data.
 *   3. Swap photography in /public/images (see README.md → Images).
 *   4. Adjust colour + type tokens at the top of /src/index.css.
 *
 * Anything marked `TODO(client)` is a placeholder that must be confirmed
 * with the property owner before launch. Empty strings are handled in the
 * UI (hidden, or shown as "to be confirmed"), so nothing invented is shown.
 */

export const site = {
  name: 'Arena Homes',
  shortName: 'Arena',
  tagline: 'A better place to come home to.',
  description:
    'Furnished student rooms, studios and apartments in Nakuru. Secure, fully furnished and close to campus and town — book a viewing or reserve your space online or on WhatsApp.',
  // TODO(client): production domain, no trailing slash.
  url: 'https://arenahomes.co.ke',
  locale: 'en_KE',
  language: 'en-KE',
  currency: 'KES',
  /**
   * While true, a slim "concept" notice is shown, search engines are asked
   * not to index the site, and sample prices/reviews are labelled.
   * Set to false at launch.
   */
  isConcept: true,
  /** Studio credit shown in the footer. */
  builtBy: { name: 'Forge Eleven', url: 'https://forge-eleven.com' },
}

export const contact = {
  /**
   * WhatsApp number in international format, digits only — e.g. '2547XXXXXXXX'.
   * TODO(client): set the real number. While empty, WhatsApp links still work:
   * WhatsApp opens with the message pre-filled and the visitor picks the chat.
   */
  whatsappNumber: '',
  // TODO(client): e.g. '+254 7XX XXX XXX'
  phone: '',
  // TODO(client)
  email: '',
  hours: 'Viewings Mon – Sat, 9:00 – 17:00',
  location: {
    area: 'Nakuru',
    region: 'Nakuru County',
    country: 'Kenya',
    countryCode: 'KE',
    // TODO(client): street address / estate, e.g. 'Off Kenyatta Avenue, Milimani'.
    address: '',
    // Approximate centre of Nakuru town — TODO(client): exact coordinates of the property.
    geo: { lat: -0.3031, lng: 36.08 },
    // TODO(client): Google Maps share link for the property.
    mapUrl: '',
  },
}

export const socials = [
  // TODO(client): confirm handles and profile URLs.
  { id: 'instagram', label: 'Instagram', url: '' },
  { id: 'tiktok', label: 'TikTok', url: '' },
  { id: 'facebook', label: 'Facebook', url: '' },
] as const

/** Letting terms referenced across room pages, FAQs and the booking flow. */
export const policies = {
  // TODO(client): confirm real terms.
  depositMonths: 1,
  minimumStayMonths: 3,
  minimumShortStayNights: 2,
  noticeDays: 30,
  paymentMethods: ['M-Pesa', 'Bank transfer'],
  checkInTime: '14:00',
  checkOutTime: '10:00',
}

/** Properties / locations offered in the search bar. Add entries for multi-site operators. */
export const locations = [{ id: 'nakuru', label: 'Nakuru', detail: 'Arena Homes, Nakuru' }] as const

export const nav = [
  { label: 'Home', to: '/' },
  { label: 'Rooms', to: '/rooms' },
  { label: 'Amenities', to: '/#amenities' },
  { label: 'Location', to: '/#location' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'FAQs', to: '/#faqs' },
] as const

export const absoluteUrl = (path = '') => `${site.url}${path}`

export const mapsLink = () =>
  contact.location.mapUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${contact.location.address ? contact.location.address + ', ' : ''}${contact.location.area}, ${contact.location.country}`
  )}`
