'use client'

import React from 'react'
import { ArrowUpDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SortOption {
  label: string
  value: string
}

interface SortDropdownProps {
  options: SortOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function SortDropdown({ options, value, onChange, className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <div className={cn('relative', className)}>
      <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsOpen(!isOpen)}>
        <ArrowUpDown className="h-4 w-4" />
        <span>{selected?.label || 'Sort by'}</span>
      </Button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-popover border rounded-lg shadow-lg z-50 min-w-[180px] p-1">
            {options.map((option) => (
              <button
                key={option.value}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-sm rounded hover:bg-muted transition-colors',
                  option.value === value && 'font-medium bg-muted/50'
                )}
                onClick={() => { onChange?.(option.value); setIsOpen(false) }}
              >
                {option.label}
                {option.value === value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
