import type { RefObject } from 'react';

export type HeroScrollCueProps = {
  anchorRef: RefObject<HTMLElement | null>;
  scrollTargetId?: string;
  className?: string;
  resetKey?: string | number;
};

/** Browse-contents cue removed site-wide — component kept for compatibility. */
export function HeroScrollCue(_props: HeroScrollCueProps) {
  return null;
}

export const HERO_SCROLL_CUE_PADDING = '';
