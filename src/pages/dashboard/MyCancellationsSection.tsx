import React, { useEffect, useMemo } from 'react';
import { Ban, Package } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import {
  getCancelledOrders,
  markCancellationsSeen,
} from '../../lib/dashboard/pendingActions';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../../constants';

export function MyCancellationsSection() {
  const { orders } = useGlobalState();
  const cancelled = useMemo(() => getCancelledOrders(orders), [orders]);

  useEffect(() => {
    if (cancelled.length > 0) {
      markCancellationsSeen(cancelled.map((o) => o.orderId));
    }
  }, [cancelled]);

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div>
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
          My Cancellations
        </h2>
        <p className="text-[#9AA0AC] text-[12.5px]">
          Orders and bookings you cancelled
        </p>
      </div>

      {cancelled.length === 0 ? (
        <div className="py-16 border border-dashed border-[#E8EDF2] rounded-[10px] flex flex-col items-center justify-center text-center bg-white">
          <Ban className="text-[#9AA0AC] mb-3" size={28} />
          <p className="text-[13px] font-medium text-[#9AA0AC]">
            No cancelled orders yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cancelled.map((order) => {
            const firstItem = order.subOrders[0]?.items[0];
            const image =
              PRODUCTS.find((p) => p.title === firstItem?.productTitle)?.image ||
              PLACEHOLDER_IMAGE;
            return (
              <div
                key={order.orderId}
                className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 flex gap-3"
              >
                <img
                  src={image}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover border border-[#E8EDF2] shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-[13.5px] font-extrabold text-[#1A1A2E]">
                      {order.orderId}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-rose-50 text-rose-700 border-rose-200">
                      Cancelled
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#4B5563] truncate">
                    {firstItem?.productTitle || 'Order items'}
                    {order.bookingRequestId ? ' · Booking' : ''}
                  </p>
                  <p className="text-[11.5px] text-[#9AA0AC] mt-1">
                    {order.cancelledAt
                      ? new Date(order.cancelledAt).toLocaleString('en-BD')
                      : '—'}
                    {order.cancellationReason
                      ? ` · ${order.cancellationReason}`
                      : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[13px] font-extrabold text-[#1A1A2E] tabular-nums">
                    ৳{order.overallTotal.toLocaleString('en-BD')}
                  </div>
                  <Package size={14} className="text-[#9AA0AC] ml-auto mt-2" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
