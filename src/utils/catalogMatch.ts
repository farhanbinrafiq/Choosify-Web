export const catalogIdCandidates = (catalogId?: string, numericId?: string | number): string[] => {
  const values = new Set<string>();
  if (catalogId) values.add(String(catalogId));
  if (numericId !== undefined && numericId !== null) values.add(String(numericId));
  const digits = String(catalogId || numericId || '').replace(/[^0-9]/g, '');
  if (digits) values.add(digits);
  return [...values];
};

export const matchesCatalogId = (
  itemCatalogId: string | undefined,
  itemNumericId: string | number | undefined,
  configuredIds: string[],
): boolean => {
  if (!configuredIds.length) return false;
  const itemIds = catalogIdCandidates(itemCatalogId, itemNumericId);
  return configuredIds.some((configuredId) => {
    const targets = catalogIdCandidates(configuredId);
    return targets.some((target) => itemIds.includes(target));
  });
};

export const orderByCatalogIds = <T extends { catalogId?: string; id?: string | number }>(
  items: T[],
  configuredIds: string[],
): T[] => {
  if (!configuredIds.length) return items;
  const ranked = new Map<string, number>();
  configuredIds.forEach((id, index) => {
    catalogIdCandidates(id).forEach((candidate) => {
      if (!ranked.has(candidate)) ranked.set(candidate, index);
    });
  });

  return [...items].sort((a, b) => {
    const aRank = Math.min(
      ...catalogIdCandidates(a.catalogId, a.id).map((candidate) => ranked.get(candidate) ?? Number.MAX_SAFE_INTEGER),
    );
    const bRank = Math.min(
      ...catalogIdCandidates(b.catalogId, b.id).map((candidate) => ranked.get(candidate) ?? Number.MAX_SAFE_INTEGER),
    );
    return aRank - bRank;
  });
};

export const pickByCatalogIds = <T extends { catalogId?: string; id?: string | number }>(
  items: T[],
  configuredIds: string[],
): T[] => {
  if (!configuredIds.length) return [];
  return configuredIds
    .map((configuredId) =>
      items.find((item) => matchesCatalogId(item.catalogId, item.id, [configuredId])),
    )
    .filter((item): item is T => Boolean(item));
};
