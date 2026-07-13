import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PRODUCTS, BRANDS } from '../constants';
import toast from 'react-hot-toast';

export interface MessageThread {
  id: string;
  title: string;
  avatar: string;
  lastMessage: string;
  time: string;
  type: 'retail' | 'wholesale' | 'general';
  unread: boolean;
  orderRef?: string;
}

export interface ThreadMessage {
  id: number;
  threadId: string;
  text: string;
  sender: 'user' | 'other' | 'admin' | 'seller' | 'creator';
  time: string;
  senderName: string;
  avatar?: string;
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
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  addCustomOverview: (overview: Omit<CustomOverview, 'id'>) => void;
  deleteCustomOverview: (id: string) => void;
  removeSavedProduct: (id: number) => void;
  removeSavedBrand: (id: number) => void;
  toggleLoveBrand: (brand: any) => void;
  toggleFollowBrand: (brand: any) => void;
  addRecentlyViewed: (product: any) => void;
  addToCompare: (product: any) => void;
  removeFromCompare: (id: number) => void;
  addMessage: (text: string, sender: 'user' | 'other' | 'admin' | 'seller' | 'creator') => void;
  addThreadMessage: (threadId: string, text: string, sender: 'user' | 'other' | 'admin' | 'seller' | 'creator', senderName?: string, productCard?: any) => void;
  createNewThread: (id: string, title: string, avatar: string, type: 'retail' | 'wholesale' | 'general', lastMessage: string, orderRef?: string) => void;
  markAllAsRead: () => void;
  addToRecentlyViewed: (product: any) => void;
  addNotification: (message: string, type: 'order' | 'message' | 'system' | 'deal') => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [savedProducts, setSavedProducts] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_saved_products');
      return saved ? JSON.parse(saved) : [PRODUCTS[0], PRODUCTS[3], PRODUCTS[5]];
    } catch { return [PRODUCTS[0], PRODUCTS[3], PRODUCTS[5]]; }
  });

  const [savedBrands, setSavedBrands] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_saved_brands');
      return saved ? JSON.parse(saved) : [BRANDS[0], BRANDS[2], BRANDS[9]];
    } catch { return [BRANDS[0], BRANDS[2], BRANDS[9]]; }
  });

  const [lovedBrands, setLovedBrands] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_loved_brands');
      return saved ? JSON.parse(saved) : [BRANDS[1], BRANDS[3], BRANDS[4]];
    } catch { return [BRANDS[1], BRANDS[3], BRANDS[4]]; }
  });

  const [followedBrands, setFollowedBrands] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_followed_brands');
      return saved ? JSON.parse(saved) : [BRANDS[2], BRANDS[5], BRANDS[6], BRANDS[10]];
    } catch { return [BRANDS[2], BRANDS[5], BRANDS[6], BRANDS[10]]; }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_recently_viewed');
      return saved ? JSON.parse(saved) : [PRODUCTS[1], PRODUCTS[2], PRODUCTS[4]];
    } catch { return [PRODUCTS[1], PRODUCTS[2], PRODUCTS[4]]; }
  });

  const [savedGuides, setSavedGuides] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_saved_guides');
      return saved ? JSON.parse(saved) : [
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

  const [comparedProducts, setComparedProducts] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('choosify_compared_products');
      return saved ? JSON.parse(saved) : [PRODUCTS[0], PRODUCTS[1]];
    } catch { return [PRODUCTS[0], PRODUCTS[1]]; }
  });

  // Threaded Messaging States with Localstorage persistence
  const [threads, setThreads] = useState<MessageThread[]>(() => {
    const saved = localStorage.getItem('choosify_threads');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'thread-general', title: 'Farhan Rafiq (Admin)', avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png', lastMessage: 'Absolutely! We can ship the S24 Ultra...', time: '10:30 AM', type: 'general', unread: true },
      { id: 'seller-samsung', title: 'Samsung Bangladesh Ltd.', avatar: 'https://i.pravatar.cc/150?u=samsung', lastMessage: 'Let us know your wholesale quantity requirements.', time: 'Yesterday', type: 'wholesale', unread: false },
      { id: 'seller-apple', title: 'Apple Retail BD', avatar: 'https://i.pravatar.cc/150?u=apple', lastMessage: 'Welcome to Apple Retail! Feel free to ask queries.', time: '2 days ago', type: 'retail', unread: false }
    ];
  });

  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>(() => {
    const saved = localStorage.getItem('choosify_thread_messages');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, threadId: 'thread-general', text: 'Hello! I am interested in the Samsung S24 Ultra you posted. Is it still available?', sender: 'other', senderName: 'Rahat Hossain', time: '10:30 AM', avatar: 'https://i.pravatar.cc/150?u=1' },
      { id: 2, threadId: 'thread-general', text: 'Yes, it is still available. Would you like to know more about the warranty?', sender: 'user', senderName: 'Me', time: '10:35 AM' },
      { id: 3, threadId: 'thread-general', text: 'Absolutely! We can ship the S24 Ultra to Banani with standard COD coverage.', sender: 'other', senderName: 'Farhan Rafiq', time: '11:00 AM', avatar: 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png' },
      
      { id: 4, threadId: 'seller-samsung', text: 'Hello! Do you offer wholesale volume pricing for bulk S24 units?', sender: 'user', senderName: 'Me', time: 'Yesterday' },
      { id: 5, threadId: 'seller-samsung', text: 'Yes, we do! Let us know your wholesale quantity requirements.', sender: 'seller', senderName: 'Samsung Sales', time: 'Yesterday', avatar: 'https://i.pravatar.cc/150?u=samsung' }
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
      return saved ? JSON.parse(saved) : [
        { id: 1, product: PRODUCTS[0].title, rating: 5, comment: 'Amazing performance! The AI features are game-changing.', date: 'May 12, 2026' },
        { id: 2, product: PRODUCTS[5].title, rating: 4, comment: 'Very comfortable for daily runs, but size runs slightly small.', date: 'April 28, 2026' }
      ];
    } catch {
      return [
        { id: 1, product: PRODUCTS[0].title, rating: 5, comment: 'Amazing performance! The AI features are game-changing.', date: 'May 12, 2026' },
        { id: 2, product: PRODUCTS[5].title, rating: 4, comment: 'Very comfortable for daily runs, but size runs slightly small.', date: 'April 28, 2026' }
      ];
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



  const addCampaign = (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: 'camp-' + Date.now()
    };
    setCampaigns(prev => [newCampaign, ...prev]);
    toast.success('Campaign created successfully!');
  };

  const updateCampaign = (target: Campaign) => {
    setCampaigns(prev => prev.map(c => c.id === target.id ? target : c));
    toast.success('Campaign updated successfully!');
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast.success('Campaign deleted successfully.');
  };

  const [customOverviews, setCustomOverviews] = useState<CustomOverview[]>(() => {
    const saved = localStorage.getItem('choosify_custom_overviews');
    if (saved) return JSON.parse(saved);
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

  const addCustomOverview = (ov: Omit<CustomOverview, 'id'>) => {
    const newOv: CustomOverview = {
      ...ov,
      id: 'co-' + Date.now()
    };
    setCustomOverviews(prev => [newOv, ...prev]);
    toast.success('Dynamic overview section created successfully!');
  };

  const deleteCustomOverview = (id: string) => {
    setCustomOverviews(prev => prev.filter(ov => ov.id !== id));
    toast.success('Overview section removed.');
  };

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
    toast.success(`${product.brand} added to compare`);
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

  const addNotification = (message: string, type: 'order' | 'message' | 'system' | 'deal') => {
    const titleVal = type === 'deal' ? 'Special Deal Alert' : type.charAt(0).toUpperCase() + type.slice(1) + ' Notification';
    const newNotification = {
      id: Date.now().toString(),
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
      title: titleVal,
      time: 'Just now'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Expose to window to facilitate cross-context notifications without circular imports
  useEffect(() => {
    (window as any).choosifyAddNotification = addNotification;
    return () => {
      delete (window as any).choosifyAddNotification;
    };
  }, [notifications]);

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
  }, []);

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
  }, []);

  // Persist threads and thread messages
  React.useEffect(() => {
    localStorage.setItem('choosify_threads', JSON.stringify(threads));
  }, [threads]);

  React.useEffect(() => {
    localStorage.setItem('choosify_thread_messages', JSON.stringify(threadMessages));
  }, [threadMessages]);

  const addMessage = (text: string, sender: 'user' | 'other' | 'admin' | 'seller' | 'creator' = 'user') => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderName: sender === 'user' ? 'Me' : 'Support',
      avatar: sender === 'user' ? undefined : 'https://i.pravatar.cc/150?u=support'
    };
    setMessages(prev => [...prev, newMessage as any]);
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
    productCard?: any
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ThreadMessage = {
      id: Date.now() + Math.floor(Math.random() * 100),
      threadId,
      text,
      sender,
      time: timeStr,
      senderName: senderName || (sender === 'user' ? 'Me' : 'Partner Representative'),
      avatar: sender === 'user' ? undefined : `https://i.pravatar.cc/150?u=${threadId}`,
      productCard
    };

    setThreadMessages(prev => [...prev, newMsg]);

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
  };

  const createNewThread = (
    id: string, 
    title: string, 
    avatar: string, 
    type: 'retail' | 'wholesale' | 'general', 
    lastMessage: string, 
    orderRef?: string
  ) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setThreads(prev => {
      // Avoid duplicate thread registrations
      if (prev.some(t => t.id === id)) {
        return prev.map(t => t.id === id ? { ...t, lastMessage, time: timeStr, orderRef } : t);
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
    setThreads(prev => prev.map(t => ({ ...t, unread: false })));
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
      addCampaign,
      updateCampaign,
      deleteCampaign,
      addCustomOverview,
      deleteCustomOverview,
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
