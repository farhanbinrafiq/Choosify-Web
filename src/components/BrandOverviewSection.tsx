import React from 'react';
import { CheckCircle2, Users, HelpCircle, ShieldCheck } from 'lucide-react';
import { toast } from '../lib/notify';
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
    <div id="brand-overview-section" className="scroll-mt-36 w-full">
      <div className="mb-3.5 text-left">
        <h3 className="text-[15px] font-extrabold text-[#1A1A2E] tracking-tight mb-0.5">
          BRAND OVERVIEW
        </h3>
        <p className="text-[11.5px] text-[#9AA0AC] m-0">
          About {brandName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-8 text-left">
        {/* 1. Address & Links */}
        <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#EB4501] flex items-center justify-center">
                <CheckCircle2 size={16} fill="currentColor" className="text-[#EB4501] stroke-white" />
              </div>
              <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">Shop Address & Links</h4>
            </div>
            <div className="text-[11.5px] text-[#6B7280] font-semibold leading-relaxed space-y-2">
              <p className="uppercase text-[#1A1A2E]">{overviewData.address}</p>
              <div>
                <span className="text-[#EB4501] font-extrabold">WEBSITE:</span>{' '}
                <a href={`https://${overviewData.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#1A1A2E]">
                  {overviewData.website}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#F1F1F3]">
            <a href={overviewData.map} target="_blank" rel="noopener noreferrer" className="text-[10.5px] font-extrabold text-[#EB4501] uppercase tracking-wider hover:underline flex items-center gap-1">
              Open on Maps <span>➜</span>
            </a>
          </div>
        </div>

        {/* 2. Contact Information */}
        <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#EB4501] flex items-center justify-center">
                <CheckCircle2 size={16} fill="currentColor" className="text-[#EB4501] stroke-white" />
              </div>
              <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">Contact Informations</h4>
            </div>
            <div className="text-[11.5px] text-[#6B7280] font-semibold leading-relaxed space-y-3">
              <p className="flex items-center gap-2 truncate"><span className="text-[#1A1A2E] font-extrabold">EMAIL:</span> {overviewData.email}</p>
              <p className="flex items-center gap-2"><span className="text-[#1A1A2E] font-extrabold">PHONE:</span> {overviewData.phone}</p>
            </div>
          </div>
        </div>

        {/* 3. Price Range & Audience */}
        <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#EB4501] flex items-center justify-center">
                <CheckCircle2 size={16} fill="currentColor" className="text-[#EB4501] stroke-white" />
              </div>
              <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">Price & Audience</h4>
            </div>
            <div className="text-[11.5px] text-[#6B7280] font-semibold leading-relaxed space-y-2">
              <p><span className="text-[#1A1A2E] font-extrabold">BDT</span> - {overviewData.priceRange.replace('BDT - ', '')}</p>
              <p className="uppercase text-[#1A1A2E]">{overviewData.ageRange}</p>
              <p className="uppercase text-[#EB4501]">{overviewData.audience}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left">
        {/* 4. Services & Specialties */}
        <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2]">
          <div className="flex items-center gap-2.5 mb-4 border-b border-[#F1F1F3] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#EB4501] flex items-center justify-center">
              <CheckCircle2 size={16} fill="currentColor" className="text-[#EB4501] stroke-white" />
            </div>
            <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">Services & Specialties</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {overviewData.services.map((srv, idx) => (
              <div key={idx} className="text-[10.5px] text-[#6B7280] font-semibold uppercase tracking-wide flex items-start gap-2">
                <span className="text-[#EB4501] text-xs leading-none">•</span>
                <span>{srv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Best For #Tags */}
        <div className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2]">
          <div className="flex items-center gap-2.5 mb-4 border-b border-[#F1F1F3] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#EB4501] flex items-center justify-center">
              <CheckCircle2 size={16} fill="currentColor" className="text-[#EB4501] stroke-white" />
            </div>
            <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A00C4]">Best For #Tags</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {overviewData.tags.map((tag, idx) => (
              <span key={idx} className="choosify-best-for-tag text-[9px] font-extrabold px-3 py-1.5 rounded-md uppercase tracking-wider border select-none">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Dynamic Custom Overviews */}
      {brandCustoms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left mt-3.5">
          {brandCustoms.map((co, idx) => (
            <div key={idx} className="bg-white rounded-[10px] p-[18px] border border-[#E8EDF2]">
              <div className="flex items-center gap-2.5 mb-4 border-b border-[#F1F1F3] pb-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF3EA] text-[#EB4501] flex items-center justify-center">
                  <CheckCircle2 size={16} fill="currentColor" className="text-[#EB4501] stroke-white" />
                </div>
                <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wider">{co.sectionName}</h4>
              </div>
              <div className="space-y-2.5">
                {co.content.map((bullet, bIdx) => (
                  <div key={bIdx} className="text-[10.5px] text-[#6B7280] font-semibold uppercase tracking-wide flex items-start gap-2">
                    <span className="text-[#EB4501] text-xs leading-none">•</span>
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
        <div className="mt-8 bg-white border border-dashed border-[#E8EDF2] rounded-[10px] p-6 text-center max-w-2xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 bg-[#FFF3EA] px-3 py-1 rounded-md border border-[#FFD8B8]">
            <span className="text-[#EB4501] text-xs font-bold font-mono">ℹ</span>
            <span className="text-[10px] font-extrabold text-[#EB4501] uppercase tracking-wider">Community Profile State</span>
          </div>
          <p className="text-xs font-semibold text-[#6B7280] leading-relaxed italic max-w-lg">
            This brand profile contains publicly available information curated by Choosify. This profile has not yet been claimed by an authorized brand representative.
          </p>
          
          <button 
            type="button"
            onClick={() => {
              toast.success("Ownership claim application received for " + brandName + "! Our merchant onboarding team will perform necessary verifications relative to this brand representative request and notify you shortly.", { duration: 5000 });
            }}
            className="bg-[#EB4501] hover:bg-[#CF4400] text-white py-3 px-8 rounded-lg uppercase text-[11px] font-extrabold tracking-widest transition-all active:scale-95 select-none border-0 cursor-pointer"
          >
            Claim Brand Ownership
          </button>
          
          <div className="bg-[#F4F7F9] border border-[#E8EDF2] rounded-[10px] p-5 text-left w-full mt-2">
            <h4 className="text-[10px] font-extrabold text-[#1A1A2E] uppercase tracking-widest mb-3.5 border-b border-[#E8EDF2] pb-2 flex items-center gap-1.5">
              <span className="text-[#EB4501]">✦</span> Claim ownership to:
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10px] text-[#6B7280] font-semibold uppercase tracking-wider">
              <li className="flex items-center gap-2"><span className="text-[#07DD05] text-sm font-black">✓</span> Add products</li>
              <li className="flex items-center gap-2"><span className="text-[#07DD05] text-sm font-black">✓</span> Launch promotions</li>
              <li className="flex items-center gap-2"><span className="text-[#07DD05] text-sm font-black">✓</span> Manage coupons</li>
              <li className="flex items-center gap-2"><span className="text-[#07DD05] text-sm font-black">✓</span> Collaborate with creators</li>
              <li className="flex items-center gap-2 sm:col-span-2"><span className="text-[#07DD05] text-sm font-black">✓</span> Access business insights</li>
            </ul>
          </div>
        </div>
      )}

      {claimStatus === 'pending' && (
        <div className="mt-8 bg-white border border-dashed border-[#E8EDF2] rounded-[10px] p-6 text-center max-w-2xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
            <span className="text-amber-500 text-xs animate-pulse">●</span>
            <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">Ownership Verification Pending</span>
          </div>
          <p className="text-xs font-semibold text-[#6B7280] leading-relaxed italic max-w-lg">
            A brand ownership claim application has been received for {brandName} and is currently undergoing premium administrative review. No public actions are pending.
          </p>
        </div>
      )}
    </div>
  );
}
