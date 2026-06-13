import React from 'react';
import { CheckCircle2 } from 'lucide-react';

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
}

export function BrandOverviewSection({ brandName, overviewData }: BrandOverviewSectionProps) {
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
              <div className="w-8 h-8 rounded-xl bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                <CheckCircle2 size={16} fill="currentColor" className="text-[#E8500A] stroke-white" />
              </div>
              <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Shop Address & Links</h4>
            </div>
            <div className="text-xs text-gray-500 font-bold leading-relaxed space-y-2">
              <p className="uppercase">{overviewData.address}</p>
              <div>
                <span className="text-[#E8500A] font-black">WEBSITE:</span>{' '}
                <a href={`https://${overviewData.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#1A1D4E]">
                  {overviewData.website}
                </a>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <a href={overviewData.map} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-[#E8500A] uppercase tracking-wider hover:underline flex items-center gap-1">
              Open on Maps <span>➜</span>
            </a>
          </div>
        </div>

        {/* 2. Contact Information */}
        <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                <CheckCircle2 size={16} fill="currentColor" className="text-[#E8500A] stroke-white" />
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
              <div className="w-8 h-8 rounded-xl bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                <CheckCircle2 size={16} fill="currentColor" className="text-[#E8500A] stroke-white" />
              </div>
              <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Price & Audience</h4>
            </div>
            <div className="text-xs text-gray-500 font-bold leading-relaxed space-y-2">
              <p><span className="text-[#1A1D4E] font-black">BDT</span> - {overviewData.priceRange.replace('BDT - ', '')}</p>
              <p className="uppercase">{overviewData.ageRange}</p>
              <p className="uppercase text-[#E8500A]">{overviewData.audience}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* 4. Services & Specialties */}
        <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2.5 mb-4 border-b border-gray-200/50 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
              <CheckCircle2 size={16} fill="currentColor" className="text-[#E8500A] stroke-white" />
            </div>
            <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Services & Specialties</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {overviewData.services.map((srv, idx) => (
              <div key={idx} className="text-[10px] text-gray-600 font-bold uppercase tracking-wide flex items-start gap-2">
                <span className="text-[#E8500A] text-xs leading-none">•</span>
                <span>{srv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Best For #Tags */}
        <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2.5 mb-4 border-b border-gray-200/50 pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
              <CheckCircle2 size={16} fill="currentColor" className="text-[#E8500A] stroke-white" />
            </div>
            <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Best For #Tags</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {overviewData.tags.map((tag, idx) => (
              <span key={idx} className="text-[9px] font-black text-[#E8500A] bg-[#FFF0E8] px-3 py-1.5 rounded-full uppercase tracking-wider border border-[#E8500A]/5 select-none hover:scale-105 transition-transform duration-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
