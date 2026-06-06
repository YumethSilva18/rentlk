'use client'

import React from 'react'
import { MapPin, Navigation, Flag, ChevronRight, Clock, Route } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, formatDateTime } from '@/lib/utils'
import type { TrackingLocation } from '@/types'

interface RouteHistoryProps {
  route: TrackingLocation[]
  startLocation?: TrackingLocation
  endLocation?: TrackingLocation
  isLoading?: boolean
  className?: string
}

export function RouteHistory({ route, startLocation, endLocation, isLoading = false, className }: RouteHistoryProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader><CardTitle>Route History</CardTitle></CardHeader>
        <CardContent className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const allPoints = [
    ...(startLocation ? [{ ...startLocation, _type: 'start' as const }] : []),
    ...route.map((loc, i) => ({ ...loc, _type: 'waypoint' as const, _index: i })),
    ...(endLocation ? [{ ...endLocation, _type: 'end' as const }] : []),
  ]

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Route History</CardTitle>
        <Badge variant="secondary">{route.length} points</Badge>
      </CardHeader>
      <CardContent>
        {allPoints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Route className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
            <p className="text-sm text-muted-foreground">No route data available</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-0">
              {allPoints.map((point, index) => {
                const isStart = (point as any)._type === 'start'
                const isEnd = (point as any)._type === 'end'
                const isLast = index === allPoints.length - 1

                return (
                  <div key={index}>
                    <div className="flex gap-3 py-2.5">
                      <div className="flex flex-col items-center">
                        <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2', {
                          'bg-green-100 border-green-500 text-green-600': isStart,
                          'bg-red-100 border-red-500 text-red-600': isEnd,
                          'bg-blue-100 border-blue-400 text-blue-600': !isStart && !isEnd,
                        })}>
                          {isStart ? (
                            <Flag className="h-3 w-3" />
                          ) : isEnd ? (
                            <MapPin className="h-3 w-3" />
                          ) : (
                            <Navigation className="h-3 w-3" />
                          )}
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-border mt-0.5" />}
                      </div>
                      <div className="flex-1 min-w-0 pb-2">
                        <p className="text-sm font-medium">
                          {isStart ? 'Start Location' : isEnd ? 'End Location' : `Waypoint ${(point as any)._index + 1}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                        </p>
                        {point.speed !== undefined && (
                          <p className="text-xs text-muted-foreground mt-0.5">Speed: {point.speed.toFixed(1)} km/h</p>
                        )}
                        <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(point.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
