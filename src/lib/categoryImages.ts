const DEFAULT_CATEGORY_IMAGE =
  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80';

/** Keyword → hero image for category browse tiles */
const CATEGORY_IMAGE_BY_KEYWORD: Array<{ match: RegExp; url: string }> = [
  { match: /fashion|lifestyle|apparel|clothing|wear/i, url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
  { match: /jewelry|jewellery|accessories|gem|watch/i, url: 'https://images.unsplash.com/photo-1515562141203-758a634ab2cc?w=800&q=80' },
  { match: /eyewear|fragrance|perfume|glasses/i, url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80' },
  { match: /beauty|personal care|makeup|skincare|hair/i, url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80' },
  { match: /tech|electronic|computer|laptop|audio|camera|cpu/i, url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80' },
  { match: /mobile|wearable|smartphone|tablet|phone/i, url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80' },
  { match: /tv|appliance|kitchen|refrigerator/i, url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80' },
  { match: /gaming|entertainment|gamepad|console/i, url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80' },
  { match: /home|living|furniture|decor/i, url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80' },
  { match: /vehicle|automotive|car|motor/i, url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80' },
  { match: /family|kids|baby|child/i, url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80' },
  { match: /food|essential|grocery|grocery|basket/i, url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' },
  { match: /travel|hospitality|hotel|flight|plane/i, url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80' },
  { match: /hobb|creativ|craft|art|palette/i, url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff444?w=800&q=80' },
  { match: /health|wellness|fitness|activity|sport/i, url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
  { match: /education|learning|book|school/i, url: 'https://images.unsplash.com/photo-1524995995642-b1b7853d6581?w=800&q=80' },
];

export function getCategoryImage(categoryName: string, fallback?: string): string {
  if (fallback?.trim()) return fallback;
  const name = categoryName.trim();
  if (!name) return DEFAULT_CATEGORY_IMAGE;

  for (const entry of CATEGORY_IMAGE_BY_KEYWORD) {
    if (entry.match.test(name)) return entry.url;
  }

  return DEFAULT_CATEGORY_IMAGE;
}
