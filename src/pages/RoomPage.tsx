import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, BedDouble, Check, Maximize2, ShowerHead, Users } from 'lucide-react'
import { absoluteUrl, contact, mapsLink, policies, site } from '@/config/site'
import { houseRules } from '@/data/content'
import { availabilityLabel, getRoom, rooms } from '@/data/rooms'
import { imageSrc } from '@/data/images'
import { formatKsh, plural } from '@/lib/format'
import { readSearch } from '@/lib/search'
import { JsonLd, useSeo } from '@/lib/seo'
import { roomMeta, staticMeta } from '@/lib/route-meta'
import { waMessages } from '@/lib/whatsapp'
import RoomGallery from '@/components/rooms/RoomGallery'
import ReservePanel from '@/components/rooms/ReservePanel'
import RoomCard from '@/components/rooms/RoomCard'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { delay } from '@/components/ui/Motion'
import NotFoundPage from './NotFoundPage'

const dot = { available: 'bg-[#3f8f5a]', limited: 'bg-clay', waitlist: 'bg-taupe' } as const

export default function RoomPage() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const room = getRoom(slug)

  useSeo(room ? roomMeta(room) : { ...staticMeta.rooms, title: 'Room not found', noindex: true })

  if (!room) return <NotFoundPage />

  const search = readSearch(params)
  const others = rooms.filter((r) => r.slug !== room.slug).slice(0, 3)
  const priceSuffix = room.pricing.per === 'bed' ? '/ bed per month' : '/ month'

  const facts = [
    { icon: Maximize2, label: 'Size', value: `${room.sizeSqm} m²` },
    { icon: Users, label: 'Occupancy', value: room.occupancy === 1 ? '1 person' : `Up to ${room.occupancy}` },
    { icon: BedDouble, label: 'Bed', value: room.bed },
    { icon: ShowerHead, label: 'Bathroom', value: room.bathroom },
  ]

  const offerLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    url: absoluteUrl(`/rooms/${room.slug}`),
    priceCurrency: site.currency,
    price: room.pricing.monthly,
    priceSpecification: { '@type': 'UnitPriceSpecification', price: room.pricing.monthly, priceCurrency: site.currency, unitCode: 'MON' },
    availability: room.availability.status === 'waitlist' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    offeredBy: { '@id': absoluteUrl('/#business') },
    itemOffered: {
      '@type': room.type === 'single' || room.type === 'shared' ? 'Room' : 'Apartment',
      name: `${room.name} — ${site.name}`,
      description: [room.summary, ...room.description].join(' '),
      image: room.images.map((i) => absoluteUrl(imageSrc(i.src, 1600))),
      floorSize: { '@type': 'QuantitativeValue', value: room.sizeSqm, unitCode: 'MTK' },
      occupancy: { '@type': 'QuantitativeValue', maxValue: room.occupancy },
      amenityFeature: room.inRoom.map((a) => ({ '@type': 'LocationFeatureSpecification', name: a, value: true })),
      address: { '@type': 'PostalAddress', addressLocality: contact.location.area, addressCountry: contact.location.countryCode },
    },
  }
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Rooms', item: absoluteUrl('/rooms') },
      { '@type': 'ListItem', position: 3, name: room.name, item: absoluteUrl(`/rooms/${room.slug}`) },
    ],
  }

  return (
    <>
      <JsonLd data={[offerLd, breadcrumbLd]} />
      <article className="bg-linen pb-24 pt-28 md:pt-36">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="text-xs text-taupe">
            <Link to="/" className="link-line">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <Link to="/rooms" className="link-line">
              Rooms
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page" className="text-ink">
              {room.name}
            </span>
          </nav>

          <header className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="animate-fade-up inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em]">
                <span className={`h-1.5 w-1.5 rounded-full ${dot[room.availability.status]}`} aria-hidden="true" />
                {availabilityLabel(room)}
                {room.availability.note && <span className="font-normal normal-case tracking-normal text-taupe">— {room.availability.note}</span>}
              </p>
              <h1 className="display-xl mt-4 animate-fade-up" style={delay(80)}>
                {room.name}
              </h1>
              <p className="lede mt-4 max-w-lg text-taupe animate-fade-up" style={delay(160)}>
                {room.kicker}
              </p>
            </div>
            <p className="animate-fade-up shrink-0 md:text-right" style={delay(220)}>
              <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-taupe">From</span>
              <span className="tabular font-display text-5xl leading-none">{formatKsh(room.pricing.monthly)}</span>
              <span className="text-sm text-taupe"> {priceSuffix}</span>
              {room.pricing.nightly && (
                <span className="tabular block text-sm text-taupe">or {formatKsh(room.pricing.nightly)} / night</span>
              )}
            </p>
          </header>

          <div className="mt-8 animate-fade-in md:mt-12" style={delay(250)}>
            <RoomGallery photos={room.images} name={room.name} />
          </div>

          <div className="mt-12 grid gap-14 md:mt-16 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <dl className="grid grid-cols-2 border-t border-rule sm:grid-cols-4">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="border-b border-rule py-5 pr-4">
                    <Icon className="h-5 w-5 text-clay-deep" strokeWidth={1.5} aria-hidden="true" />
                    <dt className="field-label mt-3">{label}</dt>
                    <dd className="mt-1 text-sm font-medium leading-snug">{value}</dd>
                  </div>
                ))}
              </dl>

              <section aria-labelledby="about-title" className="mt-14">
                <h2 id="about-title" className="display-md">
                  About this space
                </h2>
                <p className="lede mt-6 text-ink/85">{room.summary}</p>
                <div className="mt-5 space-y-4 leading-relaxed text-taupe">
                  {room.description.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <p className="mt-6 text-sm">
                  <span className="text-taupe">Best for:</span> <span className="font-medium">{room.bestFor}</span>
                </p>
              </section>

              <section aria-labelledby="inroom-title" className="mt-14 grid gap-10 sm:grid-cols-2">
                <div>
                  <h2 id="inroom-title" className="eyebrow text-clay-deep">
                    In the room
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {room.inRoom.map((a) => (
                      <li key={a} className="flex gap-3 text-[0.9375rem]">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-clay-deep" aria-hidden="true" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="eyebrow text-clay-deep">Furnished with</h2>
                  <ul className="mt-5 space-y-3">
                    {room.furnishing.map((a) => (
                      <li key={a} className="flex gap-3 text-[0.9375rem]">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-clay-deep" aria-hidden="true" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section aria-labelledby="included-title" className="mt-14 bg-paper p-6 sm:p-8">
                <h2 id="included-title" className="font-display text-3xl">
                  Included in the rent
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-taupe">
                  Fibre Wi-Fi, water, 24/7 security, cleaning of shared spaces and backup power for corridors and common areas. Electricity in your
                  unit is on a prepaid token meter — you only pay for what you use.
                </p>
                <Link to="/#amenities" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  <span className="link-line-static">See all amenities</span> <ArrowRight className="h-4 w-4" />
                </Link>
              </section>

              <section aria-labelledby="location-title" className="mt-14">
                <h2 id="location-title" className="eyebrow text-clay-deep">
                  Location
                </h2>
                <p className="mt-4 font-display text-3xl">
                  {contact.location.address || contact.location.area}, {contact.location.region}
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-taupe">
                  Minutes from campus, the CBD, supermarkets and the matatu stage.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold">
                  <Link to="/#location" className="inline-flex items-center gap-2">
                    <span className="link-line-static">What’s nearby</span> <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href={mapsLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    <span className="link-line-static">Open in Google Maps</span> <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </section>

              <section aria-labelledby="rules-title" className="mt-14 grid gap-10 border-t border-rule pt-10 sm:grid-cols-2">
                <div>
                  <h2 id="rules-title" className="eyebrow text-clay-deep">
                    House rules
                  </h2>
                  <ul className="mt-5 space-y-2.5 text-sm text-taupe">
                    {houseRules.map((r) => (
                      <li key={r} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-taupe" aria-hidden="true" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="eyebrow text-clay-deep">Terms</h2>
                  <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
                    <dt className="text-taupe">Deposit</dt>
                    <dd>
                      {policies.depositMonths === 1 ? 'One month’s' : `${policies.depositMonths} months’`} rent, refundable
                    </dd>
                    <dt className="text-taupe">Minimum stay</dt>
                    <dd>
                      {plural(policies.minimumStayMonths, 'month')}
                      {room.pricing.nightly && ` · ${plural(policies.minimumShortStayNights, 'night')} for short stays`}
                    </dd>
                    <dt className="text-taupe">Notice</dt>
                    <dd>{policies.noticeDays} days</dd>
                    <dt className="text-taupe">Payment</dt>
                    <dd>{policies.paymentMethods.join(', ')}</dd>
                    {room.pricing.nightly && (
                      <>
                        <dt className="text-taupe">Check-in / out</dt>
                        <dd>
                          From {policies.checkInTime} · by {policies.checkOutTime}
                        </dd>
                      </>
                    )}
                  </dl>
                </div>
              </section>

              <div className="mt-14 flex flex-col gap-5 border border-whatsapp/40 bg-whatsapp/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">Questions about the {room.name.toLowerCase()}?</p>
                  <p className="mt-1 text-sm text-taupe">Ask about availability, viewings or sharing — a real person replies.</p>
                </div>
                <WhatsAppButton message={waMessages.room(room)} label="Chat on WhatsApp" className="shrink-0" />
              </div>
            </div>

            {/* reservation panel */}
            <aside id="reserve" aria-labelledby="reserve-title" className="scroll-mt-24 lg:col-span-5 lg:col-start-8">
              <div className="border border-rule bg-paper p-5 sm:p-7 lg:sticky lg:top-24">
                <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-5">
                  <h2 id="reserve-title" className="font-display text-3xl">
                    Reserve this space
                  </h2>
                  <p className="tabular shrink-0 text-sm">
                    <span className="font-semibold">{formatKsh(room.pricing.monthly)}</span>
                    <span className="text-taupe"> /mo</span>
                  </p>
                </div>
                <div className="pt-6">
                  <ReservePanel room={room} initial={search} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      <section aria-labelledby="more-title" className="bg-paper py-20 md:py-28">
        <div className="shell">
          <div className="flex items-end justify-between gap-6">
            <h2 id="more-title" className="display-md">
              Other spaces
            </h2>
            <Link to="/rooms" className="link-line-static hidden text-sm font-semibold sm:inline">
              All rooms
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
            {others.map((r) => (
              <li key={r.slug} data-reveal>
                <RoomCard room={r} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <StickyReserveBar price={formatKsh(room.pricing.monthly)} suffix={room.pricing.per === 'bed' ? '/ bed · mo' : '/ month'} />
    </>
  )
}

/** Mobile bottom bar: price + jump to the reservation panel. Hides while the panel is on screen. */
function StickyReserveBar({ price, suffix }: { price: string; suffix: string }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const panel = document.getElementById('reserve')
    if (!panel) return
    let panelInView = false
    const update = () => setVisible(window.scrollY > 300 && !panelInView)
    const io = new IntersectionObserver(([e]) => {
      panelInView = e.isIntersecting
      update()
    })
    io.observe(panel)
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-[80] border-t border-rule bg-paper/94 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-700 ease-[var(--ease-expo)] lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="leading-tight">
          <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-taupe">From</span>
          <span className="tabular font-semibold">{price}</span>
          <span className="text-xs text-taupe"> {suffix}</span>
        </p>
        <a href="#reserve" className="btn btn-ink min-h-12!">
          Check availability
        </a>
      </div>
    </div>
  )
}
