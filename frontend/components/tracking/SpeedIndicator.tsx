'use client'

import React from 'react'
import { Gauge, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SpeedIndicatorProps {
  currentSpeed: number
  maxSpeed: number
  averageSpeed: number
  speedLimit?: number
  unit?: 'km/h' | 'mph'
  isLoading?: boolean
  className?: string
}

export function SpeedIndicator({
  currentSpeed,
  maxSpeed,
  averageSpeed,
  speedLimit = 80,
  unit = 'km/h',
  isLoading = false,
  className,
}: SpeedIndicatorProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 animate-pulse">
          <div className="flex flex-col items-center gap-3">
            <div className="h-32 w-32 rounded-full bg-muted" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const speedPercentage = Math.min((currentSpeed / speedLimit) * 100, 100)
  const isOverspeeding = currentSpeed > speedLimit
  const gaugeRotation = (speedPercentage / 100) * 270 - 135 // -135 to 135 degrees

  const getSpeedColor = (speed: number) => {
    const ratio = speed / speedLimit
    if (ratio <= 0.5) return 'text-green-600'
    if (ratio <= 0.8) return 'text-yellow-600'
    if (ratio <= 1.0) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            {/* Speed gauge */}
            <svg className="w-40 h-40 -rotate-[135deg]" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="currentColor" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(speedPercentage / 100) * 327} 327`}
                className={cn(getSpeedColor(currentSpeed))}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-4xl font-bold', getSpeedColor(currentSpeed))}>
                {Math.round(currentSpeed)}
              </span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
          </div>

          {isOverspeeding && (
            <Badge variant="destructive" className="mb-3">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Overspeeding
            </Badge>
          )}

          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                <Gauge className="h-3 w-3" /> Current
              </div>
              <p className={cn('text-lg font-bold', getSpeedColor(currentSpeed))}>
                {Math.round(currentSpeed)}
              </p>
              <p className="text-[10px] text-muted-foreground">{unit}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                <TrendingUp className="h-3 w-3" /> Max
              </div>
              <p className="text-lg font-bold">{Math.round(maxSpeed)}</p>
              <p className="text-[10px] text-muted-foreground">{unit}</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                <Gauge className="h-3 w-3" /> Avg
              </div>
              <p className="text-lg font-bold">{Math.round(averageSpeed)}</p>
              <p className="text-[10px] text-muted-foreground">{unit}</p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full mt-3 pt-3 border-t">
            <span className="text-xs text-muted-foreground">Speed Limit</span>
            <span className="text-sm font-medium">{speedLimit} {unit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
