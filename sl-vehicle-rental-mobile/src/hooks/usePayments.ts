// ============================================================================
// usePayments Hook
// ============================================================================

import { useState, useCallback } from 'react';
import { paymentService } from '@/services/payment.service';
import type { PaymentRequest, PaymentResponse, PaymentMethodInfo, PaymentTransaction } from '@/types/payment.types';

export const usePayments = () => {
  const [methods, setMethods] = useState<PaymentMethodInfo[]>([]);
  const [history, setHistory] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMethods = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await paymentService.getMethods();
      setMethods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await paymentService.getHistory();
      setHistory(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pay = useCallback(async (data: PaymentRequest): Promise<PaymentResponse> => {
    setIsLoading(true);
    try {
      const response = await paymentService.create(data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { methods, history, isLoading, error, fetchMethods, fetchHistory, pay };
};
