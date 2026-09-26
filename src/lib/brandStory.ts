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
  extractUrlFromPastedInput,
  getVideoPosterUrl,
  type CreatorReviewPlatform,
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
  /**
   * Only meaningful for `kind: 'link'` -- the platform detected from the raw
   * URL's own structure (never the seller-entered label). `'unknown'` means
   * the link doesn't match any platform this app can embed (e.g. a plain
   * external blog/article), so the card must keep its existing plain
   * external-link behavior rather than offering a Play affordance for
   * something we can't actually play in-platform.
   */
  platform?: CreatorReviewPlatform;
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

/**
 * The media kind the dashboard's "Auto-detect from link" option implies for a
 * detected platform -- mirrors the dashboard's own `detectStoryMediaKind`
 * (Facebook reels/videos are one `facebook` kind there), so a story left on
 * auto-detect renders in the same aspect the seller saw in Brand Studio.
 */
function mediaKindForPlatform(platform: CreatorReviewPlatform): NonNullable<BrandStoryBlock['mediaKind']> {
  if (platform === 'facebook_reel' || platform === 'facebook_video') return 'facebook';
  if (platform === 'unknown') return 'other';
  return platform;
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
      // Sellers sometimes paste a platform's official embed code (e.g.
      // Instagram's <blockquote data-instgrm-permalink=...>) instead of a
      // plain link -- reduce it to the one real content URL first, exactly as
      // Creator Review media does, so detection/thumbnail/href all run on that
      // URL. The stored block is never rewritten.
      const url = extractUrlFromPastedInput((b.url || '').trim());
      if (!url) return;
      const thumb = resolveBrandStoryThumb({ thumbnail: b.thumbnail, url });
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
        // An explicit seller-chosen media type wins; "Auto-detect" (no stored
        // mediaKind) follows the platform detected from the URL.
        aspect: aspectForMediaKind(b.mediaKind || mediaKindForPlatform(platform)),
        platform,
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
