import type { UniversalMedia } from '../components/media/types/mediaModel';
import type { CatalogGuide } from '../types/catalog';
import type { BrandPost } from '../types/brandPost';

type GuideLike = Pick<CatalogGuide, 'id' | 'title' | 'image' | 'videoUrl' | 'type'>;

function isYoutubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/i.test(url);
}

function isFacebookUrl(url: string): boolean {
  return /facebook\.com|fb\.watch/i.test(url);
}

export function guideToUniversalMedia(guide: GuideLike): UniversalMedia | null {
  const isVertical = guide.type === 'reels' || guide.type === 'shorts';
  const isVideo = Boolean(guide.videoUrl);

  return {
    mediaId: `guide-media-${guide.id}`,
    mediaType: isVideo
      ? isVertical
        ? 'vertical_video'
        : 'landscape_video'
      : 'landscape_image',
    orientation: isVertical ? 'portrait' : 'landscape',
    aspectRatio: isVertical ? '9:16' : '16:9',
    thumbnail: guide.image,
    posterImage: guide.image,
    previewImage: guide.image,
    videoUrl: guide.videoUrl || undefined,
    imageUrls: guide.image ? [guide.image] : [],
    displayOrder: 0,
    altText: guide.title,
    caption: guide.title,
    mimeType: isVideo ? 'video/mp4' : 'image/jpeg',
  };
}

export function brandPostToUniversalMedia(post: BrandPost): UniversalMedia {
  const images = post.bannerImages?.length ? post.bannerImages : [post.heroImage];
  return {
    mediaId: `brand-post-media-${post.id}`,
    mediaType: images.length > 1 ? 'carousel' : 'landscape_image',
    orientation: 'landscape',
    aspectRatio: '16:9',
    thumbnail: post.heroImage,
    posterImage: post.heroImage,
    previewImage: post.heroImage,
    imageUrls: images,
    displayOrder: 0,
    altText: post.title,
    caption: post.title,
    mimeType: 'image/jpeg',
  };
}

export function detectEmbedPlatform(url?: string): 'youtube' | 'facebook' | undefined {
  if (!url) return undefined;
  if (isYoutubeUrl(url)) return 'youtube';
  if (isFacebookUrl(url)) return 'facebook';
  return undefined;
}

export function toEmbedUrl(url: string, platform: 'youtube' | 'facebook'): string {
  if (platform === 'youtube') {
    const match = url.match(/(?:youtu\.be\/|v=)([\w-]+)/);
    const id = match?.[1];
    return id ? `https://www.youtube.com/embed/${id}` : url;
  }
  return url;
}
