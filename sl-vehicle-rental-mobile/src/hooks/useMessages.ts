// ============================================================================
// useMessages Hook
// ============================================================================

import { useCallback, useEffect } from 'react';
import { useMessageStore } from '@/store/message.store';
import { webSocketService } from '@/services/websocket.service';
import type { Message } from '@/types/message.types';

export const useMessages = () => {
  const store = useMessageStore();

  // Listen for incoming messages via WebSocket
  useEffect(() => {
    const unsub = webSocketService.onNewMessage((message: Message) => {
      store.addMessage(message);
    });
    return unsub;
  }, [store]);

  const send = useCallback(async (conversationId: string, content: string) => {
    return store.sendMessage(conversationId, content);
  }, [store]);

  return {
    conversations: store.conversations,
    selectedConversation: store.selectedConversation,
    messages: store.messages,
    isLoading: store.isLoading,
    error: store.error,
    fetchConversations: store.fetchConversations,
    selectConversation: store.selectConversation,
    send,
    markAsRead: store.markAsRead,
    clearSelected: store.clearSelected,
  };
};
