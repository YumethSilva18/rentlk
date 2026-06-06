import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);
  private readonly subjects = new Map<string, Subject<any>>();

  emit(event: string, payload: any): void {
    this.logger.log(`Event emitted: ${event}`);
    const subject = this.subjects.get(event) || new Subject<any>();
    this.subjects.set(event, subject);
    subject.next(payload);
  }

  on(event: string, handler: (payload: any) => void): void {
    const subject = this.subjects.get(event) || new Subject<any>();
    this.subjects.set(event, subject);
    subject.subscribe(handler);
  }

  async emitAsync(event: string, payload: any): Promise<void> {
    this.emit(event, payload);
  }
}
