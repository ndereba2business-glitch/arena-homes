import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { bookingCta } from '@/data/content'
import { waMessages } from '@/lib/whatsapp'
import Img from '@/components/ui/Img'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { Magnetic, Parallax, delay } from '@/components/ui/Motion'

export default function BookingCTA() {
  return (
    <section aria-labelledby="cta-title" className="dark-surface grain relative isolate overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 -z-10">
        <Parallax speed={80} scale={1.15}>
          <Img src={bookingCta.photo.src} alt="" fill sizes="100vw" className="object-[50%_60%]" />
        </Parallax>
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />
      </div>

      <div className="shell flex min-h-[88svh] flex-col justify-center py-28 md:py-40">
        <p data-reveal className="eyebrow flex items-center gap-3 text-clay-soft">
          <span className="h-px w-8 bg-current" aria-hidden="true" />
          Now letting
        </p>
        <h2 id="cta-title" data-reveal style={delay(80)} className="display-xl mt-6 max-w-[14ch]">
          Your next home is <em className="italic text-clay-soft">closer</em> than you think.
        </h2>
        <p data-reveal style={delay(160)} className="lede mt-8 max-w-md text-paper/80">
          {bookingCta.body}
        </p>
        <div data-reveal style={delay(240)} className="mt-10 flex flex-col gap-3 xs:flex-row">
          <Magnetic>
            <Link to="/book" className="btn btn-paper w-full xs:w-auto">
              Book your space <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
          </Magnetic>
          <WhatsAppButton message={waMessages.general()} label="Talk to us" />
        </div>
      </div>
    </section>
  )
}
