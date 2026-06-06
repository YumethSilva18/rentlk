'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Eye, Flag } from 'lucide-react'

const mockAlerts = [
  { id: 1, user: 'Amal Jayawardena', issue: 'Multiple failed payment attempts', severity: 'high', status: 'open', date: '2024-06-04', bookings: 3 },
  { id: 2, user: 'Unknown User', issue: 'Suspicious login from unusual location', severity: 'medium', status: 'open', date: '2024-06-03', bookings: 0 },
  { id: 3, user: 'Priya Fernando', issue: 'Vehicle listing with mismatched photos', severity: 'low', status: 'reviewing', date: '2024-06-02', bookings: 1 },
  { id: 4, user: 'Ruwan Silva', issue: 'Multiple account creation from same IP', severity: 'medium', status: 'open', date: '2024-06-01', bookings: 0 },
  { id: 5, user: 'Samantha Perera', issue: 'Chargeback received for booking', severity: 'high', status: 'resolved', date: '2024-05-30', bookings: 2 },
]

export default function AdminFraudAlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Alerts</h1>
          <p className="text-gray-600">Monitor and manage suspicious activities.</p>
        </div>
        <Badge variant="destructive" className="text-sm">
          {mockAlerts.filter((a) => a.status !== 'resolved').length} Active Alerts
        </Badge>
      </div>

      <div className="space-y-4">
        {mockAlerts.map((alert) => (
          <Card key={alert.id}>
            <CardContent className="flex items-start justify-between p-6">
              <div className="flex items-start space-x-4">
                <div
                  className={`mt-1 rounded-full p-2 ${
                    alert.severity === 'high'
                      ? 'bg-red-100'
                      : alert.severity === 'medium'
                      ? 'bg-yellow-100'
                      : 'bg-blue-100'
                  }`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alert.severity === 'high'
                        ? 'text-red-600'
                        : alert.severity === 'medium'
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-gray-900">{alert.issue}</h3>
                    <Badge
                      variant={
                        alert.severity === 'high' ? 'destructive' :
                        alert.severity === 'medium' ? 'warning' : 'secondary'
                      }
                    >
                      {alert.severity}
                    </Badge>
                    <Badge
                      variant={
                        alert.status === 'open' ? 'outline' :
                        alert.status === 'reviewing' ? 'warning' : 'success'
                      }
                    >
                      {alert.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    User: {alert.user} • Date: {alert.date}
                    {alert.bookings > 0 && ` • Related Bookings: ${alert.bookings}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-1 h-4 w-4" />
                  Investigate
                </Button>
                {alert.status !== 'resolved' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                    <Flag className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
