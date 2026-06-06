'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Printer, Mail, Calendar, CreditCard } from 'lucide-react'

export default function InvoicePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
          <p className="text-gray-600">Booking #{params.id}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b pb-6">
            <div>
              <h2 className="text-xl font-bold text-primary">SL Vehicle Rental</h2>
              <p className="text-sm text-gray-500">123 Galle Road, Colombo 03</p>
              <p className="text-sm text-gray-500">info@slvehiclerental.lk</p>
              <p className="text-sm text-gray-500">+94 11 234 5678</p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold text-gray-900">INVOICE</h3>
              <p className="text-sm text-gray-500">Invoice #: INV-{params.id}</p>
              <p className="text-sm text-gray-500">Date: June 4, 2024</p>
              <p className="text-sm text-gray-500">Due: June 5, 2024</p>
            </div>
          </div>

          {/* Customer & Booking Info */}
          <div className="grid grid-cols-2 gap-8 border-b py-6">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-500">BILL TO</h4>
              <p className="font-medium text-gray-900">Kasun Perera</p>
              <p className="text-sm text-gray-500">kasun@example.com</p>
              <p className="text-sm text-gray-500">+94 77 123 4567</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-500">BOOKING DETAILS</h4>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Jun 5 - Jun 8, 2024</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">Vehicle: Toyota Prius 2020</p>
              <p className="text-sm text-gray-500">Pickup: Colombo Fort Station</p>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="py-6">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-3">Description</th>
                  <th className="py-3 text-right">Qty</th>
                  <th className="py-3 text-right">Rate</th>
                  <th className="py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 font-medium">Toyota Prius 2020 - Daily Rental</td>
                  <td className="py-3 text-right">3 days</td>
                  <td className="py-3 text-right">Rs. 8,000</td>
                  <td className="py-3 text-right font-medium">Rs. 24,000</td>
                </tr>
                <tr>
                  <td className="py-3">Basic Insurance Coverage</td>
                  <td className="py-3 text-right">1</td>
                  <td className="py-3 text-right">Rs. 1,500</td>
                  <td className="py-3 text-right">Rs. 1,500</td>
                </tr>
                <tr>
                  <td className="py-3">Platform Service Fee</td>
                  <td className="py-3 text-right">1</td>
                  <td className="py-3 text-right">Rs. 1,200</td>
                  <td className="py-3 text-right">Rs. 1,200</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t pt-6">
            <div className="ml-auto w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>Rs. 26,700</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (VAT 8%)</span>
                <span>Rs. 0 (included)</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">Rs. 26,700</span>
              </div>
              <div className="mt-4 rounded-lg bg-green-50 p-3 text-center">
                <p className="text-sm font-medium text-green-800">Paid via Credit Card</p>
                <p className="text-xs text-green-600">Transaction ID: TXN-001</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
