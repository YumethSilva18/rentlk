'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { ArrowLeft, Send, Phone, Video, MoreVertical, Image, Paperclip } from 'lucide-react'
import Link from 'next/link'

const mockMessages = [
  { id: 1, sender: 'other', text: 'Hi! Is the vehicle still available for June 5-8?', time: '10:30 AM' },
  { id: 2, sender: 'me', text: 'Yes, it is! Would you like to book?', time: '10:32 AM' },
  { id: 3, sender: 'other', text: 'Great! Can you confirm the total price including insurance?', time: '10:33 AM' },
  { id: 4, sender: 'me', text: 'The total would be Rs. 24,000 for 3 days including basic insurance.', time: '10:35 AM' },
  { id: 5, sender: 'other', text: 'Perfect, I will proceed with the booking then.', time: '10:36 AM' },
]

export default function ChatPage({ params }: { params: { conversationId: string } }) {
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mockMessages])

  const handleSend = () => {
    if (!newMessage.trim()) return
    // TODO: Send message via WebSocket
    setNewMessage('')
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" asChild className="lg:hidden">
            <Link href="/messages">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <span className="text-sm font-medium">NP</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Nimal Silva</h2>
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="space-y-4">
          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender !== 'me' && (
                <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-xs font-medium">NP</span>
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.sender === 'me'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`mt-1 text-right text-xs ${msg.sender === 'me' ? 'text-white/70' : 'text-gray-400'}`}>
                  {msg.time}
                </p>
              </div>
              {msg.sender === 'me' && (
                <div className="ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300">
                  <span className="text-xs font-medium">KP</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t bg-white px-4 py-3">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Image className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
