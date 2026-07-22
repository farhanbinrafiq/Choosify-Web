import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  ArrowRight,
  FileText,
  CheckCircle,
  Clock,
  Truck,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../constants';
import { toast } from '../lib/notify';

export function CustomerOrdersPage({
  embedded = false,
  onOpenConversation,
}: {
  /** Render inside Dashboard shell (keep sidebar) */
  embedded?: boolean;
  onOpenConversation?: (threadId: string) => void;
} = {}) {
  const navigate = useNavigate();
  const { orders, cancelOrder } = useGlobalState();
  const { createNewThread, addNotification } = useDashboard();

  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const [returningOrderId, setReturningOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('Wrong Item');
  const [returnDesc, setReturnDesc] = useState('');
  const [returnedOrderIds, setReturnedOrderIds] = useState<Set<string>>(new Set());

  const handleOpenConversation = (subOrder: any, parentOrderId: string) => {
    const threadId = `thread-${subOrder.sellerId}`;
    createNewThread(
      threadId,
      `${subOrder.sellerBusinessName} Factory Outlet`,
      `https://i.pravatar.cc/150?u=${subOrder.sellerId}`,
      'retail',
      `Negotiating lot details and courier dispatch queries for order ${parentOrderId}`,
      parentOrderId
    );

    toast.success(`Active channel opened with ${subOrder.sellerBusinessName}`);
    if (onOpenConversation) {
      onOpenConversation(threadId);
    } else {
      navigate(`/messages/${threadId}`);
    }
  };

  const handleDownloadInvoice = (order: any, sub: any) => {
    const content = `
CHOOSIFY.BD — OFFICIAL INVOICE
================================
Order ID: ${order.orderId}
Invoice ID: ${sub.invoiceId}
Date: ${new Date(order.createdAt).toLocaleDateString('en-BD')}
Seller: ${sub.sellerBusinessName}
Payment: ${order.isCOD ? 'Cash on Delivery' : 'Online Payment'}

ITEMS:
${sub.items.map((it: any) => {
  const base = `- ${it.productTitle} x${it.quantity} @ ৳${it.price.toLocaleString()} = ৳${(it.price * it.quantity).toLocaleString()}`;
  if (it.productType !== 'service') return base;
  const serviceDetails = Object.entries(it.serviceDetails || {})
    .map(([label, value]) => `    ${label.replace(/([A-Z])/g, ' $1')}: ${value}`)
    .join('\n');
  return `${base}\n  Service Overview: ${it.serviceCategory || 'Service'}\n  Service Specifications:\n${serviceDetails || '    As agreed in seller conversation'}\n  Complimentary Features: See confirmed offer\n  Property Specs: See listing details`;
}).join('\n')}

Subtotal: ৳${sub.items.reduce((a: number, it: any) => a + it.price * it.quantity, 0).toLocaleString()}
Delivery: ৳${sub.deliveryFee}
TOTAL: ৳${(sub.items.reduce((a: number, it: any) => a + it.price * it.quantity, 0) + sub.deliveryFee).toLocaleString()}

Thank you for shopping with Choosify.bd
    `.trim();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sub.invoiceId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Invoice ${sub.invoiceId} downloaded.`);
  };

  const getProductImageByTitle = (title: string) => {
    const p = PRODUCTS.find((prod) => prod.title === title);
    return p?.image || PLACEHOLDER_IMAGE;
  };

  return (
    <div
      className={
        embedded
          ? 'w-full text-[#1A1A2E] font-sans animate-in fade-in slide-in-from-bottom-5 duration-700'
          : 'flex flex-col min-h-screen bg-choosify-feed text-[#1A1A2E] font-sans'
      }
    >
      {!embedded && (
      <div className="w-full px-5 sm:px-8 pt-4">
        <header className="max-w-7xl mx-auto choosify-dark-surface text-white border border-white/5 rounded-none overflow-hidden">
          <div className="w-full px-5 sm:px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                to="/dashboard"
                className="text-[11px] font-semibold text-white/55 hover:text-white transition-colors flex items-center gap-1.5 mb-2"
              >
                <ArrowLeft size={12} /> Back to dashboard
              </Link>
              <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-white">
                My orders
              </h1>
              <p className="mt-1.5 text-[13px] font-medium text-white/55">
                Active and past purchases across Choosify sellers
              </p>
            </div>

            <Link
              to="/messages"
              className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-[12px] px-4 py-2.5 rounded-lg transition-all"
            >
              <MessageSquare size={14} className="text-[#EB4501]" />
              Chat support
            </Link>
          </div>
        </header>
      </div>
      )}

      {embedded && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="text-left">
            <h2 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight mb-1">My Orders</h2>
            <p className="text-[#9AA0AC] text-[12.5px]">Active and past purchases across Choosify sellers</p>
          </div>
        </div>
      )}

      <div className={embedded ? 'w-full' : 'max-w-7xl mx-auto w-full px-4 md:px-8 py-10 flex-1'}>
        {orders.length === 0 ? (
          <div className="bg-white border border-[#E8EDF2] rounded-xl p-12 sm:p-16 text-center max-w-xl mx-auto space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-[#F4F7F9] rounded-full border border-[#E8EDF2] flex items-center justify-center text-[#9AA0AC] mx-auto">
              <Package size={28} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-[#1A1A2E] mb-2">
                No orders yet
              </h3>
              <p className="text-sm text-[#9AA0AC] font-medium leading-relaxed">
                Complete checkout to see your orders here.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#EB4501] hover:brightness-110 rounded-lg text-sm font-bold text-white transition-all"
            >
              Browse products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center text-[12px] font-semibold text-[#9AA0AC] px-1">
              <span>Your orders</span>
              <span>
                {orders.length} transaction{orders.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="space-y-6">
              {orders.map((order) => {
                const orderDate = new Date(order.createdAt).toLocaleString();
                const totalItemCount = order.subOrders.reduce(
                  (acc, sub) =>
                    acc + sub.items.reduce((sum, item) => sum + item.quantity, 0),
                  0
                );
                const allPending = order.subOrders.every(
                  (sub: any) => sub.trackingStatus === 'pending'
                );
                const allDelivered = order.subOrders.every(
                  (sub: any) => sub.trackingStatus === 'delivered'
                );
                const isCancelled = order.status === 'cancelled' || !!order.cancelledAt;

                return (
                  <div
                    key={order.orderId}
                    className="bg-white border border-[#E8EDF2] rounded-xl p-5 md:p-7 space-y-5 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E8EDF2] pb-4 gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[11px] font-bold bg-[#EB4501]/10 border border-[#EB4501]/20 text-[#EB4501] px-2.5 py-0.5 rounded-md">
                            {order.orderId}
                          </span>
                          {isCancelled && (
                            <span className="text-[10px] font-bold bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded-md">
                              Cancelled
                            </span>
                          )}
                          {order.status === 'pending_payment' && (
                            <span className="text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-md">
                              Pending Payment
                            </span>
                          )}
                          {order.status === 'confirmed' && (
                            <span className="text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-md">
                              Confirmed
                            </span>
                          )}
                          <span className="text-[10px] font-bold bg-[#F4F7F9] border border-[#E8EDF2] text-[#1A1A2E] px-2 py-0.5 rounded-md">
                            {order.isCOD ? 'Cash on delivery' : 'Prepaid'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-[#9AA0AC] font-medium">
                          <span>Placed {orderDate}</span>
                          <span>·</span>
                          <span>
                            {totalItemCount} item{totalItemCount === 1 ? '' : 's'}
                          </span>
                        </div>
                      </div>

                      <div className="md:text-right">
                        <span className="text-[11px] font-semibold text-[#9AA0AC] block mb-1">
                          Order total
                        </span>
                        <p className="text-xl font-extrabold text-[#07DD05] tracking-tight leading-none">
                          ৳{(order.overallTotal ?? 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.subOrders.map((sub: any, sIdx: number) => {
                        const subTotal = sub.items.reduce(
                          (sum: number, it: any) =>
                            sum + (it.price ?? 0) * (it.quantity ?? 0),
                          0
                        );
                        return (
                          <div
                            key={sIdx}
                            className="bg-[#F4F7F9] border border-[#E8EDF2] hover:border-[#d5dce5] rounded-xl p-4 md:p-5 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-5"
                          >
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-bold bg-white border border-[#E8EDF2] text-[#1A1A2E] px-2 py-0.5 rounded font-mono">
                                  {sub.invoiceId}
                                </span>
                                <span className="text-sm font-bold text-[#EB4501] tracking-tight">
                                  {sub.sellerBusinessName}
                                </span>
                              </div>

                              <div className="space-y-2.5">
                                {sub.items.map((it: any, iIdx: number) => (
                                  <div key={iIdx} className="flex gap-3 items-center">
                                    <div className="w-12 h-12 rounded-lg border border-[#E8EDF2] bg-white p-1 shrink-0">
                                      <img
                                        src={getProductImageByTitle(it.productTitle)}
                                        className="w-full h-full object-contain"
                                        alt=""
                                      />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-bold text-[#1A1A2E] hover:text-[#CF4400] transition-colors tracking-tight leading-snug truncate max-w-sm">
                                        {it.productTitle}
                                      </h4>
                                      <span className="text-[12px] text-[#9AA0AC] font-medium block mt-0.5">
                                        {(it.quantity ?? 1)} × ৳
                                        {(it.price ?? 0).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-start lg:items-center gap-4 shrink-0 w-full sm:w-auto">
                              <div className="text-left md:text-right">
                                <span className="text-[11px] font-semibold text-[#9AA0AC] block mb-1">
                                  Lot total
                                </span>
                                <p className="text-base font-extrabold text-[#EB4501] tracking-tight leading-none mb-2">
                                  ৳
                                  {(
                                    (subTotal ?? 0) + (sub.deliveryFee ?? 0)
                                  ).toLocaleString()}
                                </p>

                                <span
                                  className={`text-[11px] font-bold tracking-tight px-2 py-0.5 rounded-md border inline-flex items-center gap-1
                                  ${sub.trackingStatus === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' : ''}
                                  ${sub.trackingStatus === 'dispatched' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
                                  ${sub.trackingStatus === 'transit' ? 'bg-violet-50 border-violet-200 text-violet-700' : ''}
                                  ${sub.trackingStatus === 'delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}
                                `}
                                >
                                  {sub.trackingStatus === 'pending' && <Clock size={10} />}
                                  {sub.trackingStatus === 'dispatched' && (
                                    <Package size={10} />
                                  )}
                                  {sub.trackingStatus === 'transit' && <Truck size={10} />}
                                  {sub.trackingStatus === 'delivered' && (
                                    <CheckCircle size={10} />
                                  )}
                                  {sub.trackingStatus}
                                </span>
                              </div>

                              <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto items-center">
                                {order.status === 'pending_payment' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      navigate(`/checkout?orderId=${encodeURIComponent(order.orderId)}`, {
                                        state: { pendingOrderId: order.orderId },
                                      })
                                    }
                                    className="flex-1 sm:flex-none h-10 px-4 rounded-lg bg-[#EB4501] hover:bg-[#CF4400] text-white text-[12px] font-bold transition-all flex items-center justify-center gap-1.5"
                                  >
                                    Pay now
                                  </button>
                                )}
                                {allPending && !isCancelled && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCancellingOrderId(order.orderId);
                                      setCancelReason('');
                                      setReturningOrderId(null);
                                    }}
                                    className="px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 text-[12px] font-bold rounded-lg transition-all cursor-pointer border border-red-200 hover:border-red-300"
                                  >
                                    Cancel order
                                  </button>
                                )}

                                {allDelivered &&
                                  (returnedOrderIds.has(order.orderId) ? (
                                    <span className="text-[11px] font-bold text-emerald-700 border border-emerald-200 bg-emerald-50 px-2 py-1 rounded-lg">
                                      Return requested
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReturningOrderId(order.orderId);
                                        setReturnReason('Wrong Item');
                                        setReturnDesc('');
                                        setCancellingOrderId(null);
                                      }}
                                      className="text-[12px] font-bold text-[#EB4501] hover:brightness-110 transition-colors cursor-pointer bg-transparent border-none"
                                    >
                                      Request return
                                    </button>
                                  ))}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleOpenConversation(sub, order.orderId)
                                  }
                                  className="flex-1 sm:flex-none h-10 px-3.5 rounded-lg bg-white hover:bg-[#CF4400] hover:text-white text-[#1A1A2E] border border-[#E8EDF2] text-[12px] font-bold transition-all flex items-center justify-center gap-1.5"
                                  title="Message seller about this order"
                                >
                                  <MessageSquare size={13} />
                                  <span>Message</span>
                                </button>

                                {order.status !== 'pending_payment' && (
                                <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate('/order-tracking', { state: { order } })
                                  }
                                  className="flex-1 sm:flex-none h-10 px-3.5 rounded-lg bg-[#EB4501] hover:brightness-110 text-white text-[12px] font-bold transition-all flex items-center justify-center gap-1.5"
                                  title="Track this order"
                                >
                                  <Truck size={13} />
                                  <span>Track</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDownloadInvoice(order, sub)}
                                  className="h-10 w-10 rounded-lg bg-white hover:bg-[#F4F7F9] text-[#9AA0AC] flex items-center justify-center border border-[#E8EDF2] shrink-0"
                                  title="Download invoice"
                                >
                                  <FileText size={14} />
                                </button>
                                </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {cancellingOrderId === order.orderId && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-4 animate-fade-in text-left">
                        <span className="text-sm font-bold text-red-600 tracking-tight">
                          Cancel this order?
                        </span>
                        <div className="space-y-1.5">
                          <label className="text-[12px] font-semibold text-[#9AA0AC] block">
                            Reason for cancellation *
                          </label>
                          <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Tell us why you need to cancel..."
                            className="w-full h-16 bg-white border border-[#E8EDF2] rounded-lg p-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-red-400 font-sans"
                          />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              if (!cancelReason.trim()) {
                                toast.error('Cancellation reason is required.');
                                return;
                              }
                              cancelOrder(order.orderId, cancelReason);
                              setCancellingOrderId(null);
                              setCancelReason('');
                              toast.success('Order cancelled successfully.');
                            }}
                            className="px-5 py-2.5 bg-[#EB4501] hover:bg-[#CF4400] text-white text-[12px] font-bold rounded-lg transition-all cursor-pointer border-0"
                          >
                            Confirm cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCancellingOrderId(null);
                              setCancelReason('');
                            }}
                            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-[#1A1A2E] text-[12px] font-bold rounded-lg transition-all cursor-pointer border border-[#E8EDF2]"
                          >
                            Keep order
                          </button>
                        </div>
                      </div>
                    )}

                    {returningOrderId === order.orderId && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4 animate-fade-in text-left">
                        <span className="text-sm font-bold text-[#EB4501] tracking-tight">
                          Request return
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#9AA0AC] block">
                              Reason
                            </label>
                            <select
                              value={returnReason}
                              onChange={(e) => setReturnReason(e.target.value)}
                              className="w-full h-10 bg-white border border-[#E8EDF2] rounded-lg px-3 text-sm font-medium text-[#1A1A2E] focus:outline-none focus:border-[#EB4501]"
                            >
                              <option value="Wrong Item">Wrong Item</option>
                              <option value="Damaged">Damaged</option>
                              <option value="Not as Described">Not as Described</option>
                              <option value="Changed Mind">Changed Mind</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[12px] font-semibold text-[#9AA0AC] block">
                              Details
                            </label>
                            <textarea
                              value={returnDesc}
                              onChange={(e) => setReturnDesc(e.target.value)}
                              placeholder="Describe the issue..."
                              className="w-full h-20 bg-white border border-[#E8EDF2] rounded-lg p-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-[#EB4501] font-sans"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              window.dispatchEvent(
                                new CustomEvent('choosify-return-request', {
                                  detail: {
                                    orderId: order.orderId,
                                    reason: returnReason,
                                    description: returnDesc,
                                  },
                                })
                              );
                              toast.success(
                                'Return request submitted. We will respond within 48 hours.'
                              );
                              addNotification(
                                'Your return request has been submitted.',
                                'order'
                              );
                              setReturnedOrderIds((prev) => {
                                const next = new Set(prev);
                                next.add(order.orderId);
                                return next;
                              });
                              setReturningOrderId(null);
                              setReturnReason('Wrong Item');
                              setReturnDesc('');
                            }}
                            className="px-5 py-2.5 bg-[#EB4501] hover:bg-[#CF4400] text-white text-[12px] font-bold rounded-lg transition-all cursor-pointer border-0"
                          >
                            Submit return request
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReturningOrderId(null);
                              setReturnReason('Wrong Item');
                              setReturnDesc('');
                            }}
                            className="px-5 py-2.5 bg-white hover:bg-gray-50 text-[#1A1A2E] text-[12px] font-bold rounded-lg transition-all cursor-pointer border border-[#E8EDF2]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
