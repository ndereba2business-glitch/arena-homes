import { absoluteUrl, contact, site } from '@/config/site'
import type { Room } from '@/data/rooms'
import { formatDate, formatKsh, plural } from './format'
import type { BookingRequest } from './booking'

/**
 * Builds a wa.me link. The number comes from src/config/site.ts only.
 * With no number configured the link still works — WhatsApp opens with the
 * message pre-filled and the visitor picks the chat.
 */
export function whatsappLink(message: string) {
  const text = encodeURIComponent(message)
  return contact.whatsappNumber ? `https://wa.me/${contact.whatsappNumber}?text=${text}` : `https://wa.me/?text=${text}`
}

export const waMessages = {
  general: () => `Hi ${site.name}, I'd like to know more about your rooms and availability.`,

  room: (room: Pick<Room, 'name' | 'slug'>) =>
    `Hi, I'm interested in booking a ${room.name} at ${site.name}. I'd like to know about availability and pricing.\n${absoluteUrl(`/rooms/${room.slug}`)}`,

  viewing: (roomName?: string) =>
    `Hi ${site.name}, I'd like to schedule a viewing${roomName ? ` of a ${roomName}` : ''}. When are you available?`,

  booking: (req: BookingRequest, room: Room | undefined, reference?: string) => {
    const lines = [
      `Hi ${site.name}, I've just sent a ${req.kind === 'viewing' ? 'viewing request' : 'reservation request'}${reference ? ` (ref. ${reference})` : ''}:`,
      '',
    ]
    if (room) lines.push(`• Space: ${room.name} — ${formatKsh(req.stay === 'short' && room.pricing.nightly ? room.pricing.nightly : room.pricing.monthly)} / ${req.stay === 'short' ? 'night' : 'month'}`)
    if (req.kind === 'viewing') {
      lines.push(`• Viewing: ${formatDate(req.moveIn)}${req.viewingSlot ? `, ${req.viewingSlot}` : ''}`)
    } else if (req.stay === 'short') {
      lines.push(`• Dates: ${formatDate(req.moveIn)} → ${formatDate(req.checkOut ?? '')}`)
    } else {
      lines.push(`• Move-in: ${formatDate(req.moveIn)}`)
      if (req.months) lines.push(`• Stay: ${plural(req.months, 'month')}`)
    }
    lines.push(`• Occupants: ${req.guests}`, `• Name: ${req.name}`)
    if (req.notes) lines.push(`• Notes: ${req.notes}`)
    lines.push('', 'Please confirm availability and next steps. Thank you!')
    return lines.join('\n')
  },
}
