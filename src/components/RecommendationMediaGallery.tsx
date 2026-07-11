/**
 * @deprecated Use ChoosifyMediaGallery via buildGuideGalleryItems
 */
import React from 'react';
import { ChoosifyMediaGallery } from './media/ChoosifyMediaGallery';
import { buildGuideGalleryItems } from './media/choosifyMediaAdapters';

export type { LegacyMediaItem as MediaItem } from './media/choosifyMediaAdapters';
export { buildGuideGalleryItems as getGuideMedia } from './media/choosifyMediaAdapters';

interface RecommendationMediaGalleryProps {
  guide: Parameters<typeof buildGuideGalleryItems>[0];
}

export function RecommendationMediaGallery({ guide }: RecommendationMediaGalleryProps) {
  const items = buildGuideGalleryItems(guide);

  return (
    <ChoosifyMediaGallery
      items={items}
      ariaLabel={`${guide.title ?? 'Guide'} media gallery`}
      layout="theater"
    />
  );
}
