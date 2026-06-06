'use client'

import React from 'react'
import { MessageSquare, Search, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConversationCard } from './ConversationList'
import type { Conversation } from '@/types'

interface MessagesListProps {
  conversations: Conversation[]
  currentUserId: string
  selectedId?: string
  onSelect?: (id: string) => void
  onNewMessage?: () => void
  onSearch?: (query: string) => void
  isLoading?: boolean
  className?: string
}

export function MessagesList({
  conversations,
  currentUserId,
  selectedId,
  onSelect,
  onNewMessage,
  onSearch,
  isLoading = false,
  className,
}: MessagesListProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Messages</CardTitle>
          <Button variant="ghost" size="icon" onClick={onNewMessage}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-9"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-10 w-10 mb-2 opacity-30" />
            <p className="text-sm">No messages yet</p>
            <Button variant="link" size="sm" onClick={onNewMessage} className="mt-1">
              Start a conversation
            </Button>
          </div>
        ) : (
          <div className="space-y-1 -mx-2">
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
