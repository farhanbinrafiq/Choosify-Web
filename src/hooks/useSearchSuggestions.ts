import { useMemo } from 'react';
import type { CustomOverview } from '../context/DashboardContext';
import { getBrandOverviews, getProductOverviews } from '../utils/overviewRegistry';
import {
  COMMON_SEARCH_KEYWORDS,
  matchSearchText,
  type SuggestionItem,
  type SuggestionsGrouped,
} from '../components/search/searchTypes';

interface SearchSourceProduct {
  id: string | number;
  title: string;
  brandName?: string;
  categoryName?: string;
  description?: string;
  price?: number;
  image?: string;
  tags?: string[];
}

interface SearchSourceBrand {
  id: string | number;
  name: string;
  category?: string;
  products?: number;
  rating?: number;
}

interface SearchSourceCreator {
  id: string | number;
  name: string;
  handle?: string;
  bio?: string;
  bestFor?: string;
  avatar?: string;
}

interface SearchSourceCategory {
  id: string | number;
  name: string;
}

interface UseSearchSuggestionsParams {
  queryValue: string;
  recentSearches: string[];
  popularSearches: string[];
  trendingSearches: string[];
  customOverviews?: CustomOverview[];
  productSource: SearchSourceProduct[];
  brandSource: SearchSourceBrand[];
  creatorSource: SearchSourceCreator[];
  categorySource: ReadonlyArray<SearchSourceCategory>;
}

export function useSearchSuggestions({
  queryValue,
  recentSearches,
  popularSearches,
  trendingSearches,
  customOverviews,
  productSource,
  brandSource,
  creatorSource,
  categorySource,
}: UseSearchSuggestionsParams) {
  const suggestionsGrouped = useMemo<SuggestionsGrouped>(() => {
    const q = queryValue.trim().toLowerCase();

    if (!q) {
      const recents: SuggestionItem[] = recentSearches.map((s, idx) => ({
        id: `recent-${idx}-${s}`,
        type: 'recent',
        title: s,
        route: `/search?q=${encodeURIComponent(s)}`,
      }));

      const populars: SuggestionItem[] = popularSearches.map((s, idx) => ({
        id: `popular-${idx}-${s}`,
        type: 'popular',
        title: s,
        route: `/search?q=${encodeURIComponent(s)}`,
      }));

      const trendings: SuggestionItem[] = trendingSearches.map((s, idx) => ({
        id: `trending-${idx}-${s}`,
        type: 'trending',
        title: s,
        route: `/search?q=${encodeURIComponent(s)}`,
      }));

      return {
        recent: recents,
        popular: populars,
        trending: trendings,
        queries: [],
        products: [],
        brands: [],
        creators: [],
        categories: [],
        totalCount: recents.length + populars.length + trendings.length,
      };
    }

    const matchedQueries: SuggestionItem[] = COMMON_SEARCH_KEYWORDS
      .filter((k) => k.toLowerCase().includes(q))
      .slice(0, 4)
      .map((k, idx) => ({
        id: `query-${idx}-${k}`,
        type: 'query',
        title: k,
        route: `/search?q=${encodeURIComponent(k)}`,
      }));

    const matchedProducts: SuggestionItem[] = productSource
      .filter((p) => {
        const pOverviews = getProductOverviews(
          p.id,
          p.title,
          p.categoryName,
          customOverviews || [],
        );
        const matchedOverview = Object.values(pOverviews).some(
          (val) => typeof val === 'string' && val.toLowerCase().includes(q),
        );

        return (
          matchSearchText(p.title, q) ||
          matchSearchText(p.brandName, q) ||
          matchSearchText(p.categoryName, q) ||
          matchSearchText(p.description, q) ||
          matchedOverview
        );
      })
      .slice(0, 3)
      .map((p) => ({
        id: `product-${p.id}`,
        type: 'product',
        title: p.title,
        subtitle: `${p.brandName} • BDT ${p.price}`,
        image: p.image,
        route: `/products/${p.id}`,
        badge: p.tags?.[0],
      }));

    const matchedBrands: SuggestionItem[] = brandSource
      .filter((b) => {
        const bOverviews = getBrandOverviews(b.name, customOverviews || []);
        const matchedOverview = Object.values(bOverviews).some(
          (val) => typeof val === 'string' && val.toLowerCase().includes(q),
        );

        return (
          matchSearchText(b.name, q) ||
          matchSearchText(b.category, q) ||
          matchedOverview
        );
      })
      .slice(0, 3)
      .map((b) => ({
        id: `brand-${b.id}`,
        type: 'brand',
        title: b.name,
        subtitle: `${b.category || 'Brand'} • ${b.products ?? 0} Products`,
        route: `/brands/${b.id}`,
        badge: (b.rating ?? 0) >= 4.8 ? 'Verified' : undefined,
      }));

    const matchedCreators: SuggestionItem[] = creatorSource
      .filter(
        (c) =>
          matchSearchText(c.name, q) ||
          matchSearchText(c.handle, q) ||
          matchSearchText(c.bio, q) ||
          matchSearchText(c.bestFor, q),
      )
      .slice(0, 3)
      .map((c) => ({
        id: `creator-${c.id}`,
        type: 'creator',
        title: c.name,
        subtitle: `${c.handle || '@creator'} • ${c.bestFor || 'Creator'} Expert`,
        image: c.avatar,
        route: `/creators/${c.id}`,
      }));

    const matchedCategories: SuggestionItem[] = categorySource
      .filter((c) => matchSearchText(c.name, q))
      .slice(0, 3)
      .map((c) => ({
        id: `category-${c.id}`,
        type: 'category',
        title: c.name,
        route: `/products?category=${encodeURIComponent(c.name)}`,
        badge: 'Category',
      }));

    const totalCount =
      matchedQueries.length +
      matchedProducts.length +
      matchedBrands.length +
      matchedCreators.length +
      matchedCategories.length;

    return {
      recent: [],
      popular: [],
      trending: [],
      queries: matchedQueries,
      products: matchedProducts,
      brands: matchedBrands,
      creators: matchedCreators,
      categories: matchedCategories,
      totalCount,
    };
  }, [
    queryValue,
    recentSearches,
    popularSearches,
    trendingSearches,
    customOverviews,
    productSource,
    brandSource,
    creatorSource,
    categorySource,
  ]);

  const flatSuggestions = useMemo(() => {
    const list: SuggestionItem[] = [];

    if (!queryValue.trim()) {
      list.push(...suggestionsGrouped.recent);
      list.push(...suggestionsGrouped.popular);
      list.push(...suggestionsGrouped.trending);
    } else {
      list.push(...suggestionsGrouped.queries);
      list.push(...suggestionsGrouped.products);
      list.push(...suggestionsGrouped.brands);
      list.push(...suggestionsGrouped.creators);
      list.push(...suggestionsGrouped.categories);
    }

    return list;
  }, [queryValue, suggestionsGrouped]);

  return { suggestionsGrouped, flatSuggestions };
}
