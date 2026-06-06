'use client'

import React from 'react'
import { MapPin, Navigation, Clock } from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'
import type { TrackingLocation } from '@/types'

interface LocationMarkerProps {
  location: TrackingLocation
  type?: 'start' | 'current' | 'waypoint' | 'end'
  label?: string
  onClick?: () => void
  className?: string
}

const markerConfig: Record<string, { color: string; icon: React.ElementType }> = {
  start: { color: 'bg-green-500 border-green-700', icon: MapPin },
  current: { color: 'bg-blue-500 border-blue-700 animate-pulse', icon: Navigation },
  waypoint: { color: 'bg-gray-400 border-gray-600', icon: MapPin },
  end: { color: 'bg-red-500 border-red-700', icon: MapPin },
}

export function LocationMarker({ location, type = 'waypoint', label, onClick, className }: LocationMarkerProps) {
  const config = markerConfig[type]
  const Icon = config.icon

  return (
    <div
      className={cn('flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors', className)}
      onClick={onClick}
    >
      <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-white', config.color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium capitalize">{type}</span>
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
        </div>
        <p className="text-xs text-muted-foreground">
          {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
        </p>
        {location.speed !== undefined && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Speed: {location.speed.toFixed(1)} km/h
            {location.heading !== undefined && ` • Heading: ${location.heading}°`}
          </p>
        )}
        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDateTime(location.timestamp)}
        </p>
      </div>
    </div>
  )
}
