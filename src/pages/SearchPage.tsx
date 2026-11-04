import { brandPath, creatorPath } from '../../lib/publicUrls';
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { BRANDS, CATEGORIES } from '../constants';
import { BrandCardDesign } from '../components/BrandCardDesign';
import { toBrandCardData } from '../lib/brandCardData';
import { ProductCard } from '../components/ProductCard';
import { SponsoredProductTile } from '../components/commerce/AdvertiseHereCard';
import { CtaBannerSlot } from '../components/CtaBannerSlot';
import { usePlacements } from '../hooks/usePlacements';
import { SPONSORED_SURFACE_CONFIG } from '../lib/commerce/sponsoredPlacementRegistry';
import { resolvedPlacementToSponsoredItem } from '../utils/sponsoredPlacementAdapter';
import { mockGuides } from '../data/mockGuides';
import { CREATORS } from '../data/creators';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { catalogApi } from '../services/catalogApi';
import { wholeWordMatch, wordStartMatch } from '../lib/search/textMatch';
import { getBrandOverviews, getProductOverviews, matchOverviewContent } from '../utils/overviewRegistry';
import { useRegisterPageFilters, UniversalFilterRenderer } from '../components/FilterEngine';
import { catalogGuideHref } from '../lib/spotlight/content';
import { cn } from '../lib/utils';
import { toast } from '../lib/notify';
import { SortDropdown } from '../components/SortDropdown';
import { SEARCH_SORT_OPTIONS, SEARCH_SORT_DEFAULT, applySortOption, resolveSortIdFromParam } from '../lib/sorting/sortRegistry';

type SearchTab = 'all' | 'products' | 'brands' | 'guides' | 'deals' | 'creators';

const DC_TABS: { id: SearchTab; label: string }[] = [
  { id: 'all', label: 'All Results' },
  { id: 'products', label: 'Products' },
  { id: 'brands', label: 'Brands' },
  { id: 'guides', label: 'Guides' },
  { id: 'deals', label: 'Deals' },
  { id: 'creators', label: 'Creators' },
];


/** Choosify.dc.html Search Results */
export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const [localInput, setLocalInput] = useState(rawQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [sortBy, setSortByState] = useState<string>(() =>
    resolveSortIdFromParam(SEARCH_SORT_OPTIONS, SEARCH_SORT_DEFAULT, searchParams.get('sort')),
  );
  const setSortBy = React.useCallback(
    (id: string) => {
      setSortByState(id);
      const updated = new URLSearchParams(searchParams);
      if (id === SEARCH_SORT_DEFAULT) updated.delete('sort');
      else updated.set('sort', id);
      setSearchParams(updated);
    },
    [searchParams, setSearchParams],
  );
  const [maxPrice, setMaxPrice] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  const { customOverviews } = useDashboard();
  const { allCatalogProducts, allBrands, allCategories, allCreators, allGuides } = useGlobalState();

  // Sample brands / guides / creators are a local-development aid only; production
  // search shows real data or nothing.
  const allowDemo = import.meta.env.DEV;
  const productSource = allCatalogProducts;
  const brandSource =
    allBrands.length > 0
      ? allBrands.map((b) => ({
          ...b,
          products: (b as { followers?: number; products?: number }).followers ?? (b as { products?: number }).products ?? 0,
          rating: (b as { ratings?: number; rating?: number }).ratings ?? (b as { rating?: number }).rating ?? 0,
        }))
      : allowDemo
        ? BRANDS
        : [];
  const categorySource =
    allCategories.length > 0
      ? allCategories.map((c) => ({ id: c.id, name: c.name }))
      : CATEGORIES;
  const guideSource = allGuides.length > 0 || !allowDemo ? allGuides : mockGuides;
  const creatorSource =
    allCreators.length > 0 || !allowDemo ? allCreators : Array.isArray(CREATORS) ? CREATORS : Object.values(CREATORS);

  // Categories the search words point to ("shoes" → Fashion & Lifestyle › Footwear), so brands
  // that offer what was searched for show up even when no product matches yet.
  const [categoryMatches, setCategoryMatches] = useState<
    Array<{ mainId: string; mainName: string; subId: string | null; subName: string | null; score: number }>
  >([]);
  useEffect(() => {
    const q = rawQuery.trim();
    if (!q) {
      setCategoryMatches([]);
      return;
    }
    let cancelled = false;
    catalogApi
      .matchCategories(q)
      .then((m) => !cancelled && setCategoryMatches(m))
      .catch(() => !cancelled && setCategoryMatches([]));
    return () => {
      cancelled = true;
    };
  }, [rawQuery]);

  useEffect(() => {
    setLocalInput(rawQuery);
  }, [rawQuery]);

  // Keep sort aligned with ?sort= on browser back/forward or external nav.
  useEffect(() => {
    const resolved = resolveSortIdFromParam(SEARCH_SORT_OPTIONS, SEARCH_SORT_DEFAULT, searchParams.get('sort'));
    setSortByState((prev) => (prev === resolved ? prev : resolved));
  }, [searchParams]);

  const filterCount = useMemo(() => {
    let n = 0;
    if (sortBy !== SEARCH_SORT_DEFAULT) n += 1;
    if (maxPrice !== 'all') n += 1;
    if (categoryFilter !== 'all') n += 1;
    if (inStockOnly) n += 1;
    return n;
  }, [sortBy, maxPrice, categoryFilter, inStockOnly]);

  useRegisterPageFilters(
    {
      pageName: 'Search',
      renderSearch: () => (
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={13} className="text-[#FF5B00]" />
          </div>
          <input
            type="text"
            value={localInput}
            onChange={(e) => {
              const val = e.target.value;
              setLocalInput(val);
              setSearchParams(val ? { q: val } : {});
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (localInput.trim()) setSearchParams({ q: localInput.trim() });
                else toast.error('Type a query to search!');
              }
            }}
            placeholder="Search products, brands, guides…"
            className="w-full h-9 pl-8 pr-3 bg-white border border-[#E8EDF2] rounded-lg text-[11px] font-semibold text-[#1A1A2E] placeholder-[#9AA0AC] focus:outline-none focus:border-[#FF5B00]/50"
          />
        </div>
      ),
      quickFilters: DC_TABS.map((t) => ({
        id: t.id,
        label: t.label,
        active: activeTab === t.id,
        onClick: () => setActiveTab(t.id),
      })),
      renderFilters: () => (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 font-sans">
            <label className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-wider">Sort by</label>
            <SortDropdown options={SEARCH_SORT_OPTIONS} value={sortBy} onChange={setSortBy} className="w-full" />
          </div>
          <UniversalFilterRenderer
            profile={{
              entity: 'products',
              filters: [
                {
                  id: 'price',
                  name: 'Max price',
                  type: 'single_select',
                  options: [
                    { value: 'all', label: 'Any price' },
                    { value: '5000', label: 'Under BDT 5,000' },
                    { value: '15000', label: 'Under BDT 15,000' },
                    { value: '50000', label: 'Under BDT 50,000' },
                  ],
                },
                {
                  id: 'category',
                  name: 'Category',
                  type: 'single_select',
                  options: [
                    { value: 'all', label: 'All categories' },
                    ...categorySource.slice(0, 12).map((c) => ({ value: c.name, label: c.name })),
                  ],
                },
                {
                  id: 'stock',
                  name: 'Availability',
                  type: 'single_select',
                  options: [
                    { value: 'all', label: 'All items' },
                    { value: 'in_stock', label: 'In stock only' },
                  ],
                },
              ],
            }}
            activeFilters={{
              price: maxPrice,
              category: categoryFilter,
              stock: inStockOnly ? 'in_stock' : 'all',
            }}
            onFilterChange={(filterId, value) => {
              if (filterId === 'price') setMaxPrice(value || 'all');
              if (filterId === 'category') setCategoryFilter(value || 'all');
              if (filterId === 'stock') setInStockOnly(value === 'in_stock');
            }}
          />
        </div>
      ),
      activeFilterCount: filterCount,
      onClearAll: () => {
        setSortBy(SEARCH_SORT_DEFAULT);
        setMaxPrice('all');
        setCategoryFilter('all');
        setInStockOnly(false);
      },
      sectionNav: null,
    },
    [localInput, activeTab, sortBy, maxPrice, categoryFilter, inStockOnly, categorySource, filterCount],
  );

  const results = useMemo(() => {
    const q = rawQuery.toLowerCase().trim();
    if (!q) {
      return { products: [] as any[], brands: [] as any[], guides: [] as any[], creators: [] as any[], deals: [] as any[], total: 0, brandsMayOffer: false };
    }

    const scoreTitle = (title: string, hot = false) => {
      const t = title.toLowerCase();
      let s = 0;
      if (t === q) s += 1000;
      else if (t.includes(q)) s += 200;
      if (hot) s += 30;
      return s;
    };

    let products = productSource
      .map((p) => {
        const overviews = getProductOverviews(p.id, p.title, p.categoryName, customOverviews);
        const matchedOverview = matchOverviewContent(overviews, q);
        // Names/titles: word starts; subcategory and description: whole words (never mid-word).
        // The main-category NAME is not matched word by word ("Beauty, Health & Pharmacy" is not
        // a pharmacy) — main categories match through the category search words instead.
        const match =
          wordStartMatch(p.title, q) ||
          wordStartMatch(p.brandName, q) ||
          wholeWordMatch(p.subcategoryName, q) ||
          wholeWordMatch(p.description, q) ||
          !!matchedOverview;
        if (!match) return null;
        const hot = p.isBestseller || p.isNewArrival || p.tags?.includes('HOT');
        return { ...p, score: scoreTitle(p.title, !!hot) + (matchedOverview ? 400 : 0) };
      })
      .filter(Boolean) as any[];

    if (categoryFilter !== 'all') {
      products = products.filter((p) => p.categoryName === categoryFilter);
    }
    if (maxPrice !== 'all') {
      const cap = Number(maxPrice);
      if (!Number.isNaN(cap)) products = products.filter((p) => Number(p.price) <= cap);
    }
    if (inStockOnly) {
      products = products.filter((p) => Number(p.stock ?? 1) > 0);
    }
    products = applySortOption(
      products,
      SEARCH_SORT_OPTIONS,
      sortBy,
      SEARCH_SORT_DEFAULT,
      (list) => [...list].sort((a, b) => (b.score || 0) - (a.score || 0)),
      (p) => ({ createdAt: p.createdAt, price: Number(p.price) || 0 }),
    );

    // Out-of-stock results sink to the end regardless of sort -- a stable
    // partition, so each group keeps the order just computed above.
    if (!inStockOnly) {
      const isOOS = (p: any) => p.status === 'out_of_stock' || p.stock === 0;
      products = [...products.filter((p) => !isOOS(p)), ...products.filter(isOOS)];
    }

    // Brands also match by what they offer: a brand filed under a subcategory the search
    // points to ("shoes" → Footwear) ranks first, then brands under a matching main category.
    // Only strong category matches count, so a brand never shows up just for sharing a
    // broad area with what was searched for.
    const subScore = new Map<string, number>();
    const mainScore = new Map<string, number>();
    for (const m of categoryMatches) {
      if (m.score < 50) continue;
      if (m.subId) subScore.set(m.subId, Math.max(subScore.get(m.subId) ?? 0, m.score));
      else mainScore.set(m.mainId, Math.max(mainScore.get(m.mainId) ?? 0, m.score));
    }
    // The brand's own "Best for" tags (overview.tags): a tag containing the search, or a tag word
    // matching a searched word (singular/plural alike: "shoe" ↔ "Leather Shoes").
    const singular = (w: string) => w.replace(/(ies)$/, 'y').replace(/(sses|shes|ches|xes)$/, (m) => m.slice(0, -2)).replace(/(?<!s)s$/, '');
    const words = (v: string) => v.toLowerCase().split(/[^\p{L}\p{M}\p{N}]+/u).filter((x) => x.length > 1).map(singular);
    const qWords = words(q);
    const tagScore = (b: any): number => {
      const tags: string[] = Array.isArray(b.overview?.tags) ? b.overview.tags.map(String) : [];
      if (!tags.length || !qWords.length) return 0;
      // A tag that is exactly the search ranks highest; otherwise every searched word must be a
      // whole word of one tag ("ring" ≠ "Earrings", "shoe" = "Leather Shoes").
      if (tags.some((t) => words(t).join(' ') === qWords.join(' '))) return 260;
      return tags.some((t) => wholeWordMatch(t, q)) ? 220 : 0;
    };
    const offerScore = (b: any): number => {
      if (b.subcategoryId && subScore.has(b.subcategoryId)) return 150 + (subScore.get(b.subcategoryId) ?? 0);
      if (b.categoryId && mainScore.has(b.categoryId)) return 100 + (mainScore.get(b.categoryId) ?? 0);
      return 0;
    };

    const brands = brandSource
      .map((b: any) => {
        const overviews = getBrandOverviews(b.name, customOverviews);
        const matchedOverview = matchOverviewContent(overviews, q);
        const offers = Math.max(offerScore(b), tagScore(b));
        // Main-category names combine several areas ("Books, Education & Arts"), so they are matched
        // through the category search words (offerScore), not word by word here.
        const match =
          wordStartMatch(b.name, q) ||
          wholeWordMatch(b.subcategoryName, q) ||
          !!matchedOverview ||
          offers > 0;
        if (!match) return null;
        return {
          ...b,
          score: scoreTitle(b.name, (b.rating || 0) >= 4.8) + (matchedOverview ? 400 : 0) + offers,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.score - a.score) as any[];

    // Nothing matched at all, but the search clearly points to a category: show brands in that
    // main category that haven't chosen a subcategory yet — they may offer it (labelled as such).
    let brandsMayOffer = false;
    const top = categoryMatches.find((m) => m.score >= 50);
    if (!brands.length && !products.length && top) {
      const loose = brandSource.filter((b: any) => b.categoryId === top.mainId && !b.subcategoryId);
      if (loose.length) {
        brands.push(...loose.map((b: any) => ({ ...b, score: 0 })));
        brandsMayOffer = true;
      }
    }

    const guides = guideSource
      .filter((g: any) => {
        return (
          wordStartMatch(g.title, q) ||
          wordStartMatch(g.author, q) ||
          (g.tags || []).some((tag: any) => wholeWordMatch(String(tag), q))
        );
      })
      .slice(0, 24);

    const creators = (creatorSource as any[])
      .filter((c) => {
        return (
          wordStartMatch(c.name, q) ||
          wordStartMatch(c.handle, q) ||
          wholeWordMatch(c.bio, q)
        );
      })
      .slice(0, 24);

    const deals = products.filter(
      (p) => p.originalPrice || p.isDeal || p.tags?.includes('SALE') || p.tags?.includes('HOT'),
    );

    const total = products.length + brands.length + guides.length + creators.length;

    return { products, brands, guides, creators, deals, total, brandsMayOffer };
  }, [
    rawQuery,
    productSource,
    brandSource,
    guideSource,
    creatorSource,
    customOverviews,
    categoryFilter,
    maxPrice,
    inStockOnly,
    sortBy,
    categoryMatches,
  ]);

  // What the search points to, for the "brands that offer …" note ("Footwear").
  const offeringLabel = categoryMatches[0] ? categoryMatches[0].subName || categoryMatches[0].mainName : '';

  // Real, query-relevance-gated promoted search ad. Pulls only actual
  // configured CMS placements targeting the 'infeed_search' slot (no
  // catalog/demo fallback -- withFallback: false -- an irrelevant or empty
  // ad shelf must never be papered over with a random product/brand) and
  // only ever shows one if its own resolved title/brand/category text
  // actually contains the search query, exactly the same substring match
  // organic product search already uses for its title/brand/category
  // fields. No configured search placement, or none matching the query,
  // means no promoted card -- never a generic "Advertise your product
  // here" filler standing in for a relevant result.
  const searchPlacements = usePlacements(SPONSORED_SURFACE_CONFIG.search.placementKey, {
    limit: 5,
    withFallback: false,
  });
  const relevantSearchAd = useMemo(() => {
    const q = rawQuery.toLowerCase().trim().replace(/\s+/g, ' ');
    if (!q) return null;
    return (
      searchPlacements.find((p) => {
        const haystack = `${p.title} ${p.subtitle ?? ''}`.toLowerCase().replace(/\s+/g, ' ');
        return haystack.includes(q);
      }) ?? null
    );
  }, [searchPlacements, rawQuery]);
  const relevantSearchAdItem = relevantSearchAd
    ? resolvedPlacementToSponsoredItem(relevantSearchAd, relevantSearchAd.subtitle)
    : null;

  const tabCounts: Record<SearchTab, number> = {
    all: results.total,
    products: results.products.length,
    brands: results.brands.length,
    guides: results.guides.length,
    deals: results.deals.length,
    creators: results.creators.length,
  };

  const showProducts = activeTab === 'all' || activeTab === 'products' || activeTab === 'deals';
  const productList =
    activeTab === 'deals'
      ? results.deals
      : activeTab === 'all'
        ? results.products.slice(0, 5)
        : results.products;
  // "All results" shows up to 12 brands (whole rows at 1 / 2 / 3 / 4 columns); "View all"
  // only appears when there are more than that.
  const ALL_TAB_BRANDS = 12;
  const brandList = activeTab === 'all' ? results.brands.slice(0, ALL_TAB_BRANDS) : results.brands;

  return (
    <div className="min-h-screen bg-choosify-feed text-[#1A1A2E] pb-16 font-sans antialiased">
      {/* DC dark hero — constrained to feed silhouette */}
      <div className="w-full px-5 sm:px-8 lg:px-10 pt-4">
        <header
          className="max-w-[1280px] mx-auto px-6 sm:px-10 py-8 text-white rounded-none overflow-hidden choosify-dark-surface"
        >
          <h1 className="text-2xl font-extrabold mb-1.5 tracking-tight">
            {rawQuery.trim() ? `Search results for "${rawQuery}"` : 'Search Results'}
          </h1>
          <p className="text-[12.5px] text-white/50 m-0">
            {rawQuery.trim()
              ? results.total > 0
                ? `Found ${results.total.toLocaleString()} results across products, brands, guides, deals & more`
                : `No matches yet for "${rawQuery}" — try another keyword`
              : 'Search products, brands, guides, deals & more'}
          </p>
        </header>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-6 pb-14">
        <CtaBannerSlot page="search" section="search-pill-tabs" position="before" className="mb-6" />
        {/* DC pill tabs + sort */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-6">
          <div className="flex gap-2.5 flex-wrap">
            {DC_TABS.map((tab) => {
              const active = activeTab === tab.id;
              const count = tabCounts[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 py-2.5 rounded-[20px] text-xs font-bold cursor-pointer border transition-colors',
                    active
                      ? 'bg-[#FF5B00] text-white border-[#FF5B00]'
                      : 'bg-white text-[#1A1A2E] border-[#E5E7EB] hover:border-[#FF5B00]/40',
                  )}
                >
                  {tab.label}{' '}
                  <span className={cn(active ? 'opacity-60' : 'text-[#9AA0AC]')}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <SortDropdown options={SEARCH_SORT_OPTIONS} value={sortBy} onChange={setSortBy} />
          </div>
        </div>
        <CtaBannerSlot page="search" section="search-pill-tabs" position="after" className="mb-6" />

        {!rawQuery.trim() && (
          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-10 text-center">
            <p className="text-[13px] text-[#4B5563] m-0">
              Type a keyword in the header search or filter drawer to see results.
            </p>
          </div>
        )}

        {rawQuery.trim() && results.total === 0 && (
          <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-10 text-center">
            <p className="text-sm font-extrabold text-[#1A1A2E] mb-2">No results found</p>
            <p className="text-[12.5px] text-[#9AA0AC] m-0">
              Try a broader keyword, or clear filters from the filter panel.
            </p>
          </div>
        )}

        {/* TOP PRODUCTS */}
        {rawQuery.trim() && showProducts && productList.length > 0 && (
          <section className="mb-9">
            <h2 className="text-base font-extrabold text-[#1A1A2E] mb-3.5">
              {activeTab === 'deals' ? 'TOP DEALS' : 'TOP PRODUCTS'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {productList.map((product) => (
                <ProductCard key={product.id} product={product} variant="grid" />
              ))}
              {(activeTab === 'all' || activeTab === 'products') && relevantSearchAdItem && (
                <SponsoredProductTile item={relevantSearchAdItem} className="min-h-[280px]" />
              )}
            </div>
            {activeTab === 'all' && results.products.length > 5 && (
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="mt-4 text-[12px] font-bold text-[#FF5B00] bg-transparent border-0 cursor-pointer hover:underline"
              >
                View all {results.products.length} products →
              </button>
            )}
          </section>
        )}

        {/* TOP BRANDS */}
        {rawQuery.trim() && (activeTab === 'all' || activeTab === 'brands') && brandList.length > 0 && (
          <section className="mb-9">
            {results.products.length === 0 && (activeTab === 'all' || activeTab === 'brands') && (
              <div
                className="mb-4 rounded-[10px] border border-[#FF5B00]/25 bg-[#FFF6F2] px-4 py-3 text-[12.5px] text-[#4B5563]"
                data-testid="search-brands-offer-note"
              >
                <span className="font-extrabold text-[#1A1A2E]">No products for &ldquo;{rawQuery.trim()}&rdquo; yet</span>
                {' — '}
                {results.brandsMayOffer && offeringLabel ? (
                  <>no brand is listed under <span className="font-bold text-[#FF5B00]">{offeringLabel}</span> yet, but these {categoryMatches.find((m) => m.score >= 50)?.mainName} brands may offer it.</>
                ) : offeringLabel ? (
                  <>these brands offer <span className="font-bold text-[#FF5B00]">{offeringLabel}</span>.</>
                ) : (
                  <>these brands match your search.</>
                )}{' '}
                Visit a brand&apos;s profile to see what they sell and how to buy from them.
              </div>
            )}
            <h2 className="text-base font-extrabold text-[#1A1A2E] mb-3.5">
              TOP BRANDS
              {offeringLabel && (
                <span className="ml-2 text-[11px] font-bold text-[#9AA0AC] normal-case">
                  {results.brandsMayOffer ? `may offer ${offeringLabel}` : `offering ${offeringLabel}`}
                </span>
              )}
            </h2>
            {/* The same brand card as the Brands page: logo, cover, Best For, price range, status. */}
            <div className="choosify-brand-grid w-full" data-testid="search-brand-results">
              {brandList.map((brand: any) => (
                <BrandCardDesign key={brand.id || brand.name} brand={toBrandCardData(brand)} />
              ))}
            </div>
            {activeTab === 'all' && results.brands.length > ALL_TAB_BRANDS && (
              <button
                type="button"
                onClick={() => setActiveTab('brands')}
                className="mt-4 text-[12px] font-bold text-[#FF5B00] bg-transparent border-0 cursor-pointer hover:underline"
              >
                View all {results.brands.length} brands →
              </button>
            )}
          </section>
        )}

        {/* GUIDES */}
        {rawQuery.trim() && (activeTab === 'all' || activeTab === 'guides') && results.guides.length > 0 && (
          <section className="mb-9">
            <h2 className="text-base font-extrabold text-[#1A1A2E] mb-3.5">TOP GUIDES</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {(activeTab === 'all' ? results.guides.slice(0, 3) : results.guides).map((guide: any) => (
                <Link
                  key={guide.id || guide.slug}
                  to={catalogGuideHref(guide)}
                  className="bg-white rounded-[10px] border border-[#E8EDF2] overflow-hidden no-underline hover:border-[#FF5B00]/35 transition-colors"
                >
                  {guide.image || guide.coverImage || guide.thumbnail ? (
                    <div className="h-[120px] bg-[#F4F7F9] overflow-hidden">
                      <img
                        src={guide.image || guide.coverImage || guide.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="p-3.5">
                    <div className="text-[12.5px] font-bold text-[#1A1A2E] line-clamp-2 mb-1">
                      {guide.title}
                    </div>
                    <div className="text-[10.5px] text-[#9AA0AC]">
                      {guide.author || guide.readTime || 'Buying guide'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {activeTab === 'all' && results.guides.length > 3 && (
              <button
                type="button"
                onClick={() => setActiveTab('guides')}
                className="mt-4 text-[12px] font-bold text-[#FF5B00] bg-transparent border-0 cursor-pointer hover:underline"
              >
                View all {results.guides.length} guides →
              </button>
            )}
          </section>
        )}

        {/* CREATORS */}
        {rawQuery.trim() && (activeTab === 'all' || activeTab === 'creators') && results.creators.length > 0 && (
          <section className="mb-9">
            <h2 className="text-base font-extrabold text-[#1A1A2E] mb-3.5">TOP CREATORS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {(activeTab === 'all' ? results.creators.slice(0, 5) : results.creators).map((c: any) => (
                <Link
                  key={c.id || c.name}
                  to={creatorPath(c)}
                  className="bg-white rounded-[10px] border border-[#E8EDF2] p-5 text-center no-underline hover:border-[#FF5B00]/35 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden mx-auto mb-3 bg-[#F4F7F9]">
                    {c.avatar ? (
                      <img src={c.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-extrabold text-[#1A1A2E]">
                        {String(c.name || 'C')
                          .split(/\s+/)
                          .map((p: string) => p[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="text-[13px] font-extrabold text-[#1A1A2E] truncate">{c.name}</div>
                  <div className="text-[11px] text-[#9AA0AC] mt-1 truncate">{c.handle || c.bestFor}</div>
                </Link>
              ))}
            </div>
            {activeTab === 'all' && results.creators.length > 5 && (
              <button
                type="button"
                onClick={() => setActiveTab('creators')}
                className="mt-4 text-[12px] font-bold text-[#FF5B00] bg-transparent border-0 cursor-pointer hover:underline"
              >
                View all {results.creators.length} creators →
              </button>
            )}
          </section>
        )}

        <CtaBannerSlot page="search" section="search-end" position="after" className="mt-8" />
      </div>
    </div>
  );
}
