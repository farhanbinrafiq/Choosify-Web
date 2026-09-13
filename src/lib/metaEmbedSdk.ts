/**
 * Facebook/Instagram official SDK loader singletons -- Creator Reviews only.
 *
 * Each script is injected into the page at most once, no matter how many
 * times a Creator Review modal opens/closes across the session: the first
 * caller creates the <script> tag and caches its loading promise at module
 * scope; every later caller (a re-open, a second Facebook/Instagram review,
 * a concurrent card + modal) reuses that same cached promise instead of
 * re-fetching or re-initializing anything. This mirrors how Meta's own
 * reference WordPress integration (facebook/meta-embeds-for-wordpress)
 * de-duplicates the SDK enqueue by URL.
 *
 * No App ID, access token, or any other credential is used or required --
 * both scripts are Meta's public, tokenless embed SDKs.
 */

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: (node?: HTMLElement) => void;
      };
    };
    fbAsyncInit?: () => void;
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

let facebookSdkPromise: Promise<void> | null = null;

/** Resolves once window.FB.XFBML is available. Safe to call repeatedly. */
export function loadFacebookSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.FB?.XFBML) return Promise.resolve();
  if (facebookSdkPromise) return facebookSdkPromise;

  facebookSdkPromise = new Promise<void>((resolve) => {
    // fbAsyncInit is Facebook's own documented integration point -- it fires
    // once, after the SDK has finished its internal setup (unlike the
    // script's own `load` event, which only means the file finished
    // downloading). Set once, ever: every later loadFacebookSdk() call
    // short-circuits above via `window.FB?.XFBML`, so this is never
    // reassigned or leaked across repeat modal opens.
    const previous = window.fbAsyncInit;
    window.fbAsyncInit = () => {
      previous?.();
      resolve();
    };

    if (document.getElementById('facebook-jssdk')) {
      // Script tag already exists from an earlier call in this same
      // loading window -- fbAsyncInit above still resolves us once ready.
      return;
    }
    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v25.0';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
  });

  return facebookSdkPromise;
}

let instagramSdkPromise: Promise<void> | null = null;

/** Resolves once window.instgrm.Embeds is available. Safe to call repeatedly. */
export function loadInstagramEmbedJs(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.instgrm?.Embeds) return Promise.resolve();
  if (instagramSdkPromise) return instagramSdkPromise;

  instagramSdkPromise = new Promise<void>((resolve) => {
    const existing = document.getElementById('instagram-embed-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      if (window.instgrm?.Embeds) resolve();
      return;
    }
    const script = document.createElement('script');
    script.id = 'instagram-embed-js';
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });

  return instagramSdkPromise;
}
