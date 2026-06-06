'use client'

import React from 'react'
import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const popularLocations = ['Colombo Fort', 'Bandaranaike Airport', 'Kandy City', 'Galle Fort', 'Negombo Beach', 'Jaffna Town']

interface PickupLocationSelectorProps {
  value: string
  onChange: (location: string) => void
  className?: string
}

export function PickupLocationSelector({ value, onChange, className }: PickupLocationSelectorProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <Label>Pickup Location</Label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Enter pickup address" className="pl-10" value={value}
          onChange={(e) => onChange(e.target.value)} />
      </div>
      <div className="flex flex-wrap gap-2">
        {popularLocations.map((loc) => (
          <button key={loc} onClick={() => onChange(loc)}
            className={cn('rounded-full border px-3 py-1 text-xs transition-colors hover:bg-primary/10',
              value === loc ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground')}>
            {loc}
          </button>
        ))}
      </div>
    </div>
  )
}
