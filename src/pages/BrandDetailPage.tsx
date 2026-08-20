import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  X,
  ShieldCheck,
} from "lucide-react";
import { BRANDS, PRODUCTS } from "../constants";
import { BrandQuickComparison } from "../components/QuickComparisonSection";
import type { CatalogBrandFaq, CatalogBrandStores } from "../types/catalog";
import { ProductCard } from "../components/ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { DETAIL_SINGLE_FEED, PRODUCT_CARD_GRID } from "../lib/pageLayout";
import { DcUnderlineTabs } from "../components/design/DcUnderlineTabs";
import { CardEngagementStrip } from "../components/CardEngagementStrip";
import { useSectionScrollSpy } from "../hooks/useSectionScrollSpy";
import { StudioWrap } from "../components/studio/StudioWrap";
import { BrandPostCarouselSection } from "../components/BrandPostCarouselSection";
import { getBrandPostsByBrandId } from "../lib/brandPosts";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { ReportModal } from "../components/ReportModal";
import { useGlobalState } from "../context/GlobalStateContext";
import { toast } from '../lib/notify';
import { BrandOverviewSection } from "../components/BrandOverviewSection";
import { FollowButton } from "../components/FollowButton";
import { BrandDetailHero } from "../components/brand/BrandDetailHero";
import { ClaimProfileModal } from "../components/ClaimProfileModal";
import {
  UniversalFilterRenderer,
  ActiveFilterChips,
  FilterProfile,
  CategorySmartFilters,
  useRegisterPageFilters,
} from "../components/FilterEngine";
import { UniversalCarousel } from "../components/design/UniversalCarousel";
import { PaginationBar } from "../components/PaginationBar";
import { PublicReviewCard, resolvePublicReviewAvatarUrl } from "../components/PublicReviewCard";
import { TikTokIcon } from "../components/brand/TikTokIcon";
import { BrandCouponCarouselCard, buildBrandCoupons } from "../components/brand/BrandCouponsSection";
import { operationsApi, type PublicProductReview } from "../services/operationsApi";
import { BrandWhereToBuySection } from "../components/brand/BrandWhereToBuySection";
import { BrandFaqSection } from "../components/brand/BrandFaqSection";
import { BrandStorySection } from "../components/brand/BrandStorySection";
import {
  rankBrandCatalogProducts,
} from "../utils/listingRanking";
import { usePriorityClockMs } from "../hooks/usePriorityClockMs";

const BRAND_FEED_GRID = PRODUCT_CARD_GRID;

export function BrandDetailPage() {
  const brandHeroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const {
    allBrands,
    allCatalogBrands,
    allProducts,
    getBrandClaimStatus,
    updateBrandClaimStatus,
    brandClaimStatuses,
  } = useGlobalState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  // Filter States (from Brand Products page)
  const [activeFilter, setActiveFilter] = useState("Full Experience"); // Show Component View Selector
  const [searchFilter, setSearchFilter] = useState("");
  const [currentSearchInput, setCurrentSearchInput] = useState("");

  // New Filter V2 States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRangeV2, setPriceRangeV2] = useState<[number, number | null]>([
    0,
    null,
  ]);
  const [customPriceInputs, setCustomPriceInputs] = useState({
    min: "",
    max: "",
  });
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(
    null,
  );
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const [votesFilter, setVotesFilter] = useState<string | null>(null);
  const [warrantyFilter, setWarrantyFilter] = useState<string | null>(null);
  const [deliveryFilter, setDeliveryFilter] = useState<string | null>(null);

  // Deal filters
  const [discountFilter, setDiscountFilter] = useState<string | null>(null);
  const [couponFilter, setCouponFilter] = useState<string | null>(null);
  const [expiryFilter, setExpiryFilter] = useState<string | null>(null);

  // Brand filters
  const [productLineFilter, setProductLineFilter] = useState<string | null>(
    null,
  );
  const [featuredCollectionFilter, setFeaturedCollectionFilter] = useState<
    string | null
  >(null);
  const [officialStoreFilter, setOfficialStoreFilter] = useState<string | null>(
    null,
  );
  const [countryFilter, setCountryFilter] = useState<string | null>(null);

  // Quick action filters managed at core
  const [dealsOnlyFilter, setDealsOnlyFilter] = useState(false);
  const [couponsOnlyFilter, setCouponsOnlyFilter] = useState(false);
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState(false);
  const [inStockOnlyFilter, setInStockOnlyFilter] = useState(false);
  const [featuredOnlyFilter, setFeaturedOnlyFilter] = useState(false);

  // Sort State
  const [sortOption, setSortOption] = useState<string>("default");
  const priorityNowMs = usePriorityClockMs();

  // Smart filters specs State
  const [smartSpecs, setSmartSpecs] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dynamically resolve brand or fallback to Sailor/fashion-oriented layout
  const brandSource = allBrands.length > 0 ? allBrands : BRANDS;
  const productSource = allProducts.length > 0 ? allProducts : PRODUCTS;

  const brand =
    brandSource.find(
      (b) =>
        String(b.id) === id ||
        b.name.toLowerCase().replace(/\s+/g, "-") ===
          String(id).toLowerCase() ||
        b.name.toLowerCase() === String(id).toLowerCase(),
    ) ||
    brandSource.find((b) => b.name === "Sailor") ||
    brandSource[2];

  const brandWhatsOnPosts = useMemo(
    () => getBrandPostsByBrandId(Number(brand.id)).slice(0, 6),
    [brand.id],
  );

  const [localClaimStatus, setLocalClaimStatus] = useState<
    "verified" | "pending" | "community"
  >(() => getBrandClaimStatus(brand.id));

  const [currentPage, setCurrentPage] = useState(1);
  // 5 rows × up to 5 columns (PRODUCT_CARD_GRID) before pagination
  const productsPerPage = 25;

  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeFilter,
    searchFilter,
    selectedCategory,
    priceRangeV2,
    availabilityFilter,
    ratingFilter,
    votesFilter,
    warrantyFilter,
    deliveryFilter,
    discountFilter,
    couponFilter,
    expiryFilter,
    productLineFilter,
    featuredCollectionFilter,
    officialStoreFilter,
    countryFilter,
    dealsOnlyFilter,
    couponsOnlyFilter,
    verifiedOnlyFilter,
    inStockOnlyFilter,
    featuredOnlyFilter,
    smartSpecs,
  ]);

  useEffect(() => {
    setLocalClaimStatus(getBrandClaimStatus(brand.id));
  }, [brand, brandClaimStatuses]);

  // Deep-link from brand list discount pill → Top Deals & Coupons (#deals-section)
  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace(/^#/, '');
    if (!targetId) return;
    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [location.hash, id, brand.id]);

  const [brandReviews, setBrandReviews] = useState<PublicProductReview[]>([]);
  const [brandReviewsLoaded, setBrandReviewsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setBrandReviewsLoaded(false);
    operationsApi
      .listBrandReviews(brand.name)
      .then((rows) => {
        if (!cancelled) setBrandReviews(rows);
      })
      .catch(() => {
        if (!cancelled) setBrandReviews([]);
      })
      .finally(() => {
        if (!cancelled) setBrandReviewsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [brand.name]);

  // Resolve products listed under this brand (id, catalog id, and name — mocks often lack brandId)
  const brandNameLower = brand.name.toLowerCase();
  const brandIdStr = String(brand.id);
  const brandCatalogId = String((brand as { catalogId?: string }).catalogId || '').toLowerCase();
  const brandProducts = productSource.filter((p: any) => {
    if (p.brandId != null && String(p.brandId) === brandIdStr) return true;
    if (
      p.catalogBrandId != null &&
      brandCatalogId &&
      String(p.catalogBrandId).toLowerCase() === brandCatalogId
    ) {
      return true;
    }
    const productBrand = String(p.brandName || p.brand || '')
      .toLowerCase()
      .trim();
    return Boolean(productBrand) && productBrand === brandNameLower;
  });

  // Always expose Products in sticky nav — section renders even when the catalog is empty
  const previewShowProductCatalogSection = true;

  const sectionNavItems = useMemo(
    () => [
      {
        id: "deals-section",
        label: "Deals & Coupons",
      },
      {
        id: "products-section",
        label: "Products",
        hidden: !previewShowProductCatalogSection,
      },
      {
        id: "public-reviews-section",
        label: "Public Review",
      },
      {
        id: "brand-overview-section",
        label: "Overview",
      },
      {
        id: "store-location-section",
        label: "Where to Buy",
      },
      {
        id: "faq-section",
        label: "FAQ",
      },
      {
        id: "brand-story-section",
        label: "Brand Story",
      },
    ],
    [previewShowProductCatalogSection],
  );

  const { activeId: activeSectionId, scrollToSection } =
    useSectionScrollSpy(sectionNavItems);

  // Dynamic Categories options
  const dynamicCategories = Array.from(
    new Set(brandProducts.map((p: any) => p.category).filter(Boolean)),
  ).map((catName: any) => {
    const count = brandProducts.filter(
      (p: any) => p.category === catName,
    ).length;
    return { name: catName, count: count };
  });
  const defaultCats = [
    { name: "Mobile", count: 12 },
    { name: "Headphone", count: 8 },
    { name: "Chargers & Batteries", count: 5 },
    { name: "Accessories", count: 7 },
  ];
  const finalCategoriesList =
    dynamicCategories.length > 0 ? dynamicCategories : defaultCats;

  useRegisterPageFilters(
    {
      pageName: brand.name,
      renderSearch: () => (
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={13} className="text-[#EB4501]" />
          </div>
          <input
            type="text"
            value={currentSearchInput}
            onChange={(e) => setCurrentSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setSearchFilter(currentSearchInput);
            }}
            placeholder="Search products of this brand..."
            className="w-full h-9 pl-8 pr-3 bg-white border border-[#e8edf2] rounded-[5px] text-[11px] font-semibold text-[#1A1D4E] placeholder-gray-400 focus:outline-none focus:border-[#EB4501]/50 transition-colors"
          />
        </div>
      ),
      quickFilters: [
        {
          id: "all-products",
          label: "All Products",
          active:
            !dealsOnlyFilter &&
            !couponsOnlyFilter &&
            !verifiedOnlyFilter &&
            !inStockOnlyFilter &&
            !featuredOnlyFilter,
          onClick: () => {
            setDealsOnlyFilter(false);
            setCouponsOnlyFilter(false);
            setVerifiedOnlyFilter(false);
            setInStockOnlyFilter(false);
            setFeaturedOnlyFilter(false);
          },
        },
        {
          id: "deals-only",
          label: "Deals",
          active: dealsOnlyFilter,
          onClick: () => setDealsOnlyFilter(!dealsOnlyFilter),
        },
        {
          id: "coupons-only",
          label: "Coupons Available",
          active: couponsOnlyFilter,
          onClick: () => setCouponsOnlyFilter(!couponsOnlyFilter),
        },
        {
          id: "verified",
          label: "Verified Store",
          active: verifiedOnlyFilter,
          onClick: () => setVerifiedOnlyFilter(!verifiedOnlyFilter),
        },
        {
          id: "in-stock",
          label: "In Stock",
          active: inStockOnlyFilter,
          onClick: () => setInStockOnlyFilter(!inStockOnlyFilter),
        },
        {
          id: "featured",
          label: "Featured",
          active: featuredOnlyFilter,
          onClick: () => setFeaturedOnlyFilter(!featuredOnlyFilter),
        },
        {
          id: "sort",
          label:
            sortOption === "default"
              ? "Sort Selection"
              : `Sort: ${
                  sortOption === "price-asc"
                    ? "৳ Low to High"
                    : sortOption === "price-desc"
                      ? "৳ High to Low"
                      : sortOption === "rating-desc"
                        ? "Top Rating"
                        : "Best Discount"
                }`,
          active: sortOption !== "default",
          onClick: () => {
            setSortOption((prev) => {
              if (prev === "default") return "price-asc";
              if (prev === "price-asc") return "price-desc";
              if (prev === "price-desc") return "rating-desc";
              if (prev === "rating-desc") return "discount-desc";
              return "default";
            });
          },
        },
      ],
      renderFilters: () => (
        <div className="flex flex-col gap-4">
          <CategorySmartFilters
            category={brand.category || "Fashion & Clothing"}
            activeSpecs={smartSpecs}
            onSpecChange={(specKey, val) => {
              setSmartSpecs((prev) => ({ ...prev, [specKey]: val || "" }));
            }}
          />

          <UniversalFilterRenderer
            profile={{
              entity: "products",
              filters: [
                {
                  id: "price_custom",
                  name: "Price Scope (BDT)",
                  type: "price_custom",
                },
                {
                  id: "category",
                  name: "Categories",
                  type: "single_select",
                  options: [
                    { value: "all", label: "All Categories" },
                    ...finalCategoriesList.map((cat) => ({
                      value: cat.name,
                      label: cat.name,
                      count: cat.count,
                    })),
                  ],
                },
                {
                  id: "availability",
                  name: "Availability",
                  type: "single_select",
                  options: [
                    { value: "all", label: "All Items" },
                    { value: "in-stock", label: "In Stock" },
                    { value: "out-of-stock", label: "Out of Stock" },
                  ],
                },
                {
                  id: "rating",
                  name: "Average Rating",
                  type: "single_select",
                  options: [
                    { value: "all", label: "All Ratings" },
                    { value: "4.8", label: "4.8★ & Up" },
                    { value: "4.5", label: "4.5★ & Up" },
                    { value: "4.0", label: "4.0★ & Up" },
                  ],
                },
                {
                  id: "votes",
                  name: "Audience Votes",
                  type: "single_select",
                  options: [
                    { value: "all", label: "Any Vote Count" },
                    { value: "500", label: "500+ Votes" },
                    { value: "300", label: "300+ Votes" },
                    { value: "100", label: "100+ Votes" },
                  ],
                },
              ],
            }}
            activeFilters={{
              price_custom: true,
              category: selectedCategory,
              availability: availabilityFilter,
              rating: ratingFilter,
              votes: votesFilter,
            }}
            onFilterChange={(filterId, val) => {
              const cleanVal = val === "all" ? null : val;
              if (filterId === "category") setSelectedCategory(cleanVal);
              if (filterId === "availability") setAvailabilityFilter(cleanVal);
              if (filterId === "rating") setRatingFilter(cleanVal);
              if (filterId === "votes") setVotesFilter(cleanVal);
            }}
            customPriceInputs={customPriceInputs}
            setCustomPriceInputs={setCustomPriceInputs}
            onCustomPriceApply={(min, max) => {
              setPriceRangeV2([min, max]);
            }}
          />

          <UniversalFilterRenderer
            profile={{
              entity: "products",
              filters: [
                {
                  id: "warranty",
                  name: "Warranty Scope",
                  type: "single_select",
                  options: [
                    { value: "all", label: "Any Warranty" },
                    { value: "standard", label: "Standard Brand Warranty" },
                    { value: "extended", label: "Extended Merchant Warranty" },
                    { value: "none", label: "No Warranty" },
                  ],
                },
                {
                  id: "delivery",
                  name: "Shipping Speed",
                  type: "single_select",
                  options: [
                    { value: "all", label: "Any Shipping" },
                    { value: "free", label: "Free Delivery" },
                    { value: "express", label: "Next Day Express" },
                  ],
                },
                {
                  id: "discount",
                  name: "Promo Discount Min",
                  type: "single_select",
                  options: [
                    { value: "all", label: "Any Discount" },
                    { value: "50", label: "50% Off & Above" },
                    { value: "30", label: "30% Off & Above" },
                    { value: "15", label: "15% Off & Above" },
                  ],
                },
                {
                  id: "coupon",
                  name: "Coupon Support",
                  type: "single_select",
                  options: [
                    { value: "all", label: "All Offers" },
                    { value: "yes", label: "Exclusive Coupon Codes" },
                    { value: "no", label: "Direct Pricing Markdown" },
                  ],
                },
                {
                  id: "expiry",
                  name: "Offer Validity Status",
                  type: "single_select",
                  options: [
                    { value: "all", label: "Any Validity" },
                    { value: "active", label: "Active Codes" },
                    { value: "expiring-soon", label: "Expiring Within 48 Hrs" },
                  ],
                },
                {
                  id: "product_line",
                  name: "Product Category Line",
                  type: "single_select",
                  options: [
                    { value: "all", label: "All Lines" },
                    { value: "premium", label: "Premium Signature Line" },
                    { value: "casual", label: "Everyday Casual Line" },
                    { value: "budget", label: "Value Budget Line" },
                  ],
                },
                {
                  id: "featured_collection",
                  name: "Featured Campaign",
                  type: "single_select",
                  options: [
                    { value: "all", label: "All Collections" },
                    { value: "summer", label: "Summer Air" },
                    { value: "winter", label: "Winter Cozy" },
                    { value: "festive", label: "Festive / Eid Special" },
                  ],
                },
                {
                  id: "official_store",
                  name: "Official Outlet Sourced",
                  type: "single_select",
                  options: [
                    { value: "all", label: "All Stores" },
                    { value: "yes", label: "Official Store Only" },
                    { value: "no", label: "Third-party Retailer" },
                  ],
                },
                {
                  id: "country",
                  name: "Country of Origin",
                  type: "single_select",
                  options: [
                    { value: "all", label: "All Countries" },
                    { value: "Bangladesh", label: "Bangladesh" },
                    { value: "China", label: "China" },
                    { value: "Vietnam", label: "Vietnam" },
                    { value: "India", label: "India" },
                  ],
                },
              ],
            }}
            activeFilters={{
              warranty: warrantyFilter,
              delivery: deliveryFilter,
              discount: discountFilter,
              coupon: couponFilter,
              expiry: expiryFilter,
              product_line: productLineFilter,
              featured_collection: featuredCollectionFilter,
              official_store: officialStoreFilter,
              country: countryFilter,
            }}
            onFilterChange={(filterId, val) => {
              const cleanVal = val === "all" ? null : val;
              if (filterId === "warranty") setWarrantyFilter(cleanVal);
              if (filterId === "delivery") setDeliveryFilter(cleanVal);
              if (filterId === "discount") setDiscountFilter(cleanVal);
              if (filterId === "coupon") setCouponFilter(cleanVal);
              if (filterId === "expiry") setExpiryFilter(cleanVal);
              if (filterId === "product_line") setProductLineFilter(cleanVal);
              if (filterId === "featured_collection")
                setFeaturedCollectionFilter(cleanVal);
              if (filterId === "official_store")
                setOfficialStoreFilter(cleanVal);
              if (filterId === "country") setCountryFilter(cleanVal);
            }}
          />
        </div>
      ),
      activeFilterCount:
        (selectedCategory ? 1 : 0) +
        (priceRangeV2[0] > 0 || priceRangeV2[1] !== null ? 1 : 0) +
        (availabilityFilter ? 1 : 0) +
        (ratingFilter ? 1 : 0) +
        (votesFilter ? 1 : 0) +
        (warrantyFilter ? 1 : 0) +
        (deliveryFilter ? 1 : 0) +
        (discountFilter ? 1 : 0) +
        (couponFilter ? 1 : 0) +
        (expiryFilter ? 1 : 0) +
        (productLineFilter ? 1 : 0) +
        (featuredCollectionFilter ? 1 : 0) +
        (officialStoreFilter ? 1 : 0) +
        (countryFilter ? 1 : 0) +
        (dealsOnlyFilter ? 1 : 0) +
        (couponsOnlyFilter ? 1 : 0) +
        (verifiedOnlyFilter ? 1 : 0) +
        (inStockOnlyFilter ? 1 : 0) +
        (featuredOnlyFilter ? 1 : 0) +
        Object.values(smartSpecs).filter(Boolean).length,
      onClearAll: clearAllFilters,
      sectionNav: {
        items: sectionNavItems,
        activeId: activeSectionId,
        onNavigate: scrollToSection,
        allLabel: "Brand",
        profileLabel: "Brand profile",
      },
    },
    [
      currentSearchInput,
      searchFilter,
      selectedCategory,
      priceRangeV2,
      customPriceInputs,
      availabilityFilter,
      ratingFilter,
      votesFilter,
      warrantyFilter,
      deliveryFilter,
      discountFilter,
      couponFilter,
      expiryFilter,
      productLineFilter,
      featuredCollectionFilter,
      officialStoreFilter,
      countryFilter,
      dealsOnlyFilter,
      couponsOnlyFilter,
      verifiedOnlyFilter,
      inStockOnlyFilter,
      featuredOnlyFilter,
      sortOption,
      smartSpecs,
      sectionNavItems,
      activeSectionId,
      scrollToSection,
    ],
  );

  // Filters Engine Implementation V2
  const filteredProducts = useMemo(() => {
    return brandProducts.filter((p: any) => {
      // 1. Search Box
      if (
        searchFilter &&
        !p.title.toLowerCase().includes(searchFilter.toLowerCase())
      ) {
        return false;
      }

      // 2. Category
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }

      // 3. Price Scope (V2 Range)
      const priceNum =
        typeof p.price === "number"
          ? p.price
          : parseInt(String(p.price).replace(/[^0-9]/g, "")) || 0;
      if (priceNum < priceRangeV2[0]) {
        return false;
      }
      if (priceRangeV2[1] !== null && priceNum > priceRangeV2[1]) {
        return false;
      }

      // 4. Availability
      if (availabilityFilter === "in-stock" && p.inStock === false)
        return false;
      if (availabilityFilter === "out-of-stock" && p.inStock !== false)
        return false;
      if (inStockOnlyFilter && p.inStock === false) return false;

      // 5. Avg Rating
      const ratingVal = p.rating || 4.2;
      if (ratingFilter && ratingFilter !== "all") {
        if (ratingVal < parseFloat(ratingFilter)) return false;
      }

      // 6. Votes / Reviews
      const reviewVal = p.reviews || 0;
      if (votesFilter && votesFilter !== "all") {
        if (reviewVal < parseInt(votesFilter)) return false;
      }

      // 7. Warranty Filter (mock check)
      if (warrantyFilter) {
        const mappedWarranty =
          p.id % 3 === 0 ? "standard" : p.id % 3 === 1 ? "extended" : "none";
        if (mappedWarranty !== warrantyFilter) return false;
      }

      // 8. Delivery Filter
      if (deliveryFilter) {
        let mappedDelivery = "paid";
        if (p.id % 3 === 0) mappedDelivery = "free";
        else if (p.id % 3 === 1) mappedDelivery = "express";
        if (mappedDelivery !== deliveryFilter) return false;
      }

      // 9. Discount Filter (min discount %)
      const discPercent =
        p.discount ||
        (p.originalPrice
          ? Math.round(
              ((parseInt(String(p.originalPrice).replace(/[^0-9]/g, "")) -
                priceNum) /
                parseInt(String(p.originalPrice).replace(/[^0-9]/g, ""))) *
                100,
            )
          : 0);
      if (discountFilter) {
        if (discPercent < parseInt(discountFilter)) return false;
      }

      // 10. Coupon Available Filter
      if (couponFilter === "yes" && p.id % 2 !== 0) return false;
      if (couponFilter === "no" && p.id % 2 === 0) return false;

      // 11. Expiry Filter
      if (expiryFilter === "active" && p.id % 6 === 5) return false;
      if (expiryFilter === "expired" && p.id % 6 !== 5) return false;

      // 12. Country of Origin
      if (countryFilter) {
        const mappedOrigin =
          p.id % 4 === 0
            ? "Bangladesh"
            : p.id % 4 === 1
              ? "China"
              : p.id % 4 === 2
                ? "Vietnam"
                : "India";
        if (mappedOrigin !== countryFilter) return false;
      }

      // 13. Brand Product Line / Featured Collections
      if (productLineFilter) {
        const mappedLine =
          p.id % 3 === 0 ? "premium" : p.id % 3 === 1 ? "standard" : "budget";
        if (mappedLine !== productLineFilter) return false;
      }
      if (featuredCollectionFilter) {
        const mappedColl =
          p.id % 3 === 0 ? "summer" : p.id % 3 === 1 ? "winter" : "festive";
        if (mappedColl !== featuredCollectionFilter) return false;
      }
      if (officialStoreFilter === "yes" && p.id % 3 === 2) return false;
      if (officialStoreFilter === "no" && p.id % 3 !== 2) return false;

      // Quick Toolbar triggers
      if (
        dealsOnlyFilter &&
        !p.discount &&
        !p.originalPrice &&
        p.tag !== "SALE"
      )
        return false;
      if (couponsOnlyFilter && p.id % 2 !== 0) return false;
      if (verifiedOnlyFilter && localClaimStatus !== "verified") return false;
      if (featuredOnlyFilter && !p.tag) return false;

      // 14. Smart Specs (Category smart filters)
      for (const [specKey, specVal] of Object.entries(smartSpecs)) {
        if (specVal) {
          const valHash = ((p.id || 0) + specKey.length) % 3;
          if (specKey === "size") {
            const sizeVal = p.id % 3 === 0 ? "m" : p.id % 3 === 1 ? "l" : "xl";
            if (sizeVal !== specVal) return false;
          } else if (specKey === "gender") {
            const genderVal =
              p.id % 3 === 0 ? "men" : p.id % 3 === 1 ? "women" : "unisex";
            if (genderVal !== specVal) return false;
          } else if (specKey === "ram") {
            const ramVal =
              p.id % 3 === 0 ? "8gb" : p.id % 3 === 1 ? "12gb" : "16gb";
            if (ramVal !== specVal) return false;
          } else if (specKey === "storage") {
            const storageVal =
              p.id % 3 === 0 ? "128gb" : p.id % 3 === 1 ? "256gb" : "512gb";
            if (storageVal !== specVal) return false;
          } else if (specKey === "battery") {
            const battVal = p.id % 3 === 0 ? "4500-5000" : "5000plus";
            if (battVal !== specVal) return false;
          } else {
            if (valHash !== 0) return false;
          }
        }
      }

      return true;
    });
  }, [
    brandProducts,
    searchFilter,
    selectedCategory,
    priceRangeV2,
    availabilityFilter,
    ratingFilter,
    votesFilter,
    warrantyFilter,
    deliveryFilter,
    discountFilter,
    couponFilter,
    expiryFilter,
    productLineFilter,
    featuredCollectionFilter,
    officialStoreFilter,
    countryFilter,
    dealsOnlyFilter,
    couponsOnlyFilter,
    verifiedOnlyFilter,
    inStockOnlyFilter,
    featuredOnlyFilter,
    smartSpecs,
    localClaimStatus,
  ]);

  // Dynamic Sorting Engine — default uses shared brand-catalog ranking
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts] as any[];
    if (sortOption === "price-asc") {
      return list.sort((a, b) => {
        const prA =
          typeof a.price === "number"
            ? a.price
            : parseInt(String(a.price).replace(/[^0-9]/g, "")) || 0;
        const prB =
          typeof b.price === "number"
            ? b.price
            : parseInt(String(b.price).replace(/[^0-9]/g, "")) || 0;
        return prA - prB;
      });
    }
    if (sortOption === "price-desc") {
      return list.sort((a, b) => {
        const prA =
          typeof a.price === "number"
            ? a.price
            : parseInt(String(a.price).replace(/[^0-9]/g, "")) || 0;
        const prB =
          typeof b.price === "number"
            ? b.price
            : parseInt(String(b.price).replace(/[^0-9]/g, "")) || 0;
        return prB - prA;
      });
    }
    if (sortOption === "rating-desc") {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    if (sortOption === "discount-desc") {
      return list.sort((a, b) => {
        const discA = a.discount || a.discountPercent || 0;
        const discB = b.discount || b.discountPercent || 0;
        return discB - discA;
      });
    }
    return rankBrandCatalogProducts(list, priorityNowMs);
  }, [filteredProducts, sortOption, priorityNowMs]);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  // Extract deals (sale/deal flags) — fall back to top brand products so the merged carousel isn't empty
  const filteredDeals = sortedProducts.filter(
    (p: any) =>
      p.tag === "SALE" ||
      p.tag === "HOT" ||
      p.tag === "NEW" ||
      p.discount ||
      p.isDeal ||
      (typeof p.discountPercent === "number" && p.discountPercent > 0) ||
      Boolean(p.dealType),
  );
  const finalDeals =
    filteredDeals.length > 0 ? filteredDeals : sortedProducts.slice(0, 6);

  // Counts
  const totalDealsFound = finalDeals.length;
  const totalProductsFound = sortedProducts.length || brandProducts.length;
  const brandCoupons = buildBrandCoupons(brand.name);

  const dealsCouponsCarouselItems = useMemo(
    () => [
      ...finalDeals.map((product: any) => ({ kind: "deal" as const, product })),
      ...brandCoupons
        .slice(0, 3)
        .map((coupon) => ({ kind: "coupon" as const, coupon })),
    ],
    [finalDeals, brandCoupons],
  );

  function clearAllFilters() {
    setSelectedCategory(null);
    setPriceRangeV2([0, null]);
    setCustomPriceInputs({ min: "", max: "" });
    setAvailabilityFilter(null);
    setRatingFilter(null);
    setVotesFilter(null);
    setWarrantyFilter(null);
    setDeliveryFilter(null);
    setDiscountFilter(null);
    setCouponFilter(null);
    setExpiryFilter(null);
    setProductLineFilter(null);
    setFeaturedCollectionFilter(null);
    setOfficialStoreFilter(null);
    setCountryFilter(null);
    setDealsOnlyFilter(false);
    setCouponsOnlyFilter(false);
    setVerifiedOnlyFilter(false);
    setInStockOnlyFilter(false);
    setFeaturedOnlyFilter(false);
    setSortOption("default");
    setSmartSpecs({});
    setSearchFilter("");
    setCurrentSearchInput("");
  }

  const [productLineIndex, setProductLineIndex] = useState(1);

  const carouselItems = [
    {
      name: "Premium Comfort",
      category: "Classic Collection",
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop",
    },
    {
      name: `${brand.name} Eid Collection`,
      category: "Modern Fit",
      img: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=1200&h=800&fit=crop",
    },
    {
      name: "Royal Edition",
      category: "Luxury Series",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop",
    },
    {
      name: "Festive Spirit",
      category: "Seasonal Wear",
      img: "https://images.unsplash.com/photo-1511741454500-ddbf7ef33554?w=1200&h=800&fit=crop",
    },
  ];

  const handleProductLineNext = () =>
    setProductLineIndex((prev) => (prev + 1) % carouselItems.length);
  const handleProductLinePrev = () =>
    setProductLineIndex(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length,
    );

  const getBrandOverviews = (brandName: string) => {
    const name = brandName.toLowerCase();
    if (name.includes("choosify")) {
      return {
        address:
          "CHOOSE-HQ, SUITE 5A, METROPOLITAN TOWERS, GULSHAN-2, DHAKA 1212.",
        website: "choosify.com",
        map: "https://www.google.com/maps",
        email: "hello@choosify.com",
        phone: "09612246673",
        priceRange: "BDT - FREE ACCESS",
        ageRange: "AGE: 15 - 65",
        audience: "SHOPPERS, CREATORS, VERIFIED OUTLETS & SMART BUYERS",
        services: [
          "TRANSPARENT COMMUNITY COMPARISONS",
          "VERIFIED OUTLET REVIEWS & INSIGHTS",
          "ACTIVE PROMO CODES & CAMPAIGNS",
          "INFLUENCER INSIGHTS & EXPERIENCES",
          "RETAIL DEAL DISCOVERY & PRICE TRACKING",
          "REAL-TIME PRICE HISTORY TRACKER",
        ],
        tags: [
          "#BrandDiscovery",
          "#ProductComparison",
          "#Deals",
          "#Recommendations",
          "#Creators",
          "#Marketplace",
          "#ConsumerInsights",
          "#ShoppingGuides",
        ],
      };
    }
    if (name.includes("fff")) {
      return {
        address:
          "FFF SOURCING HQ, PLOT 12, ROAD 4, SECTOR 3, UTTARA, DHAKA 1230 BANGLADESH.",
        website: "fff.com.bd",
        map: "https://www.google.com/maps",
        email: "sourcing@fff.com.bd",
        phone: "+8801711223344",
        priceRange: "BDT - CUSTOM QUOTES",
        ageRange: "AGE: 18 - 60",
        audience: "INTERNATIONAL FASHION BRANDS, RETAILERS, IMPORTERS",
        services: [
          "GARMENT SOURCING",
          "BUYING HOUSE SERVICES",
          "APPAREL MANUFACTURING COORDINATION",
          "QUALITY CONTROL",
          "VENDOR MANAGEMENT",
          "PRODUCT DEVELOPMENT",
          "EXPORT SUPPORT",
          "COMPLIANCE MANAGEMENT",
        ],
        tags: [
          "#GarmentSourcing",
          "#BuyingHouse",
          "#ApparelManufacturing",
          "#BangladeshExports",
          "#FashionProduction",
          "#QualityControl",
          "#VendorManagement",
          "#TextileIndustry",
        ],
      };
    }
    if (
      name.includes("sailor") ||
      name.includes("la reve") ||
      name.includes("yellow") ||
      name.includes("aarong") ||
      name.includes("ethnic") ||
      name.includes("fashion") ||
      name.includes("apex") ||
      name.includes("bata") ||
      name.includes("lotto")
    ) {
      return {
        address:
          "GRAND SHOPPING MALL, HOUSE 2, ROAD 2, SECTOR 92. 1500 - DHAKA BANGLADESH.",
        website: "www.website.com",
        map: "https://www.google.com/maps",
        email: "fashion@gmail.com",
        phone: "01234456789",
        priceRange: "BDT - 500",
        ageRange: "AGE: 12 - 40",
        audience: "MALE, FEMALE, YOUTH & KIDS",
        services: [
          "90 DAYS RETURN WITH REFUND POLICY",
          "FULL COD ENTIRE BANGLADESH",
          "6 MONTHS WARRANTY ALL PRODUCT",
          "CUSTOM GIFT BOX AVAILABLE",
          "3 HOURS DELIVERY INSIDE DHAKA METRO",
          "ONLINE & OFFLINE ORDER FACILITIES.",
        ],
        tags: [
          "#premium buyers",
          "#quality driven",
          "#ethnic wear",
          "#fashion",
          "#eid collection",
          "#trend setter",
          "#old money",
          "#summer collection",
          "#beach wear",
        ],
      };
    }

    return {
      address: "JAMUNA FUTURE PARK, LEVEL 4, SHOP 22B, DHAKA BANGLADESH.",
      website: `www.${name}.com.bd`,
      map: "https://www.google.com/maps",
      email: `support@${name}.com`,
      phone: "09612345678",
      priceRange: "BDT 5,000 - 150,000",
      ageRange: "AGE: 18 - 60",
      audience: "TECH ENTHUSIASTS, PROFESSIONALS",
      services: [
        "7 DAYS REPLACEMENT WARRANTY",
        "100% ORIGINAL PRODUCT GUARANTEE",
        "OFFICIAL BRAND WARRANTY",
        "EMI AVAILABLE UP TO 24 MONTHS",
        "EXPRESS HOME DELIVERY",
        "SECURE CARD & MOBILE PAYMENTS",
      ],
      tags: [
        "#tech",
        "#gadgets",
        "#original",
        "#official warranty",
        "#smart choice",
        "#power user",
        "#premium build",
        "#trending tech",
      ],
    };
  };

  const fallbackOverview = getBrandOverviews(brand.name);
  const catalogOverview = (brand as { overview?: {
    address?: string;
    email?: string;
    phone?: string;
    priceRange?: string;
    ageFocus?: string;
    audience?: string;
    services?: string[];
    tags?: string[];
  } }).overview;
  const overviewData = catalogOverview
    ? {
        address: catalogOverview.address || fallbackOverview.address,
        website:
          (brand as { website?: string }).website?.replace(/^https?:\/\//, '') ||
          fallbackOverview.website,
        map: fallbackOverview.map,
        email: catalogOverview.email || fallbackOverview.email,
        phone: catalogOverview.phone || fallbackOverview.phone,
        priceRange: catalogOverview.priceRange || fallbackOverview.priceRange,
        ageRange: catalogOverview.ageFocus
          ? `AGE: ${catalogOverview.ageFocus}`
          : fallbackOverview.ageRange,
        audience: catalogOverview.audience || fallbackOverview.audience,
        services:
          catalogOverview.services && catalogOverview.services.length
            ? catalogOverview.services
            : fallbackOverview.services,
        tags:
          catalogOverview.tags && catalogOverview.tags.length
            ? catalogOverview.tags
            : fallbackOverview.tags,
      }
    : fallbackOverview;

  const getPopularCategoryPreviews = () => {
    const cat = (brand.category || "").toLowerCase();
    const name = brand.name.toLowerCase();
    if (name.includes("choosify")) {
      return [
        {
          label: "BRANDS",
          img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        },
        {
          label: "PRODUCTS",
          img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=600&fit=crop",
        },
        {
          label: "CREATORS",
          img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=600&fit=crop",
        },
      ];
    }
    if (name.includes("fff")) {
      return [
        {
          label: "SOURCING",
          img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400&h=600&fit=crop",
        },
        {
          label: "EXPORT",
          img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=600&fit=crop",
        },
        {
          label: "GARMENTS",
          img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=600&fit=crop",
        },
      ];
    }
    if (
      name.includes("sailor") ||
      name.includes("la reve") ||
      name.includes("yellow") ||
      name.includes("aarong") ||
      cat.includes("fashion") ||
      cat.includes("lifestyle") ||
      cat.includes("clothing") ||
      cat.includes("ethnic")
    ) {
      return [
        {
          label: "PANJABI",
          img: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=400&h=600&fit=crop",
        },
        {
          label: "SUIT",
          img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=600&fit=crop",
        },
        {
          label: "WESTERN",
          img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop",
        },
      ];
    }
    if (
      cat.includes("shoe") ||
      cat.includes("footwear") ||
      name.includes("bata") ||
      name.includes("apex") ||
      name.includes("lotto")
    ) {
      return [
        {
          label: "CASUAL",
          img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=600&fit=crop",
        },
        {
          label: "SNEAKERS",
          img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=600&fit=crop",
        },
        {
          label: "FORMAL",
          img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&h=600&fit=crop",
        },
      ];
    }
    return [
      {
        label: "MOBILES",
        img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=600&fit=crop",
      },
      {
        label: "GEAR",
        img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=600&fit=crop",
      },
      {
        label: "WEARABLES",
        img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=600&fit=crop",
      },
    ];
  };

  const popularCats = getPopularCategoryPreviews();

  const renderBrandLogo = (brandObj: any) => {
    const term = brandObj.name.toLowerCase();
    if (term.includes("choosify")) {
      return (
        <img
          src="https://res.cloudinary.com/djdyqr8yd/image/upload/v1782468737/717067140_122103081177325182_5170626542063953926_n_fiefp6.jpg"
          className="w-full h-full object-cover"
          alt="Choosify Brand"
          referrerPolicy="no-referrer"
        />
      );
    }
    if (term.includes("fff")) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-[#1E293B] w-full text-[#F1F5F9] px-2 py-3 select-none">
          <span className="font-space tracking-wider text-[28px] font-black leading-none">
            FFF
          </span>
          <span className="text-[6px] tracking-[0.2em] font-mono text-gray-400 font-bold uppercase mt-1.5">
            SOURCING LTD
          </span>
        </div>
      );
    }
    if (term.includes("sailor")) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-[#17192C] w-full text-white px-2 py-3 select-none">
          <span className="font-serif tracking-widest text-[24px] font-bold leading-none uppercase">
            sailor
          </span>
          <span className="text-[6px] tracking-[0.25em] font-mono text-gray-400 font-bold uppercase mt-1.5">
            by epyllion
          </span>
        </div>
      );
    }
    if (term.includes("apex")) {
      return (
        <div className="flex items-center justify-center h-full text-center bg-[#EB1C24] w-full text-white font-black italic tracking-tighter text-3xl select-none">
          apex
        </div>
      );
    }
    if (term.includes("bata")) {
      return (
        <div className="flex items-center justify-center h-full text-center bg-[#E60012] w-full text-white font-black text-4xl select-none">
          Bata
        </div>
      );
    }
    if (term.includes("aarong")) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-[#AC1F24] w-full text-white px-2 py-2 select-none">
          <span className="font-serif tracking-widest text-[22px] font-extrabold leading-none uppercase">
            aarong
          </span>
        </div>
      );
    }
    if (term.includes("yellow")) {
      return (
        <div className="flex items-center justify-center h-full text-center bg-[#FFF100] w-full text-navy font-black text-3xl select-none">
          YELLOW
        </div>
      );
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-navy to-[#2A2E6B] flex items-center justify-center text-4xl font-extrabold text-white">
        {brandObj.logo || brandObj.name.substring(0, 2)}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      <div ref={brandHeroRef}>
        <BrandDetailHero
          brand={brand}
          logoNode={renderBrandLogo(brand)}
          claimStatus={localClaimStatus}
          categoryLabel={brand.category || "Fashion & Clothing"}
          onShare={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Share link copied!");
          }}
          onClaim={() => setIsClaimModalOpen(true)}
          onExploreProducts={() => scrollToSection("products-section")}
          websiteUrl={
            (brand as any).website
              ? String((brand as any).website).startsWith("http")
                ? String((brand as any).website)
                : `https://${(brand as any).website}`
              : undefined
          }
          facts={[
            { label: "Products", value: String(totalProductsFound || (brand as any).productCount || (brand as any).products || "120+") },
            { label: "Deals", value: String(totalDealsFound || "24") },
            { label: "Followers", value: "50K+" },
            { label: "Categories", value: "8" },
            { label: "Creators", value: "18" },
            { label: "Since", value: String((brand as any).founded || "2012") },
          ]}
        />
      </div>


      {/* ACTIVE FILTER CHIPS ROW */}
      <ActiveFilterChips
        chips={
          [
            selectedCategory
              ? {
                  id: "category",
                  label: `Category: ${selectedCategory}`,
                  onRemove: () => setSelectedCategory(null),
                }
              : null,
            priceRangeV2[0] > 0 || priceRangeV2[1] !== null
              ? {
                  id: "price",
                  label: `Price: ৳${priceRangeV2[0].toLocaleString()}–${priceRangeV2[1] !== null ? `৳${priceRangeV2[1].toLocaleString()}` : "Max"}`,
                  onRemove: () => {
                    setCustomPriceInputs({ min: "", max: "" });
                    setPriceRangeV2([0, null]);
                  },
                }
              : null,
            availabilityFilter
              ? {
                  id: "availability",
                  label: `Stock: ${availabilityFilter}`,
                  onRemove: () => setAvailabilityFilter(null),
                }
              : null,
            ratingFilter
              ? {
                  id: "rating",
                  label: `Min Rating: ${ratingFilter}★`,
                  onRemove: () => setRatingFilter(null),
                }
              : null,
            votesFilter
              ? {
                  id: "votes",
                  label: `Min Votes: ${votesFilter}♥`,
                  onRemove: () => setVotesFilter(null),
                }
              : null,
            warrantyFilter
              ? {
                  id: "warranty",
                  label: `Warranty: ${warrantyFilter}`,
                  onRemove: () => setWarrantyFilter(null),
                }
              : null,
            deliveryFilter
              ? {
                  id: "delivery",
                  label: `Delivery: ${deliveryFilter}`,
                  onRemove: () => setDeliveryFilter(null),
                }
              : null,
            discountFilter
              ? {
                  id: "discount",
                  label: `Min Discount: ${discountFilter}%`,
                  onRemove: () => setDiscountFilter(null),
                }
              : null,
            couponFilter
              ? {
                  id: "coupon",
                  label: `Coupons: ${couponFilter}`,
                  onRemove: () => setCouponFilter(null),
                }
              : null,
            expiryFilter
              ? {
                  id: "expiry",
                  label: `Expiry: ${expiryFilter}`,
                  onRemove: () => setExpiryFilter(null),
                }
              : null,
            productLineFilter
              ? {
                  id: "product_line",
                  label: `Line: ${productLineFilter}`,
                  onRemove: () => setProductLineFilter(null),
                }
              : null,
            featuredCollectionFilter
              ? {
                  id: "featured_collection",
                  label: `Collection: ${featuredCollectionFilter}`,
                  onRemove: () => setFeaturedCollectionFilter(null),
                }
              : null,
            officialStoreFilter
              ? {
                  id: "official_store",
                  label: `Official: ${officialStoreFilter}`,
                  onRemove: () => setOfficialStoreFilter(null),
                }
              : null,
            countryFilter
              ? {
                  id: "country",
                  label: `Origin: ${countryFilter}`,
                  onRemove: () => setCountryFilter(null),
                }
              : null,
            dealsOnlyFilter
              ? {
                  id: "deals_only",
                  label: "Deals Only",
                  onRemove: () => setDealsOnlyFilter(false),
                }
              : null,
            couponsOnlyFilter
              ? {
                  id: "coupons_only",
                  label: "Coupons Only",
                  onRemove: () => setCouponsOnlyFilter(false),
                }
              : null,
            verifiedOnlyFilter
              ? {
                  id: "verified_only",
                  label: "Verified Only",
                  onRemove: () => setVerifiedOnlyFilter(false),
                }
              : null,
            inStockOnlyFilter
              ? {
                  id: "instock_only",
                  label: "In Stock Only",
                  onRemove: () => setInStockOnlyFilter(false),
                }
              : null,
            featuredOnlyFilter
              ? {
                  id: "featured_only",
                  label: "Featured Only",
                  onRemove: () => setFeaturedOnlyFilter(false),
                }
              : null,
            ...Object.entries(smartSpecs).map(([key, val]) =>
              val
                ? {
                    id: `smart-${key}`,
                    label: `${key.toUpperCase()}: ${val}`,
                    onRemove: () =>
                      setSmartSpecs((prev) => ({
                        ...prev,
                        [key]: null as any,
                      })),
                  }
                : null,
            ),
          ].filter(Boolean) as any[]
        }
        onClearAll={clearAllFilters}
      />

      <DcUnderlineTabs
        tabs={sectionNavItems
          .filter((s) => !s.hidden)
          .map((s) => ({
            id: s.id,
            label: s.label,
            icon:
              s.id === 'deals-section'
                ? '🏷'
                : s.id === 'products-section'
                  ? '📦'
                  : s.id === 'public-reviews-section'
                    ? '💬'
                    : s.id === 'brand-overview-section'
                      ? '◉'
                      : s.id === 'store-location-section'
                        ? '📍'
                        : s.id === 'faq-section'
                          ? '❓'
                          : s.id === 'brand-story-section'
                            ? '📖'
                            : undefined,
          }))}
        activeId={
          activeSectionId === "all"
            ? sectionNavItems.find((s) => !s.hidden)?.id || "deals-section"
            : activeSectionId
        }
        onNavigate={scrollToSection}
        maxWidthClass="max-w-[1440px]"
      />

      {/* 4. Unified Scrollable Body Wrapper */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-10 md:py-12 w-full flex flex-col gap-8">
        <div className={`${DETAIL_SINGLE_FEED}`}>
            {/* Brand Claim Acquisition Card (Part 6) */}
            {(localClaimStatus === "community" ||
              localClaimStatus === "pending") && (
              <div className="bg-gradient-to-r from-[#FFF0E8]/50 to-[#FFE5D9]/30 border-2 border-[#FFE5D9] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-center gap-6 text-left animate-fade-in relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/5 blur-xl rounded-full" />
                <div className="w-12 h-12 rounded-full bg-orange-primary/10 flex items-center justify-center shrink-0 font-bold text-orange-primary">
                  <ShieldCheck className="w-6 h-6 text-orange-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-[#FFF0E8] text-orange-primary border border-[#FFE5D9]">
                    {localClaimStatus === "pending"
                      ? "Verification Pending Review"
                      : "Claim Acquisition Panel"}
                  </span>
                  <h4 className="text-sm font-black text-navy uppercase tracking-tight leading-none mb-1 font-space">
                    {localClaimStatus === "pending"
                      ? "Ownership Claim Under Active Review"
                      : "Are you an authorized representative of this brand?"}
                  </h4>
                  <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                    {localClaimStatus === "pending"
                      ? "Our moderators are actively processing your submitted credentials relative to this brand representative request. Complete access will be unlocked shortly."
                      : "This community brand profile contains curated information from public web indexes. Claim ownership to configure your premium merchant storefront, sync inventory, and unlock the seller suite."}
                  </p>

                  {/* Benefits Grid */}
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-[#1A1D4E] uppercase tracking-widest mb-2 font-mono">
                      Claim ownership to:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 font-bold text-left">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4DBC15] shrink-0" />
                        <span>Add products</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4DBC15] shrink-0" />
                        <span>Launch promotions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4DBC15] shrink-0" />
                        <span>Publish coupons</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4DBC15] shrink-0" />
                        <span>Collaborate with creators</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:col-span-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#4DBC15] shrink-0" />
                        <span>
                          Access business insights & store diagnostics
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 w-full md:w-auto self-stretch flex items-center justify-center">
                  {localClaimStatus === "community" ? (
                    <button
                      onClick={() => {
                        toast.loading(
                          "Initiating secure brand ownership verification link...",
                          { duration: 1500 },
                        );
                        setTimeout(() => {
                          updateBrandClaimStatus(brand.id, "pending");
                          toast.success(
                            "Verification link generated! Ready for credential matching review.",
                          );
                        }, 1500);
                      }}
                      className="w-full md:w-auto px-6 py-3 bg-[#FF000D] hover:brightness-110 text-white font-bold text-[13px] tracking-tight rounded-lg shadow-sm active:scale-95 transition-all text-center cursor-pointer border-none"
                    >
                      Claim Ownership
                    </button>
                  ) : (
                    <div className="px-5 py-3.5 bg-[#FF000D] border border-[#FF000D] rounded-[5px] flex flex-col items-center gap-1 text-center shrink-0">
                      <span className="text-[8px] font-black text-white uppercase tracking-wider">
                        ● Verification Active
                      </span>
                      <span className="text-[12px] font-bold text-white tracking-tight">
                        Under Review
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* B. DEALS + COUPONS — always merged carousel (deals + coupon tiles) */}
            <StudioWrap sectionId="brand-deals" className="scroll-mt-36">
              <div className="flex items-baseline justify-between gap-3 mb-1 text-left">
                <h2 className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight m-0">
                  TOP DEALS & COUPONS ON {brand.name.toUpperCase()}
                </h2>
                <Link
                  to="/deals"
                  className="text-[12px] font-bold text-[#1A1A2E] no-underline hover:text-[#CF4400] shrink-0"
                >
                  VIEW ALL DEALS ›
                </Link>
              </div>
              <p className="text-[11.5px] text-[#9AA0AC] m-0 mb-3.5">
                Limited-time offers on {brand.name} products
              </p>

              {dealsCouponsCarouselItems.length > 0 ? (
                <UniversalCarousel
                  items={dealsCouponsCarouselItems}
                  getKey={(entry, i) =>
                    entry.kind === "deal" ? String(entry.product.id ?? i) : entry.coupon.code
                  }
                  itemWidth={220}
                  gap={14}
                  className="pr-1"
                  autoPlay
                  renderItem={(entry) =>
                    entry.kind === "deal" ? (
                      <ProductCard product={entry.product} variant="grid" />
                    ) : (
                      <BrandCouponCarouselCard coupon={entry.coupon} />
                    )
                  }
                />
              ) : (
                <div className="p-8 text-center bg-white border border-[#E8EDF2] rounded-xl text-gray-400 text-xs font-bold">
                  No deals or coupons available for {brand.name} yet.
                </div>
              )}
            </StudioWrap>

            {/* A. PRODUCTS SECTION — always rendered; grid when catalog matches */}
            <StudioWrap sectionId="brand-catalog" className="scroll-mt-36">
              <div className="flex items-baseline justify-between gap-3 mb-1 text-left">
                <h2 className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight m-0">
                  {brand.name.toUpperCase()} PRODUCTS
                </h2>
                <Link
                  to={`/brands/${brand.id}/products`}
                  className="text-[12px] font-bold text-[#1A1A2E] no-underline hover:text-[#CF4400] shrink-0"
                >
                  VIEW ALL PRODUCTS ›
                </Link>
              </div>
              <p className="text-[11.5px] text-[#9AA0AC] m-0 mb-3.5">
                Explore all products from {brand.name}
              </p>

              {filteredProducts.length > 0 ? (
                <div className={BRAND_FEED_GRID}>
                  {paginatedProducts.map((product: any, i: number) => (
                    <ProductCard
                      key={product.id || i}
                      product={product}
                      variant="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white border border-[#E8EDF2] rounded-xl text-gray-400 text-xs font-bold space-y-2">
                  <p>
                    {brandProducts.length === 0
                      ? `No products listed for ${brand.name} yet.`
                      : "No products match chosen criteria."}
                  </p>
                  {brandProducts.length > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-[#EB4501] underline hover:text-[#ff5d14] text-[10px] cursor-pointer bg-transparent border-0"
                    >
                      Clear Selections
                    </button>
                  )}
                </div>
              )}

              {totalPages > 1 && (
                <PaginationBar
                  currentPage={currentPage}
                  totalPages={totalPages}
                  showingCount={paginatedProducts.length}
                  totalCount={filteredProducts.length}
                  onPageChange={setCurrentPage}
                />
              )}
            </StudioWrap>

            {/* Creator reviews retired — replaced by Brand Story below FAQ */}

          {brandWhatsOnPosts.length > 0 && (
            <div id="campaigns-section" className="scroll-mt-36 w-full">
              <BrandPostCarouselSection
                posts={brandWhatsOnPosts}
                badgeLabel="Events"
                showSponsoredBadge={false}
                title="Events"
                subtitle="Official brand events, launches, and festival announcements."
                viewAllHref="/products"
                viewAllLabel="Explore all events"
              />
            </div>
          )}

          <div id="public-reviews-section" className="scroll-mt-36 w-full">
            <div className="flex items-baseline justify-between gap-3 mb-1 text-left">
              <h3 className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight m-0">
                WHAT CUSTOMERS SAY
              </h3>
            </div>
            <p className="text-[11.5px] text-[#9AA0AC] m-0 mb-3.5">
              Real reviews from verified buyers
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {!brandReviewsLoaded ? (
                <div className="md:col-span-2 py-8 text-center text-[12px] text-[#9AA0AC]">
                  Loading reviews…
                </div>
              ) : brandReviews.length === 0 ? (
                <div className="md:col-span-2 py-10 border border-dashed border-[#E8EDF2] rounded-[10px] flex flex-col items-center justify-center text-center bg-white">
                  <p className="text-[13px] font-medium text-[#9AA0AC]">
                    No customer reviews yet for {brand.name}
                  </p>
                </div>
              ) : (
                brandReviews.map((review) => (
                  <PublicReviewCard
                    key={review.id}
                    review={{
                      name: review.userName,
                      date: (() => {
                        try {
                          return new Date(review.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          });
                        } catch {
                          return review.createdAt;
                        }
                      })(),
                      comment: review.comment,
                      rating: review.rating,
                      verified: true,
                      productName: review.productTitle,
                      avatar: resolvePublicReviewAvatarUrl(
                        review.userAvatar,
                        (review as { avatar?: string }).avatar,
                        (review as { dp?: string }).dp,
                      ),
                    }}
                  />
                ))
              )}
            </div>
          </div>

            <BrandOverviewSection
              brandName={brand.name}
              overviewData={overviewData}
              claimStatus={'claimStatus' in brand ? brand.claimStatus : undefined}
            />

            <BrandWhereToBuySection
              brandName={brand.name}
              stores={(brand as { stores?: CatalogBrandStores }).stores}
            />

            <BrandFaqSection
              brandName={brand.name}
              faq={(brand as { faq?: CatalogBrandFaq[] }).faq}
            />

            <BrandStorySection brandId={brand.id} brandName={brand.name} />

          {/* Trust strip — DC style */}
          <div className="w-full choosify-dark-surface rounded-xl px-7 py-5 text-center text-white">
            <div className="text-[13px] font-extrabold mb-1">
              CHOSEN BY MILLIONS. TRUSTED WORLDWIDE.
            </div>
            <div className="text-[11.5px] text-white/50 mb-5">
              100% authentic products, official warranty & dedicated support from{" "}
              {brand.name}.
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "1M+", label: "Happy Customers" },
                { value: "50+", label: "Countries" },
                { value: "2.4K+", label: "Reviews" },
                { value: "4.3/5", label: "Brand Score" },
              ].map((ts) => (
                <div key={ts.label}>
                  <div className="text-[20px] font-extrabold text-[#EB4501]">
                    {ts.value}
                  </div>
                  <div className="text-[10.5px] text-white/50">{ts.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {(brand as { catalogId?: string })?.catalogId || brand?.id ? (
        <BrandQuickComparison brandId={String((brand as { catalogId?: string })?.catalogId || brand.id)} />
      ) : null}

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        type="brand"
        targetId={String(brand.id)}
        targetName={brand.name}
      />

      <ClaimProfileModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        targetType="brand"
        targetId={brand.id}
        targetName={brand.name}
        onClaimSubmitted={() => {
          setLocalClaimStatus("pending");
        }}
      />
    </div>
  );
}
