# Arena Homes

A website for **Arena Homes**, furnished student rooms, studios and apartments in Nakuru, Kenya. It lets students and short-stay guests browse rooms, check what's nearby, and book a viewing or reserve a room online or on WhatsApp.

> A Forge Eleven concept. Prices, reviews and travel times are sample content until the property owner confirms them (see `site.isConcept`).

## Features

- **Room explorer:** filter and compare rooms, then open each room's detail page with its gallery, inclusions and pricing.
- **Booking flow:** a reserve panel and a `/book` page that hand off to WhatsApp with a pre-filled message.
- **Location section:** an illustrated SVG map of Nakuru with filterable nearby places and travel times.
- **Gallery** with a keyboard-accessible lightbox.
- **Responsive images:** WebP renditions at several widths, with blurred placeholders generated at build time.
- **SEO per route:** a prerender step bakes each page's title, description, canonical and Open Graph tags into static HTML, so link previews work without JavaScript. It also writes `sitemap.xml` and `robots.txt`.
- **Code splitting:** the home page ships in the main bundle, and every other route loads on demand.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router 7 · lucide-react · sharp (image tooling)

## Getting started

Requires Node.js 20.19+ or 22+.

```bash
npm install
npm run dev        # start the dev server
npm run build      # typecheck, production build, then prerender routes
npm run preview    # serve the production build locally
npm run lint
```

## Project structure

```
src/
  config/site.ts   Property facts: name, contact, policies, navigation
  data/            Rooms, amenities, nearby places, reviews, FAQs, gallery
  components/      ui/ primitives, layout/, home/ sections, rooms/, gallery/
  pages/           Route components (Home, Rooms, Room, Gallery, Book, 404)
  lib/             Booking, WhatsApp links, search, SEO and route metadata
scripts/
  process-images.mjs   Originals in /images-src → public/images + manifest
  share-assets.mjs     Generates og.jpg and apple-touch-icon.png
  prerender.mjs        Post-build static HTML per route, sitemap, robots
```

## Re-skinning for another property

Every business-specific fact lives in `src/config/site.ts` and `src/data/`. Values marked `TODO(client)` are placeholders. When a field is empty, the UI hides it or shows "to be confirmed", so the site never displays made-up details.

### Images

1. Put the original photos in `/images-src`, which git ignores. Name each file the way the site refers to it, for example `studio-1.jpg` or `hero-living.jpg`.
2. Run `npm run images`. This writes `public/images/<name>-<width>.webp` (480 / 960 / 1600 px, plus 2400 px for full-bleed images) and updates `src/data/image-manifest.json`.
3. If you changed the hero photo or the favicon, run `npm run share-assets` to regenerate the share image and touch icon.

## Deployment

The build output in `dist/` is static. `vercel.json` sets clean URLs, the SPA fallback and long-lived caching for assets, and `public/_redirects` does the same job on Netlify.
