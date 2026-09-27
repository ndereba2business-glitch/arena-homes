import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useSeo } from '@/lib/seo'
import { ArchMark } from '@/components/ui/Brand'

export default function NotFoundPage() {
  useSeo({ title: 'Page not found', description: 'This page doesn’t exist.', path: '/404', noindex: true })
  return (
    <section className="dark-surface flex min-h-[90svh] items-center bg-ink pb-24 pt-40 text-paper">
      <div className="shell">
        <ArchMark className="h-14 w-auto text-clay" />
        <p className="eyebrow mt-8 text-mist">Error 404</p>
        <h1 className="display-xl mt-5 max-w-[12ch]">
          This door doesn’t <em className="italic text-clay-soft">open.</em>
        </h1>
        <p className="lede mt-6 max-w-md text-mist">The page you’re looking for has moved or never existed. Let’s get you somewhere more comfortable.</p>
        <div className="mt-10 flex flex-col gap-3 xs:flex-row">
          <Link to="/rooms" className="btn btn-paper">
            Browse rooms <ArrowRight className="btn-arrow h-4 w-4" />
          </Link>
          <Link to="/" className="btn btn-ghost-light">
            Back home
          </Link>
        </div>
      </div>
    </section>
  )
}
