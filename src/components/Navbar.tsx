import React, { useState } from 'react';
import { 
  Search, ShoppingBag, User, PlusCircle, ChevronRight, Bell, Bookmark, LogIn, 
  LayoutDashboard, Heart, MessageSquare, Settings, Briefcase, Package, ShieldCheck, 
  FileCheck2, Building2, HelpCircle, ArrowLeftRight, CheckSquare, Menu, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
  const { mode, setMode, retailCart, wholesaleCart, isLoggedIn, setIsLoggedIn } = useGlobalState();

  // Pick cart count depending on current mode
  const activeCartCount = mode === 'wholesale' ? wholesaleCart.length : retailCart.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (mode === 'wholesale') {
        navigate(`/b2b/products?q=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const triggerModeSwitch = () => {
    if (mode === 'retail') {
      // Trigger confirmation modal for entering B2B
      setIsConfirmModalOpen(true);
    } else {
      // Direct revert to retail
      setMode('retail');
      toast.success('Switched back to Retail Product Discovery Platform');
      navigate('/');
    }
  };

  const confirmSwitchToB2B = () => {
    setMode('wholesale');
    setIsConfirmModalOpen(false);
    toast.success('Successfully entered verified B2B Wholesale Portal!');
    navigate('/');
  };

  const dashboardMiniMenu = [
    { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', path: '/profile/orders', icon: Package },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Saved Products', path: '/dashboard', tab: 'saved-products', icon: Heart },
    { label: 'Notifications', path: '/dashboard', tab: 'notifications', icon: Bell },
    { label: 'Settings', path: '/dashboard', tab: 'settings', icon: Settings },
  ];

  return (
    <>
      <nav className={cn(
        "w-full text-white h-20 flex items-center px-4 md:px-8 z-50 sticky top-0 border-b shadow-2xl backdrop-blur-md transition-all duration-300",
        mode === 'wholesale' 
          ? "bg-[#081120]/95 border-[#FF0038]/15" 
          : "bg-[#0A0A1F]/90 border-white/5"
      )} id="main-navbar">
        
        {/* LOGO SECTOR */}
        <div className="flex items-center gap-3 mr-4 md:mr-8 scale-110">
          <Link to="/" className="flex flex-col items-center group">
            <svg className="h-6 w-6 mb-1 text-orange-primary group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill={mode === 'wholesale' ? "#FF0038" : "#FF5B00"} />
              <circle cx="9.5" cy="12" r="2.5" fill="white" />
              <circle cx="14.5" cy="12" r="2.5" fill="white" opacity="0.4" />
            </svg>
            <span className="text-xl font-black tracking-tight lowercase font-sans">
              choosify<span className={mode === 'wholesale' ? "text-[#FF0038]" : "text-white"}>.bd</span>
            </span>
          </Link>
        </div>

        {/* MODE TOGGLE SWITCH (GLOBAL) */}
        <div className="flex items-center gap-2 border border-white/10 p-1 rounded-2xl bg-black/40 mr-6 scale-95 shrink-0 select-none">
          <button 
            type="button" 
            onClick={() => {
              if (mode === 'wholesale') triggerModeSwitch();
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider font-sans transition-all duration-200",
              mode === 'retail' 
                ? "bg-gradient-to-r from-[#FF5B00] to-orange-deep text-white shadow-lg" 
                : "text-gray-400 hover:text-white"
            )}
          >
            Retail
          </button>
          <button 
            type="button" 
            onClick={() => {
              if (mode === 'retail') triggerModeSwitch();
            }}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider font-sans transition-all duration-200 flex items-center gap-1",
              mode === 'wholesale' 
                ? "bg-[#FF0038] text-white shadow-lg shadow-[#FF0038]/15" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <span className="hidden sm:inline">B2B Wholesale Mini</span>
            <span className="inline sm:hidden">B2B</span>
          </button>
        </div>

        {/* DYNAMIC CATEGORIES FOR EACH MODE */}
        {mode === 'wholesale' ? (
          /* B2B wholesale active category links */
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest mr-auto italic">
            <Link to="/" className="text-[#FF0038] hover:text-white transition-colors">B2B Core</Link>
            <Link to="/b2b/suppliers" className="hover:text-[#FF0038] text-gray-300 transition-colors">Suppliers</Link>
            <Link to="/b2b/products" className="hover:text-[#FF0038] text-gray-300 transition-colors">Products</Link>
            <Link to="/b2b/nationwide" className="hover:text-[#FF0038] text-gray-300 transition-colors">Nationwide</Link>
            <Link to="/b2b/brands" className="hover:text-[#FF0038] text-gray-300 transition-colors">Brands Showcase</Link>
          </div>
        ) : (
          /* Retail Mode general navigation links */
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest mr-auto italic text-gray-300">
            <Link to="/" className="text-orange-primary hover:text-white transition-colors">Home</Link>
            <Link to="/categories" className="hover:text-orange-primary transition-colors">Categories</Link>
            <Link to="/products" className="hover:text-orange-primary transition-colors">Products</Link>
            <Link to="/brands" className="hover:text-orange-primary transition-colors">Brands</Link>
            <Link to="/guides" className="text-orange-primary hover:text-orange-primary transition-colors">Recommendations</Link>
            <Link to="/compare" className="hover:text-orange-primary transition-colors">Compare</Link>
            <Link to="/deals" className="hover:text-orange-primary transition-colors">Deals</Link>
          </div>
        )}

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
              placeholder={mode === 'wholesale' ? "Search RMG factories, wholesale loads..." : "Search Products, Brands, Reviews..."}
              className="w-full h-10 pl-11 pr-12 rounded-full bg-white/5 text-white placeholder:text-white/30 text-[10px] focus:outline-none focus:bg-white/10 transition-all border border-white/10 italic font-bold"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-[#FF0038] transition-colors italic">Sourcing</button>
          </form>
        </div>

        {/* ACTIONS & MESSAGES */}
        <div className="flex items-center gap-5 ml-auto nav-actions">
          
          {/* CART SECTIONS DEPENDENT ON STATE */}
          <div className="hidden sm:flex items-center gap-4 border-r border-[#ffffff1a] pr-5">
            <button 
              type="button"
              onClick={() => {
                if (mode === 'wholesale') {
                  navigate('/cart/b2b');
                } else {
                  navigate('/cart/retail');
                }
              }}
              className="relative text-white/60 hover:text-white transition-colors mr-1"
              title={mode === 'wholesale' ? 'Commercial Freight Cart' : 'Shopping Cart'}
            >
              <ShoppingBag size={20} className={cn("transition-colors", mode === 'wholesale' && "text-[#FF0038]")} />
              {activeCartCount > 0 && (
                <span className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0A1F] animate-bounce",
                  mode === 'wholesale' ? "bg-[#FF0038]" : "bg-orange-primary"
                )}>
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

          {/* MODE-SPECIFIC BUTTONS ON THE RIGHT */}
          {mode === 'wholesale' ? (
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={() => navigate('/b2b/rfq')}
                className="h-10 px-4 bg-[#FF0038]/10 hover:bg-[#FF0038]/20 border border-[#FF0038]/30 text-white hover:text-white text-[9.5px] uppercase font-black rounded-xl tracking-wider transition-all flex items-center gap-1.5 italic"
              >
                <FileCheck2 size={13} className="text-[#FF0038]" /> RFQ Desk
              </button>
              <button 
                onClick={() => {
                  toast.success('Redirecting to Bangladesh Factory Registration Desk');
                  navigate('/post-offer');
                }}
                className="h-10 px-4 bg-white/5 border border-white/10 hover:border-[#FF0038]/50 text-white hover:bg-white/10 text-[9.5px] uppercase font-black rounded-xl tracking-wider transition-all flex items-center gap-1.5 italic"
              >
                <Building2 size={13} className="text-[#FF0038]" /> Become Supplier
              </button>
            </div>
          ) : (
            !isLoggedIn && (
              <Link to="/post-offer" className="hidden md:block">
                <button className="h-10 px-6 bg-white/5 border border-white/10 text-white text-[10px] uppercase font-black rounded-full tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 italic">
                  Post Deal <ChevronRight size={14} className="text-orange-primary" />
                </button>
              </Link>
            )
          )}
          
          {isLoggedIn ? (
            <div className="relative profile-avatar">
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
                          <button
                            key={idx}
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
              className={cn(
                "h-10 px-6 text-white text-[10px] uppercase font-black rounded-full tracking-widest transition-all flex items-center gap-2 italic",
                mode === 'wholesale' ? "bg-[#FF0038] hover:bg-[#d6002f]" : "bg-[#FF6B00] hover:bg-orange-deep"
              )}
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
              className={cn(
                "fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] h-full z-[101] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l",
                mode === 'wholesale' ? "bg-[#081120] border-[#FF0038]/15 text-white" : "bg-[#0A0A1F] border-white/5 text-white"
              )}
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
                      placeholder={mode === 'wholesale' ? "Search suppliers, loads..." : "Search products, brands..."}
                      className="w-full h-11 pl-10 pr-12 rounded-xl bg-white/5 text-white placeholder:text-white/30 text-xs focus:outline-none focus:bg-white/10 transition-all border border-white/10 italic font-bold"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-orange-primary uppercase tracking-widest italic">Search</button>
                  </form>
                </div>

                {/* Quick links stream */}
                <div className="flex flex-col gap-3">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Explore Sections</span>
                  {mode === 'wholesale' ? (
                    <>
                      <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-[#FF0038] bg-[#FF0038]/5 border border-[#FF0038]/10">
                        <span className="italic">B2B Core</span>
                      </Link>
                      <Link to="/b2b/suppliers" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <span className="italic">Suppliers List</span>
                      </Link>
                      <Link to="/b2b/products" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <span className="italic">Wholesale Products</span>
                      </Link>
                      <Link to="/b2b/nationwide" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <span className="italic">Nationwide Logistics</span>
                      </Link>
                      <Link to="/b2b/brands" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                        <span className="italic">Brands Showcase</span>
                      </Link>
                      <div className="h-px bg-white/10 my-1" />
                      <button onClick={() => { navigate('/b2b/rfq'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-start gap-3 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-[#FF0038]/10 hover:bg-[#FF0038]/20 border border-[#FF0038]/30 transition-all text-left">
                        <FileCheck2 size={14} className="text-[#FF0038]" />
                        <span className="italic">RFQ Desk</span>
                      </button>
                      <button onClick={() => { navigate('/post-offer'); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-start gap-3 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left">
                        <Building2 size={14} className="text-[#FF0038]" />
                        <span className="italic">Become Supplier</span>
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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

      {/* DYNAMIC CONFIRMATION MODAL TO B2B MODE */}
      <AnimatePresence>
        {isConfirmModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#081120] border border-white/10 p-8 rounded-[32px] w-full max-w-md relative text-gray-100 shadow-2xl overflow-hidden"
            >
              {/* Highlight gradient lines */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF0038]/5 blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3.5 border-b border-white/5 pb-4 mb-5">
                <div className="p-3 bg-[#FF0038]/10 text-[#FF0038] rounded-2xl">
                  <ArrowLeftRight size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Enter B2B Wholesale Ecosystem</h3>
                  <p className="text-[9px] uppercase font-mono tracking-wider text-gray-500">Corporate platform gateway</p>
                </div>
              </div>

              <p className="text-xs text-gray-400 font-sans leading-relaxed font-semibold">
                This will switch the entire application feed to B2B Wholesale Mode containing verified industrial manufacturers, Bulk volume tier prices and escrow protection trades. Are you sure you wish to continue?
              </p>

              <div className="flex gap-4 mt-8 border-t border-white/5 pt-5 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-6 h-11 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-white text-[10px] font-black uppercase tracking-widest italic rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={confirmSwitchToB2B}
                  className="px-6 h-11 bg-[#FF0038] hover:bg-[#d6002f] text-white text-[10px] font-black uppercase tracking-widest italic rounded-xl transition-all shadow-lg"
                >
                  Confirm & Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
