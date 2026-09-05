/**
 * Pre-VPS self-hosting pass — domains this app will render inside an
 * <iframe src="...">. Anything else falls through to isEmbeddableVideo()
 * returning false rather than being blindly framed — embeds stay strictly
 * URL-based (never raw iframe HTML), but the URL itself is now checked
 * against an allowlist instead of trusted unconditionally.
 */
const ALLOWED_EMBED_HOSTS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'tiktok.com',
  'www.tiktok.com',
  'player.vimeo.com',
  'vimeo.com',
  'instagram.com',
  'www.instagram.com',
  'facebook.com',
  'www.facebook.com',
];

// ---------------------------------------------------------------------
// Creator Review platform detection — derived from URL structure only,
// never a seller-entered manual label (product.creatorContent.platform
// is free text and is not trusted for this).
// ---------------------------------------------------------------------

export type CreatorReviewPlatform =
  | 'youtube'
  | 'youtube_shorts'
  | 'instagram_reel'
  | 'instagram_post'
  | 'tiktok'
  | 'facebook_reel'
  | 'facebook_video'
  | 'unknown';

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Detects the platform + content shape from the URL's own structure. */
export function detectCreatorReviewPlatform(url: string): CreatorReviewPlatform {
  const clean = (url || '').trim();
  if (!clean) return 'unknown';
  const host = safeHostname(clean);

  if (host === 'youtu.be' || host.endsWith('youtube.com')) {
    if (/\/shorts\//.test(clean)) return 'youtube_shorts';
    return 'youtube';
  }
  if (host.endsWith('instagram.com')) {
    if (/\/(reel|reels)\//.test(clean)) return 'instagram_reel';
    if (/\/(p|tv)\//.test(clean)) return 'instagram_post';
    return 'instagram_post';
  }
  if (host.endsWith('tiktok.com')) return 'tiktok';
  if (host.endsWith('facebook.com') || host === 'fb.watch') {
    if (/\/reel\//.test(clean)) return 'facebook_reel';
    return 'facebook_video';
  }
  return 'unknown';
}

/** Card/player orientation implied by the detected platform. */
export function getCreatorReviewOrientation(
  platform: CreatorReviewPlatform,
): 'portrait' | 'landscape' {
  switch (platform) {
    case 'youtube_shorts':
    case 'instagram_reel':
    case 'tiktok':
    case 'facebook_reel':
      return 'portrait';
    default:
      return 'landscape';
  }
}

/** Human label for the "Open on <Platform>" action / badge. */
export function creatorReviewPlatformLabel(platform: CreatorReviewPlatform): string {
  switch (platform) {
    case 'youtube':
      return 'YouTube';
    case 'youtube_shorts':
      return 'YouTube Shorts';
    case 'instagram_reel':
      return 'Instagram Reel';
    case 'instagram_post':
      return 'Instagram';
    case 'tiktok':
      return 'TikTok';
    case 'facebook_reel':
      return 'Facebook Reel';
    case 'facebook_video':
      return 'Facebook';
    default:
      return 'Video';
  }
}

function extractTikTokVideoId(url: string): string {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : '';
}

function extractInstagramShortcode(url: string): string {
  const match = url.match(/\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : '';
}

function hasAllowedEmbedHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return ALLOWED_EMBED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

/** Converts common video URLs into iframe-safe embed URLs. */
export function getVideoEmbedUrl(url: string): string {
  if (!url || url === '#') return '';

  let clean = url.trim();

  if (clean.includes('youtube.com/shorts/') || clean.includes('youtu.be/shorts/')) {
    const id = clean.split('/shorts/')[1]?.split(/[?&#]/)[0];
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  if (clean.includes('youtu.be/')) {
    const id = clean.split('youtu.be/')[1]?.split(/[?&#]/)[0];
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }

  if (clean.includes('youtube.com/watch')) {
    try {
      const query = clean.includes('?') ? clean.substring(clean.indexOf('?')) : '';
      const id = new URLSearchParams(query).get('v');
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    } catch {
      // fall through
    }
  }

  if (clean.includes('/embed/')) {
    if (!clean.includes('autoplay=')) {
      clean = clean.includes('?') ? `${clean}&autoplay=1` : `${clean}?autoplay=1`;
    }
    return clean;
  }

  if (clean.includes('tiktok.com')) {
    // Framing the raw watch-page URL does not actually work (TikTok's own
    // page sets X-Frame-Options) — this is TikTok's official embed-player
    // pattern, built only from a regex-extracted numeric id, never the raw
    // input string.
    const id = extractTikTokVideoId(clean);
    if (id) return `https://www.tiktok.com/embed/v2/${id}`;
    return clean;
  }

  if (clean.includes('instagram.com')) {
    // Instagram's official embeddable form is the post/reel URL with
    // `/embed` appended — also does not work by framing the interactive
    // page URL directly.
    const shortcode = extractInstagramShortcode(clean);
    if (shortcode) {
      const kind = /\/(reel|reels)\//.test(clean) ? 'reel' : 'p';
      return `https://www.instagram.com/${kind}/${shortcode}/embed`;
    }
    return clean;
  }

  if (clean.includes('facebook.com') || clean.includes('fb.watch')) {
    // Facebook's official embed mechanism: the iframe's own origin is
    // always facebook.com — the original URL only ever appears as an
    // encoded query value, per Facebook's documented video plugin.
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(clean)}&show_text=0`;
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(clean) || clean.startsWith('blob:')) {
    return clean;
  }

  return clean;
}

/**
 * Poster/thumbnail image for a video URL where the platform exposes one
 * publicly. YouTube only for now — other hosts need an API call, so callers
 * fall back to a placeholder. Returns '' when nothing can be derived.
 */
export function getVideoPosterUrl(url: string): string {
  const clean = (url || '').trim();
  if (!clean) return '';
  let id = '';
  if (clean.includes('youtu.be/')) {
    id = clean.split('youtu.be/')[1]?.split(/[?&#/]/)[0] || '';
  } else if (clean.includes('youtube.com/shorts/')) {
    id = clean.split('/shorts/')[1]?.split(/[?&#/]/)[0] || '';
  } else if (clean.includes('youtube.com/embed/')) {
    id = clean.split('/embed/')[1]?.split(/[?&#/]/)[0] || '';
  } else if (clean.includes('youtube.com/watch')) {
    try {
      id = new URLSearchParams(clean.substring(clean.indexOf('?'))).get('v') || '';
    } catch {
      id = '';
    }
  }
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

export function isDirectVideoFile(url: string): boolean {
  if (!url || url === '#') return false;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.startsWith('blob:');
}

export function isEmbeddableVideo(url: string): boolean {
  if (!url || url === '#') return false;
  const embed = getVideoEmbedUrl(url);
  if (!embed.length) return false;
  // Direct video files / blob: URLs render via a plain <video> tag, not an
  // iframe — no cross-origin framing risk, so the host allowlist doesn't apply.
  if (isDirectVideoFile(embed)) return true;
  // Anything that would render inside an <iframe src="..."> must both (a)
  // match one of the specific embed shapes this file actually builds and
  // (b) be on the host allowlist — this is the actual safety boundary.
  const looksLikeRecognizedEmbed =
    embed.includes('/embed/') || // youtube /embed/<id>, tiktok /embed/v2/<id>
    /\/(p|reel)\/[^/]+\/embed/.test(embed) || // instagram /p|reel/<code>/embed
    embed.includes('/plugins/video.php'); // facebook official video plugin
  return looksLikeRecognizedEmbed && hasAllowedEmbedHost(embed);
}

/**
 * Full normalized media descriptor for a Creator Review URL — the single
 * place platform/orientation/embed/thumbnail are derived from the stored
 * URL at render time. No new schema: product.creatorContent only ever
 * stored the raw videoUrl, and that remains the source of truth.
 */
export interface CreatorReviewMedia {
  platform: CreatorReviewPlatform;
  platformLabel: string;
  orientation: 'portrait' | 'landscape';
  externalUrl: string;
  embedUrl: string;
  canEmbed: boolean;
  thumbnailUrl: string;
}

export function resolveCreatorReviewMedia(
  url: string,
  fallbackThumbnail?: string,
): CreatorReviewMedia {
  const platform = detectCreatorReviewPlatform(url);
  const derivedThumb = getVideoPosterUrl(url);
  return {
    platform,
    platformLabel: creatorReviewPlatformLabel(platform),
    orientation: getCreatorReviewOrientation(platform),
    externalUrl: url,
    embedUrl: getVideoEmbedUrl(url),
    canEmbed: isEmbeddableVideo(url),
    thumbnailUrl: derivedThumb || fallbackThumbnail || '',
  };
}
