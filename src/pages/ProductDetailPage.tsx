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
  MessageCircleMore,
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
  X,
  Tag,
  Check,
  ImagePlus,
} from "lucide-react";
import { PRODUCTS, BRANDS, PLACEHOLDER_IMAGE } from "../constants";
import { useGlobalState } from "../context/GlobalStateContext";
import { operationsApi } from "../services/operationsApi";
import { catalogApi } from "../services/catalogApi";
import { uploadReviewPhotos } from "../services/mediaUpload";
import { ProductQuickComparison } from "../components/QuickComparisonSection";
import { useDashboard } from "../context/DashboardContext";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { mergeRelatedStores } from "../lib/relatedInfoMerge";
import { notify, toast } from "../lib/notify";
import { ProductMediaGallery } from "../components/ProductMediaGallery";
import { ProductDetailBuyBox } from "../components/product/ProductDetailBuyBox";
import { ListingRelatedInfoPanel } from "../components/product/detail/ListingRelatedInfoPanel";
import { resolveListingRelatedInfoSection } from "../utils/listingRelatedInfo";
import { OptionalAddonsModule } from '../components/product/OptionalAddonsModule';
import { PrescriptionUploadModule } from '../components/product/PrescriptionUploadModule';
import { PrescriptionDetailsModal, type PrescriptionData } from '../components/product/PrescriptionDetailsModal';
import { formatReviewDate } from '../utils/formatReviewDate';
import { CreatorReviewsPreview } from "../components/creatorReviews/CreatorReviewsPreview";
import { PublicReviewCard, resolvePublicReviewAvatarUrl } from "../components/PublicReviewCard";
import { ReportModal } from "../components/ReportModal";
import NotFoundPage from "./NotFoundPage";
import { useRegisterPageFilters } from "../components/FilterEngine";
import { getBrandOfficialWebsite, normalizeExternalUrl } from "../utils/overviewRegistry";
import { SizeGuideModal } from "../components/SizeGuideModal";
import { BrandCardDesign, mapBrandToCardDesign } from "../components/BrandCardDesign";
import { DETAIL_SINGLE_FEED } from "../lib/pageLayout";
import { DC_CONTENT_MAX } from "../lib/design/dcListingTokens";
import { ProductSpecsOverview } from "../components/ProductSpecsOverview";
import { OverviewListItem } from "../components/OverviewListIcon";
import { DcUnderlineTabs } from "../components/design/DcUnderlineTabs";
import { CardEngagementStrip } from "../components/CardEngagementStrip";
import { SponsoredCardChrome } from "../components/commerce/SponsoredCardChrome";
import { useSectionScrollSpy } from "../hooks/useSectionScrollSpy";
import { usePageBreadcrumbs } from "../context/BreadcrumbContext";
import { slugifyPathSegment } from "../lib/seoHelpers";
import {
  compareCategoryBrowseHref,
  getCompareLockedCategory,
  isSameCompareCategory,
} from "../utils/compareCategory";
import { StudioWrap } from "../components/studio/StudioWrap";
import { useStudioEdit } from "../context/StudioEditContext";
import { useHasRole } from "../components/auth/RequireRole";
import { CreateSpotlightCampaignButton } from "../components/spotlight/cms/CreateSpotlightCampaignButton";
import { productGuideCtaLabel, type CatalogProductSizeGuide } from "../types/catalog";
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
  /** Seller-configured cap on how many units of this addon a buyer may select (default 1). */
  maxQuantity?: number;
  /** Selecting this addon requires the buyer to submit lens power / a prescription document */
  prescriptionLens?: boolean;
}

/**
 * Real seller-configured add-ons only (Product Studio's `addonItems` /
 * `enableAddonItems`, surfaced here as `studioAddonItems`) — no
 * category-keyed or platform-wide seed/fallback tables. A product whose
 * seller hasn't configured any add-ons simply has none; the caller
 * (`hasAddons`) hides the whole Add-on Items section in that case rather
 * than filling it with generic catalog-wide filler.
 */
function resolveAddons(product: any): ProductAddon[] {
  if (!product) return [];
  if (
    product.enableAddonItems === false ||
    !Array.isArray(product.studioAddonItems) ||
    !product.studioAddonItems.length
  ) {
    return [];
  }

  return [...product.studioAddonItems]
    .filter((item: any) => item && item.title)
    .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      price: typeof item.price === 'number' ? item.price : Number(item.price) || 0,
      badge: item.badge || undefined,
      maxQuantity:
        typeof item.maxQuantity === 'number' && item.maxQuantity >= 1
          ? Math.floor(item.maxQuantity)
          : 1,
      // A seller-disabled add-on is shown struck-through but not selectable.
      available: item.enabled !== false,
    }));
}

export function ProductDetailPage() {
  const productHeroRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  const [reviewReport, setReviewReport] = React.useState<{ id: string; label: string } | null>(null);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { allProducts, allBrands, productDetailsById, addToCart: globalAddToCart, isLoggedIn, currentUser, orders } = useGlobalState();
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

  // The global context only pre-hydrates details for the first handful of
  // products. Always fetch THIS product's canonical detail (variants / add-ons /
  // option groups) on demand so the detail page is complete for every listing.
  const baseCatalogId = String(baseProduct?.catalogId || '');
  const [lazyDetail, setLazyDetail] = React.useState<any>(null);
  React.useEffect(() => {
    setLazyDetail(null);
    if (!baseCatalogId || productDetailsById[baseCatalogId]) return;
    let cancelled = false;
    catalogApi
      .getProductDetail(baseCatalogId)
      .then((d) => { if (!cancelled && d) setLazyDetail(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [baseCatalogId, productDetailsById]);

  const product = React.useMemo(() => {
    if (!baseProduct) return null;
    const catalogKey = String(baseProduct?.catalogId || '');
    const detail = productDetailsById[catalogKey] || lazyDetail;
    if (!detail) return baseProduct;
    return {
      ...baseProduct,
      about: detail.about || baseProduct?.description,
      specs: detail.specs?.length ? detail.specs : baseProduct?.specs,
      pros: detail.pros,
      cons: detail.cons,
      bestForTags: detail.bestForTags,
      storeComparisonList: mergeRelatedStores(
        detail.storeComparisonList,
        (detail as any).adminPromotedStores,
      ),
      relatedInfoType: (detail as any).relatedInfoType ?? (baseProduct as any)?.relatedInfoType,
      customRelatedInfo: (detail as any).customRelatedInfo ?? (baseProduct as any)?.customRelatedInfo,
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
      complimentaryFeatures: (baseProduct as any)?.complimentaryFeatures,
      // Studio section on/off toggles — undefined means "not published from this
      // studio yet", treated as enabled everywhere below to match ProductStudio's
      // own existing-product default.
      enableSpecs: detail.enableSpecs,
      enableStoreComparison: detail.enableStoreComparison,
      enableInfluencerReviews: detail.enableInfluencerReviews,
      enableOverviewSection: detail.enableOverviewSection,
      enableBestForTags: detail.enableBestForTags,
      enablePhysicalStores: detail.enablePhysicalStores,
      enableBoxContents: detail.enableBoxContents,
      enableOptions: detail.enableOptions,
      enableActiveVariantSpecs: detail.enableActiveVariantSpecs,
      enableAdditionalSpecs: detail.enableAdditionalSpecs,
      enablePublicReviews: detail.enablePublicReviews,
      enableAddonItems: detail.enableAddonItems,
      enableDeliveryInfo: (detail as any).enableDeliveryInfo,
      enableWarrantyInfo: (detail as any).enableWarrantyInfo,
      enableThingsToKnow: (detail as any).enableThingsToKnow,
      studioBoxContents: detail.boxContents,
      additionalSpecs: detail.additionalSpecs,
      curatedPublicReviews: detail.publicReviews,
      studioAddonItems: detail.addonItems,
      thingsToKnowItems: (detail as any).thingsToKnowItems,
      deliveryInfo: (detail as any).deliveryInfo,
      afterSalesInfo: (detail as any).afterSalesInfo,
      warrantyMonths: (baseProduct as any)?.warrantyMonths,
      warrantyType: (baseProduct as any)?.warrantyType,
      warrantyProvider: (baseProduct as any)?.warrantyProvider,
      warrantyTerms: (baseProduct as any)?.warrantyTerms,
      propertySpecs: (baseProduct as any)?.propertySpecs,
      images: (baseProduct as any)?.images,
      location: (baseProduct as any)?.location,
      duration: (baseProduct as any)?.duration,
      specialty: (baseProduct as any)?.specialty,
      brand: baseProduct.brand || baseProduct.brandName,
      brandName: baseProduct.brandName || baseProduct.brand,
    };
  }, [baseProduct, productDetailsById, lazyDetail]);

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
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  // Depend on `product` itself (it is memoized upstream) so add-ons re-resolve
  // once the canonical detail (studioAddonItems) arrives via the lazy fetch.
  const resolvedAddons = useMemo(() => resolveAddons(product), [product]);
  const hasAddons = resolvedAddons.length > 0;

  const getAddonQty = React.useCallback(
    (addonId: string) => addonQuantities[addonId] ?? 1,
    [addonQuantities],
  );

  const setAddonQty = (addonId: string, qty: number) => {
    const addon = resolvedAddons.find((a) => a.id === addonId);
    const max = addon?.maxQuantity && addon.maxQuantity >= 1 ? addon.maxQuantity : 1;
    setAddonQuantities((prev) => ({ ...prev, [addonId]: Math.min(max, Math.max(1, qty)) }));
  };

  // ── Prescription upload (Eyewear — required once a prescription lens addon is selected) ──
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const needsPrescription = useMemo(
    () => resolvedAddons.some((a) => a.prescriptionLens && selectedAddonIds.has(a.id)),
    [resolvedAddons, selectedAddonIds],
  );

  React.useEffect(() => {
    if (!needsPrescription) setPrescriptionData(null);
  }, [needsPrescription]);

  const jumpToProductSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 200;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  const productSectionNavItems = [
    { id: "product-specs-section", label: "Specs", icon: <Package size={13} /> },
    { id: "influencer-reviews-section", label: "Creator Reviews", icon: <Users size={13} /> },
    { id: "public-reviews-section", label: "Public Reviews", icon: <MessageCircleMore size={13} className="text-[#FF5B00]" /> },
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
      .reduce((sum, a) => sum + a.price * getAddonQty(a.id), 0);
  }, [selectedAddonIds, resolvedAddons, getAddonQty]);

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
    setAddonQuantities((prev) => {
      if (!(addonId in prev)) return prev;
      const next = { ...prev };
      delete next[addonId];
      return next;
    });
  };

  React.useEffect(() => {
    setSelectedAddonIds(new Set());
    setAddonQuantities({});
  }, [product?.id]);

  const addToCart = (prod: any, qty: number, variant?: any) => {
    const addonsToApply = resolveAddons(prod);
    const selected = addonsToApply.filter(addon => selectedAddonIds.has(addon.id) && addon.available);
    const prescriptionSuffix = prescriptionData ? ' [Prescription attached]' : '';
    if (selected.length > 0) {
      const addOnPrice = selected.reduce((sum, item) => sum + item.price * getAddonQty(item.id), 0);
      const addOnNames = selected.map(item => `${item.title}${getAddonQty(item.id) > 1 ? ` x${getAddonQty(item.id)}` : ''}`).join(", ");
      const customizedProduct = {
        ...prod,
        price: prod.price + addOnPrice,
        title: `${prod.title} (${addOnNames})${prescriptionSuffix}`,
        prescription: prescriptionData ?? undefined,
      };
      globalAddToCart(customizedProduct, qty, variant);
    } else if (prescriptionData) {
      globalAddToCart({ ...prod, title: `${prod.title}${prescriptionSuffix}`, prescription: prescriptionData }, qty, variant);
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
    addToCompare,
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
              images: row.photos || [],
              authorName: row.userName,
              authorAvatar: row.userAvatar,
              avatar: row.userAvatar,
              userId: row.userId,
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
  const [selectedReviewOrderId, setSelectedReviewOrderId] = useState("");
  const [reviewPhotoFiles, setReviewPhotoFiles] = useState<File[]>([]);
  const [reviewPhotoPreviews, setReviewPhotoPreviews] = useState<string[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const reviewPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleReviewPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    e.target.value = '';
    if (!picked.length) return;
    setReviewPhotoFiles((prev) => [...prev, ...picked].slice(0, 6));
    setReviewPhotoPreviews((prev) => [...prev, ...picked.map((f) => URL.createObjectURL(f))].slice(0, 6));
  };

  const removeReviewPhoto = (index: number) => {
    setReviewPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setReviewPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Reviews may only be posted against a delivered order that contains this product —
  // this is what lets sellers see the purchase date / order type on the posted review.
  const reviewedOrderIds = useMemo(
    () =>
      new Set(
        (Array.isArray(reviews) ? reviews : [])
          .filter((r: any) => r.productId === product?.id && r.orderId)
          .map((r: any) => r.orderId),
      ),
    [reviews, product?.id],
  );

  const reviewableOrders = useMemo(() => {
    if (!product) return [];
    return orders
      .filter(
        (o) =>
          o.status !== 'cancelled' &&
          o.subOrders.some(
            (sub) =>
              sub.trackingStatus === 'delivered' &&
              sub.items.some((item) => item.productId === product.id),
          ),
      )
      .filter((o) => !reviewedOrderIds.has(o.orderId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, product, reviewedOrderIds]);

  const selectedReviewOrder = reviewableOrders.find((o) => o.orderId === selectedReviewOrderId);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewOrder) {
      toast.error('Choose the order you purchased this product with before posting your review.');
      return;
    }
    const reviewedItemId = selectedReviewOrder.subOrders
      .flatMap((sub) => sub.items)
      .find((item) => item.productId === product.id)?.itemId;
    if (!reviewedItemId) {
      toast.error('This order predates itemized reviews and cannot be reviewed here. Contact support.');
      return;
    }
    setIsSubmittingReview(true);
    let uploadedPhotoUrls: string[] = [];
    try {
      if (reviewPhotoFiles.length) {
        uploadedPhotoUrls = await uploadReviewPhotos(reviewPhotoFiles);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload review photos.');
      setIsSubmittingReview(false);
      return;
    }
    const orderType = selectedReviewOrder.isCOD ? 'COD' : 'Online Payment';
    const purchaseDate = selectedReviewOrder.createdAt;
    const postedAt = new Date().toISOString();
    const newReview = {
      id: Date.now().toString(),
      productId: product.id,
      productTitle: product.title,
      product: product.title,
      rating: selectedRating,
      text: reviewText,
      comment: reviewText,
      photos: uploadedPhotoUrls,
      authorName: currentUser.name,
      authorAvatar: currentUser?.avatar,
      avatar: currentUser?.avatar,
      userId: String(currentUser?.id || ''),
      createdAt: postedAt,
      date: new Date(postedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      orderId: selectedReviewOrder.orderId,
      orderType,
      purchaseDate,
    };
    try {
      const result = await operationsApi.submitReview({
        userId: String(currentUser?.id || 'guest'),
        userName: currentUser?.name || 'Guest',
        userAvatar: currentUser?.avatar || undefined,
        orderId: selectedReviewOrder.orderId,
        orderItemId: reviewedItemId,
        productId: String(product.id),
        productTitle: product.title,
        brandName: brandName,
        storeName: brandName,
        rating: selectedRating,
        comment: reviewText.trim(),
        photos: uploadedPhotoUrls,
      });
      setReviews((prev: any[]) => [newReview, ...prev]);
      setSelectedRating(5);
      setReviewText("");
      setSelectedReviewOrderId("");
      setReviewPhotoFiles([]);
      setReviewPhotoPreviews([]);
      toast.success(
        result.reused
          ? 'You already reviewed this order.'
          : 'Review submitted! It will appear after approval.',
      );
      if (typeof addNotification === 'function') {
        addNotification('Your review was submitted successfully.', 'system');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCompare = () => {
    if (!product) return;
    addToCompare(product);
  };

  const compareLockedCategory = getCompareLockedCategory(comparedProducts);
  const isCompareCategoryBlocked =
    Boolean(product) &&
    Boolean(compareLockedCategory) &&
    !comparedProducts.some((p: any) => String(p.id) === String(product.id)) &&
    !isSameCompareCategory(product, compareLockedCategory);
  const compareHint = isCompareCategoryBlocked
    ? `Irrelevant category for the current comparison (locked to ${compareLockedCategory!.label}). Browse matching products on /products?category=${encodeURIComponent(compareLockedCategory!.label)}.`
    : undefined;
  // Brand resolution — prefer the REAL backend catalog id (a stable string,
  // e.g. a UUID/cuid) over the numeric `id`/`brandId` fields. Those numeric
  // ids are a client-side compatibility shim (GlobalStateContext's
  // `toNumericId`) that silently falls back to the item's ARRAY INDEX when
  // a real id has no digits — brands and products are independently
  // ordered arrays, so two unrelated items can end up with the same
  // synthetic numeric id purely by index coincidence (this was the root
  // cause of a product showing an unrelated brand, e.g. "Samsung Galaxy
  // S24 Ultra" resolving to "Walton"). Only fall back to the numeric id
  // (for legacy/mock data that never had a catalogId) or a name match when
  // there's genuinely no real id to match on.
  const brandObj = product
    ? (product.catalogBrandId
        ? brandList.find((b: any) => b.catalogId === product.catalogBrandId)
        : undefined) ||
      brandList.find((b: any) => b.id === product.brandId && !product.catalogBrandId) ||
      brandList.find((b: any) => b.name?.toLowerCase() === product.brand?.toLowerCase())
    : undefined;
  // No fabricated brand name/id when resolution genuinely fails — the
  // product's own real `brand`/`brandName` field (never "Apex"/"Sailor")
  // is the primary fallback; `brandId` stays undefined rather than a
  // meaningless synthetic `1`. "Unknown Brand" is a last-resort label (not
  // a specific fake brand identity) for the rare case a product genuinely
  // has no brand data at all, so UI strings never render literal "undefined".
  const brandId = brandObj ? brandObj.id : undefined;
  const brandName = brandObj ? brandObj.name : (product?.brand || product?.brandName || 'Unknown Brand');
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

  // Real product review stats — combines actual buyer-posted reviews
  // (`reviews`, filtered to this product) with Studio-curated public
  // reviews (also real, seller-entered), never a fabricated default.
  // count === 0 means honestly "no ratings yet", not a fake "4.8".
  const productReviewStats = useMemo(() => {
    const real = (Array.isArray(reviews) ? reviews : []).filter(
      (r: any) => r.productId === product?.id,
    );
    const curated =
      product?.enablePublicReviews !== false && Array.isArray((product as any)?.curatedPublicReviews)
        ? (product as any).curatedPublicReviews
        : [];
    const ratings = [
      ...real.map((r: any) => Number(r.rating)),
      ...curated.map((r: any) => Number(r.rating)),
    ].filter((n) => Number.isFinite(n) && n > 0);
    const count = ratings.length;
    const avg = count > 0 ? ratings.reduce((sum, n) => sum + n, 0) / count : 0;
    return { count, avg };
  }, [reviews, product]);

  // Generic, category-schema-driven variant selection: { dimensionName: value }.
  // No Color/Size/RAM/Storage special-casing — dimensions come from the
  // canonical optionGroups / productVariants.
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  // Tracks whether the BUYER has actively picked an option (vs. the page's own
  // auto-selected default) -- the gallery only narrows to one variant's photos
  // once the buyer's own selection resolves to it, never on initial load.
  const [hasUserSelectedVariant, setHasUserSelectedVariant] = useState(false);
  const pickOpt = (re: RegExp) => {
    const k = Object.keys(selectedOptions).find((n) => re.test(n));
    return k ? selectedOptions[k] : "";
  };
  const selectOption = (groupName: string, value: string) => {
    setHasUserSelectedVariant(true);
    setSelectedOptions((prev) => {
      const next = { ...prev, [groupName]: value };
      const vs = (product as any)?.variants;
      if (!Array.isArray(vs) || !vs.length) return next;
      const dimOrder = variantOptionGroups.map((g) => g.name);
      const changedIdx = dimOrder.indexOf(groupName);
      if (changedIdx < 0) return next;
      // Clear any LATER dimension (in the seller's own option order) whose
      // current selection is no longer reachable given everything up to and
      // including this change. Without this, an irregular/sparse variant
      // tree can deadlock: e.g. Size=EU41 only ever pairs with Origin=
      // Vietnam, but if Origin is still stuck on a stale "UK" from a
      // previous pick, EU41 would render as unavailable (it fails the "match
      // every already-selected dimension" check) and the buyer could never
      // click it in the first place. Earlier dimensions constrain later
      // ones, not the reverse -- so only look ahead here, never behind.
      for (let i = changedIdx + 1; i < dimOrder.length; i++) {
        const laterDim = dimOrder[i];
        const laterVal = next[laterDim];
        if (laterVal == null) continue;
        const stillReachable = vs.some((v: any) => {
          const attrs = v.attributes ?? v.options ?? {};
          for (let k = 0; k <= i; k++) {
            const dn = dimOrder[k];
            const sel = next[dn];
            if (sel != null && (!(dn in attrs) || attrs[dn] !== sel)) return false;
          }
          return true;
        });
        if (!stillReachable) delete next[laterDim];
      }
      return next;
    });
  };
  // Read-only compatibility shims for the (many) downstream references that
  // still speak in colour/size terms (message-to-order flow, request fields …).
  const selectedColor = pickOpt(/colou?r/i);
  const selectedSize = pickOpt(/^size$/i);
  const selectedRam = pickOpt(/\bram\b|memory/i);
  const selectedStorage = pickOpt(/storage|capacity/i);
  // Legacy setter shims — resolve the real dimension name then delegate.
  const setByAlias = (re: RegExp, fallbackKey: string) => (v: string) => {
    const g = (variantOptionGroups.find((x) => re.test(x.name))?.name) || fallbackKey;
    selectOption(g, v);
  };
  const setSelectedColor = setByAlias(/colou?r/i, 'Color');
  const setSelectedSize = setByAlias(/^size$/i, 'Size');
  const setSelectedRam = setByAlias(/\bram\b|memory/i, 'RAM');
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
  const [isSendingBookingRequest, setIsSendingBookingRequest] = useState(false);

  // Variant-active helper (canonical: explicit `status` wins over legacy `enabled`).
  const variantActive = (v: any) =>
    v?.status ? v.status === 'active' : v?.enabled !== false;

  // The variant dimensions to render — the canonical optionGroups when present,
  // otherwise derived from the variant rows themselves (legacy products).
  const variantOptionGroups: Array<{ id: string; name: string; displayType?: string; values: string[] }> =
    React.useMemo(() => {
      const groups = (product as any)?.optionGroups;
      if (Array.isArray(groups) && groups.length) {
        return groups
          .filter((g: any) => g?.name && Array.isArray(g.values) && g.values.length)
          .map((g: any) => ({ id: g.id || g.name, name: g.name, displayType: g.displayType, values: g.values }));
      }
      const vs = (product as any)?.variants;
      if (!Array.isArray(vs) || !vs.length) return [];
      const acc = new Map<string, Set<string>>();
      for (const v of vs) {
        for (const [k, val] of Object.entries(v.attributes ?? v.options ?? {})) {
          if (!acc.has(k)) acc.set(k, new Set());
          acc.get(k)!.add(String(val));
        }
      }
      return [...acc.entries()].map(([name, set]) => ({ id: name, name, values: [...set] }));
    }, [product]);

  // Auto-select the first purchasable combination. Re-runs when the product
  // changes AND when its variant rows first arrive (lazy detail fetch).
  const variantSignature = React.useMemo(() => {
    const vs = (product as any)?.variants;
    return Array.isArray(vs) ? vs.map((v: any) => v.id || v.sku).join('|') : '';
  }, [product]);
  React.useEffect(() => {
    setHasUserSelectedVariant(false);
    const vs = (product as any)?.variants;
    if (!Array.isArray(vs) || vs.length === 0) {
      setSelectedOptions({});
      return;
    }
    // Prefer a variant that actually specifies every current dimension over a
    // legacy/partial row (e.g. saved before a new option was added) -- picking
    // a partial row here would auto-select an incomplete combination that can
    // never resolve back to itself once every dimension must match exactly.
    const keys = variantOptionGroups.map((g) => g.name);
    const isComplete = (v: any) => {
      const attrs = v.attributes ?? v.options ?? {};
      return keys.every((k) => k in attrs);
    };
    const first =
      vs.find((v: any) => isComplete(v) && (v.stock ?? 0) > 0 && variantActive(v)) ||
      vs.find((v: any) => isComplete(v)) ||
      vs[0];
    setSelectedOptions({ ...(first?.attributes ?? first?.options ?? {}) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, variantSignature]);

  const getSelectedVariant = () => {
    const vs = (product as any)?.variants;
    if (!Array.isArray(vs) || vs.length === 0) return null;
    const keys = variantOptionGroups.map((g) => g.name);
    return vs.find((v: any) => {
      const attrs = v.attributes ?? v.options ?? {};
      // Every rendered dimension must be explicitly present on the variant
      // AND match the current selection. A variant missing a dimension
      // (e.g. a legacy row saved before that option existed) does NOT
      // wildcard-match every value for it -- otherwise a single incomplete
      // variant could silently resolve as "the" match for any selection of
      // that dimension, surfacing the wrong price/stock/SKU/images.
      return keys.every((k) => k in attrs && attrs[k] === selectedOptions[k]);
    });
  };

  /**
   * A value is offerable if some active, in-stock combination has it, given
   * the selections already made on EARLIER dimensions only (the seller's own
   * option order — variantOptionGroups). Deliberately one-directional: a
   * later dimension's pick narrows nothing for an earlier one, only the
   * reverse. Selecting an earlier dimension can never be blocked by a later
   * dimension's stale selection this way — selectOption() above clears that
   * stale later selection instead, so an irregular/sparse tree (some values
   * paired with only one other combination) can never deadlock a value that
   * genuinely exists into permanent unavailability.
   */
  const isValueAvailable = (groupName: string, value: string) => {
    const vs = (product as any)?.variants;
    if (!Array.isArray(vs) || vs.length === 0) return true;
    const dimOrder = variantOptionGroups.map((g) => g.name);
    const idx = dimOrder.indexOf(groupName);
    return vs.some((v: any) => {
      const attrs = v.attributes ?? v.options ?? {};
      if (attrs[groupName] !== value) return false;
      for (let k = 0; k < idx; k++) {
        const dn = dimOrder[k];
        const sel = selectedOptions[dn];
        if (sel == null) continue;
        // A variant missing one of the EARLIER already-selected dimensions
        // doesn't actually specify a value for it, so it can never satisfy
        // that selection -- absence is a non-match, not a wildcard.
        if (!(dn in attrs) || attrs[dn] !== sel) return false;
      }
      return (v.stock ?? 0) > 0 && variantActive(v);
    });
  };

  const getBoxContents = () => {
    if (!product) return [];

    const studioItems = (product as any).studioBoxContents;
    if (
      (product as any).enableBoxContents !== false &&
      Array.isArray(studioItems) &&
      studioItems.length
    ) {
      return studioItems
        .filter((item: any) => item.enabled !== false)
        .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((item: any) => item.title);
    }

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

  // Deduplicated initial/full listing gallery: the listing's own photos first,
  // then every ACTIVE variant's photos, de-duplicated by URL. Shown until the
  // buyer's own selection resolves to one specific variant.
  const allListingImages = React.useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    const push = (url: unknown) => {
      if (typeof url !== 'string' || !url || seen.has(url)) return;
      seen.add(url);
      ordered.push(url);
    };
    const primary: string[] = Array.isArray((product as any)?.gallery) && (product as any).gallery.length
      ? (product as any).gallery
      : product?.image
        ? [product.image]
        : [];
    primary.forEach(push);
    const vs = (product as any)?.variants;
    if (Array.isArray(vs)) {
      for (const v of vs) {
        if (!variantActive(v)) continue;
        const imgs: string[] = Array.isArray(v.images) && v.images.length ? v.images : v.image ? [v.image] : [];
        imgs.forEach(push);
      }
    }
    return ordered;
  }, [product]);

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

  // Availability lookup helpers for disabled states — a variant the seller has
  // disabled in Product Studio is treated the same as an out-of-stock one.
  const isSizeOptionAvailable = (size: string) => {
    if (!product?.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes?.size === size &&
        (!selectedColor || v.attributes?.color === selectedColor) &&
        v.stock > 0 &&
        v.enabled !== false,
    );
  };

  const isColorOptionAvailable = (color: string) => {
    if (!product?.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes?.color === color &&
        (!selectedSize || v.attributes?.size === selectedSize) &&
        v.stock > 0 &&
        v.enabled !== false,
    );
  };

  const isRamOptionAvailable = (ram: string) => {
    if (!product?.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes?.ram === ram &&
        (!selectedStorage || v.attributes?.storage === selectedStorage) &&
        v.stock > 0 &&
        v.enabled !== false,
    );
  };

  const isStorageOptionAvailable = (storage: string) => {
    if (!product?.variants) return true;
    return product.variants.some(
      (v: any) =>
        v.attributes?.storage === storage &&
        (!selectedRam || v.attributes?.ram === selectedRam) &&
        v.stock > 0 &&
        v.enabled !== false,
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

  // Stock calculations — a seller-disabled variant (legacy `enabled:false` OR
  // canonical `status:'inactive'`) is unpurchasable regardless of stock count.
  // No resolved combination (e.g. a deleted combo) is also unpurchasable.
  const isOutOfStock =
    product?.variants && product.variants.length > 0
      ? selectedVariant
        ? selectedVariant.stock === 0 || !variantActive(selectedVariant)
        : true
      : product?.id === 3 ||
        Boolean(product?.title?.includes("MacBook")) ||
        product?.stock === 0;

  const stockQuantity =
    product?.variants && product.variants.length > 0
      ? selectedVariant
        ? !variantActive(selectedVariant)
          ? 0
          : selectedVariant.stock
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
      else if (field.key === 'destination' || field.key === 'eventLocation' || field.key === 'address')
        initialValues[field.key] = product?.location || '';
      else initialValues[field.key] = '';
    });
    setRequestValues(initialValues);
    setShowOrderConfig(true);
  };

  const handleConfirmAndSend = async () => {
    if (isSendingBookingRequest) return;
    const threadId = `thread-brand-${brandId}`;
    const notesValue = String(requestValues.notes || orderNotes || '');
    const cleanFields = Object.fromEntries(
      Object.entries(requestValues).filter(([key, value]) => key !== 'notes' && value !== ''),
    );
    const quantity = Number(cleanFields.quantity || orderQty || 1);
    const estimatedPrice = Number(product.price || 0) * quantity + addonTotal;
    const structuredMsg = isService
      ? `Booking request sent for ${product.title}. The seller has 24 hours to respond.`
      : `Product request sent for ${product.title}. The seller has 24 hours to respond.`;
    const sellerId = String(product.sellerId || brandId);
    const listingId = String(product.id);

    setIsSendingBookingRequest(true);
    try {
      // Don't create a second active request for the same listing (e.g. a
      // repeat click, or reopening "Message to Book" while one is still
      // pending/countered/accepted) -- reuse the existing one instead.
      const existing = await operationsApi
        .listBookingRequestsForBuyer(String(currentUser.id))
        .catch(() => [] as BookingOfferCard[]);
      const activeDuplicate = existing.find(
        (r) =>
          r.listingId === listingId &&
          ['pending', 'countered', 'accepted', 'buyer_accepted'].includes(r.status),
      );
      if (activeDuplicate) {
        notify.info(`You already have an active request for ${product.title} — opening it.`);
        setShowOrderConfirm(false);
        navigate(`/messages/${threadId}`);
        return;
      }

      // Server creates the canonical booking_requests row and returns it with
      // a real requestId (no requestId is sent here on purpose -- see
      // operationsApi.submitPlatformMessage).
      const result = await operationsApi.submitPlatformMessage({
        buyerId: String(currentUser.id),
        userName: currentUser.name || 'Buyer',
        body: structuredMsg,
        sellerId,
        bookingOffer: {
          kind: 'booking_offer',
          listingId,
          listingTitle: product.title,
          listingImage: product.image || PLACEHOLDER_IMAGE,
          listingHref: `/products/${product.id}`,
          sellerId,
          sellerName: brandName,
          buyerId: String(currentUser.id),
          serviceCategory: isService ? serviceCategory : undefined,
          isService,
          fields: cleanFields,
          notes: notesValue,
          price: estimatedPrice,
        },
      });

      const bookingOffer = result.message?.bookingOffer;
      const requestId = bookingOffer?.requestId;
      if (!bookingOffer || !requestId) {
        throw new Error('Booking request was not created');
      }

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
      window.dispatchEvent(
        new CustomEvent('choosify-booking-request-created', {
          detail: {
            requestId,
            sellerId,
            sellerName: brandName,
            listingTitle: product.title,
          },
        }),
      );
      // Server-side createBookingRequest notifies the seller directly (Sprint 9).

      // Show toast and close
      notify.bookingSent(brandName, isService);
      setShowOrderConfirm(false);

      // Redirect to Messages thread
      navigate(`/messages/${threadId}`);
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : 'Could not send this request. Please try again.',
      );
    } finally {
      setIsSendingBookingRequest(false);
    }
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
            variantImages={
              (selectedVariant?.images && selectedVariant.images.length
                ? selectedVariant.images
                : selectedVariant?.image
                  ? [selectedVariant.image]
                  : undefined) as string[] | undefined
            }
            showVariantGallery={hasUserSelectedVariant && !!selectedVariant}
            allListingImages={allListingImages}
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
        reviewCount={productReviewStats.count}
        avgRating={productReviewStats.avg}
        featured={Boolean((product as any)?.featuredFlag)}
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
        optionGroups={variantOptionGroups}
        selectedOptions={selectedOptions}
        onSelectOption={selectOption}
        isValueAvailable={isValueAvailable}
        resolvedVariant={selectedVariant}
        showSizeGuideButton={showSizeGuideButton}
        sizeGuideLabel={productGuideCtaLabel(product?.sizeGuide)}
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
          if (needsPrescription && !prescriptionData) {
            setShowPrescriptionModal(true);
            toast.error('Add your lens power details or upload your prescription before adding to cart.');
            return;
          }
          // Preserve the canonical selected combination (variantId + SKU +
          // resolved price/MRP/media) through the cart.
          const variantOptionMap = selectedVariant?.attributes ?? selectedVariant?.options;
          const variantForCart = selectedVariant
            ? {
                id: selectedVariant.id,
                sku: selectedVariant.sku,
                price: selectedVariant.price ?? product.price,
                originalPrice: selectedVariant.originalPrice,
                // Carry the option map under BOTH keys — cart / checkout / order
                // consumers historically read `.attributes`, the canonical model
                // uses `.options`.
                options: variantOptionMap,
                attributes: variantOptionMap,
                image: selectedVariant.image ?? (selectedVariant.images && selectedVariant.images[0]),
                images: selectedVariant.images ?? undefined,
                stock: selectedVariant.stock,
              }
            : undefined;
          addToCart(product, cartQty, variantForCart);
          if (selectedAddons.length > 0) {
            sessionStorage.setItem(
              `choosify_addons_${product.id}`,
              JSON.stringify(
                selectedAddons.map((a: any) => ({ id: a.id, title: a.title, price: a.price, quantity: getAddonQty(a.id) })),
              ),
            );
          }
          if (prescriptionData) {
            sessionStorage.setItem(
              `choosify_prescription_${product.id}`,
              JSON.stringify({ ...prescriptionData, fileDataUrl: undefined }),
            );
          }
          notify.cartAdded({
            productId: product.id,
            title: product.title,
            quantity: cartQty,
            addonCount: selectedAddons.length,
          });
        }}
        onCompare={
          isCompareCategoryBlocked
            ? () => {
                navigate(compareCategoryBrowseHref(compareLockedCategory!.label));
              }
            : handleAddToCompare
        }
        compareDisabled={isCompareCategoryBlocked}
        compareHint={compareHint}
        onReport={() => {
          if (!isLoggedIn) {
            navigate('/login', { state: { from: location.pathname } });
            return;
          }
          setIsReportOpen(true);
        }}
        onMessageSeller={handleMessageOrder}
        onAskEmi={() => {
          openEmiPanel(`Tell me more about ${product.title} and alternatives`);
        }}
        addonsSlot={
          hasAddons ? (
            <>
              <OptionalAddonsModule
                addons={resolvedAddons}
                selectedIds={selectedAddonIds}
                onToggle={toggleAddon}
                quantities={addonQuantities}
                onQtyChange={setAddonQty}
                basePrice={product.price}
                addonTotal={addonTotal}
              />
              {needsPrescription && (
                <PrescriptionUploadModule
                  data={prescriptionData}
                  onOpenModal={() => setShowPrescriptionModal(true)}
                  onClear={() => setPrescriptionData(null)}
                />
              )}
            </>
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
            {product.enableSpecs !== false && (
            <StudioWrap sectionId="product-specs">
            <ProductSpecsOverview
              productTitle={product.title}
              title={sectionLabels.specifications}
              subtitle={
                isService
                  ? `Service details for ${product.title}`
                  : undefined
              }
              specs={[
                ...(Array.isArray(product.specs) && product.specs.length
                  ? product.specs.map((row: any) => ({
                      label: String(row.label || row.key || ''),
                      value: String(row.value || ''),
                    }))
                  : [
                      { label: 'Brand', value: brandName },
                      { label: 'Category', value: product.category || 'Lifestyle' },
                      { label: 'Material', value: 'Premium Grade Build' },
                      { label: 'Origin', value: 'Local Production / Auth' },
                      { label: 'Warranty', value: '1 Year Care Warranty' },
                      { label: 'Model', value: product.title?.substring(0, 16) || 'Classic' },
                      { label: 'Rating', value: productReviewStats.count > 0 ? `${productReviewStats.avg.toFixed(1)} / 5` : 'No ratings yet' },
                      { label: 'Status', value: isOutOfStock ? 'Out of Stock' : 'In Stock' },
                    ]),
                ...(product.enableAdditionalSpecs !== false && Array.isArray((product as any).additionalSpecs)
                  ? (product as any).additionalSpecs.map((row: any) => ({
                      label: String(row.label || row.key || ''),
                      value: String(row.value || ''),
                    }))
                  : []),
              ]}
            />
            </StudioWrap>
            )}

            {product.enableInfluencerReviews !== false && (
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
            )}

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
                {(() => {
                  const publicReviews = [
                  ...(Array.isArray(reviews) ? reviews : [])
                    .filter((r: any) => r.productId === product.id)
                    .map((r: any) => ({
                      id: r.id,
                      name: r.authorName,
                      avatar: resolvePublicReviewAvatarUrl(
                        r.avatar,
                        r.authorAvatar,
                        r.userAvatar,
                        r.dp,
                        String(r.userId || '') === String(currentUser?.id || '')
                          ? currentUser?.avatar
                          : undefined,
                      ),
                      time: formatReviewDate(r.createdAt) || 'Just now',
                      rating: String(r.rating),
                      content: r.text,
                      date: formatReviewDate(r.createdAt) || 'Just now',
                      purchaseDate: formatReviewDate(r.purchaseDate) || undefined,
                      orderType: r.orderType,
                      images: (r.images || r.photos || []) as string[],
                      verified: true,
                    })),
                  ...(product.enablePublicReviews !== false && Array.isArray((product as any).curatedPublicReviews)
                    ? (product as any).curatedPublicReviews.map((r: any) => ({
                        name: r.reviewerName,
                        avatar: resolvePublicReviewAvatarUrl(r.reviewerAvatar, r.avatar, r.dp),
                        time: 'Verified purchase',
                        rating: String(r.rating),
                        content: r.comment,
                        date: 'Verified purchase',
                        images: [] as string[],
                        verified: true,
                      }))
                    : []),
                  ];
                  if (publicReviews.length === 0) {
                    return (
                      <div className="md:col-span-2 py-10 border border-dashed border-[#E8EDF2] rounded-[10px] flex flex-col items-center justify-center text-center bg-[#F4F7F9]">
                        <p className="text-[13px] font-medium text-[#9AA0AC]">
                          No customer reviews yet for this product
                        </p>
                      </div>
                    );
                  }
                  return publicReviews.map((review: any, i) => (
                  <PublicReviewCard
                    key={i}
                    id={review.id}
                    review={review}
                    onReportClick={
                      review.id
                        ? () => {
                            if (!isLoggedIn) {
                              navigate('/login', { state: { from: location.pathname } });
                              return;
                            }
                            setReviewReport({ id: String(review.id), label: `${review.name}'s review` });
                          }
                        : undefined
                    }
                  />
                  ));
                })()}
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
                      className="h-10 px-6 bg-white border border-[#E5E7EB] text-[#FF5B00] text-[13px] font-bold rounded-lg hover:border-[#D1D5DB] cursor-pointer"
                    >
                      Sign in
                    </button>
                  </div>
                ) : reviewableOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 bg-[#F4F7F9] border border-[#E8EDF2] rounded-xl p-6">
                    <span className="text-sm font-bold text-[#1A1A2E]">
                      No orders available to review
                    </span>
                    <p className="text-[13px] text-[#9AA0AC] max-w-sm leading-relaxed">
                      You can only review a product after your order for it has been delivered, and
                      each delivered order can be reviewed once.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="flex gap-3 items-start">
                    <div className="w-[38px] h-[38px] rounded-full bg-[#F4F7F9] shrink-0 overflow-hidden" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[11px] font-bold text-[#1A1A2E] mb-1.5">
                        Which order is this review for?
                      </label>
                      <select
                        required
                        value={selectedReviewOrderId}
                        onChange={(e) => setSelectedReviewOrderId(e.target.value)}
                        className="w-full h-10 mb-2.5 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[12.5px] font-semibold text-[#1A1A2E] focus:outline-none focus:border-[#FF5B00] transition-colors"
                      >
                        <option value="" disabled>
                          Select your order…
                        </option>
                        {reviewableOrders.map((o) => (
                          <option key={o.orderId} value={o.orderId}>
                            Order #{o.orderId} · {formatReviewDate(o.createdAt)} · {o.isCOD ? 'COD' : 'Online Payment'}
                          </option>
                        ))}
                      </select>

                      <div
                        className={cn(
                          'border border-[#E5E7EB] rounded-[10px] px-3.5 py-2.5',
                          !selectedReviewOrderId && 'opacity-50',
                        )}
                      >
                        <textarea
                          rows={1}
                          required
                          disabled={!selectedReviewOrderId}
                          placeholder={
                            selectedReviewOrderId
                              ? 'Share your experience with this product...'
                              : 'Select your order above to write a review'
                          }
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="w-full border-0 outline-none resize-none text-[13px] text-[#1A1A2E] bg-transparent min-h-[20px] leading-relaxed p-0 disabled:cursor-not-allowed"
                        />
                      </div>

                      {reviewPhotoPreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          {reviewPhotoPreviews.map((src, i) => (
                            <div key={src} className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#E5E7EB]">
                              <img src={src} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeReviewPhoto(i)}
                                className="absolute top-0 right-0 bg-black/60 text-white p-0.5"
                                aria-label="Remove photo"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-2.5">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                disabled={!selectedReviewOrderId}
                                onClick={() => setSelectedRating(star)}
                                className="bg-transparent border-0 p-0 cursor-pointer text-[#FBBF24] text-base leading-none disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label={`Rate ${star}`}
                              >
                                {star <= selectedRating ? '★' : '☆'}
                              </button>
                            ))}
                          </div>
                          <input
                            ref={reviewPhotoInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleReviewPhotoChange}
                          />
                          <button
                            type="button"
                            disabled={!selectedReviewOrderId || reviewPhotoFiles.length >= 6}
                            onClick={() => reviewPhotoInputRef.current?.click()}
                            className="flex items-center gap-1 text-[11px] font-bold text-[#6B7280] hover:text-[#FF5B00] disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <ImagePlus size={14} /> Add photo
                          </button>
                        </div>
                        <button
                          type="submit"
                          disabled={!selectedReviewOrderId || isSubmittingReview}
                          className="bg-[#FF5B00] text-white border-0 px-5 py-2 rounded-lg text-[11.5px] font-extrabold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isSubmittingReview ? 'SUBMITTING…' : 'SUBMIT REVIEW'}
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
                  <span className="text-[#FF5B00]">Overview</span>
                </h3>
                <p className="text-[10px] font-bold text-[#9AA0AC] tracking-wide mt-1 uppercase">
                  Benefits, quality structure & trust
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(() => {
                  const OV_ICONS = [<Tag size={14} />, <Award size={14} />, <Users size={14} />, <ShieldCheck size={14} />];
                  const blocks: Array<{ title?: string; bullets?: string[] }> = Array.isArray(product.overviewBlocks)
                    ? product.overviewBlocks
                    : [];
                  const filled = blocks
                    .filter((b) => b?.title && Array.isArray(b.bullets) && b.bullets.filter(Boolean).length)
                    .map((b) => ({ title: String(b.title), items: (b.bullets || []).filter(Boolean) }));
                  if (!filled.length) return null;
                  return filled.map((col, i) => (
                    <div key={col.title} className="bg-[#F4F7F9] rounded-[10px] px-5 py-[18px] flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#1A1A2E]">
                        <span className="text-[#FF5B00]">{OV_ICONS[i % OV_ICONS.length]}</span>
                        {col.title}
                      </div>
                      <div className="space-y-2 text-[11.5px] text-[#4B5563] leading-relaxed">
                        {col.items.map((item) => (
                          <OverviewListItem key={item} text={item} />
                        ))}
                      </div>
                    </div>
                  ));
                })()}

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
                          <span className="text-[#FF5B00]">
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

              {product.enableBestForTags !== false && (
              <div className="pt-1 space-y-2.5">
                <div className="text-[11px] font-extrabold text-[#8A00C4]"># BEST FOR TAGS</div>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(product.bestForTags) && product.bestForTags.length
                    ? product.bestForTags
                    : [
                        'premium lifestyle',
                        'quality driven',
                        'modern apparel',
                        'exclusive designs',
                        'sustainable wear',
                        'best in segment',
                        'elite deshi collect',
                      ]
                  ).map((tag: string) => (
                    <span
                      key={tag}
                      className="choosify-best-for-tag text-[11px] font-bold px-3.5 py-1.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              )}
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
                      productReviewStats.count > 0
                        ? `Rating: ${productReviewStats.avg.toFixed(1)} / 5`
                        : 'Rating: No ratings yet',
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

            {/* Warranty & After-Sales Services */}
            {(() => {
              const months = Number((product as any).warrantyMonths) || 0;
              const wType = String((product as any).warrantyType || '').trim();
              const wProvider = String((product as any).warrantyProvider || '').trim();
              const wTerms = String((product as any).warrantyTerms || '').trim();
              const afterSales: string[] = Array.isArray((product as any).afterSalesInfo?.bullets)
                ? (product as any).afterSalesInfo.bullets.filter(Boolean)
                : [];
              if (!months && !wType && !wProvider && !wTerms && !afterSales.length) return null;
              return (
                <StudioWrap
                  sectionId="product-warranty"
                  className="scroll-mt-36 bg-white rounded-xl border border-[#E8EDF2] p-6 w-full text-left"
                >
                  <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-3">
                    WARRANTY &amp; AFTER-SALES SERVICES
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {(months || wType || wProvider || wTerms) && (
                      <div className="bg-[#F4F7F9] rounded-[10px] p-4">
                        <div className="text-[12px] font-extrabold text-[#1A1A2E] mb-1.5">
                          {months ? `${months} month${months === 1 ? '' : 's'} warranty` : 'Warranty'}
                          {wType ? ` · ${wType}` : ''}
                        </div>
                        {wProvider ? (
                          <div className="text-[11.5px] text-[#4B5563] mb-1">Provider: {wProvider}</div>
                        ) : null}
                        {wTerms ? (
                          <div className="text-[11.5px] text-[#4B5563] leading-relaxed">{wTerms}</div>
                        ) : null}
                      </div>
                    )}
                    {afterSales.length > 0 && (
                      <div className="bg-[#F4F7F9] rounded-[10px] p-4">
                        <div className="text-[12px] font-extrabold text-[#1A1A2E] mb-2">After-Sales Services</div>
                        {afterSales.map((item, i) => (
                          <OverviewListItem
                            key={i}
                            text={item}
                            className="text-[11.5px] text-[#4B5563] mb-1.5"
                            iconClassName="text-emerald-500"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </StudioWrap>
              );
            })()}

            {/* Things to Know — seller/admin-entered structured purchase
                guidance only (never auto-generated per category). Hidden
                entirely when the seller hasn't added any enabled items. */}
            {(() => {
              const items: Array<{ id: string; title: string; description?: string; enabled?: boolean }> =
                Array.isArray((product as any).thingsToKnowItems) ? (product as any).thingsToKnowItems : [];
              const visible = items.filter((t) => t.enabled !== false && t.title?.trim());
              if ((product as any).enableThingsToKnow === false || visible.length === 0) return null;
              return (
                <StudioWrap
                  sectionId="product-things-to-know"
                  className="scroll-mt-36 bg-white rounded-xl border border-[#E8EDF2] p-6 w-full text-left"
                >
                  <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-3">
                    THINGS TO KNOW
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {visible.map((t) => (
                      <div key={t.id} className="bg-[#F4F7F9] rounded-[10px] p-4">
                        <div className="text-[12px] font-extrabold text-[#1A1A2E] mb-1">{t.title}</div>
                        {t.description ? (
                          <div className="text-[11.5px] text-[#4B5563] leading-relaxed whitespace-pre-wrap">
                            {t.description}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </StudioWrap>
              );
            })()}

            {/* Same Brands-list directory tile (standard grid cell size — not stretched) */}
            <div
              id={isService ? 'service-provider-section' : 'where-to-buy-section'}
              className="w-full flex flex-col md:flex-row gap-6 items-stretch"
            >
              <div className="w-full md:w-[300px] lg:w-[340px] shrink-0">
                <BrandCardDesign
                  brand={mapBrandToCardDesign(
                    brandObj || {
                      id: brandId,
                      name: brandName,
                      category: product?.category,
                      rating: product?.rating,
                    },
                    brandObj,
                  )}
                />
              </div>

              {showRelatedInfoPanel && product ? (
                <ListingRelatedInfoPanel
                  className="flex-1 min-w-0"
                  product={product}
                  fallbackPrice={typeof product.price === 'number' ? product.price : undefined}
                />
              ) : null}
            </div>

            {/* Sponsored Advertisement */}
            <div className="choosify-dark-surface text-white rounded-xl p-6 relative overflow-hidden text-left w-full">
              <SponsoredCardChrome brandName="Choosify" size="sm" />
              <h4 className="text-sm font-extrabold tracking-tight mb-2 text-white mt-8">
                Upgrade To Express Delivery
              </h4>
              <p className="text-[11px] text-white/55 leading-relaxed mb-4">
                Get free 1-hour home deliveries inside Dhaka metro area under Choosify Premium Club.
              </p>
              <p className="text-[11px] font-bold text-white/40 m-0">
                Membership signup is not available yet.
              </p>
            </div>
          </div>
      </main>
      </div>

      {(product?.catalogId || product?.id) && (
        <ProductQuickComparison productId={String(product?.catalogId ?? product?.id)} />
      )}

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
                <div className="w-8 h-8 rounded-full bg-[#FF5B00]/10 flex items-center justify-center text-[#FF5B00]">
                  <MessageCircleMore size={16} />
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
                    <p className="text-[10px] text-[#FF5B00] font-bold mt-0.5 font-mono">
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
                              ? "bg-[#FF5B00] text-white italic shadow-md shadow-orange-500/10 border-none"
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
                              ? "bg-[#FF5B00] text-white italic shadow-md shadow-orange-500/10 border-none"
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
                    className="flex-1 py-3 bg-[#FF5B00] text-white rounded-lg hover:brightness-110 transition-all text-[13px] font-bold tracking-tight shadow-sm cursor-pointer border-none"
                  >
                    Review Message
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
                  <span className="text-[11px] font-bold text-[#FF5B00] tracking-tight block mb-2">
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
                    disabled={isSendingBookingRequest}
                    className="flex-1 py-3 text-center border border-[#E5E7EB] rounded-lg hover:bg-[#F4F7F9] transition-all text-[13px] font-bold tracking-tight text-[#1A1A2E] cursor-pointer bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmAndSend}
                    disabled={isSendingBookingRequest}
                    className="flex-1 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-[13px] font-bold tracking-tight shadow-sm cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingBookingRequest ? 'Sending…' : 'Send Request'}
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

      <PrescriptionDetailsModal
        open={needsPrescription && showPrescriptionModal}
        initialData={prescriptionData}
        onClose={() => setShowPrescriptionModal(false)}
        onSave={(data) => {
          setPrescriptionData(data);
          setShowPrescriptionModal(false);
        }}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        type="product"
        targetId={String(product.id)}
        targetName={product.title}
        source="storefront"
      />

      <ReportModal
        isOpen={Boolean(reviewReport)}
        onClose={() => setReviewReport(null)}
        type="review"
        targetId={reviewReport?.id || ''}
        targetName={reviewReport?.label || 'this review'}
        source="storefront"
      />
    </div>
  );
}
