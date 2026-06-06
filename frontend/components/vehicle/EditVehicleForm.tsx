'use client'

import React from 'react'
import { VehicleForm } from './VehicleForm'
import { VehicleImagesUploader } from './VehicleImagesUploader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/types'

interface EditVehicleFormProps {
  vehicle: Vehicle
  onSubmit: (data: any) => void
  onImagesChange: (files: File[]) => void
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export function EditVehicleForm({ vehicle, onSubmit, onImagesChange, onCancel, isLoading, className }: EditVehicleFormProps) {
  const defaultValues = {
    title: vehicle.title,
    description: vehicle.description,
    type: vehicle.type,
    brand: vehicle.brand,
    model: vehicle.model,
    year: String(vehicle.year),
    transmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    seats: String(vehicle.seats),
    dailyRate: String(vehicle.dailyRate),
    city: vehicle.location.city,
    address: vehicle.location.address,
    licensePlate: vehicle.licensePlate,
    features: vehicle.features.join(', '),
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3">
        <Link href="/my-vehicles">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">Edit Vehicle: {vehicle.title}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Images</CardTitle>
        </CardHeader>
        <CardContent>
          <VehicleImagesUploader
            images={vehicle.images}
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
          <VehicleForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            defaultValues={defaultValues}
          />
        </CardContent>
      </Card>
    </div>
  )
}
