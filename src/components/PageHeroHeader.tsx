import React from 'react';
import { cn } from '../lib/utils';

type PageHeroHeaderProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'gradient';
};

/** Compact page hero strip (cart, orders, checkout). */
export function PageHeroHeader({
  children,
  className,
  variant = 'dark',
}: PageHeroHeaderProps) {
  return (
    <div
      className={cn(
        'w-full relative shrink-0 border-b border-white/5',
        variant === 'dark' ? 'bg-[#0A0B1E]' : 'choosify-dark-gradient text-white',
        className,
      )}
    >
      {variant === 'dark' && (
        <div className="pointer-events-none absolute inset-0 hero-gradient opacity-95" />
      )}
      {children}
    </div>
  );
}
