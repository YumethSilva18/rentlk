// ============================================================================
// useWebSocket Hook
// ============================================================================

import { useEffect, useState } from 'react';
import { webSocketService } from '@/services/websocket.service';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubConnect = webSocketService.on('connected', () => {
      setIsConnected(true);
    });

    const unsubDisconnect = webSocketService.on('disconnected', () => {
      setIsConnected(false);
    });

    // Set initial state
    setIsConnected(webSocketService.isConnected);

    return () => {
      unsubConnect();
      unsubDisconnect();
    };
  }, []);

  return {
    isConnected,
    connect: webSocketService.connect.bind(webSocketService),
    disconnect: webSocketService.disconnect.bind(webSocketService),
  };
};
