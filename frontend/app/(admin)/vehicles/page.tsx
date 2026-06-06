'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Eye, Ban, CheckCircle, XCircle } from 'lucide-react'

const mockVehicles = [
  { id: 1, name: 'Toyota Prius 2020', owner: 'Nimal Silva', type: 'Car', price: 'Rs. 8,000/day', status: 'active', listed: '2024-03-01' },
  { id: 2, name: 'Honda Dio 2021', owner: 'Priya Fernando', type: 'Scooter', price: 'Rs. 1,500/day', status: 'active', listed: '2024-03-10' },
  { id: 3, name: 'Suzuki Alto 2019', owner: 'Kasun Perera', type: 'Car', price: 'Rs. 5,000/day', status: 'pending', listed: '2024-04-05' },
  { id: 4, name: 'Bajaj Three-Wheeler', owner: 'Amal Jayawardena', type: 'Three Wheeler', price: 'Rs. 2,500/day', status: 'suspended', listed: '2024-02-15' },
  { id: 5, name: 'Toyota Hilux 2022', owner: 'Dilani Perera', type: 'SUV', price: 'Rs. 15,000/day', status: 'active', listed: '2024-04-01' },
]

export default function AdminVehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVehicles = mockVehicles.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.owner.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-600">Manage all vehicles listed on the platform.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Vehicles ({mockVehicles.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search vehicles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Listed</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{vehicle.name}</td>
                    <td className="px-4 py-3 text-gray-600">{vehicle.owner}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{vehicle.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{vehicle.price}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          vehicle.status === 'active' ? 'success' :
                          vehicle.status === 'pending' ? 'warning' : 'destructive'
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{vehicle.listed}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
