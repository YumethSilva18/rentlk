// ============================================================================
// Tracking Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { TrackingSession, TrackingLocation, Geofence, GeofenceAlert, SpeedAlert } from '@/types/tracking.types';

class TrackingService {
  async getSessions(params?: PaginationParams): Promise<PaginatedResponse<TrackingSession>> {
    return api.get<PaginatedResponse<TrackingSession>>(
      apiConfig.endpoints.tracking.sessions,
      { params }
    );
  }

  async getSession(id: string): Promise<TrackingSession> {
    const response = await api.get<ApiResponse<TrackingSession>>(
      apiConfig.endpoints.tracking.session(id)
    );
    return response.data!;
  }

  async getLocations(sessionId: string, params?: PaginationParams): Promise<PaginatedResponse<TrackingLocation>> {
    return api.get<PaginatedResponse<TrackingLocation>>(
      apiConfig.endpoints.tracking.locations(sessionId),
      { params }
    );
  }

  async getRoute(sessionId: string): Promise<TrackingLocation[]> {
    const response = await api.get<ApiResponse<TrackingLocation[]>>(
      apiConfig.endpoints.tracking.route(sessionId)
    );
    return response.data || [];
  }

  async getGeofence(sessionId: string): Promise<Geofence> {
    const response = await api.get<ApiResponse<Geofence>>(
      apiConfig.endpoints.tracking.geofence(sessionId)
    );
    return response.data!;
  }

  async updateLocation(sessionId: string, location: TrackingLocation): Promise<void> {
    await api.post(apiConfig.endpoints.tracking.locations(sessionId), location);
  }
}

export const trackingService = new TrackingService();
