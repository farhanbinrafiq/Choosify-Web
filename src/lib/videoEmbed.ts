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

/**
 * The backend's local-disk media pipeline returns a relative `/media/...`
 * URL (see choosify-admin-4.0's mediaStorage.ts publicOrigin()). This
 * storefront and the admin app are served from different origins, so a bare
 * relative URL 404s here even though it resolves fine on the admin app
 * itself -- resolve it against the API's own origin before ever rendering
 * it. Mirrors services/mediaUpload.ts's identical (private) resolveMediaUrl,
 * duplicated here rather than imported to keep this a dependency-free leaf
 * module (mediaUpload.ts pulls in auth/session/Cloudinary config this file
 * has no other reason to depend on).
 */
function resolveCreatorThumbnailMediaUrl(url: string): string {
  if (!url || /^(https?:|data:|blob:)/i.test(url)) return url;
  const apiBase = ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1';
  let origin = '';
  try {
    origin = new URL(apiBase).origin;
  } catch {
    return url; // apiBase itself is relative -> same-origin deployment, no prefix needed
  }
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

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

/**
 * Sellers sometimes paste a platform's official "Embed Code" snippet
 * (an <iframe>, <blockquote>, or <script> block) into the video-link field
 * instead of a plain URL -- TikTok, Instagram, and Facebook's own "Embed"
 * options all produce this. That raw HTML is never stored or rendered
 * (real XSS surface if it were) -- instead this extracts the one URL that
 * actually identifies the content, from the small set of attributes these
 * platforms use to carry it (`cite`, `data-href`, `data-instgrm-permalink`,
 * or an `href=` query param inside a `plugins/video.php?...` iframe src),
 * falling back to the first bare http(s) URL found in the text. The
 * extracted candidate is only ever treated as a plain URL string -- it is
 * re-validated by the normal platform detection/allowlist logic exactly
 * like any pasted link, never trusted or rendered as HTML.
 */
/**
 * A real browser DOM-parses embed-code HTML before ever reading an attribute
 * off it, which silently decodes HTML entities (`&amp;` -> `&` etc.) as part
 * of normal attribute parsing. This extractor works on the raw text instead
 * (deliberately -- see the doc comment above), so it has to do that same
 * decoding by hand; skipping it left literal `&amp;` text baked into stored
 * URLs pasted from Instagram/Facebook's official embed code (their markup
 * always HTML-escapes attribute values, e.g.
 * `data-instgrm-permalink="...?utm_source=ig_embed&amp;utm_campaign=..."`).
 * Deliberately narrow -- only the entities these platforms' own embed
 * snippets actually use in a URL attribute.
 */
function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function extractUrlFromPastedInput(input: string): string {
  const raw = (input || '').trim();
  if (!raw) return raw;
  // Already a clean, parseable absolute URL -- nothing to extract.
  try {
    new URL(raw);
    return raw;
  } catch {
    // fall through -- likely embed-code HTML, try to pull a URL out of it
  }

  // Facebook's plugins/video.php iframe src carries the real target as an
  // encoded `href=` query value -- check this before the generic attribute
  // match below, since it needs URL-decoding rather than a literal copy.
  const hrefParamMatch = raw.match(/[?&]href=([^&"'<>\s]+)/i);
  if (hrefParamMatch?.[1]) {
    try {
      const decoded = decodeHtmlEntities(decodeURIComponent(hrefParamMatch[1]));
      new URL(decoded);
      return decoded;
    } catch {
      // fall through
    }
  }

  const attrMatch = raw.match(/(?:cite|data-href|data-instgrm-permalink)=["']([^"']+)["']/i);
  if (attrMatch?.[1]) {
    const decoded = decodeHtmlEntities(attrMatch[1]);
    try {
      new URL(decoded);
      return decoded;
    } catch {
      // fall through
    }
  }

  const bareMatch = raw.match(/https?:\/\/[^\s"'<>]+/i);
  if (bareMatch?.[0]) {
    const decoded = decodeHtmlEntities(bareMatch[0]);
    try {
      new URL(decoded);
      return decoded;
    } catch {
      // fall through
    }
  }

  return raw;
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
    if (/\/reel\//.test(clean) || /\/share\/r\//.test(clean)) return 'facebook_reel';
    return 'facebook_video';
  }
  return 'unknown';
}

/**
 * Card/player orientation implied by the detected platform.
 *
 * `instagram_post` is deliberately `'portrait'`, not `'landscape'` -- a
 * native Instagram feed post is square/4:5/portrait, never 16:9, so forcing
 * it into a landscape box was itself a bug (it made the viewer clip/scroll
 * Instagram's own embedded content). Portrait is the honest closer default
 * until real per-post aspect metadata is available.
 */
export function getCreatorReviewOrientation(
  platform: CreatorReviewPlatform,
): 'portrait' | 'landscape' {
  switch (platform) {
    case 'youtube_shorts':
    case 'instagram_reel':
    case 'instagram_post':
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

/**
 * Facebook's video plugin can only ever succeed for a URL that references
 * one specific piece of content -- a bare profile/page/group URL can never
 * be embedded no matter what Facebook's permissions say. Facebook's own
 * "Watch" tab (facebook.com/watch) was discontinued in 2023 and now
 * redirects into Reels, so `/watch` alone is no longer a reliable positive
 * signal either. Require the URL to actually reference a specific
 * video/reel -- a `/videos/<id>` path, a `/reel(s)/` path, a numeric `v=`
 * query, or a fb.watch/<code> short link -- before ever attempting an
 * embed; anything else (e.g. a seller accidentally pasting a Page URL)
 * short-circuits straight to the honest fallback instead of guaranteeing a
 * failed iframe attempt.
 */
function looksLikeSpecificFacebookContent(url: string): boolean {
  return (
    // Facebook's SEO-friendly video URLs insert a text slug before the
    // numeric id (`/<page>/videos/<slug>/<id>/`) -- the optional segment
    // here accounts for that shape as well as the bare `/videos/<id>` form.
    /\/videos?\/(?:[^/]+\/)?\d+/.test(url) ||
    /\/reels?\//.test(url) ||
    /[?&]v=\d+/.test(url) ||
    /^https?:\/\/(www\.)?fb\.watch\//.test(url) ||
    // Facebook's modern "Share" button link (mobile + desktop) -- a
    // redirect shortcode for one specific video/reel (not a bare page URL).
    // Confirmed against real local Brand Story data
    // (facebook.com/share/v/<code>/). `/share/p/` (a generic post -- not
    // necessarily video) is deliberately excluded: the video plugin can't
    // help with a non-video post regardless.
    /\/share\/[vr]\//.test(url)
  );
}

/**
 * Facebook-specific canonicalization -- strips tracking/share cruft (`rdid`,
 * `share_url`, trailing `#`, etc.) that a user's copy-pasted share link
 * carries but Facebook's own embed generator never includes. Only fires for
 * URL shapes we can extract a real numeric id from (`/reel/<id>`,
 * `/videos/<id>`, `?v=<id>`); anything else (an opaque `/share/v/<code>`
 * redirect, a `fb.watch/<code>` short link) has no client-derivable
 * canonical form, so it passes through unchanged exactly as before --
 * Facebook's plugin already resolves those shapes on its own.
 */
export function canonicalizeFacebookUrl(url: string): string {
  const reelId = url.match(/\/reel\/(\d+)/)?.[1];
  if (reelId) return `https://www.facebook.com/reel/${reelId}/`;
  // Optional slug segment before the id -- see looksLikeSpecificFacebookContent.
  const videoId = url.match(/\/videos\/(?:[^/]+\/)?(\d+)/)?.[1] || url.match(/[?&]v=(\d+)/)?.[1];
  if (videoId) return `https://www.facebook.com/watch/?v=${videoId}`;
  return url;
}

/**
 * Instagram-specific canonicalization -- the bare permalink form
 * (`instagram.com/<p|reel>/<shortcode>/`), no query string. Instagram's own
 * oEmbed-returned `data-instgrm-permalink` additionally carries its own
 * `utm_source`/`utm_campaign` tracking params, but those are Instagram's
 * own decoration, not a requirement -- the SDK embeds correctly from the
 * bare canonical form alone.
 */
/**
 * Facebook share links (`/share/r/<token>/`, `/share/v/<token>/`) are NOT
 * embeddable content URLs -- they are opaque, session-resolved redirect
 * tokens, structurally distinct from a real canonical Reel/video URL.
 * Confirmed by direct testing: an unauthenticated fetch of one returns
 * HTTP 400 with no redirect at all, and Meta's own tokenless oEmbed accepts
 * the URL but echoes the same unresolved `/share/...` string back rather
 * than resolving it -- there is no legitimate, credential-free way to turn
 * the opaque token into a numeric video/reel id. It must never be treated
 * as one (see canonicalizeFacebookUrl, which is untouched by this and only
 * ever matches genuine numeric-id URL shapes).
 */
export function isUnsupportedFacebookShareUrl(url: string): boolean {
  const host = safeHostname(url || '');
  if (!host.endsWith('facebook.com')) return false;
  return /\/share\/[rv]\//i.test(url);
}

export function canonicalizeInstagramUrl(url: string): string {
  const shortcode = extractInstagramShortcode(url);
  if (!shortcode) return url;
  const kind = /\/(reel|reels)\//.test(url) ? 'reel' : 'p';
  return `https://www.instagram.com/${kind}/${shortcode}/`;
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
    // encoded query value, per Facebook's documented video plugin. The href
    // itself is canonicalized first (see canonicalizeFacebookUrl) so a
    // pasted share link's `rdid`/`share_url`/trailing `#` never rides along
    // into the embed, matching the shape Facebook's own embed generator
    // produces. `show_text=false` and `t=0` mirror that generator's output;
    // width/height are deliberately omitted here (not hard-coded) so the
    // modal's CSS box stays in control of actual rendered size.
    const canonical = canonicalizeFacebookUrl(clean);
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(canonical)}&show_text=false&t=0`;
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
  // Facebook share links look superficially "specific" (looksLikeSpecificFacebookContent
  // allows /share/[vr]/) but cannot actually be resolved to playable content
  // without a logged-in Facebook session -- see isUnsupportedFacebookShareUrl.
  // Gated first and unconditionally so this can never be reached by any
  // other platform's logic below.
  if (isUnsupportedFacebookShareUrl(url)) return false;
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
  if (!looksLikeRecognizedEmbed || !hasAllowedEmbedHost(embed)) return false;
  // Facebook's plugin URL "looks recognized" for literally any facebook.com
  // string (see getVideoEmbedUrl) -- only a URL that actually references
  // specific content can ever really play, so gate on that too.
  if (embed.includes('/plugins/video.php') && !looksLikeSpecificFacebookContent(url)) {
    return false;
  }
  return true;
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
  /**
   * Bare canonical URL (no tracking params/fragments), used only by
   * Facebook/Instagram's official SDK-based embed (see
   * CreatorReviewViewerModal / MetaSdkEmbed) -- meaningless for the other
   * platforms, which stay on the plain `embedUrl` iframe.
   */
  canonicalUrl: string;
  canEmbed: boolean;
  thumbnailUrl: string;
}

export function resolveCreatorReviewMedia(
  rawUrl: string,
  customThumbnail?: string,
): CreatorReviewMedia {
  // Normalizes an accidentally-pasted embed-code snippet down to its plain
  // URL before any detection/canonicalization runs -- see
  // extractUrlFromPastedInput. A no-op for an already-clean URL.
  const url = extractUrlFromPastedInput(rawUrl);
  const platform = detectCreatorReviewPlatform(url);
  // Precedence (platform-independent): a seller-selected custom thumbnail
  // always wins over a platform-generated one (e.g. YouTube's auto thumbnail),
  // which in turn wins over having nothing at all. Previously this was
  // reversed -- the derived platform thumbnail (only ever non-empty for
  // YouTube/YouTube Shorts today) silently overrode a valid custom thumbnail,
  // while Facebook/Instagram/TikTok "worked" only because getVideoPosterUrl
  // never derives anything for them, not because the precedence was correct.
  const derivedThumb = getVideoPosterUrl(url);
  const canonicalUrl =
    platform === 'facebook_reel' || platform === 'facebook_video'
      ? canonicalizeFacebookUrl(url)
      : platform === 'instagram_reel' || platform === 'instagram_post'
        ? canonicalizeInstagramUrl(url)
        : url;
  return {
    platform,
    platformLabel: creatorReviewPlatformLabel(platform),
    orientation: getCreatorReviewOrientation(platform),
    externalUrl: url,
    embedUrl: getVideoEmbedUrl(url),
    canonicalUrl,
    canEmbed: isEmbeddableVideo(url),
    thumbnailUrl: resolveCreatorThumbnailMediaUrl(customThumbnail || '') || derivedThumb || '',
  };
}
