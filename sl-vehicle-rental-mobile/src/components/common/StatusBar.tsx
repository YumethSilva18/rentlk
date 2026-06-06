import React from 'react';
import { StatusBar as RNStatusBar, View, Text, StyleSheet, Platform, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

interface StatusBarProps {
  backgroundColor?: string;
  barStyle?: 'light-content' | 'dark-content';
  translucent?: boolean;
  style?: ViewStyle;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  backgroundColor = colors.primary,
  barStyle = 'light-content',
  translucent = false,
  style,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ backgroundColor }, style]}>
      <RNStatusBar
        backgroundColor={backgroundColor}
        barStyle={barStyle}
        translucent={translucent}
      />
    </View>
  );
};
