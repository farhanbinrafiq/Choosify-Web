import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqPillProps {
  label: string;
  answer: string;
  icon?: React.ReactNode;
}

export function FaqPill({ label, answer, icon }: FaqPillProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="inline-block max-w-sm m-1 text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-[#000435] text-xs font-bold hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
      >
        {icon || <HelpCircle size={14} className="text-[#FF5B00]" />}
        <span>{label}</span>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#FF5B00]' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="mt-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-lg text-slate-600 text-xs font-medium leading-relaxed max-w-xs z-50 relative"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
