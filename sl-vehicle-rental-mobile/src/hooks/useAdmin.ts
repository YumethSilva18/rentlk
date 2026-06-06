// ============================================================================
// useAdmin Hook
// ============================================================================

import { useState, useCallback } from 'react';
import { adminService } from '@/services/admin.service';
import type { AdminStats } from '@/types/admin.types';

export const useAdmin = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getDashboard();
      setStats(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    isLoading,
    fetchDashboard,
    getUsers: adminService.getUsers,
    suspendUser: adminService.suspendUser,
    activateUser: adminService.activateUser,
    approveVehicle: adminService.approveVehicle,
    rejectVehicle: adminService.rejectVehicle,
    getKYCApplications: adminService.getKYCApplications,
    reviewKYC: adminService.reviewKYC,
    getFraudAlerts: adminService.getFraudAlerts,
    updateFraudAlert: adminService.updateFraudAlert,
    getReports: adminService.getReports,
  };
};
