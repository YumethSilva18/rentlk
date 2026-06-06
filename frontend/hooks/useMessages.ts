'use client'

import { useMessageStore } from '@/store'
import { messageService } from '@/services/message.service'
import { useCallback } from 'react'

export function useMessages() {
  const {
    conversations,
    selectedConversation,
    messages,
    unreadCount,
    isLoading,
    error,
    setConversations,
    setSelectedConversation,
    setMessages,
    addMessage,
    updateConversation,
    setUnreadCount,
    setLoading,
    setError,
  } = useMessageStore()

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    try {
      const response = await messageService.getConversations()
      setConversations(response.data.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations')
    } finally {
      setLoading(false)
    }
  }, [setLoading, setConversations, setError])

  const fetchMessages = useCallback(
    async (conversationId: string, params?: { page?: number; pageSize?: number }) => {
      setLoading(true)
      try {
        const response = await messageService.getMessages(conversationId, params)
        setMessages(conversationId, response.data.data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages')
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setMessages, setError]
  )

  const sendMessage = useCallback(
    async (conversationId: string, content: string, attachment?: File) => {
      try {
        const response = await messageService.sendMessage(conversationId, content, attachment)
        const msg = response.data.data
        if (msg) addMessage(conversationId, msg)
        return msg
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message')
        return null
      }
    },
    [addMessage, setError]
  )

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await messageService.getUnreadCount()
      setUnreadCount(response.data.data?.total ?? 0)
    } catch {
      // silently fail
    }
  }, [setUnreadCount])

  return {
    conversations,
    selectedConversation,
    messages,
    unreadCount,
    isLoading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    fetchUnreadCount,
    setSelectedConversation,
  }
}
