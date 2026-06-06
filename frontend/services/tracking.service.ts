import { api } from './api'
import type { ApiResponse, TrackingSession, TrackingLocation } from '@/types'

export const trackingService = {
  getSession: (bookingId: string) =>
    api.get<ApiResponse<TrackingSession>>(`/tracking/booking/${bookingId}`),

  startSession: (bookingId: string) =>
    api.post<ApiResponse<TrackingSession>>(`/tracking/booking/${bookingId}/start`),

  updateLocation: (sessionId: string, location: TrackingLocation) =>
    api.post<ApiResponse<null>>(`/tracking/session/${sessionId}/location`, location),

  getRoute: (sessionId: string) =>
    api.get<ApiResponse<TrackingLocation[]>>(`/tracking/session/${sessionId}/route`),

  endSession: (sessionId: string) =>
    api.post<ApiResponse<TrackingSession>>(`/tracking/session/${sessionId}/end`),

  getActiveSessions: () =>
    api.get<ApiResponse<TrackingSession[]>>('/tracking/active'),

  getSessionStats: (sessionId: string) =>
    api.get<ApiResponse<{
      totalDistance: number
      averageSpeed: number
      maxSpeed: number
      duration: number
    }>>(`/tracking/session/${sessionId}/stats`),
}
