'use client'

import React from 'react'
import { Car, MapPin, Navigation, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatCurrency } from '@/lib/utils'
import type { Vehicle } from '@/types'
import { GoogleMap } from './GoogleMap'

interface VehicleMapProps {
  vehicles: Vehicle[]
  center?: { lat: number; lng: number }
  onVehicleSelect?: (vehicle: Vehicle) => void
  selectedVehicleId?: string
  isLoading?: boolean
  className?: string
}

export function VehicleMap({
  vehicles,
  center = { lat: 6.9271, lng: 79.8612 },
  onVehicleSelect,
  selectedVehicleId,
  isLoading = false,
  className,
}: VehicleMapProps) {
  const markers = vehicles.map((v) => ({
    lat: center.lat + (Math.random() - 0.5) * 0.05,
    lng: center.lng + (Math.random() - 0.5) * 0.05,
    label: v.title,
    type: 'vehicle' as const,
  }))

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)

  return (
    <div className={cn('space-y-4', className)}>
      <GoogleMap
        center={center}
        markers={markers}
        onMarkerClick={(i) => onVehicleSelect?.(vehicles[i])}
        height="400px"
        isLoading={isLoading}
      />

      {selectedVehicle && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold truncate">{selectedVehicle.title}</h4>
                  <Badge variant="outline">{selectedVehicle.type}</Badge>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{selectedVehicle.rating?.toFixed(1) || '4.5'}</span>
                  <span className="text-xs text-muted-foreground">({selectedVehicle.totalReviews || 0})</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{selectedVehicle.location}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-bold">{formatCurrency(selectedVehicle.dailyRate)}<span className="text-xs text-muted-foreground font-normal">/day</span></p>
                  <Button size="sm" onClick={() => onVehicleSelect?.(selectedVehicle)}>
                    <Navigation className="mr-1 h-4 w-4" /> View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
