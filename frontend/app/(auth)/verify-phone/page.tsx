'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Smartphone } from 'lucide-react'

export default function VerifyPhonePage() {
  const [code, setCode] = useState(['', '', '', '', '', ''])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Verification code:', code.join(''))
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  return (
    <Card className="border-0 shadow-2xl">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Phone</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to +94 71 234 5678
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="h-14 w-12 text-center text-xl font-semibold"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                required
              />
            ))}
          </div>

          <Button type="submit" className="w-full" size="lg">
            Verify Phone Number
          </Button>

          <div className="text-center">
            <button type="button" className="text-sm text-primary hover:underline">
              Resend code
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
