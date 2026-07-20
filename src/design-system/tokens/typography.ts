/**
 * DS-2.0 typography tokens
 * Font families defined in `src/index.css` @theme
 */

export const typography = {
  fontFamily: {
    sans: '"Satoshi", "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", monospace',
    display: '"Satoshi", "Helvetica Neue", Arial, sans-serif',
    dmSans: '"Satoshi", "Helvetica Neue", Arial, sans-serif',
    space: '"Satoshi", "Helvetica Neue", Arial, sans-serif',
  },
  fontSize: {
    xs: '0.625rem', // 10px — legacy micro labels
    sm: '0.6875rem', // 11px
    base: '0.875rem', // 14px
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    hero: '3.25rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '800',
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.05em',
    wider: '0.1em',
    widest: '0.2em',
  },
  lineHeight: {
    tight: '1.08',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },
} as const;

export type TypographyToken = typeof typography;
