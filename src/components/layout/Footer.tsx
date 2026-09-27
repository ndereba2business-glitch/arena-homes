import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { contact, mapsLink, site, socials } from '@/config/site'
import { waMessages, whatsappLink } from '@/lib/whatsapp'
import { ArchMark, socialIcon } from '@/components/ui/Brand'

const footerNav = [
  { label: 'Rooms', to: '/rooms' },
  { label: 'Amenities', to: '/#amenities' },
  { label: 'Location', to: '/#location' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'FAQs', to: '/#faqs' },
  { label: 'Book a stay', to: '/book' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="dark-surface relative overflow-hidden bg-ink pb-28 pt-20 text-paper md:pb-28 md:pt-28">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <p className="font-display text-[2.6rem] leading-none tracking-[-0.01em]">{site.name}</p>
            <p className="mt-4 max-w-xs text-mist">{site.tagline}</p>
            <div className="mt-8 flex gap-3">
              {socials.map((s) => {
                const Icon = socialIcon[s.id]
                const cls = 'grid h-11 w-11 place-items-center rounded-full border border-line transition-colors'
                return s.url ? (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={`${cls} hover:border-paper`}>
                    <Icon className="h-[1.1rem] w-[1.1rem]" />
                  </a>
                ) : (
                  <span key={s.id} title={`${s.label} — link added at launch`} className={`${cls} opacity-50`}>
                    <Icon className="h-[1.1rem] w-[1.1rem]" aria-label={s.label} />
                  </span>
                )
              })}
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow text-mist">Navigate</p>
            <ul className="mt-5 space-y-2.5">
              {footerNav.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="link-line">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-mist">Contact</p>
            <ul className="mt-5 space-y-2.5">
              <li>
                {contact.phone ? (
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="link-line">
                    {contact.phone}
                  </a>
                ) : (
                  <span className="text-mist">Phone — to be confirmed</span>
                )}
              </li>
              <li>
                <a href={whatsappLink(waMessages.general())} target="_blank" rel="noopener noreferrer" className="link-line">
                  WhatsApp
                </a>
              </li>
              <li>
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="link-line">
                    {contact.email}
                  </a>
                ) : (
                  <span className="text-mist">Email — to be confirmed</span>
                )}
              </li>
              <li className="text-mist">{contact.hours}</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-mist">Location</p>
            <address className="mt-5 not-italic leading-relaxed">
              {contact.location.address && (
                <>
                  {contact.location.address}
                  <br />
                </>
              )}
              {contact.location.area}, {contact.location.region}
              <br />
              {contact.location.country}
            </address>
            <a href={mapsLink()} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-clay-soft">
              <span className="link-line">Open in Google Maps</span> <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* oversized wordmark */}
        <div className="pointer-events-none mt-20 select-none md:mt-28" aria-hidden="true">
          <div className="flex items-end gap-[2vw] text-paper/[0.07]">
            <ArchMark className="h-[14vw] w-auto shrink-0 lg:h-[11vw]" />
            <span className="font-display text-[19vw] leading-[0.75] tracking-[-0.03em] lg:text-[15vw]">{site.name.split(' ')[0]}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {Math.max(year, 2026)} {site.name}. All rights reserved.
          </p>
          <p>
            Website by{' '}
            <a href={site.builtBy.url} target="_blank" rel="noopener noreferrer" className="text-paper link-line">
              {site.builtBy.name}
            </a>
            <span className="mx-2" aria-hidden="true">·</span>
            Photography via Unsplash
          </p>
        </div>
      </div>
    </footer>
  )
}
