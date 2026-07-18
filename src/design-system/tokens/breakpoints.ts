/**
 * DS-2.0 breakpoint tokens
 * Canonical — keep in sync with `src/lib/pageLayout.ts` LAYOUT_BREAKPOINTS
 */

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof breakpoints;

export type LayoutMode = 'stack' | 'browse' | 'full';

export function getLayoutMode(width: number): LayoutMode {
  if (width >= breakpoints['2xl']) return 'full';
  if (width >= breakpoints.lg) return 'browse';
  return 'stack';
}

export type BreakpointToken = typeof breakpoints;
