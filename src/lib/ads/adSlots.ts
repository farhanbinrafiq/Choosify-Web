/**
 * Ads Studio → storefront delivery (client side).
 *
 * Slot ids come from the ONE registry in the admin repo (shared/ads/placementRegistry.ts); this
 * file only names the slots the storefront renders. All deliverable ads are fetched in ONE request
 * (GET /ads/delivery — public, display fields only), cached for the page session (refreshed after
 * 60s), and a failed request simply yields no ads: an ad problem never breaks a page.
 */
import { useEffect, useState } from 'react';
import { brandPath, creatorPath, guidePath, productPath } from '../../../lib/publicUrls';

export const AD_SLOTS = {
  HOME_HERO: 'HOME_HERO',
  HOME_BANNER: 'HOME_FOLLOW_BRANDS',
  BROWSE_BANNER: 'BROWSE_BANNER',
  BROWSE_SIDEBAR: 'BROWSE_SIDEBAR',
  DEALS_BANNER: 'DEALS_BANNER',
  DEALS_SIDEBAR: 'DEALS_SIDEBAR',
  BRANDS_BANNER: 'BRANDS_BANNER',
  CATEGORIES_BANNER: 'CATEGORIES_BANNER',
  CREATORS_BANNER: 'CREATORS_BANNER',
  DISCOVER_BANNER: 'DISCOVER_BANNER',
  CATEGORY_CARD_FOOTER: 'CATEGORY_CARD_FOOTER',
  DEALS_GRID_CARD: 'DEALS_GRID_CARD',
  BRANDS_GRID_CARD: 'BRANDS_GRID_CARD',
  CATEGORIES_GRID_CARD: 'CATEGORIES_GRID_CARD',
  PRODUCTS_FEED: 'PRODUCTS_FEED',
  BRANDS_FEED: 'BRANDS_FEED',
  CREATORS_GRID_CARD: 'CREATORS_GRID_CARD',
  DISCOVER_SIDEBAR: 'DISCOVER_SIDEBAR',
  COMPARE_BANNER: 'COMPARE_BANNER',
  COMPARE_SIDEBAR: 'COMPARE_SIDEBAR',
  ORDER_TRACKING_BANNER: 'ORDER_TRACKING_BANNER',
  DASHBOARD_BANNER: 'DASHBOARD_BANNER',
  DASHBOARD_SIDEBAR: 'DASHBOARD_SIDEBAR',
  SITE_POPUP: 'SITE_POPUP',
  BRANDS_SIDEBAR: 'BRANDS_SIDEBAR',
  CATEGORIES_SIDEBAR: 'CATEGORIES_SIDEBAR',
  CREATORS_SIDEBAR: 'CREATORS_SIDEBAR',
  GUIDES_SIDEBAR: 'GUIDES_SIDEBAR',
  DISCOVER_FEED: 'DISCOVER_FEED',
  PRODUCT_DETAIL_RAIL: 'PRODUCT_DETAIL_RAIL',
} as const;
export type AdSlotId = (typeof AD_SLOTS)[keyof typeof AD_SLOTS];

export type PublicAd = {
  id: string;
  slot: string;
  format: string;
  display: 'natural' | 'cover' | 'text';
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  alt: string;
  headline?: string;
  subtext?: string;
  ctaLabel?: string;
  sponsorName?: string;
  sponsorLogoUrl?: string;
  /** Wide banners: draw the headline + subtext over the image (advertiser's choice). */
  showText?: boolean;
  /** Wide banners on desktop: fill the frame edge to edge (crop top/bottom) instead of showing the whole design. */
  fit?: 'fill';
  focusY?: 'top' | 'center' | 'bottom';
  /** Wide banners: the exact spot on the page (slot default when the advertiser chose none). */
  position?: string;
  /** Pop-up rules: pages ("all" or page keys), times per visit, delay in seconds. */
  popup?: { pages: string[]; maxPerSession: number; delaySec: number };
  /** In-grid cards: after every N cards (0 = once, after the last card). */
  gridEvery?: number;
  /** In-grid card shown once (after card gridEvery), not repeated. */
  gridOnce?: boolean;
  /** Text cards: the logo's main colour → card gradient. */
  brandColor?: string;
  logoZoom?: number;
  logoFit?: 'fill' | 'fit';
  mobileImage?: string;
  mobileImageWidth?: number;
  mobileImageHeight?: number;
  brandColor2?: string;
  /** Sponsored Listing: the promoted product / brand (drawn as its normal card). */
  entity?: { type: 'product' | 'brand'; id: string };
  /** Sponsored Listing: the row it starts (first card of that row). */
  listRow?: number;
  /** Category Promoted Slot only: which category card carries this sponsor footer. */
  categoryId?: string;
  categoryName?: string;
  link: { type: 'product' | 'brand' | 'creator' | 'guide' | 'deal' | 'url'; id?: string; url?: string; external: boolean } | null;
};

const API_BASE = (((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1').replace(/\/$/, '');
const TTL_MS = 60_000;
let cache: { at: number; promise: Promise<Record<string, PublicAd[]>> } | null = null;

/** All deliverable ads by slot. Never rejects: errors resolve to {}. */
export function loadAdSlots(): Promise<Record<string, PublicAd[]>> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.promise;
  const promise = fetch(`${API_BASE}/ads/delivery`, { headers: { Accept: 'application/json' } })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => (j?.data?.slots && typeof j.data.slots === 'object' ? (j.data.slots as Record<string, PublicAd[]>) : {}))
    .catch(() => ({}));
  cache = { at: Date.now(), promise };
  return promise;
}

/** Ads for one slot ([] while loading, on error, or when nothing is booked). */
export function useAdSlot(slot: AdSlotId): PublicAd[] {
  const [ads, setAds] = useState<PublicAd[]>([]);
  useEffect(() => {
    let alive = true;
    loadAdSlots().then((all) => {
      if (!alive) return;
      const list = Array.isArray(all[slot]) ? all[slot].filter((a) => a && typeof a.id === 'string') : [];
      setAds(list);
    });
    return () => {
      alive = false;
    };
  }, [slot]);
  return ads;
}

/** Storefront href for an ad (null = shown without a link). */
export function adHref(ad: PublicAd): { href: string; external: boolean } | null {
  const l = ad.link;
  if (!l) return null;
  if (l.type === 'url' && l.url) return { href: l.url, external: l.external };
  if (!l.id) return null;
  if (l.type === 'product') return { href: productPath({ id: l.id }), external: false };
  if (l.type === 'brand') return { href: brandPath({ id: l.id }), external: false };
  if (l.type === 'creator') return { href: creatorPath({ id: l.id }), external: false };
  if (l.type === 'guide') return { href: guidePath({ id: l.id }), external: false };
  if (l.type === 'deal') return { href: '/deals', external: false };
  return null;
}

/** The paid-content label is always just "Sponsored" (the advertiser's own design names them). */
export const sponsoredLabel = (_ad?: PublicAd) => 'Sponsored';
