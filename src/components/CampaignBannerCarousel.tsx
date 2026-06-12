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
      <div className="relative w-full h-[190px] sm:h-[220px] md:h-[250px] rounded-3xl overflow-hidden border border-[#e8edf2] shadow-md bg-[#0b0c1e] text-white">
        
        {/* Carousel slides with motion animation transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCampaign.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${currentCampaign.image})` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#030409] via-[#05060f]/90 to-transparent md:bg-gradient-to-r md:from-[#030409] md:via-[#05060f]/85 md:to-[#05060f]/30" />
            </div>

            {/* Campaign info */}
            <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 sm:px-12 md:px-16 text-left max-w-[70%] sm:max-w-[60%]">
              
              {/* Badges line: Sponsor and Countdown */}
              <div className="flex flex-wrap items-center gap-3 mb-2 sm:mb-3">
                {currentCampaign.sponsorBadge && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8500A]/90 backdrop-blur-md border border-[#FF5B00]/40 text-[9px] font-black tracking-widest uppercase text-white shadow-sm">
                    <Sparkles className="w-2.5 h-2.5" />
                    {currentCampaign.sponsorBadge}
                  </span>
                )}
                {currentCampaign.countdownEnd && (
                  <CampaignCountdown deadline={currentCampaign.countdownEnd} />
                )}
              </div>

              {/* Title matches Choosify branding (Navy + Orange/White) */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black italic tracking-tighter uppercase mb-1 sm:mb-2 text-white">
                {currentCampaign.title.split(' ').map((word, index) => {
                  if (index % 2 === 1) {
                    return <span key={index} className="text-[#FF5B00] ml-1.5">{word}</span>;
                  }
                  return <span key={index} className={index > 0 ? "ml-1.5" : ""}>{word}</span>;
                })}
              </h2>

              {/* Supporting tagline */}
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-300 font-medium mb-4 line-clamp-2 max-w-xl">
                {currentCampaign.tagline}
              </p>

              {/* CTA button with Choosify style hover effects */}
              <div>
                <button
                  onClick={handleCTAClick}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FF5B00] to-[#E8500A] hover:from-[#E8500A] hover:to-[#CF4400] text-white text-[9.5px] font-black tracking-widest uppercase rounded-full shadow-lg border border-[#FF5B00]/30 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer"
                >
                  {currentCampaign.ctaText || 'EXPLORE COLLECTION'}
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
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#E8500A]/80 border border-white/10 hover:border-[#FF5B00]/50 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-sm z-20 hover:scale-105 active:scale-95"
              aria-label="Previous Campaign"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-[#E8500A]/80 border border-white/10 hover:border-[#FF5B00]/50 flex items-center justify-center text-white transition-all cursor-pointer backdrop-blur-sm z-20 hover:scale-105 active:scale-95"
              aria-label="Next Campaign"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
              {activeCampaigns.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-6 bg-[#FF5B00] shadow-glow' : 'w-2 bg-white/40 hover:bg-white/60'
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

// Sub-component for interactive ticking countdown
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
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-950/75 border border-red-500/25 text-[9px] font-bold text-red-400">
        Campaign Expired
      </span>
    );
  }

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[9px] font-black text-gray-200">
      <Clock className="w-2.5 h-2.5 text-[#FF5B00]" />
      <span>ENDS IN:</span>
      <span className="font-mono text-[#FF5B00]">
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    </span>
  );
}
