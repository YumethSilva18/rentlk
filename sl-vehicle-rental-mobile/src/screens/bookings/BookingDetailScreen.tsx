import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { useBookings } from '../../hooks/useBookings';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/dates';
import { getBookingStatusLabel } from '../../utils/format';

interface BookingDetailScreenProps {
  navigation: any;
  route: any;
}

const BookingDetailScreen: React.FC<BookingDetailScreenProps> = ({ navigation, route }) => {
  const { bookingId } = route.params;
  const { selectedBooking, fetchBooking, cancel, isLoading } = useBookings();

  useEffect(() => {
    fetchBooking(bookingId);
  }, [bookingId]);

  if (isLoading || !selectedBooking) return <Loader message="Loading booking..." />;

  const booking = selectedBooking;
  const statusColors: Record<string, 'success' | 'warning' | 'info' | 'default' | 'destructive'> = {
    pending: 'warning', confirmed: 'info', active: 'success', completed: 'default', cancelled: 'destructive',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statusHeader}>
        <Badge label={getBookingStatusLabel(booking.status)} variant={statusColors[booking.status] || 'default'} size="md" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle</Text>
        <Text style={styles.vehicleName}>{booking.vehicleTitle}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Start Date</Text>
          <Text style={styles.value}>{formatDate(booking.startDate)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>End Date</Text>
          <Text style={styles.value}>{formatDate(booking.endDate)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>{booking.days} days</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Pickup</Text>
          <Text style={styles.value}>{booking.pickupLocation}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(booking.total)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>{booking.paymentStatus}</Text>
        </View>
      </View>

      {booking.status === 'pending' && (
        <Button title="Cancel Booking" variant="destructive" size="lg"
          onPress={() => cancel(booking.id, 'User requested')} style={styles.cancelBtn} />
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing['4'] },
  statusHeader: { alignItems: 'center', marginBottom: spacing['4'] },
  section: { backgroundColor: colors.surface, padding: spacing['4'], borderRadius: 12, marginBottom: spacing['3'] },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing['3'] },
  vehicleName: { ...typography.labelLarge, color: colors.textPrimary },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing['2'] },
  label: { ...typography.bodyMedium, color: colors.textSecondary },
  value: { ...typography.bodyMedium, color: colors.textPrimary },
  totalValue: { ...typography.labelLarge, color: colors.primary },
  cancelBtn: { marginTop: spacing['4'] },
});

export default BookingDetailScreen;
export { BookingDetailScreen };
