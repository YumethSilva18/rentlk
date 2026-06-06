// ============================================================================
// RentLK Design System - Unified Theme Export
// ============================================================================

export { colors } from './colors';
export type { ColorKey } from './colors';
export { typography } from './typography';
export { spacing, layout } from './spacing';
export type { SpacingKey } from './spacing';
export { shadows } from './shadows';
export { radii } from './radii';
export type { RadiiKey } from './radii';
export { animations } from './animations';

// Re-export as theme object
import { colors } from './colors';
import { typography } from './typography';
import { spacing, layout } from './spacing';
import { shadows } from './shadows';
import { radii } from './radii';
import { animations } from './animations';

export const theme = {
  colors,
  typography,
  spacing,
  layout,
  shadows,
  radii,
  animations,
} as const;

export type Theme = typeof theme;
