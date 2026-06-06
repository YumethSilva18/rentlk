// ============================================================================
// Booking Types - Ported from web frontend
// ============================================================================

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  vehicleOwner: string;
  renterId: string;
  renterName: string;
  renterPhone: string;
  startDate: string;
  endDate: string;
  days: number;
  status: BookingStatus;
  pickupLocation: string;
  dropoffLocation?: string;
  dailyRate: number;
  addOns: BookingAddOn[];
  subtotal: number;
  commission: number;
  total: number;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod?: string;
  qrCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface BookingAddOn {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}

export interface BookingFormData {
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation?: string;
  addOns: string[];
  notes?: string;
}

export interface BookingRequest {
  vehicleId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation?: string;
  addOns: string[];
  paymentMethod: string;
  notes?: string;
}

export interface BookingConfirmation {
  booking: Booking;
  qrCode: string;
  invoice: {
    id: string;
    url: string;
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
