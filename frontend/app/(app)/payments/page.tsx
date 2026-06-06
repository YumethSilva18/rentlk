'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Plus, Trash2, CheckCircle } from 'lucide-react'

const mockPaymentMethods = [
  { id: 1, type: 'visa', last4: '4242', expiry: '12/2025', isDefault: true },
  { id: 2, type: 'mastercard', last4: '8888', expiry: '08/2026', isDefault: false },
]

export default function PaymentsPage() {
  const [methods] = useState(mockPaymentMethods)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
        <p className="text-gray-600">Manage your saved payment methods.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {methods.map((method) => (
          <Card key={method.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle className="text-lg capitalize">{method.type}</CardTitle>
                  <p className="text-sm text-gray-500">**** **** **** {method.last4}</p>
                </div>
              </div>
              {method.isDefault && (
                <Badge variant="success">Default</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expires: {method.expiry}</span>
                <div className="flex space-x-2">
                  {!method.isDefault && (
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Set Default
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Card */}
        <Card className="flex items-center justify-center border-2 border-dashed p-6">
          <Button variant="outline" className="h-full w-full py-12">
            <Plus className="mr-2 h-6 w-6" />
            Add Payment Method
          </Button>
        </Card>
      </div>
    </div>
  )
}
