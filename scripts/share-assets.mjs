/**
 * Generates the social share image (public/og.jpg, 1200×630) and the Apple
 * touch icon from the hero photo and favicon. Re-run after changing either:
 *   npm run share-assets
 */
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const pub = (p) => path.join(root, 'public', p)

// Keep these in step with src/config/site.ts when re-skinning.
const brand = { first: 'Arena', rest: 'HOMES', line1: 'A better place to', line2: ['come ', 'home', ' to.'], footer: 'FURNISHED ROOMS & APARTMENTS · NAKURU, KENYA' }

await sharp(pub('favicon.svg'), { density: 400 }).resize(180, 180).png().toFile(pub('apple-touch-icon.png'))

const esc = (s) => s.replace(/&/g, '&amp;')
const overlay = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#13110e" stop-opacity=".9"/><stop offset=".6" stop-color="#13110e" stop-opacity=".3"/><stop offset="1" stop-color="#13110e" stop-opacity="0"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<g fill="none" stroke="#d99a72" stroke-width="3"><path d="M72 150V112c0-15 12-27 27-27s27 12 27 27v38"/><path d="M87 150v-33a12 12 0 0 1 24 0v33"/><path d="M64 150h70"/></g>
<text x="150" y="146" font-family="Georgia, serif" font-size="46" fill="#faf7f1">${brand.first}</text>
<text x="290" y="146" font-family="Arial, sans-serif" font-size="15" letter-spacing="5" fill="#faf7f1" fill-opacity=".7">${brand.rest}</text>
<text x="70" y="430" font-family="Georgia, serif" font-size="74" fill="#faf7f1">${brand.line1}</text>
<text x="70" y="510" font-family="Georgia, serif" font-size="74" fill="#faf7f1">${brand.line2[0]}<tspan font-style="italic" fill="#d99a72">${brand.line2[1]}</tspan>${brand.line2[2]}</text>
<text x="72" y="568" font-family="Arial, sans-serif" font-size="18" letter-spacing="3" fill="#faf7f1" fill-opacity=".7">${esc(brand.footer)}</text>
</svg>`)

await sharp(pub('images/hero-living-2400.webp'))
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .modulate({ brightness: 0.85 })
  .composite([{ input: overlay }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(pub('og.jpg'))

console.log('Wrote public/og.jpg and public/apple-touch-icon.png')
