import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function PremiumCarousel({ 
  items, 
  renderCard, 
  itemWidth = 280, 
  gap = 16 
}: {
  items: any[];
  renderCard: (item: any, index: number, isActive: boolean) => React.ReactNode;
  itemWidth?: number;
  gap?: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const lastWheelTime = React.useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const totalItems = items.length;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return;
    const diff = dragStartX - e.touches[0].clientX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (dragStartX === null) return;
    if (dragOffset > 50) {
      next();
    } else if (dragOffset < -50) {
      prev();
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStartX === null) return;
    setDragOffset(dragStartX - e.clientX);
  };

  const handleMouseUpOrLeave = () => {
    if (dragStartX === null) return;
    if (dragOffset > 50) {
      next();
    } else if (dragOffset < -50) {
      prev();
    }
    setDragStartX(null);
    setDragOffset(0);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return;
    if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 30) {
      if (e.deltaX > 20 || e.deltaY > 30) {
        next();
      } else {
        prev();
      }
      lastWheelTime.current = now;
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      }
    };

    const container = containerRef.current;
    let isHovered = false;
    const onEnter = () => { isHovered = true; };
    const onLeave = () => { isHovered = false; };

    const handleKeyGlobal = (e: KeyboardEvent) => {
      if (isHovered) {
        handleKeyDown(e);
      }
    };

    if (container) {
      container.addEventListener('mouseenter', onEnter);
      container.addEventListener('mouseleave', onLeave);
      window.addEventListener('keydown', handleKeyGlobal);
    }

    return () => {
      if (container) {
        container.removeEventListener('mouseenter', onEnter);
        container.removeEventListener('mouseleave', onLeave);
      }
      window.removeEventListener('keydown', handleKeyGlobal);
    };
  }, [totalItems]);

  const translateX = -(currentIndex * (itemWidth + gap)) - dragOffset;

  return (
    <div className="relative w-full overflow-hidden select-none animate-fade-in" ref={containerRef}>
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
        className="w-full active:cursor-grabbing overflow-hidden"
      >
        <motion.div
          animate={{ x: translateX }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="flex gap-4 items-stretch w-max h-full py-2"
        >
          {items.map((item, idx) => (
            <div
              key={
                (item as { key?: string })?.key ??
                (item as { guide?: { id?: string | number }; id?: string | number })?.guide?.id ??
                (item as { id?: string | number })?.id ??
                idx
              }
              style={{ width: `${itemWidth}px` }}
              className="shrink-0 flex self-stretch"
            >
              {renderCard(item, idx, idx === currentIndex)}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center justify-between mt-2 select-none">
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === currentIndex ? "w-5 bg-[#E8500A]" : "w-1.5 bg-gray-200 hover:bg-gray-300"
              )}
              title={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
           <button 
             type="button"
             onClick={prev} 
             className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A]/30 transition-all active:scale-90 shadow-xs cursor-pointer"
             title="Previous Slide"
           >
              <ChevronLeft size={16} />
           </button>
           <button 
             type="button"
             onClick={next} 
             className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center hover:bg-[#E8500A] hover:text-white hover:border-[#E8500A]/30 transition-all active:scale-90 shadow-xs cursor-pointer"
             title="Next Slide"
           >
              <ChevronRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );
}
