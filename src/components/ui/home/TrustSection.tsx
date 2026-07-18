import React from 'react';
import { Shield, CheckCircle, Search, Star, Users } from 'lucide-react';
import { TrustStatementCard, TrustStatement } from '../trust/TrustStatementCard';
import { TrustScoreCard } from '../trust/TrustScoreCard';

const TRUST_STATEMENTS: TrustStatement[] = [
  {
    icon: Shield,
    title: "Verified Products & Brands",
    description: "Every product and brand on Choosify undergoes strict verification to ensure authenticity."
  },
  {
    icon: CheckCircle,
    title: "Independent Reviews",
    description: "Reviews are from verified buyers and independent creators, ensuring unbiased feedback."
  },
  {
    icon: Search,
    title: "Transparent Rankings",
    description: "Our rankings are based on genuine user data and are not influenced by sponsorships."
  },
  {
    icon: Star,
    title: "AI Moderation",
    description: "We use advanced AI to filter out fake reviews and maintain a high-quality community."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by shoppers, for shoppers. Our community drives the conversation."
  }
];

export const TrustSection: React.FC = () => {
  return (
    <section className="py-12">
      <div className="flex flex-col items-center mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">The Choosify Trust Layer</h2>
        <p className="text-slate-500 font-medium mt-4 max-w-2xl">
          We believe in complete transparency. Our ecosystem is designed to help you make informed decisions with confidence.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TrustStatementCard statements={TRUST_STATEMENTS} />
        </div>
        <div className="lg:col-span-1">
          <TrustScoreCard 
            overallScore={98} 
            categories={[
              { label: "Product Authenticity", score: 99 },
              { label: "Review Reliability", score: 97 },
              { label: "Seller Trust", score: 98 }
            ]} 
          />
        </div>
      </div>
    </section>
  );
};
