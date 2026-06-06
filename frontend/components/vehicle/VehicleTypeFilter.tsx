'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VehicleTypeFilterProps {
  types: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

export function VehicleTypeFilter({ types, selected, onChange, className }: VehicleTypeFilterProps) {
  const toggle = (type: string) => {
    if (selected.includes(type)) onChange(selected.filter((t) => t !== type))
    else onChange([...selected, type])
  }

  return (
    <div className={cn('space-y-2', className)}>
      <span className="text-sm font-medium">Vehicle Type</span>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <Button
            key={type}
            variant={selected.includes(type) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggle(type)}
            className="h-8 capitalize"
          >
            {selected.includes(type) && <Check className="mr-1 h-3 w-3" />}
            {type}
          </Button>
        ))}
      </div>
    </div>
  )
}
