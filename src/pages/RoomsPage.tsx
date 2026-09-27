import { Link, useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import { absoluteUrl, site } from '@/config/site'
import { roomTypeLabels, rooms, type RoomType } from '@/data/rooms'
import { formatDate, formatKsh, plural } from '@/lib/format'
import { readSearch, writeSearch } from '@/lib/search'
import { JsonLd, useSeo } from '@/lib/seo'
import { staticMeta } from '@/lib/route-meta'
import { waMessages } from '@/lib/whatsapp'
import BookingSearch from '@/components/home/BookingSearch'
import RoomGrid from '@/components/rooms/RoomGrid'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { delay } from '@/components/ui/Motion'

export default function RoomsPage() {
  const [params, setParams] = useSearchParams()
  const search = readSearch(params)
  const query = writeSearch(search)

  useSeo(staticMeta.rooms)

  const results = rooms.filter(
    (r) =>
      (!search.type || r.type === search.type) &&
      r.occupancy >= search.guests &&
      (search.stay === 'long' || Boolean(r.pricing.nightly))
  )

  const setType = (type: RoomType | '') => {
    const next = new URLSearchParams(params)
    if (type) next.set('type', type)
    else next.delete('type')
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const clear = () => setParams(new URLSearchParams(), { replace: true, preventScrollReset: true })
  const filtered = params.toString().length > 0

  const summary = [
    search.stay === 'short' ? 'Short stay' : 'Monthly',
    search.checkIn &&
      (search.stay === 'short'
        ? `${formatDate(search.checkIn)}${search.checkOut ? ` → ${formatDate(search.checkOut)}` : ''}`
        : `from ${formatDate(search.checkIn)} · ${plural(search.months, 'month')}`),
    plural(search.guests, 'guest'),
  ]
    .filter(Boolean)
    .join(' · ')

  const listLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: rooms.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`/rooms/${r.slug}`), name: r.name })),
  }

  return (
    <>
      <JsonLd data={listLd} />
      <section className="bg-linen pb-16 pt-32 md:pt-44">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="text-xs text-taupe">
            <Link to="/" className="link-line">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span aria-current="page" className="text-ink">
              Rooms
            </span>
          </nav>
          <h1 className="display-xl mt-6 animate-fade-up" style={delay(80)}>
            Rooms <em className="italic">&amp;</em> units
          </h1>
          <p className="lede mt-6 max-w-xl text-taupe animate-fade-up" style={delay(180)}>
            Six furnished options, one address. Search by date and group size, or browse everything below.
          </p>
          <div className="mt-10 animate-fade-up md:mt-14" style={delay(260)}>
            <BookingSearch key={params.toString()} initial={search} variant="inline" />
          </div>
        </div>
      </section>

      <section aria-labelledby="results-title" className="bg-paper py-16 md:py-24">
        <div className="shell">
          <div className="flex flex-col gap-6 border-b border-rule pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="results-title" className="font-display text-4xl md:text-5xl" aria-live="polite">
                {results.length === 0 ? 'No matches' : `${plural(results.length, 'space')} available`}
              </h2>
              <p className="mt-2 text-sm text-taupe">{summary}</p>
            </div>
            <div role="group" aria-label="Filter by room type" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:justify-end md:px-0">
              {(['', ...Object.keys(roomTypeLabels)] as (RoomType | '')[]).map((t) => (
                <button
                  key={t || 'all'}
                  type="button"
                  aria-pressed={search.type === t}
                  onClick={() => setType(t)}
                  className={`h-9 shrink-0 rounded-full border px-3.5 text-[0.8125rem] font-medium transition-colors ${
                    search.type === t ? 'border-ink bg-ink text-paper' : 'border-rule hover:border-ink/40'
                  }`}
                >
                  {t ? roomTypeLabels[t] : 'All types'}
                </button>
              ))}
              {filtered && (
                <button type="button" onClick={clear} className="inline-flex h-9 shrink-0 items-center gap-1.5 px-2 text-[0.8125rem] font-medium text-clay-deep">
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>
          </div>

          {results.length > 0 ? (
            <div className="mt-12">
              <RoomGrid rooms={results} query={query} stay={search.stay} layout="grid" />
            </div>
          ) : (
            <div className="mx-auto max-w-lg py-20 text-center">
              <p className="font-display text-3xl">Nothing fits that search — yet.</p>
              <p className="mt-4 text-taupe">
                {search.stay === 'short'
                  ? 'Short stays are available in studios and apartments.'
                  : `No single unit sleeps ${search.guests}. Try fewer guests, or ask us about booking two units side by side.`}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 xs:flex-row">
                <button type="button" onClick={clear} className="btn btn-ink">
                  Show all rooms
                </button>
                <WhatsAppButton message={waMessages.general()} label="Ask us" variant="outline-dark" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* compare */}
      <section aria-labelledby="compare-title" className="bg-linen py-20 md:py-28">
        <div className="shell">
          <h2 id="compare-title" data-reveal className="display-md">
            Compare at a glance
          </h2>
          <div data-reveal style={delay(100)} className="no-scrollbar -mx-4 mt-10 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ink text-[0.6875rem] uppercase tracking-[0.14em] text-taupe">
                  <th scope="col" className="py-3 pr-4 font-semibold">Space</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Size</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Sleeps</th>
                  <th scope="col" className="py-3 pr-4 font-semibold">Bathroom</th>
                  <th scope="col" className="py-3 pr-4 text-right font-semibold">Monthly</th>
                  <th scope="col" className="py-3 text-right font-semibold">Nightly</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.slug} className="group border-b border-rule">
                    <th scope="row" className="py-4 pr-4 font-normal">
                      <Link to={`/rooms/${r.slug}`} className="font-display text-xl link-line">
                        {r.name}
                      </Link>
                    </th>
                    <td className="tabular py-4 pr-4">{r.sizeSqm} m²</td>
                    <td className="tabular py-4 pr-4">{r.occupancy}</td>
                    <td className="py-4 pr-4 text-taupe">{r.bathroom}</td>
                    <td className="tabular py-4 pr-4 text-right font-semibold">
                      {formatKsh(r.pricing.monthly)}
                      {r.pricing.per === 'bed' && <span className="font-normal text-taupe"> /bed</span>}
                    </td>
                    <td className="tabular py-4 text-right">{r.pricing.nightly ? formatKsh(r.pricing.nightly) : <span className="text-taupe">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {site.isConcept && <p className="mt-4 text-xs text-taupe">Sample prices for the concept. Sizes are approximate.</p>}
        </div>
      </section>
    </>
  )
}
