'use client'

import React from 'react'
import { Search, Filter, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatDate, formatDateTime } from '@/lib/utils'
import type { KYCApplication } from '@/types'

interface KYCReviewQueueProps {
  applications: KYCApplication[]
  onApprove?: (applicationId: string) => void
  onReject?: (applicationId: string, reason: string) => void
  onRequestResubmit?: (applicationId: string, notes: string) => void
  isLoading?: boolean
  className?: string
}

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'destructive',
  not_submitted: 'secondary',
  under_review: 'warning',
}

export function KYCReviewQueue({
  applications,
  onApprove,
  onReject,
  onRequestResubmit,
  isLoading = false,
  className,
}: KYCReviewQueueProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader><CardTitle>KYC Review Queue</CardTitle></CardHeader>
        <CardContent className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>KYC Review Queue</CardTitle>
          <Badge variant="warning">{applications.length} pending</Badge>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search applicants..." className="pl-8 h-9 w-60" />
          </div>
          <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" />Filter</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Document Type</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  No pending KYC reviews
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.userId}</TableCell>
                  <TableCell className="text-sm capitalize">
                    {app.documents[0]?.documentType?.replace('_', ' ') || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(app.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[app.status] || 'secondary'}>
                      {app.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {app.documents.length} doc{app.documents.length !== 1 ? 's' : ''}
                      {app.selfie ? ' + Selfie' : ''}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>KYC Application Review</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium mb-1">Applicant ID</p>
                                <p className="text-sm text-muted-foreground">{app.userId}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-1">Submitted</p>
                                <p className="text-sm text-muted-foreground">{formatDate(app.createdAt)}</p>
                              </div>
                            </div>
                            {app.documents.map((doc, i) => (
                              <div key={i} className="border rounded-lg p-4">
                                <p className="text-sm font-medium mb-2 capitalize">{doc.documentType.replace('_', ' ')} Document</p>
                                <div className="flex gap-4">
                                  <div className="flex-1 bg-muted rounded h-40 flex items-center justify-center text-sm text-muted-foreground">
                                    Front Image
                                  </div>
                                  {doc.backImage && (
                                    <div className="flex-1 bg-muted rounded h-40 flex items-center justify-center text-sm text-muted-foreground">
                                      Back Image
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            {app.selfie && (
                              <div className="border rounded-lg p-4">
                                <p className="text-sm font-medium mb-2">Selfie</p>
                                <div className="w-40 h-40 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                                  Selfie Image
                                </div>
                              </div>
                            )}
                            <div className="flex gap-2 justify-end pt-4 border-t">
                              <Button variant="outline" size="sm" onClick={() => onRequestResubmit?.(app.id, 'Please resubmit')}>
                                <Clock className="mr-1 h-4 w-4" /> Request Resubmit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => onReject?.(app.id, 'Documents unclear')}>
                                <XCircle className="mr-1 h-4 w-4" /> Reject
                              </Button>
                              <Button size="sm" onClick={() => onApprove?.(app.id)}>
                                <CheckCircle className="mr-1 h-4 w-4" /> Approve
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => onApprove?.(app.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onReject?.(app.id, '')}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
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
