import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { ReturnRequest } from '../../types/schemas';
import { cn } from '../../lib/utils';
import { loadReturnRequests } from '../../lib/dashboard/pendingActions';

function statusMeta(status: ReturnRequest['status']) {
  switch (status) {
    case 'pending':
      return { text: 'Pending review', className: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'approved':
      return { text: 'In progress', className: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'rejected':
      return { text: 'Rejected', className: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'completed':
      return { text: 'Completed', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    default:
      return { text: status, className: 'bg-slate-50 text-slate-600 border-slate-200' };
  }
}

export function MyReturnsSection() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);

  useEffect(() => {
    setReturns(loadReturnRequests());
    const onStorage = () => setReturns(loadReturnRequests());
    window.addEventListener('storage', onStorage);
    window.addEventListener('choosify-returns-updated', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('choosify-returns-updated', onStorage);
    };
  }, []);

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div>
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
          My Returns
        </h2>
        <p className="text-[#9AA0AC] text-[12.5px]">
          Return requests and their current status
        </p>
      </div>

      {returns.length === 0 ? (
        <div className="py-16 border border-dashed border-[#E8EDF2] rounded-[10px] flex flex-col items-center justify-center text-center bg-white">
          <RotateCcw className="text-[#9AA0AC] mb-3" size={28} />
          <p className="text-[13px] font-medium text-[#9AA0AC]">
            No return requests yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {returns.map((row) => {
            const badge = statusMeta(row.status);
            return (
              <div
                key={row.id}
                className="bg-white border border-[#E8EDF2] rounded-[10px] p-4"
              >
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-[13.5px] font-extrabold text-[#1A1A2E]">
                    {row.orderId}
                  </h3>
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                      badge.className,
                    )}
                  >
                    {badge.text}
                  </span>
                </div>
                <p className="text-[12.5px] text-[#4B5563]">{row.reason}</p>
                {row.description ? (
                  <p className="text-[12px] text-[#9AA0AC] mt-1">{row.description}</p>
                ) : null}
                <p className="text-[11.5px] text-[#9AA0AC] mt-2">
                  Submitted{' '}
                  {new Date(row.createdAt).toLocaleString('en-BD')}
                  {row.resolvedAt
                    ? ` · Resolved ${new Date(row.resolvedAt).toLocaleString('en-BD')}`
                    : ''}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
