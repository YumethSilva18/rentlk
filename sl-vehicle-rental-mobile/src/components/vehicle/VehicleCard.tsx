import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Badge } from '../common/Badge';
import { formatCurrency } from '../../utils/currency';
import type { Vehicle } from '../../types/vehicle.types';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  variant?: 'default' | 'compact' | 'horizontal';
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPress, variant = 'default' }) => {
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.8}>
        <Image
          source={{ uri: vehicle.images?.[0] || 'https://placehold.co/120x90?text=Vehicle' }}
          style={styles.horizontalImage}
          resizeMode="cover"
        />
        <View style={styles.horizontalContent}>
          <Text style={styles.horizontalTitle} numberOfLines={1}>
            {vehicle.title || `${vehicle.brand} ${vehicle.model}`}
          </Text>
          <View style={styles.horizontalMeta}>
            <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
            <Text style={styles.horizontalLocation}>{vehicle.location?.city || 'Colombo'}</Text>
          </View>
          <View style={styles.horizontalBottom}>
            <View style={styles.horizontalRating}>
              <Ionicons name="star" size={13} color={colors.accent} />
              <Text style={styles.horizontalRatingText}>{vehicle.rating?.toFixed(1) || '4.5'}</Text>
            </View>
            <Text style={styles.horizontalPrice}>{formatCurrency(vehicle.dailyRate)}/day</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.8}>
        <Image
          source={{ uri: vehicle.images?.[0] || 'https://placehold.co/160x120?text=Vehicle' }}
          style={styles.compactImage}
          resizeMode="cover"
        />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {vehicle.title || `${vehicle.brand} ${vehicle.model}`}
          </Text>
          <Text style={styles.compactPrice}>{formatCurrency(vehicle.dailyRate)}/day</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: vehicle.images?.[0] || 'https://placehold.co/400x250?text=Vehicle' }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.typeBadge}>
        <Text style={styles.typeBadgeText}>{vehicle.type}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {vehicle.title || `${vehicle.brand} ${vehicle.model}`}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.metaText}>{vehicle.location?.city || 'Colombo'}</Text>
          <Text style={styles.dot}>·</Text>
          <Ionicons name="speedometer-outline" size={13} color={colors.textSecondary} />
          <Text style={styles.metaText}>{vehicle.transmission}</Text>
        </View>
        <View style={styles.bottom}>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.accent} />
            <Text style={styles.ratingText}>{vehicle.rating?.toFixed(1) || '4.5'}</Text>
            <Text style={styles.reviewCount}>({vehicle.totalReviews})</Text>
          </View>
          <Text style={styles.price}>
            {formatCurrency(vehicle.dailyRate)}
            <Text style={styles.priceUnit}>/day</Text>
          </Text>
        </View>
        {!vehicle.isAvailable && (
          <Badge label="Unavailable" variant="destructive" size="sm" style={styles.availabilityBadge} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Default
  card: {
    backgroundColor: colors.surface, borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  cardImage: { width: '100%', height: 180 },
  typeBadge: {
    position: 'absolute', top: 8, left: 8, backgroundColor: colors.primary,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  typeBadgeText: { ...typography.caption, color: colors.primaryForeground, textTransform: 'capitalize' },
  cardContent: { padding: spacing['3'] },
  cardTitle: { ...typography.labelMedium, color: colors.textPrimary },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  metaText: { ...typography.bodySmall, color: colors.textSecondary },
  dot: { ...typography.bodySmall, color: colors.textTertiary },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing['2'] },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { ...typography.labelSmall, color: colors.textPrimary },
  reviewCount: { ...typography.caption, color: colors.textTertiary },
  price: { ...typography.labelMedium, color: colors.primary },
  priceUnit: { ...typography.caption, color: colors.textSecondary, fontWeight: '400' },
  availabilityBadge: { position: 'absolute', top: 8, right: 8 },

  // Compact
  compactCard: { width: 160, backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  compactImage: { width: '100%', height: 110 },
  compactContent: { padding: spacing['2'] },
  compactTitle: { ...typography.labelSmall, color: colors.textPrimary },
  compactPrice: { ...typography.labelSmall, color: colors.primary, marginTop: 4 },

  // Horizontal
  horizontalCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  horizontalImage: { width: 120, height: 100 },
  horizontalContent: { flex: 1, padding: spacing['3'] },
  horizontalTitle: { ...typography.labelMedium, color: colors.textPrimary },
  horizontalMeta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  horizontalLocation: { ...typography.bodySmall, color: colors.textSecondary },
  horizontalBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing['2'] },
  horizontalRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  horizontalRatingText: { ...typography.bodySmall, color: colors.textSecondary },
  horizontalPrice: { ...typography.labelSmall, color: colors.primary },
});

export default VehicleCard;
