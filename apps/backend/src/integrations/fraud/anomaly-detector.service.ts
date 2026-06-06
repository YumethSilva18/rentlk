import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AnomalyDetectorService {
  private readonly logger = new Logger(AnomalyDetectorService.name);
  private readonly userActivityMap = new Map<string, any[]>();

  async detectAnomalies(userId: string, activity: any): Promise<{
    isAnomalous: boolean;
    anomalies: string[];
    confidence: number;
  }> {
    const anomalies: string[] = [];

    if (!this.userActivityMap.has(userId)) {
      this.userActivityMap.set(userId, []);
    }
    const history = this.userActivityMap.get(userId)!;
    history.push({ ...activity, timestamp: new Date() });

    if (history.length > 100) {
      history.shift();
    }

    if (history.length >= 3) {
      const recent = history.slice(-3);
      const times = recent.map((a) => new Date(a.timestamp).getTime());
      const intervals = times.slice(1).map((t, i) => t - times[i]);

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      for (const interval of intervals) {
        if (interval < avgInterval * 0.1) {
          anomalies.push('Rapid successive actions detected');
          break;
        }
      }
    }

    const isAnomalous = anomalies.length > 0;
    const confidence = isAnomalous ? 0.6 + anomalies.length * 0.1 : 0;

    if (isAnomalous) {
      this.logger.warn(`Anomalies detected for user ${userId}: ${anomalies.join(', ')}`);
    }

    return { isAnomalous, anomalies, confidence: Math.min(confidence, 1) };
  }

  async detectBookingAnomaly(
    userId: string,
    booking: { startDate: Date; endDate: Date; totalAmount: number },
  ): Promise<boolean> {
    const history = this.userActivityMap.get(userId) || [];

    const recentBookings = history.filter((a) => a.type === 'booking');

    if (recentBookings.length > 5) {
      this.logger.warn(`User ${userId} has made ${recentBookings.length} recent bookings`);
      return true;
    }

    const durationDays = (booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 3600 * 24);
    if (durationDays > 90) {
      this.logger.warn(`Unusually long booking duration for user ${userId}: ${durationDays} days`);
      return true;
    }

    return false;
  }

  clearUserHistory(userId: string): void {
    this.userActivityMap.delete(userId);
  }
}
