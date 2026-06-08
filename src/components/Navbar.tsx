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

  return (
    <>
      <nav className="w-full text-white h-20 flex items-center px-4 md:px-8 z-50 sticky top-0 border-b shadow-2xl backdrop-blur-md transition-all duration-300 bg-[#0A0A1F]/90 border-white/5" id="main-navbar">
        
        {/* LOGO SECTOR */}
        <div className="flex items-center gap-3 mr-4 md:mr-8 scale-110">
          <Link to="/" className="flex flex-col items-center group">
            <img 
              src="/logo.png" 
              alt="Choosify" 
              className="h-7 w-auto mb-0.5 object-contain group-hover:scale-110 transition-transform duration-300" 
              referrerPolicy="no-referrer"
            />
            <span className="text-xl font-black tracking-tight lowercase font-sans">
              choosify<span className="text-white">.bd</span>
            </span>
          </Link>
        </div>

        {/* Retail Mode general navigation links */}
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest mr-auto text-gray-300">
          <Link to="/" className="text-orange-primary hover:text-white transition-colors">Home</Link>
          <Link to="/categories" className="hover:text-orange-primary transition-colors">Categories</Link>
          <Link to="/products" className="hover:text-orange-primary transition-colors">Products</Link>
          <Link to="/brands" className="hover:text-orange-primary transition-colors">Brands</Link>
          <Link to="/guides" className="text-orange-primary hover:text-orange-primary transition-colors">Recommendations</Link>
          <Link to="/compare" className="hover:text-orange-primary transition-colors">Compare</Link>
          <Link to="/deals" className="hover:text-orange-primary transition-colors">Deals</Link>
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
                <div className="w-10 h-10 rounded-full border-2 border-orange-primary overflow-hidden group-hover:scale-105 transition-all">
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
            <button 
              onClick={() => setIsSignInOpen(true)}
              className="h-10 px-6 text-white text-[10px] uppercase font-black rounded-full tracking-widest transition-all flex items-center gap-2 italic bg-[#FF6B00] hover:bg-orange-deep"
            >
              Sign Up <LogIn size={14} />
            </button>
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
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-orange-primary bg-orange-primary/5 border border-orange-primary/10">
                    <span className="italic">Home</span>
                  </Link>
                  <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                    <span className="italic">All Categories</span>
                  </Link>
                  <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                    <span className="italic">Products Library</span>
                  </Link>
                  <Link to="/brands" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                    <span className="italic">Explore Brands</span>
                  </Link>
                  <Link to="/guides" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                    <span className="italic">Recommendations</span>
                  </Link>
                  <Link to="/compare" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                    <span className="italic">Compare Engine</span>
                  </Link>
                  <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                    <span className="italic">Flash Deals</span>
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
