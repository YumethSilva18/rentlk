import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { FilterChip } from '../../components/common/FilterChip';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useVehicles } from '../../hooks/useVehicles';
import { formatCurrency } from '../../utils/currency';
import { VEHICLE_TYPES, SORT_OPTIONS } from '../../utils/constants';
import type { Vehicle } from '../../types/vehicle.types';

interface VehicleListScreenProps {
  navigation: any;
  route: any;
}

const VehicleCard: React.FC<{ vehicle: Vehicle; onPress: () => void }> = ({ vehicle, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <Image
      source={{ uri: vehicle.images?.[0] || 'https://placehold.co/400x250?text=Vehicle' }}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.cardBadge}>
      <Text style={styles.cardBadgeText}>{vehicle.type}</Text>
    </View>
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={1}>{vehicle.title || `${vehicle.brand} ${vehicle.model}`}</Text>
      <View style={styles.cardMeta}>
        <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
        <Text style={styles.cardLocation}>{vehicle.location?.city || 'Colombo'}</Text>
        <Text style={styles.cardDot}>·</Text>
        <Ionicons name="speedometer-outline" size={13} color={colors.textSecondary} />
        <Text style={styles.cardMetaText}>{vehicle.transmission}</Text>
      </View>
      <View style={styles.cardBottom}>
        <View style={styles.cardRating}>
          <Ionicons name="star" size={14} color={colors.accent} />
          <Text style={styles.ratingText}>{vehicle.rating?.toFixed(1) || '4.5'}</Text>
          <Text style={styles.reviewCount}>({vehicle.totalReviews})</Text>
        </View>
        <Text style={styles.cardPrice}>
          {formatCurrency(vehicle.dailyRate)}
          <Text style={styles.priceUnit}>/day</Text>
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const VehicleListScreen: React.FC<VehicleListScreenProps> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { vehicles, search, setFilters, isLoading, total } = useVehicles();
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    route?.params?.filters?.type ? [route.params.filters.type] : []
  );
  const [sortBy, setSortBy] = useState('recommended');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const typeFilter = route?.params?.filters?.type;
    search(typeFilter ? { type: [typeFilter] } : {});
  }, [route?.params]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await search(selectedTypes.length > 0 ? { type: selectedTypes, sortBy } : { sortBy });
    setRefreshing(false);
  }, [selectedTypes, sortBy]);

  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    search({ type: newTypes.length > 0 ? newTypes : undefined, sortBy });
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.sortRow}>
        <Text style={styles.resultCount}>{total || vehicles.length} vehicles found</Text>
        <TouchableOpacity style={styles.sortBtn} onPress={() => {
          const idx = SORT_OPTIONS.findIndex((o) => o.value === sortBy);
          const next = SORT_OPTIONS[(idx + 1) % SORT_OPTIONS.length];
          setSortBy(next.value);
          search({ sortBy: next.value, type: selectedTypes.length > 0 ? selectedTypes : undefined });
        }}>
          <Ionicons name="swap-vertical-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.sortText}>{SORT_OPTIONS.find((o) => o.value === sortBy)?.label}</Text>
        </TouchableOpacity>
      </View>

      {isLoading && vehicles.length === 0 ? (
        <Loader message="Loading vehicles..." />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon="car-outline"
          title="No vehicles found"
          message="Try adjusting your filters or search criteria"
        />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
          renderItem={({ item }) => (
            <VehicleCard
              vehicle={item}
              onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterRow: { paddingHorizontal: spacing['4'], paddingTop: spacing['3'], gap: spacing['2'] },
  sortRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing['4'], paddingVertical: spacing['3'],
  },
  resultCount: { ...typography.bodyMedium, color: colors.textSecondary },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { ...typography.labelSmall, color: colors.textSecondary },
  grid: { paddingHorizontal: spacing['4'], paddingBottom: spacing['6'] },
  gridRow: { gap: spacing['3'] },
  card: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing['3'],
  },
  cardImage: { width: '100%', height: 130 },
  cardBadge: {
    position: 'absolute', top: 8, left: 8, backgroundColor: colors.primary,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  cardBadgeText: { ...typography.caption, color: colors.primaryForeground, textTransform: 'capitalize' },
  cardContent: { padding: spacing['3'] },
  cardTitle: { ...typography.labelMedium, color: colors.textPrimary },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  cardLocation: { ...typography.bodySmall, color: colors.textSecondary },
  cardDot: { ...typography.bodySmall, color: colors.textTertiary },
  cardMetaText: { ...typography.bodySmall, color: colors.textSecondary, textTransform: 'capitalize' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing['2'] },
  cardRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { ...typography.labelSmall, color: colors.textPrimary },
  reviewCount: { ...typography.caption, color: colors.textTertiary },
  cardPrice: { ...typography.labelMedium, color: colors.primary },
  priceUnit: { ...typography.caption, color: colors.textSecondary, fontWeight: '400' },
});

export default VehicleListScreen;
export { VehicleListScreen };
