import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingBag, User, PlusCircle, ChevronRight, LogIn, 
  LayoutDashboard, Heart, MessageSquare, Settings, Briefcase, Package, ShieldCheck, 
  FileCheck2, Building2, HelpCircle, ArrowLeftRight, CheckSquare, Menu, X
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
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Saved Products', path: '/dashboard', tab: 'saved-products', icon: Heart },
    { label: 'Settings', path: '/dashboard', tab: 'settings', icon: Settings },
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
  const defaultAvatar = 'https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png';

  const getLinkClass = (path: string) => {
    const isActive = path === '/' 
      ? location.pathname === '/' 
      : location.pathname.startsWith(path);
    return cn(
      "transition-colors hover:text-orange-primary whitespace-nowrap",
      isActive ? "text-orange-primary font-black" : "text-gray-300"
    );
  };

  const getMobileLinkClass = (path: string) => {
    const isActive = path === '/' 
      ? location.pathname === '/' 
      : location.pathname.startsWith(path);
    return cn(
      "flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
      isActive 
        ? "text-orange-primary bg-orange-primary/5 border border-orange-primary/10" 
        : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
    );
  };

  return (
    <>
      {siteConfig?.announcementBarEnabled && siteConfig.announcementBarText?.trim() && (
        <div className="w-full bg-[#E8500A] text-white text-center text-[11px] sm:text-xs py-1.5 px-4 font-semibold tracking-wide">
          {siteConfig.announcementBarText}
        </div>
      )}
      <header className="w-full min-w-0 z-50 sticky top-0 shadow-2xl" id="main-navbar">
        {/* Row 1 — Logo, prominent search, account actions (Amazon-style top bar) */}
        <nav className="choosify-dark-gradient text-white h-14 sm:h-16 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 xl:px-8 border-b border-white/5 lg:border-b-0">
        
        {/* Mobile hamburger — left side */}
        <button
          type="button"
          onClick={openMobileNavMenu}
          className="lg:hidden w-10 h-10 flex shrink-0 items-center justify-center text-white/70 hover:text-white hover:bg-white/5 rounded-full border border-white/10 bg-white/5 transition-all relative z-[60] hamburger"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} className={cn("transition-transform duration-300", isMobileMenuOpen && "rotate-90")} />
        </button>

        {/* LOGO SECTOR */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex flex-col items-center group" aria-label="Choosify Home">
            <svg 
              id="Layer_1" 
              data-name="Layer 1" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 3311.76 744.41"
              className="h-8 sm:h-9 lg:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            >
              <path className="fill-white" d="M0,391.36c0-127.52,86.85-224.74,219.95-224.74,113.18,0,183.35,64.55,198.44,156.98h-121.1c-8.75-39.05-34.26-63.76-75.68-63.76-63,0-94.85,51.8-94.85,131.52s31.84,129.89,94.85,129.89c46.18,0,74.1-27.88,79.68-76.51h120.35c-4,96.43-80.51,171.36-198.44,171.36C87.68,616.1,0,518.09,0,391.36Z"/>
              <path className="fill-white" d="M605.22,602.56h-125.18V9.6h125.18v163.4c0,3.96,0,38.26-.83,66.14h2.41c25.5-45.42,68.51-72.51,127.52-72.51,93.19,0,147.44,62.14,147.44,156.98v278.95h-124.35v-255.04c0-46.22-24.67-77.3-70.93-77.3-48.59,0-81.26,39.05-81.26,93.26v239.08Z"/>
              <path className="fill-white" d="M941.82,391.36c0-127.52,89.26-224.74,224.78-224.74s223.12,97.22,223.12,224.74-88.43,224.74-223.12,224.74-224.78-98.02-224.78-224.74ZM1263.03,391.36c0-80.51-35.09-135.48-97.26-135.48s-97.19,54.97-97.19,135.48,33.43,133.89,97.19,133.89,97.26-54.21,97.26-133.89Z"/>
              <path className="fill-white" d="M1433.1,391.36c0-127.52,89.26-224.74,224.78-224.74s223.12,97.22,223.12,224.74-88.43,224.74-223.12,224.74-224.78-98.02-224.78-224.74ZM1754.31,391.36c0-80.51-35.09-135.48-97.26-135.48s-97.19,54.97-97.19,135.48,33.43,133.89,97.19,133.89,97.26-54.21,97.26-133.89Z"/>
              <path className="fill-white" d="M1917.14,471.84h117.94c7.17,39.88,37.5,62.17,86.09,62.17,44.67,0,70.17-18.34,70.17-48.59,0-38.26-50.25-43.05-109.18-54.21-75.76-14.34-152.27-33.46-152.27-132.31,0-86.85,78.93-132.27,178.52-132.27,117.94,0,176.94,51.01,188.11,125.1h-116.35c-8-30.26-31.92-45.42-71.76-45.42s-62.93,15.96-62.93,43.05c0,31.88,46.18,36.67,104.35,47.01,75.76,13.54,161.85,33.46,161.85,140.27,0,91.68-81.34,139.48-191.28,139.48-122.76,0-196.86-58.97-203.27-144.27Z"/>
              <rect className="fill-white" x="2374.09" y="178.54" width="125.18" height="424.02"/>
              <path className="fill-white" d="M2745.71,259.85v342.71h-125.18v-342.71h-63.76v-81.3h63.76v-35.84c0-45.42,11.17-77.3,35.92-99.64,27.84-24.71,71.68-34.26,125.86-33.46,16.75,0,34.33.79,51.84,3.17v89.26c-62.93-2.38-88.43,1.62-88.43,49.42v27.09h88.43v81.3h-88.43Z"/>
              <path className="fill-white" d="M2921.97,742.83v-98.02h6.41c1.58.79,37.43.79,40.67.79,39.01,0,58.18-14.34,60.51-43.05,0-14.34-7.17-47.01-22.26-85.26l-131.52-338.75h131.52l54.18,162.6c19.09,57.38,35.09,147.44,35.09,147.44h1.58s19.09-90.85,37.43-147.44l51.84-162.6h124.35l-151.44,434.39c-34.33,98.02-73.34,131.48-154.61,131.48-4,0-81.34-.79-83.75-1.58Z"/>
              <path className="fill-[#ef3c23]" d="M2437.08,135.56c37.42,0,67.74-30.36,67.74-67.78,0-37.42-30.32-67.78-67.74-67.78s-67.78,30.36-67.78,67.78c0,6.5.92,12.75,2.61,18.69,4.25-2.61,9.3-4.13,14.68-4.13,15.6,0,28.23,12.63,28.23,28.19,0,7.06-2.61,13.52-6.86,18.45,8.82,4.21,18.69,6.58,29.12,6.58Z"/>
            </svg>
          </Link>
        </div>

        {/* Search + mobile cart */}
        <div className="flex-1 min-w-0 flex items-center justify-end sm:justify-stretch px-1 sm:px-3 md:px-4 lg:px-5">
          <div className="flex items-center gap-1.5 sm:flex-1 sm:min-w-0 sm:gap-0">
            <GlobalSearchBar
              initialValue={searchQuery}
              placeholder="Search products, brands, creators..."
              onSubmit={(val) => {
                setSearchQuery(val);
                navigate(`/search?q=${encodeURIComponent(val)}`);
              }}
              variant="hero"
              layout="navbar-fluid"
              enableSuggestions
              className="min-w-0 sm:w-full choosify-navbar-hero-search relative z-[55]"
              submitLabel="Search"
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

        {/* ACTIONS & MESSAGES */}
        <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0 nav-actions">
          
          {/* CART + ACCOUNT ACTIONS (messages only when logged in) */}
          <div className="hidden sm:flex items-center gap-2 xl:gap-4 border-r border-[#ffffff1a] pr-2 xl:pr-5 shrink-0">
            <button 
              type="button"
              onClick={openCartPreview}
              className="relative text-white/60 hover:text-white transition-colors"
              aria-label="Shopping cart"
              aria-expanded={isCartOpen}
              title="Shopping Cart"
            >
              <ShoppingBag size={20} className="transition-colors" />
              {activeCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-[8px] font-black bg-orange-primary rounded-full flex items-center justify-center border-2 border-[#0A0A1F] animate-bounce">
                  {activeCartCount}
                </span>
              )}
            </button>
            {isLoggedIn && (
              <button 
                type="button"
                onClick={() => navigate('/messages')}
                className="relative text-white/60 hover:text-white transition-colors"
                title="Secure Support Chats"
              >
                <div className="relative">
                  <MessageSquare size={19} className={cn("text-orange-primary", unreadMsgCount > 0 && "animate-pulse")} />
                  {unreadMsgCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-primary text-white text-[8px] font-black rounded-full flex items-center justify-center leading-none">
                      {unreadMsgCount > 9 ? '9+' : unreadMsgCount}
                    </span>
                  )}
                </div>
              </button>
            )}
          </div>

          {/* POST YOUR DEAL BUTTON FOR VISITORS */}
          {!isLoggedIn && (
            <Link to="/post-offer" className="hidden xl:block shrink-0">
              <button className="h-9 px-4 bg-white/5 border border-white/10 text-white text-[9px] uppercase font-black rounded-full tracking-widest hover:bg-white/10 transition-all flex items-center gap-1.5 italic whitespace-nowrap">
                Post Deal <ChevronRight size={12} className="text-orange-primary" />
              </button>
            </Link>
          )}
          
          {isLoggedIn ? (
            <div className="relative profile-avatar" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => {
                  if (window.matchMedia('(min-width: 1024px)').matches) {
                    setIsUserMenuOpen(!isUserMenuOpen);
                    return;
                  }
                  openMobileProfileMenu();
                }}
                className="flex items-center gap-3 group cursor-pointer animate-in fade-in bg-transparent border-0 p-0"
                aria-label="Open account menu"
              >
                <div className="w-10 h-10 rounded-full border-2 border-orange-primary overflow-hidden group-hover:scale-105 transition-all cursor-pointer nav-avatar hover:opacity-80 flex items-center justify-center bg-white/5 shrink-0">
                  <img 
                    src={currentUser?.avatar || defaultAvatar} 
                    className="w-full h-full object-cover" 
                    alt="Profile" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block italic text-white/70 group-hover:text-white transition-colors">
                  Hi, {currentUser?.name?.split(' ')[0] || 'You'}
                </span>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1] hidden lg:block" onClick={() => setIsUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-4 choosify-dark-gradient border border-white/10 rounded-2xl shadow-2xl p-4 z-50 overflow-hidden min-w-[240px] hidden lg:block"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/10 blur-2xl rounded-full" />
                      
                      <div className="flex items-center gap-3 p-3 mb-4 bg-white/5 rounded-xl border border-white/5">
                        <img 
                          src={currentUser?.avatar || defaultAvatar} 
                          className="w-10 h-10 rounded-full object-cover border border-orange-primary/30" 
                          alt="" 
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-white italic uppercase truncate">{currentUser?.name || "Farhan Bin Rafiq"}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">Corporate Sourcing Desk</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {dashboardMiniMenu.map((item, idx) => (
                          <React.Fragment key={idx}>
                            {item.dividerAbove && (
                              <div className="my-1 border-t border-white/5" />
                            )}
                            <button
                              onClick={() => navigateProfileItem(item)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                            >
                              <div className="relative flex items-center justify-center">
                                <item.icon size={16} className="group-hover:text-orange-primary transition-colors" />
                                {item.icon === MessageSquare && unreadMsgCount > 0 && (
                                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-primary text-white text-[7px] font-black rounded-full flex items-center justify-center leading-none">
                                    {unreadMsgCount > 9 ? '9+' : unreadMsgCount}
                                  </span>
                                )}
                              </div>
                              <span className="italic">{item.label}</span>
                            </button>
                          </React.Fragment>
                        ))}
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <button 
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setIsLoggedIn(false);
                              toast.success('Successfully logged out.');
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-red-500/5 rounded-xl transition-all group"
                          >
                            <LogIn size={16} className="rotate-180" />
                            <span className="italic">Sign Out</span>
                          </button>
                        </div>
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

        {/* Row 2 — Category strip (desktop only) */}
        <div className="choosify-navbar-categories choosify-dark-gradient border-b border-white/5 text-white hidden lg:block">
          <div
            ref={categoryStripRef}
            {...categoryStripProps}
            className="choosify-touch-scroll-row flex items-center gap-0 overflow-x-auto no-scrollbar px-2 sm:px-4 lg:px-6 xl:px-8 max-w-[100vw]"
          >
            {renderNavLinks((path) => {
              const isActive =
                path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(path);
              return cn(
                'inline-flex shrink-0 px-3 sm:px-4 py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide transition-colors whitespace-nowrap border-r border-white/5 last:border-r-0',
                isActive
                  ? 'text-[#FF6B00] bg-white/5'
                  : 'text-gray-300 hover:text-white hover:bg-white/5',
              );
            })}
          </div>
        </div>
      </header>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        anchorEl={cartAnchorEl}
      />

      {/* MOBILE NAV — left slide (sections / categories) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] h-full z-[101] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r choosify-dark-gradient border-white/5 text-white lg:hidden"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-sm font-black uppercase tracking-widest text-[#FF5B00] italic">Browse</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 rounded-full border border-white/10 transition-all"
                    aria-label="Close menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Sections</span>
                  {navItems ? (
                    navItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={getMobileLinkClass(item.path)}
                      >
                        <span className="italic">{item.label}</span>
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
                        <span className="italic">{item.labelWide || item.label}</span>
                      </Link>
                    ))
                  )}
                </div>

                <div className="h-px bg-white/10" />

                <Link
                  to="/post-offer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all justify-center"
                >
                  <span className="italic">Post Your Deal</span>
                  <ChevronRight size={14} className="text-orange-primary" />
                </Link>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                {!isLoggedIn && (
                  <>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest text-center">
                      Join Choosify Bangladesh
                    </p>
                    <button
                      type="button"
                      onClick={() => goToLogin('sign-in')}
                      className="w-full py-3.5 bg-orange-primary hover:bg-[#CF4400] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors cursor-pointer border-0 flex items-center justify-center gap-2"
                    >
                      <LogIn size={14} />
                      <span className="italic">Sign In / Register</span>
                    </button>
                  </>
                )}
                <div className="text-center pt-2">
                  <span className="text-[8px] font-mono font-bold text-gray-600 uppercase tracking-widest">
                    Choosify Bangladesh • v1.0
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE PROFILE — right slide (account) */}
      <AnimatePresence>
        {isMobileProfileOpen && isLoggedIn && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileProfileOpen(false)}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] h-full z-[101] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l choosify-dark-gradient border-white/5 text-white lg:hidden"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-sm font-black uppercase tracking-widest text-[#FF5B00] italic">My Account</span>
                  <button
                    type="button"
                    onClick={() => setIsMobileProfileOpen(false)}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 rounded-full border border-white/10 transition-all"
                    aria-label="Close account menu"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <img
                    src={currentUser?.avatar || defaultAvatar}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-primary shrink-0"
                    alt={currentUser?.name || 'Profile'}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white italic uppercase leading-tight truncate">
                      {currentUser?.name || 'My Account'}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate mt-0.5">
                      Choosify Member
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {profilePrimaryLinks.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => navigateProfileItem(item)}
                      className="flex items-center gap-3 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/5 border border-white/5 transition-all cursor-pointer w-full text-left"
                    >
                      <item.icon size={14} className="text-orange-primary shrink-0" />
                      <span className="italic flex-1">{item.label}</span>
                      {item.icon === MessageSquare && unreadMsgCount > 0 && (
                        <span className="w-4 h-4 bg-orange-primary text-white text-[8px] font-black rounded-full flex items-center justify-center leading-none">
                          {unreadMsgCount > 9 ? '9+' : unreadMsgCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex flex-col gap-2">
                  {profileSecondaryLinks.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => navigateProfileItem(item)}
                      className="flex items-center gap-3 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/5 border border-white/5 transition-all cursor-pointer w-full text-left"
                    >
                      <div className="relative flex items-center justify-center shrink-0">
                        <item.icon size={14} className="text-orange-primary" />
                      </div>
                      <span className="italic flex-1">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedIn(false);
                    setIsMobileProfileOpen(false);
                    toast.success('Successfully logged out.');
                    navigate('/');
                  }}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-red-500/10 transition-all cursor-pointer w-full text-left"
                >
                  <LogIn size={14} className="rotate-180" />
                  <span className="italic">Sign Out</span>
                </button>
                <div className="text-center pt-2">
                  <span className="text-[8px] font-mono font-bold text-gray-600 uppercase tracking-widest">
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
