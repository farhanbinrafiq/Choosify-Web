import React, { useState, useMemo, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
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
  MessageCircleMore,
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
import { BRAND_CARD_GRID, DETAIL_SINGLE_FEED } from "../lib/pageLayout";
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
import { toast } from '../lib/notify';
import { FollowButton } from "../components/FollowButton";
import { useRegisterPageFilters } from "../components/FilterEngine";
import type { CatalogGuide } from "../types/catalog";
import type { SpotlightContent } from "../types/spotlight/experience/content";
import type { SpotlightPageSectionId } from "../types/spotlight/experience/pageSections";
import {
  isBrandOwnedContent,
  isPageSectionVisible,
  shouldShowCreatorProfileCard,
} from "../lib/spotlight/content/sectionManifestRegistry";
import { resolveContentDetailOptionalSections } from "../lib/spotlight/content/resolveContentDetailSections";
import { catalogGuideHref } from "../lib/spotlight/content";
import { BrandCardDesign, mapBrandToCardDesign } from "../components/BrandCardDesign";
import { SpotlightDetailsDescriptionSection } from "../components/spotlight/experience/SpotlightDetailsDescriptionSection";
import { SpotlightDetailsServicesSection } from "../components/spotlight/experience/SpotlightDetailsServicesSection";
import { SpotlightDetailsRelatedRail } from "../components/spotlight/experience/SpotlightDetailsRelatedRail";
import { ContentDetailOptionalSections } from "../components/contentDetail/ContentDetailOptionalSections";
import { ContentDetailWhatIsDiscussed } from "../components/contentDetail/ContentDetailWhatIsDiscussed";
import { useSpotlightExperience } from "../hooks/useSpotlightExperience";
import { openEmiPanel } from "../lib/emi";
import { EmiAiLogo } from "../components/EmiAiLogo";
import { usePageBreadcrumbs } from "../context/BreadcrumbContext";

const evaluations = evaluationsData as EvaluationData[];

const IconMap = {
  Smartphone: Smartphone,
  Laptop: Laptop,
  Zap: Zap,
  Globe: Globe,
  MessageSquare: MessageCircleMore,
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
  const { pathname } = useLocation();
  const {
    allGuides,
    allBrands,
    addToCart,
    allCatalogProducts,
    allCatalogGuides,
    allCreators,
  } = useGlobalState();
  const { allContent: spotlightAllContent } = useSpotlightExperience();
  const [relatedPlatformFilter, setRelatedPlatformFilter] = useState<string>('all');
  const [relatedTopicFilter, setRelatedTopicFilter] = useState<string>('all');

  const guide =
    spotlightGuideOverride ||
    allGuides.find((b) => String(b.id) === String(id) || (b as any).slug === id) ||
    allGuides[0] ||
    BLOGS.find((b) => b.id === Number(id)) ||
    BLOGS[0];

  usePageBreadcrumbs(
    guide
      ? {
          replaceItems: [
            { name: 'Home', path: '/' },
            { name: 'Discover', path: '/spotlight' },
            { name: 'Buying Guides', path: '/guides' },
            { name: guide.title, path: pathname },
          ],
        }
      : {},
    [guide?.title, pathname],
  );

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

  /**
   * A "canonical" Guide is one backed by a real CatalogGuide record. For those
   * every relationship (products, brands, creator) resolves against the real
   * Choosify catalog — never the mock `PRODUCTS` / `DYNAMIC_GUIDES` fixtures.
   */
  const isCanonicalGuide = useMemo(
    () =>
      (allCatalogGuides ?? []).some(
        (g) => String(g.id) === String(guide?.id) || g.slug === (guide as any)?.slug,
      ) || Boolean(spotlightContent),
    [allCatalogGuides, guide, spotlightContent],
  );

  const sectionProductIds = useMemo(() => {
    const out: string[] = [];
    for (const s of ((guide as any)?.sections ?? []) as Array<{ id: string; data?: any }>) {
      for (const key of ['winnerIds', 'itemIds', 'topPickIds']) {
        const arr = s?.data?.[key];
        if (Array.isArray(arr)) out.push(...arr.map(String));
      }
    }
    return out;
  }, [guide]);

  const guideProductIds = useMemo(() => {
    const raw = [
      ...(((guide as any)?.productIds ?? []) as string[]),
      ...(((guide as any)?.recommendedProducts ?? []) as string[]),
      ...sectionProductIds,
    ].map(String);
    return Array.from(new Set(raw.filter(Boolean)));
  }, [guide, sectionProductIds]);

  /** Canonical products for this guide, in reference order. Unresolved ids drop. */
  const canonicalGuideProducts = useMemo(() => {
    if (!guideProductIds.length) return [];
    const byId = new Map((allCatalogProducts ?? []).map((p: any) => [String(p.id), p]));
    return guideProductIds.map((pid) => byId.get(pid)).filter(Boolean);
  }, [guideProductIds, allCatalogProducts]);

  // ── Part-2 canonical guide fields (off-platform refs, picks, typed winner,
  //    time-boxed offers, social links). Rendered directly off the CatalogGuide
  //    so the additive storefront blocks don't disturb the spotlight resolver. ─
  const guideExternalRefs = useMemo(
    () =>
      (Array.isArray((guide as any)?.externalRefs) ? (guide as any).externalRefs : [])
        .filter((r: any) => r && r.title && r.externalUrl && /^https:\/\//i.test(String(r.externalUrl)))
        .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) as Array<{
        id: string;
        kind: 'product' | 'brand';
        title: string;
        imageUrl?: string;
        externalUrl: string;
        subtitle?: string;
        brandName?: string;
        commentary?: string;
      }>,
    [guide],
  );

  const externalById = useMemo(
    () => new Map(guideExternalRefs.map((r) => [String(r.id), r])),
    [guideExternalRefs],
  );

  const resolveEntityRef = useMemo(() => {
    const productById = new Map((allCatalogProducts ?? []).map((p: any) => [String(p.id), p]));
    const brandByKey = new Map<string, any>();
    for (const b of (allBrands ?? []) as any[]) {
      brandByKey.set(String(b.id), b);
      if (b.catalogId) brandByKey.set(String(b.catalogId), b);
      if (b.slug) brandByKey.set(String(b.slug), b);
    }
    return (ref: { entityType: string; entityId: string }) => {
      if (!ref) return null;
      if (ref.entityType === 'product') {
        const p = productById.get(String(ref.entityId));
        return p ? { kind: 'product' as const, title: p.title, image: p.image, price: p.price, href: `/products/${p.slug || p.id}` } : null;
      }
      if (ref.entityType === 'brand') {
        const b = brandByKey.get(String(ref.entityId));
        return b ? { kind: 'brand' as const, title: b.name, image: b.logo, href: `/brands/${b.slug || b.id}` } : null;
      }
      const x = externalById.get(String(ref.entityId));
      return x
        ? {
            kind: (ref.entityType === 'external_brand' ? 'external_brand' : 'external_product') as
              | 'external_product'
              | 'external_brand',
            title: x.title,
            image: x.imageUrl,
            external: x,
          }
        : null;
    };
  }, [allCatalogProducts, allBrands, externalById]);

  const guideWinner = useMemo(() => {
    const w = ((guide as any)?.sections ?? []).find((s: any) => s.id === 'winner')?.data ?? {};
    const overall = w.overall && w.overall.entityType && w.overall.entityId ? w.overall : null;
    const legacyId =
      !overall && Array.isArray(w.winnerIds) && w.winnerIds.length ? String(w.winnerIds[0]) : '';
    const overallRef = overall || (legacyId ? { entityType: 'product', entityId: legacyId } : null);
    const awards = (Array.isArray(w.awards) ? w.awards : [])
      .filter((a: any) => a && a.label && a.ref && a.ref.entityType && a.ref.entityId)
      .map((a: any) => ({ id: String(a.id || a.label), label: String(a.label), ref: a.ref }));
    return { overallRef, awards };
  }, [guide]);

  const guidePicks = useMemo(() => {
    const p = ((guide as any)?.sections ?? []).find((s: any) => s.id === 'recommendations')?.data
      ?.picks;
    return (Array.isArray(p) ? p : [])
      .filter((x: any) => x && x.label && x.ref && x.ref.entityType && x.ref.entityId)
      .map((x: any) => ({ id: String(x.id || x.label), label: String(x.label), ref: x.ref }));
  }, [guide]);

  const guideSocialLinks = useMemo(
    () =>
      (Array.isArray((guide as any)?.socialLinks) ? (guide as any).socialLinks : [])
        .filter((l: any) => l && l.enabled !== false && /^https:\/\//i.test(String(l.url || '')))
        .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) as Array<{
        id: string;
        platform: string;
        url: string;
        label?: string;
      }>,
    [guide],
  );

  const activeGuideOffers = useMemo(() => {
    if (String((guide as any)?.status) !== 'live') return [];
    const now = Date.now();
    const productById = new Map((allCatalogProducts ?? []).map((p: any) => [String(p.id), p]));
    return (Array.isArray((guide as any)?.liveOffers) ? (guide as any).liveOffers : [])
      .filter((o: any) => o && o.enabled !== false && o.productId)
      .map((o: any) => {
        const p = productById.get(String(o.productId));
        if (!p) return null;
        const start = Date.parse(o.startsAt);
        const end = Date.parse(o.endsAt);
        const hasWindow = Number.isFinite(start) && Number.isFinite(end);
        const isActive = hasWindow && now >= start && now < end;
        const isUpcoming = hasWindow && now < start;
        const isExpired = hasWindow && now >= end;
        const base = Number(p.price) || 0;
        let promo = base;
        if (typeof o.promoPrice === 'number') promo = o.promoPrice;
        else if (o.discountType === 'percent')
          promo = Math.round(base * (1 - Math.min(90, Number(o.discountValue) || 0) / 100));
        else if (o.discountType === 'amount') promo = Math.max(0, base - (Number(o.discountValue) || 0));
        const savings = Math.max(0, base - promo);
        const savingsPct = base > 0 ? Math.round((savings / base) * 100) : 0;
        // "safely derived from canonical endsAt" — a static relative phrase, not a
        // ticking countdown (no fabricated values).
        const msLeft = end - now;
        let endsInLabel = '';
        if (isActive && msLeft > 0) {
          const days = Math.floor(msLeft / 86400000);
          const hours = Math.floor((msLeft % 86400000) / 3600000);
          endsInLabel =
            days >= 1 ? `ends in ${days} day${days === 1 ? '' : 's'}` : hours >= 1 ? `ends in ${hours}h` : 'ends soon';
        }
        return {
          id: String(o.id),
          product: p,
          base,
          promo,
          savings,
          savingsPct,
          isActive,
          isUpcoming,
          isExpired,
          endsInLabel,
          startsAt: o.startsAt,
          endsAt: o.endsAt,
        };
      })
      .filter((x: any) => x && x.promo < x.base);
  }, [guide, allCatalogProducts]);

  const guideBrandIds = useMemo(() => {
    const g = guide as any;
    if (Array.isArray(g?.brandIds) && g.brandIds.length) return g.brandIds.map(String);
    const conn = spotlightContent?.connections?.brandIds;
    if (Array.isArray(conn) && conn.length) return conn.map(String);
    const legacy = ((g?.sections ?? []) as Array<{ id: string; data?: any }>).find(
      (s) => s.id === 'brands_mentioned',
    )?.data?.brandIds;
    return Array.isArray(legacy) ? legacy.map(String) : [];
  }, [guide, spotlightContent]);

  const canonicalGuideBrands = useMemo(() => {
    if (!guideBrandIds.length) return [];
    // `allBrands` carries a numeric `id` plus the real catalog id as `catalogId`.
    const byKey = new Map<string, any>();
    for (const b of (allBrands ?? []) as any[]) {
      byKey.set(String(b.id), b);
      if (b.catalogId) byKey.set(String(b.catalogId), b);
      if (b.slug) byKey.set(String(b.slug), b);
    }
    return guideBrandIds.map((bid: string) => byKey.get(String(bid))).filter(Boolean);
  }, [guideBrandIds, allBrands]);

  // ── Publisher identity (Creator-vs-Brand publisher rule) ──────────────────
  // `publisherType === 'brand'` → the CatalogBrand in `publisherBrandId` is the
  // author (ABOUT THE BRAND, no author card). Otherwise the guide is
  // creator-authored (ABOUT THE AUTHOR). `brandIds` are *mentions* only and never
  // imply authorship — they render as "BRAND MENTIONED".
  const guidePublisherType: 'creator' | 'brand' =
    (guide as any)?.publisherType === 'brand' ? 'brand' : 'creator';
  const publisherBrandId = (guide as any)?.publisherBrandId as string | undefined;

  const publisherBrandCard = useMemo(() => {
    if (guidePublisherType !== 'brand') return null;
    const b = (allBrands ?? []).find(
      (x: any) =>
        String(x.catalogId) === String(publisherBrandId) ||
        String(x.id) === String(publisherBrandId) ||
        String(x.slug) === String(publisherBrandId),
    );
    if (b) return mapBrandToCardDesign(b);
    // Server enrichment: resolved publisher brand identity travels with the guide
    // so a brand-authored guide always renders "About the Brand".
    const pb = (guide as any)?.publisherBrand;
    if (pb && pb.name) {
      return mapBrandToCardDesign({ id: pb.id, name: pb.name, logo: pb.logo, slug: pb.slug });
    }
    return null;
  }, [guidePublisherType, publisherBrandId, allBrands, guide]);

  /** Mentioned brands = canonical brand mentions, excluding the publisher brand itself. */
  const mentionedBrandCards = useMemo(
    () =>
      canonicalGuideBrands
        .filter(
          (b: any) =>
            !(
              guidePublisherType === 'brand' &&
              (String(b?.catalogId) === String(publisherBrandId) ||
                String(b?.id) === String(publisherBrandId))
            ),
        )
        .map((b: any) => mapBrandToCardDesign(b)),
    [canonicalGuideBrands, guidePublisherType, publisherBrandId],
  );

  const canonicalCreator = useMemo(() => {
    const cid = (guide as any)?.creatorId;
    if (!cid) return null;
    const c = (allCreators ?? []).find((x: any) => String(x.id) === String(cid));
    if (!c) return null;
    const followerTotal = Object.values((c.followers ?? {}) as Record<string, string>)
      .map((v) => Number(String(v).replace(/[^0-9.]/g, '')))
      .filter((n) => Number.isFinite(n) && n > 0)
      .reduce((a, b) => a + b, 0);
    return {
      id: c.id,
      name: c.name,
      avatar: c.avatar || (guide as any)?.authorAvatar || '',
      handle: c.handle || c.name,
      verifiedStatus: c.verifiedStatus ? 'Verified creator' : 'Creator',
      bestFor: c.bestFor || 'Creator',
      score: typeof c.score === 'number' && c.score > 0 ? c.score : null,
      followers: followerTotal > 0 ? followerTotal : null,
      reviews: null as number | null,
      rating: null as number | null,
      platforms: Array.isArray(c.platforms) ? c.platforms : [],
    };
  }, [guide, allCreators]);

  const creator = useMemo(() => {
    // Canonical guide → real creator record only (no fabricated stats).
    if (isCanonicalGuide) {
      if (canonicalCreator) return canonicalCreator;
      if ((guide as any)?.author) {
        return {
          id: (guide as any).creatorId || 'creator-editorial',
          name: (guide as any).author,
          avatar: (guide as any).authorAvatar || '',
          handle: (guide as any).author,
          verifiedStatus: 'Choosify Editorial',
          bestFor: 'Choosify Editorial',
          score: null as number | null,
          followers: null as number | null,
          reviews: null as number | null,
          rating: null as number | null,
          platforms: [] as string[],
        };
      }
      return null;
    }
    // Non-canonical demo/legacy path keeps the mock creator.
    const fromDynamic = dynamicData.creator as any;
    if (fromDynamic?.name) return fromDynamic;
    const pub = spotlightContent?.publisher;
    if (
      pub &&
      (pub.publisherType === 'creator' ||
        pub.publisherType === 'influencer' ||
        pub.publisherType === 'editorial_team')
    ) {
      return {
        id: pub.publisherId || 'creator-editorial',
        name: pub.name || guide?.author || 'Choosify Editorial',
        avatar: pub.logoUrl || (guide as any)?.authorAvatar,
        handle: pub.name,
        verifiedStatus: pub.isVerified ? 'Verified creator' : 'Choosify Editor',
        bestFor: 'Choosify Editor',
        platforms: [],
      };
    }
    return fromDynamic;
  }, [isCanonicalGuide, canonicalCreator, dynamicData.creator, spotlightContent?.publisher, guide]);
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

  // Exactly one primary publisher identity block:
  //   creator publisher → ABOUT THE AUTHOR   (never also a brand author card)
  //   brand publisher   → ABOUT THE BRAND    (never also an author card)
  const showCreatorCard =
    guidePublisherType === 'creator' &&
    Boolean(creator) &&
    (!spotlightContent ||
      isCanonicalGuide ||
      shouldShowCreatorProfileCard(spotlightContent));
  const showPublisherBrandCard = guidePublisherType === 'brand' && Boolean(publisherBrandCard);

  // Non-publisher brand relationships rendered separately as "BRAND MENTIONED".
  const showBrandMentioned = mentionedBrandCards.length > 0;

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

  // Love / Helpful / Purchased have no canonical persistence yet — start empty
  // and render "—" for zero counts (see DECISION 12: no fabricated engagement).
  const [interactions, setInteractions] = useState({
    loved: 0,
    isLoved: false,
    helpful: 0,
    isHelpful: false,
    purchases: 0,
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

  // Products related to this guide.
  //  - Canonical guide  → real catalog products resolved from productIds /
  //    section ids only. Unresolved ids simply drop (honest missing relation);
  //    the mock `PRODUCTS` catalog is never substituted.
  //  - Non-canonical demo/legacy path keeps the old category-matched fixtures.
  const legacyGuideProducts = useMemo(() => {
    const recommendedProductIds = (guide as any).recommendedProducts || [];
    return PRODUCTS.filter((p) => {
      if (recommendedProductIds.includes(p.id)) return true;
      const guideCategory = (guide.category || '').toLowerCase();
      const productCategory = (p.category || '').toLowerCase();
      if (guideCategory.includes('mobile') && productCategory.includes('phone')) return true;
      if (guideCategory.includes('fashion') && productCategory.includes('fashion')) return true;
      if (guideCategory.includes('gaming') && productCategory.includes('gaming')) return true;
      if (guideCategory.includes('home') && productCategory.includes('home')) return true;
      if (guideCategory.includes('beauty') && productCategory.includes('beauty')) return true;
      return false;
    });
  }, [guide]);

  const allGuideProducts = isCanonicalGuide ? canonicalGuideProducts : legacyGuideProducts;

  const displayProducts = isCanonicalGuide
    ? allGuideProducts.slice(0, visibleCount)
    : allGuideProducts.length > 0
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
  // Canonical guide → honest values from the record; legacy/demo keeps a nominal display.
  const guideViewCount = useMemo(() => {
    const raw = Number(String((guide as any)?.views ?? '').replace(/[^0-9.]/g, ''));
    if (Number.isFinite(raw) && raw > 0) return raw;
    return isCanonicalGuide ? 0 : 12_480;
  }, [guide, isCanonicalGuide]);
  const guideLastUpdated = useMemo(() => {
    const iso = (guide as any)?.updatedAt || (guide as any)?.publishedAt;
    if (iso) {
      const d = new Date(iso);
      if (!Number.isNaN(d.getTime()))
        return `Updated ${d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`;
    }
    return isCanonicalGuide ? '' : 'Updated June 2026';
  }, [guide, isCanonicalGuide]);
  const viewCountLabel = guideViewCount > 0 ? guideViewCount.toLocaleString() : '—';
  const metricLabel = (n: number) => (n > 0 ? n.toLocaleString() : '—');
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
              showLiveBadge={showSection('live_status')}
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
              {viewCountLabel}
            </div>
            <div className="text-[10px] text-[#9AA0AC] mt-0.5">Views</div>
          </div>
          <div>
            <div className="text-[15px] font-extrabold text-[#1A1A2E] tabular-nums">
              {metricLabel(interactions.loved)}
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
              {metricLabel(interactions.helpful)}
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
              {metricLabel(interactions.purchases)}
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
                {[guideLastUpdated, guideReadTime, guideViewCount > 0 ? `${viewCountLabel} views` : null]
                  .filter(Boolean)
                  .join(' · ')}
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
              <EmiAiLogo size={20} />
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

              {/* Optional sections — order/visibility from content.sections config.
                  `products` is the FULL resolved set so winnerIds / itemIds /
                  topPickIds resolve against every referenced product, not just
                  the visible slice. Canonical guides resolve these against the
                  real catalog only. */}
              <ContentDetailOptionalSections
                sections={optionalSections}
                ctx={{
                  content: spotlightContent ?? null,
                  category: spotlightContent?.category ?? guide?.category,
                  products: allGuideProducts,
                  hasMoreProducts: allGuideProducts.length > displayProducts.length,
                  onLoadMoreProducts: () => setVisibleCount((prev) => prev + 4),
                }}
              />

                {/* ── Overall winner + category awards (typed refs; optional) ── */}
                {(guideWinner.overallRef || guideWinner.awards.length > 0) && (() => {
                  const overall = guideWinner.overallRef ? resolveEntityRef(guideWinner.overallRef) : null;
                  if (!overall && !guideWinner.awards.length) return null;
                  return (
                    <section id="winner" className="scroll-mt-36 mt-9 w-full text-left">
                      <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-wide mb-3.5 flex items-center gap-1.5">
                        <Award size={14} className="text-[#EB4501]" /> OVERALL WINNER
                      </div>
                      {overall && (
                        <a
                          href={(overall as any).href || (overall as any).external?.externalUrl || '#'}
                          target={(overall as any).external ? '_blank' : undefined}
                          rel={(overall as any).external ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-3 bg-white border border-[#E8EDF2] rounded-[10px] p-3 max-w-md hover:border-[#EB4501]/40 transition-colors"
                        >
                          <div className="w-16 h-16 rounded-lg bg-[#F4F7F9] overflow-hidden shrink-0">
                            {overall.image ? (
                              <img src={overall.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            {(overall as any).external ? (
                              <span className="text-[8px] font-extrabold text-[#6B7280] bg-[#F3F4F6] rounded px-1 py-0.5 uppercase">
                                {overall.kind === 'external_brand' ? 'External Brand' : 'External Product'}
                              </span>
                            ) : null}
                            <div className="text-[13px] font-extrabold text-[#1A1A2E] line-clamp-2">{overall.title}</div>
                            {'price' in overall && overall.price ? (
                              <div className="text-[12px] font-bold text-[#EB4501]">৳{Number(overall.price).toLocaleString()}</div>
                            ) : null}
                          </div>
                        </a>
                      )}
                      {guideWinner.awards.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                          {guideWinner.awards.map((a: any) => {
                            const r = resolveEntityRef(a.ref);
                            if (!r) return null;
                            return (
                              <div key={a.id}>
                                <div className="text-[9px] font-extrabold text-[#EB4501] uppercase tracking-wide mb-1">{a.label}</div>
                                <a
                                  href={(r as any).href || (r as any).external?.externalUrl || '#'}
                                  target={(r as any).external ? '_blank' : undefined}
                                  rel={(r as any).external ? 'noopener noreferrer' : undefined}
                                  className="flex items-center gap-2 bg-white border border-[#E8EDF2] rounded-[10px] p-2 hover:border-[#EB4501]/40 transition-colors"
                                >
                                  <div className="w-10 h-10 rounded-md bg-[#F4F7F9] overflow-hidden shrink-0">
                                    {r.image ? <img src={r.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : null}
                                  </div>
                                  <div className="text-[11.5px] font-bold text-[#1A1A2E] line-clamp-2">{r.title}</div>
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </section>
                  );
                })()}

                {/* ── Recommendations / Picks (labelled, no ranking) ── */}
                {guidePicks.length > 0 && (
                  <section id="picks" className="scroll-mt-36 mt-9 w-full text-left">
                    <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-wide mb-3.5">
                      RECOMMENDATIONS &amp; PICKS
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {guidePicks.map((p: any) => {
                        const r = resolveEntityRef(p.ref);
                        if (!r) return null;
                        return (
                          <div key={p.id}>
                            <div className="text-[9px] font-extrabold text-[#8A00C4] uppercase tracking-wide mb-1">{p.label}</div>
                            <a
                              href={(r as any).href || (r as any).external?.externalUrl || '#'}
                              target={(r as any).external ? '_blank' : undefined}
                              rel={(r as any).external ? 'noopener noreferrer' : undefined}
                              className="flex items-center gap-2 bg-white border border-[#E8EDF2] rounded-[10px] p-2 hover:border-[#8A00C4]/40 transition-colors"
                            >
                              <div className="w-11 h-11 rounded-md bg-[#F4F7F9] overflow-hidden shrink-0">
                                {r.image ? <img src={r.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : null}
                              </div>
                              <div className="min-w-0">
                                {(r as any).external ? (
                                  <span className="text-[8px] font-extrabold text-[#6B7280] bg-[#F3F4F6] rounded px-1 py-0.5 uppercase">
                                    {r.kind === 'external_brand' ? 'External Brand' : 'External Product'}
                                  </span>
                                ) : null}
                                <div className="text-[11.5px] font-bold text-[#1A1A2E] line-clamp-2">{r.title}</div>
                              </div>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* ── Time-boxed guide offers (never mutates base product price) ── */}
                {activeGuideOffers.length > 0 && (
                  <section id="guide-offers" className="scroll-mt-36 mt-9 w-full text-left">
                    <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-wide mb-3.5">
                      LIMITED GUIDE OFFERS
                    </div>
                    <div className="space-y-2.5">
                      {activeGuideOffers.map((o: any) => (
                        <div
                          key={o.id}
                          className={cn(
                            'rounded-[12px] border p-3.5',
                            o.isActive
                              ? 'bg-[#FFF7F3] border-[#F5B79E]'
                              : 'bg-white border-[#E8EDF2]',
                          )}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-14 h-14 rounded-lg bg-[#F4F7F9] overflow-hidden shrink-0">
                                {o.product.image ? (
                                  <img src={o.product.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : null}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  {o.isActive ? (
                                    <span className="inline-flex items-center gap-1 text-[8.5px] font-extrabold text-white bg-[#EB4501] rounded px-1.5 py-0.5 uppercase tracking-wide">
                                      <Zap size={9} /> LIVE offer
                                    </span>
                                  ) : o.isUpcoming ? (
                                    <span className="text-[8.5px] font-extrabold text-[#6B7280] bg-[#F3F4F6] rounded px-1.5 py-0.5 uppercase tracking-wide">
                                      Starts {new Date(o.startsAt).toLocaleDateString()}
                                    </span>
                                  ) : (
                                    <span className="text-[8.5px] font-extrabold text-[#6B7280] bg-[#F3F4F6] rounded px-1.5 py-0.5 uppercase tracking-wide">
                                      Offer ended
                                    </span>
                                  )}
                                </div>
                                <div className="text-[12.5px] font-bold text-[#1A1A2E] truncate">{o.product.title}</div>
                                {o.isActive ? (
                                  <div className="text-[11px] mt-0.5">
                                    <span className="font-extrabold text-[#EB4501] text-[13px]">৳{Number(o.promo).toLocaleString()}</span>{' '}
                                    <span className="line-through text-[#9AA0AC]">৳{Number(o.base).toLocaleString()}</span>{' '}
                                    <span className="font-bold text-[#059669]">
                                      save ৳{Number(o.savings).toLocaleString()}
                                      {o.savingsPct ? ` (${o.savingsPct}%)` : ''}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-[11px] mt-0.5">
                                    <span className="font-bold text-[#1A1A2E]">৳{Number(o.base).toLocaleString()}</span>{' '}
                                    <span className="text-[10px] text-[#9AA0AC]">— standard price</span>
                                  </div>
                                )}
                                <div className="text-[10px] text-[#9AA0AC] mt-0.5">
                                  {o.isActive
                                    ? `Offer ends ${new Date(o.endsAt).toLocaleString()}${o.endsInLabel ? ` · ${o.endsInLabel}` : ''}`
                                    : o.isUpcoming
                                      ? `Runs ${new Date(o.startsAt).toLocaleDateString()} – ${new Date(o.endsAt).toLocaleDateString()}`
                                      : `Ended ${new Date(o.endsAt).toLocaleString()}`}
                                </div>
                              </div>
                            </div>
                            {o.isActive ? (
                              <button
                                type="button"
                                onClick={() =>
                                  addToCart(
                                    {
                                      ...o.product,
                                      guideOfferRef: {
                                        guideId: String((guide as any).id),
                                        productId: String(o.product.id),
                                      },
                                      expectedUnitPrice: o.promo,
                                    },
                                    1,
                                  )
                                }
                                className="px-4 py-2 rounded-full bg-orange-primary hover:brightness-110 text-white text-[11px] font-bold transition-all"
                              >
                                Add to Cart · ৳{Number(o.promo).toLocaleString()}
                              </button>
                            ) : (
                              <Link
                                to={`/products/${o.product.slug || o.product.id}`}
                                className="px-4 py-2 rounded-full border border-[#E8EDF2] text-[#374151] text-[11px] font-bold"
                              >
                                View product
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#9AA0AC] mt-2">
                      Guide offers are time-boxed and re-verified at checkout with server time. If an offer changes or
                      ends while an item is in your cart, you’ll be shown the updated total to review before you pay —
                      you’re never charged a different amount silently.
                    </p>
                  </section>
                )}

                {/* ── Off-platform product / brand references (editorial only) ── */}
                {guideExternalRefs.length > 0 && (
                  <section id="off-platform" className="scroll-mt-36 mt-9 w-full text-left">
                    <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-wide mb-3.5">
                      ALSO MENTIONED — OFF PLATFORM
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {guideExternalRefs.map((x) => (
                        <a
                          key={x.id}
                          href={x.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden hover:border-[#2563EB]/40 transition-colors"
                        >
                          <div className="aspect-[16/10] bg-[#F4F7F9]">
                            {x.imageUrl ? (
                              <img src={x.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : null}
                          </div>
                          <div className="p-3">
                            <span className="text-[8px] font-extrabold text-[#6B7280] bg-[#F3F4F6] rounded px-1 py-0.5 uppercase">
                              {x.kind === 'brand' ? 'External Brand' : 'External Product'}
                            </span>
                            <div className="text-[12px] font-bold text-[#1A1A2E] line-clamp-2 mt-1">{x.title}</div>
                            {x.brandName ? <div className="text-[10px] text-[#9AA0AC]">{x.brandName}</div> : null}
                            {x.commentary ? (
                              <p className="text-[11px] text-[#4B5563] mt-1 line-clamp-2 m-0">{x.commentary}</p>
                            ) : null}
                            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB]">
                              {x.kind === 'brand' ? 'Visit Brand' : 'Visit Product'} <Globe size={11} />
                            </div>
                            <p className="text-[9px] text-[#9AA0AC] mt-1 m-0">
                              External link — interaction takes place outside Choosify
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── Continue watching / social links (guide-scoped) ── */}
                {guideSocialLinks.length > 0 && (
                  <section id="continue-watching" className="scroll-mt-36 mt-9 w-full text-left">
                    <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-wide mb-3.5">
                      CONTINUE WATCHING
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {guideSocialLinks.map((l) => (
                        <a
                          key={l.id}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#E8EDF2] bg-white px-3.5 py-2 text-[11px] font-bold text-[#1A1A2E] hover:border-[#EB4501]/40"
                        >
                          {l.label || `Continue on ${l.platform}`} <Globe size={12} />
                        </a>
                      ))}
                    </div>
                  </section>
                )}

                {/* Primary publisher identity — brand author only. */}
                {showPublisherBrandCard && publisherBrandCard && (
                  <section
                    id="reviewer-profile"
                    className="scroll-mt-36 mt-9 w-full text-left"
                    aria-labelledby="about-the-brand-heading"
                  >
                    <div
                      id="about-the-brand-heading"
                      className="text-[11px] font-extrabold text-[#1A1A2E] tracking-wide mb-3.5"
                    >
                      ABOUT THE BRAND
                    </div>
                    <div className={BRAND_CARD_GRID}>
                      <BrandCardDesign brand={publisherBrandCard} />
                    </div>
                  </section>
                )}

                {/* Brands the guide mentions / discusses — never authorship. */}
                {showBrandMentioned && (
                  <section
                    id="brands-mentioned"
                    className="scroll-mt-36 mt-9 w-full text-left"
                    aria-labelledby="brand-mentioned-heading"
                  >
                    <div
                      id="brand-mentioned-heading"
                      className="text-[11px] font-extrabold text-[#1A1A2E] tracking-wide mb-3.5"
                    >
                      BRAND MENTIONED
                    </div>
                    <div className={BRAND_CARD_GRID}>
                      {mentionedBrandCards.map((b) => (
                        <BrandCardDesign key={b.id} brand={b} />
                      ))}
                    </div>
                  </section>
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
                            {typeof creator.reviews === 'number' ? creator.reviews : '—'}
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
                              : '—'}
                          </div>
                          <div className="text-[9.5px] text-[#9AA0AC]">Followers</div>
                        </div>
                        <div className="w-px h-[26px] bg-[#F1F1F3]" />
                        <div className="flex-1">
                          <div className="text-[14px] font-extrabold text-[#1A1A2E]">
                            {typeof creator.score === 'number' ? creator.score : '—'}
                          </div>
                          <div className="text-[9.5px] text-[#9AA0AC]">Score</div>
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
                        className="block w-full choosify-dark-surface hover:brightness-110 text-white text-center py-[9px] rounded-lg text-[11.5px] font-bold transition-[filter]"
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