import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { BRANDS, CATEGORIES } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { AdvertiseHereCard } from '../components/commerce/AdvertiseHereCard';
import { mockGuides } from '../data/mockGuides';
import { CREATORS } from '../data/creators';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { getBrandOverviews, getProductOverviews, matchOverviewContent } from '../utils/overviewRegistry';
import { useRegisterPageFilters, UniversalFilterRenderer } from '../components/FilterEngine';
import { catalogGuideHref } from '../lib/spotlight/content';
import { cn } from '../lib/utils';
import { toast } from '../lib/notify';

type SearchTab = 'all' | 'products' | 'brands' | 'guides' | 'deals' | 'creators';

const DC_TABS: { id: SearchTab; label: string }[] = [
  { id: 'all', label: 'All Results' },
  { id: 'products', label: 'Products' },
  { id: 'brands', label: 'Brands' },
  { id: 'guides', label: 'Guides' },
  { id: 'deals', label: 'Deals' },
  { id: 'creators', label: 'Creators' },
];

const BRAND_COLORS = ['#1428A0', '#FF6900', '#1A1A2E', '#000000', '#0076CE', '#16A34A', '#2323FF', '#EF3C23'];

/** Choosify.dc.html Search Results */
export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const [localInput, setLocalInput] = useState(rawQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'newest'>('default');
  const [maxPrice, setMaxPrice] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);

  const { customOverviews } = useDashboard();
  const { allCatalogProducts, allBrands, allCategories, allCreators, allGuides } = useGlobalState();

  const productSource = allCatalogProducts;
  const brandSource =
    allBrands.length > 0
      ? allBrands.map((b) => ({
          ...b,
          products: (b as { followers?: number; products?: number }).followers ?? (b as { products?: number }).products ?? 0,
          rating: (b as { ratings?: number; rating?: number }).ratings ?? (b as { rating?: number }).rating ?? 0,
        }))
      : BRANDS;
  const categorySource =
    allCategories.length > 0
      ? allCategories.map((c) => ({ id: c.id, name: c.name }))
      : CATEGORIES;
  const guideSource = allGuides.length > 0 ? allGuides : mockGuides;
  const creatorSource =
    allCreators.length > 0 ? allCreators : Array.isArray(CREATORS) ? CREATORS : Object.values(CREATORS);

  useEffect(() => {
    setLocalInput(rawQuery);
  }, [rawQuery]);

  const filterCount = useMemo(() => {
    let n = 0;
    if (sortBy !== 'default') n += 1;
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
            <Search size={13} className="text-[#EB4501]" />
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
            className="w-full h-9 pl-8 pr-3 bg-white border border-[#E8EDF2] rounded-lg text-[11px] font-semibold text-[#1A1A2E] placeholder-[#9AA0AC] focus:outline-none focus:border-[#EB4501]/50"
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
        <UniversalFilterRenderer
          profile={{
            entity: 'products',
            filters: [
              {
                id: 'sort',
                name: 'Sort by',
                type: 'single_select',
                options: [
                  { value: 'default', label: 'Relevance' },
                  { value: 'price_asc', label: 'Price: Low to High' },
                  { value: 'price_desc', label: 'Price: High to Low' },
                  { value: 'newest', label: 'Newest' },
                ],
              },
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
            sort: sortBy,
            price: maxPrice,
            category: categoryFilter,
            stock: inStockOnly ? 'in_stock' : 'all',
          }}
          onFilterChange={(filterId, value) => {
            if (filterId === 'sort') setSortBy((value || 'default') as typeof sortBy);
            if (filterId === 'price') setMaxPrice(value || 'all');
            if (filterId === 'category') setCategoryFilter(value || 'all');
            if (filterId === 'stock') setInStockOnly(value === 'in_stock');
          }}
        />
      ),
      activeFilterCount: filterCount,
      onClearAll: () => {
        setSortBy('default');
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
      return { products: [] as any[], brands: [] as any[], guides: [] as any[], creators: [] as any[], deals: [] as any[], total: 0 };
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
        const match =
          p.title.toLowerCase().includes(q) ||
          p.brandName?.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
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
    if (sortBy === 'price_asc') products = [...products].sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === 'price_desc') products = [...products].sort((a, b) => Number(b.price) - Number(a.price));
    else if (sortBy === 'newest') products = [...products].sort((a, b) => Number(b.id) - Number(a.id));
    else products = [...products].sort((a, b) => (b.score || 0) - (a.score || 0));

    const brands = brandSource
      .map((b: any) => {
        const overviews = getBrandOverviews(b.name, customOverviews);
        const matchedOverview = matchOverviewContent(overviews, q);
        const match =
          b.name.toLowerCase().includes(q) ||
          String(b.category || '').toLowerCase().includes(q) ||
          !!matchedOverview;
        if (!match) return null;
        return {
          ...b,
          score: scoreTitle(b.name, (b.rating || 0) >= 4.8) + (matchedOverview ? 400 : 0),
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.score - a.score) as any[];

    const guides = guideSource
      .filter((g: any) => {
        const t = String(g.title || '').toLowerCase();
        return (
          t.includes(q) ||
          String(g.author || '').toLowerCase().includes(q) ||
          (g.tags || []).some((tag: any) => String(tag).toLowerCase().includes(q))
        );
      })
      .slice(0, 24);

    const creators = (creatorSource as any[])
      .filter((c) => {
        return (
          String(c.name || '').toLowerCase().includes(q) ||
          String(c.handle || '').toLowerCase().includes(q) ||
          String(c.bio || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 24);

    const deals = products.filter(
      (p) => p.originalPrice || p.isDeal || p.tags?.includes('SALE') || p.tags?.includes('HOT'),
    );

    const total = products.length + brands.length + guides.length + creators.length;

    return { products, brands, guides, creators, deals, total };
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
  ]);

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
  const brandList = activeTab === 'all' ? results.brands.slice(0, 5) : results.brands;

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
        {/* DC pill tabs */}
        <div className="flex gap-2.5 mb-6 flex-wrap">
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
                    ? 'bg-[#EB4501] text-white border-[#EB4501]'
                    : 'bg-white text-[#1A1A2E] border-[#E5E7EB] hover:border-[#EB4501]/40',
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
              {(activeTab === 'all' || activeTab === 'products') && (
                <AdvertiseHereCard
                  variant="product-tile"
                  className="min-h-[280px]"
                />
              )}
            </div>
            {activeTab === 'all' && results.products.length > 5 && (
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="mt-4 text-[12px] font-bold text-[#EB4501] bg-transparent border-0 cursor-pointer hover:underline"
              >
                View all {results.products.length} products →
              </button>
            )}
          </section>
        )}

        {/* TOP BRANDS */}
        {rawQuery.trim() && (activeTab === 'all' || activeTab === 'brands') && brandList.length > 0 && (
          <section className="mb-9">
            <h2 className="text-base font-extrabold text-[#1A1A2E] mb-3.5">TOP BRANDS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
              {brandList.map((brand: any, i: number) => (
                <Link
                  key={brand.id || brand.name}
                  to={`/brands/${brand.id || brand.slug || encodeURIComponent(brand.name)}`}
                  className="bg-white rounded-[10px] border border-[#E8EDF2] p-[18px] text-center no-underline hover:border-[#EB4501]/35 transition-colors"
                >
                  <div
                    className="text-[15px] font-extrabold"
                    style={{ color: BRAND_COLORS[i % BRAND_COLORS.length] }}
                  >
                    {brand.name}
                  </div>
                  <div className="text-[11px] text-[#9AA0AC] mt-1.5">
                    {Number(brand.products || brand.productCount || 0).toLocaleString()} Products
                  </div>
                </Link>
              ))}
            </div>
            {activeTab === 'all' && results.brands.length > 5 && (
              <button
                type="button"
                onClick={() => setActiveTab('brands')}
                className="mt-4 text-[12px] font-bold text-[#EB4501] bg-transparent border-0 cursor-pointer hover:underline"
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
                  className="bg-white rounded-[10px] border border-[#E8EDF2] overflow-hidden no-underline hover:border-[#EB4501]/35 transition-colors"
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
                className="mt-4 text-[12px] font-bold text-[#EB4501] bg-transparent border-0 cursor-pointer hover:underline"
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
                  to={`/creators/${c.id}`}
                  className="bg-white rounded-[10px] border border-[#E8EDF2] p-5 text-center no-underline hover:border-[#EB4501]/35 transition-colors"
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
                className="mt-4 text-[12px] font-bold text-[#EB4501] bg-transparent border-0 cursor-pointer hover:underline"
              >
                View all {results.creators.length} creators →
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
