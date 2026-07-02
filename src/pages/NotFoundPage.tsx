import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] choosify-dark-gradient flex items-center justify-center p-8 text-center overflow-hidden relative">

      <div className="max-w-xl relative z-10 animate-in fade-in zoom-in duration-700">
        <h1 className="text-[120px] sm:text-[180px] font-black text-white/5 leading-none mb-[-40px] italic tracking-tighter">404</h1>
        
        <div className="space-y-6">
          <h2 className="text-4xl sm:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">
            Lost in the <br />
            <span className="text-orange-primary">Discovery</span> Matrix
          </h2>
          
          <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] italic max-w-sm mx-auto leading-relaxed">
            The curated piece you&apos;re looking for has moved beyond the horizon or never existed in this timeline.
          </p>

          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full text-[11px] font-black uppercase tracking-widest italic flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={16} /> Go Back
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-10 py-4 bg-orange-primary text-white rounded-full text-[11px] font-black uppercase tracking-widest italic flex items-center justify-center gap-3 shadow-2xl shadow-orange-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Home size={16} /> Return Home
            </button>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-white/5">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic mb-6">Try searching instead</p>
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={18} />
            <input 
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands, or deals..."
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-orange-primary/50 transition-all"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
