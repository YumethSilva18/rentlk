'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Eye } from 'lucide-react'

const mockBookings = [
  { id: 'BK-2024-0892', customer: 'Kasun Perera', vehicle: 'Toyota Prius 2020', owner: 'Nimal Silva', dates: 'Jun 5 - Jun 8', total: 'Rs. 24,000', status: 'active' },
  { id: 'BK-2024-0891', customer: 'Priya Fernando', vehicle: 'Honda Dio 2021', owner: 'Dilani Perera', dates: 'Jun 3 - Jun 5', total: 'Rs. 3,000', status: 'completed' },
  { id: 'BK-2024-0890', customer: 'Amal Jayawardena', vehicle: 'Suzuki Alto 2019', owner: 'Kasun Perera', dates: 'Jun 1 - Jun 3', total: 'Rs. 10,000', status: 'cancelled' },
  { id: 'BK-2024-0889', customer: 'Nimal Silva', vehicle: 'Bajaj Three-Wheeler', owner: 'Amal Jayawardena', dates: 'May 28 - May 30', total: 'Rs. 5,000', status: 'completed' },
  { id: 'BK-2024-0888', customer: 'Dilani Perera', vehicle: 'Toyota Hilux 2022', owner: 'Kasun Perera', dates: 'May 25 - May 28', total: 'Rs. 45,000', status: 'pending' },
]

export default function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBookings = mockBookings.filter(
    (b) =>
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage all bookings on the platform.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Bookings ({mockBookings.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search bookings..."
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
                  <th className="px-4 py-3">Booking ID</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Dates</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-primary">{booking.id}</td>
                    <td className="px-4 py-3 text-gray-900">{booking.customer}</td>
                    <td className="px-4 py-3 text-gray-600">{booking.vehicle}</td>
                    <td className="px-4 py-3 text-gray-600">{booking.owner}</td>
                    <td className="px-4 py-3 text-gray-600">{booking.dates}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{booking.total}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          booking.status === 'active' ? 'success' :
                          booking.status === 'completed' ? 'secondary' :
                          booking.status === 'cancelled' ? 'destructive' : 'warning'
                        }
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
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
