'use client'

import { useUserStore } from '@/store'
import { userService } from '@/services/user.service'
import { useCallback, useEffect } from 'react'

export function useUser() {
  const { profile, isLoading, error, setProfile, updateProfile, setLoading, setError, clear } = useUserStore()

  const fetchProfile = useCallback(
    async (userId: string) => {
      setLoading(true)
      try {
        const response = await userService.getProfile(userId)
        setProfile(response.data.data ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setProfile, setError]
  )

  const updateUserProfile = useCallback(
    async (userId: string, data: Partial<Record<string, unknown>>) => {
      setLoading(true)
      try {
        await userService.updateProfile(userId, data)
        updateProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update profile')
      } finally {
        setLoading(false)
      }
    },
    [setLoading, updateProfile, setError]
  )

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateUserProfile,
    clear,
  }
}
