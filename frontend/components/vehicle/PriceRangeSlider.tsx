'use client'

import React from 'react'
import { Slider } from '@/components/ui/slider'
import { cn, formatCurrency } from '@/lib/utils'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  className?: string
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  className,
}: PriceRangeSliderProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Price Range</span>
        <span className="text-sm text-muted-foreground">
          {formatCurrency(value[0])} - {formatCurrency(value[1])}
        </span>
      </div>

      <Slider
        min={min}
        max={max}
        step={100}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        className="py-4"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}+</span>
      </div>
    </div>
  )
}
