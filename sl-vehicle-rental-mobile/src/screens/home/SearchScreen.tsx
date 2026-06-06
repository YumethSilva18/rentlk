import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterChip } from '../../components/common/FilterChip';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useVehicles } from '../../hooks/useVehicles';
import { VEHICLE_TYPES, SORT_OPTIONS } from '../../utils/constants';

interface SearchScreenProps {
  navigation: any;
  route: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { vehicles, search, isLoading } = useVehicles();
  const [query, setQuery] = useState(route?.params?.query || '');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    if (query) search({ query });
  }, [query]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: spacing['2'] }}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search vehicles..."
            onSubmit={() => search({ query })} loading={isLoading} />
        </View>
      </View>

      <FlatList
        horizontal
        data={VEHICLE_TYPES as unknown as { value: string; label: string }[]}
        keyExtractor={(item) => item.value}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <FilterChip
            label={item.label}
            selected={selectedTypes.includes(item.value)}
            onPress={() => toggleType(item.value)}
          />
        )}
      />

      {isLoading ? (
        <Loader message="Searching..." />
      ) : vehicles.length === 0 ? (
        <EmptyState title="No vehicles found" message="Try adjusting your search or filters" />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
            >
              <Text style={styles.resultName}>{item.name || `${item.brand} ${item.model}`}</Text>
              <Text style={styles.resultMeta}>{item.type} · {item.location || 'Colombo'}</Text>
              <Text style={styles.resultPrice}>Rs. {item.dailyRate || item.price || 0}/day</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing['3'], paddingVertical: spacing['2'], backgroundColor: colors.surface },
  backBtn: { padding: spacing['2'] },
  filterRow: { paddingHorizontal: spacing['4'], paddingVertical: spacing['3'], gap: spacing['2'] },
  list: { padding: spacing['4'], gap: spacing['3'] },
  resultCard: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing['4'], borderWidth: 1, borderColor: colors.border },
  resultName: { ...typography.labelLarge, color: colors.textPrimary },
  resultMeta: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  resultPrice: { ...typography.labelMedium, color: colors.primary, marginTop: 8 },
});
