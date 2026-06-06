'use client'

import React from 'react'
import { MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Conversation } from '@/types'

interface ConversationCardProps {
  conversation: Conversation
  currentUserId: string
  isSelected?: boolean
  onClick?: (id: string) => void
  className?: string
}

export function ConversationCard({
  conversation,
  currentUserId,
  isSelected = false,
  onClick,
  className,
}: ConversationCardProps) {
  const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId)
  const lastMsg = conversation.lastMessage

  return (
    <div
      className={`flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-colors hover:bg-accent ${
        isSelected ? 'bg-accent' : ''
      } ${className || ''}`}
      onClick={() => onClick?.(conversation.id)}
    >
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
          {otherParticipant?.avatar ? (
            <img
              src={otherParticipant.avatar}
              alt={otherParticipant?.name || 'User'}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            (otherParticipant?.name || 'U').charAt(0).toUpperCase()
          )}
        </div>
        {otherParticipant?.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium truncate">
            {otherParticipant?.name || 'Unknown User'}
          </p>
          {lastMsg && (
            <span className="text-xs text-muted-foreground shrink-0">
              {new Date(lastMsg.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-muted-foreground truncate">
            {lastMsg
              ? lastMsg.type === 'image'
                ? '📷 Image'
                : lastMsg.type === 'file'
                  ? '📎 File'
                  : lastMsg.content
              : 'No messages yet'}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="ml-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

interface ConversationListProps {
  conversations: Conversation[]
  currentUserId: string
  selectedId?: string
  onSelect?: (id: string) => void
  isLoading?: boolean
  className?: string
}

export function ConversationList({
  conversations,
  currentUserId,
  selectedId,
  onSelect,
  isLoading = false,
  className,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-12 w-12 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <ConversationCard
                key={conv.id}
                conversation={conv}
                currentUserId={currentUserId}
                isSelected={selectedId === conv.id}
                onClick={onSelect}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
