// ============================================================================
// Geo Utils - Geolocation helpers and distance calculations
// ============================================================================

import type { TrackingLocation } from '@/types/tracking.types';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate total route distance from array of locations
 */
export const calculateRouteDistance = (locations: TrackingLocation[]): number => {
  let total = 0;
  for (let i = 1; i < locations.length; i++) {
    total += calculateDistance(
      locations[i - 1].latitude,
      locations[i - 1].longitude,
      locations[i].latitude,
      locations[i].longitude
    );
  }
  return Math.round(total * 100) / 100;
};

/**
 * Format distance for display
 */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

/**
 * Calculate initial bearing between two points
 */
export const calculateBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const bearing = Math.atan2(y, x);
  return ((toDeg(bearing) + 360) % 360);
};

/**
 * Check if a point is within a circular geofence
 */
export const isWithinGeofence = (
  point: { latitude: number; longitude: number },
  center: { latitude: number; longitude: number },
  radiusMeters: number
): boolean => {
  const distanceKm = calculateDistance(
    point.latitude,
    point.longitude,
    center.latitude,
    center.longitude
  );
  return distanceKm * 1000 <= radiusMeters;
};

/**
 * Get approximate address from coordinates (simple reverse geocode helper)
 * Note: For actual reverse geocoding, use a geocoding API
 */
export const getRegionForCoordinates = (
  lat: number,
  lng: number
): string => {
  // Simple bounding box check for Sri Lankan cities
  const cities: { name: string; lat: number; lng: number; radius: number }[] = [
    { name: 'Colombo', lat: 6.9271, lng: 79.8612, radius: 0.15 },
    { name: 'Kandy', lat: 7.2906, lng: 80.6337, radius: 0.1 },
    { name: 'Galle', lat: 6.0535, lng: 80.2210, radius: 0.1 },
    { name: 'Negombo', lat: 7.2083, lng: 79.8358, radius: 0.1 },
    { name: 'Jaffna', lat: 9.6615, lng: 80.0255, radius: 0.1 },
    { name: 'Matara', lat: 5.9549, lng: 80.5550, radius: 0.1 },
    { name: 'Nuwara Eliya', lat: 6.9497, lng: 80.7891, radius: 0.1 },
  ];

  for (const city of cities) {
    const dist = calculateDistance(lat, lng, city.lat, city.lng);
    if (dist <= city.radius * 111) { // Rough conversion
      return city.name;
    }
  }

  return 'Sri Lanka';
};

// Helper functions
const toRad = (deg: number): number => (deg * Math.PI) / 180;
const toDeg = (rad: number): number => (rad * 180) / Math.PI;
