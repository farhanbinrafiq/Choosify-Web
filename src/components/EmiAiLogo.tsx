import React from 'react';
import { cn } from '../lib/utils';

type EmiAiLogoProps = {
  className?: string;
  size?: number;
  title?: string;
};

/**
 * Official Emi AI mascot (blue→pink gradient character + EMI wordmark).
 * Uses object-contain so the full mark fits inside FABs and chips.
 */
export function EmiAiLogo({ className, size = 28, title = 'Emi AI' }: EmiAiLogoProps) {
  return (
    <img
      src="/emi-ai-logo.svg"
      width={size}
      height={size}
      alt={title}
      title={title}
      draggable={false}
      className={cn('shrink-0 block object-contain', className)}
    />
  );
}
