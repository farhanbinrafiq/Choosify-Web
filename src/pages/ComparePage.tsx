import React, { lazy, Suspense } from 'react';
import { Share2, Heart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { LoadingFallback } from '../components/LoadingFallback';
import { useDashboard } from '../context/DashboardContext';

const CompareEngine = lazy(() =>
  import('../components/CompareEngine').then((module) => ({ default: module.CompareEngine })),
);

export function ComparePage() {
  const { setComparedProducts } = useDashboard() || {};

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Choosify Compare', url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success('Comparison link copied');
    } catch {
      toast.error('Unable to share right now');
    }
  };

  const handleSave = () => {
    toast.success('Comparison saved to your list');
  };

  const handleClearAll = () => {
    if (setComparedProducts) {
      setComparedProducts([]);
      toast.success('Comparison cleared');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      <main className="w-full max-w-[1400px] mx-auto px-5 sm:px-10 py-6 pb-[60px]">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#1A1A2E] mb-1.5 leading-tight">
              Compare Products
            </h1>
            <p className="text-[13px] text-[#9AA0AC]">
              Compare features, prices, reviews and find the best choice for you.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 bg-white border border-[#E8EDF2] text-[#1A1A2E] px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer hover:border-[#D1D5DB] transition-colors"
            >
              <Share2 size={14} aria-hidden />
              Share Comparison
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 bg-white border border-[#E8EDF2] text-[#1A1A2E] px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer hover:border-[#D1D5DB] transition-colors"
            >
              <Heart size={14} className="text-[#EB4501]" strokeWidth={2} aria-hidden />
              Save Comparison
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 bg-white border border-[#FCA5A5] text-[#FF000D] px-4 py-2.5 rounded-lg text-xs font-bold cursor-pointer hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} aria-hidden />
              Clear All
            </button>
          </div>
        </div>

        <Suspense fallback={<LoadingFallback />}>
          <CompareEngine />
        </Suspense>
      </main>
    </div>
  );
}
