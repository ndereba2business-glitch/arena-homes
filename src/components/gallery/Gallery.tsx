import { useState } from 'react'
import { Plus } from 'lucide-react'
import { gallery, galleryCategories, type GalleryItem } from '@/data/gallery'
import Img from '@/components/ui/Img'
import Lightbox from '@/components/ui/Lightbox'
import { delay } from '@/components/ui/Motion'

/**
 * Filterable masonry gallery. Photos keep their natural proportions, so the
 * columns fall into an editorial rhythm rather than a uniform grid.
 */
export default function Gallery({
  items = gallery,
  limit,
  tone = 'dark',
}: {
  items?: GalleryItem[]
  limit?: number
  tone?: 'dark' | 'light'
}) {
  const [category, setCategory] = useState<string>('All')
  const [open, setOpen] = useState<number | null>(null)
  const filtered = items.filter((g) => category === 'All' || g.category === category)
  const list = limit ? filtered.slice(0, limit) : filtered
  const dark = tone === 'dark'

  return (
    <>
      <div role="group" aria-label="Filter photos" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {['All', ...galleryCategories].map((c) => {
          const count = c === 'All' ? items.length : items.filter((g) => g.category === c).length
          const on = category === c
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => setCategory(c)}
              className={`h-10 shrink-0 rounded-full border px-4 text-[0.8125rem] font-medium transition-colors ${
                dark
                  ? on
                    ? 'border-paper bg-paper text-ink'
                    : 'border-line text-paper hover:border-paper/50'
                  : on
                    ? 'border-ink bg-ink text-paper'
                    : 'border-rule hover:border-ink/40'
              }`}
            >
              {c}
              {!limit && <span className={`tabular ml-2 text-xs ${on ? 'opacity-60' : dark ? 'text-mist' : 'text-taupe'}`}>{count}</span>}
            </button>
          )
        })}
      </div>

      <ul key={category} className="mt-10 columns-2 gap-3 sm:gap-4 md:mt-14 lg:columns-3 lg:gap-6">
        {list.map((g, i) => (
          <li key={g.src} data-reveal style={delay((i % 3) * 90)} className="mb-3 break-inside-avoid sm:mb-4 lg:mb-6">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className={`group relative block w-full overflow-hidden text-left ${dark ? 'bg-umber' : 'bg-stone'}`}
              aria-label={`Open photo: ${g.alt}`}
            >
              <Img
                src={g.src}
                alt={g.alt}
                sizes="(min-width: 1024px) 31vw, 48vw"
                className="transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.05]"
              />
              <span className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-ink/70 via-transparent to-transparent p-3 text-paper opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-4">
                <span className="eyebrow">{g.category}</span>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-paper/40">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <Lightbox
          photos={list.map((g) => ({ src: g.src, alt: g.alt }))}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          label="Gallery"
        />
      )}
    </>
  )
}
