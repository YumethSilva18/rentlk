import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditLog');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const { method, url, ip, body } = request;
    const userId = user?.id || 'anonymous';
    const userRole = user?.role || 'guest';

    return next.handle().pipe(
      tap(() => {
        const sensitiveRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password'];
        const isSensitive = sensitiveRoutes.some((route) => url.includes(route));

        this.logger.log(
          JSON.stringify({
            userId,
            userRole,
            action: method,
            resource: url,
            ip,
            timestamp: new Date().toISOString(),
            body: isSensitive ? '[REDACTED]' : this.sanitizeBody(body),
          }),
        );
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return null;
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'otp', 'pin'];
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    return sanitized;
  }
}
