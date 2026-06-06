export interface Vehicle {
  id: string
  ownerId: string
  ownerName: string
  ownerAvatar?: string
  ownerRating?: number
  title: string
  description: string
  type: string
  brand: string
  model: string
  year: number
  transmission: 'manual' | 'automatic'
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  seats: number
  dailyRate: number
  images: string[]
  features: string[]
  location: {
    city: string
    address: string
    lat?: number
    lng?: number
  }
  isAvailable: boolean
  rating?: number
  totalReviews: number
  totalBookings: number
  status: 'active' | 'inactive' | 'pending' | 'rejected'
  licensePlate: string
  insuranceExpiry: string
  createdAt: string
  updatedAt: string
}

export interface VehicleFilters {
  search?: string
  city?: string
  type?: string[]
  transmission?: string[]
  fuelType?: string[]
  seats?: number[]
  features?: string[]
  priceMin?: number
  priceMax?: number
  sortBy?: string
}

export interface VehicleFormData {
  title: string
  description: string
  type: string
  brand: string
  model: string
  year: number
  transmission: string
  fuelType: string
  seats: number
  dailyRate: number
  images: File[] | string[]
  features: string[]
  city: string
  address: string
  licensePlate: string
  insuranceExpiry: string
}

export interface VehicleAvailability {
  vehicleId: string
  availableDates: string[]
  blockedDates: string[]
  bookings: {
    startDate: string
    endDate: string
    status: string
  }[]
}
