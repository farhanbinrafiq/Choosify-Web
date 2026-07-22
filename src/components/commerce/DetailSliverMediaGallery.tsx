import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { CommerceMediaItem } from './commerceMediaTypes';
import { isVideoKind } from '../media/choosifyMediaTypes';

const ZOOM_MAX = 4;
const ZOOM_TAP_SCALE = 2.5;

/**
 * Touch-friendly fullscreen image: tap to toggle zoom, pinch to zoom, drag to pan.
 * Pointer-events based so it works with mouse (click toggles, drag pans) too.
 */
function PinchZoomImage({ src, alt }: { src: string; alt: string }) {
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

    if (pointers.current.size === 1 && view.scale > 1) {
      const dx = e.clientX - g.origin.x;
      const dy = e.clientY - g.origin.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) g.moved = true;
      setView(clampView(view.scale, g.startX + dx, g.startY + dy));
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

  return (
    <div
      ref={containerRef}
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

const PEEK_FLEX: Record<PeekSlot['size'], string> = {
  near: 'flex-[1.4_1_0%]',
  mid: 'flex-[1_1_0%]',
  far: 'flex-[0.75_1_0%]',
};

/**
 * Detail hero gallery — full-bleed center-focused strip with repeating side peeks
 * (shared by Product Detail + Guide Detail via ProductMediaGallery / RecommendationMediaGallery).
 */
export function DetailSliverMediaGallery({
  items,
  ariaLabel = 'Media gallery',
  showAddVideo = false,
  onAddVideo,
  className,
}: DetailSliverMediaGalleryProps) {
  const safeItems = items.length ? items : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const total = safeItems.length;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

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

  // Lock page scroll while the fullscreen viewer is open
  useEffect(() => {
    if (!zoomOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [zoomOpen]);

  const multi = total > 1;
  /** Enough peeks to fill each side of a full-bleed hero without empty navy gaps */
  const peeksPerSide = useMemo(() => {
    if (total <= 1) return 0;
    if (total === 2) return 2;
    return Math.min(3, total);
  }, [total]);

  const leftSlots = useMemo(() => leftPeekSlots(peeksPerSide), [peeksPerSide]);
  const rightSlots = useMemo(() => rightPeekSlots(peeksPerSide), [peeksPerSide]);

  if (!safeItems.length) return null;

  const current = slideAt(safeItems, activeIndex, 0)!;

  return (
    <section className={cn('relative w-full overflow-x-clip', className)} aria-label={ariaLabel}>
      <div
        className={cn(
          'flex w-full items-center gap-2 sm:gap-3 md:gap-3.5',
          multi ? 'justify-stretch' : 'justify-center px-4',
        )}
      >
        {multi ? (
          <div className="flex flex-1 min-w-0 items-center justify-end gap-2 sm:gap-3 md:gap-3.5 overflow-hidden">
            {leftSlots.map((slot) => {
              const item = slideAt(safeItems, activeIndex, slot.offset);
              if (!item) return null;
              return (
                <button
                  key={`L${slot.offset}`}
                  type="button"
                  onClick={goPrev}
                  className={cn(
                    'relative min-w-0 overflow-hidden cursor-pointer border-0 p-0 bg-transparent rounded-xl',
                    PEEK_FLEX[slot.size],
                    PEEK_HEIGHT[slot.size],
                    PEEK_OPACITY[slot.size],
                  )}
                  aria-label="Previous media"
                >
                  <SliverMedia item={item} playSize={slot.size === 'near' ? 36 : 28} />
                </button>
              );
            })}
          </div>
        ) : null}

        <div
          className={cn(
            'relative overflow-hidden shrink-0 rounded-2xl md:rounded-none',
            multi
              ? 'w-[min(52vw,760px)] sm:w-[min(50vw,720px)] md:w-[min(48vw,780px)] lg:w-[min(46vw,860px)] h-[280px] sm:h-[360px] md:h-[460px] lg:h-[580px]'
              : 'w-full max-w-[640px] h-[280px] sm:h-[360px] md:h-[420px] lg:h-[580px]',
          )}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="block w-full h-full border-0 p-0 bg-transparent cursor-zoom-in"
            aria-label="View media fullscreen"
          >
            <SliverMedia item={current} playSize={48} />
          </button>
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 w-8 h-8 sm:w-[34px] sm:h-[34px] rounded-full bg-black/50 border-0 text-white text-xs sm:text-sm cursor-pointer flex items-center justify-center z-10"
            aria-label="Zoom media"
          >
            🔍
          </button>
        </div>

        {multi ? (
          <div className="flex flex-1 min-w-0 items-center justify-start gap-2 sm:gap-3 md:gap-3.5 overflow-hidden">
            {rightSlots.map((slot) => {
              const item = slideAt(safeItems, activeIndex, slot.offset);
              if (!item) return null;
              return (
                <button
                  key={`R${slot.offset}`}
                  type="button"
                  onClick={goNext}
                  className={cn(
                    'relative min-w-0 overflow-hidden cursor-pointer border-0 p-0 bg-transparent rounded-xl',
                    PEEK_FLEX[slot.size],
                    PEEK_HEIGHT[slot.size],
                    PEEK_OPACITY[slot.size],
                  )}
                  aria-label="Next media"
                >
                  <SliverMedia item={item} playSize={slot.size === 'near' ? 40 : 28} />
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
            onClick={() => setActiveIndex(i)}
            className={cn(
              'rounded-full border-0 p-0 cursor-pointer transition-all',
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
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed media"
        >
          <div
            className="w-full h-full sm:w-[86vw] sm:h-[84vh] sm:max-w-[960px]"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideoKind(current.kind) ? (
              <SliverMedia item={current} playSize={64} />
            ) : (
              <PinchZoomImage src={current.url} alt={current.alt ?? ''} />
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
