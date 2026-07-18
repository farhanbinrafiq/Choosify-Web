import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useHomepageHeroSlides } from './useHomepageHeroSlides';
import type { HeroStatItem, HeroVariant } from './types';

interface HeroProps {
  variant: HeroVariant;
  /** @deprecated Choosify.dc.html Home hero is image-only */
  stats?: HeroStatItem[];
  /** @deprecated Choosify.dc.html Home hero has no search */
  showSearch?: boolean;
  className?: string;
}

const PHOTO_AUTOPLAY_MS = 6000;
const VIDEO_AUTOPLAY_MS = 10000;

/**
 * Homepage hero — hybrid sliding banner:
 * full-bleed photo and/or muted looping video per slide,
 * diagonal clip-path, arrows + dots.
 */
export function Hero({ variant, className }: HeroProps) {
  const slides = useHomepageHeroSlides();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  useEffect(() => {
    setCurrentIndex(0);
  }, [slides.length]);

  // Play active video slide; pause & reset the rest.
  useEffect(() => {
    slides.forEach((slide, i) => {
      const el = videoRefs.current.get(slide.id);
      if (!el) return;
      if (i === currentIndex && slide.videoUrl) {
        void el.play().catch(() => {
          /* autoplay may be blocked until gesture — poster still shows */
        });
      } else {
        el.pause();
        try {
          el.currentTime = 0;
        } catch {
          /* ignore seek errors on unloaded media */
        }
      }
    });
  }, [currentIndex, slides]);

  useEffect(() => {
    if (variant !== 'homepage' || slides.length <= 1 || !autoplay) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }
    const current = slides[currentIndex];
    const delay = current?.videoUrl ? VIDEO_AUTOPLAY_MS : PHOTO_AUTOPLAY_MS;
    autoplayTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, delay);
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [slides, slides.length, autoplay, variant, currentIndex]);

  if (variant !== 'homepage' || !slides.length) return null;

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
        'relative w-full h-[320px] sm:h-[400px] md:h-[460px] overflow-hidden select-none',
        className,
      )}
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 36px), 0 100%)' }}
      aria-label="Homepage hero"
      aria-roledescription="carousel"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      {slides.map((slide, i) => {
        const isActive = i === currentIndex;
        return (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              isActive ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none',
            )}
            aria-hidden={!isActive}
          >
            {slide.videoUrl ? (
              <video
                ref={(el) => {
                  if (el) videoRefs.current.set(slide.id, el);
                  else videoRefs.current.delete(slide.id);
                }}
                src={slide.videoUrl}
                poster={slide.image}
                muted
                loop
                playsInline
                preload={i === 0 ? 'auto' : 'metadata'}
                className="w-full h-full object-cover"
                aria-label={slide.title || 'Hero video'}
              />
            ) : slide.image ? (
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background:
                    slide.gradient ||
                    'linear-gradient(135deg, #000435 0%, #1A1D4E 50%, #FF5B00 160%)',
                }}
              />
            )}
            {/* Soft readability gradient — still image/video-led */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none" />
            {slide.primaryCtaLink && isActive && (
              <Link
                to={slide.primaryCtaLink}
                className="absolute inset-0 z-[1]"
                aria-label={slide.primaryCtaText || slide.title || 'View campaign'}
              />
            )}
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/85 text-[#1A1A2E] text-base shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:bg-white transition-colors"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 md:right-[100px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/85 text-[#1A1A2E] text-base shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:bg-white transition-colors"
            aria-label="Next slide"
          >
            ›
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-5 z-20 flex gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setAutoplay(false);
                  setCurrentIndex(i);
                }}
                className={cn(
                  'rounded-full transition-all',
                  i === currentIndex
                    ? 'w-5 h-2 bg-white'
                    : 'w-2 h-2 bg-white/55 hover:bg-white/80',
                )}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === currentIndex}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
