/**
 * Post-build: bakes each route's <title>, description, canonical and Open Graph
 * tags into its own static HTML (dist/rooms/studio/index.html, …) so link
 * previews on WhatsApp, Facebook and X show the right page without running JS.
 * Also writes sitemap.xml, robots.txt and a 404.html fallback.
 *
 * Route data comes straight from the app (src/lib/route-meta.ts) via Vite,
 * so there is a single source of truth.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { createServer } from 'vite'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')

const server = await createServer({ root, logLevel: 'error', server: { middlewareMode: true }, appType: 'custom' })
const { allRouteMeta, pageTitle, isConcept, siteUrl } = await server.ssrLoadModule('/src/lib/route-meta.ts')
await server.close()

const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const abs = (p) => `${siteUrl}${p}`

function render(meta, { noindex = isConcept } = {}) {
  const title = esc(pageTitle(meta.title))
  const description = esc(meta.description)
  const url = esc(abs(meta.path))
  const image = esc(abs(meta.image ?? '/og.jpg'))
  const set = (html, attr, key, value) =>
    html.replace(new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`), `$1${value}$2`)
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
  html = set(html, 'name', 'description', description)
  html = set(html, 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
  html = set(html, 'property', 'og:title', title)
  html = set(html, 'property', 'og:description', description)
  html = set(html, 'property', 'og:url', url)
  html = set(html, 'property', 'og:image', image)
  html = set(html, 'name', 'twitter:title', title)
  html = set(html, 'name', 'twitter:description', description)
  html = set(html, 'name', 'twitter:image', image)
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
  return html
}

const routes = allRouteMeta()
for (const meta of routes) {
  const file = meta.path === '/' ? path.join(dist, 'index.html') : path.join(dist, meta.path, 'index.html')
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, render(meta))
}
await fs.writeFile(
  path.join(dist, '404.html'),
  render({ path: '/404', title: 'Page not found', description: 'This page doesn’t exist.' }, { noindex: true })
)

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${abs(r.path)}</loc><lastmod>${today}</lastmod><priority>${r.path === '/' ? '1.0' : r.path.startsWith('/rooms/') ? '0.8' : '0.6'}</priority></url>`).join('\n')}
</urlset>
`
await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap)
await fs.writeFile(
  path.join(dist, 'robots.txt'),
  isConcept
    ? '# Concept preview — not indexed until launch (set site.isConcept = false).\nUser-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`
)

console.log(`prerendered ${routes.length} routes + 404, sitemap.xml, robots.txt`)
