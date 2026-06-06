import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

@Injectable()
export class IdempotencyUtil {
  private readonly idempotencyStore = new Map<string, { result: any; timestamp: Date }>();
  private readonly ttlMs: number;

  constructor(ttlMinutes: number = 60) {
    this.ttlMs = ttlMinutes * 60 * 1000;
  }

  generateKey(prefix: string, ...params: string[]): string {
    const payload = `${prefix}:${params.join(':')}`;
    return createHash('sha256').update(payload).digest('hex');
  }

  get<T>(key: string): T | null {
    const stored = this.idempotencyStore.get(key);
    if (!stored) return null;

    if (Date.now() - stored.timestamp.getTime() > this.ttlMs) {
      this.idempotencyStore.delete(key);
      return null;
    }

    return stored.result as T;
  }

  set(key: string, result: any): void {
    this.idempotencyStore.set(key, {
      result,
      timestamp: new Date(),
    });
  }

  delete(key: string): void {
    this.idempotencyStore.delete(key);
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.idempotencyStore.entries()) {
      if (now - value.timestamp.getTime() > this.ttlMs) {
        this.idempotencyStore.delete(key);
      }
    }
  }

  getSize(): number {
    return this.idempotencyStore.size;
  }
}
