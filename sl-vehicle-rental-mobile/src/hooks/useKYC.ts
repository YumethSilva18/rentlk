// ============================================================================
// useKYC Hook
// ============================================================================

import { useState, useCallback } from 'react';
import { kycService } from '@/services/kyc.service';
import type { KYCApplication, KYCFormData, KYCEligibility } from '@/types/kyc.types';
import type { KYCStatus } from '@/types/user.types';

export const useKYC = () => {
  const [status, setStatus] = useState<KYCStatus | null>(null);
  const [application, setApplication] = useState<KYCApplication | null>(null);
  const [eligibility, setEligibility] = useState<KYCEligibility | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await kycService.getStatus();
      setStatus(result.status);
      setApplication(result.application || null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEligibility = useCallback(async () => {
    const result = await kycService.getEligibility();
    setEligibility(result);
    return result;
  }, []);

  const submit = useCallback(async (data: KYCFormData) => {
    setIsLoading(true);
    try {
      const app = await kycService.submit(data);
      setApplication(app);
      setStatus(app.status);
      return app;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { status, application, eligibility, isLoading, fetchStatus, fetchEligibility, submit };
};
