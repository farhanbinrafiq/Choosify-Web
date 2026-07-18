import React from 'react';
import { cn } from '../lib/utils';

type EmiAiLogoProps = {
  className?: string;
  size?: number;
  title?: string;
  /**
   * `mark` — full character + EMI wordmark (default).
   * `fab` — square face crop that fills circular FABs without letterboxing/cropping.
   */
  variant?: 'mark' | 'fab';
};

/**
 * Official Emi AI mascot (blue→pink gradient character + EMI wordmark).
 */
export function EmiAiLogo({
  className,
  size = 28,
  title = 'Emi AI',
  variant = 'mark',
}: EmiAiLogoProps) {
  const src = variant === 'fab' ? '/emi-ai-logo-fab.svg' : '/emi-ai-logo.svg';

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={title}
      title={title}
      draggable={false}
      className={cn('shrink-0 block object-contain', className)}
    />
  );
}
