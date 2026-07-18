/**
 * DS-2.0 elevation / shadow tokens
 * Mirrors `card-primary`, `card-secondary`, `card-utility` in index.css
 */

export const shadows = {
  none: 'none',
  xs: '0 1px 3px rgba(0, 4, 53, 0.01)',
  sm: '0 2px 10px rgba(0, 4, 53, 0.02)',
  md: '0 4px 20px rgba(0, 4, 53, 0.04)',
  lg: '0 10px 30px rgba(0, 4, 53, 0.08)',
  xl: '0 20px 40px rgba(0, 4, 53, 0.12)',
  brand: '0 10px 30px rgba(255, 91, 0, 0.08)',
  brandCta: '0 10px 40px rgba(232, 80, 10, 0.10)',
} as const;

/** Tailwind utility aliases */
export const shadowClass = {
  card: 'shadow-sm',
  cardHover: 'hover:shadow-lg',
  editorialHover: 'hover:shadow-xl',
  modal: 'shadow-2xl',
} as const;

export type ShadowToken = typeof shadows;
