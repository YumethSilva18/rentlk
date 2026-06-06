'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Car, Edit, Eye, Trash2, PlusCircle, ToggleLeft, ToggleRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function MyVehiclesPage() {
  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      title: 'Toyota Prius 2020',
      image: '/images/vehicle-placeholder.jpg',
      dailyRate: 5500,
      status: 'active',
      bookings: 15,
      earnings: 82500,
      rating: 4.9,
      views: 234,
    },
    {
      id: '2',
      title: 'Honda Civic 2019',
      image: '/images/vehicle-placeholder.jpg',
      dailyRate: 4500,
      status: 'inactive',
      bookings: 8,
      earnings: 36000,
      rating: 4.7,
      views: 156,
    },
  ])

  const toggleStatus = (id: string) => {
    setVehicles(vehicles.map(v => 
      v.id === id ? { ...v, status: v.status === 'active' ? 'inactive' : 'active' } : v
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Vehicles</h1>
          <p className="text-gray-600">Manage your listed vehicles</p>
        </div>
        <Button asChild>
          <Link href="/add-vehicle">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Vehicle
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{vehicles.length}</div>
            <div className="text-sm text-gray-600">Total Vehicles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{vehicles.filter(v => v.status === 'active').length}</div>
            <div className="text-sm text-gray-600">Active Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{vehicles.reduce((sum, v) => sum + v.bookings, 0)}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {formatCurrency(vehicles.reduce((sum, v) => sum + v.earnings, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles List */}
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <img
                  src={vehicle.image}
                  alt={vehicle.title}
                  className="h-32 w-full rounded-lg object-cover md:w-48"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{vehicle.title}</h3>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        {formatCurrency(vehicle.dailyRate)}<span className="text-sm font-normal text-gray-600">/day</span>
                      </p>
                    </div>
                    <Badge variant={vehicle.status === 'active' ? 'success' : 'secondary'}>
                      {vehicle.status}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Bookings</div>
                      <div className="font-semibold">{vehicle.bookings}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Earnings</div>
                      <div className="font-semibold text-success">{formatCurrency(vehicle.earnings)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Rating</div>
                      <div className="font-semibold">⭐ {vehicle.rating}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/edit-vehicle/${vehicle.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(vehicle.id)}
                    >
                      {vehicle.status === 'active' ? (
                        <>
                          <ToggleRight className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Car className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold">No Vehicles Listed</h3>
            <p className="mb-4 text-gray-600">Start earning by listing your first vehicle</p>
            <Button asChild>
              <Link href="/add-vehicle">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Your First Vehicle
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
