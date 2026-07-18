import React from 'react';
import { cn } from '../../lib/utils';

interface CarouselMediaProps {
  src?: string;
  alt?: string;
  className?: string;
  lazy?: boolean;
}

export function CarouselMedia({ src, alt = '', className, lazy = true }: CarouselMediaProps) {
  if (!src) {
    return (
      <div className={cn('aspect-[4/3] rounded-2xl bg-[#F7F8FA] border border-[#eef2f6]', className)} />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      className={cn('w-full h-full object-cover', className)}
    />
  );
}
