'use client'

import { useCallback, useState } from 'react'
import { kycService } from '@/services/kyc.service'
import type { KYCApplication, KYCFormData, KYCStatus } from '@/types'

export function useKYC() {
  const [application, setApplication] = useState<KYCApplication | null>(null)
  const [status, setStatus] = useState<KYCStatus>('not_started')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchKYCStatus = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await kycService.getStatus()
      const data = response.data.data
      if (data) {
        setApplication(data)
        setStatus(data.status)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch KYC status')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitKYC = useCallback(async (data: KYCFormData) => {
    setIsLoading(true)
    try {
      const response = await kycService.submit(data)
      const app = response.data.data
      if (app) {
        setApplication(app)
        setStatus('pending')
      }
      return app
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit KYC')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    application,
    status,
    isLoading,
    error,
    fetchKYCStatus,
    submitKYC,
  }
}
