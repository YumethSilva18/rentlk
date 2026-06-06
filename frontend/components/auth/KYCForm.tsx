'use client'

import React, { useState } from 'react'
import {
  Upload,
  FileText,
  IdCard,
  Camera,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface KYCFormProps {
  onSubmit: (data: { idCard: File | null; driversLicense: File | null; selfie: File | null }) => void
  isLoading?: boolean
  kycStatus?: string
  className?: string
}

type DocType = 'idCard' | 'driversLicense' | 'selfie'

interface DocState {
  file: File | null
  preview: string | null
}

export function KYCForm({
  onSubmit,
  isLoading = false,
  kycStatus = 'not_started',
  className,
}: KYCFormProps) {
  const [docs, setDocs] = useState<Record<DocType, DocState>>({
    idCard: { file: null, preview: null },
    driversLicense: { file: null, preview: null },
    selfie: { file: null, preview: null },
  })

  const handleFileSelect = (type: DocType, file: File | null) => {
    if (!file) return
    const preview = URL.createObjectURL(file)
    setDocs((prev) => ({
      ...prev,
      [type]: { file, preview },
    }))
  }

  const handleRemove = (type: DocType) => {
    setDocs((prev) => ({
      ...prev,
      [type]: { file: null, preview: null },
    }))
  }

  const handleSubmit = () => {
    onSubmit({
      idCard: docs.idCard.file,
      driversLicense: docs.driversLicense.file,
      selfie: docs.selfie.file,
    })
  }

  const uploadedCount = Object.values(docs).filter((d) => d.file).length
  const progress = (uploadedCount / 3) * 100
  const isComplete = uploadedCount === 3

  const docConfigs: { type: DocType; label: string; icon: React.ElementType; description: string }[] = [
    {
      type: 'idCard',
      label: 'ID Card / Passport',
      icon: IdCard,
      description: 'Front side of your national ID or passport',
    },
    {
      type: 'driversLicense',
      label: 'Driving License',
      icon: FileText,
      description: 'Both sides of your valid driving license',
    },
    {
      type: 'selfie',
      label: 'Selfie with ID',
      icon: Camera,
      description: 'A clear photo of you holding your ID card',
    },
  ]

  if (kycStatus === 'approved') {
    return (
      <Card className={cn('border-success/30', className)}>
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h3 className="mt-3 text-lg font-semibold">KYC Verified</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your identity has been verified. You can now list vehicles and make bookings.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (kycStatus === 'pending' || kycStatus === 'in_review') {
    return (
      <Card className={cn('border-warning/30', className)}>
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
            <AlertCircle className="h-8 w-8 text-warning" />
          </div>
          <h3 className="mt-3 text-lg font-semibold">KYC Under Review</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your documents are being reviewed. This usually takes 24-48 hours.
          </p>
          <Progress value={60} className="mt-4" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-lg font-semibold">Identity Verification (KYC)</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload the following documents to verify your identity. All documents are required.
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span>Progress</span>
          <span>{uploadedCount}/3 documents</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-3">
        {docConfigs.map((config) => {
          const doc = docs[config.type]
          const Icon = config.icon

          return (
            <Card key={config.type} className="overflow-hidden">
              <CardContent className="p-4">
                {doc.file ? (
                  <div className="flex items-center gap-3">
                    {doc.preview && (
                      <img
                        src={doc.preview}
                        alt={config.label}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{doc.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(doc.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Badge variant="success" className="shrink-0">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Uploaded
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(config.type)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{config.label}</p>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileSelect(config.type, e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full"
        disabled={!isComplete || isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit for Verification'}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Your documents are encrypted and stored securely. We use them only for identity
        verification purposes.
      </p>
    </div>
  )
}
