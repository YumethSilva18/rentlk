// ============================================================================
// Message Store
// ============================================================================

import { create } from 'zustand';
import { messageService } from '@/services/message.service';
import type { Conversation, Message } from '@/types/message.types';

interface MessageState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  clearSelected: () => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await messageService.getConversations();
      set({ conversations: response.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed' });
    }
  },

  selectConversation: async (id: string) => {
    try {
      const conversation = await messageService.getConversation(id);
      set({ selectedConversation: conversation });
      await get().fetchMessages(id);
      await messageService.markAsRead(id);
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed' });
    }
  },

  fetchMessages: async (conversationId: string) => {
    set({ isLoading: true });
    try {
      const response = await messageService.getMessages(conversationId);
      set({ messages: response.data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Failed' });
    }
  },

  sendMessage: async (conversationId: string, content: string) => {
    try {
      const message = await messageService.sendMessage(conversationId, content);
      set((state) => ({ messages: [...state.messages, message] }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to send' });
      throw err;
    }
  },

  markAsRead: async (conversationId: string) => {
    await messageService.markAsRead(conversationId);
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },

  addMessage: (message: Message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  clearSelected: () => set({ selectedConversation: null, messages: [] }),
}));
