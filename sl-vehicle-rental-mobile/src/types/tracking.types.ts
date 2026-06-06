// ============================================================================
// Tracking Types - Ported from web frontend
// ============================================================================

export interface TrackingLocation {
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
  timestamp: string;
}

export interface TrackingSession {
  id: string;
  bookingId: string;
  vehicleId: string;
  renterId: string;
  ownerId: string;
  status: TrackingStatus;
  startLocation: TrackingLocation;
  currentLocation?: TrackingLocation;
  route: TrackingLocation[];
  startTime: string;
  endTime?: string;
  totalDistance: number;
  averageSpeed: number;
  maxSpeed: number;
}

export type TrackingStatus = 'pending' | 'active' | 'paused' | 'completed';

export interface Geofence {
  id: string;
  name: string;
  center: { latitude: number; longitude: number };
  radius: number;
  type: 'circle' | 'polygon';
  coordinates?: { latitude: number; longitude: number }[];
}

export interface GeofenceAlert {
  id: string;
  sessionId: string;
  geofenceId: string;
  type: 'enter' | 'exit';
  location: TrackingLocation;
  timestamp: string;
}

export interface SpeedAlert {
  id: string;
  sessionId: string;
  speed: number;
  limit: number;
  location: TrackingLocation;
  timestamp: string;
}
