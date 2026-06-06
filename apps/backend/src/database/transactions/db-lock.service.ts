import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DbLockService {
  private readonly logger = new Logger(DbLockService.name);
  private readonly LOCK_TIMEOUT_MS = 30000;

  constructor(private readonly prisma: PrismaService) {}

  async acquireLock(lockKey: string, timeoutMs: number = this.LOCK_TIMEOUT_MS): Promise<boolean> {
    const lockId = this.hashLockKey(lockKey);
    const expiry = new Date(Date.now() + timeoutMs);

    try {
      await this.prisma.$executeRawUnsafe(
        `SELECT pg_advisory_lock($1)`,
        lockId,
      );
      this.logger.debug(`Lock acquired: ${lockKey} (${lockId})`);
      return true;
    } catch (error) {
      this.logger.warn(`Failed to acquire lock: ${lockKey}`);
      return false;
    }
  }

  async releaseLock(lockKey: string): Promise<void> {
    const lockId = this.hashLockKey(lockKey);
    try {
      await this.prisma.$executeRawUnsafe(
        `SELECT pg_advisory_unlock($1)`,
        lockId,
      );
      this.logger.debug(`Lock released: ${lockKey} (${lockId})`);
    } catch (error) {
      this.logger.warn(`Failed to release lock: ${lockKey}`);
    }
  }

  async withLock<T>(
    lockKey: string,
    fn: () => Promise<T>,
    timeoutMs?: number,
  ): Promise<T> {
    const acquired = await this.acquireLock(lockKey, timeoutMs);
    if (!acquired) {
      throw new Error(`Could not acquire lock: ${lockKey}`);
    }

    try {
      return await fn();
    } finally {
      await this.releaseLock(lockKey);
    }
  }

  private hashLockKey(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash + char) | 0;
    }
    return Math.abs(hash % 2147483647);
  }
}
