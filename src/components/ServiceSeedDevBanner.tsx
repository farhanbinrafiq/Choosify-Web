import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import {
  isServiceSeedEnabled,
  resetServiceBookingTestStorage,
  setServiceSeedEnabled,
  TEST_SERVICE_PRODUCTS,
  TEST_SERVICE_SELLER_USER,
} from '../data/mockServiceListings';
import type { User } from '../types/schemas';

const BUYER_SNAPSHOT_KEY = 'choosify_service_seed_buyer_snapshot';

/**
 * Dev-only panel for local service booking seed data.
 * Never renders in production builds.
 */
export function ServiceSeedDevBanner() {
  const { currentUser, setCurrentUser, setIsLoggedIn } = useGlobalState();
  const [open, setOpen] = useState(true);
  const [enabled, setEnabled] = useState(() => isServiceSeedEnabled());

  const isTestSeller = currentUser.id === TEST_SERVICE_SELLER_USER.id;

  const quickLinks = useMemo(
    () => [
      { label: 'Hotels', href: '/products?service=hotels&q=Hotels' },
      { label: 'Doctors', href: '/products?service=doctors&q=Doctors' },
      { label: 'Beauty', href: '/products?service=beauty&q=Beauty' },
      { label: 'All [TEST]', href: '/products?q=%5BTEST%5D' },
    ],
    [],
  );

  if (!import.meta.env.DEV || !open) {
    if (!import.meta.env.DEV) return null;
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-[90] rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-amber-300 shadow-lg"
      >
        [TEST] Services
      </button>
    );
  }

  const switchToSeller = () => {
    try {
      localStorage.setItem(BUYER_SNAPSHOT_KEY, JSON.stringify(currentUser));
      localStorage.setItem('choosify_user_profile', JSON.stringify(TEST_SERVICE_SELLER_USER));
    } catch {
      /* ignore */
    }
    setCurrentUser(TEST_SERVICE_SELLER_USER);
    setIsLoggedIn(true);
  };

  const switchToBuyer = () => {
    let restored: User | null = null;
    try {
      const raw = localStorage.getItem(BUYER_SNAPSHOT_KEY);
      if (raw) restored = JSON.parse(raw) as User;
    } catch {
      /* ignore */
    }
    const next = restored
      ? { ...restored, role: restored.role || 'customer' }
      : ({ ...currentUser, role: 'customer', id: 'usr-892', name: 'Farhan Bin Rafiq' } as User);
    try {
      localStorage.setItem('choosify_user_profile', JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setCurrentUser(next);
    setIsLoggedIn(true);
  };

  const toggleSeed = () => {
    const next = !enabled;
    setServiceSeedEnabled(next);
    setEnabled(next);
    window.location.reload();
  };

  const resetBooking = () => {
    resetServiceBookingTestStorage();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-4 z-[90] max-w-[280px] rounded-xl border border-amber-300/40 bg-slate-950/95 p-3 text-left text-amber-50 shadow-2xl backdrop-blur">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[9px] font-black uppercase tracking-widest text-amber-400">
            Local service seed
          </div>
          <p className="mt-0.5 text-[10px] leading-snug text-slate-300">
            {enabled
              ? `${TEST_SERVICE_PRODUCTS.length} [TEST] listings active · seller-test-services`
              : 'Seed disabled — enable to inject mock hotels/doctors/beauty'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[10px] font-bold text-slate-400 hover:text-white"
          aria-label="Minimize service seed panel"
        >
          ✕
        </button>
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-100 hover:bg-white/20"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={isTestSeller ? switchToBuyer : switchToSeller}
          className="rounded bg-amber-500/90 px-2 py-1 text-[10px] font-black uppercase text-slate-950 hover:bg-amber-400"
        >
          {isTestSeller ? 'Switch to buyer' : 'Switch to [TEST] seller'}
        </button>
        <button
          type="button"
          onClick={toggleSeed}
          className="rounded bg-white/10 px-2 py-1 text-[10px] font-bold uppercase text-slate-200 hover:bg-white/15"
        >
          {enabled ? 'Disable seed + reload' : 'Enable seed + reload'}
        </button>
        <button
          type="button"
          onClick={resetBooking}
          className="rounded bg-white/5 px-2 py-1 text-[10px] font-bold uppercase text-slate-400 hover:bg-white/10"
        >
          Reset threads / orders
        </button>
      </div>
    </div>
  );
}
