import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/currency';

interface VehicleActionBarProps {
  dailyRate: number;
  onBook: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  onMessage?: () => void;
}

export const VehicleActionBar: React.FC<VehicleActionBarProps> = ({
  dailyRate, onBook, onSave, isSaved, onMessage
}) => (
  <View style={styles.container}>
    <View style={styles.priceSection}>
      <Text style={styles.priceLabel}>Total</Text>
      <Text style={styles.price}>{formatCurrency(dailyRate)}</Text>
      <Text style={styles.priceUnit}>per day</Text>
    </View>

    <View style={styles.actions}>
      {onSave && (
        <View style={styles.saveBtn}>
          <Button
            title=""
            variant="outline"
            size="md"
            icon={
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={20}
                color={isSaved ? colors.destructive : colors.primary}
              />
            }
            onPress={onSave}
          />
        </View>
      )}

      {onMessage && (
        <Button
          title=""
          variant="outline"
          size="md"
          icon={<Ionicons name="chatbubble-outline" size={20} color={colors.primary} />}
          onPress={onMessage}
          style={styles.messageBtn}
        />
      )}

      <Button
        title="Book Now"
        variant="primary"
        size="lg"
        onPress={onBook}
        style={styles.bookBtn}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing['4'], paddingVertical: spacing['3'],
    backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
  },
  priceSection: {},
  priceLabel: { ...typography.caption, color: colors.textSecondary },
  price: { ...typography.h4, color: colors.primary },
  priceUnit: { ...typography.bodySmall, color: colors.textSecondary },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing['2'] },
  saveBtn: {},
  messageBtn: { paddingHorizontal: spacing['3'] },
  bookBtn: { minWidth: 140 },
});

export default VehicleActionBar;
