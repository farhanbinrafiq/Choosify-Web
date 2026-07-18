import React from 'react';
import { cn } from '../../../lib/utils';

interface MediaErrorProps {
  message: string;
  className?: string;
  aspectRatio?: string;
}

export function MediaError({ message, className, aspectRatio }: MediaErrorProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-red-50 text-red-600 text-xs px-3 text-center',
        className,
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
      role="alert"
    >
      {message}
    </div>
  );
}
