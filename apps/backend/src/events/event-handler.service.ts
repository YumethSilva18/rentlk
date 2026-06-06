import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBusService } from './event-bus.service';
import { PrismaService } from '../database/prisma/prisma.service';

/**
 * Central event handler that wires domain events to side effects:
 * - Notification dispatch
 * - Audit logging
 * - Fraud alert creation
 * - Stats updates
 */
@Injectable()
export class EventHandlerService implements OnModuleInit {
  private readonly logger = new Logger(EventHandlerService.name);

  constructor(
    private readonly eventBus: EventBusService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.registerHandlers();
    this.logger.log('Event handlers registered');
  }

  private registerHandlers() {
    // --- Booking events ---
    this.eventBus.on('booking:created', async (data) => {
      this.logger.log(`Booking created: ${data.bookingId} by ${data.renterId}`);
      await this.createAuditLog('BOOKING_CREATED', data.bookingId, data);
      await this.createNotification(data.ownerId, 'BOOKING_REQUEST',
        'New Booking Request',
        `You have a new booking request for your vehicle.`,
        { bookingId: data.bookingId },
      );
    });

    this.eventBus.on('booking:confirmed', async (data) => {
      this.logger.log(`Booking confirmed: ${data.bookingId}`);
      await this.createAuditLog('BOOKING_CONFIRMED', data.bookingId, data);
      await this.createNotification(data.renterId, 'BOOKING_CONFIRMED',
        'Booking Confirmed',
        `Your booking has been confirmed!`,
        { bookingId: data.bookingId },
      );
    });

    this.eventBus.on('booking:completed', async (data) => {
      this.logger.log(`Booking completed: ${data.bookingId}`);
      await this.createAuditLog('BOOKING_COMPLETED', data.bookingId, data);
    });

    this.eventBus.on('booking:cancelled', async (data) => {
      this.logger.log(`Booking cancelled: ${data.bookingId}`);
      await this.createAuditLog('BOOKING_CANCELLED', data.bookingId, data);
      // Notify both parties
      if (data.renterId) {
        await this.createNotification(data.renterId, 'BOOKING_CANCELLED',
          'Booking Cancelled',
          `Your booking has been cancelled.`,
          { bookingId: data.bookingId },
        );
      }
      if (data.ownerId) {
        await this.createNotification(data.ownerId, 'BOOKING_CANCELLED',
          'Booking Cancelled',
          `A booking for your vehicle has been cancelled.`,
          { bookingId: data.bookingId },
        );
      }
    });

    // --- Payment events ---
    this.eventBus.on('payment:success', async (data) => {
      this.logger.log(`Payment success: ${data.paymentId} for booking ${data.bookingId}`);
      await this.createAuditLog('PAYMENT_COMPLETED', data.paymentId, data);
      await this.createNotification(data.userId, 'PAYMENT_RECEIVED',
        'Payment Successful',
        `Your payment of ${data.amount} has been processed successfully.`,
        { paymentId: data.paymentId, bookingId: data.bookingId },
      );
    });

    this.eventBus.on('payment:failed', async (data) => {
      this.logger.warn(`Payment failed: ${data.paymentId}`);
      await this.createAuditLog('PAYMENT_FAILED', data.paymentId, data);
      await this.createNotification(data.userId, 'PAYMENT_FAILED',
        'Payment Failed',
        `Your payment could not be processed. Please try again.`,
        { paymentId: data.paymentId, reason: data.reason },
      );
    });

    this.eventBus.on('payment:refunded', async (data) => {
      this.logger.log(`Payment refunded: ${data.paymentId} amount ${data.amount}`);
      await this.createAuditLog('PAYMENT_REFUNDED', data.paymentId, data);
    });

    // --- KYC events ---
    this.eventBus.on('kyc:approved', async (data) => {
      this.logger.log(`KYC approved for user ${data.userId}`);
      await this.createAuditLog('KYC_APPROVED', data.kycId, data);
      await this.createNotification(data.userId, 'KYC_APPROVED',
        'KYC Approved',
        `Your KYC verification has been approved. You can now book and list vehicles!`,
        { kycId: data.kycId },
      );
    });

    this.eventBus.on('kyc:rejected', async (data) => {
      this.logger.log(`KYC rejected for user ${data.userId}`);
      await this.createAuditLog('KYC_REJECTED', data.kycId, data);
      await this.createNotification(data.userId, 'KYC_REJECTED',
        'KYC Rejected',
        `Your KYC submission was rejected. Reason: ${data.reason || 'Not specified'}. Please resubmit.`,
        { kycId: data.kycId, reason: data.reason },
      );
    });

    // --- Review events ---
    this.eventBus.on('review:created', async (data) => {
      this.logger.log(`Review created: ${data.reviewId} by ${data.reviewerId}`);
      await this.createNotification(data.revieweeId, 'REVIEW_RECEIVED',
        'New Review',
        `You received a new ${data.rating}-star review.`,
        { reviewId: data.reviewId, bookingId: data.bookingId },
      );
    });

    // --- Fraud events ---
    this.eventBus.on('fraud:alert', async (data) => {
      this.logger.warn(`Fraud alert: ${data.type} for user ${data.userId} severity ${data.severity}`);
      await this.createAuditLog('FRAUD_ALERT', data.alertId, data);
      // Notify admins of HIGH severity
      if (data.severity === 'HIGH') {
        await this.notifyAdmins('FRAUD_ALERT',
          'High-Risk Fraud Alert',
          `A ${data.severity} severity fraud alert was triggered for user ${data.userId}.`,
          data,
        );
      }
    });

    // --- Tracking events ---
    this.eventBus.on('tracking:speed:alert', async (data) => {
      this.logger.warn(`Speed alert: ${data.speed} km/h in session ${data.sessionId}`);
      await this.createAuditLog('SPEED_ALERT', data.sessionId, data);
    });

    // --- Message events ---
    this.eventBus.on('message:sent', async (data) => {
      if (data.receiverId) {
        await this.createNotification(data.receiverId, 'NEW_MESSAGE',
          'New Message',
          data.preview || 'You have a new message.',
          { conversationId: data.conversationId, messageId: data.messageId },
        );
      }
    });

    // --- Notification push hook ---
    this.eventBus.on('push:send', (data) => {
      // Push notification hook - integrate with FCM/APNs
      this.logger.debug(`Push notification: ${data.userId} - ${data.title}`);
    });
  }

  // --- Helper methods ---

  private async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: Record<string, any>,
  ) {
    try {
      await this.prisma.notification.create({
        data: {
          userId,
          type: type as any,
          title,
          message,
          data,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create notification for ${userId}: ${error}`);
    }
  }

  private async createAuditLog(action: string, entityId: string, details: any) {
    try {
      await this.prisma.adminLog.create({
        data: {
          adminId: 'system',
          action,
          entity: action.split('_')[0],
          entityId,
          details,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error}`);
    }
  }

  private async notifyAdmins(type: string, title: string, message: string, data: any) {
    try {
      const admins = await this.prisma.user.findMany({
        where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
        select: { id: true },
      });
      for (const admin of admins) {
        await this.createNotification(admin.id, type, title, message, data);
      }
    } catch (error) {
      this.logger.error(`Failed to notify admins: ${error}`);
    }
  }
}
