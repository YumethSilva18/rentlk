import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
