'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal, MapPin, Star, Heart, Fuel, Users, Settings } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const city = searchParams.get('city') || ''

  // Mock data - replace with actual API call
  const vehicles = [
    {
      id: '1',
      title: 'Toyota Prius 2020',
      image: '/images/vehicle-placeholder.jpg',
      dailyRate: 5500,
      location: 'Colombo',
      rating: 4.9,
      reviews: 45,
      transmission: 'Automatic',
      fuel: 'Hybrid',
      seats: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-padding mx-auto py-8">
        <h1 className="mb-6 text-3xl font-bold">
          {query || city
            ? `Search Results${query ? ` for "${query}"` : ''}${city ? ` in ${city}` : ''}`
            : 'All Vehicles'}
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[4/3] bg-gray-200">
                <img src={vehicle.image} alt={vehicle.title} className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold">{vehicle.title}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <MapPin className="mr-1 h-4 w-4" />
                  {vehicle.location}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xl font-bold text-primary">
                    {formatCurrency(vehicle.dailyRate)}<span className="text-sm font-normal">/day</span>
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/vehicles/${vehicle.id}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}
