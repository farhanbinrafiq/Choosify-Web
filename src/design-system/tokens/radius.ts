/**
 * DS-2.0 border-radius tokens
 */

export const radius = {
  none: '0',
  xs: '0.1875rem', // 3px — legacy `rounded-[3px]`
  sm: '0.25rem', // 4px — legacy `rounded-[4px]`
  md: '0.3125rem', // 5px — legacy `rounded-[5px]` (most common legacy)
  lg: '0.75rem', // 12px — rounded-xl
  xl: '1rem', // 16px — rounded-2xl
  '2xl': '1.25rem', // 20px — editorial cards (LE-007 / DS-V2.1)
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

/** Tailwind class aliases for migration */
export const radiusClass = {
  legacyCard: 'rounded-[5px]',
  editorialCard: 'rounded-[20px]',
  pill: 'rounded-full',
  section: 'rounded-2xl',
} as const;

export type RadiusToken = typeof radius;
