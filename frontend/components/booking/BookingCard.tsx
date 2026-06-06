'use client'

import React from 'react'
import { Calendar, MapPin, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import type { Booking } from '@/types'

interface BookingCardProps {
  booking: Booking
  onClick?: (id: string) => void
  className?: string
}

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  pending: 'warning',
  confirmed: 'default',
  active: 'success',
  completed: 'secondary',
  cancelled: 'destructive',
}

const paymentStatusVariants: Record<string, 'default' | 'success' | 'warning' | 'destructive'> = {
  pending: 'warning',
  processing: 'default',
  completed: 'success',
  failed: 'destructive',
  refunded: 'secondary',
}

export function BookingCard({ booking, onClick, className }: BookingCardProps) {
  return (
    <Card
      className={cn('cursor-pointer transition-shadow hover:shadow-md', className)}
      onClick={() => onClick?.(booking.id)}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
          <img
            src={booking.vehicleImage || '/images/vehicle-placeholder.jpg'}
            alt={booking.vehicleTitle}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold truncate">{booking.vehicleTitle}</h4>
              <p className="text-xs text-muted-foreground">#{booking.id.slice(0, 8)}</p>
            </div>
            <Badge variant={statusVariants[booking.status] || 'default'}>
              {booking.status}
            </Badge>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {booking.days} day{booking.days > 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {booking.pickupLocation}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">{formatCurrency(booking.total)}</span>
              <Badge variant={paymentStatusVariants[booking.paymentStatus] || 'default'} className="text-xs">
                {booking.paymentStatus}
              </Badge>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
