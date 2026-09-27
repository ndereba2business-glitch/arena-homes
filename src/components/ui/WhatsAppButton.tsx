import { whatsappLink } from '@/lib/whatsapp'
import { WhatsAppIcon } from './Brand'

type Variant = 'solid' | 'outline-light' | 'outline-dark' | 'link'

const styles: Record<Variant, string> = {
  solid: 'btn btn-whatsapp',
  'outline-light':
    'btn border border-whatsapp/50 text-paper hover:border-whatsapp hover:bg-whatsapp/10 [&_svg]:text-whatsapp',
  'outline-dark': 'btn border border-ink/20 text-ink hover:border-ink [&_svg]:text-[#1a9e4b]',
  link: 'inline-flex items-center gap-2 text-sm font-semibold [&_svg]:text-[#1a9e4b]',
}

/**
 * "Chat on WhatsApp" button. Every WhatsApp entry point in the site goes through
 * here, so the number (config) and the message format (lib/whatsapp) stay central.
 */
export default function WhatsAppButton({
  message,
  label = 'Chat on WhatsApp',
  variant = 'solid',
  className = '',
}: {
  message: string
  label?: string
  variant?: Variant
  className?: string
}) {
  return (
    <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className={`${styles[variant]} ${className}`}>
      <WhatsAppIcon className="h-[1.1rem] w-[1.1rem] shrink-0" />
      <span className={variant === 'link' ? 'link-line' : ''}>{label}</span>
      <span className="sr-only"> (opens WhatsApp)</span>
    </a>
  )
}
