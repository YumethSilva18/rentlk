'use client'

import { useAuthStore } from '@/store'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    setUser,
    setToken,
    setLoading,
    setError,
    clearError,
  } = useAuthStore()
  const router = useRouter()

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      setError(null)
      try {
        // TODO: Implement actual login API call
        // const response = await authService.login({ email, password })
        // storeLogin(response.data.user, response.data.accessToken, response.data.refreshToken)
        router.push('/dashboard')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed')
      } finally {
        setLoading(false)
      }
    },
    [setLoading, setError, router]
  )

  const logout = useCallback(() => {
    storeLogout()
    router.push('/')
  }, [storeLogout, router])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    setUser,
    setToken,
    clearError,
  }
}
