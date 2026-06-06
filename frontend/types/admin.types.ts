import type { User } from './user.types'
import type { Booking } from './booking.types'
import type { Vehicle } from './vehicle.types'
import type { PaymentTransaction } from './payment.types'
import type { KYCApplication } from './kyc.types'

export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'support'

export interface AdminUser extends User {
  adminRole: AdminRole
  permissions: AdminPermission[]
  assignedAt: string
}

export type AdminPermission =
  | 'manage_users'
  | 'manage_vehicles'
  | 'manage_bookings'
  | 'review_kyc'
  | 'manage_transactions'
  | 'view_reports'
  | 'manage_admins'
  | 'fraud_management'

export interface AdminStats {
  totalUsers: number
  totalVehicles: number
  totalBookings: number
  totalRevenue: number
  pendingKYC: number
  activeBookings: number
  fraudAlerts: number
  monthlyRevenue: MonthlyRevenue[]
}

export interface MonthlyRevenue {
  month: string
  revenue: number
  bookings: number
  commission: number
}

export interface FraudAlert {
  id: string
  type: 'suspicious_kyc' | 'payment_fraud' | 'booking_fraud' | 'review_fraud' | 'multiple_accounts'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'investigating' | 'resolved' | 'dismissed'
  userId?: string
  userName?: string
  description: string
  evidence: FraudEvidence[]
  assignedTo?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface FraudEvidence {
  type: string
  description: string
  data: Record<string, unknown>
  createdAt: string
}

export interface AdminLogEntry {
  id: string
  adminId: string
  adminName: string
  action: string
  target: string
  targetId: string
  details: Record<string, unknown>
  createdAt: string
}

export type { User, Booking, Vehicle, PaymentTransaction, KYCApplication }
