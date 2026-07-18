import type { CommerceProduct, Brand } from '../types/schemas';
import type { CatalogDeal } from '../types/catalog';

export type EmiCatalogPick =
  | {
      type: 'product';
      id: string | number;
      title: string;
      brand?: string;
      price?: number;
      url: string;
    }
  | {
      type: 'brand';
      id: string | number;
      name: string;
      url: string;
    }
  | {
      type: 'deal';
      id: string | number;
      title: string;
      brand?: string;
      url: string;
    };

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s৳]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function scoreText(text: string, terms: string[]): number {
  const hay = text.toLowerCase();
  return terms.reduce((acc, term) => acc + (hay.includes(term) ? 1 : 0), 0);
}

/** Client-side catalog search to enrich requests and show instant pick cards. */
export function searchEmiCatalog(
  query: string,
  options: {
    products: CommerceProduct[];
    brands: Brand[];
    deals: CatalogDeal[];
    limit?: number;
  },
): EmiCatalogPick[] {
  const terms = tokenize(query);
  if (!terms.length) return [];

  const limit = options.limit ?? 8;

  const products = options.products
    .map((p) => ({
      type: 'product' as const,
      id: p.id,
      title: p.title,
      brand: typeof p.brand === 'string' ? p.brand : undefined,
      price: p.price,
      url: `/products/${encodeURIComponent(String(p.id))}`,
      _score: scoreText(`${p.title} ${p.brand} ${p.category}`, terms),
    }))
    .filter((p) => p._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);

  const brands = options.brands
    .map((b) => ({
      type: 'brand' as const,
      id: b.id,
      name: b.name,
      url: `/brands/${encodeURIComponent(String(b.slug || b.id))}`,
      _score: scoreText(`${b.name} ${b.category}`, terms),
    }))
    .filter((b) => b._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 4);

  const deals = options.deals
    .map((d) => ({
      type: 'deal' as const,
      id: d.id,
      title: d.name || 'Deal',
      brand: d.seller,
      url: '/deals',
      _score: scoreText(`${d.name} ${d.seller} ${d.category}`, terms),
    }))
    .filter((d) => d._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 3);

  return [...products, ...brands, ...deals]
    .sort((a, b) => (b as { _score: number })._score - (a as { _score: number })._score)
    .slice(0, limit)
    .map(({ _score, ...rest }) => rest as EmiCatalogPick);
}
