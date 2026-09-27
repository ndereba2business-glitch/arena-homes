import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { contact, site } from '@/config/site'
import { minPrice } from '@/data/rooms'
import { formatKsh } from '@/lib/format'
import Img from '@/components/ui/Img'
import { Magnetic, Parallax, delay } from '@/components/ui/Motion'

const coords = (() => {
  const { lat, lng } = contact.location.geo
  return `${Math.abs(lat).toFixed(2)}° ${lat < 0 ? 'S' : 'N'}, ${Math.abs(lng).toFixed(2)}° ${lng < 0 ? 'W' : 'E'}`
})()

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="dark-surface grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Parallax speed={-70} scale={1}>
          <div className="hero-settle absolute inset-0">
            <Img
              src="hero-living"
              alt="Open-plan furnished apartment at dusk, with warm lamps, a sofa and city lights beyond the windows"
              priority
              fill
              sizes="100vw"
              className="object-[62%_50%]"
            />
          </div>
        </Parallax>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,17,14,.62)_0%,rgba(19,17,14,.08)_28%,rgba(19,17,14,.25)_55%,rgba(19,17,14,.92)_100%)]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(19,17,14,.7)_0%,rgba(19,17,14,.15)_55%,rgba(19,17,14,0)_100%)] md:block" />
      </div>

      <div className="shell relative flex flex-1 flex-col justify-end pb-10 pt-36 md:pb-40 lg:pb-44">
        <p className="animate-fade-up eyebrow flex items-center gap-3 text-paper/80" style={delay(200)}>
          <span className="h-px w-8 bg-clay-soft" aria-hidden="true" />
          {site.name}
        </p>

        <h1 id="hero-title" className="display-xl mt-6 max-w-[12ch]">
          <span className="line-mask">
            <span style={delay(300)}>A better place</span>
          </span>
          <span className="line-mask">
            <span style={delay(430)}>
              to come <em className="italic text-clay-soft">home</em> to.
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="animate-fade-up lede text-paper/82" style={delay(750)}>
              Modern spaces. Thoughtful amenities. A location that keeps you close to what matters.
            </p>
            <div className="animate-fade-up mt-9 flex flex-col gap-3 xs:flex-row" style={delay(900)}>
              <Magnetic>
                <Link to="/rooms" className="btn btn-paper w-full xs:w-auto">
                  Explore rooms <ArrowRight className="btn-arrow h-4 w-4" />
                </Link>
              </Magnetic>
              <Link to="/book" className="btn btn-ghost-light">
                Book a stay
              </Link>
            </div>
          </div>

          <dl className="animate-fade-up hidden gap-10 text-sm md:flex" style={delay(1050)}>
            <div>
              <dt className="eyebrow text-paper/55">Location</dt>
              <dd className="mt-2 font-display text-2xl">
                {contact.location.area}, {contact.location.country}
              </dd>
              <dd className="tabular mt-1 text-xs text-paper/55">{coords}</dd>
            </div>
            <div>
              <dt className="eyebrow text-paper/55">Rooms from</dt>
              <dd className="mt-2 font-display text-2xl tabular">{formatKsh(minPrice)}</dd>
              <dd className="mt-1 text-xs text-paper/55">per month, fully furnished</dd>
            </div>
          </dl>
        </div>

        {/* location, compact — mobile */}
        <p className="animate-fade-up mt-8 flex items-center gap-2 text-xs text-paper/65 md:hidden" style={delay(1050)}>
          <span className="h-1.5 w-1.5 rounded-full bg-clay-soft" aria-hidden="true" />
          {contact.location.area}, {contact.location.country}
          <span className="tabular text-paper/40">· {coords}</span>
        </p>
      </div>

      {/* scroll cue */}
      <a
        href="#search"
        aria-label="Scroll to search"
        className="animate-fade-in absolute bottom-10 right-4 hidden flex-col items-center gap-3 sm:right-8 md:bottom-44 md:flex lg:right-14 lg:bottom-48"
        style={delay(1400)}
      >
        <span className="eyebrow text-paper/55 [writing-mode:vertical-rl]">Scroll</span>
        <span className="relative block h-14 w-px overflow-hidden bg-paper/20">
          <span className="scroll-cue absolute inset-0 bg-paper" />
        </span>
      </a>
    </section>
  )
}
