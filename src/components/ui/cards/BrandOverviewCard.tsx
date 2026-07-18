import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Check, ShieldCheck, Award, Lock, Globe, Headset, HelpCircle } from 'lucide-react';
import { FAQAccordionCard } from '../faq/FAQAccordionCard';
import { FAQPill } from '../faq/FAQPill';


export interface BrandOverviewCardProps {
  brand: any;
  overviewDetails: any;
  accentColor: string;
  className?: string;
}

export const BrandOverviewCard: React.FC<BrandOverviewCardProps> = ({ brand, overviewDetails, accentColor, className }) => {
  const [activeFaqCategory, setActiveFaqCategory] = useState('All');
  
  const faqCategories = ['All', 'Warranty', 'Shipping', 'Returns'];

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-8", className)}>
      <div className="lg:col-span-2 bg-white border border-[#EEF2F7] rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-black text-[#050B2C] uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
            <ShieldCheck size={18} style={{ color: accentColor }} />
            <span>Brand Heritage & Story</span>
          </h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mt-5">
            {overviewDetails.story}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#F5F8FD] rounded-2xl p-4 border border-[#EEF2F7]">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-orange-500">
                <Globe size={16} />
              </div>
              <h4 className="text-xs font-black text-[#050B2C] uppercase tracking-tight">Global Reach</h4>
              <p className="text-[10px] text-gray-500 font-bold mt-1">Available in {overviewDetails.globalReach || "40+"} countries</p>
            </div>
            <div className="bg-[#F5F8FD] rounded-2xl p-4 border border-[#EEF2F7]">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-emerald-500">
                <ShieldCheck size={16} />
              </div>
              <h4 className="text-xs font-black text-[#050B2C] uppercase tracking-tight">Authenticity</h4>
              <p className="text-[10px] text-gray-500 font-bold mt-1">100% Genuine Certified</p>
            </div>
            <div className="bg-[#F5F8FD] rounded-2xl p-4 border border-[#EEF2F7]">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm text-blue-500">
                <Headset size={16} />
              </div>
              <h4 className="text-xs font-black text-[#050B2C] uppercase tracking-tight">Official Support</h4>
              <p className="text-[10px] text-gray-500 font-bold mt-1">Priority Warranty Access</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#050B2C] border border-[#0A103D] rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Award size={120} />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 mb-4 relative z-10">
            <Award size={16} className="text-[#FF9F00]" />
            <span>Key Achievements</span>
          </h3>
          <ul className="space-y-3 relative z-10">
            {(overviewDetails.awards || overviewDetails.achievements || []).map((ach: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2.5">
                <div className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                <span className="text-[11px] font-bold text-gray-300 leading-snug">{ach}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-[#050B2C] uppercase tracking-wider flex items-center gap-2 mb-4">
            <Lock size={16} style={{ color: accentColor }} />
            <span>Certifications</span>
          </h3>
          <div className="space-y-3">
            {(overviewDetails.certifications || []).map((cert: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                  <Check size={10} className="text-emerald-500 stroke-[3px]" />
                </div>
                <span className="text-xs font-black text-gray-700">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      
      <div className="lg:col-span-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-black text-[#050B2C] uppercase tracking-wider flex items-center gap-2">
            <HelpCircle size={18} style={{ color: accentColor }} />
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {faqCategories.map(cat => (
              <FAQPill 
                key={cat} 
                label={cat} 
                isActive={activeFaqCategory === cat} 
                onClick={() => setActiveFaqCategory(cat)} 
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {(brand.faqs || overviewDetails.faqs || []).map((faq: any, idx: number) => (
            <FAQAccordionCard key={idx} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>

    </div>
  );
};
