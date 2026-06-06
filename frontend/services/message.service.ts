import { api } from './api'
import type { ApiResponse, Conversation, Message } from '@/types'

export const messageService = {
  getConversations: () =>
    api.get<ApiResponse<Conversation[]>>('/messages/conversations'),

  getConversation: (id: string) =>
    api.get<ApiResponse<Conversation>>(`/messages/conversations/${id}`),

  getMessages: (conversationId: string, params?: { page?: number; pageSize?: number }) =>
    api.get<ApiResponse<Message[]>>(`/messages/conversations/${conversationId}/messages`, { params }),

  sendMessage: (conversationId: string, content: string, attachment?: File) => {
    const formData = new FormData()
    formData.append('content', content)
    if (attachment) formData.append('attachment', attachment)
    return api.post<ApiResponse<Message>>(`/messages/conversations/${conversationId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  createConversation: (participantId: string, bookingId?: string, vehicleId?: string) =>
    api.post<ApiResponse<Conversation>>('/messages/conversations', { participantId, bookingId, vehicleId }),

  markAsRead: (conversationId: string) =>
    api.put<ApiResponse<null>>(`/messages/conversations/${conversationId}/read`),

  getUnreadCount: () =>
    api.get<ApiResponse<{ total: number }>>('/messages/unread-count'),

  getTypingStatus: (conversationId: string) =>
    api.get<ApiResponse<{ isTyping: boolean; userId: string }>>(`/messages/conversations/${conversationId}/typing`),
}
