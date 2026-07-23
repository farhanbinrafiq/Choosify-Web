import React from 'react';
import { cn } from '../lib/utils';

type ChoosifyIconLogoProps = {
  className?: string;
  size?: number;
  title?: string;
};

/** Official Choosify eyes mark — SVG. */
export function ChoosifyIconLogo({
  className,
  size = 24,
  title = 'Choosify',
}: ChoosifyIconLogoProps) {
  return (
    <img
      src="/brand/choosify-logo-icon.svg"
      alt={title}
      width={size}
      height={size}
      className={cn('shrink-0 object-contain', className)}
      draggable={false}
      decoding="async"
    />
  );
}
