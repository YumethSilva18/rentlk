'use client'

import React from 'react'
import { Calendar as CalendarIcon, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { cn, formatCurrency } from '@/lib/utils'

interface AddOn {
  id: string
  name: string
  price: number
  selected?: boolean
}

interface BookingFormProps {
  dailyRate: number
  days: number
  addOns: AddOn[]
  onSubmit: (data: { pickupLocation: string; notes?: string; selectedAddOns: string[] }) => void
  isLoading?: boolean
  className?: string
}

export function BookingForm({ dailyRate, days, addOns, onSubmit, isLoading, className }: BookingFormProps) {
  const [pickupLocation, setPickupLocation] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [selected, setSelected] = React.useState<string[]>(addOns.filter((a) => a.selected).map((a) => a.id))

  const toggleAddOn = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id])
  }

  const selectedAddOnsTotal = addOns.filter((a) => selected.includes(a.id)).reduce((sum, a) => sum + a.price, 0)
  const subtotal = dailyRate * days
  const total = subtotal + selectedAddOnsTotal

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader><CardTitle>Booking Summary</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Daily rate</span><span>{formatCurrency(dailyRate)}</span></div>
          <div className="flex justify-between"><span>× {days} days</span><span>{formatCurrency(subtotal)}</span></div>
          {selectedAddOnsTotal > 0 && (
            <div className="flex justify-between"><span>Add-ons</span><span>{formatCurrency(selectedAddOnsTotal)}</span></div>
          )}
          <div className="flex justify-between border-t pt-2 font-bold text-base"><span>Total</span><span className="text-primary">{formatCurrency(total)}</span></div>
        </CardContent>
      </Card>

      {addOns.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Add-ons</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {addOns.map((addon) => (
              <Button
                key={addon.id}
                variant={selected.includes(addon.id) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleAddOn(addon.id)}
              >
                {addon.name} (+{formatCurrency(addon.price)})
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Pickup Details</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="location">Pickup Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="location" placeholder="Enter pickup address" className="pl-10" value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)} disabled={isLoading} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Special Notes (optional)</Label>
            <Textarea id="notes" placeholder="Any special requests..." value={notes}
              onChange={(e) => setNotes(e.target.value)} disabled={isLoading} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={!pickupLocation || isLoading}
            onClick={() => onSubmit({ pickupLocation, notes: notes || undefined, selectedAddOns: selected })}>
            {isLoading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
