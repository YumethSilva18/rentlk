'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Star, ThumbsUp, User, PenLine } from 'lucide-react'

const mockReviews = [
  {
    id: 1,
    from: 'Nimal Silva',
    to: 'Me',
    vehicle: 'Toyota Prius 2020',
    rating: 5,
    comment: 'Excellent renter! Took great care of my vehicle and returned it on time.',
    date: '2024-06-04',
    isAboutMe: true,
  },
  {
    id: 2,
    from: 'Me',
    to: 'Dilani Perera',
    vehicle: 'Honda Dio 2021',
    rating: 4,
    comment: 'Good vehicle, well maintained. Would rent again.',
    date: '2024-06-02',
    isAboutMe: false,
  },
  {
    id: 3,
    from: 'Priya Fernando',
    to: 'Me',
    vehicle: 'Suzuki Alto 2019',
    rating: 5,
    comment: 'Very smooth transaction. Clean vehicle and flexible with pickup time.',
    date: '2024-05-28',
    isAboutMe: true,
  },
]

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-600">See reviews about you and vehicles.</p>
        </div>
        <Button variant="outline">
          <PenLine className="mr-2 h-4 w-4" />
          Write a Review
        </Button>
      </div>

      <div className="space-y-4">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="flex items-start space-x-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.from} → {review.to}
                    </h3>
                    <p className="text-sm text-gray-500">Vehicle: {review.vehicle}</p>
                  </div>
                  <span className="text-sm text-gray-400">{review.date}</span>
                </div>
                <div className="mt-2 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-gray-600">{review.comment}</p>
                {review.isAboutMe && (
                  <div className="mt-3 flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="mr-1 h-4 w-4" />
                      Helpful
                    </Button>
                    <Button variant="ghost" size="sm">Reply</Button>
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
