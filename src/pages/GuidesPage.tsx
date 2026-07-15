import React, { useState } from 'react';
import { 
  Search, ArrowRight, Sparkles, Users, CheckCircle2, 
  ShieldCheck, Bot, PlaySquare, BookOpen, Scale, 
  ListOrdered, Lightbulb, Flame, LayoutGrid, MessageSquare,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRegisterPageFilters } from '../components/FilterEngine';
import { ProductCard } from '../components/ProductCard';
import { SpotlightCard } from '../components/SpotlightCard';
import { Button } from '../components/ui/buttons/Button';
import { Badge } from '../components/ui/badges/Badge';
import { SearchInput } from '../components/ui/forms/Input';
import { FilterChip } from '../components/ui/navigation/FilterChip';
import { Footer } from '../components/Footer';
import { DiscoverHero, DiscoverCategoryNav, DiscoverFilterBar } from '../components/ui/discovery';
import { CreatorCard } from '../components/CreatorCard';
import { CreatorReviewCard } from '../components/CreatorReviewCard';
import { PublicReviewCard } from '../components/PublicReviewCard';
import { TrustStatementCard } from '../components/ui/trust/TrustStatementCard';
import { TrustScoreCard } from '../components/ui/trust/TrustScoreCard';
import { CalloutCard } from '../components/ui/content/CalloutCard';

const topCreatorsData = [
  {
    id: 'creator-techworld',
    name: 'Tech World BD',
    handle: '@techworldbd',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
    bestFor: 'Verified Expert',
    platforms: ['youtube', 'instagram'],
    rating: 4.9,
    reviews: 128,
    followersCount: '452K',
    trustScore: 98,
    score: 9.8,
    reviewsCount: 128,
    coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80',
    isFeatured: true
  },
  {
    id: 'creator-gadgetgear',
    name: 'Gadget & Gear',
    handle: '@gadgetgear',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&q=80',
    bestFor: 'Tech Creator',
    platforms: ['youtube', 'tiktok'],
    rating: 4.8,
    reviews: 98,
    followersCount: '312K',
    trustScore: 95,
    score: 9.5,
    reviewsCount: 98,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80'
  },
  {
    id: 'creator-stylewithme',
    name: 'Style With Me',
    handle: '@stylewithme',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80',
    bestFor: 'Fashion Creator',
    platforms: ['instagram', 'pinterest'],
    rating: 4.7,
    reviews: 76,
    followersCount: '245K',
    trustScore: 92,
    score: 9.2,
    reviewsCount: 76,
    coverImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80'
  },
  {
    id: 'creator-productivitylab',
    name: 'Productivity Lab',
    handle: '@productivitylab',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80',
    bestFor: 'Lifestyle Creator',
    platforms: ['youtube', 'instagram', 'tiktok'],
    rating: 4.6,
    reviews: 64,
    followersCount: '198K',
    trustScore: 90,
    score: 9.0,
    reviewsCount: 64,
    coverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80'
  }
];

const communityReviewsData = [
  {
    name: 'Tanvir Hossain',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
    verified: true,
    rating: 5,
    comment: "I have been using Samsung products for years and they never disappoint. Excellent build quality and amazing performance.",
    date: '2 days ago',
    helpful: 124,
    productName: 'Samsung Galaxy S24 Ultra'
  },
  {
    name: 'Nusrat Jahan',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
    verified: true,
    rating: 4.8,
    comment: "The Bespoke refrigerator is perfect for our home. Stylish design and super efficient cooling.",
    date: '6 days ago',
    helpful: 60,
    productName: 'Samsung Bespoke 4-Door Refrigerator'
  }
];

const categoriesData = [
  {
    title: 'Smartphones',
    count: 128,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&q=80',
    description: 'In-depth smartphone buying guides and comparison reviews.',
    guides: [
      'Best Phones Under 20,000',
      'Flagship Phones Comparison',
      'Camera Phones Guide',
      'Battery Life Comparison'
    ]
  },
  {
    title: 'Laptops',
    count: 98,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&q=80',
    description: 'Find the perfect laptop for work, study, or high-end gaming.',
    guides: [
      'Best Laptops for Students',
      'Gaming Laptops Guide',
      'MacBooks vs Windows',
      'Budget Laptops'
    ]
  },
  {
    title: 'Audio',
    count: 76,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=100&q=80',
    description: 'From wireless earbuds to high-fidelity home theater speakers.',
    guides: [
      'Headphones Buying Guide',
      'Wireless Earbuds Guide',
      'Speakers Comparison',
      'Soundbars Guide'
    ]
  },
  {
    title: 'Cameras',
    count: 55,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&q=80',
    description: 'Guides on camera bodies, lens selections, and shooting tips.',
    guides: [
      'DSLR vs Mirrorless',
      'Best Cameras for Beginners',
      'Videography Cameras',
      'Lens Buying Guide'
    ]
  },
  {
    title: 'Gaming',
    count: 32,
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=100&q=80',
    description: 'Top accessories, custom PC builds, and console reviews.',
    guides: [
      'Gaming PC Build Guide',
      'Gaming Accessories',
      'Monitor Buying Guide',
      'Console Comparison'
    ]
  },
  {
    title: 'Home Appliances',
    count: 60,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&q=80',
    description: 'Smart appliances and home devices for clean local living.',
    guides: [
      'Refrigerator Guide',
      'Washing Machine Guide',
      'Air Conditioner Guide',
      'Kitchen Appliances'
    ]
  }
];

const discoverProductsData = [
  {
    id: 'prod-iphone-16',
    title: 'Apple iPhone 16 Pro Max',
    price: 159999,
    originalPrice: 199999,
    discount: '-20%',
    badge: 'Official',
    rating: '4.9',
    reviews: '124',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80'
  },
  {
    id: 'prod-samsung-ultra',
    title: 'Samsung Galaxy S24 Ultra',
    price: 135000,
    originalPrice: 145000,
    discount: '-7%',
    badge: 'Best Seller',
    rating: '4.8',
    reviews: '98',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&q=80'
  },
  {
    id: 'prod-macbook-m3',
    title: 'Apple MacBook Pro M3',
    price: 185000,
    originalPrice: 200000,
    discount: '-8%',
    badge: 'Featured',
    rating: '4.9',
    reviews: '76',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&q=80'
  },
  {
    id: 'prod-sony-xm5',
    title: 'Sony WH-1000XM5 Wireless Headphones',
    price: 38500,
    originalPrice: 42000,
    discount: '-8%',
    badge: 'Recommended',
    rating: '4.7',
    reviews: '64',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=300&q=80'
  },
  {
    id: 'prod-dji-mini',
    title: 'DJI Mini 4 Pro Drone Fly More Combo',
    price: 115000,
    originalPrice: 125000,
    discount: '-8%',
    badge: 'New',
    rating: '4.8',
    reviews: '32',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=300&q=80'
  }
];

export function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('Trending');
  const [followedCreators, setFollowedCreators] = useState<string[]>(['Tech World BD']);

  // Register with FilterEngine so floating bar works if triggered
  useRegisterPageFilters({
    pageName: 'Discover & Guides',
    renderSearch: () => (
      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search guides, reviews, articles..."
        className="w-full h-9 text-[11px]"
      />
    ),
    renderFilters: () => (
      <div className="flex gap-2">
        {['All', 'Buying Guides', 'Videos', 'Creator Reviews', 'Collections'].map((f) => (
          <FilterChip
            key={f}
            isActive={activeCategory === f}
            onClick={() => setActiveCategory(f)}
          >
            {f}
          </FilterChip>
        ))}
      </div>
    ),
    onClearAll: () => {
      setSearchQuery('');
      setActiveCategory('All');
      setActiveFilter('Trending');
    }
  }, [searchQuery, activeCategory, activeFilter]);

  const toggleFollowCreator = (creatorName: string) => {
    if (followedCreators.includes(creatorName)) {
      setFollowedCreators(prev => prev.filter(n => n !== creatorName));
      toast.success(`Unfollowed ${creatorName}`);
    } else {
      setFollowedCreators(prev => [...prev, creatorName]);
      toast.success(`Following ${creatorName}`);
    }
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Check out this amazing article on Choosify: ${title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/discover?share=${encodeURIComponent(title)}`);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F4F7F9] text-[#1A1A2E]" id="discover-root">
      
      {/* 1. HERO SECTION (Dark Navy Theme #000435) */}
      <DiscoverHero
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Discover' }
        ]}
        title={
          <>
            Smarter Choices,<br />
            Better <span className="text-[#FF5B00]">Decisions.</span>
          </>
        }
        subtitle="Explore expert guides, creator reviews, videos, collections, brand stories and real experiences."
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onSearchSubmit={(query) => toast.success(`Searching for "${query || 'everything'}"...`)}
        trendingSearches={[
          'iPhone 15 Pro Max',
          'Best Laptops 2025',
          'Running Shoes',
          'Smartwatches',
          'Air Fryer'
        ]}
        onTrendingSearchClick={(item) => {
          setSearchQuery(item);
          toast.success(`Filtering by: ${item}`);
        }}
        backgroundIllustrationUrl="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80"
        featuredStatistic={{
          tag: "EDITOR'S PICK",
          title: "Best Tech of Summer 2025",
          meta: "12 min read",
          onClick: () => toast.success("Opening Editor's Pick!")
        }}
        onShareClick={() => handleShare("Choosify Discover Platform")}
      />

      {/* 2. CATEGORY NAVIGATION (Full viewport wide horizontal scroll) */}
      <DiscoverCategoryNav
        categories={[
          { label: 'All', icon: Sparkles },
          { label: 'Buying Guides', icon: BookOpen },
          { label: 'Videos', icon: PlaySquare },
          { label: 'Creator Reviews', icon: Users },
          { label: 'Collections', icon: LayoutGrid },
          { label: 'Brand Stories', icon: Lightbulb },
          { label: 'Campaigns', icon: Flame },
          { label: 'Blogs', icon: MessageSquare },
          { label: 'Deals', icon: Scale },
          { label: 'Reels', icon: PlaySquare },
          { label: 'Live', icon: Bot }
        ]}
        activeCategory={activeCategory}
        onCategoryChange={(category) => {
          setActiveCategory(category);
          toast.success(`Viewing format: ${category}`);
        }}
      />

      {/* 3. FILTER BAR ROW */}
      <DiscoverFilterBar
        filters={[
          { id: 'Newest', label: 'Newest' },
          { id: 'Trending', label: 'Trending' },
          { id: 'Most Viewed', label: 'Most Viewed' },
          { id: 'Most Helpful', label: 'Most Helpful' },
          { id: 'Expert Picks', label: 'Expert Picks' },
          { id: 'Official', label: 'Official' },
          { id: 'Verified', label: 'Verified' }
        ]}
        activeFilter={activeFilter}
        onFilterChange={(filterId) => {
          setActiveFilter(filterId);
          toast.success(`Sorting by: ${filterId}`);
        }}
        onFiltersClick={() => toast.success('Opening extended filter sheet...')}
        aiDiscoverButton={{
          text: 'AI Discover',
          onClick: () => toast.success('Initializing intelligent AI discovery recommendations...')
        }}
      />

      {/* 4. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-10 py-8 flex-1 flex flex-col space-y-12 text-left" id="discover-main-content">
        
        {/* SECTION 4.1: FEATURED DISCOVER STORIES (As shown in screenshot) */}
        <section id="featured-discover-stories">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-black text-[#000435] uppercase tracking-tight">FEATURED DISCOVER STORIES</h3>
              <p className="text-[10px] text-slate-400 font-bold">Top curated content from our editorial expert team</p>
            </div>
            <Button 
              onClick={() => toast.success('Loading all featured content...')}
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight size={12} />}
              className="text-[11px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-wider p-0 h-auto"
            >
              View all featured
            </Button>
          </div>

          {/* Grid Layout containing 4 large high-contrast visual cards */}
          <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { 
                id: 'shoes-guide', 
                title: "Best Running Shoes for 2026", 
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
                readTime: "12 MIN",
                type: "article",
                views: "12K",
                excerpt: "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product."
              },
              { 
                id: 'samsung-s24-review', 
                title: "30 Day Review: Samsung S24 Ultra", 
                image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80",
                readTime: "18 MIN",
                type: "video",
                views: "18K",
                excerpt: "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product."
              },
              { 
                id: 'minimal-desk-ideas', 
                title: "Minimal Desk Setup Ideas for 2025", 
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
                readTime: "8 ITEMS",
                type: "article",
                views: "8K",
                excerpt: "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product."
              },
              { 
                id: 'aarong-summer-story', 
                title: "Behind Aarong's Summer Collection", 
                image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
                readTime: "10 MIN",
                type: "article",
                views: "10K",
                excerpt: "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product."
              }
            ].map((guide, idx) => (
              <SpotlightCard 
                key={idx} 
                variant="standard"
                title={guide.title}
                image={guide.image}
                desc={guide.excerpt}
                readTime={guide.readTime}
                badge="RECOMMENDED"
                badgeBg="bg-[#FF5B00]"
              />
            ))}
          </div>
        </section>

        {/* SECTION 4.2: TRENDING NOW + BROWSE BY FORMAT */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" id="trending-and-formats">
          
          {/* Left Block: Trending Now List */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            <div className="flex flex-col text-left">
              <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">TRENDING NOW</h3>
              <p className="text-[10px] text-slate-400 font-bold">What's hot on Choosify right now</p>
            </div>

            {/* Horizontal scrolling or grid of trending items */}
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { 
                  id: 'trending-1',
                  title: 'Best Laptop for Students in 2025', 
                  image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&q=80',
                  readTime: '10 MIN', 
                  views: '15.2K',
                  type: 'article',
                  excerpt: "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product."
                },
                { 
                  id: 'trending-2',
                  title: 'Best Smartwatches Under BDT 10,000', 
                  image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=150&q=80',
                  readTime: '8 MIN', 
                  views: '12.8K',
                  type: 'article',
                  excerpt: "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product."
                },
                { 
                  id: 'trending-3',
                  title: 'Top 5 ANC Earbuds Compared', 
                  image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&q=80',
                  readTime: '7 MIN', 
                  views: '9.6K',
                  type: 'article',
                  excerpt: "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product."
                },
                { 
                  id: 'trending-4',
                  title: 'iPhone 15 vs Samsung S24: Which is Better?', 
                  image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150&q=80',
                  readTime: '12 MIN', 
                  views: '18.4K',
                  type: 'article',
                  excerpt: "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product."
                },
                { 
                  id: 'trending-5',
                  title: 'DJI Mini 4 Pro - Full Review', 
                  image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=150&q=80',
                  readTime: '15 MIN', 
                  views: '18.1K',
                  type: 'video',
                  excerpt: "Explore our comprehensive breakdown and technical deep-dive into this revolutionary product."
                }
              ].map((guide, idx) => (
                <SpotlightCard 
                  key={idx} 
                  variant="standard"
                  title={guide.title}
                  image={guide.image}
                  desc={guide.excerpt}
                  readTime={guide.readTime}
                  badge="TRENDING"
                  badgeBg="bg-[#FF5B00]"
                />
              ))}
            </div>
          </div>

          {/* Right Block: Browse by Format List */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-left">
                <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">BROWSE BY FORMAT</h3>
                <p className="text-[10px] text-slate-400 font-bold">Choose how you want to discover</p>
              </div>
              <Button 
                onClick={() => toast.success('Loading format overview...')}
                variant="ghost"
                size="sm"
                className="text-[10px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-widest block shrink-0 p-0 h-auto"
              >
                View all formats &rarr;
              </Button>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-5.5 space-y-3.5 shadow-sm">
              {[
                { label: 'Videos', desc: 'Watch expert videos', color: 'bg-red-50 text-red-500 border-red-100', icon: PlaySquare },
                { label: 'Buying Guides', desc: 'In-depth buying help', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: BookOpen },
                { label: 'Reviews', desc: 'Honest product reviews', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
                { label: 'Comparisons', desc: 'Compare products side-by-side', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Scale },
                { label: 'Lists & Rankings', desc: 'Top picks & rankings', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: ListOrdered },
                { label: 'How-To & Tips', desc: 'Learn & improve your device usage', color: 'bg-orange-50 text-[#FF5B00] border-orange-100', icon: Lightbulb }
              ].map((format, idx) => {
                const IconComponent = format.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveCategory(format.label);
                      toast.success(`Active Format: ${format.label}`);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${format.color}`}>
                        <IconComponent size={16} />
                      </div>
                      <div>
                        <p className="text-[11.5px] font-extrabold text-[#000435] leading-none mb-1 group-hover:text-[#FF5B00] transition-colors">{format.label}</p>
                        <p className="text-[9.5px] text-slate-400 font-semibold leading-none">{format.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-slate-300 group-hover:text-[#FF5B00] transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>

        </section>

        {/* SECTION 4.3: GUIDES BY PRODUCT TYPE */}
        <section id="guides-by-product-type">
          <div className="flex justify-between items-end mb-5">
            <div className="text-left">
              <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">GUIDES BY PRODUCT TYPE</h3>
              <p className="text-[10px] text-slate-400 font-bold">Explore our comprehensive buying guides</p>
            </div>
            <Button 
              onClick={() => toast.success('Loading all categories...')}
              variant="ghost"
              size="sm"
              className="text-[11px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-wider p-0 h-auto"
            >
              View all categories &rarr;
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoriesData.map((category, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <h4 className="text-xs font-black text-[#000435] uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100 flex justify-between items-center">
                    <span>{category.title}</span>
                    <Badge variant="orange" className="bg-[#FF5B00]/5 text-[#FF5B00] border-transparent shadow-none px-2 py-0.5 rounded-full font-bold text-[9px] normal-case">Category</Badge>
                  </h4>
                  
                  {category.description && (
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-3">
                      {category.description}
                    </p>
                  )}
                  
                  <ul className="space-y-3">
                    {category.guides.map((guide, guideIdx) => (
                      <li key={guideIdx}>
                        <Button 
                          onClick={() => toast.success(`Opening: ${guide}`)}
                          variant="ghost"
                          size="sm"
                          className="text-slate-600 hover:text-[#FF5B00] text-xs font-bold leading-tight flex items-center gap-1.5 text-left p-0 h-auto font-sans font-medium"
                        >
                          <span className="text-[#FF5B00]">•</span>
                          <span>{guide}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <Button 
                    onClick={() => toast.success(`Viewing ${category.count} ${category.title.toLowerCase()} guides...`)}
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowRight size={10} />}
                    className="text-[9.5px] font-black text-slate-400 hover:text-[#FF5B00] uppercase tracking-wider p-0 h-auto"
                  >
                    View All ({category.count})
                  </Button>
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4.3.5: RELATED PRODUCT DISCOVERY */}
        <section id="related-product-discovery" className="space-y-5">
          <div className="flex justify-between items-end">
            <div className="text-left">
              <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">TRENDING PRODUCT DISCOVERY</h3>
              <p className="text-[10px] text-slate-400 font-bold">Discover top-rated verified products matched for your guides</p>
            </div>
            <Button 
              onClick={() => toast.success('Loading all trending products...')}
              variant="ghost"
              size="sm"
              className="text-[11px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-wider p-0 h-auto"
            >
              View all products &rarr;
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {discoverProductsData.filter(p => 
              searchQuery === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {/* Graceful empty state placeholder */}
            {discoverProductsData.filter(p => 
              searchQuery === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <div className="col-span-full py-12 text-center flex flex-col items-center justify-center bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Search size={18} />
                </div>
                <h4 className="text-xs font-black text-[#000435] uppercase tracking-tight mb-1">No Matching Products</h4>
                <p className="text-[10px] text-slate-400 font-bold max-w-xs">We couldn't find any recommended products matching "{searchQuery}". Try a different search term!</p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4.4: EXPERT'S PICKS & TOP CREATORS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" id="experts-and-creators">
          
          {/* Left Block: Expert's Picks */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-left">
                <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">EXPERT'S PICKS</h3>
                <p className="text-[10px] text-slate-400 font-bold">Handpicked by our expert team</p>
              </div>
              <Button 
                onClick={() => toast.success('Loading all expert picks...')}
                variant="ghost"
                size="sm"
                className="text-[10px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-widest block shrink-0 p-0 h-auto"
              >
                View all picks &rarr;
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
              {/* 3 list items on the left */}
              <div className="sm:col-span-5 space-y-3.5 flex flex-col justify-between">
                {[
                  {
                    num: '1',
                    title: 'Best 4K TVs for Home Theater in 2025',
                    image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=80&q=80',
                    readTime: '9 min read',
                    views: '12.6K'
                  },
                  {
                    num: '2',
                    title: 'Camera Settings Every Beginner Should Know',
                    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=80&q=80',
                    readTime: '7 min read',
                    views: '8.9K'
                  },
                  {
                    num: '3',
                    title: 'How to Choose the Right Gaming Monitor',
                    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=80&q=80',
                    readTime: '6 min read',
                    views: '7.4K'
                  }
                ].map((pick) => (
                  <div 
                    key={pick.num}
                    onClick={() => toast.success(`Opening: ${pick.title}`)}
                    className="bg-white border border-slate-200/60 p-3.5 rounded-2xl flex items-start gap-3 hover:shadow-sm transition-all cursor-pointer group text-left flex-1"
                  >
                    <span className="text-sm font-black text-indigo-600 shrink-0 mt-0.5">{pick.num}</span>
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                      <img src={pick.image} alt={pick.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <h5 className="text-[10.5px] font-extrabold text-[#000435] leading-snug line-clamp-2 uppercase tracking-tight group-hover:text-[#FF5B00] transition-colors">{pick.title}</h5>
                      <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold font-mono mt-1">
                        <span>{pick.readTime}</span>
                        <span className="flex items-center gap-0.5 text-slate-500">
                          <Flame size={8} className="text-[#FF5B00]" />
                          {pick.views}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Huge editor's pick on the right */}
              <div className="sm:col-span-7 h-full flex flex-col">
                <SpotlightCard 
                  variant="featured"
                  title="Best Noise Cancelling Headphones in 2025"
                  image="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80"
                  readTime="10 MIN"
                  desc="Dive into our comprehensive analysis and expert evaluation of this product. We explore every feature."
                  badge="EDITOR'S PICK"
                  badgeBg="bg-[#000435]"
                />
              </div>
            </div>
          </div>

          {/* Right Block: Top Creators */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="flex justify-between items-end">
              <div className="text-left">
                <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">TOP CREATORS</h3>
                <p className="text-[10px] text-slate-400 font-bold">Discover trusted voices</p>
              </div>
              <Button 
                onClick={() => toast.success('Loading creators directory...')}
                variant="ghost"
                size="sm"
                className="text-[10px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-widest p-0 h-auto"
              >
                View all creators &rarr;
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {topCreatorsData.map((creator, idx) => {
                const isFollowing = followedCreators.includes(creator.name);
                return (
                  <div key={creator.id} className="relative group/rank">
                    {/* Floating Ranking Badge */}
                    <div className="absolute -top-3.5 -left-3.5 w-8 h-8 rounded-full bg-[#000435] border border-white/20 text-white flex items-center justify-center font-black text-xs shadow-lg z-30">
                      #{idx + 1}
                    </div>
                    
                    {/* Floating Follow Button at Top-Right */}
                    <div className="absolute top-3 right-3 z-30">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFollowCreator(creator.name);
                        }}
                        variant={isFollowing ? 'secondary' : 'cta'}
                        className={`text-[9px] font-black uppercase tracking-wider h-7 px-3 rounded-lg shadow-md ${
                          isFollowing 
                            ? 'bg-slate-950/85 backdrop-blur-md border border-white/10 text-white/90 hover:bg-red-600 hover:text-white hover:border-transparent' 
                            : 'bg-[#FF5B00] text-white hover:bg-[#E05000]'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                    </div>

                    <CreatorCard 
                      creator={creator}
                      onClick={() => toast.success(`Viewing profile of ${creator.name}`)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* SECTION 4.5: FROM OUR COMMUNITY */}
        <section id="community-reviews">
          <div className="flex justify-between items-end mb-6">
            <div className="text-left">
              <h3 className="text-sm font-black text-[#000435] uppercase tracking-tight">FROM OUR COMMUNITY</h3>
              <p className="text-[10px] text-slate-400 font-bold">Real experiences from verified users</p>
            </div>
            <Button 
              onClick={() => toast.success('Loading all community reviews...')}
              variant="ghost"
              size="sm"
              className="text-[11px] font-black text-[#FF5B00] hover:text-[#EB4501] uppercase tracking-wider block shrink-0 p-0 h-auto"
            >
              View all reviews &rarr;
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Community Review */}
            <PublicReviewCard 
              review={communityReviewsData[0]} 
              className="lg:col-span-4 bg-white shadow-sm border border-slate-200/80 rounded-3xl p-6.5"
              onHelpfulClick={() => toast.success(`You found Tanvir's review helpful!`)}
            />

            {/* Center Trust Score Card */}
            <TrustScoreCard
              className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6.5 shadow-sm"
              overallScore={9.6}
              label="Community Trust Score"
              ratingText="Highly Credible"
              categories={[
                { label: "Product Authenticity", score: 9.8 },
                { label: "Creator Reliability", score: 9.5 },
                { label: "Community Reviews", score: 9.6 },
                { label: "Unbiased Rankings", score: 9.7 }
              ]}
            />

            {/* Right Community Review */}
            <PublicReviewCard 
              review={communityReviewsData[1]} 
              className="lg:col-span-4 bg-white shadow-sm border border-slate-200/80 rounded-3xl p-6.5"
              onHelpfulClick={() => toast.success(`You found Nusrat's review helpful!`)}
            />

          </div>
        </section>

      </main>

      {/* 5. Bottom Trust Badges Section */}
      <section className="bg-white border-t border-slate-200/50 py-10 px-6 md:px-10" id="trust-strip">
        <div className="max-w-7xl mx-auto w-full">
          <TrustStatementCard
            title="Choosify Trust Statement"
            statements={[
              { title: 'Independent Reviews', description: 'Unbiased guides and authentic rating aggregations you can trust completely.', icon: ShieldCheck },
              { title: 'Verified Products', description: 'Every listed device is verified for authenticity and official seller status.', icon: CheckCircle2 },
              { title: 'Verified Creators', description: 'Reviewers are certified content experts with verified tech credentials.', icon: Users },
              { title: 'Transparent Rankings', description: 'Product ranking scores are calculated using completely transparent metrics.', icon: Scale },
              { title: 'Community Driven', description: 'Helpful feedback, user reviews, and active participation from real local buyers.', icon: Sparkles }
            ]}
            className="border-slate-200/60 shadow-sm"
          />
        </div>
      </section>

      {/* 6. CHOOSIFY.BD TRUST STATEMENT STATEMENT CALLOUT */}
      <section className="bg-white border-t border-slate-200/50 py-12 px-6 md:px-10" id="discover-trust-statement">
        <div className="max-w-4xl mx-auto">
          <CalloutCard
            variant="expert"
            title="Choosify Trust Statement"
            content="Only verified sellers and completely unbiased, authentic brand experiences are listed on Choosify."
            className="shadow-sm border-slate-200/80 bg-slate-900 border-slate-800 text-white"
          />
        </div>
      </section>

      {/* 7. FOOTER SECTION */}
      <Footer />
    </div>
  );
}
