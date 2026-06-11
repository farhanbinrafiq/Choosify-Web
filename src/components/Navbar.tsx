import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ShoppingBag, User, PlusCircle, ChevronRight, Bell, Bookmark, LogIn, 
  LayoutDashboard, Heart, MessageSquare, Settings, Briefcase, Package, ShieldCheck, 
  FileCheck2, Building2, HelpCircle, ArrowLeftRight, CheckSquare, Menu, X, Book
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SignInModal } from './SignInModal';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalState } from '../context/GlobalStateContext';
import { CartDrawer } from './CartDrawer';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, setMode, retailCart, wholesaleCart, isLoggedIn, setIsLoggedIn } = useGlobalState();

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
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const dashboardMiniMenu = [
    { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', path: '/profile/orders', icon: Package },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Saved Products', path: '/dashboard', tab: 'saved-products', icon: Heart },
    { label: 'Notifications', path: '/dashboard', tab: 'notifications', icon: Bell },
    { label: 'My Cashbook', path: '/cashbook', icon: Book, dividerAbove: true },
    { label: 'Settings', path: '/dashboard', tab: 'settings', icon: Settings },
  ];

  const getLinkClass = (path: string) => {
    const isActive = path === '/' 
      ? location.pathname === '/' 
      : location.pathname.startsWith(path);
    return cn(
      "transition-colors hover:text-orange-primary",
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
      <nav className="w-full text-white h-20 flex items-center px-4 md:px-8 z-50 sticky top-0 border-b shadow-2xl backdrop-blur-md transition-all duration-300 bg-[#0A0A1F]/90 border-white/5" id="main-navbar">
        
        {/* LOGO SECTOR */}
        <div className="flex items-center gap-3 mr-4 md:mr-8 scale-110">
          <Link to="/" className="flex flex-col items-center group" aria-label="Choosify Home">
            <svg 
              id="Layer_1" 
              data-name="Layer 1" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 2547.19 1388.36"
              className="h-9 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
            >
              <defs>
                <style>
                  {`.cls-logo-white { fill: #fff; } .cls-logo-red { fill: #ef3c23; }`}
                </style>
              </defs>
              <g>
                <path className="cls-logo-red" d="M1954.9,489.26c0-76.43-62.01-138.36-138.44-138.36s-138.44,61.93-138.44,138.36,62.01,138.44,138.44,138.44c13.27,0,26.05-1.89,38.17-5.33-5.32-8.68-8.44-19-8.44-29.98,0-31.86,25.81-57.67,57.59-57.67,14.42,0,27.61,5.33,37.68,14.01,8.6-18.02,13.43-38.17,13.43-59.47Z"/>
                <path className="cls-logo-red" d="M1042.05,489.26c0-76.43-62.01-138.36-138.44-138.36s-138.44,61.93-138.44,138.36c0,76.43,62.01,138.44,138.44,138.44,13.27,0,26.05-1.89,38.17-5.33-5.32-8.68-8.44-19-8.44-29.98,0-31.86,25.81-57.67,57.59-57.67,14.42,0,27.61,5.33,37.68,14.01,8.6-18.02,13.43-38.17,13.43-59.47Z"/>
                <path className="cls-logo-red" d="M875.06,815.83c-224.92,0-407.91-182.99-407.91-407.91S650.13,0,875.06,0s407.91,182.99,407.91,407.91-182.99,407.91-407.91,407.91ZM875.06,93.21c-173.53,0-314.71,141.18-314.71,314.71s141.18,314.71,314.71,314.71,314.71-141.18,314.71-314.71-141.18-314.71-314.71-314.71Z"/>
                <path className="cls-logo-red" d="M1724.92,815.83c-224.92,0-407.91-182.99-407.91-407.91S1499.99,0,1724.92,0s407.91,182.99,407.91,407.91-182.99,407.91-407.91,407.91ZM1724.92,93.21c-173.53,0-314.71,141.18-314.71,314.71s141.18,314.71,314.71,314.71,314.71-141.18,314.71-314.71-141.18-314.71-314.71-314.71Z"/>
              </g>
              <g>
                <path className="cls-logo-white" d="M0,1116.82c0-98.08,66.8-172.86,169.17-172.86,87.05,0,141.02,49.65,152.63,120.74h-93.15c-6.73-30.03-26.35-49.04-58.21-49.04-48.46,0-72.95,39.84-72.95,101.15s24.49,99.91,72.95,99.91c35.52,0,56.99-21.44,61.28-58.85h92.56c-3.08,74.17-61.92,131.8-152.63,131.8-104.23,0-171.67-75.39-171.67-172.86Z"/>
                <path className="cls-logo-white" d="M465.49,1279.26h-96.28v-456.06h96.28v125.67c0,3.05,0,29.42-.64,50.87h1.86c19.62-34.94,52.7-55.77,98.08-55.77,71.67,0,113.4,47.79,113.4,120.74v214.55h-95.64v-196.16c0-35.55-18.98-59.46-54.55-59.46-37.37,0-62.5,30.03-62.5,71.73v183.88Z"/>
                <path className="cls-logo-white" d="M724.38,1116.82c0-98.08,68.65-172.86,172.88-172.86s171.61,74.78,171.61,172.86-68.02,172.86-171.61,172.86-172.88-75.39-172.88-172.86ZM971.44,1116.82c0-61.92-26.99-104.2-74.81-104.2s-74.75,42.28-74.75,104.2,25.71,102.98,74.75,102.98,74.81-41.7,74.81-102.98Z"/>
                <path className="cls-logo-white" d="M1102.25,1116.82c0-98.08,68.65-172.86,172.88-172.86s171.61,74.78,171.61,172.86-68.02,172.86-171.61,172.86-172.88-75.39-172.88-172.86ZM1349.3,1116.82c0-61.92-26.99-104.2-74.81-104.2s-74.75,42.28-74.75,104.2,25.71,102.98,74.75,102.98,74.81-41.7,74.81-102.98Z"/>
                <path className="cls-logo-white" d="M1474.54,1178.72h90.71c5.51,30.67,28.84,47.82,66.22,47.82,34.36,0,53.97-14.1,53.97-37.37,0-29.42-38.65-33.11-83.98-41.7-58.27-11.03-117.11-25.74-117.11-101.76,0-66.8,60.7-101.73,137.31-101.73,90.71,0,136.09,39.23,144.68,96.22h-89.49c-6.15-23.27-24.55-34.94-55.19-34.94s-48.4,12.27-48.4,33.11c0,24.52,35.52,28.2,80.26,36.16,58.27,10.42,124.48,25.74,124.48,107.89,0,70.51-62.56,107.28-147.12,107.28-94.42,0-151.41-45.35-156.34-110.96Z"/>
                <rect className="cls-logo-white" x="1825.99" y="953.14" width="96.28" height="326.12"/>
                <path className="cls-logo-white" d="M2111.81,1015.67v263.59h-96.28v-263.59h-49.04v-62.53h49.04v-27.57c0-34.94,8.59-59.46,27.62-76.63,21.41-19.01,55.13-26.35,96.8-25.74,12.88,0,26.41.61,39.87,2.44v68.65c-48.4-1.83-68.02,1.25-68.02,38.01v20.83h68.02v62.53h-68.02Z"/>
                <path className="cls-logo-white" d="M2247.38,1387.15v-75.39h4.93c1.22.61,28.79.61,31.28.61,30,0,44.74-11.03,46.54-33.11,0-11.03-5.51-36.16-17.12-65.58l-101.15-260.55h101.15l41.67,125.06c14.68,44.14,26.99,113.4,26.99,113.4h1.22s14.68-69.87,28.79-113.4l39.87-125.06h95.64l-116.47,334.1c-26.41,75.39-56.41,101.12-118.91,101.12-3.08,0-62.56-.61-64.42-1.22Z"/>
                <path className="cls-logo-red" d="M1874.44,920.07c28.78,0,52.1-23.35,52.1-52.13,0-28.78-23.32-52.13-52.1-52.13s-52.13,23.35-52.13,52.13c0,5,.71,9.81,2.01,14.37,3.27-2,7.16-3.18,11.29-3.18,12,0,21.72,9.72,21.72,21.69,0,5.43-2.01,10.4-5.27,14.19,6.79,3.24,14.37,5.06,22.39,5.06Z"/>
              </g>
            </svg>
          </Link>
        </div>

        {/* Retail Mode general navigation links */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest mr-auto text-gray-300 border-r border-white/5 pr-6">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/categories" className={getLinkClass('/categories')}>Categories</Link>
          <Link to="/products" className={getLinkClass('/products')}>Products</Link>
          <Link to="/brands" className={getLinkClass('/brands')}>Brands</Link>
          <Link to="/guides" className={getLinkClass('/guides')}>Recommendations</Link>
          <Link to="/compare" className={getLinkClass('/compare')}>Compare</Link>
          <Link to="/deals" className={getLinkClass('/deals')}>Deals</Link>
          <Link to="/viral-products" className={getLinkClass('/viral-products')}>Viral Products</Link>
        </div>

        {/* SEARCH BAR */}
        <div className="flex-1 max-w-xs mx-4 hidden xl:block">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Products, Brands, Reviews..."
              className="w-full h-10 pl-11 pr-12 rounded-full bg-white/5 text-white placeholder:text-white/30 text-[10px] focus:outline-none focus:bg-white/10 transition-all border border-white/10 italic font-bold"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-orange-primary transition-colors italic">Search</button>
          </form>
        </div>

        {/* ACTIONS & MESSAGES */}
        <div className="flex items-center gap-5 ml-auto nav-actions">
          
          {/* CART SECTIONS DEPENDENT ON STATE */}
          <div className="hidden sm:flex items-center gap-4 border-r border-[#ffffff1a] pr-5">
            <button 
              type="button"
              onClick={() => {
                navigate('/cart/retail');
              }}
              className="relative text-white/60 hover:text-white transition-colors mr-1"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} className="transition-colors" />
              {activeCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-white text-[8px] font-black bg-orange-primary rounded-full flex items-center justify-center border-2 border-[#0A0A1F] animate-bounce">
                  {activeCartCount}
                </span>
              )}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/dashboard', { state: { activeTab: 'saved-products' } })}
              className="relative text-white/60 hover:text-white transition-colors"
              title="Saved Vault"
            >
              <Bookmark size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-primary/30 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0A1F]">3</span>
            </button>
            <button 
              type="button"
              onClick={() => navigate('/messages')}
              className="relative text-white/60 hover:text-white transition-colors"
              title="Secure Support Chats"
            >
              <MessageSquare size={19} className="text-orange-primary animate-pulse" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-black text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0A1F]">2</span>
            </button>
          </div>

          {/* POST YOUR DEAL BUTTON FOR VISITORS */}
          {!isLoggedIn && (
            <Link to="/post-offer" className="hidden md:block">
              <button className="h-10 px-6 bg-white/5 border border-white/10 text-white text-[10px] uppercase font-black rounded-full tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 italic">
                Post Deal <ChevronRight size={14} className="text-orange-primary" />
              </button>
            </Link>
          )}
          
          {isLoggedIn ? (
            <div className="relative profile-avatar" ref={profileMenuRef}>
              <div 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                className="flex items-center gap-3 group cursor-pointer animate-in fade-in"
              >
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isLoggedIn) {
                      navigate('/dashboard');
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="w-10 h-10 rounded-full border-2 border-orange-primary overflow-hidden group-hover:scale-105 transition-all cursor-pointer nav-avatar hover:opacity-80 flex items-center justify-center bg-white/5"
                  role="button"
                  aria-label="Go to my dashboard"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') { if (isLoggedIn) navigate('/dashboard'); else navigate('/login'); } }}
                >
                  <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" alt="Profile" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block italic text-white/70 group-hover:text-white transition-colors">Hi, Farhan</span>
              </div>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsUserMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-4 w-6 coordinate bg-[#050514] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 overflow-hidden min-w-[240px]"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/10 blur-2xl rounded-full" />
                      
                      <div className="flex items-center gap-3 p-3 mb-4 bg-white/5 rounded-xl border border-white/5">
                        <img src="https://i.pravatar.cc/150?u=me" className="w-10 h-10 rounded-full object-cover border border-orange-primary/30" alt="" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-white italic uppercase truncate">Farhan Bin Rafiq</p>
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
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                if (item.tab) {
                                  navigate(item.path, { state: { activeTab: item.tab } });
                                } else {
                                  navigate(item.path);
                                }
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                            >
                              <item.icon size={16} className="group-hover:text-orange-primary transition-colors" />
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
            <div className="flex items-center gap-3">
              <div 
                onClick={() => navigate('/login')}
                className="w-10 h-10 rounded-full border border-white/10 overflow-hidden cursor-pointer nav-avatar hover:opacity-100 flex items-center justify-center bg-white/5 profile-icon transition-opacity opacity-75 md:flex"
                role="button"
                aria-label="Log in to my account"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate('/login'); }}
              >
                <User size={18} className="text-white/60" />
              </div>
              <button 
                onClick={() => setIsSignInOpen(true)}
                className="h-10 px-6 text-white text-[10px] uppercase font-black rounded-full tracking-widest transition-all flex items-center gap-2 italic bg-[#FF6B00] hover:bg-orange-deep"
              >
                Sign Up <LogIn size={14} />
              </button>
            </div>
          )}

          {/* MODERN MOBILE HAMBURGER BUTTON (lg:hidden, far right) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all relative z-50 shrink-0 hamburger"
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} className={cn("transition-transform duration-300", isMobileMenuOpen && "rotate-90")} />
          </button>
        </div>
        
      </nav>

      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
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
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] h-full z-[101] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l bg-[#0A0A1F] border-white/5 text-white"
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
                  <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
                      <Search size={14} />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products, brands..."
                      className="w-full h-11 pl-10 pr-12 rounded-xl bg-white/5 text-white placeholder:text-white/30 text-xs focus:outline-none focus:bg-white/10 transition-all border border-white/10 italic font-bold"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-orange-primary uppercase tracking-widest italic">Search</button>
                  </form>
                </div>

                {/* Quick links stream */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Explore Sections</span>
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/')}>
                    <span className="italic">Home</span>
                  </Link>
                  <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/categories')}>
                    <span className="italic">All Categories</span>
                  </Link>
                  <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/products')}>
                    <span className="italic">Products Library</span>
                  </Link>
                  <Link to="/brands" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/brands')}>
                    <span className="italic">Explore Brands</span>
                  </Link>
                  <Link to="/guides" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/guides')}>
                    <span className="italic">Recommendations</span>
                  </Link>
                  <Link to="/compare" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/compare')}>
                    <span className="italic">Compare Engine</span>
                  </Link>
                  <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/deals')}>
                    <span className="italic">Flash Deals</span>
                  </Link>
                  <Link to="/viral-products" onClick={() => setIsMobileMenuOpen(false)} className={getMobileLinkClass('/viral-products')}>
                    <span className="italic">Viral Products</span>
                  </Link>
                  
                  <div className="h-px bg-white/10 my-1" />
                  
                  <Link to="/post-offer" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all justify-center">
                    <span className="italic">Post Your Deal</span>
                    <ChevronRight size={14} className="text-orange-primary" />
                  </Link>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                <div className="text-center">
                  <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-widest">Choosify Bangladesh • Design system v1.0</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
