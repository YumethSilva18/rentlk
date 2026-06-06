'use client'

import React from 'react'
import { Trophy, Star, CheckCircle, Circle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProgressStep {
  label: string
  completed: boolean
}

interface UserProgressProps {
  level: number
  xp: number
  nextLevelXp: number
  completedBookings: number
  rating: number
  badges: string[]
  steps?: ProgressStep[]
  isLoading?: boolean
  className?: string
}

const defaultSteps: ProgressStep[] = [
  { label: 'Complete profile', completed: true },
  { label: 'Verify phone number', completed: true },
  { label: 'Complete KYC', completed: false },
  { label: 'First booking', completed: false },
  { label: '5 bookings completed', completed: false },
  { label: 'Become a verified renter', completed: false },
]

export function UserProgress({
  level,
  xp,
  nextLevelXp,
  completedBookings,
  rating,
  badges,
  steps,
  isLoading = false,
  className,
}: UserProgressProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 animate-pulse">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displaySteps = steps || defaultSteps
  const xpPercent = Math.min((xp / nextLevelXp) * 100, 100)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Level {level}</span>
              <span className="text-xs text-muted-foreground">
                {xp} / {nextLevelXp} XP
              </span>
            </div>
            <Progress value={xpPercent} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-lg font-bold">{completedBookings}</p>
            <p className="text-xs text-muted-foreground">Bookings</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-lg font-bold flex items-center justify-center gap-1">
              {rating.toFixed(1)} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
        </div>

        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Milestones</p>
          {displaySteps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              {step.completed ? (
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
              )}
              <span
                className={cn(
                  'text-sm',
                  step.completed ? 'line-through text-muted-foreground' : ''
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
