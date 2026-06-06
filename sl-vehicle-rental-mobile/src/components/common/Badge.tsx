import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radii } from '../../theme/radii';
import { spacing } from '../../theme/spacing';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info' | 'accent' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  default: { bg: colors.backgroundPrimary, text: colors.primary },
  success: { bg: colors.backgroundSuccess, text: colors.success },
  warning: { bg: colors.backgroundWarning, text: colors.warning },
  destructive: { bg: colors.backgroundDestructive, text: colors.destructive },
  info: { bg: colors.backgroundInfo, text: colors.info },
  accent: { bg: colors.accentLight, text: colors.accentDark },
  outline: { bg: colors.transparent, text: colors.primary, border: colors.primary },
};

const sizeStyles = {
  sm: { paddingV: 2, paddingH: 8, fontSize: 10 },
  md: { paddingV: 4, paddingH: 10, fontSize: 12 },
  lg: { paddingV: 6, paddingH: 14, fontSize: 14 },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  dot = false,
  style,
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyle.bg,
          paddingVertical: sizeStyle.paddingV,
          paddingHorizontal: sizeStyle.paddingH,
          borderWidth: variantStyle.border ? 1 : 0,
          borderColor: variantStyle.border || 'transparent',
        },
        style,
      ]}
    >
      {dot && (
        <View
          style={[
            styles.dot,
            { backgroundColor: variantStyle.text },
          ]}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: variantStyle.text, fontSize: sizeStyle.fontSize },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.badge,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing['1'],
  },
  label: {
    ...typography.labelSmall,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
