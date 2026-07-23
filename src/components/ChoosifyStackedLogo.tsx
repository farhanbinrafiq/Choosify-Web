import React from 'react';
import { cn } from '../lib/utils';

type ChoosifyStackedLogoProps = {
  className?: string;
  height?: number;
  fluid?: boolean;
  title?: string;
  tone?: 'white' | 'navy';
};

/** Official Choosify stacked lockup (eyes above wordmark) — SVG. */
export function ChoosifyStackedLogo({
  className,
  height = 96,
  fluid = false,
  title = 'Choosify',
  tone = 'white',
}: ChoosifyStackedLogoProps) {
  const src =
    tone === 'navy'
      ? '/brand/choosify-logo-stacked-navy.svg'
      : '/brand/choosify-logo-stacked-white.svg';

  return (
    <img
      src={src}
      alt={title}
      width={fluid ? undefined : Math.round(height * 1.9)}
      height={fluid ? undefined : height}
      className={cn('shrink-0 block object-contain mx-auto', className)}
      draggable={false}
      decoding="async"
    />
  );
}
