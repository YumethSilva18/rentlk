import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.message.findUnique({
      where: { id },
      include: { sender: true, receiver: true },
    });
  }

  async create(data: Prisma.MessageCreateInput) {
    return this.prisma.message.create({ data });
  }

  async findConversation(userId1: string, userId2: string, params?: { skip?: number; take?: number }) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      skip: params?.skip,
      take: params?.take || 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findConversations(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
      },
    });

    const conversationMap = new Map<string, any>();
    for (const msg of messages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: msg.senderId === userId ? msg.receiver : msg.sender,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
      if (msg.receiverId === userId && !msg.isRead) {
        conversationMap.get(otherUserId)!.unreadCount++;
      }
    }

    return Array.from(conversationMap.values());
  }

  async markAsRead(messageIds: string[]) {
    return this.prisma.message.updateMany({
      where: { id: { in: messageIds } },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: { receiverId: userId, isRead: false },
    });
  }

  async findByBooking(bookingId: string) {
    return this.prisma.message.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findMany(params: {
    where?: Prisma.MessageWhereInput;
    orderBy?: Prisma.MessageOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) {
    return this.prisma.message.findMany({
      where: params.where,
      orderBy: params.orderBy || { createdAt: 'desc' },
      skip: params.skip,
      take: params.take || 50,
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
      },
    });
  }

  async findByConversation(conversationId: string, params?: { skip?: number; take?: number }) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      skip: params?.skip,
      take: params?.take || 50,
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
      },
    });
  }
}
