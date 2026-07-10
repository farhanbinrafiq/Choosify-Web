import React from 'react';
import { OptimizedImage } from '../../OptimizedImage';
import { cn } from '../../../lib/utils';
import type { UniversalMedia } from '../types/mediaModel';
import { resolvePreviewImage } from '../types/mediaModel';

interface MediaPreviewProps {
  media: UniversalMedia;
  className?: string;
  priority?: boolean;
}

/** Lightweight static preview — thumbnail, poster, or preview still */
export function MediaPreview({ media, className, priority = false }: MediaPreviewProps) {
  const src = resolvePreviewImage(media) || media.thumbnail;
  return (
    <OptimizedImage
      src={src}
      alt={media.altText || media.caption || 'Media preview'}
      className={cn('w-full h-full object-cover', className)}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
