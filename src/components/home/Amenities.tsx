import { useEffect, useRef, useState } from 'react'
import { amenityIndex, featuredAmenities } from '@/data/amenities'
import Img from '@/components/ui/Img'
import SectionHeading from '@/components/ui/SectionHeading'
import { delay } from '@/components/ui/Motion'

/**
 * Amenities as scroll-told chapters. On desktop, a sticky frame holds the
 * photographs and changes as each chapter crosses the middle of the screen;
 * on mobile every chapter carries its own photo. Then a compact index of all.
 */
export default function Amenities() {
  const [active, setActive] = useState(0)
  const chapters = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
      },
      { rootMargin: '-45% 0px -45% 0px' }
    )
    chapters.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const total = featuredAmenities.length

  return (
    <section id="amenities" aria-labelledby="amenities-title" className="dark-surface bg-ink py-24 text-paper md:py-36">
      <div className="shell">
        <SectionHeading
          id="amenities-title"
          eyebrow="Amenities"
          tone="dark"
          title={
            <>
              Everything handled, <br className="hidden md:block" />
              <em className="italic text-clay-soft">so you don’t have to.</em>
            </>
          }
        >
          The things that make a place easy to live in — fast internet, real security, water every day — are built in and included.
        </SectionHeading>

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-8">
          {/* sticky photo frame (desktop) */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-24 aspect-[4/5] max-h-[calc(100svh-8rem)] w-full overflow-hidden bg-umber">
              {featuredAmenities.map((a, i) => (
                <div
                  key={a.id}
                  className={`absolute inset-0 transition-[clip-path,opacity] duration-[1200ms] ease-[var(--ease-cine)] ${
                    i === active ? 'z-[2] opacity-100 [clip-path:inset(0_0_0_0)]' : i < active ? 'z-[1] opacity-60 [clip-path:inset(0_0_0_0)]' : 'z-[3] opacity-100 [clip-path:inset(100%_0_0_0)]'
                  }`}
                  aria-hidden={i !== active}
                >
                  <Img
                    src={a.photo.src}
                    alt={a.photo.alt}
                    fill
                    sizes="46vw"
                    className={`transition-transform duration-[1800ms] ease-[var(--ease-expo)] ${i === active ? 'scale-100' : 'scale-110'}`}
                  />
                </div>
              ))}
              <div className="absolute inset-x-0 bottom-0 z-[4] flex items-end justify-between bg-gradient-to-t from-ink/80 to-transparent p-6 pt-20">
                <p className="eyebrow text-paper/80">{featuredAmenities[active].eyebrow}</p>
                <p className="tabular font-display text-3xl">
                  {String(active + 1).padStart(2, '0')}
                  <span className="text-paper/40"> / {String(total).padStart(2, '0')}</span>
                </p>
              </div>
            </div>
          </div>

          {/* chapters */}
          <ol className="lg:col-span-5 lg:col-start-8">
            {featuredAmenities.map((a, i) => (
              <li
                key={a.id}
                ref={(el) => {
                  chapters.current[i] = el
                }}
                data-index={i}
                className="border-t border-line py-10 first:border-t-0 first:pt-0 lg:flex lg:min-h-[78svh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
              >
                <div data-reveal="image" className="relative mb-8 aspect-[4/3] overflow-hidden bg-umber lg:hidden">
                  <Img src={a.photo.src} alt={a.photo.alt} fill sizes="100vw" />
                </div>
                <div
                  className={`transition-opacity duration-700 ${i === active ? 'lg:opacity-100' : 'lg:opacity-35'}`}
                >
                  <p data-reveal className="eyebrow flex items-center gap-3 text-clay-soft">
                    <span className="tabular">{String(i + 1).padStart(2, '0')}</span>
                    <span className="h-px w-6 bg-current" aria-hidden="true" />
                    {a.eyebrow}
                  </p>
                  <h3 data-reveal style={delay(80)} className="display-md mt-5">
                    {a.title}
                  </h3>
                  <p data-reveal style={delay(160)} className="mt-5 max-w-md leading-relaxed text-mist">
                    {a.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* full index */}
        <div className="mt-24 md:mt-32">
          <div className="flex items-end justify-between gap-6 border-b border-line pb-5">
            <h3 className="font-display text-3xl md:text-4xl">Also at Arena Homes</h3>
            <p className="eyebrow hidden text-mist sm:block">All included</p>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {amenityIndex.map(({ label, detail, icon: Icon }, i) => (
              <li
                key={label}
                data-reveal
                style={delay((i % 7) * 50)}
                className="group border-b border-line py-6 pr-4 transition-colors"
              >
                <Icon className="h-5 w-5 text-clay-soft transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={1.5} aria-hidden="true" />
                <p className="mt-4 text-[0.9375rem] font-medium">{label}</p>
                <p className="mt-1 text-xs text-mist">{detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
