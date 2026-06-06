'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Smartphone, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface PhoneVerificationFormProps {
  phone: string
  onVerify: (code: string) => void
  onResendCode: () => void
  onBack?: () => void
  isLoading?: boolean
  isSuccess?: boolean
  className?: string
}

export function PhoneVerificationForm({
  phone,
  onVerify,
  onResendCode,
  onBack,
  isLoading = false,
  isSuccess = false,
  className,
}: PhoneVerificationFormProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    const fullCode = newCode.join('')
    if (fullCode.length === 6) {
      onVerify(fullCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const newCode = pasted.split('')
      setCode(newCode)
      onVerify(pasted)
    }
  }

  const handleResend = () => {
    onResendCode()
    setCountdown(60)
  }

  if (isSuccess) {
    return (
      <div className={cn('space-y-4 text-center', className)}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Phone Verified</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your phone number has been successfully verified.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Smartphone className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-2 text-lg font-semibold">Verify Your Phone</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          We sent a 6-digit code to{' '}
          <span className="font-medium text-foreground">{phone}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isLoading}
            className="h-14 w-12 text-center text-xl font-semibold"
          />
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?{' '}
          {countdown > 0 ? (
            <span className="text-muted-foreground">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-medium text-primary hover:underline"
              disabled={isLoading}
            >
              <RefreshCw className="mr-1 inline h-3 w-3" />
              Resend Code
            </button>
          )}
        </p>
      </div>

      {onBack && (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Change Phone Number
        </Button>
      )}
    </div>
  )
}
