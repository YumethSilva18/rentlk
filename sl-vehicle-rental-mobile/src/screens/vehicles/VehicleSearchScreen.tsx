import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@/components/layout/ScreenWrapper';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { VehicleFilters } from '@/components/vehicle/VehicleFilters';
import { SearchBar } from '@/components/common/SearchBar';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { colors, typography, spacing, radii } from '@/theme';
import type { MainScreenProps } from '@/types/navigation.types';
import type { Vehicle } from '@/types/vehicle.types';

type Props = MainScreenProps<'VehicleList'>;

export const VehicleListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { filters } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [vehicles] = useState([
    {
      id: '1',
      name: 'Toyota Prius',
      type: 'Sedan',
      pricePerDay: 5000,
      rating: 4.8,
      image: null,
      location: 'Colombo',
      transmission: 'Auto',
      fuelType: 'Hybrid',
      seats: 5,
    },
    {
      id: '2',
      name: 'Honda Vezel',
      type: 'SUV',
      pricePerDay: 7000,
      rating: 4.6,
      image: null,
      location: 'Kandy',
      transmission: 'Auto',
      fuelType: 'Petrol',
      seats: 5,
    },
  ]);

  const filteredVehicles = vehicles.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Browse Vehicles</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search by name or type..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Loader />
          </View>
        ) : (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
              </Text>
            </View>

            {filteredVehicles.length === 0 ? (
              <EmptyState
                icon="car-outline"
                title="No Vehicles Found"
              />
            ) : (
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {filteredVehicles.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.id}
                    onPress={() => navigation.navigate('VehicleDetail', { vehicleId: vehicle.id })}
                  >
                    <VehicleCard
                      vehicle={vehicle as any}
                      onPress={() => navigation.navigate('VehicleDetail', { vehicleId: vehicle.id })}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </>
        )}


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
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing['4'],
    gap: spacing['3'],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    ...typography.h2,
    color: colors.textPrimary,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing['4'],
    paddingBottom: spacing['2'],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  resultsHeader: {
    paddingHorizontal: spacing['4'],
    paddingVertical: spacing['2'],
  },
  resultsCount: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing['4'],
    paddingTop: 0,
    gap: spacing['3'],
  },
});
