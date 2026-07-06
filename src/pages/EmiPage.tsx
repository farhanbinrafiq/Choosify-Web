import React from 'react';
import { PageHeroHeader } from '../components/PageHeroHeader';
import { EmiChatPanel } from '../components/EmiChatPanel';
import { ChoosifyIconLogo } from '../components/ChoosifyIconLogo';

export function EmiPage() {
  return (
    <div className="min-h-screen bg-choosify-feed flex flex-col">
      <PageHeroHeader variant="gradient" className="px-6 py-10">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#E8500A] mb-2 flex items-center justify-center gap-2">
            <ChoosifyIconLogo size={22} className="w-[22px] h-[22px]" />
            Choosify Assistant
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
            Chat with Emi
          </h1>
          <p className="text-sm text-white/60 max-w-lg mx-auto">
            Product discovery, deal tips, and comparison guidance — grounded in Choosify listings.
          </p>
        </div>
      </PageHeroHeader>

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 md:py-8">
        <div className="h-[min(70vh,720px)] rounded-[5px] border border-[#e8edf2] bg-white shadow-sm overflow-hidden flex flex-col">
          <EmiChatPanel variant="page" className="h-full" />
        </div>
      </div>
    </div>
  );
}
