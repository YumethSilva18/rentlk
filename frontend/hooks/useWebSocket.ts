'use client'

import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { appConfig } from '@/lib/config'

export function useWebSocket(
  eventHandlers: Record<string, (...args: unknown[]) => void> = {}
) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    socketRef.current = io(appConfig.socketUrl, {
      transports: ['websocket'],
      autoConnect: false,
    })

    socketRef.current.connect()

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socketRef.current) return

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socketRef.current?.on(event, handler)
    })

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socketRef.current?.off(event, handler)
      })
    }
  }, [eventHandlers])

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data)
  }, [])

  const joinRoom = useCallback((room: string) => {
    socketRef.current?.emit('join', room)
  }, [])

  const leaveRoom = useCallback((room: string) => {
    socketRef.current?.emit('leave', room)
  }, [])

  return {
    socket: socketRef.current,
    emit,
    joinRoom,
    leaveRoom,
    isConnected: socketRef.current?.connected ?? false,
  }
}
