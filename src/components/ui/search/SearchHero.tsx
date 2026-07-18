import React, { useState, useEffect } from 'react';
import { SearchInput } from '../forms/Input';
import { Button } from '../buttons/Button';
import { Badge } from '../badges/Badge';

interface SearchHeroProps {
  rawQuery: string;
  total: number;
  onSearch: (val: string) => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ rawQuery, total, onSearch }) => {
  const [inputValue, setInputValue] = useState(rawQuery);

  useEffect(() => {
    setInputValue(rawQuery);
  }, [rawQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const trendingSearches = ['Samsung S24 Ultra', 'Gift wrapping', 'Sailor', 'PC Build'];
  const recentSearches = ['Aarong', 'Yellow', 'Sony WH-1000XM5'];

  return (
    <div className="w-full relative overflow-hidden flex flex-col items-center justify-center border-b border-white/5 h-[350px] px-6">
      <div className="absolute inset-0 hero-gradient" />
      
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center relative z-10 w-full">
        <Badge variant="outline" className="border-orange-primary text-orange-primary bg-orange-primary/10 mb-3 text-[8px] uppercase tracking-[0.2em] italic">
          OMNI SEARCH ENGINE v1.1
        </Badge>
        
        <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
          Unified Global Search
        </h1>
        <p className="text-white/60 text-xs md:text-sm max-w-lg mb-8 leading-relaxed font-medium">
          Search across authorized brands, verified products, active discount campaigns, professional recommendations, and influencer insights.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-xl relative flex flex-col items-center">
          <div className="relative w-full flex items-center bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg focus-within:border-white/20 transition-all duration-300">
             <SearchInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search products, brands, promo codes, influencers..."
                className="bg-white rounded-full border-none h-10 w-full pr-28 text-xs font-semibold text-slate-900"
             />
             <Button type="submit" variant="primary" className="absolute right-1.5 h-10 rounded-full px-5 text-[9px] uppercase tracking-widest font-black">
               Search
             </Button>
          </div>

          {!rawQuery && (
            <div className="mt-6 flex flex-col items-center gap-4 w-full">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider mr-2">Trending:</span>
                {trendingSearches.map((s) => (
                  <Badge key={s} variant="secondary" className="cursor-pointer bg-white/10 text-white hover:bg-white/20 text-[9px]" onClick={() => onSearch(s)}>
                    {s}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider mr-2">Recent:</span>
                {recentSearches.map((s) => (
                  <Badge key={s} variant="secondary" className="cursor-pointer bg-white/10 text-white hover:bg-white/20 text-[9px]" onClick={() => onSearch(s)}>
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </form>

        {rawQuery && (
          <p className="text-white/40 text-[10px] font-mono mt-4">
            Showing {total} matches for "{rawQuery}"
          </p>
        )}
      </div>
    </div>
  );
};
