// ============================================================================
// Application Configuration
// ============================================================================

export const appConfig = {
  name: 'RentLK',
  fullName: 'SL Vehicle Rental',
  description: 'Premium vehicle rental marketplace for Sri Lanka',
  version: '1.0.0',
  buildNumber: 1,
  scheme: 'rentlk',
  bundleId: {
    ios: 'lk.rentlk.mobile',
    android: 'lk.rentlk.mobile',
  },
  supportEmail: 'support@rentlk.lk',
  supportPhone: '+94 11 234 5678',
  website: 'https://rentlk.lk',
  socialLinks: {
    facebook: 'https://facebook.com/rentlk',
    instagram: 'https://instagram.com/rentlk',
    twitter: 'https://twitter.com/rentlk',
  },
  features: {
    enableBiometricLogin: true,
    enablePushNotifications: true,
    enableDarkMode: false, // Future
    enableMultipleLanguages: true,
    enableReferralSystem: false, // Future
  },
  limits: {
    maxVehicleImages: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxMessageLength: 2000,
    maxBioLength: 500,
    minPasswordLength: 8,
    maxSearchResults: 50,
  },
} as const;
