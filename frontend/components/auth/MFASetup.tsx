'use client'

import React, { useState } from 'react'
import { Shield, Smartphone, Key, CheckCircle, Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface MFASetupProps {
  isEnabled?: boolean
  onToggle: (enabled: boolean) => void
  onVerifyCode: (code: string) => void
  isLoading?: boolean
  className?: string
}

export function MFASetup({
  isEnabled = false,
  onToggle,
  onVerifyCode,
  isLoading = false,
  className,
}: MFASetupProps) {
  const [showSetup, setShowSetup] = useState(false)
  const [code, setCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([
    'XXXX-XXXX-XXXX',
    'XXXX-XXXX-XXXX',
    'XXXX-XXXX-XXXX',
    'XXXX-XXXX-XXXX',
    'XXXX-XXXX-XXXX',
  ])
  const [codesRevealed, setCodesRevealed] = useState(false)
  const [codesCopied, setCodesCopied] = useState(false)

  const handleToggle = (checked: boolean) => {
    if (checked) {
      setShowSetup(true)
    } else {
      onToggle(false)
    }
  }

  const handleVerify = () => {
    if (code.length === 6) {
      onVerifyCode(code)
      // Simulated: generate backup codes
      setBackupCodes(
        Array.from({ length: 5 }, () =>
          Array.from({ length: 4 }, () =>
            Math.random().toString(36).substring(2, 6).toUpperCase()
          ).join('-')
        )
      )
      setCodesRevealed(true)
    }
  }

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'))
    setCodesCopied(true)
    setTimeout(() => setCodesCopied(false), 3000)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <Switch checked={isEnabled} onCheckedChange={handleToggle} disabled={isLoading} />
          </div>

          {isEnabled && (
            <Badge variant="success" className="mt-3">
              <CheckCircle className="mr-1 h-3 w-3" />
              Enabled
            </Badge>
          )}
        </CardContent>
      </Card>

      {showSetup && !isEnabled && (
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-3 text-lg font-semibold">Set Up Authenticator App</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Scan the QR code with your authenticator app (Google Authenticator,
                Authy, etc.) and enter the 6-digit code below.
              </p>
            </div>

            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl bg-muted">
              <Key className="h-12 w-12 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mfaCode">Verification Code</Label>
              <Input
                id="mfaCode"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-[0.5em]"
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={code.length !== 6 || isLoading}
            >
              Verify & Enable
            </Button>
          </CardContent>
        </Card>
      )}

      {codesRevealed && (
        <Card className="border-warning/30">
          <CardContent className="space-y-4 p-6">
            <div>
              <h3 className="font-semibold">Backup Codes</h3>
              <p className="text-sm text-muted-foreground">
                Save these backup codes in a safe place. You can use them to access your
                account if you lose your authenticator device.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {backupCodes.map((code, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-muted px-4 py-3 font-mono text-sm"
                >
                  <span>{code}</span>
                  <Badge variant="secondary">{i === 0 ? 'Unused' : ''}</Badge>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleCopyCodes}>
                {codesCopied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setBackupCodes(
                    Array.from({ length: 5 }, () =>
                      Array.from({ length: 4 }, () =>
                        Math.random().toString(36).substring(2, 6).toUpperCase()
                      ).join('-')
                    )
                  )
                }
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
