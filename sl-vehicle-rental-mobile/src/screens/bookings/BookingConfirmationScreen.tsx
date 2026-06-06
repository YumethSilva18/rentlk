import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';

interface BookingConfirmationScreenProps {
  navigation: any;
  route: any;
}

const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({ navigation, route }) => {
  const { bookingId } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle-outline" size={64} color={colors.success} />
      </View>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.subtitle}>Your booking has been successfully created</Text>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Booking Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Booking ID</Text>
          <Text style={styles.value}>{bookingId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Pending Payment</Text>
          </View>
        </View>
      </View>

      <Button title="Pay Now" variant="primary" size="lg"
        onPress={() => navigation.navigate('Payment', { bookingId })}
        style={styles.payBtn} />
      <Button title="View Booking" variant="outline" size="lg"
        onPress={() => navigation.navigate('BookingDetail', { bookingId })}
        style={styles.viewBtn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing['6'], alignItems: 'center', justifyContent: 'center' },
  successIcon: { marginBottom: spacing['6'] },
  title: { ...typography.h2, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { ...typography.bodyLarge, color: colors.textSecondary, marginTop: spacing['2'], textAlign: 'center' },
  detailsCard: { width: '100%', backgroundColor: colors.surface, padding: spacing['4'], borderRadius: 12, marginTop: spacing['6'] },
  detailsTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing['3'] },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing['2'] },
  label: { ...typography.bodyMedium, color: colors.textSecondary },
  value: { ...typography.bodyMedium, color: colors.textPrimary },
  statusBadge: { backgroundColor: colors.backgroundWarning, paddingHorizontal: spacing['2'], paddingVertical: 4, borderRadius: 6 },
  statusText: { ...typography.labelSmall, color: colors.textPrimary },
  payBtn: { width: '100%', marginTop: spacing['6'] },
  viewBtn: { width: '100%', marginTop: spacing['2'] },
});

export default BookingConfirmationScreen;
export { BookingConfirmationScreen };
