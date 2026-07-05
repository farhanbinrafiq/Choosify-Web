import React, { useRef } from 'react';
import { cn } from '../lib/utils';
import { HeroScrollCue, HERO_SCROLL_CUE_PADDING } from './HeroScrollCue';

type StaticPageHeroProps = {
  children: React.ReactNode;
  className?: string;
  scrollTargetId?: string;
  resetKey?: string | number;
};

/** Standard dark gradient page hero with centered scroll-down cue. */
export function StaticPageHero({
  children,
  className,
  scrollTargetId,
  resetKey,
}: StaticPageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      className={cn(
        'relative h-[303px] flex items-center choosify-dark-gradient text-white border-b border-white/5',
        HERO_SCROLL_CUE_PADDING,
        className,
      )}
    >
      {children}
      <HeroScrollCue
        anchorRef={heroRef}
        scrollTargetId={scrollTargetId}
        resetKey={resetKey}
      />
    </section>
  );
}
