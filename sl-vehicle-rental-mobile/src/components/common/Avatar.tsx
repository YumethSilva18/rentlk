import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { radii } from '../../theme/radii';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  showBorder?: boolean;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 44,
  lg: 64,
  xl: 96,
};

const fontSizeMap: Record<AvatarSize, number> = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 36,
};

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function getColorFromName(name?: string): string {
  const palette = [
    '#001F3F', '#003366', '#335F83', '#D4AF37',
    '#2ECC40', '#0074D9', '#FF851B', '#85144b',
  ];
  if (!name) return palette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'md',
  style,
  showBorder = false,
}) => {
  const dimension = sizeMap[size];
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: radii.avatar,
    overflow: 'hidden',
    ...(showBorder
      ? { borderWidth: 2, borderColor: colors.surface }
      : {}),
  };

  if (uri) {
    return (
      <View style={[containerStyle, style]}>
        <Image
          source={{ uri }}
          style={{ width: dimension, height: dimension }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View
      style={[
        containerStyle,
        { backgroundColor: bgColor, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      <Text
        style={[
          styles.initials,
          { fontSize: fontSizeMap[size], color: colors.textInverse },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  initials: {
    ...typography.labelMedium,
    fontWeight: '700',
  },
});
