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
import { notificationApi } from "../services/notificationApi";
import { useDashboard } from "../context/DashboardContext";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { notify, toast } from "../lib/notify";
import { ProductMediaGallery } from "../components/ProductMediaGallery";
import { ProductDetailBuyBox } from "../components/product/ProductDetailBuyBox";
import { ListingRelatedInfoPanel } from "../components/product/detail/ListingRelatedInfoPanel";
import { resolveListingRelatedInfoSection } from "../utils/listingRelatedInfo";
import { OptionalAddonsModule } from '../components/product/OptionalAddonsModule';
import { CreatorReviewsPreview } from "../components/creatorReviews/CreatorReviewsPreview";
import { PublicReviewCard } from "../components/PublicReviewCard";
import { FollowButton } from "../components/FollowButton";
import NotFoundPage from "./NotFoundPage";
import { useRegisterPageFilters } from "../components/FilterEngine";
import { getBrandOfficialWebsite, normalizeExternalUrl } from "../utils/overviewRegistry";
import { SizeGuideModal } from "../components/SizeGuideModal";
import { DETAIL_SINGLE_FEED } from "../lib/pageLayout";
import { DC_CONTENT_MAX } from "../lib/design/dcListingTokens";
import { ProductSpecsOverview } from "../components/ProductSpecsOverview";
import { OverviewListItem } from "../components/OverviewListIcon";
import { DcUnderlineTabs } from "../components/design/DcUnderlineTabs";
import { CardEngagementStrip } from "../components/CardEngagementStrip";
import { useSectionScrollSpy } from "../hooks/useSectionScrollSpy";
import { usePageBreadcrumbs } from "../context/BreadcrumbContext";
import { slugifyPathSegment } from "../lib/seoHelpers";
import { StudioWrap } from "../components/studio/StudioWrap";
import { useStudioEdit } from "../context/StudioEditContext";
import { useHasRole } from "../components/auth/RequireRole";
import { CreateSpotlightCampaignButton } from "../components/spotlight/cms/CreateSpotlightCampaignButton";
import type { CatalogProductSizeGuide } from "../types/catalog";
import { openEmiPanel } from "../lib/emi";
import { BookingRequestFields } from "../components/booking/BookingRequestFields";
import type { BookingOfferCard } from "../types/serviceBooking";
import {
  isServiceListing,
  listingSectionLabels,
  normalizeServiceCategory,
  requestFieldsForListing,
  serviceMessageCtaLabel,
} from "../utils/serviceBooking";

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

// Resolve add-ons for a product — category seeds with platform fallback
const FALLBACK_ADDONS: ProductAddon[] = [
  { id: 'fb1', title: 'Extended Warranty', description: '12-month extended coverage', price: 890, badge: 'Popular', available: true, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=80&h=80&fit=crop' },
  { id: 'fb2', title: 'Premium Case', description: 'Protective branded case', price: 690, available: true, image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=80&h=80&fit=crop' },
  { id: 'fb3', title: 'Screen Protector', description: 'Tempered glass protection', price: 350, badge: 'Recommended', available: true, image: 'https://images.unsplash.com/photo-1592890288564-76628a30a657?w=80&h=80&fit=crop' },
  { id: 'fb4', title: 'Gift Wrap', description: 'Premium gift packaging', price: 100, available: true, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=80&h=80&fit=crop' },
];

function resolveAddons(product: any): ProductAddon[] {
  if (!product) return FALLBACK_ADDONS;
  const category = product.category || product.type || '';
  if (ADDON_SEEDS[category]) return ADDON_SEEDS[category];
  const matchKey = Object.keys(ADDON_SEEDS).find(k =>
    category.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(category.toLowerCase())
  );
  return matchKey ? ADDON_SEEDS[matchKey] : FALLBACK_ADDONS;
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
  const { editMode: studioEditMode } = useStudioEdit();
  const canUseProductStudio = useHasRole('brand', 'admin');

  const productList = allProducts.length > 0 ? allProducts : PRODUCTS;
  const brandList = allBrands.length > 0 ? allBrands : BRANDS;
  
  const baseProduct: any =
    productList.find((p: any) => p.id === Number(id)) ||
    productList.find((p: any) => String(p.catalogId) === String(id)) ||
    productList.find((p: any) => String(p.slug) === String(id)) ||
    productList.find((p: any) => p.id === Number(id) + 1000) ||
    null;

  const product = React.useMemo(() => {
    if (!baseProduct) return null;
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
      priceAcrossStoresEnabled: detail.priceAcrossStoresEnabled ?? (baseProduct as any)?.priceAcrossStoresEnabled,
      whatsNearby: detail.whatsNearby ?? (baseProduct as any)?.whatsNearby,
      beforeYourVisit: detail.beforeYourVisit ?? (baseProduct as any)?.beforeYourVisit,
      physicalStores: detail.physicalStores,
      overviewBlocks: detail.overviewBlocks,
      creatorContent: detail.creatorContent,
      seoTitle: detail.seoTitle,
      seoDescription: detail.seoDescription,
      seoKeywords: detail.seoKeywords,
      sizeGuide: detail.sizeGuide ?? baseProduct?.sizeGuide,
      optionGroups: detail.optionGroups?.length
        ? detail.optionGroups
        : baseProduct?.optionGroups,
      variants: detail.productVariants?.length
        ? detail.productVariants.map((variant) => ({
            ...variant,
            attributes: variant.options,
          }))
        : baseProduct?.variants,
      productType: (detail as any).productType ?? baseProduct?.productType,
      serviceCategory: (detail as any).serviceCategory ?? baseProduct?.serviceCategory,
      complimentaryFeatures:
        (baseProduct as any)?.complimentaryFeatures ||
        detail.overviewBlocks?.[0]?.bullets,
      propertySpecs: (baseProduct as any)?.propertySpecs,
      images: (baseProduct as any)?.images,
      location: (baseProduct as any)?.location,
      duration: (baseProduct as any)?.duration,
      specialty: (baseProduct as any)?.specialty,
      brand: baseProduct.brand || baseProduct.brandName,
      brandName: baseProduct.brandName || baseProduct.brand,
    };
  }, [baseProduct, productDetailsById]);

  const isService = isServiceListing(product);
  const serviceCategory = normalizeServiceCategory(product?.serviceCategory);
  const sectionLabels = listingSectionLabels(product);
  const messageCtaLabel = isService
    ? serviceMessageCtaLabel(product?.serviceCategory)
    : 'Message Seller';
  const requestFields = useMemo(() => requestFieldsForListing(product), [product]);

  const relatedInfoSection = useMemo(
    () => resolveListingRelatedInfoSection(product),
    [product],
  );
  const showRelatedInfoPanel = Boolean(relatedInfoSection);

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
    { id: "product-overview-section", label: sectionLabels.overview, icon: <Info size={13} /> },
    { id: "product-utility-section", label: "Buying Guide", icon: <ShoppingBag size={13} /> },
    ...(!isService
      ? [{ id: "where-to-buy-section", label: "Where to Buy", icon: <Tag size={13} /> }]
      : []),
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
    // Section jumps live in StickySectionNav — do not register as floating filters
    quickFilters: [],
    renderFilters: null,
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
  const brandObj = product
    ? brandList.find((b: any) => b.id === product.brandId) ||
      brandList.find((b: any) => b.name?.toLowerCase() === product.brand?.toLowerCase())
    : undefined;
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartQty, setCartQty] = useState(1);

  React.useEffect(() => {
    setIsSizeChartOpen(false);
    setIsWishlisted(false);
    setCartQty(1);
  }, [product?.id]);

  // Message to Order Flow States
  const [showOrderConfig, setShowOrderConfig] = useState(false);
  const [orderQty, setOrderQty] = useState(1);
  const [orderColor, setOrderColor] = useState("");
  const [orderSize, setOrderSize] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [requestValues, setRequestValues] = useState<Record<string, string | number>>({});
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);

  // Sync state options when product changes
  React.useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      // Auto select first entry that is in stock, or just first entry
      const firstAvailable =
        product.variants.find((v: any) => v.stock > 0) || product.variants[0];
      if (firstAvailable) {
        if (firstAvailable.attributes?.color !== undefined)
          setSelectedColor(firstAvailable.attributes.color);
        if (firstAvailable.attributes?.size !== undefined)
          setSelectedSize(firstAvailable.attributes.size);
        if (firstAvailable.attributes?.ram !== undefined)
          setSelectedRam(firstAvailable.attributes.ram);
        if (firstAvailable.attributes?.storage !== undefined)
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
      const attrs = v.attributes ?? {};
      const hasColor = attrs.color !== undefined;
      const hasSize = attrs.size !== undefined;
      const hasRam = attrs.ram !== undefined;
      const hasStorage = attrs.storage !== undefined;

      if (hasColor && attrs.color !== selectedColor) return false;
      if (hasSize && attrs.size !== selectedSize) return false;
      if (hasRam && attrs.ram !== selectedRam) return false;
      if (hasStorage && attrs.storage !== selectedStorage) return false;
      return true;
    });
  };

  const getBoxContents = () => {
    if (!product) return [];

    const fromProduct = (product as any).complimentaryFeatures;
    if (Array.isArray(fromProduct) && fromProduct.length) return fromProduct;

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
  const uniqueColors = product?.variants
    ? (Array.from(
        new Set(
          product.variants.map((v: any) => v.attributes?.color).filter(Boolean),
        ),
      ) as string[])
    : [];

  const uniqueSizes = product?.variants
    ? (Array.from(
        new Set(
          product.variants.map((v: any) => v.attributes?.size).filter(Boolean),
        ),
      ) as string[])
    : [];

  const uniqueRams = product?.variants
    ? (Array.from(
        new Set(
          product.variants.map((v: any) => v.attributes?.ram).filter(Boolean),
        ),
      ) as string[])
    : [];

  const uniqueStorages = product?.variants
    ? (Array.from(
        new Set(
          product.variants
            .map((v: any) => v.attributes?.storage)
            .filter(Boolean),
        ),
      ) as string[])
    : [];

  // Availability lookup helpers for disabled states
  const isSizeOptionAvailable = (size: string) => {
    if (!product?.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes?.size === size &&
        (!selectedColor || v.attributes?.color === selectedColor) &&
        v.stock > 0,
    );
  };

  const isColorOptionAvailable = (color: string) => {
    if (!product?.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes?.color === color &&
        (!selectedSize || v.attributes?.size === selectedSize) &&
        v.stock > 0,
    );
  };

  const isRamOptionAvailable = (ram: string) => {
    if (!product?.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes?.ram === ram &&
        (!selectedStorage || v.attributes?.storage === selectedStorage) &&
        v.stock > 0,
    );
  };

  const isStorageOptionAvailable = (storage: string) => {
    if (!product?.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes?.storage === storage &&
        (!selectedRam || v.attributes?.ram === selectedRam) &&
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
    { label: "Category", value: product?.category || "Lifestyle" },
    { label: "Fit", value: "Standard / Regular" },
    { label: "Occasion", value: "Festive Exclusive" },
    { label: "Warranty", value: "1 Year Brand Care" },
    { label: "Gender", value: "Unisex / Mens" },
  ];

  // Stock calculations
  const isOutOfStock =
    product?.variants && product.variants.length > 0
      ? selectedVariant
        ? selectedVariant.stock === 0
        : true
      : product?.id === 3 ||
        Boolean(product?.title?.includes("MacBook")) ||
        product?.stock === 0;

  const stockQuantity =
    product?.variants && product.variants.length > 0
      ? selectedVariant
        ? selectedVariant.stock
        : 0
      : isOutOfStock
        ? 0
        : 58;

  const handleLoveBrand = () => {
    toast.success(`You added ${product?.brand || product?.brandName || brandName} to your Favorite Brands!`);
  };

  const handleMessageOrder = () => {
    setOrderQty(1);
    setOrderColor(selectedColor || (product?.colors && product.colors[0]) || "Sunset Orange");
    setOrderSize(selectedSize || selectedRam || selectedStorage || (product?.sizes && product.sizes[0]) || "Standard");
    setOrderNotes("");
    const initialValues: Record<string, string | number> = {};
    requestFields.forEach((field) => {
      if (field.key === 'quantity') initialValues[field.key] = 1;
      else if (field.key === 'color') initialValues[field.key] = selectedColor || '';
      else if (field.key === 'size') initialValues[field.key] = selectedSize || '';
      else if (field.key === 'variant') initialValues[field.key] = selectedRam || selectedStorage || '';
      else initialValues[field.key] = '';
    });
    setRequestValues(initialValues);
    setShowOrderConfig(true);
  };

  const handleConfirmAndSend = () => {
    const threadId = `thread-brand-${brandId}`;
    const requestId = `REQ-${Date.now()}`;
    const notesValue = String(requestValues.notes || orderNotes || '');
    const cleanFields = Object.fromEntries(
      Object.entries(requestValues).filter(([key, value]) => key !== 'notes' && value !== ''),
    );
    const quantity = Number(cleanFields.quantity || orderQty || 1);
    const estimatedPrice = Number(product.price || 0) * quantity + addonTotal;
    const structuredMsg = isService
      ? `Booking request sent for ${product.title}. The seller has 24 hours to respond.`
      : `Product request sent for ${product.title}. The seller has 24 hours to respond.`;
    const now = Date.now();
    const bookingOffer: BookingOfferCard = {
      kind: 'booking_offer',
      requestId,
      version: 1,
      listingId: String(product.id),
      listingTitle: product.title,
      listingImage: product.image || PLACEHOLDER_IMAGE,
      listingHref: `/products/${product.id}`,
      sellerId: String(product.sellerId || brandId),
      sellerName: brandName,
      buyerId: String(currentUser.id),
      serviceCategory: isService ? serviceCategory : undefined,
      isService,
      fields: cleanFields,
      notes: notesValue,
      price: estimatedPrice,
      currency: 'BDT',
      status: 'pending',
      createdAt: new Date(now).toISOString(),
      sellerRespondBy: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
    };

    // 1. Create message thread
    createNewThread(
      threadId,
      brandName,
      brandObj?.logo || "https://i.pravatar.cc/150?u=brand",
      'retail',
      structuredMsg,
      requestId
    );

    // 2. Add structural msg
    addThreadMessage(
      threadId,
      structuredMsg,
      "user",
      "Me",
      undefined,
      bookingOffer,
    );
    addNotification(
      `New ${isService ? 'booking' : 'product'} request ${requestId} sent to ${brandName}.`,
      'message',
    );
    operationsApi
      .submitPlatformMessage({
        buyerId: String(currentUser.id),
        userName: currentUser.name || 'Buyer',
        body: structuredMsg,
        orderId: requestId,
        sellerId: bookingOffer.sellerId,
        bookingOffer,
      })
      .catch(() => {});
    window.dispatchEvent(
      new CustomEvent('choosify-booking-request-created', {
        detail: {
          requestId,
          sellerId: bookingOffer.sellerId,
          sellerName: brandName,
          listingTitle: product.title,
        },
      }),
    );
    notificationApi
      .createAndSend({
        title: isService ? 'New booking request' : 'New product request',
        message: `${currentUser.name} sent request ${requestId} for ${product.title}.`,
        type: 'order',
        audience: `user:${bookingOffer.sellerId}`,
        sendWeb: true,
      })
      .catch(() => {});

    // Show toast and close
    notify.bookingSent(brandName, isService);
    setShowOrderConfirm(false);
    
    // Redirect to Messages thread
    navigate(`/messages/${threadId}`);
  };

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {studioEditMode && isLoggedIn && canUseProductStudio && (
        <div className="sticky top-0 z-[110] bg-[#1A1D4E] border-b border-white/10 px-4 py-3">
          <div className="max-w-[1080px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px] font-bold tracking-tight text-white/70">
              Product Studio
            </p>
            <CreateSpotlightCampaignButton
              productId={String(product?.catalogId ?? product?.id ?? '')}
              brandId={product?.brand ? String(product.brand) : undefined}
            />
          </div>
        </div>
      )}

      <div ref={productHeroRef} className="w-full relative choosify-dark-surface py-7 mb-6">
        <div className="w-full relative">
          <ProductMediaGallery
            product={product}
            selectedVariantImage={selectedVariant?.image}
          />
        </div>
      </div>

      {/* One content column: stats/CTA + tabs + feed (same max-width + gutters) */}
      <div className={cn(DC_CONTENT_MAX, 'w-full')}>
      <ProductDetailBuyBox
        product={product}
        isService={isService}
        messageCtaLabel={messageCtaLabel}
        brandName={brandName}
        isOutOfStock={!!isOutOfStock}
        stockQuantity={stockQuantity}
        purchasedCount={purchasedCount}
        viewCount={viewCount}
        uniqueColors={uniqueColors}
        uniqueSizes={uniqueSizes}
        uniqueRams={uniqueRams}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        selectedRam={selectedRam}
        selectedStorage={selectedStorage}
        setSelectedColor={setSelectedColor}
        setSelectedSize={setSelectedSize}
        setSelectedRam={setSelectedRam}
        getColorHexClass={getColorHexClass}
        showSizeGuideButton={showSizeGuideButton}
        onOpenSizeChart={() => setIsSizeChartOpen(true)}
        qty={cartQty}
        setQty={setCartQty}
        isWishlisted={isWishlisted}
        onToggleWishlist={() => {
          setIsWishlisted((prev) => {
            const next = !prev;
            notify.wishlistToggle(next, product.title);
            return next;
          });
        }}
        onAddToCart={() => {
          addToCart(product, cartQty);
          if (selectedAddons.length > 0) {
            sessionStorage.setItem(
              `choosify_addons_${product.id}`,
              JSON.stringify(selectedAddons),
            );
          }
          notify.cartAdded({
            productId: product.id,
            title: product.title,
            quantity: cartQty,
            addonCount: selectedAddons.length,
          });
        }}
        onCompare={handleAddToCompare}
        onMessageSeller={handleMessageOrder}
        onAskEmi={() => {
          openEmiPanel(`Tell me more about ${product.title} and alternatives`);
        }}
        addonsSlot={
          !isService && hasAddons ? (
            <OptionalAddonsModule
              addons={resolvedAddons}
              selectedIds={selectedAddonIds}
              onToggle={toggleAddon}
              basePrice={product.price}
              addonTotal={addonTotal}
            />
          ) : undefined
        }
      />

      <DcUnderlineTabs
        flush
        tabs={[
          { id: 'product-specs-section', label: sectionLabels.specifications, icon: '⚏' },
          { id: 'influencer-reviews-section', label: 'Creator Reviews', icon: '📖' },
          { id: 'public-reviews-section', label: 'Public Reviews', icon: '🛡' },
          { id: 'product-overview-section', label: sectionLabels.overview, icon: '👁' },
          ...(!isService
            ? [{ id: 'where-to-buy-section', label: 'Where to Buy', icon: '🏷' }]
            : []),
        ]}
        activeId={activeSectionId === 'all' ? 'product-specs-section' : activeSectionId}
        onNavigate={scrollToSection}
      />

      <main id="all-section" className="py-6 md:py-8">
          <div className={`${DETAIL_SINGLE_FEED}`}>
            <StudioWrap sectionId="product-specs">
            <ProductSpecsOverview
              productTitle={product.title}
              title={sectionLabels.specifications}
              subtitle={
                isService
                  ? `Service details for ${product.title}`
                  : undefined
              }
              specs={
                Array.isArray(product.specs) && product.specs.length
                  ? product.specs.map((row: any) => ({
                      label: String(row.label || row.key || ''),
                      value: String(row.value || ''),
                    }))
                  : [
                      { label: 'Brand', value: brandObj?.name || product.brand || 'Sailor' },
                      { label: 'Category', value: product.category || 'Lifestyle' },
                      { label: 'Material', value: 'Premium Grade Build' },
                      { label: 'Origin', value: 'Local Production / Auth' },
                      { label: 'Warranty', value: '1 Year Care Warranty' },
                      { label: 'Model', value: product.title?.substring(0, 16) || 'Classic' },
                      { label: 'Rating', value: `${product.rating || '4.8'} / 5` },
                      { label: 'Status', value: isOutOfStock ? 'Out of Stock' : 'In Stock' },
                    ]
              }
            />
            </StudioWrap>

            <StudioWrap sectionId="product-creator-reviews" className="scroll-mt-36 w-full">
              <CreatorReviewsPreview
                context="product"
                productId={String(product.id)}
                brandName={brandName}
                productTitle={product?.title}
                legacyCreatorContent={product?.creatorContent}
                eyebrow=""
                title="CREATOR REVIEWS"
                subtitle="Video reviews from YouTube, Instagram & Facebook creators"
              />
            </StudioWrap>

            {/* PUBLIC REVIEWS (ID: 'public-reviews-section') */}
            <StudioWrap
              sectionId="product-public-reviews"
              className="scroll-mt-36 bg-white rounded-xl p-6 border border-[#E8EDF2] space-y-5 font-sans text-left w-full"
            >
              <div>
                <h3 className="text-[14px] font-extrabold tracking-tight text-[#1A1A2E]">
                  PUBLIC REVIEWS
                </h3>
                <p className="text-[11px] font-medium text-[#9AA0AC] mt-0.5">
                  Sharing genuine experiences
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ...(Array.isArray(reviews) ? reviews : [])
                    .filter((r: any) => r.productId === product.id)
                    .map((r: any) => ({
                      name: r.authorName,
                      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.authorName)}`,
                      time: 'Just now',
                      rating: String(r.rating),
                      content: r.text,
                      date: 'Just now',
                      helpful: 0,
                      images: [] as string[],
                      verified: true,
                    })),
                  {
                    name: 'Tanvir Hasan',
                    avatar: 'https://i.pravatar.cc/150?u=tanvir',
                    time: '2 weeks ago',
                    rating: '5',
                    content:
                      'The material quality of the new Apex collection is absolutely top-notch. I was skeptical about the price but after wearing it once, I can say it\'s worth every taka. The fit is perfect for large build individuals as well.',
                    date: '2 weeks ago',
                    helpful: 124,
                    verified: true,
                    images: [
                      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop',
                      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&h=150&fit=crop',
                    ],
                  },
                  {
                    name: 'Nusrat Jahan',
                    avatar: 'https://i.pravatar.cc/150?u=nusrat',
                    time: '1 month ago',
                    rating: '4.8',
                    content:
                      'Beautiful designs! I bought three different items and all of them were delivered on time. The online sizing chart was very accurate which was a relief. Highly recommend the fusion wear collection.',
                    date: '1 month ago',
                    helpful: 89,
                    verified: true,
                    images: [
                      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=150&fit=crop',
                    ],
                  },
                ].map((review, i) => (
                  <PublicReviewCard
                    key={i}
                    review={review}
                    onHelpfulClick={() =>
                      toast.success('Thanks for voting this review as helpful!')
                    }
                  />
                ))}
              </div>

              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  onClick={() => toast.success('All customer reviews are fully loaded.')}
                  className="text-[11.5px] font-extrabold text-[#EB4501] bg-transparent border-0 cursor-pointer hover:underline"
                >
                  LOAD MORE REVIEWS
                </button>
              </div>

              {/* Write a Customer Review — after list (Choosify.dc.html) */}
              <div className="pt-5 border-t border-[#F1F1F3]">
                <div className="text-[12px] font-extrabold text-[#1A1A2E] mb-2.5">
                  Write a Customer Review
                </div>
                {!isLoggedIn ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-3 bg-[#F4F7F9] border border-[#E8EDF2] rounded-xl p-6">
                    <span className="text-sm font-bold text-[#1A1A2E]">
                      Sign in to write a review
                    </span>
                    <p className="text-[13px] text-[#9AA0AC] max-w-xs leading-relaxed">
                      Please log in to your Choosify account to provide feedback on this product.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/login', { state: { from: location.pathname } })}
                      className="h-10 px-6 bg-white border border-[#E5E7EB] text-[#EB4501] text-[13px] font-bold rounded-lg hover:border-[#D1D5DB] cursor-pointer"
                    >
                      Sign in
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="flex gap-3 items-start">
                    <div className="w-[38px] h-[38px] rounded-full bg-[#F4F7F9] shrink-0 overflow-hidden" />
                    <div className="flex-1 min-w-0">
                      <div className="border border-[#E5E7EB] rounded-[10px] px-3.5 py-2.5">
                        <textarea
                          rows={1}
                          required
                          placeholder="Share your experience with this product..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full border-0 outline-none resize-none text-[13px] text-[#1A1A2E] bg-transparent min-h-[20px] leading-relaxed p-0"
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2.5">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setSelectedRating(star)}
                              className="bg-transparent border-0 p-0 cursor-pointer text-[#FBBF24] text-base leading-none"
                              aria-label={`Rate ${star}`}
                            >
                              {star <= selectedRating ? '★' : '☆'}
                            </button>
                          ))}
                        </div>
                        <button
                          type="submit"
                          className="bg-[#EB4501] text-white border-0 px-5 py-2 rounded-lg text-[11.5px] font-extrabold cursor-pointer"
                        >
                          SUBMIT REVIEW
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </StudioWrap>

            {/* PRODUCT OVERVIEW (ID: 'product-overview-section') */}
            <StudioWrap
              sectionId="product-overview"
              className="scroll-mt-36 bg-white rounded-xl p-6 border border-[#E8EDF2] space-y-5 text-left font-sans w-full"
            >
              <div>
                <h3 className="text-[14px] font-extrabold text-[#1A1A2E] tracking-tight">
                  {isService ? 'Service' : 'Product'}{' '}
                  <span className="text-[#EB4501]">Overview</span>
                </h3>
                <p className="text-[10px] font-bold text-[#9AA0AC] tracking-wide mt-1 uppercase">
                  Benefits, quality structure & trust
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {[
                  {
                    title: 'Quality & Materials',
                    icon: <Tag size={14} />,
                    items: [
                      'Authentic standard sewing with brand labels',
                      'High dust & spill proof coated exterior',
                      'Unbreakable grade finishing structure',
                      'Breathable premium cloths ideal for long wear',
                    ],
                  },
                  {
                    title: 'Features & Benefits',
                    icon: <Award size={14} />,
                    items: [
                      '7 days satisfaction refund/exchange guarantee',
                      'Secure partner checkout integrations',
                      'Official deck warranty with unique serial code',
                      'Nationwide compliance delivery coverage',
                    ],
                  },
                  {
                    title: 'Audience & Use Cases',
                    icon: <Users size={14} />,
                    items: [
                      'Value-oriented buyers appraising build integrity',
                      'Lifestyle creators requiring reliable wears',
                      'Everyday shoppers seeking reliable value',
                      'Modern Bangladeshi lifestyle and active circles',
                    ],
                  },
                  {
                    title: 'Customer Support & Assurance',
                    icon: <ShieldCheck size={14} />,
                    items: [
                      'Real-time messaging from high priority staff',
                      'Complete verification certificates deposited',
                      'Easy access transit system integrations',
                      'Secured personalized inbound support log',
                    ],
                  },
                ].map((col) => (
                  <div key={col.title} className="bg-[#F4F7F9] rounded-[10px] px-5 py-[18px] flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#1A1A2E]">
                      <span className="text-[#EB4501]">{col.icon}</span>
                      {col.title}
                    </div>
                    <div className="space-y-2 text-[11.5px] text-[#4B5563] leading-relaxed">
                      {col.items.map((item) => (
                        <OverviewListItem key={item} text={item} />
                      ))}
                    </div>
                  </div>
                ))}

                {customOverviews &&
                  customOverviews
                    .filter(
                      (co) =>
                        co.targetType === 'product' &&
                        String(co.targetId) === String(product.id),
                    )
                    .map((co, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F4F7F9] rounded-[10px] px-5 py-[18px] flex flex-col gap-3"
                      >
                        <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#1A1A2E]">
                          <span className="text-[#EB4501]">
                            <Award size={14} />
                          </span>
                          {co.sectionName}
                        </div>
                        <div className="space-y-2 text-[11.5px] text-[#4B5563] leading-relaxed">
                          {(Array.isArray(co.content) ? co.content : []).map((bullet, bIdx) => (
                            <OverviewListItem key={bIdx} text={String(bullet)} />
                          ))}
                        </div>
                      </div>
                    ))}
              </div>

              <div className="pt-1 space-y-2.5">
                <div className="text-[11px] font-extrabold text-[#8A00C4]"># BEST FOR TAGS</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'premium lifestyle',
                    'quality driven',
                    'modern apparel',
                    'exclusive designs',
                    'sustainable wear',
                    'best in segment',
                    'elite deshi collect',
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="choosify-best-for-tag text-[11px] font-bold px-3.5 py-1.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </StudioWrap>

            {/* Box Content + Physical Specs — Choosify.dc.html */}
            <StudioWrap
              sectionId="product-buying-guide"
              className="scroll-mt-36 bg-white rounded-xl border border-[#E8EDF2] p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full"
            >
              <div className="bg-[#F4F7F9] rounded-[10px] p-4 text-left">
                <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-2.5">
                  {sectionLabels.boxContent.toUpperCase()}
                </div>
                {(boxContents?.length
                  ? boxContents
                  : ['Device', 'Charging cable', 'Documentation', 'Warranty card']
                ).map((item, i) => (
                  <OverviewListItem
                    key={i}
                    text={item}
                    className="text-[11.5px] text-[#4B5563] mb-1.5"
                    iconClassName="text-emerald-500"
                  />
                ))}
              </div>
              <div className="bg-[#F4F7F9] rounded-[10px] p-4 text-left">
                <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-2.5">
                  {sectionLabels.physicalSpecs.toUpperCase()}
                </div>
                {(Array.isArray((product as any).propertySpecs) && (product as any).propertySpecs.length
                  ? (product as any).propertySpecs
                  : [
                      `Category: ${product.category || 'General'}`,
                      `Brand: ${brandName}`,
                      `Rating: ${product.rating || '4.8'} / 5`,
                    ]
                ).map((item: string, i: number) => (
                  <OverviewListItem
                    key={i}
                    text={item}
                    className="text-[11.5px] text-[#4B5563] mb-1.5"
                    iconClassName="text-emerald-500"
                  />
                ))}
              </div>
            </StudioWrap>

            {/* Provider card + config-driven related-info sidebar */}
            <div
              id={isService ? 'service-provider-section' : 'where-to-buy-section'}
              className={cn(
                'bg-white rounded-xl border border-[#E8EDF2] p-6 grid grid-cols-1 gap-3.5 w-full',
                showRelatedInfoPanel && 'lg:grid-cols-[1fr_1.8fr]',
              )}
            >
              <div className="rounded-[10px] overflow-hidden border border-[#E8EDF2]">
                <div className="h-[90px] bg-[#14161f] flex items-center justify-center">
                  <div className="text-lg font-extrabold text-white tracking-wide uppercase">
                    {brandName}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-[14px] font-extrabold text-[#1A1A2E] flex items-center justify-center gap-1 mb-0.5">
                    {brandName} <span className="text-[#2323FF]">✓</span>
                  </div>
                  <div className="text-[11px] text-[#9AA0AC] mb-3.5 flex items-center justify-center gap-1">
                    <span className="text-[#2323FF]">✓</span> Verified Brand
                  </div>
                  <div className="flex items-center justify-between px-1 py-3 mb-3.5">
                    <div className="text-left">
                      <div className="text-[12px] font-extrabold text-[#1A1A2E]">Best For</div>
                      <div className="text-[11px] font-bold text-[#8A00C4]">
                        {product.category || 'Everyday'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[14px] font-extrabold text-[#2323FF]">
                        ৳{Math.round((product.price || 25000) / 1000)}K
                      </div>
                      <div className="text-[9px] text-[#4B5563]">Price Range</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[14px] font-extrabold text-[#1A1A2E]">98%</div>
                      <div className="text-[8.5px] text-[#9AA0AC]">Success</div>
                    </div>
                  </div>
                  <FollowButton
                    id={String(brandId)}
                    name={brandName}
                    type="brand"
                    className="w-full mb-2 h-9 rounded-lg text-[11.5px] font-bold"
                  />
                  <Link
                    to={`/brands/${brandId}`}
                    className="block w-full bg-[#000435] hover:bg-[#CF4400] text-white text-center py-[9px] rounded-lg text-[11.5px] font-bold transition-colors"
                  >
                    View Brand
                  </Link>
                </div>
              </div>

              {showRelatedInfoPanel && product ? (
                <ListingRelatedInfoPanel
                  product={product}
                  fallbackPrice={typeof product.price === 'number' ? product.price : undefined}
                />
              ) : null}
            </div>

            {/* Sponsored Advertisement */}
            <div className="choosify-dark-surface text-white rounded-xl p-6 relative overflow-hidden text-left w-full">
              <span className="text-[11px] font-bold text-[#EB4501] tracking-tight block mb-1.5">
                SPONSORED AD
              </span>
              <h4 className="text-sm font-extrabold tracking-tight mb-2 text-white">
                Upgrade To Express Delivery
              </h4>
              <p className="text-[11px] text-white/55 leading-relaxed mb-4">
                Get free 1-hour home deliveries inside Dhaka metro area under Choosify Premium Club.
              </p>
              <button
                type="button"
                onClick={() => toast.success('Choosify Premium Club VIP services requested!')}
                className="bg-[#EB4501] hover:brightness-110 text-white px-4 py-2.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer border-none"
              >
                Learn More
              </button>
            </div>
          </div>
      </main>
      </div>

      {/* Trust Section */}
      <section className="w-full bg-[#F4F9FF] border-t border-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
            <ShieldCheck size={40} className="text-blue-600" />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight leading-none">
              Choosify.bd trust statement
            </h4>
            <p className="text-[14px] font-medium text-[#9AA0AC] tracking-tight">
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
              className="bg-white border border-[#E8EDF2] rounded-2xl p-6 max-w-md w-full relative text-left shadow-2xl"
            >
              <button
                onClick={() => setShowOrderConfig(false)}
                className="absolute top-4 right-4 text-[#9AA0AC] hover:text-[#1A1A2E] cursor-pointer bg-transparent border-none"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1A1A2E] tracking-tight">
                    {isService ? messageCtaLabel : 'Message Seller'}
                  </h3>
                  <p className="text-[10px] text-[#9AA0AC] uppercase tracking-widest font-mono">
                    Step 1: Add request details
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Product Meta */}
                <div className="flex items-center gap-3 bg-[#F4F7F9] rounded-xl p-3 border border-[#E8EDF2]">
                  <img
                    src={product.image || product.thumbnail || PLACEHOLDER_IMAGE}
                    alt={product.title}
                    className="w-12 h-12 rounded-[5px] object-cover shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A2E] leading-tight truncate max-w-[220px]">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-[#EB4501] font-bold mt-0.5 font-mono">
                      BDT {product.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <BookingRequestFields
                  fields={requestFields}
                  values={requestValues}
                  onChange={(key, value) =>
                    setRequestValues((previous) => ({ ...previous, [key]: value }))
                  }
                />

                {false && (
                <>
                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="block text-[12px] font-semibold tracking-tight text-white/50 mb-1.5">
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
                              ? "bg-[#EB4501] text-white italic shadow-md shadow-orange-500/10 border-none"
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
                    <label className="block text-[12px] font-semibold tracking-tight text-white/50 mb-1.5">
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
                              ? "bg-[#EB4501] text-white italic shadow-md shadow-orange-500/10 border-none"
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
                  <label className="block text-[12px] font-semibold tracking-tight text-white/50 mb-1.5">
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
                  <label className="block text-[12px] font-semibold tracking-tight text-white/50 mb-1.5">
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
                </>
                )}

                {/* Action CTA row */}
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => setShowOrderConfig(false)}
                    className="flex-1 py-3 text-center border border-[#E5E7EB] rounded-lg hover:bg-[#F4F7F9] transition-all text-[13px] font-bold tracking-tight text-[#1A1A2E] cursor-pointer bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const missing = requestFields.find(
                        (field) =>
                          field.required &&
                          (requestValues[field.key] === '' ||
                            requestValues[field.key] === undefined),
                      );
                      if (missing) {
                        toast.error(`${missing.label} is required.`);
                        return;
                      }
                      setShowOrderConfig(false);
                      setShowOrderConfirm(true);
                    }}
                    className="flex-1 py-3 bg-[#EB4501] text-white rounded-lg hover:brightness-110 transition-all text-[13px] font-bold tracking-tight shadow-sm cursor-pointer border-none"
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
              className="bg-white border border-[#E8EDF2] rounded-2xl p-6 max-w-md w-full relative text-left shadow-2xl"
            >
              <button
                onClick={() => setShowOrderConfirm(false)}
                className="absolute top-4 right-4 text-[#9AA0AC] hover:text-[#1A1A2E] cursor-pointer bg-transparent border-none"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1A1A2E] tracking-tight">
                    Confirm {isService ? 'Booking Request' : 'Product Request'}
                  </h3>
                  <p className="text-[10px] text-[#9AA0AC] uppercase tracking-widest font-mono">
                    Step 2: Send structured brief
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Structured Overview Block */}
                <div className="bg-[#F4F7F9] border border-[#E8EDF2] rounded-xl p-4 text-left">
                  <span className="text-[11px] font-bold text-[#EB4501] tracking-tight block mb-2">
                    CONFIRM LIVE MESSAGE SUMMARY
                  </span>
                  
                  <div className="space-y-1.5 text-xs text-[#1A1A2E] font-mono">
                    <p><span className="text-[#9AA0AC] font-sans font-bold">Listing:</span> {product.title}</p>
                    <p><span className="text-[#9AA0AC] font-sans font-bold">Seller:</span> {brandName}</p>
                    {Object.entries(requestValues).map(([key, value]) => (
                      <p key={key}>
                        <span className="text-[#9AA0AC] font-sans font-bold capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>{' '}
                        {String(value || '—')}
                      </p>
                    ))}
                    <p><span className="text-[#9AA0AC] font-sans font-bold">Estimate:</span> BDT {Number(product.price || 0).toLocaleString()}</p>
                  </div>
                </div>

                {/* Help tip */}
                <div className="flex gap-2 items-start bg-blue-500/5 text-blue-400 p-3 rounded-xl border border-blue-500/10 text-[10px] leading-relaxed">
                  <Info size={12} className="shrink-0 mt-0.5" />
                  <p>
                    This sends a request into your existing seller conversation. The seller may accept,
                    decline with a reason, or send a modified offer. No cart is created.
                  </p>
                </div>

                {/* CTA actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowOrderConfirm(false);
                      setShowOrderConfig(true);
                    }}
                    className="flex-1 py-3 text-center border border-[#E5E7EB] rounded-lg hover:bg-[#F4F7F9] transition-all text-[13px] font-bold tracking-tight text-[#1A1A2E] cursor-pointer bg-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmAndSend}
                    className="flex-1 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-[13px] font-bold tracking-tight shadow-sm cursor-pointer border-none"
                  >
                    Send Request
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
