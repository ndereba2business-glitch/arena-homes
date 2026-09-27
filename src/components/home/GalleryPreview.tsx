import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { gallery } from '@/data/gallery'
import SectionHeading from '@/components/ui/SectionHeading'
import Gallery from '@/components/gallery/Gallery'

export default function GalleryPreview() {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="dark-surface bg-ink py-24 text-paper md:py-36">
      <div className="shell">
        <SectionHeading
          id="gallery-title"
          eyebrow="Gallery"
          tone="dark"
          title={
            <>
              Take a look <em className="italic text-clay-soft">around.</em>
            </>
          }
          aside={
            <Link to="/gallery" className="group inline-flex items-center gap-2 text-sm font-semibold">
              <span className="link-line-static">Full gallery · {gallery.length} photos</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <div className="mt-12 md:mt-16">
          <Gallery limit={9} />
        </div>
      </div>
    </section>
  )
}
