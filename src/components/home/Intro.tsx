import { intro } from '@/data/content'
import Img from '@/components/ui/Img'
import { Parallax, delay } from '@/components/ui/Motion'

export default function Intro() {
  return (
    <section aria-labelledby="intro-title" className="bg-linen pb-24 pt-20 md:pb-36 md:pt-32">
      <div className="shell">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 lg:pt-10 xl:col-span-5">
            <p data-reveal className="eyebrow flex items-center gap-3 text-clay-deep">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              {intro.eyebrow}
            </p>
            <h2 id="intro-title" data-reveal style={delay(80)} className="display-lg mt-6">
              Not just somewhere to <em className="italic">sleep.</em>
            </h2>
            <div className="mt-8 max-w-lg space-y-5 text-taupe">
              {intro.body.map((p, i) => (
                <p key={i} data-reveal style={delay(160 + i * 80)} className={i === 0 ? 'lede text-ink/85' : ''}>
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7 xl:col-span-6 xl:col-start-7">
            <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden bg-stone sm:aspect-[5/6] lg:ml-auto lg:w-[88%]">
              <Parallax speed={40} scale={1.12}>
                <Img src={intro.photo.src} alt={intro.photo.alt} fill sizes="(min-width: 1024px) 44vw, 100vw" />
              </Parallax>
            </div>
            <p
              data-reveal
              style={delay(200)}
              className="mt-4 text-xs text-taupe lg:absolute lg:-left-2 lg:bottom-6 lg:mt-0 lg:w-40 lg:-translate-x-full lg:text-right"
            >
              Every unit is furnished before you arrive — you bring the suitcase.
            </p>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-rule pt-10 md:mt-28 lg:grid-cols-4 lg:gap-x-10">
          {intro.facts.map((f, i) => (
            <div key={f.label} data-reveal style={delay(i * 90)} className="flex flex-col">
              <dt className="order-2 eyebrow mt-4 text-ink">{f.label}</dt>
              <dd className="order-1 font-display text-[clamp(2.6rem,6vw,4.25rem)] leading-none tracking-[-0.02em]">{f.value}</dd>
              <dd className="order-3 mt-2 max-w-[15rem] text-sm leading-relaxed text-taupe">{f.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
