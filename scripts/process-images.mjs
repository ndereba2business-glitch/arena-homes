/**
 * Turns original photos into the responsive renditions the site serves.
 *
 *   1. Put originals in /images-src (jpg/png/webp), named as the site refers
 *      to them — e.g. images-src/studio-1.jpg, images-src/hero-living.jpg.
 *   2. npm run images
 *
 * Writes public/images/<name>-<width>.webp (480 / 960 / 1600, plus 2400 for
 * full-bleed images) and updates src/data/image-manifest.json with dimensions
 * and a tiny blurred placeholder. Existing entries for other names are kept.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const SRC = path.join(root, 'images-src')
const OUT = path.join(root, 'public/images')
const MANIFEST = path.join(root, 'src/data/image-manifest.json')
/** Images shown edge-to-edge on large screens get an extra 2400px rendition. */
const FULL_BLEED = new Set(['hero-living', 'exp-town', 'exterior-garden'])

const files = (await fs.readdir(SRC).catch(() => [])).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
if (!files.length) {
  console.log('No originals found in /images-src — nothing to do.')
  process.exit(0)
}

await fs.mkdir(OUT, { recursive: true })
const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8').catch(() => '{}'))

for (const file of files) {
  const name = path.parse(file).name
  const input = await fs.readFile(path.join(SRC, file))
  const { width, height } = await sharp(input).rotate().metadata()
  const portrait = height > width
  const max = FULL_BLEED.has(name) && !portrait ? 2400 : portrait ? 1200 : 1600
  const widths = [...new Set([480, 960, max])].filter((w) => w <= width)
  for (const w of widths) {
    await sharp(input)
      .rotate()
      .resize({ width: w })
      .webp({ quality: w <= 480 ? 68 : 72, effort: 5 })
      .toFile(path.join(OUT, `${name}-${w}.webp`))
  }
  const lqip = await sharp(input).rotate().resize({ width: 20 }).webp({ quality: 40 }).toBuffer()
  manifest[name] = { w: width, h: height, widths, lqip: `data:image/webp;base64,${lqip.toString('base64')}` }
  console.log(`${name}: ${widths.join(', ')}`)
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 1) + '\n')
console.log(`Updated ${path.relative(root, MANIFEST)} (${files.length} images).`)
