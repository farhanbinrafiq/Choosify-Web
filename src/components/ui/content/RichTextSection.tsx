import React from 'react';
import { cn } from '../../../lib/utils';

export interface RichTextSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const RichTextSection: React.FC<RichTextSectionProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      "prose prose-slate prose-lg max-w-none",
      "prose-headings:font-black prose-headings:text-[#000435] prose-headings:tracking-tight",
      "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:uppercase",
      "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
      "prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6",
      "prose-a:text-[#EB4501] prose-a:font-bold prose-a:no-underline hover:prose-a:underline",
      "prose-strong:font-black prose-strong:text-[#000435]",
      "prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-6",
      "prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-6",
      "prose-li:text-slate-600 prose-li:mb-2 prose-li:marker:text-slate-400",
      "prose-blockquote:border-l-4 prose-blockquote:border-[#EB4501] prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg",
      "prose-img:rounded-2xl prose-img:border prose-img:border-slate-100 prose-img:shadow-sm",
      "prose-hr:border-slate-200 prose-hr:my-8",
      "prose-code:text-[#EB4501] prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
      "prose-pre:bg-[#000435] prose-pre:text-slate-300 prose-pre:rounded-xl",
      className
    )}>
      {children}
    </div>
  );
};
