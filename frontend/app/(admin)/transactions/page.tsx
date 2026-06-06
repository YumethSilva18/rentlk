'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const mockTransactions = [
  { id: 'TXN-001', booking: 'BK-2024-0892', from: 'Kasun Perera', to: 'Nimal Silva', amount: 'Rs. 24,000', type: 'booking', status: 'completed', date: '2024-06-04' },
  { id: 'TXN-002', booking: 'BK-2024-0891', from: 'Priya Fernando', to: 'Dilani Perera', amount: 'Rs. 3,000', type: 'booking', status: 'completed', date: '2024-06-03' },
  { id: 'TXN-003', booking: 'REF-001', from: 'System', to: 'Nimal Silva', amount: 'Rs. 1,200', type: 'refund', status: 'processing', date: '2024-06-02' },
  { id: 'TXN-004', booking: 'PLT-001', from: 'System', to: 'Kasun Perera', amount: 'Rs. 500', type: 'payout', status: 'completed', date: '2024-06-01' },
  { id: 'TXN-005', booking: 'BK-2024-0890', from: 'Amal Jayawardena', to: 'Kasun Perera', amount: 'Rs. 10,000', type: 'booking', status: 'failed', date: '2024-05-31' },
]

export default function AdminTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTransactions = mockTransactions.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.to.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Monitor all financial transactions.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Transactions ({mockTransactions.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search transactions..."
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
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-primary">{txn.id}</td>
                    <td className="px-4 py-3 text-gray-600">{txn.booking}</td>
                    <td className="px-4 py-3 text-gray-900">{txn.from}</td>
                    <td className="px-4 py-3 text-gray-900">{txn.to}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{txn.amount}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{txn.type}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          txn.status === 'completed' ? 'success' :
                          txn.status === 'processing' ? 'warning' : 'destructive'
                        }
                      >
                        {txn.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{txn.date}</td>
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
