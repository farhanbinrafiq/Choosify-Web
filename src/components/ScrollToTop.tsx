import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    
    // Reset nested scroll structures (like overviews, preview wrappers, and dashboard sidebars)
    const scrollables = document.querySelectorAll('.overflow-y-auto, .scroll-smooth, [class*="overflow-y-"]');
    scrollables.forEach((el) => {
      el.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, [pathname]);

  return null;
}
