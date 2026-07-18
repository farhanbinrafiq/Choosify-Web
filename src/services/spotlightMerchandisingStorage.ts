import type { SpotlightMerchandisingCollection } from '../types/spotlight/merchandising/collections';

const KEY = 'choosify_spotlight_merchandising_collections';

function readAll(): Record<string, SpotlightMerchandisingCollection[]> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, SpotlightMerchandisingCollection[]>) : {};
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, SpotlightMerchandisingCollection[]>) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function listCollections(campaignId: string): SpotlightMerchandisingCollection[] {
  return readAll()[campaignId] ?? [];
}

export function saveCollections(campaignId: string, collections: SpotlightMerchandisingCollection[]) {
  const all = readAll();
  all[campaignId] = collections;
  writeAll(all);
}

export function duplicateCollection(
  collection: SpotlightMerchandisingCollection,
  newName: string,
): SpotlightMerchandisingCollection {
  const now = new Date().toISOString();
  return {
    ...collection,
    collectionId: `col-${Date.now()}`,
    name: newName,
    createdAt: now,
    updatedAt: now,
  };
}
