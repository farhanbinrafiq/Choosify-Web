import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'motion/react';
import { cn } from '../../lib/utils';

export type AdSlotPaginationIcon = {
  label: string;
  imageUrl?: string;
};

export type AdSlotCarouselProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderSlide: (item: T, index: number) => React.ReactNode;
  className?: string;
  /** Slide direction — 'y' for wide horizontal banners (scrolls bottom→top), 'x' for stacked/portrait ad units (slides sideways) */
  axis?: 'x' | 'y';
  autoplay?: boolean;
  autoplayMs?: number;
  showDots?: boolean;
  /** Per-slide pagination icon (brand logo / avatar). Falls back to plain dots when omitted. */
  getIcon?: (item: T, index: number) => AdSlotPaginationIcon;
  /** Where the pagination rail sits. Defaults to 'end' (right) for axis="y", 'below' for axis="x". */
  paginationPosition?: 'end' | 'below';
  ariaLabel?: string;
  /** Ring offset behind active logo thumb — match the surface under the rail */
  paginationRingOffsetClassName?: string;
};

const SWIPE_PX = 48;
const MANUAL_RESUME_MS = 13000;
const WHEEL_COOLDOWN_MS = 450;
const AVATAR_COLORS = ['#FF5B00', '#2323FF', '#07A828', '#7C3AED', '#0EA5E9', '#1A1A2E'];

function initialsFor(label: string): string {
  return (
    label
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

export type AdSlotPaginationRailProps = {
  items: AdSlotPaginationIcon[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** 'end' = vertical rail (banner side); 'below' = horizontal under the slide */
  position?: 'end' | 'below';
  ariaLabel?: string;
  className?: string;
  ringOffsetClassName?: string;
  getKey?: (item: AdSlotPaginationIcon, index: number) => string;
};

/**
 * Brand-logo thumbnail pagination used by sponsored banner / vertical ad carousels.
 * Prefer this over plain dots whenever each slide has a sponsor mark.
 */
export function AdSlotPaginationRail({
  items,
  activeIndex,
  onSelect,
  position = 'below',
  ariaLabel = 'Slides',
  className,
  ringOffsetClassName = 'ring-offset-white',
  getKey = (_item, index) => String(index),
}: AdSlotPaginationRailProps) {
  if (items.length <= 1) return null;

  return (
    <div
      className={cn(
        'flex gap-2 pointer-events-auto',
        position === 'end'
          ? 'flex-col items-center justify-center shrink-0 gap-2.5'
          : 'flex-row items-center justify-center flex-wrap',
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((icon, i) => {
        const active = i === activeIndex;
        const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
        return (
          <button
            key={getKey(icon, i)}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={`Show ${icon.label}`}
            title={icon.label}
            onClick={() => onSelect(i)}
            className={cn(
              'shrink-0 w-7 h-7 rounded-full overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center border-0 p-0',
              active
                ? cn('ring-2 ring-[#FF5B00] ring-offset-1', ringOffsetClassName)
                : 'opacity-55 hover:opacity-85 grayscale-[30%]',
            )}
          >
            {icon.imageUrl ? (
              <img src={icon.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <span
                className="w-full h-full flex items-center justify-center text-white text-[9px] font-extrabold"
                style={{ backgroundColor: color }}
              >
                {initialsFor(icon.label)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Single-slot multi-ad carousel — keeps the host size; slides/swipes between ads.
 * Used for full-width sponsored banners and portrait sidebar units.
 *
 * Interaction: hover locks the current slide and lets the mouse wheel step through
 * slides; moving the pointer away resumes autoplay. Clicking a pagination icon jumps
 * there and holds until it's clicked again or ~13s pass with no further click.
 */
export function AdSlotCarousel<T>({
  items,
  getKey,
  renderSlide,
  className,
  axis = 'x',
  autoplay = false,
  autoplayMs = 5500,
  showDots = true,
  getIcon,
  paginationPosition,
  ariaLabel = 'Promoted ads',
  paginationRingOffsetClassName = 'ring-offset-white',
}: AdSlotCarouselProps<T>) {
  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const manualResumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wheelCooldownRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = items.length;
  const resolvedPaginationPosition = paginationPosition ?? (axis === 'y' ? 'end' : 'below');

  useEffect(() => {
    setIndex(0);
  }, [total, items.map((item, i) => getKey(item, i)).join('|')]);

  const goTo = useCallback(
    (next: number) => {
      if (total <= 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  const armManualResume = useCallback(() => {
    setManualPaused(true);
    if (manualResumeTimerRef.current) clearTimeout(manualResumeTimerRef.current);
    manualResumeTimerRef.current = setTimeout(() => setManualPaused(false), MANUAL_RESUME_MS);
  }, []);

  useEffect(
    () => () => {
      if (manualResumeTimerRef.current) clearTimeout(manualResumeTimerRef.current);
    },
    [],
  );

  const paused = hoverPaused || manualPaused;

  useEffect(() => {
    if (!autoplay || paused || total <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(goNext, autoplayMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, autoplayMs, goNext, paused, total]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || total <= 1) return;

    const onWheel = (e: WheelEvent) => {
      if (!hoverPaused) return;
      const delta = axis === 'y' ? e.deltaY : e.deltaX || e.deltaY;
      if (Math.abs(delta) < 8) return;
      e.preventDefault();
      if (wheelCooldownRef.current) return;
      wheelCooldownRef.current = true;
      if (delta > 0) goNext();
      else goPrev();
      setTimeout(() => {
        wheelCooldownRef.current = false;
      }, WHEEL_COOLDOWN_MS);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [axis, goNext, goPrev, hoverPaused, total]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const offset = axis === 'x' ? info.offset.x : info.offset.y;
    const velocity = axis === 'x' ? info.velocity.x : info.velocity.y;
    if (offset < -SWIPE_PX || velocity < -400) goNext();
    else if (offset > SWIPE_PX || velocity > 400) goPrev();
  };

  const icons = useMemo(
    () => (getIcon ? items.map((item, i) => getIcon(item, i)) : null),
    [getIcon, items],
  );

  if (total === 0) return null;

  if (total === 1) {
    return <div className={cn('relative w-full', className)}>{renderSlide(items[0], 0)}</div>;
  }

  const current = items[index];

  const pagination = showDots ? (
    icons ? (
      <AdSlotPaginationRail
        items={icons}
        activeIndex={index}
        position={resolvedPaginationPosition}
        ariaLabel="Ad slides"
        ringOffsetClassName={paginationRingOffsetClassName}
        getKey={(icon, i) => `${getKey(items[i], i)}-${icon.label}`}
        onSelect={(i) => {
          goTo(i);
          armManualResume();
        }}
        className={resolvedPaginationPosition === 'below' ? 'mt-3' : undefined}
      />
    ) : (
      <div
        className={cn(
          'flex gap-2 pointer-events-auto',
          resolvedPaginationPosition === 'end'
            ? 'flex-col items-center justify-center shrink-0 gap-2.5'
            : 'flex-row items-center justify-center flex-wrap mt-3',
        )}
        role="tablist"
        aria-label="Ad slides"
      >
        {items.map((item, i) => {
          const active = i === index;
          return (
            <button
              key={getKey(item, i)}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Go to ad ${i + 1}`}
              onClick={() => {
                goTo(i);
                armManualResume();
              }}
              className={cn(
                'rounded-full transition-all duration-300 cursor-pointer border-0 p-0 flex items-center justify-center',
                active
                  ? 'w-3.5 h-3.5 border border-[#FF5B00] bg-transparent'
                  : 'w-2 h-2 bg-[#D1D5DB] hover:bg-[#9AA0AC]',
              )}
            >
              {active ? <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B00]" /> : null}
            </button>
          );
        })}
      </div>
    )
  ) : null;

  const slide = (
    <div className="relative w-full h-full overflow-hidden touch-pan-y">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={getKey(current, index)}
          drag={axis}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
          initial={{ opacity: 0, ...(axis === 'x' ? { x: 28 } : { y: 24 }) }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, ...(axis === 'x' ? { x: -28 } : { y: -24 }) }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ touchAction: axis === 'x' ? 'pan-y' : 'pan-x' }}
        >
          {renderSlide(current, index)}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  if (resolvedPaginationPosition === 'end' && pagination) {
    return (
      <div
        ref={containerRef}
        className={cn('relative w-full select-none flex items-center gap-3.5', className)}
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocusCapture={() => setHoverPaused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHoverPaused(false);
        }}
      >
        <div className="flex-1 min-w-0">{slide}</div>
        <div className="shrink-0 pl-1">{pagination}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full select-none flex flex-col', className)}
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setHoverPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHoverPaused(false);
      }}
    >
      {slide}
      {resolvedPaginationPosition === 'below' ? pagination : null}
    </div>
  );
}
