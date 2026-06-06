// ============================================================================
// useLocation Hook
// ============================================================================

import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { requestLocationPermission } from '@/utils/permissions';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setError('Location permission denied');
        return null;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const data: LocationData = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
      };

      setLocation(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const watchLocation = useCallback(async (callback: (loc: LocationData) => void) => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    return Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (loc) => {
        const data: LocationData = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracy: loc.coords.accuracy,
        };
        setLocation(data);
        callback(data);
      }
    );
  }, []);

  return { location, isLoading, error, getCurrentLocation, watchLocation };
};
