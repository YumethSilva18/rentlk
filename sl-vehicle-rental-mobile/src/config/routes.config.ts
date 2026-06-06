// ============================================================================
// Route Configuration - Navigation route names
// ============================================================================

export const Routes = {
  // Auth Stack
  Auth: {
    Welcome: 'Welcome',
    Login: 'Login',
    Signup: 'Signup',
    PhoneVerification: 'PhoneVerification',
    ForgotPassword: 'ForgotPassword',
    ResetPassword: 'ResetPassword',
    KYC: 'KYC',
  },

  // Main Tab Navigator
  Tabs: {
    Home: 'HomeTab',
    Bookings: 'BookingsTab',
    Messages: 'MessagesTab',
    Profile: 'ProfileTab',
  },

  // Home Stack
  Home: {
    Home: 'Home',
    Search: 'Search',
    Explore: 'Explore',
    Notifications: 'Notifications',
    VehicleList: 'VehicleList',
    VehicleDetail: 'VehicleDetail',
    VehicleSearch: 'VehicleSearch',
  },

  // Bookings Stack
  Bookings: {
    MyBookings: 'MyBookings',
    BookingDetail: 'BookingDetail',
    BookingCreate: 'BookingCreate',
    BookingConfirmation: 'BookingConfirmation',
    BookingSuccess: 'BookingSuccess',
    Invoice: 'Invoice',
  },

  // Vehicles Stack
  Vehicles: {
    MyVehicles: 'MyVehicles',
    AddVehicle: 'AddVehicle',
    EditVehicle: 'EditVehicle',
    SavedVehicles: 'SavedVehicles',
  },

  // Messages Stack
  Messages: {
    Conversations: 'Conversations',
    Chat: 'Chat',
    NewMessage: 'NewMessage',
  },

  // Profile Stack
  Profile: {
    Profile: 'Profile',
    EditProfile: 'EditProfile',
    Settings: 'Settings',
    Security: 'Security',
    KYCStatus: 'KYCStatus',
    Wallet: 'Wallet',
    Payout: 'Payout',
    PaymentMethods: 'PaymentMethods',
    PaymentHistory: 'PaymentHistory',
    Reviews: 'Reviews',
    WriteReview: 'WriteReview',
    HelpCenter: 'HelpCenter',
    ContactSupport: 'ContactSupport',
    FAQ: 'FAQ',
  },

  // Tracking
  Tracking: {
    Tracking: 'Tracking',
    Map: 'Map',
    RouteHistory: 'RouteHistory',
  },

  // Payments
  Payments: {
    Payment: 'Payment',
    PaymentSuccess: 'PaymentSuccess',
    PaymentFailure: 'PaymentFailure',
  },

  // Admin Stack
  Admin: {
    AdminHome: 'AdminHome',
    AdminUsers: 'AdminUsers',
    AdminVehicles: 'AdminVehicles',
    AdminBookings: 'AdminBookings',
    AdminKYC: 'AdminKYC',
    AdminTransactions: 'AdminTransactions',
    AdminFraud: 'AdminFraud',
    AdminReports: 'AdminReports',
  },
} as const;

// Type-safe route names
export type AuthRoute = typeof Routes.Auth[keyof typeof Routes.Auth];
export type TabRoute = typeof Routes.Tabs[keyof typeof Routes.Tabs];
export type HomeRoute = typeof Routes.Home[keyof typeof Routes.Home];
export type BookingRoute = typeof Routes.Bookings[keyof typeof Routes.Bookings];
export type ProfileRoute = typeof Routes.Profile[keyof typeof Routes.Profile];
export type AdminRoute = typeof Routes.Admin[keyof typeof Routes.Admin];
