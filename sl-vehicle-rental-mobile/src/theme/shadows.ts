// ============================================================================
// RentLK Design System - Shadows
// Matching web boxShadow definitions
// ============================================================================

import { Platform, ViewStyle } from 'react-native';

function createShadow(
  offsetX: number,
  offsetY: number,
  blur: number,
  color: string,
  opacity: number
): ViewStyle {
  if (Platform.OS === 'android') {
    return {
      elevation: Math.ceil(blur / 2),
      shadowColor: color,
    };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur,
  };
}

export const shadows = {
  none: {} as ViewStyle,
  sm: createShadow(0, 1, 2, '#000000', 0.05),
  card: createShadow(0, 2, 8, '#000000', 0.08),
  cardHover: createShadow(0, 8, 24, '#000000', 0.12),
  button: createShadow(0, 2, 4, '#000000', 0.1),
  lg: createShadow(0, 4, 16, '#000000', 0.12),
  xl: createShadow(0, 8, 32, '#000000', 0.16),
  modal: createShadow(0, 16, 48, '#000000', 0.2),
} as const;
