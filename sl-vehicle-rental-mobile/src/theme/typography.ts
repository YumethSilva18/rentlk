// ============================================================================
// RentLK Design System - Typography
// Matching web Inter font family
// ============================================================================

import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'Inter',
  android: 'Inter',
  default: 'System',
});

export const typography = {
  fontFamily,

  // Display
  displayLarge: {
    fontFamily,
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontFamily,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  displaySmall: {
    fontFamily,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },

  // Heading
  h1: {
    fontFamily,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  h2: {
    fontFamily,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
  },
  h3: {
    fontFamily,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  h4: {
    fontFamily,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },

  // Body
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },

  // Label
  labelLarge: {
    fontFamily,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  labelMedium: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  labelSmall: {
    fontFamily,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
  },

  // Caption
  caption: {
    fontFamily,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.5,
  },

  // Overline
  overline: {
    fontFamily,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },

  // Button
  button: {
    fontFamily,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  buttonLarge: {
    fontFamily,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
} as const;
