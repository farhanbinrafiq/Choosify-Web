import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  ZoomIn,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ChoosifyMediaGalleryProps, ChoosifyMediaItem } from './choosifyMediaTypes';
import { ASPECT_CSS, isVideoKind, resolveItemAspect } from './choosifyMediaTypes';

const DESKTOP_ZOOM = 2.2;
const MOBILE_ZOOM = 2;

/**
 * @deprecated Internal legacy gallery — use ChoosifyCommerceMediaGallery on detail pages.
 * Homepage must never import this component.
 */
export function ChoosifyMediaGallery({
  items,
  ariaLabel = 'Media gallery',
  initialIndex = 0,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  layout = 'theater',
  maxTheaterHeight = 608,
  className,
  renderOverlay,
}: ChoosifyMediaGalleryProps) {
  const [internalIndex, setInternalIndex] = useState(initialIndex);
  const activeIndex = controlledIndex ?? internalIndex;

  const setActiveIndex = useCallback(
    (next: number | ((prev: number) => number)) => {
      const value = typeof next === 'function' ? next(activeIndex) : next;
      if (controlledIndex === undefined) setInternalIndex(value);
      onActiveIndexChange?.(value);
    },
    [activeIndex, controlledIndex, onActiveIndexChange],
  );

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [mobileZoom, setMobileZoom] = useState(1);
  const lastTapRef = useRef(0);
  const pinchStartRef = useRef<{ distance: number; zoom: number } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const theaterRef = useRef<HTMLDivElement>(null);

  const safeItems = items.length ? items : [];
  const current = safeItems[activeIndex] ?? safeItems[0];
  const total = safeItems.length;

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
    setMobileZoom(1);
    setIsHoverZoom(false);
  }, [total, setActiveIndex]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setMobileZoom(1);
    setIsHoverZoom(false);
  }, [total, setActiveIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, isFullscreen]);

  useEffect(() => {
    setMobileZoom(1);
    setIsHoverZoom(false);
    setIsPlaying(true);
  }, [activeIndex]);

  const handleTouchStartSwipe = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartRef.current = { distance: Math.hypot(dx, dy), zoom: mobileZoom };
      return;
    }
    if (mobileZoom > 1) return;
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMovePinch = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || !pinchStartRef.current) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const distance = Math.hypot(dx, dy);
    const ratio = distance / pinchStartRef.current.distance;
    setMobileZoom(Math.min(3, Math.max(1, pinchStartRef.current.zoom * ratio)));
  };

  const handleTouchEndSwipe = (e: React.TouchEvent) => {
    pinchStartRef.current = null;
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50 && mobileZoom <= 1) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setMobileZoom((z) => (z > 1 ? 1 : MOBILE_ZOOM));
    }
    lastTapRef.current = now;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      return;
    }
    try {
      if (theaterRef.current?.requestFullscreen) {
        await theaterRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } catch {
      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  if (!current) return null;

  const aspect = resolveItemAspect(current);
  const aspectCss = ASPECT_CSS[aspect];
  const isPortrait = aspect === '9/16';
  const theaterMaxH = isPortrait ? Math.min(maxTheaterHeight, 720) : maxTheaterHeight;

  const renderMedia = (item: ChoosifyMediaItem, mode: 'main' | 'thumb' = 'main') => {
    const video = isVideoKind(item.kind);

    if (item.kind === 'live' && item.embedUrl) {
      return (
        <iframe
          src={item.embedUrl}
          title={item.alt ?? 'Live stream'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      );
    }

    if (item.kind === 'panorama360') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black/80 text-white text-xs font-bold uppercase p-4 text-center">
          360° media preview coming soon
        </div>
      );
    }

    if (video && mode === 'main') {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src={item.url}
            poster={item.posterUrl}
            autoPlay={isPlaying}
            muted={isMuted}
            loop
            playsInline
            className="max-w-full max-h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 z-20">
            <button
              type="button"
              onClick={() => {
                const el = videoRef.current;
                if (!el) return;
                if (el.paused) {
                  void el.play();
                  setIsPlaying(true);
                } else {
                  el.pause();
                  setIsPlaying(false);
                }
              }}
              className="p-2 rounded-full bg-black/75 text-white border border-white/10"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              className="flex items-center gap-1.5 px-3 py-2 bg-black/80 text-white text-[10px] font-bold rounded-xl border border-white/10"
            >
              {isMuted ? <VolumeX size={14} className="text-rose-400" /> : <Volume2 size={14} />}
              {isMuted ? 'Unmute' : 'Muted'}
            </button>
          </div>
        </div>
      );
    }

    if (video && mode === 'thumb') {
      return (
        <div className="w-full h-full relative">
          <video src={item.url} muted playsInline className="w-full h-full object-cover rounded-xl" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
            <Play size={18} className="text-white fill-white" />
          </div>
        </div>
      );
    }

    if (mode === 'main') {
      const scale = mobileZoom > 1 ? mobileZoom : isHoverZoom ? DESKTOP_ZOOM : 1;
      return (
        <div
          className="w-full h-full relative flex items-center justify-center cursor-zoom-in touch-none md:touch-auto"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoverZoom(true)}
          onMouseLeave={() => setIsHoverZoom(false)}
          onClick={handleDoubleTap}
        >
          <img
            src={item.url}
            alt={item.alt ?? ''}
            className="max-w-full max-h-full object-contain select-none transition-transform duration-150 ease-out"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: mobileZoom > 1 ? 'center center' : `${zoomPos.x}% ${zoomPos.y}%`,
            }}
            draggable={false}
          />
          {scale <= 1 && (
            <div className="absolute bottom-4 right-4 bg-black/80 text-white border border-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 hidden md:flex">
              <ZoomIn size={12} className="text-[#E8500A]" /> Hover to magnify
            </div>
          )}
          {scale <= 1 && (
            <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 text-[8px] font-bold uppercase rounded md:hidden">
              Double-tap to zoom
            </div>
          )}
        </div>
      );
    }

    return (
      <img src={item.posterUrl ?? item.url} alt="" className="w-full h-full object-contain rounded-xl" />
    );
  };

  const theater = (
    <div
      ref={theaterRef}
      className={cn(
        'w-full bg-transparent overflow-hidden relative flex items-center justify-center select-none',
        isFullscreen ? 'fixed inset-0 z-[200] bg-black h-screen' : '',
        layout === 'theater' ? 'xl:h-[608px] h-auto' : 'h-full min-h-[280px]',
      )}
      style={!isFullscreen && layout === 'theater' ? { maxHeight: theaterMaxH } : undefined}
      onTouchStart={handleTouchStartSwipe}
      onTouchMove={handleTouchMovePinch}
      onTouchEnd={handleTouchEndSwipe}
    >
      <div
        className={cn(
          'max-w-[1080px] w-full mx-auto h-full relative flex items-center justify-center bg-transparent',
          !isFullscreen && aspect !== 'auto' && 'aspect-auto',
        )}
        style={
          !isFullscreen
            ? {
                aspectRatio: aspectCss.replace(' / ', '/'),
                maxHeight: isPortrait ? `${theaterMaxH}px` : `${theaterMaxH}px`,
              }
            : { height: '100%' }
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full relative flex items-center justify-center"
          >
            {renderMedia(current, 'main')}
            {renderOverlay?.(current, activeIndex)}
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white z-20"
              aria-label="Previous media"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/30 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white z-20"
              aria-label="Next media"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-black/50 text-white border border-white/10 hover:bg-black/80"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          {isFullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-full bg-black/50 text-white border border-white/10"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className={cn('w-full flex flex-col bg-transparent', className)} aria-label={ariaLabel}>
      {theater}

      <div className="w-full bg-transparent py-4">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 flex flex-col gap-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none items-center justify-start max-w-full">
            {safeItems.map((media, i) => {
              const isActive = i === activeIndex;
              const thumbAspect = resolveItemAspect(media);
              const thumbPortrait = thumbAspect === '9/16';
              return (
                <button
                  key={media.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    'relative shrink-0 rounded-2xl overflow-hidden border-2 bg-black/40 transition-all flex items-center justify-center p-1 cursor-pointer',
                    thumbPortrait ? 'w-14 h-24' : 'w-20 h-20',
                    isActive
                      ? 'border-[#E8500A] scale-105 shadow-md shadow-[#E8500A]/10'
                      : 'border-white/10 hover:border-white/40 opacity-70 hover:opacity-100',
                  )}
                  aria-label={`View media ${i + 1}`}
                  aria-current={isActive}
                >
                  {renderMedia(media, 'thumb')}
                  {media.label && (
                    <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[6px] font-black uppercase px-1 rounded-sm">
                      {media.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {total > 1 && (
            <div className="flex justify-center items-center gap-1.5">
              {safeItems.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    'h-1.5 transition-all duration-300 rounded-full border-none p-0',
                    activeIndex === i ? 'w-10 bg-[#E8500A]' : 'w-2 bg-white/20 hover:bg-white/40',
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
