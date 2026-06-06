'use client'

import React from 'react'
import { MapPin, Navigation, RefreshCw, Maximize2, Minimize2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TrackingSession, TrackingLocation } from '@/types'

interface TrackingMapProps {
  session: TrackingSession
  onRefresh?: () => void
  isLoading?: boolean
  className?: string
}

export function TrackingMap({ session, onRefresh, isLoading = false, className }: TrackingMapProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <div className="aspect-video bg-muted animate-pulse flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(className, isFullscreen && 'fixed inset-4 z-50')}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle>Live Tracking</CardTitle>
          <Badge variant={session.status === 'active' ? 'success' : session.status === 'paused' ? 'warning' : 'secondary'}>
            {session.status}
          </Badge>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-muted rounded-b-lg overflow-hidden">
          {/* Placeholder for actual map integration (Google Maps / Leaflet) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <Navigation className="h-12 w-12 text-blue-500 mb-3 animate-pulse" />
            <p className="text-sm font-medium">Map View</p>
            <p className="text-xs text-muted-foreground mt-1">
              {session.currentLocation
                ? `Current: ${session.currentLocation.latitude.toFixed(4)}, ${session.currentLocation.longitude.toFixed(4)}`
                : 'No location data'}
            </p>
            {session.currentLocation && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Speed</p>
                  <p className="text-sm font-semibold">{session.currentLocation.speed?.toFixed(1) || '0'} km/h</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="text-sm font-semibold">{session.totalDistance.toFixed(1)} km</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Speed</p>
                  <p className="text-sm font-semibold">{session.averageSpeed.toFixed(1)} km/h</p>
                </div>
              </div>
            )}
            {/* TODO: Integrate with Google Maps / Mapbox for real map rendering */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
