import React from 'react';
import { CheckCircle2, Users, HelpCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDashboard } from '../context/DashboardContext';

interface OverviewData {
  address: string;
  website: string;
  map: string;
  email: string;
  phone: string;
  priceRange: string;
  ageRange: string;
  audience: string;
  services: string[];
  tags: string[];
}

interface BrandOverviewSectionProps {
  brandName: string;
  overviewData: OverviewData;
  claimStatus?: 'community' | 'pending' | 'verified';
}

export function BrandOverviewSection({ brandName, overviewData, claimStatus }: BrandOverviewSectionProps) {
  const { customOverviews } = useDashboard();
  const brandCustoms = customOverviews ? customOverviews.filter(
    co => co.targetType === 'brand' && co.targetId.toLowerCase() === brandName.toLowerCase()
  ) : [];

  return (
    <div id="brand-overview-section" className="bg-white rounded-[5px] p-6 md:p-8 border border-gray-100 shadow-sm scroll-mt-36">
      <div className="text-center mb-8 border-b border-gray-100 pb-5">
        <h3 className="text-2xl font-black text-[#1A1D4E] tracking-tight uppercase mb-1">
          Brand Overview
        </h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic font-mono bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 w-fit mx-auto">
          About {brandName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
        {/* 1. Address & Links */}
        <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center">
                <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
              </div>
              <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Shop Address & Links</h4>
            </div>
            <div className="text-xs text-gray-500 font-bold leading-relaxed space-y-2">
              <p className="uppercase">{overviewData.address}</p>
              <div>
                <span className="text-[#FF5B00] font-black">WEBSITE:</span>{' '}
                <a href={`https://${overviewData.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#1A1D4E]">
                  {overviewData.website}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <a href={overviewData.map} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-[#FF5B00] uppercase tracking-wider hover:underline flex items-center gap-1">
              Open on Maps <span>➜</span>
            </a>
          </div>
        </div>

        {/* 2. Contact Information */}
        <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center">
                <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
              </div>
              <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Contact Informations</h4>
            </div>
            <div className="text-xs text-gray-500 font-bold leading-relaxed space-y-3">
              <p className="flex items-center gap-2 truncate"><span className="text-[#1A1D4E] font-black">EMAIL:</span> {overviewData.email}</p>
              <p className="flex items-center gap-2"><span className="text-[#1A1D4E] font-black">PHONE:</span> {overviewData.phone}</p>
            </div>
          </div>
        </div>

        {/* 3. Price Range & Audience */}
        <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center">
                <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
              </div>
              <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Price & Audience</h4>
            </div>
            <div className="text-xs text-gray-500 font-bold leading-relaxed space-y-2">
              <p><span className="text-[#1A1D4E] font-black">BDT</span> - {overviewData.priceRange.replace('BDT - ', '')}</p>
              <p className="uppercase">{overviewData.ageRange}</p>
              <p className="uppercase text-[#FF5B00]">{overviewData.audience}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* 4. Services & Specialties */}
        <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2.5 mb-4 border-b border-gray-200/50 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center">
              <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
            </div>
            <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Services & Specialties</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {overviewData.services.map((srv, idx) => (
              <div key={idx} className="text-[10px] text-gray-600 font-bold uppercase tracking-wide flex items-start gap-2">
                <span className="text-[#FF5B00] text-xs leading-none">•</span>
                <span>{srv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Best For #Tags */}
        <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2.5 mb-4 border-b border-gray-200/50 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center">
              <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
            </div>
            <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Best For #Tags</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {overviewData.tags.map((tag, idx) => (
              <span key={idx} className="text-[9px] font-black text-[#FF5B00] bg-[#FFF0E8] px-3 py-1.5 rounded-full uppercase tracking-wider border border-[#FF5B00]/5 select-none hover:scale-105 transition-transform duration-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Dynamic Custom Overviews */}
      {brandCustoms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-6">
          {brandCustoms.map((co, idx) => (
            <div key={idx} className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2.5 mb-4 border-b border-gray-200/50 pb-3">
                <div className="w-8 h-8 rounded-xl bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center">
                  <CheckCircle2 size={16} fill="currentColor" className="text-[#FF5B00] stroke-white" />
                </div>
                <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">{co.sectionName}</h4>
              </div>
              <div className="space-y-2.5">
                {co.content.map((bullet, bIdx) => (
                  <div key={bIdx} className="text-[10px] text-gray-600 font-bold uppercase tracking-wide flex items-start gap-2">
                    <span className="text-[#FF5B00] text-xs leading-none">•</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BRAND PROFILE CLAIMING EXPERIENCE BLOCKS */}
      {claimStatus === 'community' && (
        <div className="mt-8 bg-gray-50 border border-dashed border-gray-200 rounded-[5px] p-6 text-center max-w-2xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 bg-[#FFF0E8]/80 px-3 py-1 rounded-full border border-[#FF5B00]/10">
            <span className="text-[#FF5B00] text-xs font-bold font-mono">ℹ</span>
            <span className="text-[10px] font-black text-[#FF5B00] uppercase tracking-wider">Community Profile State</span>
          </div>
          <p className="text-xs font-bold text-gray-500 leading-relaxed italic max-w-lg">
            This brand profile contains publicly available information curated by Choosify. This profile has not yet been claimed by an authorized brand representative.
          </p>
          
          <button 
            type="button"
            onClick={() => {
              toast.success("Ownership claim application received for " + brandName + "! Our merchant onboarding team will perform necessary verifications relative to this brand representative request and notify you shortly.", { duration: 5000 });
            }}
            className="bg-[#FF5B00] hover:bg-[#ff5d14] text-white py-3.5 px-8 rounded-full uppercase italic text-[11px] font-black tracking-widest transition-all transform hover:scale-[1.03] active:scale-95 shadow-md shadow-orange-primary/10 select-none border border-transparent cursor-pointer"
          >
            Claim Brand Ownership
          </button>
          
          <div className="bg-white border border-[#e8edf2] rounded-[5px] p-5 text-left w-full mt-2 shadow-sm">
            <h4 className="text-[10px] font-black text-[#1A1D4E] uppercase tracking-widest mb-3.5 border-b border-gray-100 pb-2 flex items-center gap-1.5">
              <span className="text-[#FF5B00]">✦</span> Claim ownership to:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10px] text-gray-600 font-bold uppercase tracking-wider">
              <li className="flex items-center gap-2"><span className="text-green-500 text-sm font-black">✓</span> Add products</li>
              <li className="flex items-center gap-2"><span className="text-green-500 text-sm font-black">✓</span> Launch promotions</li>
              <li className="flex items-center gap-2"><span className="text-green-500 text-sm font-black">✓</span> Manage coupons</li>
              <li className="flex items-center gap-2"><span className="text-green-500 text-sm font-black">✓</span> Collaborate with creators</li>
              <li className="flex items-center gap-2 sm:col-span-2"><span className="text-green-500 text-sm font-black">✓</span> Access business insights</li>
            </ul>
          </div>
        </div>
      )}

      {claimStatus === 'pending' && (
        <div className="mt-8 bg-gray-50 border border-dashed border-gray-200 rounded-[5px] p-6 text-center max-w-2xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-300">
            <span className="text-amber-500 text-xs animate-pulse">●</span>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Ownership Verification Pending</span>
          </div>
          <p className="text-xs font-bold text-gray-500 leading-relaxed italic max-w-lg">
            A brand ownership claim application has been received for {brandName} and is currently undergoing premium administrative review. No public actions are pending.
          </p>
        </div>
      )}
    </div>
  );
}
