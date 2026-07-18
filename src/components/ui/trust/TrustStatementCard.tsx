import React from 'react';
import { cn } from '../../../lib/utils';
import { ShieldCheck } from 'lucide-react';

export interface TrustStatement {
  icon?: React.ElementType;
  title: string;
  description: string;
}

export interface TrustStatementCardProps {
  statements: TrustStatement[];
  title?: string;
  className?: string;
}

export const TrustStatementCard: React.FC<TrustStatementCardProps> = ({
  statements,
  title = "Choosify Trust Statement",
  className
}) => {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-100 p-6 flex flex-col", className)}>
      {title && (
        <h3 className="text-sm font-black text-[#000435] uppercase tracking-wider mb-6">
          {title}
        </h3>
      )}
      <div className="flex-1 space-y-6">
        {statements.map((statement, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-1">
              {statement.icon ? (
                <statement.icon className="w-4 h-4 text-[#07D005]" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-[#07D005]" />
              )}
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-extrabold text-[#000435] mb-1">{statement.title}</h4>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                {statement.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
