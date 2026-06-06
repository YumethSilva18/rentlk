import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@/common/enums/user-role.enum';
import { ADMIN_ROLES } from '@/common/constants/roles.constants';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      throw new ForbiddenException('Admin access required');
    }
    return true;
  }
}
