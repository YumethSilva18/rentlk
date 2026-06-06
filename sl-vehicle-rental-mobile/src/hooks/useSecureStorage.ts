// ============================================================================
// useSecureStorage Hook
// ============================================================================

import { useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';

export const useSecureStorage = (key: string) => {
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const get = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    try {
      const stored = await SecureStore.getItemAsync(key);
      setValue(stored);
      return stored;
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const set = useCallback(async (newValue: string): Promise<void> => {
    setIsLoading(true);
    try {
      await SecureStore.setItemAsync(key, newValue);
      setValue(newValue);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const remove = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync(key);
      setValue(null);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  return { value, isLoading, get, set, remove };
};
