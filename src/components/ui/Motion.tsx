import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Observes every [data-reveal] element and adds .is-visible as it scrolls into view. */
export function RevealObserver() {
  const { pathname } = useLocation()
  useEffect(() => {
    ;(window as unknown as { __ahReveal: boolean }).__ahReveal = true
    const root = document.documentElement
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      root.classList.remove('reveal-armed')
      return
    }
    root.classList.add('reveal-armed')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 }
    )
    const scan = () => document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => io.observe(el))
    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])
  return null
}

/**
 * Moves its child vertically relative to scroll. `speed` ≈ px of travel across
 * the viewport. Only runs while on screen, and not at all for reduced motion
 * or on small touch screens where it costs more than it adds.
 */
export function Parallax({
  children,
  speed = 60,
  scale = 1.1,
  className = '',
}: {
  children: React.ReactNode
  speed?: number
  scale?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent || prefersReducedMotion() || window.matchMedia('(max-width: 767px)').matches) {
      if (el) el.style.transform = 'none'
      return
    }
    let raf = 0
    let active = false
    const update = () => {
      raf = 0
      const r = parent.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2) // -1 … 1
      el.style.transform = `translate3d(0, ${(progress * speed).toFixed(1)}px, 0) scale(${scale})`
    }
    const onScroll = () => {
      if (active && !raf) raf = requestAnimationFrame(update)
    }
    const io = new IntersectionObserver(([e]) => {
      active = e.isIntersecting
      if (active) onScroll()
    })
    io.observe(parent)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [speed, scale])
  return (
    <div ref={ref} className={`absolute inset-0 will-change-transform ${className}`} style={{ transform: `scale(${scale})` }}>
      {children}
    </div>
  )
}

/** Subtle magnetic pull toward the pointer — fine pointers only. */
export function Magnetic({
  children,
  strength = 0.22,
  className = '',
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      el.style.transform = `translate3d(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px, 0)`
    }
    const leave = () => {
      el.style.transform = ''
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return (
    <span ref={ref} className={`inline-flex transition-transform duration-700 ease-[var(--ease-expo)] ${className}`}>
      {children}
    </span>
  )
}

/** Shorthand for a staggered reveal delay. */
export const delay = (ms: number) => ({ '--d': ms }) as React.CSSProperties
