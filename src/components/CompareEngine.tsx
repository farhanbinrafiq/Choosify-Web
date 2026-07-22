import React, { useState, useMemo, useRef } from 'react';
import { PAGE_LISTING_SINGLE_SHELL } from "../lib/pageLayout";
import { 
  Zap, Info, Star, ShieldCheck, ShoppingBag, 
  ChevronDown, ChevronUp, Plus, X, Sparkles,
  Trophy, Medal, Activity, Scale, CreditCard,
  Truck, ArrowRight, CheckCircle2, AlertCircle, 
  Share2, HelpCircle, Users, BookOpen, Layers
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { DragScrollContainer, ActiveFilterChips, FullSidebarFilterPanel, useRegisterPageFilters, useDragScroll } from './FilterEngine';
import { EmiComparePanel } from './emi/EmiComparePanel';
import { EmiAiLogo } from './EmiAiLogo';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { SponsoredCompareRail } from './commerce/PlacementSlot';

import {
  BRAND_ITEMS,
  CREATOR_ITEMS,
  GUIDE_ITEMS,
  AIS_ITEMS,
  PRODUCT_SECTIONS,
  BRAND_SECTIONS,
  CREATOR_SECTIONS,
  GUIDE_SECTIONS,
  AIS_SECTIONS,
  type CompareMode,
} from './compare/compareData';


export function CompareEngine() {
  const { comparedProducts = [], setComparedProducts, addToCompare } = useDashboard() || {};
  const { allProducts } = useGlobalState();
  const navigate = useNavigate();

  // Guard for 4-product comparison limit on any nested compare triggers
  const handleAddToCompare = (product: any) => {
    if (comparedProducts.length >= 4) {
      toast.error('You can compare up to 4 products at a time. Remove one to add another.');
      return;
    }
    if (addToCompare) {
      addToCompare(product);
    }
  };

  // ==========================================
  // STATE DEFINITIONS FOR THE COMPARE MATRIX
  // ==========================================
  const [compareMode, setCompareMode] = useState<CompareMode>('product');
  const [openSections, setOpenSections] = useState<string[]>(['Pricing', 'Brand Credentials & Trust', 'Audience Metrics & Growth', 'Guide Core Focus', 'AI Decision Analytics']);
  
  // Advanced Filter Sidebar States
  const [selectedBudget, setSelectedBudget] = useState<number>(5000);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [dealsOnly, setDealsOnly] = useState<boolean>(false);
  const [officialStoreOnly, setOfficialStoreOnly] = useState<boolean>(false);
  const [selectedBrandSpec, setSelectedBrandSpec] = useState<string>('all');
  
  // Brand Filter States
  const [selectedBrandSegment, setSelectedBrandSegment] = useState<string>('all');
  const [selectedBrandCountry, setSelectedBrandCountry] = useState<string>('all');
  
  // Creator Filter States
  const [selectedCreatorPlatform, setSelectedCreatorPlatform] = useState<string>('all');
  const [selectedCreatorEngagement, setSelectedCreatorEngagement] = useState<string>('all');

  // Guide Filter States
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('all');

  // AI Filter States
  const [selectedAIChoice, setSelectedAIChoice] = useState<string>('all');
  const [selectedRiskRating, setSelectedRiskRating] = useState<string>('all');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [isProductSearchOpen, setIsProductSearchOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { ref: stickyNavTrackRef, props: stickyNavTrackProps } = useDragScroll({ grabCursor: false });
  const userNavScrollUntilRef = useRef(0);
  const emiHelpRef = useRef<HTMLDivElement | null>(null);

  const STICKY_PILL_BASE =
    'shrink-0 px-4 py-2.5 sm:py-2 rounded-none text-[10px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer whitespace-nowrap touch-manipulation min-h-[40px] sm:min-h-0';
  const STICKY_PILL_ACTIVE =
    'bg-[#EB4501] text-white border border-[#EB4501]';
  const STICKY_PILL_INACTIVE =
    'bg-white text-[#1A1A2E] border border-[#E8EDF2] hover:border-[#EB4501]/40 hover:text-[#CF4400]';

  const compareModeOptions = [
    { id: 'product' as const, label: 'Product Compare', icon: <ShoppingBag size={13} /> },
    { id: 'brand' as const, label: 'Brand Compare', icon: <ShieldCheck size={13} /> },
    { id: 'creator' as const, label: 'Creator Intel', icon: <Users size={13} /> },
    { id: 'guide' as const, label: 'Buying Guides', icon: <BookOpen size={13} /> },
    { id: 'ai' as const, label: 'AI Smart Mode', icon: <Sparkles size={13} /> },
  ];

  const heroProductSlots = compareMode === 'product' ? Math.max(0, 4 - comparedProducts.length) : 0;
  const catalogProducts = allProducts.length > 0 ? allProducts : PRODUCTS;

  // Soft trigger for loading state when filters adjust
  const triggerSoftLoading = () => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  };

  const handleClearAllFilters = () => {
    setSelectedBudget(5000);
    setSelectedAvailability('all');
    setDealsOnly(false);
    setOfficialStoreOnly(false);
    setSelectedBrandSpec('all');
    setSelectedBrandSegment('all');
    setSelectedBrandCountry('all');
    setSelectedCreatorPlatform('all');
    setSelectedCreatorEngagement('all');
    setSelectedDifficulty('all');
    setSelectedUseCase('all');
    setSelectedAIChoice('all');
    setSelectedRiskRating('all');
    triggerSoftLoading();
  };

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  // ==========================================
  // PREPARE DYNAMIC DATA BASED ON MODE & FILTERS
  // ==========================================
  const { items, sections, titlePrefix } = useMemo(() => {
    switch (compareMode) {
      case 'brand':
        return { 
          items: BRAND_ITEMS, 
          sections: BRAND_SECTIONS, 
          titlePrefix: 'BRANDS' 
        };
      case 'creator':
        return { 
          items: CREATOR_ITEMS, 
          sections: CREATOR_SECTIONS, 
          titlePrefix: 'CREATORS' 
        };
      case 'guide':
        return { 
          items: GUIDE_ITEMS, 
          sections: GUIDE_SECTIONS, 
          titlePrefix: 'BUYING GUIDES' 
        };
      case 'ai':
        return { 
          items: AIS_ITEMS, 
          sections: AIS_SECTIONS, 
          titlePrefix: 'AI ANALYTICS' 
        };
      case 'product':
      default: {
        const mappedProducts = (comparedProducts || []).map((product: any) => ({
          id: String(product.id),
          brand: product.brand || 'Brand',
          name: product.name || product.title || 'Product',
          image: (product.images && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=400&h=400&fit=crop',
          tag: product.tag || 'Popular',
          price: product.price || 0,
          rating: product.rating || 4.5,
          score: typeof product.score === 'number' ? product.score : undefined,
          category: product.category || product.categoryName || '',
          isWinner: product.isWinner || false,
          highlightText: product.description || 'Excellent quality decision match.',
          specs: {
            price: `৳${(product.price || 0).toLocaleString()}`,
            value: product.value || 'Excellent',
            clearance: product.discount ? `${product.discount}% OFF` : 'No Offer',
            rating: `${product.rating || 4.5}/5.0`,
            influence: product.influence || '90/100',
            build: product.build || 'Premium',
            durability: product.durability || 'High (3 yrs)',
            experience: product.experience || 'Supreme',
            sizes: product.sizes ? product.sizes.join(', ') : 'M-XXL',
            material: product.material || 'Premium Cotton',
            waterproof: product.waterproof || 'No',
            fit: product.fit || 'Custom Fit',
            warranty: product.warranty || '1 Year',
            returns: product.returns || '30 Days',
            availability: product.stock && product.stock > 0 ? 'In Stock' : 'In Stock',
            deals: product.discount ? 'Yes' : 'Yes',
            officialStore: 'Yes',
          }
        }));
        return {
          items: mappedProducts,
          sections: PRODUCT_SECTIONS,
          titlePrefix: 'PRODUCTS',
        };
      }
    }
  }, [compareMode, comparedProducts]);

  // Evaluate matching condition for decision highlight (Dimming non-matching options, highlighting optimal)
  const evaluatedMatchingColumns = useMemo(() => {
    return items.map(item => {
      let isMatch = true;

      if (compareMode === 'product') {
        const itemPrice = item.price || 0;
        if (itemPrice > selectedBudget) isMatch = false;
        if (selectedAvailability !== 'all' && item.specs.availability !== selectedAvailability) isMatch = false;
        if (dealsOnly && item.specs.deals !== 'Yes') isMatch = false;
        if (officialStoreOnly && item.specs.officialStore !== 'Yes') isMatch = false;
        if (selectedBrandSpec !== 'all' && item.brand !== selectedBrandSpec) isMatch = false;
        if (selectedCategory !== 'all' && item.category && item.category !== selectedCategory) isMatch = false;
      }
      else if (compareMode === 'brand') {
        if (selectedBrandSegment !== 'all') {
          if (selectedBrandSegment === 'legacy' && item.specs.behaviorType !== 'Legacy Brand') isMatch = false;
          if (selectedBrandSegment === 'global' && item.specs.behaviorType !== 'Global Appeal') isMatch = false;
        }
        if (selectedBrandCountry !== 'all') {
          if (selectedBrandCountry === 'local' && item.specs.country !== 'Bangladesh') isMatch = false;
        }
      }
      else if (compareMode === 'creator') {
        if (selectedCreatorPlatform !== 'all' && !item.specs.platform.includes(selectedCreatorPlatform)) isMatch = false;
        if (selectedCreatorEngagement !== 'all') {
          const engPercent = parseFloat(item.specs.engagement);
          if (selectedCreatorEngagement === 'high' && engPercent < 8.0) isMatch = false;
          if (selectedCreatorEngagement === 'rising' && engPercent >= 8.0) isMatch = false;
        }
      }
      else if (compareMode === 'guide') {
        if (selectedDifficulty !== 'all' && !item.specs.difficulty.includes(selectedDifficulty)) isMatch = false;
        if (selectedUseCase !== 'all') {
          if (selectedUseCase === 'office' && !item.specs.useCase.includes('Office')) isMatch = false;
          if (selectedUseCase === 'casual' && !item.specs.useCase.includes('Casual')) isMatch = false;
        }
      }
      else if (compareMode === 'ai') {
        if (selectedAIChoice !== 'all') {
          if (selectedAIChoice === 'best-value' && !item.highlightText.toLowerCase().includes('value')) isMatch = false;
          if (selectedAIChoice === 'long-term' && !item.highlightText.toLowerCase().includes('fade')) isMatch = false;
        }
        if (selectedRiskRating !== 'all' && !item.specs.riskRating.toLowerCase().includes(selectedRiskRating)) isMatch = false;
      }

      return {
        ...item,
        matchesCriteria: isMatch
      };
    });
  }, [
    compareMode, items, selectedBudget, selectedAvailability, dealsOnly, 
    officialStoreOnly, selectedBrandSpec, selectedCategory, selectedBrandSegment, selectedBrandCountry,
    selectedCreatorPlatform, selectedCreatorEngagement, selectedDifficulty, selectedUseCase,
    selectedAIChoice, selectedRiskRating
  ]);

  // Build the list of active chips dynamically
  const activeChips = useMemo(() => {
    const list: any[] = [];
    if (compareMode === 'product') {
      if (selectedBudget < 5000) {
        list.push({ id: 'budget', label: `Max Price: ৳${selectedBudget}`, onRemove: () => { setSelectedBudget(5000); triggerSoftLoading(); } });
      }
      if (selectedAvailability !== 'all') {
        list.push({ id: 'avail', label: `Availability: ${selectedAvailability}`, onRemove: () => { setSelectedAvailability('all'); triggerSoftLoading(); } });
      }
      if (dealsOnly) {
        list.push({ id: 'deals', label: `Has Deals`, onRemove: () => { setDealsOnly(false); triggerSoftLoading(); } });
      }
      if (officialStoreOnly) {
        list.push({ id: 'official', label: `Official Store Only`, onRemove: () => { setOfficialStoreOnly(false); triggerSoftLoading(); } });
      }
      if (selectedBrandSpec !== 'all') {
        list.push({ id: 'brandSpec', label: `Brand: ${selectedBrandSpec}`, onRemove: () => { setSelectedBrandSpec('all'); triggerSoftLoading(); } });
      }
    } else if (compareMode === 'brand') {
      if (selectedBrandSegment !== 'all') {
        list.push({ id: 'segment', label: `Segment: ${selectedBrandSegment}`, onRemove: () => { setSelectedBrandSegment('all'); triggerSoftLoading(); } });
      }
      if (selectedBrandCountry !== 'all') {
        list.push({ id: 'country', label: `Category Scope: ${selectedBrandCountry}`, onRemove: () => { setSelectedBrandCountry('all'); triggerSoftLoading(); } });
      }
    } else if (compareMode === 'creator') {
      if (selectedCreatorPlatform !== 'all') {
        list.push({ id: 'platform', label: `Platform: ${selectedCreatorPlatform}`, onRemove: () => { setSelectedCreatorPlatform('all'); triggerSoftLoading(); } });
      }
      if (selectedCreatorEngagement !== 'all') {
        list.push({ id: 'eng', label: `Engagement: ${selectedCreatorEngagement}`, onRemove: () => { setSelectedCreatorEngagement('all'); triggerSoftLoading(); } });
      }
    } else if (compareMode === 'guide') {
      if (selectedDifficulty !== 'all') {
        list.push({ id: 'diff', label: `Difficulty: ${selectedDifficulty}`, onRemove: () => { setSelectedDifficulty('all'); triggerSoftLoading(); } });
      }
      if (selectedUseCase !== 'all') {
        list.push({ id: 'usecase', label: `Use Case: ${selectedUseCase}`, onRemove: () => { setSelectedUseCase('all'); triggerSoftLoading(); } });
      }
    } else if (compareMode === 'ai') {
      if (selectedAIChoice !== 'all') {
        list.push({ id: 'aichoice', label: `AI Target: ${selectedAIChoice}`, onRemove: () => { setSelectedAIChoice('all'); triggerSoftLoading(); } });
      }
      if (selectedRiskRating !== 'all') {
        list.push({ id: 'risk', label: `Risk Rating: ${selectedRiskRating}`, onRemove: () => { setSelectedRiskRating('all'); triggerSoftLoading(); } });
      }
    }
    return list;
  }, [
    compareMode, selectedBudget, selectedAvailability, dealsOnly, 
    officialStoreOnly, selectedBrandSpec, selectedBrandSegment, selectedBrandCountry,
    selectedCreatorPlatform, selectedCreatorEngagement, selectedDifficulty, selectedUseCase,
    selectedAIChoice, selectedRiskRating
  ]);

  // Quick Filter Row dynamically generated based on current MODE selection
  const quickFiltersList = useMemo(() => {
    if (compareMode === 'product') {
      return [
        { id: 'best-val', label: 'Best Value', active: selectedBudget === 3000, onClick: () => { setSelectedBudget(3000); triggerSoftLoading(); } },
        { id: 'best-bud', label: 'Best Budget', active: selectedBudget === 2000, onClick: () => { setSelectedBudget(2000); triggerSoftLoading(); } },
        { id: 'premium-p', label: 'Best Premium', active: selectedBudget === 5000, onClick: () => { setSelectedBudget(5000); triggerSoftLoading(); } },
        { id: 'instock', label: 'Most Popular', active: selectedAvailability === 'In Stock', onClick: () => { setSelectedAvailability('In Stock'); triggerSoftLoading(); } },
        { id: 'deals-p', label: 'Deals Available', active: dealsOnly, onClick: () => { setDealsOnly(!dealsOnly); triggerSoftLoading(); } },
      ];
    } else if (compareMode === 'brand') {
      return [
        { id: 'top-b', label: 'Top Brands', active: selectedBrandSegment === 'legacy', onClick: () => { setSelectedBrandSegment('legacy'); triggerSoftLoading(); } },
        { id: 'fast-g', label: 'Fastest Growing', active: selectedBrandSegment === 'global', onClick: () => { setSelectedBrandSegment('global'); triggerSoftLoading(); } },
        { id: 'local-b', label: 'Verified Only', active: selectedBrandCountry === 'local', onClick: () => { setSelectedBrandCountry('local'); triggerSoftLoading(); } },
      ];
    } else if (compareMode === 'creator') {
      return [
        { id: 'trend-c', label: 'Trending Creators', active: selectedCreatorPlatform === 'Instagram', onClick: () => { setSelectedCreatorPlatform('Instagram'); triggerSoftLoading(); } },
        { id: 'verify-c', label: 'High Engagement', active: selectedCreatorEngagement === 'high', onClick: () => { setSelectedCreatorEngagement('high'); triggerSoftLoading(); } },
        { id: 'rise-c', label: 'Rising Creators', active: selectedCreatorEngagement === 'rising', onClick: () => { setSelectedCreatorEngagement('rising'); triggerSoftLoading(); } },
      ];
    } else if (compareMode === 'guide') {
      return [
        { id: 'beg-g', label: 'Beginner Friendly', active: selectedDifficulty === 'Beginner Friendly', onClick: () => { setSelectedDifficulty('Beginner Friendly'); triggerSoftLoading(); } },
        { id: 'adv-g', label: 'Expert Choices', active: selectedDifficulty === 'Advanced Collector', onClick: () => { setSelectedDifficulty('Advanced Collector'); triggerSoftLoading(); } },
        { id: 'office-g', label: 'Office Outfitting', active: selectedUseCase === 'office', onClick: () => { setSelectedUseCase('office'); triggerSoftLoading(); } },
      ];
    } else {
      return [
        { id: 'ai-rec', label: 'AI Recommended', active: selectedAIChoice === 'best-value', onClick: () => { setSelectedAIChoice('best-value'); triggerSoftLoading(); } },
        { id: 'long-term', label: 'Long-Term Value', active: selectedAIChoice === 'long-term', onClick: () => { setSelectedAIChoice('long-term'); triggerSoftLoading(); } },
        { id: 'low-risk', label: 'Risk-Free Picks', active: selectedRiskRating === 'low', onClick: () => { setSelectedRiskRating('low'); triggerSoftLoading(); } },
      ];
    }
  }, [
    compareMode, selectedBudget, selectedAvailability, dealsOnly, 
    selectedBrandSegment, selectedBrandCountry, selectedCreatorPlatform, 
    selectedCreatorEngagement, selectedDifficulty, selectedUseCase, 
    selectedAIChoice, selectedRiskRating
  ]);

  const compareSectionNavItems = useMemo(
    () => [
      ...compareModeOptions.map((mode) => ({
        id: `mode-${mode.id}`,
        label: mode.label,
        icon: mode.icon,
      })),
      ...quickFiltersList.map((filter) => ({
        id: `shortcut-${filter.id}`,
        label: filter.label,
        ...('icon' in filter && filter.icon ? { icon: filter.icon as React.ReactNode } : {}),
      })),
      { id: 'differences-only', label: 'Differences only', icon: <Scale size={13} /> },
    ],
    [compareModeOptions, quickFiltersList],
  );

  const handleCompareSectionNavigate = (id: string) => {
    if (id === 'all') {
      stickyNavTrackRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    if (id.startsWith('mode-')) {
      const modeId = id.replace('mode-', '') as CompareMode;
      setCompareMode(modeId);
      triggerSoftLoading();
      return;
    }

    if (id.startsWith('shortcut-')) {
      const shortcut = quickFiltersList.find((filter) => `shortcut-${filter.id}` === id);
      shortcut?.onClick();
      return;
    }

    if (id === 'differences-only') {
      setShowDifferencesOnly((value) => !value);
    }
  };

  const comparedProductIds = useMemo(
    () => new Set((comparedProducts || []).map((product: any) => String(product.id))),
    [comparedProducts],
  );

  const searchableProducts = useMemo(() => {
    const normalizedQuery = productSearchQuery.trim().toLowerCase();
    return catalogProducts
      .filter((product: any) => !comparedProductIds.has(String(product.id)))
      .filter((product: any) => {
        if (!normalizedQuery) return true;
        return [product.title, product.brand, product.category, product.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      })
      .slice(0, 12);
  }, [catalogProducts, comparedProductIds, productSearchQuery]);

  const metricValuesDiffer = (metricKey: string) => {
    const values = evaluatedMatchingColumns.map((p) => String(p.specs[metricKey] ?? ''));
    return new Set(values).size > 1;
  };

  const productCategoryOptions = useMemo(() => {
    const cats = new Set<string>();
    evaluatedMatchingColumns.forEach((item) => {
      if (item.category) cats.add(String(item.category));
    });
    catalogProducts.forEach((product: any) => {
      const cat = product.category || product.categoryName;
      if (cat) cats.add(String(cat));
    });
    return Array.from(cats).slice(0, 12);
  }, [evaluatedMatchingColumns, catalogProducts]);

  const productWinner = useMemo(() => {
    if (compareMode !== 'product' || evaluatedMatchingColumns.length === 0) return null;
    const matching = evaluatedMatchingColumns.filter((p) => p.matchesCriteria);
    const pool = matching.length > 0 ? matching : evaluatedMatchingColumns;
    return (
      pool.find((p) => p.isWinner) ||
      [...pool].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] ||
      null
    );
  }, [compareMode, evaluatedMatchingColumns]);

  const productScores = useMemo(() => {
    return evaluatedMatchingColumns.map((p) => {
      const raw =
        typeof p.score === 'number'
          ? p.score
          : Math.min(10, Math.round(((p.rating || 4.5) / 5) * 10 * 10) / 10);
      const score = Math.max(0, Math.min(10, Number(raw) || 0));
      return {
        id: p.id,
        name: p.name,
        image: p.image,
        score,
        pct: Math.round((score / 10) * 100),
      };
    });
  }, [evaluatedMatchingColumns]);

  const winnerSummaryPoints = useMemo(() => {
    if (!productWinner) return [] as string[];
    const points: string[] = [];
    if (productWinner.specs?.rating) points.push(`${productWinner.specs.rating} overall rating`);
    if (productWinner.specs?.build) points.push(`${productWinner.specs.build} build quality`);
    if (productWinner.specs?.durability) points.push(`Durability: ${productWinner.specs.durability}`);
    if (productWinner.specs?.warranty) points.push(`${productWinner.specs.warranty} warranty`);
    if (productWinner.specs?.value) points.push(`${productWinner.specs.value} value`);
    return points.slice(0, 4);
  }, [productWinner]);

  const removeComparedProduct = (id: string) => {
    if (!setComparedProducts) return;
    setComparedProducts((prev: any[]) => prev.filter((prod: any) => String(prod.id) !== String(id)));
  };

  const handleAskEmi = () => {
    toast.success('Ask Emi about this comparison — scroll down for AI help.');
    emiHelpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const railCardClass = 'bg-white border border-[#E8EDF2] rounded-xl p-[18px]';
  const toggleSwitch = (on: boolean) =>
    cn(
      'relative w-[34px] h-[19px] rounded-[10px] shrink-0 transition-colors cursor-pointer',
      on ? 'bg-[#EB4501]' : 'bg-[#D1D5DB]',
    );

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
      renderFilters: null, // full filters live in the compare sidebar
      activeFilterCount: activeChips.length,
      onClearAll: handleClearAllFilters,
    },
    [quickFiltersList, activeChips.length, compareMode, compareSectionNavItems],
  );

  const renderSpecMatrix = (opts?: { includeInlineVerdict?: boolean }) => {
    const includeInlineVerdict = opts?.includeInlineVerdict !== false;
    if (compareMode === 'product' && comparedProducts.length === 0) {
      return (
        <div className="bg-white border border-[#E8EDF2] rounded-xl p-12 text-center flex flex-col items-center justify-center min-h-[320px]">
          <div className="w-16 h-16 rounded-full bg-[#F4F7F9] border border-[#E8EDF2] flex items-center justify-center text-[#9AA0AC] mb-6">
            <Layers size={28} />
          </div>
          <h3 className="text-xl font-extrabold text-[#1A1A2E] tracking-tight mb-2">No products to compare</h3>
          <p className="text-[#9AA0AC] text-xs max-w-md mb-8 leading-relaxed">
            Add products to compare by clicking Add to Compare on any product, or use the add slot above.
          </p>
          <button
            type="button"
            onClick={() => setIsProductSearchOpen(true)}
            className="px-8 py-3 bg-[#EB4501] hover:brightness-110 text-white text-xs font-bold rounded-lg transition-all cursor-pointer border-none"
          >
            Add Products
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl border border-[#E8EDF2] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[700px] grid grid-cols-[1.5fr_2.5fr] gap-px bg-[#F4F7F9]">
            <div className="bg-[#FAFAFB] p-6 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-[#9AA0AC] tracking-tight block leading-none mb-1.5">
                {titlePrefix} context
              </span>
              <h3 className="text-lg font-extrabold text-[#1A1A2E] tracking-tight leading-none">Decision matrix</h3>
              <p className="text-[12px] font-medium text-[#9AA0AC] mt-1.5 leading-normal">Side-by-side parameters</p>
            </div>
            <div
              className={cn(
                'bg-white grid divide-x divide-[#F4F7F9]',
                evaluatedMatchingColumns.length === 1 && 'grid-cols-1',
                evaluatedMatchingColumns.length === 2 && 'grid-cols-2',
                evaluatedMatchingColumns.length === 3 && 'grid-cols-3',
                evaluatedMatchingColumns.length >= 4 && 'grid-cols-4',
              )}
            >
              {evaluatedMatchingColumns.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    'px-4 py-3 flex flex-col items-center justify-center text-center relative transition-all duration-300 min-h-[72px]',
                    p.matchesCriteria
                      ? productWinner?.id === p.id
                        ? 'bg-[#EB4501]/5'
                        : 'bg-white'
                      : 'opacity-35 grayscale',
                  )}
                >
                  {p.matchesCriteria && productWinner?.id === p.id && (
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#10B981] text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-[3px] whitespace-nowrap">
                      <Trophy size={8} /> Winner
                    </div>
                  )}
                  <span className="text-[10px] font-semibold text-[#9AA0AC] tracking-tight leading-none mt-3">{p.brand}</span>
                  <h4 className="text-[12px] font-bold text-[#1A1A2E] tracking-tight leading-tight line-clamp-2">{p.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#F4F7F9]">
          {sections.map((section) => {
            const visibleMetrics = showDifferencesOnly
              ? section.metrics.filter((metric) => metricValuesDiffer(metric.key))
              : section.metrics;
            if (visibleMetrics.length === 0) return null;

            return (
              <div key={section.title} className="bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="w-full px-[18px] py-3.5 flex items-center justify-between group hover:bg-[#FAFAFB] transition-colors border-b border-[#F1F1F3] bg-[#FAFAFB]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#EB4501] shrink-0 text-[17px]">{section.icon}</span>
                    <div className="text-left">
                      <h4 className="text-[12.5px] font-extrabold text-[#1A1A2E] tracking-tight leading-none">
                        {section.title}
                      </h4>
                      <p className="text-[10px] text-[#9AA0AC] mt-0.5">
                        {visibleMetrics.length} comparison points
                      </p>
                    </div>
                  </div>
                  {openSections.includes(section.title) ? (
                    <ChevronUp size={16} className="text-[#9AA0AC]" />
                  ) : (
                    <ChevronDown size={16} className="text-[#9AA0AC]" />
                  )}
                </button>

                <AnimatePresence>
                  {openSections.includes(section.title) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y divide-[#F4F7F9] overflow-x-auto no-scrollbar">
                        {visibleMetrics.map((metric, midx) => (
                          <div
                            key={midx}
                            className="min-w-[700px] grid grid-cols-[150px_1fr] gap-3 px-[18px] py-3.5 border-b border-[#F4F7F9] items-start"
                          >
                            <div>
                              <h5 className="text-[11.5px] font-bold text-[#1A1A2E] leading-tight">{metric.label}</h5>
                              {metric.subLabel && (
                                <p className="text-[10px] text-[#9AA0AC] mt-0.5">{metric.subLabel}</p>
                              )}
                            </div>
                            <div
                              className={cn(
                                'grid gap-3',
                                evaluatedMatchingColumns.length === 1 && 'grid-cols-1',
                                evaluatedMatchingColumns.length === 2 && 'grid-cols-2',
                                evaluatedMatchingColumns.length === 3 && 'grid-cols-3',
                                evaluatedMatchingColumns.length >= 4 && 'grid-cols-4',
                              )}
                            >
                              {evaluatedMatchingColumns.map((p, vidx) => {
                                const val = p.specs[metric.key] || 'N/A';
                                return (
                                  <div
                                    key={vidx}
                                    className={cn(
                                      'transition-all duration-300',
                                      p.matchesCriteria ? '' : 'opacity-35 grayscale',
                                    )}
                                  >
                                    {metric.type === 'rating' ? (
                                      <div>
                                        <div className="text-[12.5px] font-bold text-[#1A1A2E]">{val}</div>
                                        <div className="flex items-center gap-0.5 mt-1">
                                          {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={8} className="text-[#FFD700] fill-current" />
                                          ))}
                                        </div>
                                      </div>
                                    ) : metric.type === 'score' ? (
                                      <div>
                                        <div className="text-[12.5px] font-bold text-[#1A1A2E]">{val}</div>
                                        <div className="w-full max-w-[100px] h-1 bg-[#F1F1F3] rounded-full overflow-hidden mt-1.5">
                                          <div
                                            className="h-full bg-[#EB4501]"
                                            style={{ width: `${parseInt(val, 10) || 85}%` }}
                                          />
                                        </div>
                                      </div>
                                    ) : metric.type === 'badge' ? (
                                      <span
                                        className={cn(
                                          'inline-block px-2.5 py-1 rounded-md text-[11px] font-bold',
                                          [
                                            'Excellent',
                                            'Legacy Brand',
                                            'Best-Sited',
                                            'Smart Choice',
                                            'Beginner Friendly',
                                            'Verified Official',
                                          ].includes(val)
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-[#F4F7F9] text-[#4B5563]',
                                        )}
                                      >
                                        {val}
                                      </span>
                                    ) : metric.type === 'tag' ? (
                                      <span className="text-[12px] font-bold text-[#EB4501] underline underline-offset-2">
                                        {val}
                                      </span>
                                    ) : (
                                      <span
                                        className={cn(
                                          'text-[12.5px] font-semibold text-[#1A1A2E]',
                                          metric.highlight && 'font-extrabold text-[#1A1A2E]',
                                        )}
                                      >
                                        {val}
                                      </span>
                                    )}
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

        {includeInlineVerdict && (
          <div className="bg-[#FAFAFB] p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row items-center gap-6 md:gap-8 border-t border-[#E8EDF2]">
            <div className="w-12 h-12 rounded-full bg-[#FFF3EA] flex items-center justify-center text-[#EB4501] shrink-0 border border-[#FFD8B8]">
              <Trophy size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-extrabold text-[#1A1A2E] tracking-tight leading-none mb-2">
                Discovery Verdict
              </h3>
              <p className="text-[#9AA0AC] text-[11px] font-medium leading-relaxed max-w-xl">
                {compareMode === 'brand' &&
                  'Aarong demonstrates optimal ecosystem authority within Bangladesh metrics. Yellow targets fast adaptation to international fashion lines.'}
                {compareMode === 'creator' &&
                  'Nafis Anjum provides stable tech buyer credibility over extreme viral reaches. Tasnim stands as prime style matching authority.'}
                {compareMode === 'guide' &&
                  'Smart Wardrobe Guidelines covers extensive checklist architectures for professionals. Winter/Summer focuses on micro-seasons.'}
                {compareMode === 'ai' &&
                  'Optimal Value Package matches user search indices perfectly at high durability. Frugal provides zero upfront cash friction.'}
                {compareMode === 'product' &&
                  (productWinner
                    ? `${productWinner.name} secures the top choice based on rating, build, and value signals in this set.`
                    : 'Add products to generate a verdict.')}
              </p>
            </div>
            <div className="w-full md:w-auto bg-white border border-[#E8EDF2] rounded-xl p-4 flex flex-col items-center">
              <span className="text-[8px] font-extrabold text-[#9AA0AC] uppercase tracking-widest mb-1">
                Recommended
              </span>
              <span className="text-base font-extrabold text-[#EB4501] leading-none uppercase">
                {compareMode === 'product' && (productWinner?.name || '—')}
                {compareMode === 'brand' && 'AARONG'}
                {compareMode === 'creator' && 'NAFIS ANJUM'}
                {compareMode === 'guide' && 'SMART BIND'}
                {compareMode === 'ai' && 'OPTIMAL BUNDLE'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-transparent">
      {/* Decision profile sticky nav — all modes */}
      <section className="relative w-full overflow-hidden">
        <div className="relative z-10">
          {compareMode !== 'product' && evaluatedMatchingColumns.length > 0 && (
            <div className="pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#9AA0AC]">
                  Matched columns
                </span>
              </div>
              <div
                className={cn(
                  'grid grid-cols-1 gap-3.5',
                  evaluatedMatchingColumns.length === 1 && 'md:grid-cols-1 max-w-md',
                  evaluatedMatchingColumns.length === 2 && 'md:grid-cols-2 max-w-3xl',
                  evaluatedMatchingColumns.length === 3 && 'md:grid-cols-3',
                  evaluatedMatchingColumns.length >= 4 && 'md:grid-cols-4',
                )}
              >
                {evaluatedMatchingColumns.map((p) => (
                  <div key={p.id} className="relative">
                    <div
                      className={cn(
                        'bg-white rounded-xl p-5 text-left group transition-all duration-300 flex flex-col justify-between h-44 relative overflow-hidden border',
                        p.matchesCriteria
                          ? p.isWinner
                            ? 'border-[#EB4501] shadow-sm'
                            : 'border-[#E8EDF2] hover:border-[#EB4501]/40'
                          : 'border-[#E8EDF2] opacity-40 grayscale',
                      )}
                    >
                      {p.isWinner && (
                        <div className="absolute -top-1.5 right-4 bg-[#EB4501] text-white text-[8px] font-extrabold px-3 py-1 rounded-b-[4px] uppercase tracking-widest z-20">
                          AI Winner
                        </div>
                      )}
                      {!p.matchesCriteria && (
                        <div className="absolute top-2 right-2 bg-red-50 text-red-500 text-[8px] font-extrabold px-2 py-0.5 rounded-[3px] uppercase tracking-wider z-20">
                          Filtered Out
                        </div>
                      )}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F4F7F9] border border-[#E8EDF2] p-1 shrink-0 flex items-center justify-center">
                          <img src={p.image} className="w-full h-full object-cover rounded-[3px]" alt={p.name} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[#EB4501] text-[8px] font-extrabold uppercase tracking-widest block leading-none mb-1">
                            {p.brand}
                          </span>
                          <h4 className="text-[#1A1A2E] text-xs font-bold line-clamp-2 leading-snug">{p.name}</h4>
                        </div>
                      </div>
                      <div>
                        <div className="w-full h-px bg-[#F4F7F9] my-2" />
                        <p className="text-[#9AA0AC] text-[10px] font-medium leading-none truncate">
                          {p.highlightText || 'Algorithmic assessment matched.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <nav
            aria-label="Compare decision profile"
            className="choosify-sticky-section-nav sticky z-40 w-full bg-white border border-[#E8EDF2] rounded-none mb-4"
          >
            <div className="px-4 sm:px-5 py-3">
              <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between min-w-0">
                <div className="flex items-center gap-2 shrink-0 select-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#9AA0AC] whitespace-nowrap">
                    Decision profile
                  </span>
                  <div className="w-2 h-2 rounded-full bg-[#EB4501] animate-pulse shrink-0" />
                </div>

                <div className="relative min-w-0 w-full md:w-auto md:max-w-full">
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-white to-transparent z-10 md:hidden"
                    aria-hidden
                  />
                  <div
                    className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-white to-transparent z-10 md:hidden"
                    aria-hidden
                  />
                  <div
                    ref={stickyNavTrackRef}
                    {...stickyNavTrackProps}
                    onTouchStart={() => {
                      userNavScrollUntilRef.current = Date.now() + 1500;
                    }}
                    className="choosify-sticky-nav-track flex items-center gap-2 min-w-0 w-full md:w-auto"
                  >
                    {compareModeOptions.map((modeOpt) => {
                      const isActive = compareMode === modeOpt.id;
                      return (
                        <button
                          key={modeOpt.id}
                          type="button"
                          onClick={() => {
                            setCompareMode(modeOpt.id);
                            triggerSoftLoading();
                          }}
                          className={cn(STICKY_PILL_BASE, isActive ? STICKY_PILL_ACTIVE : STICKY_PILL_INACTIVE)}
                        >
                          {modeOpt.icon}
                          <span>{modeOpt.label}</span>
                        </button>
                      );
                    })}

                    {quickFiltersList.length > 0 && (
                      <>
                        <div className="w-px h-6 bg-[#E8EDF2] shrink-0 mx-0.5" aria-hidden />
                        {quickFiltersList.map((filter) => (
                          <button
                            key={filter.id}
                            type="button"
                            onClick={filter.onClick}
                            className={cn(STICKY_PILL_BASE, filter.active ? STICKY_PILL_ACTIVE : STICKY_PILL_INACTIVE)}
                          >
                            <span>{filter.label}</span>
                          </button>
                        ))}
                      </>
                    )}

                    <div className="w-px h-6 bg-[#E8EDF2] shrink-0 mx-0.5" aria-hidden />
                    <button
                      type="button"
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
        </div>
      </section>

      {compareMode === 'product' ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)_260px] gap-5 items-start">
            {/* LEFT RAIL */}
            <aside className="flex flex-col gap-4 xl:sticky xl:top-28">
              <div className={railCardClass}>
                <div className="text-xs font-extrabold text-[#1A1A2E] tracking-[0.03em] mb-0.5">YOUR COMPARISON</div>
                <div className="text-[11px] text-[#9AA0AC] mb-3.5">
                  {comparedProducts.length} / 4 products
                </div>
                <div className="flex flex-col gap-3 mb-3.5">
                  {evaluatedMatchingColumns.map((p) => (
                    <div key={p.id} className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#F4F7F9]">
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#1A1A2E] truncate">{p.name}</div>
                        <div className="text-[10.5px] text-[#9AA0AC]">{p.brand}</div>
                      </div>
                      {setComparedProducts && (
                        <button
                          type="button"
                          onClick={() => removeComparedProduct(p.id)}
                          className="text-sm text-[#9AA0AC] hover:text-[#FF000D] shrink-0 cursor-pointer bg-transparent border-none p-0"
                          aria-label={`Remove ${p.name}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  {evaluatedMatchingColumns.length === 0 && (
                    <p className="text-[11px] text-[#9AA0AC]">No products selected yet.</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsProductSearchOpen(true)}
                  disabled={comparedProducts.length >= 4}
                  className="w-full bg-[#F4F7F9] border border-dashed border-[#D1D5DB] text-[#4B5563] py-2.5 rounded-lg text-[11.5px] font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Another Product
                </button>
              </div>

              <div className={railCardClass}>
                <div className="text-xs font-extrabold text-[#1A1A2E] tracking-[0.03em] mb-4">QUICK FILTERS</div>
                {productCategoryOptions.length > 0 && (
                  <>
                    <div className="text-[11px] font-bold text-[#4B5563] mb-1.5">Category</div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        triggerSoftLoading();
                      }}
                      className="w-full border border-[#E5E7EB] rounded-md px-2.5 py-2 text-xs text-[#1A1A2E] mb-4 bg-white"
                    >
                      <option value="all">All categories</option>
                      {productCategoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <div className="text-[11px] font-bold text-[#4B5563] mb-2.5">Price Range</div>
                <input
                  type="range"
                  min={1500}
                  max={5000}
                  step={100}
                  value={selectedBudget}
                  onChange={(e) => {
                    setSelectedBudget(Number(e.target.value));
                    triggerSoftLoading();
                  }}
                  className="w-full accent-[#EB4501] cursor-pointer mb-2"
                />
                <div className="flex justify-between text-[10.5px] text-[#9AA0AC] mb-5">
                  <span>৳ 1,500</span>
                  <span>৳ {selectedBudget.toLocaleString()}+</span>
                </div>

                {[
                  {
                    label: 'Show differences only',
                    on: showDifferencesOnly,
                    toggle: () => setShowDifferencesOnly((v) => !v),
                  },
                  {
                    label: 'Has live promo deal',
                    on: dealsOnly,
                    toggle: () => {
                      setDealsOnly(!dealsOnly);
                      triggerSoftLoading();
                    },
                  },
                  {
                    label: 'Official store only',
                    on: officialStoreOnly,
                    toggle: () => {
                      setOfficialStoreOnly(!officialStoreOnly);
                      triggerSoftLoading();
                    },
                  },
                ].map((tg) => (
                  <div key={tg.label} className="flex justify-between items-center mb-3.5">
                    <div className="text-[11.5px] font-semibold text-[#1A1A2E]">{tg.label}</div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={tg.on}
                      onClick={tg.toggle}
                      className={toggleSwitch(tg.on)}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-[15px] h-[15px] rounded-full bg-white transition-all',
                          tg.on ? 'right-0.5' : 'left-0.5',
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </aside>

            {/* CENTER */}
            <div className="min-w-0 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-xl min-h-[200px]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[#EB4501] border-t-transparent animate-spin" />
                    <span className="text-[13px] font-semibold text-[#1A1A2E]">Recalculating…</span>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  'grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6',
                  comparedProducts.length + heroProductSlots >= 3 && 'lg:grid-cols-3',
                  comparedProducts.length + heroProductSlots >= 4 && 'xl:grid-cols-4',
                )}
              >
                {evaluatedMatchingColumns.map((p) => (
                  <div
                    key={p.id}
                    className={cn(
                      'bg-white rounded-xl border border-[#E8EDF2] p-4 relative',
                      !p.matchesCriteria && 'opacity-40 grayscale',
                    )}
                  >
                    <div className="flex justify-between items-start mb-2.5">
                      <span
                        className={cn(
                          'text-[10px] font-extrabold px-2.5 py-1 rounded-full',
                          productWinner?.id === p.id
                            ? 'bg-[#FFF3EA] text-[#EB4501]'
                            : 'bg-[#F4F7F9] text-[#4B5563]',
                        )}
                      >
                        {productWinner?.id === p.id ? '🏆 Best pick' : p.tag || 'Compared'}
                      </span>
                      {setComparedProducts && (
                        <button
                          type="button"
                          onClick={() => removeComparedProduct(p.id)}
                          className="text-sm text-[#9AA0AC] hover:text-[#FF000D] cursor-pointer bg-transparent border-none p-0"
                          aria-label={`Remove ${p.name}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="h-[150px] mb-3 rounded-lg overflow-hidden bg-[#F4F7F9]">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[14.5px] font-extrabold text-[#1A1A2E] mb-0.5 line-clamp-2">{p.name}</div>
                    <div className="text-[11.5px] text-[#9AA0AC] mb-2.5">{p.brand}</div>
                    <div className="flex items-center gap-2 mb-3.5">
                      <div className="text-base font-extrabold text-[#1A1A2E]">
                        ৳ {(p.price || 0).toLocaleString()}
                      </div>
                      {p.specs?.officialStore === 'Yes' && (
                        <span className="text-[9.5px] font-bold text-[#4B5563] bg-[#F4F7F9] px-1.5 py-0.5 rounded">
                          Official Store
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/products/${p.id}`}
                      className="block w-full text-center bg-[#EB4501] hover:brightness-110 text-white py-2.5 rounded-lg text-xs font-bold no-underline transition-all"
                    >
                      View on Store
                    </Link>
                  </div>
                ))}
                {heroProductSlots > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsProductSearchOpen(true)}
                    className="border-[1.5px] border-dashed border-[#D1D5DB] rounded-xl flex flex-col items-center justify-center gap-3 p-4 min-h-[290px] cursor-pointer bg-transparent hover:border-[#EB4501]/40 transition-colors"
                  >
                    <div className="w-[54px] h-[54px] rounded-full border-[1.5px] border-dashed border-[#D1D5DB] flex items-center justify-center text-[22px] text-[#9AA0AC]">
                      +
                    </div>
                    <div className="text-[13px] font-bold text-[#1A1A2E] text-center">Add Another Product</div>
                    <div className="text-[10.5px] text-[#9AA0AC] text-center">Compare up to 4 products</div>
                  </button>
                )}
              </div>

              {renderSpecMatrix({ includeInlineVerdict: false })}
            </div>

            {/* RIGHT RAIL */}
            <aside className="flex flex-col gap-4 xl:sticky xl:top-28">
              <div className={railCardClass}>
                <div className="text-[22px] mb-1.5">🏆</div>
                <div className="text-[11px] font-extrabold text-[#9AA0AC] tracking-[0.03em] mb-1">
                  COMPARISON SUMMARY
                </div>
                {productWinner ? (
                  <>
                    <div className="text-[15px] font-extrabold text-[#1A1A2E] mb-1">{productWinner.name}</div>
                    <div className="text-[11.5px] text-[#9AA0AC] mb-3.5">is the best overall choice</div>
                    <div className="flex flex-col gap-2 mb-4">
                      {winnerSummaryPoints.map((sp) => (
                        <div key={sp} className="text-[11.5px] text-[#1A1A2E] flex items-center gap-1.5">
                          <span className="text-[#07DD05]">✓</span>
                          {sp}
                        </div>
                      ))}
                    </div>
                    <Link
                      to={`/products/${productWinner.id}`}
                      className="block w-full text-center bg-[#EB4501] hover:brightness-110 text-white py-2.5 rounded-lg text-xs font-bold no-underline transition-all"
                    >
                      View Full Review
                    </Link>
                  </>
                ) : (
                  <p className="text-[11.5px] text-[#9AA0AC]">Add products to see a summary.</p>
                )}
              </div>

              <div className={railCardClass}>
                <div className="text-[11px] font-extrabold text-[#1A1A2E] tracking-[0.03em] mb-0.5">
                  SCORE OVERVIEW
                </div>
                <div className="text-[10.5px] text-[#9AA0AC] mb-4">Our expert rating</div>
                <div className="flex flex-col gap-3.5">
                  {productScores.length > 0 ? (
                    productScores.map((sc) => (
                      <div key={sc.id}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-[22px] h-[22px] rounded-md overflow-hidden shrink-0 bg-[#F4F7F9]">
                            <img src={sc.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-[11.5px] font-bold text-[#1A1A2E] flex-1 truncate">{sc.name}</div>
                          <div className="text-[11px] font-extrabold text-[#1A1A2E]">
                            {sc.score}
                            <span className="font-semibold text-[#9AA0AC]">/10</span>
                          </div>
                        </div>
                        <div className="h-[5px] rounded-[3px] bg-[#F1F1F3]">
                          <div
                            className="h-full rounded-[3px] choosify-emi-gradient"
                            style={{ width: `${sc.pct}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-[#9AA0AC]">Scores appear once products are added.</p>
                  )}
                </div>
              </div>

              <div className={railCardClass}>
                <div className="text-xs font-extrabold text-[#1A1A2E] mb-0.5">NEED HELP DECIDING?</div>
                <div className="text-[11px] text-[#9AA0AC] mb-3.5">Let our AI assistant help you</div>
                <button
                  type="button"
                  onClick={handleAskEmi}
                  className="w-full text-white py-2.5 rounded-lg text-xs font-bold cursor-pointer border-none flex items-center justify-center gap-2 choosify-emi-gradient hover:brightness-110 transition-all"
                >
                  <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden p-px shrink-0">
                    <EmiAiLogo size={16} className="w-4 h-4" />
                  </span>
                  Ask Emi. A.I
                </button>
              </div>
            </aside>
          </div>

          {/* Full-width bands below grid */}
          <div className="bg-white rounded-xl border border-[#E8EDF2] px-6 py-[22px] mt-6">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="text-lg">🎬</span>
              <div className="text-sm font-extrabold text-[#1A1A2E]">Influencer reviews</div>
            </div>
            <div className="text-[11.5px] text-[#9AA0AC] mb-5">
              Creator ratings that inform the influencer score
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {[
                {
                  name: 'Sabbir Ahmed',
                  role: 'Verified Buyer',
                  quote: 'The materials here hold unique premium density. Highly recommended long-term staple.',
                  avatar: 'https://i.pravatar.cc/150?u=sabbir',
                },
                {
                  name: 'Runa Laila',
                  role: 'Premium Critic',
                  quote: 'Stitching alignment is extremely responsive. Matches precise capsule styling charts.',
                  avatar: 'https://i.pravatar.cc/150?u=runa',
                },
                {
                  name: 'Anisul Hoque',
                  role: 'Comfort Enthusiast',
                  quote: 'Outstanding value-for-money parameter alignment. Bypasses premium markup entirely.',
                  avatar: 'https://i.pravatar.cc/150?u=anis',
                },
              ].map((verdict) => (
                <div key={verdict.name} className="border border-[#E8EDF2] rounded-[10px] p-4">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-[34px] h-[34px] rounded-full overflow-hidden bg-[#F4F7F9] shrink-0">
                      <img src={verdict.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#1A1A2E]">{verdict.name}</div>
                      <div className="text-[10px] text-[#9AA0AC]">{verdict.role}</div>
                    </div>
                  </div>
                  <p className="text-[11.5px] text-[#4B5563] leading-relaxed m-0 italic">"{verdict.quote}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="choosify-dark-surface rounded-xl px-7 py-6 mt-4 text-white flex flex-wrap justify-between items-center gap-6">
            <div className="flex-1 min-w-[280px]">
              <div className="text-[13px] font-extrabold mb-2">Choosify Verdict</div>
              <p className="text-xs text-white/70 leading-relaxed m-0">
                {productWinner
                  ? `${productWinner.name} leads this comparison on overall rating and build signals. Cross-check price and availability before you buy.`
                  : 'Add at least two products to generate a Choosify verdict.'}
              </p>
            </div>
            {productWinner && (
              <div className="bg-white/10 rounded-[10px] px-5 py-4 flex items-center gap-3.5 shrink-0">
                <div className="w-12 h-12 rounded-[10px] bg-white/10 flex items-center justify-center overflow-hidden">
                  <img src={productWinner.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-[9.5px] font-extrabold text-[#EB4501] tracking-[0.05em] mb-0.5">
                    BEST OVERALL
                  </div>
                  <div className="text-[9.5px] font-bold text-white/60">{productWinner?.brand || productWinner?.brandName}</div>
                  <div className="text-[13px] font-extrabold mb-1.5">{productWinner.name}</div>
                  <Link to={`/products/${productWinner.id}`} className="text-[11px] font-bold text-[#FF9E5C] no-underline">
                    View product →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div ref={emiHelpRef} className="mt-4">
            <EmiComparePanel
              compareLabels={(comparedProducts || []).map((p: { title?: string; name?: string }) => p.title ?? p.name ?? 'Product')}
              compareMode={compareMode}
            />
          </div>

          <SponsoredCompareRail />
        </>
      ) : (
        <>
      {/* ACTIVE INTELLIGENT FILTER CHIPS */}
      <ActiveFilterChips
        chips={activeChips}
        onClearAll={handleClearAllFilters}
      />

      {/* CORE THREE-COLUMN PERFORMANCE LAYOUT */}
      <div className={`w-full py-2 ${PAGE_LISTING_SINGLE_SHELL}`}>
         
         {/* LEFT COLUMN: SYSTEM ADVANCED DECISION PANEL */}
         <aside className="lg:sticky lg:top-36 bg-transparent h-auto pb-10 flex flex-col gap-4">
           <FullSidebarFilterPanel
             title="Compare Scopes"
             onReset={handleClearAllFilters}
             advancedSection={
               <div className="flex flex-col gap-3">
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4 text-left font-sans">
                   <h4 className="text-[10px] font-extrabold text-[#8a9bb0] uppercase tracking-wider pb-1.5 border-b border-[#e8edf2] mb-3">AI Decision Matrix Rules</h4>
                   <p className="text-[10.5px] text-gray-500 font-medium leading-relaxed">
                     This sidebar directly tweaks constraints inside our matrix calculator. Dimmed columns fail to meet your custom threshold weights.
                   </p>
                 </div>
               </div>
             }
           >
             {/* CONDITIONAL SIDEBAR OPTIONS BASED ON THE ACTIVE DECISION MODE */}
             {compareMode === 'brand' && (
               <div className="flex flex-col gap-4">
                 {/* BRAND SEGMENT */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Reputation Tier</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'All Segments' },
                       { value: 'legacy', label: 'Legacy Heritage Brands' },
                       { value: 'global', label: 'Global Sourced Aesthetics' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedBrandSegment(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedBrandSegment === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedBrandSegment === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* BRAND COUNTRY REGENCY */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Country of Operation</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'All Territories' },
                       { value: 'local', label: 'Domestic Exclusive (BD)' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedBrandCountry(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedBrandCountry === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedBrandCountry === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             )}

             {compareMode === 'creator' && (
               <div className="flex flex-col gap-4">
                 {/* CREATOR PLATFORM */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Platform Focus</h3>
                   <div className="space-y-1">
                     {['all', 'YouTube', 'Instagram', 'Facebook'].map((plat) => (
                       <button
                         key={plat}
                         type="button"
                         onClick={() => { setSelectedCreatorPlatform(plat); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedCreatorPlatform === plat ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{plat === 'all' ? 'All Channels' : plat}</span>
                         {selectedCreatorPlatform === plat && <CheckCircle2 size={11} className="text-orange-primary" />}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* ENGAGEMENT WEIGHT */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Engagement Threshold</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'Standard Feed' },
                       { value: 'high', label: 'Premium Class (> 8.0%)' },
                       { value: 'rising', label: 'Broad Audience (< 8.0%)' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedCreatorEngagement(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedCreatorEngagement === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedCreatorEngagement === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             )}

             {compareMode === 'guide' && (
               <div className="flex flex-col gap-4">
                 {/* DIFFICULTY */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Difficulty Tier</h3>
                   <div className="space-y-1">
                     {['all', 'Beginner Friendly', 'Advanced Collector'].map((diff) => (
                       <button
                         key={diff}
                         type="button"
                         onClick={() => { setSelectedDifficulty(diff); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedDifficulty === diff ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{diff === 'all' ? 'All Classes' : diff}</span>
                         {selectedDifficulty === diff && <CheckCircle2 size={11} className="text-orange-primary" />}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* USE CASE */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Primary Use-Case</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'All Use Cases' },
                       { value: 'office', label: 'Professional/Office' },
                       { value: 'casual', label: 'Festive/Traditional' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedUseCase(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedUseCase === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedUseCase === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             )}

             {compareMode === 'ai' && (
               <div className="flex flex-col gap-4">
                 {/* AI SELECTION MODEL */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Best-Suited Target</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'Total Consensus' },
                       { value: 'best-value', label: 'Optimal Pricing Mix' },
                       { value: 'long-term', label: 'Fade Resistance Choice' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedAIChoice(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedAIChoice === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedAIChoice === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* RISK RATING */}
                 <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
                   <h3 className="text-[11px] font-semibold text-[#8a9bb0] uppercase tracking-wider pb-2 border-b border-[#e8edf2] mb-3">Calculated Risk Scope</h3>
                   <div className="space-y-1">
                     {[
                       { value: 'all', label: 'Show Overall Scores' },
                       { value: 'low', label: 'Strictly Lower Risk' }
                     ].map((opt) => (
                       <button
                         key={opt.value}
                         type="button"
                         onClick={() => { setSelectedRiskRating(opt.value); triggerSoftLoading(); }}
                         className={cn(
                           "w-full flex items-center justify-between text-left px-2 py-1.5 rounded-[4px] transition-colors text-xs font-semibold cursor-pointer",
                           selectedRiskRating === opt.value ? "bg-[#FFF0E8] text-orange-primary font-bold" : "text-gray-500 hover:bg-gray-50 hover:text-[#1A1D4E]"
                         )}
                       >
                         <span>{opt.label}</span>
                         {selectedRiskRating === opt.value && <CheckCircle2 size={11} className="text-orange-primary mt-0.5" />}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             )}
           </FullSidebarFilterPanel>
         </aside>

         {/* MIDDLE COLUMN: COMPARATIVE CORE */}
         <div className="choosify-middle-feed space-y-6 relative min-w-0">
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-xl h-96">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-orange-primary border-t-transparent animate-spin" />
                  <span className="text-[13px] font-semibold text-[#1A1A2E] tracking-tight">Recalculating…</span>
                </div>
              </div>
            )}
            {renderSpecMatrix()}
         </div>

         {/* RIGHT COLUMN: DECISION INSIGHTS / AI ADVISOR */}
         <aside className="lg:sticky lg:top-36 flex flex-col gap-4">
            <EmiComparePanel
              compareLabels={(comparedProducts || []).map((p: { title?: string }) => p.title ?? 'Product')}
              compareMode={compareMode}
            />
            
            {/* 1. DECISION COGNITIVE ASSISTANT CARD */}
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-5 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 text-[#EB4501] opacity-25">
                <Sparkles size={18} />
              </div>

               <div className="flex items-center gap-2 mb-3">
                  <Activity size={14} className="text-[#EB4501]" />
                  <span className="text-[9.5px] font-extrabold text-[#EB4501] uppercase tracking-widest">AI Tradeoff Engine</span>
               </div>
               
               <h4 className="text-xs font-extrabold text-[#1A1A2E] tracking-tight leading-snug mb-3">
                  {compareMode === 'brand' && 'Aarong vs Yellow Positioning'}
                  {compareMode === 'creator' && 'Nafis vs Tasnim Target Match'}
                  {compareMode === 'guide' && 'Capsule vs Traditional Use Cases'}
                  {compareMode === 'ai' && 'Value vs Longevity Cost Matrix'}
               </h4>

               <div className="space-y-3.5 text-[11px] text-[#4B5563] font-medium leading-relaxed font-sans">
                  {compareMode === 'brand' && (
                    <>
                      <div className="p-3 bg-[#F4F7F9] rounded-lg border border-[#E8EDF2]">
                        <span className="text-[#EB4501] font-bold block mb-1">Trust index priority alignment:</span>
                        Aarong holds standard elite legacy prestige. Yellow covers rapid trend updates. Target Aarong for handloom authenticity, Yellow for formal contemporary models.
                      </div>
                    </>
                  )}

                  {compareMode === 'creator' && (
                    <>
                      <div className="p-3 bg-[#F4F7F9] rounded-lg border border-[#E8EDF2]">
                        <span className="text-[#EB4501] font-bold block mb-1">Engagement vs Reach Ledger:</span>
                        Nafis holds stronger conversion indices on hardware specs, while Tasnim provides premier aesthetic context-matching options.
                      </div>
                    </>
                  )}

                  {compareMode === 'guide' && (
                    <>
                      <div className="p-3 bg-[#F4F7F9] rounded-lg border border-[#E8EDF2]">
                        <span className="text-[#EB4501] font-bold block mb-1">Capsule Integration:</span>
                        Capsule guidelines save estimated ৳15k yearly on impulse buys by enforcing matching outfit formulas.
                      </div>
                    </>
                  )}

                  {compareMode === 'ai' && (
                    <>
                      <div className="p-3 bg-[#F4F7F9] rounded-lg border border-[#E8EDF2]">
                        <span className="text-[#EB4501] font-bold block mb-1">Risk Optimization Ledger:</span>
                        Optimal value package optimizes upfront cost amortized over 12 months. Excellent low risk rating.
                      </div>
                    </>
                  )}
               </div>
            </div>

            {/* 2. SAVED COMPARISONS LOGS */}
            <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left">
              <div className="flex items-center justify-between pb-3 border-b border-[#e8edf2] mb-3">
                 <h4 className="text-[10px] font-black text-[#8a9bb0] uppercase tracking-wider">Related Decisions</h4>
                 <span className="text-[9px] font-bold text-orange-primary py-0.5 px-2 bg-orange-primary/15 rounded-full uppercase scale-95">3 Saved</span>
              </div>

              <div className="space-y-2.5">
                 {[
                   { label: 'Semi-Formal Cottons', date: 'Yesterday', count: '3 models' },
                   { label: 'Elite Traditional Brands', date: '3 days ago', count: '4 brands' },
                   { label: 'Daraz Delivery vs Outlets', date: 'Last week', count: '2 targets' }
                 ].map((comp, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 p-2.5 rounded-[4px] border border-[#e8edf2]/60 cursor-pointer transition-colors group">
                       <div>
                          <span className="text-[13px] font-bold text-[#1A1A2E] tracking-tight group-hover:text-[#CF4400] transition-colors block leading-tight">{comp.label}</span>
                          <span className="text-[11px] font-medium text-[#9AA0AC] mt-0.5 block">{comp.date}</span>
                       </div>
                       <span className="px-2 py-0.5 bg-[#D6E1EC]/30 text-navy/70 text-[8.5px] font-black rounded-full leading-none">{comp.count}</span>
                    </div>
                 ))}
              </div>
            </div>

            {/* 3. SHARE LINK GENERATION */}
            <div className="bg-white border border-[#E8EDF2] rounded-xl p-4.5 shadow-sm text-left font-sans">
               <h4 className="text-[10px] font-extrabold text-[#8a9bb0] uppercase tracking-wider leading-none mb-3">Share Comparison Matrix</h4>
               <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-3">
                 Export these active filters and parameters into a standalone share link.
               </p>
               <button className="w-full py-2.5 bg-[#EB4501]/8 hover:bg-[#CF4400]/15 border border-[#EB4501]/25 text-[#EB4501] rounded-lg text-[13px] font-bold tracking-tight flex items-center justify-center gap-1.5 transition-all cursor-pointer">
                  <Share2 size={13} /> Generate share link
               </button>
            </div>
         </aside>

      </div>


        </>
      )}

      {compareMode !== 'product' && (
        <>
          <SponsoredCompareRail />

          {/* Dynamic Community Verdict Accordion */}
          <div className="max-w-7xl mx-auto px-0 pb-16 mt-6">
            <div className="bg-white rounded-xl border border-[#E8EDF2] p-6 md:p-8 text-left">
              <h4 className="text-sm font-extrabold text-[#1A1A2E] tracking-tight mb-2">Community opinions</h4>
              <p className="text-[11.5px] text-[#9AA0AC] mb-6">What shoppers say about similar picks</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Sabbir Ahmed', role: 'Verified Buyer', quote: 'The materials here hold unique premium density. Highly recommended long-term staple.', avatar: 'https://i.pravatar.cc/150?u=sabbir' },
                  { name: 'Runa Laila', role: 'Premium Critic', quote: 'Stitching alignment is extremely responsive. Matches precise capsule styling charts.', avatar: 'https://i.pravatar.cc/150?u=runa' },
                  { name: 'Anisul Hoque', role: 'Comfort Enthusiast', quote: 'Outstanding value-for-money parameter alignment. Bypasses premium markup entirely.', avatar: 'https://i.pravatar.cc/150?u=anis' }
                ].map((verdict, idx) => (
                  <div key={idx} className="border border-[#E8EDF2] rounded-[10px] p-5 relative">
                    <p className="text-[11.5px] font-medium text-[#4B5563] italic leading-relaxed mb-4">
                      "{verdict.quote}"
                    </p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#F4F7F9] overflow-hidden">
                        <img src={verdict.avatar} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div>
                        <span className="text-[13px] font-bold text-[#1A1A2E] tracking-tight block leading-none">{verdict.name}</span>
                        <span className="text-[11px] font-medium text-[#9AA0AC] tracking-tight mt-0.5 block leading-none">{verdict.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {isProductSearchOpen && (
          <motion.div
            className="fixed inset-0 z-[260] bg-[#1A1A2E]/55 backdrop-blur-sm px-4 py-6 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-5xl mx-auto h-full flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                className="bg-white rounded-[15px] border border-[#e8edf2] shadow-2xl overflow-hidden flex flex-col min-h-0"
              >
                <div className="flex items-center justify-between gap-4 p-5 border-b border-[#e8edf2]">
                  <div>
                    <div className="text-[11px] font-semibold tracking-tight text-[#9AA0AC]">Compare builder</div>
                    <h3 className="text-base font-extrabold tracking-tight text-[#1A1A2E]">Search and add products</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsProductSearchOpen(false)}
                    className="w-9 h-9 rounded-full border border-[#e8edf2] text-[#8a9bb0] hover:text-[#CF4400] hover:border-[#EB4501]/30 flex items-center justify-center cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="p-5 border-b border-[#e8edf2] bg-[#F8FBFD]">
                  <div className="relative">
                    <input
                      type="text"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      placeholder="Search products, brands, or categories..."
                      className="w-full h-11 rounded-[5px] border border-[#e8edf2] bg-white px-4 pr-28 text-sm font-semibold text-[#1A1D4E] placeholder:text-gray-400 focus:outline-none focus:border-[#EB4501]/40"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-[#8a9bb0]">
                      {comparedProducts.length}/4 selected
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-5 bg-[#F4F7F9]">
                  {searchableProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {searchableProducts.map((product: any) => (
                        <div
                          key={product.id}
                          className="bg-white border border-[#e8edf2] rounded-[8px] p-4 flex flex-col gap-4 shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="text-left flex items-start gap-3 cursor-pointer"
                          >
                            <img
                              src={(product.images && product.images[0]) || product.image}
                              alt={product.title}
                              className="w-16 h-16 rounded-[6px] object-cover border border-[#e8edf2] shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-[11px] font-bold tracking-tight text-[#EB4501] mb-1">
                                {product.brand || product.brandName || 'Brand'}
                              </div>
                              <h4 className="text-sm font-bold text-[#1A1A2E] line-clamp-2 leading-snug">
                                {product.title || product.name}
                              </h4>
                              <p className="text-[11px] font-semibold text-gray-500 mt-1">
                                {(product.category || product.categoryName || 'Category')} {product.price ? `• ৳${Number(product.price).toLocaleString()}` : ''}
                              </p>
                            </div>
                          </button>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleAddToCompare(product);
                                if ((comparedProducts?.length || 0) + 1 >= 4) {
                                  setIsProductSearchOpen(false);
                                }
                              }}
                              className="flex-1 py-2 rounded-[5px] bg-[#EB4501] hover:brightness-110 text-white text-[10px] font-black uppercase tracking-widest cursor-pointer border-0 transition-all"
                            >
                              Add to compare
                            </button>
                            <button
                              type="button"
                              onClick={() => navigate(`/products/${product.id}`)}
                              className="px-3 py-2 rounded-[5px] border border-[#e8edf2] text-[#1A1D4E] hover:border-[#EB4501]/30 hover:text-[#CF4400] text-[10px] font-black uppercase tracking-widest cursor-pointer"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="min-h-[260px] flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-white border border-[#e8edf2] flex items-center justify-center text-[#EB4501]">
                        <ShoppingBag size={22} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold tracking-tight text-[#1A1A2E]">No matching products</h4>
                        <p className="text-[13px] font-medium text-[#9AA0AC] mt-1">
                          Try another keyword or remove a compared product first.
                        </p>
                      </div>
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
