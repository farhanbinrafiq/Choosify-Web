/**
 * Product / Service detail hero — thin adapter over shared `DetailSliverMediaGallery`
 * (slide animation, mobile peeks, fullscreen viewer, autoplay).
 */
import React from 'react';
import { DetailSliverMediaGallery } from './commerce/DetailSliverMediaGallery';
import { buildProductGalleryItems } from './media/choosifyMediaAdapters';

export type { LegacyMediaItem as MediaItem } from './media/choosifyMediaAdapters';
export { buildProductGalleryItems as getProductMedia } from './media/choosifyMediaAdapters';

interface ProductMediaGalleryProps {
  product: Parameters<typeof buildProductGalleryItems>[0];
  /** Single image for the selected variant (legacy `variant.image`). */
  selectedVariantImage?: string;
  /** The selected variant's full `images[]`. When non-empty the gallery shows
   *  THESE (first = main), so picking Color=Black swaps the whole gallery to the
   *  black photos. Empty/absent → fall back to the parent product gallery — the
   *  gallery is never blank. */
  variantImages?: string[];
  showAddVideo?: boolean;
  onAddVideo?: () => void;
}

export function ProductMediaGallery({
  product,
  selectedVariantImage,
  variantImages,
  showAddVideo,
  onAddVideo,
}: ProductMediaGalleryProps) {
  const vImgs = (variantImages ?? []).filter(Boolean);
  const items = buildProductGalleryItems(
    vImgs.length
      ? { ...product, image: vImgs[0], gallery: vImgs }
      : { ...product, image: selectedVariantImage || product.image },
  );

  return (
    <DetailSliverMediaGallery
      items={items}
      ariaLabel={`${product.title ?? 'Product'} media gallery`}
      showAddVideo={showAddVideo}
      onAddVideo={onAddVideo}
    />
  );
}
