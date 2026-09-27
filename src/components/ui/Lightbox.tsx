import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import type { Photo } from '@/data/images'
import Img from './Img'

/**
 * Full-screen photo viewer on a native <dialog> (focus trap + Esc for free).
 * Arrow keys and swipe navigate. Render it only while open.
 */
export default function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
  label = 'Photo viewer',
}: {
  photos: Photo[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
  label?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const touchX = useRef<number | null>(null)
  const count = photos.length
  const go = (dir: 1 | -1) => onIndex((index + dir + count) % count)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    d.showModal()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
      if (d.open) d.close()
    }
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  const photo = photos[index]

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onKeyDown={onKey}
      className="dark-surface m-0 h-[100dvh] max-h-none w-screen max-w-none bg-ink/97 p-0 text-paper backdrop:bg-ink/90"
    >
      <div
        className="relative flex h-full flex-col"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <p className="eyebrow tabular text-mist" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Close"
            className="grid h-11 w-11 place-items-center rounded-full border border-line transition-colors hover:border-paper"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <figure className="relative mx-auto flex min-h-0 w-full flex-1 flex-col items-center justify-center px-4 pb-4 sm:px-20">
          <div key={photo.src} className="animate-fade-in relative flex min-h-0 w-full flex-1 items-center justify-center">
            <Img src={photo.src} alt={photo.alt} sizes="100vw" priority fill className="object-contain!" style={{ backgroundImage: 'none' }} />
          </div>
          <figcaption className="mt-4 max-w-xl text-center text-sm text-mist">{photo.alt}</figcaption>
        </figure>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/40 transition-colors hover:border-paper sm:grid"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-line bg-ink/40 transition-colors hover:border-paper sm:grid"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="flex justify-center gap-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:hidden">
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="grid h-11 w-11 place-items-center rounded-full border border-line">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="grid h-11 w-11 place-items-center rounded-full border border-line">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
