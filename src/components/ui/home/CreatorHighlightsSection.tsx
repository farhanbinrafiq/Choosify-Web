import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { CreatorCard } from '../../../components/CreatorCard';
import { CREATORS } from '../../../data/creators';

export const CreatorHighlightsSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Top Creators</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Verified experts and reviewers</p>
        </div>
        <Link 
          to="/creators" 
          className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]"
        >
          VIEW ALL CREATORS <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CREATORS.slice(0, 4).map(creator => (
          <CreatorCard 
            key={creator.id} 
            creator={creator} 
            onClick={() => navigate(`/creator/${creator.id}`)}
          />
        ))}
      </div>
    </section>
  );
};
