'use client'

import React from 'react'
import { FileText, Image, Maximize2, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { KYCVerificationDocument } from '@/types'

interface KYCDocumentCardProps {
  document: KYCVerificationDocument
  onApprove?: () => void
  onReject?: () => void
  onDownload?: () => void
  isReviewing?: boolean
  className?: string
}

const documentTypeLabels: Record<string, string> = {
  id_card: 'National Identity Card',
  passport: 'Passport',
  drivers_license: "Driver's License",
  selfie: 'Selfie Photo',
}

export function KYCDocumentCard({
  document,
  onApprove,
  onReject,
  onDownload,
  isReviewing = false,
  className,
}: KYCDocumentCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-sm">
                {documentTypeLabels[document.type] || (document.type || '').replace('_', ' ')}
              </p>
              <p className="text-xs text-muted-foreground">{document.documentNumber || ''}</p>
            </div>
          </div>
          <Badge variant={document.status === 'approved' ? 'success' : document.status === 'rejected' ? 'destructive' : 'warning'}>
            {document.status?.replace('_', ' ') || 'pending'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="relative group cursor-pointer border rounded-lg overflow-hidden bg-muted">
            <div className="aspect-[3/2] flex items-center justify-center">
              <Image className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute top-1 left-1">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Front</Badge>
            </div>
          </div>
          {document.backImage ? (
            <div className="relative group cursor-pointer border rounded-lg overflow-hidden bg-muted">
              <div className="aspect-[3/2] flex items-center justify-center">
                <Image className="h-8 w-8 text-muted-foreground opacity-50" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute top-1 left-1">
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Back</Badge>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg flex items-center justify-center bg-muted/50">
              <AlertCircle className="h-5 w-5 text-muted-foreground opacity-50" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            <span>Review required</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDownload}>
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onReject} disabled={isReviewing}>
              <XCircle className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" onClick={onApprove} disabled={isReviewing}>
              <CheckCircle className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
