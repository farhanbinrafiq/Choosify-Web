import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';

interface HealthFactor {
  label: string;
  score: number;
}

interface SpotlightHealthCardProps {
  title: string;
  overallScore: number;
  factors: HealthFactor[];
  href?: string;
  className?: string;
}

export function SpotlightHealthCard({ title, overallScore, factors, href, className }: SpotlightHealthCardProps) {
  const body = (
    <div className={cn('bg-white border border-[#e8edf2] rounded-xl p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-navy uppercase">{title}</h3>
        <span className="text-2xl font-black text-[#E8500A]">{Math.round(overallScore)}</span>
      </div>
      <div className="space-y-2">
        {factors.map((f) => (
          <div key={f.label}>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span className="text-gray-500">{f.label}</span>
              <span className="font-bold text-navy">{f.score}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-navy/70 rounded-full" style={{ width: `${Math.min(100, f.score)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (href) return <Link to={href}>{body}</Link>;
  return body;
}
