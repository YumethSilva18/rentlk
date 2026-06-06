'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  MapPin,
  Users,
  Fuel,
  Settings,
  Calendar,
  Shield,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const [currentImage, setCurrentImage] = useState(0)

  // Mock data - replace with actual API call
  const vehicle = {
    id: params.id,
    title: 'Toyota Prius 2020 - Premium Hybrid',
    description: 'Well-maintained hybrid vehicle perfect for city driving and long trips. Features full AC, GPS navigation, Bluetooth connectivity, and excellent fuel economy.',
    dailyRate: 5500,
    images: [
      '/images/vehicle-placeholder.jpg',
      '/images/vehicle-placeholder.jpg',
      '/images/vehicle-placeholder.jpg',
    ],
    location: { city: 'Colombo', address: 'Colombo 03' },
    type: 'car',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 5,
    year: 2020,
    brand: 'Toyota',
    model: 'Prius',
    rating: 4.9,
    totalReviews: 45,
    features: ['AC', 'GPS', 'Bluetooth', 'USB Charging', 'Backup Camera'],
    owner: {
      name: 'Kasun Perera',
      rating: 4.9,
      totalListings: 3,
      joinedDate: '2024',
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-padding mx-auto py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/rent-vehicles">← Back to Browse</Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gray-200">
                  <img
                    src={vehicle.images[currentImage]}
                    alt={vehicle.title}
                    className="h-full w-full object-cover rounded-t-xl"
                  />
                  {vehicle.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImage((prev) => (prev > 0 ? prev - 1 : vehicle.images.length - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => setCurrentImage((prev) => (prev < vehicle.images.length - 1 ? prev + 1 : 0))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>
                <div className="flex gap-2 p-4">
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${
                        idx === currentImage ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{vehicle.title}</h1>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{vehicle.rating}</span>
                        <span className="ml-1 text-gray-600">({vehicle.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="mr-1 h-4 w-4" />
                        {vehicle.location.city}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y py-4 md:grid-cols-4">
                  <div>
                    <div className="flex items-center text-gray-600">
                      <Settings className="mr-2 h-5 w-5" />
                      <span className="text-sm">Transmission</span>
                    </div>
                    <p className="mt-1 font-medium">{vehicle.transmission}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600">
                      <Fuel className="mr-2 h-5 w-5" />
                      <span className="text-sm">Fuel Type</span>
                    </div>
                    <p className="mt-1 font-medium">{vehicle.fuelType}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600">
                      <Users className="mr-2 h-5 w-5" />
                      <span className="text-sm">Seats</span>
                    </div>
                    <p className="mt-1 font-medium">{vehicle.seats}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="mr-2 h-5 w-5" />
                      <span className="text-sm">Year</span>
                    </div>
                    <p className="mt-1 font-medium">{vehicle.year}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="mb-3 text-xl font-semibold">Description</h2>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>

                <div className="mt-6">
                  <h2 className="mb-3 text-xl font-semibold">Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Vehicle Owner</h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                      {vehicle.owner.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{vehicle.owner.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {vehicle.owner.rating} • {vehicle.owner.totalListings} vehicles
                      </div>
                      <p className="text-sm text-gray-500">Joined {vehicle.owner.joinedDate}</p>
                    </div>
                  </div>
                  <Button variant="outline">Contact Owner</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(vehicle.dailyRate)}
                  </div>
                  <p className="text-gray-600">per day</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Pickup Date</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Return Date</label>
                    <Input type="date" />
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex justify-between text-sm">
                      <span>Daily rate × 3 days</span>
                      <span>{formatCurrency(vehicle.dailyRate * 3)}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Service fee (5%)</span>
                      <span>{formatCurrency(vehicle.dailyRate * 3 * 0.05)}</span>
                    </div>
                    <div className="mt-2 border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(vehicle.dailyRate * 3 * 1.05)}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/bookings/new?vehicleId=${vehicle.id}`}>
                      Book Now
                    </Link>
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>KYC verification required</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
