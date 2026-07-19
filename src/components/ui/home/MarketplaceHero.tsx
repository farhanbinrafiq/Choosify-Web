import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../buttons/Button';
import { HERO_SLIDES } from '../../../data/homeData';

interface MarketplaceHeroProps {
  onCta1Click?: (slideIndex: number) => void;
  onCta2Click?: (slideIndex: number) => void;
}

export const MarketplaceHero: React.FC<MarketplaceHeroProps> = ({
  onCta1Click,
  onCta2Click
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide(s => s === 0 ? HERO_SLIDES.length - 1 : s - 1);
  };

  const handleNext = () => {
    setCurrentSlide(s => (s + 1) % HERO_SLIDES.length);
  };

  return (
    <section className="relative w-full h-[760px] choosify-dark-surface overflow-hidden flex items-center">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,10,31,0.96)] via-[rgba(10,10,31,0.85)] to-transparent z-10" />
      
      {/* Navigation Arrows */}
      <Button 
        variant="ghost"
        size="icon"
        onClick={handlePrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white border border-transparent transition-all z-30"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Button 
        variant="ghost"
        size="icon"
        onClick={handleNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white border border-transparent transition-all z-30"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 relative z-20 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-2 gap-12 items-center w-full"
          >
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
                {HERO_SLIDES[currentSlide].title} <br/>
                <span className="text-[#FF5B00]">{HERO_SLIDES[currentSlide].highlight}</span>
              </h1>
              <p className="text-lg text-white/70 font-medium leading-relaxed mb-10 max-w-xl">
                {HERO_SLIDES[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button 
                  onClick={() => onCta1Click?.(currentSlide)} 
                  className="px-8 py-4 bg-[#FF5B00] hover:bg-[#EB4501] text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-[0_0_20px_rgba(255,91,0,0.3)] border-transparent"
                >
                  {HERO_SLIDES[currentSlide].cta1}
                </Button>
                <Button 
                  onClick={() => onCta2Click?.(currentSlide)} 
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold uppercase tracking-wider text-sm transition-all"
                >
                  {HERO_SLIDES[currentSlide].cta2}
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:flex justify-end relative h-[500px]">
              {/* Simulated floating images */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="absolute right-[20%] top-0 w-[300px] h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 rotate-[-5deg]"
              >
                <img src={HERO_SLIDES[currentSlide].imageLeft} className="w-full h-full object-cover" alt="" />
              </motion.div>
              <motion.div 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 20, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute right-0 top-[10%] w-[280px] h-[380px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 rotate-[5deg]"
              >
                <img src={HERO_SLIDES[currentSlide].imageRight} className="w-full h-full object-cover" alt="" />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        {HERO_SLIDES.map((_, i) => (
          <Button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-2 p-0 min-w-0 min-h-0 border-none rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-[#FF5B00]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
};
