import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { Divider } from '../../components/common/Divider';
import { useVehicles } from '../../hooks/useVehicles';
import { formatCurrency } from '../../utils/currency';
import type { Vehicle } from '../../types/vehicle.types';

interface VehicleDetailScreenProps {
  navigation: any;
  route: any;
}

const { width } = Dimensions.get('window');

const VehicleDetailScreen: React.FC<VehicleDetailScreenProps> = ({ navigation, route }) => {
  const { vehicleId } = route.params;
  const { selectedVehicle: vehicle, getDetail, toggleSave, isSaved, isLoading } = useVehicles();
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    getDetail(vehicleId);
  }, [vehicleId]);

  if (isLoading || !vehicle) {
    return <Loader message="Loading vehicle details..." />;
  }

  const saved = isSaved(vehicle.id);

  const specItems = [
    { icon: 'car-outline' as const, label: 'Type', value: vehicle.type },
    { icon: 'speedometer-outline' as const, label: 'Transmission', value: vehicle.transmission },
    { icon: 'leaf-outline' as const, label: 'Fuel', value: vehicle.fuelType },
    { icon: 'people-outline' as const, label: 'Seats', value: String(vehicle.seats) },
    { icon: 'calendar-outline' as const, label: 'Year', value: String(vehicle.year) },
    { icon: 'shield-checkmark-outline' as const, label: 'Insurance', value: vehicle.insuranceExpiry ? 'Valid' : 'N/A' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / width);
              setImageIndex(idx);
            }}
          >
            {(vehicle.images?.length > 0 ? vehicle.images : ['https://placehold.co/400x280?text=Vehicle']).map((img, i) => (
              <Image key={i} source={{ uri: img }} style={styles.galleryImage} resizeMode="cover" />
            ))}
          </ScrollView>
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {imageIndex + 1}/{vehicle.images?.length || 1}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => toggleSave(vehicle.id)}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={24}
              color={saved ? colors.destructive : colors.surface}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Title & Price */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{vehicle.title || `${vehicle.brand} ${vehicle.model}`}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.location}>{vehicle.location?.address || vehicle.location?.city || 'Colombo'}</Text>
              </View>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.price}>{formatCurrency(vehicle.dailyRate)}</Text>
              <Text style={styles.priceUnit}>per day</Text>
            </View>
          </View>

          {/* Rating & Status */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={16} color={colors.accent} />
              <Text style={styles.ratingText}>{vehicle.rating?.toFixed(1) || '4.5'}</Text>
              <Text style={styles.reviewCount}>({vehicle.totalReviews} reviews)</Text>
            </View>
            <Badge
              label={vehicle.isAvailable ? 'Available' : 'Unavailable'}
              variant={vehicle.isAvailable ? 'success' : 'destructive'}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Owner Info */}
          <TouchableOpacity
            style={styles.ownerRow}
            onPress={() => navigation.navigate('NewMessage', { userId: vehicle.ownerId })}
          >
            <View style={styles.ownerAvatar}>
              {vehicle.ownerAvatar ? (
                <Image source={{ uri: vehicle.ownerAvatar }} style={styles.ownerImg} />
              ) : (
                <View style={styles.ownerInitials}>
                  <Text style={styles.ownerInitialsText}>{vehicle.ownerName?.charAt(0) || 'O'}</Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerName}>{vehicle.ownerName || 'Vehicle Owner'}</Text>
              <Text style={styles.ownerMeta}>Vehicle Owner</Text>
            </View>
            <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
          </TouchableOpacity>

          <Divider style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{vehicle.description || 'No description provided.'}</Text>

          <Divider style={styles.divider} />

          {/* Specifications */}
          <Text style={styles.sectionTitle}>Specifications</Text>
          <View style={styles.specsGrid}>
            {specItems.map((spec) => (
              <View key={spec.label} style={styles.specItem}>
                <View style={styles.specIcon}>
                  <Ionicons name={spec.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.specLabel}>{spec.label}</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>

          {/* Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresWrap}>
                {vehicle.features.map((feature) => (
                  <View key={feature} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <Text style={styles.bottomPriceLabel}>Total</Text>
          <Text style={styles.bottomPriceValue}>{formatCurrency(vehicle.dailyRate)}</Text>
        </View>
        <Button
          title="Book Now"
          variant="primary"
          size="lg"
          onPress={() => navigation.navigate('BookingCreate', { vehicleId: vehicle.id })}
          style={styles.bookBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  galleryContainer: { height: 280, position: 'relative' },
  galleryImage: { width, height: 280 },
  imageCounter: {
    position: 'absolute', bottom: 12, left: '50%', transform: [{ translateX: -20 }],
    backgroundColor: colors.overlay, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  imageCounterText: { ...typography.caption, color: colors.white },
  saveBtn: {
    position: 'absolute', top: 12, right: 12, width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: spacing['4'], backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { ...typography.h3, color: colors.textPrimary, flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  location: { ...typography.bodyMedium, color: colors.textSecondary },
  priceBox: { alignItems: 'flex-end' },
  price: { ...typography.h3, color: colors.primary },
  priceUnit: { ...typography.bodySmall, color: colors.textSecondary },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing['3'] },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { ...typography.labelMedium, color: colors.textPrimary },
  reviewCount: { ...typography.bodySmall, color: colors.textSecondary },
  divider: { marginVertical: spacing['4'] },
  ownerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing['3'] },
  ownerAvatar: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  ownerImg: { width: 44, height: 44 },
  ownerInitials: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  ownerInitialsText: { ...typography.labelMedium, color: colors.primaryForeground },
  ownerName: { ...typography.labelMedium, color: colors.textPrimary },
  ownerMeta: { ...typography.bodySmall, color: colors.textSecondary },
  sectionTitle: { ...typography.h4, color: colors.textPrimary, marginBottom: spacing['3'] },
  description: { ...typography.bodyMedium, color: colors.textSecondary, lineHeight: 22 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['3'] },
  specItem: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: spacing['2'], backgroundColor: colors.background, padding: spacing['3'], borderRadius: 10 },
  specIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  specLabel: { ...typography.bodySmall, color: colors.textSecondary },
  specValue: { ...typography.labelSmall, color: colors.textPrimary, marginLeft: 'auto' },
  featuresWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing['2'] },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 4, width: '47%' },
  featureText: { ...typography.bodyMedium, color: colors.textSecondary },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing['4'], paddingVertical: spacing['3'],
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
  },
  bottomPrice: {},
  bottomPriceLabel: { ...typography.caption, color: colors.textSecondary },
  bottomPriceValue: { ...typography.h4, color: colors.primary },
  bookBtn: { minWidth: 160 },
});

export default VehicleDetailScreen;
export { VehicleDetailScreen };
