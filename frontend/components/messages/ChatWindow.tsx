'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Image, Smile, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Message, Conversation, ConversationParticipant } from '@/types'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  sender?: ConversationParticipant
}

export function MessageBubble({ message, isOwn, sender }: MessageBubbleProps) {
  return (
    <div className={cn('flex gap-2 mb-4', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      {!isOwn && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {sender?.avatar ? (
            <img src={sender.avatar} alt={sender.name} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            (sender?.name || 'U').charAt(0).toUpperCase()
          )}
        </div>
      )}
      <div className={cn('max-w-[70%]', isOwn ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2 text-sm',
            isOwn ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted rounded-bl-md'
          )}
        >
          {message.type === 'image' && message.attachment ? (
            <img
              src={message.attachment.thumbnailUrl || message.attachment.url}
              alt={message.attachment.name}
              className="max-w-[200px] rounded-lg mb-1"
            />
          ) : message.type === 'file' && message.attachment ? (
            <a
              href={message.attachment.url}
              className="flex items-center gap-2 text-xs underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Paperclip className="h-3 w-3" />
              {message.attachment.name}
            </a>
          ) : message.type === 'system' ? (
            <span className="italic text-xs opacity-70">{message.content}</span>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
        <p
          className={cn(
            'text-xs text-muted-foreground mt-1',
            isOwn ? 'text-right' : 'text-left'
          )}
        >
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isOwn && message.readBy.length > 0 && ' · Read'}
        </p>
      </div>
    </div>
  )
}

interface MessageInputProps {
  onSend: (content: string) => void
  onAttach?: () => void
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({ onSend, onAttach, disabled = false, placeholder = 'Type a message...' }: MessageInputProps) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (trimmed) {
      onSend(trimmed)
      setValue('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-2 border-t p-3">
      <Button variant="ghost" size="icon" className="shrink-0" onClick={onAttach} disabled={disabled}>
        <Paperclip className="h-5 w-5" />
      </Button>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
      />
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  )
}

interface ChatWindowProps {
  messages: Message[]
  conversation: Conversation
  currentUserId: string
  otherParticipant?: ConversationParticipant
  onSend: (content: string) => void
  onBack?: () => void
  isTyping?: boolean
  isLoading?: boolean
  className?: string
}

export function ChatWindow({
  messages,
  conversation,
  currentUserId,
  otherParticipant,
  onSend,
  onBack,
  isTyping = false,
  isLoading = false,
  className,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (isLoading) {
    return (
      <Card className={cn('flex flex-col h-full', className)}>
        <div className="flex items-center gap-3 border-b p-4">
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
              <div className={`h-16 w-3/5 bg-muted rounded-2xl animate-pulse`} />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center gap-3 border-b p-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {otherParticipant?.avatar ? (
              <img
                src={otherParticipant.avatar}
                alt={otherParticipant.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              (otherParticipant?.name || 'U').charAt(0).toUpperCase()
            )}
          </div>
          {otherParticipant?.isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{otherParticipant?.name || 'Chat'}</p>
          <p className="text-xs text-muted-foreground">
            {isTyping ? 'Typing...' : otherParticipant?.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === currentUserId}
              sender={conversation.participants.find((p) => p.id === msg.senderId)}
            />
          ))
        )}
        {isTyping && (
          <div className="flex gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <span className="text-xs">...</span>
            </div>
            <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={onSend} placeholder="Type a message..." />
    </Card>
  )
}
