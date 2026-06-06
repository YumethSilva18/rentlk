'use client'

import React from 'react'
import { MapPin, Search, Crosshair, Navigation } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface LocationPickerProps {
  value?: { lat: number; lng: number; address?: string }
  onChange?: (location: { lat: number; lng: number; address?: string }) => void
  placeholder?: string
  isLoading?: boolean
  className?: string
}

export function LocationPicker({
  value,
  onChange,
  placeholder = 'Search for a location...',
  isLoading = false,
  className,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = React.useState(value?.address || '')
  const [isLocating, setIsLocating] = React.useState(false)

  const handleGetCurrentLocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onChange?.({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Current Location',
          })
          setSearchQuery('Current Location')
          setIsLocating(false)
        },
        () => {
          setIsLocating(false)
          // Fallback to Colombo
          onChange?.({
            lat: 6.9271,
            lng: 79.8612,
            address: 'Colombo, Sri Lanka',
          })
        }
      )
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Pickup Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
        >
          <Crosshair className={cn('h-4 w-4', isLocating && 'animate-pulse')} />
          {isLocating ? 'Getting location...' : 'Use Current Location'}
        </Button>

        {value && (
          <div className="p-3 rounded-lg bg-muted/50 flex items-start gap-3">
            <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{value.address || 'Selected Location'}</p>
              <p className="text-xs text-muted-foreground">
                {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
              </p>
            </div>
          </div>
        )}

        {/* Quick locations */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Popular Locations</p>
          {[
            { label: 'Colombo Fort', lat: 6.9344, lng: 79.8427 },
            { label: 'Kandy City', lat: 7.2906, lng: 80.6337 },
            { label: 'Galle Fort', lat: 6.0329, lng: 80.2170 },
            { label: 'Bandaranaike Airport', lat: 7.1802, lng: 79.8841 },
          ].map((loc) => (
            <button
              key={loc.label}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-muted transition-colors"
              onClick={() => {
                onChange?.({ lat: loc.lat, lng: loc.lng, address: loc.label })
                setSearchQuery(loc.label)
              }}
            >
              <Navigation className="h-3 w-3 text-muted-foreground" />
              <span>{loc.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
