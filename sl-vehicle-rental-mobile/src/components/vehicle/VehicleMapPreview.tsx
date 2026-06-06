import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface VehicleMapPreviewProps {
  location: { lat?: number; lng?: number; address?: string; city?: string };
  onPress: () => void;
}

export const VehicleMapPreview: React.FC<VehicleMapPreviewProps> = ({ location, onPress }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <View style={styles.mapPlaceholder}>
      <Ionicons name="map-outline" size={32} color={colors.textTertiary} />
      <Text style={styles.placeholderText}>Map View</Text>
    </View>
    <View style={styles.content}>
      <Ionicons name="location" size={18} color={colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.address}>{location.address || 'Address not specified'}</Text>
        <Text style={styles.city}>{location.city || 'Colombo'}</Text>
      </View>
      <Ionicons name="arrow-forward" size={18} color={colors.primary} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { marginVertical: spacing['4'] },
  mapPlaceholder: {
    height: 140, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
    borderTopLeftRadius: 12, borderTopRightRadius: 12,
  },
  placeholderText: { ...typography.bodyMedium, color: colors.textTertiary, marginTop: 4 },
  content: {
    flexDirection: 'row', alignItems: 'center', gap: spacing['2'],
    padding: spacing['3'], backgroundColor: colors.surface,
    borderBottomLeftRadius: 12, borderBottomRightRadius: 12, borderWidth: 1, borderTopWidth: 0, borderColor: colors.border,
  },
  address: { ...typography.labelMedium, color: colors.textPrimary },
  city: { ...typography.bodySmall, color: colors.textSecondary },
});

export default VehicleMapPreview;
