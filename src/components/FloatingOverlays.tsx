import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, MessageSquare, X, Trash2, ArrowRight, Send, 
  Clock, Heart, ShoppingBag, ExternalLink, ChevronRight, CheckCircle, 
  Package, User, Shield, Bell, HelpCircle, LogOut, Settings, Radio, Bookmark,
  SlidersHorizontal, Search, X as XIcon, RotateCcw, ChevronDown
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useFloatingFilter } from './FilterEngine';

export function FloatingOverlays() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const { mode, retailCart, wholesaleCart, removeFromCart, updateCartQuantity, activeVideo, closeVideo } = useGlobalState();
  const { threads, threadMessages, addThreadMessage, markAllAsRead, setThreads } = useDashboard();

  // Active floating panel state: null | 'cart' | 'inbox' | 'profile'
  const [activePanel, setActivePanel] = useState<'cart' | 'inbox' | 'profile' | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterDrawerRef = useRef<HTMLDivElement>(null);

  const { config: filterConfig } = useFloatingFilter();
  const hasFilters = filterConfig.renderFilters !== null || (filterConfig.quickFilters && filterConfig.quickFilters.length > 0);
  
  // Selected thread inside mini message board for real-time nested chatting
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  
  // Profile sliding panel active accordion group
  const [activeAccordion, setActiveAccordion] = useState<string | null>('account');

  // Tracking responsive media
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const mobileMedia = window.matchMedia("(max-width: 640px)");
    const tabletMedia = window.matchMedia("(min-width: 641px) and (max-width: 1023px)");
    setIsMobile(mobileMedia.matches);
    setIsTablet(tabletMedia.matches);
    const mobileListener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const tabletListener = (e: MediaQueryListEvent) => setIsTablet(e.matches);
    mobileMedia.addEventListener("change", mobileListener);
    tabletMedia.addEventListener("change", tabletListener);
    return () => {
      mobileMedia.removeEventListener("change", mobileListener);
      tabletMedia.removeEventListener("change", tabletListener);
    };
  }, []);

  // Close active panel upon route transition
  useEffect(() => {
    setActivePanel(null);
    setFilterOpen(false);
  }, [currentPath]);

  // Cart tracking details
  const activeCart = mode === 'retail' ? retailCart : wholesaleCart;
  const totalCartItems = activeCart.reduce((sum, item) => sum + item.quantity, 0);
  const [lastCartCount, setLastCartCount] = useState(totalCartItems);
  const [cartBadgeBounce, setCartBadgeBounce] = useState(false);

  // Unread messages tracking
  const unreadCount = threads.filter(t => t.unread).length;
  const [lastUnreadCount, setLastUnreadCount] = useState(unreadCount);
  const [inboxBadgeBounce, setInboxBadgeBounce] = useState(false);

  const miniChatBottomRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close handler when clicking outside of any widget / triggers
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        activePanel &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Only close if we are not clicking a route transition
        setActivePanel(null);
      }

      if (
        filterOpen &&
        filterDrawerRef.current &&
        !filterDrawerRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activePanel, filterOpen]);

  // Close handler on ESC keypress
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePanel(null);
        setFilterOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trigger bounce on cart changes
  useEffect(() => {
    if (totalCartItems > lastCartCount) {
      setCartBadgeBounce(true);
      const timer = setTimeout(() => setCartBadgeBounce(false), 800);
      return () => clearTimeout(timer);
    }
    setLastCartCount(totalCartItems);
  }, [totalCartItems, lastCartCount]);

  // Trigger bounce on unread support status changes
  useEffect(() => {
    if (unreadCount > lastUnreadCount) {
      setInboxBadgeBounce(true);
      const timer = setTimeout(() => setInboxBadgeBounce(false), 800);
      return () => clearTimeout(timer);
    }
    setLastUnreadCount(unreadCount);
  }, [unreadCount, lastUnreadCount]);

  // Scroll to bottom of mini chat
  useEffect(() => {
    if (miniChatBottomRef.current) {
      miniChatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threadMessages, activeThreadId]);

  // Auto-close drawers if records drop to zero
  useEffect(() => {
    if (activePanel === 'cart' && totalCartItems === 0) {
      setActivePanel(null);
    }
  }, [totalCartItems, activePanel]);



  const subtotal = activeCart.reduce((sum, item) => {
    const price = item.selectedVariant?.price || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const formatPrice = (p: number) => p.toLocaleString('en-US');

  const handleMiniSend = () => {
    if (!chatInput.trim() || !activeThreadId) return;

    addThreadMessage(activeThreadId, chatInput.trim(), 'user', 'Me');
    const userMsg = chatInput.trim();
    setChatInput('');

    setTimeout(() => {
      const activeThreadObj = threads.find(t => t.id === activeThreadId);
      let responseText = `Thank you for your message! Our representative logged your query. We will update you shortly on this request.`;
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('deliver') || lower.includes('shipping') || lower.includes('when')) {
        responseText = `Regarding dispatch, your order is packaging. We secure all catalog orders instantly after confirmation.`;
      } else if (lower.includes('discount') || lower.includes('price') || lower.includes('cost')) {
        responseText = `Our wholesale rates are highly competitive. Slabs are applied automatically in global checkouts!`;
      } else if (lower.includes('size') || lower.includes('color') || lower.includes('variant')) {
        responseText = `Logged and noted! We package order lots exactly as staged in the inventory parameters.`;
      } else if (lower.includes('confirm') || lower.includes('approved')) {
        responseText = `Perfect! Your confirmation log is resolved inside our supply ecosystem. Thank you for choosing Choosify!`;
      }

      addThreadMessage(activeThreadId, responseText, 'seller', activeThreadObj?.title || 'Partner Support');
    }, 1500);
  };

  const activeMessages = threadMessages.filter(m => m.threadId === activeThreadId);
  const activeThreadObj = threads.find(t => t.id === activeThreadId);

  // Accordion lists mapping perfectly to instructed Groups
  const accordionGroups = [
    {
      id: 'account',
      title: 'ACCOUNT SECTION',
      items: [
        { to: '/dashboard', label: 'My Profile', icon: User, badge: 'FARHAN' },
        { to: '/dashboard', label: 'Edit Profile', icon: Settings },
        { to: '/dashboard', label: 'Account Settings', icon: Settings },
        { to: '/dashboard', label: 'Security Settings', icon: Shield },
      ]
    },
    {
      id: 'activity',
      title: 'ACTIVITY SECTION',
      items: [
        { to: '/dashboard', label: 'Orders / Activity', icon: ShoppingCart, badge: '35' },
        { to: '/dashboard', label: 'Saved Items', icon: Bookmark, badge: '550' },
        { to: '/dashboard', label: 'Recently Viewed', icon: Clock, badge: '15' },
        { to: '/dashboard', label: 'Purchase History', icon: Package },
      ]
    },
    {
      id: 'social',
      title: 'SOCIAL & CONNECTIONS',
      items: [
        { to: '/brands', label: 'Followed Brands', icon: Heart, badge: '8' },
        { to: '/creators', label: 'Followed Creators', icon: Radio, badge: '12' },
        { to: '/customer-favorite', label: 'Favorites / Wishlist', icon: Heart },
      ]
    },
    {
      id: 'messagesGroup',
      title: 'MESSAGES & ALERTS',
      items: [
        { to: '/messages', label: 'Messages', icon: MessageSquare, badge: '20' },
        { to: '/messages', label: 'Notifications', icon: Bell, badge: 'New' },
        { to: '/messages', label: 'Alerts', icon: Shield },
      ]
    },
    {
      id: 'supportGroup',
      title: 'SUPPORT',
      items: [
        { to: '/messages', label: 'Help Center', icon: HelpCircle },
        { to: '/messages', label: 'Contact Support', icon: MessageSquare },
      ]
    }
  ];

  // Stack calculation based on active item volumes
  const visibleButtonsCount = 1 + (unreadCount > 0 ? 1 : 0) + (totalCartItems > 0 ? 1 : 0);
  // Each trigger is h-12 (48px) and equal spacing is gap-3 (12px)
  const triggerStackHeight = visibleButtonsCount * 48 + (visibleButtonsCount - 1) * 12;

  // Custom motion transitions matching standard Choosify velocity
  const standardTransition = { type: "spring" as const, damping: 25, stiffness: 350 };

  return (
    <>
      <div 
        ref={containerRef}
        className={cn(
          "fixed z-[220] flex flex-col items-end text-[#1A1D4E] font-sans",
          isMobile ? "bottom-4 left-4 right-4 gap-3" : "bottom-6 right-6 lg:bottom-8 lg:right-8 gap-3 sm:gap-3.5"
        )}
      >
      
      {/* GLOBAL PERSISTENT FLOATING PANEL POPUPS */}
      <AnimatePresence>
        
        {/* PANEL 1: MINI FLOATING CART */}
        {activePanel === 'cart' && (
          <motion.div 
            ref={panelRef}
            initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.95 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.95 }}
            transition={standardTransition}
            style={isMobile || isTablet ? undefined : { bottom: `${triggerStackHeight + 16}px` }}
            className={cn(
              "bg-[#0A0B1E]/95 backdrop-blur-xl border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white flex flex-col",
              isMobile
                ? "fixed bottom-0 left-0 right-0 h-[72vh] rounded-t-[24px] z-[250] w-full"
                : isTablet
                  ? "fixed bottom-4 left-1/2 -translate-x-1/2 w-[480px] max-h-[70vh] rounded-[24px] z-[250]"
                  : "absolute right-0 w-[380px] rounded-[24px] max-h-[75vh]"
            )}
            id="floating-mini-cart-drawer"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-orange-primary/10 flex items-center justify-center text-orange-primary">
                  <ShoppingCart size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#E8500A] font-extrabold text-left">Instant Checklist</div>
                  <h3 className="text-sm font-black uppercase italic tracking-wider text-left">My Quick Cart</h3>
                </div>
              </div>
              <button 
                onClick={() => setActivePanel(null)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {activeCart.length === 0 ? (
                <div className="py-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-white/5 bg-white/[0.01] flex items-center justify-center text-gray-600">
                    <ShoppingBag size={20} />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-wider">Your transaction cart is empty</p>
                  <p className="text-[9px] lowercase italic text-gray-600 max-w-[200px] leading-relaxed">
                    discover top Bangladesh products and click add with custom volume metrics
                  </p>
                </div>
              ) : (
                activeCart.map((item) => {
                  const itemPrice = item.selectedVariant?.price || item.product.price;
                  const itemImage = item.selectedVariant?.image || item.product.image || PLACEHOLDER_IMAGE;
                  const itemTitle = item.product.title;
                  const redirectPath = mode === 'retail' ? `/products/${item.product.id}` : `/b2b/product/${item.product.id}`;

                  return (
                    <div key={item.id} className="flex gap-4 items-center bg-white/[0.02] border border-white/5 hover:border-white/10 p-3.5 rounded-2xl transition-all group text-left">
                      <Link 
                        to={redirectPath} 
                        onClick={() => setActivePanel(null)}
                        className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0 relative flex items-center justify-center"
                      >
                        <img src={itemImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={redirectPath}
                          onClick={() => setActivePanel(null)}
                          className="text-[11px] font-bold text-white uppercase italic truncate block hover:text-orange-primary transition-colors mb-0.5"
                        >
                          {itemTitle}
                        </Link>
                        {item.selectedVariant?.attributes && (
                          <div className="text-[9px] text-[#A0A5C0] flex gap-2 mb-1">
                            {Object.entries(item.selectedVariant.attributes).map(([key, val]: any) => (
                              <span key={key} className="bg-white/5 px-1.5 py-0.5 rounded text-[8px] uppercase">{key}: {val}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-black text-orange-primary">
                            ৳{formatPrice(itemPrice)}
                          </span>
                          
                          {/* Compact Qty Stepper */}
                          <div className="flex items-center gap-2 bg-black/20 px-2 py-0.5 rounded-lg border border-white/5">
                            <button 
                              onClick={() => item.quantity > 1 && updateCartQuantity(item.id, item.quantity - 1)}
                              className="text-[10px] text-gray-400 hover:text-white px-1 font-mono focus:outline-none"
                            >
                              -
                            </button>
                            <span className="text-[9px] font-bold font-mono px-0.5">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="text-[10px] text-gray-400 hover:text-white px-1 font-mono focus:outline-none"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Delete */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-white/[0.04] transition-all shrink-0 cursor-pointer"
                        title="Remove product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions if cart is populated */}
            {activeCart.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-white/[0.01] space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#A0A5C0]">Estimated Subtotal</span>
                  <span className="text-lg font-mono font-black text-white">৳{formatPrice(subtotal)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      setActivePanel(null);
                      navigate(mode === 'retail' ? '/cart/retail' : '/cart/b2b');
                    }}
                    className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    View Full Cart
                  </button>
                  <button 
                    onClick={() => {
                      setActivePanel(null);
                      navigate('/checkout');
                    }}
                    className="py-3 px-4 bg-orange-primary hover:bg-[#FF5B00] rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white transition-all text-center flex items-center justify-center gap-1 shadow-[0_4px_20px_rgba(249,101,0,0.3)] font-black italic cursor-pointer animate-pulse-subtle"
                  >
                    Checkout <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* PANEL 2: MINI FLOATING INBOX */}
        {activePanel === 'inbox' && (
          <motion.div
            ref={panelRef}
            initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.95 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.95 }}
            transition={standardTransition}
            style={isMobile || isTablet ? undefined : { bottom: `${triggerStackHeight + 16}px` }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 250 }}
            dragElastic={{ top: 0.1, bottom: 0.8 }}
            onDragEnd={(e, info) => {
              if (info.offset.y > 120) {
                setActivePanel(null);
              }
            }}
            className={cn(
              "bg-white shadow-[0_24px_55px_rgba(0,0,0,0.18)] border border-[#e8edf2] text-[#1A1A2E] flex flex-col font-sans overflow-hidden",
              isMobile
                ? "fixed bottom-0 left-0 right-0 h-[72vh] rounded-t-[24px] z-[250] w-full"
                : isTablet
                  ? "fixed bottom-4 left-1/2 -translate-x-1/2 w-[480px] max-h-[70vh] rounded-[24px] z-[250]"
                  : "absolute right-0 w-[380px] rounded-[24px] max-h-[75vh]"
            )}
            id="floating-mini-inbox-drawer"
          >
            {/* Drawer Drag Indicator on Mobile */}
            {isMobile && (
              <div className="w-12 h-1 rounded-full bg-gray-200 mx-auto mt-3 shrink-0" />
            )}

            {/* Inbox Header Block */}
            <div className="p-5 border-b border-[#e8edf2] bg-gradient-to-br from-[#FFF8F5]/85 to-[#FFF0E8]/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-9 h-9 rounded-full bg-orange-primary/10 flex items-center justify-center text-orange-primary shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#E8500A] font-extrabold text-left">Quick Connect</div>
                  <h3 className="text-xs md:text-sm font-black text-[#1A1A2E] leading-tight uppercase">
                    Merchant Inbox
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setActivePanel(null); navigate('/messages'); }}
                  className="text-[9px] font-black text-[#E8500A] uppercase tracking-wider hover:underline cursor-pointer border-0 bg-transparent"
                >
                  Open Full ↗
                </button>
                <button 
                  onClick={() => setActivePanel(null)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A1A2E] transition-all border border-[#e8edf2] cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Panel Body */}
            {activeThreadId === null ? (
              <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-[#e8edf2]">
                {threads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <MessageSquare size={28} className="text-gray-300 mb-3" />
                    <p className="text-[11px] font-bold text-gray-400">No conversations yet</p>
                  </div>
                ) : threads.map(thread => {
                  const displayName = thread.title;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className="w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left font-sans"
                    >
                      <div className="w-9 h-9 rounded-full bg-orange-primary/10 flex items-center justify-center shrink-0 text-[10px] font-black text-orange-primary">
                        {displayName?.substring(0, 2) || '??'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-black text-[#1A1A2E] truncate uppercase">{displayName}</span>
                          {thread.unread && <span className="w-2 h-2 rounded-full bg-orange-primary shrink-0 ml-2" />}
                        </div>
                        <p className="text-[10px] text-gray-400 truncate font-medium">{thread.lastMessage}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Chat view */
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e8edf2] shrink-0 bg-gray-50">
                  <button onClick={() => setActiveThreadId(null)} className="text-gray-400 hover:text-[#1A1A2E] p-1 cursor-pointer bg-transparent border-0 text-[12px] font-bold">
                    ←
                  </button>
                  <span className="text-[11px] font-black text-[#1A1A2E] uppercase">
                    {threads.find(t => t.id === activeThreadId)?.title}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
                  {(activeMessages || []).map((msg: any, i: number) => {
                    const isOutgoing = msg.sender === 'user';
                    return (
                      <div key={i} className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-[11px] font-medium ${isOutgoing ? 'bg-orange-primary text-white rounded-br-sm' : 'bg-gray-100 text-[#1A1A2E] rounded-bl-sm'}`}>
                          {msg.text || msg.content || msg.message}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={miniChatBottomRef} />
                </div>
                <div className="p-3 border-t border-[#e8edf2] flex gap-2 shrink-0">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && chatInput.trim()) {
                        addThreadMessage(activeThreadId, chatInput.trim(), 'user', 'Me');
                        setChatInput('');
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-gray-50 border border-[#e8edf2] rounded-full text-[11px] font-medium outline-none focus:border-orange-primary text-[#1A1A2E]"
                  />
                  <button
                    onClick={() => {
                      if (chatInput.trim()) {
                        addThreadMessage(activeThreadId, chatInput.trim(), 'user', 'Me');
                        setChatInput('');
                      }
                    }}
                    className="w-9 h-9 rounded-full bg-orange-primary text-white flex items-center justify-center shrink-0 cursor-pointer border-0 hover:bg-[#CF4400] transition-colors"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* PANEL 3: YOUR PROFILE DRAWER (Slide Up bottom->top dock system) */}
        {activePanel === 'profile' && (
          <motion.div
            ref={panelRef}
            initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.95 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.95 }}
            transition={standardTransition}
            style={isMobile || isTablet ? undefined : { bottom: `${triggerStackHeight + 16}px` }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 250 }}
            dragElastic={{ top: 0.1, bottom: 0.8 }}
            onDragEnd={(e, info) => {
              if (info.offset.y > 120) {
                setActivePanel(null);
              }
            }}
            className={cn(
              "bg-white shadow-[0_24px_55px_rgba(0,0,0,0.18)] border border-[#e8edf2] text-[#1A1A2E] flex flex-col font-sans overflow-hidden",
              isMobile
                ? "fixed bottom-0 left-0 right-0 h-[72vh] rounded-t-[24px] z-[250] w-full"
                : isTablet
                  ? "fixed bottom-4 left-1/2 -translate-x-1/2 w-[480px] max-h-[70vh] rounded-[24px] z-[250]"
                  : "absolute right-0 w-[380px] rounded-[24px] max-h-[75vh]"
            )}
            id="floating-profile-dock-drawer"
          >
            {/* Drawer Drag Indicator on Mobile */}
            {isMobile && (
              <div className="w-12 h-1 rounded-full bg-gray-200 mx-auto mt-3 shrink-0" />
            )}

            {/* Profile Header Block */}
            <div className="p-5 border-b border-[#e8edf2] bg-gradient-to-br from-[#FFF8F5]/85 to-[#FFF0E8]/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-md shrink-0">
                  <img 
                    src="https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png" 
                    className="w-full h-full object-cover" 
                    alt="Farhan Bin Rafiq" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-xs md:text-sm font-black text-[#1A1A2E] leading-tight uppercase">
                    Farhan Bin Rafiq
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block bg-[#E8500A]/10 text-[#E8500A] text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                      PREMIUM CONSUMER
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActivePanel(null)}
                className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A1A2E] transition-all border border-[#e8edf2] cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Accordion List Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar text-left select-none">
              {accordionGroups.map((group) => {
                const isExpanded = activeAccordion === group.id;

                return (
                  <div 
                    key={group.id} 
                    className={cn(
                      "border border-[#e8edf2] rounded-[10px] overflow-hidden transition-all duration-300",
                      isExpanded ? "bg-white border-[#E8500A]/15 shadow-sm" : "bg-white hover:bg-[#FFF8F5]/30"
                    )}
                  >
                    <button
                      onClick={() => setActiveAccordion(isExpanded ? null : group.id)}
                      className="w-full px-4 py-3 flex items-center justify-between font-sans text-[10px] font-black uppercase tracking-wider text-left text-[#1A1A2E] bg-transparent outline-none focus:outline-none cursor-pointer"
                    >
                      <span className={cn("transition-colors duration-200", isExpanded && "text-[#E8500A]")}>
                        {group.title}
                      </span>
                      {isExpanded ? (
                        <ChevronRight size={13} className="text-[#E8500A] transform rotate-90 transition-transform duration-200" />
                      ) : (
                        <ChevronRight size={13} className="text-[#8a9bb0] transition-transform duration-200" />
                      )}
                    </button>

                    {/* Collapsible item stack */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="border-t border-[#f4f7f9] bg-[#FDFDFD]"
                        >
                          <div className="py-1.5 px-2 space-y-0.5">
                            {group.items.map((item, idx) => {
                              const Icon = item.icon;
                              // Highlight active routes
                              const isRouteActive = item.to === '/' 
                                ? currentPath === '/' 
                                : currentPath === item.to || currentPath.startsWith(item.to + '/');

                              return (
                                <Link
                                  key={idx}
                                  to={item.to}
                                  onClick={() => {
                                    // Minimize panel on navigation if user selects a link
                                    setActivePanel(null);
                                  }}
                                  id={`floating-profile-dock-${group.id}-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                  className={cn(
                                    "flex items-center justify-between py-2 px-3 rounded-[6px] transition-all group duration-200",
                                    isRouteActive 
                                      ? "bg-[#FFF0E8] text-[#E8500A] font-black"
                                      : "hover:bg-[#FFF0E8]/45 text-[#1A1A2E] hover:text-[#E8500A]"
                                  )}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Icon 
                                      size={13} 
                                      className={cn(
                                        "transition-colors shrink-0",
                                        isRouteActive ? "text-[#E8500A]" : "text-[#8a9bb0] group-hover:text-[#E8500A]"
                                      )} 
                                    />
                                    <span className="font-sans text-[10.5px] font-semibold uppercase tracking-wide">
                                      {item.label}
                                    </span>
                                  </div>
                                  {item.badge && (
                                    <span className={cn(
                                      "px-2 py-0.5 text-[8px] font-mono font-black rounded-full leading-none shrink-0",
                                      item.badge === 'New' || item.badge === 'FARHAN'
                                        ? "bg-[#E8500A] text-white"
                                        : isRouteActive 
                                          ? "bg-[#E8500A]/10 text-[#E8500A]"
                                          : "bg-gray-100 text-gray-400 group-hover:bg-[#FFF0E8] group-hover:text-[#E8500A]"
                                    )}>
                                      {item.badge}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Logout Session Action Box */}
            <div className="p-4 border-t border-[#e8edf2] bg-gray-50 flex gap-2 shrink-0">
              <button
                onClick={() => {
                  toast.success("Successfully logged out!", { icon: '👋' });
                  setActivePanel(null);
                }}
                className="flex-1 py-3 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-sans text-[10px] font-black uppercase tracking-wider rounded-lg border border-[#e8edf2] hover:border-rose-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <LogOut size={12} />
                <span>Log Out Session</span>
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      
      {/* COORDINTED FLOATING ACTION TRIGGER STACK (No overlapping, consistent width) */}
      <div className="flex flex-col-reverse items-end gap-3 w-[185px]">

        {/* BUTTON 1: THE PROFILE PILL (Always visible, always matching width & borders) */}
        <motion.button
          id="floating-profile-dock-pill"
          onClick={() => setActivePanel(activePanel === 'profile' ? null : 'profile')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-[185px] h-12 rounded-full border flex items-center justify-between px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_22px_rgba(232,80,10,0.18)] transition-all duration-300 font-sans cursor-pointer group focus:outline-none",
            activePanel === 'profile'
              ? "bg-[#FFF0E8] border-[#E8500A] text-[#E8500A]"
              : "bg-white border-[#e8edf2] text-[#1A1A2E] hover:border-[#E8500A]/40"
          )}
          title="Account Profile Quick Dock"
        >
          <div className="flex items-center gap-2 max-w-[130px]">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-orange-primary/10 flex items-center justify-center border border-[#e8edf2] shrink-0">
              <img 
                src="https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png" 
                className="w-full h-full object-cover" 
                alt="Ava" 
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider truncate">
              YOUR PROFILE
            </span>
          </div>
          <ArrowRight 
            size={14} 
            className={cn(
              "transition-transform duration-300",
              activePanel === 'profile' ? "text-[#E8500A]" : "text-[#8a9bb0] group-hover:text-[#E8500A] group-hover:translate-x-1"
            )} 
          />
        </motion.button>


        {/* BUTTON 2: THE SHOPPING CART PILL (Visible only if cart contains items) */}
        <AnimatePresence>
          {totalCartItems > 0 && (
            <motion.button
              key="dock-cart-trigger"
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setActivePanel(activePanel === 'cart' ? null : 'cart')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-[185px] h-12 rounded-full border flex items-center justify-between px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_22px_rgba(232,80,10,0.18)] transition-all duration-300 font-sans cursor-pointer group focus:outline-none",
                activePanel === 'cart'
                  ? "bg-[#FFF0E8] border-[#E8500A] text-[#E8500A]"
                  : "bg-white border-[#e8edf2] text-[#1A1A2E] hover:border-[#E8500A]/40"
              )}
              title="Quick Cart Checklist"
            >
              <div className="flex items-center gap-2">
                <ShoppingCart 
                  size={15} 
                  className={cn(
                    "transition-colors",
                    activePanel === 'cart' ? "text-[#E8500A]" : "text-[#8a9bb0] group-hover:text-[#E8500A]"
                  )} 
                />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  QUICK CART
                </span>
              </div>
              
              <motion.span 
                animate={cartBadgeBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "font-mono text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center leading-none",
                  activePanel === 'cart' 
                    ? "bg-[#E8500A] text-white"
                    : "bg-gradient-to-br from-[#FF6A00] to-[#FF9E2C] text-white"
                )}
              >
                {totalCartItems > 99 ? '99+' : totalCartItems}
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>


        {/* BUTTON 3: THE MESSAGES PILL (Visible only if unread messages exist > 0) */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.button
              key="dock-messages-trigger"
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setActivePanel(activePanel === 'inbox' ? null : 'inbox')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-[185px] h-12 rounded-full border flex items-center justify-between px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_22px_rgba(232,80,10,0.18)] transition-all duration-300 font-sans cursor-pointer group focus:outline-none",
                activePanel === 'inbox'
                  ? "bg-[#FFF0E8] border-[#E8500A] text-[#E8500A]"
                  : "bg-white border-[#e8edf2] text-[#1A1A2E] hover:border-[#E8500A]/40"
              )}
              title="Merchant Conversations"
            >
              <div className="flex items-center gap-2">
                <MessageSquare 
                  size={15} 
                  className={cn(
                    "transition-colors",
                    activePanel === 'inbox' ? "text-[#E8500A]" : "text-[#8a9bb0] group-hover:text-[#E8500A]"
                  )} 
                />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  MESSAGES
                </span>
              </div>
              
              <motion.span 
                animate={inboxBadgeBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "font-mono text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center leading-none",
                  activePanel === 'inbox' 
                    ? "bg-[#E8500A] text-white"
                    : "bg-gradient-to-br from-[#FF6A00] to-[#FF9E2C] text-white animate-pulse"
                )}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>

      </div>


      {/* CINEMATIC VIDEO PLAYER OVERLAY FOR EMBEDDED-ONLY CONTENT */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-8"
            onClick={closeVideo}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={cn(
                "w-full bg-slate-950 rounded-2xl md:rounded-3xl border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col mb-16 lg:mb-0",
                activeVideo.isVertical ? "max-w-[360px] aspect-[9/16]" : "max-w-4xl aspect-video"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Info */}
              <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 flex items-center justify-between text-white">
                <div className="flex flex-col text-left pr-6">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#E8500A] mb-0.5">
                    {activeVideo.isVertical ? "Short / Reel Playback" : "YouTube Video Playback"}
                  </span>
                  <h3 className="text-xs md:text-sm font-extrabold tracking-tight truncate max-w-[240px] md:max-w-[600px] italic">
                    {activeVideo.title}
                  </h3>
                </div>
                
                <button
                  onClick={closeVideo}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/15 hover:border-white/20 transition-all text-white shrink-0 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Video Element */}
              <div className="w-full h-full relative group flex items-center justify-center bg-[#050615]">
                <video
                  src={activeVideo.url && activeVideo.url !== '#' ? activeVideo.url : "https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-virtual-reality-glasses-4384-large.mp4"}
                  className="w-full h-full object-contain"
                  autoPlay
                  controls
                  playsInline
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>

    {/* FILTER LAUNCHER — BOTTOM LEFT — mirrors right-side profile stack position */}
    {hasFilters && (
      <div className={cn(
        "fixed z-[219] flex flex-col items-start gap-3",
        isMobile ? "bottom-4 left-4" : "bottom-6 left-6 lg:bottom-8 lg:left-8"
      )}>
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              ref={filterDrawerRef}
              initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, scale: 0.95 }}
              animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, scale: 0.95 }}
              transition={standardTransition}
              drag={isMobile ? "y" : false}
              dragConstraints={{ top: 0, bottom: 250 }}
              dragElastic={{ top: 0.1, bottom: 0.8 }}
              onDragEnd={(_e: any, info: any) => {
                if (info.offset.y > 120) setFilterOpen(false);
              }}
              style={isMobile ? undefined : { bottom: '100%', marginBottom: '12px' }}
              className={cn(
                "bg-white shadow-[0_24px_55px_rgba(0,0,0,0.18)] border border-[#e8edf2] text-[#1A1A2E] flex flex-col font-sans overflow-hidden",
                isMobile
                  ? "fixed bottom-0 left-0 right-0 h-[72vh] rounded-t-[24px] z-[250] w-full"
                  : isTablet
                    ? "fixed bottom-4 left-4 w-[420px] max-h-[70vh] rounded-[24px] z-[250]"
                    : "absolute left-0 w-[380px] rounded-[24px] max-h-[75vh]"
              )}
            >
              {/* Mobile drag indicator */}
              {isMobile && (
                <div className="w-12 h-1 rounded-full bg-gray-200 mx-auto mt-3 shrink-0" />
              )}

              {/* Header */}
              <div className="p-5 border-b border-[#e8edf2] bg-gradient-to-br from-[#FFF8F5]/85 to-[#FFF0E8]/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-11 h-11 rounded-full bg-[#E8500A]/10 flex items-center justify-center border border-[#e8edf2] shrink-0">
                    <SlidersHorizontal size={18} className="text-[#E8500A]" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#E8500A]">
                      {filterConfig.pageName || 'Page Filters'}
                    </div>
                    <h3 className="text-xs font-black text-[#1A1A2E] leading-tight uppercase">
                      Filters & Search
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {filterConfig.onClearAll && filterConfig.activeFilterCount > 0 && (
                    <button
                      onClick={filterConfig.onClearAll}
                      className="text-[9px] font-black uppercase tracking-wider text-[#E8500A] bg-[#E8500A]/8 hover:bg-[#E8500A]/15 px-3 py-1.5 rounded-full transition-colors border-0 cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw size={9} /> Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A1A2E] transition-all border border-[#e8edf2] cursor-pointer"
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto no-scrollbar">

                {filterConfig.renderSearch && (
                  <div className="px-5 pt-4 pb-3 border-b border-[#e8edf2]">
                    <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] mb-2">Page Search</div>
                    {filterConfig.renderSearch()}
                  </div>
                )}

                {filterConfig.quickFilters && filterConfig.quickFilters.length > 0 && (
                  <div className="px-5 pt-4 pb-3 border-b border-[#e8edf2]">
                    <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] mb-2.5">Quick Filters</div>
                    <div className="flex flex-wrap gap-2">
                      {filterConfig.quickFilters.map((qf: any) => (
                        <button
                          key={qf.id}
                          onClick={qf.onClick}
                          className={cn(
                            "px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer flex items-center gap-1.5 border",
                            qf.active
                              ? "bg-[#E8500A] text-white border-transparent shadow-sm font-black italic"
                              : "bg-white border-[#e8edf2] text-gray-500 hover:border-[#1A1D4E]/25 hover:text-[#1A1D4E]"
                          )}
                        >
                          {qf.icon}
                          <span>{qf.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {filterConfig.renderFilters && (
                  <div className="px-5 pt-4 pb-6">
                    <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] mb-3">All Filters</div>
                    {filterConfig.renderFilters()}
                  </div>
                )}

                {/* Empty state */}
                {!filterConfig.renderFilters && !filterConfig.renderSearch && (!filterConfig.quickFilters || filterConfig.quickFilters.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <SlidersHorizontal size={28} className="text-gray-300 mb-3" />
                    <p className="text-[11px] font-bold text-gray-400">No filters available on this page</p>
                  </div>
                )}

              </div>

              {/* Mobile footer */}
              {isMobile && (
                <div className="px-5 py-4 border-t border-[#e8edf2] bg-white shrink-0">
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="w-full py-3.5 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[11px] font-black uppercase tracking-widest rounded-[8px] transition-colors cursor-pointer border-0"
                  >
                    Show Results
                  </button>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* The pill button */}
        <motion.button
          onClick={() => setFilterOpen(!filterOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-[185px] h-12 rounded-full border flex items-center justify-between px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_22px_rgba(232,80,10,0.18)] transition-all duration-300 font-sans cursor-pointer group focus:outline-none",
            filterOpen
              ? "bg-[#FFF0E8] border-[#E8500A] text-[#E8500A]"
              : "bg-white border-[#e8edf2] text-[#1A1A2E] hover:border-[#E8500A]/40"
          )}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal
              size={15}
              className={cn(
                "transition-colors",
                filterOpen ? "text-[#E8500A]" : "text-[#8a9bb0] group-hover:text-[#E8500A]"
              )}
            />
            <span className="text-[10px] font-black uppercase tracking-wider">
              FILTERS
            </span>
            {filterConfig.activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E8500A] text-white text-[9px] font-black flex items-center justify-center leading-none">
                {filterConfig.activeFilterCount > 9 ? '9+' : filterConfig.activeFilterCount}
              </span>
            )}
          </div>
          <ArrowRight
            size={14}
            className={cn(
              "transition-transform duration-300",
              filterOpen ? "text-[#E8500A]" : "text-[#8a9bb0] group-hover:text-[#E8500A] group-hover:translate-x-1"
            )}
          />
        </motion.button>
      </div>
    )}
  </>
);
}
