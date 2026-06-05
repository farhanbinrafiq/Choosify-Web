import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play, ZoomIn } from 'lucide-react';
import { cn } from '../lib/utils';
import { PLACEHOLDER_IMAGE } from '../constants';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export function getRecommendationMedia(guide: any): MediaItem[] {
  const images = [
    guide.image || "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=1200",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=800&fit=crop"
  ];
  
  const isMobile = guide.category?.toUpperCase() === 'MOBILE';
  const isFashion = guide.category?.toUpperCase() === 'FASHION';
  const isBeauty = guide.category?.toUpperCase() === 'BEAUTY';
  const isGaming = guide.category?.toUpperCase() === 'GAMING';
  
  const additionalVideos: string[] = [];
  if (isMobile) {
    additionalVideos.push('https://assets.mixkit.co/videos/preview/mixkit-taking-photos-with-a-smartphone-34356-large.mp4');
  } else if (isFashion) {
    additionalVideos.push('https://assets.mixkit.co/videos/preview/mixkit-man-putting-on-designer-sneakers-42998-large.mp4');
  } else if (isBeauty) {
    additionalVideos.push('https://assets.mixkit.co/videos/preview/mixkit-hand-applying-cream-on-the-skin-of-another-hand-4688-large.mp4');
  } else if (isGaming) {
    additionalVideos.push('https://assets.mixkit.co/videos/preview/mixkit-man-playing-a-first-person-shooter-video-game-4587-large.mp4');
  } else {
    additionalVideos.push('https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-dripping-fresh-beverage-41224-large.mp4');
  }

  const items: MediaItem[] = [];

  // Add primary video if exists
  if (guide.videoUrl) {
    items.push({ type: 'video', url: guide.videoUrl });
  }

  // Add primary image and other images
  images.forEach(img => {
    items.push({ type: 'image', url: img });
  });

  // Add secondary video
  additionalVideos.forEach(vUrl => {
    if (vUrl !== guide.videoUrl) {
      items.push({ type: 'video', url: vUrl });
    }
  });

  // Arrange sequence: [ Video 1 ], [ Photo 1 ], [ Photo 2 ], [ Photo 3 ], [ Video 2 ], [ Photo 4 ]
  const finalItems: MediaItem[] = [];
  const videos = items.filter(x => x.type === 'video');
  const photos = items.filter(x => x.type === 'image');
  
  if (videos.length > 0) {
    finalItems.push(videos[0]);
  }
  if (photos.length > 0) finalItems.push(photos[0]);
  if (photos.length > 1) finalItems.push(photos[1]);
  if (photos.length > 2) finalItems.push(photos[2]);
  if (videos.length > 1) {
    finalItems.push(videos[1]);
  }
  for (let i = 3; i < photos.length; i++) {
    finalItems.push(photos[i]);
  }
  for (let i = 2; i < videos.length; i++) {
    finalItems.push(videos[i]);
  }

  return finalItems;
}

interface RecommendationMediaGalleryProps {
  guide: any;
}

export function RecommendationMediaGallery({ guide }: RecommendationMediaGalleryProps) {
  const mediaItems = getRecommendationMedia(guide);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Zoom Loupe State
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carouselIndex, mediaItems.length]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  // Cursor-tracking loupe zoom coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const currentMedia = mediaItems[carouselIndex] || mediaItems[0];

  return (
    <div className="w-full flex flex-col gap-5 select-none" id={`recommendation-gallery-${guide.id}`}>
      {/* 1. HERO MAIN VIEWPORT container with proportional aspect ratio and smooth transition */}
      <div 
        className={cn(
          "w-full h-[320px] md:h-[480px] rounded-[24px] md:rounded-[32px] overflow-hidden relative shadow-2xl group border border-white/10",
          currentMedia.type === 'video' ? 'bg-black' : 'bg-[#1D1D2B]/80'
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={carouselIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full h-full relative"
          >
            {currentMedia.type === 'video' ? (
              <div className="w-full h-full flex items-center justify-center relative bg-black/95">
                <video
                  ref={videoRef}
                  src={currentMedia.url}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  className="max-w-full max-h-full object-contain"
                />
                
                {/* Volume Controller overlay with smooth transition feedback */}
                <button
                  type="button"
                  onClick={() => setIsMuted(prev => !prev)}
                  className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 px-3.5 py-2 bg-black/80 hover:bg-black text-white hover:text-orange-primary font-bold text-[10px] rounded-xl border border-white/10 shadow-lg tracking-wider transition-colors cursor-pointer"
                >
                  {isMuted ? (
                    <>
                      <VolumeX size={14} className="text-rose-500 animate-pulse" />
                      <span>UNMUTE VIDEO REVIEW</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={14} className="text-emerald-400" />
                      <span>MUTED</span>
                    </>
                  )}
                </button>

                {/* Leftcorner indicator badge */}
                <span className="absolute top-4 left-4 bg-orange-primary text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full italic animate-pulse">
                  PLAYING VIDEO PREVIEW
                </span>
              </div>
            ) : (
              /* Image display with highly optimized cursor coordinates magnify glass zoom loupe */
              <div 
                className="w-full h-full relative flex items-center justify-center cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
              >
                <img
                  src={currentMedia.url}
                  alt={guide.title}
                  className="max-w-full max-h-full object-contain select-none transition-transform duration-150 ease-out"
                  style={{
                    transform: isZooming ? 'scale(2.2)' : 'scale(1)',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                  }}
                />
                
                {/* Visual guideline loupe marker overlay */}
                {!isZooming && (
                  <div className="absolute bottom-4 right-4 bg-[#0A0A14]/80 backdrop-blur-md text-white border border-white/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={12} /> Hover To Magnify
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Navigation Chevrons inside Main Viewport */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/25 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 shadow-lg group-hover:scale-105 cursor-pointer z-20"
          aria-label="Previous Media"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/25 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 shadow-lg group-hover:scale-105 cursor-pointer z-20"
          aria-label="Next Media"
        >
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>
      </div>

      {/* 2. THUMBNAILS HORIZONTAL SCROLL row with Mixed-Media Indicator badges */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none items-center justify-start max-w-full">
        {mediaItems.map((media, i) => {
          const isActive = i === carouselIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setCarouselIndex(i)}
              className={cn(
                "relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 bg-slate-900 transition-all flex items-center justify-center p-1 cursor-pointer",
                isActive 
                  ? "border-orange-primary scale-105 shadow-md shadow-orange-primary/10" 
                  : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
              )}
            >
              {media.type === 'video' ? (
                <div className="w-full h-full relative flex items-center justify-center bg-black/40">
                  <video
                    src={media.url}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-xl">
                    <Play size={20} className="fill-current text-white drop-shadow-md" />
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[6px] font-black uppercase px-1 rounded-sm leading-none">
                    VIDEO
                  </span>
                </div>
              ) : (
                <img
                  src={media.url}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-contain rounded-xl"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Indicators Dots */}
      <div className="flex justify-center items-center gap-1.5">
        {mediaItems.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCarouselIndex(i)}
            className={cn(
              "h-1.5 transition-all duration-300 rounded-full border-none p-0 cursor-pointer",
              carouselIndex === i ? "w-10 bg-orange-primary" : "w-2 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
