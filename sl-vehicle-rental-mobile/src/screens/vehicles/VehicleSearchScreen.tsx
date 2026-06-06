import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterChip } from '../../components/common/FilterChip';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useVehicles } from '../../hooks/useVehicles';
import { formatCurrency } from '../../utils/currency';
import { VEHICLE_TYPES, TRANSMISSION_TYPES, FUEL_TYPES, SRI_LANKAN_CITIES } from '../../utils/constants';

interface VehicleSearchScreenProps {
  navigation: any;
}

const VehicleSearchScreen: React.FC<VehicleSearchScreenProps> = ({ navigation }) => {
  const { vehicles, search, isLoading } = useVehicles();
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([]);
  const [selectedFuel, setSelectedFuel] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [hasSearched, setHasSearched] = useState(false);

  const toggleFilter = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const handleSearch = useCallback(() => {
    setHasSearched(true);
    search({
      query: query || undefined,
      type: selectedTypes.length > 0 ? selectedTypes : undefined,
      transmission: selectedTransmission.length > 0 ? selectedTransmission : undefined,
      fuelType: selectedFuel.length > 0 ? selectedFuel : undefined,
      city: selectedCity || undefined,
      priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
      priceMax: priceRange[1] < 50000 ? priceRange[1] : undefined,
    });
  }, [query, selectedTypes, selectedTransmission, selectedFuel, selectedCity, priceRange]);

  const clearFilters = () => {
    setQuery('');
    setSelectedTypes([]);
    setSelectedTransmission([]);
    setSelectedFuel([]);
    setSelectedCity(null);
    setPriceRange([0, 50000]);
    setHasSearched(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, brand, model..."
          onSubmit={handleSearch}
          loading={isLoading}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
        <Text style={styles.filterSectionTitle}>Vehicle Type</Text>
        <View style={styles.chipWrap}>
          {(VEHICLE_TYPES as unknown as { value: string; label: string }[]).map((item) => (
            <FilterChip key={item.value} label={item.label} selected={selectedTypes.includes(item.value)}
              onPress={() => toggleFilter(selectedTypes, setSelectedTypes, item.value)} />
          ))}
        </View>

        <Text style={styles.filterSectionTitle}>Transmission</Text>
        <View style={styles.chipWrap}>
          {(TRANSMISSION_TYPES as unknown as { value: string; label: string }[]).map((item) => (
            <FilterChip key={item.value} label={item.label} selected={selectedTransmission.includes(item.value)}
              onPress={() => toggleFilter(selectedTransmission, setSelectedTransmission, item.value)} />
          ))}
        </View>

        <Text style={styles.filterSectionTitle}>Fuel Type</Text>
        <View style={styles.chipWrap}>
          {(FUEL_TYPES as unknown as { value: string; label: string }[]).map((item) => (
            <FilterChip key={item.value} label={item.label} selected={selectedFuel.includes(item.value)}
              onPress={() => toggleFilter(selectedFuel, setSelectedFuel, item.value)} />
          ))}
        </View>

        <Text style={styles.filterSectionTitle}>City</Text>
        <View style={styles.chipWrap}>
          {SRI_LANKAN_CITIES.slice(0, 8).map((city) => (
            <FilterChip key={city} label={city} selected={selectedCity === city}
              onPress={() => setSelectedCity(selectedCity === city ? null : city)} />
          ))}
        </View>

        <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
          <Text style={styles.clearBtnText}>Clear All Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.applyBtn} onPress={handleSearch}>
          <Text style={styles.applyBtnText}>Search Vehicles</Text>
        </TouchableOpacity>
      </ScrollView>

      {hasSearched && !isLoading && vehicles.length === 0 && (
        <EmptyState icon="search-outline" title="No results" message="Try different filters or search terms" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchHeader: { paddingHorizontal: spacing['4'], paddingTop: spacing['3'], backgroundColor: colors.surface },
  filtersContainer: { padding: spacing['4'] },
  filterSectionTitle: { ...typography.labelMedium, color: colors.textPrimary, marginBottom: spacing['2'], marginTop: spacing['3'] },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'] },
  clearBtn: {
    marginTop: spacing['6'], paddingVertical: spacing['3'], alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, borderRadius: 12,
  },
  clearBtnText: { ...typography.labelMedium, color: colors.textSecondary },
  applyBtn: {
    marginTop: spacing['3'], paddingVertical: spacing['3'], alignItems: 'center',
    backgroundColor: colors.primary, borderRadius: 12, marginBottom: spacing['6'],
  },
  applyBtnText: { ...typography.labelMedium, color: colors.primaryForeground },
});

export default VehicleSearchScreen;
export { VehicleSearchScreen };
