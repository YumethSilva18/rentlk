import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { Loader } from '@/components/common/Loader';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import { useBookings } from '@/hooks/useBookings';
import { formatCurrency, formatDate } from '@/utils/format';

type Props = MainScreenProps<'MyBookings'>;

export const MyBookingsScreen: React.FC<Props> = ({ navigation }) => {
  const { bookings, isLoading, error } = useBookings();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'active':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'cancelled':
      case 'completed':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const renderBookingCard = (booking: any) => (
    <TouchableOpacity
      key={booking.id}
      onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
    >
      <Card style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{booking.vehicle.name}</Text>
            <Text style={styles.vehicleType}>{booking.vehicle.type}</Text>
          </View>
          <Badge 
            label={booking.status} 
            backgroundColor={getStatusColor(booking.status)}
            textColor={colors.white}
          />
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cash-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {formatCurrency(booking.totalAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.bookingActions}>
          {booking.status === 'confirmed' && (
            <Button
              title="View Details"
              variant="outline"
              size="small"
              onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
            />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <Loader />
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <EmptyState
            icon="alert-circle-outline"
            title="Error Loading Bookings"
            description={error.message}
            actionLabel="Retry"
            onAction={() => {/* retry logic */}}
          />
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Bookings</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {bookings.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title="No Bookings Yet"
              description="Start exploring vehicles and make your first booking!"
              actionLabel="Browse Vehicles"
              onAction={() => navigation.navigate('VehicleList', {})}
            />
          ) : (
            <View style={styles.bookingsList}>
              {bookings.map(renderBookingCard)}
            </View>
          )}
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
    padding: spacing.lg,
    paddingBottom: 0,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  bookingsList: {
    gap: spacing.md,
  },
  bookingCard: {
    marginBottom: spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  vehicleType: {
    ...typography.small,
    color: colors.textSecondary,
  },
  bookingDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
