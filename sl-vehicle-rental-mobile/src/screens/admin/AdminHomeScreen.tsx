import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Card } from '@/components/common/Card';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { formatCurrency } from '@/utils/currency';

type Props = MainScreenProps<'AdminHome'>;

export const AdminHomeScreen: React.FC<Props> = ({ navigation }) => {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: 'people-outline', change: '+12%' },
    { label: 'Total Vehicles', value: '567', icon: 'car-outline', change: '+8%' },
    { label: 'Active Bookings', value: '89', icon: 'calendar-outline', change: '+15%' },
    { label: 'Revenue', value: formatCurrency(125000), icon: 'cash-outline', change: '+22%' },
  ];

  const quickActions = [
    { icon: 'people-outline', label: 'Manage Users', screen: 'AdminUsers', color: colors.primary },
    { icon: 'car-outline', label: 'Vehicles', screen: 'AdminVehicles', color: colors.success },
    { icon: 'calendar-outline', label: 'Bookings', screen: 'AdminBookings', color: colors.warning },
    { icon: 'shield-checkmark-outline', label: 'KYC Review', screen: 'AdminKYC', color: colors.info },
    { icon: 'receipt-outline', label: 'Transactions', screen: 'AdminTransactions', color: colors.accent },
    { icon: 'warning-outline', label: 'Fraud Alerts', screen: 'AdminFraud', color: colors.destructive },
  ];

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Card key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Ionicons name={stat.icon as any} size={24} color={colors.primary} />
                  <Text style={styles.statChange}>{stat.change}</Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Card>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionCard}
                onPress={() => (navigation as any).navigate(action.screen)}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon as any} size={28} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Card style={styles.reportsCard}>
            <Text style={styles.sectionTitle}>Reports</Text>
            <TouchableOpacity
              style={styles.reportItem}
              onPress={() => (navigation as any).navigate('AdminReports')}
            >
              <Ionicons name="document-text-outline" size={24} color={colors.primary} />
              <Text style={styles.reportLabel}>View Analytics & Reports</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing['4'],
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['3'],
  },
  statCard: {
    width: '48%',
    padding: spacing['4'],
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2'],
  },
  statChange: {
    ...typography.bodySmall,
    color: colors.success,
    fontWeight: '600',
  },
  statValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing['1'],
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing['3'],
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing['3'],
    marginBottom: spacing['4'],
  },
  actionCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing['3'],
    alignItems: 'center',
    gap: spacing['2'],
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  reportsCard: {
    padding: spacing['4'],
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['3'],
    padding: spacing['3'],
    backgroundColor: colors.background,
    borderRadius: radii.lg,
  },
  reportLabel: {
    flex: 1,
    ...typography.labelMedium,
    color: colors.textPrimary,
  },
});
