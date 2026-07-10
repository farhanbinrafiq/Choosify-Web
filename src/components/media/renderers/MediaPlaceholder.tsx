import React from 'react';
import { cn } from '../../../lib/utils';

interface MediaPlaceholderProps {
  label?: string;
  className?: string;
  aspectRatio?: string;
}

export function MediaPlaceholder({
  label = 'Media preview',
  className,
  aspectRatio,
}: MediaPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-[#F0F4F8] text-gray-400 text-xs font-medium',
        className,
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
      role="img"
      aria-label={label}
    >
      {label}
    </div>
  );
}
