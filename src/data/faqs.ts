import { contact, policies } from '@/config/site'
import { formatKsh } from '@/lib/format'
import { minPrice } from './rooms'

/**
 * FAQs. Answers draw on the policies in /src/config/site.ts so terms stay
 * consistent across the site. TODO(client): confirm every answer.
 */
export const faqs: { q: string; a: string }[] = [
  {
    q: 'How do I book?',
    a: 'Choose a room, pick your move-in date and send a reservation request — online or on WhatsApp. We confirm availability, share the tenancy agreement, and your space is secured once the deposit is paid.',
  },
  {
    q: 'What is included in the rent?',
    a: `Rent covers your furnished room, fibre Wi-Fi, water, 24/7 security, cleaning of common areas and backup power for corridors and shared spaces. Electricity in your unit runs on a prepaid token meter, so you only pay for what you use. Rooms start from ${formatKsh(minPrice)} a month.`,
  },
  {
    q: 'Is Wi-Fi available?',
    a: 'Yes. Fibre internet reaches every floor with access points on each corridor, and it’s included in the rent. No routers to buy and no monthly bundles to top up.',
  },
  {
    q: 'Is there parking?',
    a: 'Yes, there is secure on-site parking behind the manned gate. Spaces are limited, so mention a car when you book and we’ll confirm one for you.',
  },
  {
    q: 'Is the property secure?',
    a: 'The gate is manned around the clock, CCTV covers every entrance and shared space, and only residents can enter the building. Visitors are signed in at the gate and must leave by the agreed time.',
  },
  {
    q: 'What is the minimum stay?',
    a: `Long stays start at ${policies.minimumStayMonths} months, and most students book per semester or for the full academic year. Studios and apartments can also be booked by the night, with a minimum of ${policies.minimumShortStayNights} nights.`,
  },
  {
    q: 'Are rooms furnished?',
    a: 'Every room and apartment is fully furnished — bed and mattress, desk and chair, wardrobe and curtains as standard. Studios and apartments also include a kitchen with cookware, and short stays include bedding and towels.',
  },
  {
    q: 'What payment methods are accepted?',
    a: `We accept ${policies.paymentMethods.join(' and ')}. A refundable deposit of ${policies.depositMonths === 1 ? 'one month’s' : `${policies.depositMonths} months’`} rent secures your room, and rent is paid monthly in advance. You’ll receive a receipt for every payment.`,
  },
  {
    q: 'Can I schedule a viewing?',
    a: `Of course — and we recommend it. ${contact.hours}. Request a viewing online or send us a WhatsApp message with a day and time that suits you, and we’ll confirm.`,
  },
]
