import { next, rewrite } from '@vercel/edge';

/** Social crawler user-agents that need server-rendered meta (SPA shells are insufficient). */
const SOCIAL_CRAWLER_UA_PATTERN =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|TelegramBot|SkypeUriPreview|Pinterest|redditbot|Embedly|Quora Link Preview|Showyoubot|outbrain|vkShare|W3C_Validator|Google.*snippet/i;

/**
 * Social crawlers often do not execute SPA JavaScript.
 * Rewrite them to /api/share which returns complete Open Graph HTML.
 */
export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!SOCIAL_CRAWLER_UA_PATTERN.test(ua)) {
    return next();
  }

  const url = new URL(request.url);
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/og/') ||
    url.pathname.includes('.')
  ) {
    return next();
  }

  const path = `${url.pathname}${url.search}`;
  const shareUrl = new URL('/api/share', url.origin);
  shareUrl.searchParams.set('path', path);
  return rewrite(shareUrl);
}
