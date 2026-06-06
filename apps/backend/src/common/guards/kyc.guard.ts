import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { KYCStatus } from '@/common/enums/kyc-status.enum';

@Injectable()
export class KycGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (!user?.kycStatus || user.kycStatus !== KYCStatus.APPROVED) {
      throw new ForbiddenException('KYC verification required for this action');
    }
    return true;
  }
}
