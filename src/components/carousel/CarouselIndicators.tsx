import React from 'react';
import { cn } from '../../lib/utils';

interface CarouselIndicatorsProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  variant?: 'default' | 'hero';
  className?: string;
}

export function CarouselIndicators({
  count,
  activeIndex,
  onSelect,
  variant = 'default',
  className,
}: CarouselIndicatorsProps) {
  if (count <= 1) return null;

  return (
    <div className={cn('flex items-center gap-2', className)} role="tablist" aria-label="Carousel slides">
      {Array.from({ length: count }).map((_, idx) => (
        <button
          key={idx}
          type="button"
          role="tab"
          aria-selected={idx === activeIndex}
          onClick={() => onSelect(idx)}
          className={cn(
            'h-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8500A]/40',
            variant === 'hero'
              ? idx === activeIndex
                ? 'w-8 bg-[#FF6B00]'
                : 'w-2 bg-white/40 hover:bg-white/70'
              : idx === activeIndex
                ? 'w-5 bg-[#E8500A]'
                : 'w-1.5 bg-gray-200 hover:bg-gray-300',
          )}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  );
}
