import React from 'react';
import { getSocialProviders } from '../../lib/authApi';
import { signInWithFacebook, signInWithGoogle } from '../../lib/authSession';
import type { SessionIdentity } from '../../lib/authSession';

/**
 * Consumer social sign-in row (Google + Facebook). Storefront only — never
 * rendered on a dashboard/partner auth screen.
 *
 *  - Google: Google Identity Services (GIS) ID-token flow. The official GIS
 *    button is rendered transparently ON TOP of the Choosify-styled button so
 *    the approved visual design is preserved while the real Google click
 *    handler runs. The backend (`POST /auth/google`) verifies the ID token.
 *  - Facebook: the Facebook JS SDK `FB.login`, only when a Meta app id is
 *    configured AND the backend reports it can verify the token. Otherwise the
 *    button is visibly inactive — never a fake success.
 *  - A social login always yields a Consumer session; the backend enforces role.
 */

type Props = {
  mode: 'sign-in' | 'sign-up';
  disabled?: boolean;
  onSuccess: (identity: SessionIdentity) => void | Promise<void>;
  onError: (message: string) => void;
};

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string | undefined)?.trim() || '';
const FACEBOOK_APP_ID = (import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined)?.trim() || '';

// Full-width, stacked — same footprint as the primary "Sign in to Choosify" CTA.
//
// h-11 (44px) is deliberate, not decorative: Google's GIS button at
// size="large" always renders its iframe at a fixed 44px tall, and measured
// against a live production page it is NOT vertically centered inside a
// taller container — it sits flush to the top (a couple px of overhang
// above) and falls short at the bottom, leaving a real dead-click-zone
// along the bottom edge of whatever visible button sits under it. Matching
// OUR box to google's fixed, known 44px height (rather than trying to force
// their iframe to fill an arbitrary height, which renderButton's public API
// has no option for) is what makes the two boxes align exactly, on every
// breakpoint, with no dead zone. py-* is intentionally NOT used here since a
// fixed height already fully determines the box (border-box) and
// items-center already centers the icon+label within it.
const BTN_CLASS =
  'flex w-full h-11 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-semibold text-[#1A1A2E] transition-colors hover:bg-[#F9FAFB] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

function loadScriptOnce(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject(new Error('no document'));
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`failed to load ${src}`)));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.id = id;
    s.async = true;
    s.defer = true;
    s.addEventListener('load', () => {
      s.dataset.loaded = 'true';
      resolve();
    });
    s.addEventListener('error', () => reject(new Error(`failed to load ${src}`)));
    document.head.appendChild(s);
  });
}

function GoogleIcon() {
  return (
    <img
      src="/icons/google.svg"
      alt=""
      width={18}
      height={18}
      className="h-[18px] w-[18px] object-contain"
      draggable={false}
      aria-hidden
    />
  );
}
function FacebookIcon() {
  return (
    <img
      src="/icons/facebook.svg"
      alt=""
      width={18}
      height={18}
      className="h-[18px] w-[18px] object-contain"
      draggable={false}
      aria-hidden
    />
  );
}

export function SocialAuthButtons({ mode, disabled, onSuccess, onError }: Props) {
  const [serverProviders, setServerProviders] = React.useState<{ google: boolean; facebook: boolean }>({
    google: false,
    facebook: false,
  });
  const [busy, setBusy] = React.useState<'google' | 'facebook' | null>(null);
  const [googleReady, setGoogleReady] = React.useState(false);
  const googleOverlayRef = React.useRef<HTMLDivElement | null>(null);
  const googleShellRef = React.useRef<HTMLDivElement | null>(null);

  const googleEnabled = Boolean(GOOGLE_CLIENT_ID) && serverProviders.google;
  const facebookEnabled = Boolean(FACEBOOK_APP_ID) && serverProviders.facebook;
  const verb = mode === 'sign-up' ? 'Sign up' : 'Continue';

  React.useEffect(() => {
    let cancelled = false;
    getSocialProviders().then((p) => {
      if (!cancelled) setServerProviders(p);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGoogleCredential = React.useCallback(
    async (credential: string) => {
      if (!credential) return;
      setBusy('google');
      try {
        const identity = await signInWithGoogle(credential);
        await onSuccess(identity);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Google sign-in failed. Please try again.');
      } finally {
        setBusy(null);
      }
    },
    [onSuccess, onError],
  );

  // ── Google Identity Services: init + render the real button as a transparent overlay ──
  React.useEffect(() => {
    if (!googleEnabled) return;
    let cancelled = false;

    loadScriptOnce('https://accounts.google.com/gsi/client', 'gsi-client')
      .then(() => {
        if (cancelled) return;
        const g = (window as any).google;
        if (!g?.accounts?.id) return;
        g.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (resp: { credential?: string }) => {
            void handleGoogleCredential(resp.credential || '');
          },
          ux_mode: 'popup',
          auto_select: false,
          itp_support: true,
        });
        setGoogleReady(true);
      })
      .catch(() => {
        // GIS blocked / offline — the button falls back to an inline message.
        setGoogleReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, [googleEnabled, handleGoogleCredential]);

  // Render (and re-render on resize) the invisible GIS button so it exactly
  // covers the Choosify-styled button beneath it.
  React.useEffect(() => {
    if (!googleReady || !googleEnabled) return;
    const g = (window as any).google;
    const overlay = googleOverlayRef.current;
    const shell = googleShellRef.current;
    if (!g?.accounts?.id || !overlay || !shell) return;

    const draw = () => {
      overlay.innerHTML = '';
      g.accounts.id.renderButton(overlay, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: mode === 'sign-up' ? 'signup_with' : 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'center',
        width: Math.max(200, Math.round(shell.getBoundingClientRect().width)),
      });
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(shell);

    // GIS's popup-based button ties its click handling to a single-use render
    // (see the `cas=` nonce in the iframe's own src) - after the popup closes,
    // whether the user completed sign-in or cancelled it, the ORIGINAL iframe
    // can go stale and stop responding to further clicks. There is no GIS
    // callback for "the popup was closed without a credential" to hook into
    // directly, but the window reliably regains focus the moment that popup
    // closes either way - so treat that as the signal to hand the user a
    // fresh, guaranteed-live button rather than one that may already be dead.
    const onWindowFocus = () => draw();
    window.addEventListener('focus', onWindowFocus);

    return () => {
      ro.disconnect();
      window.removeEventListener('focus', onWindowFocus);
    };
  }, [googleReady, googleEnabled, mode]);

  const handleGoogleFallbackClick = () => {
    if (googleEnabled && googleReady) {
      // The transparent GIS overlay handles the real click; this only fires if
      // the overlay failed to mount.
      const g = (window as any).google;
      g?.accounts?.id?.prompt?.();
      return;
    }
    onError('Google sign-in isn’t available right now. Please use your email and password.');
  };

  const handleFacebookClick = async () => {
    if (!facebookEnabled) {
      onError('Facebook sign-in isn’t enabled yet. Please use Google or your email and password.');
      return;
    }
    setBusy('facebook');
    try {
      await loadScriptOnce('https://connect.facebook.net/en_US/sdk.js', 'fb-sdk');
      const FB = (window as any).FB;
      if (!FB) throw new Error('Facebook SDK unavailable');
      if (!(window as any).__fbInit) {
        FB.init({ appId: FACEBOOK_APP_ID, cookie: false, xfbml: false, version: 'v19.0' });
        (window as any).__fbInit = true;
      }
      const accessToken: string = await new Promise((resolve, reject) => {
        FB.login(
          (resp: any) => {
            const token = resp?.authResponse?.accessToken;
            if (resp?.status === 'connected' && token) resolve(token);
            else reject(new Error('Facebook sign-in was cancelled.'));
          },
          { scope: 'public_profile,email' },
        );
      });
      const identity = await signInWithFacebook(accessToken);
      await onSuccess(identity);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Facebook sign-in failed. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mb-5 flex flex-col gap-2.5">
      {/* Google — Choosify-styled button with the real GIS button transparently on top */}
      <div ref={googleShellRef} className="relative flex w-full">
        <button
          type="button"
          onClick={handleGoogleFallbackClick}
          disabled={disabled || busy !== null || !googleEnabled}
          className={BTN_CLASS}
          aria-label={`${verb} with Google`}
          title={googleEnabled ? undefined : 'Google sign-in is not enabled yet'}
        >
          <GoogleIcon />
          {busy === 'google' ? 'Signing in…' : `${verb} with Google`}
        </button>
        {googleEnabled && googleReady ? (
          <div
            ref={googleOverlayRef}
            // No overflow-hidden: GIS's rendered iframe can be a few px wider than
            // the requested width (its own border/shadow chrome), and clipping it
            // here would silently cut off the real, clickable edges of the button
            // while it's still fully invisible (opacity-0 already hides all of it,
            // clipped or not) - so there is nothing to gain from clipping and a
            // real dead-click-zone to lose.
            className="absolute inset-0 opacity-0"
            style={{ colorScheme: 'light' }}
            aria-hidden
          />
        ) : null}
      </div>

      {/* Facebook — active only when a Meta app is configured and verifiable */}
      <button
        type="button"
        onClick={() => void handleFacebookClick()}
        disabled={disabled || busy !== null || !facebookEnabled}
        className={BTN_CLASS + ' text-[#1877F2]'}
        aria-label={`${verb} with Facebook`}
        title={facebookEnabled ? undefined : 'Facebook sign-in is not enabled yet'}
      >
        <FacebookIcon />
        {busy === 'facebook' ? 'Signing in…' : `${verb} with Facebook`}
      </button>
    </div>
  );
}
