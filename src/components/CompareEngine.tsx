import { brandPath, creatorPath, guidePath, productPath } from '../../lib/publicUrls';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ShieldCheck, ShoppingBag, ChevronDown, ChevronUp, X, Sparkles, Trophy, Scale,
  Users, BookOpen, Layers, Share2, Trash2, Star, Tag, Truck,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useRegisterPageFilters, useDragScroll } from './FilterEngine';
import { EmiAiLogo } from './EmiAiLogo';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from '../lib/notify';
import { openEmiPanel } from '../lib/emi';
import { Link, useLocation } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { SponsoredProductTile } from './commerce/AdvertiseHereCard';
import { useSponsoredPlacementsForSurface } from '../hooks/useSponsoredPlacementsForSurface';
import { getCompareLockedCategory, isSameCompareCategory } from '../utils/compareCategory';
import {
  DECISION_PROFILES,
  ENTITY_NOUN,
  MAX_COMPARE_ITEMS,
  SECTIONS_FOR,
  brandColumn,
  compareShareUrl,
  creatorColumn,
  decideWinner,
  emiFacts,
  entityTypeForMode,
  guideColumn,
  metricDiffers,
  parseCompareQuery,
  productColumn,
  profileFor,
  reviewStats,
  verdictText,
  type CompareColumn,
  type CompareEntityType,
  type CompareMode,
  type DecisionProfileId,
} from './compare/compareModel';
import { useOrganicAlternatives, usePublicReviews } from './compare/useCompareData';

type OtherSelection = { brand: string[]; creator: string[]; guide: string[] };
const EMPTY_OTHER: OtherSelection = { brand: [], creator: [], guide: [] };
const OTHER_SELECTION_KEY = 'choosify_compare_selection_v1';

function readOtherSelection(): OtherSelection {
  try {
    const raw = JSON.parse(sessionStorage.getItem(OTHER_SELECTION_KEY) || 'null');
    if (!raw || typeof raw !== 'object') return EMPTY_OTHER;
    const list = (v: unknown) => (Array.isArray(v) ? v.map(String).slice(0, MAX_COMPARE_ITEMS) : []);
    return { brand: list(raw.brand), creator: list(raw.creator), guide: list(raw.guide) };
  } catch {
    return EMPTY_OTHER;
  }
}

const SECTION_ICON: Record<string, React.ReactNode> = {
  pricing: <Tag size={16} />,
  reviews: <Star size={16} />,
  availability: <Truck size={16} />,
  trust: <ShieldCheck size={16} />,
  catalog: <ShoppingBag size={16} />,
  reach: <Users size={16} />,
  content: <Sparkles size={16} />,
  coverage: <Layers size={16} />,
  about: <BookOpen size={16} />,
};

const brandKey = (b: { catalogId?: string; id: number | string }) => String(b.catalogId ?? b.id);
/** Storefront products use legacy numeric ids; the catalog id is what reviews, guides and links key on. */
const productKey = (p: { catalogId?: string; id: number | string }) => String(p.catalogId ?? p.id);

export function CompareEngine() {
  const { comparedProducts = [], setComparedProducts, addToCompare } = useDashboard() || {};
  const { allProducts, allBrands, allCreators, allCatalogGuides, catalogReady } = useGlobalState();
  const location = useLocation();

  // ==========================================
  // CANONICAL COMPARISON STATE
  //   products → DashboardContext compare tray (shared with Add to Compare buttons)
  //   brands / creators / guides → this page's per-type selection
  //   mode → which entity type is being compared (never converts selections)
  // ==========================================
  const initialQuery = useMemo(() => parseCompareQuery(location.search), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [compareMode, setCompareMode] = useState<CompareMode>(initialQuery.mode ?? 'product');
  const [otherSel, setOtherSel] = useState<OtherSelection>(readOtherSelection);
  const [profileId, setProfileId] = useState<DecisionProfileId | null>(null);
  const [emiOpen, setEmiOpen] = useState(false);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const { ref: stickyNavTrackRef, props: stickyNavTrackProps } = useDragScroll({ grabCursor: false });
  const emiRef = useRef<HTMLDivElement | null>(null);
  const entityType: CompareEntityType = entityTypeForMode(compareMode);
  const noun = ENTITY_NOUN[entityType];

  useEffect(() => {
    try {
      sessionStorage.setItem(OTHER_SELECTION_KEY, JSON.stringify(otherSel));
    } catch {
      /* private mode — selection still works for this visit */
    }
  }, [otherSel]);

  // Shared link (?mode=&ids=) restores ONLY those real entities, once the catalog has loaded.
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current || !initialQuery.ids.length) return;
    const type = entityTypeForMode(initialQuery.mode ?? 'product');
    if (type === 'product') {
      // Resolve only against the settled catalog — never the temporary pre-hydrate list.
      if (!catalogReady || !allProducts.length || !setComparedProducts) return;
      const found = initialQuery.ids
        .map((id) => allProducts.find((p: any) => productKey(p) === id || String(p.id) === id || p.slug === id))
        .filter(Boolean) as any[];
      const locked = getCompareLockedCategory(found.slice(0, 1));
      setComparedProducts(found.filter((p) => isSameCompareCategory(p, locked)).slice(0, MAX_COMPARE_ITEMS));
    } else {
      setOtherSel((s) => ({ ...s, [type]: initialQuery.ids }));
    }
    restoredRef.current = true;
  }, [initialQuery, allProducts, setComparedProducts, catalogReady]);

  // ── Resolve the selection against the real catalogs (unknown ids are dropped) ──
  const selectedProducts = useMemo(
    () =>
      (comparedProducts || []).map((stored: any) => allProducts.find((p: any) => productKey(p) === productKey(stored)) ?? stored),
    [comparedProducts, allProducts],
  );
  const selectedBrands = useMemo(
    () => otherSel.brand.map((id) => allBrands.find((b) => brandKey(b) === id)).filter(Boolean) as typeof allBrands,
    [otherSel.brand, allBrands],
  );
  const selectedCreators = useMemo(
    () => otherSel.creator.map((id) => allCreators.find((c) => String(c.id) === id)).filter(Boolean) as typeof allCreators,
    [otherSel.creator, allCreators],
  );
  const liveGuides = useMemo(() => allCatalogGuides.filter((g) => g.status === 'live'), [allCatalogGuides]);
  const selectedGuides = useMemo(
    () => otherSel.guide.map((id) => liveGuides.find((g) => String(g.id) === id)).filter(Boolean) as typeof liveGuides,
    [otherSel.guide, liveGuides],
  );

  const selectedIds = useMemo(() => {
    if (entityType === 'product') return selectedProducts.map((p: any) => productKey(p));
    if (entityType === 'brand') return selectedBrands.map(brandKey);
    if (entityType === 'creator') return selectedCreators.map((c) => String(c.id));
    return selectedGuides.map((g) => String(g.id));
  }, [entityType, selectedProducts, selectedBrands, selectedCreators, selectedGuides]);

  // Keep the address bar in step with the real selection (so a copied URL is honest too).
  useEffect(() => {
    const url = compareMode === 'product' && !selectedIds.length ? '/compare' : compareShareUrl('', compareMode, selectedIds);
    if (`${window.location.pathname}${window.location.search}` !== url) window.history.replaceState(window.history.state, '', url);
  }, [compareMode, selectedIds]);

  // ── Real review data for the selected subjects ──
  const reviewKeys = useMemo(
    () => (entityType === 'product' ? selectedIds : entityType === 'brand' ? selectedBrands.map((b) => b.name) : []),
    [entityType, selectedIds, selectedBrands],
  );
  const { byKey: publicReviews, loading: reviewsLoading } = usePublicReviews(entityType, reviewKeys);

  const guidesFeaturing = (productId?: string, brandId?: string) =>
    liveGuides.filter((g) =>
      productId ? (g.productIds || []).map(String).includes(productId) : brandId ? (g.brandIds || []).map(String).includes(brandId) : false,
    );
  const guideAuthor = (g: (typeof liveGuides)[number]) => {
    if (g.publisherType === 'brand' && g.publisherBrand?.name) return g.publisherBrand.name;
    const creator = g.creatorId ? allCreators.find((c) => String(c.id) === String(g.creatorId)) : undefined;
    return creator?.name || g.author || '';
  };

  // ── Derived columns: the ONLY data every section renders ──
  const columns: CompareColumn[] = useMemo(() => {
    if (entityType === 'product') {
      return selectedProducts.map((p: any) =>
        productColumn(p, {
          stats: reviewStats(publicReviews[productKey(p)]),
          creatorGuideCount: guidesFeaturing(productKey(p)).length,
          href: productPath(p),
        }),
      );
    }
    if (entityType === 'brand') {
      return selectedBrands.map((b) => {
        const key = brandKey(b);
        const prices = allProducts
          .filter((p: any) => String(p.catalogBrandId ?? '') === key && Number(p.price) > 0)
          .map((p: any) => Number(p.price));
        return brandColumn(b as any, {
          productCount: allProducts.filter((p: any) => String(p.catalogBrandId ?? '') === key).length,
          minPrice: prices.length ? Math.min(...prices) : null,
          maxPrice: prices.length ? Math.max(...prices) : null,
          publicStats: reviewStats(publicReviews[b.name]),
          creatorGuideCount: guidesFeaturing(undefined, key).length,
          href: brandPath(b),
        });
      });
    }
    if (entityType === 'creator') {
      return selectedCreators.map((c) =>
        creatorColumn(c as any, {
          liveGuideCount: liveGuides.filter((g) => String(g.creatorId ?? '') === String(c.id)).length,
          href: creatorPath(c),
        }),
      );
    }
    return selectedGuides.map((g) => guideColumn(g as any, { authorName: guideAuthor(g), href: guidePath(g) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, selectedProducts, selectedBrands, selectedCreators, selectedGuides, publicReviews, liveGuides, allProducts, allCreators]);

  const sections = SECTIONS_FOR[entityType];
  const profiles = DECISION_PROFILES[entityType];
  const activeProfile = profileFor(entityType, profileId);
  const profilePick = activeProfile?.pick ? activeProfile.pick(columns) : null;
  const matches = (c: CompareColumn) => (activeProfile?.filter ? activeProfile.filter(c) : true);
  const winner = useMemo(() => decideWinner(columns, entityType), [columns, entityType]);
  const winnerId = winner.kind === 'winner' ? winner.column.id : null;
  const hasSelection = columns.length > 0;

  // ── Actions ──
  const switchMode = (mode: CompareMode) => {
    setCompareMode(mode);
    setProfileId(null);
    setEmiOpen(false);
    setPickerQuery('');
  };

  const removeSubject = (id: string) => {
    if (entityType === 'product') {
      setComparedProducts?.((prev: any[]) => prev.filter((p: any) => productKey(p) !== String(id)));
    } else {
      setOtherSel((s) => ({ ...s, [entityType]: s[entityType as keyof OtherSelection].filter((x) => x !== id) }));
    }
  };

  const addSubject = (id: string, product?: any) => {
    if (columns.length >= MAX_COMPARE_ITEMS) {
      toast.error(`You can compare up to ${MAX_COMPARE_ITEMS} ${noun.many} at a time. Remove one to add another.`);
      return;
    }
    if (entityType === 'product') {
      if (product && addToCompare) addToCompare(product);
      return;
    }
    setOtherSel((s) => {
      const list = s[entityType as keyof OtherSelection];
      return list.includes(id) ? s : { ...s, [entityType]: [...list, id] };
    });
  };

  const handleClearAll = () => {
    setComparedProducts?.([]);
    setOtherSel(EMPTY_OTHER);
    setProfileId(null);
    setEmiOpen(false);
    setShowDifferencesOnly(false);
    toast.success('Comparison cleared');
  };

  const handleShare = async () => {
    if (!hasSelection) {
      toast.error(`Add ${noun.many} to compare before sharing.`);
      return;
    }
    const url = compareShareUrl(window.location.origin, compareMode, selectedIds);
    try {
      if (navigator.share) {
        await navigator.share({ title: `Choosify — ${noun.title}`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success('Comparison link copied');
    } catch {
      toast.error('Unable to share right now');
    }
  };

  const askEmi = () => {
    setEmiOpen(true);
    window.setTimeout(() => emiRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  // ── Picker (searches ONLY the active entity type's real catalog) ──
  const compareLockedCategory = useMemo(() => getCompareLockedCategory(selectedProducts), [selectedProducts]);
  const pickerResults = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    const hit = (...vals: unknown[]) => !q || vals.filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
    const taken = new Set(selectedIds);
    if (entityType === 'product') {
      return allProducts
        .filter((p: any) => !taken.has(productKey(p)))
        .filter((p: any) => isSameCompareCategory(p, compareLockedCategory))
        .filter((p: any) => hit(p.title, p.brand, p.brandName, p.category, p.categoryName))
        .slice(0, 12)
        .map((p: any) => ({ id: productKey(p), title: p.title || p.name, sub: [p.brandName || p.brand, p.category].filter(Boolean).join(' · '), image: (p.images && p.images[0]) || p.image, price: Number(p.price) > 0 ? Number(p.price) : null, href: productPath(p), product: p }));
    }
    if (entityType === 'brand') {
      return allBrands
        .filter((b) => !taken.has(brandKey(b)))
        .filter((b) => hit(b.name, b.category))
        .slice(0, 12)
        .map((b) => ({ id: brandKey(b), title: b.name, sub: b.category || '', image: /^(https?:)?\/\//.test(b.logo || '') || (b.logo || '').startsWith('/') ? b.logo : '', price: null, href: brandPath(b), product: undefined }));
    }
    if (entityType === 'creator') {
      return allCreators
        .filter((c) => !taken.has(String(c.id)))
        .filter((c) => hit(c.name, c.bestFor, c.handle))
        .slice(0, 12)
        .map((c) => ({ id: String(c.id), title: c.name, sub: c.bestFor || '', image: c.avatar || '', price: null, href: creatorPath(c), product: undefined }));
    }
    return liveGuides
      .filter((g) => !taken.has(String(g.id)))
      .filter((g) => hit(g.title, g.author, g.excerpt))
      .slice(0, 12)
      .map((g) => ({ id: String(g.id), title: g.title, sub: guideAuthor(g), image: g.image || '', price: null, href: guidePath(g), product: undefined }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, pickerQuery, allProducts, allBrands, allCreators, liveGuides, selectedIds, compareLockedCategory]);

  // ── Sticky decision-profile nav (also feeds the mobile filter drawer) ──
  const STICKY_PILL_BASE =
    'shrink-0 px-4 py-2.5 sm:py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap touch-manipulation min-h-[40px] sm:min-h-0';
  const STICKY_PILL_ACTIVE = 'bg-[#FF5B00] text-white border border-[#FF5B00]';
  const STICKY_PILL_INACTIVE = 'bg-white text-[#1A1A2E] border border-[#E8EDF2] hover:border-[#FF5B00]/40 hover:text-[#EF3C23]';

  const compareModeOptions = [
    { id: 'product' as const, label: 'Product Compare', icon: <ShoppingBag size={13} /> },
    { id: 'brand' as const, label: 'Brand Compare', icon: <ShieldCheck size={13} /> },
    { id: 'creator' as const, label: 'Creator Intel', icon: <Users size={13} /> },
    { id: 'guide' as const, label: 'Buying Guides', icon: <BookOpen size={13} /> },
    { id: 'ai' as const, label: 'AI Smart Mode', icon: <Sparkles size={13} /> },
  ];
  const quickFiltersList = profiles.map((p) => ({
    id: p.id,
    label: p.label,
    active: profileId === p.id,
    onClick: () => setProfileId((cur) => (cur === p.id ? null : p.id)),
  }));
  const compareSectionNavItems = [
    ...compareModeOptions.map((m) => ({ id: `mode-${m.id}`, label: m.label, icon: m.icon })),
    ...quickFiltersList.map((f) => ({ id: `shortcut-${f.id}`, label: f.label })),
    { id: 'differences-only', label: 'Differences only', icon: <Scale size={13} /> },
  ];
  const handleCompareSectionNavigate = (id: string) => {
    if (id === 'all') {
      stickyNavTrackRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }
    if (id.startsWith('mode-')) return switchMode(id.replace('mode-', '') as CompareMode);
    if (id.startsWith('shortcut-')) return quickFiltersList.find((f) => `shortcut-${f.id}` === id)?.onClick();
    if (id === 'differences-only') setShowDifferencesOnly((v) => !v);
  };
  useRegisterPageFilters(
    {
      pageName: 'Compare',
      renderSearch: null,
      sectionNav: {
        items: compareSectionNavItems,
        activeId: `mode-${compareMode}`,
        onNavigate: handleCompareSectionNavigate,
        allLabel: 'Decision profile',
        allId: 'all',
        profileLabel: 'Compare controls',
      },
      quickFilters: quickFiltersList,
      renderFilters: null,
      activeFilterCount: profileId ? 1 : 0,
      onClearAll: () => setProfileId(null),
    },
    [compareMode, profileId, entityType],
  );

  const railCardClass = 'bg-white border border-[#E8EDF2] rounded-xl p-[18px]';
  const gridCols = (n: number) =>
    cn(n === 1 && 'grid-cols-1', n === 2 && 'grid-cols-2', n === 3 && 'grid-cols-3', n >= 4 && 'grid-cols-4');
  const isSectionOpen = (id: string) => !openSections.includes(`closed:${id}`);
  const toggleSection = (id: string) =>
    setOpenSections((prev) => (prev.includes(`closed:${id}`) ? prev.filter((x) => x !== `closed:${id}`) : [...prev, `closed:${id}`]));

  const addSlots = Math.max(0, MAX_COMPARE_ITEMS - columns.length);

  // ── Influencer / Public reviews for the selected products / brands ──
  const reviewBlocks = useMemo(() => {
    if (entityType !== 'product' && entityType !== 'brand') return { creator: [], publicRows: [] };
    const creator = columns.flatMap((c) =>
      guidesFeaturing(entityType === 'product' ? c.id : undefined, entityType === 'brand' ? c.id : undefined).map((g) => ({ subject: c, guide: g })),
    );
    const seen = new Set<string>();
    const creatorUnique = creator.filter((x) => (seen.has(x.guide.id) ? false : (seen.add(x.guide.id), true))).slice(0, 6);
    const publicRows = columns.flatMap((c) => {
      const key = entityType === 'product' ? c.id : c.name;
      return [...(publicReviews[key] || [])]
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .slice(0, 2)
        .map((r) => ({ subject: c, review: r }));
    });
    return { creator: creatorUnique, publicRows };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, columns, publicReviews, liveGuides]);

  // ── Recommended Alternatives: organic (catalog comparison) + authorized promoted placements ──
  const organic = useOrganicAlternatives(entityType, selectedIds);
  const promoted = useSponsoredPlacementsForSurface('compare', { limit: 2, withDemoFallback: false });

  const renderMatrix = () => {
    if (!hasSelection) {
      return (
        <div className="bg-white border border-[#E8EDF2] rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[320px]" data-testid="compare-empty">
          <div className="w-16 h-16 rounded-full bg-[#F4F7F9] border border-[#E8EDF2] flex items-center justify-center text-[#9AA0AC] mb-6">
            <Layers size={28} />
          </div>
          <h3 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">No {noun.many} to compare</h3>
          <p className="text-[#9AA0AC] text-xs max-w-md mb-8 leading-relaxed">
            {entityType === 'product'
              ? 'Add products to compare by clicking Add to Compare on any product, or use the add slot above.'
              : `Search and add the ${noun.many} you want to compare.`}
          </p>
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="px-8 py-3 bg-[#FF5B00] hover:brightness-110 text-white text-xs font-bold rounded-lg transition-all cursor-pointer border-none"
          >
            Add {noun.many.replace(/^\w/, (m) => m.toUpperCase())}
          </button>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-xl border border-[#E8EDF2] overflow-hidden" data-testid="compare-matrix">
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[700px] grid grid-cols-[1.5fr_2.5fr] gap-px bg-[#F4F7F9]">
            <div className="bg-[#FAFAFB] p-6 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-[#9AA0AC] tracking-tight block leading-none mb-1.5">
                {noun.many.toUpperCase()} context
              </span>
              <h3 className="text-lg font-extrabold text-[#1A1A2E] tracking-tight leading-none">Decision matrix</h3>
              <p className="text-[12px] font-medium text-[#9AA0AC] mt-1.5 leading-normal">Side-by-side, from listed data</p>
            </div>
            <div className={cn('bg-white grid divide-x divide-[#F4F7F9]', gridCols(columns.length))}>
              {columns.map((p) => (
                <div
                  key={p.id}
                  data-testid="compare-matrix-col"
                  className={cn(
                    'px-4 py-3 flex flex-col items-center justify-center text-center relative transition-all duration-300 min-h-[72px]',
                    matches(p) ? (winnerId === p.id ? 'bg-[#FF5B00]/5' : 'bg-white') : 'opacity-35 grayscale',
                  )}
                >
                  {winnerId === p.id && (
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#10B981] text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      <Trophy size={8} /> Winner
                    </div>
                  )}
                  <span className="text-[10px] font-semibold text-[#9AA0AC] tracking-tight leading-none mt-3">{p.subtitle}</span>
                  <h4 className="text-[12px] font-bold text-[#1A1A2E] tracking-tight leading-tight line-clamp-2">{p.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="divide-y divide-[#F4F7F9]">
          {sections.map((section) => {
            const metrics = showDifferencesOnly ? section.metrics.filter((m) => metricDiffers(columns, m.key)) : section.metrics;
            if (!metrics.length) return null;
            const open = isSectionOpen(section.id);
            return (
              <div key={section.id} className="bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-[18px] py-3.5 flex items-center justify-between group hover:bg-[#FAFAFB] transition-colors border-b border-[#F1F1F3] bg-[#FAFAFB]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#FF5B00] shrink-0">{SECTION_ICON[section.id]}</span>
                    <div className="text-left">
                      <h4 className="text-[12.5px] font-extrabold text-[#1A1A2E] tracking-tight leading-none">{section.title}</h4>
                      <p className="text-[10px] text-[#9AA0AC] mt-0.5">{metrics.length} comparison points</p>
                    </div>
                  </div>
                  {open ? <ChevronUp size={16} className="text-[#9AA0AC]" /> : <ChevronDown size={16} className="text-[#9AA0AC]" />}
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="divide-y divide-[#F4F7F9] overflow-x-auto no-scrollbar">
                        {metrics.map((metric) => (
                          <div key={metric.key} className="min-w-[700px] grid grid-cols-[150px_1fr] gap-3 px-[18px] py-3.5 border-b border-[#F4F7F9] items-start">
                            <div>
                              <h5 className="text-[11.5px] font-bold text-[#1A1A2E] leading-tight">{metric.label}</h5>
                              {metric.subLabel && <p className="text-[10px] text-[#9AA0AC] mt-0.5">{metric.subLabel}</p>}
                            </div>
                            <div className={cn('grid gap-3', gridCols(columns.length))}>
                              {columns.map((p) => {
                                const val = p.values[metric.key];
                                return (
                                  <div key={p.id} className={cn('transition-all duration-300', matches(p) ? '' : 'opacity-35 grayscale')}>
                                    <span className={cn('text-[12.5px] font-semibold', val ? 'text-[#1A1A2E]' : 'text-[#9AA0AC]')}>{val || '—'}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const entityCard = (p: CompareColumn) => (
    <Link
      to={p.href}
      className="block bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden no-underline h-full hover:border-[#FF5B00]/40 transition-colors"
    >
      <div className={cn('flex items-center justify-center bg-[#F4F7F9]', p.type === 'guide' ? 'aspect-video' : 'aspect-square')}>
        {p.image ? (
          <img src={p.image} alt="" className={cn('object-cover', p.type === 'creator' ? 'w-2/3 h-2/3 rounded-full' : 'w-full h-full')} />
        ) : (
          <span className="text-2xl font-extrabold text-[#9AA0AC]">{p.name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <div className="p-3">
        {p.subtitle ? <div className="text-[10px] font-bold text-[#FF5B00] uppercase tracking-wide truncate">{p.subtitle}</div> : null}
        <div className="text-[13px] font-bold text-[#1A1A2E] line-clamp-2">{p.name}</div>
        {p.flags.verified ? <div className="text-[10px] font-bold text-[#2323FF] mt-1">✓ Verified</div> : null}
      </div>
    </Link>
  );

  const summaryText =
    winner.kind === 'winner'
      ? null
      : winner.kind === 'tie'
        ? `${winner.columns.map((c) => c.name).join(' and ')} are tied at ${winner.columns[0].score}/10.`
        : winner.reason;

  return (
    <div className="w-full bg-transparent">
      {/* Page header — Share / Clear act on the canonical selection only */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[28px] font-extrabold text-[#1A1A2E] mb-1.5 leading-tight">{noun.title}</h1>
          <p className="text-[13px] text-[#9AA0AC]">
            {entityType === 'product'
              ? 'Compare features, prices, reviews and find the best choice for you.'
              : `Compare the ${noun.many} you choose, side by side.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 bg-white border border-[#E8EDF2] text-[#1A1A2E] px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer hover:border-[#D1D5DB] transition-colors"
          >
            <Share2 size={14} aria-hidden />
            Share Comparison
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 bg-white border border-[#FCA5A5] text-[#FF000D] px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} aria-hidden />
            Clear All
          </button>
        </div>
      </div>

      {/* Decision profile sticky nav — modes change the entity type; profiles rank the current selection */}
      <nav aria-label="Compare decision profile" className="choosify-sticky-section-nav sticky z-40 w-full bg-white border border-[#E8EDF2] rounded-none mb-4">
        <div className="px-4 sm:px-5 py-3">
          <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between min-w-0">
            <div className="flex items-center gap-2 shrink-0 select-none">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#9AA0AC] whitespace-nowrap">Decision profile</span>
              <div className="w-2 h-2 rounded-full bg-[#FF5B00] animate-pulse shrink-0" />
            </div>
            <div className="relative min-w-0 w-full md:w-auto md:max-w-full">
              <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-white to-transparent z-10 md:hidden" aria-hidden />
              <div ref={stickyNavTrackRef} {...stickyNavTrackProps} className="choosify-sticky-nav-track flex items-center gap-2 min-w-0 w-full md:w-auto">
                {compareModeOptions.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    data-compare-mode={m.id}
                    aria-pressed={compareMode === m.id}
                    onClick={() => switchMode(m.id)}
                    className={cn(STICKY_PILL_BASE, compareMode === m.id ? STICKY_PILL_ACTIVE : STICKY_PILL_INACTIVE)}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
                <div className="w-px h-6 bg-[#E8EDF2] shrink-0 mx-0.5" aria-hidden />
                {quickFiltersList.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    data-compare-profile={f.id}
                    aria-pressed={f.active}
                    onClick={f.onClick}
                    className={cn(STICKY_PILL_BASE, f.active ? STICKY_PILL_ACTIVE : STICKY_PILL_INACTIVE)}
                  >
                    <span>{f.label}</span>
                  </button>
                ))}
                <div className="w-px h-6 bg-[#E8EDF2] shrink-0 mx-0.5" aria-hidden />
                <button
                  type="button"
                  aria-pressed={showDifferencesOnly}
                  onClick={() => setShowDifferencesOnly((v) => !v)}
                  className={cn(STICKY_PILL_BASE, showDifferencesOnly ? STICKY_PILL_ACTIVE : STICKY_PILL_INACTIVE)}
                >
                  <Scale size={13} />
                  <span>Differences only</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {compareMode === 'ai' ? (
        <div className="mb-4 rounded-xl border border-[#E8EDF2] bg-white px-5 py-4 flex flex-wrap items-center justify-between gap-3" data-testid="ai-mode-note">
          <div className="flex items-center gap-2.5 min-w-0">
            <EmiAiLogo size={22} />
            <p className="text-[12px] text-[#4B5563] m-0">
              <span className="font-bold text-[#1A1A2E]">AI Smart Mode</span> — Emi analyses only the products in your comparison.
              {hasSelection ? '' : ' Add products first.'}
            </p>
          </div>
          <button
            type="button"
            onClick={hasSelection ? askEmi : () => setIsPickerOpen(true)}
            className="px-4 py-2 rounded-lg text-[11px] font-bold text-white border-none cursor-pointer choosify-emi-gradient hover:brightness-110"
          >
            {hasSelection ? 'Ask Emi to Compare' : 'Add Products'}
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-5 items-start">
        {/* LEFT RAIL — the canonical selection */}
        <aside className="flex flex-col gap-4 xl:sticky xl:top-28 min-w-0">
          <div className={railCardClass} data-testid="compare-selection">
            <div className="text-xs font-extrabold text-[#1A1A2E] tracking-[0.03em] mb-0.5">YOUR COMPARISON</div>
            <div className="text-[11px] text-[#9AA0AC] mb-3.5" data-testid="compare-count">
              {columns.length} / {MAX_COMPARE_ITEMS} {noun.many}
            </div>
            <div className="flex flex-col gap-3 mb-3.5">
              {columns.map((p) => (
                <div key={p.id} className="flex items-center gap-2.5 min-w-0">
                  <div className={cn('w-10 h-10 overflow-hidden shrink-0 bg-[#F4F7F9] flex items-center justify-center', p.type === 'creator' ? 'rounded-full' : 'rounded-lg')}>
                    {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <span className="text-[11px] font-bold text-[#9AA0AC]">{p.name.slice(0, 2).toUpperCase()}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#1A1A2E] truncate">{p.name}</div>
                    <div className="text-[10.5px] text-[#9AA0AC] truncate">{p.subtitle}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSubject(p.id)}
                    className="text-sm text-[#9AA0AC] hover:text-[#FF000D] shrink-0 cursor-pointer bg-transparent border-none p-0"
                    aria-label={`Remove ${p.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
              {!hasSelection && <p className="text-[11px] text-[#9AA0AC]">No {noun.many} selected yet.</p>}
            </div>
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              disabled={columns.length >= MAX_COMPARE_ITEMS}
              className="w-full bg-[#F4F7F9] border border-dashed border-[#D1D5DB] text-[#4B5563] py-2.5 rounded-lg text-[11.5px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Another {noun.one}
            </button>
          </div>

          <div className={railCardClass}>
            <div className="text-xs font-extrabold text-[#1A1A2E] tracking-[0.03em] mb-3">DECISION PROFILE</div>
            {activeProfile ? (
              <div className="text-[11.5px] text-[#4B5563] leading-relaxed" data-testid="compare-profile-result">
                <div className="font-bold text-[#1A1A2E] mb-1">{activeProfile.label}</div>
                <p className="m-0 mb-2 text-[11px] text-[#9AA0AC]">{activeProfile.rule}</p>
                {activeProfile.pick ? (
                  !hasSelection ? (
                    <p className="m-0">Add {noun.many} to apply this profile.</p>
                  ) : profilePick ? (
                    <p className="m-0">
                      Pick: <span className="font-bold text-[#FF5B00]">{profilePick.name}</span>
                    </p>
                  ) : (
                    <p className="m-0">Not enough data in your selection for this profile.</p>
                  )
                ) : (
                  <p className="m-0">{columns.filter(matches).length} of {columns.length} match.</p>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-[#9AA0AC] m-0">Choose a profile above to rank the {noun.many} you selected. It never adds new ones.</p>
            )}
            <div className="flex justify-between items-center mt-4">
              <div className="text-[11.5px] font-semibold text-[#1A1A2E]">Show differences only</div>
              <button
                type="button"
                role="switch"
                aria-checked={showDifferencesOnly}
                onClick={() => setShowDifferencesOnly((v) => !v)}
                className={cn('relative w-[34px] h-[19px] rounded-[10px] shrink-0 transition-colors cursor-pointer', showDifferencesOnly ? 'bg-[#FF5B00]' : 'bg-[#D1D5DB]')}
              >
                <span className={cn('absolute top-0.5 w-[15px] h-[15px] rounded-full bg-white transition-all', showDifferencesOnly ? 'right-0.5' : 'left-0.5')} />
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <div className="min-w-0 relative">
          <div
            className={cn(
              'grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6',
              columns.length + Math.min(addSlots, 1) >= 3 && 'lg:grid-cols-3',
              columns.length + Math.min(addSlots, 1) >= 4 && 'xl:grid-cols-4',
            )}
            data-testid="compare-cards"
          >
            {columns.map((p) => (
              <div key={p.id} className={cn('relative min-w-0 h-full', !matches(p) && 'opacity-40 grayscale')} data-testid="compare-card">
                {winnerId === p.id ? (
                  <span className="absolute top-2 left-2 z-30 text-[9px] font-extrabold px-[7px] py-[3px] rounded-full bg-[#FFF3EA] text-[#FF5B00] pointer-events-none shadow-sm">🏆 Best pick</span>
                ) : profilePick?.id === p.id ? (
                  <span className="absolute top-2 left-2 z-30 text-[9px] font-extrabold px-[7px] py-[3px] rounded-full bg-[#EEF0FF] text-[#2323FF] pointer-events-none shadow-sm">{activeProfile?.label}</span>
                ) : null}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    removeSubject(p.id);
                  }}
                  className="absolute top-2 right-2 z-30 w-6 h-6 rounded-full bg-white border border-[#E8EDF2] text-[#9AA0AC] hover:text-[#FF000D] hover:border-[#FF000D]/40 cursor-pointer flex items-center justify-center shadow-sm p-0"
                  aria-label={`Remove ${p.name}`}
                >
                  ✕
                </button>
                {p.type === 'product' ? <ProductCard product={{ ...(p.raw as any), title: p.name }} variant="grid" /> : entityCard(p)}
              </div>
            ))}
            {addSlots > 0 && (
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                data-testid="compare-add-slot"
                className="border-[1.5px] border-dashed border-[#D1D5DB] rounded-[10px] flex flex-col items-center justify-center gap-3 p-4 min-h-[280px] h-full cursor-pointer bg-transparent hover:border-[#FF5B00]/40 transition-colors"
              >
                <div className="w-[54px] h-[54px] rounded-full border-[1.5px] border-dashed border-[#D1D5DB] flex items-center justify-center text-[22px] text-[#9AA0AC]">+</div>
                <div className="text-[13px] font-bold text-[#1A1A2E] text-center">Add Another {noun.one}</div>
                <div className="text-[10.5px] text-[#9AA0AC] text-center">Compare up to {MAX_COMPARE_ITEMS} {noun.many}</div>
              </button>
            )}
          </div>
          {renderMatrix()}
        </div>

        {/* RIGHT RAIL — derived summary */}
        <aside className="flex flex-col gap-4 xl:sticky xl:top-28 min-w-0">
          <div className={railCardClass} data-testid="compare-summary">
            <div className="text-[22px] mb-1.5">🏆</div>
            <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-[0.03em] mb-1">COMPARISON SUMMARY</div>
            {!hasSelection ? (
              <p className="text-[11.5px] text-[#9AA0AC] m-0">Add {noun.many} to see a summary.</p>
            ) : winner.kind === 'winner' ? (
              <>
                <div className="text-[15px] font-extrabold text-[#1A1A2E] mb-1">{winner.column.name}</div>
                <div className="text-[11.5px] text-[#9AA0AC] mb-3.5">has the highest score ({winner.column.score}/10)</div>
                <Link to={winner.column.href} className="block w-full text-center bg-[#FF5B00] hover:brightness-110 text-white py-2.5 rounded-lg text-xs font-bold no-underline transition-all">
                  View {noun.one}
                </Link>
              </>
            ) : (
              <p className="text-[11.5px] text-[#4B5563] m-0">{summaryText}</p>
            )}
          </div>

          {entityType !== 'guide' ? (
            <div className={railCardClass} data-testid="compare-scores">
              <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-[0.03em] mb-0.5">SCORE OVERVIEW</div>
              <div className="text-[10.5px] text-[#9AA0AC] mb-4">
                {entityType === 'product' ? 'From customer reviews' : entityType === 'brand' ? 'Choosify brand rating' : 'Creator trust score'}
              </div>
              <div className="flex flex-col gap-3.5">
                {hasSelection ? (
                  columns.map((sc) => (
                    <div key={sc.id}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-[22px] h-[22px] rounded-md overflow-hidden shrink-0 bg-[#F4F7F9]">
                          {sc.image ? <img src={sc.image} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="text-[11.5px] font-bold text-[#1A1A2E] flex-1 truncate">{sc.name}</div>
                        <div className="text-[11px] font-extrabold text-[#1A1A2E]">
                          {sc.score !== null ? (
                            <>
                              {sc.score}
                              <span className="font-semibold text-[#9AA0AC]">/10</span>
                            </>
                          ) : (
                            <span className="font-semibold text-[#9AA0AC]">No score</span>
                          )}
                        </div>
                      </div>
                      <div className="h-[5px] rounded-[3px] bg-[#F1F1F3]">
                        {sc.score !== null ? <div className="h-full rounded-[3px] choosify-emi-gradient" style={{ width: `${sc.score * 10}%` }} /> : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-[#9AA0AC] m-0">Scores appear once {noun.many} are added.</p>
                )}
              </div>
            </div>
          ) : null}

          <div className={railCardClass}>
            <div className="text-xs font-extrabold text-[#1A1A2E] mb-0.5">NEED HELP DECIDING?</div>
            <div className="text-[11px] text-[#9AA0AC] mb-3.5">Let our AI assistant compare your selection</div>
            <button
              type="button"
              onClick={askEmi}
              data-testid="ask-emi"
              className="w-full text-white py-2.5 rounded-lg text-xs font-bold cursor-pointer border-none flex items-center justify-center gap-2 choosify-emi-gradient hover:brightness-110 transition-all"
            >
              <EmiAiLogo size={20} />
              Ask Emi to Compare
            </button>
          </div>
        </aside>
      </div>

      {/* EMI — only after the user asks */}
      <div ref={emiRef} className="mt-6">
        {emiOpen ? (
          <div className="bg-white rounded-xl border border-[#E8EDF2] px-6 py-[22px]" data-testid="emi-compare">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <EmiAiLogo size={24} />
                <div>
                  <div className="text-sm font-extrabold text-[#1A1A2E]">Emi Compare</div>
                  <div className="text-[11px] text-[#9AA0AC]">Based only on the listed data of your selection</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmiOpen(false)}
                aria-label="Close Emi Compare"
                className="w-8 h-8 rounded-full border border-[#E8EDF2] text-[#9AA0AC] hover:text-[#EF3C23] flex items-center justify-center bg-white cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
            {columns.length === 0 ? (
              <p className="text-[12px] text-[#4B5563] m-0">Add {noun.many} to compare first — Emi compares only what you select.</p>
            ) : columns.length === 1 ? (
              <p className="text-[12px] text-[#4B5563] m-0">Add at least one more {noun.one.toLowerCase()} — Emi needs two or more to compare.</p>
            ) : (
              <>
                {(() => {
                  const facts = emiFacts(columns, entityType);
                  return facts.length ? (
                    <ul className="m-0 pl-4 space-y-1.5 text-[12px] text-[#4B5563] leading-relaxed">
                      {facts.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[12px] text-[#4B5563] m-0">These {noun.many} don’t list enough comparable data yet for Emi to point out differences.</p>
                  );
                })()}
                <button
                  type="button"
                  onClick={() => openEmiPanel(`Help me decide between ${columns.map((c) => c.name).join(', ')}`)}
                  className="mt-4 text-[11px] font-bold uppercase tracking-wider choosify-emi-gradient-text hover:brightness-110 flex items-center gap-1.5 bg-transparent border-0 cursor-pointer p-0"
                >
                  <EmiAiLogo size={16} />
                  Continue with Emi
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* INFLUENCER / PUBLIC REVIEWS — products & brands, only with a selection */}
      {hasSelection && (entityType === 'product' || entityType === 'brand') ? (
        <div className="bg-white rounded-xl border border-[#E8EDF2] px-6 py-[22px] mt-6" data-testid="compare-reviews">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-lg">🎬</span>
            <div className="text-sm font-extrabold text-[#1A1A2E]">Influencer / Public Reviews</div>
          </div>
          <div className="text-[11.5px] text-[#9AA0AC] mb-5">Creator guides and customer reviews for the {noun.many} you’re comparing</div>
          {reviewBlocks.creator.length === 0 && reviewBlocks.publicRows.length === 0 ? (
            <p className="text-[12px] text-[#9AA0AC] m-0">{reviewsLoading ? 'Loading reviews…' : 'No relevant reviews available yet.'}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {reviewBlocks.creator.map(({ subject, guide }) => (
                <Link key={`g-${guide.id}`} to={guidePath(guide)} className="border border-[#E8EDF2] rounded-[10px] p-4 no-underline hover:border-[#FF5B00]/40 transition-colors" data-testid="compare-review-creator">
                  <div className="text-[9.5px] font-extrabold text-[#FF5B00] uppercase tracking-wider mb-1.5">Creator guide · {subject.name}</div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-[34px] h-[34px] rounded-full overflow-hidden bg-[#F4F7F9] shrink-0">
                      {guide.authorAvatar ? <img src={guide.authorAvatar} alt="" className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#1A1A2E] truncate">{guideAuthor(guide)}</div>
                      <div className="text-[10px] text-[#9AA0AC] line-clamp-1">{guide.title}</div>
                    </div>
                  </div>
                  {guide.excerpt ? <p className="text-[11.5px] text-[#4B5563] leading-relaxed m-0 line-clamp-3">{guide.excerpt}</p> : null}
                </Link>
              ))}
              {reviewBlocks.publicRows.map(({ subject, review }) => (
                <div key={`r-${review.id}`} className="border border-[#E8EDF2] rounded-[10px] p-4" data-testid="compare-review-public">
                  <div className="text-[9.5px] font-extrabold text-[#2323FF] uppercase tracking-wider mb-1.5">Customer review · {subject.name}</div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-[34px] h-[34px] rounded-full overflow-hidden bg-[#F4F7F9] shrink-0">
                      {review.userAvatar ? <img src={review.userAvatar} alt="" className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#1A1A2E] truncate">{review.userName}</div>
                      <div className="text-[10px] text-[#F59E0B]">{'★'.repeat(Math.max(0, Math.min(5, Math.round(review.rating))))}</div>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-[#4B5563] leading-relaxed m-0 line-clamp-4">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* CHOOSIFY VERDICT — from the canonical winner only */}
      {hasSelection && entityType !== 'guide' ? (
        <div className="choosify-dark-surface rounded-xl px-7 py-6 mt-4 text-white flex flex-wrap justify-between items-center gap-6" data-testid="compare-verdict">
          <div className="flex-1 min-w-[240px]">
            <div className="text-[13px] font-extrabold mb-2">Choosify Verdict</div>
            <p className="text-xs text-white/70 leading-relaxed m-0">{verdictText(winner)}</p>
          </div>
          {winner.kind === 'winner' ? (
            <div className="bg-white/10 rounded-[10px] px-5 py-4 flex items-center gap-3.5 shrink-0 max-w-full">
              <div className="w-12 h-12 rounded-[10px] bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {winner.column.image ? <img src={winner.column.image} alt="" className="w-full h-full object-cover" /> : null}
              </div>
              <div className="min-w-0">
                <div className="text-[9.5px] font-extrabold text-[#FF5B00] tracking-[0.05em] mb-0.5">BEST OVERALL</div>
                {winner.column.subtitle ? <div className="text-[9.5px] font-bold text-white/60 truncate">{winner.column.subtitle}</div> : null}
                <div className="text-[13px] font-extrabold mb-1.5 truncate">{winner.column.name}</div>
                <Link to={winner.column.href} className="text-[11px] font-bold text-[#FF9E5C] no-underline">
                  View {noun.one.toLowerCase()} →
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* RECOMMENDED ALTERNATIVES — organic catalog matches + Choosify-authorized promoted placements */}
      {organic.length > 0 || promoted.length > 0 ? (
        <section className="mt-8" aria-label="Recommended alternatives" data-testid="compare-alternatives">
          <div className="mb-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1a1a2e] m-0">Recommended Alternatives</h3>
            <p className="text-[10px] text-gray-400 mt-1 mb-0">Similar options and promoted picks</p>
          </div>
          <div className="choosify-product-grid w-full">
            {organic.map((alt) =>
              alt.kind === 'product' ? (
                <div key={`o-${alt.card.id}`} className="bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden flex flex-col" data-testid="compare-alt-organic">
                  <Link to={productPath({ id: alt.card.id, slug: alt.card.slug } as any)} className="no-underline">
                    <div className="aspect-square bg-[#F4F7F9]">{alt.card.image ? <img src={alt.card.image} alt="" className="w-full h-full object-cover" /> : null}</div>
                    <div className="p-3">
                      <div className="text-[10px] font-bold text-[#FF5B00] uppercase truncate">{alt.card.brandName}</div>
                      <div className="text-[12.5px] font-bold text-[#1A1A2E] line-clamp-2">{alt.card.title}</div>
                      {alt.card.price > 0 ? <div className="text-[12px] font-extrabold text-[#1A1A2E] mt-1">৳{alt.card.price.toLocaleString('en-US')}</div> : null}
                    </div>
                  </Link>
                  {entityType === 'product' ? (
                    <button
                      type="button"
                      onClick={() => {
                        const full = allProducts.find((p: any) => productKey(p) === String(alt.card.id));
                        if (full) addSubject(String(alt.card.id), full);
                      }}
                      className="mx-3 mb-3 mt-auto py-2 rounded-[5px] border border-[#E8EDF2] text-[10px] font-black uppercase tracking-widest text-[#1A1A2E] bg-white hover:border-[#FF5B00]/40 cursor-pointer"
                    >
                      + Compare
                    </button>
                  ) : null}
                </div>
              ) : (
                <div key={`o-${alt.card.id}`} className="bg-white border border-[#E8EDF2] rounded-[10px] overflow-hidden flex flex-col" data-testid="compare-alt-organic">
                  <Link to={brandPath({ id: alt.card.id, slug: alt.card.slug } as any)} className="no-underline p-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#F4F7F9] overflow-hidden shrink-0">{alt.card.logo && /^(https?:)?\/\/|^\//.test(alt.card.logo) ? <img src={alt.card.logo} alt="" className="w-full h-full object-cover" /> : null}</div>
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-bold text-[#1A1A2E] truncate">{alt.card.name}</div>
                      <div className="text-[10.5px] text-[#9AA0AC] truncate">{alt.card.category}</div>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => addSubject(String(alt.card.id))}
                    className="mx-3 mb-3 mt-auto py-2 rounded-[5px] border border-[#E8EDF2] text-[10px] font-black uppercase tracking-widest text-[#1A1A2E] bg-white hover:border-[#FF5B00]/40 cursor-pointer"
                  >
                    + Compare
                  </button>
                </div>
              ),
            )}
            {promoted.map((item) => (
              <div key={`p-${item.id}`} data-testid="compare-alt-promoted">
                <SponsoredProductTile item={item} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* PICKER — searches only the active entity type's real catalog */}
      <AnimatePresence>
        {isPickerOpen && (
          <motion.div className="fixed inset-0 z-[260] bg-[#1A1A2E]/55 backdrop-blur-sm px-4 py-6 md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="max-w-5xl mx-auto h-full flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                className="bg-white rounded-[15px] border border-[#e8edf2] shadow-2xl overflow-hidden flex flex-col min-h-0"
                role="dialog"
                aria-label={`Search and add ${noun.many}`}
                data-testid="compare-picker"
              >
                <div className="flex items-center justify-between gap-4 p-5 border-b border-[#e8edf2]">
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold tracking-tight text-[#9AA0AC]">Compare builder</div>
                    <h3 className="text-base font-extrabold tracking-tight text-[#1A1A2E] m-0">Search and add {noun.many}</h3>
                    {entityType === 'product' && compareLockedCategory ? (
                      <p className="text-[11px] font-semibold text-[#6B7280] mt-1 m-0">Showing {compareLockedCategory.label} only</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPickerOpen(false)}
                    aria-label="Close"
                    className="w-9 h-9 rounded-full border border-[#e8edf2] text-[#8a9bb0] hover:text-[#EF3C23] hover:border-[#FF5B00]/30 flex items-center justify-center cursor-pointer shrink-0 bg-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-5 border-b border-[#e8edf2] bg-[#F8FBFD]">
                  <div className="relative">
                    <input
                      type="text"
                      value={pickerQuery}
                      onChange={(e) => setPickerQuery(e.target.value)}
                      placeholder={`Search ${noun.many}…`}
                      aria-label={`Search ${noun.many}`}
                      className="w-full h-11 rounded-[5px] border border-[#e8edf2] bg-white px-4 pr-28 text-sm font-semibold text-[#1A1D4E] placeholder:text-gray-400 focus:outline-none focus:border-[#FF5B00]/40"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">
                      {columns.length}/{MAX_COMPARE_ITEMS} selected
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto p-5 bg-[#F4F7F9]">
                  {pickerResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {pickerResults.map((r) => (
                        <div key={r.id} className="bg-white border border-[#e8edf2] rounded-[8px] p-4 flex flex-col gap-4" data-testid="compare-picker-result" data-entity={entityType} data-id={r.id}>
                          <Link to={r.href} className="text-left flex items-start gap-3 no-underline min-w-0">
                            <div className={cn('w-16 h-16 border border-[#e8edf2] shrink-0 overflow-hidden bg-[#F4F7F9] flex items-center justify-center', entityType === 'creator' ? 'rounded-full' : 'rounded-[6px]')}>
                              {r.image ? <img src={r.image} alt="" className="w-full h-full object-cover" /> : <span className="text-sm font-bold text-[#9AA0AC]">{String(r.title).slice(0, 2).toUpperCase()}</span>}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-[#1A1A2E] line-clamp-2 leading-snug m-0">{r.title}</h4>
                              <p className="text-[11px] font-semibold text-gray-500 mt-1 mb-0 truncate">
                                {r.sub}
                                {r.price ? ` • ৳${r.price.toLocaleString('en-US')}` : ''}
                              </p>
                            </div>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              addSubject(r.id, r.product);
                              if (columns.length + 1 >= MAX_COMPARE_ITEMS) setIsPickerOpen(false);
                            }}
                            className="py-2 rounded-[5px] bg-[#FF5B00] hover:brightness-110 text-white text-[10px] font-black uppercase tracking-widest cursor-pointer border-0 transition-all"
                          >
                            Add to compare
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="min-h-[260px] flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-white border border-[#e8edf2] flex items-center justify-center text-[#FF5B00]">
                        <ShoppingBag size={22} />
                      </div>
                      <h4 className="text-sm font-extrabold tracking-tight text-[#1A1A2E] m-0">No matching {noun.many}</h4>
                      <p className="text-[13px] font-medium text-[#9AA0AC] m-0">
                        {entityType === 'product' && compareLockedCategory
                          ? `No more ${compareLockedCategory.label} items match this search.`
                          : 'Try another keyword or remove one from your comparison first.'}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
