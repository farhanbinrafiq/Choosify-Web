import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import type { SpotlightHeroCarouselItem } from '../../utils/spotlightHeroCarousel';

interface SpotlightHeroCarouselProps {
  items: SpotlightHeroCarouselItem[];
  carouselIndex: number;
  setCarouselIndex: React.Dispatch<React.SetStateAction<number>>;
}

/** Provider-agnostic hero carousel ΓÇö reused from Trending Brands visual design (CTO) */
export function SpotlightHeroCarousel({
  items,
  carouselIndex,
  setCarouselIndex,
}: SpotlightHeroCarouselProps) {
  const navigate = useNavigate();
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setViewportSize('mobile');
      else if (w < 1024) setViewportSize('tablet');
      else setViewportSize('desktop');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!items.length) return null;

  const TOTAL = items.length;
  const getIdx = (offset: number) => (carouselIndex + offset + TOTAL * 10) % TOTAL;

  type SlotPosition = 'farPrev' | 'prev' | 'active' | 'next';

  const slots: { item: SpotlightHeroCarouselItem; position: SlotPosition }[] =
    viewportSize === 'mobile'
      ? [{ item: items[getIdx(0)], position: 'active' }]
      : viewportSize === 'tablet'
        ? [
            { item: items[getIdx(-1)], position: 'prev' },
            { item: items[getIdx(0)], position: 'active' },
            { item: items[getIdx(1)], position: 'next' },
          ]
        : [
            { item: items[getIdx(-2)], position: 'farPrev' },
            { item: items[getIdx(-1)], position: 'prev' },
            { item: items[getIdx(0)], position: 'active' },
            { item: items[getIdx(1)], position: 'next' },
          ];

  const flexMap: Record<SlotPosition, number> =
    viewportSize === 'tablet'
      ? { farPrev: 0, prev: 2.4, active: 7.2, next: 1.6 }
      : { farPrev: 1.05, prev: 2.35, active: 7.4, next: 1.55 };

  const opacityMap: Record<SlotPosition, number> =
    viewportSize === 'tablet'
      ? { farPrev: 0, prev: 0.76, active: 1, next: 0.62 }
      : { farPrev: 0.42, prev: 0.74, active: 1, next: 0.58 };

  const trackHeight =
    viewportSize === 'mobile' ? '360px' : viewportSize === 'tablet' ? '440px' : '500px';

  const goNext = () => setCarouselIndex((prev) => (prev + 1) % TOTAL);
  const goPrev = () => setCarouselIndex((prev) => (prev - 1 + TOTAL) % TOTAL);

  const [localDragStart, setLocalDragStart] = useState<number | null>(null);

  const handleLocalTouchStart = (e: React.TouchEvent) => {
    setLocalDragStart(e.touches[0].clientX);
  };

  const handleLocalTouchEnd = (e: React.TouchEvent) => {
    if (localDragStart === null) return;
    const diff = localDragStart - e.changedTouches[0].clientX;
    const threshold = viewportSize === 'mobile' ? 35 : 60;
    if (diff > threshold) goNext();
    else if (diff < -threshold) goPrev();
    setLocalDragStart(null);
  };

  const renderSlide = (item: SpotlightHeroCarouselItem, position: SlotPosition, isActive: boolean) => (
    <>
      <img
        src={item.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
        draggable={false}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: isActive
            ? 'linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.26) 52%, rgba(0,0,0,0.03) 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.48) 100%)',
        }}
      />
      {isActive && (
        <div className="absolute top-4 left-4 z-10">
          <span
            className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
            style={{ background: '#E8500A' }}
          >
            {item.badge}
          </span>
        </div>
      )}
      {isActive ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-2.5 z-10"
        >
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white uppercase leading-none tracking-tight italic line-clamp-2">
            {item.title}
          </h3>
          <p className="text-white/55 text-[10px] font-bold uppercase tracking-widest">{item.subtitle}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(item.href);
            }}
            className="mt-1 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest min-h-[44px]"
          >
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <ArrowUpRight size={9} />
            </div>
            {item.ctaLabel}
          </button>
        </motion.div>
      ) : (
        <div className="absolute inset-x-0 bottom-3 flex justify-center px-1.5 z-10">
          <span
            className={cn(
              'font-black uppercase tracking-wide text-white rounded-full truncate max-w-full border border-white/10',
              position === 'farPrev' && 'text-[7px] px-2 py-1',
              position === 'prev' && 'text-[8px] px-2.5 py-1',
              position === 'next' && 'text-[7.5px] px-2 py-1',
            )}
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
          >
            {item.title}
          </span>
        </div>
      )}
    </>
  );

  return (
    <>
      <div
        className="relative w-full overflow-hidden select-none"
        style={{ height: trackHeight }}
        onTouchStart={handleLocalTouchStart}
        onTouchEnd={handleLocalTouchEnd}
      >
        <div className={`flex items-stretch h-full w-full ${viewportSize === 'mobile' ? '' : 'gap-2.5'}`}>
          {slots.map(({ item, position }) => {
            const isActive = position === 'active';
            if (viewportSize === 'mobile') {
              return (
                <motion.div
                  key={`mobile-${item.id}-${carouselIndex}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => navigate(item.href)}
                  className="relative overflow-hidden cursor-pointer group w-full h-full"
                  style={{ borderRadius: '16px', flexShrink: 0 }}
                >
                  {renderSlide(item, position, true)}
                </motion.div>
              );
            }
            return (
              <motion.div
                key={`${position}-${item.id}-${carouselIndex}`}
                initial={false}
                animate={{ flex: flexMap[position], opacity: opacityMap[position] }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.85 }}
                onClick={() => {
                  if (position === 'farPrev' || position === 'prev') goPrev();
                  else if (position === 'next') goNext();
                  else navigate(item.href);
                }}
                className="relative overflow-hidden cursor-pointer group h-full"
                style={{ borderRadius: isActive ? '20px' : '16px', minWidth: 0, flexShrink: 0 }}
              >
                {renderSlide(item, position, isActive)}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 select-none px-1">
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCarouselIndex(i)}
              className={`transition-all duration-500 rounded-full border-0 cursor-pointer p-0 ${viewportSize === 'mobile' ? 'h-2' : 'h-1.5'}`}
              style={{
                width: carouselIndex === i ? (viewportSize === 'mobile' ? '28px' : '36px') : viewportSize === 'mobile' ? '10px' : '8px',
                background: carouselIndex === i ? '#E8500A' : 'rgba(255,255,255,0.22)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <span className="text-[10px] font-black text-white/45 uppercase tracking-widest tabular-nums">
          {String(carouselIndex + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2">
          <button type="button" onClick={goPrev} className="w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center" aria-label="Previous">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={goNext} className="w-10 h-10 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center" aria-label="Next">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

/** @deprecated Use SpotlightHeroCarousel */
export const TrendingBrandsCarousel = SpotlightHeroCarousel;
