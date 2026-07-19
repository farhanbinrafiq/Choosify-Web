import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';

interface LiveCountdownProps {
  targetDate: string;
  timezone?: string;
  className?: string;
}

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, done: diff <= 0 };
}

export function LiveCountdown({ targetDate, timezone, className }: LiveCountdownProps) {
  const target = new Date(targetDate).getTime();
  const [remaining, setRemaining] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(getRemaining(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (remaining.done) {
    return <p className={cn('text-sm font-bold text-[#EB4501]', className)}>Starting soon</p>;
  }

  return (
    <div className={cn('flex gap-3 text-center', className)} role="timer" aria-live="polite">
      {[
        { label: 'Days', value: remaining.days },
        { label: 'Hrs', value: remaining.hours },
        { label: 'Min', value: remaining.minutes },
        { label: 'Sec', value: remaining.seconds },
      ].map((unit) => (
        <div key={unit.label} className="min-w-[48px] p-2 rounded bg-[#1a1a2e] text-white">
          <p className="text-lg font-black tabular-nums">{String(unit.value).padStart(2, '0')}</p>
          <p className="text-[9px] uppercase tracking-wider text-white/60">{unit.label}</p>
        </div>
      ))}
      {timezone && <span className="sr-only">Timezone: {timezone}</span>}
    </div>
  );
}
