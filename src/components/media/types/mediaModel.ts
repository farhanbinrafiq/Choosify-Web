/**
 * Universal media model — extends Spotlight media with full metadata.
 * Catalog-independent; reusable across Spotlight, Product, Brand, and future modules.
 */

export type UniversalMediaType =
  | 'vertical_video'
  | 'landscape_video'
  | 'square_video'
  | 'portrait_image'
  | 'landscape_image'
  | 'square_image'
  | 'carousel'
  | 'mixed_media'
  | 'creator_review'
  | 'three_sixty'
  | 'ar'
  | 'livestream'
  | 'interactive_demo';

export type UniversalMediaOrientation =
  | 'portrait'
  | 'landscape'
  | 'square'
  | 'panorama';

export type UniversalAspectRatio =
  | '9:16'
  | '16:9'
  | '1:1'
  | '4:5'
  | '4:3'
  | '21:9';

export interface UniversalMediaResolution {
  width: number;
  height: number;
}

/**
 * Complete media document consumed by the render engine.
 * Compatible with SpotlightMedia — additional fields are optional for migration.
 */
export interface UniversalMedia {
  mediaId: string;
  mediaType: UniversalMediaType;
  orientation: UniversalMediaOrientation;
  aspectRatio: UniversalAspectRatio;
  duration?: number;
  resolution?: UniversalMediaResolution;
  fileSize?: number;
  mimeType?: string;
  thumbnail: string;
  /** @deprecated Use posterImage — kept for Spotlight LE-005.1 compat */
  poster?: string;
  posterImage?: string;
  previewImage?: string;
  previewGif?: string;
  /** @deprecated Use previewImage */
  preview?: string;
  videoUrl?: string;
  imageUrls: string[];
  displayOrder: number;
  isPrimary?: boolean;
  altText?: string;
  caption?: string;
  transcriptPlaceholder?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Slide item for carousel / mixed media rendering */
export interface UniversalMediaSlide {
  id: string;
  kind: 'image' | 'video';
  url: string;
  posterImage?: string;
  altText?: string;
  mimeType?: string;
  duration?: number;
  displayOrder: number;
}

export interface MediaClassificationResult {
  mediaType: UniversalMediaType;
  orientation: UniversalMediaOrientation;
  aspectRatio: UniversalAspectRatio;
  resolution: UniversalMediaResolution;
  duration?: number;
  imageCount: number;
  dominantFormat: 'video' | 'image' | 'mixed';
  recommendedProfileHints: string[];
}

export interface MediaProbeInput {
  width: number;
  height: number;
  duration?: number;
  mimeType?: string;
  fileSize?: number;
  imageCount?: number;
  hasVideo?: boolean;
}

/** Resolved poster URL with legacy field fallback */
export function resolvePosterImage(media: UniversalMedia): string | undefined {
  return media.posterImage ?? media.poster;
}

/** Resolved preview still with legacy field fallback */
export function resolvePreviewImage(media: UniversalMedia): string | undefined {
  return media.previewImage ?? media.preview ?? media.thumbnail;
}
