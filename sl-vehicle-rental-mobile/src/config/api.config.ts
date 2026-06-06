// ============================================================================
// API Configuration
// ============================================================================

import { Platform } from 'react-native';

// Detect environment
const isDev = __DEV__;

// Base URL based on platform
const getDefaultBaseUrl = (): string => {
  if (!isDev) return 'https://api.rentlk.lk';

  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to reach host machine's localhost
    return 'http://10.0.2.2:3001';
  }
  // iOS simulator and physical devices in dev use localhost or LAN IP
  return 'http://localhost:3001';
};

export const apiConfig = {
  baseUrl: getDefaultBaseUrl(),
  wsUrl: isDev
    ? Platform.OS === 'android'
      ? 'ws://10.0.2.2:3001'
      : 'ws://localhost:3001'
    : 'wss://api.rentlk.lk',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,

  // API endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refreshToken: '/auth/refresh',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
      verifyPhone: '/auth/verify-phone',
      resendOtp: '/auth/resend-otp',
      me: '/auth/me',
    },
    users: {
      profile: '/users/profile',
      update: '/users/profile',
      preferences: '/users/preferences',
    },
    vehicles: {
      list: '/vehicles',
      detail: (id: string) => `/vehicles/${id}`,
      create: '/vehicles',
      update: (id: string) => `/vehicles/${id}`,
      delete: (id: string) => `/vehicles/${id}`,
      myVehicles: '/vehicles/my',
      search: '/vehicles/search',
      availability: (id: string) => `/vehicles/${id}/availability`,
      images: (id: string) => `/vehicles/${id}/images`,
      stats: '/vehicles/my/stats',
    },
    bookings: {
      list: '/bookings',
      detail: (id: string) => `/bookings/${id}`,
      create: '/bookings',
      confirm: (id: string) => `/bookings/${id}/confirm`,
      cancel: (id: string) => `/bookings/${id}/cancel`,
      complete: (id: string) => `/bookings/${id}/complete`,
      myBookings: '/bookings/my',
      incoming: '/bookings/incoming',
    },
    payments: {
      create: '/payments',
      verify: (id: string) => `/payments/${id}/verify`,
      methods: '/payments/methods',
      addMethod: '/payments/methods',
      removeMethod: (id: string) => `/payments/methods/${id}`,
      history: '/payments/history',
      webhook: '/payments/webhook',
    },
    wallet: {
      balance: '/wallet',
      transactions: '/wallet/transactions',
      ledger: '/wallet/ledger',
      reconcile: '/wallet/reconcile',
      deposit: '/wallet/deposit',
    },
    payouts: {
      list: '/payouts',
      create: '/payouts',
      detail: (id: string) => `/payouts/${id}`,
      cancel: (id: string) => `/payouts/${id}/cancel`,
    },
    kyc: {
      status: '/kyc/status',
      submit: '/kyc/submit',
      resubmit: '/kyc/resubmit',
      eligibility: '/kyc/eligibility',
    },
    messages: {
      conversations: '/messages/conversations',
      conversation: (id: string) => `/messages/conversations/${id}`,
      messages: (id: string) => `/messages/conversations/${id}/messages`,
      send: (id: string) => `/messages/conversations/${id}/messages`,
      markRead: (id: string) => `/messages/conversations/${id}/read`,
      create: '/messages/conversations',
    },
    reviews: {
      list: '/reviews',
      create: '/reviews',
      detail: (id: string) => `/reviews/${id}`,
      vehicle: (id: string) => `/reviews/vehicle/${id}`,
      user: (id: string) => `/reviews/user/${id}`,
      eligibility: '/reviews/eligibility',
      summary: (vehicleId: string) => `/reviews/summary/${vehicleId}`,
    },
    tracking: {
      sessions: '/tracking/sessions',
      session: (id: string) => `/tracking/sessions/${id}`,
      locations: (id: string) => `/tracking/sessions/${id}/locations`,
      route: (id: string) => `/tracking/sessions/${id}/route`,
      geofence: (id: string) => `/tracking/sessions/${id}/geofence`,
    },
    notifications: {
      list: '/notifications',
      markRead: (id: string) => `/notifications/${id}/read`,
      markAllRead: '/notifications/read-all',
      preferences: '/notifications/preferences',
      unread: '/notifications/unread-count',
    },
    admin: {
      dashboard: '/admin/dashboard',
      users: '/admin/users',
      user: (id: string) => `/admin/users/${id}`,
      vehicles: '/admin/vehicles',
      vehicle: (id: string) => `/admin/vehicles/${id}`,
      bookings: '/admin/bookings',
      kyc: '/admin/kyc',
      kycReview: (id: string) => `/admin/kyc/${id}/review`,
      transactions: '/admin/transactions',
      fraud: '/admin/fraud',
      fraudAlert: (id: string) => `/admin/fraud/${id}`,
      reports: '/admin/reports',
      reviews: '/admin/reviews',
      review: (id: string) => `/admin/reviews/${id}`,
    },
    upload: {
      image: '/upload/image',
      document: '/upload/document',
      multiple: '/upload/multiple',
    },
  },
} as const;
