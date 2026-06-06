// ============================================================================
// Constants - Ported from web frontend
// ============================================================================

export const APP_NAME = 'RentLK';
export const APP_DESCRIPTION = 'Premium vehicle rental marketplace for Sri Lanka';
export const COMMISSION_RATE = 0.05;

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
] as const;

export const VEHICLE_TYPES = [
  { value: 'car', label: 'Car' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'minibus', label: 'Minibus' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'scooter', label: 'Scooter' },
  { value: 'tuk-tuk', label: 'Tuk-Tuk' },
  { value: 'luxury', label: 'Luxury' },
] as const;

export const TRANSMISSION_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' },
] as const;

export const FUEL_TYPES = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
] as const;

export const SEATS_OPTIONS = [2, 4, 5, 6, 7, 8, 9, 12, 15, 20] as const;

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
] as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const KYC_STATUS = {
  NOT_STARTED: 'not_started',
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_METHODS = [
  { value: 'payhere', label: 'PayHere', icon: 'credit-card' },
  { value: 'stripe', label: 'Credit/Debit Card', icon: 'credit-card' },
  { value: 'ezcash', label: 'EZ Cash', icon: 'phone' },
  { value: 'wallet', label: 'Wallet', icon: 'wallet' },
] as const;

export const ADD_ONS = [
  { id: 'insurance', name: 'Full Insurance', price: 500 },
  { id: 'driver', name: 'Driver Service', price: 2000 },
  { id: 'gps', name: 'GPS Device', price: 200 },
  { id: 'child-seat', name: 'Child Safety Seat', price: 300 },
  { id: 'wifi', name: 'Mobile WiFi', price: 400 },
] as const;

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
] as const;

// Mock users for dev mode (same as web)
export const MOCK_USERS = [
  { id: '1', email: 'admin@rentlk.lk', name: 'Admin User', role: 'admin', password: 'password123' },
  { id: '2', email: 'owner@rentlk.lk', name: 'Vehicle Owner', role: 'user', password: 'password123' },
  { id: '3', email: 'renter@rentlk.lk', name: 'Regular Renter', role: 'user', password: 'password123' },
  { id: '4', email: 'kyc@rentlk.lk', name: 'KYC Pending User', role: 'user', password: 'password123' },
  { id: '5', email: 'new@rentlk.lk', name: 'New User', role: 'user', password: 'password123' },
] as const;
