import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const resourceOwnerId = request.params?.ownerId || request.body?.ownerId;
    if (!resourceOwnerId || (user.id !== resourceOwnerId && user.role !== 'ADMIN')) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }
    return true;
  }
}
