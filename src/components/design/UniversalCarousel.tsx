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
  /** Continuously auto-scrolls the track, pausing on hover/touch/drag. */
  autoPlay?: boolean;
  /** Auto-scroll speed in pixels per second. */
  autoPlaySpeed?: number;
}

export function UniversalCarousel<T>({
  items,
  renderItem,
  getKey,
  itemWidth = 240,
  gap = 16,
  className,
  showArrows = true,
  autoPlay = false,
  autoPlaySpeed = 40,
}: UniversalCarouselProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const directionRef = useRef<1 | -1>(1);

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

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const el = trackRef.current;
    if (!el) return;

    let frameId: number;
    let lastTime: number | null = null;

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        let next = el.scrollLeft + directionRef.current * autoPlaySpeed * dt;
        if (next >= maxScroll) {
          next = maxScroll;
          directionRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          directionRef.current = 1;
        }
        el.scrollLeft = next;
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [autoPlay, isPaused, autoPlaySpeed, items.length]);

  if (!items.length) return null;

  return (
    <div
      className={cn('relative group/carousel', className)}
      onMouseEnter={() => autoPlay && setIsPaused(true)}
      onMouseLeave={() => autoPlay && setIsPaused(false)}
      onTouchStart={() => autoPlay && setIsPaused(true)}
      onTouchEnd={() => autoPlay && setIsPaused(false)}
    >
      {showArrows && (
        <>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#e8edf2] shadow-md flex items-center justify-center text-[#1A1D4E] transition-opacity',
              canScrollLeft ? 'opacity-100 hover:border-[#FF5B00]/40' : 'opacity-0 pointer-events-none',
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
              canScrollRight ? 'opacity-100 hover:border-[#FF5B00]/40' : 'opacity-0 pointer-events-none',
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
