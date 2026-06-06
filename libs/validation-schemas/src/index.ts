import { z } from 'zod';

// Phone number validation (Sri Lanka)
export const phoneSchema = z
  .string()
  .regex(/^0[1-9][0-9]{8}$/, 'Must be a valid Sri Lankan phone number (e.g., 0771234567)');

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Signup schema
export const signupSchema = z.object({
  phoneNumber: phoneSchema,
  password: passwordSchema,
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email().optional(),
  role: z.enum(['CUSTOMER', 'OWNER']).optional(),
});

// Login schema
export const loginSchema = z.object({
  phoneNumber: phoneSchema,
  password: z.string().min(1, 'Password is required'),
});

// OTP verification schema
export const verifyOtpSchema = z.object({
  phoneNumber: phoneSchema,
  code: z.string().length(6, 'OTP must be 6 digits'),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  phoneNumber: phoneSchema,
});

// Reset password schema
export const resetPasswordSchema = z.object({
  phoneNumber: phoneSchema,
  code: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: passwordSchema,
});

// Vehicle creation schema
export const createVehicleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  type: z.enum(['CAR', 'VAN', 'SUV', 'MOTORCYCLE', 'TUKTUK', 'LUXURY', 'COMMERCIAL']),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().min(1990).max(2030),
  licensePlate: z.string().min(1),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']),
  seats: z.number().min(1).max(50),
  doors: z.number().min(2).max(6),
  hasAC: z.boolean().optional(),
  hasGPS: z.boolean().optional(),
  mileage: z.number().optional(),
  color: z.string().optional(),
  dailyRate: z.number().min(100, 'Daily rate must be at least LKR 100'),
  weeklyDiscount: z.number().min(0).optional(),
  monthlyDiscount: z.number().min(0).optional(),
  securityDeposit: z.number().min(0),
  city: z.string().min(1),
  district: z.string().min(1),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  features: z.array(z.string()).optional(),
});

// Booking creation schema
export const createBookingSchema = z.object({
  vehicleId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isWithDriver: z.boolean().optional(),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  notes: z.string().optional(),
});

// KYC submission schema
export const submitKycSchema = z.object({
  type: z.enum(['NIC', 'PASSPORT', 'DRIVING_LICENSE']),
  documentNumber: z.string().min(1),
  frontImage: z.string().min(1),
  backImage: z.string().optional(),
  selfieImage: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

// Review creation schema
export const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  vehicleId: z.string().uuid().optional(),
});

// Message schema
export const sendMessageSchema = z.object({
  receiverId: z.string().uuid(),
  content: z.string().min(1),
  bookingId: z.string().uuid().optional(),
  type: z.enum(['TEXT', 'IMAGE', 'DOCUMENT', 'LOCATION']).optional(),
  attachment: z.string().optional(),
});

// Money schema (LKR)
export const moneySchema = z.number().min(0, 'Amount cannot be negative');

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  type: z.enum(['CAR', 'VAN', 'SUV', 'MOTORCYCLE', 'TUKTUK', 'LUXURY', 'COMMERCIAL']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']).optional(),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']).optional(),
  hasAC: z.coerce.boolean().optional(),
});

// Type exports
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type SubmitKycInput = z.infer<typeof submitKycSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
