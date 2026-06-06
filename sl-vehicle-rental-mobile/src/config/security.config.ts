// ============================================================================
// Security Configuration
// ============================================================================

export const securityConfig = {
  // Token storage keys
  storageKeys: {
    accessToken: 'rentlk_access_token',
    refreshToken: 'rentlk_refresh_token',
    tokenExpiry: 'rentlk_token_expiry',
    biometricEnabled: 'rentlk_biometric_enabled',
    pinHash: 'rentlk_pin_hash',
    lastActivity: 'rentlk_last_activity',
  },

  // Token settings
  token: {
    // Buffer before expiry to trigger refresh (seconds)
    refreshBufferSeconds: 300, // 5 minutes before expiry
    // Max retry attempts for token refresh
    maxRefreshRetries: 3,
    // Delay between refresh retries (ms)
    refreshRetryDelay: 1000,
  },

  // Biometric
  biometric: {
    // Auto-lock after inactivity (seconds)
    autoLockTimeout: 300, // 5 minutes
    // Require biometric for sensitive actions
    requireForPayments: true,
    requireForPayouts: true,
    requireForSettings: false,
  },

  // PIN
  pin: {
    length: 6,
    maxAttempts: 5,
    lockoutDuration: 30 * 60 * 1000, // 30 minutes in ms
  },

  // Session
  session: {
    // Max session duration (24 hours)
    maxDuration: 24 * 60 * 60 * 1000,
    // Extend session on activity
    extendOnActivity: true,
  },

  // Rate limiting (client-side)
  rateLimit: {
    loginAttempts: {
      max: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    otpRequests: {
      max: 3,
      windowMs: 60 * 1000, // 1 minute
    },
    paymentActions: {
      max: 10,
      windowMs: 60 * 1000, // 1 minute
    },
  },

  // Sensitive data
  sensitiveData: {
    // Never log these fields
    redactedFields: ['password', 'token', 'refreshToken', 'cardNumber', 'cvv', 'pin'],
    // Never store card data on device
    storeCardData: false,
  },
} as const;
