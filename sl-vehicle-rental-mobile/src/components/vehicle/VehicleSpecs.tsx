import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface VehicleSpecsProps {
  type?: string;
  transmission?: string;
  fuelType?: string;
  seats?: number;
  year?: number;
  insuranceExpiry?: string;
}

export const VehicleSpecs: React.FC<VehicleSpecsProps> = ({
  type, transmission, fuelType, seats, year, insuranceExpiry
}) => {
  const specs = [
    { icon: 'car-outline', label: 'Type', value: type },
    { icon: 'speedometer-outline', label: 'Transmission', value: transmission },
    { icon: 'leaf-outline', label: 'Fuel', value: fuelType },
    { icon: 'people-outline', label: 'Seats', value: seats ? String(seats) : undefined },
    { icon: 'calendar-outline', label: 'Year', value: year ? String(year) : undefined },
    { icon: 'shield-checkmark-outline', label: 'Insurance', value: insuranceExpiry ? 'Valid' : undefined },
  ].filter((s) => s.value);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Specifications</Text>
      <View style={styles.grid}>
        {specs.map((spec) => (
          <View key={spec.label} style={styles.specItem}>
            <View style={styles.specIcon}>
              <Ionicons name={spec.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.specLabel}>{spec.label}</Text>
            <Text style={styles.specValue}>{spec.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing['4'] },
  title: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing['3'] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['3'] },
  specItem: {
    width: '47%', flexDirection: 'row', alignItems: 'center', gap: spacing['2'],
    backgroundColor: colors.background, padding: spacing['3'], borderRadius: 10,
  },
  specIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  specLabel: { ...typography.bodySmall, color: colors.textSecondary },
  specValue: { ...typography.labelSmall, color: colors.textPrimary, marginLeft: 'auto' },
});

export default VehicleSpecs;
