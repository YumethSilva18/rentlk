import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { FilterChip } from '../common/FilterChip';
import { VEHICLE_TYPES, TRANSMISSION_TYPES, FUEL_TYPES } from '../../utils/constants';

interface VehicleFiltersProps {
  selectedTypes: string[];
  selectedTransmission: string[];
  selectedFuel: string[];
  priceRange: [number, number];
  onTypeChange: (types: string[]) => void;
  onTransmissionChange: (types: string[]) => void;
  onFuelChange: (types: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClear: () => void;
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  selectedTypes, selectedTransmission, selectedFuel, priceRange,
  onTypeChange, onTransmissionChange, onFuelChange, onPriceRangeChange, onClear
}) => {
  const hasFilters = selectedTypes.length > 0 || selectedTransmission.length > 0 || selectedFuel.length > 0;

  const toggleType = (type: string) => {
    onTypeChange(selectedTypes.includes(type) ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type]);
  };

  const toggleTransmission = (t: string) => {
    onTransmissionChange(selectedTransmission.includes(t) ? selectedTransmission.filter((v) => v !== t) : [...selectedTransmission, t]);
  };

  const toggleFuel = (f: string) => {
    onFuelChange(selectedFuel.includes(f) ? selectedFuel.filter((v) => v !== f) : [...selectedFuel, f]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        {hasFilters && (
          <TouchableOpacity onPress={onClear}>
            <Text style={styles.clear}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Vehicle Type</Text>
        <View style={styles.chipWrap}>
          {(VEHICLE_TYPES as unknown as { value: string; label: string }[]).map((t) => (
            <FilterChip key={t.value} label={t.label} selected={selectedTypes.includes(t.value)} onPress={() => toggleType(t.value)} />
          ))}
        </View>

        <Text style={styles.label}>Transmission</Text>
        <View style={styles.chipWrap}>
          {(TRANSMISSION_TYPES as unknown as { value: string; label: string }[]).map((t) => (
            <FilterChip key={t.value} label={t.label} selected={selectedTransmission.includes(t.value)} onPress={() => toggleTransmission(t.value)} />
          ))}
        </View>

        <Text style={styles.label}>Fuel Type</Text>
        <View style={styles.chipWrap}>
          {(FUEL_TYPES as unknown as { value: string; label: string }[]).map((f) => (
            <FilterChip key={f.value} label={f.label} selected={selectedFuel.includes(f.value)} onPress={() => toggleFuel(f.value)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing['4'] },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing['4'] },
  title: { ...typography.h4, color: colors.textPrimary },
  clear: { ...typography.labelMedium, color: colors.primary },
  label: { ...typography.labelMedium, color: colors.textPrimary, marginBottom: spacing['2'], marginTop: spacing['3'] },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'] },
});

export default VehicleFilters;
