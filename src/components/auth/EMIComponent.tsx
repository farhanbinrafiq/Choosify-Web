import React from 'react';
import { motion } from 'motion/react';

export const EMIComponent = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-12 left-12 z-50 flex items-end gap-6"
    >
      <div className="relative">
        {/* EMI Mascot */}
        <div className="w-40 h-40 bg-white/10 rounded-full flex items-center justify-center border-4 border-white/20 backdrop-blur-sm">
          <span className="text-white text-4xl font-bold">EMI</span>
        </div>
      </div>
      
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white rounded-[24px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] max-w-xs"
      >
        <h4 className="text-[#000435] font-bold text-lg mb-1">Hi! I'm EMI 👋</h4>
        <p className="text-[#61667C] text-sm mb-4">Your AI Shopping Assistant. I can help you discover products, compare brands, and more.</p>
        <button className="bg-[#000435] text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-[#0A0A1F] transition-all w-full">
          Chat with EMI
        </button>
      </motion.div>
    </motion.div>
  );
};
