// ============================================================================
// Storage Utils - MMKV storage wrapper for fast key-value storage
// ============================================================================

import { MMKV } from 'react-native-mmkv';

// Create MMKV instance
export const storage = new MMKV({
  id: 'rentlk-storage',
  encryptionKey: 'rentlk-mmkv-encryption-key-2024',
});

// Generic storage helpers
export const StorageUtils = {
  // String operations
  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },

  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  // Number operations
  getNumber: (key: string): number | undefined => {
    const value = storage.getString(key);
    return value ? parseFloat(value) : undefined;
  },

  setNumber: (key: string, value: number): void => {
    storage.set(key, value.toString());
  },

  // Boolean operations
  getBoolean: (key: string): boolean | undefined => {
    const value = storage.getString(key);
    return value === 'true' ? true : value === 'false' ? false : undefined;
  },

  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, value.toString());
  },

  // Object operations (JSON)
  getObject: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    if (!value) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  },

  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  // Array operations
  getArray: <T>(key: string): T[] => {
    const value = storage.getString(key);
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  setArray: <T>(key: string, value: T[]): void => {
    storage.set(key, JSON.stringify(value));
  },

  // Utility operations
  remove: (key: string): void => {
    storage.delete(key);
  },

  clear: (): void => {
    storage.clearAll();
  },

  contains: (key: string): boolean => {
    return storage.contains(key);
  },

  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },
};

// Storage keys constants
export const StorageKeys = {
  // User data (non-sensitive)
  USER_PROFILE: 'user_profile',
  USER_PREFERENCES: 'user_preferences',
  RECENT_SEARCHES: 'recent_searches',
  SAVED_VEHICLES: 'saved_vehicles',

  // App state
  LANGUAGE: 'language',
  THEME: 'theme',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  LAST_SYNC: 'last_sync',

  // Filters
  VEHICLE_FILTERS: 'vehicle_filters',
  BOOKING_FILTERS: 'booking_filters',

  // Push notifications
  PUSH_TOKEN: 'push_token',
  PUSH_PERMISSION_ASKED: 'push_permission_asked',
} as const;
