import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { TextArea } from '../../components/common/TextArea';
import { FilterChip } from '../../components/common/FilterChip';
import { Loader } from '../../components/common/Loader';
import { useBookings } from '../../hooks/useBookings';
import { useVehicles } from '../../hooks/useVehicles';
import { calculateTotal, formatCurrency } from '../../utils/currency';
import { formatDateForApi, getDaysBetween } from '../../utils/dates';
import { PAYMENT_METHODS, ADD_ONS } from '../../utils/constants';

interface BookingScreenProps {
  navigation: any;
  route: any;
}

const BookingScreen: React.FC<BookingScreenProps> = ({ navigation, route }) => {
  const { vehicleId } = route.params;
  const { selectedVehicle, getDetail, isLoading: loadingVehicle } = useVehicles();
  const { create, isLoading } = useBookings();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000)); // +1 day
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('payhere');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    getDetail(vehicleId);
  }, [vehicleId]);

  const days = getDaysBetween(startDate, endDate);
  const addOnsData = ADD_ONS.filter((a) => selectedAddOns.includes(a.id));
  const pricing = calculateTotal(selectedVehicle?.dailyRate || 0, days, addOnsData);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(selectedAddOns.includes(id) ? selectedAddOns.filter((a) => a !== id) : [...selectedAddOns, id]);
  };

  const handleBooking = useCallback(async () => {
    if (!selectedVehicle) return;
    if (days <= 0) {
      Alert.alert('Invalid Dates', 'End date must be after start date');
      return;
    }

    try {
      const result = await create({
        vehicleId,
        startDate: formatDateForApi(startDate),
        endDate: formatDateForApi(endDate),
        pickupLocation: pickupLocation || selectedVehicle.location?.address || '',
        dropoffLocation: dropoffLocation || undefined,
        addOns: selectedAddOns,
        paymentMethod,
        notes: notes || undefined,
      });

      navigation.navigate('BookingSuccess', { bookingId: result.id });
    } catch (err: any) {
      Alert.alert('Booking Failed', err.message || 'Unable to create booking');
    }
  }, [selectedVehicle, days, startDate, endDate, pickupLocation, dropoffLocation, selectedAddOns, paymentMethod, notes]);

  if (loadingVehicle || !selectedVehicle) return <Loader message="Loading vehicle..." />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Vehicle Summary */}
      <View style={styles.vehicleCard}>
        <Text style={styles.vehicleTitle}>{selectedVehicle.title || `${selectedVehicle.brand} ${selectedVehicle.model}`}</Text>
        <View style={styles.vehicleMeta}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.vehicleLocation}>{selectedVehicle.location?.city || 'Colombo'}</Text>
        </View>
        <Text style={styles.vehiclePrice}>{formatCurrency(selectedVehicle.dailyRate)}/day</Text>
      </View>

      {/* Dates */}
      <Text style={styles.sectionTitle}>Booking Dates</Text>
      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateField}>
          <Text style={styles.dateLabel}>End Date</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} />
            <Text style={styles.dateText}>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.durationText}>{days} {days === 1 ? 'day' : 'days'}</Text>

      {/* Locations */}
      <Text style={styles.sectionTitle}>Pickup & Drop-off</Text>
      <Input label="Pickup Location" value={pickupLocation} onChangeText={setPickupLocation}
        placeholder={selectedVehicle.location?.address || 'Enter pickup location'} />
      <Input label="Drop-off Location (Optional)" value={dropoffLocation} onChangeText={setDropoffLocation}
        placeholder="Same as pickup if empty" />

      {/* Add-ons */}
      <Text style={styles.sectionTitle}>Add-ons</Text>
      <View style={styles.addOnsWrap}>
        {ADD_ONS.map((addOn) => (
          <FilterChip key={addOn.id} label={`${addOn.name} (+${formatCurrency(addOn.price)})`}
            selected={selectedAddOns.includes(addOn.id)} onPress={() => toggleAddOn(addOn.id)} />
        ))}
      </View>

      {/* Payment Method */}
      <Text style={styles.sectionTitle}>Payment Method</Text>
      <View style={styles.paymentWrap}>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity key={method.value} style={[styles.paymentOption, paymentMethod === method.value && styles.paymentSelected]}
            onPress={() => setPaymentMethod(method.value)}>
            <Ionicons name={method.icon as any} size={20} color={paymentMethod === method.value ? colors.primary : colors.textSecondary} />
            <Text style={[styles.paymentText, paymentMethod === method.value && styles.paymentSelectedText]}>{method.label}</Text>
            {paymentMethod === method.value && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes */}
      <Text style={styles.sectionTitle}>Notes (Optional)</Text>
      <TextArea value={notes} onChangeText={setNotes} placeholder="Any special requests..." maxLength={200} />

      {/* Pricing Summary */}
      <View style={styles.pricingCard}>
        <Text style={styles.pricingTitle}>Price Summary</Text>
        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>Daily Rate × {days} {days === 1 ? 'day' : 'days'}</Text>
          <Text style={styles.pricingValue}>{formatCurrency(pricing.subtotal)}</Text>
        </View>
        {addOnsData.length > 0 && (
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Add-ons</Text>
            <Text style={styles.pricingValue}>{formatCurrency(pricing.addOnsTotal)}</Text>
          </View>
        )}
        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>Platform Fee</Text>
          <Text style={styles.pricingValue}>{formatCurrency(pricing.commission)}</Text>
        </View>
        <View style={[styles.pricingRow, styles.pricingTotal]}>
          <Text style={styles.pricingTotalLabel}>Total</Text>
          <Text style={styles.pricingTotalValue}>{formatCurrency(pricing.total)}</Text>
        </View>
      </View>

      {/* Submit */}
      <Button title={`Book for ${formatCurrency(pricing.total)}`} variant="primary" size="lg"
        onPress={handleBooking} loading={isLoading} style={styles.submitBtn} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing['4'] },
  vehicleCard: { backgroundColor: colors.surface, padding: spacing['4'], borderRadius: 12, marginBottom: spacing['4'] },
  vehicleTitle: { ...typography.h4, color: colors.textPrimary },
  vehicleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  vehicleLocation: { ...typography.bodyMedium, color: colors.textSecondary },
  vehiclePrice: { ...typography.h3, color: colors.primary, marginTop: spacing['2'] },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginTop: spacing['5'], marginBottom: spacing['3'] },
  dateRow: { flexDirection: 'row', gap: spacing['3'] },
  dateField: { flex: 1 },
  dateLabel: { ...typography.labelMedium, color: colors.textPrimary, marginBottom: spacing['2'] },
  dateInput: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'], padding: spacing['3'], backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  dateText: { ...typography.bodyMedium, color: colors.textPrimary },
  durationText: { ...typography.bodyMedium, color: colors.primary, marginTop: spacing['2'], textAlign: 'center' },
  addOnsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'] },
  paymentWrap: { gap: spacing['2'] },
  paymentOption: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'], padding: spacing['3'], backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  paymentSelected: { borderColor: colors.primary, backgroundColor: colors.backgroundPrimary },
  paymentText: { ...typography.bodyMedium, color: colors.textSecondary, flex: 1 },
  paymentSelectedText: { color: colors.primary, fontWeight: '600' },
  pricingCard: { backgroundColor: colors.surface, padding: spacing['4'], borderRadius: 12, marginTop: spacing['5'] },
  pricingTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing['3'] },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing['2'] },
  pricingLabel: { ...typography.bodyMedium, color: colors.textSecondary },
  pricingValue: { ...typography.bodyMedium, color: colors.textPrimary },
  pricingTotal: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing['2'], paddingTop: spacing['3'] },
  pricingTotalLabel: { ...typography.h4, color: colors.textPrimary },
  pricingTotalValue: { ...typography.h4, color: colors.primary },
  submitBtn: { marginTop: spacing['5'] },
});

export default BookingScreen;
export { BookingScreen };
