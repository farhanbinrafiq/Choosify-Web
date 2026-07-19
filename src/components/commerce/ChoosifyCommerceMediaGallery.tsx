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
  Images,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ChoosifyCommerceMediaGalleryProps } from './commerceMediaTypes';
import type { ChoosifyMediaItem } from '../media/choosifyMediaTypes';
import { ASPECT_CSS, isVideoKind, resolveItemAspect } from '../media/choosifyMediaTypes';

const DESKTOP_ZOOM = 2.2;
const MOBILE_ZOOM = 2;

/** Detail-page commerce gallery — homepage-inspired visual language, commerce capabilities */
export function ChoosifyCommerceMediaGallery({
  items,
  ariaLabel = 'Commerce media gallery',
  initialIndex = 0,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  maxTheaterHeight = 608,
  className,
}: ChoosifyCommerceMediaGalleryProps) {
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

  /** Preload adjacent slides only */
  useEffect(() => {
    if (!safeItems.length) return;
    const preload = (idx: number) => {
      const item = safeItems[idx];
      if (!item || isVideoKind(item.kind)) return;
      const img = new Image();
      img.src = item.posterUrl ?? item.url;
    };
    preload((activeIndex + 1) % safeItems.length);
    preload((activeIndex - 1 + safeItems.length) % safeItems.length);
  }, [activeIndex, safeItems]);

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

  const enterFullscreen = async () => {
    try {
      if (theaterRef.current?.requestFullscreen) {
        await theaterRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } catch {
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) exitFullscreen();
    else void enterFullscreen();
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
          className="w-full h-full rounded-[20px]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      );
    }

    if (item.kind === 'panorama360') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black/80 text-white text-xs font-bold uppercase p-4 text-center rounded-[20px]">
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
            className="max-w-full max-h-full object-contain rounded-[20px]"
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
              className="w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
            </button>
            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              className="flex items-center gap-1.5 px-3 py-2 bg-black/55 text-white text-[10px] font-bold rounded-full border border-white/20 backdrop-blur-md"
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

    if (item.kind === 'carousel' && mode === 'thumb') {
      return (
        <div className="w-full h-full relative flex items-center justify-center bg-black/50 rounded-xl">
          <Images size={16} className="text-white" />
        </div>
      );
    }

    if (mode === 'main') {
      const scale = mobileZoom > 1 ? mobileZoom : isHoverZoom ? DESKTOP_ZOOM : 1;
      return (
        <div
          className="w-full h-full relative flex items-center justify-center touch-none md:touch-auto"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoverZoom(true)}
          onMouseLeave={() => setIsHoverZoom(false)}
          onClick={() => {
            if (window.matchMedia('(max-width: 767px)').matches) {
              handleDoubleTap();
            } else {
              void enterFullscreen();
            }
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void enterFullscreen();
          }}
          aria-label="Zoom or view fullscreen"
        >
          <img
            src={item.url}
            alt={item.alt ?? ''}
            loading="lazy"
            className="max-w-full max-h-full object-contain select-none transition-transform duration-150 ease-out rounded-[20px]"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: mobileZoom > 1 ? 'center center' : `${zoomPos.x}% ${zoomPos.y}%`,
            }}
            draggable={false}
          />
          {scale <= 1 && (
            <div className="absolute bottom-4 right-4 bg-black/55 text-white border border-white/20 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 hidden md:flex backdrop-blur-md">
              <ZoomIn size={12} className="text-[#EB4501]" /> Hover to magnify · Click for fullscreen
            </div>
          )}
          {scale <= 1 && (
            <div className="absolute bottom-4 right-4 bg-black/55 text-white px-2 py-1 text-[8px] font-bold uppercase rounded-full md:hidden backdrop-blur-md">
              Pinch or double-tap to zoom
            </div>
          )}
        </div>
      );
    }

    return (
      <img src={item.posterUrl ?? item.url} alt="" className="w-full h-full object-contain rounded-xl" loading="lazy" />
    );
  };

  const thumbLabel = (item: ChoosifyMediaItem) => {
    if (item.label) return item.label;
    if (item.kind === 'portrait_video') return 'Reel';
    if (isVideoKind(item.kind)) return 'Video';
    if (item.kind === 'carousel') return 'Gallery';
    return undefined;
  };

  const theater = (
    <div
      ref={theaterRef}
      className={cn(
        'w-full overflow-hidden relative flex items-center justify-center select-none rounded-[20px]',
        isFullscreen ? 'fixed inset-0 z-[200] bg-black h-screen rounded-none' : 'xl:h-[608px] h-auto',
      )}
      style={!isFullscreen ? { maxHeight: theaterMaxH } : undefined}
      onTouchStart={handleTouchStartSwipe}
      onTouchMove={handleTouchMovePinch}
      onTouchEnd={handleTouchEndSwipe}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-[20px]"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.02) 100%)',
        }}
      />

      <div
        className="max-w-[1080px] w-full mx-auto h-full relative flex items-center justify-center"
        style={
          !isFullscreen
            ? {
                aspectRatio: aspectCss.replace(' / ', '/'),
                maxHeight: `${theaterMaxH}px`,
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
            transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.85 }}
            className="w-full h-full relative flex items-center justify-center"
          >
            {renderMedia(current, 'main')}
          </motion.div>
        </AnimatePresence>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center z-20 backdrop-blur-md hover:bg-white/20 transition-colors"
              aria-label="Previous media"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center z-20 backdrop-blur-md hover:bg-white/20 transition-colors"
              aria-label="Next media"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          {isFullscreen && (
            <button
              type="button"
              onClick={exitFullscreen}
              className="w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center backdrop-blur-md"
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
          <div
            className="flex gap-3 overflow-x-auto pb-2 scrollbar-none items-center justify-start max-w-full"
            role="tablist"
            aria-label="Media thumbnails"
          >
            {safeItems.map((media, i) => {
              const isActive = i === activeIndex;
              const thumbAspect = resolveItemAspect(media);
              const thumbPortrait = thumbAspect === '9/16';
              const label = thumbLabel(media);
              return (
                <button
                  key={media.id}
                  type="button"
                  role="tab"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    'relative shrink-0 rounded-2xl overflow-hidden border-2 bg-black/40 transition-all duration-350 flex items-center justify-center p-1 cursor-pointer',
                    thumbPortrait ? 'w-14 h-24' : 'w-20 h-20',
                    isActive
                      ? 'border-[#EB4501] scale-105 shadow-md shadow-[#EB4501]/15'
                      : 'border-white/10 hover:border-white/40 opacity-70 hover:opacity-100',
                  )}
                  aria-label={`View media ${i + 1}${label ? ` — ${label}` : ''}`}
                  aria-selected={isActive}
                >
                  {renderMedia(media, 'thumb')}
                  {label && (
                    <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[6px] font-black uppercase px-1 rounded-sm">
                      {label}
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
                    'h-1.5 transition-all duration-500 rounded-full border-none p-0 cursor-pointer',
                    activeIndex === i ? 'w-9 bg-[#EB4501]' : 'w-2 bg-white/22 hover:bg-white/40',
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
