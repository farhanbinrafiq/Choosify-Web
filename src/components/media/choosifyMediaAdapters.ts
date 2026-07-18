import type { ChoosifyMediaItem, ChoosifyMediaKind } from './choosifyMediaTypes';
import { isVideoKind } from './choosifyMediaTypes';
import { PLACEHOLDER_IMAGE } from '../../constants';

let mediaIdCounter = 0;
function mid(prefix: string): string {
  mediaIdCounter += 1;
  return `${prefix}-${mediaIdCounter}`;
}

function inferVideoKind(url: string, hint?: string): ChoosifyMediaKind {
  if (hint === 'portrait' || hint === '9/16') return 'portrait_video';
  if (hint === 'square' || hint === '1/1') return 'square_video';
  if (url.endsWith('.gif')) return 'gif';
  return 'landscape_video';
}

export function choosifyMediaFromUrl(
  url: string,
  kind?: ChoosifyMediaKind,
  extras?: Partial<ChoosifyMediaItem>,
): ChoosifyMediaItem {
  const resolvedKind = kind ?? (url.endsWith('.gif') ? 'gif' : url.match(/\.(mp4|webm|mov)/i) ? 'landscape_video' : 'image');
  return {
    id: mid('media'),
    kind: resolvedKind,
    url,
    ...extras,
  };
}

/** Build gallery items from a product (preserves existing demo media sets) */
export function buildProductGalleryItems(product: {
  title?: string;
  image?: string;
  category?: string;
  gallery?: string[];
}): ChoosifyMediaItem[] {
  const mainImg = product.image || PLACEHOLDER_IMAGE;
  const cat = (product.category || '').toLowerCase();
  const isTech =
    cat.includes('tech') || cat.includes('mobile') || cat.includes('phone') || cat.includes('gaming') || cat.includes('appliance');
  const isFashion = cat.includes('fashion') || cat.includes('lifestyle') || cat.includes('jewelry');

  if (product.gallery?.length) {
    return product.gallery.map((url, i) =>
      choosifyMediaFromUrl(url, url.match(/\.(mp4|webm)/i) ? 'landscape_video' : 'image', {
        alt: `${product.title ?? 'Product'} ${i + 1}`,
      }),
    );
  }

  if (isTech) {
    return [
      choosifyMediaFromUrl('https://assets.mixkit.co/videos/preview/mixkit-taking-photos-with-a-smartphone-34356-large.mp4', 'landscape_video'),
      choosifyMediaFromUrl(mainImg, 'image', { alt: product.title }),
      choosifyMediaFromUrl('https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&h=800&fit=crop', 'image'),
      choosifyMediaFromUrl('https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=800&fit=crop', 'image'),
      choosifyMediaFromUrl('https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-virtual-reality-glasses-4384-large.mp4', 'landscape_video'),
      choosifyMediaFromUrl('https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=800&fit=crop', 'image'),
    ];
  }
  if (isFashion) {
    return [
      choosifyMediaFromUrl('https://assets.mixkit.co/videos/preview/mixkit-holding-a-pair-of-new-athletic-shoes-42999-large.mp4', 'landscape_video'),
      choosifyMediaFromUrl(mainImg, 'image', { alt: product.title }),
      choosifyMediaFromUrl('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop', 'image'),
      choosifyMediaFromUrl('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop', 'image'),
      choosifyMediaFromUrl('https://assets.mixkit.co/videos/preview/mixkit-man-putting-on-designer-sneakers-42998-large.mp4', 'landscape_video'),
      choosifyMediaFromUrl('https://images.unsplash.com/photo-1445205170230-053b830c6050?w=1200&h=800&fit=crop', 'image'),
    ];
  }
  return [
    choosifyMediaFromUrl('https://assets.mixkit.co/videos/preview/mixkit-serving-coffee-from-a-french-press-coffee-maker-41223-large.mp4', 'landscape_video'),
    choosifyMediaFromUrl(mainImg, 'image', { alt: product.title }),
    choosifyMediaFromUrl('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&h=800&fit=crop', 'image'),
    choosifyMediaFromUrl('https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop', 'image'),
    choosifyMediaFromUrl('https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-dripping-fresh-beverage-41224-large.mp4', 'landscape_video'),
    choosifyMediaFromUrl('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop', 'image'),
  ];
}

/** Build gallery items from a guide / spotlight content shape */
export function buildGuideGalleryItems(guide: {
  title?: string;
  image?: string;
  videoUrl?: string;
  category?: string;
  type?: string;
}): ChoosifyMediaItem[] {
  const mainImg = guide.image || PLACEHOLDER_IMAGE;
  const category = (guide.category || 'general').toLowerCase();
  const isReel = guide.type === 'reels' || guide.type === 'shorts';

  if (guide.videoUrl) {
    const videoKind: ChoosifyMediaKind = isReel ? 'portrait_video' : 'landscape_video';
    const extras = category.includes('mobile') || category.includes('tech')
      ? [
          choosifyMediaFromUrl('https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&h=800&fit=crop', 'image'),
          choosifyMediaFromUrl('https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-virtual-reality-glasses-4384-large.mp4', 'landscape_video'),
        ]
      : category.includes('fashion')
        ? [
            choosifyMediaFromUrl('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=800&fit=crop', 'image'),
            choosifyMediaFromUrl('https://assets.mixkit.co/videos/preview/mixkit-man-putting-on-designer-sneakers-42998-large.mp4', 'landscape_video'),
          ]
        : [
            choosifyMediaFromUrl('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&h=800&fit=crop', 'image'),
            choosifyMediaFromUrl('https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-dripping-fresh-beverage-41224-large.mp4', 'landscape_video'),
          ];

    return [
      choosifyMediaFromUrl(guide.videoUrl, videoKind, { posterUrl: mainImg, alt: guide.title }),
      choosifyMediaFromUrl(mainImg, 'image', { alt: guide.title }),
      ...extras,
    ];
  }

  if (category.includes('mobile') || category.includes('tech') || category.includes('gaming')) {
    return [
      choosifyMediaFromUrl('https://assets.mixkit.co/videos/preview/mixkit-taking-photos-with-a-smartphone-34356-large.mp4', 'landscape_video'),
      choosifyMediaFromUrl(mainImg, 'image', { alt: guide.title }),
      choosifyMediaFromUrl('https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&h=800&fit=crop', 'image'),
      choosifyMediaFromUrl('https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=800&fit=crop', 'image'),
    ];
  }

  return [
    choosifyMediaFromUrl(mainImg, 'image', { alt: guide.title }),
    choosifyMediaFromUrl('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&h=800&fit=crop', 'image'),
    choosifyMediaFromUrl('https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&h=800&fit=crop', 'image'),
  ];
}

/** Spotlight hero carousel item → mixed media gallery */
export function buildSpotlightHeroGalleryItems(item: {
  id: string;
  title: string;
  image: string;
  mediaItems?: ChoosifyMediaItem[];
}): ChoosifyMediaItem[] {
  if (item.mediaItems?.length) return item.mediaItems;
  return [choosifyMediaFromUrl(item.image, 'image', { alt: item.title, id: `hero-${item.id}` })];
}

/** Universal media from spotlight content document */
export function buildSpotlightContentGalleryItems(input: {
  headline: string;
  media?: {
    mediaType?: string;
    videoUrl?: string;
    thumbnail?: string;
    posterImage?: string;
    previewImage?: string;
    aspectRatio?: string;
  } | null;
  live?: { embedUrl?: string; replayUrl?: string };
}): ChoosifyMediaItem[] {
  const poster =
    input.media?.posterImage ?? input.media?.thumbnail ?? input.media?.previewImage ?? '';
  const items: ChoosifyMediaItem[] = [];

  if (input.live?.embedUrl) {
    items.push({
      id: mid('live'),
      kind: 'live',
      url: input.live.embedUrl,
      embedUrl: input.live.embedUrl,
      posterUrl: poster,
      alt: input.headline,
      aspectRatio: '16/9',
      label: 'Live',
    });
  }

  if (input.media?.videoUrl) {
    const mt = input.media.mediaType ?? '';
    const kind: ChoosifyMediaKind =
      mt === 'vertical_video' ? 'portrait_video' : mt === 'square_video' ? 'square_video' : 'landscape_video';
    items.push({
      id: mid('video'),
      kind,
      url: input.media.videoUrl,
      posterUrl: poster,
      alt: input.headline,
      aspectRatio: kind === 'portrait_video' ? '9/16' : kind === 'square_video' ? '1/1' : '16/9',
    });
  }

  if (poster) {
    items.push({
      id: mid('image'),
      kind: 'image',
      url: poster,
      alt: input.headline,
      aspectRatio: '4/3',
    });
  }

  if (input.live?.replayUrl && !items.some((i) => i.url === input.live?.replayUrl)) {
    items.push({
      id: mid('replay'),
      kind: 'landscape_video',
      url: input.live.replayUrl,
      posterUrl: poster,
      alt: `${input.headline} replay`,
      label: 'Replay',
    });
  }

  return items.length ? items : [choosifyMediaFromUrl(PLACEHOLDER_IMAGE, 'image', { alt: input.headline })];
}

/** @deprecated Legacy MediaItem shape */
export type LegacyMediaItem = { type: 'image' | 'video'; url: string };

export function legacyToChoosifyItems(legacy: LegacyMediaItem[]): ChoosifyMediaItem[] {
  return legacy.map((m, i) =>
    choosifyMediaFromUrl(m.url, m.type === 'video' ? inferVideoKind(m.url) : 'image', { id: `legacy-${i}` }),
  );
}

export function choosifyToLegacyItems(items: ChoosifyMediaItem[]): LegacyMediaItem[] {
  return items.map((m) => ({
    type: isVideoKind(m.kind) ? 'video' : 'image',
    url: m.url,
  }));
}
