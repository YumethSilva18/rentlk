'use client'

import React from 'react'
import { AlertTriangle, MapPin, Clock, Shield, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatDateTime } from '@/lib/utils'
import type { GeofenceAlert as GeofenceAlertType, Geofence } from '@/types'

interface GeofenceAlertProps {
  alerts: GeofenceAlertType[]
  geofences?: Geofence[]
  onDismiss?: (alertId: string) => void
  onView?: (alertId: string) => void
  isLoading?: boolean
  className?: string
}

const typeConfig: Record<string, { label: string; color: string }> = {
  enter: { label: 'Entered Zone', color: 'text-green-600 bg-green-100 border-green-300' },
  exit: { label: 'Exited Zone', color: 'text-red-600 bg-red-100 border-red-300' },
}

export function GeofenceAlertComponent({
  alerts,
  geofences = [],
  onDismiss,
  onView,
  isLoading = false,
  className,
}: GeofenceAlertProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader><CardTitle>Geofence Alerts</CardTitle></CardHeader>
        <CardContent className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const getGeofenceName = (geofenceId: string) => {
    return geofences.find(g => g.id === geofenceId)?.name || 'Unknown Zone'
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Geofence Alerts</CardTitle>
          <Badge variant={alerts.length > 0 ? 'destructive' : 'secondary'}>
            {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Shield className="h-10 w-10 text-muted-foreground opacity-50 mb-3" />
            <p className="text-sm text-muted-foreground">No geofence alerts</p>
            <p className="text-xs text-muted-foreground mt-1">Vehicle is within allowed zones</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const config = typeConfig[alert.type] || typeConfig.enter
              return (
                <div
                  key={alert.id}
                  className={cn('border rounded-lg p-4', config.color)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', {
                        'bg-green-100 text-green-600': alert.type === 'enter',
                        'bg-red-100 text-red-600': alert.type === 'exit',
                      })}>
                        {alert.type === 'enter' ? (
                          <MapPin className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{config.label}</p>
                        <p className="text-xs opacity-75">{getGeofenceName(alert.geofenceId)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {alert.type}
                    </Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs opacity-75">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDateTime(alert.timestamp)}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-inherit opacity-30">
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onView?.(alert.id)}>
                      View <ChevronRight className="ml-1 h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onDismiss?.(alert.id)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
