import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CommerceProduct, User, Seller, Brand, Order, SubOrder, SubOrderItem, Report, BuyerReputation } from '../types/schemas';
import { CREATORS } from '../data/creators';
import { loadMockCatalog } from '../data/loadMockCatalog';
import {
  mergeServiceSeedBrands,
  mergeServiceSeedProductDetails,
  mergeServiceSeedProducts,
  mergeServiceSeedSellers,
} from '../data/mockServiceListings';
import { buildFallbackBrandsFromMock, buildMappedProductsFromMock } from '../utils/mockCatalogHydration';
import { perfApiCall } from '../utils/performanceDev';
import { toast } from 'react-hot-toast';
import { catalogApi } from '../services/catalogApi';
import { hydrateBrandPostsFromApi } from '../lib/brandPosts';
import { FEATURE_FLAG_DEFAULTS, isFlagEnabled, normalizeFeatureFlags } from '../lib/featureFlags';
import { operationsApi } from '../services/operationsApi';
import type { CatalogBrand, CatalogCategory, CatalogCreator, CatalogDeal, CatalogGuide, CatalogPlacement, CatalogProduct, CatalogProductDetail, HomepageConfig, SiteConfig } from '../types/catalog';
import { mapCatalogCreator, mapCatalogGuide } from '../utils/editorialMappers';
import { commerceProductToCatalog, resolveCatalogProducts } from '../utils/productNormalize';
import type { Creator } from '../data/creators';

declare module '../types/schemas' {
  interface SubOrderItem {
    image?: string;
    brand?: string;
    variantLabel?: string;
    variantSku?: string;
    notes?: string;
  }

  interface Order {
    promoCode?: string;
    promoDiscount?: number;
    promoType?: string;
    subtotal?: number;
    deliveryTotal?: number;
    paymentMethod?: 'cod' | 'credit';
    shipping?: {
      fullName: string;
      phone: string;
      address: string;
      region: string;
      deliveryNotes?: string;
    };
  }
}

export interface CartItem {
  id: number;
  product: any;
  quantity: number;
  selectedVariant?: any;
}

export interface GlobalStateContextType {
  retailCart: CartItem[];
  addToCart: (product: any, quantity: number, selectedVariant?: any) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (isCOD: boolean) => Order | null;
  cancelOrder: (orderId: string, reason: string) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  updateSubOrderStatus: (parentOrderId: string, sellerId: string, nextStatus: 'pending' | 'dispatched' | 'transit' | 'delivered') => void;
  reports: Report[];
  addReport: (type: 'seller' | 'product' | 'brand', targetId: string, reason: string, description: string, evidence?: string) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  logout: () => void;
  buyerReputations: BuyerReputation[];
  sellers: Seller[];
  allBrands: Brand[];
  allProducts: CommerceProduct[];
  allCatalogProducts: CatalogProduct[];
  allCatalogBrands: CatalogBrand[];
  allCategories: CatalogCategory[];
  allDeals: CatalogDeal[];
  allCreators: Creator[];
  allCatalogCreators: CatalogCreator[];
  allGuides: ReturnType<typeof mapCatalogGuide>[];
  allCatalogGuides: CatalogGuide[];
  allPlacements: CatalogPlacement[];
  productDetailsById: Record<string, CatalogProductDetail>;
  homepageConfig: HomepageConfig | null;
  siteConfig: import('../types/catalog').SiteConfig | null;
  activeVideo: { url: string; title: string; isVertical?: boolean } | null;
  openVideo: (url: string, title: string, isVertical?: boolean) => void;
  closeVideo: () => void;
  brandClaimStatuses: Record<string, 'verified' | 'pending' | 'community'>;
  getBrandClaimStatus: (brandNameOrId: string | number) => 'verified' | 'pending' | 'community';
  updateBrandClaimStatus: (brandNameOrId: string | number, status: 'verified' | 'pending' | 'community') => void;
  creatorClaimStatuses: Record<string, 'verified' | 'pending' | 'community'>;
  getCreatorClaimStatus: (creatorIdOrName: string) => 'verified' | 'pending' | 'community';
  updateCreatorClaimStatus: (creatorIdOrName: string, status: 'verified' | 'pending' | 'community') => void;
  featureFlags: Record<string, boolean>;
  isFeatureEnabled: (key: string) => boolean;
  /** True when catalog hydrate failed and static mock data is in use. */
  isUsingFallbackData: boolean;
}

const DEFAULT_USER: User = {
  id: 'usr-892',
  role: 'customer',
  name: 'Farhan Bin Rafiq',
  username: 'farhanrafiq',
  phone: '+880 1712-349812',
  email: 'farhanbinrafiq@gmail.com',
  avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png',
  address: 'H-24, Road-11, Banani, Dhaka, Bangladesh',
  reputation_score: 95,
  orderStats: {
    totalOrders: 18,
    completedOrders: 16,
    cancelledOrders: 2
  },
  verification: {
    verified: true,
    docType: 'NID',
    docUrl: '#'
  },
  premiumStatus: true,
  createdAt: '2024-01-15T08:00:00Z',
  updatedAt: '2026-05-20T12:00:00Z'
};

const INITIAL_BUYER_REPUTATIONS: BuyerReputation[] = [
  { userId: 'usr-892', reputationScore: 95, codTrustScore: 98, cancellationRatio: 5, refusalRatio: 0 },
  { userId: 'usr-321', reputationScore: 72, codTrustScore: 68, cancellationRatio: 25, refusalRatio: 8 },
  { userId: 'usr-445', reputationScore: 45, codTrustScore: 30, cancellationRatio: 55, refusalRatio: 20 },
  { userId: 'usr-991', reputationScore: 99, codTrustScore: 100, cancellationRatio: 0, refusalRatio: 0 }
];

const INITIAL_SELLERS: Seller[] = [
  {
    id: 'seller-samsung',
    userId: 'usr-samsung',
    businessName: 'Samsung Bangladesh Ltd.',
    licenseNo: 'TR-SAM-99123',
    verificationDocs: ['TradeLicense.pdf'],
    ratings: 4.8,
    logistics: {
      provider: 'Pathao Delivery',
      supportedRegions: ['Dhaka', 'Chittagong', 'Sylhet']
    },
    sponsoredStatus: true,
    disputeHistory: { totalDisputes: 5, resolvedDisputes: 5 }
  },
  {
    id: 'seller-apple',
    userId: 'usr-apple',
    businessName: 'Apple Retail BD',
    licenseNo: 'TR-APP-88432',
    verificationDocs: ['TradeLicense2.pdf'],
    ratings: 4.9,
    logistics: {
      provider: 'Steady Express',
      supportedRegions: ['All Bangladesh']
    },
    sponsoredStatus: true,
    disputeHistory: { totalDisputes: 2, resolvedDisputes: 2 }
  },
  {
    id: 'seller-apex',
    userId: 'usr-apex',
    businessName: 'Apex Footwear Store',
    licenseNo: 'TR-APX-77541',
    verificationDocs: ['TradeLicense3.pdf'],
    ratings: 4.6,
    logistics: {
      provider: 'Paperfly logistics',
      supportedRegions: ['All Bangladesh']
    },
    sponsoredStatus: false,
    disputeHistory: { totalDisputes: 12, resolvedDisputes: 11 }
  },
  {
    id: 'seller-general',
    userId: 'usr-general',
    businessName: 'General Retail Palace',
    licenseNo: 'TR-GEN-33123',
    verificationDocs: ['TradeLicense4.pdf'],
    ratings: 4.2,
    logistics: {
      provider: 'eCourier',
      supportedRegions: ['Dhaka']
    },
    sponsoredStatus: false,
    disputeHistory: { totalDisputes: 1, resolvedDisputes: 1 }
  }
];

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

let _pendingPromo: { code: string; discount: number; type: 'flat' | 'percentage' } | null = null;

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [retailCart, setRetailCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('choosify_retail_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('choosify_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('choosify_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('choosify_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_USER, ...parsed };
      }
    } catch {}
    return DEFAULT_USER;
  });

  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      const next = { ...prev, ...updates };
      try { localStorage.setItem('choosify_user_profile', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const [isLoggedIn, _setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('choosify_is_logged_in');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const setIsLoggedIn = (val: boolean) => {
    _setIsLoggedIn(val);
    try {
      localStorage.setItem('choosify_is_logged_in', String(val));
    } catch {}
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('choosify_is_logged_in');
    // Do NOT clear user profile on logout — preserve their saved data
  };

  const [brandClaimStatuses, setBrandClaimStatuses] = useState<Record<string, 'verified' | 'pending' | 'community'>>(() => {
    const saved = localStorage.getItem('choosify_brand_claims_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      'samsung': 'verified',
      'apple': 'verified',
      'apex': 'verified',
      'bata': 'verified',
      'aarong': 'verified',
      'sony': 'community',
      'sailor': 'community',
      'yellow': 'community',
      'pickaboo': 'community',
      'ecstasy': 'community',
      'richman': 'pending',
      'star tech': 'pending',
      'star-tech': 'pending',
      'la reve': 'pending',
      'lotto': 'pending',
      'perfume world': 'pending',
      '1': 'verified',
      '2': 'verified',
      '3': 'verified',
      '4': 'verified',
      '5': 'community',
      '6': 'pending',
      '7': 'pending',
      '8': 'pending',
      '9': 'community',
      '10': 'verified',
      '11': 'community',
      '12': 'community',
      '13': 'community',
      '14': 'pending',
      '15': 'pending',
      '16': 'verified',
      '17': 'verified',
      'choosify': 'verified',
      'fff sourcing ltd': 'verified',
      'fff sourcing': 'verified'
    };
  });

  const [creatorClaimStatuses, setCreatorClaimStatuses] = useState<Record<string, 'verified' | 'pending' | 'community'>>(() => {
    const saved = localStorage.getItem('choosify_creator_claims_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      'creator-farhan': 'verified',
      'creator-sarah': 'verified',
      'creator-mily': 'pending',
      'farhan bin rafiq': 'verified',
      'sarah jenkins': 'verified',
      'mily chowdhury': 'pending'
    };
  });

  const getBrandClaimStatus = (brandNameOrId: string | number): 'verified' | 'pending' | 'community' => {
    const key = String(brandNameOrId).toLowerCase().trim();
    if (brandClaimStatuses[key]) {
      return brandClaimStatuses[key];
    }
    if (key.includes('aarong') || key.includes('samsung') || key.includes('apple') || key.includes('apex') || key.includes('bata') || key.includes('choosify') || key.includes('fff')) {
      return 'verified';
    }
    if (key.includes('richman') || key.includes('star tech') || key.includes('star-tech') || key.includes('reve') || key.includes('lotto') || key.includes('perfume')) {
      return 'pending';
    }
    return 'community';
  };

  const updateBrandClaimStatus = (brandNameOrId: string | number, status: 'verified' | 'pending' | 'community') => {
    setBrandClaimStatuses(prev => {
      const key = String(brandNameOrId).toLowerCase().trim();
      const updated = { ...prev, [key]: status };
      const foundBrand = mockBrandsRef.current.find(
        (b) => String(b.id) === key || b.name.toLowerCase().trim() === key,
      );
      if (foundBrand) {
        updated[String(foundBrand.id)] = status;
        updated[foundBrand.name.toLowerCase().trim()] = status;
      }
      localStorage.setItem('choosify_brand_claims_store', JSON.stringify(updated));
      return updated;
    });
  };

  const getCreatorClaimStatus = (creatorIdOrName: string): 'verified' | 'pending' | 'community' => {
    const key = String(creatorIdOrName).toLowerCase().trim();
    if (creatorClaimStatuses[key]) {
      return creatorClaimStatuses[key];
    }
    if (key.includes('farhan') || key.includes('sarah')) {
      return 'verified';
    }
    if (key.includes('mily')) {
      return 'pending';
    }
    return 'community';
  };

  const updateCreatorClaimStatus = (creatorIdOrName: string, status: 'verified' | 'pending' | 'community') => {
    setCreatorClaimStatuses(prev => {
      const key = String(creatorIdOrName).toLowerCase().trim();
      const updated = { ...prev, [key]: status };
      localStorage.setItem('choosify_creator_claims_store', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    console.log("--- Brand Claim Global Status Store Update ---");
    console.log("Brand: Sony | Status:", getBrandClaimStatus('Sony'), "| Source: Global Claim Status Store");
    console.log("Brand: Samsung | Status:", getBrandClaimStatus('Samsung'), "| Source: Global Claim Status Store");
  }, [brandClaimStatuses]);

  useEffect(() => {
    const handlePromo = (e: CustomEvent) => {
      _pendingPromo = e.detail || null;
    };
    window.addEventListener('choosify-promo-applied', handlePromo as EventListener);
    return () => window.removeEventListener('choosify-promo-applied', handlePromo as EventListener);
  }, []);

  useEffect(() => {
    localStorage.setItem('choosify_retail_cart', JSON.stringify(retailCart));
  }, [retailCart]);

  useEffect(() => {
    localStorage.setItem('choosify_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('choosify_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const handleBookingPaymentExpired = (event: Event) => {
      const orderId = (event as CustomEvent).detail?.orderId;
      if (!orderId) return;
      setOrders((previous) =>
        previous.map((order) =>
          order.orderId === orderId && order.status === 'pending_payment'
            ? { ...order, status: 'cancelled' }
            : order,
        ),
      );
    };
    window.addEventListener(
      'choosify-booking-payment-expired',
      handleBookingPaymentExpired,
    );
    return () =>
      window.removeEventListener(
        'choosify-booking-payment-expired',
        handleBookingPaymentExpired,
      );
  }, []);

  const [catalogBrands, setCatalogBrands] = useState<CatalogBrand[] | null>(null);
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[] | null>(null);
  const [catalogCategories, setCatalogCategories] = useState<CatalogCategory[]>([]);
  const [catalogDeals, setCatalogDeals] = useState<CatalogDeal[]>([]);
  const [catalogCreators, setCatalogCreators] = useState<CatalogCreator[]>([]);
  const [catalogGuides, setCatalogGuides] = useState<CatalogGuide[]>([]);
  const [catalogPlacements, setCatalogPlacements] = useState<CatalogPlacement[]>([]);
  const [productDetailsById, setProductDetailsById] = useState<Record<string, CatalogProductDetail>>({});
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>(() => ({
    ...FEATURE_FLAG_DEFAULTS,
  }));
  const [mockMappedProducts, setMockMappedProducts] = useState<CommerceProduct[]>([]);
  const [mockFallbackBrands, setMockFallbackBrands] = useState<Brand[]>([]);
  const [mockGuideFallback, setMockGuideFallback] = useState<ReturnType<typeof mapCatalogGuide>[]>([]);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);
  const mockBrandsRef = useRef<Array<{ id: number; name: string }>>([]);
  const lastCatalogFetchAt = useRef(0);

  useEffect(() => {
    let cancelled = false;
    loadMockCatalog().then(({ products, brands, blogs }) => {
      if (cancelled) return;
      mockBrandsRef.current = brands;
      setMockMappedProducts(buildMappedProductsFromMock(products));
      setMockFallbackBrands(buildFallbackBrandsFromMock(brands, getBrandClaimStatus));
      setMockGuideFallback(blogs as unknown as ReturnType<typeof mapCatalogGuide>[]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrateCatalogFromApi(force = false) {
      const now = Date.now();
      if (!force && now - lastCatalogFetchAt.current < 30_000) return;

      try {
        const [products, brands, categories, deals, homepage, site, creators, guides, placements] = await perfApiCall(
          'catalog-hydrate',
          () =>
            Promise.all([
              catalogApi.listProducts(),
              catalogApi.listBrands(),
              catalogApi.listCategories(),
              catalogApi.listDeals(),
              catalogApi.getHomepage(),
              catalogApi.getSiteConfig(),
              catalogApi.listCreators(),
              catalogApi.listGuides(),
              catalogApi.listPlacements(),
            ]),
        );
        await hydrateBrandPostsFromApi();
        const flags = await operationsApi.getFeatureFlags().catch(() => ({}));
        if (cancelled) return;
        lastCatalogFetchAt.current = Date.now();
        setCatalogProducts(products);
        setCatalogBrands(brands);
        setCatalogCategories(categories);
        setCatalogDeals(deals);
        setCatalogCreators(creators.length ? creators : homepage.featuredCreators || []);
        setCatalogGuides(guides.length ? guides : homepage.featuredGuides || []);
        setCatalogPlacements(placements);
        setHomepageConfig(homepage.homepage);
        setSiteConfig(site);
        setFeatureFlags((prev) => normalizeFeatureFlags({ ...prev, ...flags }));

        const detailEntries = await Promise.all(
          products.slice(0, 12).map(async (product) => {
            const detail = await catalogApi.getProductDetail(product.id);
            return detail ? ([product.id, detail] as const) : null;
          }),
        );
        const detailsMap: Record<string, CatalogProductDetail> = {};
        detailEntries.forEach((entry) => {
          if (entry) detailsMap[entry[0]] = entry[1];
        });
        setProductDetailsById(detailsMap);
        setIsUsingFallbackData(false);
      } catch (error) {
        console.warn('[GlobalStateContext] Catalog API unavailable, using static fallback.', error);
        setIsUsingFallbackData(true);
      }
    }

    const onFocus = () => {
      hydrateCatalogFromApi();
    };

    hydrateCatalogFromApi(true);
    window.addEventListener('focus', onFocus);
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        hydrateCatalogFromApi();
      }
    }, 60_000);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', onFocus);
      window.clearInterval(interval);
    };
  }, []);

  const toNumericId = (value: string, fallback: number): number => {
    const numeric = Number(value.replace(/[^0-9]/g, ''));
    return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
  };

  const apiBrands: Brand[] = (catalogBrands || []).map((brand, idx) => {
    const status = getBrandClaimStatus(brand.id);
    return {
      id: toNumericId(brand.id, idx + 1),
      catalogId: brand.id,
      slug: brand.slug,
      name: brand.name,
      logo: brand.logo || brand.name.slice(0, 2).toUpperCase(),
      verifiedStatus: brand.verifiedStatus || status === 'verified',
      followers: brand.followers || 0,
      ratings: brand.ratings || 0,
      sponsoredFlag: brand.sponsoredFlag,
      featuredFlag: brand.featuredFlag,
      category: brand.category,
      claimStatus: status,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    };
  });

  const apiProducts: CommerceProduct[] = (catalogProducts || []).map((product, idx) => {
    const normalizedId = toNumericId(product.id, idx + 1);
    const normalizedBrandId = toNumericId(product.brandId, idx + 1);
    return {
      id: normalizedId,
      catalogId: product.id,
      slug: product.slug,
      title: product.title,
      image: product.image || '',
      codSupport: true,
      stock: typeof product.stock === 'number' ? product.stock : 0,
      sellerId: `seller-${(product.brandName || 'platform').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      brandId: normalizedBrandId,
      brand: product.brandName || 'Choosify',
      price: product.price || 0,
      description: product.description || '',
      category: product.categoryName || 'General',
      variants: undefined,
      rating: 4.5,
      isDeal: product.isDeal,
      dealType: product.dealType,
      discountPercent: product.discountPercent,
      originalPrice: product.originalPrice,
      promoCode: product.promoCode,
      dealValidUntil: product.dealValidUntil,
      featuredFlag: product.featuredFlag,
      isNewArrival: product.isNewArrival,
      isBestseller: product.isBestseller,
      createdAt: product.createdAt,
      publishedAt: product.createdAt,
      productType: (product as { productType?: 'physical' | 'service' }).productType,
      serviceCategory: (product as { serviceCategory?: string }).serviceCategory,
    };
  });

  const allBrands: Brand[] = mergeServiceSeedBrands(
    apiBrands.length > 0 ? apiBrands : mockFallbackBrands,
  );
  const allCategories: CatalogCategory[] = catalogCategories;
  const allDeals: CatalogDeal[] = catalogDeals;
  const allCreators: Creator[] = catalogCreators.length > 0 ? catalogCreators.map(mapCatalogCreator) : CREATORS;
  const allGuides =
    catalogGuides.length > 0
      ? catalogGuides.map(mapCatalogGuide)
      : mockGuideFallback;
  const allPlacements: CatalogPlacement[] = catalogPlacements;

  const addToCart = (product: any, quantity: number, selectedVariant?: any) => {
    setRetailCart(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        ((!item.selectedVariant && !selectedVariant) || 
         (item.selectedVariant?.sku === selectedVariant?.sku))
      );
      if (existing) {
        return prev.map(item => 
          (item.product.id === product.id && 
           ((!item.selectedVariant && !selectedVariant) || 
            (item.selectedVariant?.sku === selectedVariant?.sku)))
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const uniqueCartItemId = Date.now() + Math.floor(Math.random() * 1000);
      return [...prev, { id: uniqueCartItemId, product, quantity, selectedVariant }];
    });
    toast.success(`Added ${quantity} units to your cart`);
  };

  const removeFromCart = (productId: number) => {
    setRetailCart(prev => prev.filter(item => item.id !== productId));
    toast.success('Removed from cart');
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    setRetailCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setRetailCart([]);
  };

  const createOrder = (isCOD: boolean): Order | null => {
    const currentCart = retailCart;
    if (currentCart.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }

    if (isCOD) {
      const reputation = INITIAL_BUYER_REPUTATIONS.find(rep => rep.userId === currentUser.id);
      if (reputation) {
        if (reputation.codTrustScore < 50) {
          toast.error('COD is not available for your account due to high cancellation history. Please use online payment.');
          return null;
        }
        if (reputation.cancellationRatio > 40) {
          toast.error('COD restricted: cancellation ratio is too high for your account.');
          return null;
        }
      }
    }

    const processItemPrice = (item: CartItem) => item.product.price;

    // Group items by seller
    const itemsBySeller: { [sellerId: string]: CartItem[] } = {};
    currentCart.forEach(item => {
      const sId = item.product.sellerId || 'seller-general';
      if (!itemsBySeller[sId]) {
        itemsBySeller[sId] = [];
      }
      itemsBySeller[sId].push(item);
    });

    const subOrders: SubOrder[] = [];
    let overallTotal = 0;

    Object.keys(itemsBySeller).forEach(sId => {
      const sellerItems = itemsBySeller[sId];
      const sellerObj = INITIAL_SELLERS.find(s => s.id === sId) || INITIAL_SELLERS[3];
      
      const subItems: SubOrderItem[] = sellerItems.map(item => {
        const itemPrice = processItemPrice(item);
        return {
          productId: item.product.id,
          productTitle: item.product.title,
          quantity: item.quantity,
          price: itemPrice
        };
      });

      const subTotal = subItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      const deliveryFee = 120;
      
      overallTotal += subTotal + deliveryFee;

      subOrders.push({
        sellerId: sId,
        sellerBusinessName: sellerObj.businessName,
        items: subItems,
        deliveryFee,
        invoiceId: `INV-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`,
        trackingStatus: 'pending'
      });
    });

    const isSplit = subOrders.length > 1;

    const newOrder: Order = {
      orderId: `ORD-${Date.now()}`,
      buyerId: currentUser.id,
      isCOD,
      isSplit,
      overallTotal,
      subOrders,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    if (_pendingPromo) {
      newOrder.promoCode = _pendingPromo.code;
      newOrder.promoDiscount = _pendingPromo.discount;
      newOrder.promoType = _pendingPromo.type;
      _pendingPromo = null; // clear after consuming
    }

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    toast.success(`Order Placed Successfully! ${isSplit ? 'Split into ' + subOrders.length + ' deliveries per seller.' : 'Sent to dispatch.'}`);
    
    // Dispatch a custom window event for addToRecentlyViewed/notifications bridge
    window.dispatchEvent(new CustomEvent('choosify-order-placed', { detail: { orderId: newOrder.orderId } }));
    
    return newOrder;
  };

  const cancelOrder = (orderId: string, reason: string) => {
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
      toast.error('Order not found.');
      return;
    }

    const allPending = order.subOrders.every(sub => sub.trackingStatus === 'pending');
    if (!allPending) {
      toast.error('This order has already been dispatched and cannot be cancelled.');
      return;
    }

    setOrders(prev => prev.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason,
          status: 'cancelled' as const
        };
      }
      return o;
    }));

    toast.success('Order cancelled successfully.');

    // Trigger notification if available, otherwise just use standard channels
    const addNotification = (window as any).choosifyAddNotification;
    if (typeof addNotification === 'function') {
      addNotification(`Your order ${orderId} has been successfully cancelled!`, 'order');
    } else {
      window.dispatchEvent(new CustomEvent('choosify-order-cancelled', { detail: { orderId, reason } }));
    }
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    operationsApi.createOrder(order as unknown as Record<string, unknown>).catch(() => {});
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.orderId === orderId ? { ...order, ...updates } : order,
      ),
    );
  };

  const updateSubOrderStatus = (parentOrderId: string, sellerId: string, nextStatus: 'pending' | 'dispatched' | 'transit' | 'delivered') => {
    setOrders(prev => prev.map(o => {
      if (o.orderId === parentOrderId) {
        return {
          ...o,
          subOrders: o.subOrders.map((sub: any) => {
            if (sub.sellerId === sellerId) {
              return { ...sub, trackingStatus: nextStatus };
            }
            return sub;
          })
        };
      }
      return o;
    }));
  };

  const addReport = (
    type: 'seller' | 'product' | 'brand',
    targetId: string,
    reason: string,
    description: string,
    evidence?: string
  ) => {
    const newReport: Report = {
      report_id: `REP-${Date.now()}`,
      reporter_id: currentUser.id,
      type,
      targetId,
      reason,
      description,
      evidence,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
    toast.success(`Thank you. Your report has been registered. ID: ${newReport.report_id}`, {
      duration: 4000
    });
  };

  const productSource = apiProducts.length > 0 ? apiProducts : mockMappedProducts;
  const allProducts = mergeServiceSeedProducts(productSource);
  const sellersWithSeed = mergeServiceSeedSellers(INITIAL_SELLERS);
  const productDetailsWithSeed = mergeServiceSeedProductDetails(productDetailsById);
  const allCatalogProducts = resolveCatalogProducts(catalogProducts, productSource);
  const allCatalogBrands = catalogBrands?.length
    ? catalogBrands
    : allBrands.map((brand, idx) => ({
        id: brand.catalogId || String(brand.id),
        slug: brand.slug || String(brand.id),
        name: brand.name,
        category: brand.category || 'General',
        description: '',
        logo: brand.logo,
        verifiedStatus: brand.verifiedStatus,
        claimStatus: brand.claimStatus || 'community',
        followers: brand.followers || 0,
        ratings: brand.ratings || 0,
        featuredFlag: Boolean(brand.featuredFlag),
        sponsoredFlag: Boolean(brand.sponsoredFlag),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } satisfies CatalogBrand));
  const allCatalogGuides = catalogGuides;

  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string; isVertical?: boolean } | null>(null);

  const openVideo = (url: string, title: string, isVertical?: boolean) => {
    setActiveVideo({ url, title, isVertical });
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  return (
    <GlobalStateContext.Provider value={{
      retailCart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      createOrder,
      cancelOrder,
      addOrder,
      updateOrder,
      updateSubOrderStatus,
      reports,
      addReport,
      currentUser,
      setCurrentUser,
      updateCurrentUser,
      isLoggedIn,
      setIsLoggedIn,
      logout,
      buyerReputations: INITIAL_BUYER_REPUTATIONS,
      sellers: sellersWithSeed,
      allBrands,
      allProducts,
      allCatalogProducts,
      allCatalogBrands,
      allCategories,
      allDeals,
      allCreators,
      allCatalogCreators: catalogCreators,
      allGuides,
      allCatalogGuides,
      allPlacements,
      productDetailsById: productDetailsWithSeed,
      homepageConfig,
      siteConfig,
      activeVideo,
      openVideo,
      closeVideo,
      brandClaimStatuses,
      getBrandClaimStatus,
      updateBrandClaimStatus,
      creatorClaimStatuses,
      getCreatorClaimStatus,
      updateCreatorClaimStatus,
      featureFlags,
      isFeatureEnabled: (key: string) => isFlagEnabled(featureFlags, key),
      isUsingFallbackData,
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}
