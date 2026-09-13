/**
 * TikTok's public oEmbed endpoint (https://www.tiktok.com/oembed) is a
 * documented, credential-free API -- verified reachable directly from this
 * app's own origin via a live browser fetch (200 OK, readable JSON body, no
 * CORS block). Unlike Facebook/Instagram, TikTok does not gate this behind
 * an app access token, so it's safe to use for a real, non-fabricated
 * thumbnail instead of the branded placeholder.
 *
 * The returned `thumbnail_url` is a short-lived signed CDN link (it carries
 * an expiry param), so it is only ever resolved fresh at render time here
 * and never persisted to any store -- mirroring how getVideoPosterUrl
 * derives a YouTube thumbnail synchronously, except this one needs a
 * network round-trip.
 */

const pending = new Map<string, Promise<string | null>>();

async function fetchTikTokThumbnail(url: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
      mode: 'cors',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: unknown };
    return typeof data.thumbnail_url === 'string' ? data.thumbnail_url : null;
  } catch {
    // Network failure / CORS block / malformed response -- caller falls
    // back to the honest branded placeholder, never a fabricated image.
    return null;
  }
}

/** In-memory only (per page session) -- avoids refetching the same TikTok
 *  URL from every card instance that renders it. */
export function getTikTokThumbnail(url: string): Promise<string | null> {
  let promise = pending.get(url);
  if (!promise) {
    promise = fetchTikTokThumbnail(url);
    pending.set(url, promise);
  }
  return promise;
}
