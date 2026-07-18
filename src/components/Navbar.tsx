import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingBag, User, ChevronRight, Bell, Bookmark, LogIn, 
  LayoutDashboard, Heart, MessageSquare, Settings, Package, ShieldCheck, 
  Menu, X, Inbox, ShoppingCart
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartDrawer } from './CartDrawer';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';
import { ChoosifyWordmarkLogo } from './ChoosifyWordmarkLogo';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { retailCart, isLoggedIn, setIsLoggedIn, currentUser, siteConfig, featureFlags } = useGlobalState();
  const { threads, savedProducts } = useDashboard();

  const unreadMsgCount = isLoggedIn ? threads.filter(t => t.unread).length : 0;
  const wishlistCount = Array.isArray(savedProducts) ? savedProducts.length : 0;

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
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

  const activeCartCount = retailCart.length;

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

  const dashboardMiniMenu = [
    { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', path: '/profile/orders', icon: Package },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Saved Products', path: '/dashboard', tab: 'saved-products', icon: Heart },
    { label: 'Notifications', path: '/dashboard', tab: 'notifications', icon: Bell },
    { label: 'Settings', path: '/dashboard', tab: 'settings', icon: Settings },
  ];

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
      <header className="w-full min-w-0 z-50 sticky top-0 shadow-2xl border-b border-white/[0.07]" id="main-navbar">
        {/* Row 1 — Logo, prominent search, account actions (Choosify 3.0) */}
        <nav className="choosify-chrome-header text-white h-14 sm:h-16 flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 xl:px-8 border-b border-white/5 lg:border-b-0">
        
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

        {/* ACTIONS & MESSAGES */}
        <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0 nav-actions">
          
          {/* ACTIONS — Header.dc.html: Wishlist → Cart → Messages */}
          <div className="hidden sm:flex items-center gap-3 xl:gap-4 border-r border-[#ffffff1a] pr-2 xl:pr-5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (isLoggedIn) navigate('/dashboard', { state: { activeTab: 'saved-products' } });
                else navigate('/login');
              }}
              className="relative text-white/85 hover:text-white transition-colors"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart size={19} className="transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 text-white text-[9px] font-bold bg-[#FF5B00] rounded-lg flex items-center justify-center leading-none">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </button>
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
            <button 
              type="button"
              onClick={() => (isLoggedIn ? navigate('/messages') : navigate('/login'))}
              className="relative text-white/85 hover:text-white transition-colors"
              title="Messages"
              aria-label="Messages"
            >
              <MessageSquare size={19} />
              {unreadMsgCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 text-white text-[9px] font-bold bg-[#FF5B00] rounded-lg flex items-center justify-center leading-none">
                  {unreadMsgCount > 99 ? '99+' : unreadMsgCount}
                </span>
              )}
            </button>
          </div>
          
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
                className="flex items-center gap-1.5 group cursor-pointer animate-in fade-in bg-transparent border-0 p-0 whitespace-nowrap"
                aria-label="Open account menu"
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
                    <div className="fixed inset-0 z-[-1] hidden lg:block" onClick={() => setIsUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-[38px] bg-white rounded-[10px] shadow-[0_12px_32px_rgba(0,0,0,0.22)] w-[200px] overflow-hidden z-50 hidden lg:block"
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

            {/* Mobile Hamburger Menu */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Row 2 — Primary nav (Choosify 3.0) */}
        <div className="choosify-navbar-categories choosify-chrome-header border-t border-white/[0.06] text-white hidden lg:block">
          <div
            ref={categoryStripRef}
            {...categoryStripProps}
            className="choosify-touch-scroll-row flex items-center gap-5 xl:gap-[22px] overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-6 xl:px-8 h-[38px] max-w-[100vw]"
          >
            {renderNavLinks(getLinkClass)}
          </div>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* MOBILE / TABLET SLIDE-OUT HAMBURGER MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
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
                  <span className="text-sm font-bold tracking-tight text-[#FF5B00]">Browse</span>
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
            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] h-full z-[101] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l bg-[#000435] border-white/5 text-white"
            >
              <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-sm font-bold tracking-tight text-[#FF5B00]">My Account</span>
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
                    <p className="text-sm font-bold text-white tracking-tight leading-tight truncate">
                      {currentUser?.name || 'My Account'}
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate mt-0.5">
                      Choosify Member
                    </p>
                  </div>
                </div>

                {/* Quick links stream */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Explore Sections</span>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/')}>
                    <span className="italic">HOME</span>
                  </Link>
                  <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/products')}>
                    <span className="italic">PRODUCTS</span>
                  </Link>
                  <Link to="/brands" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/brands')}>
                    <span className="italic">BRANDS</span>
                  </Link>
                  <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/deals')}>
                    <span className="italic">DEALS</span>
                  </Link>
                  <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/categories')}>
                    <span className="italic">CATEGORIES</span>
                  </Link>
                  <Link to="/creators" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/creators')}>
                    <span className="italic">CREATORS</span>
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    {/* User info row */}
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                      <img
                        src={currentUser?.avatar || "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png"}
                        className="w-10 h-10 rounded-full object-cover border border-[#FF5B00]/30 shrink-0"
                        alt="Profile"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-white italic uppercase truncate">
                          {currentUser?.name || 'My Account'}
                        </p>
                        <p className="text-[9px] font-bold text-[#FF5B00] uppercase tracking-widest truncate">
                          Premium Member
                        </p>
                      </div>
                    </div>
                    {/* Quick links */}
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider text-white/80 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
                    >
                      <User size={14} className="text-[#FF5B00]" />
                      <span className="italic">My Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsMobileMenuOpen(false);
                        toast.success('Successfully logged out.');
                        navigate('/');
                      }}
                      className="flex items-center gap-3 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-red-500/10 transition-all cursor-pointer w-full text-left"
                    >
                      <LogIn size={14} className="rotate-180" />
                      <span className="italic">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full py-3 bg-transparent border border-white/20 hover:bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <LogIn size={14} />
                      <span className="italic">Sign In</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/signup');
                      }}
                      className="w-full py-3.5 bg-[#FF5B00] hover:bg-[#EB4501] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors cursor-pointer border-0 flex items-center justify-center gap-2"
                    >
                      <LogIn size={14} />
                      <span className="italic">Register / Sign Up</span>
                    </button>
                  </div>
                )}
                <div className="text-center pt-2">
                  <span className="text-[8px] font-mono font-bold text-gray-600 uppercase tracking-widest">
                    Choosify Bangladesh • v2.2
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
