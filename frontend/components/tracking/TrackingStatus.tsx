'use client'

import React from 'react'
import { Activity, Clock, MapPin, Route, Gauge, Navigation, Wifi, WifiOff, Pause, Play, Square } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { cn, formatDateTime } from '@/lib/utils'
import type { TrackingSession, TrackingStatus } from '@/types'

interface TrackingStatusProps {
  session: TrackingSession
  onPause?: () => void
  onResume?: () => void
  onStop?: () => void
  isLoading?: boolean
  className?: string
}

const statusConfig: Record<TrackingStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary'; color: string }> = {
  active: { label: 'Active', variant: 'success', color: 'text-green-600' },
  pending: { label: 'Pending', variant: 'secondary', color: 'text-gray-600' },
  paused: { label: 'Paused', variant: 'warning', color: 'text-yellow-600' },
  completed: { label: 'Completed', variant: 'secondary', color: 'text-blue-600' },
}

export function TrackingStatus({ session, onPause, onResume, onStop, isLoading = false, className }: TrackingStatusProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader><CardTitle>Tracking Status</CardTitle></CardHeader>
        <CardContent className="animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const config = statusConfig[session.status]
  const duration = session.endTime
    ? new Date(session.endTime).getTime() - new Date(session.startTime).getTime()
    : Date.now() - new Date(session.startTime).getTime()
  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tracking Status</CardTitle>
        <Badge variant={config.variant}>{config.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status indicator */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', {
            'bg-green-100': session.status === 'active',
            'bg-yellow-100': session.status === 'paused',
            'bg-gray-100': session.status === 'pending',
            'bg-blue-100': session.status === 'completed',
          })}>
            {session.status === 'active' ? (
              <Wifi className={cn('h-6 w-6', config.color)} />
            ) : session.status === 'paused' ? (
              <Pause className={cn('h-6 w-6', config.color)} />
            ) : session.status === 'completed' ? (
              <Activity className={cn('h-6 w-6', config.color)} />
            ) : (
              <WifiOff className={cn('h-6 w-6', config.color)} />
            )}
          </div>
          <div>
            <p className="font-medium">Session {session.id.slice(0, 8)}</p>
            <p className="text-xs text-muted-foreground">
              Started {formatDateTime(session.startTime)}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-semibold">{hours}h {minutes}m</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Gauge className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Avg Speed</p>
              <p className="text-sm font-semibold">{session.averageSpeed.toFixed(1)} km/h</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Start</p>
              <p className="text-xs">{session.startLocation.latitude.toFixed(4)}, {session.startLocation.longitude.toFixed(4)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Navigation className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-xs">
                {session.currentLocation
                  ? `${session.currentLocation.latitude.toFixed(4)}, ${session.currentLocation.longitude.toFixed(4)}`
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Route className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="text-xs font-medium">{session.totalDistance.toFixed(1)} km</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Max Speed</p>
              <p className="text-xs font-medium">{session.maxSpeed.toFixed(1)} km/h</p>
            </div>
          </div>
        </div>

        <Progress value={session.route.length > 0 ? (session.route.length / 10) * 100 : 10} className="h-1.5" />

        {/* Action buttons */}
        {session.status !== 'completed' && (
          <div className="flex gap-2 pt-2">
            {session.status === 'active' && onPause && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onPause}>
                <Pause className="mr-1 h-4 w-4" /> Pause
              </Button>
            )}
            {session.status === 'paused' && onResume && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onResume}>
                <Play className="mr-1 h-4 w-4" /> Resume
              </Button>
            )}
            {onStop && (
              <Button variant="destructive" size="sm" className="flex-1" onClick={onStop}>
                <Square className="mr-1 h-4 w-4" /> Stop
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
