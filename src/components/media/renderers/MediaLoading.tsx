import React from 'react';
import { cn } from '../../../lib/utils';

interface MediaLoadingProps {
  className?: string;
  aspectRatio?: string;
}

export function MediaLoading({ className, aspectRatio }: MediaLoadingProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-[#F0F4F8] via-[#E8EDF2] to-[#F0F4F8] bg-[length:200%_100%]',
        className,
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
      role="status"
      aria-label="Loading media"
    />
  );
}
