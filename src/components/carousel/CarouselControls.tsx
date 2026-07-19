import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  variant?: 'default' | 'hero';
  className?: string;
  canScrollLeft?: boolean;
  canScrollRight?: boolean;
}

export function CarouselControls({
  onPrev,
  onNext,
  variant = 'default',
  className,
  canScrollLeft = true,
  canScrollRight = true,
}: CarouselControlsProps) {
  if (variant === 'hero') {
    return (
      <>
        <button
          type="button"
          onClick={onPrev}
          className={cn(
            'absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-[#CF4400]/80 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
            className,
          )}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={onNext}
          className={cn(
            'absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-[#CF4400]/80 border border-white/20 flex items-center justify-center text-white transition-all backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
            className,
          )}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </>
    );
  }

  return (
    <div className={cn('flex gap-2', className)}>
      <button
        type="button"
        onClick={onPrev}
        disabled={!canScrollLeft}
        className={cn(
          'w-8 h-8 rounded-full border border-[#eef2f6] bg-white flex items-center justify-center hover:bg-[#CF4400] hover:text-white hover:border-[#EB4501]/30 transition-all active:scale-90 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]/40',
          !canScrollLeft && 'opacity-40 pointer-events-none',
        )}
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canScrollRight}
        className={cn(
          'w-8 h-8 rounded-full border border-[#eef2f6] bg-white flex items-center justify-center hover:bg-[#CF4400] hover:text-white hover:border-[#EB4501]/30 transition-all active:scale-90 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]/40',
          !canScrollRight && 'opacity-40 pointer-events-none',
        )}
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
