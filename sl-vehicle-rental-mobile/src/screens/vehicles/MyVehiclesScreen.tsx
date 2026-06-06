import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useVehicles } from '../../hooks/useVehicles';
import { vehicleService } from '../../services/vehicle.service';
import { formatCurrency } from '../../utils/currency';
import type { Vehicle } from '../../types/vehicle.types';

interface MyVehiclesScreenProps {
  navigation: any;
}

const statusVariant: Record<string, 'success' | 'warning' | 'destructive' | 'default'> = {
  active: 'success', pending: 'warning', rejected: 'destructive', inactive: 'default',
};

const MyVehiclesScreen: React.FC<MyVehiclesScreenProps> = ({ navigation }) => {
  const { myVehicles, fetchMyVehicles, isLoading } = useVehicles();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMyVehicles();
    setRefreshing(false);
  }, [fetchMyVehicles]);

  const handleDelete = (vehicle: Vehicle) => {
    Alert.alert('Delete Vehicle', `Remove "${vehicle.title || `${vehicle.brand} ${vehicle.model}`}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await vehicleService.delete(vehicle.id);
            fetchMyVehicles();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerAction}>
        <Button title="+ Add Vehicle" variant="primary" size="md"
          onPress={() => navigation.navigate('AddVehicle')} />
      </View>

      {isLoading && myVehicles.length === 0 ? (
        <Loader message="Loading your vehicles..." />
      ) : myVehicles.length === 0 ? (
        <EmptyState
          icon="car-outline"
          title="No vehicles listed"
          message="Add your first vehicle to start earning"
          actionLabel="Add Vehicle"
          onAction={() => navigation.navigate('AddVehicle')}
        />
      ) : (
        <FlatList
          data={myVehicles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: item.images?.[0] || 'https://placehold.co/120x90?text=Vehicle' }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title || `${item.brand} ${item.model}`}
                  </Text>
                  <Badge label={item.status} variant={statusVariant[item.status] || 'default'} size="sm" />
                </View>
                <Text style={styles.cardMeta}>{item.type} · {item.transmission} · {item.year}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.cardPrice}>{formatCurrency(item.dailyRate)}/day</Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => navigation.navigate('EditVehicle', { vehicleId: item.id })}
                    >
                      <Ionicons name="create-outline" size={18} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item)}>
                      <Ionicons name="trash-outline" size={18} color={colors.destructive} />
                    </TouchableOpacity>
                  </View>
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
  headerAction: { paddingHorizontal: spacing['4'], paddingVertical: spacing['3'], backgroundColor: colors.surface },
  list: { padding: spacing['4'], gap: spacing['3'] },
  card: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 12,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.border,
  },
  cardImage: { width: 120, height: 100 },
  cardContent: { flex: 1, padding: spacing['3'], justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { ...typography.labelMedium, color: colors.textPrimary, flex: 1, marginRight: spacing['2'] },
  cardMeta: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing['1'] },
  cardPrice: { ...typography.labelMedium, color: colors.primary },
  cardActions: { flexDirection: 'row', gap: spacing['2'] },
  actionBtn: { padding: spacing['2'], borderRadius: 8, backgroundColor: colors.background },
});

export default MyVehiclesScreen;
export { MyVehiclesScreen };
