import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useVehicles } from '../../hooks/useVehicles';
import { formatCurrency } from '../../utils/currency';
import type { Vehicle } from '../../types/vehicle.types';

interface SavedVehiclesScreenProps {
  navigation: any;
}

const SavedVehiclesScreen: React.FC<SavedVehiclesScreenProps> = ({ navigation }) => {
  const { myVehicles: allVehicles, fetchMyVehicles, toggleSave, isSaved, isLoading } = useVehicles();
  const [refreshing, setRefreshing] = useState(false);
  const savedVehicles = allVehicles.filter((v: Vehicle) => isSaved(v.id));

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMyVehicles();
    setRefreshing(false);
  }, [fetchMyVehicles]);

  return (
    <View style={styles.container}>
      {isLoading && savedVehicles.length === 0 ? (
        <Loader message="Loading saved vehicles..." />
      ) : savedVehicles.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="No saved vehicles"
          message="Tap the heart icon on vehicles you like to save them here"
          actionLabel="Browse Vehicles"
          onAction={() => navigation.navigate('VehicleList')}
        />
      ) : (
        <FlatList
          data={savedVehicles}
          keyExtractor={(item: Vehicle) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
          renderItem={({ item }: { item: Vehicle }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.images?.[0] || 'https://placehold.co/400x250?text=Vehicle' }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.title || `${item.brand} ${item.model}`}
                </Text>
                <View style={styles.cardMeta}>
                  <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
                  <Text style={styles.cardLocation}>{item.location?.city || 'Colombo'}</Text>
                  <Text style={styles.dot}>·</Text>
                  <Ionicons name="star" size={13} color={colors.accent} />
                  <Text style={styles.rating}>{item.rating?.toFixed(1) || '4.5'}</Text>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.cardPrice}>
                    {formatCurrency(item.dailyRate)}
                    <Text style={styles.priceUnit}>/day</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.unsaveBtn}
                    onPress={() => toggleSave(item.id)}
                  >
                    <Ionicons name="heart-dislike-outline" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing['4'], gap: spacing['3'] },
  card: {
    backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  cardImage: { width: '100%', height: 180 },
  cardContent: { padding: spacing['3'] },
  cardTitle: { ...typography.labelMedium, color: colors.textPrimary },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  cardLocation: { ...typography.bodySmall, color: colors.textSecondary },
  dot: { ...typography.bodySmall, color: colors.textTertiary },
  rating: { ...typography.bodySmall, color: colors.textSecondary },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing['2'] },
  cardPrice: { ...typography.labelMedium, color: colors.primary },
  priceUnit: { ...typography.caption, color: colors.textSecondary, fontWeight: '400' },
  unsaveBtn: { padding: spacing['2'], borderRadius: 8, backgroundColor: colors.background },
});

export default SavedVehiclesScreen;
export { SavedVehiclesScreen };
