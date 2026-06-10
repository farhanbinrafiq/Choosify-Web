import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Tag, Zap, Star } from 'lucide-react';
import { BRANDS } from '../constants';
import { cn } from '../lib/utils';

export function BrandDealsPage() {
  const navigate = useNavigate();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredBrands = BRANDS.filter(brand => {
    const matchesLetter = selectedLetter === null || brand.name.startsWith(selectedLetter);
    return matchesLetter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F4F9]">
      {/* Hero Section */}
      <div className="w-full bg-[#0A0A1F] py-16 px-4 md:px-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="bg-orange-primary text-white text-[11px] font-black px-8 py-2.5 rounded-full mb-8 uppercase tracking-[0.2em] shadow-xl shadow-orange-primary/30 italic">
            EXCLUSIVE PARTNER OFFERS
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-[80px] font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
            BRAND WISE <span className="text-orange-primary">DEALS</span>
          </h1>
          
          <p className="text-white/60 text-sm md:text-lg max-w-2xl font-bold uppercase tracking-[0.2em] italic leading-relaxed">
            Directly sourced offers from official brand outlets and authorized retailers.
          </p>
        </div>
      </div>

      {/* Sticky Alphabet Filter Bar */}
      <div className="sticky top-[64px] z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setSelectedLetter(null)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex-shrink-0",
                  selectedLetter === null ? "bg-orange-primary text-white shadow-orange-primary/20" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                )}
              >
                All Brands
              </button>
              <div className="w-px h-6 bg-gray-100 mx-2 flex-shrink-0" />
              {letters.map((letter) => (
                <button 
                  key={letter} 
                  onClick={() => setSelectedLetter(letter)}
                  className={cn(
                    "w-8 h-8 rounded-xl text-[10px] font-black transition-all flex items-center justify-center flex-shrink-0 uppercase",
                    selectedLetter === letter ? "bg-orange-primary text-white shadow-lg shadow-orange-primary/20" : "text-gray-400 hover:text-navy hover:bg-gray-50"
                  )}
                >
                  {letter}
                </button>
              ))}
              <button className="w-8 h-8 rounded-xl text-[10px] font-black text-gray-400 hover:text-navy hover:bg-gray-50 flex items-center justify-center flex-shrink-0 transition-all uppercase">#</button>
            </div>
            <div className="flex items-center gap-6 whitespace-nowrap">
              {(selectedLetter || searchQuery) && (
                <button 
                  onClick={() => {setSelectedLetter(null); setSearchQuery('');}}
                  className="text-[10px] font-black text-orange-primary uppercase tracking-widest hover:underline flex items-center gap-2 transition-all"
                >
                  Clear Selection
                </button>
              )}
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Direct Brand Jump
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16 w-full">
        <div className="flex flex-col gap-16">
          {/* Grouped by Brand */}
          {filteredBrands.map((brand, idx) => (
            <div key={brand.id} className="animate-in fade-in slide-in-from-bottom-5 duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center text-navy font-black text-xl border border-gray-100">
                    {brand.logo}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-navy italic uppercase tracking-tighter">{brand.name} Deals</h2>
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={12} className="text-green-accent" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Authorized Partner Offers</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/brands/${brand.id}/products`)}
                  className="hidden sm:flex items-center gap-2 text-orange-primary font-black uppercase text-[10px] tracking-widest hover:gap-3 transition-all"
                >
                  View Brand Store <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((deal) => (
                  <div 
                    key={deal} 
                    onClick={() => navigate(`/brands/${brand.id}/products`)}
                    className="bg-white rounded-[32px] p-10 flex flex-col items-center text-center gap-10 hover:shadow-[0_40px_100px_rgba(0,0,0,0.1)] transition-all cursor-pointer border border-gray-100 group relative overflow-hidden shadow-2xl shadow-gray-200/40"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    
                    <div className="w-28 h-28 rounded-full bg-[#F8FAFC] flex items-center justify-center text-navy font-black text-4xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border border-white group-hover:scale-110 transition-transform duration-500 relative z-10">
                      {brand.logo}
                    </div>
                    
                    <div className="flex flex-col items-center gap-3 relative z-10">
                      <h4 className="text-2xl font-black text-navy group-hover:text-orange-primary transition-colors italic uppercase tracking-tighter leading-tight line-clamp-1">{brand.name} {deal === 1 ? 'Special' : deal === 2 ? 'Exclusive' : 'Limited'}</h4>
                      <div className="px-6 py-2 bg-orange-primary text-white rounded-full text-[11px] font-black uppercase tracking-widest italic shadow-lg shadow-orange-primary/20 group-hover:scale-110 transition-transform">
                        Up to {idx % 2 === 0 ? '40%' : '50%'} OFF
                      </div>
                    </div>

                    <div className="w-full h-px bg-gray-50 relative z-10" />

                    <div className="flex items-center gap-3 text-[11px] font-black text-navy uppercase tracking-widest italic group-hover:text-orange-primary transition-colors relative z-10">
                      Grab This Deal <ArrowRight size={18} className="-rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-20 bg-navy px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,91,0,0.1),transparent_70%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 leading-tight">
            NOT FINDING YOUR <span className="text-orange-primary">FAVORITE BRAND?</span>
          </h2>
          <p className="text-white/40 text-sm md:text-base font-bold uppercase tracking-[0.2em] italic mb-12">
            Suggest a brand or request an offer. We'll verify and bring it to you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto px-12 py-5 bg-white text-navy font-black text-[11px] uppercase tracking-widest italic rounded-full hover:bg-orange-primary hover:text-white transition-all shadow-2xl">
              Request A Brand
            </button>
            <button className="w-full sm:w-auto px-12 py-5 bg-navy border-2 border-white/20 text-white font-black text-[11px] uppercase tracking-widest italic rounded-full hover:border-white transition-all">
              Notify Me Of New Deals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
