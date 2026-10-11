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
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = React.useState(false);
  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    const stillRaw = () => Boolean(hostRef.current?.querySelector('blockquote.instagram-media'));
    loadInstagramEmbedJs().then(() => {
      if (cancelled) return;
      window.instgrm?.Embeds.process();
    });
    // If Instagram's player hasn't replaced the blockquote (slow network, or a
    // browser extension / privacy setting blocking instagram.com), retry once,
    // then offer a clear way to watch it on Instagram instead of a blank card.
    const retry = window.setTimeout(() => {
      if (!cancelled && stillRaw()) window.instgrm?.Embeds.process();
    }, 4000);
    const giveUp = window.setTimeout(() => {
      if (!cancelled && stillRaw()) setFailed(true);
    }, 9000);
    return () => {
      cancelled = true;
      window.clearTimeout(retry);
      window.clearTimeout(giveUp);
    };
  }, [permalink]);

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6 bg-black">
        <p className="text-sm font-semibold text-white/80">Instagram&rsquo;s player didn&rsquo;t load here.</p>
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#1A1A2E] text-[12px] font-bold no-underline"
        >
          Watch on Instagram ↗
        </a>
      </div>
    );
  }

  return (
    <div ref={hostRef} className="absolute inset-0 w-full h-full overflow-auto flex items-center justify-center bg-white">
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
