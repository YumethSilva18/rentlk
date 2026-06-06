import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { usePayments } from '../../hooks/usePayments';
import { formatCurrency } from '../../utils/currency';
import { PAYMENT_METHODS } from '../../utils/constants';
import { generateIdempotencyKey } from '../../utils/idempotency';

interface PaymentScreenProps {
  navigation: any;
  route: any;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { bookingId, amount } = route.params;
  const { pay, isLoading } = usePayments();
  const [selectedMethod, setSelectedMethod] = useState('payhere');

  const handlePayment = async () => {
    try {
      const result = await pay({
        bookingId,
        amount,
        method: selectedMethod,
        idempotencyKey: generateIdempotencyKey(),
      });

      if (result.success) {
        navigation.navigate('PaymentSuccess', { transactionId: result.transactionId });
      } else {
        navigation.navigate('PaymentFailure', { error: result.error });
      }
    } catch (err: any) {
      Alert.alert('Payment Failed', err.message || 'Unable to process payment');
    }
  };

  if (isLoading) return <Loader message="Processing payment..." />;

  return (
    <View style={styles.container}>
      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Amount to Pay</Text>
        <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
      </View>

      <Text style={styles.methodTitle}>Payment Method</Text>
      {PAYMENT_METHODS.map((method) => (
        <View key={method.value} style={[styles.methodOption, selectedMethod === method.value && styles.methodSelected]}
          onTouchEnd={() => setSelectedMethod(method.value)}>
          <Ionicons name={method.icon as any} size={24} color={selectedMethod === method.value ? colors.primary : colors.textSecondary} />
          <Text style={[styles.methodText, selectedMethod === method.value && styles.methodSelectedText]}>{method.label}</Text>
          {selectedMethod === method.value && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
        </View>
      ))}

      <View style={styles.secureInfo}>
        <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
        <Text style={styles.secureText}>Secure payment powered by {selectedMethod === 'payhere' ? 'PayHere' : selectedMethod === 'stripe' ? 'Stripe' : 'EZCash'}</Text>
      </View>

      <Button title={`Pay ${formatCurrency(amount)}`} variant="primary" size="lg" onPress={handlePayment}
        loading={isLoading} style={styles.payBtn} />
      <Button title="Cancel" variant="ghost" size="md" onPress={() => navigation.goBack()} style={styles.cancelBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing['4'] },
  amountCard: { backgroundColor: colors.surface, padding: spacing['6'], borderRadius: 16, alignItems: 'center', marginBottom: spacing['6'] },
  amountLabel: { ...typography.labelMedium, color: colors.textSecondary },
  amountValue: { ...typography.displayMedium, color: colors.primary, marginTop: spacing['2'] },
  methodTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing['3'] },
  methodOption: { flexDirection: 'row', alignItems: 'center', gap: spacing['3'], padding: spacing['4'], backgroundColor: colors.surface, borderRadius: 12, marginBottom: spacing['2'], borderWidth: 1, borderColor: colors.border },
  methodSelected: { borderColor: colors.primary, backgroundColor: colors.backgroundPrimary },
  methodText: { ...typography.bodyLarge, color: colors.textSecondary, flex: 1 },
  methodSelectedText: { color: colors.primary, fontWeight: '600' },
  secureInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'], padding: spacing['3'], backgroundColor: colors.backgroundSuccess, borderRadius: 8, marginVertical: spacing['4'] },
  secureText: { ...typography.bodyMedium, color: colors.textPrimary },
  payBtn: { marginTop: spacing['4'] },
  cancelBtn: { marginTop: spacing['2'] },
});

export default PaymentScreen;
export { PaymentScreen };
