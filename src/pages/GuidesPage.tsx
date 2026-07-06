import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PAGE_LISTING_SINGLE_SHELL, GUIDE_MEDIA_GRID } from "../lib/pageLayout";
import { StickySectionNav } from '../components/StickySectionNav';
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { BookOpen, Search, Youtube, ArrowRight, User, Calendar, LucidePenTool, Heart, Shirt, Smartphone, Tv, Compass, Baby, Smile, Car, Droplets, Bookmark, Eye, Share2, Play, Instagram, ChevronRight, Award, Flame, Zap, Star, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { RecommendationCardSkeleton } from '../components/Skeleton';
import { DragScrollContainer, QuickFilterBar, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters } from '../components/FilterEngine';
import { PageHeroBanner } from '../components/PageHeroBanner';
import { HeroMarqueeTicker } from '../components/HeroMarqueeTicker';
import { PaginationBar } from '../components/PaginationBar';
import { PopularSearchKeywords } from '../components/PopularSearchKeywords';
import { buildGuidesPopularSearchTerms } from '../utils/pagePopularSearches';
import { AdSenseSlot } from '../components/AdSenseSlot';
import { ListingAdRail } from '../components/ListingAdRail';
import { InfeedSponsoredCard } from '../components/SponsoredPlacementCard';
import { usePlacements } from '../hooks/usePlacements';
import { PLACEMENT_KEYS, INFEED_INTERVAL, INFEED_MAX_PER_PAGE } from '../lib/placements';
import { injectPlacementsIntoFeed } from '../utils/injectFeedPlacements';
import { CardEngagementStrip } from '../components/CardEngagementStrip';
import { useDashboard } from '../context/DashboardContext';
import toast from 'react-hot-toast';

export function renderGuideMediaCard(guide: any) {
  if (guide.type === 'reels' || guide.type === 'shorts') {
    return <ReelCard guide={guide} />;
  }
  return (
    <HorizontalMediaCard
      guide={guide}
      badgeType={guide.type === 'video' ? 'youtube' : 'blog'}
    />
  );
}

// Sub-component for Featured Story (Segment 1 of reference image)
export function FeaturedCard({ guide }: { guide: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const { savedGuides, setSavedGuides } = useDashboard();
  if (!guide?.id) return null;
  const isBookmarked = savedGuides.some((g: any) => g?.id === guide.id);

  const handleBookmark = () => {
    if (isBookmarked) {
      setSavedGuides((prev: any[]) => prev.filter((g: any) => g.id !== guide.id));
      toast.success('Removed from saved guides');
    } else {
      setSavedGuides((prev: any[]) => [guide, ...prev]);
      toast.success('Guide saved to your dashboard!');
    }
  };

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
      to={`/guides/${guide.id}`}
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
        <h3 className="font-sans text-xl md:text-3xl font-black italic uppercase tracking-tighter text-heading leading-tight hover:text-orange-primary transition-colors text-left">
          {guide.title}
        </h3>
        
        <p className="text-gray-500 font-semibold text-xs md:text-sm leading-relaxed text-left max-w-4xl">
          {guide.excerpt || "Top 10 Smartphones to Buy in 2026. Find the best phone deals............"}
        </p>

        {/* Footer with Stats and Bookmark */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-6 text-[11px] font-black text-[#8a92a6] uppercase tracking-wider italic">
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

// Sub-component for Reel Story (Segment 2 of reference image)
export function ReelCard({ guide }: { guide: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  if (!guide?.id) return null;
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
      to={`/guides/${guide.id}`}
      className="group cursor-pointer block bg-white rounded-[5px] border border-[#e8edf2] p-4 relative overflow-hidden shadow-none hover:border-orange-primary/30 transition-all duration-350 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[9/16] w-full relative overflow-hidden bg-slate-950 rounded-xl">
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
            alt="Reel"
          />
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-10 pointer-events-none" />

        {/* Badge: Reel */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-white px-2.5 py-1 rounded-[6px] border border-gray-100 shadow-xs flex items-center justify-center">
            <span className="text-[9px] font-black text-black uppercase tracking-wider leading-none">REEL</span>
          </div>
        </div>

        {/* Platform logo top-right */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-0.5">
          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-transform duration-350 group-hover:scale-105">
            <Instagram size={14} />
          </div>
          <span className="text-[8px] font-black text-white uppercase tracking-wider drop-shadow-md">Instagram</span>
        </div>

        {/* Centered Red Play Button */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center z-10 transition-all duration-300",
          isHovering ? "opacity-0 scale-[1.1]" : "opacity-100 scale-100"
        )}>
          <div className="w-12 h-12 rounded-full bg-[#E02424] flex items-center justify-center border border-white/20 shadow-md">
            <Play className="text-white fill-white ml-0.5" size={18} />
          </div>
        </div>

        {/* Video Duration / Text Infused inside Media */}
        <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex flex-col justify-end text-left pointer-events-none">
          <h3 className="font-sans text-base md:text-lg font-black italic uppercase tracking-tighter text-white leading-tight mb-1 group-hover:text-orange-primary transition-colors">
            {guide.title}
          </h3>
          <p className="text-white/80 font-semibold text-[11px] leading-snug line-clamp-2 mb-2">
            {guide.excerpt || "Top 10 Smartphones to Buy in 2026. Find the best phone deals............"}
          </p>
          <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono text-white tracking-widest border border-white/5">
            {guide.duration || '8:10'}
          </div>
        </div>
      </div>

      {/* Footer Section below Media */}
      <CardEngagementStrip
        entityType="guide"
        entityId={guide.id}
        payload={guide}
        onClickCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    </Link>
  );
}

// Sub-component for Horizontal Media Story (Segment 3 of reference image)
export function HorizontalMediaCard({ guide, badgeType }: { guide: any, badgeType: 'youtube' | 'blog' }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  if (!guide?.id) return null;
  const handleMouseEnter = () => {
    if (badgeType === 'youtube') {
      setIsHovering(true);
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
      }
    }
  };

  const handleMouseLeave = () => {
    if (badgeType === 'youtube') {
      setIsHovering(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  return (
    <Link
      to={`/guides/${guide.id}`}
      className="group cursor-pointer block bg-white rounded-[5px] border border-[#e8edf2] p-4 relative overflow-hidden shadow-none hover:border-orange-primary/30 transition-all duration-350 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-950 rounded-xl">
        {badgeType === 'youtube' && guide.videoUrl ? (
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
            alt="Card Media"
          />
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Badge: top left */}
        <div className="absolute top-4 left-4 z-20">
          {badgeType === 'blog' ? (
            <div className="bg-white px-2.5 py-1 rounded-[6px] border border-gray-100 shadow-xs flex items-center gap-1.5">
              <BookOpen size={11} className="text-orange-primary" />
              <span className="text-[8.5px] font-mono font-bold text-gray-500 uppercase leading-none">{guide.readTime || '5 MIN READ'}</span>
            </div>
          ) : null}
        </div>

        {/* Platform logo top-right */}
        <div className="absolute top-4 right-4 z-20 flex flex-col items-center gap-0.5">
          {badgeType === 'youtube' ? (
            <>
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-transform duration-350 group-hover:scale-105">
                <Youtube size={14} />
              </div>
              <span className="text-[8px] font-black text-white uppercase tracking-wider drop-shadow-md">Youtube</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-transform duration-350 group-hover:scale-105">
                <LucidePenTool size={14} />
              </div>
              <span className="text-[8px] font-black text-white uppercase tracking-wider drop-shadow-md">Blog</span>
            </>
          )}
        </div>

        {/* Play Button for Youtube/Video Card */}
        {badgeType === 'youtube' && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center z-10 transition-all duration-300",
            isHovering ? "opacity-0 scale-[1.1]" : "opacity-100 scale-100"
          )}>
            <div className="w-12 h-12 rounded-full bg-[#E02424] flex items-center justify-center border border-white/20 shadow-sm">
              <Play className="text-white fill-white ml-0.5" size={18} />
            </div>
          </div>
        )}

        {/* Duration for Youtube */}
        {badgeType === 'youtube' && (
          <div className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-mono text-white tracking-widest border border-white/5">
            {guide.duration || '8:10'}
          </div>
        )}
      </div>

      {/* Content Section below Media */}
      <div className="pt-3 flex flex-col gap-1.5">
        <h3 className="font-sans text-base md:text-lg font-black italic uppercase tracking-tighter text-[#0c133c] leading-tight group-hover:text-orange-primary transition-colors text-left line-clamp-1">
          {guide.title}
        </h3>
        
        <p className="text-gray-400 font-semibold text-[11px] leading-relaxed text-left line-clamp-2">
          {guide.excerpt || "Top 10 Smartphones to Buy in 2026. Find the best phone deals............"}
        </p>

        {/* Footer with engagement */}
        <CardEngagementStrip
          entityType="guide"
          entityId={guide.id}
          payload={guide}
          onClickCapture={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      </div>
    </Link>
  );
}

export function GuidesPage() {
  const { allGuides, siteConfig } = useGlobalState();
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
      result = result.filter(blog => blog.id === 1 || blog.id === 2);
    } else if (activeTab === 'Editors Choice') {
      result = result.filter(blog => blog.id % 2 === 0);
    } else if (activeTab === 'Most Popular') {
      result = result.filter(blog => {
        const viewsStr = blog.views || '';
        return viewsStr.includes('M') || viewsStr.includes('K') || parseInt(viewsStr) > 100;
      });
    } else if (activeTab === 'Budget Picks') {
      result = result.filter(blog => blog.id % 3 === 0);
    } else if (activeTab === 'Premium Picks') {
      result = result.filter(blog => blog.id % 4 === 1);
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
      result = result.filter(blog => blog.id % 2 !== 0);
    }
    if (isEditorsPick === true) {
      result = result.filter(blog => blog.id % 2 === 0);
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
        result = result.filter(blog => blog.id % 2 === 0);
      } else if (productPriceRange === '1k-5k') {
        result = result.filter(blog => blog.id % 2 !== 0);
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
      result = result.sort((a, b) => b.id - a.id);
    }

    return result;
  };

  const filteredBlogs = getFilteredBlogs();

  const popularSearchTerms = useMemo(
    () =>
      buildGuidesPopularSearchTerms({
        cmsTerms: siteConfig?.popularSearches,
        guideTitles: filteredBlogs.map((blog) => blog.title),
        limit: 12,
      }),
    [siteConfig?.popularSearches, filteredBlogs],
  );

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
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E8500A] italic block">📺 YouTube Smart Specs</span>
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
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E8500A] italic block">📱 Reels Dynamic Specs</span>
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
              <span className="text-[10px] font-black uppercase tracking-wider text-[#E8500A] italic block">✍️ Blog / Article Specs</span>
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

  useRegisterPageFilters({
    pageName: 'Guides',
    renderSearch: () => (
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={13} className="text-[#E8500A]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guides, topics..."
          className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors"
        />
      </div>
    ),
    quickFilters: [
      { id: 'all-content', label: 'All Content', active: !selectedContentType && !selectedPlatform, onClick: () => { setSelectedContentType(null); setSelectedPlatform(null); } },
      { id: 'youtube', label: '📺 YouTube', active: selectedPlatform === 'youtube' || selectedContentType === 'video', onClick: () => { setSelectedPlatform(selectedPlatform === 'youtube' ? null : 'youtube'); setSelectedContentType(selectedPlatform === 'youtube' ? null : 'video'); } },
      { id: 'reels', label: '📱 Reels', active: selectedContentType === 'reels', onClick: () => setSelectedContentType(selectedContentType === 'reels' ? null : 'reels') },
      { id: 'blogs', label: '✍️ Blogs', active: selectedPlatform === 'blog' || selectedContentType === 'article', onClick: () => { setSelectedPlatform(selectedPlatform === 'blog' ? null : 'blog'); setSelectedContentType(selectedPlatform === 'blog' ? null : 'article'); } },
      { id: 'featured-pill', label: '★ Featured', active: activeTab === 'Featured', onClick: () => setActiveTab(activeTab === 'Featured' ? 'All' : 'Featured') },
      { id: 'verified-pill', label: '✓ Verified Creators', active: selectedVerifiedCreator === true, onClick: () => setSelectedVerifiedCreator(selectedVerifiedCreator === true ? null : true) },
      { id: 'trending-pill', label: '🔥 Trending', active: isTrending === true, onClick: () => setIsTrending(isTrending === true ? null : true) }
    ],
    renderFilters: () => (
      <div className="flex flex-col gap-4">
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
          <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Social Platforms</h3>
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
      </div>
    ),
    activeFilterCount: (selectedContentType ? 1 : 0) +
      (selectedPlatform ? 1 : 0) +
      (selectedCategory ? 1 : 0) +
      (selectedLanguage ? 1 : 0) +
      (selectedDuration ? 1 : 0) +
      (selectedCreator ? 1 : 0) +
      (selectedAuthor ? 1 : 0) +
      (selectedVerifiedCreator ? 1 : 0) +
      (selectedFollowers ? 1 : 0) +
      (selectedEngagementRate ? 1 : 0) +
      (selectedTopic ? 1 : 0) +
      (selectedSponsored ? 1 : 0) +
      (selectedOfficialCampaign ? 1 : 0) +
      (isTrending ? 1 : 0) +
      (isNew ? 1 : 0) +
      (isPopular ? 1 : 0) +
      (isEditorsPick ? 1 : 0) +
      (productCategory ? 1 : 0) +
      (productPriceRange ? 1 : 0) +
      (productAvailability ? 1 : 0) +
      (selectedReadingTime ? 1 : 0) +
      (selectedViews ? 1 : 0) +
      (selectedUploadDate ? 1 : 0) +
      (selectedMusic ? 1 : 0) +
      (sortOption !== 'default' ? 1 : 0) +
      (searchQuery ? 1 : 0),
    onClearAll: handleClearAllFilters,
  }, [
    searchQuery,
    activeTab,
    selectedContentType,
    selectedPlatform,
    selectedCategory,
    selectedTopic,
    selectedLanguage,
    selectedDuration,
    selectedCreator,
    selectedAuthor,
    selectedVerifiedCreator,
    selectedFollowers,
    selectedEngagementRate,
    selectedSponsored,
    selectedOfficialCampaign,
    isTrending,
    isNew,
    isPopular,
    isEditorsPick,
    productCategory,
    productPriceRange,
    productAvailability,
    selectedReadingTime,
    selectedViews,
    selectedUploadDate,
    selectedMusic,
    sortOption
  ]);

  return (
    <div id="guides-root" className="flex flex-col min-h-screen bg-choosify-feed">
      <PageHeroBanner pageKey="guides" />
      <HeroMarqueeTicker pageKey="guides" siteConfig={siteConfig} />

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
        allLabel="Guides"
        profileLabel="Guide library"
      />

      <main className={`max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6 py-5 w-full ${PAGE_LISTING_SINGLE_SHELL}`}>
         {/* Left Sidebar Navigation - migrated to Full Filter Panel */}
         <aside className="hidden lg:flex flex-col gap-4 lg:sticky lg:top-24 pb-10 flex-shrink-0 animate-fade-in text-left">
            {/* LEFT COLUMN SEARCH BAR */}
            <div className="relative mb-2">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={13} className="text-[#E8500A]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides, topics..."
                className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#E8500A]/50 transition-colors shadow-sm"
              />
            </div>
            <div id="guides-sidebar-filters" className="transition-all duration-300 rounded-[5px] w-full">
              {renderFilterPanel()}
            </div>

            <ListingAdRail
              sponsoredPlacementKey={PLACEMENT_KEYS.SIDEBAR_LANDSCAPE}
              sponsoredVariant="landscape"
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
                       <h3 className="font-sans text-lg font-black italic uppercase tracking-tighter text-[#1A1D4E] mb-1">No Results Found</h3>
                       <p className="text-gray-400 text-xs font-semibold leading-relaxed max-w-sm">We couldn't find any guides matching your criteria. Try adjusting your search query or category.</p>
                     </div>
                  ) : (
                     <div id="guides-hybrid-feed" className="flex flex-col gap-6 scroll-mt-36 animate-fade-in duration-500">
                        {isAnyFilterActive && (
                          <h4 className="font-sans text-xs font-black uppercase tracking-[0.25em] text-[#8a92a6] italic text-left">
                            Filtered Results ({filteredBlogs.length})
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

            <PopularSearchKeywords
              title="Popular recommendation searches"
              terms={popularSearchTerms}
              className="mt-0 pt-10"
            />

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
          
          {/* Sheet Panel */}
          <div className="relative bg-white w-full max-w-lg rounded-t-2xl max-h-[85vh] overflow-y-auto z-10 shadow-2xl p-5 flex flex-col gap-4 animate-slide-up select-none border border-gray-100">
            {/* Header / Grabber */}
            <div className="flex flex-col items-center gap-1.5 cursor-pointer pb-2">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" onClick={() => setIsMobileDrawerOpen(false)} />
              <div className="w-full flex items-center justify-between mt-2 px-1">
                <span className="text-[12px] font-black uppercase tracking-[0.16em] text-[#1a1a2e]">Recommendation Filters</span>
                <button 
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-navy hover:bg-gray-100 transition-all border-none cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Panel Body */}
            <div className="flex flex-col gap-4 pb-12">
              {renderFilterPanel()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
