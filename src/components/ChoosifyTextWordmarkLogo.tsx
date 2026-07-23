import React from 'react';
import { cn } from '../lib/utils';

type ChoosifyTextWordmarkLogoProps = {
  className?: string;
  height?: number;
  fluid?: boolean;
  title?: string;
  tone?: 'white' | 'navy';
};

/** Official Choosify wordmark only (no eyes) — SVG. */
export function ChoosifyTextWordmarkLogo({
  className,
  height = 28,
  fluid = false,
  title = 'Choosify',
  tone = 'white',
}: ChoosifyTextWordmarkLogoProps) {
  const decorative = !title;
  const src =
    tone === 'navy'
      ? '/brand/choosify-logo-wordmark-navy.svg'
      : '/brand/choosify-logo-wordmark-white.svg';

  return (
    <img
      src={src}
      alt={decorative ? '' : title}
      width={fluid ? undefined : Math.round(height * 3.7)}
      height={fluid ? undefined : height}
      className={cn('shrink-0 block object-contain object-left', className)}
      aria-hidden={decorative || undefined}
      draggable={false}
      decoding="async"
    />
  );
}
