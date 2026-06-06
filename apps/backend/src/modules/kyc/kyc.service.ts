import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { KycRepository } from '../../database/repositories/kyc.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { WalletRepository } from '../../database/repositories/wallet.repository';
import { KYCStatus } from '../../common/enums/kyc-status.enum';
import { EventBusService } from '../../events/event-bus.service';

/**
 * KYC Tiers:
 * - NONE: No KYC submitted. Cannot book or list.
 * - BASIC: NIC or Driving License approved. Can book and list basic vehicles.
 * - VERIFIED: Passport or enhanced verification. Higher limits.
 */
const KYC_TIERS = {
  NONE: { canBook: false, canList: false, maxBookingAmount: 0 },
  BASIC: { canBook: true, canList: true, maxBookingAmount: 500000 },
  VERIFIED: { canBook: true, canList: true, maxBookingAmount: 2000000 },
} as const;

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    private readonly kycRepo: KycRepository,
    private readonly userRepo: UserRepository,
    private readonly walletRepo: WalletRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async submitKYC(userId: string, data: {
    type: string;
    documentNumber: string;
    frontImage: string;
    backImage?: string;
    selfieImage: string;
    address?: string;
    city?: string;
    district?: string;
  }) {
    const existing = await this.kycRepo.findPendingByUserId(userId);
    if (existing) {
      throw new BadRequestException('You already have a pending KYC submission');
    }

    const kyc = await this.kycRepo.create({
      userId,
      type: data.type,
      documentNumber: data.documentNumber,
      frontImage: data.frontImage,
      backImage: data.backImage,
      selfieImage: data.selfieImage,
    });

    this.eventBus.emit('kyc:submitted', {
      kycId: kyc.id,
      userId,
      type: data.type,
    });

    return kyc;
  }

  async getMyKYC(userId: string) {
    const kyc = await this.kycRepo.findByUserId(userId);
    if (!kyc || kyc.length === 0) {
      return {
        status: 'NOT_SUBMITTED',
        tier: 'NONE',
        tierPermissions: KYC_TIERS.NONE,
        documents: [],
        history: [],
      };
    }

    const latest = kyc[0];
    const tier = this.calculateTier(kyc);

    return {
      status: latest.status,
      tier,
      tierPermissions: KYC_TIERS[tier as keyof typeof KYC_TIERS],
      documents: kyc,
      history: kyc.map((d: any) => ({
        id: d.id,
        type: d.type,
        status: d.status,
        submittedAt: d.createdAt,
        reviewedAt: d.verifiedAt,
        rejectReason: d.rejectReason,
      })),
    };
  }

  async getKYCStatus(userId: string) {
    const kyc = await this.kycRepo.findByUserId(userId);
    if (!kyc || kyc.length === 0) {
      return {
        status: 'NOT_SUBMITTED',
        isVerified: false,
        tier: 'NONE',
        tierPermissions: KYC_TIERS.NONE,
      };
    }

    const latest = kyc[0];
    const tier = this.calculateTier(kyc);

    return {
      status: latest.status,
      isVerified: latest.status === KYCStatus.APPROVED,
      tier,
      tierPermissions: KYC_TIERS[tier as keyof typeof KYC_TIERS],
      submittedAt: latest.createdAt,
      verifiedAt: latest.verifiedAt,
    };
  }

  /**
   * Admin: Get all KYC submissions with filtering and sorting.
   */
  async getAllSubmissions(params?: {
    status?: KYCStatus;
    skip?: number;
    take?: number;
  }) {
    const submissions = await this.kycRepo.findAll(params);
    const pendingCount = await this.kycRepo.count({ status: 'PENDING' });
    const totalCount = await this.kycRepo.count();

    return {
      submissions,
      stats: {
        pending: pendingCount,
        total: totalCount,
        reviewed: totalCount - pendingCount,
      },
    };
  }

  /**
   * Admin: Review a KYC submission with approval/rejection.
   * On approval: activate wallet, emit event.
   */
  async reviewSubmission(
    kycId: string,
    adminId: string,
    data: { status: KYCStatus; rejectReason?: string },
  ) {
    const kyc = await this.kycRepo.findById(kycId);
    if (!kyc) throw new NotFoundException('KYC submission not found');

    if (data.status === KYCStatus.REJECTED && !data.rejectReason) {
      throw new BadRequestException('Reject reason is required when rejecting KYC');
    }

    const updated = await this.kycRepo.update(kycId, {
      status: data.status,
      verifiedBy: adminId,
      verifiedAt: new Date(),
      rejectReason: data.rejectReason,
    });

    if (data.status === KYCStatus.APPROVED) {
      // Ensure wallet exists for approved user
      let wallet = await this.walletRepo.findByUserId(kyc.userId);
      if (!wallet) {
        wallet = await this.walletRepo.create({
          userId: kyc.userId,
          balance: 0,
          pendingBalance: 0,
          availableBalance: 0,
          heldBalance: 0,
          totalEarned: 0,
          totalWithdrawn: 0,
          isActive: true,
        });
        this.logger.log(`Wallet created for user ${kyc.userId} on KYC approval`);
      }

      this.eventBus.emit('kyc:approved', {
        kycId,
        userId: kyc.userId,
        adminId,
      });
    }

    if (data.status === KYCStatus.REJECTED) {
      this.eventBus.emit('kyc:rejected', {
        kycId,
        userId: kyc.userId,
        reason: data.rejectReason,
      });
    }

    return updated;
  }

  /**
   * Re-submit KYC after rejection.
   */
  async resubmitKYC(userId: string, data: {
    type: string;
    documentNumber: string;
    frontImage: string;
    backImage?: string;
    selfieImage: string;
  }) {
    const existing = await this.kycRepo.findPendingByUserId(userId);
    if (existing) {
      throw new BadRequestException('You already have a pending KYC submission');
    }

    const kyc = await this.kycRepo.create({
      userId,
      type: data.type,
      documentNumber: data.documentNumber,
      frontImage: data.frontImage,
      backImage: data.backImage,
      selfieImage: data.selfieImage,
    });

    this.eventBus.emit('kyc:resubmitted', {
      kycId: kyc.id,
      userId,
    });

    return kyc;
  }

  /**
   * Check if user has valid KYC for a specific action.
   */
  async checkKycEligibility(userId: string, action: 'book' | 'list') {
    const kyc = await this.kycRepo.findByUserId(userId);
    if (!kyc || kyc.length === 0) {
      return { eligible: false, reason: 'KYC not submitted', tier: 'NONE' };
    }

    const tier = this.calculateTier(kyc);
    const permissions = KYC_TIERS[tier as keyof typeof KYC_TIERS];

    if (action === 'book' && !permissions.canBook) {
      return { eligible: false, reason: 'KYC not approved for booking', tier };
    }

    if (action === 'list' && !permissions.canList) {
      return { eligible: false, reason: 'KYC not approved for listing', tier };
    }

    return { eligible: true, tier, permissions };
  }

  /**
   * Calculate KYC tier based on approved documents.
   */
  private calculateTier(documents: any[]): string {
    const approved = documents.filter((d: any) => d.status === KYCStatus.APPROVED);
    if (approved.length === 0) return 'NONE';

    // Passport = VERIFIED tier, NIC/DL = BASIC tier
    const hasPassport = approved.some((d: any) => d.type === 'PASSPORT');
    return hasPassport ? 'VERIFIED' : 'BASIC';
  }
}
