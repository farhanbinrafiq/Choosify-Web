import React, { useState, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Star,
  ArrowRight,
  Play,
  Info,
  CheckCircle2,
  ShoppingBag,
  Smartphone,
  Laptop,
  Zap,
  Globe,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  HelpCircle,
  Users,
  Palette,
  Sparkles,
  XCircle,
  PartyPopper,
  Ruler,
  Shirt,
  Check,
  X,
  Package,
  Award,
  User,
  ThumbsUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BLOGS, PRODUCTS, PLACEHOLDER_IMAGE } from "../constants";
import { cn } from "../lib/utils";
import { DETAIL_SINGLE_FEED } from "../lib/pageLayout";
import { StickySectionNav } from "../components/StickySectionNav";
import { useSectionScrollSpy } from "../hooks/useSectionScrollSpy";
import { EvaluationData, ComparisonProduct } from "../types/evaluation";
import evaluationsData from "../data/evaluations.json";
import { RecommendationMediaGallery } from "../components/RecommendationMediaGallery";
import { SpotlightContentHero, type SpotlightHeroVariant } from "../components/spotlight/feed/SpotlightContentHero";
import { DYNAMIC_GUIDES, DEFAULT_DYNAMIC_GUIDE } from "../data/mockGuides";
import { CATEGORY_SPEC_CONFIGS } from "../data/guideSpecConfigs";
import { useDashboard } from "../context/DashboardContext";
import { useGlobalState } from "../context/GlobalStateContext";
import toast from "react-hot-toast";
import { FollowButton } from "../components/FollowButton";
import { useRegisterPageFilters } from "../components/FilterEngine";
import type { CatalogGuide } from "../types/catalog";
import type { SpotlightContent } from "../types/spotlight/experience/content";
import type { SpotlightPageSectionId } from "../types/spotlight/experience/pageSections";
import {
  isBrandOwnedContent,
  isPageSectionVisible,
  shouldShowBrandProfileCard,
  shouldShowCreatorProfileCard,
} from "../lib/spotlight/content/sectionManifestRegistry";
import { resolveContentDetailOptionalSections } from "../lib/spotlight/content/resolveContentDetailSections";
import { catalogGuideHref } from "../lib/spotlight/content";
import { SpotlightLiveStatusSection } from "../components/spotlight/experience/SpotlightLiveStatusSection";
import { BrandCardDesign, mapBrandToCardDesign } from "../components/BrandCardDesign";
import { SpotlightDetailsDescriptionSection } from "../components/spotlight/experience/SpotlightDetailsDescriptionSection";
import { SpotlightDetailsServicesSection } from "../components/spotlight/experience/SpotlightDetailsServicesSection";
import { SpotlightDetailsRelatedRail } from "../components/spotlight/experience/SpotlightDetailsRelatedRail";
import { ContentDetailOptionalSections } from "../components/contentDetail/ContentDetailOptionalSections";
import { ContentDetailWhatIsDiscussed } from "../components/contentDetail/ContentDetailWhatIsDiscussed";
import { useSpotlightExperience } from "../hooks/useSpotlightExperience";
import { openEmiPanel } from "../lib/emi";
import { EmiAiLogo } from "../components/EmiAiLogo";

const evaluations = evaluationsData as EvaluationData[];

const IconMap = {
  Smartphone: Smartphone,
  Laptop: Laptop,
  Zap: Zap,
  Globe: Globe,
  MessageSquare: MessageSquare,
  ShoppingBag: ShoppingBag,
};

const StoreIconMap = {
  ShoppingBag: <ShoppingBag size={18} className="text-blue-500" />,
  Smartphone: <Smartphone size={18} className="text-navy/40" />,
  Globe: <Globe size={18} className="text-blue-400" />,
  Bookmark: <Bookmark size={18} className="text-orange-primary" />,
};

const COMPARISON_DATA: ComparisonProduct[] = [
  {
    brand: "Ecstasy",
    subBrand: "Men's Wear",
    quality: "Good",
    service: "Normal",
    priceRange: { min: 2800 },
    packaging: "Great",
    performance: "Good",
    score: 8.0,
    actionLabel: "Shop",
  },
  {
    brand: "Infinity",
    subBrand: "Formal Wear",
    quality: "Premium",
    service: "Premium",
    priceRange: { min: 3500 },
    packaging: "Average",
    performance: "Great",
    score: 7.5,
    actionLabel: "Shop",
  },
  {
    brand: "Le Reve",
    subBrand: "Casual Wear",
    quality: "Excellent",
    service: "Best",
    priceRange: { min: 1500 },
    packaging: "Excellent",
    performance: "Excellent",
    score: 9.0,
    actionLabel: "Shop",
  },
  {
    brand: "Sailor",
    subBrand: "Top Brand",
    quality: "Budget",
    service: "Excellent",
    priceRange: { min: 1200 },
    packaging: "Good",
    performance: "Disappointed",
    score: 9.5,
    actionLabel: "Shop",
  },
  {
    brand: "Yellow",
    subBrand: "Ethnic Wear",
    quality: "Affordable",
    service: "Average",
    priceRange: { min: 500 },
    packaging: "Excellent",
    performance: "Awesome",
    score: 7.2,
    actionLabel: "Shop",
  },
];

export function GuideDetailPage({
  guideIdOverride,
  spotlightGuideOverride,
  spotlightHeroVariant,
  spotlightLiveEmbedUrl,
  spotlightVideoUrl,
  spotlightPosterImage,
  backHref,
  backLabel = 'Back',
  sectionManifest,
  spotlightContent,
}: {
  guideIdOverride?: string;
  spotlightGuideOverride?: CatalogGuide & { recommendedProducts?: string[]; date?: string };
  spotlightHeroVariant?: SpotlightHeroVariant;
  spotlightLiveEmbedUrl?: string;
  spotlightVideoUrl?: string;
  spotlightPosterImage?: string;
  backHref?: string;
  backLabel?: string;
  /** CMS-resolved visible sections (UX-08) */
  sectionManifest?: SpotlightPageSectionId[];
  spotlightContent?: SpotlightContent;
} = {}) {
  const heroRef = useRef<HTMLElement>(null);
  const { id: routeId } = useParams();
  const id = guideIdOverride ?? routeId;
  const navigate = useNavigate();
  const { allGuides, allBrands, addToCart, allCatalogProducts } = useGlobalState();
  const { allContent: spotlightAllContent } = useSpotlightExperience();
  const [relatedPlatformFilter, setRelatedPlatformFilter] = useState<string>('all');
  const [relatedTopicFilter, setRelatedTopicFilter] = useState<string>('all');

  const guide =
    spotlightGuideOverride ||
    allGuides.find((b) => String(b.id) === String(id) || (b as any).slug === id) ||
    allGuides[0] ||
    BLOGS.find((b) => b.id === Number(id)) ||
    BLOGS[0];

  const guideId = guide?.id;
  const dynamicData = DYNAMIC_GUIDES[Number(guideId)] || {
    ...DEFAULT_DYNAMIC_GUIDE,
    id: guide?.id,
    title: guide?.title,
    excerpt: guide?.excerpt,
    categorySpecType:
      ((guide as any)?.category || "MOBILE").toLowerCase() === "fashion"
        ? "fashion"
        : "mobile",
  };

  const creator = useMemo(() => {
    const fromDynamic = dynamicData.creator as any;
    if (fromDynamic?.name) return fromDynamic;
    const pub = spotlightContent?.publisher;
    if (pub && (pub.publisherType === 'creator' || pub.publisherType === 'influencer' || pub.publisherType === 'editorial_team')) {
      return {
        id: pub.publisherId || 'creator-editorial',
        name: pub.name || guide?.author || 'Choosify Editorial',
        avatar: pub.logoUrl || (guide as any)?.authorAvatar,
        handle: pub.name,
        verifiedStatus: pub.isVerified ? 'Verified creator' : 'Choosify Editor',
        bestFor: 'Choosify Editor',
        rating: 4.9,
        reviews: 24,
        followers: 1200,
        platforms: [],
        score: 92,
      };
    }
    if (guide?.author) {
      return {
        id: (guide as any).creatorId || 'creator-editorial',
        name: guide.author,
        avatar: (guide as any).authorAvatar,
        handle: guide.author,
        verifiedStatus: 'Choosify Editor',
        bestFor: 'Choosify Editor',
        rating: 4.9,
        reviews: 24,
        followers: 1200,
        platforms: [],
        score: 92,
      };
    }
    return fromDynamic;
  }, [dynamicData.creator, spotlightContent?.publisher, guide]);
  const specConfig =
    CATEGORY_SPEC_CONFIGS[dynamicData.categorySpecType] ||
    CATEGORY_SPEC_CONFIGS.mobile;

  const optionalSections = useMemo(
    () => resolveContentDetailOptionalSections(spotlightContent ?? null),
    [spotlightContent],
  );

  const guideSectionNavItems = useMemo(() => {
    const profileLabel =
      spotlightContent && isBrandOwnedContent(spotlightContent) ? "Brand" : "Reviewer";
    const iconFor = (id: string) => {
      switch (id) {
        case 'winner':
          return <Award size={13} />;
        case 'why-won':
          return <CheckCircle2 size={13} />;
        case 'quick-verdict':
          return <Zap size={13} />;
        case 'takeaways':
          return <Sparkles size={13} />;
        case 'items-mentioned':
        case 'what-is-discussed':
          return <ShoppingBag size={13} />;
        case 'brands-mentioned':
          return <Package size={13} />;
        case 'how-review-was-made':
          return <Info size={13} />;
        case 'reviewer-profile':
          return <User size={13} />;
        default:
          return <Star size={13} />;
      }
    };
    const labelFor = (id: string, fallback: string) => {
      const map: Record<string, string> = {
        winner: 'Winner',
        'why-won': 'Why It Won',
        'quick-verdict': 'Verdict',
        takeaways: 'Takeaways',
        'items-mentioned': 'Items',
        'brands-mentioned': 'Brands',
        'how-review-was-made': 'Method',
        'what-is-discussed': 'Discussed',
        'reviewer-profile': profileLabel,
      };
      return map[id] ?? fallback;
    };
    const fromOptional = optionalSections.map((s) => {
      const navId =
        s.id === 'winner'
          ? 'winner'
          : s.id === 'why_it_won'
            ? 'why-won'
            : s.id === 'verdict'
              ? 'quick-verdict'
              : s.id === 'takeaways'
                ? 'takeaways'
                : s.id === 'items_mentioned'
                  ? 'items-mentioned'
                  : s.id === 'brands_mentioned'
                    ? 'brands-mentioned'
                    : 'how-review-was-made';
      return { id: navId, label: labelFor(navId, s.id), icon: iconFor(navId) };
    });
    return [
      { id: 'what-is-discussed', label: 'Discussed', icon: iconFor('what-is-discussed') },
      ...fromOptional,
      { id: 'reviewer-profile', label: profileLabel, icon: iconFor('reviewer-profile') },
    ];
  }, [optionalSections, spotlightContent]);

  const showSection = (sectionId: SpotlightPageSectionId) =>
    isPageSectionVisible(sectionManifest, sectionId);

  const isSpotlightDetails = Boolean(spotlightContent);

  const relatedSpotlightItems = useMemo(() => {
    if (!spotlightContent) return [];
    const graphIds = new Set([
      ...spotlightContent.graph.relatedContentIds,
      ...spotlightContent.graph.relatedGuideIds,
      ...spotlightContent.connections.spotlightContentIds,
    ]);
    const fromGraph = spotlightAllContent.filter(
      (c) => c.contentId !== spotlightContent.contentId && graphIds.has(c.contentId),
    );
    if (fromGraph.length >= 2) return fromGraph.slice(0, 4);
    return spotlightAllContent
      .filter((c) => c.contentId !== spotlightContent.contentId)
      .slice(0, 4);
  }, [spotlightContent, spotlightAllContent]);

  const showCreatorCard =
    Boolean(creator) &&
    (!spotlightContent || shouldShowCreatorProfileCard(spotlightContent));
  // Brand-owned content (publisherType brand/retailer/…) shows brand profile, not creator.
  // Profile is a fixed Content Detail section — always render when applicable.
  const showBrandCard =
    Boolean(spotlightContent) &&
    shouldShowBrandProfileCard(spotlightContent!) &&
    !showCreatorCard;

  // Same directory tile as the Brands list page — resolved from the brand catalog,
  // falling back to publisher info when the brand record isn't in state.
  const brandCardModel = useMemo(() => {
    if (!spotlightContent) return null;
    const brandId = spotlightContent.connections.brandIds[0];
    const publisherName = spotlightContent.publisher.name?.trim().toLowerCase();
    const match = (allBrands ?? []).find(
      (b: any) =>
        (brandId != null &&
          (String(b.id) === String(brandId) || String(b.id) === String(Number(brandId)))) ||
        (publisherName && String(b.name || '').trim().toLowerCase() === publisherName),
    );
    if (match) return mapBrandToCardDesign(match);
    return mapBrandToCardDesign({
      id: brandId ?? spotlightContent.publisher.publisherId,
      name: spotlightContent.publisher.name,
      logo: spotlightContent.publisher.logoUrl,
    });
  }, [spotlightContent, allBrands]);

  const { activeId: activeSectionId, scrollToSection } =
    useSectionScrollSpy(guideSectionNavItems);

  useRegisterPageFilters({
    pageName: guide ? guide.title : 'Guide Details',
    renderSearch: null,
    // Section jumps live in StickySectionNav — avoid duplicate left FILTERS launcher
    quickFilters: [],
    renderFilters: null,
    activeFilterCount: 0,
    onClearAll: null,
    sectionNav: {
      items: guideSectionNavItems,
      activeId: activeSectionId,
      onNavigate: scrollToSection,
      allLabel: 'Guide',
      profileLabel: 'Guide detail',
    },
  }, [guide, guideSectionNavItems, activeSectionId, scrollToSection]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeProductIdx, setActiveProductIdx] = useState(0);

  const [interactions, setInteractions] = useState({
    loved: 1000,
    isLoved: false,
    helpful: 400,
    isHelpful: false,
    purchases: 95,
    isPurchased: false,
  });

  const toggleInteraction = (
    field: "isLoved" | "isHelpful" | "isPurchased",
  ) => {
    setInteractions((prev) => {
      const countField =
        field === "isLoved"
          ? "loved"
          : field === "isHelpful"
            ? "helpful"
            : "purchases";
      const isField = field;
      return {
        ...prev,
        [isField]: !prev[isField],
        [countField]: prev[isField]
          ? prev[countField] - 1
          : prev[countField] + 1,
      };
    });
  };

  // Find evaluation data for this guide/product
  const evaluation =
    evaluations.find((e) => e.productId === Number(id)) || evaluations[0];

  const guideImages = [
    "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
  ];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % guideImages.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + guideImages.length) % guideImages.length,
    );

  // Products related to this guide based on constants mapping
  const recommendedProductIds = (guide as any).recommendedProducts || [];
  const allGuideProducts = PRODUCTS.filter((p) => {
    if (recommendedProductIds.includes(p.id)) return true;
    const guideCategory = (guide.category || "").toLowerCase();
    const productCategory = (p.category || "").toLowerCase();
    if (guideCategory.includes("mobile") && productCategory.includes("phone"))
      return true;
    if (
      guideCategory.includes("fashion") &&
      productCategory.includes("fashion")
    )
      return true;
    if (guideCategory.includes("gaming") && productCategory.includes("gaming"))
      return true;
    if (guideCategory.includes("home") && productCategory.includes("home"))
      return true;
    if (guideCategory.includes("beauty") && productCategory.includes("beauty"))
      return true;
    return false;
  });

  // If no recommended products, fallback to first 3 products of matched categories, else global
  const displayProducts =
    allGuideProducts.length > 0
      ? allGuideProducts.slice(0, visibleCount)
      : PRODUCTS.slice(0, visibleCount);

  const { savedProducts, setSavedProducts, savedGuides, setSavedGuides, addToCompare, comparedProducts } =
    useDashboard();

  const isGuideSaved = savedGuides.some((g: { id?: string | number }) => String(g?.id) === String(guide.id));

  const toggleGuideSave = () => {
    if (isGuideSaved) {
      setSavedGuides((prev: any[]) => prev.filter((g: any) => String(g.id) !== String(guide.id)));
      toast.success('Removed from saved guides');
    } else {
      setSavedGuides((prev: any[]) => [guide, ...prev]);
      toast.success('Guide saved to your dashboard!');
    }
  };

  const relatedGuides = useMemo(() => {
    return allGuides
      .filter((b) => String(b.id) !== String(guide.id))
      .filter((b) => {
        if (relatedPlatformFilter !== 'all') {
          const type = String((b as any).type || (b as any).contentType || '').toLowerCase();
          if (relatedPlatformFilter === 'youtube' && !type.includes('youtube') && !type.includes('video')) return false;
          if (relatedPlatformFilter === 'reels' && !type.includes('reel') && !type.includes('short')) return false;
          if (relatedPlatformFilter === 'blog' && !type.includes('blog') && !type.includes('article')) return false;
        }
        if (relatedTopicFilter !== 'all') {
          const cat = String(b.category || '').toLowerCase();
          if (relatedTopicFilter === 'mobile' && !cat.includes('mobile') && !cat.includes('tech')) return false;
          if (relatedTopicFilter === 'fashion' && !cat.includes('fashion')) return false;
          if (relatedTopicFilter === 'home' && !cat.includes('home') && !cat.includes('living')) return false;
        }
        return true;
      })
      .slice(0, 4);
  }, [allGuides, guide.id, relatedPlatformFilter, relatedTopicFilter]);

  const handleViewProducts = () => {
    if (allGuideProducts.length > 6) {
      navigate(`/guides/${id}/products`);
    } else {
      setVisibleCount(6);
    }
  };

  const guideReadTime =
    (guide as { readTime?: string }).readTime?.replace(/_/g, " ") || "12 Min Read";
  const guideLastUpdated = "Updated June 2026";
  const guideViewCount = 12_480;
  const guideKindLabel = useMemo(() => {
    const guideType = String((guide as any)?.type || '').toLowerCase();
    if (guideType === 'video') return 'VIDEO GUIDE';
    if (guideType === 'reels' || guideType === 'shorts') return 'REELS GUIDE';
    if (guideType === 'article' || guideType === 'blog') return 'BUYING GUIDE';
    if (spotlightContent?.contentType) {
      return String(spotlightContent.contentType).replace(/_/g, ' ').toUpperCase();
    }
    return String(guide.category || 'BUYING GUIDE').toUpperCase();
  }, [spotlightContent?.contentType, guide]);
  const authorInitial = (creator?.name || "C").charAt(0).toUpperCase();

  const descriptionTitle = useMemo(() => {
    if (!spotlightContent) return 'Overview';
    if (['campaign', 'promotion', 'new_launch', 'brand_story'].includes(spotlightContent.contentType)) {
      return 'Campaign Description';
    }
    if (spotlightContent.contentType === 'live') return 'Event Description';
    if (spotlightContent.contentType === 'editorial') return 'Article';
    if (spotlightContent.contentType === 'community_pick') return 'Collection Description';
    return 'Overview';
  }, [spotlightContent]);

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {/* Breadcrumbs — above media (Choosify.dc Guide Detail) */}
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 pt-7 pb-0 w-full">
        {backHref && (
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#9AA0AC] hover:text-[#CF4400] mb-2"
          >
            <ArrowLeft size={14} /> {backLabel}
          </Link>
        )}
        <nav className="text-xs text-[#9AA0AC] mb-3.5" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#CF4400]">Home</Link>
          {' '}&nbsp;›&nbsp;{' '}
          <Link to="/spotlight" className="hover:text-[#CF4400]">Discover</Link>
          {' '}&nbsp;›&nbsp;{' '}
          <Link to="/guides" className="hover:text-[#CF4400]">Buying Guides</Link>
          {' '}&nbsp;›&nbsp;{' '}
          <span className="text-[#1A1A2E]">{guide.title}</span>
        </nav>
      </div>

      {/* Media gallery — navy band only (no title on dark chrome) */}
      <section
        ref={heroRef}
        className="relative w-full choosify-dark-surface py-7 mb-6 border-b border-white/5"
      >
        <div className="w-full relative">
          {spotlightHeroVariant ? (
            <SpotlightContentHero
              guide={guide}
              variant={spotlightHeroVariant}
              liveEmbedUrl={spotlightLiveEmbedUrl}
              videoUrl={spotlightVideoUrl}
              posterImage={spotlightPosterImage}
              headline={spotlightContent?.headline}
              media={spotlightContent?.media ?? undefined}
              live={spotlightContent?.live}
            />
          ) : (
            <RecommendationMediaGallery guide={guide} />
          )}
        </div>
      </section>

      {/* Engagement strip + title card — below gallery */}
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 w-full -mt-2 mb-4">
        <div className="bg-white rounded-xl border border-[#E8EDF2] border-t-[3px] border-t-[#2323FF] px-[26px] py-[18px] mb-4 flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-center">
          <div>
            <div className="text-[15px] font-extrabold text-[#1A1A2E] tabular-nums">
              {guideViewCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#9AA0AC] mt-0.5">Views</div>
          </div>
          <div>
            <div className="text-[15px] font-extrabold text-[#1A1A2E] tabular-nums">
              {interactions.loved.toLocaleString()}
            </div>
            <button
              type="button"
              onClick={() => toggleInteraction("isLoved")}
              className={cn(
                "mt-1 bg-white border text-[9.5px] font-bold px-2.5 py-0.5 rounded-[10px] cursor-pointer inline-flex items-center gap-1",
                interactions.isLoved
                  ? "border-[#FF000D] text-[#FF000D]"
                  : "border-[#E5E7EB] text-[#4B5563]",
              )}
            >
              <Heart size={11} className={cn(interactions.isLoved && "fill-current")} />
              Love React
            </button>
          </div>
          <div>
            <div className="text-[15px] font-extrabold text-[#1A1A2E] tabular-nums">
              {interactions.helpful.toLocaleString()}
            </div>
            <button
              type="button"
              onClick={() => toggleInteraction("isHelpful")}
              className={cn(
                "mt-1 bg-[#F4F7F9] border-0 text-[9.5px] font-bold px-2.5 py-0.5 rounded-[10px] cursor-pointer inline-flex items-center gap-1",
                interactions.isHelpful ? "text-[#2323FF]" : "text-[#4B5563]",
              )}
            >
              <ThumbsUp size={11} className={cn(interactions.isHelpful && "fill-current")} />
              Helpful
            </button>
          </div>
          <div>
            <div className="text-[15px] font-extrabold text-[#EB4501] tabular-nums">
              {interactions.purchases.toLocaleString()}
            </div>
            <button
              type="button"
              onClick={() => toggleInteraction("isPurchased")}
              className={cn(
                "mt-1 bg-[#F4F7F9] border-0 text-[9.5px] font-bold px-2.5 py-0.5 rounded-[10px] cursor-pointer inline-flex items-center gap-1",
                interactions.isPurchased ? "text-[#EB4501]" : "text-[#4B5563]",
              )}
            >
              <ShoppingBag size={11} />
              Purchased
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8EDF2] p-[26px] mb-4 text-left">
          <span className="inline-block bg-[#EB4501] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-[5px] mb-3.5 uppercase tracking-wide">
            {guideKindLabel}
          </span>
          <h1 className="text-2xl font-extrabold text-[#1A1A2E] mb-2 leading-snug">
            {guide.title}
          </h1>
          <p className="text-[13px] text-[#6B7280] leading-relaxed m-0 mb-[18px]">
            {guide.excerpt ||
              "An in-depth expert curation guiding your next big decision, backed by extensive testing and research."}
          </p>
          <div className="flex items-center gap-2.5 mb-5">
            {creator?.avatar ? (
              <img
                src={creator.avatar}
                alt=""
                className="w-[34px] h-[34px] rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-[34px] h-[34px] rounded-full bg-[#EB4501] flex items-center justify-center text-white text-xs font-extrabold shrink-0">
                {authorInitial}
              </div>
            )}
            <div>
              <div className="text-[12.5px] font-bold text-[#1A1A2E] flex items-center gap-1.5">
                {creator?.name || "Choosify Editorial"}
                <CheckCircle2 size={14} className="text-[#3B82F6] shrink-0" aria-label="Verified" />
              </div>
              <div className="text-[11px] text-[#9AA0AC]">
                {guideLastUpdated} · {guideReadTime} · {guideViewCount.toLocaleString()} views
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 items-center">
            <button
              type="button"
              onClick={() =>
                openEmiPanel(`Tell me about this buying guide: ${guide.title}`)
              }
              className="inline-flex items-center gap-1.5 bg-[linear-gradient(90deg,#6C4CFF,#EB4501)] text-white border-0 px-[18px] py-[11px] rounded-lg text-xs font-bold cursor-pointer hover:brightness-110 transition-all"
            >
              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center p-0.5 shrink-0">
                <EmiAiLogo size={14} className="w-3.5 h-3.5" />
              </span>
              Ask Emi about this Discovery
            </button>
            <button
              type="button"
              onClick={() => toggleInteraction("isLoved")}
              className={cn(
                "inline-flex items-center gap-1.5 border px-[18px] py-[11px] rounded-lg text-xs font-bold cursor-pointer transition-colors",
                interactions.isLoved
                  ? "bg-[#FF000D] border-[#FF000D] text-white"
                  : "bg-white border-[#E5E7EB] text-[#1A1A2E]",
              )}
            >
              <Heart size={14} className={cn(interactions.isLoved && "fill-current")} />
              Love React
            </button>
            <div className="flex gap-2.5 sm:ml-auto">
              <button
                type="button"
                onClick={toggleGuideSave}
                className={cn(
                  'inline-flex items-center gap-1.5 border-0 px-[18px] py-[11px] rounded-lg text-xs font-bold cursor-pointer transition-colors',
                  isGuideSaved
                    ? 'bg-[#FFF3EA] text-[#EB4501]'
                    : 'bg-[#F4F7F9] text-[#1A1A2E] hover:bg-[#E8EDF2]',
                )}
                aria-pressed={isGuideSaved}
              >
                <Heart
                  size={14}
                  className="text-[#EB4501]"
                  strokeWidth={2}
                  fill={isGuideSaved ? '#EB4501' : 'none'}
                />
                {isGuideSaved ? 'Saved' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Share link copied to clipboard!");
                }}
                className="inline-flex items-center gap-1.5 bg-[#F4F7F9] text-[#1A1A2E] border-0 px-[18px] py-[11px] rounded-lg text-xs font-bold cursor-pointer hover:bg-[#E8EDF2] transition-colors"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {spotlightContent && showSection('live_status') && (
        <SpotlightLiveStatusSection content={spotlightContent} className="-mt-2" />
      )}

      {guideSectionNavItems.length > 0 && (
      <StickySectionNav
        sections={guideSectionNavItems}
        activeId={activeSectionId}
        onNavigate={scrollToSection}
        allLabel="Guide"
        profileLabel="Guide sections"
        className="px-0 bg-choosify-feed/90"
        contentClassName="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10"
      />
      )}

      <div id="all-section" className="scroll-mt-36">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 py-8 md:py-10 w-full">
          <div className={`${DETAIL_SINGLE_FEED}`}>
            <main className="flex flex-col gap-12 w-full">
              {showSection('description') && (spotlightContent?.description || guide.excerpt) && (
                <SpotlightDetailsDescriptionSection
                  title={descriptionTitle}
                  description={spotlightContent?.description ?? guide.excerpt ?? ''}
                />
              )}

              {showSection('pricing') && spotlightContent && (
                <section className="scroll-mt-36" aria-labelledby="spotlight-pricing-heading">
                  <div className="mb-4 text-left">
                    <h2 id="spotlight-pricing-heading" className="text-2xl font-extrabold text-[#1A1A2E] mb-0.5">
                      Offer Details
                    </h2>
                    <p className="text-[13px] font-bold text-[#9AA0AC]">
                      Pricing and availability
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#e8edf2] p-5 shadow-sm text-left flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold text-[#EB4501] mb-1">Limited offer</p>
                      <p className="text-sm font-bold text-[#1a1a2e]">{spotlightContent.headline}</p>
                      {spotlightContent.endsAt && (
                        <p className="text-[11px] text-[#9AA0AC] mt-1">
                          Expires {new Date(spotlightContent.endsAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {spotlightContent.commerce.primaryCta && (
                      <Link
                        to={spotlightContent.commerce.primaryCta.href}
                        className="px-5 py-2.5 rounded-full bg-orange-primary hover:brightness-110 text-white text-[12px] font-bold transition-all"
                      >
                        {spotlightContent.commerce.primaryCta.label}
                      </Link>
                    )}
                  </div>
                </section>
              )}

              {showSection('associated_services') && spotlightContent && (
                <SpotlightDetailsServicesSection content={spotlightContent} />
              )}

              {/* Fixed: What Is Discussed? */}
              <ContentDetailWhatIsDiscussed
                products={displayProducts}
                activeIndex={activeProductIdx}
                onSelect={setActiveProductIdx}
              />

              {/* Optional sections — order/visibility from content.sections config */}
              <ContentDetailOptionalSections
                sections={optionalSections}
                ctx={{
                  content: spotlightContent ?? null,
                  category: spotlightContent?.category ?? guide?.category,
                  products: displayProducts,
                  hasMoreProducts: allGuideProducts.length > displayProducts.length,
                  onLoadMoreProducts: () => setVisibleCount((prev) => prev + 4),
                }}
              />

                {showBrandCard && brandCardModel && (
                  <div id="reviewer-profile" className="scroll-mt-36 mt-8 max-w-[280px] mx-auto">
                    <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-wide mb-3.5 text-left">
                      ABOUT THE BRAND
                    </div>
                    <BrandCardDesign brand={brandCardModel} />
                  </div>
                )}

                {/* ABOUT THE AUTHOR | IN THIS GUIDE — Choosify.dc.html */}
                {showCreatorCard && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-9">
                  <div id="reviewer-profile" className="scroll-mt-36 text-left">
                    <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-wide mb-3.5">
                      ABOUT THE AUTHOR
                    </div>
                    <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5 text-center">
                      <div className="relative w-[72px] h-[72px] mx-auto mb-3">
                        {creator?.avatar ? (
                          <img
                            src={creator.avatar}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#EB4501] flex items-center justify-center text-white text-[20px] font-extrabold">
                            {authorInitial}
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-[22px] h-[22px] rounded-full bg-[#6C4CFF] border-2 border-white flex items-center justify-center text-white text-[11px] font-extrabold">
                          ✓
                        </div>
                      </div>
                      <div className="text-[14px] font-extrabold text-[#1A1A2E] mb-0.5">
                        {creator.name}
                      </div>
                      <div className="text-[11.5px] text-[#9AA0AC] mb-3.5">
                        {creator.verifiedStatus || creator.bestFor || 'Choosify Editor'}
                      </div>
                      <div className="flex items-center justify-center border-y border-[#F1F1F3] py-3 mb-3.5">
                        <div className="flex-1">
                          <div className="text-[14px] font-extrabold text-[#1A1A2E]">
                            {creator.reviews ?? 24}
                          </div>
                          <div className="text-[9.5px] text-[#9AA0AC]">Reviews</div>
                        </div>
                        <div className="w-px h-[26px] bg-[#F1F1F3]" />
                        <div className="flex-1">
                          <div className="text-[14px] font-extrabold text-[#1A1A2E]">
                            {typeof creator.followers === 'number'
                              ? creator.followers >= 1000
                                ? `${(creator.followers / 1000).toFixed(1)}K`
                                : creator.followers
                              : '1.2K'}
                          </div>
                          <div className="text-[9.5px] text-[#9AA0AC]">Followers</div>
                        </div>
                        <div className="w-px h-[26px] bg-[#F1F1F3]" />
                        <div className="flex-1">
                          <div className="text-[14px] font-extrabold text-[#1A1A2E]">
                            {(creator.rating ?? 4.9).toFixed(1)}
                          </div>
                          <div className="text-[9.5px] text-[#9AA0AC]">Rating</div>
                        </div>
                      </div>
                      <FollowButton
                        id={`creator-${creator.id || creator.name}`}
                        name={creator.name}
                        type="creator"
                        className="w-full h-9 rounded-lg text-[11.5px] font-bold mb-2"
                      />
                      <Link
                        to={`/creators/${creator.id || creator.name}`}
                        className="block w-full bg-[#2323FF] hover:brightness-110 text-white text-center py-[9px] rounded-lg text-[11.5px] font-bold transition-[filter]"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E8EDF2] rounded-[10px] p-5 text-left">
                    <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-wide mb-3.5">
                      IN THIS GUIDE
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {[
                        'Overall winner & rating',
                        'Key takeaways',
                        'Recommendations & quick verdict',
                        'Other products mentioned',
                        'How this review was made',
                      ].map((item, i) => (
                        <div key={item} className="text-[12px] text-[#4B5563] flex gap-2">
                          <span className="font-bold text-[#1A1A2E]">{i + 1}.</span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                )}
            </main>
          </div>
        </div>
      </div>

      {/* Related Recommendations (End of Page) */}
      {showSection('related_spotlight') && (
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 w-full mb-32">
        {isSpotlightDetails ? (
          <SpotlightDetailsRelatedRail
            items={relatedSpotlightItems}
            products={allCatalogProducts}
            viewAllHref="/spotlight"
            viewAllLabel="Browse Spotlight"
          />
        ) : (
        <section className="mt-20 bg-white border border-[#E8EDF2] rounded-[10px] p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3 mb-3.5">
            <h3 className="text-[13px] font-extrabold text-[#1A1A2E] tracking-wide uppercase">
              You May Also Like
            </h3>
            <Link
              to="/guides"
              className="text-[12px] font-bold text-[#1A1A2E] hover:text-[#CF4400] shrink-0"
            >
              View All Guides ›
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: 'all', label: 'All platforms' },
              { id: 'youtube', label: 'YouTube' },
              { id: 'reels', label: 'Reels / Shorts' },
              { id: 'blog', label: 'Blog / Article' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRelatedPlatformFilter(opt.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-[10px] font-bold border cursor-pointer transition-colors',
                  relatedPlatformFilter === opt.id
                    ? 'bg-[#EB4501] text-white border-transparent'
                    : 'bg-white text-[#4B5563] border-[#E8EDF2] hover:border-[#EB4501]/40',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-8">
            {relatedGuides.slice(0, 5).map((g) => (
              <Link key={g.id} to={catalogGuideHref(g)} className="min-w-0 group">
                <div className="relative h-[120px] rounded-lg overflow-hidden mb-2 bg-[#F4F7F9]">
                  <img
                    src={g.image || PLACEHOLDER_IMAGE}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-[#EB4501] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm pointer-events-none">
                    {g.type === 'video'
                      ? 'VIDEO'
                      : g.type === 'reels' || g.type === 'shorts'
                        ? 'REELS'
                        : 'GUIDE'}
                  </span>
                </div>
                <div className="text-[11.5px] font-semibold text-[#1A1A2E] leading-snug line-clamp-2 mb-1">
                  {g.title}
                </div>
                <div className="text-[10px] text-[#9AA0AC]">
                  {g.readTime || g.duration || 'Choosify Editorial'}
                </div>
              </Link>
            ))}
          </div>

        </section>
        )}
      </div>
      )}
    </div>
  );
}