import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { formatCurrency } from '@/utils/currency';

type Props = MainScreenProps<'Payout'>;

export const PayoutScreen: React.FC<Props> = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const walletBalance = 15000;
  const pendingPayouts = 2000;

  const handlePayout = () => {
    const payoutAmount = parseFloat(amount);
    if (!payoutAmount || payoutAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payout amount');
      return;
    }
    if (payoutAmount > walletBalance) {
      Alert.alert('Insufficient Balance', 'You cannot withdraw more than your wallet balance');
      return;
    }
    Alert.alert('Payout Request', `Requesting payout of ${formatCurrency(payoutAmount)}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => Alert.alert('Success', 'Payout request submitted') },
    ]);
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Payout</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(walletBalance)}</Text>
            {pendingPayouts > 0 && (
              <View style={styles.pendingContainer}>
                <Ionicons name="time-outline" size={16} color={colors.warning} />
                <Text style={styles.pendingText}>
                  {formatCurrency(pendingPayouts)} pending
                </Text>
              </View>
            )}
          </Card>

          <View style={styles.form}>
            <Input
              label="Payout Amount"
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              leftIcon={<Ionicons name="cash-outline" size={20} color={colors.textSecondary} />}
            />

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color={colors.info} />
              <Text style={styles.infoText}>
                Payouts are processed within 2-3 business days. Minimum payout amount is Rs. 500.
              </Text>
            </View>

            <Button
              title="Request Payout"
              onPress={handlePayout}
              disabled={!amount || parseFloat(amount) < 500}
            />

            <View style={styles.payoutMethods}>
              <Text style={styles.sectionTitle}>Payout Methods</Text>
              <Card style={styles.methodCard}>
                <View style={styles.methodIcon}>
                  <Ionicons name="business-outline" size={24} color={colors.primary} />
                </View>
                <View style={styles.methodDetails}>
                  <Text style={styles.methodName}>Bank Transfer</Text>
                  <Text style={styles.methodInfo}>Commercial Bank - ****1234</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </Card>
            </View>
          </View>
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
  balanceCard: {
    padding: spacing['6'],
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  balanceLabel: {
    ...typography.bodyMedium,
    color: colors.primaryForeground + 'CC',
    marginBottom: spacing['2'],
  },
  balanceAmount: {
    ...typography.displayMedium,
    color: colors.primaryForeground,
    fontWeight: '700',
    marginBottom: spacing['3'],
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing['1'],
    backgroundColor: colors.warning + '20',
    paddingHorizontal: spacing['3'],
    paddingVertical: spacing['1'],
    borderRadius: radii.badge,
  },
  pendingText: {
    ...typography.bodySmall,
    color: colors.warning,
    fontWeight: '600',
  },
  form: {
    gap: spacing['4'],
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing['2'],
    padding: spacing['3'],
    backgroundColor: colors.backgroundInfo,
    borderRadius: radii.lg,
  },
  infoText: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.info,
  },
  payoutMethods: {
    marginTop: spacing['2'],
    gap: spacing['3'],
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['4'],
    gap: spacing['3'],
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: spacing['0.5'],
  },
  methodInfo: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
