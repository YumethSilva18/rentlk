import { Injectable, Logger } from '@nestjs/common';

interface Rule {
  id: string;
  name: string;
  description: string;
  condition: (data: any) => boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  action: 'FLAG' | 'BLOCK' | 'NOTIFY';
}

@Injectable()
export class RulesEngineService {
  private readonly logger = new Logger(RulesEngineService.name);
  private readonly rules: Rule[] = [];

  constructor() {
    this.initializeRules();
  }

  private initializeRules(): void {
    this.rules.push(
      {
        id: 'RULE-001',
        name: 'Multiple accounts same phone',
        description: 'Detect multiple accounts using the same phone number',
        condition: (data) => data.accountCount > 3,
        severity: 'HIGH',
        action: 'BLOCK',
      },
      {
        id: 'RULE-002',
        name: 'Rapid booking creation',
        description: 'Detect unusually rapid booking creation',
        condition: (data) => data.bookingsPerMinute > 5,
        severity: 'MEDIUM',
        action: 'FLAG',
      },
      {
        id: 'RULE-003',
        name: 'High value first booking',
        description: 'Flag high-value bookings from new users',
        condition: (data) => data.isNewUser && data.amount > 100000,
        severity: 'MEDIUM',
        action: 'FLAG',
      },
      {
        id: 'RULE-004',
        name: 'Cancellation rate',
        description: 'Flag users with high cancellation rates',
        condition: (data) => data.cancellationRate > 0.5 && data.totalBookings > 5,
        severity: 'MEDIUM',
        action: 'FLAG',
      },
      {
        id: 'RULE-005',
        name: 'Suspicious location',
        description: 'Flag bookings from unusual locations',
        condition: (data) => data.isLocationSuspicious === true,
        severity: 'LOW',
        action: 'NOTIFY',
      },
      {
        id: 'RULE-006',
        name: 'Chargeback history',
        description: 'Flag users with payment dispute history',
        condition: (data) => data.chargebackCount > 2,
        severity: 'HIGH',
        action: 'BLOCK',
      },
      {
        id: 'RULE-007',
        name: 'Same-day booking and cancellation',
        description: 'Detect booking and immediate cancellation patterns',
        condition: (data) => data.sameDayCancelCount > 3,
        severity: 'MEDIUM',
        action: 'FLAG',
      },
    );
  }

  async evaluate(data: any): Promise<{
    triggered: Array<{ ruleId: string; ruleName: string; severity: string; action: string }>;
    shouldBlock: boolean;
  }> {
    const triggered: Array<{ ruleId: string; ruleName: string; severity: string; action: string }> = [];

    for (const rule of this.rules) {
      try {
        if (rule.condition(data)) {
          triggered.push({
            ruleId: rule.id,
            ruleName: rule.name,
            severity: rule.severity,
            action: rule.action,
          });
          this.logger.warn(`Rule triggered: ${rule.id} - ${rule.name}`);
        }
      } catch (error) {
        this.logger.error(`Error evaluating rule ${rule.id}: ${error}`);
      }
    }

    const shouldBlock = triggered.some((t) => t.action === 'BLOCK');

    return { triggered, shouldBlock };
  }

  async evaluateUser(userData: any): Promise<any> {
    return this.evaluate(userData);
  }

  async evaluateBooking(bookingData: any): Promise<any> {
    return this.evaluate(bookingData);
  }

  async evaluatePayment(paymentData: any): Promise<any> {
    return this.evaluate(paymentData);
  }

  addRule(rule: Rule): void {
    this.rules.push(rule);
    this.logger.log(`Custom rule added: ${rule.id}`);
  }

  getRules(): Rule[] {
    return this.rules.map(({ id, name, description, severity, action }) => ({
      id, name, description, severity, action,
      condition: undefined as any,
    }));
  }
}
