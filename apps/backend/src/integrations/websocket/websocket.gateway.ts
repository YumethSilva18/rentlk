import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { PresenceService } from './presence.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/ws',
  transports: ['websocket', 'polling'],
})
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);

  constructor(private readonly presenceService: PresenceService) {}

  afterInit(server: Server): void {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      const userId = client.handshake.query?.userId as string;

      if (!userId) {
        this.logger.warn(`Connection rejected: no userId for ${client.id}`);
        client.disconnect();
        return;
      }

      this.presenceService.userConnected(userId, client.id);
      await client.join(`user:${userId}`);

      this.logger.log(`Client connected: ${client.id} (userId: ${userId})`);
      this.server.emit('user:online', { userId, online: true });
    } catch (error) {
      this.logger.error(`Connection error: ${error}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = this.presenceService.userDisconnected(client.id);
    if (userId) {
      this.server.emit('user:online', { userId, online: false });
      this.logger.log(`Client disconnected: ${client.id} (userId: ${userId})`);
    }
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: string; content: string; type?: string; bookingId?: string },
  ): Promise<void> {
    const senderId = this.presenceService.getUserId(client.id);
    if (!senderId) {
      throw new WsException('Not authenticated');
    }

    const message = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId: payload.receiverId,
      content: payload.content,
      type: payload.type || 'TEXT',
      bookingId: payload.bookingId,
      createdAt: new Date(),
      isRead: false,
    };

    this.server.to(`user:${payload.receiverId}`).emit('message:new', message);
    client.emit('message:sent', message);
  }

  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { messageIds: string[]; senderId: string },
  ): Promise<void> {
    this.server.to(`user:${payload.senderId}`).emit('message:read_receipt', {
      messageIds: payload.messageIds,
      readBy: this.presenceService.getUserId(client.id),
      readAt: new Date(),
    });
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: string },
  ): void {
    const senderId = this.presenceService.getUserId(client.id);
    this.server.to(`user:${payload.receiverId}`).emit('typing:start', { userId: senderId });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: string },
  ): void {
    const senderId = this.presenceService.getUserId(client.id);
    this.server.to(`user:${payload.receiverId}`).emit('typing:stop', { userId: senderId });
  }

  @SubscribeMessage('tracking:location')
  async handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { sessionId: string; latitude: number; longitude: number; speed?: number; heading?: number },
  ): Promise<void> {
    const location = { ...payload, timestamp: new Date() };
    this.server.to(`tracking:${payload.sessionId}`).emit('tracking:location_update', location);
  }

  @SubscribeMessage('tracking:subscribe')
  async handleTrackingSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { sessionId: string },
  ): Promise<void> {
    await client.join(`tracking:${payload.sessionId}`);
    this.logger.log(`Client ${client.id} subscribed to tracking:${payload.sessionId}`);
  }

  @SubscribeMessage('tracking:unsubscribe')
  async handleTrackingUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { sessionId: string },
  ): Promise<void> {
    await client.leave(`tracking:${payload.sessionId}`);
  }

  sendToUser(userId: string, event: string, data: any): void {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  sendToRoom(room: string, event: string, data: any): void {
    this.server.to(room).emit(event, data);
  }

  broadcast(event: string, data: any): void {
    this.server.emit(event, data);
  }

  isUserOnline(userId: string): boolean {
    return this.presenceService.isUserOnline(userId);
  }

  getOnlineUsers(): string[] {
    return this.presenceService.getOnlineUsers();
  }
}
