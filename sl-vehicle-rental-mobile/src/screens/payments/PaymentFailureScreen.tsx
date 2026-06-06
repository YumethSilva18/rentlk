import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';

type Props = MainScreenProps<'PaymentFailure'>;

export const PaymentFailureScreen: React.FC<Props> = ({ navigation, route }) => {
  const { error } = route.params || {};

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="close-circle" size={80} color={colors.destructive} />
          </View>

          <Text style={styles.title}>Payment Failed</Text>
          <Text style={styles.subtitle}>
            {error || 'Your payment could not be processed. Please try again.'}
          </Text>

          <Card style={styles.detailsCard}>
            <View style={styles.errorInfo}>
              <Ionicons name="warning" size={24} color={colors.warning} />
              <View style={styles.errorTextContainer}>
                <Text style={styles.errorTitle}>What went wrong?</Text>
                <Text style={styles.errorDescription}>
                  This could be due to insufficient funds, incorrect card details, or a network issue.
                </Text>
              </View>
            </View>

            <View style={styles.helpSection}>
              <Text style={styles.helpTitle}>Need help?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ContactSupport')}>
                <Text style={styles.helpLink}>Contact Support</Text>
              </TouchableOpacity>
            </View>
          </Card>

          <View style={styles.actions}>
            <Button
              title="Try Again"
              onPress={() => navigation.goBack()}
              style={styles.button}
            />
            <Button
              title="Back to Booking"
              variant="outline"
              onPress={() => navigation.navigate('BookingDetail', { bookingId: '1' })}
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
    gap: spacing['4'],
  },
  errorInfo: {
    flexDirection: 'row',
    gap: spacing['3'],
  },
  errorTextContainer: {
    flex: 1,
  },
  errorTitle: {
    ...typography.labelLarge,
    color: colors.textPrimary,
    marginBottom: spacing['1'],
  },
  errorDescription: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  helpSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing['2'],
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  helpTitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  helpLink: {
    ...typography.labelMedium,
    color: colors.primary,
  },
  actions: {
    width: '100%',
    gap: spacing['3'],
  },
  button: {
    width: '100%',
  },
});
