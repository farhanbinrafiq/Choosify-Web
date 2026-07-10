/**
 * Future CDN / streaming optimization contracts — interfaces only.
 * No external service implementation in LE-005.2.
 */

export interface MediaCompressionPreset {
  id: string;
  label: string;
  targetBitrateKbps?: number;
  maxWidth?: number;
  maxHeight?: number;
  format: 'mp4' | 'webm' | 'jpeg' | 'webp' | 'avif';
}

export interface ResponsiveImageSource {
  url: string;
  width: number;
  mimeType: string;
}

export interface AdaptiveStreamVariant {
  url: string;
  resolution: { width: number; height: number };
  bitrateKbps: number;
  mimeType: string;
}

export interface MediaOptimizationPlan {
  mediaId: string;
  compressionPresets: MediaCompressionPreset[];
  responsiveImages?: ResponsiveImageSource[];
  adaptiveStreams?: AdaptiveStreamVariant[];
  thumbnailUrl?: string;
  posterUrl?: string;
  previewGifUrl?: string;
  cacheTtlSeconds?: number;
  cdnPath?: string;
}

export interface ThumbnailGenerationRequest {
  sourceUrl: string;
  timestampSeconds?: number;
  width: number;
  height: number;
}

export const DEFAULT_MEDIA_CACHE_TTL_SECONDS = 86_400;
