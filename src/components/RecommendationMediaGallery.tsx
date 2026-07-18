/**
 * Guide Detail hero — Choosify.dc.html sliver gallery
 */
import React from 'react';
import { DetailSliverMediaGallery } from './commerce/DetailSliverMediaGallery';
import { buildGuideGalleryItems } from './media/choosifyMediaAdapters';

export type { LegacyMediaItem as MediaItem } from './media/choosifyMediaAdapters';
export { buildGuideGalleryItems as getGuideMedia } from './media/choosifyMediaAdapters';

interface RecommendationMediaGalleryProps {
  guide: Parameters<typeof buildGuideGalleryItems>[0];
  showAddVideo?: boolean;
  onAddVideo?: () => void;
}

export function RecommendationMediaGallery({
  guide,
  showAddVideo,
  onAddVideo,
}: RecommendationMediaGalleryProps) {
  const items = buildGuideGalleryItems(guide);

  return (
    <DetailSliverMediaGallery
      items={items}
      ariaLabel={`${guide.title ?? 'Guide'} media gallery`}
      showAddVideo={showAddVideo}
      onAddVideo={onAddVideo}
    />
  );
}
