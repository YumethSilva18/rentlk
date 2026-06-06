import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PaymentRepository } from '../../database/repositories/payment.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { WalletRepository } from '../../database/repositories/wallet.repository';
import { MoneyUtil } from '../../common/utils/money.util';
import { IdempotencyUtil } from '../../common/utils/idempotency.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { randomUUID } from 'crypto';

const PLATFORM_FEE_RATE = 0.10;

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly idempotencyUtil = new IdempotencyUtil(60); // 60 min TTL

  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly bookingRepo: BookingRepository,
    private readonly walletRepo: WalletRepository,
    private readonly prisma: PrismaService,
  ) {}

  async initiatePayment(
    userId: string,
    bookingId: string,
    method: string,
    idempotencyKey?: string,
  ) {
    // Check idempotency
    if (idempotencyKey) {
      const existing = await this.paymentRepo.findByIdempotencyKey(idempotencyKey);
      if (existing) {
        this.logger.log(`Idempotent payment request: ${idempotencyKey}`);
        return { payment: existing, idempotent: true };
      }
    }

    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.renterId !== userId) throw new BadRequestException('Only the renter can make payment');
    if (booking.status !== 'CONFIRMED') throw new BadRequestException('Booking must be confirmed before payment');

    // Check for existing successful payment
    const existingPayments = await this.paymentRepo.findByBooking(bookingId);
    const hasCompleted = existingPayments.find((p: any) => p.status === 'COMPLETED');
    if (hasCompleted) {
      throw new ConflictException('Payment already completed for this booking');
    }

    // SERVER-SIDE amount recalculation (never trust frontend)
    const totalAmount = Number(booking.totalAmount);
    const securityDeposit = Number(booking.securityDeposit);
    const amountToCharge = MoneyUtil.round(totalAmount + securityDeposit);

    const key = idempotencyKey || `pay_${bookingId}_${randomUUID()}`;

    const payment = await this.paymentRepo.create({
      booking: { connect: { id: bookingId } },
      user: { connect: { id: userId } },
      amount: amountToCharge,
      method: method as any,
      description: `Payment for booking ${bookingId.slice(0, 8)}`,
      idempotencyKey: key,
    });

    // Cache for idempotency
    this.idempotencyUtil.set(key, payment);

    this.logger.log(`Payment ${payment.id} initiated for booking ${bookingId}: LKR ${amountToCharge}`);
    return { payment, amountToCharge, booking };
  }

  async getPayment(id: string) {
    const payment = await this.paymentRepo.findById(id);
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async confirmPayment(paymentId: string, gatewayRef: string, gatewayResponse?: any) {
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status === 'COMPLETED') {
      throw new ConflictException('Payment already confirmed');
    }

    const booking = await this.bookingRepo.findById(payment.bookingId);
    if (!booking) throw new NotFoundException('Booking not found');

    // Recalculate amounts server-side
    const totalAmount = Number(booking.totalAmount);
    const subtotal = Number(booking.subtotal);
    const platformFee = Number(booking.platformFee);
    const ownerAmount = MoneyUtil.round(subtotal - platformFee);
    const securityDeposit = Number(booking.securityDeposit);

    // Use transaction for atomicity
    await this.prisma.$transaction(async (tx: any) => {
      // Update payment status
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          gatewayRef,
          gatewayResponse: gatewayResponse || undefined,
        },
      });

      // Update booking to ACTIVE
      await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'ACTIVE' },
      });

      // Record status history
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: payment.bookingId,
          fromStatus: 'CONFIRMED',
          toStatus: 'ACTIVE',
          changedBy: payment.userId,
          reason: 'Payment confirmed',
        },
      });

      // Credit owner's wallet (PENDING balance, moves to available after booking completion)
      const ownerWallet = await tx.wallet.findUnique({
        where: { userId: booking.ownerId },
      });

      if (ownerWallet) {
        const newPending = Number(ownerWallet.pendingBalance) + ownerAmount;
        const newTotalEarned = Number(ownerWallet.totalEarned) + ownerAmount;

        await tx.wallet.update({
          where: { id: ownerWallet.id },
          data: { pendingBalance: newPending, totalEarned: newTotalEarned },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: ownerWallet.id,
            amount: ownerAmount,
            type: 'CREDIT',
            description: `Earnings from booking ${booking.id.slice(0, 8)} (pending)`,
            bookingId: booking.id,
            runningBalance: newPending,
          },
        });
      }

      // Hold security deposit in owner's wallet (released when booking completes without dispute)
      if (securityDeposit > 0 && ownerWallet) {
        const newHeld = Number(ownerWallet.heldBalance) + securityDeposit;
        await tx.wallet.update({
          where: { id: ownerWallet.id },
          data: { heldBalance: newHeld },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: ownerWallet.id,
            amount: securityDeposit,
            type: 'HOLD',
            description: `Security deposit held for booking ${booking.id.slice(0, 8)}`,
            bookingId: booking.id,
            runningBalance: Number(ownerWallet.heldBalance) + securityDeposit,
          },
        });
      }
    });

    this.logger.log(`Payment ${paymentId} confirmed. Owner credited LKR ${ownerAmount}`);
    return { payment, booking, ownerCredited: ownerAmount };
  }

  // Handle payment gateway webhooks
  async handleWebhook(gateway: string, payload: any) {
    this.logger.log(`Webhook received from ${gateway}`);

    let paymentId: string | undefined;
    let gatewayRef: string | undefined;
    let success: boolean;

    switch (gateway) {
      case 'payhere':
        gatewayRef = payload.order_id;
        success = payload.status_code === '2';
        break;
      case 'stripe':
        gatewayRef = payload.id;
        success = payload.status === 'succeeded';
        break;
      case 'ezcash':
        gatewayRef = payload.transaction_id;
        success = payload.status === 'SUCCESS';
        break;
      default:
        throw new BadRequestException(`Unknown gateway: ${gateway}`);
    }

    // Find payment by gateway ref
    const payment = await this.prisma.payment.findFirst({
      where: { gatewayRef },
    });

    if (!payment) {
      this.logger.warn(`Webhook for unknown gateway ref: ${gatewayRef}`);
      return { status: 'not_found' };
    }

    if (payment.status === 'COMPLETED') {
      return { status: 'already_processed' };
    }

    if (success) {
      await this.confirmPayment(payment.id, gatewayRef || '', payload);
      return { status: 'processed' };
    } else {
      await this.paymentRepo.update(payment.id, {
        status: 'FAILED',
        gatewayResponse: payload,
      });
      this.logger.warn(`Payment ${payment.id} failed via ${gateway} webhook`);
      return { status: 'failed' };
    }
  }

  // Full or partial refund
  async refundPayment(paymentId: string, adminId: string, amount?: number, reason?: string) {
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.status !== 'COMPLETED') {
      throw new BadRequestException('Can only refund completed payments');
    }

    const originalAmount = Number(payment.amount);
    const alreadyRefunded = Number(payment.refundedAmount);
    const maxRefundable = originalAmount - alreadyRefunded;

    const refundAmount = amount ? MoneyUtil.round(amount) : maxRefundable;
    if (refundAmount > maxRefundable) {
      throw new BadRequestException(`Cannot refund more than ${MoneyUtil.formatLKR(maxRefundable)}`);
    }
    if (refundAmount <= 0) {
      throw new BadRequestException('Refund amount must be positive');
    }

    const newRefundedAmount = alreadyRefunded + refundAmount;
    const isFullRefund = newRefundedAmount >= originalAmount;
    const newStatus = isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

    await this.prisma.$transaction(async (tx: any) => {
      // Update payment
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: newStatus,
          refundedAmount: newRefundedAmount,
          refundReason: reason || 'Refund processed',
          refundedAt: new Date(),
        },
      });

      // Debit from owner's wallet (reverse the credit)
      const booking = await tx.booking.findUnique({ where: { id: payment.bookingId } });
      if (booking) {
        const ownerWallet = await tx.wallet.findUnique({
          where: { userId: booking.ownerId },
        });

        if (ownerWallet) {
          // Calculate proportional refund from owner's balance
          const refundRatio = refundAmount / originalAmount;
          const ownerRefund = MoneyUtil.round(Number(booking.subtotal - booking.platformFee) * refundRatio);

          const newBalance = Math.max(0, Number(ownerWallet.balance) - ownerRefund);
          const newAvailable = Math.max(0, Number(ownerWallet.availableBalance) - ownerRefund);

          await tx.wallet.update({
            where: { id: ownerWallet.id },
            data: { balance: newBalance, availableBalance: newAvailable },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: ownerWallet.id,
              amount: ownerRefund,
              type: 'DEBIT',
              description: `Refund for booking ${booking.id.slice(0, 8)}: ${reason || 'Refund'}`,
              bookingId: booking.id,
              runningBalance: newAvailable,
            },
          });
        }
      }
    });

    this.logger.warn(
      `Refund of LKR ${refundAmount} processed for payment ${paymentId} by admin ${adminId}`,
    );
    return { refunded: refundAmount, status: newStatus };
  }

  // Retry failed payment
  async retryPayment(paymentId: string, userId: string) {
    const payment = await this.paymentRepo.findById(paymentId);
    if (!payment) throw new NotFoundException('Payment not found');
    if (payment.userId !== userId) throw new BadRequestException('Not your payment');
    if (payment.status !== 'FAILED') {
      throw new BadRequestException('Can only retry failed payments');
    }

    // Reset to PENDING for retry
    await this.paymentRepo.update(paymentId, {
      status: 'PENDING',
      gatewayRef: null,
      gatewayResponse: null,
    });

    return { message: 'Payment reset for retry', payment };
  }

  async getBookingPayments(bookingId: string) {
    return this.paymentRepo.findByBooking(bookingId);
  }

  async getUserPayments(userId: string, params?: { skip?: number; take?: number }) {
    return this.paymentRepo.findByUser(userId, params);
  }
}
