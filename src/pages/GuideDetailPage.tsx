import React, { useState } from "react";
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
  BookOpen,
  Facebook,
  Twitter,
  ShieldCheck,
  Layers,
  Package,
  Award,
  User,
  Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BLOGS, PRODUCTS } from "../constants";
import { cn } from "../lib/utils";
import { EvaluationData, ComparisonProduct } from "../types/evaluation";
import evaluationsData from "../data/evaluations.json";
import { RecommendationMediaGallery } from "../components/RecommendationMediaGallery";
import { DYNAMIC_GUIDES, DEFAULT_DYNAMIC_GUIDE } from "../data/mockGuides";
import { CATEGORY_SPEC_CONFIGS } from "../data/guideSpecConfigs";
import { ProductCard } from "../components/ProductCard";
import { useDashboard } from "../context/DashboardContext";
import { useGlobalState } from "../context/GlobalStateContext";
import toast from "react-hot-toast";
import { FollowButton } from "../components/FollowButton";

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
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the blog/guide. Fallback to first if not found
  const guide = BLOGS.find((b) => b.id === Number(id)) || BLOGS[0];

  const guideId = Number(id);
  const dynamicData = DYNAMIC_GUIDES[guideId] || {
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
  const { mode, allBrands, addToCart } = useGlobalState();

  const [activeSection, setActiveSection] = useState("all");
  const [activeProductIdx, setActiveProductIdx] = useState(0);

  // ScrollSpy Active Section Detection
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220; // offset matches sticky selector

      const sections = [
        { id: "all-section", name: "all" },
        { id: "winner", name: "winner" },
        { id: "why-won", name: "why-won" },
        { id: "quick-verdict", name: "quick-verdict" },
        { id: "takeaways", name: "takeaways" },
        { id: "top-3", name: "top-3" },
        { id: "all-products", name: "all-products" },
        { id: "reviewer-profile", name: "reviewer-profile" },
      ];

      if (window.scrollY < 200) {
        setActiveSection("all");
        return;
      }

      let currentSection = "all";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = section.name;
          }
        }
      }
      setActiveSection(currentSection);

      // Active product section scrollspy
      let activeProd = 0;
      for (let i = 0; i < displayProducts.length; i++) {
        const el = document.getElementById(`prod-sec-${i}`);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset;
          if (window.scrollY + 250 >= top) {
            activeProd = i;
          }
        }
      }
      setActiveProductIdx(activeProd);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayProducts]);

  const scrollToSection = (id: string) => {
    if (id === "all-section" || id === "all") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("all");
    } else {
      const el = document.getElementById(id);
      if (el) {
        const offset = 180; // Offset for navbar + sticky selectors
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        setActiveSection(id);
      }
    }
  };

  const handleViewProducts = () => {
    if (allGuideProducts.length > 6) {
      navigate(`/guides/${id}/products`);
    } else {
      setVisibleCount(6);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb & Meta Meta (PRD Requirement) */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
            <Link
              to="/"
              className="hover:text-orange-primary transition-colors"
            >
              Home
            </Link>
            <ChevronRight size={12} />
            <Link
              to="/guides"
              className="hover:text-orange-primary transition-colors"
            >
              Recommendations
            </Link>
            <ChevronRight size={12} />
            <span className="text-navy text-left">{guide.title}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-widest italic bg-gray-50 px-4 py-2 rounded-full">
              <CalendarDays size={14} className="text-orange-primary" />
              Published May 12, 2026
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-navy uppercase tracking-widest italic bg-orange-primary/5 px-4 py-2 rounded-full border border-orange-primary/10">
              <BookOpen size={14} className="text-orange-primary" />8 Min Read
            </div>
          </div>
        </div>
      </div>

      {/* Theater Mode Media Area - Centered 1080px with deep black side letterboxing */}
      <div className="w-full bg-[#000000] relative">
        <RecommendationMediaGallery guide={guide} />
      </div>

      {/* Guide Information Panel - Placed completely below the theater media area */}
      <div className="w-full choosify-dark-gradient py-14 px-6 border-b border-white/15 relative overflow-hidden">
        {/* Layer 1 Base & Multi-layered Ambient Light Glows */}
        {/* Top-Right Ambient Orange Glow */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-[#F97316]/30 to-transparent rounded-full blur-[140px] -translate-y-1/3 translate-x-1/4 pointer-events-none mix-blend-plus-lighter opacity-90" />
        
        {/* Mid-Center Warm Atmospheric Lighting Orb */}
        <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.22),transparent_70%)] pointer-events-none mix-blend-color-dodge" />
        
        {/* Bottom-Left Soft Glow */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#F97316]/18 to-transparent rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4 pointer-events-none mix-blend-screen opacity-80" />

        {/* Deep Premium Royal/Navy backplate layer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_10%,_rgba(6,7,20,0.85)_60%,_#02020a_100%)] pointer-events-none" />

        {/* Layer 2: Glass Panel Reflection Design & Specs */}
        {/* Elegant Translucent Angled Specular Sheen (mimics high-end glass physics) */}
        <div className="absolute inset-0 transform -skew-y-12 bg-gradient-to-r from-transparent via-white/[0.035] to-transparent pointer-events-none" />
        
        {/* Solid Glass Highlight Trim Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />
        {/* Subtle Fluid Double-Border Sheen Bottom Light for Glass Depth */}
        <span className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
        
        {/* Premium Warm Glass Edge Border (Top border light) */}
        <span className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F97316]/60 to-transparent pointer-events-none shadow-[0_1px_5px_rgba(249,115,22,0.3)]" />

        <div className="max-w-[1080px] mx-auto text-left relative z-10">
          {/* Guide Title */}
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight mb-4 font-sans drop-shadow-xl">
            {guide.title}
          </h1>

          {/* Guide Description */}
          <p className="text-white/85 text-sm md:text-base font-medium italic uppercase tracking-wider leading-relaxed mb-8 max-w-4xl font-sans text-shadow">
            {guide.excerpt ||
              "An in-depth expert curation guiding your next big decision, backed by extensive testing and research."}
          </p>

          {/* Guide Statistics — Framed in fully frosted glass */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white/[0.035] backdrop-blur-xl rounded-[5px] p-6 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-8">
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic mb-1">
                Published Date
              </span>
              <span className="text-sm font-black text-white uppercase italic tracking-tighter">
                {guide.date}
              </span>
            </div>
            <div className="flex flex-col text-left border-l border-white/10 pl-4 md:pl-6">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic mb-1">
                Read Time
              </span>
              <span className="text-sm font-black text-white uppercase italic tracking-tighter">
                12 Minutes
              </span>
            </div>
            <div className="flex flex-col text-left border-l border-white/10 pl-4 md:pl-6">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic mb-1">
                Audience
              </span>
              <span className="text-sm font-black text-[#F97316] uppercase italic tracking-tighter">
                ENTHUSIASTS
              </span>
            </div>
            <div className="flex flex-col text-left border-l border-white/10 pl-4 md:pl-6">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest italic mb-1">
                Last Updated
              </span>
              <span className="text-sm font-black text-white uppercase italic tracking-tighter">
                June 2026
              </span>
            </div>
          </div>

          {/* Guide Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <button
              onClick={() => {
                toast.success("Guide saved to your dashboard!");
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/15 border border-white/15 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic cursor-pointer shadow-lg backdrop-blur-md"
            >
              <Bookmark size={14} className="text-[#F97316]" />
              Save Guide
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Share link copied to clipboard!");
              }}
              className="flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all italic border-none cursor-pointer shadow-lg hover:scale-102 active:scale-98"
            >
              <Share2 size={14} />
              Share Guide
            </button>
          </div>

          {/* Reviewer Information — Framed in elegant frosted glass */}
          <div className="flex items-center gap-5 bg-white/[0.025] backdrop-blur-xl rounded-[5px] p-6 border border-white/10 max-w-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="w-14 h-14 rounded-full border-2 border-[#F97316] p-0.5 shadow-[0_0_20px_rgba(249,115,22,0.3)] shrink-0">
              <img
                src={`https://i.pravatar.cc/150?u=${guide.author}`}
                className="w-full h-full rounded-full object-cover"
                alt={guide.author}
              />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic block mb-1">
                Recommended By
              </span>
              <h4 className="text-base font-black text-white uppercase italic leading-none">
                {guide.author}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={10}
                      className={
                        star <= 4
                          ? "text-[#E8500A] fill-current"
                          : "text-white/20"
                      }
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black text-[#E8500A] uppercase tracking-widest italic ml-1 underline underline-offset-2">
                  Pro Contributor
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GUIDE SUMMARY BAR */}
      <div className="w-full bg-[#FAF9F5] border-b border-gray-100 py-4 shadow-xs text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 font-mono">
              PRODUCTS REVIEWED
            </span>
            <span className="text-sm font-black text-navy uppercase italic">
              {allGuideProducts.length || 8} ITEMS
            </span>
          </div>
          <div className="flex flex-col text-left border-l border-gray-100 pl-4 md:pl-6">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 font-mono">
              OVERALL WINNER
            </span>
            <span className="text-sm font-black text-[#E8500A] uppercase italic truncate">
              {displayProducts[0]
                ? `${displayProducts[0].brand} ${displayProducts[0].title}`
                : "Samsung Galaxy S26 Ultra"}
            </span>
          </div>
          <div className="flex flex-col text-left border-l border-gray-100 pl-4 md:pl-6">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 font-mono">
              BEST BUDGET
            </span>
            <span className="text-sm font-black text-blue-500 uppercase italic truncate">
              {(() => {
                const cheapest = [...allGuideProducts].sort((a, b) => {
                  const priceA = parseFloat(
                    String(a.price || 0).replace(/,/g, ""),
                  );
                  const priceB = parseFloat(
                    String(b.price || 0).replace(/,/g, ""),
                  );
                  return priceA - priceB;
                })[0];
                return cheapest
                  ? `${cheapest.brand} ${cheapest.title}`
                  : "Samsung Galaxy A56";
              })()}
            </span>
          </div>
          <div className="flex flex-col text-left border-l border-gray-100 pl-4 md:pl-6">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 font-mono">
              LAST UPDATED
            </span>
            <span className="text-sm font-black text-navy uppercase italic">
              June 2026
            </span>
          </div>
        </div>
      </div>

      {/* STICKY GUIDE NAVIGATION */}
      <div className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-3.5">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex items-center justify-start md:justify-center gap-1.5 md:gap-3 overflow-x-auto no-scrollbar py-1 text-[10px] font-black uppercase tracking-wider">
            {[
              {
                id: "all-section",
                name: "all",
                label: "All",
                icon: <Package size={13} />,
              },
              {
                id: "winner",
                name: "winner",
                label: "Winner Product",
                icon: <Award size={13} />,
              },
              {
                id: "why-won",
                name: "why-won",
                label: "Why It Won",
                icon: <ShieldCheck size={13} />,
              },
              {
                id: "quick-verdict",
                name: "quick-verdict",
                label: "Quick Verdict",
                icon: <HelpCircle size={13} />,
              },
              {
                id: "takeaways",
                name: "takeaways",
                label: "Key Takeaways",
                icon: <Layers size={13} />,
              },
              {
                id: "top-3",
                name: "top-3",
                label: "Top Alternatives",
                icon: <Star size={13} />,
              },
              {
                id: "all-products",
                name: "all-products",
                label: "All Mentioned Products",
                icon: <ShoppingBag size={13} />,
              },
              {
                id: "reviewer-profile",
                name: "reviewer-profile",
                label: "Reviewer Profile",
                icon: <User size={13} />,
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 font-black uppercase tracking-wider text-[10px]",
                  activeSection === item.name
                    ? "bg-[#E8500A] text-white shadow-md shadow-[#E8500A]/10 italic border border-transparent"
                    : "bg-white border border-gray-200/85 text-gray-400 hover:text-[#1A1D4E] hover:bg-gray-50/80",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id="all-section" className="scroll-mt-36">
        <div className="max-w-[1440px] mx-auto px-4 py-5 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 items-start w-full relative">
            {/* LEFT SIDEBAR */}
            <aside className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-[160px] pb-10 flex-shrink-0">
              {/* SECTION 1: WHAT IS DISCUSSED */}
              <div className="bg-white rounded-[5px] p-4.5 border border-[#e8edf2] shadow-sm text-left">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e8edf2] px-0.5">
                  <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider flex items-center gap-1.5 leading-none">
                    <span className="w-1.5 h-3 bg-[#E8500A] rounded-full inline-block" />
                    What is discussed?
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {displayProducts.map((p, idx) => {
                    const isActive = activeProductIdx === idx;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          const el = document.getElementById(`prod-sec-${idx}`);
                          if (el) {
                            const offset = 180;
                            const elementPosition =
                              el.getBoundingClientRect().top;
                            const offsetPosition =
                              elementPosition + window.pageYOffset - offset;
                            window.scrollTo({
                              top: offsetPosition,
                              behavior: "smooth",
                            });
                            setActiveProductIdx(idx);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left cursor-pointer",
                          isActive
                            ? "bg-[#E8500A]/5 border-[#E8500A]/30 text-[#E8500A] shadow-sm animate-pulse-slow"
                            : "bg-white border-gray-100 text-navy hover:border-gray-200",
                        )}
                      >
                        <span className="text-xs font-semibold tracking-tight shrink-0">
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

              {/* SECTION 2: HOW THIS REVIEW WAS MADE */}
              <div className="bg-white rounded-[5px] p-4 border border-gray-100 shadow-sm text-left">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  HOW THIS REVIEW WAS MADE
                </h4>
                <div className="space-y-2 text-left">
                  {[
                    {
                      label: "Tested For 30 Days",
                      icon: (
                        <CalendarDays size={13} className="text-[#E8500A]" />
                      ),
                    },
                    {
                      label: "Compared With 8 Competitors",
                      icon: <Layers size={13} className="text-[#1B5CFF]" />,
                    },
                    {
                      label: "Real World Usage",
                      icon: <Globe size={13} className="text-emerald-500" />,
                    },
                    {
                      label: "No Sponsored Placement",
                      icon: (
                        <ShieldCheck size={13} className="text-purple-500" />
                      ),
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-[10px] font-semibold text-navy uppercase tracking-wider"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: WAS THIS HELPFUL? */}
              <div className="bg-white rounded-[5px] border border-gray-100 p-4 shadow-sm text-center">
                <h4 className="text-[10px] font-black text-navy uppercase tracking-widest mb-3 italic">
                  WAS THIS HELPFUL?
                </h4>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3 leading-relaxed">
                  YOUR FEEDBACK HELPS TO MAINTAIN OUR 100% UNBIASED STATUS.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      toggleInteraction("isHelpful");
                      toast.success("Thank you for your feedback!");
                    }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-[10px] font-black uppercase tracking-wider italic transition-all active:scale-95 border cursor-pointer",
                      interactions.isHelpful
                        ? "bg-[#1B5CFF] text-white border-[#1B5CFF]"
                        : "bg-gray-50 text-gray-400 hover:text-[#1B5CFF] border-gray-100 hover:bg-[#1B5CFF]/10",
                    )}
                  >
                    <CheckCircle2 size={11} /> YES
                  </button>
                  <button
                    onClick={() => {
                      toast.success("We'll work to improve our guides!");
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[10px] font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 hover:border-red-100 uppercase tracking-wider bg-gray-50 border border-[#e8edf2] transition-colors cursor-pointer"
                  >
                    <X size={11} /> NO
                  </button>
                </div>
              </div>
            </aside>

            {/* CENTER COLUMN (PRIMARY CONTENT AREA) */}
            <main className="flex-1 min-w-0 flex flex-col gap-12">
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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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

                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 justify-items-center">
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

                {/* SECTION: REVIEWER PROFILE (Mobile/Tablet Viewports) */}
                <div
                  id="reviewer-profile"
                  className="lg:hidden bg-white border border-[#e8edf2] rounded-[5px] p-6 shadow-sm flex flex-col items-center text-center scroll-mt-36 mt-12 animate-in fade-in duration-300"
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

            {/* RIGHT SIDEBAR */}
            <aside className="hidden lg:flex flex-col gap-6 lg:sticky lg:top-[160px] pb-10 flex-shrink-0">
              {/* SECTION 1: REVIEWER PROFILE */}
              <div
                id="reviewer-profile-desktop"
                className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm flex flex-col items-center text-center scroll-mt-36"
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

                <p className="text-[11px] font-bold text-gray-500 italic mb-4 leading-relaxed line-clamp-4 text-left">
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

                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5 w-full mt-2">
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

              {/* SECTION 2: REVIEW CREDIBILITY */}
              <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
                <h5 className="text-[10px] font-black text-navy uppercase tracking-widest mb-3 italic font-space">
                  REVIEW CREDIBILITY
                </h5>
                <div className="space-y-2 border-l border-orange-primary/15 pl-3">
                  <div className="flex flex-col text-[10px] text-left">
                    <span className="text-gray-400 uppercase font-semibold">
                      Last Updated
                    </span>
                    <span className="text-navy font-semibold">June 2026</span>
                  </div>
                  <div className="flex flex-col text-[10px] text-left">
                    <span className="text-gray-400 uppercase font-semibold">
                      Last Verified
                    </span>
                    <span className="text-navy font-semibold">2 Hours Ago</span>
                  </div>
                  <div className="flex flex-col text-[10px] text-left">
                    <span className="text-gray-400 uppercase font-semibold">
                      Review Date
                    </span>
                    <span className="text-navy font-semibold">
                      {guide.date || "May 2026"}
                    </span>
                  </div>
                  <div className="flex flex-col text-[10px] text-left">
                    <span className="text-gray-400 uppercase font-semibold">
                      Research Window
                    </span>
                    <span className="text-navy font-semibold">
                      30 Continuous Days
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: QUICK TIP */}
              <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 font-space">
                  QUICK TIP
                </span>
                <p className="text-[11px] font-medium text-navy leading-relaxed opacity-80 pl-1">
                  {creator.quickTip ||
                    "Always prioritize verified supplier badges when exploring premium electronics to guarantee genuine warranty and support."}
                </p>
              </div>

              {/* SECTION 4: RELATED GUIDES */}
              <div className="bg-white border border-gray-100 rounded-[5px] p-4 shadow-sm text-left">
                <h5 className="text-[10px] font-black text-navy uppercase tracking-widest mb-3 italic font-space">
                  RELATED GUIDES
                </h5>
                <div className="space-y-3">
                  {BLOGS.filter((b) => b.id !== guide.id)
                    .slice(0, 3)
                    .map((g) => (
                      <Link
                        key={g.id}
                        to={`/guides/${g.id}`}
                        className="flex gap-2 items-center group"
                      >
                        <div className="w-9 h-9 rounded bg-gray-50 border border-[#e8edf2] p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={g.image}
                            className="w-full h-full object-cover rounded"
                            alt=""
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col items-start gap-0.5">
                          <span className="text-xs font-semibold uppercase tracking-tight text-navy group-hover:text-orange-primary text-left transition-colors line-clamp-2 leading-tight">
                            {g.title}
                          </span>
                          <span className="text-[8px] text-gray-400 font-medium block">
                            May 2026
                          </span>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* SECTION 5: SPONSORED BLOCK */}
              {(guide.id === 1 ||
                (guide as any).isSponsored ||
                (dynamicData as any).isSponsoredContent) && (
                <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4.5 shadow-sm text-[#1a1a2e] text-center relative overflow-hidden">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest block w-fit mx-auto mb-4 font-mono">
                    SPONSORED
                  </span>
                  <p className="text-xs font-black uppercase italic tracking-tighter mb-2">
                    AARONG HERITAGE SHOPPING BRAND
                  </p>
                  <p className="text-[10px] text-gray-300 font-medium uppercase mb-4 leading-normal">
                    New Collection Available. Free Delivery on all Purchases.
                  </p>
                  <div className="w-full aspect-square rounded-xl overflow-hidden mb-5 border border-white/10 shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400"
                      className="w-full h-full object-cover"
                      alt="Sponsored"
                    />
                  </div>
                  <button className="w-full bg-[#E8500A] hover:bg-[#ff5d14] text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-full transition-all cursor-pointer border-0 font-bold">
                    Shop Now
                  </button>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* Action Call for help */}
      <div className="max-w-[1440px] mx-auto px-6 w-full mb-12">
        <div className="bg-[#1A1A2E] rounded-[10px] p-20 text-center relative overflow-hidden group shadow-3xl">
          <div className="absolute top-0 right-0 w-[400px] h-full bg-blue-600/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-full bg-orange-primary/10 blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[10px] font-black text-orange-primary italic tracking-[0.5em] mb-8 block uppercase">
              NEED PERSONAL HELP?
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none mb-8 uppercase">
              Let our experts find the perfect match for you.
            </h2>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest italic mb-12">
              Message us directly on Facebook or WhatsApp for free consultation.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button className="px-12 py-5 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[10px] font-black uppercase tracking-[0.2em] italic rounded-[10px] shadow-2xl shadow-orange-primary/20 hover:scale-105 transition-all flex items-center gap-3 cursor-pointer border-0 font-bold">
                Contact On WhatsApp <ArrowRight size={16} />
              </button>
              <button className="px-12 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] italic rounded-[10px] hover:bg-white/10 transition-all cursor-pointer">
                Community Forum
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Recommendations (End of Page) */}
      <div className="max-w-[1440px] mx-auto px-6 w-full mb-32">
        <section className="pt-20 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 text-left">
            <div>
              <h3 className="text-5xl font-black text-navy italic tracking-tighter uppercase mb-4">
                You May Also Like
              </h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-relaxed">
                More expert recommendations to help you decide wisely.
              </p>
            </div>
            <Link
              to="/guides"
              className="px-10 py-5 bg-navy text-white rounded-full text-[11px] font-black uppercase tracking-widest italic hover:bg-[#E8500A] transition-all shadow-xl font-bold"
            >
              View All Recommendations
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {BLOGS.filter((b) => b.id !== guide.id)
              .slice(0, 3)
              .map((g, i) => (
                <Link
                  key={i}
                  to={`/guides/${g.id}`}
                  className="group cursor-pointer block bg-[#FDFDFD] rounded-[5px] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 shadow-xl shadow-gray-100/50"
                >
                  <div className="aspect-[16/10] overflow-hidden relative font-bold">
                    <img
                      src={g.image}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="Guide"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                        <BookOpen size={12} className="text-[#E8500A]" />
                        <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">
                          {g.readTime || "5 min read"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 text-left">
                    <h3 className="text-lg font-black text-navy uppercase tracking-tighter mb-4 group-hover:text-orange-primary transition-colors leading-tight italic line-clamp-2">
                      {g.title}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest italic line-clamp-2 mb-8">
                      {g.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                      <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                        <span className="flex items-center gap-1.5">
                          <Heart size={12} className="text-pink-500" />{" "}
                          {g.views || "12k"}
                        </span>
                        <span className="flex items-center gap-1.5 opacity-50 font-bold">
                          • {g.shares || "450"} Shared
                        </span>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-[#E8500A] group-hover:translate-x-2 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
