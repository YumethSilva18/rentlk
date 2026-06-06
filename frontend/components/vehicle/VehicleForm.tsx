'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Car, MapPin, DollarSign, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

const vehicleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.string().min(1, 'Select a vehicle type'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(4, 'Year is required'),
  transmission: z.string().min(1, 'Select transmission'),
  fuelType: z.string().min(1, 'Select fuel type'),
  seats: z.string().min(1, 'Number of seats is required'),
  dailyRate: z.string().min(1, 'Daily rate is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  licensePlate: z.string().min(2, 'License plate is required'),
  features: z.string().optional(),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void
  isLoading?: boolean
  defaultValues?: Partial<VehicleFormData>
  className?: string
}

export function VehicleForm({ onSubmit, isLoading = false, defaultValues, className }: VehicleFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      title: '', description: '', type: '', brand: '', model: '', year: '',
      transmission: '', fuelType: '', seats: '', dailyRate: '', city: '',
      address: '', licensePlate: '', features: '',
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Vehicle Title</Label>
          <Input id="title" placeholder="e.g. Toyota Prius 2020" disabled={isLoading} {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Vehicle Type</Label>
          <Controller name="type" control={control} render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="tuk-tuk">Tuk Tuk</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
              </SelectContent>
            </Select>
          )} />
          {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" placeholder="e.g. Toyota" disabled={isLoading} {...register('brand')} />
          {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" placeholder="e.g. Prius" disabled={isLoading} {...register('model')} />
          {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" placeholder="e.g. 2020" disabled={isLoading} {...register('year')} />
          {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="seats">Seats</Label>
          <Controller name="seats" control={control} render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder="Select seats" /></SelectTrigger>
              <SelectContent>
                {[2, 4, 5, 7, 8, 9, 12, 15].map(n => (
                  <SelectItem key={n} value={String(n)}>{n} seats</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} />
          {errors.seats && <p className="text-sm text-destructive">{errors.seats.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Controller name="transmission" control={control} render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Controller name="fuelType" control={control} render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dailyRate">Daily Rate (LKR)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="dailyRate" type="number" placeholder="5000" className="pl-10" disabled={isLoading} {...register('dailyRate')} />
          </div>
          {errors.dailyRate && <p className="text-sm text-destructive">{errors.dailyRate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate">License Plate</Label>
          <Input id="licensePlate" placeholder="e.g. WP CAA-1234" disabled={isLoading} {...register('licensePlate')} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Controller name="city" control={control} render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isLoading}>
              <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Colombo">Colombo</SelectItem>
                <SelectItem value="Kandy">Kandy</SelectItem>
                <SelectItem value="Galle">Galle</SelectItem>
                <SelectItem value="Jaffna">Jaffna</SelectItem>
                <SelectItem value="Negombo">Negombo</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" placeholder="Street address" disabled={isLoading} {...register('address')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Describe your vehicle..." rows={4} disabled={isLoading} {...register('description')} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Input id="features" placeholder="AC, GPS, Bluetooth, Sunroof" disabled={isLoading} {...register('features')} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Vehicle'}
      </Button>
    </form>
  )
}
