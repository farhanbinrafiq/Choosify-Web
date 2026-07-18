import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function Accordion({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className=" rounded-xl overflow-hidden mb-4 bg-white hover:shadow-soft transition-shadow">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-white focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#000435] text-lg">{title}</span>
        </div>
        <div className={cn("w-8 h-8 rounded-full bg-body-bg flex items-center justify-center transition-transform duration-300", isOpen && "rotate-180")}>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L13 1" stroke="#000435" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-5 pt-0 ">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Evaluations = ({ evaluations }: { evaluations: any[] }) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">DETAIL EVALUATION</h2>
      <div className="space-y-1">
        {evaluations.map((evalItem, idx) => (
          <Accordion key={evalItem.id} title={evalItem.title} defaultOpen={idx === 0}>
            <p className="text-slate-600 font-medium leading-relaxed">{evalItem.content}</p>
          </Accordion>
        ))}
      </div>
    </div>
  );
};
