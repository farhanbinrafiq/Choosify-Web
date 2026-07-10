import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Megaphone, ChevronRight } from 'lucide-react';

export function MarketingLayout() {
  const location = useLocation();
  const isCampaigns = location.pathname.includes('/marketing/spotlight');

  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <header className="bg-white border-b border-[#e8edf2] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/dashboard" className="text-gray-400 hover:text-[#E8500A]">Dashboard</Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="font-bold text-navy">Marketing</span>
          {isCampaigns && (
            <>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="font-semibold text-[#E8500A] flex items-center gap-1">
                <Megaphone size={14} /> Spotlight Campaigns
              </span>
            </>
          )}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
