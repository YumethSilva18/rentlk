'use client'

import { useState, useEffect } from 'react'

export function useScrollPosition(): {
  scrollX: number
  scrollY: number
  isScrolled: boolean
  scrollDirection: 'up' | 'down' | null
} {
  const [scrollX, setScrollX] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollX(window.scrollX)
      setScrollY(currentScrollY)
      setIsScrolled(currentScrollY > 0)
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up')
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return { scrollX, scrollY, isScrolled, scrollDirection }
}
