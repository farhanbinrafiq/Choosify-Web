import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { DcHomeBlock } from './DcHomePanel';
import { ViewAllLink } from '../design/ViewAllLink';

interface CompareHeroProps {
  trendingComparisons?: { label: string; href: string }[];
  className?: string;
}

/** Choosify.dc.html — Compare Anything row: input | VS | input | COMPARE */
export function CompareHero({ className }: CompareHeroProps) {
  const navigate = useNavigate();
  const { allCatalogProducts } = useGlobalState();
  const [queryA, setQueryA] = useState('');
  const [queryB, setQueryB] = useState('');

  const resolveProduct = (q: string) => {
    const term = q.trim().toLowerCase();
    if (!term) return undefined;
    return allCatalogProducts.find(
      (p) => p.title.toLowerCase().includes(term) || p.brandName?.toLowerCase().includes(term),
    );
  };

  const handleCompare = () => {
    const a = resolveProduct(queryA);
    const b = resolveProduct(queryB);
    if (a && b) {
      navigate(`/compare?ids=${a.id},${b.id}`);
      return;
    }
    navigate(`/compare?q=${encodeURIComponent(queryA)}&q2=${encodeURIComponent(queryB)}`);
  };

  return (
    <div className={className}>
      <div className="bg-white rounded-none p-7 border border-[#E8EDF2]">
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h2 className="text-[17px] font-extrabold text-[#1A1A2E]">Compare Anything</h2>
          <ViewAllLink href="/compare" label="VIEW ALL COMPARISONS ›" />
        </div>
        <p className="text-[12.5px] text-[#9AA0AC] m-0 mb-[18px]">
          Find the best by comparing side by side
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 min-w-0">
          <input
            placeholder="Search for first product"
            value={queryA}
            onChange={(e) => setQueryA(e.target.value)}
            className="flex-1 min-w-0 sm:min-w-[140px] h-11 rounded-lg border border-[#E5E7EB] px-4 text-[13px] outline-none focus:border-[#EB4501]"
          />
          <div className="w-[34px] h-[34px] rounded-full choosify-emi-gradient text-white text-[11px] font-extrabold flex items-center justify-center shrink-0 self-center">
            VS
          </div>
          <input
            placeholder="Search for second product"
            value={queryB}
            onChange={(e) => setQueryB(e.target.value)}
            className="flex-1 min-w-0 sm:min-w-[140px] h-11 rounded-lg border border-[#E5E7EB] px-4 text-[13px] outline-none focus:border-[#EB4501]"
          />
          <button
            type="button"
            onClick={handleCompare}
            className="choosify-emi-gradient text-white border-none px-7 h-11 rounded-lg text-xs font-bold cursor-pointer shrink-0 hover:brightness-110 transition-all"
          >
            COMPARE
          </button>
        </div>
      </div>
    </div>
  );
}

export function HomeCompareSection() {
  return (
    <DcHomeBlock id="section-compare">
      <CompareHero />
    </DcHomeBlock>
  );
}
