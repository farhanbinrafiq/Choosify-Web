import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingBag, User, PlusCircle, ChevronRight, LogIn, 
  LayoutDashboard, Heart, MessageSquare, Settings, Briefcase, Package, ShieldCheck, 
  FileCheck2, Building2, HelpCircle, ArrowLeftRight, CheckSquare, Menu, X, MapPin
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GlobalSearchBar } from './GlobalSearchBar';
import { useDragScroll } from './FilterEngine';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { CartDrawer } from './CartDrawer';
import { cn } from '../lib/utils';
import { PRIMARY_NAV_ITEMS, resolveSiteNavigation } from '../lib/navigation';
import { isNavPathEnabled } from '../lib/featureFlags';
import toast from 'react-hot-toast';
import { ChoosifyWordmarkLogo } from './ChoosifyWordmarkLogo';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartAnchorEl, setCartAnchorEl] = useState<HTMLElement | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { retailCart, isLoggedIn, setIsLoggedIn, currentUser, siteConfig, featureFlags } = useGlobalState();
  const { threads } = useDashboard();

  const unreadMsgCount = isLoggedIn ? threads.filter(t => t.unread).length : 0;

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { ref: categoryStripRef, props: categoryStripProps } = useDragScroll({ grabCursor: false });

  // Publish live navbar height for sticky page chrome (section nav, sidebars)
  useEffect(() => {
    const header = document.getElementById('main-navbar');
    if (!header) return;

    const syncNavbarHeight = () => {
      document.documentElement.style.setProperty(
        '--choosify-navbar-height',
        `${header.offsetHeight}px`,
      );
    };

    syncNavbarHeight();
    const observer = new ResizeObserver(syncNavbarHeight);
    observer.observe(header);
    window.addEventListener('resize', syncNavbarHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncNavbarHeight);
    };
  }, []);

  // Close mobile menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileProfileOpen(false);
    setIsUserMenuOpen(false);
    setIsCartOpen(false);
  }, [location.pathname]);

  // Handle clicking outside profile menu dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeCartCount = retailCart.reduce((sum, item) => sum + item.quantity, 0);

  const openCartPreview = (e: React.MouseEvent<HTMLButtonElement>) => {
    closeAllMobileOverlays();
    setIsUserMenuOpen(false);
    setCartAnchorEl(e.currentTarget);
    setIsCartOpen((open) => !open);
  };

  const navItems = resolveSiteNavigation(siteConfig?.navigation);

  const renderNavLinks = (linkClass: (path: string) => string) =>
    navItems ? (
      navItems
        .filter((item) => isNavPathEnabled(item.path, featureFlags))
        .map((item) => (
        <Link key={item.id} to={item.path} className={linkClass(item.path)}>
          {item.label}
        </Link>
      ))
    ) : (
      <>
        {PRIMARY_NAV_ITEMS.filter((item) => isNavPathEnabled(item.path, featureFlags)).map((item) => (
          <Link key={item.id} to={item.path} className={linkClass(item.path)}>
            {item.labelWide ? (
              <>
                <span className="2xl:hidden">{item.label}</span>
                <span className="hidden 2xl:inline">{item.labelWide}</span>
              </>
            ) : (
              item.label
            )}
          </Link>
        ))}
      </>
    );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const goToLogin = (tab: 'sign-in' | 'sign-up' = 'sign-in') => {
    setIsMobileMenuOpen(false);
    setIsMobileProfileOpen(false);
    navigate('/login', { state: { tab, from: location.pathname } });
  };

  const closeAllMobileOverlays = () => {
    setIsMobileMenuOpen(false);
    setIsMobileProfileOpen(false);
  };

  const openMobileNavMenu = () => {
    setIsMobileProfileOpen(false);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen((open) => !open);
  };

  const openMobileProfileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsMobileProfileOpen((open) => !open);
  };

  const dashboardMiniMenu: Array<{ label: string; path: string; icon: any; tab?: string; dividerAbove?: boolean }> = [
    { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', path: '/profile/orders', icon: Package },
    { label: 'Wishlist', path: '/dashboard', tab: 'saved-products', icon: Heart },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
  ];

  const navigateProfileItem = (item: (typeof dashboardMiniMenu)[number]) => {
    setIsUserMenuOpen(false);
    setIsMobileProfileOpen(false);
    if (item.tab) {
      navigate(item.path, { state: { activeTab: item.tab } });
    } else {
      navigate(item.path);
    }
  };

  const profilePrimaryLinks = dashboardMiniMenu.slice(0, 3);
  const profileSecondaryLinks = dashboardMiniMenu.slice(3);

  const getLinkClass = (path: string) => {
    const isActive = path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);
    const isDiscover = path === '/spotlight';
    if (isDiscover) {
      return cn(
        'choosify-discover-pill whitespace-nowrap text-[11.5px] transition-opacity hover:opacity-90',
        !isActive && 'opacity-95',
      );
    }
    return cn(
      'text-[11.5px] whitespace-nowrap transition-colors hover:text-[#FF5B00]',
      isActive ? 'text-[#FF5B00] font-bold' : 'text-white/80 font-medium',
    );
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);
    return cn(
      'flex items-center gap-3 py-2.5 px-4 rounded-xl text-[12.5px] font-semibold transition-all border',
      isActive
        ? 'text-[#FF5B00] bg-[#FFF3EA] border-[#FFD8B8]'
        : 'text-[#1A1A2E] hover:bg-[#F4F7F9] border-transparent',
    );
  };

  return (
    <>
      {siteConfig?.announcementBarEnabled && siteConfig.announcementBarText?.trim() && (
        <div className="w-full bg-[#E8500A] text-white text-center text-[11px] sm:text-xs py-1.5 px-4 font-semibold tracking-wide">
          {siteConfig.announcementBarText}
        </div>
      )}
      <header className="w-full min-w-0 z-50 sticky top-0 shadow-2xl border-b border-white/[0.07]" id="main-navbar">
        {/* Row 1 — Logo, prominent search, account actions (Choosify 3.0) */}
        <nav className="choosify-chrome-header text-white h-14 sm:h-16 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 xl:px-8 border-b border-white/5 lg:border-b-0 relative z-[40]">
        
        {/* Mobile hamburger — left side */}
        <button
          type="button"
          onClick={openMobileNavMenu}
          className="lg:hidden w-10 h-10 flex shrink-0 items-center justify-center text-white/70 hover:text-white hover:bg-white/5 rounded-full border border-white/10 bg-white/5 transition-all relative z-[60] hamburger"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} className={cn("transition-transform duration-300", isMobileMenuOpen && "rotate-90")} />
        </button>

        {/* LOGO — official Choosify wordmark */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center group" aria-label="Choosify Home">
            <ChoosifyWordmarkLogo
              fluid
              className="h-[26px] sm:h-7 w-auto max-w-[min(168px,42vw)] group-hover:opacity-95 transition-opacity"
            />
          </Link>
        </div>

        {/* Search + mobile cart */}
        <div className="flex-1 min-w-0 flex items-center justify-end sm:justify-stretch px-1 sm:px-3 md:px-4 lg:px-5">
          <div className="flex items-center gap-1.5 sm:flex-1 sm:min-w-0 sm:gap-0">
            <GlobalSearchBar
              initialValue={searchQuery}
              placeholder="Search Products, Brands, Reviews..."
              onSubmit={(val) => {
                setSearchQuery(val);
                navigate(`/search?q=${encodeURIComponent(val)}`);
              }}
              variant="hero"
              layout="navbar-fluid"
              enableSuggestions
              className="min-w-0 sm:w-full choosify-navbar-hero-search relative z-[55]"
              submitLabel="DISCOVER"
              onMobileExpandedChange={(expanded) => {
                if (expanded) closeAllMobileOverlays();
              }}
            />
            <button
              type="button"
              onClick={openCartPreview}
              className="sm:hidden relative w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Shopping cart"
              aria-expanded={isCartOpen}
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {activeCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-[8px] font-black bg-orange-primary rounded-full flex items-center justify-center border-2 border-[#0A0A1F]">
                  {activeCartCount > 9 ? '9+' : activeCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ACTIONS — cart only */}
        <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0 nav-actions relative z-[50]">
          
          <div className="hidden sm:flex items-center border-r border-[#ffffff1a] pr-2 xl:pr-5 shrink-0">
            <button 
              type="button"
              onClick={openCartPreview}
              className="relative text-white/85 hover:text-white transition-colors"
              aria-label="Shopping cart"
              aria-expanded={isCartOpen}
              title="Shopping Cart"
            >
              <ShoppingBag size={19} className="transition-colors" />
              {activeCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 text-white text-[9px] font-bold bg-[#FF5B00] rounded-lg flex items-center justify-center leading-none">
                  {activeCartCount > 99 ? '99+' : activeCartCount}
                </span>
              )}
            </button>
          </div>
          
          {isLoggedIn ? (
            <div
              className={cn('relative profile-avatar', isUserMenuOpen && 'z-[100]')}
              ref={profileMenuRef}
            >
              <button
                type="button"
                onClick={() => {
                  if (window.matchMedia('(min-width: 1024px)').matches) {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    return;
                  }
                  openMobileProfileMenu();
                }}
                className="flex items-center gap-1.5 group cursor-pointer animate-in fade-in bg-transparent border-0 p-0 whitespace-nowrap"
                aria-label="Open account menu"
                aria-expanded={isUserMenuOpen}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF5B00] to-[#2323FF] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                  {(currentUser?.name || 'F').charAt(0).toUpperCase()}
                </div>
                <span className="text-[11.5px] font-semibold hidden lg:block text-white">
                  Hi, {currentUser?.name?.split(' ')[0] || 'Farhan'}
                </span>
                <span className="text-[8px] text-white/50 hidden lg:inline">▾</span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[90] hidden lg:block"
                      onClick={() => setIsUserMenuOpen(false)}
                      aria-hidden
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      className="absolute right-0 top-full mt-2 bg-white rounded-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.22)] w-[200px] overflow-hidden z-[100] hidden lg:block"
                    >
                      <div className="px-4 py-3.5 bg-[#F4F7F9] border-b border-[#E8EDF2]">
                        <p className="text-[12.5px] font-bold text-[#1A1A2E] truncate">{currentUser?.name || 'Farhan'}</p>
                        <p className="text-[10.5px] text-[#9AA0AC] truncate">{currentUser?.email || 'kamaluddin@gmail.com'}</p>
                      </div>

                      <div>
                        {dashboardMiniMenu.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => navigateProfileItem(item)}
                            className="w-full flex items-center gap-2 px-4 py-[11px] text-xs font-semibold text-[#1A1A2E] border-b border-[#F1F1F3] hover:bg-[#F4F7F9] transition-colors"
                          >
                            <item.icon size={14} className="text-[#9AA0AC]" />
                            <span>{item.label}</span>
                            {item.icon === MessageSquare && unreadMsgCount > 0 && (
                              <span className="ml-auto min-w-[16px] h-4 px-1 bg-[#FF5B00] text-white text-[9px] font-bold rounded-lg flex items-center justify-center">
                                {unreadMsgCount > 9 ? '9+' : unreadMsgCount}
                              </span>
                            )}
                          </button>
                        ))}
                        <button 
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            setIsLoggedIn(false);
                            toast.success('Successfully logged out.');
                          }}
                          className="w-full flex items-center gap-2 px-4 py-[11px] text-xs font-semibold text-[#FF000D] hover:bg-red-50 transition-colors"
                        >
                          <LogIn size={14} className="rotate-180" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => goToLogin('sign-in')}
                className="h-8 xl:h-9 px-2.5 xl:px-4 text-white text-[8px] xl:text-[9px] uppercase font-black rounded-full tracking-wider xl:tracking-widest transition-all flex items-center gap-1 italic border border-white/15 bg-white/5 hover:bg-white/10 whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => goToLogin('sign-up')}
                className="h-8 xl:h-9 px-2.5 xl:px-4 text-white text-[8px] xl:text-[9px] uppercase font-black rounded-full tracking-wider xl:tracking-widest transition-all flex items-center gap-1 italic bg-[#FF6B00] hover:bg-orange-deep whitespace-nowrap"
              >
                Sign Up <LogIn size={12} className="xl:w-[13px] xl:h-[13px]" />
              </button>
            </div>
          )}

        </div>
        
        </nav>

        {/* Row 2 — Primary nav (Choosify 3.0); keep below profile dropdown stacking */}
        <div className="choosify-navbar-categories choosify-chrome-header border-t border-white/[0.06] text-white hidden lg:block relative z-[10]">
          <div
            ref={categoryStripRef}
            {...categoryStripProps}
            className="choosify-touch-scroll-row flex items-center gap-5 xl:gap-[22px] overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-6 xl:px-8 h-[38px] max-w-[100vw]"
          >
            {renderNavLinks(getLinkClass)}
          </div>
        </div>
      </header>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        anchorEl={cartAnchorEl}
      />

      {/* MOBILE NAV — left slide (sections / categories) — white panel, matches desktop dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[1px] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] h-full z-[101] bg-white text-[#1A1A2E] shadow-[0_12px_32px_rgba(0,0,0,0.22)] p-0 flex flex-col justify-between overflow-y-auto border-r border-[#E8EDF2] lg:hidden"
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 bg-[#F4F7F9] border-b border-[#E8EDF2]">
                  <span className="text-[13px] font-bold tracking-tight text-[#1A1A2E]">Browse</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center text-[#9AA0AC] hover:text-[#1A1A2E] hover:bg-white rounded-xl border border-[#E8EDF2] transition-all"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-1 p-4">
                  <span className="text-[10.5px] font-bold text-[#9AA0AC] tracking-[0.04em] mb-2 px-1">
                    Sections
                  </span>
                  {navItems ? (
                    navItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={getMobileLinkClass(item.path)}
                      >
                        <span>{item.label}</span>
                      </Link>
                    ))
                  ) : (
                    PRIMARY_NAV_ITEMS.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={getMobileLinkClass(item.path)}
                      >
                        <span>{item.labelWide || item.label}</span>
                      </Link>
                    ))
                  )}
                </div>

                <div className="mx-4 h-px bg-[#F1F1F3]" />

                <div className="p-4">
                  <Link
                    to="/post-offer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl text-[12.5px] font-bold text-[#1A1A2E] bg-[#F4F7F9] hover:bg-[#FFF3EA] border border-[#E8EDF2] transition-all justify-center"
                  >
                    <span>Post Your Deal</span>
                    <ChevronRight size={14} className="text-[#FF5B00]" />
                  </Link>
                </div>
              </div>

              <div className="p-4 border-t border-[#E8EDF2] flex flex-col gap-3">
                {!isLoggedIn && (
                  <>
                    <p className="text-[11px] font-medium text-[#9AA0AC] text-center">
                      Join Choosify Bangladesh
                    </p>
                    <button
                      type="button"
                      onClick={() => goToLogin('sign-in')}
                      className="w-full py-3.5 bg-[#FF5B00] hover:brightness-110 text-white text-[13px] font-bold rounded-xl transition-colors cursor-pointer border-0 flex items-center justify-center gap-2"
                    >
                      <LogIn size={14} />
                      <span>Sign In / Register</span>
                    </button>
                  </>
                )}
                <div className="text-center pt-1">
                  <span className="text-[10px] font-medium text-[#9AA0AC]">
                    Choosify Bangladesh • v1.0
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE PROFILE — right slide (account) — white panel, matches desktop dropdown */}
      <AnimatePresence>
        {isMobileProfileOpen && isLoggedIn && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileProfileOpen(false)}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[1px] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] h-full z-[101] bg-white text-[#1A1A2E] shadow-[0_12px_32px_rgba(0,0,0,0.22)] p-0 flex flex-col justify-between overflow-y-auto border-l border-[#E8EDF2] lg:hidden"
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 bg-[#F4F7F9] border-b border-[#E8EDF2]">
                  <span className="text-[13px] font-bold tracking-tight text-[#1A1A2E]">My Account</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileProfileOpen(false)}
                    className="w-10 h-10 flex items-center justify-center text-[#9AA0AC] hover:text-[#1A1A2E] hover:bg-white rounded-xl border border-[#E8EDF2] transition-all"
                    aria-label="Close account menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="px-5 py-4 bg-[#F4F7F9] border-b border-[#E8EDF2] flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5B00] to-[#2323FF] flex items-center justify-center text-white text-[15px] font-bold shrink-0 overflow-hidden">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        className="w-full h-full object-cover"
                        alt=""
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      (currentUser?.name || 'F').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#1A1A2E] tracking-tight leading-tight truncate">
                      {currentUser?.name || 'My Account'}
                    </p>
                    <p className="text-[11px] text-[#9AA0AC] truncate mt-0.5">
                      {currentUser?.email || 'Choosify Member'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  {profilePrimaryLinks.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => navigateProfileItem(item)}
                      className="w-full flex items-center gap-2.5 px-5 py-3 text-[12.5px] font-semibold text-[#1A1A2E] border-b border-[#F1F1F3] hover:bg-[#F4F7F9] transition-colors cursor-pointer text-left"
                    >
                      <item.icon size={14} className="text-[#9AA0AC] shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.icon === MessageSquare && unreadMsgCount > 0 && (
                        <span className="min-w-[16px] h-4 px-1 bg-[#FF5B00] text-white text-[9px] font-bold rounded-lg flex items-center justify-center">
                          {unreadMsgCount > 9 ? '9+' : unreadMsgCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col">
                  {profileSecondaryLinks.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => navigateProfileItem(item)}
                      className="w-full flex items-center gap-2.5 px-5 py-3 text-[12.5px] font-semibold text-[#1A1A2E] border-b border-[#F1F1F3] hover:bg-[#F4F7F9] transition-colors cursor-pointer text-left"
                    >
                      <item.icon size={14} className="text-[#9AA0AC] shrink-0" />
                      <span className="flex-1">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#E8EDF2] flex flex-col">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setIsMobileProfileOpen(false);
                    toast.success('Successfully logged out.');
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-5 py-3.5 text-[12.5px] font-semibold text-[#FF000D] hover:bg-red-50 transition-colors cursor-pointer text-left"
                >
                  <LogIn size={14} className="rotate-180" />
                  <span>Sign Out</span>
                </button>
                <div className="text-center pb-4 pt-1">
                  <span className="text-[10px] font-medium text-[#9AA0AC]">
                    Choosify Bangladesh • v1.0
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
