// ============================================================================
// useTracking Hook
// ============================================================================

import { useState, useCallback } from 'react';
import { trackingService } from '@/services/tracking.service';
import type { TrackingSession, TrackingLocation } from '@/types/tracking.types';

export const useTracking = () => {
  const [sessions, setSessions] = useState<TrackingSession[]>([]);
  const [activeSession, setActiveSession] = useState<TrackingSession | null>(null);
  const [route, setRoute] = useState<TrackingLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await trackingService.getSessions();
      setSessions(response.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSession = useCallback(async (id: string) => {
    const session = await trackingService.getSession(id);
    setActiveSession(session);
    return session;
  }, []);

  const fetchRoute = useCallback(async (sessionId: string) => {
    const locations = await trackingService.getRoute(sessionId);
    setRoute(locations);
    return locations;
  }, []);

  return { sessions, activeSession, route, isLoading, fetchSessions, fetchSession, fetchRoute };
};
