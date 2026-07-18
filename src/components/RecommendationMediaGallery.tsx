/**
 * Guide Detail hero — Choosify.dc.html sliver gallery
 */
import React from 'react';
import { DetailSliverMediaGallery } from './commerce/DetailSliverMediaGallery';
import { buildGuideGalleryItems } from './media/choosifyMediaAdapters';

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export function getGuideMedia(guide: any): MediaItem[] {
  const items: MediaItem[] = [];
  
  if (guide.videoUrl) {
    items.push({ type: 'video', url: guide.videoUrl });
  }
  
  if (guide.image) {
    items.push({ type: 'image', url: guide.image });
  } else {
    items.push({ type: 'image', url: PLACEHOLDER_IMAGE });
  }

  const category = (guide.category || 'general').toLowerCase();
  if (category.includes('mobile') || category.includes('tech') || category.includes('gaming')) {
    items.push(
      { type: 'image', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=800&fit=crop' }
    );
  } else if (category.includes('fashion') || category.includes('lifestyle') || category.includes('beauty')) {
    items.push(
      { type: 'image', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?w=1200&h=800&fit=crop' }
    );
  } else {
    items.push(
      { type: 'image', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&h=800&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop' }
    );
  }

  return items;
}

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
