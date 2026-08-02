import React from 'react';
import { cn } from '../lib/utils';

type EmiAiLogoProps = {
  className?: string;
  size?: number;
  title?: string;
  /**
   * `icon` — square padded asset for avatars/FABs (default).
   * `full` — original portrait SVG (large heroes / 404).
   */
  variant?: 'icon' | 'full';
};

/**
 * Official Emi AI mascot.
 * Default `icon` variant uses the safe-zone square asset. The component itself
 * owns the 22% rounded-square shell — do not nest another `.choosify-icon-shell`
 * around it (double clipping reads as an oval and re-crops the mark).
 * Use `full` for large portrait displays (404, heroes).
 */
export function EmiAiLogo({
  className,
  size = 28,
  title = 'Emi. A.I',
  variant = 'icon',
}: EmiAiLogoProps) {
  const src = variant === 'full' ? '/emi-ai-logo.svg' : '/emi-ai-logo-icon.png';
  const isIcon = variant === 'icon';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center shrink-0',
        isIcon && 'choosify-icon-shell overflow-hidden bg-white',
        className,
      )}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      role="img"
      aria-label={title}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        title={title}
        draggable={false}
        className="block object-contain object-center w-full h-full pointer-events-none select-none"
      />
    </span>
  );
}
