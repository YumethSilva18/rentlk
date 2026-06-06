'use client'

import React from 'react'
import { MoreHorizontal, Search, Filter, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Booking, PaymentTransaction } from '@/types'

// --- BookingTable ---
interface BookingTableProps {
  bookings: Booking[]
  onAction?: (action: string, bookingId: string) => void
  isLoading?: boolean
  className?: string
}

const bookingStatusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary' | 'default'> = {
  pending: 'warning', confirmed: 'default', active: 'success', completed: 'secondary', cancelled: 'destructive',
}

export function BookingTable({ bookings, onAction, isLoading = false, className }: BookingTableProps) {
  if (isLoading) {
    return (
      <Card className={className}><CardHeader><CardTitle>Bookings</CardTitle></CardHeader>
        <CardContent className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-10 bg-muted rounded" />))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bookings</CardTitle>
        <div className="flex gap-2">
          <div className="relative"><Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search bookings..." className="pl-8 h-9 w-60" />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Booking ID</TableHead><TableHead>Vehicle</TableHead><TableHead>Renter</TableHead><TableHead>Dates</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No bookings found</TableCell></TableRow>
            ) : bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.id.slice(0, 8)}</TableCell>
                <TableCell className="font-medium">{b.vehicleTitle}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{b.renterName}</TableCell>
                <TableCell className="text-sm">{formatDate(b.startDate)} - {formatDate(b.endDate)}</TableCell>
                <TableCell>{formatCurrency(b.total)}</TableCell>
                <TableCell><Badge variant={bookingStatusVariants[b.status] || 'secondary'}>{b.status}</Badge></TableCell>
                <TableCell>
                  <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onAction?.('view', b.id)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onAction?.('cancel', b.id)}>Cancel Booking</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// --- TransactionTable ---
interface TransactionTableProps {
  transactions: PaymentTransaction[]
  onAction?: (action: string, txId: string) => void
  isLoading?: boolean
  className?: string
}

const txStatusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  pending: 'warning', processing: 'default', completed: 'success', failed: 'destructive', refunded: 'secondary',
}

export function TransactionTable({ transactions, onAction, isLoading = false, className }: TransactionTableProps) {
  if (isLoading) {
    return (
      <Card className={className}><CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
        <CardContent className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-10 bg-muted rounded" />))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transactions</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" />Export</Button>
          <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Transaction ID</TableHead><TableHead>Booking ID</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No transactions found</TableCell></TableRow>
            ) : transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell className="font-mono text-xs">{tx.id.slice(0, 12)}</TableCell>
                <TableCell className="font-mono text-xs">{tx.bookingId.slice(0, 8)}</TableCell>
                <TableCell className="font-semibold">{formatCurrency(tx.amount)}</TableCell>
                <TableCell><Badge variant="outline">{tx.method}</Badge></TableCell>
                <TableCell><Badge variant={txStatusVariants[tx.status] || 'secondary'}>{tx.status}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(tx.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
