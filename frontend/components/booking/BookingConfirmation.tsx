'use client'




import React from 'react'
import { Car, Calendar, MapPin, User, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { Booking } from '@/types'

interface BookingConfirmationProps {
  booking: Booking
  onViewBooking?: () => void
  onGoHome?: () => void
  className?: string
}

export function BookingConfirmation({ booking, onViewBooking, onGoHome, className }: BookingConfirmationProps) {
  return (
    <div className={cn('space-y-4 text-center', className)}>
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
        <ShieldCheck className="h-10 w-10 text-success" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
        <p className="mt-1 text-muted-foreground">
          Your booking has been confirmed. Reference: <span className="font-mono font-semibold">{booking.id.slice(0, 10).toUpperCase()}</span>
        </p>
      </div>

      <Card className="text-left">
        <CardHeader><CardTitle className="text-lg">Booking Summary</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span>{booking.vehicleTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking.pickupLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Owner: {booking.vehicleOwner}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>Total Paid</span>
            <span className="text-primary">{formatCurrency(booking.total)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={onViewBooking} className="flex-1">View Booking</Button>
        <Button variant="outline" onClick={onGoHome} className="flex-1">Go to Dashboard</Button>
      </div>
    </div>
  )
}
