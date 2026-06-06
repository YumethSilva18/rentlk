'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Shield, Upload, Camera, CheckCircle2 } from 'lucide-react'

export default function KYCPage() {
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState({
    idCard: null as File | null,
    license: null as File | null,
    selfie: null as File | null,
  })

  const steps = [
    { number: 1, title: 'ID Card', icon: Upload },
    { number: 2, title: 'Driving License', icon: Upload },
    { number: 3, title: 'Selfie', icon: Camera },
    { number: 4, title: 'Review', icon: CheckCircle2 },
  ]

  return (
    <div className="w-full max-w-2xl">
      <Card className="border-0 shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">KYC Verification</CardTitle>
          <CardDescription>
            Complete verification to book and list vehicles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex justify-between">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    step >= s.number ? 'bg-primary text-white' : 'bg-gray-200'
                  }`}
                >
                  {step > s.number ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    s.number
                  )}
                </div>
                <span className="mt-2 text-xs text-gray-600">{s.title}</span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Upload ID Card</label>
                  <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setStep(2)} className="w-full">Continue</Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Upload Driving License</label>
                  <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="w-full">Back</Button>
                  <Button onClick={() => setStep(3)} className="w-full">Continue</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Take Selfie</label>
                  <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <Camera className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to open camera</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="w-full">Back</Button>
                  <Button onClick={() => setStep(4)} className="w-full">Continue</Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
                <h3 className="text-xl font-semibold">Review Your Documents</h3>
                <p className="text-gray-600">
                  Please review your uploaded documents before submitting.
                </p>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between rounded-lg border p-3">
                    <span>ID Card</span>
                    <Badge variant="success">Uploaded</Badge>
                  </div>
                  <div className="flex justify-between rounded-lg border p-3">
                    <span>Driving License</span>
                    <Badge variant="success">Uploaded</Badge>
                  </div>
                  <div className="flex justify-between rounded-lg border p-3">
                    <span>Selfie</span>
                    <Badge variant="success">Uploaded</Badge>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button variant="outline" onClick={() => setStep(3)} className="w-full">Back</Button>
                  <Button className="w-full">Submit for Review</Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
