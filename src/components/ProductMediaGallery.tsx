import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Play, ZoomIn } from 'lucide-react';
import { cn } from '../lib/utils';
import { PLACEHOLDER_IMAGE } from '../constants';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export function getProductMedia(product: any, selectedVariantImage?: string): MediaItem[] {
  const mainImg = selectedVariantImage || product.image || PLACEHOLDER_IMAGE;
  const isTechOrMobile = product.category?.toLowerCase().includes('tech') || 
                        product.category?.toLowerCase().includes('mobile') ||
                        product.category?.toLowerCase().includes('phone') ||
                        product.category?.toLowerCase().includes('gaming') ||
                        product.category?.toLowerCase().includes('appliance');
  
  const isFashion = product.category?.toLowerCase().includes('fashion') || 
                    product.category?.toLowerCase().includes('lifestyle') ||
                    product.category?.toLowerCase().includes('jewelry');

  if (isTechOrMobile) {
    return [
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-taking-photos-with-a-smartphone-34356-large.mp4' },
      { type: 'image', url: mainImg },
      { type: 'image', url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=800&fit=crop' },
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-virtual-reality-glasses-4384-large.mp4' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=800&fit=crop' }
    ];
  } else if (isFashion) {
    return [
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-pair-of-new-athletic-shoes-42999-large.mp4' },
      { type: 'image', url: mainImg },
      { type: 'image', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop' },
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-man-putting-on-designer-sneakers-42998-large.mp4' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?w=1200&h=800&fit=crop' }
    ];
  } else {
    return [
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-serving-coffee-from-a-french-press-coffee-maker-41223-large.mp4' },
      { type: 'image', url: mainImg },
      { type: 'image', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop' },
      { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-dripping-fresh-beverage-41224-large.mp4' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop' }
    ];
  }
}

interface ProductMediaGalleryProps {
  product: any;
  selectedVariantImage?: string;
}

export function ProductMediaGallery({ product, selectedVariantImage }: ProductMediaGalleryProps) {
  const mediaItems = getProductMedia(product, selectedVariantImage);
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
    <div className="w-full flex flex-col bg-transparent">
      {/* 1. THEATER CONTAINER: width: 100%; background: transparent; height: 608px on desktop, proportional 16:9 on mobile */}
      <div className="w-full bg-transparent xl:h-[608px] h-auto aspect-video xl:aspect-auto overflow-hidden relative flex items-center justify-center select-none">
        
        {/* 2. CENTER MEDIA AREA: max-width: 1080px; width: 100%; aspect-ratio: 16 / 9; margin: 0 auto; */}
        <div className="max-w-[1080px] w-full aspect-video mx-auto h-full relative flex items-center justify-center bg-transparent">
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full h-full relative flex items-center justify-center"
            >
              {currentMedia.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center relative bg-transparent">
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
                    className="absolute bottom-4 right-4 z-30 flex items-center gap-1.5 px-3.5 py-2 bg-black/80 hover:bg-black text-white hover:text-[#E8500A] font-bold text-[10px] rounded-xl border border-white/10 shadow-lg tracking-wider transition-colors"
                  >
                    {isMuted ? (
                      <>
                        <VolumeX size={14} className="text-rose-500 animate-pulse" />
                        <span>UNMUTE PRODUCT VIDEO</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={14} className="text-emerald-400" />
                        <span>MUTED</span>
                      </>
                    )}
                  </button>

                  {/* Leftcorner indicator badge */}
                  <span className="absolute top-4 left-4 bg-[#E8500A] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full italic animate-pulse">
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
                    alt={product.title}
                    className="max-w-full max-h-full object-contain select-none transition-transform duration-150 ease-out"
                    style={{
                      transform: isZooming ? 'scale(2.2)' : 'scale(1)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                    }}
                  />
                  
                  {/* Visual guideline loupe marker overlay */}
                  {!isZooming && (
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white border border-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={12} className="text-[#E8500A]" /> Hover To Magnify
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
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 shadow-lg group-hover:scale-105"
            aria-label="Previous Media"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-all active:scale-95 shadow-lg group-hover:scale-105"
            aria-label="Next Media"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* 3. THUMBNAILS & INDICATORS: horizontal row centered inside 1080px area */}
      <div className="w-full bg-transparent py-4">
        <div className="max-w-[1080px] mx-auto px-6 flex flex-col gap-4">
          
          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none items-center justify-start max-w-full font-sans">
            {mediaItems.map((media, i) => {
              const isActive = i === carouselIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCarouselIndex(i)}
                  className={cn(
                    "relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 bg-black/40 transition-all flex items-center justify-center p-1 cursor-pointer",
                    isActive 
                      ? "border-[#E8500A] scale-105 shadow-md shadow-[#E8500A]/10" 
                      : "border-white/10 hover:border-white/40 opacity-70 hover:opacity-100"
                  )}
                >
                  {media.type === 'video' ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-black/10">
                      {/* Miniature video thumbnail playing silently to capture action */}
                      <video
                        src={media.url}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover rounded-xl"
                      />
                      {/* Rich indicator play badge overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white group-hover:bg-black/20 transition-all rounded-xl">
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
          <div className="flex justify-center items-center gap-1.5 font-sans">
            {mediaItems.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCarouselIndex(i)}
                className={cn(
                  "h-1.5 transition-all duration-300 rounded-full border-none p-0",
                  carouselIndex === i ? "w-10 bg-[#E8500A]" : "w-2 bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
