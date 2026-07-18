const MEMORY_KEY = 'choosify_emi_memory_v1';

export interface EmiShoppingMemory {
  viewedProductIds: string[];
  comparedProductIds: string[];
  savedContentIds: string[];
  recentQueries: string[];
  updatedAt: string;
}

const EMPTY: EmiShoppingMemory = {
  viewedProductIds: [],
  comparedProductIds: [],
  savedContentIds: [],
  recentQueries: [],
  updatedAt: new Date().toISOString(),
};

function load(): EmiShoppingMemory {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
}

function save(memory: EmiShoppingMemory) {
  localStorage.setItem(MEMORY_KEY, JSON.stringify({ ...memory, updatedAt: new Date().toISOString() }));
}

function pushUnique(list: string[], id: string, max = 20): string[] {
  return [id, ...list.filter((x) => x !== id)].slice(0, max);
}

export const emiShoppingMemory = {
  get(): EmiShoppingMemory {
    return load();
  },
  recordProductView(productId: string) {
    const m = load();
    m.viewedProductIds = pushUnique(m.viewedProductIds, productId);
    save(m);
  },
  recordCompare(productIds: string[]) {
    const m = load();
    m.comparedProductIds = pushUnique(m.comparedProductIds, productIds.join(','), 10);
    save(m);
  },
  recordQuery(query: string) {
    const m = load();
    m.recentQueries = pushUnique(m.recentQueries, query.trim().toLowerCase(), 15);
    save(m);
  },
  recordContentView(contentId: string) {
    const m = load();
    m.savedContentIds = pushUnique(m.savedContentIds, contentId);
    save(m);
  },
};
