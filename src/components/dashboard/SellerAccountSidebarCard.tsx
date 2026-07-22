import React, { useEffect, useState } from 'react';
import { Store, ArrowUpRight, Loader2 } from 'lucide-react';
import { operationsApi } from '../../services/operationsApi';

const SELLER_DASHBOARD_ORIGIN =
  ((import.meta as any).env?.VITE_SELLER_DASHBOARD_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://dashboard.choosify.bd';

type SellerAccountSidebarCardProps = {
  email: string;
  onNavigate?: () => void;
};

export function SellerAccountSidebarCard({ email, onNavigate }: SellerAccountSidebarCardProps) {
  const [status, setStatus] = useState<'loading' | 'seller' | 'join'>('loading');
  const [dashboardPath, setDashboardPath] = useState('/seller/products');

  useEffect(() => {
    let cancelled = false;
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setStatus('join');
      return;
    }

    setStatus('loading');
    operationsApi
      .getSellerStatus(normalized)
      .then((result) => {
        if (cancelled) return;
        if (result.dashboardPath) setDashboardPath(result.dashboardPath);
        setStatus(result.hasSellerAccount ? 'seller' : 'join');
      })
      .catch(() => {
        if (!cancelled) setStatus('join');
      });

    return () => {
      cancelled = true;
    };
  }, [email]);

  const switchHref = `${SELLER_DASHBOARD_ORIGIN}/login?email=${encodeURIComponent(email)}&role=seller&next=${encodeURIComponent(dashboardPath)}`;
  const joinHref = `${SELLER_DASHBOARD_ORIGIN}/login?email=${encodeURIComponent(email)}&intent=join&role=seller`;

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center gap-2 border border-[#E8EDF2] rounded-[10px] px-3.5 py-3 text-[12px] text-[#9AA0AC] bg-white">
        <Loader2 size={14} className="animate-spin" />
        Checking seller account…
      </div>
    );
  }

  if (status === 'seller') {
    return (
      <a
        href={switchHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className="flex items-center justify-between gap-2 border border-[#E8EDF2] rounded-[10px] px-3.5 py-2.5 text-[12px] font-semibold text-[#1A1A2E] hover:bg-[#F4F7F9] transition-colors bg-white"
      >
        <span className="flex items-center gap-2 min-w-0">
          <Store size={14} className="text-orange-primary shrink-0" />
          <span className="truncate">Switch to Seller Dashboard</span>
        </span>
        <ArrowUpRight size={14} className="text-[#9AA0AC] shrink-0" />
      </a>
    );
  }

  return (
    <div className="rounded-[10px] border border-[#E8EDF2] bg-white p-3.5 space-y-2.5">
      <div className="flex items-start gap-2">
        <Store size={14} className="text-orange-primary shrink-0 mt-0.5" />
        <p className="text-[12px] leading-snug text-[#1A1A2E] font-medium">
          Want to become a seller on Choosify?
        </p>
      </div>
      <a
        href={joinHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className="flex items-center justify-center w-full rounded-[8px] bg-orange-primary text-white text-[11px] font-black uppercase tracking-wider px-3 py-2.5 hover:opacity-90 transition-opacity"
      >
        Join Now
      </a>
    </div>
  );
}
