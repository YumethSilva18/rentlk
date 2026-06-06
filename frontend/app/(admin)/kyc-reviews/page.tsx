'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Eye, Clock } from 'lucide-react'

const mockKYCReviews = [
  { id: 1, user: 'Priya Fernando', type: 'NIC', submitted: '2024-06-01', status: 'pending', documents: 2 },
  { id: 2, user: 'Amal Jayawardena', type: 'Passport', submitted: '2024-06-02', status: 'pending', documents: 3 },
  { id: 3, user: 'Samantha Perera', type: 'NIC', submitted: '2024-05-30', status: 'pending', documents: 2 },
  { id: 4, user: 'Ruwan Silva', type: 'Driving License', submitted: '2024-06-03', status: 'pending', documents: 1 },
]

export default function AdminKYCReviewsPage() {
  const [reviews, setReviews] = useState(mockKYCReviews)

  const handleAction = (id: number, action: 'approved' | 'rejected') => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, status: action } : review
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC Reviews</h1>
          <p className="text-gray-600">Review and verify user identity documents.</p>
        </div>
        <Badge variant="warning" className="text-sm">
          {reviews.filter((r) => r.status === 'pending').length} Pending
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{review.user}</CardTitle>
              <Badge
                variant={
                  review.status === 'approved' ? 'success' :
                  review.status === 'rejected' ? 'destructive' : 'warning'
                }
              >
                {review.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Document Type:</span>
                  <span className="font-medium">{review.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Submitted:</span>
                  <span className="font-medium">{review.submitted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Documents:</span>
                  <span className="font-medium">{review.documents} files</span>
                </div>

                {review.status === 'pending' ? (
                  <div className="flex space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View Documents
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction(review.id, 'approved')}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleAction(review.id, 'rejected')}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center pt-2 text-sm text-gray-500">
                    <Clock className="mr-1 h-4 w-4" />
                    Reviewed
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
