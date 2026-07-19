import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CreatorReview } from './CreatorReviewCard';

interface Props {
  review: CreatorReview | null;
  onClose: () => void;
}

export function VideoModal({ review, onClose }: Props) {
  if (!review) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10"
        onClick={onClose}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors border border-white/20"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Simulated Video Player */}
          <div className="absolute inset-0 flex items-center justify-center group cursor-pointer">
            <img src={review.cover} alt={review.title} className="w-full h-full object-cover opacity-60" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Video Controls / UI overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">{review.title}</h2>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-3">
                  <img src={review.creator.avatar} className="w-10 h-10 rounded-full border-2 border-white" alt="" />
                  <span className="font-bold text-lg">{review.creator.name}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <span className="font-bold uppercase tracking-wider">{review.views} Views</span>
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[#EB4501] rounded-full flex items-center justify-center border-4 border-white/20 group-hover:scale-110 transition-transform shadow-2xl">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
