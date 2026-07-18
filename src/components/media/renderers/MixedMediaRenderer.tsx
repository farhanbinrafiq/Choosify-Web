import React from 'react';
import type { MediaDisplayProfile } from '../types/displayProfile';
import type { UniversalMedia, UniversalMediaSlide } from '../types/mediaModel';
import { CarouselRenderer } from './CarouselRenderer';
import { ImageRenderer } from './ImageRenderer';
import { VideoRenderer } from './VideoRenderer';

interface MixedMediaRendererProps {
  media: UniversalMedia;
  slides: UniversalMediaSlide[];
  profile: MediaDisplayProfile;
  className?: string;
  aspectRatio?: string;
}

/**
 * Adaptive layout for mixed video + image campaigns.
 * Single primary asset with optional carousel for secondary slides.
 */
export function MixedMediaRenderer({
  media,
  slides,
  profile,
  className,
  aspectRatio,
}: MixedMediaRendererProps) {
  if (slides.length > 1) {
    return (
      <CarouselRenderer
        slides={slides}
        media={media}
        profile={profile}
        className={className}
        aspectRatio={aspectRatio}
      />
    );
  }

  if (media.videoUrl) {
    return (
      <VideoRenderer
        media={media}
        profile={profile}
        className={className}
        aspectRatio={aspectRatio}
      />
    );
  }

  return (
    <ImageRenderer
      media={media}
      profile={profile}
      className={className}
      aspectRatio={aspectRatio}
    />
  );
}
