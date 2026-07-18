import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroContentProps {
  slideKey: string;
  children: React.ReactNode;
}

export function HeroContent({ slideKey, children }: HeroContentProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideKey}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
