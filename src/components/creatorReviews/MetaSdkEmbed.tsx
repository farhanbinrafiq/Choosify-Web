import React, { useEffect, useRef } from 'react';
import { loadFacebookSdk, loadInstagramEmbedJs } from '../../lib/metaEmbedSdk';

/**
 * Renders the exact minimal official XFBML container Meta's own tokenless
 * oEmbed returns for a public Reel/video (`<div class="fb-video"
 * data-href="...">` -- confirmed directly against
 * graph.facebook.com/v25.0/oembed_video), then asks the (singleton) SDK to
 * parse it. We build this markup ourselves from the validated canonical
 * href rather than injecting oEmbed's own returned HTML -- no
 * dangerouslySetInnerHTML, no third-party HTML persisted or trusted
 * verbatim.
 *
 * Facebook's SDK only auto-scans the DOM once, at load time -- a div added
 * afterward (every re-open, every second Reel) is never picked up on its
 * own, so FB.XFBML.parse(container) is called unconditionally on every
 * mount. The caller (CreatorReviewViewerModal) already remounts this whole
 * component on media change (`key={media.videoUrl}`), so each open gets a
 * fresh, unprocessed div -- no manual cleanup is needed beyond letting
 * React unmount it, which removes whatever iframe the SDK inserted.
 */
export function FacebookSdkEmbed({ href }: { href: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (container) {
      // Facebook's plugin needs an explicit width to size sensibly inside
      // our responsive box (it does not auto-fill its parent); measure the
      // actual rendered box rather than guessing, clamped to the plugin's
      // own documented 500px max.
      const measured = container.parentElement?.clientWidth || container.clientWidth || 320;
      container.setAttribute('data-width', String(Math.max(180, Math.min(500, Math.round(measured)))));
    }
    loadFacebookSdk().then(() => {
      if (cancelled || !container) return;
      window.FB?.XFBML.parse(container);
    });
    return () => {
      cancelled = true;
    };
  }, [href]);

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-black">
      <div ref={containerRef} className="fb-video" data-href={href} />
    </div>
  );
}

/**
 * Same approach for Instagram: the official minimal blockquote (confirmed
 * against graph.facebook.com/v25.0/instagram_oembed), processed via
 * window.instgrm.Embeds.process() -- Instagram's own documented call for
 * embeds added dynamically after initial page load. process() scans the
 * whole document and is idempotent (already-processed blockquotes are
 * skipped), so calling it broadly here is exactly the officially
 * recommended usage, not a workaround.
 */
export function InstagramSdkEmbed({ permalink }: { permalink: string }) {
  useEffect(() => {
    let cancelled = false;
    loadInstagramEmbedJs().then(() => {
      if (cancelled) return;
      window.instgrm?.Embeds.process();
    });
    return () => {
      cancelled = true;
    };
  }, [permalink]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-auto flex items-center justify-center bg-white">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{ margin: 0, width: '100%' }}
      >
        <a href={permalink} target="_blank" rel="noopener noreferrer">
          View this post on Instagram
        </a>
      </blockquote>
    </div>
  );
}
