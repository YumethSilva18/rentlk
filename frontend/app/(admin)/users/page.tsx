'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, MoreHorizontal, Eye, Ban, CheckCircle } from 'lucide-react'

const mockUsers = [
  { id: 1, name: 'Kasun Perera', email: 'kasun@example.com', role: 'Renter', status: 'active', kyc: 'approved', joined: '2024-01-15' },
  { id: 2, name: 'Nimal Silva', email: 'nimal@example.com', role: 'Owner', status: 'active', kyc: 'approved', joined: '2024-02-20' },
  { id: 3, name: 'Priya Fernando', email: 'priya@example.com', role: 'Both', status: 'active', kyc: 'pending', joined: '2024-03-10' },
  { id: 4, name: 'Amal Jayawardena', email: 'amal@example.com', role: 'Renter', status: 'suspended', kyc: 'rejected', joined: '2024-03-15' },
  { id: 5, name: 'Dilani Perera', email: 'dilani@example.com', role: 'Owner', status: 'active', kyc: 'approved', joined: '2024-04-01' },
]

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage all platform users.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users ({mockUsers.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
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
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">KYC</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          user.kyc === 'approved' ? 'success' : user.kyc === 'pending' ? 'warning' : 'destructive'
                        }
                      >
                        {user.kyc}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Ban className="h-4 w-4" />
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
