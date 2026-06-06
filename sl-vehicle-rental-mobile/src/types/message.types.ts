// ============================================================================
// Message Types - Ported from web frontend
// ============================================================================

export interface Conversation {
  id: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  bookingId?: string;
  vehicleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationParticipant {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  attachment?: MessageAttachment;
  readBy: string[];
  createdAt: string;
}

export type MessageType = 'text' | 'image' | 'file' | 'location' | 'system';

export interface MessageAttachment {
  url: string;
  name: string;
  size: number;
  type: string;
  thumbnailUrl?: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface MessageNotification {
  conversationId: string;
  message: Message;
  sender: ConversationParticipant;
}
