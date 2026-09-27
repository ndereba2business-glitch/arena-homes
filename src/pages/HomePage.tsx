import { absoluteUrl, contact, policies, site } from '@/config/site'
import { amenityIndex } from '@/data/amenities'
import { maxPrice, minPrice, rooms } from '@/data/rooms'
import { formatKsh } from '@/lib/format'
import { JsonLd, useSeo } from '@/lib/seo'
import { staticMeta } from '@/lib/route-meta'
import Hero from '@/components/home/Hero'
import BookingSearch from '@/components/home/BookingSearch'
import Intro from '@/components/home/Intro'
import RoomExplorer from '@/components/home/RoomExplorer'
import Amenities from '@/components/home/Amenities'
import Experience from '@/components/home/Experience'
import LocationSection from '@/components/home/LocationSection'
import GalleryPreview from '@/components/home/GalleryPreview'
import Testimonials from '@/components/home/Testimonials'
import FAQ from '@/components/home/FAQ'
import BookingCTA from '@/components/home/BookingCTA'

export default function HomePage() {
  useSeo(staticMeta.home)

  const lodgingLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': absoluteUrl('/#business'),
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: absoluteUrl('/'),
    image: absoluteUrl('/og.jpg'),
    priceRange: `${formatKsh(minPrice)} – ${formatKsh(maxPrice)} per month`,
    currenciesAccepted: site.currency,
    paymentAccepted: policies.paymentMethods.join(', '),
    checkinTime: policies.checkInTime,
    checkoutTime: policies.checkOutTime,
    address: {
      '@type': 'PostalAddress',
      ...(contact.location.address && { streetAddress: contact.location.address }),
      addressLocality: contact.location.area,
      addressRegion: contact.location.region,
      addressCountry: contact.location.countryCode,
    },
    geo: { '@type': 'GeoCoordinates', latitude: contact.location.geo.lat, longitude: contact.location.geo.lng },
    ...(contact.phone && { telephone: contact.phone }),
    ...(contact.email && { email: contact.email }),
    amenityFeature: amenityIndex.map((a) => ({ '@type': 'LocationFeatureSpecification', name: a.label, value: true })),
    containsPlace: rooms.map((r) => ({ '@type': 'Accommodation', name: r.name, url: absoluteUrl(`/rooms/${r.slug}`) })),
  }

  return (
    <>
      <JsonLd data={lodgingLd} />
      <Hero />
      <div id="search" className="relative z-10 scroll-mt-24 bg-linen">
        <div className="shell -translate-y-6 md:-mt-24 md:translate-y-0 lg:-mt-28">
          <div className="animate-fade-up" style={{ '--d': 1100 } as React.CSSProperties}>
            <BookingSearch />
          </div>
        </div>
      </div>
      <Intro />
      <RoomExplorer />
      <Amenities />
      <Experience />
      <LocationSection />
      <GalleryPreview />
      <Testimonials />
      <FAQ />
      <BookingCTA />
    </>
  )
}
