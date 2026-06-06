'use client'

import React from 'react'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BookingSuccessProps {
  bookingId: string
  onViewDetails?: () => void
  onGoHome?: () => void
  className?: string
}

export function BookingSuccess({ bookingId, onViewDetails, onGoHome, className }: BookingSuccessProps) {
  return (
    <div className={cn('flex flex-col items-center py-12 text-center', className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
        <CheckCircle className="h-10 w-10 text-success" />
      </div>
      <h2 className="mt-4 text-2xl font-bold">Booking Successful!</h2>
      <p className="mt-1 text-muted-foreground">Your booking reference is</p>
      <p className="mt-1 font-mono text-lg font-bold">#{bookingId}</p>
      <div className="mt-6 flex gap-3">
        <Button onClick={onViewDetails}>View Details</Button>
        <Button variant="outline" onClick={onGoHome}>Go Home</Button>
      </div>
    </div>
  )
}
