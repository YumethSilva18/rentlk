'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FeaturesSelectorProps {
  features: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

export function FeaturesSelector({ features, selected, onChange, className }: FeaturesSelectorProps) {
  const toggle = (f: string) => {
    if (selected.includes(f)) onChange(selected.filter((s) => s !== f))
    else onChange([...selected, f])
  }

  return (
    <div className={cn('space-y-2', className)}>
      <span className="text-sm font-medium">Features</span>
      <div className="flex flex-wrap gap-2">
        {features.map((feature) => (
          <Button
            key={feature}
            variant={selected.includes(feature) ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggle(feature)}
            className="h-8"
          >
            {selected.includes(feature) && <Check className="mr-1 h-3 w-3" />}
            {feature}
          </Button>
        ))}
      </div>
    </div>
  )
}
