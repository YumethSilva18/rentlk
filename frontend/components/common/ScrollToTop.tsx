'use client'

import React from 'react'
import { ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) return null

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg h-10 w-10"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}

interface ThemeToggleProps {
  theme?: 'light' | 'dark'
  onToggle?: () => void
  className?: string
}

export function ThemeToggle({ theme = 'light', onToggle, className }: ThemeToggleProps) {
  return (
    <Button variant="ghost" size="icon" className={cn('h-9 w-9', className)} onClick={onToggle} aria-label="Toggle theme">
      {theme === 'dark' ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </Button>
  )
}

interface LanguageSelectorProps {
  currentLang?: string
  onSelect?: (lang: string) => void
  className?: string
}

const languages = [
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'en', label: 'English' },
]

export function LanguageSelector({ currentLang = 'en', onSelect, className }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn('relative', className)}>
      <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setIsOpen(!isOpen)}>
        {languages.find(l => l.code === currentLang)?.label || 'English'}
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </Button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-popover border rounded-lg shadow-lg p-1 z-50 min-w-[120px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={cn('w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted transition-colors', {
                'font-medium bg-muted/50': lang.code === currentLang,
              })}
              onClick={() => { onSelect?.(lang.code); setIsOpen(false) }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
