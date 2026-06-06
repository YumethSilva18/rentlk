'use client'

import React from 'react'
import { MapPin, Navigation, Car, User, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MapMarkerProps {
  type?: 'vehicle' | 'pickup' | 'dropoff' | 'user' | 'start' | 'end'
  label?: string
  isActive?: boolean
  onClick?: () => void
  className?: string
}

const markerConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  vehicle: { icon: Car, color: 'text-blue-600', bgColor: 'bg-blue-100 border-blue-300' },
  pickup: { icon: MapPin, color: 'text-green-600', bgColor: 'bg-green-100 border-green-300' },
  dropoff: { icon: MapPin, color: 'text-red-600', bgColor: 'bg-red-100 border-red-300' },
  user: { icon: User, color: 'text-purple-600', bgColor: 'bg-purple-100 border-purple-300' },
  start: { icon: Flag, color: 'text-green-600', bgColor: 'bg-green-100 border-green-300' },
  end: { icon: Flag, color: 'text-red-600', bgColor: 'bg-red-100 border-red-300' },
}

export function MapMarker({ type = 'pickup', label, isActive = false, onClick, className }: MapMarkerProps) {
  const config = markerConfig[type]
  const Icon = config.icon

  return (
    <button
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-all',
        config.bgColor,
        isActive && 'ring-2 ring-offset-1 scale-110',
        className
      )}
      onClick={onClick}
    >
      <Icon className={cn('h-4 w-4', config.color)} />
      {label && <span className="text-xs font-medium text-foreground">{label}</span>}
    </button>
  )
}

interface MapControlProps {
  onZoomIn?: () => void
  onZoomOut?: () => void
  onCenter?: () => void
  onFullscreen?: () => void
  className?: string
}

export function MapControl({ onZoomIn, onZoomOut, onCenter, onFullscreen, className }: MapControlProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border shadow text-lg font-semibold hover:bg-muted transition-colors"
        onClick={onZoomIn}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border shadow text-lg font-semibold hover:bg-muted transition-colors"
        onClick={onZoomOut}
        aria-label="Zoom out"
      >
        −
      </button>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border shadow hover:bg-muted transition-colors"
        onClick={onCenter}
        aria-label="Center map"
      >
        <Navigation className="h-4 w-4" />
      </button>
    </div>
  )
}
