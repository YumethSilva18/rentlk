'use client'

import React from 'react'
import { MapPin, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LocationFilterProps {
  locations: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

export function LocationFilter({
  locations,
  selected,
  onChange,
  className,
}: LocationFilterProps) {
  const toggle = (location: string) => {
    if (selected.includes(location)) {
      onChange(selected.filter((l) => l !== location))
    } else {
      onChange([...selected, location])
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span className="text-sm font-medium">Location</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {locations.map((location) => (
          <Button
            key={location}
            variant={selected.includes(location) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggle(location)}
            className="h-8"
          >
            {selected.includes(location) && <Check className="mr-1 h-3 w-3" />}
            {location}
          </Button>
        ))}
      </div>
    </div>
  )
}
