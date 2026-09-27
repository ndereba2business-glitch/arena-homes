import { useState } from 'react'
import { ArrowUpRight, BookOpen, Bus, HeartPulse, ShoppingBag, Trees, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { contact, mapsLink, site } from '@/config/site'
import { nearby, propertyPin, type PlaceCategory } from '@/data/nearby'
import SectionHeading from '@/components/ui/SectionHeading'
import { delay } from '@/components/ui/Motion'

const icons: Record<PlaceCategory, LucideIcon> = {
  Education: BookOpen,
  Shopping: ShoppingBag,
  Food: UtensilsCrossed,
  Transport: Bus,
  Health: HeartPulse,
  Leisure: Trees,
}
const categories = ['All', ...new Set(nearby.map((p) => p.category))] as const

// map space: 400 × 500
const X = (x: number) => x * 4
const Y = (y: number) => y * 5

export default function LocationSection() {
  const [category, setCategory] = useState<string>('All')
  const [hover, setHover] = useState<number | null>(null)
  const shown = (i: number) => category === 'All' || nearby[i].category === category
  const hasUnconfirmed = nearby.some((p) => !p.confirmed)
  const px = X(propertyPin.x)
  const py = Y(propertyPin.y)

  return (
    <section id="location" aria-labelledby="location-title" className="bg-stone py-24 md:py-36">
      <div className="shell">
        <SectionHeading
          id="location-title"
          eyebrow="Location"
          title={
            <>
              Close to what <em className="italic">matters.</em>
            </>
          }
        >
          In {contact.location.area}, minutes from campus, the CBD, the matatu stage and the weekend shop — with the lake and Menengai for
          everything else.
        </SectionHeading>

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-12">
          {/* map */}
          <div className="min-w-0 lg:order-2 lg:col-span-7">
            <div data-reveal="fade" className="dark-surface relative aspect-square overflow-hidden bg-ink text-paper sm:aspect-[5/4] lg:sticky lg:top-24 lg:aspect-[4/5]">
              <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                    <path d="M25 0H0v25" fill="none" stroke="rgb(243 238 229 / .05)" strokeWidth="1" />
                  </pattern>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0" stopColor="#b4643c" stopOpacity=".35" />
                    <stop offset="1" stopColor="#b4643c" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="400" height="500" fill="url(#grid)" />

                {/* Lake Nakuru */}
                <path
                  d="M150 395c28-22 78-24 112-6 30 16 48 46 40 74-6 22-10 40-4 60H120c8-22 2-40-6-58-10-24 10-50 36-70Z"
                  fill="rgb(243 238 229 / .06)"
                  stroke="rgb(243 238 229 / .18)"
                />
                <text x="212" y="458" textAnchor="middle" className="fill-paper/45 font-display italic" fontSize="15">
                  Lake Nakuru
                </text>

                {/* Menengai crater */}
                <circle cx="330" cy="46" r="36" fill="none" stroke="rgb(243 238 229 / .16)" strokeDasharray="2 4" />
                <circle cx="330" cy="46" r="22" fill="none" stroke="rgb(243 238 229 / .1)" />
                <text x="330" y="100" textAnchor="middle" className="fill-paper/40 font-display italic" fontSize="13">
                  Menengai
                </text>

                {/* roads */}
                <g fill="none" stroke="rgb(243 238 229 / .22)" strokeLinecap="round">
                  <path d="M400 330C330 300 270 262 210 238S70 160 0 128" strokeWidth="3" />
                  <path d="M0 250C80 250 150 240 232 262s120 60 168 70" strokeWidth="1.5" />
                  <path d="M180 0c6 70 14 140 30 238 10 60 6 110-10 150" strokeWidth="1.5" />
                  <path d="M300 120c-40 60-60 110-60 180" strokeWidth="1" />
                  <path d="M60 60c60 50 110 90 130 170" strokeWidth="1" />
                  <path d="M120 330c40-10 90-20 150 0" strokeWidth="1" />
                </g>
                <text x="18" y="118" className="fill-paper/35" fontSize="8.5" letterSpacing="1.5">
                  A104 · ELDORET
                </text>
                <text x="382" y="322" textAnchor="end" className="fill-paper/35" fontSize="8.5" letterSpacing="1.5">
                  NAIROBI · A104
                </text>

                {/* routes from the property */}
                <g fill="none" strokeLinecap="round">
                  {nearby.map((p, i) => (
                    <path
                      key={p.name}
                      d={`M${px} ${py} Q ${(px + X(p.x)) / 2 + 18} ${(py + Y(p.y)) / 2 - 18} ${X(p.x)} ${Y(p.y)}`}
                      pathLength={1}
                      className="map-route"
                      stroke={hover === i ? '#d99a72' : 'rgb(243 238 229 / .22)'}
                      strokeWidth={hover === i ? 1.6 : 1}
                      style={{ opacity: shown(i) ? 1 : 0.1, transition: 'opacity .5s, stroke .3s', transitionDelay: `${i * 70}ms` }}
                    />
                  ))}
                </g>

                {/* places */}
                {nearby.map((p, i) => (
                  <g key={p.name} style={{ opacity: shown(i) ? 1 : 0.15, transition: 'opacity .5s' }}>
                    <circle cx={X(p.x)} cy={Y(p.y)} r={hover === i ? 7 : 4.5} fill={hover === i ? '#d99a72' : '#f3eee5'} style={{ transition: 'r .3s' }} />
                    {hover === i && (
                      <text x={X(p.x)} y={Y(p.y) - 14} textAnchor="middle" className="fill-paper" fontSize="11" fontWeight="600">
                        {p.name.split(' — ')[0]}
                      </text>
                    )}
                  </g>
                ))}

                {/* property */}
                <circle cx={px} cy={py} r="60" fill="url(#glow)" />
                <rect x={px - 9} y={py - 9} width="18" height="18" fill="#b4643c" transform={`rotate(45 ${px} ${py})`} />
                <text x={px + 18} y={py + 4} className="fill-paper font-display" fontSize="17">
                  {site.name}
                </text>
              </svg>

              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-ink via-ink/80 to-transparent p-4 pt-14 sm:p-6 sm:pt-16">
                <p className="text-xs text-mist">Illustrative map · not to scale</p>
                <a href={mapsLink()} target="_blank" rel="noopener noreferrer" className="btn btn-paper min-h-11! px-4!">
                  Open in Google Maps <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* places list */}
          <div className="min-w-0 lg:order-1 lg:col-span-5">
            <div role="group" aria-label="Filter places" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={`h-9 shrink-0 rounded-full border px-3.5 text-[0.8125rem] font-medium transition-colors ${
                    category === c ? 'border-ink bg-ink text-paper' : 'border-ink/15 hover:border-ink/40'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <ul className="mt-8 border-t border-ink/15">
              {nearby.map((p, i) => {
                if (!shown(i)) return null
                const Icon = icons[p.category]
                return (
                  <li
                    key={p.name}
                    data-reveal
                    style={delay(i * 40)}
                    tabIndex={0}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    className={`flex items-center gap-4 border-b border-ink/15 px-1 py-4 outline-offset-0 transition-colors ${hover === i ? 'bg-paper/50' : ''}`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors ${hover === i ? 'border-clay bg-clay text-paper' : 'border-ink/15'}`}>
                      <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium leading-snug">{p.name}</span>
                      <span className="block text-xs text-taupe">{p.category}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="tabular block font-display text-2xl leading-none">
                        {p.confirmed ? '' : '≈ '}
                        {p.minutes}
                        <span className="ml-0.5 font-sans text-xs text-taupe">min</span>
                      </span>
                      <span className="block text-[0.6875rem] text-taupe">{p.mode === 'walk' ? 'on foot' : 'by car'}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
            {hasUnconfirmed && (
              <p className="mt-5 text-xs leading-relaxed text-taupe">
                ≈ Indicative travel times from central {contact.location.area}. Exact times will be confirmed for the property address.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
