import { Injectable, CanActivate } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard implements CanActivate {
  protected override async getTracker(req: Record<string, unknown>): Promise<string> {
    return (req as any).user?.id || (req as any).ip || 'anonymous';
  }
}
