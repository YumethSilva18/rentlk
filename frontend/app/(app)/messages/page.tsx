'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  const [search, setSearch] = useState('')

  const conversations = [
    {
      id: '1',
      name: 'Nimal Silva',
      lastMessage: 'Is the vehicle still available?',
      time: '10m ago',
      unread: 2,
      avatar: null,
    },
    {
      id: '2',
      name: 'Kasun Perera',
      lastMessage: 'Thanks for the booking!',
      time: '1h ago',
      unread: 0,
      avatar: null,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button>New Message</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search messages..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {conversations.map((conv) => (
          <Card key={conv.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Link href={`/chat/${conv.id}`}>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-semibold">
                    {conv.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{conv.name}</h3>
                      <span className="text-xs text-gray-500">{conv.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <Badge className="ml-2">{conv.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {conversations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold">No Messages Yet</h3>
            <p className="text-gray-600">Start a conversation with vehicle owners or renters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
