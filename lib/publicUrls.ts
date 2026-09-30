/**
 * Central public URL builders + route resolvers for Choosify storefront pages.
 *
 * Shared by the SPA (src/) and the crawler share renderer (server/shareHtml.ts),
 * so a canonical URL is built — and a route parameter is interpreted — in
 * exactly one place.
 *
 * Canonical public URLs:
 *   Product → /products/{product slug}
 *   Brand   → /brands/{brand slug}      (the Brand is the seller's public storefront)
 *   Creator → /creators/{creator slug}
 *   Guide   → /spotlight/{guide slug}   (unchanged)
 *
 * Internal ids are never changed and never parsed as numbers here: identifiers
 * are strings end to end. A future public-handle phase only has to change the
 * key chosen by brandPath()/creatorPath().
 *
 * Legacy links: older builds linked with a numeric id derived by stripping every
 * non-digit from the catalog id (falling back to the list position). Those ids
 * collide (e.g. two products shared "3") and lose precision for long ids, so they
 * are accepted ONLY as a legacy lookup that must match exactly one entity; an
 * ambiguous legacy id is reported as such and must never be resolved by guessing.
 */

type IdLike = string | number | null | undefined;

export type UrlProductLike = { slug?: string | null; catalogId?: string | null; id?: IdLike };
export type UrlBrandLike = { slug?: string | null; catalogId?: string | null; id?: IdLike };
export type UrlCreatorLike = { slug?: string | null; id?: IdLike };
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

function build(prefix: string, key: string): string {
  return key ? `${prefix}/${segment(key)}` : prefix;
}

export function productPath(product: UrlProductLike | null | undefined): string {
  return build('/products', product ? publicKey(product) : '');
}

export function brandPath(brand: UrlBrandLike | null | undefined, subPath = ''): string {
  const base = build('/brands', brand ? publicKey(brand) : '');
  return base === '/brands' ? base : `${base}${subPath}`;
}

export function creatorPath(creator: UrlCreatorLike | null | undefined): string {
  return build('/creators', creator ? publicKey(creator) : '');
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
 * Order: slug → stable id → legacy numeric id → legacy aliases. Each step must
 * match exactly one entity; a multi-match stops resolution as ambiguous.
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

export function resolveCatalogBrandParam<T extends { id: string; slug?: string | null; name?: string | null }>(
  param: string,
  brands: readonly T[],
) {
  return resolveRouteParam(param, brands, {
    pathOf: (b) => brandPath({ slug: b.slug, catalogId: b.id }),
    slugOf: (b) => b.slug,
    idsOf: (b) => [b.id],
    legacyKeyOf: (b, i) => legacyNumericKey(legacyNumericId(b.id, i + 1)),
    aliasesOf: (b) => {
      const name = String(b.name || '').toLowerCase();
      return name ? [name.replace(/\s+/g, '-'), name] : [];
    },
  });
}

export function resolveCatalogCreatorParam<T extends { id: string; slug?: string | null }>(param: string, creators: readonly T[]) {
  return resolveRouteParam(param, creators, {
    pathOf: (c) => creatorPath({ slug: c.slug, id: c.id }),
    slugOf: (c) => c.slug,
    idsOf: (c) => [c.id],
  });
}
