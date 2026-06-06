'use client'

import React from 'react'
import { Star, MapPin, ShieldCheck, Award, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate } from '@/lib/utils'
import type { UserProfile } from '@/types'

interface UserProfileHeaderProps {
  profile: UserProfile
  isOwnProfile?: boolean
  onEdit?: () => void
  onMessage?: () => void
  className?: string
}

export function UserProfileHeader({ profile, isOwnProfile = false, onEdit, onMessage, className }: UserProfileHeaderProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
      <CardContent className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
          <div className="relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-3xl font-bold text-primary">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                profile.name.charAt(0).toUpperCase()
              )}
            </div>
            {profile.isVerified && (
              <ShieldCheck className="absolute -bottom-1 -right-1 h-6 w-6 text-blue-500 bg-background rounded-full" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{profile.name}</h2>
              {profile.badges && profile.badges.length > 0 && (
                <Award className="h-5 w-5 text-yellow-500" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
              {profile.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {profile.city}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Joined {formatDate(profile.joinedAt)}
              </span>
              {profile.responseRate !== undefined && (
                <span>{profile.responseRate}% response rate</span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div>
                <span className="font-semibold">{profile.totalReviews || 0}</span>
                <span className="text-muted-foreground"> reviews</span>
              </div>
              <div>
                <span className="font-semibold">{profile.totalBookings || 0}</span>
                <span className="text-muted-foreground"> bookings</span>
              </div>
              <div>
                <span className="font-semibold">{profile.totalListings || 0}</span>
                <span className="text-muted-foreground"> listings</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {isOwnProfile ? (
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit Profile
              </Button>
            ) : (
              <Button size="sm" onClick={onMessage}>
                Message
              </Button>
            )}
          </div>
        </div>

        {profile.bio && (
          <p className="mt-4 text-sm text-muted-foreground">{profile.bio}</p>
        )}

        {profile.badges && profile.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {profile.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
