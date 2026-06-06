'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VehicleGalleryProps {
  images: string[]
  title?: string
  className?: string
}

export function VehicleGallery({
  images,
  title = 'Vehicle',
  className,
}: VehicleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const goTo = (index: number) => {
    setCurrentIndex((index + images.length) % images.length)
  }

  const prev = () => goTo(currentIndex - 1)
  const next = () => goTo(currentIndex + 1)

  const displayedImages = images.length > 0 ? images : ['/images/vehicle-placeholder.jpg']

  return (
    <>
      <div className={cn('space-y-3', className)}>
        {/* Main image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          <img
            src={displayedImages[currentIndex]}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />

          {displayedImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={prev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                onClick={next}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {displayedImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === currentIndex
                    ? 'w-6 bg-white'
                    : 'w-2 bg-white/60 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        {displayedImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {displayedImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  'relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                  i === currentIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent opacity-70 hover:opacity-100'
                )}
              >
                <img
                  src={img}
                  alt={`${title} - Thumbnail ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-10 w-10 rounded-full text-white hover:bg-white/20"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          <img
            src={displayedImages[currentIndex]}
            alt={`${title} - Fullscreen`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          {displayedImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full text-white hover:bg-white/20"
                onClick={prev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full text-white hover:bg-white/20"
                onClick={next}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {displayedImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      'h-2.5 rounded-full transition-all',
                      i === currentIndex
                        ? 'w-8 bg-white'
                        : 'w-2.5 bg-white/50 hover:bg-white/80'
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
