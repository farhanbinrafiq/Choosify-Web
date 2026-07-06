import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, MessageSquare, X, SlidersHorizontal, X as XIcon, RotateCcw, ChevronUp, ArrowRight, Sparkles
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { cn } from '../lib/utils';
import { useFloatingFilter, useFloatingFilters, scrollToFilterResultsTarget } from './FilterEngine';
import { VideoLightbox } from './VideoLightbox';
import {
  CartPreviewPanel,
  cartPreviewDesktopShellClass,
  cartPreviewMobileShellClass,
  cartPreviewShellClass,
} from './CartPreviewPanel';
import {
  MessagesPreviewPanel,
  messagesPreviewDesktopShellClass,
  messagesPreviewMobileShellClass,
  messagesPreviewShellClass,
} from './MessagesPreviewPanel';
import {
  EmiChatPanel,
  emiChatDesktopShellClass,
  emiChatMobileShellClass,
  emiChatShellClass,
} from './EmiChatPanel';
import { AlphabetFilterStrip } from './AlphabetFilterStrip';
import { getFloatingPanelClassName } from './FloatingPanelShell';

export function FloatingOverlays() {
  const location = useLocation();
  const currentPath = location.pathname;
  const onMessagesPage = currentPath.startsWith('/messages');

  const onEmiPage = currentPath.startsWith('/emi');

  const { retailCart, activeVideo, closeVideo, isLoggedIn, isFeatureEnabled } = useGlobalState();
  const { threads } = useDashboard();

  const showEmiFab = isFeatureEnabled('enable_emi_assistant') && !onEmiPage;

  // Active floating panel state: cart preview, messages preview, or Emi
  const [activePanel, setActivePanel] = useState<'cart' | 'messages' | 'emi' | null>(null);
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
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 360);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeFilterPanel = () => {
    const targetId = filterConfig.scrollTargetId;
    setFilterOpen(false);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => scrollToFilterResultsTarget(targetId), 80);
    });
  };

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
  const totalCartItems = retailCart.reduce((sum, item) => sum + item.quantity, 0);
  const [lastCartCount, setLastCartCount] = useState(totalCartItems);
  const [cartBadgeBounce, setCartBadgeBounce] = useState(false);

  // Unread messages — hide floating pill when inbox empty or fully read
  const unreadCount = isLoggedIn ? threads.filter((t) => t.unread).length : 0;
  const showMessagesFab = isLoggedIn && !onMessagesPage && threads.length > 0 && unreadCount > 0;
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
        closeFilterPanel();
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
          closeFilterPanel();
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

  // Stack calculation based on active item volumes
  const visibleButtonsCount =
    (showEmiFab ? 1 : 0) + (showMessagesFab ? 1 : 0) + (totalCartItems > 0 ? 1 : 0);
  // Each trigger is h-12 (48px) and equal spacing is gap-3 (12px)
  const triggerStackHeight = visibleButtonsCount * 48 + (visibleButtonsCount - 1) * 12;

  // Custom motion transitions matching standard Choosify velocity
  const standardTransition = { type: "spring" as const, damping: 25, stiffness: 350 };

  return (
    <>
      <VideoLightbox video={activeVideo} onClose={closeVideo} />

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
        
        {/* PANEL 1: MINI FLOATING CART — matches navbar cart dropdown */}
        {activePanel === 'cart' && (
          <motion.div 
            ref={panelRef}
            initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.98 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.98 }}
            transition={standardTransition}
            style={isMobile || isTablet ? undefined : { bottom: `${triggerStackHeight + 16}px` }}
            className={cn(
              cartPreviewShellClass,
              isMobile
                ? cn('fixed z-[250] pointer-events-auto', cartPreviewMobileShellClass, 'h-[82vh]')
                : isTablet
                  ? cn('fixed bottom-4 left-1/2 -translate-x-1/2 z-[250]', cartPreviewDesktopShellClass, 'w-[min(24rem,calc(100vw-1.5rem))]')
                  : cn('absolute right-0 z-[250]', cartPreviewDesktopShellClass),
            )}
            id="floating-mini-cart-drawer"
          >
            <CartPreviewPanel onClose={() => setActivePanel(null)} />
          </motion.div>
        )}

        {activePanel === 'messages' && (
          <motion.div
            ref={panelRef}
            initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.98 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.98 }}
            transition={standardTransition}
            style={isMobile || isTablet ? undefined : { bottom: `${triggerStackHeight + 16}px` }}
            className={cn(
              messagesPreviewShellClass,
              isMobile
                ? cn('fixed z-[250] pointer-events-auto', messagesPreviewMobileShellClass, 'h-[82vh]')
                : isTablet
                  ? cn('fixed bottom-4 left-1/2 -translate-x-1/2 z-[250]', messagesPreviewDesktopShellClass, 'w-[min(28rem,calc(100vw-1.5rem))]')
                  : cn('absolute right-0 z-[250]', messagesPreviewDesktopShellClass, 'w-[min(28rem,calc(100vw-2rem))]'),
            )}
            id="floating-messages-drawer"
          >
            <MessagesPreviewPanel onClose={() => setActivePanel(null)} />
          </motion.div>
        )}

        {activePanel === 'emi' && (
          <motion.div
            ref={panelRef}
            initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.98 }}
            animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 35, scale: 0.98 }}
            transition={standardTransition}
            style={isMobile || isTablet ? undefined : { bottom: `${triggerStackHeight + 16}px` }}
            className={cn(
              emiChatShellClass,
              isMobile
                ? cn('fixed z-[250] pointer-events-auto', emiChatMobileShellClass, 'h-[85vh]')
                : isTablet
                  ? cn('fixed bottom-4 left-1/2 -translate-x-1/2 z-[250]', emiChatDesktopShellClass)
                  : cn('absolute right-0 z-[250]', emiChatDesktopShellClass, 'max-h-[min(36rem,calc(100vh-10rem))]'),
            )}
            id="floating-emi-drawer"
          >
            <EmiChatPanel onClose={() => setActivePanel(null)} />
          </motion.div>
        )}

      </AnimatePresence>

      
      {/* Desktop / tablet pill stack — Emi + cart + messages */}
      <div className="hidden sm:flex flex-col-reverse items-end gap-3 w-[185px]">

        {/* EMi ASSISTANT — always available when feature flag is on */}
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
                'w-[185px] h-12 rounded-full border flex items-center justify-between px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_22px_rgba(232,80,10,0.18)] transition-all duration-300 font-sans cursor-pointer group focus:outline-none',
                activePanel === 'emi'
                  ? 'bg-[#1A1D4E] border-[#1A1D4E] text-white'
                  : 'bg-white border-[#e8edf2] text-[#1A1A2E] hover:border-[#E8500A]/40',
              )}
              title="Ask Emi — Choosify Assistant"
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  size={15}
                  className={cn(
                    'transition-colors',
                    activePanel === 'emi' ? 'text-[#E8500A]' : 'text-[#8a9bb0] group-hover:text-[#E8500A]',
                  )}
                />
                <span className="text-[10px] font-black uppercase tracking-wider">ASK EMI</span>
              </div>
              <span className="w-6 h-6 rounded-full bg-[#E8500A] text-white text-[10px] font-black flex items-center justify-center italic">
                E
              </span>
            </motion.button>
          )}
        </AnimatePresence>

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


        {/* MESSAGES PILL — only when unread conversations exist */}
        <AnimatePresence>
          {showMessagesFab && (
            <motion.button
              key="dock-messages-trigger"
              initial={{ scale: 0, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0, y: 15 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={() => setActivePanel(activePanel === 'messages' ? null : 'messages')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-[185px] h-12 rounded-full border flex items-center justify-between px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_22px_rgba(232,80,10,0.18)] transition-all duration-300 font-sans cursor-pointer group focus:outline-none",
                activePanel === 'messages'
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
                    activePanel === 'messages' ? "text-[#E8500A]" : "text-[#8a9bb0] group-hover:text-[#E8500A]"
                  )} 
                />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  MESSAGES
                </span>
              </div>
              
              <motion.span 
                animate={inboxBadgeBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className="font-mono text-[9px] font-black min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center leading-none bg-gradient-to-br from-[#FF6A00] to-[#FF9E2C] text-white animate-pulse"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>

      </div>
      </div>


      {/* Scroll to top — desktop sits left of cart stack; mobile above filter FAB */}
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
              'fixed z-[218] w-11 h-11 rounded-full border border-[#e8edf2] bg-white text-[#1A1D4E] shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-[#E8500A]/40 hover:text-[#E8500A] flex items-center justify-center cursor-pointer pointer-events-auto transition-colors',
              isMobile ? 'bottom-20 right-4' : 'bottom-6 right-[212px] lg:bottom-8 lg:right-[220px]',
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
          <button
            type="button"
            className="fixed inset-0 z-[218] bg-black/10 cursor-pointer border-0"
            aria-label="Close filters"
            onClick={closeFilterPanel}
          />
        )}

        <div
          className={cn(
            'fixed z-[219] flex flex-col-reverse items-start gap-3',
            isMobile ? 'pointer-events-none' : 'bottom-6 left-6 lg:bottom-8 lg:left-8',
          )}
        >
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              ref={filterDrawerRef}
              initial={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 20, scale: 0.97 }}
              animate={isMobile ? { y: 0, opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={isMobile ? { y: '100%', opacity: 1 } : { opacity: 0, y: 20, scale: 0.97 }}
              transition={standardTransition}
              drag={isMobile ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 250 }}
              dragElastic={{ top: 0.1, bottom: 0.8 }}
              onDragEnd={(_e: any, info: any) => {
                if (info.offset.y > 120) closeFilterPanel();
              }}
              className={getFloatingPanelClassName({
                isMobile,
                isTablet,
                textClass: 'text-[#1A1A2E]',
              })}
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
                    onClick={closeFilterPanel}
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

                {filterConfig.alphabetFilter && (
                  <div className="px-5 pt-4 pb-3 border-b border-[#e8edf2]">
                    <AlphabetFilterStrip
                      activeLetter={filterConfig.alphabetFilter.activeLetter}
                      onLetterChange={filterConfig.alphabetFilter.onLetterChange}
                      compact
                    />
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
                    onClick={closeFilterPanel}
                    className="w-full py-3.5 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[11px] font-black uppercase tracking-widest rounded-[5px] transition-colors cursor-pointer border-0"
                  >
                    Show Results
                  </button>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {!isMobile && (
        <motion.button
          type="button"
          onClick={() => {
            setFilterOpen(!filterOpen);
            if (!filterOpen) setActivePanel(null);
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-[185px] h-12 rounded-full border flex items-center justify-between px-3.5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_22px_rgba(232,80,10,0.18)] transition-all duration-300 font-sans cursor-pointer group focus:outline-none pointer-events-auto",
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
              filterOpen ? "text-[#E8500A] rotate-90" : "text-[#8a9bb0] group-hover:text-[#E8500A] group-hover:translate-x-1"
            )}
          />
        </motion.button>
        )}
        </div>
      </>
    )}

    {isMobile && showEmiFab && (
      <motion.button
        type="button"
        onClick={() => setActivePanel(activePanel === 'emi' ? null : 'emi')}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'fixed z-[219] bottom-4 left-4 w-14 h-14 rounded-full border shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex items-center justify-center transition-colors pointer-events-auto sm:hidden',
          activePanel === 'emi'
            ? 'bg-[#1A1D4E] border-[#1A1D4E] text-white'
            : 'bg-[#E8500A] border-[#E8500A] text-white',
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Ask Emi"
        title="Ask Emi"
      >
        <Sparkles size={22} />
      </motion.button>
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
