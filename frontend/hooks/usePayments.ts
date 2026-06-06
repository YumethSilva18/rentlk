'use client'

import { useCallback, useState } from 'react'
import { paymentService } from '@/services/payment.service'
import type { PaymentMethodInfo, PaymentTransaction, WalletTransaction } from '@/types'

export function usePayments() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodInfo[]>([])
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [walletBalance, setWalletBalance] = useState(0)
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentMethods = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await paymentService.getPaymentMethods()
      setPaymentMethods(response.data.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payment methods')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchTransactions = useCallback(async (params?: { page?: number }) => {
    setIsLoading(true)
    try {
      const response = await paymentService.getTransactionHistory(params)
      setTransactions(response.data.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchWalletBalance = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await paymentService.getWalletBalance()
      setWalletBalance(response.data.data?.balance ?? 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet balance')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const processPayment = useCallback(
    async (data: { bookingId: string; amount: number; method: string }) => {
      setIsLoading(true)
      try {
        const response = await paymentService.createTransaction(data)
        return response.data.data
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Payment failed')
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    paymentMethods,
    transactions,
    walletBalance,
    walletTransactions,
    isLoading,
    error,
    fetchPaymentMethods,
    fetchTransactions,
    fetchWalletBalance,
    processPayment,
    setError,
  }
}
