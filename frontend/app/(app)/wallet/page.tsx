'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react'

const mockTransactions = [
  { id: 1, type: 'credit', description: 'Deposit to wallet', amount: 'Rs. 5,000', date: '2024-06-04', status: 'completed' },
  { id: 2, type: 'debit', description: 'Booking #BK-2024-0892', amount: 'Rs. 24,000', date: '2024-06-03', status: 'completed' },
  { id: 3, type: 'credit', description: 'Refund from Booking #BK-2024-0888', amount: 'Rs. 2,000', date: '2024-06-01', status: 'completed' },
  { id: 4, type: 'credit', description: 'Referral bonus', amount: 'Rs. 500', date: '2024-05-28', status: 'completed' },
]

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600">Manage your wallet balance and transactions.</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-primary text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Available Balance</p>
              <p className="mt-1 text-4xl font-bold">Rs. 12,500</p>
              <p className="mt-1 text-sm text-white/70">Last updated: Today</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
              <Wallet className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <Button variant="secondary" className="flex-1" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Add Money
            </Button>
            <Button variant="secondary" className="flex-1" size="lg">
              <ArrowUpRight className="mr-2 h-5 w-5" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-full p-2 ${
                    txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {txn.type === 'credit' ? (
                      <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{txn.description}</p>
                    <p className="text-xs text-gray-500">{txn.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {txn.type === 'credit' ? '+' : '-'}{txn.amount}
                  </p>
                  <Badge variant="success" className="text-xs">{txn.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
