'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface AmbientBackgroundProps {
  /** hero = login/marketing intensity; default is the quieter dashboard wash */
  hero?: boolean
  /** the scrolling element to parallax against (defaults to window) */
  scrollRef?: React.RefObject<HTMLElement | null>
}

/**
 * The "living background": three slow-drifting aurora blobs in the gold
 * family + a fading grid + film grain + vignette. Blobs sit inside parallax
 * wrappers that track scroll at different rates, so the whole backdrop
 * breathes as you move. Pure transform/opacity — no layout, no video payload.
 */
export function AmbientBackground({ hero = false, scrollRef }: AmbientBackgroundProps) {
  const w1 = useRef<HTMLDivElement>(null)
  const w2 = useRef<HTMLDivElement>(null)
  const w3 = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return
    const el = scrollRef?.current ?? null
    const target: HTMLElement | Window = el ?? window
    let raf = 0

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const y = el ? el.scrollTop : window.scrollY
        // Different rates per layer = depth
        if (w1.current) w1.current.style.transform = `translate3d(0, ${y * -0.08}px, 0)`
        if (w2.current) w2.current.style.transform = `translate3d(0, ${y * 0.05}px, 0)`
        if (w3.current) w3.current.style.transform = `translate3d(0, ${y * -0.03}px, 0)`
      })
    }

    target.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      target.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [scrollRef, prefersReduced])

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${hero ? 'amb-hero' : 'amb-subtle'}`}
    >
      {/* Faint architect grid, fading from the top */}
      <div className="amb-grid absolute inset-0" />

      {/* Aurora blobs — wrapper = parallax, inner = drift animation */}
      <div
        ref={w1}
        className="absolute -top-[18%] -left-[12%] w-[55vw] h-[55vw] min-w-[420px] min-h-[420px] will-change-transform"
      >
        <div className="aurora-blob amb-a" />
      </div>
      <div
        ref={w2}
        className="absolute top-[20%] -right-[14%] w-[46vw] h-[46vw] min-w-[360px] min-h-[360px] will-change-transform"
      >
        <div className="aurora-blob amb-b" />
      </div>
      <div
        ref={w3}
        className="hidden md:block absolute -bottom-[20%] left-[16%] w-[42vw] h-[42vw] will-change-transform"
      >
        <div className="aurora-blob amb-c" />
      </div>

      {/* Depth + texture */}
      <div className="amb-vignette absolute inset-0" />
      <div className="amb-grain absolute inset-0" />
    </div>
  )
}
