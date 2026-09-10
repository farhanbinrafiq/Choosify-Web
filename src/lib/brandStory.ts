/**
 * Brand Story (dashboard-authored) — normalisation for the public Brand Details
 * page. The seller authors `CatalogBrand.storyBlocks` in Brand Management Studio;
 * this turns those raw blocks into render-ready models, including the shared
 * thumbnail fallback:  custom thumbnail → source-derived (YouTube) → none.
 *
 * No new schema and no scraping — the source thumbnail is derived at render time
 * from the stored URL, reusing the app's existing `getVideoPosterUrl` resolver
 * (the same one Creator Review media already uses).
 */
import {
  creatorReviewPlatformLabel,
  detectCreatorReviewPlatform,
  getVideoPosterUrl,
} from './videoEmbed';

export type BrandStoryBlock = {
  id?: string;
  heading?: string;
  body?: string;
  kind?: 'text' | 'link' | 'content';
  url?: string;
  thumbnail?: string;
  contentId?: string;
  mediaKind?:
    | 'youtube'
    | 'youtube_shorts'
    | 'instagram_reel'
    | 'instagram_post'
    | 'tiktok'
    | 'facebook'
    | 'other';
};

export type BrandStoryTextBlock = { id: string; heading?: string; body: string };

export type BrandStoryCardModel = {
  key: string;
  kind: 'link' | 'content';
  title: string;
  caption?: string;
  href?: string;
  /** custom → source-derived; '' means the caller renders a neutral placeholder */
  thumbnailUrl: string;
  hasThumbnail: boolean;
  platformLabel: string;
  aspect: 'landscape' | 'portrait' | 'square';
};

const IMG_RE = /^(https?:|data:|\/)/i;
const isImage = (v?: string): v is string => typeof v === 'string' && IMG_RE.test(v.trim());

/** custom thumbnail → source-derived thumbnail (YouTube) → '' */
export function resolveBrandStoryThumb(block: { thumbnail?: string; url?: string }): string {
  if (isImage(block.thumbnail)) return (block.thumbnail as string).trim();
  return getVideoPosterUrl(block.url || '') || '';
}

function aspectForMediaKind(kind?: BrandStoryBlock['mediaKind']): BrandStoryCardModel['aspect'] {
  if (kind === 'youtube_shorts' || kind === 'instagram_reel' || kind === 'tiktok') return 'portrait';
  if (kind === 'instagram_post') return 'square';
  return 'landscape';
}

export type BrandStoryContentLookup = (
  contentId: string,
) => { title?: string; image?: string; href?: string; kindLabel?: string } | undefined;

export function brandStoryTextBlocks(blocks: BrandStoryBlock[] | undefined): BrandStoryTextBlock[] {
  return (blocks || [])
    .filter((b) => (b.kind ?? 'text') === 'text' && (b.body || '').trim())
    .map((b, i) => ({ id: b.id || `sbt-${i}`, heading: b.heading?.trim() || undefined, body: (b.body || '').trim() }));
}

export function normalizeBrandStoryCards(
  blocks: BrandStoryBlock[] | undefined,
  resolveContent?: BrandStoryContentLookup,
): BrandStoryCardModel[] {
  const cards: BrandStoryCardModel[] = [];
  (blocks || []).forEach((b, i) => {
    const kind = b.kind === 'content' ? 'content' : b.kind === 'link' ? 'link' : 'text';
    if (kind === 'text') return; // text handled separately

    if (kind === 'link') {
      const url = (b.url || '').trim();
      if (!url) return;
      const thumb = resolveBrandStoryThumb(b);
      const platform = detectCreatorReviewPlatform(url);
      cards.push({
        key: b.id || `sbl-${i}`,
        kind: 'link',
        title: (b.heading || '').trim() || 'View',
        caption: (b.body || '').trim() || undefined,
        href: url,
        thumbnailUrl: thumb,
        hasThumbnail: Boolean(thumb),
        platformLabel: platform !== 'unknown' ? creatorReviewPlatformLabel(platform) : 'Link',
        aspect: aspectForMediaKind(b.mediaKind) ,
      });
      return;
    }

    // content — a Choosify guide/review/live the seller published
    const cid = (b.contentId || '').trim();
    if (!cid) return;
    const resolved = resolveContent?.(cid);
    if (!resolved) return; // unavailable content — omit rather than show a broken card
    const thumb = isImage(resolved.image) ? (resolved.image as string) : '';
    cards.push({
      key: b.id || `sbc-${i}`,
      kind: 'content',
      title: (b.heading || '').trim() || resolved.title || 'View',
      caption: undefined,
      href: resolved.href,
      thumbnailUrl: thumb,
      hasThumbnail: Boolean(thumb),
      platformLabel: resolved.kindLabel || 'Story',
      aspect: b.mediaKind ? aspectForMediaKind(b.mediaKind) : 'landscape',
    });
  });
  return cards;
}
