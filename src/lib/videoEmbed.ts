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
];

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
    return clean;
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(clean) || clean.startsWith('blob:')) {
    return clean;
  }

  return clean;
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
  // Anything that would render inside an <iframe src="..."> must be on the
  // allowlist — this is the actual safety boundary Phase 9 asks for.
  return (embed.includes('/embed/') || embed.includes('tiktok.com')) && hasAllowedEmbedHost(embed);
}
