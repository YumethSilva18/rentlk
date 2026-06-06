// ============================================================================
// Message Service
// ============================================================================

import { api } from './api.service';
import { apiConfig } from '@/config/api.config';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api.types';
import type { Conversation, Message } from '@/types/message.types';

class MessageService {
  async getConversations(params?: PaginationParams): Promise<PaginatedResponse<Conversation>> {
    return api.get<PaginatedResponse<Conversation>>(
      apiConfig.endpoints.messages.conversations,
      { params }
    );
  }

  async getConversation(id: string): Promise<Conversation> {
    const response = await api.get<ApiResponse<Conversation>>(
      apiConfig.endpoints.messages.conversation(id)
    );
    return response.data!;
  }

  async getMessages(conversationId: string, params?: PaginationParams): Promise<PaginatedResponse<Message>> {
    return api.get<PaginatedResponse<Message>>(
      apiConfig.endpoints.messages.messages(conversationId),
      { params }
    );
  }

  async sendMessage(conversationId: string, content: string, type = 'text', attachment?: string): Promise<Message> {
    const data: Record<string, unknown> = { content, type };
    if (attachment) data.attachment = attachment;

    const response = await api.post<ApiResponse<Message>>(
      apiConfig.endpoints.messages.send(conversationId),
      data
    );
    return response.data!;
  }

  async markAsRead(conversationId: string): Promise<void> {
    await api.post(apiConfig.endpoints.messages.markRead(conversationId));
  }

  async createConversation(participantId: string, bookingId?: string, vehicleId?: string): Promise<Conversation> {
    const response = await api.post<ApiResponse<Conversation>>(
      apiConfig.endpoints.messages.create,
      { participantId, bookingId, vehicleId }
    );
    return response.data!;
  }
}

export const messageService = new MessageService();
