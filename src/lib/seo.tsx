import { useEffect } from 'react'
import { absoluteUrl, site } from '@/config/site'
import { pageTitle, type RouteMeta } from './route-meta'

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

/**
 * Keeps <head> in sync with the current route. The same values are baked
 * into each route's static HTML at build time (scripts/prerender.mjs), so
 * link previews on WhatsApp/Facebook work without JavaScript.
 */
export function useSeo({ title, description, path, image = '/og.jpg', noindex }: RouteMeta & { noindex?: boolean }) {
  useEffect(() => {
    const full = pageTitle(title)
    const url = absoluteUrl(path)
    const img = absoluteUrl(image)
    document.title = full
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', full)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:title', full)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', img)
    setMeta('name', 'robots', noindex || site.isConcept ? 'noindex, nofollow' : 'index, follow')
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path, image, noindex])
}

/** Renders a JSON-LD structured-data block. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
