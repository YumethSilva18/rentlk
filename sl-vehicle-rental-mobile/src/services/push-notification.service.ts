// ============================================================================
// Push Notification Service - Expo Notifications
// ============================================================================

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from './api.service';
import { StorageUtils, StorageKeys } from '@/utils/storage';
import type { Notification } from '@/types/notification.types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type NotificationCallback = (notification: Notifications.Notification) => void;

class PushNotificationService {
  private listeners: Set<NotificationCallback> = new Set();
  private subscription: Notifications.Subscription | null = null;

  async initialize(): Promise<void> {
    // Register for push notifications
    await this.registerForPush();

    // Listen for incoming notifications
    this.subscription = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
      this.listeners.forEach((cb) => cb(notification));
    });
  }

  async registerForPush(): Promise<string | null> {
    // Check if we already have a token
    const existingToken = StorageUtils.getString(StorageKeys.PUSH_TOKEN);
    if (existingToken) return existingToken;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#001F3F',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'rentlk-mobile',
      });
      const token = tokenData.data;

      // Save token locally
      StorageUtils.setString(StorageKeys.PUSH_TOKEN, token);

      // Send token to backend
      await this.registerToken(token);

      return token;
    } catch {
      return null;
    }
  }

  async registerToken(token: string): Promise<void> {
    try {
      await api.post('/notifications/register-token', {
        token,
        platform: Platform.OS,
      });
    } catch {
      // Non-critical: token registration failure
    }
  }

  async unregister(): Promise<void> {
    const token = StorageUtils.getString(StorageKeys.PUSH_TOKEN);
    if (token) {
      try {
        await api.post('/notifications/unregister-token', { token });
      } catch {
        // Ignore
      }
    }
    StorageUtils.remove(StorageKeys.PUSH_TOKEN);
  }

  onNotification(callback: NotificationCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  async scheduleLocalNotification(title: string, body: string, data?: Record<string, unknown>): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: null, // Immediate
    });
  }

  destroy(): void {
    if (this.subscription) {
      Notifications.removeNotificationSubscription(this.subscription);
      this.subscription = null;
    }
    this.listeners.clear();
  }
}

export const pushNotificationService = new PushNotificationService();
