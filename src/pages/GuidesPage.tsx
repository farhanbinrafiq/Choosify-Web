import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PAGE_LISTING_SINGLE_SHELL, GUIDE_MEDIA_GRID } from "../lib/pageLayout";
import { StickySectionNav } from '../components/StickySectionNav';
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { BookOpen, Search, Youtube, ArrowRight, User, Calendar, LucidePenTool, Heart, Shirt, Smartphone, Tv, Compass, Baby, Smile, Car, Droplets, Bookmark, Eye, Share2, Play, Instagram, ChevronRight, Award, Flame, Zap, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { catalogGuideHref } from '../lib/spotlight/content';
import { RecommendationCardSkeleton } from '../components/Skeleton';
import { DragScrollContainer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { DcListingHero } from '../components/design/DcListingHero';
import { DcListingStickyFilters } from '../components/design/DcListingStickyFilters';
import { PaginationBar } from '../components/PaginationBar';
import { AdSenseSlot } from '../components/AdSenseSlot';
import { ListingAdRail } from '../components/ListingAdRail';
import { InfeedSponsoredCard } from '../components/SponsoredPlacementCard';
import { usePlacements } from '../hooks/usePlacements';
import { PLACEMENT_KEYS, INFEED_INTERVAL, INFEED_MAX_PER_PAGE } from '../lib/placements';
import { injectPlacementsIntoFeed } from '../utils/injectFeedPlacements';
import { CardEngagementStrip } from '../components/CardEngagementStrip';
import { useDashboard } from '../context/DashboardContext';
import toast from 'react-hot-toast';
import { ReelCard, HorizontalMediaCard } from '../components/guide/GuideMediaCards';

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

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      to={catalogGuideHref(guide)}
      className="group cursor-pointer block bg-white rounded-[5px] border border-[#e8edf2] p-5 relative overflow-hidden shadow-none hover:border-orange-primary/30 transition-all duration-300 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[16/9] md:aspect-[2.2/1] w-full relative overflow-hidden bg-slate-950 rounded-[5px]">
        {guide.videoUrl ? (
          <video
            ref={videoRef}
            src={guide.videoUrl}
            poster={guide.image}
            muted
            loop
            playsInline
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-[2.5s]"
          />
        ) : (
          <img
            src={guide.image}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-[2.5s]"
            alt="Featured"
          />
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-15 pointer-events-none" />

        {/* Badge: Featured Story */}
        <div className="absolute top-5 left-5 z-20">
          <div className="bg-orange-primary px-3.5 py-1.5 rounded-[8px] flex items-center justify-center border border-white/10 shadow-sm">
            <span className="text-[10px] font-black tracking-wider text-white uppercase leading-none">★ FEATURED</span>
          </div>
        </div>

        {/* Platform logo top-right */}
        <div className="absolute top-5 right-5 z-20 flex flex-col items-center gap-0.5">
          <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105">
            <Youtube size={18} />
          </div>
          <span className="text-[9px] font-black tracking-wider text-white uppercase drop-shadow-md">Youtube</span>
        </div>

        {/* Centered Red Play Button */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center z-10 transition-all duration-300",
          isHovering ? "opacity-0 scale-[1.1]" : "opacity-100 scale-100"
        )}>
          <div className="w-16 h-16 rounded-full bg-play-red flex items-center justify-center border border-white/20 shadow-lg">
            <Play className="text-white fill-white ml-1" size={24} />
          </div>
        </div>

        {/* Bottom Time Pill */}
        <div className="absolute bottom-5 right-5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-[4px] text-[10px] font-mono font-bold text-white tracking-widest border border-white/10 leading-none">
          {guide.duration || '8:10'}
        </div>
      </div>

      {/* Content Section below Media */}
      <div className="pt-5 flex flex-col gap-2.5">
        <h3 className="font-sans text-xl md:text-2xl font-extrabold tracking-tight text-heading leading-tight hover:text-orange-primary transition-colors text-left">
          {guide.title}
        </h3>
        
        <p className="text-gray-500 font-semibold text-xs md:text-sm leading-relaxed text-left max-w-4xl">
          {guide.excerpt || "Top 10 Smartphones to Buy in 2026. Find the best phone deals............"}
        </p>

        {/* Footer with Stats and Bookmark */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-6 text-[12px] font-semibold text-[#9AA0AC] tracking-tight">
            <span className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
              <Heart size={15} className="text-rose-500 stroke-[2.5]" /> {guide.shares || '12k'}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={15} className="text-[#8a92a6] stroke-[2.5]" /> {guide.views || '1.2k'}
            </span>
            <span className="flex items-center gap-1.5">
              <Share2 size={15} className="text-[#8a92a6] stroke-[2.5]" /> 450
            </span>
          </div>

          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBookmark();
            }}
            className={cn(
              "w-9 h-9 rounded-full bg-white border flex items-center justify-center transition-all cursor-pointer shadow-none",
              isBookmarked 
                ? "border-orange-primary text-orange-primary bg-orange-primary/5" 
                : "border-[#e8edf2] text-gray-400 hover:text-orange-primary hover:border-orange-primary"
            )}
          >
            <Bookmark className={cn("w-4 h-4", isBookmarked ? "fill-current" : "")} />
          </button>
        </div>
      </div>
    </Link>
  );
}

export { ReelCard, HorizontalMediaCard } from '../components/guide/GuideMediaCards';

export function GuidesPage() {
  const { allGuides } = useGlobalState();
  const guideSource = allGuides;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Filter conditions
  const [selectedContentType, setSelectedContentType] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedVerifiedCreator, setSelectedVerifiedCreator] = useState<boolean | null>(null);
  const [selectedFollowers, setSelectedFollowers] = useState<string | null>(null);
  const [selectedEngagementRate, setSelectedEngagementRate] = useState<string | null>(null);

  const [selectedSponsored, setSelectedSponsored] = useState<boolean | null>(null);
  const [selectedOfficialCampaign, setSelectedOfficialCampaign] = useState<boolean | null>(null);

  const [isTrending, setIsTrending] = useState<boolean | null>(null);
  const [isNew, setIsNew] = useState<boolean | null>(null);
  const [isPopular, setIsPopular] = useState<boolean | null>(null);
  const [isEditorsPick, setIsEditorsPick] = useState<boolean | null>(null);

  const [productCategory, setProductCategory] = useState<string | null>(null);
  const [productPriceRange, setProductPriceRange] = useState<string | null>(null);
  const [productAvailability, setProductAvailability] = useState<string | null>(null);

  const [selectedReadingTime, setSelectedReadingTime] = useState<string | null>(null);
  const [selectedViews, setSelectedViews] = useState<string | null>(null);
  const [selectedUploadDate, setSelectedUploadDate] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<string>('default');

  // Trigger simulated loading effect on any filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [
    selectedContentType, selectedPlatform, selectedCategory, selectedLanguage,
    selectedDuration, selectedCreator, selectedAuthor, selectedVerifiedCreator,
    selectedFollowers, selectedEngagementRate, selectedTopic, selectedSponsored,
    selectedOfficialCampaign, isTrending, isNew, isPopular, isEditorsPick,
    productCategory, productPriceRange, productAvailability, selectedReadingTime,
    selectedViews, selectedUploadDate, selectedMusic, sortOption, searchQuery, activeTab
  ]);

  const contentTypeOptions = [
    { value: 'video', label: 'Video Catalog' },
    { value: 'article', label: 'Written Articles' },
    { value: 'reels', label: 'Reels / TikTok' },
    { value: 'shorts', label: 'Short-form Stories' }
  ];

  const platformOptions = [
    { value: 'youtube', label: 'YouTube Video' },
    { value: 'instagram', label: 'Instagram Reels' },
    { value: 'blog', label: 'Written Blogs' }
  ];

  const categoryOptions = [
    { value: 'Fashion', label: 'Fashion Channel' },
    { value: 'Gadgest', label: 'Gadg & Mobiles' },
    { value: 'Perfume', label: 'Perfumes Fragrances' },
    { value: 'Electronics', label: 'Electronics TV' },
    { value: 'Travel', label: 'Travel Adventure' },
    { value: 'Education', label: 'Education Advice' },
    { value: 'Parenting', label: 'Parenting Guides' },
    { value: 'Kids', label: 'Kids Children' },
    { value: 'Cars / Bike', label: 'Cars Motoring' }
  ];

  const videoDurationOptions = [
    { value: 'short', label: 'Under 10 mins' },
    { value: 'long', label: 'Over 10 mins' }
  ];

  const reelsDurationOptions = [
    { value: 'under30s', label: 'Under 30s' },
    { value: 'over30s', label: '30s - 90s' }
  ];

  const readTimeOptions = [
    { value: 'short', label: 'Under 10 mins' },
    { value: 'long', label: 'Over 10 mins' }
  ];

  const creatorOptions = [
    { value: 'Farhan Rafiq', label: 'Farhan Rafiq' },
    { value: 'Sarah Jenkins', label: 'Sarah Jenkins' },
    { value: 'Imtiaz Ahmed', label: 'Imtiaz Ahmed' }
  ];

  const topicOptions = [
    { value: 'buying-guide', label: 'Buying Guide' },
    { value: 'review', label: 'Product Review' },
    { value: 'tips', label: 'Tips & Advice' },
    { value: 'unboxing', label: 'Unboxing' }
  ];

  const languageOptions = [
    { value: 'bangla', label: 'Bangla (Local)' },
    { value: 'english', label: 'English (Global)' }
  ];

  const followerOptions = [
    { value: 'all', label: 'All Audiences' },
    { value: '10k', label: '10K+ Followers' },
    { value: '100k', label: '100K+ Followers' },
    { value: '1m', label: '1M+ Followers' }
  ];

  const engagementOptions = [
    { value: 'all', label: 'Any Engagement' },
    { value: 'high', label: 'Top Tier (4.8+)' }
  ];

  const viewsOptions = [
    { value: 'under100k', label: 'Under 100K Views' },
    { value: 'over100k', label: '100K - 1M Views' },
    { value: 'millions', label: '1M+ Views' }
  ];

  const uploadDateOptions = [
    { value: 'today', label: 'Uploaded Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const publishDateOptions = [
    { value: 'today', label: 'Published Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const musicOptions = [
    { value: 'trending', label: 'Trending Track Only' },
    { value: 'original', label: 'Original Audio Only' }
  ];

  const handleClearAllFilters = () => {
    setSelectedContentType(null);
    setSelectedPlatform(null);
    setSelectedCategory(null);
    setSelectedLanguage(null);
    setSelectedDuration(null);
    setSelectedCreator(null);
    setSelectedAuthor(null);
    setSelectedVerifiedCreator(null);
    setSelectedFollowers(null);
    setSelectedEngagementRate(null);
    setSelectedTopic(null);
    setSelectedSponsored(null);
    setSelectedOfficialCampaign(null);
    setIsTrending(null);
    setIsNew(null);
    setIsPopular(null);
    setIsEditorsPick(null);
    setProductCategory(null);
    setProductPriceRange(null);
    setProductAvailability(null);
    setSelectedReadingTime(null);
    setSelectedViews(null);
    setSelectedUploadDate(null);
    setSelectedMusic(null);
    setSortOption('default');
    setSearchQuery('');
    setActiveTab('All');
  };

  const categoriesList = [
    { name: 'Fashion', icon: <Shirt size={16} className="stroke-[2.5]" />, count: 550 },
    { name: 'Gadgest', icon: <Smartphone size={16} className="stroke-[2.5]" />, count: 420 },
    { name: 'Perfume', icon: <Droplets size={16} className="stroke-[2.5]" />, count: 180 },
    { name: 'Electronics', icon: <Tv size={16} className="stroke-[2.5]" />, count: 350 },
    { name: 'Travel', icon: <Compass size={16} className="stroke-[2.5]" />, count: 156 },
    { name: 'Education', icon: <BookOpen size={16} className="stroke-[2.5]" />, count: 210 },
    { name: 'Parenting', icon: <Heart size={16} className="stroke-[2.5]" />, count: 95 },
    { name: 'Kids', icon: <Smile size={16} className="stroke-[2.5]" />, count: 240 },
    { name: 'Cars / Bike', icon: <Car size={16} className="stroke-[2.5]" />, count: 310 }
  ];

  const recommendationTitles = [
    'Top 10 Smartphones 2026',
    'Best Gadgets Under 1,000 BDT',
    'Best Noise Cancelling Headphones',
    'Ultimate Buying Guide: Smartwatches',
    'Top Laptops for Students 2026',
    'Best Power Banks in Bangladesh',
    'Wireless Earbuds Buying Guide',
    'Best Cameras Under 30,000',
    'Gaming Setup Guide 2026',
    'Top Fitness Trackers'
  ];

  // Dynamic filter supporting the high-fidelity bento bento-grid
  const getFilteredBlogs = () => {
    let result = [...guideSource];

    // Filter by Top Sticky Tabs (activeTab)
    if (activeTab === 'Featured') {
      result = result.slice(0, 2);
    } else if (activeTab === 'Editors Choice') {
      result = result.filter((_, idx) => idx % 2 === 0);
    } else if (activeTab === 'Most Popular') {
      result = result.filter(blog => {
        const viewsStr = blog.views || '';
        return viewsStr.includes('M') || viewsStr.includes('K') || parseInt(viewsStr, 10) > 100;
      });
    } else if (activeTab === 'Budget Picks') {
      result = result.filter((_, idx) => idx % 3 === 0);
    } else if (activeTab === 'Premium Picks') {
      result = result.filter((_, idx) => idx % 4 === 1);
    }

    // Filter by searchQuery
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(blog => {
        const titleMatches = blog.title.toLowerCase().includes(q);
        const excerptMatches = blog.excerpt?.toLowerCase().includes(q) || false;
        const categoryMatches = blog.category?.toLowerCase().includes(q) || false;
        const authorMatches = blog.author?.toLowerCase().includes(q) || false;
        return titleMatches || excerptMatches || categoryMatches || authorMatches;
      });
    }

    // Filter by Content Type / Platform (V2 Filters)
    if (selectedContentType === 'video') {
      result = result.filter(blog => blog.type === 'video');
    } else if (selectedContentType === 'article') {
      result = result.filter(blog => blog.type === 'article');
    } else if (selectedContentType === 'shorts') {
      result = result.filter(blog => blog.type === 'shorts');
    } else if (selectedContentType === 'reels') {
      result = result.filter(blog => blog.type === 'reels');
    }

    if (selectedPlatform === 'youtube') {
      result = result.filter(blog => blog.type === 'video');
    } else if (selectedPlatform === 'instagram') {
      result = result.filter(blog => blog.type === 'reels' || blog.type === 'shorts');
    } else if (selectedPlatform === 'blog') {
      result = result.filter(blog => blog.type === 'article');
    }

    // Filter by Category
    if (selectedCategory) {
      const normCat = selectedCategory.toLowerCase();
      result = result.filter(blog => {
        const blogCat = (blog.category || '').toLowerCase();
        if (normCat.includes('gadg') || normCat.includes('mobile')) {
          return blogCat === 'mobile' || blogCat === 'gaming';
        }
        if (normCat.includes('fashion') || normCat.includes('perfume')) {
          return blogCat === 'fashion' || blogCat === 'beauty';
        }
        return blogCat === normCat;
      });
    }

    // Filter by Creator / Author
    if (selectedCreator) {
      result = result.filter(blog => blog.author === selectedCreator);
    }
    if (selectedAuthor) {
      result = result.filter(blog => blog.author === selectedAuthor);
    }

    // Filter by Verified Creator
    if (selectedVerifiedCreator === true) {
      result = result.filter(blog => {
        return blog.author.includes('Farhan') || blog.author.includes('Sarah');
      });
    }

    // Filter by Trending, Editors Pick, Popular, New
    if (isTrending === true) {
      result = result.filter(blog => {
        const viewsStr = blog.views || '';
        return viewsStr.includes('M') || parseInt(viewsStr) > 500;
      });
    }
    if (isNew === true) {
      result = result.filter((_, idx) => idx % 2 !== 0);
    }
    if (isEditorsPick === true) {
      result = result.filter((_, idx) => idx % 2 === 0);
    }
    if (isPopular === true) {
      result = result.filter(blog => blog.views.includes('M'));
    }

    // Reading time (Blogs specific)
    if (selectedReadingTime) {
      if (selectedReadingTime === 'short') {
        result = result.filter(blog => {
          const m = parseInt((blog.readTime || '').replace(/[^0-9]/g, '')) || 5;
          return m < 10;
        });
      } else if (selectedReadingTime === 'long') {
        result = result.filter(blog => {
          const m = parseInt((blog.readTime || '').replace(/[^0-9]/g, '')) || 5;
          return m >= 10;
        });
      }
    }

    // Video Duration (YouTube specific)
    if (selectedDuration) {
      if (selectedDuration === 'short') {
        result = result.filter(blog => {
          const parts = (blog.duration || '').split(':');
          const mins = parseInt(parts[0]) || 0;
          return mins < 10;
        });
      } else if (selectedDuration === 'long') {
        result = result.filter(blog => {
          const parts = (blog.duration || '').split(':');
          const mins = parseInt(parts[0]) || 0;
          return mins >= 10;
        });
      }
    }

    // Product specification filter
    if (productCategory) {
      if (productCategory === 'smartphones') {
        result = result.filter(blog => blog.category === 'MOBILE');
      } else if (productCategory === 'shoes') {
        result = result.filter(blog => blog.category === 'FASHION');
      } else if (productCategory === 'gaming') {
        result = result.filter(blog => blog.category === 'GAMING');
      } else if (productCategory === 'coffee') {
        result = result.filter(blog => blog.category === 'HOME');
      } else if (productCategory === 'skincare') {
        result = result.filter(blog => blog.category === 'BEAUTY');
      }
    }

    if (productPriceRange) {
      if (productPriceRange === 'under1k') {
        result = result.filter((_, idx) => idx % 2 === 0);
      } else if (productPriceRange === '1k-5k') {
        result = result.filter((_, idx) => idx % 2 !== 0);
      }
    }

    // Dynamic sorting
    if (sortOption === 'views') {
      result = result.sort((a, b) => {
        const getVVal = (v: string) => {
          if (v.endsWith('M')) return parseFloat(v) * 1000000;
          if (v.endsWith('K')) return parseFloat(v) * 1000;
          return parseFloat(v) || 0;
        };
        return getVVal(b.views) - getVVal(a.views);
      });
    } else if (sortOption === 'shares') {
      result = result.sort((a, b) => {
        const getSVal = (s: string) => {
          if (s.endsWith('M')) return parseFloat(s) * 1000000;
          if (s.endsWith('K')) return parseFloat(s) * 1000;
          return parseFloat(s) || 0;
        };
        return getSVal(b.shares) - getSVal(a.shares);
      });
    } else if (sortOption === 'newest') {
      result = result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    }

    return result;
  };

  const filteredBlogs = getFilteredBlogs();

  const infeedPlacements = usePlacements(PLACEMENT_KEYS.INFEED_GUIDE, {
    limit: INFEED_MAX_PER_PAGE,
    entityType: 'guide',
  });

  const guideFeed = useMemo(
    () =>
      injectPlacementsIntoFeed(
        filteredBlogs,
        (guide) => `guide-${guide.id}`,
        infeedPlacements,
        INFEED_INTERVAL.guide,
        INFEED_MAX_PER_PAGE,
      ),
    [filteredBlogs, infeedPlacements],
  );

  const isAnyFilterActive = !!(
    selectedContentType || selectedPlatform || selectedCategory || selectedLanguage ||
    selectedDuration || selectedCreator || selectedAuthor || selectedVerifiedCreator ||
    selectedFollowers || selectedEngagementRate || selectedTopic || selectedSponsored ||
    selectedOfficialCampaign || isTrending || isNew || isPopular || isEditorsPick ||
    productCategory || productPriceRange || productAvailability || selectedReadingTime ||
    selectedViews || selectedUploadDate || selectedMusic || sortOption !== 'default' || searchQuery
  );

  const guideSectionNavItems = useMemo(
    () => [
      {
        id: 'guides-hybrid-feed',
        label: isAnyFilterActive ? 'Results' : 'All Content',
        icon: isAnyFilterActive ? <Search size={13} /> : <BookOpen size={13} />,
      },
    ],
    [isAnyFilterActive],
  );

  const { activeId: activeSectionId, scrollToSection } = useSectionScrollSpy(guideSectionNavItems);

  const renderFilterPanel = () => {
    return (
      <FullSidebarFilterPanel
        title="Guides Scope"
        onReset={handleClearAllFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search guides, topics..."
        quickFilters={
          <QuickFilterBar
            title="Guides Quick Specs"
            onOpenFullFilters={() => {}}
            filters={[
              { id: 'all-content', label: 'All Content', active: !selectedContentType && !selectedPlatform, onClick: () => { setSelectedContentType(null); setSelectedPlatform(null); } },
              { id: 'youtube', label: '📺 YouTube', active: selectedPlatform === 'youtube' || selectedContentType === 'video', onClick: () => { setSelectedPlatform(selectedPlatform === 'youtube' ? null : 'youtube'); setSelectedContentType(selectedPlatform === 'youtube' ? null : 'video'); } },
              { id: 'reels', label: '📱 Reels', active: selectedContentType === 'reels', onClick: () => setSelectedContentType(selectedContentType === 'reels' ? null : 'reels') },
              { id: 'blogs', label: '✍️ Blogs', active: selectedPlatform === 'blog' || selectedContentType === 'article', onClick: () => { setSelectedPlatform(selectedPlatform === 'blog' ? null : 'blog'); setSelectedContentType(selectedPlatform === 'blog' ? null : 'article'); } },
              { id: 'featured-pill', label: '★ Featured', active: activeTab === 'Featured', onClick: () => setActiveTab(activeTab === 'Featured' ? 'All' : 'Featured') },
              { id: 'verified-pill', label: '✓ Verified Creators', active: selectedVerifiedCreator === true, onClick: () => setSelectedVerifiedCreator(selectedVerifiedCreator === true ? null : true) },
              { id: 'trending-pill', label: '🔥 Trending', active: isTrending === true, onClick: () => setIsTrending(isTrending === true ? null : true) },
              {
                id: 'cycle-sort',
                label: sortOption === 'default' ? 'Filter Sort' : `Sort: ${sortOption === 'views' ? 'View Count' : sortOption === 'shares' ? 'Shared Count' : 'Newest First'}`,
                active: sortOption !== 'default',
                onClick: () => {
                  const next: Record<string, string> = {
                    'default': 'views',
                    'views': 'shares',
                    'shares': 'newest',
                    'newest': 'default'
                  };
                  setSortOption(next[sortOption] || 'default');
                }
              }
            ]}
          />
        }
        activeChips={
          <ActiveFilterChips
            chips={[
              selectedContentType ? { id: 'contentType', label: `Type: ${selectedContentType}`, onRemove: () => setSelectedContentType(null) } : null,
              selectedPlatform ? { id: 'platform', label: `Platform: ${selectedPlatform}`, onRemove: () => setSelectedPlatform(null) } : null,
              selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
              selectedLanguage ? { id: 'language', label: `Language: ${selectedLanguage}`, onRemove: () => setSelectedLanguage(null) } : null,
              selectedDuration ? { id: 'duration', label: `Duration: ${selectedDuration}`, onRemove: () => setSelectedDuration(null) } : null,
              selectedCreator ? { id: 'creator', label: `Creator: ${selectedCreator}`, onRemove: () => setSelectedCreator(null) } : null,
              selectedAuthor ? { id: 'author', label: `Author: ${selectedAuthor}`, onRemove: () => setSelectedAuthor(null) } : null,
              selectedVerifiedCreator ? { id: 'verified', label: 'Verified Creators Only', onRemove: () => setSelectedVerifiedCreator(null) } : null,
              selectedFollowers ? { id: 'followers', label: `Followers: ${selectedFollowers}`, onRemove: () => setSelectedFollowers(null) } : null,
              selectedEngagementRate ? { id: 'engagement', label: `Engagement: ${selectedEngagementRate}`, onRemove: () => setSelectedEngagementRate(null) } : null,
              selectedTopic ? { id: 'topic', label: `Topic: ${selectedTopic}`, onRemove: () => setSelectedTopic(null) } : null,
              selectedSponsored ? { id: 'sponsored', label: 'Sponsored', onRemove: () => setSelectedSponsored(null) } : null,
              selectedOfficialCampaign ? { id: 'official', label: 'Official Campaign', onRemove: () => setSelectedOfficialCampaign(null) } : null,
              isTrending ? { id: 'trending', label: 'Trending', onRemove: () => setIsTrending(null) } : null,
              isNew ? { id: 'new', label: 'New Releases', onRemove: () => setIsNew(null) } : null,
              isEditorsPick ? { id: 'editors_pick', label: 'Editor\'s Pick', onRemove: () => setIsEditorsPick(null) } : null,
              sortOption !== 'default' ? { id: 'sort', label: `Sort: ${sortOption}`, onRemove: () => setSortOption('default') } : null,
              productCategory ? { id: 'prod_cat', label: `Group: ${productCategory}`, onRemove: () => setProductCategory(null) } : null,
              productPriceRange ? { id: 'prod_price', label: `Price Limit: ${productPriceRange}`, onRemove: () => setProductPriceRange(null) } : null,
              productAvailability ? { id: 'prod_avail', label: `Stock: ${productAvailability}`, onRemove: () => setProductAvailability(null) } : null,
            ].filter(Boolean) as any[]}
            onClearAll={handleClearAllFilters}
          />
        }
        advancedSection={
          <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left font-sans">
            <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Topic / Niche</h3>
            <div className="space-y-1">
              {topicOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedTopic(selectedTopic === opt.value ? null : opt.value)}
                  className={cn(
                    "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                    selectedTopic === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                  )}
                >
                  <span>{opt.label}</span>
                  {selectedTopic === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
                </button>
              ))}
            </div>
            
            <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mt-4 mb-3">Language</h3>
            <div className="space-y-1">
              {languageOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedLanguage(selectedLanguage === opt.value ? null : opt.value)}
                  className={cn(
                    "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                    selectedLanguage === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                  )}
                >
                  <span>{opt.label}</span>
                  {selectedLanguage === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        }
      >
        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Recommendation Type</h3>
          <div className="space-y-1">
            {contentTypeOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedContentType(selectedContentType === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedContentType === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedContentType === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Platform Channel</h3>
          <div className="space-y-1">
            {platformOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedPlatform(selectedPlatform === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedPlatform === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedPlatform === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Category</h3>
          <div className="space-y-1">
            {categoryOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedCategory(selectedCategory === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedCategory === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedCategory === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* SMART FILTERS SECTION */}
        {(selectedPlatform === 'youtube' || selectedContentType === 'video') && (
          <div className="space-y-4">
            <div className="py-2 px-3 bg-gradient-to-r from-orange-primary/5 to-transparent rounded-[4px] border-l-2 border-orange-primary">
              <span className="text-[12px] font-bold tracking-tight text-[#FF5B00] block">📺 YouTube specs</span>
            </div>

            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Video Duration</h3>
              <div className="space-y-1">
                {videoDurationOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedDuration(selectedDuration === opt.value ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      selectedDuration === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {selectedDuration === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Views Threshold</h3>
              <div className="space-y-1">
                {viewsOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedViews(selectedViews === opt.value ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      selectedViews === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {selectedViews === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {(selectedPlatform === 'instagram' || selectedContentType === 'reels' || selectedContentType === 'shorts') && (
          <div className="space-y-4">
            <div className="py-2 px-3 bg-gradient-to-r from-orange-primary/5 to-transparent rounded-[4px] border-l-2 border-orange-primary">
              <span className="text-[12px] font-bold tracking-tight text-[#FF5B00] block">📱 Reels specs</span>
            </div>

            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Smart Duration</h3>
              <div className="space-y-1">
                {reelsDurationOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedDuration(selectedDuration === opt.value ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      selectedDuration === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {selectedDuration === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Trending Music</h3>
              <div className="space-y-1">
                {musicOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedMusic(selectedMusic === opt.value ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      selectedMusic === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {selectedMusic === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {(selectedPlatform === 'blog' || selectedContentType === 'article') && (
          <div className="space-y-4">
            <div className="py-2 px-3 bg-gradient-to-r from-orange-primary/5 to-transparent rounded-[4px] border-l-2 border-orange-primary">
              <span className="text-[12px] font-bold tracking-tight text-[#FF5B00] block">✍️ Blog specs</span>
            </div>

            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Reading Time</h3>
              <div className="space-y-1">
                {readTimeOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedReadingTime(selectedReadingTime === opt.value ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      selectedReadingTime === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {selectedReadingTime === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
              <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Author</h3>
              <div className="space-y-1">
                {creatorOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedAuthor(selectedAuthor === opt.value ? null : opt.value)}
                    className={cn(
                      "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                      selectedAuthor === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                    )}
                  >
                    <span>{opt.label}</span>
                    {selectedAuthor === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Creator Profile</h3>
          <div className="space-y-1">
            {creatorOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedCreator(selectedCreator === opt.value ? null : opt.value)}
                className={cn(
                  "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                  selectedCreator === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                )}
              >
                <span>{opt.label}</span>
                {selectedCreator === opt.value && <Check size={11} className="text-orange-primary shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Verified Creators</h3>
          <div className="space-y-1">
            {[
              { value: 'all', label: 'All Creators' },
              { value: 'verified', label: 'Verified Only' }
            ].map(opt => {
              const isSelected = (opt.value === 'verified' && selectedVerifiedCreator === true) || (opt.value === 'all' && selectedVerifiedCreator === null);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedVerifiedCreator(opt.value === 'verified' ? (selectedVerifiedCreator === true ? null : true) : null)}
                  className={cn(
                    "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                    isSelected ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={11} className="text-orange-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Sponsors & Campaigns</h3>
          <div className="space-y-1">
            {[
              { value: 'sponsored', label: 'Sponsored Guides Only' }
            ].map(opt => {
              const isSelected = selectedSponsored === true;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedSponsored(selectedSponsored === true ? null : true)}
                  className={cn(
                    "w-full flex items-center justify-between text-left px-2 py-1 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                    isSelected ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                  )}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={11} className="text-orange-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Product Group Spec</h3>
          <div className="space-y-3">
            <div>
              <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Product Type</label>
              <select
                value={productCategory || ''}
                onChange={(e) => setProductCategory(e.target.value || null)}
                className="w-full text-xs font-semibold h-8 border border-[#e8edf2] rounded-[4px] focus:outline-none focus:border-orange-primary bg-slate-50/20 px-2 leading-none"
              >
                <option value="">All Products</option>
                <option value="smartphones">Smartphones</option>
                <option value="shoes">Shoes & Apparel</option>
                <option value="skincare">Skincare</option>
                <option value="gaming">Gaming Hardware</option>
                <option value="coffee">Coffee Machines</option>
              </select>
            </div>

            <div>
              <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Price Limit</label>
              <select
                value={productPriceRange || ''}
                onChange={(e) => setProductPriceRange(e.target.value || null)}
                className="w-full text-xs font-semibold h-8 border border-[#e8edf2] rounded-[4px] focus:outline-none focus:border-orange-primary bg-slate-50/20 px-2 leading-none"
              >
                <option value="">Any Price</option>
                <option value="under1k">Under 1,000 BDT</option>
                <option value="1k-5k">1,000 – 5,000 BDT</option>
              </select>
            </div>
          </div>
        </div>
      </FullSidebarFilterPanel>
    );
  };

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
    <div id="guides-root" className="flex flex-col min-h-screen bg-[#F4F7F9]">
      <DcListingHero
        titleBefore="Top Buying"
        titleHighlight="Guides"
        searchPlaceholder="Search guides, topics..."
        quickChips={['Phones', 'Laptops', 'AC', 'Fashion', 'Beauty', 'Home']}
        onSearch={(q) => setSearchQuery(q)}
        onChipClick={(q) => setSearchQuery(q)}
      />

      <DcListingStickyFilters
        overlapHero
        items={[
          {
            id: 'featured',
            icon: '★',
            name: 'Featured',
            sub: 'Editor picks',
            bg: '#FFF3EA',
            active: activeTab === 'Featured',
            onClick: () => setActiveTab(activeTab === 'Featured' ? 'All' : 'Featured'),
          },
          {
            id: 'youtube',
            icon: '▶',
            name: 'YouTube Guides',
            sub: 'Video reviews',
            bg: '#FDECEC',
            active: selectedPlatform === 'youtube' || selectedContentType === 'video',
            onClick: () => {
              const on = selectedPlatform === 'youtube' || selectedContentType === 'video';
              setSelectedPlatform(on ? null : 'youtube');
              setSelectedContentType(on ? null : 'video');
            },
          },
          {
            id: 'blogs',
            icon: '✍',
            name: 'Buying Guides',
            sub: 'In-depth reads',
            bg: '#EFECFD',
            active: selectedPlatform === 'blog' || selectedContentType === 'article',
            onClick: () => {
              const on = selectedPlatform === 'blog' || selectedContentType === 'article';
              setSelectedPlatform(on ? null : 'blog');
              setSelectedContentType(on ? null : 'article');
            },
          },
          {
            id: 'reels',
            icon: '📱',
            name: 'Reels & Shorts',
            sub: 'Quick takes',
            bg: '#EAF1FD',
            active: selectedContentType === 'reels',
            onClick: () => setSelectedContentType(selectedContentType === 'reels' ? null : 'reels'),
          },
          {
            id: 'editors',
            icon: '✨',
            name: "Editor's Choice",
            sub: 'Curated',
            bg: '#E6F9EA',
            active: activeTab === 'Editors Choice',
            onClick: () => setActiveTab(activeTab === 'Editors Choice' ? 'All' : 'Editors Choice'),
          },
          {
            id: 'popular',
            icon: '🔥',
            name: 'Most Popular',
            sub: 'Trending now',
            bg: '#FEF3E2',
            active: activeTab === 'Most Popular',
            onClick: () => setActiveTab(activeTab === 'Most Popular' ? 'All' : 'Most Popular'),
          },
        ]}
      />

      {/* ACTIVE FILTER CHIPS ROW */}
      <ActiveFilterChips
        chips={[
          selectedContentType ? { id: 'contentType', label: `Type: ${selectedContentType}`, onRemove: () => setSelectedContentType(null) } : null,
          selectedPlatform ? { id: 'platform', label: `Platform: ${selectedPlatform}`, onRemove: () => setSelectedPlatform(null) } : null,
          selectedCategory ? { id: 'category', label: `Category: ${selectedCategory}`, onRemove: () => setSelectedCategory(null) } : null,
          selectedLanguage ? { id: 'language', label: `Language: ${selectedLanguage}`, onRemove: () => setSelectedLanguage(null) } : null,
          selectedDuration ? { id: 'duration', label: `Duration: ${selectedDuration}`, onRemove: () => setSelectedDuration(null) } : null,
          selectedCreator ? { id: 'creator', label: `Creator: ${selectedCreator}`, onRemove: () => setSelectedCreator(null) } : null,
          selectedAuthor ? { id: 'author', label: `Author: ${selectedAuthor}`, onRemove: () => setSelectedAuthor(null) } : null,
          selectedVerifiedCreator ? { id: 'verified', label: 'Verified Creators Only', onRemove: () => setSelectedVerifiedCreator(null) } : null,
          selectedFollowers ? { id: 'followers', label: `Followers: ${selectedFollowers}`, onRemove: () => setSelectedFollowers(null) } : null,
          selectedEngagementRate ? { id: 'engagement', label: `Engagement: ${selectedEngagementRate}`, onRemove: () => setSelectedEngagementRate(null) } : null,
          selectedTopic ? { id: 'topic', label: `Topic: ${selectedTopic}`, onRemove: () => setSelectedTopic(null) } : null,
          selectedSponsored ? { id: 'sponsored', label: 'Sponsored', onRemove: () => setSelectedSponsored(null) } : null,
          selectedOfficialCampaign ? { id: 'official', label: 'Official Campaign', onRemove: () => setSelectedOfficialCampaign(null) } : null,
          isTrending ? { id: 'trending', label: 'Trending', onRemove: () => setIsTrending(null) } : null,
          isNew ? { id: 'new', label: 'New Releases', onRemove: () => setIsNew(null) } : null,
          isEditorsPick ? { id: 'editors_pick', label: 'Editor\'s Pick', onRemove: () => setIsEditorsPick(null) } : null,
          sortOption !== 'default' ? { id: 'sort', label: `Sort: ${sortOption}`, onRemove: () => setSortOption('default') } : null,
          productCategory ? { id: 'prod_cat', label: `Group: ${productCategory}`, onRemove: () => setProductCategory(null) } : null,
          productPriceRange ? { id: 'prod_price', label: `Price Limit: ${productPriceRange}`, onRemove: () => setProductPriceRange(null) } : null,
          productAvailability ? { id: 'prod_avail', label: `Stock: ${productAvailability}`, onRemove: () => setProductAvailability(null) } : null,
        ].filter(Boolean) as any[]}
        onClearAll={handleClearAllFilters}
      />

      <StickySectionNav
        sections={guideSectionNavItems}
        activeId={activeSectionId}
        onNavigate={scrollToSection}
        allLabel="Discover & Learn"
        profileLabel="Buying guides"
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

            <ListingAdRail
              sponsoredPlacementKey={PLACEMENT_KEYS.SIDEBAR_PORTRAIT}
              sponsoredVariant="portrait"
              showAdSense={false}
            />
         </aside>

         <div id="guides-main-display" className="choosify-middle-feed scroll-mt-36 min-w-0 pb-10">
            {isLoading ? (
               <div className="flex flex-col gap-5">
                  <div className="h-9 w-48 bg-gray-100 rounded-[5px] animate-pulse" />
                  <div className={GUIDE_MEDIA_GRID}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <RecommendationCardSkeleton
                        key={i}
                        variant={i % 3 === 1 ? 'shorts' : 'default'}
                      />
                    ))}
                  </div>
               </div>
             ) : (
                <>
                  {filteredBlogs.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-20 text-center">
                       <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4 border border-gray-100">
                         <Search size={24} />
                       </div>
                       <h3 className="font-sans text-lg font-extrabold tracking-tight text-[#1A1D4E] mb-1">No results found</h3>
                       <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-sm">We couldn't find any guides matching your criteria. Try adjusting your search query or category.</p>
                     </div>
                  ) : (
                     <div id="guides-hybrid-feed" className="flex flex-col gap-6 scroll-mt-36 animate-fade-in duration-500">
                        {isAnyFilterActive && (
                          <h4 className="font-sans text-[13px] font-semibold tracking-tight text-[#9AA0AC] text-left">
                            Filtered results ({filteredBlogs.length})
                          </h4>
                        )}
                        <div className={GUIDE_MEDIA_GRID}>
                           {guideFeed.map((entry) =>
                              entry.kind === 'placement' ? (
                                <InfeedSponsoredCard key={entry.key} placement={entry.placement} />
                              ) : (
                                <React.Fragment key={entry.key}>
                                  {renderGuideMediaCard(entry.item)}
                                </React.Fragment>
                              ),
                           )}
                        </div>
                     </div>
                  )}
               </>
             )}
             
             <PaginationBar showingCount={8} totalCount={156} className="mt-24 pt-16" />

            <AdSenseSlot format="infeed" className="mt-6" />
         </div>

         {/* Right Sidebar Widgets */}
         <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 animate-fade-in">
            {/* Popular Topics Widget */}
            <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm text-left">
               <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8edf2] px-1">
                 <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider">Popular Topics</h3>
               </div>
               
               <div className="space-y-4">
                  {[
                     { title: 'Best Cheap Brands For Everyone That Looks Great Always', cat: 'FASHION', reads: '5K READS', img: 'https://images.unsplash.com/photo-1546868823-05b0521e4cba?w=120' },
                     { title: 'Winter Skin Care Essentials for BD Climate', cat: 'BEAUTY', reads: '12K READS', img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=120' },
                     { title: 'Top 10 Smartwatches in Bangladesh 2026', cat: 'GADGETS', reads: '2K READS', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=120' },
                     { title: 'How To Choose Your First DSLR Camera', cat: 'ELECTRONICS', reads: '4K READS', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=120' },
                     { title: 'Luxury Watches Every Man Should Own', cat: 'FASHION', reads: '3K READS', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=120' }
                  ].map((topic, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer items-center">
                       <div className="w-12 h-12 rounded-lg bg-slate-50 flex-shrink-0 overflow-hidden border border-[#e8edf2] shadow-sm flex items-center justify-center relative">
                          <img 
                            src={topic.img} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-[#0c133c] text-xs leading-snug group-hover:text-orange-primary transition-colors mb-0.5 uppercase tracking-tight">
                             {topic.title}
                          </h5>
                          <div className="flex items-center gap-1.5 text-[8.5px] font-semibold text-gray-400 uppercase tracking-wider">
                             <span>{topic.cat}</span>
                             <span className="text-[6.5px] text-gray-400/50">•</span>
                             <span>{topic.reads}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-4 py-2 bg-slate-50 border border-[#e8edf2] text-gray-400 rounded-lg text-[10px] font-semibold uppercase tracking-wider hover:bg-slate-100 hover:text-navy transition-colors cursor-pointer border-0">
                  LOAD MORE
               </button>
            </div>

            <AdSenseSlot format="sidebar" />
         </aside>
      </main>
      {/* Mobile/Tablet Bottom Sheet Drawer for Filters */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden font-sans">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          
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
