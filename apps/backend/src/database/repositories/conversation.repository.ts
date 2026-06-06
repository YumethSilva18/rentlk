import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConversationRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findById(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, profileImage: true, phoneNumber: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        booking: { select: { id: true, status: true, vehicleId: true } },
      },
    });
  }

  async create(data: Prisma.ConversationCreateInput) {
    return this.prisma.conversation.create({
      data,
      include: { participants: true },
    });
  }

  async createConversation(bookingId?: string, participantIds?: string[], title?: string) {
    return this.prisma.conversation.create({
      data: {
        bookingId,
        title,
        participants: participantIds?.length
          ? {
              create: participantIds.map((userId) => ({ userId })),
            }
          : undefined,
      },
      include: { participants: true },
    });
  }

  async addParticipant(conversationId: string, userId: string, role: string = 'member') {
    return this.prisma.conversationParticipant.upsert({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      create: { conversationId, userId, role },
      update: { role },
    });
  }

  async removeParticipant(conversationId: string, userId: string) {
    return this.prisma.conversationParticipant.delete({
      where: {
        conversationId_userId: { conversationId, userId },
      },
    });
  }

  async findUserConversations(userId: string, params?: { skip?: number; take?: number }) {
    return this.prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
        isActive: true,
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, firstName: true } },
          },
        },
        booking: { select: { id: true, status: true } },
      },
      orderBy: { updatedAt: 'desc' },
      skip: params?.skip,
      take: params?.take || 50,
    });
  }

  async findConversationByBooking(bookingId: string) {
    return this.prisma.conversation.findFirst({
      where: { bookingId, isActive: true },
      include: {
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, profileImage: true } },
          },
        },
      },
    });
  }

  async findOrCreateConversation(participantIds: string[], bookingId?: string) {
    // Check for existing conversation with these participants
    if (bookingId) {
      const existing = await this.findConversationByBooking(bookingId);
      if (existing) return existing;
    }

    return this.createConversation(bookingId, participantIds);
  }

  async updateLastReadAt(conversationId: string, userId: string) {
    return this.prisma.conversationParticipant.update({
      where: {
        conversationId_userId: { conversationId, userId },
      },
      data: { lastReadAt: new Date() },
    });
  }

  async getUnreadCount(conversationId: string, userId: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant) return 0;

    return this.prisma.message.count({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
        createdAt: { gt: participant.lastReadAt || new Date(0) },
      },
    });
  }

  async deactivate(conversationId: string) {
    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { isActive: false },
    });
  }

  async isParticipant(conversationId: string, userId: string) {
    const count = await this.prisma.conversationParticipant.count({
      where: { conversationId, userId },
    });
    return count > 0;
  }
}
