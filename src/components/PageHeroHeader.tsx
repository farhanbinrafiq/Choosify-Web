import React, { useRef } from 'react';
import { cn } from '../lib/utils';
import { HeroScrollCue, HERO_SCROLL_CUE_PADDING } from './HeroScrollCue';

type PageHeroHeaderProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'gradient';
};

/** Compact page hero strip (cart, orders, checkout) with scroll-down cue. */
export function PageHeroHeader({
  children,
  className,
  variant = 'dark',
}: PageHeroHeaderProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={heroRef}
      className={cn(
        'w-full relative shrink-0 border-b border-white/5',
        variant === 'dark' ? 'bg-[#0A0B1E]' : 'choosify-dark-gradient text-white',
        HERO_SCROLL_CUE_PADDING,
        className,
      )}
    >
      {variant === 'dark' && (
        <div className="pointer-events-none absolute inset-0 hero-gradient opacity-95" />
      )}
      {children}
      <HeroScrollCue anchorRef={heroRef} />
    </div>
  );
}
