import { Injectable, Logger } from '@nestjs/common';

interface FraudScoreInput {
  userId: string;
  bookingId?: string;
  amount?: number;
  ipAddress?: string;
  deviceFingerprint?: string;
  userAgent?: string;
  location?: { lat: number; lng: number };
}

@Injectable()
export class FraudScoreService {
  private readonly logger = new Logger(FraudScoreService.name);
  private readonly HIGH_RISK_THRESHOLD = 75;
  private readonly MEDIUM_RISK_THRESHOLD = 50;

  async calculateScore(input: FraudScoreInput): Promise<{
    score: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    factors: string[];
    recommendations: string[];
  }> {
    let score = 0;
    const factors: string[] = [];
    const recommendations: string[] = [];

    if (input.amount && input.amount > 100000) {
      score += 20;
      factors.push('High transaction amount');
      recommendations.push('Verify payment source');
    }

    if (input.amount && input.amount > 500000) {
      score += 30;
      factors.push('Very high transaction amount');
      recommendations.push('Require manual approval');
    }

    const riskLevel = score >= this.HIGH_RISK_THRESHOLD ? 'HIGH' :
      score >= this.MEDIUM_RISK_THRESHOLD ? 'MEDIUM' : 'LOW';

    this.logger.log(`Fraud score for user ${input.userId}: ${score} (${riskLevel})`);

    return { score, riskLevel, factors, recommendations };
  }

  async getUserRiskProfile(userId: string): Promise<{
    overallRisk: 'LOW' | 'MEDIUM' | 'HIGH';
    recentAlerts: number;
    totalScore: number;
  }> {
    this.logger.log(`Getting risk profile for user ${userId}`);
    return {
      overallRisk: 'LOW',
      recentAlerts: 0,
      totalScore: 15,
    };
  }
}
