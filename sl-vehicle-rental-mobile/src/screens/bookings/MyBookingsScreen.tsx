import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useBookings } from '../../hooks/useBookings';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/dates';
import { getBookingStatusLabel } from '../../utils/format';

interface MyBookingsScreenProps {
  navigation: any;
}

const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({ navigation }) => {
  const { bookings, fetchBookings, isLoading } = useBookings();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchBookings(); }, []);
  const handleRefresh = useCallback(async () => { setRefreshing(true); await fetchBookings(); setRefreshing(false); }, [fetchBookings]);

  const renderBooking = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Text style={styles.vehicleName}>{item.vehicleTitle}</Text>
        <Badge label={getBookingStatusLabel(item.status)} variant={item.status === 'active' ? 'success' : item.status === 'cancelled' ? 'destructive' : 'default'} />
      </View>
      <View style={styles.cardMeta}>
        <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.metaText}>{formatDate(item.startDate)} - {formatDate(item.endDate)}</Text>
      </View>
      <View style={styles.cardBottom}>
        <Text style={styles.price}>{formatCurrency(item.total)}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {isLoading && bookings.length === 0 ? (
        <Loader message="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <EmptyState icon="calendar-outline" title="No bookings yet" message="Book your first vehicle to get started"
          actionLabel="Browse Vehicles" onAction={() => navigation.navigate('VehicleList')} />
      ) : (
        <FlatList data={bookings} keyExtractor={(item: any) => item.id} contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}
          renderItem={renderBooking} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing['4'], gap: spacing['3'] },
  card: { backgroundColor: colors.surface, padding: spacing['4'], borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vehicleName: { ...typography.labelLarge, color: colors.textPrimary, flex: 1, marginRight: spacing['2'] },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing['2'] },
  metaText: { ...typography.bodyMedium, color: colors.textSecondary },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing['2'] },
  price: { ...typography.labelLarge, color: colors.primary },
});

export default MyBookingsScreen;
export { MyBookingsScreen };
