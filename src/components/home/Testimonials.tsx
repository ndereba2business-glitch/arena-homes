import { Link } from 'react-router-dom'
import { getRoom } from '@/data/rooms'
import { featuredQuote, reviews } from '@/data/reviews'
import { delay } from '@/components/ui/Motion'

export default function Testimonials() {
  const hasSamples = reviews.some((r) => r.isSample)
  const [lead, ...rest] = reviews
  const leadRoom = getRoom(lead.roomSlug)

  return (
    <section aria-labelledby="reviews-title" className="bg-linen py-24 md:py-36">
      <div className="shell">
        <div className="flex items-center justify-between gap-6">
          <p data-reveal className="eyebrow flex items-center gap-3 text-clay-deep">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            Resident stories
          </p>
          {hasSamples && (
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-taupe">Sample reviews · replaced at launch</p>
          )}
        </div>

        <figure className="mt-10 grid gap-10 lg:grid-cols-12">
          <blockquote id="reviews-title" data-reveal style={delay(80)} className="display-lg lg:col-span-10">
            <span className="text-clay" aria-hidden="true">
              “
            </span>
            {featuredQuote}
            <span className="text-clay" aria-hidden="true">
              ”
            </span>
          </blockquote>
          <figcaption data-reveal style={delay(160)} className="flex items-center gap-4 lg:col-span-12">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-xl text-paper" aria-hidden="true">
              {lead.name[0]}
            </span>
            <span>
              <span className="block font-semibold">{lead.name}</span>
              <span className="block text-sm text-taupe">
                {lead.detail} · {leadRoom?.name}
              </span>
            </span>
          </figcaption>
        </figure>
      </div>

      <ul className="rail no-scrollbar mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto md:mt-24 md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-12 md:overflow-visible lg:grid-cols-4 lg:px-8 xl:px-14 min-[94rem]:mx-auto min-[94rem]:max-w-[94rem]">
        {[lead, ...rest].map((r, i) => {
          const room = getRoom(r.roomSlug)
          return (
            <li
              key={r.id}
              data-reveal
              style={delay(i * 90)}
              className={`w-[80vw] max-w-[22rem] shrink-0 snap-start border-t border-ink pt-6 md:w-auto md:max-w-none ${i === 0 ? 'md:hidden' : ''}`}
            >
              <figure className="flex h-full flex-col">
                <blockquote className="flex-1 leading-relaxed text-ink/85">“{r.quote}”</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-semibold">{r.name}</span>
                  <span className="text-taupe"> · {r.detail}</span>
                  {room && (
                    <Link to={`/rooms/${room.slug}`} className="mt-1 block text-xs text-clay-deep link-line w-fit">
                      {room.name}
                    </Link>
                  )}
                </figcaption>
              </figure>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
