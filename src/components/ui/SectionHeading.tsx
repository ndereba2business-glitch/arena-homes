import { delay } from './Motion'

/** Eyebrow + large editorial headline + optional lede and aside. */
export default function SectionHeading({
  eyebrow,
  title,
  id,
  children,
  aside,
  tone = 'light',
  className = '',
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: React.ReactNode
  id?: string
  children?: React.ReactNode
  aside?: React.ReactNode
  tone?: 'light' | 'dark'
  className?: string
  as?: 'h1' | 'h2'
}) {
  const accent = tone === 'dark' ? 'text-clay-soft' : 'text-clay-deep'
  const muted = tone === 'dark' ? 'text-mist' : 'text-taupe'
  return (
    <div className={`flex flex-col gap-8 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-4xl">
        {eyebrow && (
          <p data-reveal className={`eyebrow flex items-center gap-3 ${accent}`}>
            <span className="h-px w-8 bg-current" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <Tag id={id} data-reveal style={delay(80)} className="display-lg mt-6">
          {title}
        </Tag>
        {children && (
          <div data-reveal style={delay(160)} className={`lede mt-6 max-w-xl ${muted}`}>
            {children}
          </div>
        )}
      </div>
      {aside && (
        <div data-reveal style={delay(220)} className="shrink-0">
          {aside}
        </div>
      )}
    </div>
  )
}
