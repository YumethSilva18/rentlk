'use client'

import React from 'react'
import { BookingCard } from './BookingCard'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Booking } from '@/types'

interface BookingListProps {
  bookings: Booking[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

export function BookingList({ bookings, isLoading = false, emptyMessage = 'No bookings found', className }: BookingListProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl border p-4">
            <div className="h-20 w-28 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12', className)}>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mt-4 font-semibold">{emptyMessage}</h3>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onClick={(id) => router.push(`/bookings/${id}`)}
        />
      ))}
    </div>
  )
}
