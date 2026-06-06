'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, Clock, Gauge, Shield, AlertTriangle } from 'lucide-react'

export default function TrackingPage({ params }: { params: { bookingId: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
          <p className="text-gray-600">Booking #{params.bookingId}</p>
        </div>
        <Badge variant="success">Active</Badge>
      </div>

      {/* Map Placeholder */}
      <Card className="overflow-hidden">
        <div className="flex h-96 items-center justify-center bg-gray-100">
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">Google Maps Integration</p>
            <p className="text-sm text-gray-400">Map will be rendered here</p>
          </div>
        </div>
      </Card>

      {/* Tracking Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Speed</CardTitle>
            <Gauge className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">45 km/h</p>
            <p className="text-xs text-gray-500">Within limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Distance</CardTitle>
            <Navigation className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">12.5 km</p>
            <p className="text-xs text-gray-500">From start point</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">2h 15m</p>
            <p className="text-xs text-gray-500">Trip duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Geofence Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Shield className="mr-2 h-5 w-5 text-green-600" />
            Geofence Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-green-700">Within allowed area</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Vehicle is currently within the designated rental area.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
