import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { contact, nav, site, socials } from '@/config/site'
import { waMessages, whatsappLink } from '@/lib/whatsapp'
import { Logo, WhatsAppIcon, socialIcon } from '@/components/ui/Brand'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

/**
 * Transparent over the home hero, solid everywhere else. Tucks away while
 * scrolling down and returns on the way up; never hides while the menu is open.
 */
export default function Navbar() {
  const { pathname, key } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)
  // routes whose first screen is dark: the bar starts transparent over them
  const overHero = pathname === '/' || pathname === '/gallery'

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 480 && y > lastY.current + 4 ? true : y < lastY.current - 4 ? false : (h) => h)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close the menu on navigation (adjusting state during render, per React guidance)
  const [lastKey, setLastKey] = useState(key)
  if (lastKey !== key) {
    setLastKey(key)
    setOpen(false)
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const transparent = overHero && !scrolled && !open
  const onDark = transparent || open
  const tucked = hidden && !open

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-transform duration-700 ease-[var(--ease-expo)] ${tucked ? '-translate-y-full' : ''}`}
      >
        {site.isConcept && (
          <div
            className={`overflow-hidden bg-ink text-mist transition-[max-height] duration-500 ${scrolled || open ? 'max-h-0' : 'max-h-8'}`}
          >
            <p className="shell flex h-8 items-center justify-center gap-1.5 text-center text-[0.625rem] font-medium uppercase tracking-[0.18em]">
              <span className="hidden sm:inline">A concept by</span>
              <a href={site.builtBy.url} target="_blank" rel="noopener noreferrer" className="text-paper link-line">
                {site.builtBy.name}
              </a>
              <span aria-hidden="true">·</span>
              <span>Sample prices &amp; reviews</span>
            </p>
          </div>
        )}
        <div
          className={`border-b transition-[background-color,border-color,color] duration-500 ${
            transparent
              ? 'border-transparent bg-transparent text-paper'
              : open
                ? 'border-line bg-ink text-paper'
                : 'border-rule bg-linen/88 text-ink backdrop-blur-xl backdrop-saturate-150'
          }`}
        >
          <nav
            aria-label="Main"
            className={`shell flex items-center justify-between gap-6 transition-[height] duration-500 ease-[var(--ease-expo)] ${
              scrolled ? 'h-16' : 'h-[4.5rem] lg:h-20'
            }`}
          >
            <Link to="/" aria-label={`${site.name} — home`} className="shrink-0">
              <Logo />
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      `group relative px-3.5 py-2 text-[0.8125rem] font-medium tracking-[0.02em] transition-opacity ${
                        isActive && !item.to.includes('#') ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          className={`absolute inset-x-3.5 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-[var(--ease-expo)] ${
                            isActive && !item.to.includes('#') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href={whatsappLink(waMessages.general())}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp (opens WhatsApp)"
                className={`hidden h-11 w-11 place-items-center rounded-full border transition-colors sm:grid ${
                  onDark ? 'border-paper/25 hover:border-paper' : 'border-ink/15 hover:border-ink'
                }`}
              >
                <WhatsAppIcon className="h-[1.1rem] w-[1.1rem]" />
              </a>
              <Link
                to="/book"
                className={`btn hidden min-h-11! px-5! sm:inline-flex ${onDark ? 'btn-paper' : 'btn-ink'}`}
              >
                Book now
              </Link>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="relative grid h-11 w-11 place-items-center lg:hidden"
              >
                <span className="relative block h-3 w-6" aria-hidden="true">
                  <span
                    className={`absolute left-0 block h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-expo)] ${open ? 'top-1.5 rotate-45' : 'top-0'}`}
                  />
                  <span
                    className={`absolute left-0 block h-px bg-current transition-all duration-500 ease-[var(--ease-expo)] ${open ? 'top-1.5 w-6 -rotate-45' : 'top-3 w-4'}`}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        id="mobile-menu"
        inert={!open}
        aria-hidden={!open}
        className={`dark-surface fixed inset-0 z-[90] flex flex-col bg-ink text-paper transition-[clip-path] duration-700 ease-[var(--ease-cine)] lg:hidden ${
          open ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_0_100%_0)]'
        }`}
      >
        <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-24 sm:px-8">
          <ul className="flex flex-col">
            {nav.map((item, i) => (
              <li
                key={item.label}
                className={`border-b border-line transition-[opacity,transform] duration-700 ease-[var(--ease-expo)] ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: open ? `${150 + i * 55}ms` : '0ms' }}
              >
                <Link to={item.to} className="flex items-baseline gap-4 py-3.5">
                  <span className="eyebrow tabular w-6 text-mist">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-[2.6rem] leading-none">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={`mt-auto pt-10 transition-opacity duration-700 ${open ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: open ? '500ms' : '0ms' }}
          >
            <p className="flex items-center gap-2 text-sm text-mist">
              <MapPin className="h-4 w-4 text-clay-soft" aria-hidden="true" />
              {contact.location.area}, {contact.location.country}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Link to="/book" className="btn btn-paper">
                Book now
              </Link>
              <WhatsAppButton message={waMessages.general()} label="WhatsApp" />
            </div>
            <div className="mt-6 flex items-center justify-between text-mist">
              <div className="flex gap-5">
                {socials.map((s) => {
                  const Icon = socialIcon[s.id]
                  return s.url ? (
                    <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="hover:text-paper">
                      <Icon className="h-5 w-5" />
                    </a>
                  ) : (
                    <span key={s.id} title={`${s.label} — link added at launch`} className="opacity-50">
                      <Icon className="h-5 w-5" aria-label={s.label} />
                    </span>
                  )
                })}
              </div>
              <Link to="/rooms" className="inline-flex items-center gap-1 text-sm text-paper">
                All rooms <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
