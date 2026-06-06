'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Calendar, MessageSquare, CreditCard, Car, CheckCheck } from 'lucide-react'

const mockNotifications = [
  { id: 1, title: 'Booking Confirmed', message: 'Your booking #BK-2024-0892 has been confirmed.', type: 'booking', read: false, time: '5 minutes ago', icon: Calendar },
  { id: 2, title: 'New Message', message: 'Nimal Silva sent you a message about the vehicle.', type: 'message', read: false, time: '1 hour ago', icon: MessageSquare },
  { id: 3, title: 'Payment Received', message: 'Payment of Rs. 24,000 has been processed.', type: 'payment', read: true, time: '3 hours ago', icon: CreditCard },
  { id: 4, title: 'Vehicle Approved', message: 'Your vehicle listing has been approved.', type: 'vehicle', read: true, time: '1 day ago', icon: Car },
  { id: 5, title: 'KYC Reminder', message: 'Complete your KYC verification to unlock all features.', type: 'system', read: true, time: '2 days ago', icon: Bell },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {mockNotifications.filter((n) => !n.read).length} unread notifications
          </p>
        </div>
        <Button variant="outline" size="sm">
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((notification) => {
          const Icon = notification.icon
          return (
            <Card key={notification.id} className={!notification.read ? 'border-l-4 border-l-primary' : ''}>
              <CardContent className="flex items-start space-x-4 p-4">
                <div className={`rounded-full p-2 ${
                  !notification.read ? 'bg-primary/10' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    !notification.read ? 'text-primary' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <Badge variant="default" className="text-xs">New</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
