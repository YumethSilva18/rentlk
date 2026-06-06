'use client'

import { useState, useCallback, useEffect } from 'react'

interface LocationState {
  latitude: number
  longitude: number
  error: string | null
  loading: boolean
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: 0,
    longitude: 0,
    error: null,
    loading: false,
  })

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: 'Geolocation is not supported' }))
      return
    }

    setLocation((prev) => ({ ...prev, loading: true }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        })
      },
      (err) => {
        setLocation((prev) => ({
          ...prev,
          error: err.message,
          loading: false,
        }))
      }
    )
  }, [])

  const watchPosition = useCallback(
    (onUpdate: (lat: number, lng: number) => void) => {
      if (!navigator.geolocation) return () => {}

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          onUpdate(position.coords.latitude, position.coords.longitude)
        },
        (err) => {
          setLocation((prev) => ({ ...prev, error: err.message }))
        }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    },
    []
  )

  return {
    ...location,
    getCurrentPosition,
    watchPosition,
  }
}
