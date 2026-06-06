// ============================================================================
// RentLK Design System - Border Radii
// Matching web borderRadius definitions
// ============================================================================

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
  button: 12,
  card: 16,
  modal: 20,
  input: 10,
  avatar: 9999,
  badge: 9999,
  chip: 20,
} as const;

export type RadiiKey = keyof typeof radii;
