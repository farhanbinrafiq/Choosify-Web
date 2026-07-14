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

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, setMode, retailCart, wholesaleCart, isLoggedIn, setIsLoggedIn, currentUser } = useGlobalState();
  const { threads, notifications = [], setNotifications } = useDashboard();

  const unreadMsgCount = threads.filter(t => t.unread).length;
  const unreadNotifCount = notifications.filter((n: any) => !n.read).length;

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

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'CATEGORIES', path: '/categories' },
    { label: 'PRODUCTS', path: '/products' },
    { label: 'BRANDS', path: '/brands' },
    { label: 'DISCOVER', path: '/discover' },
    { label: 'DEALS', path: '/deals' },
    { label: 'CREATORS', path: '/creators' },
    { label: 'COMPARE', path: '/compare' },
  ];

  const getLinkClass = (path: string) => {
    const isActive = path === '/' 
      ? location.pathname === '/' 
      : location.pathname.startsWith(path);
    return cn(
      "text-[10px] font-black uppercase tracking-widest transition-all h-11 flex items-center relative whitespace-nowrap border-b-2",
      isActive 
        ? "text-[#FF5B00] border-[#FF5B00]" 
        : "text-gray-300 hover:text-white border-transparent hover:border-white/10"
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
      <header className="w-full bg-[#000435] text-white z-50 sticky top-0 border-b border-white/5 shadow-2xl" id="main-navbar">
        {/* ROW 1: Logo, Search Bar, Icons */}
        <div className="w-full h-16 sm:h-20 flex items-center justify-between px-4 lg:px-8 xl:px-12 max-w-[1440px] mx-auto gap-4 sm:gap-6">
          
          {/* Logo Sector */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center group" aria-label="Choosify Home">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 3311.76 744.41"
                className="h-8 sm:h-10 w-auto object-contain group-hover:scale-102 transition-transform duration-300"
              >
                <path className="fill-white" d="M0,391.36c0-127.52,86.85-224.74,219.95-224.74,113.18,0,183.35,64.55,198.44,156.98h-121.1c-8.75-39.05-34.26-63.76-75.68-63.76-63,0-94.85,51.8-94.85,131.52s31.84,129.89,94.85,129.89c46.18,0,74.1-27.88,79.68-76.51h120.35c-4,96.43-80.51,171.36-198.44,171.36C87.68,616.1,0,518.09,0,391.36Z"/>
                <path className="fill-white" d="M605.22,602.56h-125.18V9.6h125.18v163.4c0,3.96,0,38.26-.83,66.14h2.41c25.5-45.42,68.51-72.51,127.52-72.51,93.19,0,147.44,62.14,147.44,156.98v278.95h-124.35v-255.04c0-46.22-24.67-77.3-70.93-77.3-48.59,0-81.26,39.05-81.26,93.26v239.08Z"/>
                <path className="fill-white" d="M941.82,391.36c0-127.52,89.26-224.74,224.78-224.74s223.12,97.22,223.12,224.74-88.43,224.74-223.12,224.74-224.78-98.02-224.78-224.74ZM1263.03,391.36c0-80.51-35.09-135.48-97.26-135.48s-97.19,54.97-97.19,135.48,33.43,133.89,97.19,133.89,97.26-54.21,97.26-133.89Z"/>
                <path className="fill-white" d="M1433.1,391.36c0-127.52,89.26-224.74,224.78-224.74s223.12,97.22,223.12,224.74-88.43,224.74-223.12,224.74-224.78-98.02-224.78-224.74ZM1754.31,391.36c0-80.51-35.09-135.48-97.26-135.48s-97.19,54.97-97.19,135.48,33.43,133.89,97.19,133.89,97.26-54.21,97.26-133.89Z"/>
                <path className="fill-white" d="M1917.14,471.84h117.94c7.17,39.88,37.5,62.17,86.09,62.17,44.67,0,70.17-18.34,70.17-48.59,0-38.26-50.25-43.05-109.18-54.21-75.76-14.34-152.27-33.46-152.27-132.31,0-86.85,78.93-132.27,178.52-132.27,117.94,0,176.94,51.01,188.11,125.1h-116.35c-8-30.26-31.92-45.42-71.76-45.42s-62.93,15.96-62.93,43.05c0,31.88,46.18,36.67,104.35,47.01,75.76,13.54,161.85,33.46,161.85,140.27,0,91.68-81.34,139.48-191.28,139.48-122.76,0-196.86-58.97-203.27-144.27Z"/>
                <rect className="fill-white" x="2374.09" y="178.54" width="125.18" height="424.02"/>
                <path className="fill-white" d="M2745.71,259.85v342.71h-125.18v-342.71h-63.76v-81.3h63.76v-35.84c0-45.42,11.17-77.3,35.92-99.64,27.84-24.71,71.68-34.26,125.86-33.46,16.75,0,34.33.79,51.84,3.17v89.26c-62.93-2.38-88.43,1.62-88.43,49.42v27.09h88.43v81.3h-88.43Z"/>
                <path className="fill-white" d="M2921.97,742.83v-98.02h6.41c1.58.79,37.43.79,40.67.79,39.01,0,58.18-14.34,60.51-43.05,0-14.34-7.17-47.01-22.26-85.26l-131.52-338.75h131.52l54.18,162.6c19.09,57.38,35.09,147.44,35.09,147.44h1.58s19.09-90.85,37.43-147.44l51.84-162.6h124.35l-151.44,434.39c-34.33,98.02-73.34,131.48-154.61,131.48-4,0-81.34-.79-83.75-1.58Z"/>
                <path className="fill-[#FF5B00]" d="M2437.08,135.56c37.42,0,67.74-30.36,67.74-67.78,0-37.42-30.32-67.78-67.74-67.78s-67.78,30.36-67.78,67.78c0,6.5.92,12.75,2.61,18.69,4.25-2.61,9.3-4.13,14.68-4.13,15.6,0,28.23,12.63,28.23,28.19,0,7.06-2.61,13.52-6.86,18.45,8.82,4.21,18.69,6.58,29.12,6.58Z"/>
              </svg>
            </Link>
          </div>

          {/* Centered Search Bar: occupies maximum available horizontal space */}
          <div className="flex-1 max-w-4xl mx-2 hidden md:block">
            <form 
              onSubmit={handleSearch} 
              className="relative w-full bg-white h-11 flex items-center rounded-full pl-5 pr-1.5 shadow-md border border-white/5"
            >
              <div className="text-gray-400 shrink-0 mr-3">
                <Search className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Discover products, brands, deals, creators, buying guides..." 
                className="w-full bg-transparent outline-none text-[#000435] text-xs font-semibold placeholder-gray-400 focus:outline-none focus:ring-0 border-none" 
              />
              <button 
                type="submit"
                className="px-6 h-8 rounded-full bg-[#FF5B00] hover:bg-[#FF5B00] text-white text-[10px] font-black tracking-widest uppercase flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                SEARCH
              </button>
            </form>
          </div>

          {/* Action and User sector */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Pocket Icon */}
            <button 
              type="button" 
              onClick={() => navigate('/dashboard', { state: { activeTab: 'saved-products' } })}
              className="text-gray-400 hover:text-white transition-colors"
              title="Saved Items"
            >
              <Inbox size={21} />
            </button>

            {/* Shopping Cart with Badge */}
            <button 
              type="button"
              onClick={() => navigate('/cart/retail')}
              className="relative text-gray-400 hover:text-white transition-colors"
              title="Cart"
            >
              <ShoppingCart size={21} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile avatar + text info */}
            {isLoggedIn ? (
              <div className="relative" ref={profileMenuRef}>
                <div 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full border-2 border-[#FF5B00] overflow-hidden transition-all duration-300">
                    <img 
                      src={currentUser?.avatar || "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png"} 
                      className="w-full h-full object-cover" 
                      alt="Profile" 
                    />
                  </div>
                  <div className="hidden lg:flex flex-col text-left leading-none">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">
                      Hi, {currentUser?.name?.split(' ')[0] || 'Farhan'}
                    </span>
                    <span className="text-[8px] font-bold text-[#FF5B00] uppercase tracking-widest mt-1">
                      Premium Member
                    </span>
                  </div>
                  <ChevronRight size={12} className="text-gray-400 rotate-90 shrink-0" />
                </div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setIsUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-3 w-56 bg-[#000435] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 overflow-hidden"
                      >
                        <div className="flex items-center gap-2.5 p-2 mb-2 bg-white/5 rounded-xl border border-white/5">
                          <img 
                            src={currentUser?.avatar || "https://res.cloudinary.com/djdyqr8yd/image/upload/v1781880900/FBR_n3eycm.png"} 
                            className="w-8 h-8 rounded-full object-cover border border-[#FF5B00]/30" 
                            alt="" 
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-white uppercase truncate">{currentUser?.name || "Farhan Bin Rafiq"}</p>
                            <p className="text-[8px] font-bold text-[#FF5B00] uppercase tracking-wider truncate">Premium Account</p>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          {dashboardMiniMenu.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                if (item.tab === 'notifications') {
                                  navigate('/dashboard?tab=notifications');
                                } else if (item.tab) {
                                  navigate(item.path, { state: { activeTab: item.tab } });
                                } else {
                                  navigate(item.path);
                                }
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-[9px] font-black text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all text-left uppercase tracking-widest"
                            >
                              <item.icon size={14} className="text-[#FF5B00]" />
                              <span>{item.label}</span>
                            </button>
                          ))}
                          <div className="h-px bg-white/5 my-1.5" />
                          <button 
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              setIsLoggedIn(false);
                              toast.success('Successfully logged out.');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-[9px] font-black text-red-400 hover:bg-red-500/5 rounded-lg transition-all text-left uppercase tracking-widest"
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
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => navigate('/login')}
                  className="h-10 px-4 text-gray-300 hover:text-white text-[10px] uppercase font-black tracking-widest transition-all italic"
                >
                  SIGN IN
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="h-10 px-5 text-white text-[10px] uppercase font-black rounded-full tracking-widest transition-all bg-[#FF5B00] hover:bg-orange-600 italic"
                >
                  SIGN UP
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

        {/* ROW 2: Bottom Navigation Row (Hidden on Mobile) */}
        <div className="w-full bg-[#000435] border-t border-white/5 hidden md:block">
          <div className="max-w-[1440px] mx-auto px-6 h-11 flex items-center justify-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                to={link.path} 
                className={getLinkClass(link.path)}
              >
                {link.label}
              </Link>
            ))}
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
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
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
                  <span className="text-sm font-black uppercase tracking-widest text-[#FF5B00] italic">Sourcing Menu</span>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-full transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Sourcing/Search on Mobile */}
                <div className="w-full">
                  <form onSubmit={handleSearch} className="relative w-full bg-white h-10 flex items-center rounded-full pl-4 pr-1 border border-gray-200">
                    <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Discover..." 
                      className="w-full bg-transparent outline-none text-[#000435] text-xs font-semibold placeholder-gray-400"
                    />
                  </form>
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
