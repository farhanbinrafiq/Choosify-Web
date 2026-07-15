import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface FAQAccordionCardProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export const FAQAccordionCard: React.FC<FAQAccordionCardProps> = ({
  question,
  answer,
  defaultOpen = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("bg-white border-b border-slate-100 last:border-0", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-sm font-bold text-[#000435] group-hover:text-[#FF5B00] transition-colors pr-4">
          {question}
        </span>
        <ChevronDown 
          className={cn(
            "w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300", 
            isOpen && "rotate-180 text-[#FF5B00]"
          )} 
        />
      </button>
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[500px] opacity-100 pb-4" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-xs font-medium text-slate-500 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};
