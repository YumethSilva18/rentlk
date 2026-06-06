'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TransmissionFilterProps {
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

const options = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
]

export function TransmissionFilter({ selected, onChange, className }: TransmissionFilterProps) {
  const toggle = (v: string) => {
    if (selected.includes(v)) onChange(selected.filter((t) => t !== v))
    else onChange([...selected, v])
  }

  return (
    <div className={cn('space-y-2', className)}>
      <span className="text-sm font-medium">Transmission</span>
      <div className="flex gap-2">
        {options.map((opt) => (
          <Button
            key={opt.value}
            variant={selected.includes(opt.value) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggle(opt.value)}
            className="h-8 flex-1"
          >
            {selected.includes(opt.value) && <Check className="mr-1 h-3 w-3" />}
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
