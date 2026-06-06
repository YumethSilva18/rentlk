import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/format';

type Props = MainScreenProps<'PaymentHistory'>;

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'payout' | 'wallet_credit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  date: string;
  bookingId?: string;
}

export const PaymentHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'payment',
      amount: 5000,
      status: 'completed',
      description: 'Booking payment - Toyota Prius',
      date: '2024-01-15',
      bookingId: '1',
    },
    {
      id: '2',
      type: 'wallet_credit',
      amount: 1000,
      status: 'completed',
      description: 'Wallet top-up',
      date: '2024-01-10',
    },
  ]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return 'arrow-down-circle';
      case 'refund':
        return 'arrow-up-circle';
      case 'payout':
        return 'wallet-outline';
      case 'wallet_credit':
        return 'add-circle';
      default:
        return 'receipt-outline';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'payment':
        return colors.destructive;
      case 'refund':
      case 'payout':
      case 'wallet_credit':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusVariant = (status: string): any => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <Card style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={[styles.iconContainer, { backgroundColor: getTransactionColor(item.type) + '20' }]}>
          <Ionicons 
            name={getTransactionIcon(item.type) as any} 
            size={24} 
            color={getTransactionColor(item.type)} 
          />
        </View>
        <Badge 
          label={item.status} 
          variant={getStatusVariant(item.status)}
        />
      </View>

      <View style={styles.transactionDetails}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>

      <View style={styles.transactionFooter}>
        <Text 
          style={[
            styles.amount,
            { color: getTransactionColor(item.type) }
          ]}
        >
          {item.type === 'payment' ? '-' : '+'}{formatCurrency(item.amount)}
        </Text>
        {item.bookingId && (
          <Text 
            style={styles.viewLink}
            onPress={() => navigation.navigate('BookingDetail', { bookingId: item.bookingId! })}
          >
            View Booking
          </Text>
        )}
      </View>
    </Card>
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <Loader />
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment History</Text>
          <Text style={styles.subtitle}>All your transactions</Text>
        </View>

        {transactions.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title="No Transactions"
          />
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    padding: spacing['4'],
    paddingBottom: spacing['2'],
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  listContent: {
    padding: spacing['4'],
    gap: spacing['3'],
  },
  transactionCard: {
    padding: spacing['4'],
    marginBottom: spacing['3'],
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['3'],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDetails: {
    marginBottom: spacing['3'],
  },
  description: {
    ...typography.labelMedium,
    color: colors.textPrimary,
    marginBottom: spacing['1'],
  },
  date: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing['2'],
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  amount: {
    ...typography.h3,
    fontWeight: '700',
  },
  viewLink: {
    ...typography.labelMedium,
    color: colors.primary,
  },
});
