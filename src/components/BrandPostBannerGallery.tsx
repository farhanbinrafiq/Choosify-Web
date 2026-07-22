import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

type BrandPostBannerGalleryProps = {
  images: string[];
  alt: string;
  className?: string;
  autoplayMs?: number;
};

/**
 * Full-width, edge-to-edge event banner gallery — image only, no text overlay.
 * Supports one or multiple sponsor banner photos with full visual impact.
 */
export function BrandPostBannerGallery({
  images,
  alt,
  className,
  autoplayMs = 6000,
}: BrandPostBannerGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides = images.filter(Boolean);

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length, slides.join('|')]);

  useEffect(() => {
    if (slides.length <= 1 || !autoplay) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }
    autoplayTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoplayMs);
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [slides.length, autoplay, autoplayMs]);

  if (slides.length === 0) return null;

  const goPrev = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className={cn(
        'choosify-brand-post-banner relative w-full overflow-hidden rounded-xl bg-slate-900 select-none',
        className,
      )}
      aria-label="Event banners"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div className="relative w-full h-[220px] sm:h-[300px] md:h-[380px] lg:h-[440px] xl:h-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${slides[currentIndex]}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            <img
              src={slides[currentIndex]}
              alt={slides.length > 1 ? `${alt} — banner ${currentIndex + 1}` : alt}
              className="absolute inset-0 w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-[#FF6B00] border border-white/25 flex items-center justify-center text-white transition-all backdrop-blur-sm"
              aria-label="Previous banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/35 hover:bg-[#FF6B00] border border-white/25 flex items-center justify-center text-white transition-all backdrop-blur-sm"
              aria-label="Next banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAutoplay(false);
                    setCurrentIndex(idx);
                  }}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    idx === currentIndex
                      ? 'w-8 bg-[#FF6B00]'
                      : 'w-2 bg-white/50 hover:bg-white/80',
                  )}
                  aria-label={`Go to banner ${idx + 1}`}
                />
              ))}
            </div>
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 px-2 py-0.5 rounded-full bg-black/40 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-sm">
              {currentIndex + 1} / {slides.length}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
