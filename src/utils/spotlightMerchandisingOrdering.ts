import type { CatalogProduct } from '../types/catalog';
import type { SpotlightCampaignProductLink } from '../types/spotlight/merchandising/productLink';
import type { SpotlightProductMerchandisingRole } from '../types/spotlight/merchandising/roles';
import { SPOTLIGHT_DEFAULT_MERCHANDISING_SLOTS } from '../types/spotlight/merchandising/slots';
import type { SpotlightCampaignMerchandising } from '../types/spotlight/merchandising/model';
import { createDefaultMerchandising } from '../types/spotlight/merchandising/model';

/** Sync merchandising product links to legacy linkedProductIds / primaryProductId */
export function syncMerchandisingToLegacy(merchandising: SpotlightCampaignMerchandising): {
  linkedProductIds: string[];
  primaryProductId?: string;
} {
  const ordered = orderProductLinks(merchandising.productLinks);
  const hero = ordered.find((l) => l.role === 'hero');
  return {
    linkedProductIds: ordered.map((l) => l.productId),
    primaryProductId: hero?.productId ?? ordered[0]?.productId,
  };
}

/** Migrate legacy IDs to merchandising model */
export function migrateLegacyToMerchandising(
  linkedProductIds: string[],
  primaryProductId?: string,
  existing?: SpotlightCampaignMerchandising,
): SpotlightCampaignMerchandising {
  const base = existing ?? createDefaultMerchandising();
  if (base.productLinks.length > 0) return base;

  const links: SpotlightCampaignProductLink[] = linkedProductIds.map((productId, i) => ({
    productId,
    role: productId === primaryProductId || (i === 0 && !primaryProductId) ? 'hero' : 'featured',
    displayOrder: i,
    slotId: productId === primaryProductId ? 'slot-hero' : 'slot-featured',
  }));

  return {
    ...base,
    productLinks: links,
    slots: base.slots.length ? base.slots : [...SPOTLIGHT_DEFAULT_MERCHANDISING_SLOTS],
  };
}

/** Order: hero first → pinned → priority DESC → displayOrder */
export function orderProductLinks(links: SpotlightCampaignProductLink[]): SpotlightCampaignProductLink[] {
  return [...links].sort((a, b) => {
    if (a.role === 'hero' && b.role !== 'hero') return -1;
    if (b.role === 'hero' && a.role !== 'hero') return 1;
    if (a.pinned && !b.pinned) return -1;
    if (b.pinned && !a.pinned) return 1;
    const pa = a.priority ?? 0;
    const pb = b.priority ?? 0;
    if (pa !== pb) return pb - pa;
    return a.displayOrder - b.displayOrder;
  });
}

export function getHeroProductId(links: SpotlightCampaignProductLink[]): string | undefined {
  return links.find((l) => l.role === 'hero')?.productId;
}

export function setProductRole(
  links: SpotlightCampaignProductLink[],
  productId: string,
  role: SpotlightProductMerchandisingRole,
): SpotlightCampaignProductLink[] {
  let next = links.map((l) => (l.productId === productId ? { ...l, role } : l));
  if (role === 'hero') {
    next = next.map((l) =>
      l.productId === productId ? l : l.role === 'hero' ? { ...l, role: 'featured' as const } : l,
    );
  }
  return next;
}

export function moveProductLink(
  links: SpotlightCampaignProductLink[],
  productId: string,
  direction: 'up' | 'down',
): SpotlightCampaignProductLink[] {
  const ordered = orderProductLinks(links);
  const idx = ordered.findIndex((l) => l.productId === productId);
  if (idx < 0) return links;
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= ordered.length) return links;
  const next = [...ordered];
  const a = next[idx]!;
  const b = next[swapIdx]!;
  next[idx] = { ...b, displayOrder: a.displayOrder };
  next[swapIdx] = { ...a, displayOrder: b.displayOrder };
  return next;
}

export function hasDuplicateHero(links: SpotlightCampaignProductLink[]): boolean {
  return links.filter((l) => l.role === 'hero').length > 1;
}

export function findDuplicateProductIds(links: SpotlightCampaignProductLink[]): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const l of links) {
    if (seen.has(l.productId)) dupes.push(l.productId);
    seen.add(l.productId);
  }
  return dupes;
}

export function attachProducts(
  links: SpotlightCampaignProductLink[],
  productIds: string[],
  role: SpotlightProductMerchandisingRole = 'featured',
): SpotlightCampaignProductLink[] {
  const existing = new Set(links.map((l) => l.productId));
  const toAdd = productIds.filter((id) => !existing.has(id));
  const maxOrder = links.reduce((m, l) => Math.max(m, l.displayOrder), -1);
  const newLinks = toAdd.map((productId, i) => ({
    productId,
    role: links.length === 0 && i === 0 ? ('hero' as const) : role,
    displayOrder: maxOrder + 1 + i,
    slotId: role === 'hero' ? 'slot-hero' : 'slot-featured',
    addedAt: new Date().toISOString(),
  }));
  return [...links, ...newLinks];
}

export function detachProducts(links: SpotlightCampaignProductLink[], productIds: string[]): SpotlightCampaignProductLink[] {
  return links.filter((l) => !productIds.includes(l.productId));
}

export function getProductsBySlot(
  links: SpotlightCampaignProductLink[],
  slotId: string,
): SpotlightCampaignProductLink[] {
  return orderProductLinks(links.filter((l) => l.slotId === slotId || !l.slotId));
}

export function resolveCatalogProduct(
  productId: string,
  catalog: CatalogProduct[],
): CatalogProduct | undefined {
  return catalog.find((p) => p.id === productId);
}
