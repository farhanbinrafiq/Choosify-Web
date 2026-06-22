import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, MessageSquare, X, Trash2, ArrowRight, Send, 
  Clock, Heart, ShoppingBag, ExternalLink, ChevronRight, CheckCircle, 
  Package, User, Shield, Bell, HelpCircle, LogOut, Settings, Radio, Bookmark 
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export function FloatingOverlays() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const { mode, retailCart, wholesaleCart, removeFromCart, updateCartQuantity, activeVideo, closeVideo } = useGlobalState();
  const { threads, threadMessages, addThreadMessage, markAllAsRead, setThreads } = useDashboard();

  // Active floating panel state: null | 'cart' | 'inbox' | 'profile'
  const [activePanel, setActivePanel] = useState<'cart' | 'inbox' | 'profile' | null>(null);
  
  // Selected thread inside mini message board for real-time nested chatting
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  
  // Profile sliding panel active accordion group
  const [activeAccordion, setActiveAccordion] = useState<string | null>('account');

  // Tracking responsive media
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // Close active panel upon route transition
  useEffect(() => {
    setActivePanel(null);
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
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activePanel]);

  // Close handler on ESC keypress
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePanel(null);
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

  useEffect(() => {
    if (activePanel === 'inbox' && unreadCount === 0) {
      setActivePanel(null);
    }
  }, [unreadCount, activePanel]);

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
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={standardTransition}
            style={isMobile ? undefined : { bottom: `${triggerStackHeight + 16}px` }}
            className={cn(
              "bg-[#0A0B1E]/95 backdrop-blur-xl border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white flex flex-col",
              isMobile 
                ? "fixed bottom-0 left-0 right-0 h-[80vh] rounded-t-[32px] z-50 w-full"
                : "absolute right-0 w-[380px] rounded-[32px] max-h-[75vh]"
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

        {/* PANEL 2: MINI MESSENGER POPUP */}
        {activePanel === 'inbox' && (
          <motion.div 
            ref={panelRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={standardTransition}
            style={isMobile ? undefined : { bottom: `${triggerStackHeight + 16}px` }}
            className={cn(
              "bg-[#0A0B1E]/95 backdrop-blur-xl border border-white/10 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-white flex flex-col",
              isMobile 
                ? "fixed bottom-0 left-0 right-0 h-[80vh] rounded-t-[32px] z-50 w-full"
                : "absolute right-0 w-[380px] rounded-[32px] max-h-[75vh]"
            )}
            id="floating-mini-messenger"
          >
            {/* INBOX THREADS LISTING OR ACTIVES FEED */}
            {!activeThreadId ? (
              <>
                {/* Threads Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#1877F2]/10 flex items-center justify-center text-[#1877F2]">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-[#1B74E4] font-extrabold text-left">Instant Feed</div>
                      <h3 className="text-sm font-black uppercase italic tracking-wider text-left">Merchant Chats</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const hasUnread = threads.some(t => t.unread);
                      return (
                        <button
                          onClick={markAllAsRead}
                          disabled={!hasUnread}
                          className={`text-[9.5px] font-black uppercase tracking-wider transition-all px-2.5 py-1 rounded-lg border
                            ${hasUnread
                              ? 'text-orange-primary hover:text-white bg-orange-primary/10 hover:bg-orange-primary/25 border-orange-primary/20 cursor-pointer'
                              : 'text-gray-600 bg-white/[0.01] border-white/5 cursor-not-allowed'
                            }`}
                          title={hasUnread ? "Mark All as Read" : "All messages are already read"}
                        >
                          {hasUnread ? "Mark All Read" : "All Read"}
                        </button>
                      );
                    })()}
                    <button 
                      onClick={() => setActivePanel(null)}
                      className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Threads list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 block mb-2 text-left">My Live Stream Connections</span>
                  {threads.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">No active chat networks available</div>
                  ) : (
                    threads.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveThreadId(t.id);
                          if (t.unread) {
                            setThreads(prev => prev.map(thread => thread.id === t.id ? { ...thread, unread: false } : thread));
                          }
                        }}
                        className="w-full text-left p-3.5 rounded-2xl border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/[0.03] flex gap-3.5 items-center transition-all relative group cursor-pointer"
                      >
                        <div className="relative shrink-0">
                          <img src={t.avatar} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" referrerPolicy="no-referrer" />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-[#0A0B1E] rounded-full animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] font-black text-white hover:text-orange-primary transition-colors uppercase italic truncate pr-2">
                              {t.title}
                            </span>
                            <span className="text-[8px] text-gray-650 font-medium shrink-0 font-mono">{t.time}</span>
                          </div>
                          <p className="text-[9px] text-[#A0A5C0] line-clamp-1 italic">{t.lastMessage}</p>
                          {t.orderRef && (
                            <span className="inline-flex mt-1 text-[7.5px] font-black border border-white/5 bg-white/5 px-1.5 py-0.2 rounded text-orange-primary">
                              ORDER: {t.orderRef}
                            </span>
                          )}
                        </div>

                        {/* Unread dot indicator */}
                        {t.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-primary shrink-0 animate-bounce" />
                        )}
                      </button>
                    ))
                  )}
                </div>

                {/* Inbox Footer Actions */}
                <div className="p-4 border-t border-white/5 bg-white/[0.01] shrink-0">
                  <button 
                    onClick={() => {
                      setActivePanel(null);
                      navigate('/messages');
                    }}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-1.5 hover:text-orange-primary transition-colors cursor-pointer"
                  >
                    See All Messages <ExternalLink size={10} />
                  </button>
                </div>
              </>
            ) : (
              
              /* NESTED CHAT VIEWPORT LAYER */
              <>
                {/* Active Thread chat header */}
                <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.03] shrink-0">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveThreadId(null)}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 mr-1.5 focus:outline-none cursor-pointer"
                    >
                      ←
                    </button>
                    <img src={activeThreadObj?.avatar} className="w-9 h-9 rounded-full object-cover border border-white/10" alt="" referrerPolicy="no-referrer" />
                    <div className="text-left">
                      <h4 className="text-[11px] font-black text-white uppercase italic leading-none truncate max-w-[140px]">{activeThreadObj?.title}</h4>
                      <span className="text-[8px] text-green-400 font-extrabold uppercase flex items-center gap-1 mt-0.5">
                        <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" /> Live Stream
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => {
                        setActivePanel(null);
                        navigate(`/messages/${activeThreadId}`);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      title="Expand to Fullscreen"
                    >
                      <ExternalLink size={11} />
                    </button>
                    <button 
                      onClick={() => setActivePanel(null)}
                      className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Live Thread Chat stream container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#070817] no-scrollbar">
                  
                  {/* Miniature Transaction details overlay */}
                  {activeThreadObj?.orderRef && (
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-[9px] mb-3 relative overflow-hidden flex items-center justify-between gap-2.5">
                      <div className="text-left">
                        <div className="font-extrabold uppercase text-orange-primary tracking-widest text-[8px] mb-0.5">Linked transaction</div>
                        <span className="font-mono text-white text-[9.5px]">{activeThreadObj.orderRef}</span>
                      </div>
                      <span className="text-[7.5px] font-black uppercase text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/10 flex items-center gap-1 shrink-0">
                        <CheckCircle size={9} /> SECURED
                      </span>
                    </div>
                  )}

                  {/* Messages loop */}
                  {activeMessages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div key={msg.id} className={`flex gap-2.5 items-end max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}>
                        {!isUser && (
                          <img src={activeThreadObj?.avatar} className="w-6 h-6 rounded-full object-cover opacity-85 border border-white/10 shrink-0" alt="" referrerPolicy="no-referrer" />
                        )}
                        <div>
                          <div className={`p-3 text-[10.5px] rounded-2xl ${
                            isUser 
                              ? 'bg-orange-primary text-white rounded-br-none shadow-[0_4px_12px_rgba(249,101,0,0.2)]' 
                              : 'bg-white/[0.06] border border-white/5 text-gray-100 rounded-bl-none'
                          }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          </div>
                          <span className="text-[7px] text-gray-600 block mt-1 px-1 font-mono">{msg.time}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={miniChatBottomRef} />
                </div>

                {/* Live input controls */}
                <div className="p-3 border-t border-white/5 bg-white/[0.02] shrink-0 flex gap-2">
                  <input
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMiniSend()}
                    value={chatInput}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] focus:outline-none focus:border-orange-primary placeholder:text-gray-600 text-white"
                    placeholder="Type transaction message..."
                  />
                  <button 
                    onClick={handleMiniSend}
                    className="w-8 h-8 rounded-xl bg-orange-primary hover:bg-[#FF5B00] text-white flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send size={12} className="relative left-[-0.5px]" />
                  </button>
                </div>
              </>
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
            style={isMobile ? undefined : { bottom: `${triggerStackHeight + 16}px` }}
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
                ? "fixed bottom-0 left-0 right-0 h-[85vh] rounded-t-[28px] z-[250] w-full"
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
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop" 
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
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop" 
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
  );
}
