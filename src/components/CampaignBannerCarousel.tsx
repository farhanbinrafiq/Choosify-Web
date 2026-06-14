import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Sparkles } from 'lucide-react';
import { useDashboard, Campaign } from '../context/DashboardContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function CampaignBannerCarousel() {
  const { campaigns } = useDashboard();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  // Filter only active campaigns and sort by priority (descending)
  const activeCampaigns = campaigns
    .filter((c: Campaign) => {
      if (!c.active) return false;
      const now = new Date();
      if (c.startDate && new Date(c.startDate) > now) return false;
      if (c.endDate && new Date(c.endDate) < now) return false;
      return true;
    })
    .sort((a: Campaign, b: Campaign) => (b.priority || 0) - (a.priority || 0));

  // Autoplay functionality
  useEffect(() => {
    if (activeCampaigns.length <= 1 || !autoplay) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }

    autoplayTimer.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeCampaigns.length);
    }, 6000); // 6 seconds per slide for high readability

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [activeCampaigns.length, autoplay]);

  if (activeCampaigns.length === 0) {
    return null; // Don't render anything if no active campaigns
  }

  const currentCampaign = activeCampaigns[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + activeCampaigns.length) % activeCampaigns.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % activeCampaigns.length);
  };

  const handleDotClick = (index: number) => {
    setAutoplay(false);
    setCurrentIndex(index);
  };

  const handleCTAClick = () => {
    if (!currentCampaign.ctaLink) return;
    
    toast.success(`Opening Campaign: ${currentCampaign.title}`);
    if (currentCampaign.ctaLink.startsWith('http')) {
      window.open(currentCampaign.ctaLink, '_blank', 'noopener,noreferrer');
    } else {
      navigate(currentCampaign.ctaLink);
    }
  };

  return (
    <div 
      className="w-full max-w-[1440px] mx-auto px-4 mt-5 select-none"
      id="campaign-section-banner"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div className="relative w-full h-[320px] sm:h-[260px] md:h-[280px] rounded-[5px] overflow-hidden border border-[#e8edf2] shadow-sm bg-white text-[#1a1a2e]">
        
        {/* Carousel slides with motion animation transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCampaign.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="absolute inset-4 sm:inset-5 md:inset-6 flex flex-col sm:flex-row gap-5 md:gap-6"
          >
            {/* LEFT SIDE: Campaign Image Area - fully visible and dominant (80% on desktop) */}
            <div className="w-full sm:w-[70%] md:w-[75%] lg:w-[80%] h-[140px] sm:h-full flex items-center justify-center bg-gray-50 rounded-[5px] p-4 relative select-none border border-gray-100 overflow-hidden shrink-0">
              <img 
                src={currentCampaign.image} 
                alt={currentCampaign.title} 
                className="max-h-full max-w-full object-contain rounded-[5px] select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* RIGHT SIDE: Campaign Content Panel (20% on desktop, styled like a compact native card body) */}
            <div className="w-full sm:w-[30%] md:w-[25%] lg:w-[20%] h-auto sm:h-full flex flex-col justify-between py-1 relative text-left shrink-0">
              <div className="flex flex-col items-start gap-1">
                {currentCampaign.sponsorBadge && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[5px] bg-[#E8500A]/10 text-[#E8500A] text-[7.5px] sm:text-[8px] md:text-[9px] font-semibold tracking-wider uppercase border border-[#E8500A]/20">
                    <Sparkles className="w-2.5 h-2.5 text-[#E8500A]" />
                    {currentCampaign.sponsorBadge}
                  </span>
                )}

                {/* Alternating theme colored title */}
                <h2 className="text-xs sm:text-[13px] md:text-sm font-bold uppercase text-[#1a1a2e] tracking-tight leading-snug line-clamp-2 mt-1.5">
                  {currentCampaign.title.split(' ').map((word, index) => {
                    if (index % 2 === 1) {
                      return <span key={index} className="text-[#E8500A] ml-1">{word}</span>;
                    }
                    return <span key={index} className={index > 0 ? "ml-1" : ""}>{word}</span>;
                  })}
                </h2>

                {/* Supporting description/tagline */}
                <p className="text-[9.5px] sm:text-[10px] text-gray-500 font-normal line-clamp-2 mt-1 leading-relaxed">
                  {currentCampaign.tagline}
                </p>
              </div>

              {/* Bottom line: Countdown & CTA explore button - stacked to fit 20% desktop column */}
              <div className="flex flex-col gap-2 mt-auto pt-3 border-t border-gray-150">
                {currentCampaign.countdownEnd ? (
                  <CampaignCountdown deadline={currentCampaign.countdownEnd} />
                ) : <div className="h-0" />}

                <button
                  onClick={handleCTAClick}
                  className="w-full py-2 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[9.5px] font-semibold uppercase tracking-wider rounded-[5px] shadow-sm transition-all duration-300 cursor-pointer text-center"
                >
                  {currentCampaign.ctaText || 'EXPLORE BRAND'}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Manual navigation controls */}
        {activeCampaigns.length > 1 && (
          <>
            {/* Prev button */}
            <button
              onClick={handlePrev}
              className="absolute left-1.5 sm:left-2.5 top-[60px] sm:top-1/2 -translate-y-1/2 w-8 h-8 rounded-[5px] bg-white/80 hover:bg-[#E8500A] border border-gray-150 hover:border-[#E8500A]/40 flex items-center justify-center text-gray-700 hover:text-white transition-all cursor-pointer backdrop-blur-sm z-20 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Previous Campaign"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="absolute right-1.5 sm:right-2.5 top-[60px] sm:top-1/2 -translate-y-1/2 w-8 h-8 rounded-[5px] bg-white/80 hover:bg-[#E8500A] border border-gray-150 hover:border-[#E8500A]/40 flex items-center justify-center text-gray-700 hover:text-white transition-all cursor-pointer backdrop-blur-sm z-20 hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Next Campaign"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Pagination indicator dots */}
            <div className="absolute bottom-1 right-4 sm:bottom-4 sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-1.5 z-20">
              {activeCampaigns.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-1 rounded-[5px] transition-all duration-300 ${
                    idx === currentIndex ? 'w-6 bg-[#E8500A]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Sub-component for interactive ticking countdown (styled beautifully for light container)
function CampaignCountdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(deadline) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft()); // Initial call

    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft.expired) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-[5px] bg-red-50 border border-red-150 text-[8px] sm:text-[9px] font-bold text-red-500">
        Campaign Expired
      </span>
    );
  }

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <span className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 py-1 rounded-[5px] bg-gray-50 border border-gray-150 text-[8px] sm:text-[9.5px] font-black text-gray-500 w-full">
      <Clock className="w-2.5 h-2.5 text-[#E8500A]" />
      <span className="hidden xs:inline text-gray-450">ENDS:</span>
      <span className="font-mono text-[#E8500A] tracking-tight">
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    </span>
  );
}
