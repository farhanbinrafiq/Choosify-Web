/**
 * Spotlight media types — architecture only.
 */
export type SpotlightMediaType =
  | 'vertical_video'
  | 'landscape_video'
  | 'square_video'
  | 'portrait_image'
  | 'landscape_image'
  | 'square_image'
  | 'carousel'
  | 'mixed_media'
  | 'three_sixty'
  | 'ar'
  | 'livestream';

export type SpotlightMediaOrientation =
  | 'portrait'
  | 'landscape'
  | 'square'
  | 'panorama';

/** Common aspect ratios for layout engines */
export type SpotlightAspectRatio =
  | '9:16'
  | '16:9'
  | '1:1'
  | '4:5'
  | '4:3'
  | '21:9';

/**
 * Media asset document — stored in `spotlight_media`.
 * Binary assets live in object storage; Firestore holds metadata + URLs.
 */
export interface SpotlightMedia {
  mediaId: string;
  mediaType: SpotlightMediaType;
  orientation: SpotlightMediaOrientation;
  aspectRatio: SpotlightAspectRatio;
  /** Duration in seconds (video / livestream) */
  duration?: number;
  resolution?: { width: number; height: number };
  fileSize?: number;
  mimeType?: string;
  thumbnail: string;
  poster?: string;
  posterImage?: string;
  previewImage?: string;
  previewGif?: string;
  preview?: string;
  videoUrl?: string;
  imageUrls: string[];
  displayOrder: number;
  isPrimary?: boolean;
  altText?: string;
  caption?: string;
  transcriptPlaceholder?: string;
  createdAt: string;
  updatedAt: string;
}

/** Inline media reference on a campaign (denormalized snapshot for cards) */
export interface SpotlightMediaRef {
  mediaId: string;
  mediaType: SpotlightMediaType;
  thumbnail: string;
  displayOrder: number;
}
