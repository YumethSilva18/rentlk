'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Upload, X } from 'lucide-react'
import { VEHICLE_TYPES, TRANSMISSION_TYPES, FUEL_TYPES, SRI_LANKAN_CITIES, VEHICLE_FEATURES } from '@/lib/constants'

export default function AddVehiclePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    transmission: '',
    fuelType: '',
    seats: 5,
    dailyRate: '',
    city: '',
    address: '',
    licensePlate: '',
    insuranceExpiry: '',
    features: [] as string[],
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const toggleFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.includes(feature)
        ? formData.features.filter(f => f !== feature)
        : [...formData.features, feature]
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Vehicle data:', formData, images)
    // TODO: Submit to API
    router.push('/my-vehicles')
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">List Your Vehicle</h1>
        <p className="text-gray-600">Fill in the details to list your vehicle for rent</p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between">
        {['Basic Info', 'Specifications', 'Photos', 'Location & Pricing'].map((s, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= i + 1 ? 'bg-primary text-white' : 'bg-gray-200'
            }`}>
              {i + 1}
            </div>
            <span className="mt-2 text-xs text-center">{s}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Vehicle Title</label>
                <Input
                  placeholder="e.g., Toyota Prius 2020 - Premium Hybrid"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  className="w-full rounded-lg border p-3"
                  rows={4}
                  placeholder="Describe your vehicle, its condition, and any special features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Brand</label>
                  <Input
                    placeholder="Toyota"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Model</label>
                  <Input
                    placeholder="Prius"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    min="2000"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Vehicle Type</label>
                  <select
                    className="w-full rounded-lg border p-2.5"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="">Select type</option>
                    {VEHICLE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="button" onClick={() => setStep(2)} className="w-full">
                Continue to Specifications
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Specifications */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Transmission</label>
                  <select
                    className="w-full rounded-lg border p-2.5"
                    value={formData.transmission}
                    onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                    required
                  >
                    <option value="">Select</option>
                    {TRANSMISSION_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Fuel Type</label>
                  <select
                    className="w-full rounded-lg border p-2.5"
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    required
                  >
                    <option value="">Select</option>
                    {FUEL_TYPES.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Seats</label>
                  <Input
                    type="number"
                    min="2"
                    max="50"
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Features</label>
                <div className="flex flex-wrap gap-2">
                  {VEHICLE_FEATURES.map(feature => (
                    <Badge
                      key={feature.value}
                      variant={formData.features.includes(feature.value) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleFeature(feature.value)}
                    >
                      {feature.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full">
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(3)} className="w-full">
                  Continue to Photos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Photos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border-2 border-dashed p-8 text-center">
                <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="mb-2 text-sm text-gray-600">Upload at least 5 photos of your vehicle</p>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="mx-auto max-w-xs"
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Vehicle ${idx + 1}`}
                        className="h-full w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-full">
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-full"
                  disabled={images.length < 3}
                >
                  Continue to Pricing
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Location & Pricing */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Location & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">City</label>
                  <select
                    className="w-full rounded-lg border p-2.5"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  >
                    <option value="">Select city</option>
                    {SRI_LANKAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Daily Rate (LKR)</label>
                  <Input
                    type="number"
                    min="500"
                    placeholder="5000"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Address</label>
                <Input
                  placeholder="Enter pickup location address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">License Plate</label>
                  <Input
                    placeholder="ABC-1234"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Insurance Expiry</label>
                  <Input
                    type="date"
                    value={formData.insuranceExpiry}
                    onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(3)} className="w-full">
                  Back
                </Button>
                <Button type="submit" className="w-full">
                  List Vehicle
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}
