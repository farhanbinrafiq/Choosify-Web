import { useCallback, useEffect, useState, type MouseEvent, type TouchEvent } from 'react';

interface UseMediaCarouselOptions {
  totalSlides: number;
  enableGestures?: boolean;
  loop?: boolean;
}

export function useMediaCarousel({
  totalSlides,
  enableGestures = true,
  loop = true,
}: UseMediaCarouselOptions) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      if (totalSlides <= 0) return;
      if (loop) {
        setIndex(((next % totalSlides) + totalSlides) % totalSlides);
      } else {
        setIndex(Math.max(0, Math.min(totalSlides - 1, next)));
      }
    },
    [loop, totalSlides],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!enableGestures) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enableGestures, next, prev]);

  const onTouchStart = (clientX: number) => {
    if (!enableGestures) return;
    setDragStartX(clientX);
    setDragOffset(0);
  };

  const onTouchMove = (clientX: number) => {
    if (dragStartX == null) return;
    setDragOffset(dragStartX - clientX);
  };

  const onTouchEnd = () => {
    if (dragStartX == null) return;
    if (dragOffset > 50) next();
    else if (dragOffset < -50) prev();
    setDragStartX(null);
    setDragOffset(0);
  };

  const onMouseDown = (clientX: number) => onTouchStart(clientX);
  const onMouseMove = (clientX: number) => onTouchMove(clientX);
  const onMouseUp = () => onTouchEnd();

  return {
    index,
    dragOffset,
    goTo,
    next,
    prev,
    handlers: {
      onTouchStart: (e: TouchEvent) => onTouchStart(e.touches[0].clientX),
      onTouchMove: (e: TouchEvent) => onTouchMove(e.touches[0].clientX),
      onTouchEnd: onTouchEnd,
      onMouseDown: (e: MouseEvent) => onMouseDown(e.clientX),
      onMouseMove: (e: MouseEvent) => onMouseMove(e.clientX),
      onMouseUp: onMouseUp,
      onMouseLeave: onMouseUp,
    },
  };
}
