import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileDock from './MobileDock'
import { RevealObserver } from '@/components/ui/Motion'

/** Routes that render their own sticky booking bar on mobile. */
const hasOwnDock = (pathname: string) => /^\/rooms\/[^/]+/.test(pathname) || pathname === '/book'

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:bg-paper focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar />
      {/* keyed by path: each route change replays the entrance */}
      <main id="main" key={pathname} className="page-enter">
        <Outlet />
      </main>
      <Footer />
      {!hasOwnDock(pathname) && <MobileDock />}
      <RevealObserver />
      <ScrollRestoration />
    </>
  )
}
