'use client'

import React from 'react'
import { VehicleCard } from './VehicleCard'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/types'

interface VehicleGridProps {
  vehicles: Vehicle[]
  onFavorite?: (id: string) => void
  favorites?: string[]
  isLoading?: boolean
  className?: string
}

export function VehicleGrid({
  vehicles,
  onFavorite,
  favorites = [],
  isLoading = false,
  className,
}: VehicleGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/3] animate-pulse rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              <div className="flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="h-6 w-1/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-16', className)}>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <svg className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold">No vehicles found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onFavorite={onFavorite}
          isFavorite={favorites.includes(vehicle.id)}
        />
      ))}
    </div>
  )
}
