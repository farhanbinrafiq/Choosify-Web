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
  /** The selected variant's full `images[]`. Only actually shown when
   *  `showVariantGallery` is true AND this is non-empty — so picking
   *  Color=Black swaps the whole gallery to the black photos once that
   *  selection resolves to one variant. */
  variantImages?: string[];
  /** Whether the buyer's current selection has resolved to one specific
   *  variant. False (the default before any pick, or a partial selection
   *  that doesn't uniquely resolve yet) keeps showing `allListingImages` —
   *  never prematurely narrows to one variant's photos. Defaults to true for
   *  backward compatibility with any caller that doesn't pass it. */
  showVariantGallery?: boolean;
  /** Deduplicated full listing gallery (primary/listing images first, then
   *  every active variant's images) — the initial gallery, and the fallback
   *  whenever the resolved variant has no dedicated images of its own. The
   *  gallery is never blank: falls back further to `product.image`. */
  allListingImages?: string[];
  showAddVideo?: boolean;
  onAddVideo?: () => void;
}

export function ProductMediaGallery({
  product,
  selectedVariantImage,
  variantImages,
  showVariantGallery = true,
  allListingImages,
  showAddVideo,
  onAddVideo,
}: ProductMediaGalleryProps) {
  const vImgs = showVariantGallery ? (variantImages ?? []).filter(Boolean) : [];
  const fallbackGallery = (allListingImages ?? []).filter(Boolean);
  const items = buildProductGalleryItems(
    vImgs.length
      ? { ...product, image: vImgs[0], gallery: vImgs }
      : fallbackGallery.length
        ? { ...product, image: fallbackGallery[0], gallery: fallbackGallery }
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
