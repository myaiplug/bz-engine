'use client'
import { useEffect, useState } from 'react'

/**
 * Detects mobile/touch context. Combines viewport width and pointer type.
 * Safe for SSR (returns false until mounted).
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const narrow = window.innerWidth <= breakpoint
      const coarse = window.matchMedia('(pointer: coarse)').matches
      setIsMobile(narrow || (coarse && window.innerWidth <= breakpoint * 1.4))
    }
    check()
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [breakpoint])

  return isMobile
}
