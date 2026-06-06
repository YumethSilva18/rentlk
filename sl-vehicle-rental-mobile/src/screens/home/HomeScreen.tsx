import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { SearchBar } from '../../components/common/SearchBar';
import { SectionHeader } from '../../components/common/SectionHeader';
import { FilterChip } from '../../components/common/FilterChip';
import { useVehicles } from '../../hooks/useVehicles';
import { useAuth } from '../../hooks/useAuth';
import { VEHICLE_TYPES } from '../../utils/constants';
import { formatCurrency } from '../../utils/currency';

interface HomeScreenProps {
  navigation: any;
}

const categories = [
  { icon: 'car-outline', label: 'Cars', type: 'car' },
  { icon: 'car-sport-outline', label: 'SUVs', type: 'suv' },
  { icon: 'bus-outline', label: 'Vans', type: 'van' },
  { icon: 'bicycle-outline', label: 'Bikes', type: 'motorcycle' },
  { icon: 'walk-outline', label: 'Scooters', type: 'scooter' },
  { icon: 'diamond-outline', label: 'Luxury', type: 'luxury' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { vehicles, search: fetchVehicles, isLoading: loading } = useVehicles();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    fetchVehicles({ limit: 10 });
  }, []);

  const featuredVehicles = vehicles.slice(0, 6);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.firstName || 'Guest'}</Text>
          <Text style={styles.headerSubtitle}>Find your perfect ride</Text>
        </View>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search vehicles, locations..."
          onSubmit={() => navigation.navigate('Search', { query: searchQuery })}
        />

        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.type}
              style={[styles.categoryItem, selectedType === cat.type ? styles.categorySelected : null]}
              onPress={() => {
                setSelectedType(cat.type === selectedType ? null : cat.type);
                navigation.navigate('VehicleList', { type: cat.type });
              }}
            >
              <View style={[styles.categoryIcon, selectedType === cat.type ? styles.categoryIconSelected : null]}>
                <Ionicons
                  name={cat.icon}
                  size={24}
                  color={selectedType === cat.type ? colors.surface : colors.primary}
                />
              </View>
              <Text style={[styles.categoryLabel, selectedType === cat.type ? styles.categoryLabelSelected : null]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionHeader title="Featured Vehicles" actionLabel="See All" onAction={() => navigation.navigate('VehicleList')} />
        <FlatList
          data={featuredVehicles}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.featuredList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.images?.[0] || 'https://placehold.co/300x200?text=Vehicle' }}
                style={styles.featuredImage}
                resizeMode="cover"
              />
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredName}>{item.name || `${item.brand} ${item.model}`}</Text>
                <View style={styles.featuredMeta}>
                  <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                  <Text style={styles.featuredLocation}>{item.location || 'Colombo'}</Text>
                </View>
                <View style={styles.featuredBottom}>
                  <View style={styles.featuredRating}>
                    <Ionicons name="star" size={14} color={colors.accent} />
                    <Text style={styles.ratingText}>{item.rating || '4.5'}</Text>
                  </View>
                  <Text style={styles.featuredPrice}>
                    {formatCurrency(item.dailyRate || item.price || 0)}
                    <Text style={styles.priceUnit}>/day</Text>
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <SectionHeader title="Nearby Vehicles" actionLabel="See All" onAction={() => navigation.navigate('VehicleList')} />
        <FlatList
          data={vehicles.slice(0, 4)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.featuredList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.nearbyCard}
              onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.images?.[0] || 'https://placehold.co/200x140?text=Vehicle' }}
                style={styles.nearbyImage}
                resizeMode="cover"
              />
              <Text style={styles.nearbyName} numberOfLines={1}>{item.name || `${item.brand} ${item.model}`}</Text>
              <Text style={styles.nearbyPrice}>{formatCurrency(item.dailyRate || item.price || 0)}/day</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing['4'], paddingVertical: spacing['3'], backgroundColor: colors.surface,
  },
  greeting: { ...typography.h3, color: colors.textPrimary },
  headerSubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  notifBtn: { padding: spacing['2'] },
  scrollContent: { paddingBottom: spacing['6'] },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, paddingHorizontal: spacing['4'], marginTop: spacing['4'], marginBottom: spacing['3'] },
  categoriesRow: { paddingHorizontal: spacing['4'], gap: spacing['3'] },
  categoryItem: { alignItems: 'center', gap: spacing['2'], width: 64 },
  categorySelected: {},
  categoryIcon: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border,
  },
  categoryIconSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryLabel: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center' },
  categoryLabelSelected: { color: colors.primary, fontWeight: '600' },
  featuredList: { paddingHorizontal: spacing['4'], gap: spacing['3'] },
  featuredCard: {
    width: 260, backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  featuredImage: { width: '100%', height: 160 },
  featuredInfo: { padding: spacing['3'] },
  featuredName: { ...typography.labelMedium, color: colors.textPrimary, marginBottom: spacing['1'] },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing['2'] },
  featuredLocation: { ...typography.bodySmall, color: colors.textSecondary },
  featuredBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { ...typography.labelSmall, color: colors.textPrimary },
  featuredPrice: { ...typography.labelLarge, color: colors.primary },
  priceUnit: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '400' },
  nearbyCard: { width: 160, backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  nearbyImage: { width: '100%', height: 110 },
  nearbyName: { ...typography.labelSmall, color: colors.textPrimary, paddingHorizontal: spacing['2'], paddingTop: spacing['2'] },
  nearbyPrice: { ...typography.labelMedium, color: colors.primary, paddingHorizontal: spacing['2'], paddingBottom: spacing['2'] },
});
