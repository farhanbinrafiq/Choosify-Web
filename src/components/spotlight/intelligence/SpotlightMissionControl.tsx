import React from 'react';
import { Link } from 'react-router-dom';
import type { IntelligenceMissionControlSnapshot } from '../../../types/spotlight/intelligence';
import { Activity, AlertTriangle, Calendar, Radio, ShoppingBag, Star, TrendingUp, Trophy } from 'lucide-react';

interface SpotlightMissionControlProps {
  data: IntelligenceMissionControlSnapshot;
}

function Panel({
  title,
  icon,
  children,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="bg-white border border-[#e8edf2] rounded-xl p-4 flex flex-col min-h-[180px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1.5">
          {icon} {title}
        </h3>
        {href && (
          <Link to={href} className="text-[9px] font-bold text-[#EB4501] hover:underline uppercase">
            View all
          </Link>
        )}
      </div>
      <div className="flex-1 space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value, href, accent }: { label: string; value: string; href?: string; accent?: string }) {
  const inner = (
    <div className="flex justify-between items-start gap-2 py-1.5 border-b border-[#e8edf2]/60 last:border-0">
      <span className="text-xs font-bold text-navy line-clamp-1">{label}</span>
      <span className={`text-[10px] font-bold shrink-0 ${accent ?? 'text-gray-500'}`}>{value}</span>
    </div>
  );
  if (href) return <Link to={href} className="block hover:bg-[#F8FBFD] -mx-2 px-2 rounded transition-colors">{inner}</Link>;
  return inner;
}

/** Spotlight Mission Control — control room homepage (CTO upgrade Phase 5.4) */
export function SpotlightMissionControl({ data }: SpotlightMissionControlProps) {
  return (
    <div className="space-y-4">
      <div className="bg-[#050514] text-white rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase text-[#EB4501] tracking-widest">Spotlight Mission Control</p>
          <h2 className="text-xl font-extrabold tracking-tight mt-1">Your Spotlight ecosystem at a glance</h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            What is performing, what needs attention, what is trending, and what is scheduled — the operating system for Spotlight.
          </p>
        </div>
        <Activity className="h-10 w-10 text-[#EB4501] opacity-80 shrink-0" aria-hidden />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Panel title="Best Performing" icon={<Trophy size={12} className="text-[#EB4501]" />} href="/marketing/intelligence/content">
          {data.bestPerforming.map((item) => (
            <Row key={item.label} label={item.value} value={item.metric} href={item.href} accent="text-emerald-600" />
          ))}
        </Panel>

        <Panel title="Needs Attention" icon={<AlertTriangle size={12} className="text-amber-500" />} href="/marketing/intelligence/health">
          {data.needsAttention.length ? data.needsAttention.map((item) => (
            <Row
              key={item.label}
              label={item.label}
              value={item.value}
              href={item.href}
              accent={item.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'}
            />
          )) : (
            <p className="text-xs text-gray-400">All systems healthy</p>
          )}
        </Panel>

        <Panel title="Trending Now" icon={<TrendingUp size={12} className="text-[#EB4501]" />} href="/marketing/intelligence/discovery">
          {data.trendingNow.map((item) => (
            <Row key={item.label} label={item.label} value={`${item.score} score`} href={item.href} />
          ))}
        </Panel>

        <Panel title="Live Active" icon={<Radio size={12} className="text-rose-500" />} href="/marketing/intelligence/live">
          {data.liveActive.length ? data.liveActive.map((item) => (
            <Row key={item.label} label={item.label} value={item.status} href={item.href} accent={item.status === 'LIVE' ? 'text-rose-500' : 'text-gray-500'} />
          )) : (
            <p className="text-xs text-gray-400">No live events right now</p>
          )}
        </Panel>

        <Panel title="Commerce Drivers" icon={<ShoppingBag size={12} className="text-[#EB4501]" />} href="/marketing/intelligence/campaigns">
          {data.commerceDrivers.map((item) => (
            <Row key={item.label} label={item.label} value={`${item.clicks} clicks`} href={item.href} />
          ))}
        </Panel>

        <Panel title="Top Creators" icon={<Star size={12} className="text-[#EB4501]" />} href="/marketing/intelligence/creators">
          {data.topCreators.map((item) => (
            <Row key={item.label} label={item.label} value={`Impact ${item.impact}`} href={item.href} />
          ))}
        </Panel>

        <Panel title="Top Products" icon={<ShoppingBag size={12} />} href="/marketing/intelligence/products">
          {data.topProducts.map((item) => (
            <Row key={item.label} label={item.label} value={`${item.exposure.toLocaleString()} exp.`} href={item.href} />
          ))}
        </Panel>

        <Panel title="Expiring Soon" icon={<Calendar size={12} className="text-amber-500" />} href="/marketing/intelligence/campaigns">
          {data.expiringSoon.length ? data.expiringSoon.map((item) => (
            <Row key={item.label} label={item.label} value={`${item.daysLeft}d left`} href={item.href} accent="text-amber-600" />
          )) : (
            <p className="text-xs text-gray-400">No campaigns expiring this week</p>
          )}
        </Panel>

        <Panel title="Scheduled (7 Days)" icon={<Calendar size={12} />} href="/marketing/intelligence/overview">
          {data.scheduledNext7.length ? data.scheduledNext7.map((item) => (
            <Row key={item.label} label={item.label} value={item.date} href={item.href} />
          )) : (
            <p className="text-xs text-gray-400">Nothing scheduled this week</p>
          )}
        </Panel>
      </div>
    </div>
  );
}
