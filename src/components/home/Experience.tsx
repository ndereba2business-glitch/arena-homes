import { experience } from '@/data/content'
import Img from '@/components/ui/Img'
import { Parallax, delay } from '@/components/ui/Motion'

/** Staggered editorial layout: each chapter shifts position and scale so the page reads like a magazine spread. */
const layouts = [
  { frame: 'lg:col-span-7 aspect-[4/3]', text: 'lg:col-span-4 lg:col-start-9 lg:self-end lg:pb-10' },
  { frame: 'lg:col-span-5 lg:col-start-7 aspect-[4/5] lg:order-2', text: 'lg:col-span-4 lg:col-start-2 lg:self-center lg:order-1' },
  { frame: 'lg:col-span-6 lg:col-start-2 aspect-[5/6]', text: 'lg:col-span-4 lg:col-start-8 lg:self-center' },
  { frame: 'lg:col-span-8 lg:col-start-5 aspect-[16/10] lg:order-2', text: 'lg:col-span-3 lg:col-start-1 lg:self-end lg:order-1 lg:pb-10' },
]

export default function Experience() {
  return (
    <section aria-labelledby="experience-title" className="overflow-hidden bg-linen py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12">
          <p data-reveal className="eyebrow flex items-center gap-3 text-clay-deep lg:col-span-3 lg:pt-6">
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            The experience
          </p>
          <h2 id="experience-title" data-reveal style={delay(80)} className="display-xl lg:col-span-9">
            More than <em className="italic">four walls.</em>
          </h2>
        </div>

        <div className="mt-16 space-y-20 md:mt-28 md:space-y-32">
          {experience.map((c, i) => {
            const l = layouts[i % layouts.length]
            return (
              <article key={c.title} className="grid gap-8 lg:grid-cols-12 lg:gap-8">
                <div data-reveal="image" className={`relative overflow-hidden bg-stone ${l.frame}`}>
                  <Parallax speed={50} scale={1.14}>
                    <Img src={c.photo.src} alt={c.photo.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" />
                  </Parallax>
                </div>
                <div className={l.text}>
                  <p data-reveal className="tabular font-display text-5xl text-clay md:text-6xl">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 data-reveal style={delay(80)} className="display-md mt-5">
                    {c.title}
                  </h3>
                  <p data-reveal style={delay(160)} className="mt-5 max-w-sm leading-relaxed text-taupe">
                    {c.body}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
