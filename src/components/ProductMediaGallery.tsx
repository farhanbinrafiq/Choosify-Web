/**
 * Product hero — Choosify.dc.html sliver gallery (detail pages only)
 */
import React from 'react';
import { DetailSliverMediaGallery } from './commerce/DetailSliverMediaGallery';
import { buildProductGalleryItems } from './media/choosifyMediaAdapters';

export type { LegacyMediaItem as MediaItem } from './media/choosifyMediaAdapters';
export { buildProductGalleryItems as getProductMedia } from './media/choosifyMediaAdapters';

interface ProductMediaGalleryProps {
  product: Parameters<typeof buildProductGalleryItems>[0];
  selectedVariantImage?: string;
  showAddVideo?: boolean;
  onAddVideo?: () => void;
}

export function ProductMediaGallery({
  product,
  selectedVariantImage,
  showAddVideo,
  onAddVideo,
}: ProductMediaGalleryProps) {
  const items = buildProductGalleryItems({
    ...product,
    image: selectedVariantImage || product.image,
  });

  return (
    <DetailSliverMediaGallery
      items={items}
      ariaLabel={`${product.title ?? 'Product'} media gallery`}
      showAddVideo={showAddVideo}
      onAddVideo={onAddVideo}
    />
  );
}
