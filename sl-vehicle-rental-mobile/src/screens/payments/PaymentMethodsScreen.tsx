import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { colors, typography, spacing, radii, shadows } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';

type Props = MainScreenProps<'PaymentMethods'>;

export const PaymentMethodsScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const paymentMethods = [
    { id: '1', type: 'card', last4: '4242', brand: 'Visa', expiry: '12/25', isDefault: true },
    { id: '2', type: 'card', last4: '8888', brand: 'Mastercard', expiry: '08/24', isDefault: false },
  ];

  const handleAddMethod = () => {
    Alert.alert('Add Payment Method', 'Integration with payment gateway required');
  };

  const handleRemoveMethod = (id: string) => {
    Alert.alert('Remove Method', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive' },
    ]);
  };

  const renderCard = (method: any) => (
    <Card key={method.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Ionicons 
            name={method.brand === 'Visa' ? 'card-outline' : 'business-outline'} 
            size={24} 
            color={colors.primary} 
          />
        </View>
        {method.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.cardDetails}>
        <Text style={styles.brandText}>{method.brand}</Text>
        <Text style={styles.numberText}>**** **** **** {method.last4}</Text>
        <Text style={styles.expiryText}>Expires {method.expiry}</Text>
      </View>

      {!method.isDefault && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveMethod(method.id)}
        >
          <Ionicons name="trash-outline" size={18} color={colors.destructive} />
        </TouchableOpacity>
      )}
    </Card>
  );

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Payment Methods</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Loader />
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Your Cards</Text>
            {paymentMethods.map(renderCard)}

            <Button
              title="Add New Payment Method"
              variant="outline"
              icon={<Ionicons name="add" size={20} color={colors.primary} />}
              onPress={handleAddMethod}
              style={styles.addButton}
            />

            <View style={styles.infoSection}>
              <Ionicons name="shield-checkmark-outline" size={32} color={colors.success} />
              <Text style={styles.infoTitle}>Secure Payments</Text>
              <Text style={styles.infoText}>
                Your payment information is encrypted and secure. We support PayHere, Stripe, and local payment methods.
              </Text>
            </View>
          </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['4'],
    gap: spacing['4'],
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing['2'],
  },
  card: {
    marginBottom: spacing['3'],
    padding: spacing['4'],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing['3'],
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing['2'],
    paddingVertical: spacing['0.5'],
    borderRadius: radii.badge,
  },
  defaultText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  cardDetails: {
    gap: spacing['1'],
  },
  brandText: {
    ...typography.labelLarge,
    color: colors.textPrimary,
  },
  numberText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  expiryText: {
    ...typography.bodySmall,
    color: colors.textTertiary,
  },
  removeButton: {
    position: 'absolute',
    right: spacing['4'],
    bottom: spacing['4'],
    padding: spacing['2'],
  },
  addButton: {
    marginTop: spacing['2'],
  },
  infoSection: {
    marginTop: spacing['6'],
    padding: spacing['4'],
    backgroundColor: colors.backgroundSuccess,
    borderRadius: radii.lg,
    alignItems: 'center',
    gap: spacing['2'],
  },
  infoTitle: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  infoText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
