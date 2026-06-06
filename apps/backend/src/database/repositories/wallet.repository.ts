import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findByUserId(userId: string) {
    return this.prisma.wallet.findUnique({
      where: { userId },
      include: { transactions: { orderBy: { createdAt: 'desc' }, take: 20 } },
    });
  }

  async create(data: Prisma.WalletCreateInput) {
    return this.prisma.wallet.create({ data });
  }

  async updateBalance(id: string, data: { balance?: Prisma.Decimal; totalEarned?: Prisma.Decimal; totalWithdrawn?: Prisma.Decimal }) {
    return this.prisma.wallet.update({
      where: { id },
      data,
    });
  }

  async addTransaction(data: {
    walletId: string;
    amount: Prisma.Decimal;
    type: string;
    description: string;
    reference?: string;
    bookingId?: string;
    runningBalance: Prisma.Decimal;
  }) {
    return this.prisma.walletTransaction.create({
      data: {
        walletId: data.walletId,
        amount: data.amount,
        type: data.type,
        description: data.description,
        reference: data.reference,
        bookingId: data.bookingId,
        runningBalance: data.runningBalance,
      },
    });
  }

  async getTransactions(walletId: string, params?: { skip?: number; take?: number; type?: string }) {
    const where: any = { walletId };
    if (params?.type) where.type = params.type;
    return this.prisma.walletTransaction.findMany({
      where,
      skip: params?.skip,
      take: params?.take || 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTransactionCount(walletId: string) {
    return this.prisma.walletTransaction.count({ where: { walletId } });
  }

  async creditWallet(
    walletId: string,
    amount: number,
    description: string,
    bookingId?: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');

    const newBalance = Number(wallet.balance) + amount;
    const newTotalEarned = Number(wallet.totalEarned) + amount;

    await this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: newBalance,
        totalEarned: newTotalEarned,
      },
    });

    return this.prisma.walletTransaction.create({
      data: {
        walletId,
        amount,
        type: 'CREDIT',
        description,
        bookingId,
        runningBalance: newBalance,
      },
    });
  }

  async debitWallet(
    walletId: string,
    amount: number,
    description: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');
    if (Number(wallet.balance) < amount) throw new Error('Insufficient balance');

    const newBalance = Number(wallet.balance) - amount;
    const newTotalWithdrawn = Number(wallet.totalWithdrawn) + amount;

    await this.prisma.wallet.update({
      where: { id: walletId },
      data: {
        balance: newBalance,
        totalWithdrawn: newTotalWithdrawn,
      },
    });

    return this.prisma.walletTransaction.create({
      data: {
        walletId,
        amount,
        type: 'DEBIT',
        description,
        runningBalance: newBalance,
      },
    });
  }

  async holdFunds(
    walletId: string,
    amount: number,
    description: string,
    bookingId?: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');
    if (Number(wallet.availableBalance) < amount) throw new Error('Insufficient available balance');

    const newAvailable = Number(wallet.availableBalance) - amount;
    const newHeld = Number(wallet.heldBalance) + amount;

    await this.prisma.wallet.update({
      where: { id: walletId },
      data: { availableBalance: newAvailable, heldBalance: newHeld },
    });

    return this.prisma.walletTransaction.create({
      data: {
        walletId,
        amount,
        type: 'HOLD',
        description,
        bookingId,
        runningBalance: newAvailable,
      },
    });
  }

  async releaseFunds(
    walletId: string,
    amount: number,
    description: string,
    bookingId?: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');

    const newAvailable = Number(wallet.availableBalance) + amount;
    const newHeld = Math.max(0, Number(wallet.heldBalance) - amount);

    await this.prisma.wallet.update({
      where: { id: walletId },
      data: { availableBalance: newAvailable, heldBalance: newHeld },
    });

    return this.prisma.walletTransaction.create({
      data: {
        walletId,
        amount,
        type: 'RELEASE',
        description,
        bookingId,
        runningBalance: newAvailable,
      },
    });
  }

  async creditToPending(
    walletId: string,
    amount: number,
    description: string,
    bookingId?: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');

    const newPending = Number(wallet.pendingBalance) + amount;
    const newTotalEarned = Number(wallet.totalEarned) + amount;

    await this.prisma.wallet.update({
      where: { id: walletId },
      data: { pendingBalance: newPending, totalEarned: newTotalEarned },
    });

    return this.prisma.walletTransaction.create({
      data: {
        walletId,
        amount,
        type: 'CREDIT',
        description,
        bookingId,
        runningBalance: newPending,
      },
    });
  }

  async moveToAvailable(
    walletId: string,
    amount: number,
    description: string,
    bookingId?: string,
  ) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) throw new Error('Wallet not found');

    const newPending = Math.max(0, Number(wallet.pendingBalance) - amount);
    const newAvailable = Number(wallet.availableBalance) + amount;
    const newBalance = Number(wallet.balance) + amount;

    await this.prisma.wallet.update({
      where: { id: walletId },
      data: { pendingBalance: newPending, availableBalance: newAvailable, balance: newBalance },
    });

    return this.prisma.walletTransaction.create({
      data: {
        walletId,
        amount,
        type: 'CREDIT',
        description: `Moved to available: ${description}`,
        bookingId,
        runningBalance: newAvailable,
      },
    });
  }

  async getFullBalance(walletId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet) return null;

    return {
      balance: Number(wallet.balance),
      pendingBalance: Number(wallet.pendingBalance),
      availableBalance: Number(wallet.availableBalance),
      heldBalance: Number(wallet.heldBalance),
      totalEarned: Number(wallet.totalEarned),
      totalWithdrawn: Number(wallet.totalWithdrawn),
    };
  }
}
