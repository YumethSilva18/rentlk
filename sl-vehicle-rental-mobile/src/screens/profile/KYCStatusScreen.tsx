import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/format';

type Props = MainScreenProps<'KYCStatus'>;

export const KYCStatusScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const kycStatus = user?.kycStatus || 'not_started';

  const getStatusConfig = () => {
    switch (kycStatus) {
      case 'approved':
        return {
          icon: 'checkmark-circle' as const,
          color: colors.success,
          title: 'KYC Verified',
          message: 'Your identity has been verified successfully',
        };
      case 'pending':
      case 'in_review':
        return {
          icon: 'time' as const,
          color: colors.warning,
          title: 'Under Review',
          message: 'Your documents are being reviewed',
        };
      case 'rejected':
        return {
          icon: 'close-circle' as const,
          color: colors.destructive,
          title: 'Verification Failed',
          message: 'Please resubmit your documents',
        };
      default:
        return {
          icon: 'document-outline' as const,
          color: colors.textSecondary,
          title: 'Not Started',
          message: 'Complete KYC verification to access all features',
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>KYC Status</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Ionicons name={statusConfig.icon} size={64} color={statusConfig.color} />
            </View>
            <Text style={styles.statusText}>{statusConfig.title}</Text>
            <Text style={styles.statusMessage}>{statusConfig.message}</Text>
            <Badge 
              label={kycStatus.replace('_', ' ').toUpperCase()} 
              variant={
                kycStatus === 'approved' 
                  ? 'success' 
                  : kycStatus === 'rejected' 
                    ? 'destructive' 
                    : 'warning'
              } 
              size="lg"
            />
          </Card>

          {kycStatus === 'approved' && (
            <Card style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>Verification Details</Text>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Verified On</Text>
                <Text style={styles.value}>{formatDate(new Date())}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Document Type</Text>
                <Text style={styles.value}>National ID</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.label}>Status</Text>
                <Text style={[styles.value, { color: colors.success }]}>Approved</Text>
              </View>
            </Card>
          )}

          {(kycStatus === 'not_started' || kycStatus === 'rejected') && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => (navigation as any).navigate('KYC')}
            >
              <Ionicons name="document-text-outline" size={24} color={colors.white} />
              <Text style={styles.submitButtonText}>
                {kycStatus === 'rejected' ? 'Resubmit Documents' : 'Start Verification'}
              </Text>
            </TouchableOpacity>
          )}

          <Card style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle-outline" size={24} color={colors.info} />
              <Text style={styles.infoTitle}>Why KYC?</Text>
            </View>
            <Text style={styles.infoText}>
              KYC verification is required to ensure the safety and security of our platform. 
              It helps us verify your identity and protect both renters and vehicle owners.
            </Text>
            <View style={styles.requirementsList}>
              <Text style={styles.requirementsTitle}>Required Documents:</Text>
              {[
                'National ID or Passport',
                'Valid Driving License',
                'Selfie Photo',
                'Proof of Address',
              ].map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['4'],
    gap: spacing['3'],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['4'],
    gap: spacing['4'],
  },
  statusCard: {
    padding: spacing['6'],
    alignItems: 'center',
    gap: spacing['3'],
  },
  statusIcon: {
    marginBottom: spacing['2'],
  },
  statusText: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  statusMessage: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  detailsCard: {
    padding: spacing['4'],
    gap: spacing['3'],
  },
  detailsTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing['2'],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing['2'],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  value: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['2'],
    backgroundColor: colors.primary,
    padding: spacing['4'],
    borderRadius: radii.lg,
  },
  submitButtonText: {
    ...typography.labelLarge,
    color: colors.white,
  },
  infoCard: {
    padding: spacing['4'],
    gap: spacing['3'],
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  infoTitle: {
    ...typography.h4,
    color: colors.info,
  },
  infoText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  requirementsList: {
    gap: spacing['2'],
  },
  requirementsTitle: {
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['2'],
  },
  requirementText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
});
