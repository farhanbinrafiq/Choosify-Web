import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GA_MEASUREMENT_ID } from '../lib/seoConfig';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Track SPA route changes in Google Analytics 4 */
export function GoogleAnalyticsRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: `${location.pathname}${location.search}`,
      page_title: document.title,
    });
  }, [location.pathname, location.search]);

  return null;
}
