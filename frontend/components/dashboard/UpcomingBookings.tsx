'use client'

import React from 'react'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Booking } from '@/types'

interface UpcomingBookingsProps {
  bookings: Booking[]
  onViewAll?: () => void
  onViewBooking?: (id: string) => void
  isLoading?: boolean
  className?: string
}

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
  pending: 'warning',
  confirmed: 'default',
  active: 'success',
  cancelled: 'destructive',
}

export function UpcomingBookings({
  bookings,
  onViewAll,
  onViewBooking,
  isLoading = false,
  className,
}: UpcomingBookingsProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-14 w-20 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
              <div className="h-6 w-16 bg-muted rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const upcoming = bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed')

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Bookings</CardTitle>
        {upcoming.length > 0 && (
          <Button variant="link" size="sm" onClick={onViewAll}>
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Calendar className="mx-auto h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No upcoming bookings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onViewBooking?.(booking.id)}
              >
                <img
                  src={booking.vehicleImage || '/images/vehicle-placeholder.jpg'}
                  alt={booking.vehicleTitle}
                  className="h-14 w-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{booking.vehicleTitle}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(booking.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{booking.pickupLocation}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={statusVariants[booking.status] || 'default'}>
                    {booking.status}
                  </Badge>
                  <p className="text-sm font-semibold mt-1">{formatCurrency(booking.total)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
