import React from 'react';
import { cn } from '../lib/utils';

type StaticPageHeroProps = {
  children: React.ReactNode;
  className?: string;
  /** Match page body feed width */
  maxWidthClass?: string;
  scrollTargetId?: string;
  resetKey?: string | number;
};

/** Compact navy hero for legal/static pages — constrained to feed silhouette (not full-bleed). */
export function StaticPageHero({
  children,
  className,
  maxWidthClass = 'max-w-[1280px]',
}: StaticPageHeroProps) {
  return (
    <div className={cn('w-full px-5 sm:px-8 lg:px-10 pt-4 sm:pt-5', className)}>
      <section
        className={cn(
          maxWidthClass,
          'mx-auto relative min-h-[160px] sm:min-h-[180px] flex items-center bg-[#000435] text-white border border-white/5 rounded-[14px] overflow-hidden',
        )}
      >
        {children}
      </section>
    </div>
  );
}
