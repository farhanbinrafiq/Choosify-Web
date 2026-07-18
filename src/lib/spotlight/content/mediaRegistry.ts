import type { UniversalMedia } from '../../../components/media/types/mediaModel';

export interface MediaRegistryEntry {
  mediaType: UniversalMedia['mediaType'];
  label: string;
  aspectRatio: string;
  supportsEmbed: boolean;
}

export const MEDIA_REGISTRY: MediaRegistryEntry[] = [
  { mediaType: 'landscape_video', label: 'Video', aspectRatio: '16:9', supportsEmbed: true },
  { mediaType: 'vertical_video', label: 'Reel', aspectRatio: '9:16', supportsEmbed: true },
  { mediaType: 'square_image', label: 'Image', aspectRatio: '1:1', supportsEmbed: false },
  { mediaType: 'landscape_image', label: 'Hero Image', aspectRatio: '16:9', supportsEmbed: false },
  { mediaType: 'carousel', label: 'Carousel', aspectRatio: '4:3', supportsEmbed: false },
];

export function mediaEntryFor(media: UniversalMedia | null): MediaRegistryEntry | undefined {
  if (!media) return undefined;
  return MEDIA_REGISTRY.find((m) => m.mediaType === media.mediaType);
}
