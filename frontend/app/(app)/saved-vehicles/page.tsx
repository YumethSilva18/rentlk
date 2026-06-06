'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Car, MapPin, Star, Trash2 } from 'lucide-react'
import Link from 'next/link'

const mockSavedVehicles = [
  { id: 1, name: 'Toyota Prius 2020', type: 'Car', price: 'Rs. 8,000/day', location: 'Colombo', rating: 4.5, image: null },
  { id: 2, name: 'Honda Dio 2021', type: 'Scooter', price: 'Rs. 1,500/day', location: 'Kandy', rating: 4.8, image: null },
  { id: 3, name: 'Suzuki Alto 2019', type: 'Car', price: 'Rs. 5,000/day', location: 'Galle', rating: 4.2, image: null },
  { id: 4, name: 'Toyota Hilux 2022', type: 'SUV', price: 'Rs. 15,000/day', location: 'Colombo', rating: 4.9, image: null },
]

export default function SavedVehiclesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Vehicles</h1>
        <p className="text-gray-600">Vehicles you have saved for later.</p>
      </div>

      {mockSavedVehicles.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <Heart className="mb-4 h-16 w-16 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600">No saved vehicles</h3>
          <p className="mb-4 text-sm text-gray-500">Browse vehicles and save your favorites.</p>
          <Button asChild>
            <Link href="/search">Browse Vehicles</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockSavedVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="group overflow-hidden">
              <div className="relative">
                <div className="flex h-48 items-center justify-center bg-gray-100">
                  <Car className="h-16 w-16 text-gray-400" />
                </div>
                <button className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm hover:bg-red-50">
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                  <Badge variant="outline">{vehicle.type}</Badge>
                </div>
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>{vehicle.location}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{vehicle.price}</span>
                  <div className="flex items-center text-sm">
                    <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{vehicle.rating}</span>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link href={`/vehicles/${vehicle.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline" size="icon" className="h-9 w-9 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
