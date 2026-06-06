// ============================================================================
// Permissions Utils - Permission request helpers for Expo
// ============================================================================

import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert, Linking } from 'react-native';

/**
 * Request location permission
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    showPermissionDeniedAlert('Location');
    return false;
  }
  return true;
};

/**
 * Check if location permission is already granted
 */
export const hasLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
};

/**
 * Request camera permission
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    showPermissionDeniedAlert('Camera');
    return false;
  }
  return true;
};

/**
 * Request photo library permission
 */
export const requestPhotoLibraryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    showPermissionDeniedAlert('Photo Library');
    return false;
  }
  return true;
};

/**
 * Show alert when permission is denied with option to open settings
 */
const showPermissionDeniedAlert = (permissionName: string): void => {
  Alert.alert(
    `${permissionName} Permission Required`,
    `Please enable ${permissionName} permission in your device settings to use this feature.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings(),
      },
    ]
  );
};

/**
 * Request notification permission (iOS only, Android auto-grants on API < 33)
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    // Use expo-notifications getPermissionsAsync
    const { status } = await import('expo-notifications').then(
      (module) => module.default.getPermissionsAsync()
    );
    if (status !== 'granted') {
      const { status: newStatus } = await import('expo-notifications').then(
        (module) => module.default.requestPermissionsAsync()
      );
      if (newStatus !== 'granted') {
        showPermissionDeniedAlert('Notifications');
        return false;
      }
    }
  }
  return true;
};

/**
 * Open app settings
 */
export const openSettings = (): void => {
  Linking.openSettings();
};
