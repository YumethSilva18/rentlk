import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Badge } from '../common/Badge';

interface VehicleAvailabilityProps {
  isAvailable: boolean;
  blockedDates?: string[];
  nextAvailable?: string;
}

export const VehicleAvailability: React.FC<VehicleAvailabilityProps> = ({
  isAvailable, blockedDates = [], nextAvailable
}) => {
  const blockedCount = blockedDates.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Availability</Text>
        <Badge
          label={isAvailable ? 'Available' : 'Unavailable'}
          variant={isAvailable ? 'success' : 'destructive'}
        />
      </View>

      {blockedCount > 0 ? (
        <View style={styles.blockedInfo}>
          <Ionicons name="calendar-clear-outline" size={18} color={colors.warning} />
          <Text style={styles.blockedText}>{blockedCount} days blocked</Text>
        </View>
      ) : (
        <View style={styles.availableInfo}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.availableText}>Available for booking</Text>
        </View>
      )}

      {nextAvailable && !isAvailable && (
        <Text style={styles.nextAvailable}>Next available: {nextAvailable}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing['4'] },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing['3'] },
  title: { ...typography.h4, color: colors.textPrimary },
  blockedInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'], padding: spacing['3'], backgroundColor: colors.backgroundWarning, borderRadius: 8 },
  blockedText: { ...typography.bodyMedium, color: colors.textPrimary },
  availableInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'], padding: spacing['3'], backgroundColor: colors.backgroundSuccess, borderRadius: 8 },
  availableText: { ...typography.bodyMedium, color: colors.textPrimary },
  nextAvailable: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing['2'], textAlign: 'center' },
});

export default VehicleAvailability;
