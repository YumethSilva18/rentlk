import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { FraudScoreService } from '../../integrations/fraud/fraud-score.service';
import { RulesEngineService } from '../../integrations/fraud/rules-engine.service';
import { AnomalyDetectorService } from '../../integrations/fraud/anomaly-detector.service';
import { PrismaService } from '../../database/prisma/prisma.service';
import { EventBusService } from '../../events/event-bus.service';

@Injectable()
export class FraudService {
  private readonly logger = new Logger(FraudService.name);

  constructor(
    private readonly fraudScoreService: FraudScoreService,
    private readonly rulesEngine: RulesEngineService,
    private readonly anomalyDetector: AnomalyDetectorService,
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Evaluate a booking for fraud risk.
   */
  async evaluateBooking(userId: string, bookingData: {
    amount: number;
    vehicleId: string;
    startDate: Date;
    endDate: Date;
  }) {
    const fraudScoreResult = await this.fraudScoreService.calculateScore({
      userId,
      amount: bookingData.amount,
    });
    const ruleResults = await this.rulesEngine.evaluate(bookingData);
    const anomalyResult = await this.anomalyDetector.detectBookingAnomaly(userId, {
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalAmount: bookingData.amount,
    });

    const shouldBlock = fraudScoreResult.score > 70 || ruleResults.shouldBlock || anomalyResult;

    // Create fraud alert if risk detected
    if (shouldBlock || fraudScoreResult.score > 40) {
      await this.createAlert({
        userId,
        type: 'BOOKING_FRAUD',
        severity: fraudScoreResult.score > 70 ? 'HIGH' : fraudScoreResult.score > 40 ? 'MEDIUM' : 'LOW',
        score: fraudScoreResult.score,
        details: {
          bookingData,
          fraudScore: fraudScoreResult,
          triggeredRules: ruleResults.triggered,
          anomaly: anomalyResult,
        },
      });
    }

    return {
      score: fraudScoreResult.score,
      riskLevel: fraudScoreResult.score > 70 ? 'HIGH' as const : fraudScoreResult.score > 40 ? 'MEDIUM' as const : 'LOW' as const,
      triggeredRules: ruleResults.triggered,
      anomalies: anomalyResult ? ['Anomalous booking detected'] : [],
      shouldBlock,
      recommendation: shouldBlock ? 'BLOCK' as const : fraudScoreResult.score > 40 ? 'REVIEW' as const : 'APPROVE' as const,
    };
  }

  /**
   * Evaluate a payment for fraud risk.
   */
  async evaluatePayment(userId: string, paymentData: {
    amount: number;
    method: string;
    gatewayRef?: string;
  }) {
    const fraudScore = await this.fraudScoreService.calculateScore({
      userId,
      amount: paymentData.amount,
    });
    const ruleResult = await this.rulesEngine.evaluatePayment(paymentData);

    const shouldBlock = fraudScore.score > 80 || ruleResult.shouldBlock;

    if (shouldBlock || fraudScore.score > 50) {
      await this.createAlert({
        userId,
        type: 'PAYMENT_FRAUD',
        severity: fraudScore.score > 80 ? 'HIGH' : 'MEDIUM',
        score: fraudScore.score,
        details: {
          paymentData,
          fraudScore,
          triggeredRules: ruleResult.triggered,
        },
      });
    }

    return {
      score: fraudScore.score,
      riskLevel: fraudScore.riskLevel,
      shouldBlock,
      factors: fraudScore.factors,
    };
  }

  /**
   * Detect multi-account behavior by checking shared identifiers.
   */
  async detectMultiAccount(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phoneNumber: true, email: true },
    });

    if (!user) return { duplicates: [], isMultiAccount: false };

    // Find other users with same phone or email patterns
    const samePhone = await this.prisma.user.findMany({
      where: {
        phoneNumber: user.phoneNumber,
        id: { not: userId },
      },
      select: { id: true, firstName: true, lastName: true, createdAt: true },
    });

    const duplicates = [...samePhone];
    const isMultiAccount = duplicates.length > 0;

    if (isMultiAccount) {
      await this.createAlert({
        userId,
        type: 'MULTI_ACCOUNT',
        severity: 'HIGH',
        details: {
          duplicateCount: duplicates.length,
          duplicateIds: duplicates.map((d: any) => d.id),
        },
      });
    }

    return { duplicates, isMultiAccount };
  }

  /**
   * Get user risk profile with full context.
   */
  async getUserRiskProfile(userId: string) {
    const result = await this.fraudScoreService.getUserRiskProfile(userId);
    const alerts = await this.prisma.fraudAlert.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      userId,
      fraudScore: result.totalScore,
      riskLevel: result.overallRisk,
      recentAlerts: alerts.length,
      alerts: alerts.map((a: any) => ({
        id: a.id,
        type: a.type,
        severity: a.severity,
        isResolved: a.isResolved,
        createdAt: a.createdAt,
      })),
    };
  }

  /**
   * Admin: Get all fraud alerts with filtering.
   */
  async getFraudAlerts(params?: {
    severity?: string;
    resolved?: boolean;
    userId?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};
    if (params?.severity) where.severity = params.severity;
    if (params?.resolved !== undefined) where.isResolved = params.resolved;
    if (params?.userId) where.userId = params.userId;

    const alerts = await this.prisma.fraudAlert.findMany({
      where,
      skip: params?.skip,
      take: params?.take || 50,
      orderBy: { createdAt: 'desc' },
    });

    const unresolvedCount = await this.prisma.fraudAlert.count({
      where: { isResolved: false },
    });

    return { alerts, unresolvedCount };
  }

  /**
   * Admin: Resolve a fraud alert.
   */
  async resolveAlert(alertId: string, adminId: string, resolution: string) {
    const alert = await this.prisma.fraudAlert.findUnique({ where: { id: alertId } });
    if (!alert) throw new NotFoundException('Fraud alert not found');

    return this.prisma.fraudAlert.update({
      where: { id: alertId },
      data: {
        isResolved: true,
        resolvedBy: adminId,
        resolvedAt: new Date(),
        resolution,
      },
    });
  }

  /**
   * Create a fraud alert record.
   */
  private async createAlert(data: {
    userId: string;
    type: string;
    severity: string;
    score?: number;
    details?: any;
    bookingId?: string;
  }) {
    const alert = await this.prisma.fraudAlert.create({
      data: {
        userId: data.userId,
        bookingId: data.bookingId,
        type: data.type,
        severity: data.severity,
        score: data.score,
        details: data.details,
      },
    });

    this.eventBus.emit('fraud:alert', {
      alertId: alert.id,
      userId: data.userId,
      type: data.type,
      severity: data.severity,
    });

    return alert;
  }
}
