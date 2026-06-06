// Re-export all types for convenient importing
export * from './user.types'
export * from './vehicle.types'
export * from './booking.types'
export * from './payment.types'
export * from './kyc.types'
export * from './message.types'
export * from './review.types'
export * from './tracking.types'
export * from './admin.types'
export * from './api.types'

// Additional commonly used types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}
