'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'

interface AddOn {
  id: string; name: string; description?: string; price: number
}

interface AddOnsSelectorProps {
  addOns: AddOn[]
  selected: string[]
  onChange: (selected: string[]) => void
  className?: string
}

export function AddOnsSelector({ addOns, selected, onChange, className }: AddOnsSelectorProps) {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-semibold">Add-ons</h3>
      {addOns.map((addon) => (
        <Card key={addon.id} className={cn('cursor-pointer transition-all', selected.includes(addon.id) && 'border-primary bg-primary/5')}
          onClick={() => toggle(addon.id)}>
          <CardContent className="flex items-center gap-3 p-3">
            <div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded border',
              selected.includes(addon.id) ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30')}>
              {selected.includes(addon.id) && <Check className="h-3 w-3" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{addon.name}</p>
              {addon.description && <p className="text-xs text-muted-foreground">{addon.description}</p>}
            </div>
            <span className="font-bold text-sm">{formatCurrency(addon.price)}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
