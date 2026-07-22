import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { hydrateServiceBookingFieldsFromApi } from './utils/serviceBooking';

void hydrateServiceBookingFieldsFromApi();

// When a new service worker activates (autoUpdate), force a one-time reload so
// clients leave stale precached shells that still point at deleted /assets/*.js.
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
