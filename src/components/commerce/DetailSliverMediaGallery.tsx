import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { CommerceMediaItem } from './commerceMediaTypes';
import { isVideoKind } from '../media/choosifyMediaTypes';

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

/**
 * Detail hero gallery — centered primary frame with balanced side peeks
 * on both mobile and desktop (no left-heavy / sideways layout).
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

  if (!safeItems.length) return null;

  const current = slideAt(safeItems, activeIndex, 0)!;
  const prev = slideAt(safeItems, activeIndex, -1);
  const next = slideAt(safeItems, activeIndex, 1);
  const multi = total > 1;

  return (
    <section className={cn('relative w-full overflow-x-clip', className)} aria-label={ariaLabel}>
      {/* Symmetric 3-column grid keeps the primary slide dead-center on all breakpoints */}
      <div
        className={cn(
          'mx-auto w-full max-w-[1100px] px-3 sm:px-5 grid items-center gap-2 sm:gap-3.5',
          multi
            ? 'grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)_minmax(0,1fr)]'
            : 'grid-cols-1 justify-items-center',
        )}
      >
        {multi ? (
          <button
            type="button"
            onClick={goPrev}
            className="relative justify-self-stretch h-[200px] sm:h-[280px] md:h-[340px] lg:h-[460px] overflow-hidden opacity-45 hover:opacity-60 cursor-pointer border-0 p-0 bg-transparent min-w-0 rounded-xl"
            aria-label="Previous media"
          >
            {prev ? <SliverMedia item={prev} playSize={28} /> : null}
          </button>
        ) : null}

        <div
          className={cn(
            'relative overflow-hidden min-w-0 w-full rounded-2xl md:rounded-[14px]',
            multi
              ? 'h-[280px] sm:h-[360px] md:h-[420px] lg:h-[580px]'
              : 'h-[280px] sm:h-[360px] md:h-[420px] lg:h-[580px] max-w-[640px]',
          )}
        >
          <SliverMedia item={current} playSize={48} />
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
          <button
            type="button"
            onClick={goNext}
            className="relative justify-self-stretch h-[200px] sm:h-[280px] md:h-[340px] lg:h-[460px] overflow-hidden opacity-45 hover:opacity-60 cursor-pointer border-0 p-0 bg-transparent min-w-0 rounded-xl"
            aria-label="Next media"
          >
            {next ? <SliverMedia item={next} playSize={28} /> : null}
          </button>
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
              i === activeIndex ? 'w-5 h-2 bg-[#FF5B00]' : 'w-2 h-2 bg-white/35 hover:bg-white/55',
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === activeIndex}
          />
        ))}
        {showAddVideo && (
          <button
            type="button"
            onClick={onAddVideo}
            className="ml-2.5 bg-white/10 border border-white/25 text-white text-[10.5px] font-bold px-3 py-1 rounded-[14px] cursor-pointer"
          >
            + Add Video
          </button>
        )}
      </div>

      {zoomOpen && (
        <div
          className="fixed inset-0 bg-black/86 z-[200] flex items-center justify-center"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed media"
        >
          <div
            className="w-[80vw] h-[80vh] max-w-[900px]"
            onClick={(e) => e.stopPropagation()}
          >
            <SliverMedia item={current} playSize={64} />
          </div>
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute top-6 right-8 w-10 h-10 rounded-full bg-white/15 border-0 text-white text-lg cursor-pointer flex items-center justify-center"
            aria-label="Close zoom"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </section>
  );
}
