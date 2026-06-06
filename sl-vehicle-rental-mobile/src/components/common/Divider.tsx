import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  color?: string;
  thickness?: number;
  style?: ViewStyle;
}

const spacingMap = {
  none: 0,
  sm: spacing['2'],
  md: spacing['4'],
  lg: spacing['6'],
};

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  spacing: dividerSpacing = 'md',
  color = colors.border,
  thickness = 1,
  style,
}) => {
  const margin = spacingMap[dividerSpacing];

  const dividerStyle: ViewStyle = orientation === 'horizontal'
    ? {
        height: thickness,
        backgroundColor: color,
        marginVertical: margin,
      }
    : {
        width: thickness,
        backgroundColor: color,
        marginHorizontal: margin,
        alignSelf: 'stretch',
      };

  return <View style={[dividerStyle, style]} />;
};
