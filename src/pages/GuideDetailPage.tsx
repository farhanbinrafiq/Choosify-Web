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
  Youtube,
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
  CalendarDays,
  Check,
  X,
  Facebook,
  Twitter,
  ShieldCheck,
  Layers,
  Package,
  Award,
  User,
  Gift,
  Clock,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BLOGS, PRODUCTS } from "../constants";
import { cn } from "../lib/utils";
import { PRODUCT_CARD_GRID, DETAIL_SINGLE_FEED, GUIDE_MEDIA_GRID } from "../lib/pageLayout";
import { renderGuideMediaCard } from "./GuidesPage";
import { StickySectionNav } from "../components/StickySectionNav";
import { HeroScrollCue, HERO_SCROLL_CUE_PADDING } from "../components/HeroScrollCue";
import { useSectionScrollSpy } from "../hooks/useSectionScrollSpy";
import { EvaluationData, ComparisonProduct } from "../types/evaluation";
import evaluationsData from "../data/evaluations.json";
import { RecommendationMediaGallery } from "../components/RecommendationMediaGallery";
import {
  DetailHeroSummaryBar,
  detailHeroSummaryActionPrimaryClass,
  detailHeroSummaryActionSecondaryClass,
} from "../components/DetailHeroSummaryBar";
import { DYNAMIC_GUIDES, DEFAULT_DYNAMIC_GUIDE } from "../data/mockGuides";
import { CATEGORY_SPEC_CONFIGS } from "../data/guideSpecConfigs";
import { ProductCard } from "../components/ProductCard";
import { useDashboard } from "../context/DashboardContext";
import { useGlobalState } from "../context/GlobalStateContext";
import toast from "react-hot-toast";
import { FollowButton } from "../components/FollowButton";
import { useRegisterPageFilters } from "../components/FilterEngine";

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

export function GuideDetailPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { allGuides } = useGlobalState();

  const guide =
    allGuides.find((b) => String(b.id) === String(id) || (b as any).slug === id) ||
    allGuides[0] ||
    BLOGS.find((b) => b.id === Number(id)) ||
    BLOGS[0];

  useRegisterPageFilters({
    pageName: guide ? guide.title : 'Guide Details',
    renderSearch: null,
    quickFilters: [
      { id: 'article', label: '📖 Editorial Guide', active: true, onClick: () => {} },
      { id: 'products', label: '🛒 Recommended Products', active: false, onClick: () => {} },
      { id: 'specs', label: '📊 Spec Breakdown', active: false, onClick: () => {} }
    ],
    renderFilters: null,
    activeFilterCount: 0,
    onClearAll: null
  }, [guide]);

  const guideId = guide?.id;
  const dynamicData = DYNAMIC_GUIDES[Number(guideId)] || {
    ...DEFAULT_DYNAMIC_GUIDE,
    id: guide.id,
    title: guide.title,
    excerpt: guide.excerpt,
    categorySpecType:
      (guide.category || "MOBILE").toLowerCase() === "fashion"
        ? "fashion"
        : "mobile",
  };

  const creator = dynamicData.creator;
  const specConfig =
    CATEGORY_SPEC_CONFIGS[dynamicData.categorySpecType] ||
    CATEGORY_SPEC_CONFIGS.mobile;

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

  const { savedProducts, setSavedProducts, addToCompare, comparedProducts } =
    useDashboard();
  const { allBrands, addToCart } = useGlobalState();

  const guideSectionNavItems = useMemo(
    () => [
      { id: "winner", label: "Winner", icon: <Award size={13} /> },
      { id: "why-won", label: "Why It Won", icon: <CheckCircle2 size={13} /> },
      { id: "quick-verdict", label: "Verdict", icon: <Zap size={13} /> },
      { id: "takeaways", label: "Takeaways", icon: <Sparkles size={13} /> },
      { id: "top-3", label: "Top 3", icon: <Star size={13} /> },
      { id: "all-products", label: "Products", icon: <ShoppingBag size={13} /> },
      { id: "review-context", label: "Reviewed", icon: <Package size={13} /> },
      { id: "reviewer-profile", label: "Reviewer", icon: <User size={13} /> },
    ],
    [],
  );

  const { activeId: activeSectionId, scrollToSection } =
    useSectionScrollSpy(guideSectionNavItems);

  const handleViewProducts = () => {
    if (allGuideProducts.length > 6) {
      navigate(`/guides/${id}/products`);
    } else {
      setVisibleCount(6);
    }
  };

  const overallWinnerProduct = displayProducts[0] || allGuideProducts[0] || PRODUCTS[0];
  const bestBudgetProduct = useMemo(() => {
    if (!allGuideProducts.length) return PRODUCTS[1] || PRODUCTS[0];
    return [...allGuideProducts].sort((a, b) => {
      const priceA = parseFloat(String(a.price || 0).replace(/,/g, ""));
      const priceB = parseFloat(String(b.price || 0).replace(/,/g, ""));
      return priceA - priceB;
    })[0];
  }, [allGuideProducts]);

  const formatProductLabel = (product?: { brand?: string; title?: string }) => {
    if (!product) return "TBD";
    const label = `${product.brand || ""} ${product.title || ""}`.trim();
    return label.length > 42 ? `${label.slice(0, 39)}…` : label;
  };

  const guideReadTime =
    (guide as { readTime?: string }).readTime?.replace(/_/g, " ") || "12 Min Read";
  const guideLastUpdated = "June 2026";

  return (
    <div className="bg-white min-h-screen">
      {/* Unified Guide Hero — breadcrumbs, media, guide info, and summary in one section */}
      <section
        ref={heroRef}
        className={cn(
          "relative w-full choosify-dark-gradient border-b border-white/5",
          HERO_SCROLL_CUE_PADDING,
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,91,0,0.18),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,4,53,0.4),transparent_55%)]" />

        <div className="relative z-10">
          <div className="w-full bg-transparent relative">
            <RecommendationMediaGallery guide={guide} />
          </div>

          <div className="max-w-[1080px] mx-auto px-6 pb-6 text-left">
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight mb-4 font-sans drop-shadow-xl">
              {guide.title}
            </h1>

            <p className="text-white/85 text-sm md:text-base font-medium italic uppercase tracking-wider leading-relaxed max-w-4xl font-sans">
              {guide.excerpt ||
                "An in-depth expert curation guiding your next big decision, backed by extensive testing and research."}
            </p>
          </div>

          <DetailHeroSummaryBar
            actionsPlacement="bottom-center"
            items={[
              {
                id: 'published',
                icon: CalendarDays,
                label: `Published ${guide.date || 'May 12, 2026'}`,
              },
              {
                id: 'read-time',
                icon: Clock,
                label: guideReadTime,
              },
              {
                id: 'products-reviewed',
                icon: Package,
                label: `${allGuideProducts.length || 8} Products Reviewed`,
              },
              {
                id: 'winner',
                icon: Award,
                wide: true,
                label: `Winner: ${formatProductLabel(overallWinnerProduct)}`,
              },
              {
                id: 'best-budget',
                icon: Gift,
                wide: true,
                label: `Best Budget: ${formatProductLabel(bestBudgetProduct)}`,
              },
              {
                id: 'updated',
                icon: RefreshCw,
                label: `Updated ${guideLastUpdated}`,
              },
            ]}
            actions={
              <>
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Guide saved to your dashboard!');
                  }}
                  className={detailHeroSummaryActionSecondaryClass}
                >
                  <Bookmark size={13} className="text-[#E8500A]" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Share link copied to clipboard!');
                  }}
                  className={detailHeroSummaryActionPrimaryClass}
                >
                  <Share2 size={13} />
                  Share
                </button>
              </>
            }
          />
        </div>
        <HeroScrollCue anchorRef={heroRef} />
      </section>

      <StickySectionNav
        sections={guideSectionNavItems}
        activeId={activeSectionId}
        onNavigate={scrollToSection}
        allLabel="Guide"
        profileLabel="Guide sections"
      />

      <div id="all-section" className="scroll-mt-36">
        <div className="max-w-[1440px] mx-auto px-4 py-5 w-full">
          <div className={`${DETAIL_SINGLE_FEED}`}>
            <main className="flex flex-col gap-12 w-full">
              {/* SECTION 1: #1 OVERALL WINNER PRODUCT */}
              <div id="winner" className="scroll-mt-36">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-black text-[#1A1D4E] italic tracking-tighter uppercase mb-0.5">
                    #1 OVERALL WINNER PRODUCT
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">
                    The highest performing option matching overall premium
                    metrics
                  </p>
                </div>

                {displayProducts.length > 0 && (
                  <div
                    id="prod-sec-0"
                    className="group relative w-full rounded-[5px] overflow-hidden shadow-2xl flex flex-col hero-gradient text-white p-6 md:p-8 mb-8 mt-2 scroll-mt-36 border border-white/5"
                  >
                    {/* 1. CARD HEADER */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.25em]">
                            EDITORIAL CHAMPION
                          </span>
                          <span className="px-1.5 py-0.5 text-[9px] font-black tracking-widest text-[#F97316]/90 border border-[#F97316]/30 uppercase bg-[#F97316]/10 rounded-full">
                            APPROVED
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white mt-1 italic tracking-tight uppercase">
                          OVERALL WINNER
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          First-place gold standard with peak scoring across all
                          category tests.
                        </p>
                      </div>
                      <div>
                        <span className="rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wider bg-white/5 text-gray-300 border border-white/10 uppercase">
                          ★ #1 RANKED
                        </span>
                      </div>
                    </div>

                    <div
                      className="h-[1px] my-5"
                      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    />

                    {/* 2. BRAND & PRODUCT IDENTITY ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-white/5 rounded-[5px] p-5 border border-white/5 mb-6">
                      {/* Zone A: Logo / Stamp block */}
                      <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => navigate(`/products/${displayProducts[0]?.id}`)}
                      >
                        <div className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-[#F97316]/50 transition-transform hover:scale-105 shrink-0">
                          <span className="text-[#060922] font-black text-xl tracking-tighter">
                            {displayProducts[0]?.brand?.charAt(0) || "W"}
                          </span>
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                            <svg
                              className="w-3.5 h-3.5 text-[#22C55E]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-[9px] font-extrabold text-[#F97316] uppercase tracking-widest block mb-0.5">
                            ESTABLISHED CHAMPION
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
                            BEST CRITIC SCORE ➔
                          </span>
                        </div>
                      </div>

                      {/* Zone B: Identity Info */}
                      <div className="text-left md:border-l md:border-white/10 md:pl-6">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-white tracking-tight uppercase">
                            {displayProducts[0]?.brand}
                          </h4>
                          <span className="bg-[#22C55E]/15 text-[#22C55E] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-[#22C55E]/20">
                            TOP PICK
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 capitalize">
                          Category:{" "}
                          {displayProducts[0]?.category || "Premium Pick"}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-gray-300">
                          <span className="text-amber-400">4.9 ★★★★★</span>
                          <span className="text-white/40">•</span>
                          <span>Premium Sourcing</span>
                        </div>
                      </div>

                      {/* Zone C: Metrics highlights */}
                      <div className="flex flex-wrap gap-2 justify-start md:justify-end md:border-l md:border-white/10 md:pl-6 w-full">
                        <span
                          className="px-2.5 py-1 text-[10px] text-white/95 rounded-[5px] font-bold transition-all hover:bg-white/10 text-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                        >
                          🏆 Best Specs
                        </span>
                        <span
                          className="px-2.5 py-1 text-[10px] text-white/95 rounded-[5px] font-bold transition-all hover:bg-white/10 text-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                        >
                          ⚡ Top Power
                        </span>
                        <span
                          className="px-2.5 py-1 text-[10px] text-white/95 rounded-[5px] font-bold transition-all hover:bg-white/10 text-center"
                          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                        >
                          🛡️ Highly Durable
                        </span>
                      </div>
                    </div>

                    {/* 3. PRODUCT SPECIFIC PANEL */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Left: Aspect Square Image Container */}
                      <div
                        className="md:col-span-4 relative aspect-square rounded-[5px] overflow-hidden flex items-center justify-center bg-white border border-white/5 shadow-inner p-6 cursor-pointer group shrink-0"
                        onClick={() => navigate(`/products/${displayProducts[0]?.id}`)}
                      >
                        <img
                          src={displayProducts[0]?.image}
                          className="max-h-[90%] max-w-[90%] object-contain transition-transform duration-500 group-hover:scale-105"
                          alt={displayProducts[0]?.title}
                        />
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full z-10">
                          VERIFIED SOURCE
                        </div>
                      </div>

                      {/* Right: Expert Summary, Price & Primary Action */}
                      <div className="md:col-span-8 flex flex-col justify-between text-left h-full">
                        <div className="pt-1">
                          <span className="text-[9px] font-black tracking-widest text-[#F97316] uppercase block mb-1">
                            EXPERT LAB WINNER DETAILS
                          </span>
                          <h4 className="text-lg font-bold text-white mb-2 uppercase">
                            {displayProducts[0]?.brand}{" "}
                            {displayProducts[0]?.title}
                          </h4>
                          <p className="text-xs text-gray-300 leading-relaxed font-medium mb-4">
                            During our exhaustive evaluation cycles, this
                            premier{" "}
                            {displayProducts[0]?.category?.toLowerCase() ||
                              "offering"}{" "}
                            showed absolute superiority. Engineering tests
                            confirmed outstanding thermal and structural
                            resilience, high performance efficiency, and flawless
                            build quality. It is the absolute highest recommended
                            selection for demanding use cases.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                          <div className="text-left font-mono">
                            <span className="text-[9px] text-gray-400 block -mb-0.5">
                              ESTIMATED PRICE
                            </span>
                            <span className="text-xl font-black text-[#F97316] leading-none">
                              ৳{displayProducts[0]?.price?.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => {
                                navigate(`/products/${displayProducts[0]?.id}`);
                              }}
                              className="bg-[#F97316] hover:bg-[#E8500A] text-white px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest italic transition-all shadow-lg active:scale-95 cursor-pointer border-0 font-bold"
                            >
                              Shop Now
                            </button>
                            <Link
                              to={`/products/${displayProducts[0]?.id}`}
                              className="bg-white/15 hover:bg-white/25 text-white px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest italic transition-all border border-white/10 cursor-pointer font-bold"
                            >
                              See Best Price
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. OUR SCORE MATRIX FOOTER */}
                    <div className="mt-8 border-t border-white/10 pt-6">
                      <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 text-left font-mono">
                        OUR SCORE MATRIX
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {[
                          { label: "Value For Money", val: 9.0 },
                          { label: "Performance", val: 9.8 },
                          { label: "Camera", val: 9.5 },
                          { label: "Battery", val: 9.2 },
                          { label: "Display", val: 9.6 },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="bg-white/5 rounded-[5px] p-3 border border-white/5 flex flex-col justify-between text-left"
                          >
                            <span className="text-[8px] font-bold text-white/50 uppercase tracking-wider leading-tight mb-2 line-clamp-1">
                              {item.label}
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-black text-[#F97316] leading-none font-mono">
                                {item.val}
                              </span>
                              <span className="text-[8px] text-white/20 font-mono">
                                /10
                              </span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                              <div
                                className="h-full bg-[#F97316]"
                                style={{ width: `${item.val * 10}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: #1 WHY THIS WON */}
              <div id="why-won" className="scroll-mt-36">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-black text-[#1A1D4E] italic tracking-tighter uppercase mb-0.5">
                    #1 WHY THIS WON
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">
                    Crucial hardware & testing decision signals
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    {
                      text: "Industry-Leading Reliability",
                      icon: "✓",
                      color:
                        "bg-emerald-500/10 border-emerald-500/20 text-emerald-600",
                    },
                    {
                      text: "Best-in-Class Hardware Specification",
                      icon: "✦",
                      color: "bg-blue-500/10 border-blue-500/20 text-blue-600",
                    },
                    {
                      text: "Double-Inspected Sourcing Trust",
                      icon: "🛡️",
                      color:
                        "bg-[#E8500A]/10 border-[#E8500A]/20 text-[#E8500A]",
                    },
                    {
                      text: "Zero Interest Monthly EMI Approved",
                      icon: "৳",
                      color:
                        "bg-purple-500/10 border-purple-500/20 text-purple-600",
                    },
                    {
                      text: "Immediate Metro Shipping Certified",
                      icon: "🗲",
                      color:
                        "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 font-bold",
                    },
                    {
                      text: "Longer Extended Manufacturer Support",
                      icon: "⏳",
                      color: "bg-teal-500/10 border-teal-500/20 text-teal-600",
                    },
                  ].map((chip, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "px-4 py-2 text-[10px] font-black uppercase tracking-wider border rounded-xl flex items-center gap-1.5",
                        chip.color,
                      )}
                    >
                      <span>{chip.icon}</span> {chip.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* SECTION 3: RECOMMENDATION & QUICK VERDICT */}
              <div id="quick-verdict" className="scroll-mt-36">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-black text-[#1A1D4E] italic tracking-tighter uppercase mb-0.5">
                    RECOMMENDATION & QUICK VERDICT
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">
                    High level, scannable advice
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Best for */}
                  <div className="bg-white rounded-[5px] border border-gray-100 p-5 text-left shadow-sm">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic flex items-center gap-1.5 mb-2">
                      <Check size={12} className="text-emerald-500" /> BEST FOR
                    </span>
                    <ul className="space-y-1.5 pl-1.5 list-none">
                      {[
                        "High daily usage & professionals",
                        "Premium display enthusiasts",
                        "Zero hassle long-term support",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="text-[10px] font-bold uppercase text-navy/70 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Not For */}
                  <div className="bg-white rounded-[5px] border border-gray-100 p-5 text-left shadow-sm">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic flex items-center gap-1.5 mb-2">
                      <X size={12} className="text-red-500" /> NOT FOR
                    </span>
                    <ul className="space-y-1.5 pl-1.5 list-none">
                      {[
                        "Ultra-tight budget buyers",
                        "Compact pocket lovers",
                        "Sourcing-indifferent shoppers",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="text-[10px] font-bold uppercase text-navy/70 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What we like */}
                  <div className="bg-white rounded-[5px] border border-gray-100 p-5 text-left shadow-sm">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic flex items-center gap-1.5 mb-2">
                      <Star size={12} className="text-blue-500" /> WHAT WE LIKE
                    </span>
                    <ul className="space-y-1.5 pl-1.5 list-none">
                      {[
                        "Exquisite screen brightness",
                        "Stunning camera outputs",
                        "Superfast thermal cooling",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="text-[10px] font-bold uppercase text-navy/70 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What to consider */}
                  <div className="bg-white rounded-[5px] border border-gray-100 p-5 text-left shadow-sm">
                    <span className="text-[10px] font-black text-[#E8500A] uppercase tracking-widest italic flex items-center gap-1.5 mb-2">
                      <Info size={12} className="text-[#E8500A]" /> WHAT TO
                      CONSIDER
                    </span>
                    <ul className="space-y-1.5 pl-1.5 list-none">
                      {[
                        "High stock demand limits",
                        "Explicit premium price bar",
                        "Requires premium charger/accessories",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="text-[10px] font-bold uppercase text-navy/70 flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E8500A]/50 shrink-0" />{" "}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* GENERAL SCORING DETAILS BLOCK */}
              <div className="bg-white border border-gray-100 rounded-[5px] p-6 shadow-sm text-left">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 last:border-0 text-left">
                  <h3 className="text-xl font-black text-navy uppercase italic tracking-tighter leading-none">
                    Detail Evaluation
                  </h3>
                  <div className="text-[8px] bg-gray-50 text-gray-400 italic px-3 py-1.5 rounded-full uppercase tracking-widest font-black font-mono">
                    Score Matrix
                  </div>
                </div>

                <div className="space-y-8">
                  {((specConfig as any).criteria || []).map(
                    (crt: any, i: number) => {
                      const key = crt.name.toLowerCase();
                      const score = evaluation
                        ? (evaluation as any).detailedScores?.[key] || 9.2
                        : 9.2;
                      const detailText = evaluation
                        ? (evaluation as any).details?.[key] ||
                          "Verified as our high performing metric aspect of testing."
                        : "Verified as our high performing metric aspect of testing.";

                      return (
                        <div
                          key={i}
                          className="flex flex-col gap-3 relative pb-6 border-b border-gray-50 last:border-0 last:pb-0 text-left"
                        >
                          <div className="flex items-center justify-between text-left">
                            <div className="flex flex-col text-left">
                              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic mb-1 font-mono">
                                CRITERIA 0{i + 1}
                              </span>
                              <h4 className="text-sm font-black text-navy uppercase italic tracking-tight leading-none">
                                {crt.name}
                              </h4>
                            </div>
                            <div className="text-xl font-black text-[#1B5CFF] italic leading-none font-mono">
                              {score}{" "}
                              <span className="text-[10px] text-gray-300 font-mono">
                                /10
                              </span>
                            </div>
                          </div>

                          <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#1B5CFF] h-full"
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>
                          <p className="text-[11px] font-semibold text-gray-400 italic uppercase tracking-wider leading-relaxed text-left">
                            {detailText}
                          </p>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* SECTION 4: KEY TAKEAWAYS & FINAL RECOMMENDATION */}
              <div id="takeaways" className="scroll-mt-36">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-black text-[#1A1D4E] italic tracking-tighter uppercase mb-0.5">
                    KEY TAKEAWAYS
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">
                    Final direct expert conclusion
                  </p>
                </div>
                <div className="hero-gradient text-white rounded-[5px] p-6 text-left shadow-sm border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-full bg-[#E8500A]/10 blur-xl pointer-events-none" />
                  <p className="text-[13px] font-black uppercase tracking-wider italic text-[#FF5C38] mb-1 leading-none">
                    The Verdict
                  </p>
                  <p className="text-[12px] font-bold text-gray-200 leading-relaxed italic uppercase max-w-2xl text-left">
                    "If you value pristine hardware stability, direct sourcing
                    authenticity, and optimal value return on your premium
                    hardware spend, the overall winner remains our absolute
                    recommendation for this year. Do not settle for unverified
                    alternatives."
                  </p>
                </div>
              </div>

              {/* SECTION 5: OTHER PRODUCTS MENTIONED | TOP 3 */}
              <div id="top-3" className="scroll-mt-36">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-black text-[#1A1D4E] italic tracking-tighter uppercase mb-0.5">
                    OTHER PRODUCTS MENTIONED | TOP 3
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">
                    High-tier alternative models evaluated
                  </p>
                </div>
                <div className={PRODUCT_CARD_GRID}>
                  {displayProducts.slice(1, 4).map((product, idx) => (
                    <div
                      key={product.id}
                      id={`prod-sec-${idx + 1}`}
                      className="scroll-mt-36"
                    >
                      <ProductCard
                        product={product}
                        variant="grid"
                        isGuideDetail={true}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 6: OTHER PRODUCTS MENTIONED */}
              <div id="all-products" className="scroll-mt-36">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-black text-[#1A1D4E] italic tracking-tighter uppercase mb-0.5">
                    OTHER PRODUCTS MENTIONED
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] italic">
                    Every model covered during continuous testing
                  </p>
                </div>

                <div className={PRODUCT_CARD_GRID}>
                  {displayProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant="grid"
                      isGuideDetail={true}
                    />
                  ))}
                </div>

                {allGuideProducts.length > displayProducts.length && (
                  <div className="text-center mt-8 font-bold">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 4)}
                      className="px-8 py-3.5 border border-[#1A1D4E] hover:bg-[#1A1D4E] hover:text-white text-[#1A1D4E] font-black text-[10px] uppercase tracking-widest rounded-full italic transition-all cursor-pointer bg-white"
                    >
                      Load More Products
                    </button>
                  </div>
                )}

                {/* What was reviewed + how this review was made — above reviewer profile */}
                <div
                  id="review-context"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-5 scroll-mt-36 mt-12"
                >
                  <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm text-left">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e8edf2] px-0.5">
                      <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider flex items-center gap-1.5 leading-none">
                        <span className="w-1.5 h-3 bg-[#E8500A] rounded-full inline-block" />
                        What Was Reviewed
                      </h3>
                      <span className="text-[9px] font-black text-[#E8500A] uppercase tracking-widest">
                        {displayProducts.length} items
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto no-scrollbar">
                      {displayProducts.map((p, idx) => {
                        const isActive = activeProductIdx === idx;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              const el = document.getElementById(`prod-sec-${idx}`);
                              if (el) {
                                const top =
                                  el.getBoundingClientRect().top + window.pageYOffset - 200;
                                window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                                setActiveProductIdx(idx);
                              }
                            }}
                            className={cn(
                              "w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer",
                              isActive
                                ? "bg-[#E8500A]/5 border-[#E8500A]/30 text-[#E8500A] shadow-sm"
                                : "bg-white border-gray-100 text-navy hover:border-gray-200",
                            )}
                          >
                            <span className="text-xs font-black tracking-tight shrink-0 w-5">
                              {idx + 1}.
                            </span>
                            <div className="w-8 h-8 rounded bg-gray-50 border border-[#e8edf2] p-0.5 shrink-0 overflow-hidden flex items-center justify-center">
                              <img
                                src={p.image}
                                className="w-full h-full object-contain"
                                alt=""
                              />
                            </div>
                            <span className="text-[11px] font-semibold uppercase truncate tracking-tight">
                              {p.brand} {p.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm text-left">
                    <h4 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider flex items-center gap-1.5 leading-none pb-3 mb-3 border-b border-[#e8edf2]">
                      <span className="w-1.5 h-3 bg-[#1B5CFF] rounded-full inline-block" />
                      How This Review Was Made
                    </h4>
                    <div className="space-y-2">
                      {[
                        {
                          label: "Tested For 30 Days",
                          icon: <CalendarDays size={13} className="text-[#E8500A]" />,
                        },
                        {
                          label: `Compared With ${Math.max(displayProducts.length, 3)} Competitors`,
                          icon: <Layers size={13} className="text-[#1B5CFF]" />,
                        },
                        {
                          label: "Real World Usage",
                          icon: <Globe size={13} className="text-emerald-500" />,
                        },
                        {
                          label: "No Sponsored Placement",
                          icon: <ShieldCheck size={13} className="text-purple-500" />,
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg text-[10px] font-semibold text-navy uppercase tracking-wider border border-gray-100"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-[11px] text-gray-500 leading-relaxed font-semibold">
                      Choosify editorial reviews combine hands-on testing, verified retail pricing,
                      and creator field notes before any product earns a ranking.
                    </p>
                  </div>
                </div>

                {/* Reviewer profile */}
                <div
                  id="reviewer-profile"
                  className="bg-white border border-[#e8edf2] rounded-[5px] p-6 shadow-sm flex flex-col items-center text-center scroll-mt-36 mt-8 animate-in fade-in duration-300"
                >
                  <div className="w-20 h-20 rounded-full border-2 border-orange-primary/20 p-0.5 mb-4 shrink-0">
                    <img
                      src={creator.avatar}
                      className="w-full h-full object-cover rounded-full"
                      alt={creator.name}
                    />
                  </div>

                  <h4 className="text-base font-black text-navy italic tracking-tighter uppercase mb-1 leading-none">
                    {creator.name}
                  </h4>
                  <span className="text-[8px] font-black text-orange-primary uppercase tracking-widest italic bg-orange-primary/5 px-2.5 py-1 rounded border border-orange-primary/10 mb-4">
                    {creator.verifiedStatus}
                  </span>

                  <p className="text-[11px] font-bold text-gray-500 italic mb-4 leading-relaxed max-w-md">
                    {creator.bio}
                  </p>

                  <div className="flex gap-4 justify-center mb-5 shrink-0">
                    {creator.socials.facebook && (
                      <a
                        href={creator.socials.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-full bg-gray-50 border border-gray-100 text-gray-500 hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm"
                        aria-label="Facebook"
                      >
                        <Facebook size={20} />
                      </a>
                    )}
                    {creator.socials.twitter && (
                      <a
                        href={creator.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-full bg-gray-50 border border-gray-100 text-gray-500 hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm"
                        aria-label="Twitter"
                      >
                        <Twitter size={20} />
                      </a>
                    )}
                    {creator.socials.youtube && (
                      <a
                        href={creator.socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 min-w-[44px] min-h-[44px] shrink-0 rounded-full bg-gray-50 border border-gray-100 text-gray-500 hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 flex items-center justify-center transition-all duration-300 active:scale-95 shadow-sm"
                        aria-label="YouTube"
                      >
                        <Youtube size={20} />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
                    <FollowButton
                      id={`creator-${creator.name}`}
                      name={creator.name}
                      type="creator"
                      className="flex-1 py-3 rounded-xl border border-[#e8edf2] text-[10px]"
                    />
                    <Link
                      to={`/creators/${creator.id || 'creator-farhan'}`}
                      className="flex-1 py-3 rounded-xl bg-[#E8500A] hover:bg-[#CF4400] text-center text-white text-[10px] font-black uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.03] active:scale-95 border border-transparent cursor-pointer inline-flex items-center justify-center select-none shadow-md italic shadow-orange-primary/10"
                    >
                      Visit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Related Recommendations (End of Page) */}
      <div className="max-w-[1440px] mx-auto px-6 w-full mb-32">
        <section className="pt-20 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10 text-left">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-navy italic tracking-tighter uppercase mb-3">
                You May Also Like
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed">
                More expert recommendations — YouTube, Reels, and blog guides.
              </p>
            </div>
            <Link
              to="/guides"
              className="px-8 py-3.5 bg-navy text-white rounded-full text-[10px] font-black uppercase tracking-widest italic hover:bg-[#E8500A] transition-all shadow-lg shrink-0"
            >
              View All Recommendations
            </Link>
          </div>

          <div className={GUIDE_MEDIA_GRID}>
            {allGuides
              .filter((b) => String(b.id) !== String(guide.id))
              .slice(0, 4)
              .map((g) => (
                <div key={g.id}>{renderGuideMediaCard(g)}</div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}