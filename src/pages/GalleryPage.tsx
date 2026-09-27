import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useSeo } from '@/lib/seo'
import { staticMeta } from '@/lib/route-meta'
import Gallery from '@/components/gallery/Gallery'
import { delay } from '@/components/ui/Motion'

export default function GalleryPage() {
  useSeo(staticMeta.gallery)

  return (
    <section className="dark-surface min-h-screen bg-ink pb-24 pt-32 text-paper md:pb-36 md:pt-44">
      <div className="shell">
        <nav aria-label="Breadcrumb" className="text-xs text-mist">
          <Link to="/" className="link-line">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span aria-current="page" className="text-paper">
            Gallery
          </span>
        </nav>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h1 className="display-xl animate-fade-up" style={delay(80)}>
            Take a look <em className="italic text-clay-soft">around.</em>
          </h1>
          <p className="max-w-xs text-mist animate-fade-up md:text-right" style={delay(180)}>
            The rooms, the building and the life around it. Tap any photo to see it full-screen.
          </p>
        </div>
        <div className="mt-12 md:mt-16">
          <Gallery />
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center">
          <p className="font-display text-3xl md:text-4xl">Like what you see?</p>
          <div className="flex flex-col gap-3 xs:flex-row">
            <Link to="/book?kind=viewing" className="btn btn-ghost-light">
              Book a viewing
            </Link>
            <Link to="/rooms" className="btn btn-paper">
              Explore rooms <ArrowRight className="btn-arrow h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
