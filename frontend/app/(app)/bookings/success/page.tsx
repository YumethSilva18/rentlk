'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function BookingSuccessPage() {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="max-w-lg text-center">
        <CardContent className="p-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mb-2 text-gray-600">
            Your booking has been successfully confirmed. The vehicle owner has been notified.
          </p>
          <p className="mb-6 text-sm text-gray-500">
            Booking Reference: <span className="font-semibold text-primary">#BK-2024-0892</span>
          </p>

          <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Vehicle</span>
              <span className="font-medium">Toyota Prius 2020</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500">Dates</span>
              <span className="font-medium">Jun 5 - Jun 8, 2024</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-500">Total Paid</span>
              <span className="font-bold text-primary">Rs. 26,700</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" asChild>
              <Link href={`/bookings/BK-2024-0892`}>
                View Booking Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
