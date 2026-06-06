import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';

interface BookingSuccessScreenProps {
  navigation: any;
  route: any;
}

const BookingSuccessScreen: React.FC<BookingSuccessScreenProps> = ({ navigation, route }) => {
  const { bookingId } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={80} color={colors.success} />
      </View>
      <Text style={styles.title}>Booking Successful!</Text>
      <Text style={styles.subtitle}>Your vehicle has been booked successfully</Text>

      <View style={styles.bookingIdCard}>
        <Text style={styles.bookingIdLabel}>Booking ID</Text>
        <Text style={styles.bookingIdValue}>{bookingId}</Text>
      </View>

      <Button title="View Booking Details" variant="primary" size="lg"
        onPress={() => navigation.navigate('BookingDetail', { bookingId })}
        style={styles.primaryBtn} />
      <Button title="View My Bookings" variant="outline" size="lg"
        onPress={() => navigation.navigate('MyBookings')}
        style={styles.secondaryBtn} />
      <Button title="Back to Home" variant="ghost" size="lg"
        onPress={() => navigation.navigate('Tabs')}
        style={styles.ghostBtn} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing['6'], alignItems: 'center', justifyContent: 'center', flex: 1 },
  iconWrap: { marginBottom: spacing['6'] },
  title: { ...typography.h2, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { ...typography.bodyLarge, color: colors.textSecondary, marginTop: spacing['2'], textAlign: 'center' },
  bookingIdCard: { backgroundColor: colors.surface, padding: spacing['4'], borderRadius: 12, marginTop: spacing['6'], width: '100%' },
  bookingIdLabel: { ...typography.labelMedium, color: colors.textSecondary, textAlign: 'center' },
  bookingIdValue: { ...typography.h4, color: colors.primary, textAlign: 'center', marginTop: spacing['1'] },
  primaryBtn: { width: '100%', marginTop: spacing['6'] },
  secondaryBtn: { width: '100%', marginTop: spacing['2'] },
  ghostBtn: { width: '100%', marginTop: spacing['2'] },
});

export default BookingSuccessScreen;
export { BookingSuccessScreen };
