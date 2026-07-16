import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SpotlightCard } from '../../../components/SpotlightCard';

interface SpotlightSectionProps {
  cards: any[];
}

export const SpotlightSection: React.FC<SpotlightSectionProps> = ({ cards }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Trending in Spotlight</h2>
          <span className="text-xs font-semibold text-slate-400 ml-2">Powered by Choosify Spotlight</span>
        </div>
        <Link 
          to="/discover" 
          className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]"
        >
          VIEW ALL SPOTLIGHT <ChevronRight size={14} />
        </Link>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide">
        {cards.map((card) => (
          <SpotlightCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
};
