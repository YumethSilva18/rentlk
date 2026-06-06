'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  userName?: string
  className?: string
}

export function TypingIndicator({ userName, className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-2 text-xs text-muted-foreground py-1', className)}>
      <div className="flex gap-1">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
      </div>
      {userName ? <span>{userName} is typing...</span> : <span>Typing...</span>}
    </div>
  )
}

interface ReadReceiptProps {
  readBy: string[]
  readByNames?: string[]
  className?: string
}

export function ReadReceipt({ readBy, readByNames, className }: ReadReceiptProps) {
  if (readBy.length === 0) return null

  return (
    <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', className)}>
      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7.5 11L4 7.5l1-1L7.5 9l3.5-3.5 1 1L7.5 11z" />
      </svg>
      {readByNames && readByNames.length > 0 ? (
        <span>Read by {readByNames.join(', ')}</span>
      ) : (
        <span>Read</span>
      )}
    </div>
  )
}

interface MessageAttachmentProps {
  attachment: {
    url: string
    name: string
    size: number
    type: string
    thumbnailUrl?: string
  }
  className?: string
}

export function MessageAttachment({ attachment, className }: MessageAttachmentProps) {
  const isImage = attachment.type.startsWith('image/')
  const sizeInMB = (attachment.size / (1024 * 1024)).toFixed(1)

  if (isImage) {
    return (
      <div className={cn('relative', className)}>
        <img
          src={attachment.thumbnailUrl || attachment.url}
          alt={attachment.name}
          className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
        />
        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
          {sizeInMB} MB
        </span>
      </div>
    )
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3 hover:bg-accent transition-colors',
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
        <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{attachment.name}</p>
        <p className="text-xs text-muted-foreground">{sizeInMB} MB</p>
      </div>
    </a>
  )
}
