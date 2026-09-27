import { Link, useSearchParams } from 'react-router-dom'
import { Clock, MapPin, Phone } from 'lucide-react'
import { contact } from '@/config/site'
import { readSearch } from '@/lib/search'
import { useSeo } from '@/lib/seo'
import { staticMeta } from '@/lib/route-meta'
import { waMessages } from '@/lib/whatsapp'
import ReservePanel from '@/components/rooms/ReservePanel'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import Img from '@/components/ui/Img'
import { delay } from '@/components/ui/Motion'

export default function BookPage() {
  const [params] = useSearchParams()
  const initial = readSearch(params)
  const kind = params.get('kind') === 'viewing' ? 'viewing' : 'reservation'

  useSeo(staticMeta.book)

  return (
    <section className="bg-linen pb-24 pt-32 md:pb-32 md:pt-44">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <nav aria-label="Breadcrumb" className="text-xs text-taupe">
            <Link to="/" className="link-line">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page" className="text-ink">
              Book
            </span>
          </nav>
          <h1 className="display-xl mt-6 animate-fade-up" style={delay(80)}>
            Take the <em className="italic">first step.</em>
          </h1>
          <p className="lede mt-6 max-w-md text-taupe animate-fade-up" style={delay(160)}>
            Reserve a space or come and see it first. Tell us when, and we’ll confirm availability, pricing and next steps — usually the same
            day.
          </p>

          <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden bg-stone animate-fade-in lg:block" style={delay(300)}>
            <Img src="exp-entrance" alt="Softly lit entrance path at Arena Homes in the evening" fill sizes="36vw" />
          </div>

          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-clay-deep" aria-hidden="true" />
              {contact.hours}
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-clay-deep" aria-hidden="true" />
              {contact.location.address ? `${contact.location.address}, ` : ''}
              {contact.location.area}, {contact.location.country}
            </li>
            {contact.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-clay-deep" aria-hidden="true" />
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="link-line">
                  {contact.phone}
                </a>
              </li>
            )}
          </ul>
          <div className="mt-8">
            <p className="text-sm text-taupe">Prefer to talk it through?</p>
            <WhatsAppButton message={waMessages.general()} label="Chat on WhatsApp" className="mt-3" />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="border border-rule bg-paper p-5 animate-fade-up sm:p-8 lg:sticky lg:top-24" style={delay(200)}>
            <ReservePanel key={params.toString()} initial={initial} defaultKind={kind} />
          </div>
        </div>
      </div>
    </section>
  )
}
