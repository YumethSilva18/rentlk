import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { AdminRepository } from '../../database/repositories/admin.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { KycRepository } from '../../database/repositories/kyc.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { VehicleRepository } from '../../database/repositories/vehicle.repository';
import { PaymentRepository } from '../../database/repositories/payment.repository';
import { PayoutRepository } from '../../database/repositories/payout.repository';
import { PrismaService } from '../../database/prisma/prisma.service';
import { MoneyUtil } from '../../common/utils/money.util';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly userRepo: UserRepository,
    private readonly kycRepo: KycRepository,
    private readonly bookingRepo: BookingRepository,
    private readonly vehicleRepo: VehicleRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly payoutRepo: PayoutRepository,
    private readonly prisma: PrismaService,
  ) {}

  async getDashboardStats() {
    const [stats, pendingPayouts] = await Promise.all([
      this.adminRepo.getDashboardStats(),
      this.payoutRepo.getPendingTotal(),
    ]);

    return {
      ...stats,
      pendingPayouts,
    };
  }

  async getUsers(params?: { skip?: number; take?: number; search?: string; role?: string }) {
    const where: any = {};
    if (params?.search) {
      where.OR = [
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
        { phoneNumber: { contains: params.search } },
      ];
    }
    if (params?.role) where.role = params.role;

    return this.adminRepo.paginate('user', {
      where,
      skip: params?.skip,
      take: params?.take || 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, refreshToken, ...safeUser } = user;
    return safeUser;
  }

  async suspendUser(userId: string, adminId: string, reason?: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      throw new BadRequestException('Cannot suspend admin users');
    }

    await this.userRepo.suspend(userId, reason || 'Suspended by admin');
    await this.adminRepo.logAction({
      adminId,
      action: 'SUSPEND_USER',
      entity: 'User',
      entityId: userId,
      details: { reason: reason || 'Suspended by admin' },
    });

    this.logger.log(`Admin ${adminId} suspended user ${userId}`);
    return { success: true, message: 'User suspended' };
  }

  async reinstateUser(userId: string, adminId: string, reason?: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.reinstate(userId);
    await this.adminRepo.logAction({
      adminId,
      action: 'REINSTATE_USER',
      entity: 'User',
      entityId: userId,
      details: { reason: reason || 'Reinstated by admin' },
    });

    this.logger.log(`Admin ${adminId} reinstated user ${userId}`);
    return { success: true, message: 'User reinstated' };
  }

  async getPendingKyc(params?: { skip?: number; take?: number }) {
    return this.kycRepo.findAll({ status: 'PENDING', ...params });
  }

  async getAllBookings(params?: { skip?: number; take?: number; status?: string }) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    return this.adminRepo.paginate('booking', {
      where,
      skip: params?.skip,
      take: params?.take || 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllVehicles(params?: { skip?: number; take?: number; status?: string; moderationStatus?: string }) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.moderationStatus) where.moderationStatus = params.moderationStatus;
    return this.adminRepo.paginate('vehicle', {
      where,
      skip: params?.skip,
      take: params?.take || 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  async moderateVehicle(vehicleId: string, adminId: string, status: string, reason?: string) {
    const vehicle = await this.vehicleRepo.findById(vehicleId);
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    await this.vehicleRepo.update(vehicleId, { moderationStatus: status });
    await this.adminRepo.logAction({
      adminId,
      action: `MODERATE_VEHICLE_${status}`,
      entity: 'Vehicle',
      entityId: vehicleId,
      details: { status, reason },
    });

    this.logger.log(`Admin ${adminId} moderated vehicle ${vehicleId} to ${status}`);
    return { success: true, message: `Vehicle ${status.toLowerCase()}` };
  }

  async getAllPayments(params?: { skip?: number; take?: number; status?: string }) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    return this.adminRepo.paginate('payment', {
      where,
      skip: params?.skip,
      take: params?.take || 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAuditLogs(params?: { skip?: number; take?: number; adminId?: string; action?: string }) {
    return this.adminRepo.getLogs({
      skip: params?.skip,
      take: params?.take,
      adminId: params?.adminId,
      action: params?.action,
    });
  }

  // Admin notes on entities
  async addNote(adminId: string, entity: string, entityId: string, note: string) {
    const noteRecord = await this.prisma.adminNote.create({
      data: { adminId, entity, entityId, note },
    });

    await this.adminRepo.logAction({
      adminId,
      action: 'ADD_NOTE',
      entity,
      entityId,
      details: { note },
    });

    return noteRecord;
  }

  async getNotes(entity: string, entityId: string) {
    return this.prisma.adminNote.findMany({
      where: { entity, entityId },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async pinNote(noteId: string) {
    return this.prisma.adminNote.update({
      where: { id: noteId },
      data: { isPinned: true },
    });
  }

  async deleteNote(noteId: string, adminId: string) {
    await this.prisma.adminNote.delete({ where: { id: noteId } });
    await this.adminRepo.logAction({
      adminId,
      action: 'DELETE_NOTE',
      entity: 'AdminNote',
      entityId: noteId,
    });
    return { success: true };
  }

  // Reports
  async getRevenueReport(params?: { startDate?: string; endDate?: string }) {
    const startDate = params?.startDate ? new Date(params.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = params?.endDate ? new Date(params.endDate) : new Date();

    const [revenue, bookingCount] = await Promise.all([
      this.paymentRepo.getTotalRevenue(startDate, endDate),
      this.bookingRepo.count({
        status: 'COMPLETED',
        createdAt: { gte: startDate, lte: endDate },
      }),
    ]);

    return {
      period: { startDate, endDate },
      totalRevenue: MoneyUtil.formatLKR(Number(revenue.totalRevenue)),
      totalRefunded: MoneyUtil.formatLKR(Number(revenue.totalRefunded)),
      netRevenue: MoneyUtil.formatLKR(Number(revenue.totalRevenue) - Number(revenue.totalRefunded)),
      completedBookings: bookingCount,
    };
  }

  async getPlatformReport() {
    const [totalUsers, totalVehicles, totalBookings, totalPayments, pendingPayouts, pendingKyc] =
      await Promise.all([
        this.userRepo.count(),
        this.prisma.vehicle.count(),
        this.prisma.booking.count(),
        this.prisma.payment.count({ where: { status: 'COMPLETED' } }),
        this.payoutRepo.getPendingTotal(),
        this.prisma.kYCDocument.count({ where: { status: 'PENDING' } }),
      ]);

    return {
      totalUsers,
      totalVehicles,
      totalBookings,
      completedPayments: totalPayments,
      pendingPayouts,
      pendingKyc,
    };
  }

  // Fraud queue
  async getFraudAlerts(params?: { severity?: string; resolved?: boolean; skip?: number; take?: number }) {
    const where: any = {};
    if (params?.severity) where.severity = params.severity;
    if (params?.resolved !== undefined) where.isResolved = params.resolved;

    return this.prisma.fraudAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: params?.skip,
      take: params?.take || 50,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, phoneNumber: true } } as any,
      },
    });
  }

  async resolveFraudAlert(alertId: string, adminId: string, resolution: string) {
    const alert = await this.prisma.fraudAlert.findUnique({ where: { id: alertId } });
    if (!alert) throw new NotFoundException('Fraud alert not found');

    await this.prisma.fraudAlert.update({
      where: { id: alertId },
      data: { isResolved: true, resolvedBy: adminId, resolvedAt: new Date(), resolution },
    });

    await this.adminRepo.logAction({
      adminId,
      action: 'RESOLVE_FRAUD_ALERT',
      entity: 'FraudAlert',
      entityId: alertId,
      details: { resolution },
    });

    return { success: true, message: 'Fraud alert resolved' };
  }
}
