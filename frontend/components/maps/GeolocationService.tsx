'use client'

import React from 'react'

interface GeolocationPosition {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

interface GeolocationServiceState {
  position: GeolocationPosition | null
  error: string | null
  isLoading: boolean
  isWatching: boolean
}

interface GeolocationServiceReturn extends GeolocationServiceState {
  getCurrentPosition: () => void
  startWatching: () => void
  stopWatching: () => void
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number
}

export function useGeolocation(): GeolocationServiceReturn {
  const [state, setState] = React.useState<GeolocationServiceState>({
    position: null,
    error: null,
    isLoading: false,
    isWatching: false,
  })
  const watchIdRef = React.useRef<number | null>(null)

  const getCurrentPosition = React.useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Geolocation is not supported by this browser.' }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState((prev) => ({
          ...prev,
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          },
          isLoading: false,
        }))
      },
      (error) => {
        let message = 'Unable to retrieve location.'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access.'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            message = 'Location request timed out.'
            break
        }
        setState((prev) => ({ ...prev, error: message, isLoading: false }))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }, [])

  const startWatching = React.useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Geolocation is not supported.' }))
      return
    }

    setState((prev) => ({ ...prev, isWatching: true, error: null }))

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setState((prev) => ({
          ...prev,
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          },
        }))
      },
      (error) => {
        setState((prev) => ({ ...prev, error: 'Failed to watch location.', isWatching: false }))
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }, [])

  const stopWatching = React.useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setState((prev) => ({ ...prev, isWatching: false }))
  }, [])

  React.useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const toRad = (deg: number): number => (deg * Math.PI) / 180

  return {
    ...state,
    getCurrentPosition,
    startWatching,
    stopWatching,
    calculateDistance,
  }
}
