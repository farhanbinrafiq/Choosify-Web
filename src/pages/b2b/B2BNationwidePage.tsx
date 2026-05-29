import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, ArrowLeft, ShieldCheck, ArrowRight, Layers, HelpCircle, Star, Sparkles
} from 'lucide-react';
import { BANGLADESH_DISTRICT_HUBS, B2B_SUPPLIERS } from '../../data/b2bData';
import { useGlobalState } from '../../context/GlobalStateContext';
import toast from 'react-hot-toast';

export function B2BNationwidePage() {
  const navigate = useNavigate();
  const { allProducts } = useGlobalState();
  const [activeDistrict, setActiveDistrict] = useState('Dhaka');

  // Filter suppliers in selected district
  const matchedSuppliers = B2B_SUPPLIERS.filter(s => s.district.toLowerCase() === activeDistrict.toLowerCase());

  // Show generic products or commodities specific to district
  const getDistrictCommodities = (dist: string) => {
    const d = dist.toLowerCase();
    if (d === 'dhaka') return ['Premium Combed Cotton Polo Lots', 'Full Brand License Footwear Lots', 'Custom Dyed Knit Hoodies'];
    if (d === 'gazipur') return ['Heavy Denim Denim Fabric Rolls', 'RMG Finished Knit lots', 'Organic Pima Cotton Shirts'];
    if (d === 'sylhet') return ['Authenticated Sylhet Pink Pearls Lots', 'Premium Premium Organic Tea Plant Batches'];
    if (d === 'rajshahi') return ['Fine Hand-woven Rajshahi Silk rolls', 'Pure Raw Mango Concentrates'];
    return ['General Industrial Consumables', 'Heavy Carton Packaging Boxes'];
  };

  return (
    <div className="min-h-screen bg-white text-slate-850 font-sans pb-16 selection:bg-[#FF0038] selection:text-white">
      
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
            Nationwide Sourcing Clusters
          </h1>
          <p className="text-xs text-slate-200 mt-2 max-w-xl font-medium tracking-wide">
            Audit localized regional wholesale commerce centers inside Bangladesh representing specific industry guilds, river port centers, and certified agricultural clusters.
          </p>
        </div>
      </div>

      {/* 2. TOWARDS SELECTOR */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* State Hub Selector: Left Column - 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-black italic uppercase tracking-tight pl-2 text-[#081120]">Select Cluster region</h3>
          <div className="space-y-2.5">
            {BANGLADESH_DISTRICT_HUBS.map((hub) => {
              const isActive = activeDistrict.toLowerCase() === hub.name.toLowerCase();
              return (
                <button
                  key={hub.id}
                  onClick={() => {
                    setActiveDistrict(hub.name);
                    toast.success(`Broadcasting region map bounds to ${hub.name} industrial parks`);
                  }}
                  className={`w-full p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    isActive 
                      ? 'bg-[#FF0038]/5 border-[#FF0038] shadow-md' 
                      : 'bg-[#F7F8FA] hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <span className={`text-[8px] font-black uppercase tracking-widest mb-1 block ${isActive ? 'text-[#FF0038]' : 'text-slate-400'}`}>
                    Active Cluster Guild
                  </span>
                  <p className="text-sm font-black text-[#081120] italic">{hub.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-normal mt-1">{hub.specialty}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Hub Details Panel: Right Column - 8 cols */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active stats */}
          <div className="bg-[#081120] border-none p-8 rounded-[32px] relative overflow-hidden shadow-xl text-slate-200">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF0038]/10 blur-3xl pointer-events-none" />
            <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase text-[#FF0038] bg-[#FF0038]/10 border border-[#FF0038]/20 px-2.5 py-1 rounded-full italic mb-3 font-sans">
              <Sparkles size={10} /> Localized Industry Guild Map
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tight font-sans">
              Welcome to the {activeDistrict} Cluster Hub
            </h2>
            <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed max-w-xl">
              This business group maps verified suppliers that utilize optimized delivery channels through major river ports, highway junctions, and dedicated dry dock yards directly inside <b>{activeDistrict}</b>.
            </p>

            <div className="pt-6 mt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-bold text-slate-400 font-sans">Industry Specializations</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {getDistrictCommodities(activeDistrict).map((com, idx) => (
                    <span key={idx} className="text-[9px] font-black text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-lg font-mono">
                      {com}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* District verified suppliers */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-[#081120] italic uppercase tracking-tight pl-2">Active factory plants in {activeDistrict}</h3>
            
            {matchedSuppliers.length === 0 ? (
              <div className="bg-[#F7F8FA] border border-slate-200 rounded-[28px] p-12 text-center text-slate-500 font-medium text-xs shadow-sm">
                <HelpCircle size={32} className="text-slate-400 mx-auto mb-3" />
                No local manufacturers actively registered for {activeDistrict} yet bounds.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchedSuppliers.map((sup) => (
                  <div 
                    key={sup.id}
                    onClick={() => navigate(`/b2b/supplier/${sup.slug}`)}
                    className="bg-[#F7F8FA] border border-slate-200 hover:border-[#FF0038]/30 p-6 rounded-[28px] cursor-pointer transition-all duration-300 group flex flex-col justify-between shadow-sm text-slate-850"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-[#081120] italic border border-slate-200 text-sm">
                          {sup.logo}
                        </div>
                        {sup.isVerified && (
                          <span className="text-[7px] font-black uppercase text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                            Escrow OK
                          </span>
                        )}
                      </div>
                      <h4 className="font-black text-[#081120] italic text-base mt-4 group-hover:text-[#FF0038] transition-colors">{sup.name}</h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 mt-1.5 leading-relaxed font-sans">{sup.about}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center text-[10px]">
                      <span className="text-emerald-600 font-bold font-sans">{sup.responseRate} response rate</span>
                      <span className="font-black text-[#FF0038] uppercase tracking-widest italic group-hover:underline flex items-center gap-1 text-[9px]">
                        Browse Factory <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
