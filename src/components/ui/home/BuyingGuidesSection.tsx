import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SpotlightCard } from '../../../components/SpotlightCard';

interface BuyingGuidesSectionProps {
  guides: any[];
}

export const BuyingGuidesSection: React.FC<BuyingGuidesSectionProps> = ({ guides }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Buying Guides</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Expert guides to help you decide</p>
        </div>
        <Link 
          to="/guides" 
          className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]"
        >
          VIEW ALL GUIDES <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {guides.map((guide) => (
          <SpotlightCard 
            key={guide.id} 
            variant="standard" 
            title={guide.title}
            image={guide.image}
            desc={guide.desc}
            badge="BUYING GUIDE"
            badgeBg="bg-blue-600"
          />
        ))}
      </div>
    </section>
  );
};
