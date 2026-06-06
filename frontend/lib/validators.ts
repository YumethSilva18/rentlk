import { z } from 'zod'

// Email validator
export const emailSchema = z.string().email('Invalid email address')

// Sri Lankan phone validator
export const phoneSchema = z
  .string()
  .regex(/^(\+94|0)?[0-9]{9,10}$/, 'Invalid Sri Lankan phone number')

// Password validator
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
})

// Signup schema
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Vehicle form schema
export const vehicleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.string().min(1, 'Vehicle type is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  transmission: z.enum(['manual', 'automatic']),
  fuelType: z.enum(['petrol', 'diesel', 'electric', 'hybrid']),
  seats: z.number().min(1).max(50),
  dailyRate: z.number().min(500, 'Daily rate must be at least LKR 500'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(5, 'Address is required'),
  licensePlate: z.string().min(1, 'License plate is required'),
  insuranceExpiry: z.string().min(1, 'Insurance expiry is required'),
  features: z.array(z.string()).optional(),
  images: z.array(z.any()).min(1, 'At least one image is required'),
})

// Booking form schema
export const bookingSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  startDate: z.date(),
  endDate: z.date(),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropoffLocation: z.string().optional(),
  addOns: z.array(z.string()).optional(),
  notes: z.string().optional(),
}).refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

// Profile update schema
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: phoneSchema,
  bio: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  dateOfBirth: z.string().optional(),
})

// Review schema
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters'),
})

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

// Type exports for use in components
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type VehicleFormData = z.infer<typeof vehicleSchema>
export type BookingFormData = z.infer<typeof bookingSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type ContactFormData = z.infer<typeof contactSchema>
