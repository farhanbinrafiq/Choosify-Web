import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface UniversalCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey: (item: T, index: number) => string;
  itemWidth?: number;
  gap?: number;
  className?: string;
  showArrows?: boolean;
}

export function UniversalCarousel<T>({
  items,
  renderItem,
  getKey,
  itemWidth = 240,
  gap = 16,
  className,
  showArrows = true,
}: UniversalCarouselProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [items.length, updateScrollState]);

  const scrollBy = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (itemWidth + gap) * 2, behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <div className={cn('relative group/carousel', className)}>
      {showArrows && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#e8edf2] shadow-md flex items-center justify-center text-[#1A1D4E] transition-opacity',
              canScrollLeft ? 'opacity-100 hover:border-[#EB4501]/40' : 'opacity-0 pointer-events-none',
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#e8edf2] shadow-md flex items-center justify-center text-[#1A1D4E] transition-opacity',
              canScrollRight ? 'opacity-100 hover:border-[#EB4501]/40' : 'opacity-0 pointer-events-none',
            )}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}
      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-1 -mx-1 pb-1"
        style={{ gap }}
      >
        {items.map((item, index) => (
          <div
            key={getKey(item, index)}
            className="snap-start shrink-0"
            style={{ width: itemWidth }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
