import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, MessageSquare, X, Trash2, ArrowRight, 
  ShoppingBag, ExternalLink, ChevronRight, CheckCircle, 
  Package, SlidersHorizontal, X as XIcon, RotateCcw
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { useFloatingFilter, useFloatingFilters } from './FilterEngine';

export function FloatingOverlays() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const { mode, retailCart, wholesaleCart, removeFromCart, updateCartQuantity, activeVideo, closeVideo, isLoggedIn } = useGlobalState();
  const { threads } = useDashboard();

  // Active floating panel state: cart preview only
  const [activePanel, setActivePanel] = useState<'cart' | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterDrawerRef = useRef<HTMLDivElement>(null);

  const { config: filterConfig } = useFloatingFilter();
  const { activeFiltersData: drawerFiltersData, setIsOpen: setDrawerFilterOpen, isOpen: drawerFilterOpen } = useFloatingFilters();
  const hasFilters =
    !drawerFiltersData &&
    (filterConfig.renderFilters !== null || (filterConfig.quickFilters && filterConfig.quickFilters.length > 0));
  const showFiltersAction = !!drawerFiltersData || hasFilters;

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

  const closeAllOverlays = () => {
    setActivePanel(null);
    setFilterOpen(false);
    setDrawerFilterOpen(false);
  };

  const openMobileFilters = () => {
    setActivePanel(null);
    if (drawerFiltersData) setDrawerFilterOpen(true);
    else setFilterOpen(true);
  };

  // Close active panel upon route transition
  useEffect(() => {
    closeAllOverlays();
  }, [currentPath]);

  // Sticky nav "Filter" shortcut opens the legacy floating filter panel
  useEffect(() => {
    const handleOpenFilters = () => {
      setFilterOpen(true);
      setActivePanel(null);
      setDrawerFilterOpen(false);
    };
    window.addEventListener('choosify:open-filters', handleOpenFilters);
    return () => window.removeEventListener('choosify:open-filters', handleOpenFilters);
  }, [setDrawerFilterOpen]);

  // Close auth-only panels when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setActivePanel((panel) => (panel === 'cart' ? panel : null));
    }
  }, [isLoggedIn]);

  // Cart tracking details
  const activeCart = mode === 'retail' ? retailCart : wholesaleCart;
  const totalCartItems = activeCart.reduce((sum, item) => sum + item.quantity, 0);
  const [lastCartCount, setLastCartCount] = useState(totalCartItems);
  const [cartBadgeBounce, setCartBadgeBounce] = useState(false);

  // Unread messages tracking (only meaningful when logged in)
  const unreadCount = isLoggedIn ? threads.filter(t => t.unread).length : 0;
  const [lastUnreadCount, setLastUnreadCount] = useState(unreadCount);
  const [inboxBadgeBounce, setInboxBadgeBounce] = useState(false);

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
        if (activePanel) {
          setActivePanel(null);
          return;
        }
        if (filterOpen) {
          setFilterOpen(false);
          return;
        }
        if (drawerFilterOpen) {
          setDrawerFilterOpen(false);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activePanel, filterOpen, drawerFilterOpen, setDrawerFilterOpen]);

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

  // Auto-close cart drawer if empty
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
  const onMessagesPage = currentPath.startsWith('/messages');

  // Stack calculation based on active item volumes
  const visibleButtonsCount = (isLoggedIn && !onMessagesPage ? 1 : 0) + (totalCartItems > 0 ? 1 : 0);
  // Each trigger is h-12 (48px) and equal spacing is gap-3 (12px)
  const triggerStackHeight = visibleButtonsCount * 48 + (visibleButtonsCount - 1) * 12;

  // Custom motion transitions matching standard Choosify velocity
  const standardTransition = { type: "spring" as const, damping: 25, stiffness: 350 };

  return (
    <>
      <div 
        ref={containerRef}
        className={cn(
          "fixed z-[220] text-[#1A1D4E] font-sans",
          isMobile
            ? "inset-0 pointer-events-none"
            : "bottom-6 right-6 lg:bottom-8 lg:right-8 flex flex-col items-end gap-3 sm:gap-3.5",
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
                ? "fixed bottom-0 left-0 right-0 h-[72vh] rounded-t-[24px] z-[250] w-full pointer-events-auto"
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
                            à§³{formatPrice(itemPrice)}
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
                  <span className="text-lg font-mono font-black text-white">à§³{formatPrice(subtotal)}</span>
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

      </AnimatePresence>

      
      {/* Desktop / tablet pill stack â€” cart + messages only */}
      <div className="hidden sm:flex flex-col-reverse items-end gap-3 w-[185px]">

        {/* BUTTON 2: QUICK CART (visible when cart has items) */}
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


        {/* MESSAGES PILL — hidden while on messages page */}
        <AnimatePresence>
          {isLoggedIn && !onMessagesPage && (
            <motion.button
              key="dock-messages-trigger"
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => {
                setActivePanel(null);
                navigate('/messages');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-[185px] h-12 rounded-full border flex items-center justify-between px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_22px_rgba(232,80,10,0.18)] transition-all duration-300 font-sans cursor-pointer group focus:outline-none",
                currentPath.startsWith('/messages')
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
                    currentPath.startsWith('/messages') ? "text-[#E8500A]" : "text-[#8a9bb0] group-hover:text-[#E8500A]"
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
                  "font-mono text-[9px] font-black min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center leading-none",
                  currentPath.startsWith('/messages')
                    ? "bg-[#E8500A] text-white"
                    : unreadCount > 0
                      ? "bg-gradient-to-br from-[#FF6A00] to-[#FF9E2C] text-white animate-pulse"
                      : "bg-[#e8edf2] text-[#8a9bb0]"
                )}
              >
                {unreadCount > 99 ? '99+' : unreadCount > 0 ? unreadCount : '•'}
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

    {/* FILTER LAUNCHER â€” legacy useRegisterPageFilters pages; drawer on all sizes, pill desktop-only */}
    {hasFilters && (
      <>
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              ref={filterDrawerRef}
              initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.95 }}
              animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.95 }}
              transition={standardTransition}
              drag={isMobile ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 250 }}
              dragElastic={{ top: 0.1, bottom: 0.8 }}
              onDragEnd={(_e: any, info: any) => {
                if (info.offset.y > 120) setFilterOpen(false);
              }}
              className={cn(
                'bg-white shadow-[0_24px_55px_rgba(0,0,0,0.18)] border border-[#e8edf2] text-[#1A1A2E] flex flex-col font-sans overflow-hidden z-[250]',
                isMobile
                  ? 'fixed bottom-0 left-0 right-0 h-[72vh] rounded-t-[24px] w-full pointer-events-auto'
                  : isTablet
                    ? 'fixed bottom-4 left-1/2 -translate-x-1/2 w-[480px] max-h-[70vh] rounded-[24px]'
                    : 'fixed bottom-[88px] left-6 lg:left-8 w-[380px] rounded-[24px] max-h-[75vh]',
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

        {!isMobile && (
        <div className="fixed z-[219] bottom-6 left-6 lg:bottom-8 lg:left-8 flex flex-col items-start">
        {/* The pill button */}
        <motion.button
          onClick={() => {
            setFilterOpen(!filterOpen);
            if (!filterOpen) setActivePanel(null);
          }}
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
    )}

    {isMobile && showFiltersAction && (
      <motion.button
        type="button"
        onClick={openMobileFilters}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'fixed z-[220] bottom-4 right-4 w-14 h-14 rounded-full border shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex items-center justify-center transition-colors pointer-events-auto sm:hidden',
          filterOpen || drawerFilterOpen
            ? 'bg-heading border-heading text-white'
            : 'bg-orange-primary border-orange-primary text-white',
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Open filters"
      >
        <SlidersHorizontal size={22} />
        {filterConfig.activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-white text-orange-primary text-[9px] font-black border-2 border-orange-primary flex items-center justify-center">
            {filterConfig.activeFilterCount > 9 ? '9+' : filterConfig.activeFilterCount}
          </span>
        )}
      </motion.button>
    )}
  </>
);
}
