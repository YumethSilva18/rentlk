import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useWallet } from '../../hooks/useWallet';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/dates';

interface WalletScreenProps {
  navigation: any;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ navigation }) => {
  const { balance, transactions, payouts, fetchBalance, fetchTransactions, isLoading } = useWallet();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchBalance(), fetchTransactions()]);
    setRefreshing(false);
  }, [fetchBalance, fetchTransactions]);

  if (isLoading && !balance) return <Loader message="Loading wallet..." />;

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceValue}>{balance?.available ? formatCurrency(balance.available) : 'Rs. 0'}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceSubItem}>
            <Text style={styles.subLabel}>Pending</Text>
            <Text style={styles.subValue}>{formatCurrency(balance?.pending || 0)}</Text>
          </View>
          <View style={styles.balanceSubItem}>
            <Text style={styles.subLabel}>Total Earned</Text>
            <Text style={styles.subValue}>{formatCurrency(balance?.total || 0)}</Text>
          </View>
        </View>
        <Button title="Withdraw Funds" variant="accent" size="lg"
          onPress={() => navigation.navigate('Payout')} style={styles.withdrawBtn} />
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      {transactions.length === 0 ? (
        <EmptyState icon="receipt-outline" title="No transactions yet" message="Your transaction history will appear here" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
          renderItem={({ item }: any) => (
            <View style={styles.transactionItem}>
              <View style={[styles.transactionIcon, item.type === 'credit' ? styles.creditIcon : styles.debitIcon]}>
                <Ionicons name={item.type === 'credit' ? 'arrow-down' : 'arrow-up'} size={18}
                  color={item.type === 'credit' ? colors.success : colors.destructive} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.transactionDesc}>{item.description}</Text>
                <Text style={styles.transactionDate}>{formatDate(item.createdAt)}</Text>
              </View>
              <Text style={[styles.transactionAmount, item.type === 'credit' ? styles.creditAmount : styles.debitAmount]}>
                {item.type === 'credit' ? '+' : '-'}{formatCurrency(item.amount)}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  balanceCard: { backgroundColor: colors.primary, padding: spacing['6'], borderRadius: 20, margin: spacing['4'] },
  balanceLabel: { ...typography.labelMedium, color: colors.primaryForeground, opacity: 0.8 },
  balanceValue: { ...typography.displayMedium, color: colors.primaryForeground, marginTop: spacing['2'] },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing['4'] },
  balanceSubItem: { flex: 1 },
  subLabel: { ...typography.bodySmall, color: colors.primaryForeground, opacity: 0.7 },
  subValue: { ...typography.h4, color: colors.primaryForeground, marginTop: 4 },
  withdrawBtn: { marginTop: spacing['4'] },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, paddingHorizontal: spacing['4'], marginBottom: spacing['3'] },
  list: { paddingHorizontal: spacing['4'], gap: spacing['2'] },
  transactionItem: { flexDirection: 'row', alignItems: 'center', gap: spacing['3'], backgroundColor: colors.surface, padding: spacing['3'], borderRadius: 12 },
  transactionIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  creditIcon: { backgroundColor: colors.backgroundSuccess },
  debitIcon: { backgroundColor: colors.backgroundDestructive },
  transactionDesc: { ...typography.labelMedium, color: colors.textPrimary },
  transactionDate: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  transactionAmount: { ...typography.labelMedium, color: colors.textPrimary },
  creditAmount: { color: colors.success },
  debitAmount: { color: colors.destructive },
});

export default WalletScreen;
export { WalletScreen };
