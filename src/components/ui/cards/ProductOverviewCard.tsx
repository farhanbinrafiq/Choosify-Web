import React from 'react';
import { cn } from '../../../lib/utils';

export interface OverviewSection {
  title?: string;
  content?: string | React.ReactNode;
  image?: string;
  features?: string[];
  callout?: {
    title: string;
    label?: string;
    content: string | React.ReactNode;
    type?: 'default' | 'primary' | 'secondary' | 'warning' | 'info';
  };
}

export interface ProductOverviewCardProps {
  title?: string;
  summary?: string | React.ReactNode;
  sections?: OverviewSection[];
  media?: string[];
  className?: string;
}

export const ProductOverviewCard: React.FC<ProductOverviewCardProps> = ({
  title = "Product Overview",
  summary,
  sections,
  media,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-2xl border border-slate-100 p-6 md:p-8 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.03)]", className)}>
      {title && (
        <h3 className="text-sm font-black text-[#000435] uppercase tracking-wider mb-6">
          {title}
        </h3>
      )}
      
      {summary && (
        <div className="prose prose-sm sm:prose-base prose-slate max-w-none mb-8 text-slate-600 font-medium leading-relaxed">
          {typeof summary === 'string' ? <p>{summary}</p> : summary}
        </div>
      )}

      {sections && sections.length > 0 && (
        <div className="space-y-10">
          {sections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-5">
              {section.title && (
                <h4 className="text-lg font-extrabold text-[#000435]">{section.title}</h4>
              )}
              
              {section.image && (
                <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                  <img src={section.image} alt={section.title || "Overview"} className="w-full h-auto object-cover" />
                </div>
              )}
              
              {section.content && (
                <div className="prose prose-sm sm:prose-base prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
                  {typeof section.content === 'string' ? <p>{section.content}</p> : section.content}
                </div>
              )}
              
              {section.features && section.features.length > 0 && (
                <ul className="list-disc pl-5 space-y-2 text-sm font-medium text-slate-600">
                  {section.features.map((feature, fIdx) => (
                    <li key={fIdx}>{feature}</li>
                  ))}
                </ul>
              )}

              {section.callout && (
                <div className={cn(
                  "p-5 rounded-2xl border",
                  section.callout.type === 'warning' ? "bg-amber-50 border-amber-100" :
                  section.callout.type === 'info' ? "bg-blue-50 border-blue-100" :
                  "bg-slate-50 border-slate-100"
                )}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h4 className="text-[#000435] font-extrabold text-sm uppercase tracking-wider">
                      {section.callout.title}
                    </h4>
                    {section.callout.label && (
                      <span className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider",
                        section.callout.type === 'warning' ? "bg-amber-100 text-amber-700" :
                        section.callout.type === 'info' ? "bg-blue-100 text-blue-700" :
                        "bg-slate-200 text-slate-700"
                      )}>
                        {section.callout.label}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 font-medium text-sm leading-relaxed">
                    {typeof section.callout.content === 'string' ? <p>{section.callout.content}</p> : section.callout.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {media && media.length > 0 && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {media.map((item, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
               <img src={item} alt="Product media" className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
