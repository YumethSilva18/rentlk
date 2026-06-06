'use client'

import React from 'react'
import { MoreHorizontal, Search, ChevronDown, Filter, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { User, Vehicle, Booking, PaymentTransaction } from '@/types'

// --- UserTable ---
interface UserTableProps {
  users: User[]
  onAction?: (action: string, userId: string) => void
  isLoading?: boolean
  className?: string
}

const kycStatusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'destructive',
  not_submitted: 'secondary',
}

export function UserTable({ users, onAction, isLoading = false, className }: UserTableProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader><CardTitle>Users</CardTitle></CardHeader>
        <CardContent className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Users</CardTitle>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-8 h-9 w-60" />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No users found</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={kycStatusVariants[user.kycStatus] || 'secondary'}>
                      {user.kycStatus?.replace('_', ' ') || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(user.joinedAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAction?.('view', user.id)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction?.('edit', user.id)}>Edit User</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => onAction?.('suspend', user.id)}>Suspend</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// --- VehicleTable ---
interface VehicleTableProps {
  vehicles: Vehicle[]
  onAction?: (action: string, vehicleId: string) => void
  isLoading?: boolean
  className?: string
}

const vehicleStatusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'default'> = {
  active: 'success',
  inactive: 'secondary',
  pending: 'warning',
  suspended: 'destructive',
  booked: 'default',
}

export function VehicleTable({ vehicles, onAction, isLoading = false, className }: VehicleTableProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader><CardTitle>Vehicles</CardTitle></CardHeader>
        <CardContent className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vehicles</CardTitle>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vehicles..." className="pl-8 h-9 w-60" />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Daily Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No vehicles found</TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vehicle.ownerId}</TableCell>
                  <TableCell><Badge variant="outline">{vehicle.type}</Badge></TableCell>
                  <TableCell>{formatCurrency(vehicle.dailyRate)}</TableCell>
                  <TableCell>
                    <Badge variant={vehicleStatusVariants[vehicle.status] || 'secondary'}>{vehicle.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onAction?.('view', vehicle.id)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction?.('approve', vehicle.id)}>Approve</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => onAction?.('suspend', vehicle.id)}>Suspend</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
