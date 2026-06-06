import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { VehicleRepository } from '../../database/repositories/vehicle.repository';
import { DateUtil } from '../../common/utils/date.util';
import { MoneyUtil } from '../../common/utils/money.util';
import { FraudScoreService } from '../../integrations/fraud/fraud-score.service';
import { PrismaService } from '../../database/prisma/prisma.service';

// State machine: defines valid transitions
const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['COMPLETED', 'DISPUTED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  DISPUTED: ['COMPLETED', 'CANCELLED'],
};

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly bookingRepo: BookingRepository,
    private readonly vehicleRepo: VehicleRepository,
    private readonly fraudScore: FraudScoreService,
    private readonly prisma: PrismaService,
  ) {}

  async createBooking(
    renterId: string,
    data: {
      vehicleId: string;
      startDate: string;
      endDate: string;
      notes?: string;
      pickupLocation?: string;
      dropoffLocation?: string;
      isWithDriver?: boolean;
    },
  ) {
    const vehicle = await this.vehicleRepo.findById(data.vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.ownerId === renterId) throw new BadRequestException('You cannot book your own vehicle');
    if (vehicle.status !== 'ACTIVE') throw new BadRequestException('Vehicle is not available');
    if (vehicle.moderationStatus !== 'APPROVED') {
      throw new BadRequestException('Vehicle is not approved for booking');
    }

    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    DateUtil.validateDateRange(startDate, endDate, 1);

    // Check for overlap (prevents double booking)
    const overlap = await this.bookingRepo.checkOverlap(data.vehicleId, startDate, endDate);
    if (overlap) throw new BadRequestException('Vehicle is not available for the selected dates');

    // Check availability blocks
    const availabilityBlocks = await this.prisma.vehicleAvailability.findFirst({
      where: {
        vehicleId: data.vehicleId,
        isBlocked: true,
        AND: [
          { startDate: { lt: endDate } },
          { endDate: { gt: startDate } },
        ],
      },
    });
    if (availabilityBlocks) {
      throw new BadRequestException('Vehicle is blocked during these dates');
    }

    // SERVER-SIDE pricing calculation (never trust frontend)
    const totalDays = DateUtil.diffInDays(startDate, endDate);
    const dailyRate = Number(vehicle.dailyRate);
    let subtotal = dailyRate * totalDays;

    // Apply weekly/monthly discounts
    let discountRate = 0;
    if (totalDays >= 30 && vehicle.monthlyDiscount) {
      discountRate = Number(vehicle.monthlyDiscount) / 100;
    } else if (totalDays >= 7 && vehicle.weeklyDiscount) {
      discountRate = Number(vehicle.weeklyDiscount) / 100;
    }
    const discount = MoneyUtil.round(subtotal * discountRate);
    const discountedSubtotal = MoneyUtil.round(subtotal - discount);

    const PLATFORM_FEE_RATE = 0.10;
    const platformFee = MoneyUtil.calculateCommission(discountedSubtotal, PLATFORM_FEE_RATE);
    const totalAmount = MoneyUtil.round(discountedSubtotal);
    const securityDeposit = Number(vehicle.securityDeposit);

    // Fraud check
    const risk = await this.fraudScore.calculateScore({
      userId: renterId,
      amount: totalAmount + securityDeposit,
    });

    // Create booking in a transaction with status history
    const booking = await this.prisma.$transaction(async (tx: any) => {
      const newBooking = await tx.booking.create({
        data: {
          renterId,
          ownerId: vehicle.ownerId,
          vehicleId: data.vehicleId,
          status: 'PENDING',
          startDate,
          endDate,
          totalDays,
          dailyRate,
          subtotal,
          discount,
          platformFee,
          totalAmount,
          securityDeposit,
          isWithDriver: data.isWithDriver || false,
          notes: data.notes,
          pickupLocation: data.pickupLocation,
          dropoffLocation: data.dropoffLocation,
        },
      });

      // Record initial status in history
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: newBooking.id,
          fromStatus: null,
          toStatus: 'PENDING',
          changedBy: renterId,
          reason: 'Booking created',
        },
      });

      return newBooking;
    });

    // Update vehicle booking count
    await this.vehicleRepo.update(vehicle.id, {
      bookingCount: { increment: 1 },
    });

    this.logger.log(`Booking ${booking.id} created for vehicle ${data.vehicleId}`);
    return { booking, riskAssessment: risk };
  }

  async getBooking(id: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async getBookingWithTimeline(id: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');

    const statusHistory = await this.bookingRepo.getStatusHistory(id);
    return { ...booking, statusHistory };
  }

  async confirmBooking(id: string, userId: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.ownerId !== userId) throw new ForbiddenException('Only the owner can confirm');
    this.validateTransition(booking.status, 'CONFIRMED');

    const updated = await this.bookingRepo.updateStatusWithHistory(id, 'CONFIRMED', userId, 'Booking confirmed by owner');
    this.logger.log(`Booking ${id} confirmed by owner ${userId}`);
    return updated;
  }

  async startBooking(id: string, userId: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.ownerId !== userId && booking.renterId !== userId) {
      throw new ForbiddenException('Only booking participants can start a booking');
    }
    this.validateTransition(booking.status, 'ACTIVE');

    const updated = await this.bookingRepo.updateStatusWithHistory(id, 'ACTIVE', userId, 'Booking started');
    this.logger.log(`Booking ${id} started`);
    return updated;
  }

  async completeBooking(id: string, userId: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.ownerId !== userId && booking.renterId !== userId) {
      throw new ForbiddenException('Only booking participants can complete a booking');
    }
    this.validateTransition(booking.status, 'COMPLETED');

    const updated = await this.bookingRepo.completeBooking(id, userId);
    this.logger.log(`Booking ${id} completed by ${userId}`);
    return updated;
  }

  async cancelBooking(id: string, userId: string, reason: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');

    // Owner, renter, or admin can cancel
    if (booking.renterId !== userId && booking.ownerId !== userId) {
      throw new ForbiddenException('Only booking participants can cancel');
    }
    this.validateTransition(booking.status, 'CANCELLED');

    const updated = await this.bookingRepo.updateStatusWithHistory(
      id,
      'CANCELLED',
      userId,
      reason || 'Cancelled by user',
    );

    // Update cancelled fields
    await this.prisma.booking.update({
      where: { id },
      data: {
        cancelledAt: new Date(),
        cancelledById: userId,
        cancelReason: reason,
      },
    });

    this.logger.log(`Booking ${id} cancelled by ${userId}`);
    return updated;
  }

  async disputeBooking(id: string, userId: string, reason: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.renterId !== userId && booking.ownerId !== userId) {
      throw new ForbiddenException('Only booking participants can dispute');
    }
    this.validateTransition(booking.status, 'DISPUTED');

    const updated = await this.bookingRepo.disputeBooking(id, userId, reason);
    this.logger.warn(`Booking ${id} disputed by ${userId}: ${reason}`);
    return updated;
  }

  // Admin intervention - force status change
  async adminForceStatus(id: string, adminId: string, newStatus: string, reason: string) {
    const booking = await this.bookingRepo.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');

    const updated = await this.bookingRepo.updateStatusWithHistory(id, newStatus, adminId, `Admin override: ${reason}`);
    this.logger.warn(`Admin ${adminId} forced booking ${id} to ${newStatus}: ${reason}`);
    return updated;
  }

  async getMyBookingsAsRenter(userId: string, status?: string) {
    return this.bookingRepo.findByRenter(userId, status);
  }

  async getMyBookingsAsOwner(userId: string, status?: string) {
    return this.bookingRepo.findByOwner(userId, status);
  }

  async getStatusHistory(bookingId: string) {
    return this.bookingRepo.getStatusHistory(bookingId);
  }

  // Generate invoice for a booking
  async generateInvoice(bookingId: string) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    const subtotal = Number(booking.subtotal);
    const discount = Number(booking.discount);
    const platformFee = Number(booking.platformFee);
    const securityDeposit = Number(booking.securityDeposit);
    const totalAmount = Number(booking.totalAmount);
    const ownerPayout = MoneyUtil.round(subtotal - platformFee);

    return {
      bookingId: booking.id,
      invoiceNumber: `INV-${booking.id.slice(0, 8).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
      renter: {
        id: booking.renterId,
        name: `${(booking as any).renter?.firstName} ${(booking as any).renter?.lastName}`,
      },
      owner: {
        id: booking.ownerId,
        name: `${(booking as any).owner?.firstName} ${(booking as any).owner?.lastName}`,
      },
      vehicle: {
        id: booking.vehicleId,
        title: (booking as any).vehicle?.title,
      },
      period: {
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalDays: booking.totalDays,
      },
      pricing: {
        dailyRate: MoneyUtil.formatLKR(Number(booking.dailyRate)),
        subtotal: MoneyUtil.formatLKR(subtotal),
        discount: MoneyUtil.formatLKR(discount),
        platformFee: MoneyUtil.formatLKR(platformFee),
        securityDeposit: MoneyUtil.formatLKR(securityDeposit),
        totalAmount: MoneyUtil.formatLKR(totalAmount),
      },
      payout: {
        ownerPayout: MoneyUtil.formatLKR(ownerPayout),
        platformFee: MoneyUtil.formatLKR(platformFee),
      },
    };
  }

  private validateTransition(currentStatus: string, newStatus: string) {
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
