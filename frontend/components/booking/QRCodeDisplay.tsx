'use client'

import React from 'react'
import { QrCode, Download, Share2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QRCodeDisplayProps {
  code: string
  label?: string
  bookingId?: string
  className?: string
}

export function QRCodeDisplay({ code, label = 'Booking QR Code', bookingId, className }: QRCodeDisplayProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col items-center p-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">{label}</p>
        <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-muted">
          <QrCode className="h-12 w-12 text-muted-foreground" />
        </div>
        {bookingId && <p className="mt-3 font-mono text-sm font-bold">#{bookingId}</p>}
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Save</Button>
          <Button variant="outline" size="sm"><Share2 className="mr-2 h-4 w-4" />Share</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Show this QR code at pickup to verify your booking.</p>
      </CardContent>
    </Card>
  )
}
