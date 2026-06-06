// ============================================================================
// RentLK Design System - Animations
// ============================================================================

export const animations = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 400,
    slower: 600,
  },
  easing: {
    easeIn: 'ease-in' as const,
    easeOut: 'ease-out' as const,
    easeInOut: 'ease-in-out' as const,
    spring: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
  },
} as const;
