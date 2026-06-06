import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { formatCurrency } from '@/utils/currency';

type Props = MainScreenProps<'PaymentSuccess'>;

export const PaymentSuccessScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transactionId } = route.params;

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </View>

          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>
            Your payment has been processed successfully
          </Text>

          <Card style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Transaction ID</Text>
              <Text style={styles.value}>{transactionId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>{formatCurrency(5000)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusBadge}>
                <Ionicons name="checkmark" size={14} color={colors.success} />
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>
          </Card>

          <View style={styles.actions}>
            <Button
              title="View Booking"
              onPress={() => navigation.navigate('BookingDetail', { bookingId: '1' })}
              style={styles.button}
            />
            <Button
              title="Back to Home"
              variant="outline"
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] })}
              style={styles.button}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing['4'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: spacing['6'],
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing['2'],
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing['8'],
    textAlign: 'center',
  },
  detailsCard: {
    width: '100%',
    padding: spacing['4'],
    marginBottom: spacing['6'],
    gap: spacing['3'],
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing['2'],
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
    backgroundColor: colors.backgroundSuccess,
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['0.5'],
    borderRadius: radii.badge,
  },
  statusText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: '600',
  },
  actions: {
    width: '100%',
    gap: spacing['3'],
  },
  button: {
    width: '100%',
  },
});
