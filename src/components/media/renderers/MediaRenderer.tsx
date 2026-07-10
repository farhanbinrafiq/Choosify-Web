import React from 'react';
import { cn } from '../../../lib/utils';
import type { MediaDisplayProfile, MediaDisplayProfileKey } from '../types/displayProfile';
import { getDisplayProfile, resolveProfileAspectRatio } from '../types/displayProfile';
import type { UniversalMedia } from '../types/mediaModel';
import type { MediaRenderError } from '../types/playback';
import { buildMediaSlides, resolveRendererKind } from '../utils/classifyMedia';
import { validateMedia } from '../validators/mediaValidation';
import { CarouselRenderer } from './CarouselRenderer';
import { ImageRenderer } from './ImageRenderer';
import { MediaError } from './MediaError';
import { MediaPlaceholder } from './MediaPlaceholder';
import { MixedMediaRenderer } from './MixedMediaRenderer';
import { VideoRenderer } from './VideoRenderer';

export interface MediaRendererProps {
  media: UniversalMedia;
  profile: MediaDisplayProfileKey | MediaDisplayProfile;
  className?: string;
  onError?: (error: MediaRenderError) => void;
}

export function MediaRenderer({ media, profile, className, onError }: MediaRendererProps) {
  const resolvedProfile = typeof profile === 'string' ? getDisplayProfile(profile) : profile;
  const aspectRatio = resolveProfileAspectRatio(resolvedProfile, media);

  const validation = validateMedia({
    mimeType: media.mimeType,
    fileSize: media.fileSize,
    duration: media.duration,
    width: media.resolution?.width,
    height: media.resolution?.height,
    videoUrl: media.videoUrl,
    imageUrls: media.imageUrls,
  });

  if (!validation.valid) {
    const first = validation.errors[0];
    onError?.({
      code: 'validation_failed',
      message: first.message,
      mediaId: media.mediaId,
    });
    return (
      <MediaError
        message={first.message}
        className={className}
        aspectRatio={aspectRatio}
      />
    );
  }

  if (resolvedProfile.requireAltText && !media.altText && !media.caption) {
    onError?.({
      code: 'validation_failed',
      message: 'Alt text or caption is required for accessible media.',
      mediaId: media.mediaId,
    });
  }

  const kind = resolveRendererKind(media);
  const slides = buildMediaSlides(media);
  const shellClass = cn('choosify-media-renderer w-full', className);

  const handleError = (message: string) => {
    onError?.({ code: 'load_failed', message, mediaId: media.mediaId });
  };

  switch (kind) {
    case 'video':
      return (
        <VideoRenderer
          media={media}
          profile={resolvedProfile}
          className={shellClass}
          aspectRatio={aspectRatio}
          onError={handleError}
        />
      );
    case 'image':
      return (
        <ImageRenderer
          media={media}
          profile={resolvedProfile}
          className={shellClass}
          aspectRatio={aspectRatio}
          onError={handleError}
        />
      );
    case 'carousel':
      return (
        <CarouselRenderer
          slides={slides}
          media={media}
          profile={resolvedProfile}
          className={shellClass}
          aspectRatio={aspectRatio}
        />
      );
    case 'mixed':
      return (
        <MixedMediaRenderer
          media={media}
          slides={slides}
          profile={resolvedProfile}
          className={shellClass}
          aspectRatio={aspectRatio}
        />
      );
    default:
      return (
        <MediaPlaceholder
          label="Unsupported media format"
          className={shellClass}
          aspectRatio={aspectRatio}
        />
      );
  }
}

/**
 * Primary entry point — render media with a display profile.
 * @example renderMedia(media, 'homepage_carousel')
 */
export function renderMedia(
  media: UniversalMedia,
  profile: MediaDisplayProfileKey,
  props?: Omit<MediaRendererProps, 'media' | 'profile'>,
) {
  return <MediaRenderer media={media} profile={profile} {...props} />;
}
