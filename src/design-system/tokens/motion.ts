/**
 * DS-2.0 motion tokens
 */

export const motion = {
  duration: {
    instant: '100ms',
    fast: '150ms',
    normal: '200ms',
    moderate: '250ms',
    slow: '300ms',
    slower: '450ms',
    carousel: '500ms',
    hero: '700ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    inOut: 'ease-in-out',
  },
} as const;

/** Tailwind transition class presets */
export const motionClass = {
  hoverLift: 'transition-all duration-300 ease-out hover:-translate-y-1',
  color: 'transition-colors duration-200',
  scale: 'transition-transform duration-200 hover:scale-105',
  editorial: 'transition-all duration-300 ease-out',
} as const;

export type MotionToken = typeof motion;
