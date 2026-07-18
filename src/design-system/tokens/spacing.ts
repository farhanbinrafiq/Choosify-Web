/**
 * DS-2.0 spacing scale (px)
 * Maps to Tailwind spacing utilities where possible.
 */

export const spacing = {
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
} as const;

/** Editorial section vertical rhythm (homepage / listing heroes) */
export const sectionSpacing = {
  sm: 'py-12 md:py-16',
  md: 'py-16 md:py-20 lg:py-24',
  lg: 'py-20 md:py-24 lg:py-28',
} as const;

/** Max content width used across pages */
export const contentWidth = {
  shell: '1440px',
  narrow: '768px',
  wide: '1536px',
} as const;

export type SpacingToken = typeof spacing;
