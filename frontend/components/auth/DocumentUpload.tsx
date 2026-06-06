'use client'

import React, { useState } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface DocumentUploadProps {
  accept?: string
  maxSizeMB?: number
  maxFiles?: number
  label?: string
  description?: string
  onUpload: (files: File[]) => void
  onRemove?: (index: number) => void
  isLoading?: boolean
  className?: string
}

interface FileWithPreview {
  file: File
  preview: string
  progress: number
  status: 'uploading' | 'done' | 'error'
  error?: string
}

export function DocumentUpload({
  accept = 'image/*,.pdf',
  maxSizeMB = 10,
  maxFiles = 5,
  label = 'Upload Documents',
  description = 'Drag & drop or click to browse',
  onUpload,
  onRemove,
  isLoading = false,
  className,
}: DocumentUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles: FileWithPreview[] = []

    fileArray.forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        validFiles.push({
          file,
          preview: '',
          progress: 0,
          status: 'error',
          error: `File exceeds ${maxSizeMB}MB limit`,
        })
        return
      }

      const preview = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : ''

      validFiles.push({
        file,
        preview,
        progress: 0,
        status: 'done',
      })
    })

    const updated = [...files, ...validFiles].slice(0, maxFiles)
    setFiles(updated)
    onUpload(updated.filter((f) => f.status !== 'error').map((f) => f.file))
  }

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onUpload(updated.filter((f) => f.status !== 'error').map((f) => f.file))
    onRemove?.(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div
        className={cn(
          'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          isLoading && 'pointer-events-none opacity-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-3 font-medium">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Max {maxFiles} files, up to {maxSizeMB}MB each
        </p>

        <label className="mt-4">
          <Button type="button" variant="outline" disabled={isLoading} asChild>
            <span>Browse Files</span>
          </Button>
          <input
            type="file"
            accept={accept}
            multiple={maxFiles > 1}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item, index) => (
            <Card key={index}>
              <CardContent className="flex items-center gap-3 p-3">
                {item.preview ? (
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(item.file.size / 1024).toFixed(1)} KB
                  </p>

                  {item.status === 'uploading' && (
                    <Progress value={item.progress} className="mt-1 h-1" />
                  )}

                  {item.status === 'error' && (
                    <p className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      {item.error}
                    </p>
                  )}
                </div>

                {item.status === 'done' && (
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
