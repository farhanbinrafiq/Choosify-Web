import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart, MessageCircle, X, SlidersHorizontal, X as XIcon, RotateCcw, ChevronUp, ArrowRight
} from 'lucide-react';
import { EmiAiLogo } from './EmiAiLogo';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useFloatingFilter } from './FilterEngine';
import { Badge } from './ui/badges/Badge';

export function FloatingOverlays() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const { mode, retailCart, wholesaleCart, removeFromCart, updateCartQuantity, activeVideo, closeVideo } = useGlobalState();
  const { threads, threadMessages, addThreadMessage, markAllAsRead, setThreads } = useDashboard();

  // Active floating panel state: null | 'cart' | 'inbox' | 'emi'
  const [activePanel, setActivePanel] = useState<'cart' | 'inbox' | 'emi' | null>(null);
  const { config: filterConfig, isOpen: filterOpen, setIsOpen: setFilterOpen } = useFloatingFilter();
  const filterDrawerRef = useRef<HTMLDivElement>(null);

  const hasFilters = filterConfig.renderFilters !== null || (filterConfig.quickFilters && filterConfig.quickFilters.length > 0);
  
  // Selected thread inside mini message board for real-time nested chatting
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  
  // EMI AI Chat Assistant State
  const [emiInput, setEmiInput] = useState('');
  const [isEmiTyping, setIsEmiTyping] = useState(false);
  const [emiMessages, setEmiMessages] = useState<any[]>([
    {
      id: 1,
      sender: 'emi',
      text: 'Hi there! I am EMI, your AI discovery assistant on Choosify. Ask me anything about premium products, comparative reviews, or find top guides in Bangladesh! 🚀',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const emiSuggestions = [
    "Find best value phones",
    "Active campaigns & deals",
    "What are Buying Guides?",
    "Compare premium brands"
  ];

  const handleSendEmiMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setEmiMessages((prev) => [...prev, userMsg]);
    setEmiInput('');
    setIsEmiTyping(true);

    // Dynamic responses based on keywords!
    setTimeout(() => {
      let replyText = "That's a great question! On Choosify, we filter the best products, direct merchant deals, and curated creator guides to find you the absolute best value. Try checking our /discover page!";
      const cleanText = text.toLowerCase();
      
      if (cleanText.includes('phone') || cleanText.includes('smartphone') || cleanText.includes('mobile')) {
        replyText = "Smartphones are our speciality! We highly recommend the Pixel 8 Pro or iPhone 15 Pro for peak photography, and the Samsung Galaxy A35 for absolute budget-friendly elegance. Check out the Products catalog for verified listings! 📱";
      } else if (cleanText.includes('deal') || cleanText.includes('active') || cleanText.includes('campaign') || cleanText.includes('discount')) {
        replyText = "We have major merchant campaigns active today with up to 25% off on selected flagship accessories and sneakers. Direct your browser to our Hot Deals page! 🎁";
      } else if (cleanText.includes('guide') || cleanText.includes('buying') || cleanText.includes('discover')) {
        replyText = "Buying Guides (now found under our premium 'Discover' page) are written by top tech creators to help you source products with ultimate clarity. They cover detailed breakdowns, video reviews, and wholesale pricing tips! 🌟";
      } else if (cleanText.includes('compare') || cleanText.includes('vs')) {
        replyText = "Choosify's live Compare Tool lets you drag-and-drop up to 3 products to compare full specs side-by-side. It is fully server-grounded and extremely fast! ⚖️";
      } else if (cleanText.includes('brand') || cleanText.includes('apex') || cleanText.includes('apple')) {
        replyText = "We feature standard authentic brand stores including Apple, Apex, Samsung, Sony, and Xiaomi with fully certified warranties. Check out our /brands section for details! 🏅";
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'emi',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setEmiMessages((prev) => [...prev, botMsg]);
      setIsEmiTyping(false);
    }, 1000);
  };

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

  // Stack calculation based on active FAB sizes (Emi 52px, cart/messages 48px)
  const triggerHeights: number[] = [];
  if (showEmiFab) triggerHeights.push(52);
  if (totalCartItems > 0) triggerHeights.push(48);
  if (showMessagesFab) triggerHeights.push(48);
  const triggerStackHeight =
    triggerHeights.reduce((sum, h) => sum + h, 0) +
    (triggerHeights.length > 1 ? (triggerHeights.length - 1) * 12 : 0);

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
                  <div className="text-[10px] uppercase tracking-widest text-[#FF5B00] font-extrabold text-left">Instant Checklist</div>
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
                  <div className="text-[10px] uppercase tracking-widest text-[#FF5B00] font-extrabold text-left">Quick Connect</div>
                  <h3 className="text-xs md:text-sm font-black text-[#1A1A2E] leading-tight uppercase">
                    Merchant Inbox
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setActivePanel(null); navigate('/messages'); }}
                  className="text-[9px] font-black text-[#FF5B00] uppercase tracking-wider hover:underline cursor-pointer border-0 bg-transparent"
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
                    className="w-9 h-9 rounded-full bg-orange-primary text-white flex items-center justify-center shrink-0 cursor-pointer border-0 hover:bg-[#EB4501] transition-colors"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* PANEL 3: EMI AI DRAWER (Slide Up bottom->top dock system) */}
        {activePanel === 'emi' && (
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
            id="floating-emi-dock-drawer"
          >
            {/* Drawer Drag Indicator on Mobile */}
            {isMobile && (
              <div className="w-12 h-1 rounded-full bg-gray-200 mx-auto mt-3 shrink-0" />
            )}

            {/* EMI AI Header Block */}
            <div className="p-5 border-b border-[#e8edf2] bg-gradient-to-br from-[#FFF8F5]/85 to-[#FFF0E8]/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF5B00] to-[#FF8C39] flex items-center justify-center shadow-md shrink-0 border-none">
                  <span className="text-white font-black text-xs uppercase tracking-widest leading-none">EMI</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#1E2035] leading-none flex items-center gap-1.5">
                    EMI AI Assistant <Badge variant="live" className="text-[7.5px] px-1 py-0.5 shadow-xs scale-90 select-none">LIVE</Badge>
                  </h3>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">Sourcing & discovery support</p>
                </div>
              </div>
              <button
                onClick={() => setActivePanel(null)}
                className="w-8 h-8 rounded-full bg-white/60 hover:bg-white border border-[#e8edf2] flex items-center justify-center cursor-pointer hover:text-[#FF5B00] transition-colors"
                aria-label="Close Assistant"
              >
                <X size={14} />
              </button>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-[40vh] sm:max-h-[45vh] select-text">
              {emiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[85%] text-left",
                    msg.sender === 'user' ? "self-end items-end" : "self-start items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-3.5 py-2.5 rounded-2xl text-xs font-semibold leading-relaxed",
                      msg.sender === 'user'
                        ? "bg-[#FF5B00] text-white rounded-tr-none shadow-sm"
                        : "bg-gray-100 text-[#1E2035] rounded-tl-none border border-gray-150/50"
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-400 font-bold mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isEmiTyping && (
                <div className="flex flex-col items-start self-start max-w-[85%] text-left">
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-none bg-gray-100 text-[#1E2035] text-xs font-bold border border-gray-150/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions block */}
            <div className="px-4 pb-2 pt-1 border-t border-gray-50 flex flex-wrap gap-1.5 justify-start bg-white shrink-0 select-none">
              {emiSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendEmiMessage(sug)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-[#FFF0E8] border border-gray-150/60 hover:border-[#FF5B00]/30 text-gray-500 hover:text-[#FF5B00] rounded-full text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Message input bar */}
            <div className="p-4 border-t border-[#e8edf2] bg-gray-50 flex gap-2 shrink-0">
              <input
                type="text"
                value={emiInput}
                onChange={(e) => setEmiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendEmiMessage(emiInput);
                }}
                placeholder="Ask EMI anything..."
                className="flex-1 px-4 py-2.5 bg-white border border-[#e8edf2] rounded-full text-xs font-medium outline-none focus:border-[#FF5B00] text-[#1E2035]"
              />
              <button
                onClick={() => handleSendEmiMessage(emiInput)}
                className="w-10 h-10 rounded-full bg-[#FF5B00] text-white flex items-center justify-center shrink-0 cursor-pointer border-0 hover:bg-[#E04E00] transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      
      {/* Desktop / tablet circular FAB stack — Emi + cart + messages */}
      <div className="hidden sm:flex flex-col-reverse items-end gap-3">

        {/* EMI ASSISTANT — always available when feature flag is on */}
        <AnimatePresence>
          {showEmiFab && (
            <motion.button
              key="dock-emi-trigger"
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => setActivePanel(activePanel === 'emi' ? null : 'emi')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'w-[52px] h-[52px] rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.28)] flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none p-1 overflow-hidden',
                activePanel === 'emi' && 'ring-2 ring-[#FF5B00]/60 brightness-105',
              )}
              title="Ask Emi — Choosify Assistant"
            >
              <EmiAiLogo size={44} className="w-11 h-11" />
            </motion.button>
          )}
          title="EMI AI Assistant Quick Dock"
        >
          <div className="flex items-center gap-2 max-w-[130px]">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-[#FF5B00]/10 flex items-center justify-center border border-[#e8edf2]/30 shrink-0">
              <span className="text-[#FF5B00] font-black text-[9px] uppercase tracking-wider">EMI</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider truncate">
              EMI AI CHAT
            </span>
          </div>
          <ArrowRight 
            size={14} 
            className={cn(
              "transition-transform duration-300",
              activePanel === 'emi' ? "text-[#FF5B00]" : "text-[#8a9bb0] group-hover:text-[#FF5B00] group-hover:translate-x-1"
            )} 
          />
        </motion.button>

        {/* CART FAB (visible when cart has items) */}
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
                "relative w-12 h-12 rounded-full bg-[#000435] text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none",
                activePanel === 'cart' && "ring-2 ring-[#FF5B00]/50 brightness-110",
              )}
              title="Quick Cart Checklist"
            >
              <ShoppingCart size={20} strokeWidth={2} />
              <motion.span
                animate={cartBadgeBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-lg bg-[#FF5B00] text-white text-[9px] font-bold flex items-center justify-center leading-none"
              >
                {totalCartItems > 99 ? '99+' : totalCartItems}
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* MESSAGES FAB — only when unread conversations exist */}
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
                "relative w-12 h-12 rounded-full bg-[#000435] text-white shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none",
                activePanel === 'messages' && "ring-2 ring-[#FF5B00]/50 brightness-110",
              )}
              title="Merchant Conversations"
            >
              <MessageCircle size={20} strokeWidth={2} />
              <motion.span
                animate={inboxBadgeBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-lg bg-[#FF5B00] text-white text-[9px] font-bold flex items-center justify-center leading-none"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>

      </div>


      {/* CINEMATIC VIDEO PLAYER OVERLAY FOR EMBEDDED-ONLY CONTENT */}
      <AnimatePresence>
        {showScrollTop && !activeVideo && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'fixed z-[218] w-11 h-11 rounded-full border border-[#e8edf2] bg-white text-[#1A1D4E] shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-[#FF5B00]/40 hover:text-[#FF5B00] flex items-center justify-center cursor-pointer pointer-events-auto transition-colors',
              isMobile ? 'bottom-20 right-4' : 'bottom-6 right-20 lg:bottom-8 lg:right-24',
            )}
            aria-label="Scroll to top"
            title="Back to top"
          >
            <ChevronUp size={20} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

    {/* FILTER LAUNCHER — legacy useRegisterPageFilters pages; drawer stacked above pill */}
    {hasFilters && (
      <>
        {!isMobile && filterOpen && (
          <motion.button
            type="button"
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
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#FF5B00] mb-0.5">
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

    {/* NEW GLOBAL FILTER SYSTEM LAUNCHER & DRAWER */}
    {hasFilters && (
      <>
        {/* Backdrop blur overlay */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-[240] transition-opacity"
            />
          )}
        </AnimatePresence>

        {/* Left sliding drawer */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              ref={filterDrawerRef}
              initial={isMobile ? { y: '100%' } : { x: '-100%' }}
              animate={isMobile ? { y: 0 } : { x: 0 }}
              exit={isMobile ? { y: '100%' } : { x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 210 }}
              className={cn(
                "bg-white shadow-[12px_0_45px_rgba(15,23,42,0.15)] text-[#1A1A2E] flex flex-col font-sans overflow-hidden z-[250] fixed",
                isMobile
                  ? "bottom-0 left-0 right-0 h-[85vh] rounded-t-[24px] w-full"
                  : "left-0 top-0 bottom-0 w-[400px] h-screen rounded-r-[24px]"
              )}
            >
              {/* Mobile drag handle indicator */}
              {isMobile && (
                <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mt-3.5 shrink-0" />
              )}

              {/* Header */}
              <div className="p-5 border-b border-[#e8edf2] bg-gradient-to-br from-[#FFF8F5]/85 to-[#FFF0E8]/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-11 h-11 rounded-full bg-[#FF5B00]/10 flex items-center justify-center border border-[#e8edf2] shrink-0">
                    <SlidersHorizontal size={18} className="text-[#FF5B00]" />
                  </div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#FF5B00]">
                      {filterConfig.pageName || 'Page Filters'}
                    </div>
                    <h3 className="text-xs font-black text-[#1A1A2E] leading-tight uppercase tracking-tight">
                      Filters & Specs
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {filterConfig.onClearAll && (filterConfig?.activeFilterCount || 0) > 0 && (
                    <button
                      onClick={filterConfig.onClearAll}
                      className="text-[9px] font-black uppercase tracking-wider text-[#FF5B00] bg-[#FF5B00]/8 hover:bg-[#FF5B00]/15 px-3 py-1.5 rounded-full transition-colors border-0 cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw size={9} /> Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1A1A2E] transition-all border border-[#e8edf2] cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto no-scrollbar">

                {filterConfig.renderSearch && (
                  <div className="px-5 pt-4 pb-3 border-b border-[#e8edf2] text-left">
                    <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] mb-2">Search Input</div>
                    {filterConfig.renderSearch()}
                  </div>
                )}

                {filterConfig.quickFilters && filterConfig.quickFilters.length > 0 && (
                  <div className="px-5 pt-4 pb-3 border-b border-[#e8edf2] text-left">
                    <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] mb-2.5">Quick Options</div>
                    <div className="flex flex-wrap gap-2">
                      {filterConfig.quickFilters.map((qf: any) => (
                        <button
                          key={qf.id}
                          onClick={qf.onClick}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer flex items-center gap-1.5 border font-sans",
                            qf.active
                              ? "bg-[#FF5B00] text-white border-transparent shadow-sm font-black italic"
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
                  <div className="px-5 pt-4 pb-6 text-left">
                    <div className="text-[9px] font-black uppercase tracking-[0.15em] text-[#8a9bb0] mb-3">Specification Filters</div>
                    {filterConfig.renderFilters()}
                  </div>
                )}

                {/* Empty state */}
                {!filterConfig.renderFilters && !filterConfig.renderSearch && (!filterConfig.quickFilters || filterConfig.quickFilters.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <SlidersHorizontal size={24} className="text-gray-300 mb-3" />
                    <p className="text-[11px] font-bold text-gray-400">No active page-level filters registered</p>
                  </div>
                )}

              </div>

              {/* Mobile footer */}
              {isMobile && (
                <div className="px-5 py-4 border-t border-[#e8edf2] bg-white shrink-0">
                  <button
                    onClick={closeFilterPanel}
                    className="w-full py-3.5 bg-[#FF5B00] hover:bg-[#E04E00] text-white text-[11px] font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer border-0"
                  >
                    Show Results
                  </button>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING ACTION BUTTON / TAB */}
        <motion.button
          onClick={() => setFilterOpen(!filterOpen)}
          whileHover={{ x: filterOpen ? 0 : isMobile ? 0 : 5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "h-[52px] rounded-[26px] bg-white border border-[#e8edf2] flex items-center gap-2.5 px-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300 font-sans cursor-pointer group focus:outline-none pointer-events-auto",
            filterOpen && "ring-2 ring-[#FF5B00]/30",
          )}
        >
          <SlidersHorizontal
            size={18}
            className={cn(
              "transition-colors shrink-0",
              filterOpen ? "text-[#FF5B00]" : "text-[#8a9bb0] group-hover:text-[#FF5B00]"
            )}
          />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1A1A2E]">
            FILTERS
          </span>
          {filterConfig.activeFilterCount > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-lg bg-[#FF5B00] text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {filterConfig.activeFilterCount > 9 ? '9+' : filterConfig.activeFilterCount}
            </span>
          )}
          <ArrowRight
            size={14}
            className={cn(
              "transition-transform duration-300 shrink-0 ml-1",
              filterOpen ? "text-[#FF5B00] rotate-90" : "text-[#8a9bb0] group-hover:text-[#FF5B00] group-hover:translate-x-0.5"
            )}
          />
        </motion.button>
      </>
    )}

    {isMobile && showEmiFab && (
      <motion.button
        type="button"
        onClick={() => setActivePanel(activePanel === 'emi' ? null : 'emi')}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'fixed z-[219] bottom-4 left-4 w-14 h-14 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all pointer-events-auto sm:hidden p-1 overflow-hidden bg-white',
          activePanel === 'emi' && 'ring-2 ring-[#FF5B00]/60 brightness-105',
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Ask Emi"
        title="Ask Emi"
      >
        <EmiAiLogo size={48} className="w-12 h-12" />
      </motion.button>
    )}

    {isMobile && showFiltersAction && (
      <motion.button
        type="button"
        onClick={openMobileFilters}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'fixed z-[220] bottom-4 right-4 w-14 h-14 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex items-center justify-center transition-all pointer-events-auto sm:hidden relative',
          filterOpen || drawerFilterOpen
            ? 'bg-[#000435] text-white ring-2 ring-[#FF5B00]/40'
            : 'bg-[#000435] text-white',
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Open filters"
      >
        <SlidersHorizontal size={22} />
        {filterConfig.activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-lg bg-[#FF5B00] text-white text-[9px] font-bold flex items-center justify-center">
            {filterConfig.activeFilterCount > 9 ? '9+' : filterConfig.activeFilterCount}
          </span>
        )}
      </motion.button>
    )}
  </>
);
}
