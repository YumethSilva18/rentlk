import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PayoutRepository } from '../../database/repositories/payout.repository';
import { WalletRepository } from '../../database/repositories/wallet.repository';
import { MoneyUtil } from '../../common/utils/money.util';
import { PrismaService } from '../../database/prisma/prisma.service';

const MIN_PAYOUT_AMOUNT = 500; // LKR 500 minimum

@Injectable()
export class PayoutsService {
  private readonly logger = new Logger(PayoutsService.name);

  constructor(
    private readonly payoutRepo: PayoutRepository,
    private readonly walletRepo: WalletRepository,
    private readonly prisma: PrismaService,
  ) {}

  async requestPayout(
    userId: string,
    data: {
      amount: number;
      bankDetails?: { accountNumber: string; bankName: string; branchName?: string };
    },
  ) {
    const wallet = await this.walletRepo.findByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found. Complete KYC first.');

    if (!MoneyUtil.validateAmount(data.amount)) {
      throw new BadRequestException('Invalid amount');
    }

    if (data.amount < MIN_PAYOUT_AMOUNT) {
      throw new BadRequestException(`Minimum payout amount is ${MoneyUtil.formatLKR(MIN_PAYOUT_AMOUNT)}`);
    }

    if (Number(wallet.availableBalance) < data.amount) {
      throw new BadRequestException(
        `Insufficient available balance. Available: ${MoneyUtil.formatLKR(Number(wallet.availableBalance))}`,
      );
    }

    // Check for pending payouts
    const hasPending = await this.payoutRepo.hasPendingPayout(userId);
    if (hasPending) {
      throw new BadRequestException('You already have a pending payout. Please wait for it to complete.');
    }

    // Use transaction: create payout + move funds to held
    const payout = await this.prisma.$transaction(async (tx: any) => {
      // Move from available to held
      const newAvailable = Number(wallet.availableBalance) - data.amount;
      const newHeld = Number(wallet.heldBalance) + data.amount;

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { availableBalance: newAvailable, heldBalance: newHeld },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: data.amount,
          type: 'HOLD',
          description: `Payout request: ${MoneyUtil.formatLKR(data.amount)}`,
          runningBalance: newAvailable,
        },
      });

      // Create payout record
      return tx.payout.create({
        data: {
          userId,
          walletId: wallet.id,
          amount: data.amount,
          status: 'PENDING',
          bankDetails: data.bankDetails || undefined,
        },
      });
    });

    this.logger.log(`Payout ${payout.id} requested by ${userId}: LKR ${data.amount}`);
    return payout;
  }

  async getPayout(id: string) {
    const payout = await this.payoutRepo.findById(id);
    if (!payout) throw new NotFoundException('Payout not found');
    return payout;
  }

  async getUserPayouts(userId: string, params?: { status?: string; skip?: number; take?: number }) {
    return this.payoutRepo.findByUser(userId, params);
  }

  async getUserPayoutSummary(userId: string) {
    const totals = await this.payoutRepo.getUserPayoutTotal(userId);
    return {
      ...totals,
      totalRequestedFormatted: MoneyUtil.formatLKR(totals.totalRequested),
      pendingAmountFormatted: MoneyUtil.formatLKR(totals.pendingAmount),
      totalPaidFormatted: MoneyUtil.formatLKR(totals.totalPaid),
    };
  }

  // Admin: approve payout
  async approvePayout(payoutId: string, adminId: string) {
    const payout = await this.payoutRepo.findById(payoutId);
    if (!payout) throw new NotFoundException('Payout not found');
    if (payout.status !== 'PENDING') {
      throw new BadRequestException(`Cannot approve payout with status: ${payout.status}`);
    }

    const result = await this.payoutRepo.approve(payoutId, adminId);
    this.logger.log(`Payout ${payoutId} approved by admin ${adminId}`);
    return result;
  }

  // Admin: reject payout (funds returned to available)
  async rejectPayout(payoutId: string, adminId: string, reason: string) {
    const payout = await this.payoutRepo.findById(payoutId);
    if (!payout) throw new NotFoundException('Payout not found');
    if (payout.status !== 'PENDING') {
      throw new BadRequestException(`Cannot reject payout with status: ${payout.status}`);
    }

    const amount = Number(payout.amount);

    await this.prisma.$transaction(async (tx: any) => {
      // Cancel payout
      await tx.payout.update({
        where: { id: payoutId },
        data: { status: 'CANCELLED', failedReason: reason },
      });

      // Return funds from held to available
      const wallet = await tx.wallet.findUnique({ where: { id: payout.walletId } });
      if (wallet) {
        const newHeld = Math.max(0, Number(wallet.heldBalance) - amount);
        const newAvailable = Number(wallet.availableBalance) + amount;

        await tx.wallet.update({
          where: { id: wallet.id },
          data: { heldBalance: newHeld, availableBalance: newAvailable },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount,
            type: 'RELEASE',
            description: `Payout rejected: ${reason}. Funds returned.`,
            runningBalance: newAvailable,
          },
        });
      }
    });

    this.logger.warn(`Payout ${payoutId} rejected by admin ${adminId}: ${reason}`);
    return { message: 'Payout rejected, funds returned to available balance' };
  }

  // Admin/Job: process approved payout (mark as completed after bank transfer)
  async processPayout(payoutId: string, adminId: string, reference: string) {
    const payout = await this.payoutRepo.findById(payoutId);
    if (!payout) throw new NotFoundException('Payout not found');
    if (payout.status !== 'APPROVED') {
      throw new BadRequestException(`Cannot process payout with status: ${payout.status}. Must be APPROVED.`);
    }

    const amount = Number(payout.amount);

    await this.prisma.$transaction(async (tx: any) => {
      // Mark as processing
      await tx.payout.update({
        where: { id: payoutId },
        data: { status: 'PROCESSING' },
      });

      // Complete payout: debit held balance, record transaction
      const wallet = await tx.wallet.findUnique({ where: { id: payout.walletId } });
      if (wallet) {
        const newHeld = Math.max(0, Number(wallet.heldBalance) - amount);
        const newTotalWithdrawn = Number(wallet.totalWithdrawn) + amount;

        await tx.wallet.update({
          where: { id: wallet.id },
          data: { heldBalance: newHeld, totalWithdrawn: newTotalWithdrawn },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount,
            type: 'PAYOUT',
            description: `Payout completed: ref ${reference}`,
            runningBalance: newHeld,
          },
        });
      }

      // Mark payout as completed
      await tx.payout.update({
        where: { id: payoutId },
        data: { status: 'COMPLETED', processedAt: new Date(), reference },
      });
    });

    this.logger.log(`Payout ${payoutId} processed by admin ${adminId}: ref ${reference}`);
    return { message: 'Payout processed successfully' };
  }

  // Admin: mark payout as failed (bank issue, etc.)
  async failPayout(payoutId: string, adminId: string, reason: string) {
    const payout = await this.payoutRepo.findById(payoutId);
    if (!payout) throw new NotFoundException('Payout not found');
    if (!['APPROVED', 'PROCESSING'].includes(payout.status)) {
      throw new BadRequestException('Cannot fail payout in current status');
    }

    const amount = Number(payout.amount);

    await this.prisma.$transaction(async (tx: any) => {
      await tx.payout.update({
        where: { id: payoutId },
        data: { status: 'FAILED', failedReason: reason },
      });

      // Return funds from held to available
      const wallet = await tx.wallet.findUnique({ where: { id: payout.walletId } });
      if (wallet) {
        const newHeld = Math.max(0, Number(wallet.heldBalance) - amount);
        const newAvailable = Number(wallet.availableBalance) + amount;

        await tx.wallet.update({
          where: { id: wallet.id },
          data: { heldBalance: newHeld, availableBalance: newAvailable },
        });

        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount,
            type: 'RELEASE',
            description: `Payout failed: ${reason}. Funds returned.`,
            runningBalance: newAvailable,
          },
        });
      }
    });

    this.logger.warn(`Payout ${payoutId} failed by admin ${adminId}: ${reason}`);
    return { message: 'Payout marked as failed, funds returned' };
  }

  // Get all payouts for admin
  async getAllPayouts(params?: { status?: string; skip?: number; take?: number }) {
    return this.payoutRepo.findByStatus(params?.status || 'PENDING', params);
  }

  async getPendingPayouts() {
    return this.payoutRepo.getPendingTotal();
  }
}
