import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { WalletRepository } from '../../database/repositories/wallet.repository';
import { MoneyUtil } from '../../common/utils/money.util';
import { EventBusService } from '../../events/event-bus.service';

@Injectable()
export class WalletsService {
  private readonly logger = new Logger(WalletsService.name);

  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Get full wallet with all balance fields formatted.
   */
  async getWallet(userId: string) {
    const wallet = await this.walletRepo.findByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found. Complete KYC to activate your wallet.');
    }

    return {
      id: wallet.id,
      balance: MoneyUtil.formatLKR(Number(wallet.balance)),
      pendingBalance: MoneyUtil.formatLKR(Number(wallet.pendingBalance)),
      availableBalance: MoneyUtil.formatLKR(Number(wallet.availableBalance)),
      heldBalance: MoneyUtil.formatLKR(Number(wallet.heldBalance)),
      totalEarned: MoneyUtil.formatLKR(Number(wallet.totalEarned)),
      totalWithdrawn: MoneyUtil.formatLKR(Number(wallet.totalWithdrawn)),
      isActive: wallet.isActive,
      raw: {
        balance: Number(wallet.balance),
        pendingBalance: Number(wallet.pendingBalance),
        availableBalance: Number(wallet.availableBalance),
        heldBalance: Number(wallet.heldBalance),
      },
    };
  }

  /**
   * Get paginated transaction history with filtering.
   */
  async getTransactions(
    userId: string,
    params?: { skip?: number; take?: number; type?: string; bookingId?: string },
  ) {
    const wallet = await this.walletRepo.findByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found');

    const transactions = await this.walletRepo.getTransactions(wallet.id, {
      skip: params?.skip,
      take: params?.take || 20,
      type: params?.type,
    });
    const total = await this.walletRepo.getTransactionCount(wallet.id);

    return {
      transactions: transactions.map((t: any) => ({
        id: t.id,
        amount: MoneyUtil.formatLKR(Number(t.amount)),
        type: t.type,
        description: t.description,
        reference: t.reference,
        bookingId: t.bookingId,
        runningBalance: MoneyUtil.formatLKR(Number(t.runningBalance)),
        createdAt: t.createdAt,
      })),
      total,
      page: Math.floor((params?.skip || 0) / (params?.take || 20)) + 1,
    };
  }

  /**
   * Get wallet balance summary.
   */
  async getBalance(userId: string) {
    const wallet = await this.walletRepo.findByUserId(userId);
    if (!wallet) return { balance: '0.00', formatted: 'LKR 0.00' };

    const full = await this.walletRepo.getFullBalance(wallet.id);
    return {
      balance: wallet.balance.toString(),
      pendingBalance: wallet.pendingBalance.toString(),
      availableBalance: wallet.availableBalance.toString(),
      heldBalance: wallet.heldBalance.toString(),
      formatted: MoneyUtil.formatLKR(Number(wallet.balance)),
      formattedAvailable: MoneyUtil.formatLKR(Number(wallet.availableBalance)),
      formattedPending: MoneyUtil.formatLKR(Number(wallet.pendingBalance)),
      formattedHeld: MoneyUtil.formatLKR(Number(wallet.heldBalance)),
    };
  }

  /**
   * Withdraw available balance (not pending or held).
   * For production payout, use the Payouts module instead.
   */
  async withdraw(userId: string, amount: number) {
    const wallet = await this.walletRepo.findByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found');

    if (Number(wallet.availableBalance) < amount) {
      throw new BadRequestException(
        `Insufficient available balance. Available: ${MoneyUtil.formatLKR(Number(wallet.availableBalance))}`,
      );
    }

    // Use payout workflow for withdrawals
    throw new BadRequestException(
      'Direct withdrawals are disabled. Please use the payout request endpoint.',
    );
  }

  /**
   * Admin: Get wallet by user ID for review.
   */
  async getWalletByUserId(userId: string) {
    const wallet = await this.walletRepo.findByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found');
    return this.formatWallet(wallet);
  }

  /**
   * Admin: Reconcile wallet balance (verify transactions match balances).
   */
  async reconcileWallet(userId: string) {
    const wallet = await this.walletRepo.findByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found');

    // Sum all transactions
    const transactions = await this.walletRepo.getTransactions(wallet.id, { take: 100000 });

    let calculatedBalance = 0;
    for (const t of transactions) {
      const amount = Number(t.amount);
      if (t.type === 'CREDIT' || t.type === 'REFUND' || t.type === 'RELEASE') {
        calculatedBalance += amount;
      } else if (t.type === 'DEBIT' || t.type === 'HOLD' || t.type === 'PAYOUT' || t.type === 'COMMISSION') {
        calculatedBalance -= amount;
      }
    }

    const currentBalance = Number(wallet.balance);
    const discrepancy = calculatedBalance - currentBalance;

    if (Math.abs(discrepancy) > 0.01) {
      this.logger.warn(
        `Wallet ${wallet.id} reconciliation discrepancy: expected ${calculatedBalance}, got ${currentBalance}, diff ${discrepancy}`,
      );
    }

    return {
      walletId: wallet.id,
      currentBalance: MoneyUtil.formatLKR(currentBalance),
      calculatedBalance: MoneyUtil.formatLKR(calculatedBalance),
      discrepancy: MoneyUtil.formatLKR(Math.abs(discrepancy)),
      isBalanced: Math.abs(discrepancy) <= 0.01,
      transactionCount: transactions.length,
    };
  }

  /**
   * Get wallet ledger with full audit trail.
   */
  async getLedger(userId: string, params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    skip?: number;
    take?: number;
  }) {
    const wallet = await this.walletRepo.findByUserId(userId);
    if (!wallet) throw new NotFoundException('Wallet not found');

    const entries = await this.walletRepo.getTransactions(wallet.id, {
      type: params?.type,
      skip: params?.skip,
      take: params?.take || 50,
    });

    const total = await this.walletRepo.getTransactionCount(wallet.id);

    return {
      entries: entries.map((e: any) => ({
        id: e.id,
        amount: MoneyUtil.formatLKR(Number(e.amount)),
        rawAmount: Number(e.amount),
        type: e.type,
        description: e.description,
        reference: e.reference,
        runningBalance: MoneyUtil.formatLKR(Number(e.runningBalance)),
        bookingId: e.bookingId,
        createdAt: e.createdAt,
      })),
      total,
    };
  }

  private formatWallet(wallet: any) {
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: MoneyUtil.formatLKR(Number(wallet.balance)),
      pendingBalance: MoneyUtil.formatLKR(Number(wallet.pendingBalance)),
      availableBalance: MoneyUtil.formatLKR(Number(wallet.availableBalance)),
      heldBalance: MoneyUtil.formatLKR(Number(wallet.heldBalance)),
      totalEarned: MoneyUtil.formatLKR(Number(wallet.totalEarned)),
      totalWithdrawn: MoneyUtil.formatLKR(Number(wallet.totalWithdrawn)),
      isActive: wallet.isActive,
    };
  }
}
