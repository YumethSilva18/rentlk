// ============================================================================
// RentLK Design System - Colors
// Ported from web frontend/tailwind.config.ts
// ============================================================================

export const colors = {
  // Brand Colors
  primary: '#001F3F',
  primaryHover: '#003366',
  primaryLight: '#335F83',
  primaryForeground: '#FFFFFF',

  // Accent / Gold
  accent: '#D4AF37',
  accentForeground: '#1A1A1A',
  accentLight: '#F5EFDB',
  accentDark: '#B89520',

  // Semantic Colors
  success: '#2ECC40',
  successForeground: '#FFFFFF',
  warning: '#FF851B',
  warningForeground: '#FFFFFF',
  destructive: '#FF4136',
  destructiveForeground: '#FFFFFF',
  info: '#0074D9',
  infoForeground: '#FFFFFF',

  // Neutral Colors
  background: '#F7F7F7',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  input: '#D1D5DB',

  // Text Colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#001F3F',

  // Background Variants
  backgroundPrimary: '#E6EBF0',
  backgroundSuccess: '#E8F8EA',
  backgroundWarning: '#FFF3E0',
  backgroundDestructive: '#FFEBEE',
  backgroundInfo: '#E3F2FD',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',

  // Specific
  navyBlue: '#001F3F',
  gold: '#D4AF37',
  lightGrey: '#F7F7F7',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Primary Palette (50-900)
  primaryPalette: {
    50: '#E6EBF0',
    100: '#CCD7E0',
    200: '#99AFC1',
    300: '#6687A2',
    400: '#335F83',
    500: '#001F3F',
    600: '#001932',
    700: '#001326',
    800: '#000C19',
    900: '#00060D',
  },

  // Accent Palette (50-900)
  accentPalette: {
    50: '#FAF7ED',
    100: '#F5EFDB',
    200: '#EBDFB7',
    300: '#E1CF93',
    400: '#D7BF6F',
    500: '#D4AF37',
    600: '#B89520',
    700: '#8A7018',
    800: '#5C4A10',
    900: '#2E2508',
  },
} as const;

export type ColorKey = keyof typeof colors;
