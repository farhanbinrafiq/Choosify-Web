import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { EmiAiLogo } from '../components/EmiAiLogo';
import { LoadingFallback } from '../components/LoadingFallback';

const EmiChatPanel = lazy(() =>
  import('../components/EmiChatPanel').then((module) => ({ default: module.EmiChatPanel })),
);

export function EmiPage() {
  return (
    <div className="min-h-screen bg-choosify-feed flex flex-col">
      <div className="w-full px-5 sm:px-10 pt-4">
        <header className="max-w-3xl mx-auto choosify-dark-surface text-white px-5 sm:px-10 py-8 rounded-none overflow-hidden text-center">
          <p className="text-[11px] font-bold text-[#EB4501] tracking-wide mb-2 inline-flex items-center justify-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-0.5">
              <EmiAiLogo size={28} />
            </span>
            Choosify Assistant
          </p>
          <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight mb-2">
            Chat with Emi
          </h1>
          <p className="text-[13px] text-white/55 max-w-lg mx-auto m-0">
            Product discovery, deal tips, and comparison guidance — grounded in Choosify listings.
          </p>
          <p className="mt-3 text-[12px] text-white/40">
            Or go back to{' '}
            <Link to="/" className="text-[#EB4501] font-semibold hover:underline">
              Home
            </Link>
          </p>
        </header>
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 md:py-8">
        <div className="h-[min(70vh,720px)] rounded-xl border border-[#E8EDF2] bg-white shadow-sm overflow-hidden flex flex-col">
          <Suspense fallback={<LoadingFallback />}>
            <EmiChatPanel variant="page" className="h-full" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
