'use client'

import React from 'react'
import Link from 'next/link'
import { Heart, MapPin, Star, Users, Gauge, Fuel } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'
import type { Vehicle } from '@/types'

interface VehicleCardProps {
  vehicle: Vehicle
  onFavorite?: (id: string) => void
  isFavorite?: boolean
  className?: string
}

export function VehicleCard({
  vehicle,
  onFavorite,
  isFavorite = false,
  className,
}: VehicleCardProps) {
  const {
    id,
    title,
    brand,
    model,
    year,
    type,
    transmission,
    fuelType,
    seats,
    dailyRate,
    images,
    location,
    rating,
    totalReviews,
    isAvailable,
  } = vehicle

  return (
    <Card className={cn('group overflow-hidden transition-shadow hover:shadow-lg', className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={images[0] || '/images/vehicle-placeholder.jpg'}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <Badge variant={isAvailable ? 'success' : 'secondary'}>
            {isAvailable ? 'Available' : 'Booked'}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute right-3 top-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white',
            isFavorite && 'text-red-500'
          )}
          onClick={(e) => {
            e.preventDefault()
            onFavorite?.(id)
          }}
        >
          <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
        </Button>
      </div>

      <CardContent className="p-4">
        <Link href={`/vehicles/${id}`}>
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold leading-tight group-hover:text-primary">
                {title || `${brand} ${model} (${year})`}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{location.city}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-xs">
                <Gauge className="mr-1 h-3 w-3" />
                {transmission}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Fuel className="mr-1 h-3 w-3" />
                {fuelType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Users className="mr-1 h-3 w-3" />
                {seats} seats
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {type}
              </Badge>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(dailyRate)}
                  <span className="text-sm font-normal text-muted-foreground">/day</span>
                </p>
              </div>
              {rating !== undefined && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({totalReviews})</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
