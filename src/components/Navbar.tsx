import React, { useState } from 'react';
import { Search, ShoppingBag, User, PlusCircle, ChevronRight, Bell, Bookmark, LogIn, LayoutDashboard, Heart, MessageSquare, Settings, Briefcase, Package } from 'lucide-react';
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
  const [isWholesaleConfirmOpen, setIsWholesaleConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const { mode, setMode, retailCart, wholesaleCart, isLoggedIn, setIsLoggedIn } = useGlobalState();
  const cartItemsCount = mode === 'retail' ? retailCart.length : wholesaleCart.length;

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
    { label: 'Settings', path: '/dashboard', tab: 'settings', icon: Settings },
  ];

  return (
    <nav className="w-full bg-[#0A0A1F]/90 text-white h-20 flex items-center px-4 md:px-8 z-50 sticky top-0 border-b border-white/5 shadow-2xl backdrop-blur-md" id="main-navbar">
      <div className="flex items-center gap-3 mr-4 md:mr-8 scale-110">
        <Link to="/" className="flex flex-col items-center group">
          <svg className="h-6 w-6 mb-1 text-orange-primary group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="brand-grad" x1="10%" y1="10%" x2="90%" y2="90%">
                <stop offset="0%" stopColor="#FF5B00" />
                <stop offset="100%" stopColor="#FF8C3A" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#brand-grad)" />
            <circle cx="9.5" cy="12" r="2.5" fill="white" />
            <circle cx="14.5" cy="12" r="2.5" fill="white" opacity="0.4" />
          </svg>
          <span className="text-xl font-black tracking-tight lowercase font-sans">choosify.bd</span>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest mr-auto italic">
        <Link to="/" className="text-[#FF6B00] hover:text-[#FF6B00] transition-colors font-black">Home</Link>
        <Link to="/categories" className="hover:text-orange-primary transition-colors">Categories</Link>
        <Link to="/products" className="hover:text-orange-primary transition-colors">Products</Link>
        <Link to="/brands" className="hover:text-orange-primary transition-colors">Brands</Link>
        {mode !== 'wholesale' && (
          <>
            <Link to="/guides" className="text-orange-primary hover:text-orange-primary transition-colors">Recommendations</Link>
            <Link to="/compare" className="hover:text-orange-primary transition-colors">Compare</Link>
            <Link to="/deals" className="hover:text-orange-primary transition-colors">Deals</Link>
          </>
        )}
      </div>

      <div className="flex-1 max-w-md mx-6 hidden xl:block">
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

      <div className="flex items-center gap-5 ml-auto">
        {/* Global Retail vs Wholesale switcher */}
        <div className="flex bg-white/5 border border-white/10 rounded-full p-1 items-center gap-1 scale-95 origin-right">
          <button 
            type="button"
            onClick={() => {
              setMode('retail');
              toast.success('Switched to Retail Category Portal');
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all italic",
              mode === 'retail' 
                ? "bg-orange-primary text-white shadow-md font-black" 
                : "text-white/60 hover:text-white"
            )}
          >
            Retail
          </button>
          <button 
            type="button"
            onClick={() => {
              if (mode === 'retail') {
                setIsWholesaleConfirmOpen(true);
              }
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all italic flex items-center gap-1",
              mode === 'wholesale' 
                ? "bg-navy text-[#FF5B00] border border-white/10 shadow-md font-black" 
                : "text-white/60 hover:text-white"
            )}
          >
            <Briefcase size={10} /> B2B Wholesale
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-4 border-r border-[#ffffff1a] pr-5">
          <button 
            type="button"
            onClick={() => navigate(mode === 'retail' ? '/cart/retail' : '/cart/b2b')}
            className="relative text-white/60 hover:text-white transition-colors mr-1"
            title="Shopping Cart Portal"
          >
            <ShoppingBag size={20} className={cn(mode === 'wholesale' && "text-orange-primary")} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0A1F] animate-bounce">
                {cartItemsCount}
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
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0A1F]">3</span>
          </button>
          <button 
            type="button"
            onClick={() => navigate('/messages')}
            className="relative text-white/60 hover:text-white transition-colors"
            title="Secure Support Chats"
          >
            <MessageSquare size={19} className="text-orange-primary" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-black text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0A1F]">2</span>
          </button>
          <button 
            type="button"
            onClick={() => navigate('/dashboard', { state: { activeTab: 'notifications' } })}
            className="relative text-white/60 hover:text-white transition-colors"
            title="Notification Alerts"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0A1F]">5</span>
          </button>
        </div>

        {!isLoggedIn && (
          <Link to="/post-offer" className="hidden md:block">
            <button className="h-10 px-6 bg-white/5 border border-white/10 text-white text-[10px] uppercase font-black rounded-full tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 italic">
              Post Deal <ChevronRight size={14} className="text-orange-primary" />
            </button>
          </Link>
        )}
        
        {isLoggedIn ? (
          <div className="relative">
            <div 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
              className="flex items-center gap-3 group cursor-pointer"
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
                    className="absolute right-0 mt-4 w-64 bg-[#050514] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/10 blur-2xl rounded-full" />
                    
                    <div className="flex items-center gap-3 p-3 mb-4 bg-white/5 rounded-xl border border-white/5">
                      <img src="https://i.pravatar.cc/150?u=me" className="w-10 h-10 rounded-full object-cover border border-orange-primary/30" alt="" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-white italic uppercase truncate">Farhan Bin Rafiq</p>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest truncate">farhan-88@gmail.com</p>
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
            className="h-10 px-6 bg-[#FF6B00] text-white text-[10px] uppercase font-black rounded-full tracking-widest hover:bg-orange-deep transition-all flex items-center gap-2 italic"
          >
            Sign Up <LogIn size={14} />
          </button>
        )}
      </div>
      
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Wholesaler Switch Confirmation Modal */}
      <AnimatePresence>
        {isWholesaleConfirmOpen && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWholesaleConfirmOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0A0A1F] border border-orange-primary/20 rounded-[32px] overflow-hidden shadow-2xl"
            >
              {/* Sunset orange glow visual flair */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="relative z-10 p-10 pt-12">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-orange-primary/10 rounded-2xl flex items-center justify-center text-orange-primary mx-auto mb-6 border border-orange-primary/20 shadow-2xl">
                    <Briefcase size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">
                    Switch to <span className="text-orange-primary">B2B Wholesale?</span>
                  </h3>
                  <p className="text-gray-400 text-[11px] font-medium tracking-wide leading-relaxed">
                    You are about to enter the B2B wholesale marketplace experience with bulk ordering, MOQ-based pricing, and wholesale suppliers.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsWholesaleConfirmOpen(false)}
                    className="h-14 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all italic"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setMode('wholesale');
                      setIsWholesaleConfirmOpen(false);
                    }}
                    className="h-14 bg-orange-primary hover:bg-orange-deep text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all italic shadow-lg shadow-orange-primary/20"
                  >
                    Confirm & Enter B2B
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
