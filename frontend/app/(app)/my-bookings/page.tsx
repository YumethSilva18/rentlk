'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function MyBookingsPage() {
  const [filter, setFilter] = useState('all')

  const bookings = [
    {
      id: '1',
      vehicle: 'Toyota Prius 2020',
      image: '/images/vehicle-placeholder.jpg',
      startDate: '2026-06-10',
      endDate: '2026-06-15',
      status: 'confirmed',
      total: 27500,
      location: 'Colombo',
    },
    {
      id: '2',
      vehicle: 'Honda Civic 2019',
      image: '/images/vehicle-placeholder.jpg',
      startDate: '2026-06-20',
      endDate: '2026-06-22',
      status: 'pending',
      total: 9000,
      location: 'Kandy',
    },
    {
      id: '3',
      vehicle: 'Toyota Hiace Van',
      image: '/images/vehicle-placeholder.jpg',
      startDate: '2026-05-15',
      endDate: '2026-05-18',
      status: 'completed',
      total: 25500,
      location: 'Galle',
    },
  ]

  const statusColors = {
    pending: 'warning',
    confirmed: 'success',
    active: 'accent',
    completed: 'secondary',
    cancelled: 'destructive',
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', 'upcoming', 'active', 'completed', 'cancelled'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <img
                  src={booking.image}
                  alt={booking.vehicle}
                  className="h-32 w-full rounded-lg object-cover md:w-48"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{booking.vehicle}</h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {booking.startDate} to {booking.endDate}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                          {booking.location}
                        </div>
                      </div>
                    </div>
                    <Badge variant={statusColors[booking.status as keyof typeof statusColors] as any}>
                      {booking.status}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div>
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(booking.total)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/bookings/${booking.id}`}>View Details</Link>
                      </Button>
                      {booking.status === 'confirmed' && (
                        <Button variant="destructive">Cancel</Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold">No Bookings Found</h3>
            <p className="mb-4 text-gray-600">Start exploring vehicles and make your first booking</p>
            <Button asChild>
              <Link href="/rent-vehicles">Browse Vehicles</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
