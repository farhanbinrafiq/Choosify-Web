import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div
      ref={heroRef}
      className="min-h-[calc(100vh-5rem)] bg-[#000435] flex flex-col items-center justify-center p-8 text-center relative"
    >
      <div className="max-w-xl relative z-10 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-[100px] sm:text-[140px] font-extrabold text-white/10 leading-none mb-[-28px] tracking-tight">
          404
        </h1>

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Page not found
          </h2>

          <p className="text-white/55 text-[13px] font-medium max-w-sm mx-auto leading-relaxed">
            The page you&apos;re looking for moved or never existed. Try searching or head back home.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 bg-white/8 border border-white/15 text-white rounded-lg text-[12.5px] font-bold flex items-center justify-center gap-2 hover:bg-white/12 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} /> Go back
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-3 bg-[#FF5B00] text-white rounded-lg text-[12.5px] font-bold flex items-center justify-center gap-2 hover:bg-[#E8500A] transition-colors cursor-pointer border-0"
            >
              <Home size={16} /> Return home
            </button>
          </div>
        </div>

        <div id="not-found-search" className="mt-14 pt-8 border-t border-white/10 w-full">
          <p className="text-[11px] font-semibold text-white/40 mb-4">Try searching instead</p>
          <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" size={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands, or deals..."
              className="w-full h-12 bg-white/8 border border-white/15 rounded-xl pl-12 pr-5 text-white text-[13px] font-semibold placeholder:text-white/30 focus:outline-none focus:border-[#FF5B00]/50 transition-colors"
            />
          </form>
          <p className="mt-4 text-[12px] text-white/35">
            Or browse{' '}
            <Link to="/products" className="text-[#FF5B00] font-semibold hover:underline">
              products
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
