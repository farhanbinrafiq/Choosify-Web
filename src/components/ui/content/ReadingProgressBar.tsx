import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';

export interface ReadingProgressBarProps {
  isSticky?: boolean;
  color?: string;
  className?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  isSticky = true,
  color = 'bg-[#EB4501]',
  className
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      
      if (documentHeight > 0) {
        const currentProgress = (scrollTop / documentHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn(
      "w-full h-1 bg-slate-100 z-50",
      isSticky && "fixed top-0 left-0",
      className
    )}>
      <div 
        className={cn("h-full transition-all duration-150 ease-out", color)} 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
