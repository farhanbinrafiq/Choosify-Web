import React from 'react';
import { cn } from '../lib/utils';

type StaticPageHeroProps = {
  children: React.ReactNode;
  className?: string;
  scrollTargetId?: string;
  resetKey?: string | number;
};

/** Standard dark gradient page hero for legal and static pages. */
export function StaticPageHero({
  children,
  className,
}: StaticPageHeroProps) {
  return (
    <section
      className={cn(
        'relative h-[303px] flex items-center choosify-dark-gradient text-white border-b border-white/5',
        className,
      )}
    >
      {children}
    </section>
  );
}
