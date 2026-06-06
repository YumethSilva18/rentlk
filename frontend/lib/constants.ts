export const APP_NAME = 'SL Vehicle Rental'
export const APP_DESCRIPTION = 'Premium vehicle rental marketplace for Sri Lanka'
export const COMMISSION_RATE = 0.05

export const SRI_LANKAN_CITIES = [
  'Colombo',
  'Kandy',
  'Galle',
  'Negombo',
  'Jaffna',
  'Matara',
  'Kurunegala',
  'Anuradhapura',
  'Trincomalee',
  'Batticaloa',
  'Nuwara Eliya',
  'Ratnapura',
  'Badulla',
  'Polonnaruwa',
  'Hambantota',
]

export const VEHICLE_TYPES = [
  { value: 'car', label: 'Car' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'minibus', label: 'Minibus' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'tuk-tuk', label: 'Tuk-Tuk' },
  { value: 'luxury', label: 'Luxury' },
]

export const TRANSMISSION_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
]

export const FUEL_TYPES = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
]

export const SEATS_OPTIONS = [2, 4, 5, 6, 7, 8, 9, 12, 15, 20]

export const VEHICLE_FEATURES = [
  { value: 'ac', label: 'Air Conditioning' },
  { value: 'gps', label: 'GPS Navigation' },
  { value: 'bluetooth', label: 'Bluetooth' },
  { value: 'usb', label: 'USB Charging' },
  { value: 'camera', label: 'Backup Camera' },
  { value: 'parking-sensors', label: 'Parking Sensors' },
  { value: 'sunroof', label: 'Sunroof' },
  { value: 'heated-seats', label: 'Heated Seats' },
  { value: 'cruise-control', label: 'Cruise Control' },
  { value: 'abs', label: 'ABS' },
  { value: 'airbags', label: 'Airbags' },
  { value: 'child-seat', label: 'Child Seat Available' },
]

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const KYC_STATUS = {
  NOT_STARTED: 'not_started',
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
}

export const PAYMENT_METHODS = [
  { value: 'payhere', label: 'PayHere', icon: '💳' },
  { value: 'stripe', label: 'Credit/Debit Card', icon: '💳' },
  { value: 'ezcash', label: 'EZ Cash', icon: '📱' },
  { value: 'wallet', label: 'Wallet', icon: '👛' },
]

export const ADD_ONS = [
  { id: 'insurance', name: 'Full Insurance', price: 500, icon: '🛡️' },
  { id: 'driver', name: 'Driver Service', price: 2000, icon: '👨‍✈️' },
  { id: 'gps', name: 'GPS Device', price: 200, icon: '🗺️' },
  { id: 'child-seat', name: 'Child Safety Seat', price: 300, icon: '👶' },
  { id: 'wifi', name: 'Mobile WiFi', price: 400, icon: '📶' },
]

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
]

export const ROUTES = {
  HOME: '/',
  RENT_VEHICLES: '/rent-vehicles',
  LIST_VEHICLES: '/list-own-vehicles',
  SEARCH: '/search',
  VEHICLE_DETAIL: '/vehicles',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  SIGNUP: '/signup',
  LOGIN: '/login',
  VERIFY_PHONE: '/verify-phone',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  KYC: '/kyc',
  DASHBOARD: '/dashboard',
  MY_BOOKINGS: '/my-bookings',
  MY_VEHICLES: '/my-vehicles',
  ADD_VEHICLE: '/add-vehicle',
  MESSAGES: '/messages',
  PAYMENTS: '/payments',
  WALLET: '/wallet',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
  SAVED_VEHICLES: '/saved-vehicles',
  REVIEWS: '/reviews',
  HELP_CENTER: '/help-center',
  ADMIN: '/admin',
}
