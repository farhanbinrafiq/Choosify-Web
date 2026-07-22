import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { loadMockCatalog } from '../data/loadMockCatalog';
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
import type { BookingOfferCard } from '../types/serviceBooking';

export type { AnnouncementAssociatedEntity };

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

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [savedProducts, setSavedProducts] = useState<any[]>(() => readStoredArray('choosify_saved_products'));
  const [savedBrands, setSavedBrands] = useState<any[]>(() => readStoredArray('choosify_saved_brands'));
  const [lovedBrands, setLovedBrands] = useState<any[]>(() => readStoredArray('choosify_loved_brands'));
  const [followedBrands, setFollowedBrands] = useState<any[]>(() => readStoredArray('choosify_followed_brands'));
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>(() => readStoredArray('choosify_recently_viewed'));
  const [customerAddresses, setCustomerAddresses] = useState<CustomerAddress[]>(() =>
    normalizeDefaultAddress(readStoredArray(ADDRESS_STORAGE_KEY) as CustomerAddress[]),
  );

  const [savedGuides, setSavedGuides] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_saved_guides');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((guide) => guide && guide.id != null);
        }
      }
      return [
        { id: 1, title: 'Best Budget Smartwatches 2026', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', category: 'Tech' },
        { id: 2, title: 'Top 5 Sustainable Fashion Brands', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop', category: 'Fashion' }
      ];
    } catch {
      return [
        { id: 1, title: 'Best Budget Smartwatches 2026', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', category: 'Tech' },
        { id: 2, title: 'Top 5 Sustainable Fashion Brands', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop', category: 'Fashion' }
      ];
    }
  });

  const [comparedProducts, setComparedProducts] = useState<any[]>(() => readStoredArray('choosify_compared_products'));

  // Threaded Messaging States with Localstorage persistence
  const [threads, setThreads] = useState<MessageThread[]>(() => {
    const saved = localStorage.getItem('choosify_threads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MessageThread[];
        if (!Array.isArray(parsed)) throw new Error('bad threads');
        let next = parsed.map((t) => {
          if (t.id === 'seller-apple' && !t.orderRef) {
            return { ...t, orderRef: 'ORD-DEMO-PHYSICAL', type: t.type || 'retail' };
          }
          return t;
        });
        if (!next.some((t) => t.id === 'seller-panorama-hotel')) {
          next = [
            ...next,
            {
              id: 'seller-panorama-hotel',
              title: 'Panorama Hotel Dhaka',
              avatar: 'https://i.pravatar.cc/150?u=panorama-hotel',
              lastMessage: 'Your room is reserved. Message us until checkout tonight.',
              time: 'Yesterday',
              type: 'retail',
              unread: false,
              orderRef: 'ORD-DEMO-SERVICE',
            },
          ];
        } else {
          next = next.map((t) =>
            t.id === 'seller-panorama-hotel' && !t.orderRef
              ? { ...t, orderRef: 'ORD-DEMO-SERVICE', type: t.type || 'retail' }
              : t,
          );
        }
        return next;
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
      { id: 'thread-general', title: 'Farhan Rafiq (Admin)', avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png', lastMessage: 'Absolutely! We can ship the S24 Ultra...', time: '10:30 AM', type: 'general', unread: true },
      { id: 'seller-apple', title: 'Apple Retail BD', avatar: 'https://i.pravatar.cc/150?u=apple', lastMessage: 'Your iPhone order is confirmed — ask us anything before delivery.', time: '2 days ago', type: 'retail', unread: false, orderRef: 'ORD-DEMO-PHYSICAL' },
      { id: 'seller-panorama-hotel', title: 'Panorama Hotel Dhaka', avatar: 'https://i.pravatar.cc/150?u=panorama-hotel', lastMessage: 'Your room is reserved. Message us until checkout tonight.', time: 'Yesterday', type: 'retail', unread: false, orderRef: 'ORD-DEMO-SERVICE' },
    ];
  });

  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>(() => {
    const saved = localStorage.getItem('choosify_thread_messages');
    if (saved) return JSON.parse(saved);
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
      { id: 1, threadId: 'thread-general', text: 'Hello! I am interested in the Samsung S24 Ultra you posted. Is it still available?', sender: 'other', senderName: 'Rahat Hossain', time: '10:30 AM', avatar: 'https://i.pravatar.cc/150?u=1' },
      { id: 2, threadId: 'thread-general', text: 'Yes, it is still available. Would you like to know more about the warranty?', sender: 'user', senderName: 'Me', time: '10:35 AM' },
      { id: 3, threadId: 'thread-general', text: 'Absolutely! We can ship the S24 Ultra to Banani with standard COD coverage.', sender: 'other', senderName: 'Farhan Rafiq', time: '11:00 AM', avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png' },
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
      return [
        { id: 1, product: 'Samsung Galaxy S24 Ultra', rating: 5, comment: 'Amazing performance! The AI features are game-changing.', date: 'May 12, 2026' },
        { id: 2, product: 'LG C3 55" OLED EVO TV', rating: 4, comment: 'Very comfortable for daily runs, but size runs slightly small.', date: 'April 28, 2026' }
      ];
    } catch {
      return [
        { id: 1, product: 'Samsung Galaxy S24 Ultra', rating: 5, comment: 'Amazing performance! The AI features are game-changing.', date: 'May 12, 2026' },
        { id: 2, product: 'LG C3 55" OLED EVO TV', rating: 4, comment: 'Very comfortable for daily runs, but size runs slightly small.', date: 'April 28, 2026' }
      ];
    }
  });

  useEffect(() => {
    loadMockCatalog().then(({ products, brands }) => {
      setSavedProducts((prev) => (prev.length ? prev : [products[0], products[3], products[5]]));
      setSavedBrands((prev) => (prev.length ? prev : [brands[0], brands[2], brands[9]]));
      setLovedBrands((prev) => (prev.length ? prev : [brands[1], brands[3], brands[4]]));
      setFollowedBrands((prev) => (prev.length ? prev : [brands[2], brands[5], brands[6], brands[10]]));
      setRecentlyViewed((prev) => (prev.length ? prev : [products[1], products[2], products[4]]));
      setComparedProducts((prev) => (prev.length ? prev : [products[0], products[1]]));
    });
  }, []);

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

  const addToCompare = (product: any) => {
    if (comparedProducts.length >= 4) {
      toast.error('Maximum 4 products allowed for comparison');
      return;
    }
    if (comparedProducts.find(p => p.id === product.id)) {
      toast.error('Product already in comparison');
      return;
    }
    setComparedProducts(prev => [...prev, product]);
    toast.success(`${product?.brand || product?.brandName || 'Product'} added to compare`);
  };

  const removeFromCompare = (id: number) => {
    setComparedProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product removed from comparison');
  };

  // Persist standard states to localStorage
  useEffect(() => {
    localStorage.setItem('choosify_saved_products', JSON.stringify(savedProducts));
  }, [savedProducts]);

  useEffect(() => {
    localStorage.setItem('choosify_saved_brands', JSON.stringify(savedBrands));
  }, [savedBrands]);

  useEffect(() => {
    localStorage.setItem('choosify_loved_brands', JSON.stringify(lovedBrands));
  }, [lovedBrands]);

  useEffect(() => {
    localStorage.setItem('choosify_followed_brands', JSON.stringify(followedBrands));
  }, [followedBrands]);

  useEffect(() => {
    localStorage.setItem('choosify_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(customerAddresses));
  }, [customerAddresses]);

  useEffect(() => {
    localStorage.setItem('choosify_saved_guides', JSON.stringify(savedGuides));
  }, [savedGuides]);

  useEffect(() => {
    localStorage.setItem('choosify_compared_products', JSON.stringify(comparedProducts));
  }, [comparedProducts]);

  useEffect(() => {
    localStorage.setItem('choosify_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('choosify_reviews', JSON.stringify(reviews));
  }, [reviews]);

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
      } else if (sender !== 'user') {
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
