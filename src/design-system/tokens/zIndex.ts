/**
 * DS-2.0 z-index scale
 */

export const zIndex = {
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  drawer: 50,
  modal: 60,
  toast: 70,
  max: 100,
} as const;

export type ZIndexToken = typeof zIndex;
