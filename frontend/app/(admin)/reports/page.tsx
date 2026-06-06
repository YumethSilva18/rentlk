'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const reportMetrics = [
  { title: 'Monthly Revenue', value: 'Rs. 1,250,000', change: '+12.5%', trend: 'up' },
  { title: 'Total Bookings', value: '342', change: '+8.2%', trend: 'up' },
  { title: 'Commission Earned', value: 'Rs. 62,500', change: '+12.5%', trend: 'up' },
  { title: 'Refund Rate', value: '2.1%', change: '-0.5%', trend: 'down' },
]

const reportTypes = [
  { name: 'Revenue Report', description: 'Monthly revenue breakdown by category', period: 'June 2024' },
  { name: 'Booking Report', description: 'Detailed booking statistics and trends', period: 'June 2024' },
  { name: 'User Growth Report', description: 'New user registrations and activity', period: 'Q2 2024' },
  { name: 'Commission Report', description: 'Platform commission earnings summary', period: 'June 2024' },
  { name: 'Vehicle Utilization', description: 'Vehicle listing and rental statistics', period: 'June 2024' },
  { name: 'Fraud Analysis', description: 'Fraud detection and prevention metrics', period: 'June 2024' },
]

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and download platform reports.</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reportMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{metric.value}</p>
              <div className="mt-2 flex items-center text-sm">
                {metric.trend === 'up' ? (
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
                )}
                <span className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.change}
                </span>
                <span className="ml-1 text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportTypes.map((report) => (
          <Card key={report.name}>
            <CardHeader>
              <CardTitle className="text-lg">{report.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{report.description}</p>
              <p className="mt-1 text-xs text-gray-400">Period: {report.period}</p>
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="mr-1 h-4 w-4" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="mr-1 h-4 w-4" />
                  CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TODO: Add interactive charts using Recharts */}
    </div>
  )
}
