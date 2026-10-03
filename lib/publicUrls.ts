/**
 * Central public URL builders + route resolvers for Choosify storefront pages.
 *
 * Shared by the SPA (src/) and the crawler share renderer (server/shareHtml.ts),
 * so a canonical URL is built — and a route parameter is interpreted — in
 * exactly one place.
 *
 * Canonical public URLs:
 *   Product → /products/{product slug}
 *   Brand   → /brands/{public handle | brand slug}      (the Brand is the seller's public storefront)
 *   Creator → /creators/{public handle | creator slug}
 *   Guide   → /spotlight/{guide slug}   (unchanged)
 *
 * Internal ids are never changed and never parsed as numbers here: identifiers
 * are strings end to end. Brands and Creators prefer their active public handle
 * (lib/publicHandles.ts, Public Identity Phase C) when the record carries one,
 * then the slug, then the catalog id — so a record without a handle keeps exactly
 * the Phase A URL. Products and Guides never have handles.
 *
 * Legacy links: older builds linked with a numeric id derived by stripping every
 * non-digit from the catalog id (falling back to the list position). Those ids
 * collide (e.g. two products shared "3") and lose precision for long ids, so they
 * are accepted ONLY as a legacy lookup that must match exactly one entity; an
 * ambiguous legacy id is reported as such and must never be resolved by guessing.
 */

import { HANDLE_MAX_LENGTH, HANDLE_MIN_LENGTH, HANDLE_PATTERN, validateHandle } from './publicHandles';

type IdLike = string | number | null | undefined;

export type UrlProductLike = { slug?: string | null; catalogId?: string | null; id?: IdLike };
export type UrlBrandLike = { publicHandle?: string | null; slug?: string | null; catalogId?: string | null; id?: IdLike };
export type UrlCreatorLike = { publicHandle?: string | null; slug?: string | null; id?: IdLike };
export type UrlGuideLike = { slug?: string | null; id?: IdLike };

/** A slug usable as a URL path segment: non-empty and free of path/URL delimiters. */
export function isUsableSlug(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && !/[/?#\\\s]/.test(value.trim());
}

function segment(value: string): string {
  return encodeURIComponent(value.trim());
}

function stringId(value: IdLike): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

/** Public URL key: the slug when usable, else the stable catalog id, else the given id. */
function publicKey(e: { slug?: string | null; catalogId?: string | null; id?: IdLike }): string {
  if (isUsableSlug(e.slug)) return e.slug.trim();
  const catalogId = stringId(e.catalogId);
  if (catalogId) return catalogId;
  return stringId(e.id);
}

/**
 * An active public handle in its stored form (lowercase ASCII, 3–30 characters,
 * the public_handles CHECK pattern). Anything else is ignored, never repaired, so
 * a malformed value falls back to the slug URL instead of producing a bad link.
 */
export function isUsableHandle(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length >= HANDLE_MIN_LENGTH &&
    value.length <= HANDLE_MAX_LENGTH &&
    HANDLE_PATTERN.test(value)
  );
}

/** Brand / Creator URL key: the active public handle when present, else the Phase A key. */
function handleOrPublicKey(e: { publicHandle?: string | null; slug?: string | null; catalogId?: string | null; id?: IdLike }): string {
  if (isUsableHandle(e.publicHandle)) return e.publicHandle;
  return publicKey(e);
}

function build(prefix: string, key: string): string {
  return key ? `${prefix}/${segment(key)}` : prefix;
}

export function productPath(product: UrlProductLike | null | undefined): string {
  return build('/products', product ? publicKey(product) : '');
}

export function brandPath(brand: UrlBrandLike | null | undefined, subPath = ''): string {
  const base = build('/brands', brand ? handleOrPublicKey(brand) : '');
  return base === '/brands' ? base : `${base}${subPath}`;
}

export function creatorPath(creator: UrlCreatorLike | null | undefined): string {
  return build('/creators', creator ? handleOrPublicKey(creator) : '');
}

/**
 * The visible "@username" for a Brand / Creator: the registered public handle only,
 * so it always matches the profile URL. null when there is none — callers show no
 * username then; the free-text display `handle` is never presented as one.
 */
export function publicUsernameLabel(entity: { publicHandle?: string | null } | null | undefined): string | null {
  return entity && isUsableHandle(entity.publicHandle) ? `@${entity.publicHandle}` : null;
}

export function guidePath(guide: UrlGuideLike | null | undefined): string {
  return build('/spotlight', guide ? publicKey(guide) : '');
}

/**
 * The numeric id the storefront historically derived from a catalog id: all
 * digits concatenated, falling back to the 1-based list position when there are
 * none. Kept ONLY so existing numeric links can still be recognised (and so the
 * storefront's internal numeric keys stay identical) — never use it to build a
 * URL. The result can collide and can exceed Number.MAX_SAFE_INTEGER.
 */
export function legacyNumericId(catalogId: string, fallbackPosition: number): number {
  const numeric = Number(String(catalogId).replace(/[^0-9]/g, ''));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallbackPosition;
}

/** How a legacy numeric id was rendered into a URL: String(number), exponent form included. */
export function legacyNumericKey(value: IdLike): string {
  if (typeof value === 'number') return String(value);
  return stringId(value);
}

const LEGACY_NUMERIC_PARAM = /^\d+(\.\d+)?(e[+-]?\d+)?$/i;

export type RouteResolution<T> =
  /** The param is the entity's canonical key — render it. */
  | { status: 'canonical'; entity: T }
  /** The param identifies exactly one entity by a non-canonical key — redirect to `to`. */
  | { status: 'redirect'; entity: T; to: string }
  /** The param matches more than one entity — never guess; treat as not found. */
  | { status: 'ambiguous'; matchedBy: string; count: number }
  | { status: 'not_found' };

export type ResolveOptions<T> = {
  /** Canonical path builder for the entity type (productPath / brandPath / creatorPath). */
  pathOf: (entity: T) => string;
  slugOf: (entity: T) => string | null | undefined;
  /** The entity's ACTIVE public handle (Brands / Creators only). Matched before the slug. */
  handleOf?: (entity: T) => string | null | undefined;
  /** Stable string ids the entity may be linked by (catalog id, raw id). */
  idsOf: (entity: T) => Array<IdLike>;
  /** The legacy numeric URL key of the entity, if this entity type had one. */
  legacyKeyOf?: (entity: T, index: number) => string | null | undefined;
  /** Extra legacy aliases (e.g. brand name forms), matched case-insensitively. */
  aliasesOf?: (entity: T) => Array<string | null | undefined>;
};

/** The entity a resolution identified (canonical or redirect), else undefined. */
export function resolvedEntity<T>(resolution: RouteResolution<T>): T | undefined {
  return resolution.status === 'canonical' || resolution.status === 'redirect' ? resolution.entity : undefined;
}

function uniqueOrAmbiguous<T>(
  matches: T[],
  matchedBy: string,
): { entity: T } | { status: 'ambiguous'; matchedBy: string; count: number } | null {
  if (matches.length === 1) return { entity: matches[0] };
  if (matches.length > 1) return { status: 'ambiguous', matchedBy, count: matches.length };
  return null;
}

/**
 * Interpret a public route parameter against the current entity list.
 * Order: active public handle (when handleOf is given) → slug → stable id →
 * legacy numeric id → legacy aliases. Each step must match exactly one entity; a
 * multi-match stops resolution as ambiguous. Retired handles are not known here.
 */
export function resolveRouteParam<T>(
  rawParam: string | null | undefined,
  entities: readonly T[],
  options: ResolveOptions<T>,
): RouteResolution<T> {
  let param = String(rawParam ?? '').trim();
  try {
    param = decodeURIComponent(param);
  } catch {
    // keep the raw value
  }
  if (!param) return { status: 'not_found' };
  const lower = param.toLowerCase();
  const done = (entity: T): RouteResolution<T> => {
    const to = options.pathOf(entity);
    const canonicalKey = to.split('/').pop() || '';
    let canonicalDecoded = canonicalKey;
    try {
      canonicalDecoded = decodeURIComponent(canonicalKey);
    } catch {
      // keep encoded
    }
    return canonicalDecoded === param ? { status: 'canonical', entity } : { status: 'redirect', entity, to };
  };

  if (options.handleOf) {
    const byHandle = uniqueOrAmbiguous(
      entities.filter((e) => {
        const handle = options.handleOf!(e);
        return isUsableHandle(handle) && handle === lower;
      }),
      'handle',
    );
    if (byHandle) return 'entity' in byHandle ? done(byHandle.entity) : byHandle;
  }

  const bySlug = uniqueOrAmbiguous(
    entities.filter((e) => {
      const slug = options.slugOf(e);
      return isUsableSlug(slug) && slug.trim().toLowerCase() === lower;
    }),
    'slug',
  );
  if (bySlug) return 'entity' in bySlug ? done(bySlug.entity) : bySlug;

  const byId = uniqueOrAmbiguous(
    entities.filter((e) => options.idsOf(e).some((id) => stringId(id) !== '' && stringId(id) === param)),
    'id',
  );
  if (byId) return 'entity' in byId ? done(byId.entity) : byId;

  if (options.legacyKeyOf && LEGACY_NUMERIC_PARAM.test(param)) {
    const byLegacy = uniqueOrAmbiguous(
      entities.filter((e, i) => {
        const key = options.legacyKeyOf!(e, i);
        return key !== null && key !== undefined && key !== '' && key === param;
      }),
      'legacy_numeric_id',
    );
    if (byLegacy) return 'entity' in byLegacy ? done(byLegacy.entity) : byLegacy;
  }

  if (options.aliasesOf) {
    const byAlias = uniqueOrAmbiguous(
      entities.filter((e) =>
        options.aliasesOf!(e).some((alias) => typeof alias === 'string' && alias.trim() !== '' && alias.trim().toLowerCase() === lower),
      ),
      'alias',
    );
    if (byAlias) return 'entity' in byAlias ? done(byAlias.entity) : byAlias;
  }

  return { status: 'not_found' };
}

type StorefrontProduct = UrlProductLike & { id?: IdLike };
type StorefrontBrand = UrlBrandLike & { id?: IdLike; name?: string | null };
type StorefrontCreator = UrlCreatorLike & { id?: IdLike };

/** Storefront product list (mapped products carry the legacy numeric `id`). */
export function resolveProductParam<T extends StorefrontProduct>(param: string | null | undefined, products: readonly T[]) {
  return resolveRouteParam(param, products, {
    pathOf: (p) => productPath(p),
    slugOf: (p) => p.slug,
    idsOf: (p) => [p.catalogId, typeof p.id === 'string' ? p.id : null],
    legacyKeyOf: (p) => (typeof p.id === 'number' ? legacyNumericKey(p.id) : null),
  });
}

/** Storefront brand list; also honours the historical name-based brand links. */
export function resolveBrandParam<T extends StorefrontBrand>(param: string | null | undefined, brands: readonly T[]) {
  return resolveRouteParam(param, brands, {
    pathOf: (b) => brandPath(b),
    handleOf: (b) => b.publicHandle,
    slugOf: (b) => b.slug,
    idsOf: (b) => [b.catalogId, typeof b.id === 'string' ? b.id : null],
    legacyKeyOf: (b) => (typeof b.id === 'number' ? legacyNumericKey(b.id) : null),
    aliasesOf: (b) => {
      const name = String(b.name || '').toLowerCase();
      return name ? [name.replace(/\s+/g, '-'), name] : [];
    },
  });
}

/** Storefront creator list (creator ids are already strings). */
export function resolveCreatorParam<T extends StorefrontCreator>(param: string | null | undefined, creators: readonly T[]) {
  return resolveRouteParam(param, creators, {
    pathOf: (c) => creatorPath(c),
    handleOf: (c) => c.publicHandle,
    slugOf: (c) => c.slug,
    idsOf: (c) => [c.id],
  });
}

/**
 * Raw catalog API lists (server side): the legacy numeric key is recomputed the
 * way the storefront mapped it — from the catalog id, falling back to the
 * 1-based position in the API list.
 */
export function resolveCatalogProductParam<T extends { id: string; slug?: string | null }>(param: string, products: readonly T[]) {
  return resolveRouteParam(param, products, {
    pathOf: (p) => productPath({ slug: p.slug, catalogId: p.id }),
    slugOf: (p) => p.slug,
    idsOf: (p) => [p.id],
    legacyKeyOf: (p, i) => legacyNumericKey(legacyNumericId(p.id, i + 1)),
  });
}

export function resolveCatalogBrandParam<
  T extends { id: string; slug?: string | null; name?: string | null; publicHandle?: string | null },
>(param: string, brands: readonly T[]) {
  return resolveRouteParam(param, brands, {
    pathOf: (b) => brandPath({ publicHandle: b.publicHandle, slug: b.slug, catalogId: b.id }),
    handleOf: (b) => b.publicHandle,
    slugOf: (b) => b.slug,
    idsOf: (b) => [b.id],
    legacyKeyOf: (b, i) => legacyNumericKey(legacyNumericId(b.id, i + 1)),
    aliasesOf: (b) => {
      const name = String(b.name || '').toLowerCase();
      return name ? [name.replace(/\s+/g, '-'), name] : [];
    },
  });
}

// ── Retired-handle fallback (Public Identity C4) ─────────────────────────────
//
// Catalog lists carry only ACTIVE handles, so a link using a handle an entity no
// longer holds (it was renamed) matches nothing locally. Such a link is looked up
// once with the public Admin resolver (GET /catalog/handles/:handle/resolve), and
// the visitor is sent to the entity's CURRENT canonical URL. The resolver applies
// every lifecycle and visibility rule server-side; these helpers only decide when
// to ask and which already-loaded public entity an answer points at.

export type HandleEntityKind = 'brand' | 'creator';

/** The public resolver's answer (Admin publicHandleStore.resolveHandle). */
export type PublicHandleResolution = {
  entityType: HandleEntityKind;
  entityId: string;
  handle: string;
  status: 'active' | 'retired';
  currentHandle: string | null;
};

/**
 * The handle to look up for a route parameter that matched nothing locally, or
 * null when it can never be a handle (malformed, reserved name or reserved
 * prefix — the shared validator decides), so no request is made.
 */
export function handleLookupKey(rawParam: string | null | undefined): string | null {
  let param = String(rawParam ?? '').trim();
  try {
    param = decodeURIComponent(param);
  } catch {
    // keep the raw value
  }
  const result = validateHandle(param);
  return 'reason' in result ? null : result.handle;
}

/** A well-formed resolver answer for the expected entity type, else null. */
export function asPublicHandleResolution(value: unknown, expectedType: HandleEntityKind): PublicHandleResolution | null {
  if (!value || typeof value !== 'object') return null;
  const v = value as Record<string, unknown>;
  if (v.entityType !== expectedType) return null;
  if (v.status !== 'active' && v.status !== 'retired') return null;
  if (typeof v.entityId !== 'string' || !v.entityId) return null;
  if (typeof v.handle !== 'string') return null;
  if (v.currentHandle !== null && typeof v.currentHandle !== 'string') return null;
  return {
    entityType: expectedType,
    entityId: v.entityId,
    handle: v.handle,
    status: v.status,
    currentHandle: (v.currentHandle as string | null) ?? null,
  };
}

/**
 * The already-loaded PUBLIC entity a resolver answer points at, or undefined.
 * The resolver's id is never followed on its own: only an entity of the expected
 * type that is present in the caller's public list qualifies, so a resolution can
 * never link to (or reveal) anything the visitor could not already see. The
 * redirect target is that entity's own canonical path, i.e. its current handle,
 * else its slug.
 */
export function entityForHandleResolution<T>(
  resolution: PublicHandleResolution | null | undefined,
  expectedType: HandleEntityKind,
  entities: readonly T[],
  idsOf: (entity: T) => Array<IdLike>,
): T | undefined {
  if (!resolution || resolution.entityType !== expectedType) return undefined;
  const matches = entities.filter((e) => idsOf(e).some((id) => stringId(id) !== '' && stringId(id) === resolution.entityId));
  return matches.length === 1 ? matches[0] : undefined;
}

/** Storefront Brand list (GlobalStateContext): catalog id carried as catalogId. */
export function brandForHandleResolution<T extends StorefrontBrand>(resolution: PublicHandleResolution | null | undefined, brands: readonly T[]) {
  return entityForHandleResolution(resolution, 'brand', brands, (b) => [b.catalogId, typeof b.id === 'string' ? b.id : null]);
}

/** Storefront Creator list (creator ids are catalog ids). */
export function creatorForHandleResolution<T extends StorefrontCreator>(resolution: PublicHandleResolution | null | undefined, creators: readonly T[]) {
  return entityForHandleResolution(resolution, 'creator', creators, (c) => [c.id]);
}

/** Raw catalog API lists (share renderer). */
export function catalogEntityForHandleResolution<T extends { id: string }>(
  resolution: PublicHandleResolution | null | undefined,
  expectedType: HandleEntityKind,
  items: readonly T[],
) {
  return entityForHandleResolution(resolution, expectedType, items, (e) => [e.id]);
}

export function resolveCatalogCreatorParam<T extends { id: string; slug?: string | null; publicHandle?: string | null }>(
  param: string,
  creators: readonly T[],
) {
  return resolveRouteParam(param, creators, {
    pathOf: (c) => creatorPath({ publicHandle: c.publicHandle, slug: c.slug, id: c.id }),
    handleOf: (c) => c.publicHandle,
    slugOf: (c) => c.slug,
    idsOf: (c) => [c.id],
  });
}
