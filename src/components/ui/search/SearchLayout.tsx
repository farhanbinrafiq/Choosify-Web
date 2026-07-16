import React from 'react';

interface SearchLayoutProps {
  hero: React.ReactNode;
  tabs?: React.ReactNode;
  children: React.ReactNode;
}

export const SearchLayout: React.FC<SearchLayoutProps> = ({ hero, tabs, children }) => {
  return (
    <div className="bg-choosify-feed min-h-screen text-[#1A1A2E] pb-24 font-sans antialiased">
      {hero}
      {tabs}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {children}
      </div>
    </div>
  );
};
