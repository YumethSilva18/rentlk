'use client'

import React from 'react'
import { VehicleForm } from './VehicleForm'
import { VehicleImagesUploader } from './VehicleImagesUploader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AddVehicleFormProps {
  onSubmit: (data: any) => void
  onImagesChange: (files: File[]) => void
  isLoading?: boolean
  className?: string
}

export function AddVehicleForm({ onSubmit, onImagesChange, isLoading, className }: AddVehicleFormProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Images</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleImagesUploader
            images={[]}
            onAdd={(files) => onImagesChange(files)}
            onRemove={() => {}}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleForm onSubmit={onSubmit} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
