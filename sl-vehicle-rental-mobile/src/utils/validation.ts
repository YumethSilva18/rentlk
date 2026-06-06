// ============================================================================
// Validation Utils - Zod schemas for form validation
// ============================================================================

import { z } from 'zod';

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Phone validation (Sri Lankan format)
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^(?:\+94|0)?[0-9]{9,10}$/, 'Please enter a valid Sri Lankan phone number');

// Name validation
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters');

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

// Register form schema
export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Vehicle form schema
export const vehicleFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  type: z.string().min(1, 'Vehicle type is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1990, 'Year must be 1990 or later').max(new Date().getFullYear() + 1),
  transmission: z.string().min(1, 'Transmission is required'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  seats: z.number().min(1, 'At least 1 seat required').max(60),
  dailyRate: z.number().min(100, 'Minimum daily rate is Rs. 100'),
  images: z.array(z.string()).min(1, 'At least 1 image required').max(10),
  features: z.array(z.string()).default([]),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  licensePlate: z.string().min(1, 'License plate is required'),
  insuranceExpiry: z.string().min(1, 'Insurance expiry is required'),
});

// Booking form schema
export const bookingFormSchema = z.object({
  vehicleId: z.string().min(1),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropoffLocation: z.string().optional(),
  addOns: z.array(z.string()).default([]),
  notes: z.string().max(500).optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

// Review form schema
export const reviewFormSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
  categories: z.array(z.object({
    name: z.string(),
    rating: z.number().min(1).max(5),
  })).min(1),
  images: z.array(z.string()).max(5).optional(),
});

// KYC form schema
export const kycFormSchema = z.object({
  documentType: z.enum(['nic', 'passport', 'driving_license']),
  documentNumber: z.string().min(1, 'Document number is required'),
  frontImage: z.string().nullable().refine((val) => val !== null, 'Front image is required'),
  backImage: z.string().nullable().optional(),
  selfie: z.string().nullable().refine((val) => val !== null, 'Selfie is required'),
});

// Payout form schema
export const payoutFormSchema = z.object({
  amount: z.number().min(100, 'Minimum payout is Rs. 100'),
  method: z.enum(['bank_transfer', 'ezcash', 'mobile_money']),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  accountHolder: z.string().optional(),
  notes: z.string().max(200).optional(),
});

// Profile edit schema
export const profileEditSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  bio: z.string().max(500).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  dateOfBirth: z.string().optional(),
  drivingLicenseNumber: z.string().optional(),
});

// PIN validation (6 digits)
export const pinSchema = z
  .string()
  .length(6, 'PIN must be 6 digits')
  .regex(/^\d+$/, 'PIN must contain only numbers');

// Type inference helpers
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VehicleFormData = z.infer<typeof vehicleFormSchema>;
export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type ReviewFormData = z.infer<typeof reviewFormSchema>;
export type KYCFormData = z.infer<typeof kycFormSchema>;
export type PayoutFormData = z.infer<typeof payoutFormSchema>;
export type ProfileEditFormData = z.infer<typeof profileEditSchema>;
