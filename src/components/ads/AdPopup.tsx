/**
 * Ads Studio pop-up (SITE_POPUP). Shows the first eligible pop-up for the current page:
 *  - on the pages the advertiser chose ("all" or specific page keys);
 *  - after the chosen delay;
 *  - at most `maxPerSession` times per visit — counted per page view in sessionStorage, which the
 *    browser keeps only for this tab;
 *  - once closed (×, Esc, or a click on the dimmed page) it does not come back in this tab.
 * Closing the tab clears sessionStorage, so a new tab starts fresh. If storage is unavailable the
 * pop-up shows at most once per page load and still closes normally.
 */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AD_SLOTS, adHref, useAdSlot, type PublicAd } from '../../lib/ads/adSlots';

/** Storefront route → pop-up page key (must match POPUP_PAGES in the admin registry). */
export function popupPageKey(pathname: string): string {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/') return 'homepage';
  if (p === '/products') return 'browse';
  if (p.startsWith('/products/')) return 'product_detail';
  if (p === '/brands') return 'brands';
  if (p.startsWith('/brands/')) return 'brand_detail';
  if (p.startsWith('/categories')) return 'categories';
  if (p.startsWith('/creators')) return 'creators';
  if (p.startsWith('/deals')) return 'deals';
  if (p.startsWith('/spotlight') || p.startsWith('/guides')) return 'discover';
  if (p.startsWith('/compare')) return 'compare';
  if (p.startsWith('/order-tracking')) return 'order_tracking';
  if (p.startsWith('/dashboard')) return 'dashboard';
  return 'other';
}

const store = {
  get(key: string): string | null {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* storage blocked: falls back to once per page load */
    }
  },
};
const shownKey = (id: string) => `choosify.popup.${id}.shown`;
const closedKey = (id: string) => `choosify.popup.${id}.closed`;

export function AdPopup() {
  const { pathname } = useLocation();
  const ads = useAdSlot(AD_SLOTS.SITE_POPUP);
  const page = popupPageKey(pathname);
  const [ad, setAd] = useState<PublicAd | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Every page view: pick the first pop-up still allowed in this tab (read fresh from storage, so a
  // closed or used-up pop-up never comes back), then show it after its delay. A showing is counted
  // only when it actually appears.
  const adsKey = ads.map((a) => a.id).join('|');
  useEffect(() => {
    setAd(null);
    const eligible = ads.find((a) => {
      if (!a.image || !a.popup) return false;
      const pages = a.popup.pages;
      if (!pages.includes('all') && !pages.includes(page)) return false;
      if (store.get(closedKey(a.id)) === '1') return false;
      return Number(store.get(shownKey(a.id)) || 0) < a.popup.maxPerSession;
    });
    if (!eligible?.popup) return;
    const t = window.setTimeout(() => {
      if (store.get(closedKey(eligible.id)) === '1') return;
      store.set(shownKey(eligible.id), String(Number(store.get(shownKey(eligible.id)) || 0) + 1));
      setAd(eligible);
    }, eligible.popup.delaySec * 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adsKey, pathname, page]);

  const close = () => {
    if (ad) store.set(closedKey(ad.id), '1');
    setAd(null);
  };

  useEffect(() => {
    if (!ad) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad]);

  if (!ad) return null;
  const target = adHref(ad);
  const external = Boolean(target && (target.external || /^https?:/i.test(target.href)));
  const media = (
    <img
      src={ad.image}
      alt={ad.alt}
      width={ad.imageWidth}
      height={ad.imageHeight}
      className="block max-h-[80vh] w-full rounded-2xl object-contain"
      data-testid="ad-popup-image"
    />
  );
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0F1238]/60 p-3 backdrop-blur-[2px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Sponsored"
      onClick={close}
      data-testid="ad-popup"
    >
      <div className="relative w-full max-w-[900px]" onClick={(e) => e.stopPropagation()}>
        {target ? (
          <a
            href={target.href}
            target={external ? '_blank' : undefined}
            rel={external ? 'sponsored noopener noreferrer' : undefined}
            onClick={() => {
              store.set(closedKey(ad.id), '1');
              if (!external) setAd(null);
            }}
            className="relative block"
            data-testid="ad-popup-link"
          >
            {media}
            {ad.ctaLabel ? (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-lg bg-[#FF5B00] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-white shadow-md sm:bottom-5 sm:right-5 sm:px-4 sm:py-2 sm:text-[13px]" data-testid="ad-popup-cta">
                {ad.ctaLabel} <span aria-hidden>→</span>
              </span>
            ) : null}
          </a>
        ) : (
          media
        )}
        <span className="pointer-events-none absolute left-2.5 top-2.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-white sm:left-3 sm:top-3 sm:text-[10px]">
          Sponsored
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[18px] font-bold text-[#111827] shadow-lg ring-1 ring-black/10 hover:bg-[#F3F4F6] sm:-right-3 sm:-top-3"
          data-testid="ad-popup-close"
        >
          ×
        </button>
      </div>
    </div>
  );
}
