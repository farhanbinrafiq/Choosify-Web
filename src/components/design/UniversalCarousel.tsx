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

/** How long autoplay stays paused after a touch/drag ends (ms). */
const TOUCH_RESUME_DELAY_MS = 1600;

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
  const scrollStateRafRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** True while the rAF autoplay loop owns el.scrollLeft — native scroll events
   *  it triggers must not re-enter the reflow/setState path every frame. */
  const autoScrollingRef = useRef(false);

  const applyScrollState = useCallback((left: number, max: number) => {
    setCanScrollLeft(left > 4);
    setCanScrollRight(left < max - 4);
  }, []);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    applyScrollState(el.scrollLeft, el.scrollWidth - el.clientWidth);
  }, [applyScrollState]);

  /** rAF-throttled — one layout read per frame at most, never synchronously per scroll event. */
  const scheduleScrollStateUpdate = useCallback(() => {
    if (autoScrollingRef.current) return; // autoplay loop keeps arrow state itself
    if (scrollStateRafRef.current != null) return;
    scrollStateRafRef.current = requestAnimationFrame(() => {
      scrollStateRafRef.current = null;
      updateScrollState();
    });
  }, [updateScrollState]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', scheduleScrollStateUpdate);
    return () => {
      window.removeEventListener('resize', scheduleScrollStateUpdate);
      if (scrollStateRafRef.current != null) cancelAnimationFrame(scrollStateRafRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [items.length, updateScrollState, scheduleScrollStateUpdate]);

  const scrollBy = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (itemWidth + gap) * 2, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!autoPlay || isPaused) {
      autoScrollingRef.current = false;
      return;
    }
    const el = trackRef.current;
    if (!el) return;

    autoScrollingRef.current = true;
    let frameId = 0;
    let lastTime: number | null = null;

    const step = (time: number) => {
      if (lastTime === null) lastTime = time;
      // Clamp dt so a backgrounded tab / long frame gap can't lurch the track.
      const dt = Math.min((time - lastTime) / 1000, 0.05);
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
        // Plain assignment — the track intentionally has NO CSS scroll-behavior
        // and NO mandatory scroll-snap while autoplaying, so this is a single
        // cheap compositor scroll, not a per-frame smooth-scroll animation
        // restarting and fighting scroll-snap (the old jank).
        el.scrollLeft = next;
        applyScrollState(next, maxScroll);
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => {
      autoScrollingRef.current = false;
      cancelAnimationFrame(frameId);
    };
  }, [autoPlay, isPaused, autoPlaySpeed, items.length, applyScrollState]);

  const pauseNow = useCallback(() => {
    if (!autoPlay) return;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setIsPaused(true);
  }, [autoPlay]);

  const resumeNow = useCallback(() => {
    if (!autoPlay) return;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = null;
    setIsPaused(false);
  }, [autoPlay]);

  /** After a touch/drag, wait before resuming so autoplay doesn't fight momentum. */
  const resumeAfterTouch = useCallback(() => {
    if (!autoPlay) return;
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      setIsPaused(false);
    }, TOUCH_RESUME_DELAY_MS);
  }, [autoPlay]);

  if (!items.length) return null;

  return (
    <div
      className={cn('relative group/carousel', className)}
      onMouseEnter={pauseNow}
      onMouseLeave={resumeNow}
      onTouchStart={pauseNow}
      onTouchEnd={resumeAfterTouch}
      onTouchCancel={resumeAfterTouch}
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
        onScroll={scheduleScrollStateUpdate}
        className={cn(
          'flex overflow-x-auto scrollbar-hide px-1 -mx-1 pb-1',
          // A continuously auto-scrolling track must have NO scroll-snap and NO
          // CSS smooth-scroll: with snap the browser keeps re-aligning the
          // sub-pixel per-frame steps to the current snap point (marquee never
          // advances / stutters), and CSS `scroll-behavior: smooth` restarts a
          // smooth animation every frame. Both are the reported lag. A static
          // track keeps mandatory snap + smooth for a clean paged feel.
          autoPlay ? '' : 'snap-x snap-mandatory scroll-smooth',
        )}
        style={{ gap }}
      >
        {items.map((item, index) => (
          <div
            key={getKey(item, index)}
            className={cn('shrink-0', !autoPlay && 'snap-start')}
            style={{ width: itemWidth }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
