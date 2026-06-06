'use client'

import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const cancelReasons = ['Change of plans', 'Found a better price', 'Vehicle not needed anymore', 'Issues with owner', 'Personal emergency', 'Other']

interface CancelBookingDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, notes?: string) => void
  isLoading?: boolean
  className?: string
}

export function CancelBookingDialog({ isOpen, onClose, onConfirm, isLoading, className }: CancelBookingDialogProps) {
  const [reason, setReason] = React.useState('')
  const [notes, setNotes] = React.useState('')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" /> Cancel Booking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Are you sure you want to cancel? This may be subject to cancellation fees.</p>

          <div className="space-y-2">
            <Label>Reason for cancellation</Label>
            <div className="flex flex-wrap gap-2">
              {cancelReasons.map((r) => (
                <Button key={r} variant={reason === r ? 'default' : 'outline'} size="sm"
                  onClick={() => setReason(r)} className="h-8">{r}</Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional notes (optional)</Label>
            <Textarea id="notes" placeholder="Any additional details..." value={notes}
              onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Keep Booking</Button>
          <Button variant="destructive" disabled={!reason || isLoading}
            onClick={() => onConfirm(reason, notes || undefined)}>
            {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
