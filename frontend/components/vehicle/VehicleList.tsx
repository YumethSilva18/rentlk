'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, Star, Gauge, Fuel, Users, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'
import type { Vehicle } from '@/types'

interface VehicleListProps {
  vehicles: Vehicle[]
  onFavorite?: (id: string) => void
  favorites?: string[]
  isLoading?: boolean
  className?: string
}

export function VehicleList({
  vehicles,
  favorites = [],
  isLoading = false,
  className,
}: VehicleListProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl border p-4">
            <div className="h-24 w-36 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              <div className="flex gap-2">
                <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
                <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {vehicles.map((vehicle) => (
        <Link key={vehicle.id} href={`/vehicles/${vehicle.id}`}>
          <Card className="group overflow-hidden transition-shadow hover:shadow-md">
            <CardContent className="flex gap-4 p-4">
              <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg">
                <img
                  src={vehicle.images[0] || '/images/vehicle-placeholder.jpg'}
                  alt={vehicle.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {!vehicle.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Badge variant="secondary">Booked</Badge>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-semibold group-hover:text-primary truncate">
                    {vehicle.title}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{vehicle.location.city}</span>
                    {vehicle.rating !== undefined && (
                      <>
                        <span className="mx-1">•</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{vehicle.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Gauge className="mr-1 h-3 w-3" />
                    {vehicle.transmission}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Fuel className="mr-1 h-3 w-3" />
                    {vehicle.fuelType}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Users className="mr-1 h-3 w-3" />
                    {vehicle.seats}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between shrink-0">
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(vehicle.dailyRate)}
                  </p>
                  <p className="text-xs text-muted-foreground">per day</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
