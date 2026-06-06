import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radii } from '../../theme/radii';
import { spacing } from '../../theme/spacing';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  selected = false,
  onPress,
  onRemove,
  icon,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected ? styles.selected : null,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? colors.surface : colors.textSecondary}
        />
      )}
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : null,
        ]}
      >
        {label}
      </Text>
      {onRemove && selected && (
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <Ionicons name="close" size={14} color={colors.surface} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing['2'],
    paddingHorizontal: spacing['3'],
    borderRadius: radii.chip,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing['1.5'],
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    ...typography.labelSmall,
    color: colors.textSecondary,
  },
  labelSelected: {
    color: colors.textInverse,
  },
  removeBtn: {
    marginLeft: spacing['1'],
  },
});
