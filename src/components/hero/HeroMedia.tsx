import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface HeroMediaProps {
  slideKey: string;
  image?: string;
  className?: string;
}

export function HeroMedia({ slideKey, image, className }: HeroMediaProps) {
  return (
    <div className={cn('relative flex items-center justify-center min-h-[280px] md:min-h-[360px] lg:min-h-[420px]', className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`media-${slideKey}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-[520px] mx-auto"
        >
          {image ? (
            <img
              src={image}
              alt=""
              className="w-full h-auto max-h-[420px] object-contain drop-shadow-2xl"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          ) : (
            <div className="aspect-[4/5] rounded-none bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
