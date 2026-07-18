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
 * Choosify.dc.html detail hero — full-bleed 6/14/46/32 sliver carousel.
 * Edge-to-edge on both sides; equal 14px gaps only between frames.
 * Used on Product Detail and Guide Detail (and Spotlight content heroes).
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
  const next2 = slideAt(safeItems, activeIndex, 2);

  return (
    <section className={cn('relative w-full overflow-x-clip', className)} aria-label={ariaLabel}>
      {/* Desktop / tablet — full-bleed edge-to-edge; 14px gaps only between frames */}
      <div
        className={cn(
          'hidden md:grid w-full items-center gap-3.5',
          total > 1
            ? 'grid-cols-[minmax(0,6fr)_minmax(0,14fr)_minmax(0,46fr)_minmax(0,32fr)]'
            : 'grid-cols-1',
        )}
      >
        {total > 1 && (
          <div className="relative h-[340px] lg:h-[460px] overflow-hidden opacity-45 min-w-0 rounded-none">
            {prev ? <SliverMedia item={prev} playSize={36} /> : null}
          </div>
        )}
        {total > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="relative h-[320px] lg:h-[430px] overflow-hidden opacity-40 cursor-pointer border-0 p-0 bg-transparent min-w-0 rounded-none"
            aria-label="Skip ahead"
          >
            {next2 ? <SliverMedia item={next2} playSize={40} /> : null}
          </button>
        )}
        <div
          className={cn(
            'relative h-[420px] lg:h-[580px] overflow-hidden min-w-0',
            total > 1 ? 'rounded-[14px]' : 'rounded-none w-full',
          )}
        >
          <SliverMedia item={current} playSize={56} />
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="absolute top-3.5 right-3.5 w-[34px] h-[34px] rounded-full bg-black/50 border-0 text-white text-sm cursor-pointer flex items-center justify-center z-10"
            aria-label="Zoom media"
          >
            🔍
          </button>
        </div>
        {total > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="relative h-[380px] lg:h-[510px] overflow-hidden opacity-85 cursor-pointer border-0 p-0 bg-transparent min-w-0 rounded-none"
            aria-label="Next media"
          >
            {next ? <SliverMedia item={next} playSize={52} /> : null}
          </button>
        )}
      </div>

      {/* Mobile: edge-to-edge current + peek */}
      <div className="flex md:hidden gap-2.5 items-center w-full">
        <div
          className={cn(
            'relative h-[320px] overflow-hidden min-w-0',
            total > 1 ? 'flex-[1_1_70%] rounded-r-[14px] rounded-l-none' : 'flex-1 rounded-none',
          )}
        >
          <SliverMedia item={current} playSize={48} />
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 border-0 text-white text-xs cursor-pointer flex items-center justify-center z-10"
            aria-label="Zoom media"
          >
            🔍
          </button>
        </div>
        {next && total > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="relative flex-[0_0_28%] h-[280px] overflow-hidden opacity-85 cursor-pointer border-0 p-0 bg-transparent rounded-l-[14px] rounded-r-none"
            aria-label="Next media"
          >
            <SliverMedia item={next} playSize={36} />
          </button>
        )}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 border-0 cursor-pointer text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center z-20 text-[#1A1A2E]"
            aria-label="Previous media"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 border-0 cursor-pointer text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] flex items-center justify-center z-20 text-[#1A1A2E]"
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
