'use client'

import { useCallback, useEffect, useState } from 'react'
import { trackingService } from '@/services/tracking.service'
import type { TrackingSession, TrackingLocation } from '@/types'

export function useTracking() {
  const [activeSession, setActiveSession] = useState<TrackingSession | null>(null)
  const [route, setRoute] = useState<TrackingLocation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSession = useCallback(async (bookingId: string) => {
    setIsLoading(true)
    try {
      const response = await trackingService.getSession(bookingId)
      setActiveSession(response.data.data ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tracking session')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startSession = useCallback(async (bookingId: string) => {
    setIsLoading(true)
    try {
      const response = await trackingService.startSession(bookingId)
      setActiveSession(response.data.data ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tracking')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateLocation = useCallback(async (location: TrackingLocation) => {
    if (!activeSession) return
    try {
      await trackingService.updateLocation(activeSession.id, location)
      setRoute((prev) => [...prev, location])
    } catch {
      // silently fail for location updates
    }
  }, [activeSession])

  const endSession = useCallback(async () => {
    if (!activeSession) return
    setIsLoading(true)
    try {
      const response = await trackingService.endSession(activeSession.id)
      setActiveSession(response.data.data ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end tracking')
    } finally {
      setIsLoading(false)
    }
  }, [activeSession])

  return {
    activeSession,
    route,
    isLoading,
    error,
    fetchSession,
    startSession,
    updateLocation,
    endSession,
  }
}
