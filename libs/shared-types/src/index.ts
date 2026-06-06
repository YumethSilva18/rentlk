// User types
export interface IUser {
  id: string;
  phoneNumber: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  profileImage?: string;
  address?: string;
  city?: string;
  district?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

// Vehicle types
export interface IVehicle {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  doors: number;
  hasAC: boolean;
  hasGPS: boolean;
  mileage?: number;
  color?: string;
  dailyRate: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;
  securityDeposit: number;
  status: VehicleStatus;
  city: string;
  district: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  reviewCount: number;
  images: IVehicleImage[];
  features: string[];
}

export enum VehicleType {
  CAR = 'CAR',
  VAN = 'VAN',
  SUV = 'SUV',
  MOTORCYCLE = 'MOTORCYCLE',
  TUKTUK = 'TUKTUK',
  LUXURY = 'LUXURY',
  COMMERCIAL = 'COMMERCIAL',
}

export enum TransmissionType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum VehicleStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

export interface IVehicleImage {
  id: string;
  url: string;
  thumbnail?: string;
  isPrimary: boolean;
  order: number;
}

// Booking types
export interface IBooking {
  id: string;
  renterId: string;
  ownerId: string;
  vehicleId: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  totalDays: number;
  dailyRate: number;
  subtotal: number;
  discount: number;
  platformFee: number;
  totalAmount: number;
  securityDeposit: number;
  isWithDriver: boolean;
  pickupLocation?: string;
  dropoffLocation?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

// Payment types
export interface IPayment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  gatewayRef?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  PAYHERE = 'PAYHERE',
  STRIPE = 'STRIPE',
  EZCASH = 'EZCASH',
  WALLET = 'WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

// Wallet types
export interface IWallet {
  id: string;
  userId: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  isActive: boolean;
}

// Review types
export interface IReview {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  vehicleId?: string;
  rating: number;
  comment?: string;
  isPublic: boolean;
  createdAt: string;
}

// Message types
export interface IMessage {
  id: string;
  bookingId?: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  attachment?: string;
  isRead: boolean;
  createdAt: string;
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  LOCATION = 'LOCATION',
}

// KYC types
export interface IKYCDocument {
  id: string;
  userId: string;
  type: string;
  frontImage: string;
  backImage?: string;
  selfieImage?: string;
  status: KYCStatus;
  verifiedAt?: string;
  rejectReason?: string;
  createdAt: string;
}

export enum KYCStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

// Notification types
export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  BOOKING_REQUEST = 'BOOKING_REQUEST',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  KYC_APPROVED = 'KYC_APPROVED',
  KYC_REJECTED = 'KYC_REJECTED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  FRAUD_ALERT = 'FRAUD_ALERT',
  SYSTEM = 'SYSTEM',
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
  timestamp: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Geo types
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface GeoBounds {
  ne: GeoPoint;
  sw: GeoPoint;
}

// Sri Lanka districts
export type SriLankaDistrict =
  | 'Colombo' | 'Gampaha' | 'Kalutara'
  | 'Kandy' | 'Matale' | 'Nuwara Eliya'
  | 'Galle' | 'Matara' | 'Hambantota'
  | 'Jaffna' | 'Kilinochchi' | 'Mannar' | 'Vavuniya' | 'Mullaitivu'
  | 'Batticaloa' | 'Ampara' | 'Trincomalee'
  | 'Kurunegala' | 'Puttalam'
  | 'Anuradhapura' | 'Polonnaruwa'
  | 'Badulla' | 'Monaragala'
  | 'Ratnapura' | 'Kegalle';
