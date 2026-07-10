import React from 'react';
import { cn } from '../../../lib/utils';
import { OptimizedImage } from '../../OptimizedImage';
import type { MediaDisplayProfile } from '../types/displayProfile';
import type { UniversalMedia } from '../types/mediaModel';
import { MediaError } from './MediaError';

interface ImageRendererProps {
  media: UniversalMedia;
  profile: MediaDisplayProfile;
  className?: string;
  aspectRatio?: string;
  onError?: (message: string) => void;
}

export function ImageRenderer({
  media,
  profile,
  className,
  aspectRatio,
  onError,
}: ImageRendererProps) {
  const src = media.imageUrls[0] || media.thumbnail;

  if (!src) {
    return <MediaError message="Image source is missing." className={className} aspectRatio={aspectRatio} />;
  }

  return (
    <figure
      className={cn('relative w-full overflow-hidden', profile.rounded && 'rounded-[5px]', className)}
      style={{
        aspectRatio,
        maxHeight: profile.maxHeight,
      }}
    >
      <OptimizedImage
        src={src}
        alt={media.altText || media.caption || 'Campaign image'}
        className="w-full h-full"
        style={{ objectFit: profile.objectFit }}
        loading={profile.lazyImages && !profile.priorityImage ? 'lazy' : 'eager'}
        decoding="async"
        priority={profile.priorityImage}
        onError={() => onError?.('Image failed to load')}
      />
      {media.caption && (
        <figcaption className="sr-only">{media.caption}</figcaption>
      )}
    </figure>
  );
}
