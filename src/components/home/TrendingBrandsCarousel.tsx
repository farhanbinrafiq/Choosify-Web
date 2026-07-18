import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface TrendingBrandsCarouselProps {
  carouselBrands: { id: number; name: string; category: string; image: string }[];
  carouselIndex: number;
  setCarouselIndex: React.Dispatch<React.SetStateAction<number>>;
  navigate: ReturnType<typeof useNavigate>;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseUpOrLeave: () => void;
}

export function TrendingBrandsCarousel({
  carouselBrands,
  carouselIndex,
  setCarouselIndex,
  navigate,
  handleTouchStart,
  handleTouchEnd,
  handleMouseDown,
  handleMouseUpOrLeave,
}: TrendingBrandsCarouselProps) {
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

  const TOTAL = carouselBrands.length;

  const getIdx = (offset: number) =>
    (carouselIndex + offset + TOTAL * 10) % TOTAL;

  type SlotPosition = 'farPrev' | 'prev' | 'active' | 'next';

  const slots: { brand: typeof carouselBrands[0]; position: SlotPosition }[] =
    viewportSize === 'mobile'
      ? [{ brand: carouselBrands[getIdx(0)], position: 'active' }]
      : viewportSize === 'tablet'
      ? [
          { brand: carouselBrands[getIdx(-1)], position: 'prev' },
          { brand: carouselBrands[getIdx(0)], position: 'active' },
          { brand: carouselBrands[getIdx(1)], position: 'next' },
        ]
      : [
          { brand: carouselBrands[getIdx(-2)], position: 'farPrev' },
          { brand: carouselBrands[getIdx(-1)], position: 'prev' },
          { brand: carouselBrands[getIdx(0)], position: 'active' },
          { brand: carouselBrands[getIdx(1)], position: 'next' },
        ];

  // Side cards taper in width: narrow → narrower → very narrow (center is always widest)
  const flexMap: Record<SlotPosition, number> =
    viewportSize === 'tablet'
      ? { farPrev: 0, prev: 2.4, active: 7.2, next: 1.6 }
      : { farPrev: 1.05, prev: 2.35, active: 7.4, next: 1.55 };

  const opacityMap: Record<SlotPosition, number> =
    viewportSize === 'tablet'
      ? { farPrev: 0, prev: 0.76, active: 1, next: 0.62 }
      : { farPrev: 0.42, prev: 0.74, active: 1, next: 0.58 };

  const trackHeight =
    viewportSize === 'mobile' ? '360px'
    : viewportSize === 'tablet' ? '440px'
    : '500px';

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

  return (
    <>
      {/* CAROUSEL TRACK */}
      <div
        className="relative w-full overflow-hidden select-none"
        style={{ height: trackHeight }}
        onTouchStart={handleLocalTouchStart}
        onTouchEnd={handleLocalTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUpOrLeave}
      >
        <div className={`flex items-stretch h-full w-full ${viewportSize === 'mobile' ? '' : 'gap-2.5'}`}>
          {slots.map(({ brand, position }) => {
            const isActive = position === 'active';

            if (viewportSize === 'mobile') {
              return (
                <motion.div
                  key={`mobile-${brand.id}-${carouselIndex}`}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  onClick={() => navigate(`/brands/${brand.id}`)}
                  className="relative overflow-hidden cursor-pointer group w-full h-full"
                  style={{ borderRadius: '16px', flexShrink: 0 }}
                >
                  {/* a) Background image */}
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                    draggable={false}
                  />

                  {/* b) Gradient overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.26) 52%, rgba(0,0,0,0.03) 100%)',
                    }}
                  />

                  {/* c) Category badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
                      style={{ background: '#E8500A' }}
                    >
                      {brand.category}
                    </span>
                  </div>

                  {/* d) Active card — bottom content */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-2.5 z-10"
                  >
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-none tracking-tight">
                      {brand.name}
                    </h3>
                    <p className="text-white/55 text-[10px] font-bold uppercase tracking-widest">
                      Verified Brand on Choosify
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/brands/${brand.id}`);
                      }}
                      className="mt-1 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                        <ArrowUpRight size={9} />
                      </div>
                      Explore Brand
                    </button>
                  </motion.div>
                </motion.div>
              );
            }

            const flexVal = flexMap[position];
            const opacityVal = opacityMap[position];
            const showBadge = isActive;
            const showNamePill = !isActive;

            return (
              <motion.div
                key={`${position}-${brand.id}-${carouselIndex}`}
                initial={false}
                animate={{
                  flex: flexVal,
                  opacity: opacityVal,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.85 }}
                onClick={() => {
                  if (position === 'farPrev' || position === 'prev') goPrev();
                  else if (position === 'next') goNext();
                  else navigate(`/brands/${brand.id}`);
                }}
                className="relative overflow-hidden cursor-pointer group h-full"
                style={{ borderRadius: isActive ? '20px' : '16px', minWidth: 0, flexShrink: 0 }}
              >
                {/* a) Background image */}
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  draggable={false}
                />

                {/* b) Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: isActive
                      ? 'linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.26) 52%, rgba(0,0,0,0.03) 100%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.48) 100%)',
                  }}
                />

                {/* c) Category badge */}
                {showBadge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
                      style={{ background: '#E8500A' }}
                    >
                      {brand.category}
                    </span>
                  </div>
                )}

                {/* d) Active card — bottom content */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-2.5 z-10"
                  >
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-none tracking-tight">
                      {brand.name}
                    </h3>
                    <p className="text-white/55 text-[10px] font-bold uppercase tracking-widest">
                      Verified Brand on Choosify
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/brands/${brand.id}`);
                      }}
                      className="mt-1 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                        <ArrowUpRight size={9} />
                      </div>
                      Explore Brand
                    </button>
                  </motion.div>
                )}

                {/* e) Inactive card — name pill bottom */}
                {showNamePill && (
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
                      {brand.name}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION CONTROLS */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 select-none px-1">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {carouselBrands.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCarouselIndex(i)}
              className={`transition-all duration-500 rounded-full border-0 cursor-pointer p-0 ${
                viewportSize === 'mobile' ? 'h-2' : 'h-1.5'
              }`}
              style={{
                width: carouselIndex === i
                  ? (viewportSize === 'mobile' ? '28px' : '36px')
                  : (viewportSize === 'mobile' ? '10px' : '8px'),
                background: carouselIndex === i ? '#E8500A' : 'rgba(255,255,255,0.22)',
              }}
              aria-label={`Go to brand ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <span className="text-[10px] font-black text-white/45 uppercase tracking-widest tabular-nums">
          {String(carouselIndex + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
        </span>

        {/* Arrow buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            className={`rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              viewportSize === 'mobile' ? 'w-10 h-10' : 'w-9 h-9'
            }`}
            title="Previous Brand"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={goNext}
            className={`rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              viewportSize === 'mobile' ? 'w-10 h-10' : 'w-9 h-9'
            }`}
            title="Next Brand"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
