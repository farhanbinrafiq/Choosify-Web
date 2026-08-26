import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { toast } from '../lib/notify';
import {
  CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
  CHOOSIFY_ANNOUNCEMENTS_TITLE,
  CHOOSIFY_ANNOUNCEMENTS_AVATAR,
  CHOOSIFY_ANNOUNCEMENTS_WELCOME,
  formatAnnouncementBody,
  type AnnouncementAssociatedEntity,
} from '../lib/announcements';
import {
  EMI_MESSAGES_THREAD_ID,
  EMI_MESSAGES_THREAD_TITLE,
  EMI_MESSAGES_THREAD_AVATAR,
  EMI_MESSAGES_THREAD_WELCOME,
} from '../lib/emiThread';
import type { CustomerAddress } from '../lib/address/addressTypes';
import { ADDRESS_STORAGE_KEY, getDefaultAddress, normalizeDefaultAddress } from '../lib/address/addressUtils';
import { db } from '../lib/firestoreClient';
import { getAccessToken } from '../lib/authSession';
import type { BookingOfferCard } from '../types/serviceBooking';
import type { ManualOrderOfferCard } from '../types/manualOrder';
import { operationsApi } from '../services/operationsApi';
import { useGlobalState } from './GlobalStateContext';
import {
  compareCategoryBrowseHref,
  compareCategoryMismatchMessage,
  getCompareLockedCategory,
  isSameCompareCategory,
  pruneComparedToFirstCategory,
  type CompareLockedCategory,
} from '../utils/compareCategory';

export type { AnnouncementAssociatedEntity };

/** Stable numeric id from omni message string ids (ThreadMessage.id stays number). */
function stableMessageNumericId(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (Math.imul(31, hash) + key.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(hash);
  return abs > 0 ? abs : Date.now();
}

export interface MessageThread {
  id: string;
  title: string;
  avatar: string;
  lastMessage: string;
  time: string;
  type: 'retail' | 'general' | 'announcement';
  unread: boolean;
  orderRef?: string;
  readOnly?: boolean;
}

export interface ThreadMessage {
  id: number;
  /** Omni/platform message id when hydrated from GET /operations/platform-messages */
  serverId?: string;
  threadId: string;
  text: string;
  sender: 'user' | 'other' | 'admin' | 'seller' | 'creator';
  time: string;
  senderName: string;
  avatar?: string;
  /** ISO timestamp for grouping dividers (optional for legacy messages). */
  createdAt?: string;
  /** Delivery status for the viewer's own messages. */
  status?: 'sent' | 'delivered' | 'seen';
  productCard?: {
    image: string;
    name: string;
    variant: string;
    color: string;
    quantity: number;
    notes: string;
    price: number;
    link: string;
    status?: string;
    counterPrice?: number;
  };
  /** Negotiable service/product request rendered as a distinct card in this thread */
  bookingOffer?: BookingOfferCard;
  /** Seller-initiated manual product order offer (Sprint 10) — accept/reject only, deliberately separate from bookingOffer. */
  orderOffer?: ManualOrderOfferCard;
  /**
   * For Choosify Announcements messages: the product/guide/campaign/etc.
   * this announcement is about. Used by the announcements right rail.
   */
  associatedEntity?: AnnouncementAssociatedEntity;
}

export interface Campaign {
  id: string;
  title: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  startDate: string;
  endDate: string;
  priority: number;
  active: boolean;
  sponsorBadge?: string;
  countdownEnd?: string;
}

export interface CustomOverview {
  id: string;
  targetType: 'brand' | 'product';
  targetId: string; // brand name (lowercase) or product id
  sectionName: string; // e.g. "Sustainability"
  content: string[]; // list of bullet points / lines
}

interface DashboardContextType {
  savedProducts: any[];
  setSavedProducts: React.Dispatch<React.SetStateAction<any[]>>;
  savedBrands: any[];
  setSavedBrands: React.Dispatch<React.SetStateAction<any[]>>;
  lovedBrands: any[];
  setLovedBrands: React.Dispatch<React.SetStateAction<any[]>>;
  followedBrands: any[];
  setFollowedBrands: React.Dispatch<React.SetStateAction<any[]>>;
  recentlyViewed: any[];
  setRecentlyViewed: React.Dispatch<React.SetStateAction<any[]>>;
  savedGuides: any[];
  setSavedGuides: React.Dispatch<React.SetStateAction<any[]>>;
  comparedProducts: any[];
  setComparedProducts: React.Dispatch<React.SetStateAction<any[]>>;
  /** Category locked by the first item in the active comparison; null when empty. */
  compareLockedCategory: CompareLockedCategory | null;
  canAddToCompare: (product: any) => boolean;
  getCompareCategoryBrowseHref: () => string | null;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  threads: MessageThread[];
  setThreads: React.Dispatch<React.SetStateAction<MessageThread[]>>;
  threadMessages: ThreadMessage[];
  setThreadMessages: React.Dispatch<React.SetStateAction<ThreadMessage[]>>;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  reviews: any[];
  setReviews: React.Dispatch<React.SetStateAction<any[]>>;
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  customOverviews: CustomOverview[];
  setCustomOverviews: React.Dispatch<React.SetStateAction<CustomOverview[]>>;
  customerAddresses: CustomerAddress[];
  setCustomerAddresses: React.Dispatch<React.SetStateAction<CustomerAddress[]>>;
  defaultCustomerAddress?: CustomerAddress;
  addCustomerAddress: (address: CustomerAddress) => void;
  updateCustomerAddress: (address: CustomerAddress) => void;
  deleteCustomerAddress: (id: string) => void;
  setDefaultCustomerAddress: (id: string) => void;
  removeSavedProduct: (id: number) => void;
  removeSavedBrand: (id: number) => void;
  toggleLoveBrand: (brand: any) => void;
  toggleFollowBrand: (brand: any) => void;
  addRecentlyViewed: (product: any) => void;
  addToCompare: (product: any) => void;
  removeFromCompare: (id: number) => void;
  addMessage: (text: string, sender: 'user' | 'other' | 'admin' | 'seller' | 'creator') => void;
  addThreadMessage: (
    threadId: string,
    text: string,
    sender: 'user' | 'other' | 'admin' | 'seller' | 'creator',
    senderName?: string,
    productCard?: any,
    bookingOffer?: BookingOfferCard,
    orderOffer?: ManualOrderOfferCard,
  ) => void;
  createNewThread: (id: string, title: string, avatar: string, type: 'retail' | 'general' | 'announcement', lastMessage: string, orderRef?: string) => void;
  markAllAsRead: () => void;
  addToRecentlyViewed: (product: any) => void;
  addNotification: (message: string, type: 'order' | 'message' | 'system' | 'deal') => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

function readStoredArray(key: string): any[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Per-account personal data (saved items, addresses, payment methods, etc.)
 * is cached in localStorage, which is scoped to the browser, not the signed-
 * in account. Without a userId suffix, logging into a different account on
 * the same device/browser would silently inherit the previous account's
 * saved products, addresses, and payment methods. Logged-out state uses the
 * bare key so anonymous browsing still has somewhere to stash e.g. a
 * pre-login wishlist click.
 */
function scopedKey(base: string, userId?: string | null): string {
  return userId ? `${base}::${userId}` : base;
}

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  // Read first: personal-data cache keys below are scoped by this id.
  const { currentUser, isLoggedIn } = useGlobalState();
  const userId = currentUser?.id;

  const [savedProducts, setSavedProducts] = useState<any[]>(() => readStoredArray(scopedKey('choosify_saved_products', userId)));
  const [savedBrands, setSavedBrands] = useState<any[]>(() => readStoredArray(scopedKey('choosify_saved_brands', userId)));
  const [lovedBrands, setLovedBrands] = useState<any[]>(() => readStoredArray(scopedKey('choosify_loved_brands', userId)));
  const [followedBrands, setFollowedBrands] = useState<any[]>(() => readStoredArray(scopedKey('choosify_followed_brands', userId)));
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>(() => readStoredArray(scopedKey('choosify_recently_viewed', userId)));
  const [customerAddresses, setCustomerAddresses] = useState<CustomerAddress[]>(() =>
    normalizeDefaultAddress(readStoredArray(scopedKey(ADDRESS_STORAGE_KEY, userId)) as CustomerAddress[]),
  );

  const [savedGuides, setSavedGuides] = useState<any[]>(() =>
    readStoredArray(scopedKey('choosify_saved_guides', userId)).filter((guide) => guide && guide.id != null),
  );

  const [comparedProducts, setComparedProducts] = useState<any[]>(() =>
    pruneComparedToFirstCategory(readStoredArray(scopedKey('choosify_compared_products', userId))),
  );

  // Re-read every scoped key when the signed-in account changes (login,
  // logout, or switching accounts) without a full page reload -- the lazy
  // initializers above only run once, at first mount.
  const mountedUserIdRef = useRef(userId);
  useEffect(() => {
    if (mountedUserIdRef.current === userId) return;
    mountedUserIdRef.current = userId;
    setSavedProducts(readStoredArray(scopedKey('choosify_saved_products', userId)));
    setSavedBrands(readStoredArray(scopedKey('choosify_saved_brands', userId)));
    setLovedBrands(readStoredArray(scopedKey('choosify_loved_brands', userId)));
    setFollowedBrands(readStoredArray(scopedKey('choosify_followed_brands', userId)));
    setRecentlyViewed(readStoredArray(scopedKey('choosify_recently_viewed', userId)));
    setCustomerAddresses(normalizeDefaultAddress(readStoredArray(scopedKey(ADDRESS_STORAGE_KEY, userId)) as CustomerAddress[]));
    setSavedGuides(readStoredArray(scopedKey('choosify_saved_guides', userId)).filter((guide) => guide && guide.id != null));
    setComparedProducts(pruneComparedToFirstCategory(readStoredArray(scopedKey('choosify_compared_products', userId))));
  }, [userId]);

  // Threaded Messaging States with Localstorage persistence
  const FAKE_DEMO_THREAD_IDS = ['thread-general', 'seller-apple', 'seller-panorama-hotel'];

  const [threads, setThreads] = useState<MessageThread[]>(() => {
    const saved = localStorage.getItem('choosify_threads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MessageThread[];
        if (!Array.isArray(parsed)) throw new Error('bad threads');
        // One-time cleanup: earlier builds seeded (and kept re-seeding) fake
        // demo conversations -- "Apple Retail BD", "Panorama Hotel Dhaka",
        // and a fabricated exchange with a fake buyer and a reply attributed
        // to the real site owner -- into every account. Strip them out of
        // whatever a browser already has saved.
        return parsed.filter((t) => !FAKE_DEMO_THREAD_IDS.includes(t.id));
      } catch {
        // fall through to defaults
      }
    }
    const welcomeTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return [
      {
        id: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
        title: CHOOSIFY_ANNOUNCEMENTS_TITLE,
        avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
        lastMessage: CHOOSIFY_ANNOUNCEMENTS_WELCOME,
        time: welcomeTime,
        type: 'announcement',
        unread: false,
        readOnly: true,
      },
      {
        id: EMI_MESSAGES_THREAD_ID,
        title: EMI_MESSAGES_THREAD_TITLE,
        avatar: EMI_MESSAGES_THREAD_AVATAR,
        lastMessage: EMI_MESSAGES_THREAD_WELCOME,
        time: welcomeTime,
        type: 'general',
        unread: false,
      },
    ];
  });

  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>(() => {
    const saved = localStorage.getItem('choosify_thread_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ThreadMessage[];
        // Matches the threads cleanup above -- drop messages belonging to
        // the removed fake demo threads.
        return Array.isArray(parsed)
          ? parsed.filter((m) => !FAKE_DEMO_THREAD_IDS.includes(m.threadId))
          : parsed;
      } catch {
        return [];
      }
    }
    const welcomeTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return [
      {
        id: 100,
        threadId: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
        text: CHOOSIFY_ANNOUNCEMENTS_WELCOME,
        sender: 'admin',
        senderName: CHOOSIFY_ANNOUNCEMENTS_TITLE,
        time: welcomeTime,
        avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
      },
      {
        id: 102,
        threadId: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
        text: formatAnnouncementBody(
          'Samsung Galaxy S24 Ultra just dropped 5% — compare verified store prices before they sell out.',
          'Price Drop Alert',
        ),
        sender: 'admin',
        senderName: CHOOSIFY_ANNOUNCEMENTS_TITLE,
        time: welcomeTime,
        avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
        associatedEntity: {
          type: 'product',
          id: '1',
          title: 'Samsung Galaxy S24 Ultra',
          subtitle: 'Price drop · Mobile & Phones',
          href: '/products/1',
          ctaLabel: 'View product',
        },
      },
      {
        id: 103,
        threadId: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
        text: formatAnnouncementBody(
          'The "Best Smartwatches 2026" guide has new entries and updated picks for Bangladesh buyers.',
          'Guide Update',
        ),
        sender: 'admin',
        senderName: CHOOSIFY_ANNOUNCEMENTS_TITLE,
        time: welcomeTime,
        avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
        associatedEntity: {
          type: 'guide',
          id: '1',
          title: 'Best Smartwatches 2026',
          subtitle: 'Updated buying guide',
          href: '/guides/1',
          ctaLabel: 'Open guide',
        },
      },
      {
        id: 104,
        threadId: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
        text: formatAnnouncementBody(
          'Eid Mega Sale is live — early deal access for verified buyers this week.',
          'Campaign Alert',
        ),
        sender: 'admin',
        senderName: CHOOSIFY_ANNOUNCEMENTS_TITLE,
        time: welcomeTime,
        avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
        associatedEntity: {
          type: 'campaign',
          id: 'camp-1',
          title: 'Eid Mega Sale',
          subtitle: 'Limited-time campaign',
          href: '/deals',
          ctaLabel: 'Browse deals',
        },
      },
      {
        id: 101,
        threadId: EMI_MESSAGES_THREAD_ID,
        text: EMI_MESSAGES_THREAD_WELCOME,
        sender: 'other',
        senderName: EMI_MESSAGES_THREAD_TITLE,
        time: welcomeTime,
        avatar: EMI_MESSAGES_THREAD_AVATAR,
      },
    ];
  });

  // Flat messages list (backwards compatibility)
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am interested in the Samsung S24 Ultra you posted. Is it still available?', sender: 'other', senderName: 'Rahat Hossain', time: '10:30 AM', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, text: 'Yes, it is still available. Would you like to know more about the warranty?', sender: 'user', time: '10:35 AM' },
    { id: 3, text: 'I have a question about the delivery time to Chittagong.', sender: 'other', senderName: 'Admin Support', time: '11:00 AM', avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png' }
  ]);
  const [notifications, setNotifications] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_notifications');
      return saved ? JSON.parse(saved) : [
        { id: 1, title: 'Price Drop Alert', message: 'Samsung S24 Ultra is now 5% cheaper!', time: '2 hours ago', type: 'price', read: false },
        { id: 2, title: 'New Review Reply', message: 'An expert replied to your review on Apex Runner Elite.', time: '5 hours ago', type: 'reply', read: true },
        { id: 3, title: 'Guide Update', message: 'The "Best Smartwatches 2026" guide has new entries.', time: '1 day ago', type: 'system', read: false }
      ];
    } catch {
      return [
        { id: 1, title: 'Price Drop Alert', message: 'Samsung S24 Ultra is now 5% cheaper!', time: '2 hours ago', type: 'price', read: false },
        { id: 2, title: 'New Review Reply', message: 'An expert replied to your review on Apex Runner Elite.', time: '5 hours ago', type: 'reply', read: true },
        { id: 3, title: 'Guide Update', message: 'The "Best Smartwatches 2026" guide has new entries.', time: '1 day ago', type: 'system', read: false }
      ];
    }
  });

  const [reviews, setReviews] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      // Prefer empty over fabricated seed — real rows come from GET /operations/reviews.
      return [];
    } catch {
      return [];
    }
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('choosify_campaigns');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'camp-1',
        title: 'BLACK FRIDAY',
        tagline: 'UP TO 70% OFF SELECT PRODUCTS',
        ctaText: 'EXPLORE DEALS',
        ctaLink: '/deals',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=1600&q=80',
        startDate: '2026-11-20',
        endDate: '2026-11-30',
        priority: 10,
        active: true,
        sponsorBadge: 'Platform Promotion',
        countdownEnd: '2026-11-28T12:00:00Z'
      },
      {
        id: 'camp-2',
        title: 'SUMMER FEST',
        tagline: 'SEASONAL PICKS CURATED FOR YOU',
        ctaText: 'SHOP COLLECTION',
        ctaLink: '/categories?cat=fashion',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
        startDate: '2026-06-01',
        endDate: '2026-08-31',
        priority: 8,
        active: true,
        sponsorBadge: 'Summer Special',
        countdownEnd: '2026-07-15T00:00:00Z'
      },
      {
        id: 'camp-3',
        title: 'WORLD CUP SPECIAL',
        tagline: 'FAN FAVORITES & LIMITED EDITIONS',
        ctaText: 'EXPLORE',
        ctaLink: '/products',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=80',
        startDate: '2026-06-10',
        endDate: '2026-07-10',
        priority: 9,
        active: true,
        sponsorBadge: 'Fan Zone',
        countdownEnd: '2026-07-12T18:00:00Z'
      },
      {
        id: 'camp-4',
        title: 'BRAND LAUNCH',
        tagline: 'DISCOVER NEW ARRIVALS',
        ctaText: 'VIEW PRODUCTS',
        ctaLink: '/brands',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80',
        startDate: '2026-06-15',
        endDate: '2026-06-30',
        priority: 7,
        active: true,
        sponsorBadge: 'Exclusive Launch'
      }
    ];
  });



  const appendAnnouncementMessage = useCallback((
    text: string,
    markUnread = true,
    associatedEntity?: AnnouncementAssociatedEntity,
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const preview = text.split('\n')[0].slice(0, 120);

    setThreadMessages(prev => [
      ...prev,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        threadId: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
        text,
        sender: 'admin',
        senderName: CHOOSIFY_ANNOUNCEMENTS_TITLE,
        time: timeStr,
        avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
        associatedEntity,
      },
    ]);

    setThreads(prev => {
      const existing = prev.find(t => t.id === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID);
      const announcementThread: MessageThread = {
        id: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
        title: CHOOSIFY_ANNOUNCEMENTS_TITLE,
        avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
        lastMessage: preview,
        time: timeStr,
        type: 'announcement',
        unread: markUnread,
        readOnly: true,
      };

      if (!existing) {
        return [announcementThread, ...prev];
      }

      return [
        { ...existing, ...announcementThread, unread: markUnread || existing.unread },
        ...prev.filter(t => t.id !== CHOOSIFY_ANNOUNCEMENTS_THREAD_ID),
      ];
    });
  }, []);

  const [customOverviews, setCustomOverviews] = useState<CustomOverview[]>(() => {
    const saved = localStorage.getItem('choosify_custom_overviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (co) => co && Array.isArray(co.content),
          ) as CustomOverview[];
        }
      } catch {
        /* fall through to defaults */
      }
    }
    return [
      {
        id: 'co-sample-1',
        targetType: 'product',
        targetId: '1', // Samsung Galaxy S24 Ultra
        sectionName: 'Sustainability',
        content: [
          'Eco-friendly 100% recycled titanium frame components',
          'Shipped in plastic-free packaging certified by local regulators',
          'Long-life components designed for circular trade-in value'
        ]
      },
      {
        id: 'co-sample-2',
        targetType: 'brand',
        targetId: 'apex',
        sectionName: 'Warranty Information',
        content: [
          'Includes local 180 days manufacturing defects coverage',
          'Easy claim process at any authorized retail outlet across Bangladesh'
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('choosify_custom_overviews', JSON.stringify(customOverviews));
  }, [customOverviews]);

  const removeSavedProduct = (id: number) => {
    setSavedProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product removed from vault');
  };

  const removeSavedBrand = (id: number) => {
    setSavedBrands(prev => prev.filter(b => b.id !== id));
    toast.success('Brand removed from saved list');
  };

  const toggleLoveBrand = (brand: any) => {
    setLovedBrands(prev => {
      const exists = prev.some(b => b.id === brand.id);
      if (exists) {
        toast.success(`${brand.name} removed from Loved Brands`);
        return prev.filter(b => b.id !== brand.id);
      } else {
        toast.success(`Reacted with Love to ${brand.name}!`);
        return [...prev, brand];
      }
    });
  };

  const toggleFollowBrand = (brand: any) => {
    setFollowedBrands(prev => {
      const exists = prev.some(b => b.id === brand.id);
      if (exists) {
        toast.success(`Unfollowed ${brand.name}`);
        return prev.filter(b => b.id !== brand.id);
      } else {
        toast.success(`Following ${brand.name} for updates and deals!`);
        return [...prev, brand];
      }
    });
  };

  const addRecentlyViewed = React.useCallback((product: any) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 20);
    });
  }, []);

  const compareLockedCategory = getCompareLockedCategory(comparedProducts);

  const canAddToCompare = useCallback(
    (product: any) => {
      if (!product) return false;
      if (comparedProducts.length >= 4) return false;
      if (comparedProducts.some((p) => String(p.id) === String(product.id))) return false;
      return isSameCompareCategory(product, compareLockedCategory);
    },
    [comparedProducts, compareLockedCategory],
  );

  const getCompareCategoryBrowseHref = useCallback(() => {
    if (!compareLockedCategory) return null;
    return compareCategoryBrowseHref(compareLockedCategory.label);
  }, [compareLockedCategory]);

  const addToCompare = (product: any) => {
    if (comparedProducts.length >= 4) {
      toast.error('Maximum 4 products allowed for comparison');
      return;
    }
    if (comparedProducts.find((p) => String(p.id) === String(product.id))) {
      toast.error('Product already in comparison');
      return;
    }
    const locked = getCompareLockedCategory(comparedProducts);
    if (locked && !isSameCompareCategory(product, locked)) {
      toast.error(compareCategoryMismatchMessage(locked));
      return;
    }
    setComparedProducts((prev) => [...prev, product]);
    toast.success(`${product?.brand || product?.brandName || 'Product'} added to compare`);
  };

  const removeFromCompare = (id: number) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Product removed from comparison');
  };

  // Persist standard states to localStorage, scoped to the signed-in account
  useEffect(() => {
    localStorage.setItem(scopedKey('choosify_saved_products', userId), JSON.stringify(savedProducts));
  }, [savedProducts, userId]);

  useEffect(() => {
    localStorage.setItem(scopedKey('choosify_saved_brands', userId), JSON.stringify(savedBrands));
  }, [savedBrands, userId]);

  useEffect(() => {
    localStorage.setItem(scopedKey('choosify_loved_brands', userId), JSON.stringify(lovedBrands));
  }, [lovedBrands, userId]);

  useEffect(() => {
    localStorage.setItem(scopedKey('choosify_followed_brands', userId), JSON.stringify(followedBrands));
  }, [followedBrands, userId]);

  useEffect(() => {
    localStorage.setItem(scopedKey('choosify_recently_viewed', userId), JSON.stringify(recentlyViewed));
  }, [recentlyViewed, userId]);

  useEffect(() => {
    localStorage.setItem(scopedKey(ADDRESS_STORAGE_KEY, userId), JSON.stringify(customerAddresses));
  }, [customerAddresses, userId]);

  useEffect(() => {
    localStorage.setItem(scopedKey('choosify_saved_guides', userId), JSON.stringify(savedGuides));
  }, [savedGuides, userId]);

  useEffect(() => {
    localStorage.setItem(scopedKey('choosify_compared_products', userId), JSON.stringify(comparedProducts));
  }, [comparedProducts, userId]);

  useEffect(() => {
    localStorage.setItem('choosify_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('choosify_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // "Reviews you wrote" — backend is source of truth; localStorage is cache only.
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.id) return;
    if (!getAccessToken()) return;
    let cancelled = false;

    const hydrateMyReviews = async () => {
      try {
        const rows = await operationsApi.listMyReviews(currentUser.id);
        if (cancelled) return;
        const mapped = rows.map((row) => {
          const createdAt = String(row.createdAt || '');
          const dateLabel = createdAt
            ? new Date(createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '';
          const productTitle = String(row.productTitle || row.product || 'Product');
          const comment = String(row.comment || row.text || '');
          return {
            id: row.id,
            product: productTitle,
            productTitle,
            productId: row.productId,
            rating: Number(row.rating) || 0,
            comment,
            text: comment,
            date: dateLabel,
            createdAt,
            orderId: row.orderId,
            status: row.status,
            userId: row.userId,
            authorName: row.userName,
            avatar: row.userAvatar || row.avatar || row.authorAvatar,
            authorAvatar: row.userAvatar || row.authorAvatar || row.avatar,
            userAvatar: row.userAvatar || row.avatar || row.authorAvatar,
          };
        });
        setReviews(mapped);
      } catch {
        // Keep cache on transient failures.
      }
    };

    hydrateMyReviews();
    const onFocus = () => {
      if (document.visibilityState === 'visible') hydrateMyReviews();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [isLoggedIn, currentUser.id]);

  // Platform message history — one omni conversation per buyer (`conv_platform_<userId>`).
  // Live via Firestore onSnapshot; REST hydrate as fallback if the listener is denied.
  useEffect(() => {
    if (!isLoggedIn || !currentUser?.id) return;
    if (!getAccessToken()) return;
    let cancelled = false;
    let unsub: (() => void) | undefined;
    let pollId: number | undefined;

    const formatTime = (iso: string) => {
      try {
        return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return '';
      }
    };

    const resolveThreadId = (
      body: string,
      bookingOffer: BookingOfferCard | undefined,
      knownThreads: MessageThread[],
      orderOffer?: ManualOrderOfferCard,
    ): string => {
      const complaintThread = body.match(/\[Complaint[^\]]*·\s*thread\s+([^\s\]]+)/i);
      if (complaintThread?.[1]) return complaintThread[1];
      const orderMatch = body.match(/^\[Order\s+([^\]]+)\]/i);
      if (orderMatch?.[1]) {
        const orderId = orderMatch[1].trim();
        const byRef = knownThreads.find((t) => t.orderRef === orderId);
        if (byRef) return byRef.id;
      }
      if (bookingOffer?.sellerId || orderOffer?.sellerId) {
        const sellerKey = String(bookingOffer?.sellerId || orderOffer?.sellerId);
        const bySeller = knownThreads.find(
          (t) =>
            t.id === `seller-${sellerKey}` ||
            t.id === `thread-${sellerKey}` ||
            t.id === sellerKey ||
            t.id.includes(sellerKey),
        );
        if (bySeller) return bySeller.id;
      }
      return 'thread-general';
    };

    type PlatformRow = {
      id?: string;
      content?: { body?: string };
      body?: string;
      bookingOffer?: BookingOfferCard;
      orderOffer?: ManualOrderOfferCard;
      timestamp?: string;
      createdAt?: string;
      direction?: string;
      senderId?: string;
      senderName?: string;
    };

    const applyPlatformRows = (rows: PlatformRow[]) => {
      setThreadMessages((prev) => {
        const knownThreads = (() => {
          try {
            const saved = localStorage.getItem('choosify_threads');
            return saved ? (JSON.parse(saved) as MessageThread[]) : [];
          } catch {
            return [] as MessageThread[];
          }
        })();

        const mapped: ThreadMessage[] = rows.map((row) => {
          const content = (row.content || {}) as { body?: string };
          const rawBody = String(content.body || row.body || '');
          const bookingOffer = row.bookingOffer as BookingOfferCard | undefined;
          const orderOffer = row.orderOffer as ManualOrderOfferCard | undefined;
          const threadId = resolveThreadId(rawBody, bookingOffer, knownThreads, orderOffer);
          const text = rawBody
            .replace(/^\[Order\s+[^\]]+\]\s*/i, '')
            .replace(/^\[Complaint[^\]]*\]\s*/i, '')
            .trim();
          const timestamp = String(row.timestamp || row.createdAt || new Date().toISOString());
          const serverId = String(row.id || `m_plat_${timestamp}`);
          // Real sender identity (senderId) is the authoritative signal for
          // "is this my message" -- it correctly identifies self for a buyer
          // OR a seller viewing the same thread. Fall back to direction for
          // older/system rows that may not carry a senderId.
          const isSelf = row.senderId ? row.senderId === currentUser.id : row.direction === 'inbound';
          const sender = isSelf ? (currentUser.role === 'seller' ? 'seller' : 'user') : 'other';
          return {
            id: stableMessageNumericId(serverId),
            serverId,
            threadId,
            text: text || rawBody,
            sender,
            senderName: isSelf ? 'Me' : String(row.senderName || 'Support'),
            time: formatTime(timestamp),
            createdAt: timestamp,
            bookingOffer,
            orderOffer,
            status: isSelf ? 'delivered' : undefined,
          };
        });

        const protectedThread = (threadId: string) =>
          threadId === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID || threadId === EMI_MESSAGES_THREAD_ID;

        const serverIds = new Set(
          mapped.map((m) => m.serverId).filter((id): id is string => Boolean(id)),
        );
        const kept = prev.filter((m) => {
          if (protectedThread(m.threadId)) return true;
          if (m.serverId) return serverIds.has(m.serverId);
          if (mapped.length && m.threadId === 'thread-general' && !m.serverId && !m.bookingOffer) {
            return false;
          }
          return true;
        });

        const byKey = new Map<string, ThreadMessage>();
        for (const m of kept) byKey.set(m.serverId || `local-${m.id}`, m);
        for (const m of mapped) byKey.set(m.serverId || `local-${m.id}`, m);
        return Array.from(byKey.values()).sort((a, b) =>
          String(a.createdAt || '').localeCompare(String(b.createdAt || '')),
        );
      });

      if (rows.length) {
        setThreads((prevThreads) => {
          const latestByThread = new Map<string, { text: string; time: string }>();
          for (const row of rows) {
            const content = (row.content || {}) as { body?: string };
            const rawBody = String(content.body || '');
            const bookingOffer = row.bookingOffer as BookingOfferCard | undefined;
            const threadId = resolveThreadId(rawBody, bookingOffer, prevThreads);
            const text = rawBody
              .replace(/^\[Order\s+[^\]]+\]\s*/i, '')
              .replace(/^\[Complaint[^\]]*\]\s*/i, '')
              .trim();
            const timestamp = String(row.timestamp || '');
            latestByThread.set(threadId, { text: text || rawBody, time: formatTime(timestamp) });
          }
          return prevThreads.map((t) => {
            const latest = latestByThread.get(t.id);
            if (!latest) return t;
            return { ...t, lastMessage: latest.text, time: latest.time || t.time };
          });
        });
      }
    };

    const hydrateViaRest = async () => {
      try {
        const result = await operationsApi.listPlatformMessages({ userId: currentUser.id });
        if (cancelled) return;
        const rows = Array.isArray(result.data) ? (result.data as PlatformRow[]) : [];
        applyPlatformRows(rows);
      } catch {
        // Keep local thread cache on failure.
      }
    };

    const conversationId = `conv_platform_${currentUser.id}`;
    const msgQuery = query(
      collection(db, 'omni_messages'),
      where('conversationId', '==', conversationId),
    );

    unsub = onSnapshot(
      msgQuery,
      (snapshot) => {
        if (cancelled) return;
        const rows: PlatformRow[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as PlatformRow;
          return { ...data, id: data.id || docSnap.id };
        });
        rows.sort((a, b) =>
          String(a.timestamp || '').localeCompare(String(b.timestamp || '')),
        );
        applyPlatformRows(rows);
      },
      (err) => {
        console.warn('[Dashboard] omni_messages listener failed; using REST poll.', err);
        void hydrateViaRest();
        pollId = window.setInterval(() => {
          if (document.visibilityState === 'visible') void hydrateViaRest();
        }, 45_000);
      },
    );

    // One REST pass for immediate paint before the first snapshot (or if offline).
    void hydrateViaRest();

    return () => {
      cancelled = true;
      unsub?.();
      if (pollId) window.clearInterval(pollId);
    };
  }, [isLoggedIn, currentUser.id]);

  const addToRecentlyViewed = (product: any) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 12);
    });
  };

  const addNotification = useCallback((message: string, type: 'order' | 'message' | 'system' | 'deal') => {
    const titleVal =
      type === 'deal'
        ? 'Special Deal Alert'
        : type === 'order'
          ? 'Order Update'
          : type === 'message'
            ? 'Message Update'
            : 'Platform Update';
    appendAnnouncementMessage(formatAnnouncementBody(message, titleVal));
  }, [appendAnnouncementMessage]);

  const addCustomerAddress = useCallback((address: CustomerAddress) => {
    setCustomerAddresses((prev) => {
      const nextAddress = { ...address, isDefault: address.isDefault || prev.length === 0 };
      const next = nextAddress.isDefault
        ? prev.map((item) => ({ ...item, isDefault: false })).concat(nextAddress)
        : prev.concat(nextAddress);
      return normalizeDefaultAddress(next);
    });
    toast.success('Address saved to your address book');
  }, []);

  const updateCustomerAddress = useCallback((address: CustomerAddress) => {
    setCustomerAddresses((prev) => {
      const next = prev.map((item) =>
        item.id === address.id
          ? { ...address, isDefault: address.isDefault || item.isDefault }
          : address.isDefault
            ? { ...item, isDefault: false }
            : item,
      );
      return normalizeDefaultAddress(next);
    });
    toast.success('Address updated');
  }, []);

  const deleteCustomerAddress = useCallback((id: string) => {
    setCustomerAddresses((prev) => normalizeDefaultAddress(prev.filter((item) => item.id !== id)));
    toast.success('Address deleted');
  }, []);

  const setDefaultCustomerAddress = useCallback((id: string) => {
    setCustomerAddresses((prev) => prev.map((item) => ({ ...item, isDefault: item.id === id })));
    toast.success('Default address updated');
  }, []);

  const defaultCustomerAddress = getDefaultAddress(customerAddresses);

  // Ensure announcements thread exists and migrate legacy notification records once
  useEffect(() => {
    setThreads(prev => {
      if (prev.some(t => t.id === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID)) {
        return prev.map(t =>
          t.id === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID
            ? { ...t, type: 'announcement', readOnly: true, title: CHOOSIFY_ANNOUNCEMENTS_TITLE }
            : t
        );
      }

      const welcomeTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return [
        {
          id: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
          title: CHOOSIFY_ANNOUNCEMENTS_TITLE,
          avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
          lastMessage: CHOOSIFY_ANNOUNCEMENTS_WELCOME,
          time: welcomeTime,
          type: 'announcement',
          unread: false,
          readOnly: true,
        },
        ...prev,
      ];
    });

    setThreadMessages(prev => {
      if (prev.some(m => m.threadId === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID)) return prev;
      const welcomeTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return [
        ...prev,
        {
          id: Date.now(),
          threadId: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
          text: CHOOSIFY_ANNOUNCEMENTS_WELCOME,
          sender: 'admin',
          senderName: CHOOSIFY_ANNOUNCEMENTS_TITLE,
          time: welcomeTime,
          avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
        },
      ];
    });

    if (localStorage.getItem('choosify_notifications_migrated')) return;

    try {
      const saved = localStorage.getItem('choosify_notifications');
      const legacy = saved ? JSON.parse(saved) : [];
      if (Array.isArray(legacy) && legacy.length > 0) {
        legacy
          .slice()
          .reverse()
          .forEach((n: { title?: string; message?: string }) => {
            if (n.message) {
              appendAnnouncementMessage(formatAnnouncementBody(n.message, n.title), false);
            }
          });
      }
      localStorage.setItem('choosify_notifications_migrated', '1');
      setNotifications([]);
      localStorage.removeItem('choosify_notifications');
    } catch {
      localStorage.setItem('choosify_notifications_migrated', '1');
    }
  }, [appendAnnouncementMessage]);

  // One-time: seed sample associatedEntity announcements for existing inboxes
  useEffect(() => {
    if (localStorage.getItem('choosify_announcement_entities_v1')) return;
    setThreadMessages((prev) => {
      const hasEntity = prev.some(
        (m) => m.threadId === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID && m.associatedEntity,
      );
      if (hasEntity) return prev;
      const welcomeTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const samples: ThreadMessage[] = [
        {
          id: Date.now() + 1,
          threadId: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
          text: formatAnnouncementBody(
            'Samsung Galaxy S24 Ultra just dropped 5% — compare verified store prices before they sell out.',
            'Price Drop Alert',
          ),
          sender: 'admin',
          senderName: CHOOSIFY_ANNOUNCEMENTS_TITLE,
          time: welcomeTime,
          avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
          associatedEntity: {
            type: 'product',
            id: '1',
            title: 'Samsung Galaxy S24 Ultra',
            subtitle: 'Price drop · Mobile & Phones',
            href: '/products/1',
            ctaLabel: 'View product',
          },
        },
        {
          id: Date.now() + 2,
          threadId: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
          text: formatAnnouncementBody(
            'The "Best Smartwatches 2026" guide has new entries and updated picks for Bangladesh buyers.',
            'Guide Update',
          ),
          sender: 'admin',
          senderName: CHOOSIFY_ANNOUNCEMENTS_TITLE,
          time: welcomeTime,
          avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
          associatedEntity: {
            type: 'guide',
            id: '1',
            title: 'Best Smartwatches 2026',
            subtitle: 'Updated buying guide',
            href: '/guides/1',
            ctaLabel: 'Open guide',
          },
        },
        {
          id: Date.now() + 3,
          threadId: CHOOSIFY_ANNOUNCEMENTS_THREAD_ID,
          text: formatAnnouncementBody(
            'Eid Mega Sale is live — early deal access for verified buyers this week.',
            'Campaign Alert',
          ),
          sender: 'admin',
          senderName: CHOOSIFY_ANNOUNCEMENTS_TITLE,
          time: welcomeTime,
          avatar: CHOOSIFY_ANNOUNCEMENTS_AVATAR,
          associatedEntity: {
            type: 'campaign',
            id: 'camp-1',
            title: 'Eid Mega Sale',
            subtitle: 'Limited-time campaign',
            href: '/deals',
            ctaLabel: 'Browse deals',
          },
        },
      ];
      return [...prev, ...samples];
    });
    localStorage.setItem('choosify_announcement_entities_v1', '1');
  }, []);

  // Ensure Emi AI thread exists in the general Messages inbox (for returning users with older localStorage)
  useEffect(() => {
    setThreads((prev) => {
      if (prev.some((t) => t.id === EMI_MESSAGES_THREAD_ID)) {
        return prev.map((t) =>
          t.id === EMI_MESSAGES_THREAD_ID
            ? {
                ...t,
                type: 'general',
                title: EMI_MESSAGES_THREAD_TITLE,
                avatar: EMI_MESSAGES_THREAD_AVATAR,
              }
            : t,
        );
      }
      const welcomeTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const emiThread: MessageThread = {
        id: EMI_MESSAGES_THREAD_ID,
        title: EMI_MESSAGES_THREAD_TITLE,
        avatar: EMI_MESSAGES_THREAD_AVATAR,
        lastMessage: EMI_MESSAGES_THREAD_WELCOME,
        time: welcomeTime,
        type: 'general',
        unread: false,
      };
      const announcementsIdx = prev.findIndex((t) => t.id === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID);
      if (announcementsIdx === 0) {
        return [prev[0], emiThread, ...prev.slice(1)];
      }
      if (announcementsIdx > 0) {
        return [prev[announcementsIdx], emiThread, ...prev.filter((_, i) => i !== announcementsIdx)];
      }
      return [emiThread, ...prev];
    });
  }, []);

  // Expose to window to facilitate cross-context notifications without circular imports
  useEffect(() => {
    (window as any).choosifyAddNotification = addNotification;
    return () => {
      delete (window as any).choosifyAddNotification;
    };
  }, [addNotification]);

  useEffect(() => {
    const onBookingPaid = (event: Event) => {
      const detail = (event as CustomEvent).detail || {};
      setThreadMessages((previous) =>
        previous.map((message) =>
          message.bookingOffer?.requestId === detail.requestId
            ? {
                ...message,
                bookingOffer: {
                  ...message.bookingOffer,
                  status: 'paid' as const,
                  orderId: detail.orderId,
                },
              }
            : message,
        ),
      );
    };
    window.addEventListener('choosify-booking-paid', onBookingPaid);
    return () => {
      window.removeEventListener('choosify-booking-paid', onBookingPaid);
    };
  }, []);

  useEffect(() => {
    const handleOrderPlaced = (e: CustomEvent) => {
      const orderId = e.detail?.orderId || 'unknown';
      addNotification(`Your order ${orderId} was placed successfully!`, 'order');
    };
    const handleReturnRequest = (e: CustomEvent) => {
      addNotification(`Return request submitted for order ${e.detail?.orderId || ''}.`, 'order');
    };
    window.addEventListener('choosify-order-placed', handleOrderPlaced as EventListener);
    window.addEventListener('choosify-return-request', handleReturnRequest as EventListener);
    return () => {
      window.removeEventListener('choosify-order-placed', handleOrderPlaced as EventListener);
      window.removeEventListener('choosify-return-request', handleReturnRequest as EventListener);
    };
  }, [addNotification]);

  // Listen to order actions from GlobalStateContext
  useEffect(() => {
    const handleOrderPlaced = (e: Event) => {
      const customEvent = e as CustomEvent;
      const orderId = customEvent.detail?.orderId;
      addNotification(`New split shipment order ${orderId} was successfully initialized for Farhan!`, 'order');
    };

    const handleOrderCancelled = (e: Event) => {
      const customEvent = e as CustomEvent;
      const orderId = customEvent.detail?.orderId;
      const reason = customEvent.detail?.reason || 'No reason provided';
      addNotification(`Order ${orderId} has been cancelled. Reason: ${reason}`, 'order');
    };

    window.addEventListener('choosify-order-placed', handleOrderPlaced);
    window.addEventListener('choosify-order-cancelled', handleOrderCancelled);

    return () => {
      window.removeEventListener('choosify-order-placed', handleOrderPlaced);
      window.removeEventListener('choosify-order-cancelled', handleOrderCancelled);
    };
  }, [addNotification]);

  // Persist threads and thread messages
  React.useEffect(() => {
    localStorage.setItem('choosify_threads', JSON.stringify(threads));
  }, [threads]);

  React.useEffect(() => {
    localStorage.setItem('choosify_thread_messages', JSON.stringify(threadMessages));
  }, [threadMessages]);

  // Booking deadlines run at the dashboard provider level, not only while Messages is open.
  React.useEffect(() => {
    const expireLatestOffers = () => {
      const now = Date.now();
      const latestByRequest = new Map<string, { id: number; version: number }>();
      for (const message of threadMessages) {
        const offer = message.bookingOffer;
        if (!offer) continue;
        const current = latestByRequest.get(offer.requestId);
        if (!current || offer.version > current.version) {
          latestByRequest.set(offer.requestId, {
            id: message.id,
            version: offer.version,
          });
        }
      }

      const notifiedSet = new Set<string>(
        readStoredArray('choosify_booking_expiry_notified').map(String),
      );
      let changed = false;
      const responseExpired: string[] = [];
      const paymentExpired: Array<{ requestId: string; orderId?: string }> = [];
      const nextMessages = threadMessages.map((message) => {
          const offer = message.bookingOffer;
          if (!offer || latestByRequest.get(offer.requestId)?.id !== message.id) {
            return message;
          }
          if (
            offer.status === 'pending' &&
            new Date(offer.sellerRespondBy).getTime() <= now
          ) {
            changed = true;
            const key = `${offer.requestId}:response`;
            if (!notifiedSet.has(key)) {
              notifiedSet.add(key);
              responseExpired.push(offer.requestId);
            }
            return {
              ...message,
              bookingOffer: { ...offer, status: 'expired' as const },
            };
          }
          if (
            (offer.status === 'accepted' || offer.status === 'buyer_accepted') &&
            offer.buyerPayBy &&
            new Date(offer.buyerPayBy).getTime() <= now
          ) {
            changed = true;
            const key = `${offer.requestId}:payment`;
            if (!notifiedSet.has(key)) {
              notifiedSet.add(key);
              paymentExpired.push({
                requestId: offer.requestId,
                orderId: offer.orderId,
              });
            }
            return {
              ...message,
              bookingOffer: { ...offer, status: 'payment_expired' as const },
            };
          }
          return message;
      });
      if (changed) {
        setThreadMessages(nextMessages);
        responseExpired.forEach((requestId) =>
          addNotification(
            `Request ${requestId} expired without a seller response.`,
            'message',
          ),
        );
        paymentExpired.forEach(({ requestId, orderId }) => {
          addNotification(
            `Payment window expired for request ${requestId}.`,
            'order',
          );
          if (orderId) {
            window.dispatchEvent(
              new CustomEvent('choosify-booking-payment-expired', {
                detail: { orderId, requestId },
              }),
            );
          }
        });
        localStorage.setItem(
          'choosify_booking_expiry_notified',
          JSON.stringify([...notifiedSet]),
        );
      }
    };

    expireLatestOffers();
    const timer = window.setInterval(expireLatestOffers, 60_000);
    return () => window.clearInterval(timer);
  }, [threadMessages, addNotification]);

  const addMessage = (text: string, sender: 'user' | 'other' | 'admin' | 'seller' | 'creator' = 'user') => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderName: sender === 'user' ? 'Me' : 'Support',
      avatar: sender === 'user' ? undefined : 'https://i.pravatar.cc/150?u=support'
    };
    setMessages(prev => [...prev, newMessage]);
    if (sender === 'user') {
      toast.success('Message sent to curator');
      // Sync into the active general thread too
      addThreadMessage('thread-general', text, 'user', 'Me');
    }
  };

  const addThreadMessage = (
    threadId: string,
    text: string,
    sender: 'user' | 'other' | 'admin' | 'seller' | 'creator',
    senderName?: string,
    productCard?: any,
    bookingOffer?: BookingOfferCard,
    orderOffer?: ManualOrderOfferCard,
  ) => {
    if (threadId === CHOOSIFY_ANNOUNCEMENTS_THREAD_ID && sender === 'user') {
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const createdAt = now.toISOString();
    const isBuyerSide = sender === 'user';
    const isSellerSide =
      sender === 'seller' || sender === 'admin' || sender === 'creator';
    const tracksDelivery = isBuyerSide || isSellerSide;
    const newMsg: ThreadMessage = {
      id: Date.now() + Math.floor(Math.random() * 100),
      threadId,
      text,
      sender,
      time: timeStr,
      createdAt,
      senderName: senderName || (sender === 'user' ? 'Me' : 'Partner Representative'),
      avatar: sender === 'user' ? undefined : `https://i.pravatar.cc/150?u=${threadId}`,
      status: tracksDelivery ? 'sent' : undefined,
      productCard,
      bookingOffer,
      orderOffer,
    };

    setThreadMessages(prev => {
      let next = [...prev, newMsg];
      // Peer reply ⇒ mark the other party's prior messages in this thread as seen
      if (isBuyerSide) {
        next = next.map((m) =>
          m.threadId === threadId &&
          (m.sender === 'seller' || m.sender === 'admin' || m.sender === 'creator') &&
          m.status !== 'seen'
            ? { ...m, status: 'seen' as const }
            : m,
        );
      } else {
        next = next.map((m) =>
          m.threadId === threadId && m.sender === 'user' && m.status !== 'seen'
            ? { ...m, status: 'seen' as const }
            : m,
        );
      }
      return next;
    });

    // Update the thread metadata
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          lastMessage: text,
          time: timeStr,
          unread: sender !== 'user'
        };
      }
      return t;
    }));

    // Simulate carrier ack → Delivered for the sender's own message
    if (tracksDelivery) {
      window.setTimeout(() => {
        setThreadMessages((prev) =>
          prev.map((m) =>
            m.id === newMsg.id && m.status === 'sent' ? { ...m, status: 'delivered' as const } : m,
          ),
        );
      }, 900);
    }
  };

  const createNewThread = (
    id: string, 
    title: string, 
    avatar: string, 
    type: 'retail' | 'general' | 'announcement', 
    lastMessage: string, 
    orderRef?: string
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setThreads(prev => {
      // Avoid duplicate thread registrations
      if (prev.some(t => t.id === id)) {
        return prev.map(t =>
          t.id === id
            ? {
                ...t,
                lastMessage,
                time: timeStr,
                ...(orderRef !== undefined ? { orderRef: orderRef || t.orderRef } : {}),
              }
            : t,
        );
      }
      return [
        {
          id,
          title,
          avatar,
          lastMessage,
          time: timeStr,
          type,
          unread: false,
          orderRef
        },
        ...prev
      ];
    });

    // Seed a starter system message in the thread
    setThreadMessages(prev => {
      if (prev.some(m => m.threadId === id && m.text === lastMessage)) return prev;
      return [
        ...prev,
        {
          id: Date.now() + 10,
          threadId: id,
          text: lastMessage,
          sender: 'other',
          senderName: title,
          time: timeStr,
          avatar
        }
      ];
    });
  };

  const markAllAsRead = () => {
    setThreads((prev) => {
      if (!prev.some((t) => t.unread)) return prev;
      return prev.map((t) => (t.unread ? { ...t, unread: false } : t));
    });
  };

  return (
    <DashboardContext.Provider value={{
      savedProducts, setSavedProducts,
      savedBrands, setSavedBrands,
      lovedBrands, setLovedBrands,
      followedBrands, setFollowedBrands,
      recentlyViewed, setRecentlyViewed,
      savedGuides, setSavedGuides,
      comparedProducts, setComparedProducts,
      compareLockedCategory,
      canAddToCompare,
      getCompareCategoryBrowseHref,
      messages, setMessages,
      threads, setThreads,
      threadMessages, setThreadMessages,
      notifications, setNotifications,
      reviews, setReviews,
      campaigns, setCampaigns,
      customOverviews, setCustomOverviews,
      customerAddresses,
      setCustomerAddresses,
      defaultCustomerAddress,
      addCustomerAddress,
      updateCustomerAddress,
      deleteCustomerAddress,
      setDefaultCustomerAddress,
      removeSavedProduct,
      removeSavedBrand,
      toggleLoveBrand,
      toggleFollowBrand,
      addRecentlyViewed,
      addToCompare,
      removeFromCompare,
      addMessage,
      addThreadMessage,
      createNewThread,
      markAllAsRead,
      addToRecentlyViewed,
      addNotification
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
