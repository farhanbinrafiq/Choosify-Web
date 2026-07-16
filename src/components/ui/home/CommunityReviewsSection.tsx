import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PublicReviewCard, ReviewData } from '../../../components/PublicReviewCard';

const COMMUNITY_REVIEWS: ReviewData[] = [
  {
    name: "Rahim Islam",
    time: "2 days ago",
    date: "12 Oct 2023",
    rating: 5,
    content: "The battery life is incredible and the camera quality exceeded my expectations. Delivery was super fast too. Highly recommended for anyone looking for a reliable daily driver.",
    helpful: 24,
    verified: true
  },
  {
    name: "Sadia Rahman",
    time: "1 week ago",
    date: "5 Oct 2023",
    rating: 4,
    content: "Been using this for a month now. The build quality is solid and the display is gorgeous. Only deducting one star because the charging speed could be a bit faster.",
    helpful: 15,
    verified: true
  },
  {
    name: "Kamrul Hasan",
    time: "2 weeks ago",
    date: "28 Sep 2023",
    rating: 5,
    content: "I was skeptical at first, but this completely won me over. The noise cancellation is top-tier and the comfort is unmatched. Worth every penny.",
    helpful: 42,
    verified: true
  }
];

export const CommunityReviewsSection: React.FC = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Community Reviews</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Real feedback from verified buyers</p>
        </div>
        <Link 
          to="/reviews" 
          className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501]"
        >
          VIEW ALL REVIEWS <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMMUNITY_REVIEWS.map((review, idx) => (
          <PublicReviewCard key={idx} review={review} />
        ))}
      </div>
    </section>
  );
};
