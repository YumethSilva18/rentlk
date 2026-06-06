'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const cancelReasons = [
  'Change of plans',
  'Found a better price',
  'Vehicle no longer needed',
  'Issue with vehicle details',
  'Payment issue',
  'Other',
]

export default function CancelBookingPage() {
  const [selectedReason, setSelectedReason] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleCancel = () => {
    if (!selectedReason) return
    // TODO: Call cancel booking API
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-lg text-center">
          <CardContent className="p-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
              <AlertTriangle className="h-10 w-10 text-yellow-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Cancellation Submitted</h1>
            <p className="mb-6 text-gray-600">
              Your cancellation request has been submitted. Refunds will be processed according to our cancellation policy.
            </p>
            <Button asChild>
              <Link href="/my-bookings">Back to My Bookings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/my-bookings">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bookings
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cancel Booking</h1>
        <p className="text-gray-600">Please let us know why you are cancelling.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select a reason</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {cancelReasons.map((reason) => (
              <label
                key={reason}
                className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                  selectedReason === reason
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="mr-3"
                />
                <span className="text-sm font-medium">{reason}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Additional Notes (Optional)
            </label>
            <Textarea
              placeholder="Any additional details..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
            <p className="font-medium">Cancellation Policy:</p>
            <p>Free cancellation up to 24 hours before pickup. Late cancellations may incur a fee.</p>
          </div>

          <Button
            className="w-full"
            variant="destructive"
            disabled={!selectedReason}
            onClick={handleCancel}
          >
            Confirm Cancellation
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
