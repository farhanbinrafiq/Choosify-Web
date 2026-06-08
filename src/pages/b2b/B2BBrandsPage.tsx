import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, Search, HelpCircle, MapPin, ShieldCheck, ArrowRight,
  TrendingUp, Globe2, Briefcase, SlidersHorizontal, ArrowLeft
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { BRANDS } from '../../constants';
import toast from 'react-hot-toast';

export function B2BBrandsPage() {
  const navigate = useNavigate();
  const { allBrands } = useGlobalState();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter b2b active brands
  const b2bBrandsList = allBrands.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    return b.wholesaleSupport && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans pb-16 selection:bg-[#FF0038] selection:text-white">
      
      {/* 1. HERO HEADER */}
      <div className="bg-gradient-to-br from-[#081120] via-[#0b1b33] to-[#FF0038] py-14 border-none text-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#FF0038]/90 hover:text-white transition-colors mb-4 italic"
          >
            <ArrowLeft size={12} /> B2B Portal Hub
          </button>
          
          <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
            Corporate Brand Directory
          </h1>
          <p className="text-xs text-slate-200 mt-2 max-w-xl font-medium tracking-wide">
            Partner with established manufacturers and certified licensees offering volume pricing and contract manufacturing lines.
          </p>
        </div>
      </div>

      {/* 2. Brand search bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="bg-[#F7F8FA] border border-slate-200 p-4 rounded-3xl max-w-lg flex items-center relative shadow-sm">
          <span className="absolute left-6 text-slate-400"><Search size={14} /></span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certified corporate brands..."
            className="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF0038]"
          />
        </div>
      </div>

      {/* 3. DYNAMIC BRANDS LIST */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {b2bBrandsList.map((brand) => (
            <div 
              key={brand.id}
              onClick={() => {
                toast.success(`Opening ${brand.name} corporate wholesale showroom`);
                navigate('/b2b/products');
              }}
              className="bg-white border border-[#e8edf2] hover:border-[#FF0038]/30 rounded-xl p-6 hover:scale-[1.01] transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-xs text-slate-850"
            >
              <div>
                <div className="flex items-start justify-between">
                  {brand.logo ? (
                    <img src={brand.logo} className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-slate-200" alt="" />
                  ) : (
                    <div className="w-14 h-14 bg-white text-[#081120] font-black text-lg flex items-center justify-center rounded-xl italic border border-slate-200">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  {brand.verifiedStatus && (
                    <span className="text-[8px] font-black uppercase text-[#FF0038] tracking-widest bg-[#FF0038]/5 px-2.5 py-1 rounded-full border border-[#FF0038]/20 inline-flex items-center gap-1">
                      <ShieldCheck size={10} /> Brand Authorized
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <h3 className="text-xl font-black italic uppercase text-[#081120] group-hover:text-[#FF0038] transition-colors font-sans">
                    {brand.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 font-bold">
                    <MapPin size={12} />
                    <span>Dhaka HQ Logistics</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 bg-white p-3 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">B2B Slabs Offered</p>
                    <p className="text-[11px] font-black text-[#081120] italic mt-1 font-mono">10 - 250 units MOQ</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none font-sans">Active Followers</p>
                    <p className="text-[11px] font-black text-emerald-600 mt-1 font-mono italic">{(brand.followers || 1500).toLocaleString()} users</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-3 border-t border-slate-250 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  Sourcing Lead: 14 Days
                </span>
                <span className="text-[10px] font-black uppercase text-[#081120]/60 group-hover:text-[#FF0038] tracking-widest transition-all italic flex items-center gap-1">
                  Browse Catalog <ArrowRight size={10} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
