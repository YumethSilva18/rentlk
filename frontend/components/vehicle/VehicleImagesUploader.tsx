'use client'

import React, { useState } from 'react'
import { Upload, X, Move, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface VehicleImagesUploaderProps {
  images: (string | File)[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  maxImages?: number
  className?: string
}

export function VehicleImagesUploader({
  images,
  onAdd,
  onRemove,
  maxImages = 10,
  className,
}: VehicleImagesUploaderProps) {
  const [previews, setPreviews] = useState<string[]>(
    images.map((img) => (typeof img === 'string' ? img : URL.createObjectURL(img)))
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    onAdd(files)
    const newPreviews = files.map((f) => URL.createObjectURL(f))
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, maxImages))
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {previews.map((src, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border">
            <img src={src} alt={`Vehicle ${i + 1}`} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/0 transition-colors group-hover:bg-black/40">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100">
                <Move className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100"
                onClick={() => { onRemove(i); setPreviews((p) => p.filter((_, idx) => idx !== i)) }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {i === 0 && (
              <div className="absolute left-2 top-2 rounded bg-primary px-1.5 py-0.5 text-xs text-white">Cover</div>
            )}
          </div>
        ))}

        {previews.length < maxImages && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
            <Plus className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Add Image</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
          </label>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Upload up to {maxImages} images. First image will be the cover. Supported: JPG, PNG, WebP.
      </p>
    </div>
  )
}
