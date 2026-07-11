import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Megaphone, BarChart3, Lightbulb, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MarketingLayout() {
  const location = useLocation();
  const isStudio = location.pathname.includes('/marketing/studio') || location.pathname.includes('/marketing/spotlight');
  const isIntelligence = location.pathname.includes('/marketing/intelligence');
  const isOpportunity = location.pathname.includes('/marketing/opportunity');

  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <header className="bg-white border-b border-[#e8edf2] px-6 py-4">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/dashboard" className="text-gray-400 hover:text-[#E8500A]">Dashboard</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-bold text-navy">Marketing</span>
            {isStudio && (
              <>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="font-semibold text-[#E8500A] flex items-center gap-1">
                  <Megaphone size={14} /> Spotlight Publisher Studio
                </span>
              </>
            )}
            {isIntelligence && (
              <>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="font-semibold text-[#E8500A] flex items-center gap-1">
                  <BarChart3 size={14} /> Spotlight Intelligence
                </span>
              </>
            )}
            {isOpportunity && (
              <>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="font-semibold text-[#E8500A] flex items-center gap-1">
                  <Lightbulb size={14} /> Opportunity Center
                </span>
              </>
            )}
          </div>
          <nav className="flex gap-2" aria-label="Marketing sub-navigation">
            <Link
              to="/marketing/studio"
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-md border transition-colors',
                isStudio ? 'bg-[#E8500A] text-white border-[#E8500A]' : 'bg-white text-gray-500 border-[#e8edf2] hover:text-navy',
              )}
            >
              <Megaphone size={12} /> Publisher Studio
            </Link>
            <Link
              to="/marketing/intelligence"
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-md border transition-colors',
                isIntelligence ? 'bg-[#E8500A] text-white border-[#E8500A]' : 'bg-white text-gray-500 border-[#e8edf2] hover:text-navy',
              )}
            >
              <BarChart3 size={12} /> Spotlight Intelligence
            </Link>
            <Link
              to="/marketing/opportunity"
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-md border transition-colors',
                isOpportunity ? 'bg-[#E8500A] text-white border-[#E8500A]' : 'bg-white text-gray-500 border-[#e8edf2] hover:text-navy',
              )}
            >
              <Lightbulb size={12} /> Opportunity Center
            </Link>
          </nav>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
