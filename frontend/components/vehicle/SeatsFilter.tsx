'use client'

import React from 'react'
import { Users, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SeatsFilterProps {
  value: number
  onChange: (seats: number) => void
  className?: string
}

export function SeatsFilter({ value, onChange, className }: SeatsFilterProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span className="text-sm font-medium">Seats</span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.max(2, value - 1))}
          disabled={value <= 2}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center font-medium">{value}+</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onChange(Math.min(12, value + 1))}
          disabled={value >= 12}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
