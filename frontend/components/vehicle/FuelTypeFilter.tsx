'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FuelTypeFilterProps {
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

const fuelTypes = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
]

export function FuelTypeFilter({ selected, onChange, className }: FuelTypeFilterProps) {
  const toggle = (v: string) => {
    if (selected.includes(v)) onChange(selected.filter((t) => t !== v))
    else onChange([...selected, v])
  }

  return (
    <div className={cn('space-y-2', className)}>
      <span className="text-sm font-medium">Fuel Type</span>
      <div className="grid grid-cols-2 gap-2">
        {fuelTypes.map((opt) => (
          <Button
            key={opt.value}
            variant={selected.includes(opt.value) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggle(opt.value)}
            className="h-8"
          >
            {selected.includes(opt.value) && <Check className="mr-1 h-3 w-3" />}
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
