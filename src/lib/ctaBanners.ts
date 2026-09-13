import type { CtaAudienceRule, CtaBannerItem, CtaDestinationType, CtaPageKey, CtaPosition } from '../types/catalog';
import { resolvePartnerSignupUrl } from './partnerSignupOrigin';
import { CTA_PLACEMENT_REGISTRY, defaultPlacementFor, isValidPlacement } from './ctaPlacementRegistry';

/**
 * Editorial CTA/banner placements (Admin-manageable, Storefront Curation →
 * CTA & Banners). Distinct from paid/sponsored placements (CatalogPlacement /
 * PlacementSlot) — this module never touches that model or its business
 * rules. (page, section, position) determines exactly where a <CtaAnchor/>
 * picks an item up (see ctaPlacementRegistry.ts, the shared source of
 * truth). Content below is the seed/fallback so existing copy never
 * disappears before Admin saves a config (see normalizeCtaBanners).
 */

export { CTA_PLACEMENT_REGISTRY, getPageSections, getSectionPositions, sectionLabel } from './ctaPlacementRegistry';

/** Pages with a real, wired placement registry — Admin can only create a CTA for one of these. */
export const CTA_PAGE_OPTIONS: Array<{ value: CtaPageKey; label: string; route: string }> = (
  Object.entries(CTA_PLACEMENT_REGISTRY) as Array<[CtaPageKey, (typeof CTA_PLACEMENT_REGISTRY)[CtaPageKey]]>
).map(([value, def]) => ({ value, label: def.label, route: def.route }));

/** Internal routes an Admin may pick without typing a path by hand — mirrors PRIMARY_NAV_ITEMS + other known-real static pages. */
export const CTA_INTERNAL_ROUTE_PRESETS: Array<{ value: string; label: string }> = [
  { value: '/', label: 'Home' },
  { value: '/categories', label: 'Categories' },
  { value: '/products', label: 'Products & Services' },
  { value: '/brands', label: 'Brands' },
  { value: '/spotlight', label: 'Recommendations' },
  { value: '/deals', label: 'Deals' },
  { value: '/creators', label: 'Creators' },
  { value: '/compare', label: 'Compare' },
  { value: '/search', label: 'Search' },
  { value: '/suggest-brand', label: 'Suggest a Brand' },
  { value: '/advertise', label: 'Advertise' },
  { value: '/partnership', label: 'Partnership' },
  { value: '/post-offer', label: 'Post an Offer (seller)' },
  { value: '/login', label: 'Login / Register' },
  { value: '/contact', label: 'Contact' },
  { value: '/about', label: 'About' },
];

const CTA_PAGE_KEYS = new Set(Object.keys(CTA_PLACEMENT_REGISTRY) as CtaPageKey[]);

function defaultCtaBanners(): CtaBannerItem[] {
  return [
    {
      id: 'creators.join_cta',
      page: 'creators',
      section: 'creators-grid',
      position: 'after',
      title: 'Are you a creator?',
      subtitle: 'Join Choosify and grow your audience by sharing honest reviews.',
      buttonLabel: 'JOIN AS CREATOR',
      destinationType: 'creator_signup',
      destinationValue: '',
      openInNewTab: true,
      enabled: true,
      order: 0,
      style: 'navy',
      audienceRule: 'hide_if_has_creator_account',
    },
    {
      id: 'deals.subscribe_cta',
      page: 'deals',
      section: 'deals-subscribe-banner',
      position: 'after',
      title: '🎁 NEVER MISS A DEAL!',
      subtitle: 'Subscribe and get top deals straight to your inbox.',
      buttonLabel: 'SUBSCRIBE',
      destinationType: 'none',
      destinationValue: '',
      openInNewTab: false,
      enabled: true,
      order: 0,
      style: 'navy',
      audienceRule: 'none',
    },
  ];
}

const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const bool = (v: unknown, fallback = true): boolean => (typeof v === 'boolean' ? v : fallback);
const num = (v: unknown, fallback = 0): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
};
const DEST_TYPES = new Set<CtaDestinationType>(['internal', 'creator_signup', 'seller_signup', 'external', 'none']);
const destType = (v: unknown, fallback: CtaDestinationType): CtaDestinationType =>
  DEST_TYPES.has(v as CtaDestinationType) ? (v as CtaDestinationType) : fallback;
const styleVal = (v: unknown, fallback: CtaBannerItem['style']): CtaBannerItem['style'] =>
  v === 'navy' || v === 'purple' || v === 'orange' || v === 'light' ? v : fallback;
const pageVal = (v: unknown, fallback: CtaPageKey): CtaPageKey =>
  typeof v === 'string' && CTA_PAGE_KEYS.has(v as CtaPageKey) ? (v as CtaPageKey) : fallback;
const AUDIENCE_RULES = new Set<CtaAudienceRule>([
  'none',
  'guests_only',
  'logged_in_only',
  'hide_if_has_creator_account',
  'hide_if_has_seller_account',
]);
const audienceVal = (v: unknown, fallback: CtaAudienceRule = 'none'): CtaAudienceRule =>
  AUDIENCE_RULES.has(v as CtaAudienceRule) ? (v as CtaAudienceRule) : fallback;

/** Resolves page/section/position, falling back to that page's registry default if the stored combination is no longer valid (e.g. legacy data, or a section that was removed from the registry). */
function resolvePlacement(
  rawPage: unknown,
  rawSection: unknown,
  rawPosition: unknown,
  fallback: { page: CtaPageKey; section: string; position: CtaPosition },
): { page: CtaPageKey; section: string; position: CtaPosition } {
  const page = pageVal(rawPage, fallback.page);
  const section = str(rawSection, fallback.section);
  const position: CtaPosition = rawPosition === 'before' || rawPosition === 'after' ? rawPosition : fallback.position;
  if (section && isValidPlacement(page, section, position)) return { page, section, position };
  // Invalid/stale combination -- fall back to a safe, real default for this page rather than crash or render nowhere silently.
  const def = defaultPlacementFor(page);
  return { page, section: def.section, position: def.position };
}

/**
 * Migrates the pre-placement-registry shape (destinationType: "external"
 * with destinationValue "creator_signup"/"seller_signup" as a magic sentinel,
 * and no section/position/openInNewTab fields at all) to the current schema.
 * Without this, old persisted records would silently resolve to a dead
 * destination the first time they're read under the new normalizer.
 */
function migrateLegacyRow(row: Record<string, unknown>): Record<string, unknown> {
  if (row.destinationType === 'external' && (row.destinationValue === 'creator_signup' || row.destinationValue === 'seller_signup')) {
    return { ...row, destinationType: row.destinationValue, destinationValue: '' };
  }
  return row;
}

/** Deep-merge CMS payload with seed defaults (never blanks a placement that exists in code but not yet in storage). */
export function normalizeCtaBanners(payload: unknown, existing?: CtaBannerItem[] | null): CtaBannerItem[] {
  const defaults = defaultCtaBanners();
  const base = existing && existing.length ? existing : defaults;
  const raw = Array.isArray(payload) ? payload : null;

  const byId = new Map<string, Record<string, unknown>>();
  (raw ?? base).forEach((item) => {
    const row = migrateLegacyRow((item ?? {}) as Record<string, unknown>);
    if (typeof row.id === 'string' && row.id) byId.set(row.id, row);
  });

  const merged = defaults.map((fb, idx) => {
    const row = byId.get(fb.id) ?? {};
    byId.delete(fb.id);
    const placement = resolvePlacement(row.page, row.section, row.position, fb);
    return {
      id: fb.id,
      ...placement,
      title: str(row.title, fb.title),
      subtitle: str(row.subtitle, fb.subtitle),
      buttonLabel: str(row.buttonLabel, fb.buttonLabel),
      destinationType: destType(row.destinationType, fb.destinationType),
      destinationValue: str(row.destinationValue, fb.destinationValue),
      openInNewTab: bool(row.openInNewTab, fb.openInNewTab),
      enabled: bool(row.enabled, fb.enabled),
      order: num(row.order, fb.order ?? idx),
      style: styleVal(row.style, fb.style),
      icon: str(row.icon, fb.icon ?? '') || undefined,
      startDate: typeof row.startDate === 'string' ? row.startDate : fb.startDate,
      endDate: typeof row.endDate === 'string' ? row.endDate : fb.endDate,
      audienceRule: audienceVal(row.audienceRule, fb.audienceRule ?? 'none'),
    };
  });

  // Any additional Admin-created placement id beyond the known seed set.
  const extras = Array.from(byId.values()).map((row, idx) => {
    const page = pageVal(row.page, 'home');
    const placement = resolvePlacement(row.page, row.section, row.position, { page, ...defaultPlacementFor(page) });
    return {
      id: str(row.id, `cta-${defaults.length + idx + 1}`),
      ...placement,
      title: str(row.title),
      subtitle: str(row.subtitle),
      buttonLabel: str(row.buttonLabel),
      destinationType: destType(row.destinationType, 'none'),
      destinationValue: str(row.destinationValue),
      openInNewTab: bool(row.openInNewTab, true),
      enabled: bool(row.enabled, true),
      order: num(row.order, defaults.length + idx),
      style: styleVal(row.style, 'navy'),
      icon: str(row.icon) || undefined,
      startDate: typeof row.startDate === 'string' ? row.startDate : undefined,
      endDate: typeof row.endDate === 'string' ? row.endDate : undefined,
      audienceRule: audienceVal(row.audienceRule, 'none'),
    };
  });

  return [...merged, ...extras];
}

export function resolveCtaBanners(cms?: CtaBannerItem[] | null): CtaBannerItem[] {
  return normalizeCtaBanners(cms ?? null, null);
}

export function getCtaBanner(cms: CtaBannerItem[] | null | undefined, id: string): CtaBannerItem | undefined {
  return resolveCtaBanners(cms).find((item) => item.id === id);
}

/**
 * Ids with their own dedicated render component elsewhere (e.g. a CTA that's
 * embedded inside a local form with its own state) -- excluded from the
 * generic <CtaAnchor/> so they're never rendered twice on the same page.
 */
const RESERVED_DEDICATED_IDS = new Set(['deals.subscribe_cta']);

/** Every enabled, in-schedule, generically-rendered CTA at this exact (page, section, position) anchor, in display order. Ordering is scoped to this anchor only, never global. */
export function getCtaBannersForAnchor(
  cms: CtaBannerItem[] | null | undefined,
  page: CtaPageKey,
  section: string,
  position: CtaPosition,
): CtaBannerItem[] {
  return resolveCtaBanners(cms)
    .filter((item) => item.page === page && item.section === section && item.position === position)
    .filter((item) => !RESERVED_DEDICATED_IDS.has(item.id))
    .filter((item) => isCtaBannerVisible(item))
    .sort((a, b) => a.order - b.order);
}

function withinSchedule(item: CtaBannerItem, now = new Date()): boolean {
  if (item.startDate && now < new Date(item.startDate)) return false;
  if (item.endDate && now > new Date(item.endDate)) return false;
  return true;
}

/** Whether this CTA should render at all right now (enabled + in schedule window). Does NOT check audienceRule -- see CtaAnchor's audience filtering. */
export function isCtaBannerVisible(item: CtaBannerItem | undefined): item is CtaBannerItem {
  return Boolean(item) && item!.enabled && withinSchedule(item!);
}

/** Resolves a CtaBannerItem's destination into a real, navigable target. */
export function resolveCtaDestination(
  item: CtaBannerItem,
): { href: string; isExternal: boolean } | null {
  if (item.destinationType === 'none') return null;
  if (item.destinationType === 'creator_signup') {
    return { href: resolvePartnerSignupUrl('creator'), isExternal: true };
  }
  if (item.destinationType === 'seller_signup') {
    return { href: resolvePartnerSignupUrl('seller'), isExternal: true };
  }
  if (item.destinationType === 'external') {
    if (/^https:\/\//i.test(item.destinationValue)) {
      return { href: item.destinationValue, isExternal: true };
    }
    return null;
  }
  // internal
  if (item.destinationValue && item.destinationValue.startsWith('/')) {
    return { href: item.destinationValue, isExternal: false };
  }
  return null;
}
