'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './use-reduced-motion'

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function useCountUp(
  target: number,
  duration = 1200,
  delay = 0,
): number {
  const [value, setValue] = useState(0)
  const prefersReduced = useReducedMotion()
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (prefersReduced) {
      setValue(target)
      return
    }

    let startTime: number | null = null
    let timeoutId: ReturnType<typeof setTimeout>

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutExpo(progress)
      setValue(Math.round(target * easedProgress))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    timeoutId = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, delay, prefersReduced])

  return value
}
