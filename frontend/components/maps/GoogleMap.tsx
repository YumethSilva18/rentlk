'use client'

import React from 'react'
import { MapPin, Navigation, Layers, Maximize2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface GoogleMapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{ lat: number; lng: number; label?: string; type?: 'vehicle' | 'pickup' | 'dropoff' | 'user' }>
  onMapClick?: (lat: number, lng: number) => void
  onMarkerClick?: (index: number) => void
  height?: string
  isLoading?: boolean
  className?: string
}

const markerColors: Record<string, string> = {
  vehicle: 'bg-blue-500',
  pickup: 'bg-green-500',
  dropoff: 'bg-red-500',
  user: 'bg-purple-500',
}

export function GoogleMap({
  center = { lat: 6.9271, lng: 79.8612 },
  zoom = 14,
  markers = [],
  onMapClick,
  onMarkerClick,
  height = '400px',
  isLoading = false,
  className,
}: GoogleMapProps) {
  if (isLoading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-0">
          <div className="bg-muted animate-pulse flex items-center justify-center" style={{ height }}>
            <MapPin className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="relative" style={{ height }}>
        {/* Placeholder map area - integrate with Google Maps API */}
        <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center">
          <Navigation className="h-12 w-12 text-blue-500 mb-4 animate-pulse" />
          <p className="text-sm font-medium">Map View</p>
          <p className="text-xs text-muted-foreground mt-1">
            Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)} | Zoom: {zoom}
          </p>
          {markers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center px-4">
              {markers.map((marker, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => onMarkerClick?.(i)}
                >
                  <span className={cn('h-2 w-2 rounded-full mr-1.5', markerColors[marker.type || 'vehicle'])} />
                  {marker.label || `Marker ${i + 1}`}
                </Badge>
              ))}
            </div>
          )}
          {/* TODO: Integrate with @react-google-maps/api or Leaflet */}
        </div>

        {/* Map controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8 bg-background shadow">
            <Layers className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 bg-background shadow">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
