'use client'

import React from 'react'
import { Calendar, Clock, MapPin, User, Shield, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { Booking } from '@/types'

interface BookingDetailsProps {
  booking: Booking
  onTrack?: () => void
  onCancel?: () => void
  onViewInvoice?: () => void
  className?: string
}

export function BookingDetails({ booking, onTrack, onCancel, onViewInvoice, className }: BookingDetailsProps) {
  const statusVariant = (status: string) => {
    const map: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
      pending: 'warning', confirmed: 'default', active: 'success', completed: 'secondary', cancelled: 'destructive',
    }
    return map[status] || 'default'
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Booking Details</CardTitle>
            <Badge variant={statusVariant(booking.status)} className="text-sm capitalize">{booking.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-muted-foreground">Pickup</p><p className="font-medium">{formatDate(booking.startDate)}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-muted-foreground">Return</p><p className="font-medium">{formatDate(booking.endDate)}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-muted-foreground">Duration</p><p className="font-medium">{booking.days} day{booking.days > 1 ? 's' : ''}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div><p className="text-muted-foreground">Location</p><p className="font-medium">{booking.pickupLocation}</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Price Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm"><span>Daily Rate × {booking.days} days</span><span>{formatCurrency(booking.dailyRate * booking.days)}</span></div>
          {booking.addOns.map((addon) => (
            <div key={addon.id} className="flex justify-between text-sm"><span>{addon.name}</span><span>{formatCurrency(addon.price)}</span></div>
          ))}
          <div className="flex justify-between text-sm"><span>Service Fee</span><span>{formatCurrency(booking.commission)}</span></div>
          <div className="flex justify-between border-t pt-2 font-bold"><span>Total</span><span className="text-primary">{formatCurrency(booking.total)}</span></div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        {booking.status === 'active' && <Button onClick={onTrack} className="flex-1">Track Vehicle</Button>}
        {booking.status === 'pending' && <Button variant="destructive" onClick={onCancel} className="flex-1">Cancel Booking</Button>}
        <Button variant="outline" onClick={onViewInvoice} className="flex-1">View Invoice</Button>
      </div>
    </div>
  )
}
