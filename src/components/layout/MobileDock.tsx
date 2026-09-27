import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { waMessages, whatsappLink } from '@/lib/whatsapp'
import { WhatsAppIcon } from '@/components/ui/Brand'

/**
 * App-style bottom bar on phones: a thumb-reach "Book" action and WhatsApp.
 * On larger screens a single floating WhatsApp button takes its place.
 */
export default function MobileDock() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-[80] border-t border-rule bg-paper/92 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-700 ease-[var(--ease-expo)] md:hidden ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
        inert={!visible}
      >
        <div className="flex gap-2.5">
          <a
            href={whatsappLink(waMessages.general())}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp (opens WhatsApp)"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-[2px] bg-whatsapp text-[#062611]"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <Link to="/rooms" className="btn btn-ghost-dark min-h-12! flex-1 px-3!">
            Rooms
          </Link>
          <Link to="/book" className="btn btn-ink min-h-12! flex-[1.4] px-3!">
            Book a space <ArrowRight className="btn-arrow h-4 w-4" />
          </Link>
        </div>
      </div>

      <a
        href={whatsappLink(waMessages.general())}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp (opens WhatsApp)"
        className={`group fixed bottom-6 right-6 z-[80] hidden h-14 items-center gap-3 rounded-full bg-whatsapp pl-4 pr-5 text-[#062611] shadow-[0_18px_40px_-14px_rgba(19,17,14,.55)] transition-[opacity,transform] duration-700 ease-[var(--ease-expo)] md:flex ${
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <span className="animate-pulse-ring absolute inset-0 rounded-full bg-whatsapp" aria-hidden="true" />
        <WhatsAppIcon className="relative h-6 w-6" />
        <span className="relative text-[0.6875rem] font-semibold uppercase tracking-[0.16em]">Chat with us</span>
      </a>
    </>
  )
}
