// ============================================================================
// Environment Configuration
// ============================================================================
// In a real app, use react-native-config or expo-constants
// For now, we use a typed config object
// ============================================================================

export const envConfig = {
  // API
  apiBaseUrl: __DEV__ ? 'http://10.0.2.2:3001' : 'https://api.rentlk.lk',
  apiTimeout: 30000,

  // WebSocket
  wsUrl: __DEV__ ? 'ws://10.0.2.2:3001' : 'wss://api.rentlk.lk',

  // Payment
  payhereMerchantId: '',
  payhereSandbox: __DEV__,
  stripePublishableKey: '',

  // Maps
  googleMapsApiKeyIos: '',
  googleMapsApiKeyAndroid: '',

  // App
  appEnv: __DEV__ ? 'development' : 'production',
  appVersion: '1.0.0',
  enableDevTools: __DEV__,
  enableMockAuth: __DEV__,

  // Push
  expoPushTokenPrefix: 'ExponentPushToken',

  // Security
  tokenRefreshBufferSeconds: 300,
  biometricAuthEnabled: true,
} as const;
