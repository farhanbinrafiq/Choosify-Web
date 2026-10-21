import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CommerceProduct, User, Seller, Brand, Order, SubOrder, SubOrderItem, BuyerReputation } from '../types/schemas';
import { CREATORS } from '../data/creators';
import { loadMockCatalog } from '../data/loadMockCatalog';
import {
  mergeServiceSeedBrands,
  mergeServiceSeedProductDetails,
  mergeServiceSeedProducts,
  mergeServiceSeedSellers,
} from '../data/mockServiceListings';
import { buildFallbackBrandsFromMock, buildMappedProductsFromMock } from '../utils/mockCatalogHydration';
import { MOCK_CATALOG_GUIDES } from '../data/mockCatalogGuides';

/** Sample catalog data may stand in for the live API only in development. */
const ALLOW_MOCK_CATALOG = import.meta.env.DEV;
import { perfApiCall } from '../utils/performanceDev';
import { notify, toast } from '../lib/notify';
import { catalogApi } from '../services/catalogApi';
import { hydrateBrandPostsFromApi } from '../lib/brandPosts';
import { FEATURE_FLAG_DEFAULTS, isFlagEnabled, normalizeFeatureFlags } from '../lib/featureFlags';
import { operationsApi } from '../services/operationsApi';
import {
  AUTH_LOGIN_FLAG_KEY,
  AUTH_PROFILE_KEY,
  clearAuthToken,
  getAccessToken,
  persistAuthToken,
  refreshSession,
  resolveSessionUser,
  signOutSession,
} from '../lib/authSession';
import type { CatalogBrand, CatalogCategory, CatalogCreator, CatalogDeal, CatalogGuide, CatalogPlacement, CatalogProduct, CatalogProductDetail, HomepageConfig, PublicOwnership, SiteConfig } from '../types/catalog';
import { mapCatalogCreator, mapCatalogGuide } from '../utils/editorialMappers';
import { legacyNumericId } from '../../lib/publicUrls';
import { commerceProductToCatalog, resolveCatalogProducts } from '../utils/productNormalize';
import type { Creator } from '../data/creators';
import { useOptionalCmsDraftPreview } from '../contexts/CmsDraftPreviewContext';

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
    paymentMethod?: 'cod' | 'credit' | 'online';
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
  clearCartGuideOffers: () => void;
  orders: Order[];
  createOrder: (isCOD: boolean) => Order | null;
  cancelOrder: (orderId: string, reason: string) => Promise<boolean>;
  addOrder: (order: Order) => void;
  /** Insert an order that's already persisted server-side (e.g. a claimed manual order) without re-POSTing it. */
  addClaimedOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  updateSubOrderStatus: (parentOrderId: string, sellerId: string, nextStatus: 'pending' | 'dispatched' | 'transit' | 'delivered') => void;
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
  /** Server-derived claim label (from `ownership`); never a client simulation. */
  getBrandClaimStatus: (brandNameOrId: string | number) => 'verified' | 'pending' | 'community';
  getCreatorClaimStatus: (creatorIdOrName: string) => 'verified' | 'pending' | 'community';
  featureFlags: Record<string, boolean>;
  isFeatureEnabled: (key: string) => boolean;
  /** True when catalog hydrate failed and static mock data is in use. */
  isUsingFallbackData: boolean;
  /**
   * True once the first catalog hydrate has settled (real data or fallback).
   * Detail pages only redirect legacy links / show "not found" after this, so a
   * link is never resolved against the temporary mock list.
   */
  catalogReady: boolean;
}

const DEFAULT_USER: User = {
  id: 'guest',
  role: 'customer',
  name: 'Guest',
  username: 'guest',
  phone: '',
  email: '',
  avatar: '',
  address: '',
  reputation_score: 0,
  orderStats: {
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  },
  verification: {
    verified: false,
  },
  premiumStatus: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_orders');
      const parsed: Order[] = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(AUTH_PROFILE_KEY);
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
      try { localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const [isLoggedIn, _setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_LOGIN_FLAG_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  const setIsLoggedIn = (val: boolean) => {
    _setIsLoggedIn(val);
    try {
      localStorage.setItem(AUTH_LOGIN_FLAG_KEY, String(val));
      if (!val) clearAuthToken();
    } catch {}
  };

  const logout = () => {
    void signOutSession();
    _setIsLoggedIn(false);
    try {
      localStorage.setItem(AUTH_LOGIN_FLAG_KEY, 'false');
    } catch {}
  };

  // Silent restore via httpOnly refresh cookie → access token in memory → profile.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const refreshed = await refreshSession();
        if (cancelled) return;
        if (!refreshed?.accessToken) {
          clearAuthToken();
          _setIsLoggedIn(false);
          try {
            localStorage.setItem(AUTH_LOGIN_FLAG_KEY, 'false');
          } catch {}
          return;
        }
        persistAuthToken(refreshed.accessToken);
        const { user } = await resolveSessionUser(
          {
            uid: '',
            accessToken: refreshed.accessToken,
          },
          currentUserRef.current,
        );
        if (cancelled) return;
        setCurrentUser(user);
        try {
          localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(user));
          localStorage.setItem(AUTH_LOGIN_FLAG_KEY, 'true');
        } catch {}
        _setIsLoggedIn(true);
      } catch {
        if (cancelled) return;
        clearAuthToken();
        _setIsLoggedIn(false);
        try {
          localStorage.setItem(AUTH_LOGIN_FLAG_KEY, 'false');
        } catch {}
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Claim / ownership labels come ONLY from the server-computed `ownership`
  // state on catalog records (Community Claimable Profiles). No name rules, no
  // localStorage simulation: a profile is "verified" / "pending" only when the
  // backend says so.
  const allBrandsRef = useRef<Brand[]>([]);
  const allCreatorsRef = useRef<Creator[]>([]);
  const claimStatusFromOwnership = (
    ownership: PublicOwnership | undefined,
    verifiedFallback: boolean | undefined,
  ): 'verified' | 'pending' | 'community' => {
    if (!ownership) return verifiedFallback ? 'verified' : 'community';
    if (ownership.state === 'owned_verified') return 'verified';
    if (ownership.state === 'claim_pending') return 'pending';
    return 'community';
  };

  const getBrandClaimStatus = (brandNameOrId: string | number): 'verified' | 'pending' | 'community' => {
    const key = String(brandNameOrId).toLowerCase().trim();
    const found = allBrandsRef.current.find(
      (b) => String(b.id) === key || String(b.catalogId || '').toLowerCase() === key || b.name.toLowerCase().trim() === key,
    );
    return claimStatusFromOwnership(found?.ownership, found?.verifiedStatus);
  };

  const getCreatorClaimStatus = (creatorIdOrName: string): 'verified' | 'pending' | 'community' => {
    const key = String(creatorIdOrName).toLowerCase().trim();
    const found = allCreatorsRef.current.find(
      (c) => String(c.id).toLowerCase() === key || c.name.toLowerCase().trim() === key,
    );
    return claimStatusFromOwnership(found?.ownership, found?.verifiedStatus);
  };

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
    localStorage.setItem('choosify_orders', JSON.stringify(orders));
  }, [orders]);

  // Backend is source of truth for the orders list; localStorage is an optimistic cache only.
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.id || currentUser.id === 'guest') return;

    let cancelled = false;

    const mapServerOrder = (row: Record<string, unknown>): Order => {
      const subOrdersRaw = Array.isArray(row.subOrders) ? row.subOrders : [];
      return {
        orderId: String(row.orderId || row.id || ''),
        buyerId: String(row.buyerId || ''),
        isCOD: Boolean(row.isCOD),
        isSplit: Boolean(row.isSplit),
        overallTotal: Number(row.overallTotal) || 0,
        subtotal: row.subtotal !== undefined ? Number(row.subtotal) : undefined,
        deliveryTotal: row.deliveryTotal !== undefined ? Number(row.deliveryTotal) : undefined,
        promoCode: typeof row.promoCode === 'string' ? row.promoCode : undefined,
        promoDiscount: row.promoDiscount !== undefined ? Number(row.promoDiscount) : undefined,
        promoType: typeof row.promoType === 'string' ? row.promoType : undefined,
        paymentMethod: row.paymentMethod as Order['paymentMethod'],
        shipping: row.shipping as Order['shipping'],
        subOrders: subOrdersRaw.map((sub: any) => ({
          sellerId: String(sub?.sellerId || ''),
          sellerBusinessName: String(sub?.sellerBusinessName || ''),
          items: Array.isArray(sub?.items)
            ? sub.items.map((item: any) => ({
                itemId: typeof item?.itemId === 'string' ? item.itemId : undefined,
                productId: Number(item?.productId) || 0,
                productTitle: String(item?.productTitle || ''),
                quantity: Number(item?.quantity) || 0,
                price: Number(item?.price) || 0,
                image: item?.image,
                brand: item?.brand,
                variantLabel: item?.variantLabel,
                variantSku: item?.variantSku,
                notes: item?.notes,
                productType: item?.productType,
                serviceCategory: item?.serviceCategory,
                serviceDetails: item?.serviceDetails,
              }))
            : [],
          deliveryFee: Number(sub?.deliveryFee) || 0,
          invoiceId: String(sub?.invoiceId || ''),
          trackingStatus: (sub?.trackingStatus || 'pending') as SubOrder['trackingStatus'],
          codCollected: sub?.codCollected,
          estimatedDeliveryDate: sub?.estimatedDeliveryDate,
          cancellationReason: sub?.cancellationReason,
        })),
        createdAt: String(row.createdAt || new Date().toISOString()),
        status: row.status as Order['status'],
        bookingRequestId: typeof row.bookingRequestId === 'string' ? row.bookingRequestId : undefined,
        paymentDueAt: typeof row.paymentDueAt === 'string' ? row.paymentDueAt : undefined,
        paidAt: typeof row.paidAt === 'string' ? row.paidAt : undefined,
        invoiceGeneratedAt:
          typeof row.invoiceGeneratedAt === 'string' ? row.invoiceGeneratedAt : undefined,
        cancelledAt: typeof row.cancelledAt === 'string' ? row.cancelledAt : undefined,
        cancellationReason: String(row.cancellationReason || row.cancelReason || '') || undefined,
        cancelledBy: row.cancelledBy as Order['cancelledBy'],
        returnRequested: Boolean(row.returnRequested),
        returnReason: typeof row.returnReason === 'string' ? row.returnReason : undefined,
        returnRequestedAt:
          typeof row.returnRequestedAt === 'string' ? row.returnRequestedAt : undefined,
        disputeId: typeof row.disputeId === 'string' ? row.disputeId : undefined,
        codDeliveryFeePaid: Boolean(row.codDeliveryFeePaid),
        codDeliveryFeePaidAt:
          typeof row.codDeliveryFeePaidAt === 'string' ? row.codDeliveryFeePaidAt : undefined,
        codRemainingAmount:
          row.codRemainingAmount !== undefined ? Number(row.codRemainingAmount) : undefined,
        isPartialPayment: Boolean(row.isPartialPayment),
        depositPercent: row.depositPercent !== undefined ? Number(row.depositPercent) : undefined,
        depositAmount: row.depositAmount !== undefined ? Number(row.depositAmount) : undefined,
        remainingAmount: row.remainingAmount !== undefined ? Number(row.remainingAmount) : undefined,
        paymentProvider: row.paymentProvider as Order['paymentProvider'],
        paymentStatus: row.paymentStatus as Order['paymentStatus'],
        paymentTranId: typeof row.paymentTranId === 'string' ? row.paymentTranId : undefined,
        paymentValId: typeof row.paymentValId === 'string' ? row.paymentValId : undefined,
        paidAmount: row.paidAmount !== undefined ? Number(row.paidAmount) : undefined,
        paymentValidatedAt:
          typeof row.paymentValidatedAt === 'string' ? row.paymentValidatedAt : undefined,
      };
    };

    const hydrateOrdersFromApi = async () => {
      if (!getAccessToken()) return;
      try {
        const role = currentUser.role;
        const isStaff = role === 'admin' || role === 'moderator';
        // This state is the buyer's own purchase history (My Orders, order
        // tracking, warranty, cancellations, reviews) -- always fetch by
        // buyerId regardless of the account's role. A seller-role account
        // (even one still pending partner approval) can still have placed
        // real orders as a buyer and needs to see them; the seller-role
        // branch this used to take instead queried sellerId, which silently
        // returned nothing for a seller who was buying, not selling. The
        // seller's OWN incoming-orders-to-fulfill view (SellerOrdersSection)
        // fetches independently by sellerId and is unaffected by this.
        const rows = await operationsApi.listOrders(
          isStaff ? undefined : { buyerId: currentUser.id },
        );
        if (cancelled) return;
        const mapped = rows.map(mapServerOrder).filter((o) => o.orderId);
        setOrders(mapped);
      } catch {
        // Keep localStorage cache on transient failures.
      }
    };

    hydrateOrdersFromApi();
    const onFocus = () => {
      if (document.visibilityState === 'visible') hydrateOrdersFromApi();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') hydrateOrdersFromApi();
    }, 60_000);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
      window.clearInterval(interval);
    };
  }, [isLoggedIn, currentUser.id, currentUser.role]);

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
    // Sample catalog data is a development aid only — production never shows it.
    if (!ALLOW_MOCK_CATALOG) return;
    let cancelled = false;
    loadMockCatalog().then(({ products, brands, blogs }) => {
      if (cancelled) return;
      mockBrandsRef.current = brands;
      setMockMappedProducts(buildMappedProductsFromMock(products, brands));
      setMockFallbackBrands(buildFallbackBrandsFromMock(brands, getBrandClaimStatus));
      setMockGuideFallback(blogs as unknown as ReturnType<typeof mapCatalogGuide>[]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let retryTimer = 0;
    let failures = 0;
    const detailVersions = new Map<string, string>();

    async function hydrateCatalogFromApi(force = false) {
      const now = Date.now();
      if (!force && now - lastCatalogFetchAt.current < 30_000) return;
      window.clearTimeout(retryTimer);

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
        const cmsFavicon = site?.websiteAssets?.favicon;
        if (cmsFavicon && typeof document !== 'undefined') {
          const iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
          if (iconLink) iconLink.href = cmsFavicon;
        }
        setFeatureFlags((prev) => normalizeFeatureFlags({ ...prev, ...flags }));

        failures = 0;
        setIsUsingFallbackData(false);

        // Pre-hydrate a few details; on periodic refreshes only re-fetch the ones
        // whose product changed since (product pages fetch others on demand).
        const stale = products
          .slice(0, 12)
          .filter((product) => detailVersions.get(product.id) !== String(product.updatedAt ?? ''));
        if (stale.length) {
          stale.forEach((product) => detailVersions.set(product.id, String(product.updatedAt ?? '')));
          const detailEntries = await Promise.all(
            stale.map(async (product) => {
              const detail = await catalogApi.getProductDetail(product.id).catch(() => null);
              return detail ? ([product.id, detail] as const) : null;
            }),
          );
          if (cancelled) return;
          const detailsMap: Record<string, CatalogProductDetail> = {};
          detailEntries.forEach((entry) => {
            if (entry) detailsMap[entry[0]] = entry[1];
          });
          setProductDetailsById((prev) => ({ ...prev, ...detailsMap }));
        }
      } catch (error) {
        if (cancelled) return;
        // Keep whatever real catalog is already on screen and try again shortly
        // (e.g. after a 429 rate-limit response) instead of showing sample data.
        failures += 1;
        const delay = Math.min(60_000, 3_000 * 2 ** (failures - 1));
        console.warn(`[GlobalStateContext] Catalog API unavailable, retrying in ${delay / 1000}s.`, error);
        if (ALLOW_MOCK_CATALOG) {
          setIsUsingFallbackData(true);
          setCatalogGuides((prev) => (prev.length ? prev : MOCK_CATALOG_GUIDES));
        }
        retryTimer = window.setTimeout(() => hydrateCatalogFromApi(true), delay);
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
      window.clearTimeout(retryTimer);
    };
  }, []);

  // Internal numeric keys only (cart, compare, legacy lookups) — never a public
  // URL key: they can collide and lose precision. Links use lib/publicUrls.
  const toNumericId = (value: string, fallback: number): number => legacyNumericId(value, fallback);

  const apiBrands: Brand[] = (catalogBrands || []).map((brand, idx) => {
    // claimStatus/verifiedStatus MUST come from the backend record itself —
    // never from getBrandClaimStatus (a client-side/localStorage simulation
    // used only by the mock-fallback path below, before any real brand ever
    // existed). Overriding real backend claim state with that heuristic was
    // the root cause of the storefront showing a wrong ownership/claim CTA.
    return {
      id: toNumericId(brand.id, idx + 1),
      catalogId: brand.id,
      slug: brand.slug,
      publicHandle: brand.publicHandle ?? null,
      name: brand.name,
      logo: brand.logo || brand.name.slice(0, 2).toUpperCase(),
      verifiedStatus: Boolean(brand.verifiedStatus),
      followers: brand.followers || 0,
      ratings: brand.ratings || 0,
      sponsoredFlag: brand.sponsoredFlag,
      featuredFlag: brand.featuredFlag,
      category: brand.category,
      claimStatus: brand.claimStatus,
      pinnedProductIds: Array.isArray(brand.pinnedProductIds) ? brand.pinnedProductIds : undefined,
      pinnedShowcaseProductIds: Array.isArray(brand.pinnedShowcaseProductIds)
        ? brand.pinnedShowcaseProductIds
        : undefined,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
      description: brand.description || undefined,
      coverImage: brand.coverImage || undefined,
      website: brand.website || undefined,
      socialLinks: brand.socialLinks,
      overview: brand.overview,
      faq: brand.faq,
      stores: brand.stores,
      story: brand.story,
      storyBlocks: brand.storyBlocks,
      pinnedStoryContentIds: brand.pinnedStoryContentIds,
      sellerId: brand.sellerId || undefined,
      marketplaceAccess: brand.marketplaceAccess,
      marketplaceStatus: brand.marketplaceStatus,
      brandReferenceId: brand.brandReferenceId || undefined,
      ownership: brand.ownership,
      credentials: brand.credentials || undefined,
      viewCount: (brand as { viewCount?: number }).viewCount,
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
      // Carry the canonical storefront media straight through so the Product
      // Detail gallery renders real photos/video (never fabricated demo media).
      gallery: Array.isArray(product.gallery) && product.gallery.length
        ? product.gallery
        : (product.image ? [product.image] : []),
      videoUrl: (product as { videoUrl?: string }).videoUrl || undefined,
      codSupport: true,
      stock: typeof product.stock === 'number' ? product.stock : 0,
      sellerId: `seller-${(product.brandName || 'platform').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      brandId: normalizedBrandId,
      catalogBrandId: product.brandId,
      brand: product.brandName || 'Choosify',
      brandName: product.brandName || 'Choosify',
      price: product.price || 0,
      description: product.description || '',
      category: product.categoryName || 'General',
      subcategoryId: product.subcategoryId || undefined,
      subcategoryName: product.subcategoryName || undefined,
      variants: undefined,
      // No rating until the product has real reviews — never a placeholder score.
      rating: undefined,
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
      warrantyMonths: (product as { warrantyMonths?: number }).warrantyMonths,
      warrantyType: (product as { warrantyType?: string }).warrantyType,
      warrantyProvider: (product as { warrantyProvider?: string }).warrantyProvider,
      warrantyTerms: (product as { warrantyTerms?: string }).warrantyTerms,
    };
  });

  const allBrands: Brand[] = mergeServiceSeedBrands(
    apiBrands.length > 0 || !ALLOW_MOCK_CATALOG ? apiBrands : mockFallbackBrands,
  );
  const allCategories: CatalogCategory[] = catalogCategories;
  const allDeals: CatalogDeal[] = catalogDeals;
  const allCreators: Creator[] =
    catalogCreators.length > 0 || !ALLOW_MOCK_CATALOG ? catalogCreators.map(mapCatalogCreator) : CREATORS;
  allBrandsRef.current = allBrands;
  allCreatorsRef.current = allCreators;
  const allGuides =
    catalogGuides.length > 0 || !ALLOW_MOCK_CATALOG
      ? catalogGuides.map(mapCatalogGuide)
      : mockGuideFallback;
  const allPlacements: CatalogPlacement[] = catalogPlacements;

  const addToCart = (product: any, quantity: number, selectedVariant?: any) => {
    // Central stock guard -- ProductDetailPage already disables its own Add
    // to Cart button when out of stock, but quick-add entry points (product
    // cards on listing/search/category pages) called this directly with no
    // check at all, letting a 0-stock product reach checkout instead of
    // being caught until then. selectedVariant, when passed, is trusted to
    // be a real variant on this product (callers resolve that themselves).
    const variantBlocked = selectedVariant && (selectedVariant.stock === 0 || selectedVariant.enabled === false);
    const productBlocked = !selectedVariant && (product?.stock === 0 || product?.status === 'out_of_stock');
    if (variantBlocked || productBlocked) {
      notify.error(`${product?.title || 'This item'} is out of stock.`);
      return;
    }
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
  };

  const removeFromCart = (productId: number) => {
    setRetailCart(prev => prev.filter(item => item.id !== productId));
    notify.success('Removed from cart', { id: 'cart-remove' });
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    setRetailCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setRetailCart([]);
  };

  /**
   * Drop the transient guide LIVE-offer context ({ guideOfferRef, expectedUnitPrice })
   * from every cart line. Used when the server rejects a stale promotional price
   * (409 GUIDE_OFFER_PRICE_CHANGED) — the next checkout attempt then prices each
   * item at the current server-authoritative amount (a still-active offer, or the
   * canonical price) instead of the expired one.
   */
  const clearCartGuideOffers = () => {
    setRetailCart(prev =>
      prev.map(item => {
        const p = item.product as Record<string, unknown>;
        if (!p || (p.guideOfferRef === undefined && p.expectedUnitPrice === undefined)) return item;
        const { guideOfferRef: _g, expectedUnitPrice: _e, ...restProduct } = p;
        return { ...item, product: restProduct as typeof item.product };
      }),
    );
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

  const cancelOrder = async (orderId: string, reason: string): Promise<boolean> => {
    const order = orders.find(o => o.orderId === orderId);
    if (!order) {
      toast.error('Order not found.');
      return false;
    }

    const allPending = order.subOrders.every(sub => sub.trackingStatus === 'pending');
    if (!allPending) {
      toast.error('This order has already been dispatched and cannot be cancelled.');
      return false;
    }

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      toast.error('A cancellation reason is required.');
      return false;
    }

    try {
      await operationsApi.cancelOrder(orderId, order.buyerId || currentUser.id, trimmedReason);
    } catch (err) {
      toast.error((err as Error)?.message || 'Failed to cancel order on the server.');
      return false;
    }

    const cancelledAt = new Date().toISOString();
    setOrders(prev => prev.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          cancelledAt,
          cancellationReason: trimmedReason,
          cancelledBy: 'buyer' as const,
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
      window.dispatchEvent(new CustomEvent('choosify-order-cancelled', { detail: { orderId, reason: trimmedReason } }));
    }
    return true;
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const addClaimedOrder = (order: Order) => {
    setOrders(prev => (prev.some(o => o.orderId === order.orderId) ? prev : [order, ...prev]));
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

  const productSource = apiProducts.length > 0 || !ALLOW_MOCK_CATALOG ? apiProducts : mockMappedProducts;
  const allProducts = mergeServiceSeedProducts(productSource);
  const sellersWithSeed = mergeServiceSeedSellers(INITIAL_SELLERS);
  const productDetailsWithSeed = mergeServiceSeedProductDetails(productDetailsById);
  const allCatalogProducts = resolveCatalogProducts(catalogProducts, allProducts);
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
      clearCartGuideOffers,
      orders,
      createOrder,
      cancelOrder,
      addOrder,
      addClaimedOrder,
      updateOrder,
      updateSubOrderStatus,
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
      getBrandClaimStatus,
      getCreatorClaimStatus,
      featureFlags,
      isFeatureEnabled: (key: string) => isFlagEnabled(featureFlags, key),
      isUsingFallbackData,
      // Production waits for the real catalog (retrying) rather than declaring
      // pages "not found" against an empty or sample catalog.
      catalogReady: catalogProducts !== null || (ALLOW_MOCK_CATALOG && isUsingFallbackData),
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
  // Soft optional: CMS draft preview overrides published homepage/site when present.
  const draftPreview = useOptionalCmsDraftPreview();
  if (draftPreview?.homepageOverride || draftPreview?.siteOverride) {
    return {
      ...context,
      homepageConfig: draftPreview.homepageOverride ?? context.homepageConfig,
      siteConfig: draftPreview.siteOverride ?? context.siteConfig,
    };
  }
  return context;
}
