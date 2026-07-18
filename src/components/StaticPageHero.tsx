import React from 'react';
import { cn } from '../lib/utils';

type StaticPageHeroProps = {
  children: React.ReactNode;
  className?: string;
  scrollTargetId?: string;
  resetKey?: string | number;
};

/** Compact navy hero for legal/static pages — Choosify.dc.html #000435 chrome */
export function StaticPageHero({
  children,
  className,
}: StaticPageHeroProps) {
  return (
    <section
      className={cn(
        'relative min-h-[160px] sm:min-h-[180px] flex items-center bg-[#000435] text-white border-b border-white/5',
        className,
      )}
    >
      {children}
    </section>
  );
}
