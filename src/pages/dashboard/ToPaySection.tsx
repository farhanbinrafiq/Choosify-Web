import React, { useMemo } from 'react';
import { Banknote, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { getPendingToPayOrders } from '../../lib/dashboard/pendingActions';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../../constants';

export function ToPaySection() {
  const navigate = useNavigate();
  const { orders } = useGlobalState();
  const pending = useMemo(() => getPendingToPayOrders(orders), [orders]);

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div>
        <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">
          To Pay
        </h2>
        <p className="text-[#9AA0AC] text-[12.5px]">
          Unpaid orders and booking-request payments awaiting checkout
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="py-16 border border-dashed border-[#E8EDF2] rounded-[10px] flex flex-col items-center justify-center text-center bg-white">
          <Banknote className="text-[#9AA0AC] mb-3" size={28} />
          <p className="text-[13px] font-medium text-[#9AA0AC]">
            Nothing waiting to be paid
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((order) => {
            const firstItem = order.subOrders[0]?.items[0];
            const image =
              PRODUCTS.find((p) => p.title === firstItem?.productTitle)?.image ||
              PLACEHOLDER_IMAGE;
            const due = order.paymentDueAt
              ? new Date(order.paymentDueAt).toLocaleString('en-BD')
              : null;
            return (
              <div
                key={order.orderId}
                className="bg-white border border-[#E8EDF2] rounded-[10px] p-4 flex flex-col sm:flex-row sm:items-center gap-3"
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
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                      <Clock size={10} />
                      Awaiting payment
                    </span>
                  </div>
                  <p className="text-[12.5px] text-[#4B5563] truncate">
                    {firstItem?.productTitle || 'Order items'}
                    {order.bookingRequestId ? ' · Booking request' : ''}
                  </p>
                  {due ? (
                    <p className="text-[11.5px] text-[#9AA0AC] mt-1">Pay by {due}</p>
                  ) : null}
                </div>
                <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
                  <div className="text-[14px] font-extrabold text-[#1A1A2E] tabular-nums">
                    ৳{order.overallTotal.toLocaleString('en-BD')}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/checkout', { state: { pendingOrderId: order.orderId } })
                    }
                    className="px-4 py-2 bg-[#EB4501] hover:brightness-110 text-white text-[12px] font-bold rounded-lg border-0 cursor-pointer"
                  >
                    Pay now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
