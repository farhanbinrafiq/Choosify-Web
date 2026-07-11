/**
 * Product hero — ChoosifyCommerceMediaGallery (detail pages only)
 */
import React from 'react';
import { ChoosifyCommerceMediaGallery } from './commerce/ChoosifyCommerceMediaGallery';
import { buildProductGalleryItems } from './media/choosifyMediaAdapters';

export type { LegacyMediaItem as MediaItem } from './media/choosifyMediaAdapters';
export { buildProductGalleryItems as getProductMedia } from './media/choosifyMediaAdapters';

interface ProductMediaGalleryProps {
  product: Parameters<typeof buildProductGalleryItems>[0];
  selectedVariantImage?: string;
}

export function ProductMediaGallery({ product, selectedVariantImage }: ProductMediaGalleryProps) {
  const items = buildProductGalleryItems({
    ...product,
    image: selectedVariantImage || product.image,
  });

  return (
    <ChoosifyCommerceMediaGallery
      items={items}
      ariaLabel={`${product.title ?? 'Product'} media gallery`}
    />
  );
}
