import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SearchInput } from '../forms/Input';
import { Button } from '../buttons/Button';
import { Badge } from '../badges/Badge';
import { FilterChip } from '../navigation/FilterChip';

interface CompareSectionProps {
  onCompare?: (p1: string, p2: string) => void;
}

export const CompareSection: React.FC<CompareSectionProps> = ({ onCompare }) => {
  const navigate = useNavigate();
  const [compareFirst, setCompareFirst] = useState('');
  const [compareSecond, setCompareSecond] = useState('');

  const handleCompareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (compareFirst && compareSecond) {
      if (onCompare) {
        onCompare(compareFirst, compareSecond);
      } else {
        navigate(`/compare?p1=${encodeURIComponent(compareFirst)}&p2=${encodeURIComponent(compareSecond)}`);
      }
    }
  };

  const selectPopular = (p1: string, p2: string) => {
    setCompareFirst(p1);
    setCompareSecond(p2);
  };

  const popularComparisons = [
    { p1: 'Samsung S24 Ultra', p2: 'iPhone 15 Pro Max' },
    { p1: 'Sony WH-1000XM5', p2: 'Bose QC Ultra' },
    { p1: 'Sea Pearl Resort', p2: 'Radisson Blu' },
    { p1: 'MacBook Air M3', p2: 'Dell XPS 13' },
    { p1: 'PS5 Slim', p2: 'Xbox Series X' }
  ];

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Compare Anything</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Find the best by comparing side by side <Badge variant="orange" className="ml-2 font-extrabold">NEW</Badge>
          </p>
        </div>
        <Link 
          to="/compare" 
          className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]"
        >
          VIEW ALL COMPARISONS <ChevronRight size={14} />
        </Link>
      </div>
      
      <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-transparent">
        <form onSubmit={handleCompareSubmit} className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-1 w-full">
            <SearchInput 
              value={compareFirst}
              onChange={(e) => setCompareFirst(e.target.value)}
              placeholder="Search for first product" 
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 text-sm font-bold text-slate-900 border-none focus:ring-2 focus:ring-[#FF5B00] outline-none"
            />
          </div>
          
          <div className="w-10 h-10 rounded-full choosify-emi-gradient flex items-center justify-center font-black text-white shrink-0 uppercase text-xs">
            VS
          </div>
          
          <div className="relative flex-1 w-full">
            <SearchInput 
              value={compareSecond}
              onChange={(e) => setCompareSecond(e.target.value)}
              placeholder="Search for second product" 
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 text-sm font-bold text-slate-900 border-none focus:ring-2 focus:ring-[#FF5B00] outline-none"
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary"
            className="h-14 px-10 rounded-2xl choosify-emi-gradient text-white font-black uppercase tracking-wider text-sm hover:brightness-110 transition-all w-full md:w-auto shrink-0 shadow-md border-transparent"
          >
            Compare
          </Button>
        </form>
        
        <div className="mt-8">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Popular Comparisons</h4>
          <div className="flex flex-wrap gap-3">
            {popularComparisons.map((comp, idx) => (
              <FilterChip
                key={idx}
                onClick={() => selectPopular(comp.p1, comp.p2)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 border border-slate-100/50"
              >
                <span>{comp.p1}</span>
                <span className="text-[#FF5B00] mx-1">vs</span>
                <span>{comp.p2}</span>
              </FilterChip>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
