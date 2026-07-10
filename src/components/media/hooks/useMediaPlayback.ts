import { useCallback, useEffect, useRef, useState } from 'react';
import type { MediaPlaybackOptions } from '../types/playback';

export function useMediaPlayback(options: MediaPlaybackOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const play = useCallback(async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      await el.play();
      setIsPlaying(true);
    } catch {
      setHasError(true);
    }
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!options.autoplay || options.lazyLoad) return;
    void play();
  }, [options.autoplay, options.lazyLoad, play]);

  return {
    videoRef,
    isPlaying,
    hasError,
    isLoaded,
    setHasError,
    setIsLoaded,
    play,
    pause,
  };
}
