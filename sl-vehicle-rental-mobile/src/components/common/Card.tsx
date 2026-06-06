import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/radii';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevated?: boolean;
  bordered?: boolean;
}

const paddingMap = {
  none: 0,
  sm: spacing['3'],
  md: spacing['4'],
  lg: spacing['6'],
};

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  padding = 'md',
  elevated = true,
  bordered = false,
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: paddingMap[padding],
    ...(elevated ? shadows.card : {}),
    ...(bordered ? { borderWidth: 1, borderColor: colors.border } : {}),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
