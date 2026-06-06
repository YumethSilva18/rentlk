'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Camera, RefreshCw, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SelfieCaptureProps {
  onCapture: (file: File) => void
  onRetake?: () => void
  className?: string
}

export function SelfieCapture({
  onCapture,
  onRetake,
  className,
}: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsCameraOn(true)
    } catch {
      setError(
        'Unable to access camera. Please ensure camera permissions are granted.'
      )
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsCameraOn(false)
  }, [])

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(dataUrl)

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
        onCapture(file)
      }
    }, 'image/jpeg')

    stopCamera()
  }, [onCapture, stopCamera])

  const handleRetake = () => {
    setCapturedImage(null)
    startCamera()
    onRetake?.()
  }

  React.useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center">
        <h3 className="text-lg font-semibold">Take a Selfie</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Please ensure your face is clearly visible and well-lit.
        </p>
      </div>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 text-center text-sm text-destructive">
            {error}
          </CardContent>
        </Card>
      )}

      <div className="relative overflow-hidden rounded-xl bg-black">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured selfie"
            className="w-full object-cover"
            style={{ maxHeight: '400px' }}
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full"
              style={{ maxHeight: '400px', transform: 'scaleX(-1)' }}
            />
            {!isCameraOn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                <Camera className="h-12 w-12 text-white/60" />
                <p className="mt-2 text-sm text-white/60">Camera is off</p>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex justify-center gap-3">
        {capturedImage ? (
          <>
            <Button variant="outline" onClick={handleRetake}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button variant="success" disabled>
              <CheckCircle className="mr-2 h-4 w-4" />
              Captured
            </Button>
          </>
        ) : isCameraOn ? (
          <>
            <Button variant="outline" onClick={stopCamera}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleCapture}>
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          </>
        ) : (
          <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        )}
      </div>

      <ul className="space-y-1 text-xs text-muted-foreground">
        <li>• Make sure your face is clearly visible</li>
        <li>• Remove sunglasses or hats</li>
        <li>• Use good lighting without shadows on your face</li>
        <li>• Hold your ID card next to your face if required</li>
      </ul>
    </div>
  )
}
