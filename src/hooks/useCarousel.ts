import { useState, useEffect, useRef, useCallback } from 'react';

export function useCarousel(itemCount: number, interval: number = 3500) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % itemCount);
  }, [itemCount]);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + itemCount) % itemCount);
  }, [itemCount]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    if (paused || itemCount <= 1) return;
    
    timerRef.current = setInterval(next, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next, interval, itemCount]);

  const pause = () => setPaused(true);
  const resume = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPaused(false);
  };

  return { current, next, prev, goTo, pause, resume };
}
