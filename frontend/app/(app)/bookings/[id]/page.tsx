'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Clock, CreditCard, Phone, MessageSquare, Car, User } from 'lucide-react'
import Link from 'next/link'

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking #{params.id}</h1>
          <p className="text-gray-600">Booking details and status</p>
        </div>
        <Badge variant="success" className="text-sm">Confirmed</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle & Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
                  <Car className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Toyota Prius 2020</h3>
                  <p className="text-sm text-gray-500">White • Automatic • Hybrid</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Pickup Date</p>
                    <p className="font-medium">June 5, 2024 • 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Return Date</p>
                    <p className="font-medium">June 8, 2024 • 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Pickup Location</p>
                    <p className="font-medium">Colombo Fort Station</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium">3 Days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Rental (Rs. 8,000 × 3 days)</span>
                <span className="font-medium">Rs. 24,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Insurance</span>
                <span className="font-medium">Rs. 1,500</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Fee</span>
                <span className="font-medium">Rs. 1,200</span>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-bold">
                <span>Total</span>
                <span className="text-primary">Rs. 26,700</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Nimal Silva</p>
                  <p className="text-sm text-gray-500">Verified Owner</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/tracking/${params.id}`}>Track Vehicle</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/bookings/invoice/${params.id}`}>View Invoice</Link>
              </Button>
              <Button variant="outline" className="w-full text-red-600" asChild>
                <Link href={`/bookings/cancel`}>Cancel Booking</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
