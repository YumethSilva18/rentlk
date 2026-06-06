// ============================================================================
// useBiometric Hook - Biometric authentication
// ============================================================================

import { useState, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { securityConfig } from '@/config/security.config';
import { hashString, verifyHash } from '@/utils/idempotency';

export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAvailability = useCallback(async (): Promise<boolean> => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const available = hasHardware && isEnrolled;
    setIsAvailable(available);
    return available;
  }, []);

  const checkEnabled = useCallback(async (): Promise<boolean> => {
    const enabled = await SecureStore.getItemAsync(securityConfig.storageKeys.biometricEnabled);
    const result = enabled === 'true';
    setIsEnabled(result);
    return result;
  }, []);

  const enable = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable Biometric Login',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (auth.success) {
        await SecureStore.setItemAsync(securityConfig.storageKeys.biometricEnabled, 'true');
        setIsEnabled(true);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disable = useCallback(async (): Promise<void> => {
    await SecureStore.deleteItemAsync(securityConfig.storageKeys.biometricEnabled);
    setIsEnabled(false);
  }, []);

  const authenticate = useCallback(async (reason = 'Authenticate to continue'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        fallbackLabel: 'Use PIN',
      });
      return result.success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // PIN management
  const setPIN = useCallback(async (pin: string): Promise<void> => {
    const hashed = await hashString(pin);
    await SecureStore.setItemAsync(securityConfig.storageKeys.pinHash, hashed);
  }, []);

  const verifyPIN = useCallback(async (pin: string): Promise<boolean> => {
    const storedHash = await SecureStore.getItemAsync(securityConfig.storageKeys.pinHash);
    if (!storedHash) return false;
    return verifyHash(pin, storedHash);
  }, []);

  const hasPIN = useCallback(async (): Promise<boolean> => {
    const hash = await SecureStore.getItemAsync(securityConfig.storageKeys.pinHash);
    return hash !== null;
  }, []);

  return {
    isAvailable,
    isEnabled,
    isLoading,
    checkAvailability,
    checkEnabled,
    enable,
    disable,
    authenticate,
    setPIN,
    verifyPIN,
    hasPIN,
  };
};
