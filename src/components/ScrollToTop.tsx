import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    
    // Reset nested scroll structures (like overviews, preview wrappers, and dashboard sidebars).
    // A container can opt out via `data-preserve-scroll` when it manages its own
    // scroll position (e.g. a chat viewport that should open at the latest
    // message, not the top) — without an opt-out this blanket reset fights
    // any such feature's own scroll logic on every route change.
    const scrollables = document.querySelectorAll('.overflow-y-auto, .scroll-smooth, [class*="overflow-y-"]');
    scrollables.forEach((el) => {
      if (el.closest('[data-preserve-scroll]')) return;
      el.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, [pathname, search, hash]);

  return null;
}
