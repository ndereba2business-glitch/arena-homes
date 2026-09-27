import { useRef, useState } from 'react'
import { Grid2x2 } from 'lucide-react'
import type { Photo } from '@/data/images'
import Img from '@/components/ui/Img'
import Lightbox from '@/components/ui/Lightbox'

/**
 * Room photos: an editorial mosaic on desktop (one hero frame + up to four),
 * a swipeable full-bleed track on mobile. Any photo opens the lightbox.
 */
export default function RoomGallery({ photos, name }: { photos: Photo[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const [current, setCurrent] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  const mosaic = photos.slice(0, 5)

  const onScroll = () => {
    const el = track.current
    if (el) setCurrent(Math.round(el.scrollLeft / el.clientWidth))
  }

  return (
    <>
      {/* mobile track */}
      <div className="relative -mx-4 sm:-mx-8 md:hidden">
        <div ref={track} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {photos.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setOpen(i)}
              className="relative aspect-[4/3] w-full shrink-0 snap-center bg-stone"
              aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.alt}`}
            >
              <Img src={p.src} alt={p.alt} fill priority={i === 0} sizes="100vw" />
            </button>
          ))}
        </div>
        <span className="tabular pointer-events-none absolute bottom-3 right-3 bg-ink/70 px-2.5 py-1 text-xs font-medium text-paper backdrop-blur">
          {current + 1} / {photos.length}
        </span>
      </div>

      {/* desktop mosaic */}
      <div className={`hidden gap-2 md:grid md:h-[min(68vh,40rem)] ${mosaic.length >= 3 ? 'md:grid-cols-4 md:grid-rows-2' : 'md:grid-cols-2'}`}>
        {mosaic.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden bg-stone ${
              i === 0 ? (mosaic.length >= 3 ? 'col-span-2 row-span-2' : '') : mosaic.length === 3 ? 'col-span-2' : mosaic.length === 4 && i === 3 ? 'col-span-2' : ''
            }`}
            aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.alt}`}
          >
            <Img
              src={p.src}
              alt={p.alt}
              fill
              priority={i === 0}
              sizes={i === 0 ? '50vw' : '25vw'}
              className="transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>
      <div className="mt-3 hidden justify-end md:flex">
        <button type="button" onClick={() => setOpen(0)} className="inline-flex items-center gap-2 text-sm font-semibold">
          <Grid2x2 className="h-4 w-4" /> <span className="link-line-static">View all {photos.length} photos</span>
        </button>
      </div>

      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} label={`${name} photos`} />}
    </>
  )
}
