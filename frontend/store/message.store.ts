import { create } from 'zustand'
import type { Conversation, Message } from '@/types'

interface MessageState {
  conversations: Conversation[]
  selectedConversation: Conversation | null
  messages: Record<string, Message[]>
  unreadCount: number
  isLoading: boolean
  error: string | null

  // Actions
  setConversations: (conversations: Conversation[]) => void
  setSelectedConversation: (conversation: Conversation | null) => void
  setMessages: (conversationId: string, messages: Message[]) => void
  addMessage: (conversationId: string, message: Message) => void
  updateConversation: (conversationId: string, data: Partial<Conversation>) => void
  setUnreadCount: (count: number) => void
  decrementUnread: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useMessageStore = create<MessageState>((set) => ({
  conversations: [],
  selectedConversation: null,
  messages: {},
  unreadCount: 0,
  isLoading: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),

  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    })),

  updateConversation: (conversationId, data) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, ...data } : c
      ),
    })),

  setUnreadCount: (unreadCount) => set({ unreadCount }),

  decrementUnread: () =>
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}))
