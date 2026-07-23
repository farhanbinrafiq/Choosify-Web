import React from 'react';
import { cn } from '../lib/utils';

type ChoosifyWordmarkLogoProps = {
  className?: string;
  /** Render height in px; width scales automatically. Ignored when `fluid`. */
  height?: number;
  /** Size via CSS (`w-*` / `h-auto`); omits fixed width/height attributes. */
  fluid?: boolean;
  /** Empty string → decorative (aria-hidden). */
  title?: string;
  /** White wordmark for dark chrome (default) or navy wordmark for light surfaces. */
  tone?: 'white' | 'navy';
};

/**
 * Official Choosify horizontal lockup (eyes + wordmark) — SVG for crisp scaling.
 */
export function ChoosifyWordmarkLogo({
  className,
  height = 36,
  fluid = false,
  title = 'Choosify',
  tone = 'white',
}: ChoosifyWordmarkLogoProps) {
  const decorative = !title;
  const src =
    tone === 'navy'
      ? '/brand/choosify-logo-horizontal-navy.svg'
      : '/brand/choosify-logo-horizontal-white.svg';

  return (
    <img
      src={src}
      alt={decorative ? '' : title}
      width={fluid ? undefined : Math.round(height * 4.5)}
      height={fluid ? undefined : height}
      className={cn(
        'block object-contain object-left',
        fluid ? 'min-w-0 max-w-full' : 'shrink-0',
        className,
      )}
      aria-hidden={decorative || undefined}
      draggable={false}
      decoding="async"
    />
  );
}
