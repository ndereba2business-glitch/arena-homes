import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { faqs } from '@/data/faqs'
import { JsonLd } from '@/lib/seo'
import { waMessages } from '@/lib/whatsapp'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import { delay } from '@/components/ui/Motion'

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const uid = useId()

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }

  return (
    <section id="faqs" aria-labelledby="faq-title" className="bg-paper py-24 md:py-36">
      <JsonLd data={faqLd} />
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p data-reveal className="eyebrow flex items-center gap-3 text-clay-deep">
              <span className="h-px w-8 bg-current" aria-hidden="true" />
              FAQs
            </p>
            <h2 id="faq-title" data-reveal style={delay(80)} className="display-lg mt-6">
              Good <em className="italic">questions.</em>
            </h2>
            <p data-reveal style={delay(160)} className="mt-6 max-w-sm text-taupe">
              Everything people usually ask before moving in. Can’t see yours? A real person answers on WhatsApp.
            </p>
            <div data-reveal style={delay(220)} className="mt-8">
              <WhatsAppButton message={waMessages.general()} label="Ask on WhatsApp" variant="outline-dark" />
            </div>
          </div>
        </div>

        <ul className="border-t border-rule lg:col-span-7 lg:col-start-6">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.q} data-reveal style={delay(i * 40)} className="border-b border-rule">
                <h3>
                  <button
                    type="button"
                    id={`${uid}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="flex items-baseline gap-5">
                      <span className="tabular w-5 shrink-0 text-xs text-taupe">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display text-[1.5rem] leading-tight md:text-[1.75rem]">{f.q}</span>
                    </span>
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,transform] duration-500 ease-[var(--ease-expo)] ${
                        isOpen ? 'rotate-45 border-ink bg-ink text-paper' : 'border-rule group-hover:border-ink/50'
                      }`}
                      aria-hidden="true"
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${uid}-a${i}`}
                  role="region"
                  aria-labelledby={`${uid}-q${i}`}
                  className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-expo)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  inert={!isOpen}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl pb-7 pl-10 leading-relaxed text-taupe">{f.a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
