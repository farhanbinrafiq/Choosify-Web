import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Search, Star, Tag, Award, Heart, Sparkles, User, HelpCircle, 
  Copy, Check, ChevronRight, ArrowRight, ShoppingBag, FolderOpen, 
  Percent, AlertCircle, Sparkle, LayoutGrid, CheckCircle, Layers,
  BookOpen, Users
} from 'lucide-react';
import { PRODUCTS, BRANDS, BLOGS, CATEGORIES } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { HeroMarqueeTicker } from '../components/HeroMarqueeTicker';
import { PRODUCT_CARD_GRID, BRAND_CARD_GRID, CREATOR_CARD_GRID } from '../lib/pageLayout';
import { StickySectionNav } from '../components/StickySectionNav';
import { BrandCardDesign } from '../components/BrandCardDesign';
import { CreatorCardDesign } from '../components/CreatorCardDesign';
import { toast } from 'react-hot-toast';
import { mockGuides } from '../data/mockGuides';
import { CREATORS } from '../data/creators';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { getBrandOverviews, getProductOverviews, matchOverviewContent } from '../utils/overviewRegistry';
import { useRegisterPageFilters, UniversalFilterRenderer } from '../components/FilterEngine';
import { filterBrandPosts } from '../lib/brandPosts';
import { BrandPostCard } from '../components/BrandPostCard';

// Promo Codes & Brand Deals data
const BRAND_DEALS = [
  { id: 'aarong', name: "Aarong", dealHighlight: "Flat 15% OFF on Handicrafts", logo: "Aa", bgClass: "bg-orange-primary" },
  { id: 'apex', name: "Apex", dealHighlight: "Buy 1 Get 1 Free on Select Shoes", logo: "A", bgClass: "bg-navy" },
  { id: 'sailor', name: "Sailor", dealHighlight: "Flat 20% OFF on Casual Wear", logo: "S", bgClass: "bg-teal-700" },
  { id: 'adidas', name: "Adidas", dealHighlight: "Extra 10% OFF on Sportswear", logo: "Ad", bgClass: "bg-[#1A1D4E]" },
  { id: 'bay', name: "Bay Emporium", dealHighlight: "Up to 30% OFF on Leather Boots", logo: "B", bgClass: "bg-red-700" }
];

const PROMO_CODES = [
  { brandId: 'aarong', brandName: "Aarong", code: "AARONG15", discount: "Flat 15% OFF" },
  { brandId: 'apex', brandName: "Apex", code: "APEXFOOT26", discount: "BDT 500 FLAT" },
  { brandId: 'sailor', brandName: "Sailor", code: "SAILOREID", discount: "Flat 20% OFF" },
  { brandId: 'adidas', brandName: "Adidas", code: "ADIEXTRA10", discount: "10% FLAT OFF" }
];

// Predefined Advanced Matrix Comparison Databases
const COMPARE_DATABASES = [
  { id: 'product-compare', title: "Sailor vs Yellow Cotton Comparison", category: "Products", route: "/compare" },
  { id: 'brand-compare', title: "Aarong vs Yellow Positioning Matrix", category: "Brands", route: "/compare" },
  { id: 'creator-compare', title: "Nafis Anjum vs Tasnim Creator Comparison", category: "Creators", route: "/compare" },
  { id: 'guide-compare', title: "Capsule vs Traditional Wardrobe Comparison", category: "Guides", route: "/compare" },
  { id: 'ai-compare', title: "Value vs Longevity Premium Quality Cost Matrix", category: "AI Matrix", route: "/compare" }
];

// Influencers details
interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  platform: 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook';
  verifiedStatus: string;
  quickTip: string;
  rating?: number;
}

const INFLUENCERS: Influencer[] = [
  {
    id: "inf-1",
    name: "Farhan Bin Rafiq",
    handle: "@farhan",
    avatar: "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png",
    bio: "Senior Tech Analyst & Digital Product Researcher with 10+ years of experience in the Bangladesh market.",
    platform: "YouTube",
    verifiedStatus: "verified expert contributor",
    quickTip: "Always check for official warranty stickers when buying premium electronics in Bangladesh.",
    rating: 4.9
  },
  {
    id: "inf-2",
    name: "Sarah Jenkins",
    handle: "@sarah",
    avatar: "https://i.pravatar.cc/300?u=sarah",
    bio: "Fashion Curator & Retail Analyst specializing in contemporary garments, material longevity, and Dhaka street style.",
    platform: "Instagram",
    verifiedStatus: "fashion & beauty lead reviewer",
    quickTip: "Always wash delicate block prints in cold water to preserve dye vibrancy and prevent premature shrinkage.",
    rating: 4.8
  },
  {
    id: "inf-3",
    name: "Imtiaz Ahmed",
    handle: "@imtiaz",
    avatar: "https://i.pravatar.cc/300?u=imtiaz",
    bio: "Interior Designer and Home Solutions Specialist with a passion for energy-efficient appliances and cozy layouts.",
    platform: "Facebook",
    verifiedStatus: "home living chief editor",
    quickTip: "Prioritize multi-functional modular pieces to maintain open spaces in compact urban apartments.",
    rating: 4.7
  },
  {
    id: "inf-4",
    name: "Style Maven",
    handle: "@stylemaven",
    avatar: "https://i.pravatar.cc/300?u=stylemaven",
    bio: "Dhaka-based streetwear curator and wardrobe styling consultant.",
    platform: "Instagram",
    verifiedStatus: "verified lifestyle creator",
    quickTip: "Standard sneakers pair exceptionally well with semi-formal linen trousers.",
    rating: 4.6
  },
  {
    id: "inf-5",
    name: "BB Tech Reviews",
    handle: "@bbtech",
    avatar: "https://i.pravatar.cc/300?u=bbtech",
    bio: "Unbiased tech unboxings, deep specs breakdowns, and local product comparisons.",
    platform: "YouTube",
    verifiedStatus: "certified gadget reviewer",
    quickTip: "For true premium audio quality, always enable high-definition codec streaming.",
    rating: 4.9
  }
];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const rawQuery = searchParams.get('q') || '';
  const [localInput, setLocalInput] = useState(rawQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'brands' | 'deals' | 'guides' | 'coupons' | 'categories' | 'influencers' | 'whats-on' | 'compares'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'newest'>('default');
  const [maxPrice, setMaxPrice] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const { customOverviews } = useDashboard();
  const { allProducts, allBrands, allCategories, allCreators, allGuides, siteConfig } = useGlobalState();
  const productSource = allProducts.length > 0 ? allProducts : PRODUCTS;
  const brandSource = allBrands.length > 0
    ? allBrands.map((b) => ({ ...b, products: (b as any).followers ?? (b as any).products ?? 0, rating: (b as any).ratings ?? (b as any).rating ?? 0 }))
    : BRANDS;
  const categorySource = allCategories.length > 0
    ? allCategories.map((c) => ({ id: c.id, name: c.name, icon: c.icon }))
    : CATEGORIES;
  const guideSource = allGuides.length > 0 ? allGuides : mockGuides;
  const creatorSource = allCreators.length > 0 ? allCreators : (Array.isArray(CREATORS) ? CREATORS : Object.values(CREATORS));

  const searchFilterCount = useMemo(() => {
    let count = 0;
    if (activeTab !== 'all') count += 1;
    if (rawQuery.trim()) count += 1;
    if (sortBy !== 'default') count += 1;
    if (maxPrice !== 'all') count += 1;
    if (categoryFilter !== 'all') count += 1;
    if (inStockOnly) count += 1;
    return count;
  }, [activeTab, rawQuery, sortBy, maxPrice, categoryFilter, inStockOnly]);

  useRegisterPageFilters({
    pageName: 'Search',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#E8500A]" />
        </div>
        <input
          type="text"
          value={rawQuery}
          onChange={(e) => {
            const val = e.target.value;
            setLocalInput(val);
            setSearchParams(val ? { q: val } : {});
          }}
          placeholder="Search all content..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'all', label: '🌐 All results', active: activeTab === 'all', onClick: () => setActiveTab('all') },
      { id: 'products', label: '🛍️ Products', active: activeTab === 'products', onClick: () => setActiveTab('products') },
      { id: 'brands', label: '🏢 Brands', active: activeTab === 'brands', onClick: () => setActiveTab('brands') },
      { id: 'deals', label: '🏷️ Deals', active: activeTab === 'deals', onClick: () => setActiveTab('deals') },
      { id: 'guides', label: '📖 Guides', active: activeTab === 'guides', onClick: () => setActiveTab('guides') },
      { id: 'coupons', label: '🎫 Coupons', active: activeTab === 'coupons', onClick: () => setActiveTab('coupons') },
      { id: 'influencers', label: '👥 Influencers', active: activeTab === 'influencers', onClick: () => setActiveTab('influencers') }
    ],
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
                ...categorySource.slice(0, 12).map((c: any) => ({
                  value: c.name,
                  label: c.name,
                })),
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
    activeFilterCount: searchFilterCount,
    onClearAll: () => {
      setActiveTab('all');
      setLocalInput('');
      setSearchParams({});
      setSortBy('default');
      setMaxPrice('all');
      setCategoryFilter('all');
      setInStockOnly(false);
    }
  }, [rawQuery, activeTab, sortBy, maxPrice, categoryFilter, inStockOnly, categorySource, searchFilterCount]);

  // Sync state with url parameter
  React.useEffect(() => {
    setLocalInput(rawQuery);
  }, [rawQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localInput.trim()) {
      setSearchParams({ q: localInput.trim() });
    } else {
      toast.error('Type a query to search!');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredGuides = useMemo(() => {
    if (!rawQuery.trim()) return guideSource;
    const q = rawQuery.toLowerCase();
    return guideSource.filter((g: any) =>
      g.title?.toLowerCase().includes(q) ||
      g.author?.toLowerCase().includes(q) ||
      g.tags?.some((t: any) => String(t).toLowerCase().includes(q))
    );
  }, [rawQuery, guideSource]);

  const filteredCreators = useMemo(() => {
    const creatorList = creatorSource;
    if (!rawQuery.trim()) return creatorList;
    const q = rawQuery.toLowerCase();
    return creatorList.filter((c: any) =>
      c.name?.toLowerCase().includes(q) ||
      c.handle?.toLowerCase().includes(q) ||
      c.bio?.toLowerCase().includes(q)
    );
  }, [rawQuery, creatorSource]);

  const filteredProducts = useMemo(() => {
    let results = !rawQuery.trim()
      ? productSource
      : productSource.filter((p) => {
          const q = rawQuery.toLowerCase();
          return (
            p.title.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q)
          );
        });

    if (categoryFilter !== 'all') {
      results = results.filter((p) => p.category === categoryFilter || (p as any).categoryName === categoryFilter);
    }
    if (maxPrice !== 'all') {
      const cap = Number(maxPrice);
      if (!Number.isNaN(cap)) results = results.filter((p) => Number(p.price) <= cap);
    }
    if (inStockOnly) {
      results = results.filter((p) => Number((p as any).stock ?? 1) > 0);
    }
    if (sortBy === 'price_asc') {
      results = [...results].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price_desc') {
      results = [...results].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'newest') {
      results = [...results].sort((a, b) => Number((b as any).id) - Number((a as any).id));
    }
    return results;
  }, [rawQuery, productSource, categoryFilter, maxPrice, inStockOnly, sortBy]);

  const combinedCreators = useMemo(() => {
    const uniqueCreatorsMap = new Map<string, any>();
    
    // First, add all filtered creators from CREATORS
    filteredCreators.forEach((c: any) => {
      if (c && c.name) {
        uniqueCreatorsMap.set(c.name.toLowerCase(), {
          id: c.id,
          name: c.name,
          handle: c.handle || `@${c.name.toLowerCase().replace(/\s+/g, '')}`,
          avatar: c.avatar || `https://i.pravatar.cc/300?u=${c.id}`,
          bio: c.bio || '',
          platform: Array.isArray(c.platforms) ? c.platforms[0] : (c.platform || 'YouTube'),
          verifiedStatus: c.verifiedStatus || 'verified expert contributor',
          quickTip: c.quickTip || '',
          rating: c.rating || 4.8
        });
      }
    });

    // Then, add matched local INFLUENCERS to deduplicate by name
    const q = rawQuery.toLowerCase().trim();
    const matchedLocalInfluencers = INFLUENCERS.filter(inf => {
      if (!q) return true;
      return inf.name.toLowerCase().includes(q) || 
             inf.handle.toLowerCase().includes(q) || 
             inf.bio.toLowerCase().includes(q);
    });

    matchedLocalInfluencers.forEach((inf: any) => {
      uniqueCreatorsMap.set(inf.name.toLowerCase(), inf);
    });

    return Array.from(uniqueCreatorsMap.values());
  }, [filteredCreators, rawQuery]);

  // Perform multi-category unified index searching & auto scoring ranking
  const searchResults = useMemo(() => {
    const q = rawQuery.toLowerCase().trim();
    if (!q) {
      return {
        products: [],
        brands: [],
        deals: [],
        guides: [],
        coupons: [],
        categories: [],
        influencers: [],
        whatsOn: [],
        compares: [],
        total: 0
      };
    }

    // Helper scoring function to adhere strictly to the priority ranking rules
    const getPriorityScore = (
      item: any,
      titleStr: string,
      isHotFeatured: boolean,
      categoryStr?: string,
      tagStr?: string,
      overviewResult?: { matchedIn: string; snippet: string } | null
    ) => {
      let score = 0;
      const titleLower = titleStr.toLowerCase();

      // Rule 1: Exact Name Match (+1000)
      if (titleLower === q) {
        score += 1000;
      }
      // Rule 2: Exact Tag Match (+800)
      else if (tagStr && tagStr.toLowerCase() === q) {
        score += 800;
      }
      // Rule 3: Category Match (+600)
      else if (categoryStr && categoryStr.toLowerCase() === q) {
        score += 600;
      }
      // Rule 4: Overview Content Match (+400)
      else if (overviewResult) {
        score += 400;
      }
      // Rule 5: Partial Match (+200)
      else if (titleLower.includes(q)) {
        score += 200;
      }

      // Secondary tie-breakers based on rating or featured hot indicators
      if (item.rating && item.rating >= 4.8) {
        score += 50;
      }
      if (isHotFeatured) {
        score += 30;
      }

      return score;
    };

    // SEARCH DATABASES & CALCULATE INDIVIDUAL SCORES
    
    // 1. PRODUCTS
    const matchedProducts = productSource.map(p => {
      const pOverviews = getProductOverviews(p.id, p.title, p.category, customOverviews);
      const matchedOverview = matchOverviewContent(pOverviews, q);

      const match = p.title.toLowerCase().includes(q) || 
                    p.brand.toLowerCase().includes(q) || 
                    p.category.toLowerCase().includes(q) || 
                    (p.description || '').toLowerCase().includes(q) ||
                    !!matchedOverview;

      if (!match) return null;
      const isHot = p.tag === 'HOT' || p.tag === 'NEW';
      return {
        ...p,
        matchOverview: matchedOverview,
        score: getPriorityScore(p, p.title, isHot, p.category, p.tag, matchedOverview)
      };
    }).filter(Boolean) as any[];

    // 2. BRANDS
    const matchedBrands = brandSource.map(b => {
      const bOverviews = getBrandOverviews(b.name, customOverviews);
      const matchedOverview = matchOverviewContent(bOverviews, q);

      const match = b.name.toLowerCase().includes(q) || 
                    b.category.toLowerCase().includes(q) ||
                    !!matchedOverview;

      if (!match) return null;
      return {
        ...b,
        matchOverview: matchedOverview,
        score: getPriorityScore(b, b.name, b.rating >= 4.8, b.category, undefined, matchedOverview)
      };
    }).filter(Boolean) as any[];

    // 3. DEALS
    const productDeals = productSource.filter(p => p.originalPrice || p.tag === 'SALE' || p.tag === 'HOT').map(p => {
      const pOverviews = getProductOverviews(p.id, p.title, p.category, customOverviews);
      const matchedOverview = matchOverviewContent(pOverviews, q);

      const match = p.title.toLowerCase().includes(q) || 
                    p.brand.toLowerCase().includes(q) ||
                    !!matchedOverview;

      if (!match) return null;
      return {
        type: 'product_deal',
        id: p.id,
        title: p.title,
        brand: p.brand,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        tag: p.tag || 'DEAL',
        matchOverview: matchedOverview,
        score: getPriorityScore(p, p.title, true, p.category, p.tag, matchedOverview)
      };
    }).filter(Boolean) as any[];

    const brandDealsMatches = BRAND_DEALS.map(d => {
      const match = d.name.toLowerCase().includes(q) || 
                    d.dealHighlight.toLowerCase().includes(q);
      if (!match) return null;
      return {
        type: 'brand_deal',
        id: d.id,
        title: d.dealHighlight,
        brand: d.name,
        logo: d.logo,
        bgClass: d.bgClass,
        score: getPriorityScore(d, d.dealHighlight, true)
      };
    }).filter(Boolean) as any[];

    const matchedDeals = [...productDeals, ...brandDealsMatches];

    // 4. GUIDES & RECOMMENDATIONS
    const matchedGuides = filteredGuides.map(g => {
      const isHighViews = (g.views || '').includes('M') || (g.views || '').includes('K');
      return {
        ...g,
        score: getPriorityScore(g, g.title, isHighViews, undefined, g.views)
      };
    });

    // 5. COUPONS & PROMO CODES
    const matchedCoupons = PROMO_CODES.map(c => {
      const match = c.brandName.toLowerCase().includes(q) || 
                    c.code.toLowerCase().includes(q) || 
                    c.discount.toLowerCase().includes(q);
      if (!match) return null;
      return {
        ...c,
        score: getPriorityScore(c, c.brandName + ' ' + c.code, true)
      };
    }).filter(Boolean) as any[];

    // 6. CATEGORIES
    const matchedCategories = categorySource.map(c => {
      const match = c.name.toLowerCase().includes(q);
      if (!match) return null;
      return {
        ...c,
        score: getPriorityScore(c, c.name, false)
      };
    }).filter(Boolean) as any[];

    // 7. INFLUENCERS & CREATORS
    const matchedInfluencers = combinedCreators.map(inf => {
      return {
        ...inf,
        score: getPriorityScore(inf, inf.name, true, inf.rating)
      };
    });

    // 8. WHAT'S ON — brand sponsored posts
    const matchedWhatsOn = filterBrandPosts({ query: q }).map((post) => ({
      ...post,
      score: getPriorityScore(post, post.title, true, post.brandName) + 100,
    }));

    const matchedCompares = COMPARE_DATABASES.map(c => {
      const match = c.title.toLowerCase().includes(q) || 
                    c.category.toLowerCase().includes(q) ||
                    q.includes('vs') || q.includes('compare');
      if (!match) return null;
      return {
        ...c,
        score: getPriorityScore(c, c.title, true)
      };
    }).filter(Boolean) as any[];

    // Sort all arrays by score priority descending
    const sortFn = (a: any, b: any) => b.score - a.score;
    matchedProducts.sort(sortFn);
    matchedBrands.sort(sortFn);
    matchedDeals.sort(sortFn);
    matchedGuides.sort(sortFn);
    matchedCoupons.sort(sortFn);
    matchedCategories.sort(sortFn);
    matchedInfluencers.sort(sortFn);
    matchedCompares.sort(sortFn);

    const total = matchedProducts.length + matchedBrands.length + matchedDeals.length + 
                  matchedGuides.length + matchedCoupons.length + matchedCategories.length + 
                  matchedInfluencers.length + matchedWhatsOn.length + matchedCompares.length;

    return {
      products: matchedProducts,
      brands: matchedBrands,
      deals: matchedDeals,
      guides: matchedGuides,
      coupons: matchedCoupons,
      categories: matchedCategories,
      influencers: matchedInfluencers,
      whatsOn: matchedWhatsOn,
      compares: matchedCompares,
      total
    };
  }, [rawQuery, filteredGuides, combinedCreators, customOverviews, productSource, brandSource, categorySource]);

  // Tab configurations
  const tabConfig = [
    { key: 'all', label: 'All Matches', count: searchResults.total },
    { key: 'products', label: 'Products', count: filteredProducts.length },
    { key: 'brands', label: 'Brand Profiles', count: searchResults.brands.length },
    { key: 'deals', label: 'Deals', count: searchResults.deals.length },
    { key: 'whats-on', label: 'Events', count: searchResults.whatsOn.length },
    { key: 'compares', label: 'Compare Results', count: searchResults.compares.length },
    { key: 'guides', label: 'Buying Guides', count: filteredGuides.length },
    { key: 'coupons', label: 'Coupons / Promos', count: searchResults.coupons.length },
    { key: 'categories', label: 'Categories', count: searchResults.categories.length },
    { key: 'influencers', label: 'Creator Profiles', count: filteredCreators.length }
  ];

  const searchNavItems = useMemo(
    () => [
      { key: 'products', label: 'Products', icon: <ShoppingBag size={13} /> },
      { key: 'brands', label: 'Brands', icon: <Award size={13} /> },
      { key: 'deals', label: 'Deals', icon: <Tag size={13} /> },
      { key: 'whats-on', label: 'Events', icon: <Sparkles size={13} /> },
      { key: 'guides', label: 'Guides', icon: <BookOpen size={13} /> },
      { key: 'coupons', label: 'Coupons', icon: <Percent size={13} /> },
      { key: 'categories', label: 'Categories', icon: <LayoutGrid size={13} /> },
      { key: 'influencers', label: 'Creators', icon: <Users size={13} /> },
      { key: 'compares', label: 'Compare', icon: <Layers size={13} /> },
    ]
      .map((item) => {
        const tab = tabConfig.find((t) => t.key === item.key);
        return {
          id: item.key,
          label: item.label,
          icon: item.icon,
          hidden: !tab || tab.count === 0,
        };
      }),
    [tabConfig],
  );

  const handleSearchNav = (id: string) => {
    setActiveTab(id as typeof activeTab);
    const resultsEl = document.getElementById('search-results');
    if (resultsEl) {
      const top = resultsEl.getBoundingClientRect().top + window.pageYOffset - 168;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-choosify-feed min-h-screen text-[#1A1A2E] pb-24 font-sans antialiased">
      <PageHeroBanner pageKey="search" />
      <HeroMarqueeTicker pageKey="search" siteConfig={siteConfig} />

      {rawQuery && (
        <div className="bg-[#000435] border-b border-white/5 py-2 px-6 text-center">
          <p className="text-white/60 text-[10px] font-mono">
            Showing {searchResults.total} matches for &quot;{rawQuery}&quot;
          </p>
        </div>
      )}

      {/* Sticky result-type navigation */}
      {rawQuery && searchResults.total > 0 && (
        <StickySectionNav
          sections={searchNavItems}
          activeId={activeTab}
          onNavigate={handleSearchNav}
          allLabel="All matches"
          profileLabel="Search results"
        />
      )}

      {/* Search results container */}
      <div id="search-results" className="max-w-7xl mx-auto px-6 py-10 scroll-mt-36">
        {!rawQuery ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-gray-800">
              Query Required
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed">
              Use the unified search bar above to look up products, brands, promo deals, categories or local influencers.
            </p>
          </div>
        ) : searchResults.total === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-primary/10 text-orange-primary flex items-center justify-center mb-4">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-gray-800">
              No Matches Found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mt-1.5 leading-relaxed">
              We couldn't locate anything matching "{rawQuery}". Try refining spelling, using other general keywords or browse categories.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-md">
              <button onClick={() => setSearchParams({ q: 'Samsung' })} className="px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase bg-white border border-gray-200 hover:border-gray-400 tracking-wider">Samsung</button>
              <button onClick={() => setSearchParams({ q: 'Apex' })} className="px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase bg-white border border-gray-200 hover:border-gray-400 tracking-wider">Apex</button>
              <button onClick={() => setSearchParams({ q: 'Phones' })} className="px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase bg-white border border-gray-200 hover:border-gray-400 tracking-wider">Phones</button>
              <button onClick={() => setSearchParams({ q: 'Aarong' })} className="px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase bg-white border border-gray-200 hover:border-gray-400 tracking-wider">Aarong</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            
            {/* 1. PRODUCTS SECTION */}
            {(activeTab === 'all' || activeTab === 'products') && searchResults.products.length > 0 && (
              <div className="bg-white rounded-[5px] border border-gray-200 p-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-6">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={15} className="text-[#E8500A]" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-[#0A0A1F]">
                      Products library ({searchResults.products.length})
                    </h2>
                  </div>
                  {activeTab === 'all' && searchResults.products.length > 4 && (
                    <button onClick={() => setActiveTab('products')} className="text-[10px] font-black uppercase text-[#E8500A] hover:underline flex items-center gap-1">
                      See All Matches <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                <div className={PRODUCT_CARD_GRID}>
                  {(activeTab === 'all' ? searchResults.products.slice(0, 6) : searchResults.products).map((product) => (
                    <div key={product.id} className="flex flex-col group min-w-0 h-full">
                      <div className="flex-1 min-h-0 flex">
                        <ProductCard product={product} />
                      </div>
                      {product.matchOverview && (
                        <div className="mt-2.5 p-2 bg-orange-primary/5 border border-orange-primary/10 rounded-[4px] text-left">
                          <p className="text-[7.5px] font-black uppercase text-[#E8500A] tracking-wider mb-0.5">
                            MATCHED IN {product.matchOverview.sectionName}
                          </p>
                          <p className="text-[8.5px] text-gray-600 font-bold leading-normal truncate italic uppercase">
                            "{product.matchOverview.snippet}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. GUIDES & RECOMMENDATIONS SECTION */}
            {(activeTab === 'all' || activeTab === 'guides') && (
              searchResults.guides.length > 0 ? (
                <div className="bg-white rounded-[5px] border border-gray-200 p-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-[#E8500A]" />
                      <h2 className="text-sm font-black uppercase tracking-widest text-[#0A0A1F]">
                        Expert Guides & Recommendations ({searchResults.guides.length})
                      </h2>
                    </div>
                    {activeTab === 'all' && searchResults.guides.length > 3 && (
                      <button 
                        onClick={() => setActiveTab('guides')} 
                        className="text-[10px] font-black uppercase text-[#E8500A] hover:underline flex items-center gap-1"
                      >
                        See All Guides <ChevronRight size={12} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(activeTab === 'all' ? searchResults.guides.slice(0, 3) : searchResults.guides).map((guide: any) => (
                      <div 
                        key={guide.id} 
                        className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col justify-between text-left"
                      >
                        <div>
                          {guide.category && (
                            <span className="inline-block bg-orange-primary/10 text-[#E8500A] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                              {guide.category}
                            </span>
                          )}
                          <h4 className="font-bold text-xs uppercase text-[#1A1D4E] line-clamp-2 leading-tight">
                            {guide.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide">
                            By {guide.author}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                          {guide.views && (
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                              {guide.views} views
                            </span>
                          )}
                          <Link 
                            to={`/guides/${guide.id}`}
                            className="text-[9px] font-black text-[#E8500A] uppercase tracking-wider flex items-center gap-1 hover:underline"
                          >
                            Read Guide <ArrowRight size={10} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'guides' ? (
                <>
                  {filteredGuides.length === 0 && rawQuery.trim() && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <BookOpen className="w-10 h-10 text-white/20 mb-4" />
                      <p className="text-white/40 text-sm font-bold">No guides found for "{rawQuery}"</p>
                      <p className="text-white/25 text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                  {filteredGuides.length === 0 && !rawQuery.trim() && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <BookOpen className="w-10 h-10 text-white/20 mb-4" />
                      <p className="text-white/40 text-sm font-bold">Start typing to search guides</p>
                    </div>
                  )}
                </>
              ) : null
            )}

            {/* 2. BRANDS SECTION */}
            {(activeTab === 'all' || activeTab === 'brands') && searchResults.brands.length > 0 && (
              <div className="bg-white rounded-[5px] border border-gray-200 p-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-6">
                  <div className="flex items-center gap-2">
                    <Award size={15} className="text-[#E8500A]" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-[#0A0A1F]">
                      Authorized Brands ({searchResults.brands.length})
                    </h2>
                  </div>
                  {activeTab === 'all' && searchResults.brands.length > 3 && (
                    <button onClick={() => setActiveTab('brands')} className="text-[10px] font-black uppercase text-[#E8500A] hover:underline flex items-center gap-1">
                      See All Brands <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                <div className={BRAND_CARD_GRID}>
                  {(activeTab === 'all' ? searchResults.brands.slice(0, 3) : searchResults.brands).map((brand) => (
                    <BrandCardDesign key={brand.id} brand={brand} />
                  ))}
                </div>
              </div>
            )}

            {/* 3. DEALS SECTION */}
            {(activeTab === 'all' || activeTab === 'deals') && searchResults.deals.length > 0 && (
              <div className="bg-white rounded-[5px] border border-gray-200 p-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-6">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-[#E8500A]" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-[#0A0A1F]">
                      Active Campaigns & Deals ({searchResults.deals.length})
                    </h2>
                  </div>
                  {activeTab === 'all' && searchResults.deals.length > 3 && (
                    <button onClick={() => setActiveTab('deals')} className="text-[10px] font-black uppercase text-[#E8500A] hover:underline flex items-center gap-1">
                      See All Deals <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(activeTab === 'all' ? searchResults.deals.slice(0, 3) : searchResults.deals).map((deal, idx) => (
                    <div
                      key={idx}
                      className="border border-dashed border-[#E8500A]/35 rounded-[5px] p-4 bg-orange-primary/[0.02] hover:bg-orange-primary/[0.04] flex gap-4 text-left transition-colors relative"
                    >
                      {deal.type === 'product_deal' ? (
                        <>
                          <div className="w-14 h-14 bg-white rounded-[5px] overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1">
                            <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col justify-between">
                            <div>
                              <span className="bg-red-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase leading-none italic">
                                {deal.tag}
                              </span>
                              <h4 className="font-bold text-xs uppercase text-[#1A1D4E] mt-1.5 line-clamp-1">
                                {deal.title}
                              </h4>
                            </div>
                            <div className="flex items-baseline gap-1.5 mt-1">
                              <span className="text-xs font-mono font-bold text-[#E8500A]">BDT {deal.price}</span>
                              {deal.originalPrice && (
                                <span className="text-[9px] text-gray-400 line-through">BDT {deal.originalPrice}</span>
                              )}
                            </div>
                          </div>
                          <Link to={`/products/${deal.id}`} className="absolute bottom-4 right-4 text-[9px] font-black text-[#E8500A] uppercase tracking-wider flex items-center gap-0.5">
                            Shop <ChevronRight size={10} />
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 text-white flex items-center justify-center font-bold text-sm shadow-sm ${deal.bgClass || 'bg-[#0A0A1F]'}`}>
                            {deal.logo}
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col justify-center">
                            <span className="text-gray-400 text-[8px] font-black uppercase tracking-wider">BRAND DEAL</span>
                            <h4 className="font-bold text-xs uppercase text-[#1A1D4E] mt-0.5">
                              {deal.brand}
                            </h4>
                            <p className="text-[10px] font-semibold text-[#E8500A] mt-0.5 truncate uppercase">
                              {deal.title}
                            </p>
                          </div>
                          <Link to={`/brands/${deal.id}`} className="absolute bottom-4 right-4 text-[9px] font-black text-[#E8500A] uppercase tracking-wider flex items-center gap-0.5">
                            View <ChevronRight size={10} />
                          </Link>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. COUPONS & PROMOS */}
            {(activeTab === 'all' || activeTab === 'coupons') && searchResults.coupons.length > 0 && (
              <div className="bg-white rounded-[5px] border border-gray-200 p-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-6">
                  <div className="flex items-center gap-2">
                    <Percent size={15} className="text-[#E8500A]" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-[#0A0A1F]">
                      Promo Codes & Brand Coupons ({searchResults.coupons.length})
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(activeTab === 'all' ? searchResults.coupons.slice(0, 4) : searchResults.coupons).map((coupon, idx) => (
                    <div
                      key={idx}
                      className="border border-[#e8edf2] rounded-[5px] bg-white p-4.5 text-left flex flex-col justify-between hover:border-orange-primary/10 transition-colors"
                    >
                      <div>
                        <h4 className="font-black text-xs uppercase text-[#1A1D4E]">
                          {coupon.brandName}
                        </h4>
                        <p className="text-[10px] text-[#E8500A] font-bold mt-1 uppercase tracking-wide">
                          {coupon.discount}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded px-2.5 py-1 flex items-center font-mono text-[9px] font-semibold tracking-wider text-gray-700">
                          {coupon.code}
                        </div>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="p-1 px-3 bg-[#E8500A]/5 hover:bg-[#E8500A] text-[#E8500A] hover:text-white rounded text-[8px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          {copiedCode === coupon.code ? <Check size={10} /> : <Copy size={10} />}
                          {copiedCode === coupon.code ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. CATEGORIES */}
            {(activeTab === 'all' || activeTab === 'categories') && searchResults.categories.length > 0 && (
              <div className="bg-white rounded-[5px] border border-gray-200 p-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-6">
                  <div className="flex items-center gap-2">
                    <FolderOpen size={15} className="text-[#E8500A]" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-[#0A0A1F]">
                      Designated Categories ({searchResults.categories.length})
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(activeTab === 'all' ? searchResults.categories.slice(0, 5) : searchResults.categories).map((cat) => (
                    <Link
                      to={`/products?category=${encodeURIComponent(cat.name)}`}
                      key={cat.id}
                      className="px-4 py-2 bg-gray-100 hover:bg-[#0A0A1F] text-gray-700 hover:text-white rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-2 border border-transparent hover:border-white/10 shrink-0"
                    >
                      <LayoutGrid size={11} />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 7. INFLUENCERS & CREATORS SECTION */}
            {(activeTab === 'all' || activeTab === 'influencers') && (
              searchResults.influencers.length > 0 ? (
                <div className="bg-white rounded-[5px] border border-gray-200 p-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-6">
                    <div className="flex items-center gap-2">
                      <User size={15} className="text-[#E8500A]" />
                      <h2 className="text-sm font-black uppercase tracking-widest text-[#0A0A1F]">
                        Professional Influencers & Creators ({searchResults.influencers.length})
                      </h2>
                    </div>
                    {activeTab === 'all' && searchResults.influencers.length > 2 && (
                      <button onClick={() => setActiveTab('influencers')} className="text-[10px] font-black uppercase text-[#E8500A] hover:underline flex items-center gap-1">
                        See All Creators <ChevronRight size={12} />
                      </button>
                    )}
                  </div>

                  <div className={CREATOR_CARD_GRID}>
                    {(activeTab === 'all' ? searchResults.influencers.slice(0, 2) : searchResults.influencers).map((inf) => (
                      <CreatorCardDesign key={inf.id} creator={inf} />
                    ))}
                  </div>
                </div>
              ) : activeTab === 'influencers' ? (
                filteredCreators.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Users className="w-10 h-10 text-white/20 mb-4" />
                    <p className="text-white/40 text-sm font-bold">No creators found{rawQuery.trim() ? ` for "${rawQuery}"` : ''}</p>
                  </div>
                )
              ) : null
            )}

            {/* 8. WHAT'S ON SECTION */}
            {(activeTab === 'all' || activeTab === 'whats-on') && searchResults.whatsOn.length > 0 && (
              <div className="bg-white rounded-[5px] border border-gray-200 p-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-[#E8500A]" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-[#0A0A1F]">
                      What&apos;s On ({searchResults.whatsOn.length})
                    </h2>
                  </div>
                  {activeTab === 'all' && searchResults.whatsOn.length > 3 && (
                    <button onClick={() => setActiveTab('whats-on')} className="text-[10px] font-black uppercase text-[#E8500A] hover:underline flex items-center gap-1">
                      See All <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(activeTab === 'all' ? searchResults.whatsOn.slice(0, 3) : searchResults.whatsOn).map((post) => (
                    <BrandPostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* 9. COMPARE RESULTS SECTION */}
            {(activeTab === 'all' || activeTab === 'compares') && searchResults.compares.length > 0 && (
              <div className="bg-white rounded-[5px] border border-gray-200 p-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-6">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-[#E8500A]" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-[#0A0A1F]">
                      Matched Multi-Dimensional Comparisons ({searchResults.compares.length})
                    </h2>
                  </div>
                  {activeTab === 'all' && searchResults.compares.length > 3 && (
                    <button onClick={() => setActiveTab('compares')} className="text-[10px] font-black uppercase text-[#E8500A] hover:underline flex items-center gap-1">
                      See All Comparisons <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(activeTab === 'all' ? searchResults.compares.slice(0, 3) : searchResults.compares).map((compareRow, idx) => (
                    <Link
                      to={compareRow.route}
                      key={idx}
                      className="border border-[#e8edf2] hover:border-orange-primary/30 rounded-[5px] p-4 flex flex-col justify-between bg-white hover:shadow-soft transition-all text-left"
                    >
                      <div>
                        <span className="bg-orange-primary/10 text-[#E8500A] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                          {compareRow.category} Comparisons
                        </span>
                        <h4 className="font-bold text-xs uppercase text-[#1A1D4E]">
                          {compareRow.title}
                        </h4>
                      </div>
                      <span className="mt-4 text-[9px] text-[#E8500A] font-black uppercase tracking-wider flex items-center gap-0.5">
                        Open Side-By-Side Matrix <ChevronRight size={10} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
