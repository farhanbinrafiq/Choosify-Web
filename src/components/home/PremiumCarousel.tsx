import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useMotionValue, animate } from 'motion/react';
import { cn } from '../../lib/utils';

const SNAP_SPRING = { type: 'spring' as const, stiffness: 320, damping: 34, mass: 0.8 };

export function PremiumCarousel({
  items,
  renderCard,
  itemWidth = 280,
  gap = 16,
  paginationStyle = 'bar',
  paginationAlign = 'between',
  showArrows = true,
}: {
  items: any[];
  renderCard: (item: any, index: number, isActive: boolean) => React.ReactNode;
  itemWidth?: number;
  gap?: number;
  /** `bar` = pill indicators; `ring` = target-style active dot (Today's Deals) */
  paginationStyle?: 'bar' | 'ring';
  paginationAlign?: 'between' | 'center';
  showArrows?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const x = useMotionValue(0);
  const lastWheelTime = React.useRef(0);
  const isDragging = React.useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const totalItems = items.length;
  const step = itemWidth + gap;
  const trackWidth = totalItems * step - gap;
  const maxOffset = Math.max(0, trackWidth - containerWidth);
  const maxIndex = Math.min(totalItems - 1, Math.ceil(maxOffset / step));

  const offsetForIndex = useCallback(
    (index: number) => -Math.min(index * step, maxOffset),
    [step, maxOffset],
  );

  const goTo = useCallback(
    (index: number) => {
      const upper = paginationStyle === 'ring' ? Math.max(0, totalItems - 1) : maxIndex;
      const clamped = Math.max(0, Math.min(index, upper));
      setCurrentIndex(clamped);
      animate(x, offsetForIndex(Math.min(clamped, maxIndex)), SNAP_SPRING);
    },
    [maxIndex, offsetForIndex, paginationStyle, totalItems, x],
  );

  // Keep position valid when the container resizes
  useEffect(() => {
    x.set(offsetForIndex(Math.min(currentIndex, maxIndex)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth]);

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  const handleDragEnd = (
    _: unknown,
    info: { velocity: { x: number }; offset: { x: number } },
  ) => {
    isDragging.current = false;
    // Project the resting position from release velocity, then snap to the nearest card
    const projected = x.get() + info.velocity.x * 0.22;
    goTo(Math.round(-projected / step));
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 300) return;
    if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 30) {
      if (e.deltaX > 20 || e.deltaY > 30) {
        next();
      } else {
        prev();
      }
      lastWheelTime.current = now;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      }
    };

    const container = containerRef.current;
    let isHovered = false;
    const onEnter = () => { isHovered = true; };
    const onLeave = () => { isHovered = false; };

    const handleKeyGlobal = (e: KeyboardEvent) => {
      if (isHovered) {
        handleKeyDown(e);
      }
    };

    if (container) {
      container.addEventListener('mouseenter', onEnter);
      container.addEventListener('mouseleave', onLeave);
      window.addEventListener('keydown', handleKeyGlobal);
    }

    return () => {
      if (container) {
        container.removeEventListener('mouseenter', onEnter);
        container.removeEventListener('mouseleave', onLeave);
      }
      window.removeEventListener('keydown', handleKeyGlobal);
    };
  }, [totalItems, currentIndex, maxIndex]);

  return (
    <div className="relative w-full overflow-hidden select-none animate-fade-in" ref={containerRef}>
      <div onWheel={handleWheel} className="w-full overflow-hidden cursor-grab active:cursor-grabbing">
        <motion.div
          drag="x"
          dragConstraints={{ left: -maxOffset, right: 0 }}
          dragElastic={0.06}
          dragMomentum={false}
          style={{ x, touchAction: 'pan-y' }}
          onDragStart={() => { isDragging.current = true; }}
          onDragEnd={handleDragEnd}
          // Swallow the click that follows a real drag so cards don't navigate accidentally
          onClickCapture={(e) => {
            if (isDragging.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className="flex gap-4 items-stretch w-max h-full py-2 transform-gpu"
        >
          {items.map((item, idx) => (
            <div
              key={
                (item as { key?: string })?.key ??
                (item as { guide?: { id?: string | number }; id?: string | number })?.guide?.id ??
                (item as { id?: string | number })?.id ??
                idx
              }
              style={{ width: `${itemWidth}px` }}
              className="shrink-0 flex self-stretch"
            >
              {renderCard(item, idx, idx === currentIndex)}
            </div>
          ))}
        </motion.div>
      </div>

      <div
        className={cn(
          'flex items-center mt-3 select-none',
          paginationAlign === 'center' ? 'justify-center' : 'justify-between',
        )}
      >
        <div className={cn('flex items-center', paginationStyle === 'ring' ? 'gap-2.5' : 'gap-1.5')}>
          {(paginationStyle === 'ring' ? items : items.slice(0, maxIndex + 1)).map((_, i) => {
            const active = i === currentIndex;
            if (paginationStyle === 'ring') {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'rounded-full transition-all duration-300 cursor-pointer border-0 p-0 flex items-center justify-center',
                    active
                      ? 'w-3.5 h-3.5 border border-[#EB4501] bg-transparent'
                      : 'w-2 h-2 bg-[#D1D5DB] hover:bg-[#9AA0AC]',
                  )}
                >
                  {active ? <span className="w-1.5 h-1.5 rounded-full bg-[#EB4501]" /> : null}
                </button>
              );
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 cursor-pointer border-0',
                  active ? 'w-5 bg-[#EB4501]' : 'w-1.5 bg-gray-200 hover:bg-gray-300',
                )}
                title={`Go to slide ${i + 1}`}
              />
            );
          })}
        </div>

        {showArrows && paginationAlign !== 'center' && (
        <div className="flex gap-2">
           <button
             type="button"
             onClick={prev}
             disabled={currentIndex === 0}
             className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center hover:bg-[#CF4400] hover:text-white hover:border-[#EB4501]/30 transition-all active:scale-90 shadow-xs cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
             title="Previous Slide"
           >
              <ChevronLeft size={16} />
           </button>
           <button
             type="button"
             onClick={next}
             disabled={currentIndex >= maxIndex}
             className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center hover:bg-[#CF4400] hover:text-white hover:border-[#EB4501]/30 transition-all active:scale-90 shadow-xs cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
             title="Next Slide"
           >
              <ChevronRight size={16} />
           </button>
        </div>
        )}
      </div>
    </div>
  );
}
