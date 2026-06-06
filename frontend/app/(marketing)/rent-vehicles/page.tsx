'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Star, 
  Heart,
  Fuel,
  Users,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import { VEHICLE_TYPES, SRI_LANKAN_CITIES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'

// Mock data - Replace with actual API call
const mockVehicles = [
  {
    id: '1',
    title: 'Toyota Prius 2020 - Hybrid',
    type: 'car',
    image: '/images/vehicle-placeholder.jpg',
    dailyRate: 5500,
    location: 'Colombo',
    rating: 4.9,
    totalReviews: 45,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    seats: 5,
    owner: 'Kasun Perera',
    features: ['AC', 'GPS', 'Bluetooth'],
  },
  {
    id: '2',
    title: 'Honda Civic 2019',
    type: 'car',
    image: '/images/vehicle-placeholder.jpg',
    dailyRate: 4500,
    location: 'Kandy',
    rating: 4.8,
    totalReviews: 32,
    transmission: 'Manual',
    fuelType: 'Petrol',
    seats: 5,
    owner: 'Nimal Silva',
    features: ['AC', 'USB'],
  },
  {
    id: '3',
    title: 'Toyota Hiace Van 2021',
    type: 'van',
    image: '/images/vehicle-placeholder.jpg',
    dailyRate: 8500,
    location: 'Galle',
    rating: 5.0,
    totalReviews: 28,
    transmission: 'Manual',
    fuelType: 'Diesel',
    seats: 12,
    owner: 'Amila Fernando',
    features: ['AC', 'GPS', 'Bluetooth', 'USB'],
  },
]

export default function RentVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary py-12 text-white">
        <div className="container-padding mx-auto">
          <h1 className="mb-4 text-4xl font-bold">Rent Vehicles</h1>
          <p className="mb-8 text-lg text-gray-100">
            Find the perfect vehicle for your journey across Sri Lanka
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by vehicle name, brand, or type..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="md:w-auto">
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-padding mx-auto py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card>
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedCity('all')
                    setSelectedType('all')
                  }}>
                    Clear All
                  </Button>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <h3 className="mb-3 font-medium">Location</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="city"
                        value="all"
                        checked={selectedCity === 'all'}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="mr-2"
                      />
                      All Cities
                    </label>
                    {SRI_LANKAN_CITIES.slice(0, 8).map((city) => (
                      <label key={city} className="flex items-center">
                        <input
                          type="radio"
                          name="city"
                          value={city}
                          checked={selectedCity === city}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="mr-2"
                        />
                        {city}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Vehicle Type Filter */}
                <div className="mb-6">
                  <h3 className="mb-3 font-medium">Vehicle Type</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="all"
                        checked={selectedType === 'all'}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="mr-2"
                      />
                      All Types
                    </label>
                    {VEHICLE_TYPES.map((type) => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value={type.value}
                          checked={selectedType === type.value}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="mr-2"
                        />
                        {type.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="mb-3 font-medium">Price Range (per day)</h3>
                  <div className="space-y-3">
                    <Input type="number" placeholder="Min" />
                    <Input type="number" placeholder="Max" />
                  </div>
                </div>

                {/* Transmission */}
                <div className="mb-6">
                  <h3 className="mb-3 font-medium">Transmission</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Automatic
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Manual
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Vehicle List */}
          <div className="mt-6 lg:col-span-3 lg:mt-0">
            {/* Mobile Filter Toggle */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <p className="text-sm text-gray-600">{mockVehicles.length} vehicles available</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Results Header */}
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <p className="text-gray-600">{mockVehicles.length} vehicles available</p>
              <select className="rounded-lg border px-4 py-2">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Highest Rated</option>
              </select>
            </div>

            {/* Vehicle Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {mockVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                    <img
                      src={vehicle.image}
                      alt={vehicle.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <button className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-red-50">
                      <Heart className="h-5 w-5 text-gray-600 hover:fill-red-500 hover:text-red-500" />
                    </button>
                    <Badge className="absolute left-3 top-3 bg-primary">
                      {vehicle.type}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {vehicle.title}
                      </h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{vehicle.rating}</span>
                      </div>
                    </div>

                    <div className="mb-3 flex items-center text-sm text-gray-600">
                      <MapPin className="mr-1 h-4 w-4" />
                      {vehicle.location}
                    </div>

                    <div className="mb-3 flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Settings className="mr-1 h-3 w-3" />
                        {vehicle.transmission}
                      </div>
                      <div className="flex items-center">
                        <Fuel className="mr-1 h-3 w-3" />
                        {vehicle.fuelType}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {vehicle.seats} seats
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t pt-3">
                      <div>
                        <p className="text-sm text-gray-600">From</p>
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(vehicle.dailyRate)}
                          <span className="text-sm font-normal text-gray-600">/day</span>
                        </p>
                      </div>
                      <Button asChild>
                        <Link href={`/vehicles/${vehicle.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <Button variant="outline" disabled>Previous</Button>
                <Button variant="outline" className="bg-primary text-white">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-primary py-12 text-white">
        <div className="container-padding mx-auto text-center">
          <h2 className="mb-4 text-2xl font-bold">Have a Vehicle to Rent Out?</h2>
          <p className="mb-6 text-gray-100">
            List your vehicle and start earning today
          </p>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/list-own-vehicles">List Your Vehicle</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
