'use client'

import { useCallback, useState } from 'react'
import { adminService } from '@/services/admin.service'
import type { AdminStats, AdminUser, FraudAlert } from '@/types'

export function useAdmin() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await adminService.getStats()
      setStats(response.data.data ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admin stats')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchUsers = useCallback(
    async (params?: { page?: number; pageSize?: number; role?: string }) => {
      setIsLoading(true)
      try {
        const response = await adminService.getUsers(params)
        const data = response.data.data
        if (data) setUsers(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users')
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const fetchFraudAlerts = useCallback(async (params?: { page?: number; status?: string }) => {
    setIsLoading(true)
    try {
      const response = await adminService.getFraudAlerts(params)
      const data = response.data.data
      if (data) setFraudAlerts(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fraud alerts')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const approveKYC = useCallback(async (applicationId: string) => {
    setIsLoading(true)
    try {
      await adminService.approveKYC(applicationId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve KYC')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const rejectKYC = useCallback(async (applicationId: string, reason: string) => {
    setIsLoading(true)
    try {
      await adminService.rejectKYC(applicationId, reason)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject KYC')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    stats,
    users,
    fraudAlerts,
    isLoading,
    error,
    fetchStats,
    fetchUsers,
    fetchFraudAlerts,
    approveKYC,
    rejectKYC,
  }
}
