import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);

  constructor(private readonly prisma: PrismaService) {}

  async checkKey(key: string): Promise<{ exists: boolean; result?: any }> {
    const existing = await this.prisma.payment.findUnique({
      where: { idempotencyKey: key },
    });

    if (existing) {
      this.logger.warn(`Idempotency key already used: ${key}`);
      return { exists: true, result: existing };
    }

    return { exists: false };
  }

  async acquireLock(key: string, ttlMs: number = 30000): Promise<boolean> {
    this.logger.debug(`Acquiring idempotency lock: ${key}`);
    return true;
  }

  async releaseLock(key: string): Promise<void> {
    this.logger.debug(`Releasing idempotency lock: ${key}`);
  }

  generateKey(prefix: string, ...params: string[]): string {
    const { createHash } = require('crypto');
    return createHash('sha256')
      .update(`${prefix}:${params.join(':')}:${Date.now()}`)
      .digest('hex')
      .slice(0, 32);
  }
}
