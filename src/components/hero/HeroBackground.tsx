import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface HeroBackgroundProps {
  slideKey: string;
  gradient?: string;
  className?: string;
}

export function HeroBackground({ slideKey, gradient, className }: HeroBackgroundProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={cn('absolute inset-0', className)}
        style={{
          background: gradient ?? 'linear-gradient(135deg, #1a0a2e 0%, #0f0c29 40%, #24243e 100%)',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(120,60,180,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a1f]/95 via-[#0a0a1f]/70 to-transparent" />
      </motion.div>
    </AnimatePresence>
  );
}
