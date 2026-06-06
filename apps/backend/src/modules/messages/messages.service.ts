import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { MessageRepository } from '../../database/repositories/message.repository';
import { ConversationRepository } from '../../database/repositories/conversation.repository';
import { BookingRepository } from '../../database/repositories/booking.repository';
import { EventBusService } from '../../events/event-bus.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly conversationRepo: ConversationRepository,
    private readonly bookingRepo: BookingRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async sendMessage(
    senderId: string,
    data: {
      receiverId: string;
      content: string;
      bookingId?: string;
      type?: string;
      attachment?: string;
      attachmentMeta?: any;
      conversationId?: string;
    },
  ) {
    // Validate booking access if bookingId provided
    if (data.bookingId) {
      const booking = await this.bookingRepo.findById(data.bookingId);
      if (!booking) throw new NotFoundException('Booking not found');
      if (booking.renterId !== senderId && booking.ownerId !== senderId) {
        throw new ForbiddenException('You are not part of this booking');
      }
    }

    // Find or create conversation
    let conversationId = data.conversationId;
    if (!conversationId && data.bookingId) {
      const conversation = await this.conversationRepo.findOrCreateConversation(
        [senderId, data.receiverId],
        data.bookingId,
      );
      conversationId = conversation.id;
    } else if (!conversationId) {
      const conversation = await this.conversationRepo.findOrCreateConversation([
        senderId,
        data.receiverId,
      ]);
      conversationId = conversation.id;
    }

    // Verify sender is participant
    const isParticipant = await this.conversationRepo.isParticipant(conversationId!, senderId);
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    const message = await this.messageRepo.create({
      senderId,
      receiverId: data.receiverId,
      content: data.content,
      bookingId: data.bookingId,
      conversationId,
      type: data.type || 'TEXT',
      attachment: data.attachment,
      attachmentMeta: data.attachmentMeta,
    } as any);

    // Emit event for notification handler and WebSocket gateway
    this.eventBus.emit('message:sent', {
      messageId: message.id,
      conversationId,
      senderId,
      receiverId: data.receiverId,
      preview: data.content.substring(0, 100),
    });

    this.logger.log(`Message sent from ${senderId} to ${data.receiverId}`);
    return message;
  }

  // Get user's conversations
  async getConversations(userId: string, params?: { skip?: number; take?: number }) {
    return this.conversationRepo.findUserConversations(userId, params);
  }

  // Get messages in a conversation
  async getConversationMessages(
    userId: string,
    conversationId: string,
    params?: { skip?: number; take?: number },
  ) {
    // Verify participation
    const isParticipant = await this.conversationRepo.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    return this.messageRepo.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      skip: params?.skip,
      take: params?.take || 50,
    });
  }

  // Legacy method - get messages by user or booking
  async getMessages(
    userId: string,
    params: { otherUserId?: string; bookingId?: string; skip?: number; take?: number },
  ) {
    if (params.bookingId) {
      return this.messageRepo.findByBooking(params.bookingId);
    }
    if (params.otherUserId) {
      return this.messageRepo.findConversation(userId, params.otherUserId, params);
    }
    return this.conversationRepo.findUserConversations(userId);
  }

  async markAsRead(messageId: string, userId: string) {
    const message = await this.messageRepo.findById(messageId);
    if (!message) throw new NotFoundException('Message not found');
    if (message.receiverId !== userId) throw new NotFoundException('Message not found');

    return this.messageRepo.markAsRead([messageId]);
  }

  async markConversationAsRead(conversationId: string, userId: string) {
    const isParticipant = await this.conversationRepo.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenException('Not a participant');
    }

    await this.conversationRepo.updateLastReadAt(conversationId, userId);
    return { success: true };
  }

  async getUnreadCount(userId: string) {
    return this.messageRepo.getUnreadCount(userId);
  }

  // Conversation management
  async getConversation(conversationId: string, userId: string) {
    const isParticipant = await this.conversationRepo.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenException('Not a participant');
    }
    return this.conversationRepo.findById(conversationId);
  }

  async getConversationUnreadCount(conversationId: string, userId: string) {
    return this.conversationRepo.getUnreadCount(conversationId, userId);
  }

  async createConversation(userId: string, participantIds: string[], bookingId?: string) {
    return this.conversationRepo.findOrCreateConversation([userId, ...participantIds], bookingId);
  }

  async addParticipant(conversationId: string, userId: string, newParticipantId: string) {
    const isParticipant = await this.conversationRepo.isParticipant(conversationId, userId);
    if (!isParticipant) {
      throw new ForbiddenException('Not a participant');
    }
    return this.conversationRepo.addParticipant(conversationId, newParticipantId);
  }
}
