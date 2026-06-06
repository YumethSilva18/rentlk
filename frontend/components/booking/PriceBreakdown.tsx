'use client'

import React from 'react'
import { DollarSign, Shield, Calculator } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'

interface PriceBreakdownProps {
  dailyRate: number
  days: number
  addOns: { name: string; price: number }[]
  commissionRate?: number
  className?: string
}

export function PriceBreakdown({ dailyRate, days, addOns, commissionRate = 0.05, className }: PriceBreakdownProps) {
  const subtotal = dailyRate * days
  const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0)
  const commission = (subtotal + addOnsTotal) * commissionRate
  const total = subtotal + addOnsTotal + commission

  return (
    <Card className={cn(className)}>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Price Breakdown</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{formatCurrency(dailyRate)} × {days} days</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          {addOns.map((addon, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-muted-foreground">{addon.name}</span>
              <span>{formatCurrency(addon.price)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2">
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Service Fee (5%)</span>
            <span>{formatCurrency(commission)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold text-base">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
