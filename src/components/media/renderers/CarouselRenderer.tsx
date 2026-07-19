import React from 'react';
import { cn } from '../../../lib/utils';
import { OptimizedImage } from '../../OptimizedImage';
import type { MediaDisplayProfile } from '../types/displayProfile';
import type { UniversalMediaSlide } from '../types/mediaModel';
import { useMediaCarousel } from '../hooks/useMediaCarousel';
import { VideoRenderer } from './VideoRenderer';
import type { UniversalMedia } from '../types/mediaModel';

interface CarouselRendererProps {
  slides: UniversalMediaSlide[];
  media: UniversalMedia;
  profile: MediaDisplayProfile;
  className?: string;
  aspectRatio?: string;
}

export function CarouselRenderer({
  slides,
  media,
  profile,
  className,
  aspectRatio,
}: CarouselRendererProps) {
  const { index, dragOffset, goTo, handlers } = useMediaCarousel({
    totalSlides: slides.length,
    enableGestures: profile.enableCarouselGestures,
  });

  if (slides.length === 0) return null;

  const active = slides[index];

  return (
    <div
      className={cn('relative w-full select-none', className)}
      style={{ aspectRatio, maxHeight: profile.maxHeight }}
      {...handlers}
    >
      <div
        className="w-full h-full overflow-hidden"
        style={{ transform: dragOffset ? `translateX(${-dragOffset}px)` : undefined }}
      >
        {active.kind === 'video' ? (
          <VideoRenderer
            media={{ ...media, videoUrl: active.url, posterImage: active.posterImage }}
            profile={profile}
            aspectRatio={aspectRatio}
          />
        ) : (
          <figure className={cn('w-full h-full', profile.rounded && 'rounded-[5px] overflow-hidden')}>
            <OptimizedImage
              src={active.url}
              alt={active.altText || media.altText || `Slide ${index + 1}`}
              className="w-full h-full"
              style={{ objectFit: profile.objectFit }}
              loading={profile.lazyImages ? 'lazy' : 'eager'}
              decoding="async"
            />
          </figure>
        )}
      </div>

      {profile.showCarouselIndicators && slides.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === index ? 'w-5 bg-[#EB4501]' : 'w-1.5 bg-white/70',
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
