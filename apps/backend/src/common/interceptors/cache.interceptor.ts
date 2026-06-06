import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_KEY_METADATA, CACHE_TTL_METADATA } from '../decorators/throttle.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, { data: any; expiry: number }>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const cacheKey = Reflect.getMetadata(CACHE_KEY_METADATA, handler);
    const cacheTTL = Reflect.getMetadata(CACHE_TTL_METADATA, handler) || 60;

    if (!cacheKey) {
      return next.handle();
    }

    const key = `${cacheKey}:${request.url}`;
    const cached = this.cache.get(key);

    if (cached && cached.expiry > Date.now()) {
      return of(cached.data);
    }

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(key, {
          data,
          expiry: Date.now() + cacheTTL * 1000,
        });
      }),
    );
  }
}
