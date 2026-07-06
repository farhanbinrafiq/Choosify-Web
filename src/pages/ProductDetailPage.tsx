import React, { useState, useMemo, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Star,
  Zap,
  ShoppingBag,
  ArrowRight,
  Bookmark,
  Share2,
  Heart,
  CheckCircle2,
  MessageSquare,
  Info,
  Facebook,
  Instagram,
  Youtube,
  Smartphone,
  Shirt,
  Gift,
  Users,
  Play,
  Search,
  ShieldCheck,
  ChevronDown,
  Package,
  TrendingUp,
  Award,
  Globe,
  Save,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
  Tag,
  Check,
} from "lucide-react";
import { PRODUCTS, BRANDS, PLACEHOLDER_IMAGE } from "../constants";
import { useGlobalState } from "../context/GlobalStateContext";
import { operationsApi } from "../services/operationsApi";
import { useDashboard } from "../context/DashboardContext";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { toast } from "react-hot-toast";
import { ProductMediaGallery } from "../components/ProductMediaGallery";
import { InfluencerReviews } from "../components/InfluencerReviews";
import { PublicReviewCard } from "../components/PublicReviewCard";
import { FollowButton } from "../components/FollowButton";
import { useRegisterPageFilters } from "../components/FilterEngine";
import { getBrandOfficialWebsite, normalizeExternalUrl } from "../utils/overviewRegistry";
import { SizeGuideModal } from "../components/SizeGuideModal";
import { DETAIL_SINGLE_FEED } from "../lib/pageLayout";
import { ProductSpecsOverview } from "../components/ProductSpecsOverview";
import { StickySectionNav } from "../components/StickySectionNav";
import { CardEngagementStrip } from "../components/CardEngagementStrip";
import { useSectionScrollSpy } from "../hooks/useSectionScrollSpy";
import { usePageBreadcrumbs } from "../context/BreadcrumbContext";
import { slugifyPathSegment } from "../lib/seoHelpers";
import { StudioWrap } from "../components/studio/StudioWrap";

function hasActiveSizeGuide(sizeGuide?: CatalogProductSizeGuide | null): boolean {
  if (!sizeGuide?.enabled) return false;
  if (sizeGuide.imageUrl?.trim()) return true;
  if (sizeGuide.description?.trim()) return true;
  if (Array.isArray(sizeGuide.rows) && sizeGuide.rows.length > 0) return true;
  return false;
}

// ── Optional Add-ons ────────────────────────────────────────────
export interface ProductAddon {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  badge?: 'Popular' | 'Recommended' | 'Best Value';
  available: boolean;
}

// Seeded mock add-ons per industry — keyed by product category
// In future backend integration, these will come from the product API response
const ADDON_SEEDS: Record<string, ProductAddon[]> = {
  'Mobile & Gadgets': [
    { id: 'ag1', title: 'Extended Warranty', description: '12-month extended coverage beyond standard warranty', price: 890, badge: 'Popular', available: true },
    { id: 'ag2', title: 'Screen Protector', description: 'Premium tempered glass, 9H hardness, anti-glare', price: 350, badge: 'Recommended', available: true },
    { id: 'ag3', title: 'Installation Service', description: 'Professional setup and data transfer at home', price: 550, available: true },
    { id: 'ag4', title: 'Premium Case', description: 'Genuine leather protective case', price: 690, available: true },
  ],
  'Fashion & Clothing': [
    { id: 'fc1', title: 'Gift Wrap', description: 'Premium branded gift wrapping with ribbon', price: 100, badge: 'Popular', available: true },
    { id: 'fc2', title: 'Greeting Card', description: 'Personalised printed message card', price: 60, available: true },
    { id: 'fc3', title: 'Express Ironing', description: 'Garment pressed and ready to wear', price: 150, badge: 'Recommended', available: true },
    { id: 'fc4', title: 'Monogramming', description: 'Initials embroidered on the item', price: 350, available: false },
  ],
  'Fashion & Footwear': [
    { id: 'ff1', title: 'Cleaning Kit', description: 'Professional-grade shoe care kit', price: 290, badge: 'Best Value', available: true },
    { id: 'ff2', title: 'Hard Carry Case', description: 'Rigid protective box for travel', price: 450, available: true },
    { id: 'ff3', title: 'Gift Wrap', description: 'Luxury box and ribbon', price: 100, badge: 'Popular', available: true },
  ],
  'Home Appliances': [
    { id: 'ha1', title: 'Professional Installation', description: 'Certified technician installs at your location', price: 1200, badge: 'Recommended', available: true },
    { id: 'ha2', title: 'Old Appliance Removal', description: 'We collect and dispose your old unit', price: 600, available: true },
    { id: 'ha3', title: 'Annual Maintenance Contract', description: '1 year AMC with 2 free service visits', price: 2500, badge: 'Best Value', available: true },
    { id: 'ha4', title: 'Extended Warranty', description: '2-year extended coverage', price: 1800, available: true },
  ],
  'Eyewear': [
    { id: 'ew1', title: 'Cleaning Kit', description: 'Microfiber cloth + cleaning spray', price: 180, badge: 'Popular', available: true },
    { id: 'ew2', title: 'Hard Case', description: 'Rigid protective carry case', price: 350, available: true },
    { id: 'ew3', title: 'Anti-Reflective Coating', description: 'AR coating upgrade for lenses', price: 890, badge: 'Recommended', available: true },
    { id: 'ew4', title: 'Blue Light Filter', description: 'Digital screen protection upgrade', price: 750, available: true },
  ],
  'Furniture': [
    { id: 'fur1', title: 'Assembly Service', description: 'Expert team assembles at your home', price: 800, badge: 'Popular', available: true },
    { id: 'fur2', title: 'Premium Delivery', description: 'White-glove delivery + room placement', price: 1200, badge: 'Recommended', available: true },
    { id: 'fur3', title: 'Floor Protection', description: 'Rubber pads and floor protectors included', price: 350, available: true },
    { id: 'fur4', title: '5-Year Warranty Extension', description: 'Extended structural warranty', price: 2200, badge: 'Best Value', available: true },
  ],
  'Beauty & Grooming': [
    { id: 'bg1', title: 'Gift Box', description: 'Premium branded gift packaging', price: 200, badge: 'Popular', available: true },
    { id: 'bg2', title: 'Sample Kit', description: 'Complementary brand sample collection', price: 350, badge: 'Recommended', available: true },
    { id: 'bg3', title: 'Premium Packaging', description: 'Luxury presentation box with bow', price: 290, available: true },
  ],
  'Hotels & Travel': [
    { id: 'ht1', title: 'Airport Pickup', description: 'Private car from airport to hotel', price: 1800, badge: 'Popular', available: true },
    { id: 'ht2', title: 'Daily Breakfast', description: 'Full breakfast buffet per person', price: 950, badge: 'Recommended', available: true },
    { id: 'ht3', title: 'Late Check-out', description: 'Check-out extended to 4:00 PM', price: 1200, available: true },
    { id: 'ht4', title: 'Spa Package', description: 'Full day spa access + 60 min massage', price: 4500, badge: 'Best Value', available: true },
  ],
  'Food & Grocery': [
    { id: 'fg1', title: 'Gift Wrap', description: 'Hamper-style gift wrapping', price: 150, badge: 'Popular', available: true },
    { id: 'fg2', title: 'Greeting Card', description: 'Personalised message card', price: 60, available: true },
    { id: 'fg3', title: 'Cold Chain Delivery', description: 'Temperature-controlled express delivery', price: 250, badge: 'Recommended', available: true },
  ],
};

// Resolve add-ons for a product — returns [] if no match (section stays hidden)
function resolveAddons(product: any): ProductAddon[] {
  if (!product) return [];
  const category = product.category || product.type || '';
  // Direct match
  if (ADDON_SEEDS[category]) return ADDON_SEEDS[category];
  // Partial match
  const matchKey = Object.keys(ADDON_SEEDS).find(k =>
    category.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(category.toLowerCase())
  );
  return matchKey ? ADDON_SEEDS[matchKey] : [];
}

function WithInfluencerReviews({
  brandName,
  productTitle,
  creatorContent,
}: {
  brandName: string;
  productTitle?: string;
  creatorContent?: Array<{
    id: string;
    platform: string;
    videoUrl: string;
    thumbnail: string;
    title: string;
    creatorHandle?: string;
    views?: string;
  }>;
}) {
  const mapPlatform = (platform: string): 'YouTube' | 'Instagram' | 'TikTok' | 'Facebook' => {
    const p = platform.toLowerCase();
    if (p.includes('tiktok')) return 'TikTok';
    if (p.includes('insta')) return 'Instagram';
    if (p.includes('facebook') || p.includes('fb')) return 'Facebook';
    return 'YouTube';
  };

  const displayName = productTitle || brandName;
  const subtitle = productTitle
    ? `TRUSTED EXPERTS REVIEWING ${productTitle.toUpperCase()}`
    : `TRUSTED EXPERTS BREAKING DOWN ${brandName.toUpperCase()}`;

  if (!creatorContent?.length) {
    return (
      <InfluencerReviews
        title="INFLUENCER & CREATOR REVIEWS"
        subtitle={subtitle}
        brandName={brandName}
        fullWidth
      />
    );
  }

  const featured = creatorContent[0];
  const featuredReview = {
    image: featured.thumbnail,
    title: featured.title,
    excerpt: `Watch as creators break down ${displayName} — real opinions, verified reviews, and honest takes from Bangladesh's top voices.`,
    authorName: featured.creatorHandle?.replace('@', '').toUpperCase() || brandName,
    authorSub: mapPlatform(featured.platform),
    authorLogo: brandName,
    badgeText: 'FEATURED',
    platform: mapPlatform(featured.platform),
    videoUrl: featured.videoUrl,
    stats: featured.views
      ? { views: featured.views, likes: '—', duration: '—' }
      : undefined,
  };

  const reviews = creatorContent.slice(1).map((item, index) => {
    const platform = mapPlatform(item.platform);
    return {
      id: item.id || index,
      image: item.thumbnail,
      category: platform.toUpperCase(),
      title: item.title,
      authorName: item.creatorHandle?.replace('@', '') || 'Creator',
      authorHandle: item.creatorHandle || '@creator',
      authorAvatar: item.thumbnail,
      platform,
      aspectRatio:
        platform === 'Instagram' || platform === 'TikTok'
          ? ('portrait' as const)
          : ('landscape' as const),
      videoUrl: item.videoUrl,
      stats: item.views ? { views: item.views } : undefined,
    };
  });

  return (
    <InfluencerReviews
      title="INFLUENCER & CREATOR REVIEWS"
      subtitle={subtitle}
      featuredReview={featuredReview}
      reviews={reviews}
      fullWidth
    />
  );
}

interface OptionalAddonsModuleProps {
  addons: ProductAddon[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  basePrice: number; // the product's current display price (unit price)
  addonTotal: number;
}

export function OptionalAddonsModule({
  addons,
  selectedIds,
  onToggle,
  basePrice,
  addonTotal,
}: OptionalAddonsModuleProps) {
  return (
    <div className="w-full border-t border-white/10 pt-5 pb-2">
      <div className="mb-3 text-left px-4 sm:px-0">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block mb-0.5">
          OPTIONAL ADD-ONS
        </span>
        <span className="text-[11px] font-bold text-white/60">
          Enhance your purchase with optional products and services
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        {addons.map(addon => {
          const isSelected = selectedIds.has(addon.id);
          const isUnavailable = !addon.available;
          return (
            <button
              key={addon.id}
              onClick={() => !isUnavailable && onToggle(addon.id)}
              disabled={isUnavailable}
              className={cn(
                "relative flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer bg-transparent",
                isSelected
                  ? "border-[#E8500A] bg-[#E8500A]/8 shadow-[0_0_0_1px_rgba(232,80,10,0.3)]"
                  : isUnavailable
                  ? "border-white/5 bg-white/2 opacity-40 cursor-not-allowed"
                  : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
              )}
            >
              {/* Selection indicator */}
              <div className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-0.5",
                isSelected
                  ? "border-[#E8500A] bg-[#E8500A]"
                  : "border-white/20 bg-transparent"
              )}>
                {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-[12px] font-bold text-white leading-tight">
                    {addon.title}
                  </span>
                  {addon.badge && (
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                      addon.badge === 'Popular' ? "bg-[#E8500A]/20 text-[#E8500A]" :
                      addon.badge === 'Recommended' ? "bg-emerald-500/15 text-emerald-400" :
                      "bg-amber-500/15 text-amber-400"
                    )}>
                      {addon.badge}
                    </span>
                  )}
                  {isUnavailable && (
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/30">
                      Unavailable
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-white/50 font-medium leading-snug mb-1.5">
                  {addon.description}
                </p>
                <span className="text-[11px] font-black text-[#E8500A] italic">
                  +৳{addon.price.toLocaleString()}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 sm:mt-4 rounded-2xl border border-white/10 bg-[#0A0B1E]/60 px-4 py-3.5 overflow-hidden"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2.5">
              ORDER SUMMARY
            </span>
            
            {/* Base product price row */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-white/70">Product Price</span>
              <span className="text-[11px] font-bold text-white">৳{basePrice.toLocaleString()}</span>
            </div>

            {/* Each selected add-on row */}
            {addons.filter(a => selectedIds.has(a.id)).map(addon => (
              <div key={addon.id} className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-medium text-white/50 truncate mr-2">{addon.title}</span>
                <span className="text-[10px] font-bold text-[#E8500A] flex-shrink-0">+৳{addon.price.toLocaleString()}</span>
              </div>
            ))}

            {/* Divider */}
            <div className="border-t border-white/10 mt-2.5 mb-2.5" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-black uppercase tracking-wider text-white italic">Total</span>
              <span className="text-[13px] sm:text-[14px] font-black text-[#E8500A] italic">
                ৳{(basePrice + addonTotal).toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductDetailPage() {
  const productHeroRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { allProducts, allBrands, productDetailsById, addToCart: globalAddToCart, isLoggedIn, currentUser } = useGlobalState();

  const productList = allProducts.length > 0 ? allProducts : PRODUCTS;
  const brandList = allBrands.length > 0 ? allBrands : BRANDS;
  
  const baseProduct: any =
    productList.find((p: any) => p.id === Number(id)) ||
    productList.find((p: any) => String(p.catalogId) === String(id)) ||
    productList.find((p: any) => p.id === Number(id) + 1000) ||
    productList[0];

  const product = React.useMemo(() => {
    const catalogKey = String(baseProduct?.catalogId || '');
    const detail = productDetailsById[catalogKey];
    if (!detail) return baseProduct;
    return {
      ...baseProduct,
      about: detail.about || baseProduct?.description,
      specs: detail.specs?.length ? detail.specs : baseProduct?.specs,
      pros: detail.pros,
      cons: detail.cons,
      bestForTags: detail.bestForTags,
      storeComparisonList: detail.storeComparisonList,
      physicalStores: detail.physicalStores,
      overviewBlocks: detail.overviewBlocks,
      creatorContent: detail.creatorContent,
      seoTitle: detail.seoTitle,
      seoDescription: detail.seoDescription,
      seoKeywords: detail.seoKeywords,
      sizeGuide: detail.sizeGuide ?? baseProduct?.sizeGuide,
    };
  }, [baseProduct, productDetailsById]);

  usePageBreadcrumbs(
    {
      insertBeforeLast: product?.category
        ? [
            {
              name: product.category,
              path: `/categories?category=${encodeURIComponent(slugifyPathSegment(product.category))}`,
            },
          ]
        : [],
    },
    [product?.category, product?.title, product?.id],
  );

  const showSizeGuideButton = hasActiveSizeGuide(product?.sizeGuide);

  // ── Optional Add-ons State ───────────────────────────────────────
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set());
  const resolvedAddons = useMemo(() => resolveAddons(product), [product?.id]);
  const hasAddons = resolvedAddons.length > 0;

  const jumpToProductSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 200;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  const productSectionNavItems = [
    { id: "product-specs-section", label: "Specs", icon: <Package size={13} /> },
    { id: "influencer-reviews-section", label: "Creator Reviews", icon: <Users size={13} /> },
    { id: "public-reviews-section", label: "Public Reviews", icon: <MessageSquare size={13} /> },
    { id: "product-overview-section", label: "Product Overview", icon: <Info size={13} /> },
    { id: "product-utility-section", label: "Buying Guide", icon: <ShoppingBag size={13} /> },
  ];

  const { activeId: activeSectionId, scrollToSection } = useSectionScrollSpy(
    productSectionNavItems,
    { scrollOffset: 168, allId: "all" },
  );

  useRegisterPageFilters({
    pageName: 'Product',
    renderSearch: null,
    sectionNav: {
      items: productSectionNavItems,
      activeId: activeSectionId,
      onNavigate: scrollToSection,
      allLabel: 'Product',
      profileLabel: 'Product profile',
    },
    quickFilters: [
      { id: 'pd-specs', label: '📊 Specs', active: false, onClick: () => jumpToProductSection('product-specs-section') },
      { id: 'pd-creators', label: '🎥 Creator Reviews', active: false, onClick: () => jumpToProductSection('influencer-reviews-section') },
      { id: 'pd-reviews', label: '⭐ Public Reviews', active: false, onClick: () => jumpToProductSection('public-reviews-section') },
      { id: 'pd-overview', label: 'ℹ️ Product Overview', active: false, onClick: () => jumpToProductSection('product-overview-section') },
      { id: 'pd-stores', label: '📖 Buying Guide', active: false, onClick: () => jumpToProductSection('product-utility-section') },
    ],
    renderFilters: null, // product detail has no sidebar filters
    activeFilterCount: 0,
    onClearAll: null,
  });

  // Computed add-on total
  const addonTotal = useMemo(() => {
    return resolvedAddons
      .filter(a => selectedAddonIds.has(a.id) && a.available)
      .reduce((sum, a) => sum + a.price, 0);
  }, [selectedAddonIds, resolvedAddons]);

  // Selected add-on objects (for cart and message builder)
  const selectedAddons = useMemo(() =>
    resolvedAddons.filter(a => selectedAddonIds.has(a.id)),
    [selectedAddonIds, resolvedAddons]
  );

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds(prev => {
      const next = new Set(prev);
      if (next.has(addonId)) next.delete(addonId);
      else next.add(addonId);
      return next;
    });
  };

  React.useEffect(() => {
    setSelectedAddonIds(new Set());
  }, [product?.id]);

  const addToCart = (prod: any, qty: number, variant?: any) => {
    const addonsToApply = resolveAddons(prod);
    const selected = addonsToApply.filter(addon => selectedAddonIds.has(addon.id) && addon.available);
    if (selected.length > 0) {
      const addOnPrice = selected.reduce((sum, item) => sum + item.price, 0);
      const addOnNames = selected.map(item => item.title).join(", ");
      const customizedProduct = {
        ...prod,
        price: prod.price + addOnPrice,
        title: `${prod.title} (${addOnNames})`
      };
      globalAddToCart(customizedProduct, qty, variant);
    } else {
      globalAddToCart(prod, qty, variant);
    }
  };
  const {
    addRecentlyViewed,
    createNewThread,
    addThreadMessage,
    addToRecentlyViewed,
    reviews,
    setReviews,
    addNotification,
    comparedProducts,
    setComparedProducts,
    customOverviews,
  } = useDashboard();

  React.useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
    }
  }, [product?.id]);

  React.useEffect(() => {
    if (!product?.id) return;
    operationsApi
      .listProductReviews(String(product.id))
      .then((published) => {
        if (!published.length) return;
        setReviews((prev: any[]) => {
          const pending = prev.filter((row) => !published.some((p) => p.id === row.id));
          return [
            ...published.map((row) => ({
              id: row.id,
              productId: product.id,
              productTitle: product.title,
              rating: row.rating,
              text: row.comment,
              authorName: row.userName,
              createdAt: row.createdAt,
              status: 'published',
            })),
            ...pending,
          ];
        });
      })
      .catch(() => {});
  }, [product?.id, setReviews]);

  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview = {
      id: Date.now().toString(),
      productId: product.id,
      productTitle: product.title,
      rating: selectedRating,
      text: reviewText,
      authorName: currentUser.name,
      createdAt: new Date().toISOString()
    };
    setReviews((prev: any[]) => [newReview, ...prev]);
    setSelectedRating(5);
    setReviewText("");
    toast.success('Review submitted! It will appear after approval.');
    operationsApi
      .submitReview({
        userId: String(currentUser?.id || 'guest'),
        userName: currentUser?.name || 'Guest',
        productId: String(product.id),
        productTitle: product.title,
        brandName: brandName,
        storeName: brandName,
        rating: selectedRating,
        comment: reviewText.trim(),
      })
      .catch(() => {});
    if (typeof addNotification === 'function') {
      addNotification('Your review was submitted successfully.', 'system');
    }
  };

  const handleAddToCompare = () => {
    if (comparedProducts.some((p: any) => p.id === product.id)) {
      toast.error('This product is already in your comparison list.');
      return;
    }
    if (comparedProducts.length >= 4) {
      toast.error('Comparison limit reached (4 products)');
      return;
    }
    setComparedProducts((prev: any[]) => [product, ...prev]);
    toast.success('Added to comparison!');
  };
  const brandObj = brandList.find((b: any) => b.id === product.brandId) ||
    brandList.find((b: any) => b.name?.toLowerCase() === product.brand?.toLowerCase());
  const brandId = brandObj ? brandObj.id : 1;
  const brandName = brandObj ? brandObj.name : "Apex";
  const brandOfficialWebsite = useMemo(() => {
    const fromProduct = (product as any)?.officialWebsite || (product as any)?.buyUrl || (product as any)?.storeUrl;
    const fromBrand = (brandObj as any)?.website || (brandObj as any)?.officialWebsite;
    if (fromProduct) return normalizeExternalUrl(String(fromProduct));
    if (fromBrand) return normalizeExternalUrl(String(fromBrand));
    return getBrandOfficialWebsite(brandName);
  }, [product, brandObj, brandName]);

  const [activeTab, setActiveTab] = useState("Overview");
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(1);

  // States for Stats Bar and ScrollSpy
  const [purchasedCount] = useState(854);
  const [viewCount] = useState(() => 8420 + (product?.id ?? 0) * 37);

  // Variant support state hooks
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedRam, setSelectedRam] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);

  React.useEffect(() => {
    setIsSizeChartOpen(false);
  }, [product?.id]);

  // Message to Order Flow States
  const [showOrderConfig, setShowOrderConfig] = useState(false);
  const [orderQty, setOrderQty] = useState(1);
  const [orderColor, setOrderColor] = useState("");
  const [orderSize, setOrderSize] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);

  // Sync state options when product changes
  React.useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      // Auto select first entry that is in stock, or just first entry
      const firstAvailable =
        product.variants.find((v: any) => v.stock > 0) || product.variants[0];
      if (firstAvailable) {
        if (firstAvailable.attributes.color !== undefined)
          setSelectedColor(firstAvailable.attributes.color);
        if (firstAvailable.attributes.size !== undefined)
          setSelectedSize(firstAvailable.attributes.size);
        if (firstAvailable.attributes.ram !== undefined)
          setSelectedRam(firstAvailable.attributes.ram);
        if (firstAvailable.attributes.storage !== undefined)
          setSelectedStorage(firstAvailable.attributes.storage);
      }
    } else {
      setSelectedColor("");
      setSelectedSize("");
      setSelectedRam("");
      setSelectedStorage("");
    }
  }, [product]);

  const getSelectedVariant = () => {
    if (!product || !product.variants || product.variants.length === 0)
      return null;
    return product.variants.find((v: any) => {
      const hasColor = v.attributes.color !== undefined;
      const hasSize = v.attributes.size !== undefined;
      const hasRam = v.attributes.ram !== undefined;
      const hasStorage = v.attributes.storage !== undefined;

      if (hasColor && v.attributes.color !== selectedColor) return false;
      if (hasSize && v.attributes.size !== selectedSize) return false;
      if (hasRam && v.attributes.ram !== selectedRam) return false;
      if (hasStorage && v.attributes.storage !== selectedStorage) return false;
      return true;
    });
  };

  const getBoxContents = () => {
    if (!product) return [];
    
    const title = (product.title || "").toLowerCase();
    const category = (product.category || "").toLowerCase();

    // Smartphone matching
    if (
      category.includes("phone") || 
      category.includes("mobile") || 
      title.includes("galaxy") || 
      title.includes("iphone") || 
      title.includes("redmi") || 
      title.includes("pixel") || 
      title.includes("poco") || 
      title.includes("realme") || 
      title.includes("smartphone")
    ) {
      return ["Device", "Charger", "USB Cable", "SIM Ejector Tool", "User Guide"];
    }

    // Laptop matching
    if (
      category.includes("laptop") || 
      category.includes("computer") || 
      title.includes("macbook") || 
      title.includes("zenbook") || 
      title.includes("laptop")
    ) {
      return ["Laptop", "Power Adapter", "Charging Cable", "Documentation"];
    }

    // Eyewear matching
    if (
      category.includes("eyewear") || 
      category.includes("glasses") || 
      title.includes("sunglasses") || 
      title.includes("eyewear")
    ) {
      return ["Eyewear", "Protective Case", "Cleaning Cloth", "Warranty Card"];
    }

    // Clothing / Apparel matching
    if (
      category.includes("fashion") || 
      category.includes("lifestyle") || 
      category.includes("clothing") || 
      category.includes("apparel") || 
      title.includes("saree") || 
      title.includes("panjabi") || 
      title.includes("polo") || 
      title.includes("shirt") || 
      title.includes("apparel") || 
      title.includes("runner") || 
      title.includes("shoe")
    ) {
      if (title.includes("saree")) {
        return ["Saree", "Shopping Bag", "Care Instructions"];
      }
      return ["Product Unit", "Shopping Bag", "Care Instructions"];
    }

    // Beauty Products matching
    if (
      category.includes("beauty") || 
      category.includes("skin") || 
      category.includes("makeup") || 
      category.includes("cosmetics") || 
      title.includes("perfume") || 
      title.includes("serum") || 
      title.includes("fragrance")
    ) {
      return ["Product Unit", "Protective Packaging", "User Instructions"];
    }

    return [];
  };

  const boxContents = getBoxContents();

  const selectedVariant = getSelectedVariant();

  // Reset active image index to 0 when variant changes
  React.useEffect(() => {
    if (selectedVariant?.image) {
      setCarouselIndex(0);
    }
  }, [selectedVariant?.image]);

  // Unique attribute variants computation
  const uniqueColors = product.variants
    ? (Array.from(
        new Set(
          product.variants.map((v: any) => v.attributes.color).filter(Boolean),
        ),
      ) as string[])
    : [];

  const uniqueSizes = product.variants
    ? (Array.from(
        new Set(
          product.variants.map((v: any) => v.attributes.size).filter(Boolean),
        ),
      ) as string[])
    : [];

  const uniqueRams = product.variants
    ? (Array.from(
        new Set(
          product.variants.map((v: any) => v.attributes.ram).filter(Boolean),
        ),
      ) as string[])
    : [];

  const uniqueStorages = product.variants
    ? (Array.from(
        new Set(
          product.variants
            .map((v: any) => v.attributes.storage)
            .filter(Boolean),
        ),
      ) as string[])
    : [];

  // Availability lookup helpers for disabled states
  const isSizeOptionAvailable = (size: string) => {
    if (!product.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes.size === size &&
        (!selectedColor || v.attributes.color === selectedColor) &&
        v.stock > 0,
    );
  };

  const isColorOptionAvailable = (color: string) => {
    if (!product.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes.color === color &&
        (!selectedSize || v.attributes.size === selectedSize) &&
        v.stock > 0,
    );
  };

  const isRamOptionAvailable = (ram: string) => {
    if (!product.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes.ram === ram &&
        (!selectedStorage || v.attributes.storage === selectedStorage) &&
        v.stock > 0,
    );
  };

  const isStorageOptionAvailable = (storage: string) => {
    if (!product.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes.storage === storage &&
        (!selectedRam || v.attributes.ram === selectedRam) &&
        v.stock > 0,
    );
  };

  const getColorHexClass = (colorName: string) => {
    const norm = colorName.toLowerCase();
    if (norm.includes("gray") || norm.includes("grey")) return "bg-gray-400";
    if (norm.includes("yellow") || norm.includes("gold"))
      return "bg-yellow-400";
    if (norm.includes("violet") || norm.includes("purple"))
      return "bg-purple-500";
    if (norm.includes("black")) return "bg-gray-900";
    if (norm.includes("white")) return "bg-white border border-gray-300";
    if (norm.includes("silver") || norm.includes("platinum"))
      return "bg-slate-300";
    if (norm.includes("blue")) return "bg-blue-600";
    if (norm.includes("red") || norm.includes("crimson")) return "bg-red-500";
    if (norm.includes("lime") || norm.includes("green")) return "bg-lime-400";
    return "bg-amber-600";
  };

  const tabs = [
    "Overview",
    "Specifications",
    "About Choosify.bd",
    "Influencer Reviews",
    "Comparison",
  ];

  const productSpecs = [
    { label: "Material", value: "Premium Linen Wear" },
    { label: "Category", value: product.category || "Lifestyle" },
    { label: "Fit", value: "Standard / Regular" },
    { label: "Occasion", value: "Festive Exclusive" },
    { label: "Warranty", value: "1 Year Brand Care" },
    { label: "Gender", value: "Unisex / Mens" },
  ];

  // Stock calculations
  const isOutOfStock =
    product.variants && product.variants.length > 0
      ? selectedVariant
        ? selectedVariant.stock === 0
        : true
      : product.id === 3 ||
        product.title.includes("MacBook") ||
        product.stock === 0;

  const stockQuantity =
    product.variants && product.variants.length > 0
      ? selectedVariant
        ? selectedVariant.stock
        : 0
      : isOutOfStock
        ? 0
        : 58;

  const handleLoveBrand = () => {
    toast.success(`You added ${product.brand} to your Favorite Brands!`);
  };

  const handleMessageOrder = () => {
    setOrderQty(1);
    setOrderColor(selectedColor || (product?.colors && product.colors[0]) || "Sunset Orange");
    setOrderSize(selectedSize || selectedRam || selectedStorage || (product?.sizes && product.sizes[0]) || "Standard");
    setOrderNotes("");
    setShowOrderConfig(true);
  };

  const handleConfirmAndSend = () => {
    const threadId = `thread-brand-${brandId}`;
    const orderRef = `CHOOSIFY-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const structuredMsg = `🛒 SPECIAL INBOUND ORDER:
📦 Item: ${product.title}
🏢 Brand: ${brandName} (ID: ${brandId})
🎨 Options:
  • Color: ${orderColor}
  • Variant: ${orderSize}
🔢 Quantity: ${orderQty}
📝 Custom Memo: ${orderNotes || "No notes."}
${selectedAddons.length > 0
  ? `🛍️ Optional Add-ons Selected:\n${selectedAddons.map(a => `  • ${a.title} (+৳${a.price.toLocaleString()})`).join('\n')}\n💰 Add-ons Subtotal: BDT ${addonTotal.toLocaleString()}\n💵 Total Value (incl. add-ons): BDT ${(orderQty * product.price + addonTotal).toLocaleString()}`
  : `💵 Total Value: BDT ${(orderQty * product.price).toLocaleString()}`
}
Ref Link: /products/${product.id}

Hello, I'd like to purchase this product config! Please approve shipping.`;

    const sellerResponse = `💬 SELLER ACCEPTANCE AUTO-CONFIRMATION:
🟢 Your order request has been APPROVED by the automatic gateway!
📋 Tracking reference: #${orderRef}
🚚 Dispatch logistics team will contact you shortly to coordinate receipt.`;

    const pCard = {
      image: product.image || PLACEHOLDER_IMAGE,
      name: product.title,
      variant: orderSize,
      color: orderColor,
      quantity: orderQty,
      notes: orderNotes || "No custom parameter notes.",
      price: product.price,
      link: `/products/${product.id}`
    };

    // 1. Create message thread
    createNewThread(
      threadId,
      brandName,
      brandObj?.logo || "https://i.pravatar.cc/150?u=brand",
      'retail',
      structuredMsg,
      orderRef
    );

    // 2. Add structural msg
    addThreadMessage(threadId, structuredMsg, "user", "Me", pCard);

    // 3. Add Seller response message
    setTimeout(() => {
      addThreadMessage(threadId, sellerResponse, "seller", brandName);
    }, 450);

    // Show toast and close
    toast.success("Order request dispatched! Syncing to messaging workspace.");
    setShowOrderConfirm(false);
    
    // Redirect to Messages thread
    navigate(`/messages/${threadId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {/* Continuous Hero Wrapper with Unified Choosify Gradient */}
      <div
        ref={productHeroRef}
        className="choosify-dark-gradient w-full relative"
      >
        {/* Layer 1 Base & ambient accents matching home hero */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(232,80,10,0.18)_0%,_transparent_55%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#EEF1F8]/10 to-transparent pointer-events-none" />

        {/* Theater Mode Media Area - Centered 1080px with deep black side letterboxing */}
        <div className="w-full bg-transparent relative">
          <ProductMediaGallery
            product={product}
            selectedVariantImage={selectedVariant?.image}
          />
        </div>

        {/* Product Information Panel - Placed completely below the theater media area */}
        <section className="py-12 px-6 relative z-10 font-sans">

        <div className="max-w-[1080px] mx-auto text-center text-white relative z-10">
          <div className="w-full max-w-4xl mx-auto text-center text-white relative bg-transparent p-0 border-none shadow-none">
            <div className="relative">
              {/* Row 1: Brand / Category and Reviews/Stock status */}
              <div className="flex flex-col items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-[0.25em] block">
                    {product.brand?.toUpperCase()} .{" "}
                    {product.category?.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center gap-1.5 shrink-0 text-center">
                  <div className="flex items-center gap-2 text-white/80">
                    <div className="flex text-[#FF6B00] gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={11}
                          className={cn(
                            "fill-current",
                            i <= Math.floor(product.rating || 4)
                              ? "text-[#FF6B00]"
                              : "text-white/20",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-white/70 leading-none">
                      {product.rating} &nbsp;({product.reviews || 840} reviews)
                    </span>
                  </div>
                  <div>
                    {isOutOfStock ? (
                      <span className="inline-flex items-center h-6 px-3 bg-red-500/10 rounded-full border border-red-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[8.5px] font-black text-red-400 uppercase tracking-widest italic ml-1.5">
                          Out of Stock
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center h-6 px-3 bg-[#1100FF]/80 text-white rounded-full text-[8.5px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(17,0,255,0.4)] border border-white/10">
                        IN STOCK: {stockQuantity} UNITS LEFT
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Title */}
              <h1
                className="text-[30px] font-black text-white tracking-tighter leading-[0.95] uppercase mb-4 text-center"
                style={{ fontSize: "30px" }}
              >
                {product.title}
              </h1>

              {/* Row 3: Price Display & Quick controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-0 pb-4">
                <div
                  className="text-[25px] font-extrabold text-[#E8500A] italic uppercase tracking-tight leading-none"
                  style={{ fontSize: "25px" }}
                >
                  BDT - {product.price}
                </div>
              </div>
            </div>
          </div>

          {/* Single edge-to-edge divider below price (full content width) */}
          <div className="w-full border-t border-white/10" aria-hidden="true" />

          <div className="w-full max-w-4xl mx-auto text-center text-white relative bg-transparent p-0 border-none shadow-none">
            {/* Dynamic Variants & Beautiful Interactive Callouts */}
            <div className="w-full pt-4 flex flex-col items-center justify-center text-center space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.25em] block">
                  SELECT OPTIONS
                </span>
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  COLOR: {selectedColor || "SUNSET ORANGE"}
                </span>
              </div>

              {/* Colors dots */}
              <div className="flex justify-center gap-4">
                {uniqueColors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 cursor-pointer bg-transparent",
                        isSelected
                          ? "border-[#E8500A]"
                          : "border-transparent hover:border-white/20",
                      )}
                    >
                      <span
                        className={cn(
                          "w-6 h-6 rounded-full block shadow-md",
                          getColorHexClass(color),
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Size options capsules */}
              <div className="flex flex-col items-center gap-3 w-full max-w-md">
                <div className="flex flex-wrap justify-center gap-3">
                  {(uniqueSizes.length > 0
                    ? uniqueSizes
                    : ["8GB/128GB", "12GB/256GB", "12GB/512GB", "16GB/1TB"]
                  ).map((size) => {
                    const isSelected =
                      selectedSize === size ||
                      selectedRam === size ||
                      selectedStorage === size ||
                      (size === "12GB/256GB" && !selectedSize);
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          if (uniqueSizes.length > 0) setSelectedSize(size);
                          else if (uniqueRams.includes(size))
                            setSelectedRam(size);
                        }}
                        className={cn(
                          "h-9 px-5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center justify-center font-mono cursor-pointer bg-transparent",
                          isSelected
                            ? "border-[#E8500A] text-white"
                            : "border-white/25 text-white/80 hover:bg-white/5 hover:border-white/40 hover:text-white",
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                  {showSizeGuideButton && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSizeChartOpen(true);
                      }}
                      className="text-[10px] font-bold text-[#E8500A] uppercase hover:underline italic flex items-center gap-1 ml-2 self-center tracking-widest pl-1 cursor-pointer bg-transparent border-none"
                    >
                      SIZE GUIDE
                    </button>
                  )}
                </div>
              </div>

              {/* ── Optional Add-ons Module ──────────────────────────────── */}
              {hasAddons && (
                <OptionalAddonsModule
                  addons={resolvedAddons}
                  selectedIds={selectedAddonIds}
                  onToggle={toggleAddon}
                  basePrice={product.price}
                  addonTotal={addonTotal}
                />
              )}
              {/* ──────────────────────────────────────────────────────────── */}

              {/* Commercial Primary Buttons aligned horizontally */}
              <div className="flex flex-row flex-wrap items-center justify-center gap-3 w-full pt-4 px-4 sm:px-0 box-border">
                <button
                  onClick={() => {
                    addToCart(product, 1);
                    if (selectedAddons.length > 0) {
                      sessionStorage.setItem(
                        `choosify_addons_${product.id}`,
                        JSON.stringify(selectedAddons)
                      );
                      toast.success(
                        `Added ${product.title} + ${selectedAddons.length} add-on${selectedAddons.length > 1 ? 's' : ''} to your cart!`,
                        { duration: 3500 }
                      );
                    } else {
                      toast.success(`Added ${product.title} to your cart!`);
                    }
                  }}
                  className="px-6 py-3 rounded-full bg-[#E8500A] text-white text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 italic border border-[#E8500A]/30 hover:bg-[#ff5d14] cursor-pointer shadow-md shadow-orange-500/10"
                >
                  ADD TO CART
                </button>
                <a
                  href={brandOfficialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white text-[#1A1D4E] hover:bg-gray-50 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 italic border border-[#e8edf2] cursor-pointer shadow-sm inline-flex items-center justify-center"
                >
                  Buy from Official Site
                </a>
                <button
                  onClick={handleAddToCompare}
                  className="px-6 py-3 rounded-full bg-[#1A1D4E] text-white hover:bg-[#252a6e] text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 italic border border-white/15 cursor-pointer shadow-md shadow-[#1A1D4E]/30"
                >
                  ADD TO COMPARE
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Post-Hero Stats Bar */}
      <div className="w-full hero-gradient text-white py-4.5 border-y border-white/5 font-space font-black italic uppercase tracking-[0.2em] text-[11px] md:text-xs z-20 relative">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-wrap justify-center sm:justify-around items-center gap-y-3 gap-x-6 md:gap-x-10">
          <CardEngagementStrip
            variant="hero"
            entityType="product"
            entityId={product.id}
            payload={product}
            showShare
            shareUrl={typeof window !== 'undefined' ? window.location.href : undefined}
          />

          <div className="hidden sm:block h-4 w-px bg-white/20 shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            <span className="text-[#4DBC15] text-lg font-space font-black">✓</span>
            <span>{purchasedCount.toLocaleString()} Verified Orders</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-white/20 shrink-0" aria-hidden="true" />

          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            <span className="text-[#E8500A] text-lg font-space font-black">👁</span>
            <span>{viewCount.toLocaleString()} Product Views</span>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] tracking-widest ml-1">
              <TrendingUp size={10} className="text-[#E8500A]" />
              Trending
            </span>
          </div>
        </div>
      </div>

      <StickySectionNav
        sections={productSectionNavItems}
        activeId={activeSectionId}
        onNavigate={scrollToSection}
        allLabel="Product"
        profileLabel="Product profile"
      />

      {/* Main Content Area */}
      <main id="all-section" className="bg-choosify-feed py-5">
        <div className="max-w-[1440px] mx-auto px-4 w-full">
          <div className={`${DETAIL_SINGLE_FEED}`}>
            <StudioWrap sectionId="product-specs">
            <ProductSpecsOverview
              productTitle={product.title}
              specs={[
                { label: 'Brand', value: brandObj?.name || product.brand || 'Sailor' },
                { label: 'Category', value: product.category || 'Lifestyle' },
                { label: 'Material', value: 'Premium Grade Build' },
                { label: 'Origin', value: 'Local Production / Auth' },
                { label: 'Warranty', value: '1 Year Care Warranty' },
                { label: 'Model', value: product.title?.substring(0, 16) || 'Classic' },
                { label: 'Rating', value: `${product.rating || '4.8'} / 5` },
                { label: 'Status', value: isOutOfStock ? 'Out of Stock' : 'In Stock' },
              ]}
            />
            </StudioWrap>

            <StudioWrap sectionId="product-creator-reviews" className="scroll-mt-36 w-full">
              <WithInfluencerReviews
                brandName={brandName}
                productTitle={product?.title}
                creatorContent={product?.creatorContent}
              />
            </StudioWrap>

            {/* PUBLIC REVIEWS (ID: 'public-reviews-section') */}
            <StudioWrap
              sectionId="product-public-reviews"
              className="scroll-mt-36 bg-white rounded-[5px] p-8 border border-gray-100/85 shadow-2xl shadow-gray-100/40 space-y-8 font-sans text-left w-full"
            >
              <div className="text-center flex flex-col items-center">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase text-navy">
                  PUBLIC <span className="text-orange-primary">REVIEWS</span>
                </h3>
                <p className="text-[9.5px] font-black text-navy/40 uppercase tracking-[0.3em] italic mt-1 bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5">
                  VERIFIED Customer Experiences
                </p>
              </div>

              {/* Write a Customer Review Card */}
              <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
                <h4 className="text-sm font-black text-navy uppercase tracking-wider mb-4 italic">
                  Write a Customer Review
                </h4>
                {!isLoggedIn ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-3 bg-white border border-gray-150 rounded-xl p-6">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-xs font-black text-[#555] uppercase tracking-wider">
                      Sign in to write a review
                    </span>
                    <p className="text-[10px] text-gray-500 max-w-xs leading-relaxed uppercase font-black tracking-wide">
                      Please log in to your Choosify account to provide feedback on this product.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/login', { state: { from: location.pathname } })}
                      className="h-10 px-6 bg-[#E8500A] text-white text-[10px] font-black uppercase tracking-widest italic rounded-full hover:scale-102 active:scale-95 transition-all shadow-md cursor-pointer border-none"
                    >
                      Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex flex-row items-center gap-2 text-left">
                      <span className="text-[10px] font-black text-navy uppercase tracking-wider mr-2">Your Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setSelectedRating(star)}
                          className="hover:scale-110 active:scale-90 transition-all cursor-pointer bg-transparent border-none p-0"
                        >
                          <Star
                            size={18}
                            className={cn(
                              "transition-colors",
                              star <= selectedRating
                                ? "text-[#E8500A] fill-[#E8500A]"
                                : "text-gray-300"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1.5 text-left">
                      <label className="block text-[8px] font-black uppercase tracking-widest text-[#1A1A2E]/60 ml-2">Review Details</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Write your review here..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-navy outline-none focus:border-[#E8500A] focus:ring-1 focus:ring-[#E8500A] transition-all"
                      />
                    </div>
                    <div className="text-right">
                      <button
                        type="submit"
                        className="h-11 px-6 bg-[#E8500A] text-white text-[10px] font-black uppercase tracking-widest italic rounded-full shadow-lg shadow-orange-primary/10 hover:scale-[1.01] hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none"
                      >
                        Submit Customer Review
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  ...reviews
                    .filter((r: any) => r.productId === product.id)
                    .map((r: any) => ({
                      name: r.authorName,
                      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.authorName)}`,
                      time: "POSTED JUST NOW",
                      rating: String(r.rating),
                      content: r.text,
                      date: "RECENTLY",
                      helpful: 0,
                      images: []
                    })),
                  {
                    name: "Tanvir Hasan",
                    avatar: "https://i.pravatar.cc/150?u=tanvir",
                    time: "POSTED 2 WEEKS AGO",
                    rating: "5",
                    content:
                      "The material quality of the new Apex collection is absolutely top-notch. I was skeptical about the price but after wearing it once, I can say it's worth every taka. The fit is perfect for large build individuals as well.",
                    date: "APRIL 2024",
                    helpful: 124,
                    images: [
                      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop",
                      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&h=150&fit=crop",
                    ],
                  },
                  {
                    name: "Nusrat Jahan",
                    avatar: "https://i.pravatar.cc/150?u=nusrat",
                    time: "POSTED 1 MONTH AGO",
                    rating: "4.8",
                    content:
                      "Beautiful designs! I bought three different items and all of them were delivered on time. The online sizing chart was very accurate which was a relief. Highly recommend the fusion wear collection.",
                    date: "MARCH 2024",
                    helpful: 89,
                    images: [
                      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=150&fit=crop",
                    ],
                  },
                ].map((review, i) => (
                  <PublicReviewCard
                    key={i}
                    review={review}
                    onHelpfulClick={() =>
                      toast.success(
                        "Thanks for voting this review as helpful!",
                      )
                    }
                  />
                ))}
              </div>

              {/* Load more */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() =>
                    toast.success("All customer reviews are fully loaded.")
                  }
                  className="w-full py-4 bg-[#f5f7fb] text-[#8a92a6] font-bold text-[9.5px] uppercase tracking-[0.2em] rounded-[18px] hover:bg-[#0c133c] hover:text-white hover:shadow-lg transition-all border border-transparent italic flex items-center justify-center cursor-pointer"
                >
                  LOAD MORE REVIEWS
                </button>
              </div>
            </StudioWrap>

            {/* PRODUCT OVERVIEW (ID: 'product-overview-section') */}
            <StudioWrap
              sectionId="product-overview"
              className="scroll-mt-36 bg-white rounded-[5px] p-8 border border-gray-100/80 shadow-xl space-y-8 text-left font-sans w-full"
            >
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter uppercase text-navy">
                  PRODUCT <span className="text-orange-primary">OVERVIEW</span>
                </h3>
                <p className="text-[9px] font-black text-navy/40 uppercase tracking-[0.3em] italic mt-1">
                  BENEFITS, QUALITY STRUCTURE & TRUST
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quality & Materials */}
                <div className="bg-gray-50 rounded-[5px] p-5 border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-xs font-black text-navy uppercase tracking-wide">
                    <div className="p-1.5 bg-orange-primary/10 rounded-lg text-orange-primary">
                      <Tag size={16} />
                    </div>
                    Quality & Materials
                  </div>
                  <div className="space-y-2 text-[10px] font-black text-gray-500 uppercase tracking-wider leading-relaxed">
                    <div>• AUTHENTIC STANDARD SEWING WITH BRAND LABELS</div>
                    <div>• HIGH DUST & SPILL PROOF COATED EXTERIOR</div>
                    <div>• UNBREAKABLE GRADE FINISHING STRUCTURE</div>
                    <div>• BREATHABLE PREMIUM CLOTHS IDEAL FOR LONG WEAR</div>
                  </div>
                </div>

                {/* Features & Benefits */}
                <div className="bg-gray-50 rounded-[5px] p-5 border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-xs font-black text-navy uppercase tracking-wide">
                    <div className="p-1.5 bg-orange-primary/10 rounded-lg text-orange-primary">
                      <Award size={16} />
                    </div>
                    Features & Benefits
                  </div>
                  <div className="space-y-2 text-[10px] font-black text-gray-500 uppercase tracking-wider leading-relaxed">
                    <div>• 7 DAYS SATISFACTION REFUND/EXCHANGE GUARANTEE</div>
                    <div>• SECURE PARTNER CHECKOUT INTEGRATIONS</div>
                    <div>
                      • OFFICIAL DECK WARRANTY ACTIVE WITH UNIQUE SERIAL CODE
                    </div>
                    <div>• NATIONWIDE COMPLIANCE DELIVERY COVERAGE</div>
                  </div>
                </div>

                {/* Audience & Use Cases */}
                <div className="bg-gray-50 rounded-[5px] p-5 border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-xs font-black text-navy uppercase tracking-wide">
                    <div className="p-1.5 bg-orange-primary/10 rounded-lg text-orange-primary">
                      <Users size={16} />
                    </div>
                    Audience & Use Cases
                  </div>
                  <div className="space-y-2 text-[10px] font-black text-gray-500 uppercase tracking-wider leading-relaxed">
                    <div>
                      • VALUE ORIENTED BUYERS APPRAISING BUILD INTEGRITY
                    </div>
                    <div>• LIFESTYLE CREATORS REQUIRING RELIABLE WEARS</div>
                    <div>
                      • EVERYDAY SHOPPERS SEEKING RELIABLE VALUE
                    </div>
                    <div>• MODERN BANGLADESHI LIFESTYLE AND ACTIVE CIRCLES</div>
                  </div>
                </div>

                {/* Customer Support & Assurance */}
                <div className="bg-gray-50 rounded-[5px] p-5 border border-gray-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5 text-xs font-black text-navy uppercase tracking-wide">
                    <div className="p-1.5 bg-orange-primary/10 rounded-lg text-orange-primary">
                      <ShieldCheck size={16} />
                    </div>
                    Customer Support & Assurance
                  </div>
                  <div className="space-y-2 text-[10px] font-black text-gray-500 uppercase tracking-wider leading-relaxed">
                    <div>• REAL-TIME MSG BACKING FROM HIGH PRIORITY STAFF</div>
                    <div>• COMPLETE VERIFICATION CERTIFICATES DEPOSITED</div>
                    <div>• EASY ACCESS TRANSIT SYSTEM INTEGRATIONS</div>
                    <div>• SECURED PERSONALIZED INBOUND SUPPORT LOG</div>
                  </div>
                </div>

                {/* Dynamic custom overview sections */}
                {customOverviews && customOverviews
                  .filter(co => co.targetType === 'product' && String(co.targetId) === String(product.id))
                  .map((co, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-[5px] p-5 border border-gray-100 flex flex-col gap-3">
                      <div className="flex items-center gap-2.5 text-xs font-black text-navy uppercase tracking-wide">
                        <div className="p-1.5 bg-orange-primary/10 rounded-lg text-orange-primary">
                          <Award size={16} />
                        </div>
                        {co.sectionName}
                      </div>
                      <div className="space-y-2 text-[10px] font-black text-gray-500 uppercase tracking-wider leading-relaxed">
                        {co.content.map((bullet, bIdx) => (
                          <div key={bIdx}>• {bullet}</div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Best For Tags */}
              <div className="pt-4 border-t border-gray-50 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-navy uppercase tracking-wide">
                  <span className="text-orange-primary font-black text-base">
                    #
                  </span>
                  Best For tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "#premium lifestyle",
                    "#quality driven",
                    "#modern apparel",
                    "#exclusive designs",
                    "#sustainable wear",
                    "#best in segment BBDT",
                    "#elite deshi collect",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-black text-orange-primary bg-orange-primary/5 px-3 py-1 rounded-full transition-colors hover:bg-orange-primary/10 cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </StudioWrap>

            {/* Utility cards row */}
            <StudioWrap sectionId="product-buying-guide" className="scroll-mt-36 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
              {/* Box Content */}
              <div className="bg-white rounded-[5px] border border-gray-100 shadow-sm overflow-hidden p-5 space-y-3 font-sans text-left h-full">
                <h3 className="text-[10px] font-black text-navy uppercase tracking-tight pb-2 border-b border-gray-50 flex items-center gap-2">
                  <span className="w-1 h-3 bg-[#E8500A] rounded-full inline-block" />
                  Box Content
                </h3>
                {boxContents && boxContents.length > 0 ? (
                  <div className="space-y-2 text-[10px] font-bold">
                    {boxContents.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 py-1.5">
                        <span className="text-emerald-500 font-black text-xs shrink-0">✓</span>
                        <span className="text-navy font-black uppercase tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                    No box content information provided.
                  </p>
                )}
              </div>

              {/* Physical Stores */}
              <div className="bg-white rounded-[5px] p-5 border border-gray-100 shadow-sm space-y-3 text-left h-full">
                <h3 className="text-[10px] font-black text-navy uppercase tracking-tight pb-2 border-b border-gray-50 flex items-center gap-2">
                  <span className="w-1 h-3 bg-[#E8500A] rounded-full inline-block" />
                  Physical Stores
                </h3>
                <div className="space-y-2">
                  {[
                    'BASUNDHARA CITY COMPLEX, LEVEL 5, BLOCK B, SHOP 54',
                    'JAMUNA FUTURE PARK, LEVEL 3, ZONE A, SHOP 120',
                    'JAMUNA FUTURE PARK, LEVEL 2, ZONE A, SHOP 121',
                  ].map((loc, i) => (
                    <div key={i} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 flex items-start gap-2">
                      <Globe size={12} className="text-[#E8500A] flex-shrink-0 mt-0.5" />
                      <span className="text-[8.5px] font-black text-navy uppercase tracking-wide leading-tight">{loc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Profile */}
              <div className="bg-white rounded-[5px] overflow-hidden shadow-sm border border-gray-100 text-left h-full flex flex-col">
                <div className="p-5 flex flex-col items-center text-center hero-gradient text-white flex-1">
                  <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center p-2 shadow-lg mb-3">
                    <span className="font-black text-[10px] text-white tracking-widest uppercase">{brandName}</span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">{brandName}</h4>
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={10} className="fill-orange-primary text-orange-primary" />
                    ))}
                  </div>
                  <div className="space-y-2 w-full mt-auto">
                    <button
                      type="button"
                      onClick={handleMessageOrder}
                      className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase tracking-wider italic transition-all cursor-pointer border-none"
                    >
                      Message To Order
                    </button>
                    <FollowButton
                      id={String(brandId)}
                      name={brandName}
                      type="brand"
                      className="w-full h-9 rounded-full italic text-[9px] font-black tracking-wider shadow-sm uppercase shrink-0 px-4"
                    />
                    <Link
                      to={`/brands/${brandId}`}
                      className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#E8500A] text-white text-[9px] font-black uppercase tracking-wider inline-block text-center italic"
                    >
                      View Brand Profile
                    </Link>
                  </div>
                </div>
              </div>

              {/* Price Across Stores */}
              <div className="bg-white rounded-[5px] border border-gray-100 shadow-sm overflow-hidden font-sans text-left h-full flex flex-col">
                <div className="p-4 border-b border-gray-50">
                  <h3 className="text-[10px] font-black text-navy uppercase tracking-tight flex items-center gap-2">
                    <span className="w-1 h-3 bg-[#E8500A] rounded-full inline-block" />
                    Price Across Stores
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 flex-1">
                  {[
                    { name: 'Daraz BD', rating: '4.5', price: Math.round((product.price || 1500) * 0.96) },
                    { name: `${brandName} Store`, rating: '5.0', price: product.price || 1500 },
                    { name: 'Pickaboo Metro', rating: '4.8', price: Math.round((product.price || 1500) * 1.02) },
                  ].map((store, i) => (
                    <div key={i} className="px-4 py-3 flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors">
                      <div className="min-w-0">
                        <span className="text-[9px] font-black text-navy block tracking-tight truncate">{store.name}</span>
                        <span className="text-[7px] font-bold text-gray-400">⭐ {store.rating}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-black text-[#E8500A] font-mono block">৳{store.price.toLocaleString()}</span>
                        <button
                          type="button"
                          onClick={() => toast.success(`Redirecting to deal with ${store.name}...`)}
                          className="mt-1 px-2 py-1 bg-[#0A0A1F] text-white hover:bg-orange-primary transition-all rounded-lg text-[7px] font-black uppercase cursor-pointer border-none"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </StudioWrap>

            {/* Sponsored Advertisement */}
            <div className="bg-[#1A1D4E] text-white rounded-[5px] p-6 relative overflow-hidden text-left shadow-xl border border-white/5 font-sans w-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8500A]/20 blur-2xl rounded-full translate-x-1/4 -translate-y-1/4" />
              <span className="text-[7.5px] font-black text-[#E8500A] uppercase tracking-[0.2em] block mb-1.5 italic">
                SPONSORED AD
              </span>
              <h4 className="text-xs font-black uppercase tracking-tight mb-2 text-white">
                Upgrade To Express Delivery
              </h4>
              <p className="text-[9.5px] text-white/60 leading-relaxed mb-4 uppercase font-bold">
                Get free 1-hour home deliveries inside Dhaka metro area under Choosify.bd Premium Club membership.
              </p>
              <button
                type="button"
                onClick={() => toast.success('Choosify Premium Club VIP services requested!')}
                className="bg-[#E8500A] hover:bg-orange-600 text-white px-4 py-2.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer leading-none border-none"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Section */}
      <section className="w-full bg-[#F4F9FF] border-t border-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
            <ShieldCheck size={40} className="text-blue-600" />
          </div>
          <div className="space-y-2">
            <h4 className="text-2xl font-black text-navy italic tracking-tighter uppercase leading-none">
              Choosify.bd Trust Statement
            </h4>
            <p className="text-[14px] font-bold text-gray-400 uppercase tracking-widest italic">
              “Only verified sellers and unbiased brands are listed on
              Choosify.bd.”
            </p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {/* STEP 1: Message to Order - Option Configuration Popup */}
        {showOrderConfig && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D0E25] border border-white/10 rounded-2xl p-6 max-w-md w-full relative text-left"
            >
              <button
                onClick={() => setShowOrderConfig(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer bg-transparent border-none"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Message to Order
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
                    Step 1: Configure Sourcing Parameters
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Product Meta */}
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                  <img
                    src={product.image || product.thumbnail || PLACEHOLDER_IMAGE}
                    alt={product.title}
                    className="w-12 h-12 rounded-[5px] object-cover shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight truncate max-w-[220px]">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-[#E8500A] font-bold mt-0.5 font-mono">
                      BDT {product.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5">
                      Select Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color: string) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setOrderColor(color)}
                          className={cn(
                            "px-3.5 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all",
                            orderColor === color
                              ? "bg-[#E8500A] text-white italic shadow-md shadow-orange-500/10 border-none"
                              : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 cursor-pointer"
                          )}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes/Options Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5">
                      Select Size/Option
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size: string) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setOrderSize(size)}
                          className={cn(
                            "px-3.5 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all",
                            orderSize === size
                              ? "bg-[#E8500A] text-white italic shadow-md shadow-orange-500/10 border-none"
                              : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 cursor-pointer"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity input */}
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5">
                    Order Quantity
                  </label>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-max">
                    <button
                      type="button"
                      onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                      className="text-white/60 hover:text-white font-black text-sm p-1 cursor-pointer bg-transparent border-none"
                    >
                      -
                    </button>
                    <span className="text-white font-mono font-bold text-xs w-10 text-center">
                      {orderQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setOrderQty(orderQty + 1)}
                      className="text-white/60 hover:text-white font-black text-sm p-1 cursor-pointer bg-transparent border-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Special Memo */}
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5">
                    Additional Notes / Custom Sourcing Memo
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please expedite custom retail tag attachment or ship with cardboard protection boxes..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full bg-[#050514] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-orange-primary transition-colors resize-none"
                  />
                </div>

                {/* Action CTA row */}
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => setShowOrderConfig(false)}
                    className="flex-1 py-3 text-center border border-white/10 rounded-full hover:bg-white/5 transition-all text-[10px] md:text-[11px] font-black uppercase tracking-wider italic text-white cursor-pointer bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowOrderConfig(false);
                      setShowOrderConfirm(true);
                    }}
                    className="flex-1 py-3 bg-[#E8500A] text-white rounded-full hover:bg-orange-600 transition-all text-[10px] md:text-[11px] font-black uppercase tracking-wider italic shadow-md shadow-orange-500/10 cursor-pointer border-none"
                  >
                    Confirm Params
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* STEP 2: Pre-filled Confirmation Message and Chat Initiation */}
        {showOrderConfirm && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D0E25] border border-white/10 rounded-2xl p-6 max-w-md w-full relative text-left"
            >
              <button
                onClick={() => setShowOrderConfirm(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer bg-transparent border-none"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Confirm Broadcast Order
                  </h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
                    Step 2: Auto-send Structured Brief
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Structured Overview Block */}
                <div className="bg-[#050514] border border-white/5 rounded-xl p-4 text-left">
                  <span className="text-[7.5px] font-black text-[#E8500A] uppercase tracking-widest block mb-2 italic">
                    CONFIRM LIVE MESSAGE SUMMARY
                  </span>
                  
                  <div className="space-y-1.5 text-xs text-white/80 font-mono">
                    <p><span className="text-white/40 font-sans font-bold">Product:</span> {product.title}</p>
                    <p><span className="text-white/40 font-sans font-bold">Brand Partner:</span> {brandName}</p>
                    <p><span className="text-white/40 font-sans font-bold">Configuration:</span> {orderColor} / {orderSize}</p>
                    <p><span className="text-white/40 font-sans font-bold">Quantity:</span> {orderQty} units</p>
                    <p><span className="text-white/40 font-sans font-bold">Total Estimate:</span> BDT {(orderQty * product.price).toLocaleString()}</p>
                    <p><span className="text-white/40 font-sans font-bold">Note Memo:</span> <span className="italic">"{orderNotes || 'None'}"</span></p>
                  </div>
                </div>

                {/* Help tip */}
                <div className="flex gap-2 items-start bg-blue-500/5 text-blue-400 p-3 rounded-xl border border-blue-500/10 text-[10px] leading-relaxed">
                  <Info size={12} className="shrink-0 mt-0.5" />
                  <p>
                    Confirming this order request will create a new direct thread with the brand, send this order brief, and auto-confirm acceptance references from the merchant!
                  </p>
                </div>

                {/* CTA actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowOrderConfirm(false);
                      setShowOrderConfig(true);
                    }}
                    className="flex-1 py-3 text-center border border-white/10 rounded-full hover:bg-white/5 transition-all text-[10px] md:text-[11px] font-black uppercase tracking-wider italic text-white cursor-pointer bg-transparent"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmAndSend}
                    className="flex-1 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-all text-[10px] md:text-[11px] font-black uppercase tracking-wider italic shadow-md shadow-emerald-500/10 cursor-pointer border-none"
                  >
                    Send & Start Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

      {product.sizeGuide && (
        <SizeGuideModal
          open={showSizeGuideButton && isSizeChartOpen}
          onClose={() => setIsSizeChartOpen(false)}
          sizeGuide={product.sizeGuide}
        />
      )}
    </div>
  );
}
