import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { hydrateServiceBookingFieldsFromApi } from './utils/serviceBooking';

void hydrateServiceBookingFieldsFromApi();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
