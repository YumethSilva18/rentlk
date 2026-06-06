// ============================================================================
// WebSocket Service - Socket.io client for real-time messaging/notifications
// ============================================================================

import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { apiConfig } from '@/config/api.config';
import { securityConfig } from '@/config/security.config';
import type { Message, TypingIndicator } from '@/types/message.types';
import type { Notification } from '@/types/notification.types';
import type { TrackingLocation } from '@/types/tracking.types';

type EventCallback<T> = (data: T) => void;

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<EventCallback<unknown>>> = new Map();

  async connect(): Promise<void> {
    if (this.socket?.connected) return;

    const token = await SecureStore.getItemAsync(securityConfig.storageKeys.accessToken);
    if (!token) return;

    this.socket = io(apiConfig.wsUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      if (__DEV__) console.log('[WS] Connected');
      this.emit('connected', {});
    });

    this.socket.on('disconnect', (reason: string) => {
      if (__DEV__) console.log('[WS] Disconnected:', reason);
      this.emit('disconnected', { reason });
    });

    this.socket.on('error', (error: unknown) => {
      if (__DEV__) console.error('[WS] Error:', error);
      this.emit('error', error);
    });

    // Register default event handlers
    this.registerDefaultHandlers();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Message events
  onNewMessage(callback: EventCallback<Message>): () => void {
    return this.on('new_message', callback);
  }

  onTypingIndicator(callback: EventCallback<TypingIndicator>): () => void {
    return this.on('typing_indicator', callback);
  }

  sendTypingIndicator(conversationId: string, isTyping: boolean): void {
    this.socket?.emit('typing', { conversationId, isTyping });
  }

  // Notification events
  onNotification(callback: EventCallback<Notification>): () => void {
    return this.on('notification', callback);
  }

  // Tracking events
  onLocationUpdate(callback: EventCallback<{ sessionId: string; location: TrackingLocation }>): () => void {
    return this.on('location_update', callback);
  }

  sendLocationUpdate(sessionId: string, location: TrackingLocation): void {
    this.socket?.emit('update_location', { sessionId, location });
  }

  // Generic event system
  on<T>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as EventCallback<unknown>);

    this.socket?.on(event, (data: T) => {
      callback(data);
    });

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback as EventCallback<unknown>);
      this.socket?.off(event);
    };
  }

  private emit(event: string, data: unknown): void {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }

  private registerDefaultHandlers(): void {
    if (!this.socket) return;

    // Forward server events to local listeners
    const events = ['new_message', 'typing_indicator', 'notification', 'location_update', 'booking_update'];
    events.forEach((event) => {
      this.socket!.on(event, (data: unknown) => {
        this.emit(event, data);
      });
    });
  }
}

export const webSocketService = new WebSocketService();
