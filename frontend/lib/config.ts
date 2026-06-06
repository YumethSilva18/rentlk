export const appConfig = {
  name: 'SL Vehicle Rental',
  description: 'Premium Vehicle Rental Marketplace in Sri Lanka',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'ws://localhost:8080',
  
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 50,
  },
  
  upload: {
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'),
    allowedImageTypes: (process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
    maxImagesPerVehicle: 10,
  },
  
  booking: {
    minRentalHours: 24,
    maxRentalDays: 90,
    cancellationWindowHours: 48,
    refundPercentage: 80,
  },
  
  kyc: {
    maxDocumentSize: 5 * 1024 * 1024,
    allowedDocumentTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  
  features: {
    chat: process.env.NEXT_PUBLIC_ENABLE_CHAT !== 'false',
    tracking: process.env.NEXT_PUBLIC_ENABLE_TRACKING !== 'false',
    wallet: process.env.NEXT_PUBLIC_ENABLE_WALLET !== 'false',
  },
  
  maps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    defaultCenter: { lat: 7.8731, lng: 80.7718 },
    defaultZoom: 7,
  },
  
  payment: {
    payhereMerchantId: process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || '',
    stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    ezcashMerchantId: process.env.NEXT_PUBLIC_EZCASH_MERCHANT_ID || '',
  },
} as const

export const ROUTES = {
  home: '/',
  search: '/search',
  rentVehicles: '/rent-vehicles',
  listOwnVehicles: '/list-own-vehicles',
  
  auth: {
    login: '/login',
    signup: '/signup',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyPhone: '/verify-phone',
    kyc: '/kyc',
  },
  
  app: {
    dashboard: '/dashboard',
    myBookings: '/my-bookings',
    myVehicles: '/my-vehicles',
    addVehicle: '/add-vehicle',
    editVehicle: (id: string) => `/edit-vehicle/${id}`,
    messages: '/messages',
    chat: (id: string) => `/chat/${id}`,
    payments: '/payments',
    wallet: '/wallet',
    profile: '/profile',
    settings: '/settings',
    notifications: '/notifications',
    savedVehicles: '/saved-vehicles',
    reviews: '/reviews',
    tracking: (id: string) => `/tracking/${id}`,
    bookingDetail: (id: string) => `/bookings/${id}`,
    bookingSuccess: '/bookings/success',
    bookingCancel: '/bookings/cancel',
    bookingInvoice: (id: string) => `/bookings/invoice/${id}`,
    helpCenter: '/help-center',
  },
  
  admin: {
    dashboard: '/admin',
    users: '/admin/users',
    vehicles: '/admin/vehicles',
    bookings: '/admin/bookings',
    kycReviews: '/admin/kyc-reviews',
    transactions: '/admin/transactions',
    fraudAlerts: '/admin/fraud-alerts',
    reports: '/admin/reports',
  },
  
  marketing: {
    about: '/about',
    contact: '/contact',
    faq: '/faq',
    terms: '/terms',
    privacy: '/privacy',
    vehicleDetail: (id: string) => `/vehicles/${id}`,
  },
} as const
