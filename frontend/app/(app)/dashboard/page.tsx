'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Car,
  DollarSign,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  Search,
  MessageSquare,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  // TODO: Replace with actual data from API
  const stats = {
    totalBookings: 12,
    activeBookings: 2,
    totalListings: 3,
    totalEarnings: 125000,
    unreadMessages: 3,
  }

  const upcomingBookings = [
    {
      id: '1',
      vehicle: 'Toyota Prius 2020',
      startDate: '2026-06-10',
      endDate: '2026-06-15',
      status: 'confirmed',
      total: 27500,
      image: '/images/vehicle-placeholder.jpg',
    },
    {
      id: '2',
      vehicle: 'Honda Civic 2019',
      startDate: '2026-06-20',
      endDate: '2026-06-22',
      status: 'pending',
      total: 9000,
      image: '/images/vehicle-placeholder.jpg',
    },
  ]

  const myVehicles = [
    {
      id: '1',
      title: 'Toyota Prius 2020',
      status: 'active',
      bookings: 15,
      earnings: 82500,
      rating: 4.9,
      image: '/images/vehicle-placeholder.jpg',
    },
    {
      id: '2',
      title: 'Honda Civic 2019',
      status: 'active',
      bookings: 8,
      earnings: 36000,
      rating: 4.7,
      image: '/images/vehicle-placeholder.jpg',
    },
  ]

  const recentActivity = [
    {
      id: '1',
      type: 'booking',
      message: 'New booking request for Toyota Prius',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'message',
      message: 'New message from Nimal Silva',
      time: '5 hours ago',
    },
    {
      id: '3',
      type: 'earning',
      message: 'Payment received: LKR 27,500',
      time: '1 day ago',
    },
  ]

  return (
    <div className="space-y-6">
      {/* KYC Warning Banner */}
      <Card className="border-warning bg-warning/10">
        <CardContent className="flex items-start gap-4 p-4">
          <AlertCircle className="h-6 w-6 text-warning" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Complete Your KYC Verification</h3>
            <p className="mt-1 text-sm text-gray-600">
              You need to complete KYC verification to book vehicles or list your own vehicles.
            </p>
          </div>
          <Button variant="warning" asChild>
            <Link href="/kyc">Complete KYC</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Vehicles</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalListings}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Car className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.totalEarnings)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.unreadMessages}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                <MessageSquare className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/rent-vehicles">
                <Search className="mb-2 h-6 w-6" />
                Rent Vehicles
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/add-vehicle">
                <PlusCircle className="mb-2 h-6 w-6" />
                List Vehicle
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/my-bookings">
                <Calendar className="mb-2 h-6 w-6" />
                My Bookings
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/messages">
                <MessageSquare className="mb-2 h-6 w-6" />
                Messages
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Bookings</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my-bookings">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex gap-4 rounded-lg border p-4">
                <img
                  src={booking.image}
                  alt={booking.vehicle}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{booking.vehicle}</h3>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <Calendar className="mr-1 h-4 w-4" />
                        {booking.startDate} to {booking.endDate}
                      </div>
                    </div>
                    <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(booking.total)}
                    </span>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Vehicles */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Vehicles</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/my-vehicles">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {myVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex gap-4 rounded-lg border p-4">
                <img
                  src={vehicle.image}
                  alt={vehicle.title}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{vehicle.title}</h3>
                      <div className="mt-1 flex items-center gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="mr-1 h-4 w-4" />
                          {vehicle.bookings} bookings
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {vehicle.rating}
                        </div>
                      </div>
                    </div>
                    <Badge variant="success">{vehicle.status}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-success">
                      Earned: {formatCurrency(vehicle.earnings)}
                    </span>
                    <Button size="sm" variant="outline">Manage</Button>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/add-vehicle">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Vehicle
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {activity.type === 'booking' && <Calendar className="h-5 w-5 text-primary" />}
                  {activity.type === 'message' && <MessageSquare className="h-5 w-5 text-primary" />}
                  {activity.type === 'earning' && <DollarSign className="h-5 w-5 text-success" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
