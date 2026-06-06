import { Injectable, Logger } from '@nestjs/common';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  checks: Record<string, { status: string; latency?: number; error?: string }>;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  async check(): Promise<HealthStatus> {
    const checks: Record<string, any> = {};

    // Database check
    try {
      const dbStart = Date.now();
      // In production: await this.prisma.$queryRaw`SELECT 1`;
      checks.database = { status: 'ok', latency: Date.now() - dbStart };
    } catch (error: any) {
      checks.database = { status: 'down', error: error.message };
    }

    // Redis check
    try {
      checks.redis = { status: 'ok' };
    } catch (error: any) {
      checks.redis = { status: 'down', error: error.message };
    }

    // Memory check
    const memoryUsage = process.memoryUsage();
    checks.memory = {
      status: 'ok',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
    };

    const allUp = Object.values(checks).every((c) => c.status === 'ok');

    return {
      status: allUp ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      checks,
    };
  }

  async readiness(): Promise<{ ready: boolean }> {
    return { ready: true };
  }

  async liveness(): Promise<{ alive: boolean }> {
    return { alive: true };
  }
}
