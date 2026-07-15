import React from 'react';
import { Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../buttons/Button';
import { Badge } from '../badges/Badge';

export interface ComparisonProduct {
  name: string;
  image: string;
  score: number;
  price: string;
  specs: string[];
  badge?: string;
  badgeVariant?: 'default' | 'green' | 'blue' | 'purple' | 'orange' | 'red' | 'outline' | 'gray';
}

export interface ComparisonGuideCardProps {
  productA: ComparisonProduct;
  productB: ComparisonProduct;
  comparisonSummary?: string;
  keyDifferences?: string[];
  recommendation?: string;
  onProductClick?: (productName: string) => void;
  className?: string;
}

export const ComparisonGuideCard: React.FC<ComparisonGuideCardProps> = ({
  productA,
  productB,
  comparisonSummary,
  keyDifferences,
  recommendation,
  onProductClick,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-[#F8F9FC]">
        {[productA, productB].map((product, idx) => (
          <div key={idx} className="p-8 flex flex-col items-center text-center relative group">
            {product.badge && (
              <Badge variant={product.badgeVariant || (idx === 0 ? "orange" : "blue")} className="absolute top-6 left-6 z-10 shadow-sm px-3 py-1">
                {idx === 0 && <Trophy size={12} className="mr-1.5" />} {product.badge}
              </Badge>
            )}
            
            <div className="w-48 h-48 mb-6 relative">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
            </div>
            
            <h3 className="text-xl font-black text-[#000435] mb-2">{product.name}</h3>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-black text-[#FF5B00]">{product.price}</span>
              <span className="bg-slate-200/50 text-[#000435] text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
                ★ {product.score.toFixed(1)}
              </span>
            </div>

            <ul className="w-full space-y-3 mb-8 text-left">
              {product.specs.map((spec, sIdx) => (
                <li key={sIdx} className="text-xs font-semibold text-slate-600 flex items-start gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>

            <Button 
              className="w-full mt-auto" 
              variant={idx === 0 ? "primary" : "outline"} 
              onClick={() => onProductClick?.(product.name)}
            >
              View Details <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
        ))}
      </div>
      
      {(comparisonSummary || keyDifferences || recommendation) && (
        <div className="p-8 bg-white border-t border-slate-100 space-y-6">
          {comparisonSummary && (
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Verdict Summary</h4>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">{comparisonSummary}</p>
            </div>
          )}
          
          {keyDifferences && keyDifferences.length > 0 && (
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Key Differences</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {keyDifferences.map((diff, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF5B00] shrink-0 mt-1.5" />
                    <span className="text-xs font-bold text-slate-600">{diff}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendation && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
              <Trophy className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-1">Final Recommendation</h4>
                <p className="text-xs font-semibold text-emerald-700 leading-relaxed">{recommendation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
