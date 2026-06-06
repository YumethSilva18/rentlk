'use client'

import React from 'react'
import { UserProfileHeader } from './UserProfileHeader'
import { UserReviews } from './UserReviews'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { UserProfile as UserProfileType, Review } from '@/types'

interface UserProfileProps {
  profile: UserProfileType
  reviews: Review[]
  isOwnProfile?: boolean
  onEdit?: () => void
  onMessage?: () => void
  isLoading?: boolean
  className?: string
}

export function UserProfile({
  profile,
  reviews,
  isOwnProfile = false,
  onEdit,
  onMessage,
  isLoading = false,
  className,
}: UserProfileProps) {
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className || ''}`}>
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-t-lg" />
          <div className="p-6 space-y-4">
            <div className="flex gap-4">
              <div className="h-24 w-24 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-40 bg-muted rounded" />
                <div className="h-4 w-60 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <UserProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onEdit={onEdit}
        onMessage={onMessage}
      />

      <Tabs defaultValue="reviews">
        <TabsList>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="reviews" className="mt-4">
          <UserReviews reviews={reviews} />
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <div className="rounded-lg border p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Bio</h3>
              <p className="text-sm">{profile.bio || 'No bio provided.'}</p>
            </div>
            {profile.address && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Address</h3>
                <p className="text-sm">{profile.address}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h3>
                <p className="text-sm">{new Date(profile.joinedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Verification</h3>
                <p className="text-sm">{profile.isVerified ? 'Verified' : 'Not Verified'}</p>
              </div>
              {profile.responseRate !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Response Rate</h3>
                  <p className="text-sm">{profile.responseRate}%</p>
                </div>
              )}
              {profile.responseTime && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Response Time</h3>
                  <p className="text-sm">{profile.responseTime}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="settings" className="mt-4">
            <div className="rounded-lg border p-6 text-center text-muted-foreground">
              <p className="text-sm">Use the Edit Profile button to update your settings.</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
