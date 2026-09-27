import { imageSrc, imageSrcSet, images, type ImageName } from '@/data/images'

/**
 * Responsive photo. Serves WebP renditions via srcset, lazy-loads by default,
 * and paints a blurred placeholder behind the image while it loads.
 * `fill` makes it cover its (relatively positioned) parent.
 */
export default function Img({
  src,
  alt,
  sizes = '100vw',
  priority = false,
  fill = false,
  className = '',
  style,
}: {
  src: ImageName
  alt: string
  sizes?: string
  priority?: boolean
  fill?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const info = images[src]
  return (
    <img
      src={imageSrc(src, 960)}
      srcSet={imageSrcSet(src)}
      sizes={sizes}
      alt={alt}
      width={info.w}
      height={info.h}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      draggable={false}
      className={`${fill ? 'absolute inset-0 h-full w-full' : 'h-auto w-full'} object-cover ${className}`}
      style={{ backgroundImage: `url(${info.lqip})`, backgroundSize: 'cover', backgroundPosition: 'center', ...style }}
    />
  )
}
