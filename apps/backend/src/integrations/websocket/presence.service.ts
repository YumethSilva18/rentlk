import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PresenceService {
  private readonly logger = new Logger(PresenceService.name);
  private readonly userSockets = new Map<string, Set<string>>();
  private readonly socketUsers = new Map<string, string>();

  userConnected(userId: string, socketId: string): void {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);
    this.socketUsers.set(socketId, userId);
    this.logger.debug(`User ${userId} connected (sockets: ${this.userSockets.get(userId)!.size})`);
  }

  userDisconnected(socketId: string): string | undefined {
    const userId = this.socketUsers.get(socketId);
    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(socketId);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
      this.socketUsers.delete(socketId);
      this.logger.debug(`User ${userId} disconnected`);
    }
    return userId;
  }

  getUserId(socketId: string): string | undefined {
    return this.socketUsers.get(socketId);
  }

  getSocketIds(userId: string): string[] {
    return Array.from(this.userSockets.get(userId) || []);
  }

  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && (this.userSockets.get(userId)?.size || 0) > 0;
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  getOnlineCount(): number {
    return this.userSockets.size;
  }
}
