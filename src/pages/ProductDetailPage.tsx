import React, { useState, useMemo } from "react";
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
  Calculator,
  Tag,
  Check,
} from "lucide-react";
import { PRODUCTS, BRANDS, PLACEHOLDER_IMAGE } from "../constants";
import { useGlobalState } from "../context/GlobalStateContext";
import { useDashboard } from "../context/DashboardContext";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { toast } from "react-hot-toast";
import { ProductMediaGallery } from "../components/ProductMediaGallery";
import { InfluencerReviews } from "../components/InfluencerReviews";
import { PublicReviewCard } from "../components/PublicReviewCard";
import { FollowButton } from "../components/FollowButton";
import { useRegisterPageFilters } from "../components/FilterEngine";

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

function WithInfluencerReviews({ brandName }: { brandName: string }) {
  const featuredReview = {
    image:
      "https://images.unsplash.com/photo-1511119253457-36e78921865c?w=1200&h=800&fit=crop",
    title: `${brandName} Special Edition`,
    excerpt: `Watch as we dive deep into the performance and build quality of ${brandName}'s latest collection. From real-world testing to expert analysis.`,
    authorName: "TECH REVIEW BD",
    authorSub: "Dhaka Headquarters",
    authorLogo: brandName,
    badgeText: "TRENDING NOW",
  };

  const reviews = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop",
      category: "FASHION VIBES",
      title: `${brandName} Style Showcase`,
      authorName: "Style Maven",
      authorHandle: "@stylemaven • 12m",
      authorAvatar: "https://i.pravatar.cc/100?u=style",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop",
      category: "FOOTWEAR",
      title: `${brandName} Collection: A Deep Dive`,
      authorName: "BB Tech Reviews",
      authorHandle: "@bbtech • 15h",
      authorAvatar: "https://i.pravatar.cc/100?u=bbtech",
      badgeBg: "bg-blue-600/95",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop",
      category: "UNBOXING",
      title: `Finding The Perfect Build in ${brandName}`,
      authorName: "Avishek Mojumder",
      authorHandle: "@avishek • 1d",
      authorAvatar: "https://i.pravatar.cc/100?u=avishek",
      badgeBg: "bg-purple-600/95",
    },
  ];

  return (
    <InfluencerReviews
      title="INFLUENCER & CREATOR REVIEWS"
      subtitle={`TRUSTED EXPERTS BREAKING DOWN ${brandName.toUpperCase()}`}
      featuredReview={featuredReview}
      reviews={reviews}
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
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { allProducts, allBrands, addToCart: globalAddToCart, mode, isLoggedIn, currentUser } = useGlobalState();
  
  const product: any =
    allProducts.find((p: any) => p.id === Number(id)) ||
    allProducts.find((p: any) => p.id === Number(id) + 1000) ||
    allProducts[0];

  // ── Optional Add-ons State ───────────────────────────────────────
  const [selectedAddonIds, setSelectedAddonIds] = useState<Set<string>>(new Set());
  const resolvedAddons = useMemo(() => resolveAddons(product), [product?.id]);
  const hasAddons = resolvedAddons.length > 0;

  useRegisterPageFilters({
    pageName: 'Product',
    renderSearch: null,
    quickFilters: [],
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
    if (product) {
      addRecentlyViewed(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

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
  const brandObj = allBrands.find((b: any) => b.id === product.brandId);
  const brandId = brandObj ? brandObj.id : 1;
  const brandName = brandObj ? brandObj.name : "Apex";

  const [activeTab, setActiveTab] = useState("Overview");
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [b2bQty, setB2bQty] = useState(product?.moq || 10);

  // States for Stats Bar and ScrollSpy
  const [loveCount, setLoveCount] = useState(1243);
  const [hasLoved, setHasLoved] = useState(false);
  const [purchasedCount, setPurchasedCount] = useState(854);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [viewCount] = useState(14238);
  const [activeSection, setActiveSection] = useState("All");

  const handlePurchasedClicked = () => {
    if (hasPurchased) {
      setPurchasedCount((prev) => prev - 1);
      setHasPurchased(false);
      toast.success("Removed your verified purchase status.");
    } else {
      setPurchasedCount((prev) => prev + 1);
      setHasPurchased(true);
      toast.success("Verified purchase recorded!");
    }
  };

  // Interactive ScrollSpy Effect
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220; // safe offset for active section detection

      if (window.scrollY < 200) {
        setActiveSection("All");
        return;
      }

      const sections = [
        { id: "influencer-reviews-section", name: "Influencer Reviews" },
        { id: "public-reviews-section", name: "Public Reviews" },
        { id: "product-overview-section", name: "Product Overview" },
        { id: "brand-overview-section", name: "Brand Overview" },
      ];

      let currentSection = "All";
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Variant support state hooks
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedRam, setSelectedRam] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);

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

  // Sync qty with state product MOQ
  React.useEffect(() => {
    if (product) {
      setB2bQty(product.moq || 1);
    }
  }, [product]);

  const getActiveUnitPrice = () => {
    if (!product.pricingTiers || product.pricingTiers.length === 0) {
      return product.price;
    }
    let activeSlab = product.pricingTiers[0];
    for (const tier of product.pricingTiers) {
      if (b2bQty >= tier.minQuantity) {
        activeSlab = tier;
      }
    }
    return activeSlab.price;
  };

  const activeUnitPrice = getActiveUnitPrice();
  const activeTotalPrice = activeUnitPrice * b2bQty;

  // Custom Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteNotes, setQuoteNotes] = useState("");
  const [quoteBusinessName, setQuoteBusinessName] = useState("");

  const handleAddToCartClick = () => {
    if (mode === "wholesale" && product.moq && b2bQty < product.moq) {
      toast.error(
        `Minimum order quantity is ${product.moq} units for wholesale.`,
      );
      return;
    }
    addToCart(product, b2bQty);
    // Store selected add-ons in sessionStorage for checkout to read
    if (selectedAddons.length > 0) {
      sessionStorage.setItem(
        `choosify_addons_${product.id}`,
        JSON.stringify(selectedAddons)
      );
    }
    toast.success(
      `Added ${b2bQty} units of ${product.title} to your cart successfully!`,
    );
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
    setOrderQty(product?.moq || 1);
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
      mode === "wholesale" ? "wholesale" : "retail",
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

  const handleLoveClicked = () => {
    if (hasLoved) {
      setLoveCount((prev) => prev - 1);
      setHasLoved(false);
      toast.success("Removed love react.");
    } else {
      setLoveCount((prev) => prev + 1);
      setHasLoved(true);
      toast.success("Thanks for loving this product!");
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === "all-section") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("All");
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 140; // Offset for sticky stats/header/nav
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        const labels: { [key: string]: string } = {
          "influencer-reviews-section": "Influencer Reviews",
          "public-reviews-section": "Public Reviews",
          "product-overview-section": "Product Overview",
          "brand-overview-section": "Brand Overview",
        };
        setActiveSection(labels[sectionId] || "All");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {/* Breadcrumb & Meta Info */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-b border-gray-100 font-sans">
        <div className="flex items-center justify-start gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
          <Link to="/" className="hover:text-[#E8500A] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link
            to="/products"
            className="hover:text-[#E8500A] transition-colors"
          >
            Products
          </Link>
          <ChevronRight size={12} />
          <span className="text-gray-500">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-[#E8500A]">{product.title}</span>
        </div>
      </div>

      {/* Continuous Hero Wrapper with Unified Choosify Gradient */}
      <div className="choosify-dark-gradient w-full relative overflow-hidden">
        {/* Layer 1 Base & Multi-layered Ambient Light Glows */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-[#F97316]/15 to-transparent rounded-full blur-[140px] -translate-y-1/3 translate-x-1/4 pointer-events-none mix-blend-plus-lighter opacity-90" />

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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4 border-b border-white/10 pb-4">
                <div
                  className="text-[25px] font-extrabold text-[#E8500A] italic uppercase tracking-tight leading-none"
                  style={{ fontSize: "25px" }}
                >
                  BDT - {product.price}
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied directly to clipboard!");
                    }}
                    className="w-10 h-10 rounded-full bg-white hover:bg-white/90 text-[#120713] flex items-center justify-center transition-all shadow-md cursor-pointer border-none"
                    title="Share link"
                  >
                    <Share2 size={15} />
                  </button>
                  <button
                    onClick={() => toast.success("Product bookmarked!")}
                    className="w-10 h-10 rounded-full bg-white hover:bg-white/95 text-[#120713] flex items-center justify-center transition-all shadow-md cursor-pointer border-none"
                    title="Save Bookmark"
                  >
                    <Bookmark size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Variants & Beautiful Interactive Callouts */}
            <div className="w-full border-t border-white/10 pt-4 flex flex-col items-center justify-center text-center space-y-4">
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
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="text-[10px] font-bold text-[#E8500A] uppercase hover:underline italic flex items-center gap-1 ml-2 self-center tracking-widest pl-1 cursor-pointer bg-transparent border-none"
                  >
                    SIZE GUIDE
                  </button>
                </div>
              </div>

              {/* ── Optional Add-ons Module ──────────────────────────────── */}
              {hasAddons && (
                <OptionalAddonsModule
                  addons={resolvedAddons}
                  selectedIds={selectedAddonIds}
                  onToggle={toggleAddon}
                  basePrice={activeUnitPrice || product.price}
                  addonTotal={addonTotal}
                />
              )}
              {/* ──────────────────────────────────────────────────────────── */}

              {/* Commercial Primary Buttons aligned horizontally */}
              {mode === "retail" ? (
                <div className="flex flex-row flex-wrap items-center gap-3 w-full pt-4 px-4 sm:px-0 box-border text-left">
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
                        toast.success(`Added ${product.title} to your Retail Cart!`);
                      }
                    }}
                    className="px-6 py-3 rounded-full bg-[#E8500A] text-white text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 italic border border-[#E8500A]/30 hover:bg-[#ff5d14] cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    ADD TO CART
                  </button>
                  <Link
                    to={`/brands/${brandId}`}
                    className="px-6 py-3 rounded-full bg-white text-[#1A1D4E] hover:bg-gray-50 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 italic border border-[#e8edf2] cursor-pointer shadow-sm"
                  >
                    VISIT OFFICIAL STORE
                  </Link>
                  <button
                    onClick={handleAddToCompare}
                    className="px-6 py-3 rounded-full bg-white text-[#1A1D4E] hover:bg-gray-50 text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 italic border border-[#e8edf2] cursor-pointer shadow-sm"
                  >
                    ADD TO COMPARE
                  </button>
                </div>
              ) : (
                /* B2B Wholesale channels calculator inside the dark theme wrapper as well! */
                <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[5px] p-6 relative overflow-hidden backdrop-blur-sm text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8500A]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-white/10">
                    <div className="text-left">
                      <span className="text-[10px] font-black text-[#E8500A] uppercase tracking-widest italic block mb-1 text-left">
                        B2B Wholesale Channel
                      </span>
                      <h4 className="text-lg font-black text-white uppercase tracking-tighter italic text-left">
                        Bulk Trade Sourcing Panel
                      </h4>
                    </div>
                    <div className="bg-[#E8500A]/10 border border-[#E8500A]/30 text-[#E8500A] text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase italic tracking-wider">
                      MOQ: {product.moq || 10} Units Enforced
                    </div>
                  </div>

                  {/* Quantity slabs layout */}
                  {product.pricingTiers && (
                    <div className="mb-6 text-left">
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2 italic">
                        Sourcing Pricing Slabs
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {product.pricingTiers.map((tier: any, tIdx: number) => {
                          const isCurrentSlab =
                            b2bQty >= tier.minQuantity &&
                            (tIdx === product.pricingTiers.length - 1 ||
                              b2bQty <
                                product.pricingTiers[tIdx + 1].minQuantity);
                          return (
                            <div
                              key={tIdx}
                              className={cn(
                                "rounded-xl p-3 border text-center transition-all bg-white/5",
                                isCurrentSlab
                                  ? "border-[#E8500A] bg-[#E8500A]/5 scale-102"
                                  : "border-white/10",
                              )}
                            >
                              <div className="text-[9px] font-black text-white/55">
                                {tier.minQuantity}+ Pcs
                              </div>
                              <div className="text-base font-black font-mono text-[#E8500A] mt-1">
                                ৳{tier.price.toLocaleString()}
                              </div>
                              {isCurrentSlab && (
                                <div className="text-[7px] font-black text-[#E8500A] uppercase tracking-tighter mt-1 italic">
                                  ✓ Selected
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Calculator */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#FFF]/40">
                        <span>Enter Order Qty:</span>
                        {product.moq && b2bQty < product.moq && (
                          <span className="text-red-500 font-bold font-mono">
                            Below MOQ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between bg-[#0A0B1E]/60 border border-white/10 rounded-xl px-4 py-2">
                        <button
                          type="button"
                          onClick={() => setB2bQty(Math.max(1, b2bQty - 1))}
                          className="text-white/60 hover:text-white font-black text-sm p-1 cursor-pointer bg-transparent border-none"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={b2bQty}
                          onChange={(e) =>
                            setB2bQty(
                              Math.max(1, parseInt(e.target.value) || 1),
                            )
                          }
                          className="w-20 text-center bg-transparent border-none text-white focus:outline-none font-bold font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setB2bQty(b2bQty + 1)}
                          className="text-white/60 hover:text-white font-black text-sm p-1 cursor-pointer bg-transparent border-none"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center text-left">
                      <div>
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest italic block">
                          Calculated Total
                        </span>
                        <span className="text-xl font-mono font-black text-white">
                          ৳{activeTotalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest italic block">
                          Unit Active
                        </span>
                        <span className="text-[11px] font-black text-[#E8500A] font-mono">
                          ৳{activeUnitPrice.toLocaleString()} / pc
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <button
                      onClick={handleAddToCartClick}
                      className={cn(
                        "py-3 w-full rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-wider italic transition-all flex items-center justify-center gap-2 cursor-pointer border-none transform hover:scale-[1.03] active:scale-95",
                        product.moq && b2bQty < product.moq
                          ? "bg-gray-700/50 text-white/40 cursor-not-allowed"
                          : "bg-[#E8500A] text-white shadow-[#E8500A]/20 hover:brightness-110",
                      )}
                      disabled={product.moq && b2bQty < product.moq}
                    >
                      <ShoppingBag size={14} /> Add to B2B Cart
                    </button>
                    <button
                      onClick={() => setIsQuoteModalOpen(true)}
                      className="py-3 w-full bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-wider italic transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.03] active:scale-95"
                    >
                      Request Business Quote
                    </button>
                    <button
                      type="button"
                      onClick={handleAddToCompare}
                      className="py-3 w-full bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-wider italic transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.03] active:scale-95 text-center"
                    >
                      Add to Compare
                    </button>
                  </div>

                  {/* Sourcing details */}
                  <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-4 text-left">
                    <div>
                      <span className="text-[7.5px] font-black text-white/30 uppercase block">
                        Invoicing
                      </span>
                      <span className="text-[9px] font-bold text-white/70">
                        GST / BIN Compliant
                      </span>
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black text-[#FFF]/30 uppercase block">
                        Sample Sourcing
                      </span>
                      <span className="text-[9px] font-bold text-[#E8500A]">
                        Samples Available
                      </span>
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black text-white/30 uppercase block">
                        Audit Verification
                      </span>
                      <span className="text-[9px] font-bold text-white/70">
                        SGS Factory Pass
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Post-Hero Stats Bar */}
      <div className="bg-white border-y border-gray-100 py-4.5 px-6 shadow-sm z-20 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-center gap-4 md:gap-0">
          {/* LOVE REACTS */}
          <div className="flex flex-row items-center justify-between md:justify-center gap-4 px-6 py-2.5 md:py-0 text-left">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                Love Reacts
              </span>
              <span className="text-xl font-black text-navy font-sans tracking-tight block">
                {loveCount.toLocaleString()} Likes
              </span>
            </div>
            <button
              onClick={handleLoveClicked}
              className={cn(
                "h-10 px-5 rounded-full font-black text-[10px] uppercase tracking-wider italic flex items-center gap-2 transition-all cursor-pointer active:scale-95",
                hasLoved
                  ? "bg-[#E8500A] text-white shadow-md shadow-[#E8500A]/10 border border-[#E8500A]"
                  : "bg-gray-50 border border-gray-150 text-gray-500 hover:bg-gray-100",
              )}
            >
              <Heart size={13} className={cn(hasLoved && "fill-current")} />
              {hasLoved ? "Loved!" : "Love"}
            </button>
          </div>

          {/* PURCHASED */}
          <div className="flex flex-row items-center justify-between md:justify-center gap-4 px-6 py-2.5 md:py-0 text-left">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                Purchased
              </span>
              <span className="text-xl font-black text-[#4DBC15] font-sans tracking-tight block">
                {purchasedCount.toLocaleString()} Verified Orders
              </span>
            </div>
            <button
              onClick={handlePurchasedClicked}
              className={cn(
                "h-10 px-5 rounded-full font-black text-[10px] uppercase tracking-wider italic flex items-center gap-2 transition-all cursor-pointer active:scale-95 whitespace-nowrap",
                hasPurchased
                  ? "bg-[#4DBC15] text-white shadow-md shadow-[#4DBC15]/10 border border-[#4DBC15]"
                  : "bg-gray-50 border border-gray-150 text-gray-500 hover:bg-gray-100",
              )}
            >
              <CheckCircle2
                size={13}
                className={cn(
                  hasPurchased && "fill-current text-white",
                  !hasPurchased && "text-[#4DBC15]",
                )}
              />
              {hasPurchased ? "Purchased!" : "Purchase"}
            </button>
          </div>

          {/* VIEWS */}
          <div className="flex flex-row items-center justify-between md:justify-center gap-4 px-6 py-2.5 md:py-0 text-left">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">
                Product Views
              </span>
              <span className="text-xl font-black text-navy font-sans tracking-tight block">
                {viewCount.toLocaleString()} Sessions
              </span>
            </div>
            <div className="h-10 px-4.5 bg-[#E8500A]/5 text-[#E8500A] rounded-full text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1.5 border border-[#E8500A]/10 select-none">
              <TrendingUp size={11} className="text-[#E8500A] animate-pulse" />
              Trending Rapidly
            </div>
          </div>
        </div>
      </div>



      {/* Main Content Area */}
      <main id="all-section" className="bg-[#F8FAFC] py-5">
        <div className="max-w-[1440px] mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_260px] xl:grid-cols-[280px_minmax(0,1fr)_310px] gap-4 items-start w-full relative">
            {/* Left Column Section (Column 1) */}
            <div className="space-y-8 lg:sticky lg:top-24 pb-10 pr-2">
              {/* PRODUCT SPECIFICATIONS */}
              <div className="bg-white rounded-[5px] border border-gray-100 shadow-xl overflow-hidden p-6 space-y-4 font-sans text-left">
                <h3 className="text-xs font-black text-navy uppercase tracking-tight pb-2 border-b border-gray-50 flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-[#E8500A] rounded-full inline-block" />
                  Specifications
                </h3>
                <div className="divide-y divide-gray-150 text-[11px] font-bold">
                  {[
                    {
                      label: "BRAND",
                      value: brandObj?.name || product.brand || "Sailor",
                    },
                    {
                      label: "CATEGORY",
                      value: product.category || "Lifestyle",
                    },
                    { label: "MATERIAL", value: "Premium Grade Build" },
                    { label: "ORIGIN", value: "Local Production / Auth" },
                    { label: "WARRANTY", value: "1 Year Care Warranty" },
                    {
                      label: "MODEL",
                      value: product.title?.substring(0, 16) || "Classic",
                    },
                    {
                      label: "RATING",
                      value: `${product.rating || "4.8"} / 5`,
                    },
                    {
                      label: "STATUS",
                      value: isOutOfStock ? "Out of Stock" : "In Stock",
                    },
                  ].map((spec, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex justify-between py-3 px-3",
                        i % 2 !== 0 ? "bg-gray-50/50" : "bg-white",
                      )}
                    >
                      <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[9px]">
                        {spec.label}
                      </span>
                      <span className="text-navy font-black text-right text-[11px]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOX CONTENT SECTION */}
              <div className="bg-white rounded-[5px] border border-gray-100 shadow-xl overflow-hidden p-6 space-y-4 font-sans text-left">
                <h3 className="text-xs font-black text-navy uppercase tracking-tight pb-2 border-b border-gray-50 flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-[#E8500A] rounded-full inline-block" />
                  Box Content
                </h3>
                {boxContents && boxContents.length > 0 ? (
                  <div className="divide-y divide-gray-150 text-[11px] font-bold">
                    {boxContents.map((item, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-2.5 py-3 px-3",
                          i % 2 !== 0 ? "bg-gray-50/50" : "bg-white",
                        )}
                      >
                        <span className="text-emerald-500 font-black text-xs shrink-0 select-none">✓</span>
                        <span className="text-navy font-black text-[11px] uppercase tracking-wide">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50/50 rounded-[5px] border border-dashed border-gray-200 text-center text-gray-400 font-bold text-[10px] uppercase tracking-wider leading-relaxed">
                    No box content information has been provided by the seller.
                  </div>
                )}
              </div>
            </div>
            {/* Middle Column Section (Column 2) - Center Content */}
            <div className="space-y-8 min-w-0">
              {/* INFLUENCER & CREATOR REVIEWS */}
              <div id="influencer-reviews-section" className="scroll-mt-36">
                <WithInfluencerReviews brandName={brandName} />
              </div>
            </div>

            {/* Right Side Column (Column 3) */}
            <div className="space-y-8 lg:sticky lg:top-24 pb-10 pr-2">
              {/* PRICE ACROSS STORES TABLE CARD */}
              <div className="bg-white rounded-[5px] border border-gray-100 shadow-xl overflow-hidden font-sans text-left">
                <div className="p-6 flex items-center justify-between border-b border-gray-50">
                  <h3 className="text-xs font-black text-navy uppercase tracking-tight flex items-center gap-2">
                    <span className="w-1 h-3.5 bg-[#E8500A] rounded-full inline-block" />
                    PRICE ACROSS{" "}
                    <span className="text-orange-primary">STORES</span>
                  </h3>
                  <span className="text-[9px] font-black text-orange-primary italic uppercase tracking-wider">
                    3 Deals
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0A0A1F] text-white">
                        <th className="px-3.5 py-3 text-[8.5px] font-black uppercase tracking-wider">
                          Store
                        </th>
                        <th className="px-3.5 py-3 text-[8.5px] font-black uppercase tracking-wider text-center">
                          Price
                        </th>
                        <th className="px-3.5 py-3 text-[8.5px] font-black uppercase tracking-wider text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {[
                        {
                          name: "Daraz BD",
                          rating: "4.5",
                          price: Math.round((product.price || 1500) * 0.96),
                        },
                        {
                          name: `${brandName} Store`,
                          rating: "5.0",
                          price: product.price || 1500,
                        },
                        {
                          name: "Pickaboo Metro",
                          rating: "4.8",
                          price: Math.round((product.price || 1500) * 1.02),
                        },
                      ].map((store, i) => (
                        <tr
                          key={i}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-3.5 py-3">
                            <span className="text-[10px] font-black text-navy block tracking-tight">
                              {store.name}
                            </span>
                            <span className="text-[7.5px] font-bold text-gray-400 block mt-0.5">
                              ⭐ {store.rating} Rating
                            </span>
                          </td>
                          <td className="px-3.5 py-3 text-center">
                            <span className="text-[10.5px] font-black text-[#E8500A] font-mono">
                              ৳{store.price.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-3.5 py-3 text-center">
                            <button
                              onClick={() =>
                                toast.success(
                                  `Redirecting to official BDT deal with ${store.name}...`,
                                )
                              }
                              className="px-2.5 py-1.5 bg-[#0A0A1F] text-white hover:bg-orange-primary transition-all rounded-[10px] text-[8px] font-black uppercase tracking-widest leading-none cursor-pointer"
                            >
                              BUY
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BRAND PROFILE CARD - ONLY ONE AT RIGHT SIDEBAR */}
              <div className="bg-white rounded-[5px] overflow-hidden shadow-xl border border-gray-100 group text-left w-full max-w-sm mx-auto lg:max-w-none">
                <div className="p-6 flex flex-col items-center text-center hero-gradient text-white">
                  <div className="relative mb-4 mt-2">
                    <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center p-2.5 shadow-lg scale-100 group-hover:scale-105 transition-transform duration-500">
                      <div className="font-black text-sm text-white tracking-widest uppercase">
                        {brandName}
                      </div>
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-primary flex items-center justify-center text-white border-2 border-white shadow-md">
                      <svg
                        className="w-2.5 h-2.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    </div>
                  </div>

                  <h4 className="text-lg font-black text-white uppercase tracking-widest mb-1">
                    {brandName}
                  </h4>

                  <div className="flex gap-0.5 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={11}
                        className="fill-orange-primary text-orange-primary"
                      />
                    ))}
                  </div>

                  <div className="space-y-2.5 w-full">
                    <button
                      onClick={handleMessageOrder}
                      className="w-full py-3 ml-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] md:text-[11px] font-black uppercase tracking-wider transform hover:scale-[1.03] active:scale-95 italic transition-all inline-flex items-center justify-center gap-1.5 leading-none cursor-pointer border-none"
                    >
                      MESSAGE TO ORDER
                    </button>

                    <FollowButton
                      id={String(brandId)}
                      name={brandName}
                      type="brand"
                      className="w-full h-11 rounded-full italic hover:scale-[1.03] active:scale-95 cursor-pointer text-[10.5px] font-black tracking-wider shadow-sm uppercase shrink-0 px-4"
                    />

                    <Link
                      to={`/brands/${brandId}`}
                      className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#E8500A] text-white text-[10px] md:text-[11px] font-black uppercase tracking-wider hover:brightness-110 transition-all inline-block leading-none mt-2 text-center italic hover:scale-[1.03] active:scale-95"
                    >
                      VIEW BRAND PROFILE
                    </Link>
                  </div>

                  {/* Social Icons row */}
                  <div className="flex justify-center gap-3 sm:gap-4 md:gap-3 xl:gap-4 flex-wrap mt-6 pt-5 border-t border-white/10 w-full">
                    {[
                      {
                        icon: <Facebook size={16} />,
                        label: "Facebook",
                      },
                      {
                        icon: <Instagram size={16} />,
                        label: "Instagram",
                      },
                      {
                        icon: (
                          <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
                          </svg>
                        ),
                        label: "TikTok",
                      },
                      {
                        icon: <Youtube size={16} />,
                        label: "YouTube",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1.5 cursor-pointer group/soc focus:outline-none"
                      >
                        <div
                          className="w-9 h-9 min-w-[36px] min-h-[36px] shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 transition-all duration-300 active:scale-95 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                        >
                          {item.icon}
                        </div>
                        <span className="text-[11.5px] text-white/50 group-hover/soc:text-[#F97316] font-normal transition-colors">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PHYSICAL STORES */}
              <div className="bg-white rounded-[5px] p-6 border border-gray-100 shadow-xl space-y-4 text-left">
                <h3 className="text-xs font-black text-navy uppercase tracking-tight pb-2 border-b border-gray-50 flex items-center gap-2">
                  <span className="w-1 h-3.5 bg-[#E8500A] rounded-full inline-block" />
                  PHYSICAL <span className="text-orange-primary">STORES</span>
                </h3>
                <div className="space-y-3">
                  {[
                    "BASUNDHARA CITY COMPLEX, LEVEL 5, BLOCK B, SHOP 54",
                    "JAMUNA FUTURE PARK, LEVEL 3, ZONE A, SHOP 120",
                    "JAMUNA FUTURE PARK, LEVEL 2, ZONE A, SHOP 121",
                  ].map((loc, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-150 flex items-start gap-2.5 hover:bg-navy hover:border-navy hover:text-white transition-all duration-300 group"
                    >
                      <Globe
                        size={14}
                        className="text-[#E8500A] flex-shrink-0 mt-0.5 group-hover:text-white"
                      />
                      <span className="text-[9.5px] font-black text-navy uppercase tracking-wide leading-tight group-hover:text-white">
                        {loc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SPONSORED ADVERTISEMENT */}
              <div className="bg-[#1A1D4E] text-white rounded-[5px] p-6 relative overflow-hidden text-left shadow-xl border border-white/5 font-sans">
                {/* Orange glowing bubble */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8500A]/20 blur-2xl rounded-full translate-x-1/4 -translate-y-1/4" />

                <span className="text-[7.5px] font-black text-[#E8500A] uppercase tracking-[0.2em] block mb-1.5 italic">
                  SPONSORED AD
                </span>
                <h4 className="text-xs font-black uppercase tracking-tight mb-2 text-white">
                  Upgrade To Express Delivery
                </h4>
                <p className="text-[9.5px] text-white/60 leading-relaxed mb-4 uppercase font-bold">
                  Get free 1-hour home deliveries inside Dhaka metro area under
                  Choosify.bd Premium Club membership.
                </p>
                <button
                  onClick={() =>
                    toast.success(
                      "Choosify Premium Club VIP services requested!",
                    )
                  }
                  className="bg-[#E8500A] hover:bg-orange-600 text-white px-4 py-2.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer leading-none"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>{" "}
          {/* Close 12-column split grid */}
          {/* FULL-WIDTH CONTENT PRIORITIZED AND EXPANDED */}
          <div className="space-y-12 mt-12 w-full">
            {/* PUBLIC REVIEWS (ID: 'public-reviews-section') */}
            <div
              id="public-reviews-section"
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
            </div>

            {/* PRODUCT OVERVIEW (ID: 'product-overview-section') */}
            <div
              id="product-overview-section"
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
                      • B2B & BULK ORGANIZATIONS WITH B2B PRICE SLAB TARGETS
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

      {/* Quote Request Popup Modal */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-navy border border-white/10 text-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <Calculator className="text-[#FF5B00]" size={24} />
                <h3 className="text-xl font-black uppercase tracking-tighter italic">
                  Factory Trade Quotation
                </h3>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success(
                    `Trade Request for ${b2bQty} pcs submitted! Factory manager will reach out within 2 hours.`,
                  );
                  setIsQuoteModalOpen(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5 text-left">
                    Product / Offer Target
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={product?.title}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5 text-left">
                      Volume (Min {product?.moq || 10})
                    </label>
                    <input
                      type="number"
                      required
                      min={product?.moq || 10}
                      value={b2bQty}
                      onChange={(e) =>
                        setB2bQty(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-full bg-[#050514] border border-white/15 rounded-xl px-4 py-3 text-xs text-white outline-none font-bold font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5 text-left">
                      Active Slab Rate
                    </label>
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-orange-primary font-black font-mono">
                      ৳{activeUnitPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5 text-left">
                    Company Trade Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka Apparel Holdings"
                    value={quoteBusinessName}
                    onChange={(e) => setQuoteBusinessName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FF5B00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5 text-left">
                    Custom Sourcing Remarks
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe custom logistics packaging or customized brand tags required..."
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="w-full bg-[#050514] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-orange-primary transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#FF5B00] text-white text-[11px] font-black uppercase tracking-widest italic rounded-xl shadow-lg shadow-orange-primary/20 hover:scale-[1.02] hover:brightness-110 active:scale-95 transition-all"
                  >
                    Submit RFQ Proposal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
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
                    Order Quantity (MOQ: {product.moq || 1})
                  </label>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-max">
                    <button
                      type="button"
                      onClick={() => setOrderQty(Math.max(product.moq || 1, orderQty - 1))}
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
    </div>
  );
}
