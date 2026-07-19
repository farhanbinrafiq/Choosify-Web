import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { CarouselControls } from './CarouselControls';
import { CarouselIndicators } from './CarouselIndicators';

export interface ChoosifyCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isActive: boolean) => React.ReactNode;
  getKey: (item: T, index: number) => string;
  itemWidth?: number;
  gap?: number;
  className?: string;
  /** Scroll-snap horizontal track (categories, spotlight) */
  mode?: 'track' | 'paginated';
  showControls?: boolean;
  showIndicators?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export function ChoosifyCarousel<T>({
  items,
  renderItem,
  getKey,
  itemWidth = 280,
  gap = 16,
  className,
  mode = 'paginated',
  showControls = true,
  showIndicators = true,
  autoplay = false,
  autoplayInterval = 6000,
}: ChoosifyCarouselProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const lastWheelTime = useRef(0);

  const totalItems = items.length;

  const next = useCallback(() => {
    if (mode === 'track') {
      const el = trackRef.current;
      if (!el) return;
      el.scrollBy({ left: (itemWidth + gap) * 2, behavior: 'smooth' });
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [gap, itemWidth, mode, totalItems]);

  const prev = useCallback(() => {
    if (mode === 'track') {
      const el = trackRef.current;
      if (!el) return;
      el.scrollBy({ left: -(itemWidth + gap) * 2, behavior: 'smooth' });
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [gap, itemWidth, mode, totalItems]);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    if (mode !== 'track') return;
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [items.length, mode, updateScrollState]);

  useEffect(() => {
    if (!autoplay || totalItems <= 1 || mode === 'track') return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, mode, totalItems]);

  useEffect(() => {
    if (mode === 'track') return;
    const handleKeyGlobal = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      const container = containerRef.current;
      if (!container?.matches(':hover')) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyGlobal);
    return () => window.removeEventListener('keydown', handleKeyGlobal);
  }, [mode, next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null || mode === 'track') return;
    setDragOffset(dragStartX - e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (dragStartX === null || mode === 'track') return;
    if (dragOffset > 50) next();
    else if (dragOffset < -50) prev();
    setDragStartX(null);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'track') return;
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX === null || mode === 'track') return;
    setDragOffset(dragStartX - e.clientX);
  };

  const handleMouseUpOrLeave = () => {
    if (dragStartX === null || mode === 'track') return;
    if (dragOffset > 50) next();
    else if (dragOffset < -50) prev();
    setDragStartX(null);
    setDragOffset(0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (mode === 'track') return;
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return;
    if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 30) {
      if (e.deltaX > 20 || e.deltaY > 30) next();
      else prev();
      lastWheelTime.current = now;
      e.preventDefault();
    }
  };

  if (!items.length) return null;

  if (mode === 'track') {
    return (
      <div className={cn('relative group/carousel', className)}>
        {showControls && (
          <>
            <button
              type="button"
              onClick={prev}
              disabled={!canScrollLeft}
              className={cn(
                'absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#e8edf2] shadow-md flex items-center justify-center text-[#1A1D4E] transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]/40',
                canScrollLeft ? 'opacity-100 hover:border-[#EB4501]/40' : 'opacity-0 pointer-events-none',
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canScrollRight}
              className={cn(
                'absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#e8edf2] shadow-md flex items-center justify-center text-[#1A1D4E] transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EB4501]/40',
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
          role="list"
        >
          {items.map((item, index) => (
            <div
              key={getKey(item, index)}
              className="snap-start shrink-0"
              style={{ width: itemWidth }}
              role="listitem"
            >
              {renderItem(item, index, false)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const translateX = -(currentIndex * (itemWidth + gap)) - dragOffset;

  return (
    <div className={cn('relative w-full overflow-hidden select-none', className)} ref={containerRef}>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
        className="w-full active:cursor-grabbing overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Carousel"
      >
        <motion.div
          animate={{ x: translateX }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="flex items-start w-max h-full py-2"
          style={{ gap }}
        >
          {items.map((item, index) => (
            <div
              key={getKey(item, index)}
              style={{ width: `${itemWidth}px` }}
              className="shrink-0 flex"
              aria-hidden={index !== currentIndex}
            >
              {renderItem(item, index, index === currentIndex)}
            </div>
          ))}
        </motion.div>
      </div>

      {(showIndicators || showControls) && totalItems > 1 && (
        <div className="flex items-center justify-between mt-2 select-none">
          {showIndicators ? (
            <CarouselIndicators
              count={totalItems}
              activeIndex={currentIndex}
              onSelect={setCurrentIndex}
            />
          ) : (
            <span />
          )}
          {showControls && <CarouselControls onPrev={prev} onNext={next} />}
        </div>
      )}
    </div>
  );
}
