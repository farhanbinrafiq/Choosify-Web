import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Radio, Clock, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import type { CommerceMediaItem } from './commerceMediaTypes';
import { isVideoKind } from '../media/choosifyMediaTypes';

export interface DetailSliverLiveBadge {
  label: string;
  isLive: boolean;
  isUpcoming: boolean;
  scheduledAt?: string;
  ctaLabel?: string;
}

const ZOOM_MAX = 4;
const ZOOM_TAP_SCALE = 2.5;

/** Match platform carousel feel — short eased slide + fade (ChoosifyCarousel ~300–400ms range) */
const SLIDE_TRANSITION = { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const };
/** Shared hero auto-advance (Product / Service / Guide / Spotlight detail heroes) */
const AUTO_ADVANCE_MS = 4500;
const AUTOPLAY_RESUME_MS = 5500;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
  }),
};

/**
 * Touch-friendly fullscreen image: tap to toggle zoom, pinch to zoom, drag to pan.
 * Horizontal swipe at 1x scale navigates the gallery when `onNavigate` is provided.
 */
function PinchZoomImage({
  src,
  alt,
  onNavigate,
}: {
  src: string;
  alt: string;
  onNavigate?: (dir: 1 | -1) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });
  const [animate, setAnimate] = useState(true);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef({
    startScale: 1,
    startX: 0,
    startY: 0,
    startDist: 0,
    startMid: { x: 0, y: 0 },
    origin: { x: 0, y: 0 },
    moved: false,
    downAt: 0,
  });

  const clampView = useCallback((scale: number, x: number, y: number) => {
    const el = containerRef.current;
    const maxX = el ? ((scale - 1) * el.clientWidth) / 2 : 0;
    const maxY = el ? ((scale - 1) * el.clientHeight) / 2 : 0;
    return {
      scale,
      x: Math.max(-maxX, Math.min(maxX, x)),
      y: Math.max(-maxY, Math.min(maxY, y)),
    };
  }, []);

  const toLocal = (e: { clientX: number; clientY: number }) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2,
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (pointers.current.size === 1) {
      g.startScale = view.scale;
      g.startX = view.x;
      g.startY = view.y;
      g.moved = false;
      g.downAt = Date.now();
      g.origin = { x: e.clientX, y: e.clientY };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      g.startDist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      g.startScale = view.scale;
      g.startX = view.x;
      g.startY = view.y;
      g.startMid = toLocal({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      g.moved = true;
    }
    setAnimate(false);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const scale = Math.max(1, Math.min(ZOOM_MAX, (g.startScale * dist) / g.startDist));
      const mid = toLocal({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 });
      const ratio = scale / g.startScale;
      const x = mid.x - (g.startMid.x - g.startX) * ratio;
      const y = mid.y - (g.startMid.y - g.startY) * ratio;
      setView(clampView(scale, x, y));
      return;
    }

    if (pointers.current.size === 1) {
      const dx = e.clientX - g.origin.x;
      const dy = e.clientY - g.origin.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) g.moved = true;
      if (view.scale > 1) {
        setView(clampView(view.scale, g.startX + dx, g.startY + dy));
      }
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (pointers.current.size > 0) return;

    // Snap back to fit when pinch ends near 1x
    if (view.scale < 1.05) {
      setAnimate(true);
      setView({ scale: 1, x: 0, y: 0 });
    }

    const dx = e.clientX - g.origin.x;
    const dy = e.clientY - g.origin.y;

    // At fit scale, horizontal swipe changes the gallery image (keep viewer open)
    if (view.scale <= 1.05 && onNavigate && g.moved) {
      if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        onNavigate(dx < 0 ? 1 : -1);
        return;
      }
    }

    // Tap (no drag/pinch) toggles zoom around the tap point
    if (!g.moved && Date.now() - g.downAt < 350) {
      setAnimate(true);
      if (view.scale > 1) {
        setView({ scale: 1, x: 0, y: 0 });
      } else {
        const p = toLocal(e);
        setView(clampView(ZOOM_TAP_SCALE, p.x * (1 - ZOOM_TAP_SCALE), p.y * (1 - ZOOM_TAP_SCALE)));
      }
    }
  };

  // Reset pan/zoom when the media source changes (next/prev while fullscreen)
  useEffect(() => {
    setAnimate(false);
    setView({ scale: 1, x: 0, y: 0 });
  }, [src]);

  return (
    <div
      ref={containerRef}
      data-zoom-viewport
      className="relative w-full h-full overflow-hidden select-none"
      style={{ touchAction: 'none', cursor: view.scale > 1 ? 'zoom-out' : 'zoom-in' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full h-full object-contain"
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          transition: animate ? 'transform 200ms ease-out' : 'none',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

export interface DetailSliverMediaGalleryProps {
  items: CommerceMediaItem[];
  ariaLabel?: string;
  /** Show “+ Add Video” chrome (admin/studio surfaces) */
  showAddVideo?: boolean;
  onAddVideo?: () => void;
  className?: string;
  /** LIVE NOW / Upcoming / Replay badge overlaid on the media card */
  liveBadge?: DetailSliverLiveBadge;
  /** Auto-advance slides (default on for multi-image heroes) */
  autoplay?: boolean;
  /** Ms between auto-advances while playing (default 4500) */
  autoplayIntervalMs?: number;
}

function slideAt(items: CommerceMediaItem[], index: number, offset: number): CommerceMediaItem | null {
  if (!items.length) return null;
  const n = items.length;
  return items[(index + offset + n * 10) % n] ?? null;
}

function SliverMedia({
  item,
  className,
  playSize = 56,
}: {
  item: CommerceMediaItem;
  className?: string;
  playSize?: number;
}) {
  const video = isVideoKind(item.kind);
  const src = item.posterUrl ?? item.url;

  return (
    <div className={cn('relative w-full h-full bg-[#0a0c18]', className)}>
      {video && item.kind !== 'live' ? (
        <>
          <img src={src} alt={item.alt ?? ''} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full bg-[#FF000D] flex items-center justify-center"
              style={{ width: playSize, height: playSize }}
            >
              <div
                className="border-solid border-transparent border-l-white ml-0.5"
                style={{
                  width: 0,
                  height: 0,
                  borderWidth: `${playSize * 0.16}px 0 ${playSize * 0.16}px ${playSize * 0.27}px`,
                }}
              />
            </div>
          </div>
        </>
      ) : item.kind === 'live' && item.embedUrl ? (
        <iframe
          src={item.embedUrl}
          title={item.alt ?? 'Live'}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <img src={src} alt={item.alt ?? ''} className="w-full h-full object-cover" loading="lazy" />
      )}
    </div>
  );
}

type PeekSlot = {
  offset: number;
  /** Relative size within the side strip (near = larger) */
  size: 'near' | 'mid' | 'far';
};

/** Build left peeks far→near (fills toward the center) */
function leftPeekSlots(count: number): PeekSlot[] {
  const slots: PeekSlot[] = [];
  for (let i = count; i >= 1; i -= 1) {
    const size: PeekSlot['size'] = i === 1 ? 'near' : i === 2 ? 'mid' : 'far';
    slots.push({ offset: -i, size });
  }
  return slots;
}

/** Build right peeks near→far (fills toward the edge) */
function rightPeekSlots(count: number): PeekSlot[] {
  const slots: PeekSlot[] = [];
  for (let i = 1; i <= count; i += 1) {
    const size: PeekSlot['size'] = i === 1 ? 'near' : i === 2 ? 'mid' : 'far';
    slots.push({ offset: i, size });
  }
  return slots;
}

const PEEK_HEIGHT: Record<PeekSlot['size'], string> = {
  near: 'h-[220px] sm:h-[300px] md:h-[380px] lg:h-[510px]',
  mid: 'h-[200px] sm:h-[270px] md:h-[340px] lg:h-[430px]',
  far: 'h-[180px] sm:h-[240px] md:h-[300px] lg:h-[460px]',
};

const PEEK_OPACITY: Record<PeekSlot['size'], string> = {
  near: 'opacity-85 hover:opacity-95',
  mid: 'opacity-45 hover:opacity-60',
  far: 'opacity-40 hover:opacity-55',
};

/** Near peeks get more flex + a mobile min-width so side slivers read as content */
const PEEK_FLEX: Record<PeekSlot['size'], string> = {
  near: 'flex-[2_1_0%] sm:flex-[1.4_1_0%] min-w-[5.5rem] sm:min-w-0',
  mid: 'flex-[1_1_0%] min-w-[3.75rem] sm:min-w-0',
  far: 'flex-[0.75_1_0%]',
};

/**
 * Shared detail-page hero gallery — full-bleed center stage + side peeks.
 * Used by Product/Service Details (`ProductMediaGallery`), Guide Details
 * (`RecommendationMediaGallery`), and Spotlight heroes (`SpotlightContentHero`).
 * Slide animation, mobile peek sizing, fullscreen viewer, and autoplay all live here
 * so every detail hero stays consistent.
 */
export function DetailSliverMediaGallery({
  items,
  ariaLabel = 'Media gallery',
  showAddVideo = false,
  onAddVideo,
  className,
  liveBadge,
  autoplay = true,
  autoplayIntervalMs = AUTO_ADVANCE_MS,
}: DetailSliverMediaGalleryProps) {
  const safeItems = items.length ? items : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const total = safeItems.length;
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const swipeRef = useRef<{ x: number; y: number; active: boolean } | null>(null);
  const suppressClickRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverPausedRef = useRef(false);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  /** Pause autoplay; schedule resume after idle unless sticky hover/zoom holds it */
  const pauseAutoplayForInteraction = useCallback(() => {
    setAutoplayPaused(true);
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      if (!hoverPausedRef.current) setAutoplayPaused(false);
    }, AUTOPLAY_RESUME_MS);
  }, [clearResumeTimer]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => () => clearResumeTimer(), [clearResumeTimer]);

  const goTo = useCallback(
    (nextIndex: number, dirHint?: number) => {
      if (total <= 1) return;
      const normalized = ((nextIndex % total) + total) % total;
      const current = activeIndexRef.current;
      if (normalized === current) return;
      if (dirHint != null) {
        setDirection(dirHint);
      } else {
        const forward = (normalized - current + total) % total;
        const backward = (current - normalized + total) % total;
        setDirection(forward <= backward ? 1 : -1);
      }
      setActiveIndex(normalized);
    },
    [total],
  );

  const goNext = useCallback(() => {
    if (total <= 1) return;
    pauseAutoplayForInteraction();
    goTo(activeIndexRef.current + 1, 1);
  }, [goTo, pauseAutoplayForInteraction, total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    pauseAutoplayForInteraction();
    goTo(activeIndexRef.current - 1, -1);
  }, [goTo, pauseAutoplayForInteraction, total]);

  const goToSlide = useCallback(
    (index: number) => {
      pauseAutoplayForInteraction();
      goTo(index);
    },
    [goTo, pauseAutoplayForInteraction],
  );

  // Auto-advance while idle (shared across all detail heroes)
  useEffect(() => {
    if (!autoplay || total <= 1 || autoplayPaused || zoomOpen) return;
    if (typeof document !== 'undefined' && document.hidden) return;

    const id = window.setInterval(() => {
      if (document.hidden || hoverPausedRef.current) return;
      const current = activeIndexRef.current;
      setDirection(1);
      setActiveIndex((current + 1) % total);
    }, autoplayIntervalMs);

    return () => window.clearInterval(id);
  }, [autoplay, autoplayIntervalMs, autoplayPaused, total, zoomOpen]);

  // Pause when tab is hidden; resume after idle when visible again
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        setAutoplayPaused(true);
        clearResumeTimer();
      } else if (!hoverPausedRef.current && !zoomOpen) {
        pauseAutoplayForInteraction();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [clearResumeTimer, pauseAutoplayForInteraction, zoomOpen]);

  // Hold autoplay while fullscreen zoom is open; resume after close + idle
  const wasZoomOpenRef = useRef(false);
  useEffect(() => {
    if (zoomOpen) {
      wasZoomOpenRef.current = true;
      setAutoplayPaused(true);
      clearResumeTimer();
      return;
    }
    if (wasZoomOpenRef.current) {
      wasZoomOpenRef.current = false;
      if (total > 1 && autoplay) pauseAutoplayForInteraction();
    }
  }, [zoomOpen, total, autoplay, clearResumeTimer, pauseAutoplayForInteraction]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoomOpen && e.key === 'Escape') {
        setZoomOpen(false);
        return;
      }
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, zoomOpen]);

  // Lock page scroll while the fullscreen viewer is open (modal scroll-lock)
  useEffect(() => {
    if (!zoomOpen) return;
    const body = document.body;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    const prev = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      htmlOverflow: html.style.overflow,
    };

    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    // iOS / mobile: overflow alone often still allows rubber-band scroll
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    const preventTouchScroll = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('[data-zoom-viewport]')) return;
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return () => {
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      html.style.overflow = prev.htmlOverflow;
      document.removeEventListener('touchmove', preventTouchScroll);
      window.scrollTo(0, scrollY);
    };
  }, [zoomOpen]);

  // Desktop: wheel / trackpad scroll navigates while fullscreen is open
  useEffect(() => {
    if (!zoomOpen || total <= 1) return;
    let lastNavAt = 0;
    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastNavAt < 320) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX < 12 && absY < 12) return;
      e.preventDefault();
      lastNavAt = now;
      if (absX >= absY) {
        if (e.deltaX > 0) goNext();
        else goPrev();
      } else if (e.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [zoomOpen, total, goNext, goPrev]);

  const zoomSwipeRef = useRef<{ x: number; y: number } | null>(null);

  const onZoomSwipeDown = (e: React.PointerEvent) => {
    if (total <= 1) return;
    if ((e.target as HTMLElement).closest('button, a, iframe, [data-zoom-viewport]')) return;
    zoomSwipeRef.current = { x: e.clientX, y: e.clientY };
  };

  const onZoomSwipeUp = (e: React.PointerEvent) => {
    const start = zoomSwipeRef.current;
    zoomSwipeRef.current = null;
    if (!start || total <= 1) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const onSwipePointerDown = (e: React.PointerEvent) => {
    if (total <= 1 || zoomOpen) return;
    if ((e.target as HTMLElement).closest('a, iframe')) return;
    swipeRef.current = { x: e.clientX, y: e.clientY, active: true };
  };

  const onSwipePointerUp = (e: React.PointerEvent) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start?.active || total <= 1) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    suppressClickRef.current = true;
    if (dx < 0) goNext();
    else goPrev();
  };

  const withSwipeClickGuard = (action: () => void) => (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    action();
  };

  const onHeroMouseEnter = () => {
    hoverPausedRef.current = true;
    setAutoplayPaused(true);
    clearResumeTimer();
  };

  const onHeroMouseLeave = () => {
    hoverPausedRef.current = false;
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      resumeTimerRef.current = null;
      if (!hoverPausedRef.current) setAutoplayPaused(false);
    }, AUTOPLAY_RESUME_MS);
  };

  const onHeroPointerDown = () => {
    // Touch / press — pause immediately; resume after idle (mouse hover uses enter/leave)
    if (hoverPausedRef.current) return;
    pauseAutoplayForInteraction();
  };

  const multi = total > 1;
  /** Mobile: one wider peek per side; desktop keeps the fuller strip */
  const peeksPerSide = useMemo(() => {
    if (total <= 1) return 0;
    if (isMobile) return 1;
    if (total === 2) return 2;
    return Math.min(3, total);
  }, [total, isMobile]);

  const leftSlots = useMemo(() => leftPeekSlots(peeksPerSide), [peeksPerSide]);
  const rightSlots = useMemo(() => rightPeekSlots(peeksPerSide), [peeksPerSide]);

  if (!safeItems.length) return null;

  const current = slideAt(safeItems, activeIndex, 0)!;
  const slideKey = current.id ?? current.url ?? String(activeIndex);

  return (
    <section
      className={cn('relative w-full overflow-x-clip', className)}
      aria-label={ariaLabel}
      onMouseEnter={onHeroMouseEnter}
      onMouseLeave={onHeroMouseLeave}
      onPointerDown={onHeroPointerDown}
    >
      <div
        className={cn(
          'flex w-full items-center gap-2.5 sm:gap-3 md:gap-3.5',
          multi ? 'justify-stretch' : 'justify-center px-4',
        )}
        onPointerDown={onSwipePointerDown}
        onPointerUp={onSwipePointerUp}
        onPointerCancel={() => {
          swipeRef.current = null;
        }}
      >
        {multi ? (
          <div className="flex flex-1 min-w-0 items-center justify-end gap-2.5 sm:gap-3 md:gap-3.5 overflow-hidden">
            {leftSlots.map((slot) => {
              const item = slideAt(safeItems, activeIndex, slot.offset);
              if (!item) return null;
              return (
                <button
                  key={`L${slot.offset}`}
                  type="button"
                  onClick={withSwipeClickGuard(goPrev)}
                  className={cn(
                    'relative min-w-0 overflow-hidden cursor-pointer border-0 p-0 bg-transparent rounded-xl',
                    PEEK_FLEX[slot.size],
                    PEEK_HEIGHT[slot.size],
                    PEEK_OPACITY[slot.size],
                  )}
                  aria-label="Previous media"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={`${activeIndex}:${item.id ?? item.url}:${slot.offset}`}
                      className="absolute inset-0"
                      initial={{ opacity: 0.55, x: direction >= 0 ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0.35, x: direction >= 0 ? -12 : 12 }}
                      transition={SLIDE_TRANSITION}
                    >
                      <SliverMedia item={item} playSize={slot.size === 'near' ? 36 : 28} />
                    </motion.div>
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        ) : null}

        <div
          className={cn(
            'relative overflow-hidden shrink-0 rounded-2xl md:rounded-none',
            // Slightly narrower on mobile so side peeks get more room; desktop unchanged feel
            'w-[min(46vw,760px)] sm:w-[min(50vw,720px)] md:w-[min(48vw,780px)] lg:w-[min(46vw,860px)]',
            'h-[280px] sm:h-[360px] md:h-[460px] lg:h-[580px]',
          )}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.button
              key={slideKey}
              type="button"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SLIDE_TRANSITION}
              onClick={withSwipeClickGuard(() => setZoomOpen(true))}
              className="absolute inset-0 block w-full h-full border-0 p-0 bg-transparent cursor-zoom-in"
              aria-label="View media fullscreen"
            >
              <SliverMedia item={current} playSize={48} />
            </motion.button>
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full bg-black/50 border-0 text-white text-xs sm:text-sm cursor-pointer flex items-center justify-center z-10"
            aria-label="Zoom media"
          >
            🔍
          </button>

          {liveBadge && (
            <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10 flex flex-col items-start gap-2 max-w-[calc(100%-5rem)]">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight shadow-md backdrop-blur-sm',
                  liveBadge.isLive
                    ? 'bg-rose-600/90 text-white'
                    : 'bg-black/60 text-white',
                )}
              >
                <Radio size={12} className={liveBadge.isLive ? 'animate-pulse' : undefined} />
                {liveBadge.label}
              </span>
              {liveBadge.scheduledAt && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-medium backdrop-blur-sm">
                  <Clock size={11} /> {new Date(liveBadge.scheduledAt).toLocaleString()}
                </span>
              )}
              {liveBadge.ctaLabel && (
                <a
                  href="#spotlight-content-hero"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center min-h-[32px] px-3 py-1.5 bg-[#EB4501] text-white text-[10px] font-black uppercase tracking-wider rounded-full hover:bg-[#CF4400] no-underline shadow-md"
                >
                  {liveBadge.ctaLabel}
                </a>
              )}
            </div>
          )}
        </div>

        {multi ? (
          <div className="flex flex-1 min-w-0 items-center justify-start gap-2.5 sm:gap-3 md:gap-3.5 overflow-hidden">
            {rightSlots.map((slot) => {
              const item = slideAt(safeItems, activeIndex, slot.offset);
              if (!item) return null;
              return (
                <button
                  key={`R${slot.offset}`}
                  type="button"
                  onClick={withSwipeClickGuard(goNext)}
                  className={cn(
                    'relative min-w-0 overflow-hidden cursor-pointer border-0 p-0 bg-transparent rounded-xl',
                    PEEK_FLEX[slot.size],
                    PEEK_HEIGHT[slot.size],
                    PEEK_OPACITY[slot.size],
                  )}
                  aria-label="Next media"
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={`${activeIndex}:${item.id ?? item.url}:${slot.offset}`}
                      className="absolute inset-0"
                      initial={{ opacity: 0.55, x: direction >= 0 ? 12 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0.35, x: direction >= 0 ? -12 : 12 }}
                      transition={SLIDE_TRANSITION}
                    >
                      <SliverMedia item={item} playSize={slot.size === 'near' ? 40 : 28} />
                    </motion.div>
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {multi && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 sm:left-4 top-[calc(50%-12px)] -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 border-0 cursor-pointer text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center z-20 text-[#1A1A2E]"
            aria-label="Previous media"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 sm:right-4 top-[calc(50%-12px)] -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 border-0 cursor-pointer text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center z-20 text-[#1A1A2E]"
            aria-label="Next media"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      <div className="flex justify-center items-center gap-1.5 mt-5 px-4">
        {safeItems.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goToSlide(i)}
            className={cn(
              'rounded-full border-0 p-0 cursor-pointer transition-all duration-300 ease-out',
              i === activeIndex ? 'w-5 h-2 bg-[#EB4501]' : 'w-2 h-2 bg-white/35 hover:bg-white/55',
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === activeIndex}
          />
        ))}
        {showAddVideo && (
          <button
            type="button"
            onClick={onAddVideo}
            className="ml-2.5 bg-white/10 border border-white/25 text-white text-[10.5px] font-bold px-3 py-1 rounded-full cursor-pointer"
          >
            + Add Video
          </button>
        )}
      </div>

      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center overscroll-none"
          onClick={() => setZoomOpen(false)}
          onPointerDown={onZoomSwipeDown}
          onPointerUp={onZoomSwipeUp}
          onPointerCancel={() => {
            zoomSwipeRef.current = null;
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed media"
        >
          <div
            className="w-full h-full sm:w-[86vw] sm:h-[84vh] sm:max-w-[960px]"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideoKind(current.kind) ? (
              <div
                className="w-full h-full"
                onPointerDown={(e) => {
                  if (total <= 1) return;
                  zoomSwipeRef.current = { x: e.clientX, y: e.clientY };
                }}
                onPointerUp={onZoomSwipeUp}
              >
                <SliverMedia item={current} playSize={64} />
              </div>
            ) : (
              <PinchZoomImage
                src={current.url}
                alt={current.alt ?? ''}
                onNavigate={
                  total > 1
                    ? (dir) => {
                        if (dir > 0) goNext();
                        else goPrev();
                      }
                    : undefined
                }
              />
            )}
          </div>
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 border-0 text-white cursor-pointer flex items-center justify-center z-10"
                aria-label="Previous media"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 border-0 text-white cursor-pointer flex items-center justify-center z-10"
                aria-label="Next media"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute top-[calc(1rem+env(safe-area-inset-top,0px))] right-4 sm:top-6 sm:right-8 w-10 h-10 rounded-full bg-white/15 border-0 text-white text-lg cursor-pointer flex items-center justify-center z-10"
            aria-label="Close zoom"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
