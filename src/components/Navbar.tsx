import React from 'react';
import { Search, ShoppingBag, User, PlusCircle, ChevronRight, Bell, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="w-full dark-brand-gradient text-white h-20 flex items-center px-8 z-50 sticky top-0 border-b border-white/5 shadow-2xl backdrop-blur-md" id="main-navbar">
      <div className="flex items-center gap-3 mr-8 scale-110">
        <Link to="/" className="flex flex-col items-center group">
          <div className="flex gap-1 mb-[-4px]">
            <div className="w-4 h-4 rounded-full border-2 border-orange-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-orange-primary rounded-full" />
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-orange-primary flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-orange-primary rounded-full" />
            </div>
          </div>
          <span className="text-xl font-black tracking-tight lowercase font-sans">choosify</span>
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest mr-auto">
        <Link to="/" className="hover:text-orange-primary transition-colors">Home</Link>
        <Link to="/categories" className="hover:text-orange-primary transition-colors">Categories</Link>
        <Link to="/products" className="hover:text-orange-primary transition-colors">Products</Link>
        <Link to="/brands" className="hover:text-orange-primary transition-colors">Brands</Link>
        <Link to="/guides" className="hover:text-orange-primary transition-colors">Recommendations</Link>
        <Link to="/compare" className="hover:text-orange-primary transition-colors">Compare</Link>
        <Link to="/deals" className="hover:text-orange-primary transition-colors">Deals</Link>
      </div>

      <div className="flex-1 max-w-md mx-6 hidden xl:block">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search Products, Brands, Recommendations..."
            className="w-full h-10 pl-11 pr-12 rounded-full bg-white/5 text-white placeholder:text-white/30 text-[10px] focus:outline-none focus:bg-white/10 transition-all border border-white/10"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-orange-primary transition-colors">Search</button>
        </div>
      </div>

      <div className="flex items-center gap-5 ml-auto">
        <div className="flex items-center gap-4 border-r border-white/10 pr-5 hidden sm:flex">
          <button className="relative text-white/60 hover:text-white transition-colors">
            <Bookmark size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-navy">3</span>
          </button>
          <button className="relative text-white/60 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-navy">5</span>
          </button>
        </div>

        <Link to="/post-offer" className="hidden md:block">
          <button className="h-10 px-6 bg-white/5 border border-white/10 text-white text-[10px] uppercase font-black rounded-full tracking-widest hover:bg-white/10 transition-all flex items-center gap-2 italic">
            Post Deal <ChevronRight size={14} className="text-orange-primary" />
          </button>
        </Link>
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border-2 border-orange-primary overflow-hidden group-hover:scale-105 transition-all">
             <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" alt="Profile" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block italic text-white/70">Hi, Farhan</span>
        </Link>
      </div>
    </nav>
  );
}
