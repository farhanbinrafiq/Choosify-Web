import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { operationsApi, type TrackedShipment } from '../services/operationsApi';
import {
  Truck,
  CheckCircle,
  Clock,
  Package,
  Settings,
  MapPin,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';

type TrackingStatus = 'pending' | 'dispatched' | 'transit' | 'delivered';

const STATUS_PILL: Record<
  TrackingStatus | 'cancelled',
  { label: string; className: string }
> = {
  pending: {
    label: 'ORDER PLACED',
    className: 'bg-[#F4F7F9] text-[#1A1A2E]',
  },
  dispatched: {
    label: 'DISPATCHED',
    className: 'bg-[#EEF2FF] text-[#2323FF]',
  },
  transit: {
    label: 'OUT FOR DELIVERY',
    className: 'bg-[#FFF3EC] text-[#EB4501]',
  },
  delivered: {
    label: 'DELIVERED',
    className: 'bg-[#ECFDF5] text-[#059669]',
  },
  cancelled: {
    label: 'CANCELLED',
    className: 'bg-[#FEF2F2] text-[#FF000D]',
  },
};

const TIMELINE_STEPS: {
  key: TrackingStatus;
  label: string;
  sub: string;
  Icon: typeof Package;
}[] = [
  { key: 'pending', label: 'Order Placed', sub: 'We received your order', Icon: Package },
  { key: 'dispatched', label: 'Dispatched', sub: 'Packed and handed to courier', Icon: Truck },
  { key: 'transit', label: 'Out for Delivery', sub: 'On the way to your address', Icon: MapPin },
  { key: 'delivered', label: 'Delivered', sub: 'Package settled with you', Icon: CheckCircle },
];

function formatMoney(amount: number) {
  return `৳${amount.toLocaleString()}`;
}

function statusIndex(status: string) {
  const sequence: TrackingStatus[] = ['pending', 'dispatched', 'transit', 'delivered'];
  return sequence.indexOf(status as TrackingStatus);
}

export function OrderTrackingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, updateSubOrderStatus, allProducts } = useGlobalState();

  // Load from location state OR retrieve latest order from localStorage database
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(() => {
    const locOrder = (location.state as any)?.order;
    if (locOrder) return locOrder.orderId;
    const history = JSON.parse(localStorage.getItem('choosify_orders') || '[]');
    return history.length > 0 ? history[0].orderId : null;
  });

  const order = selectedOrderId ? orders.find((o) => o.orderId === selectedOrderId) || null : null;
  const [remoteShipment, setRemoteShipment] = useState<TrackedShipment | null>(null);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    if (!selectedOrderId) {
      setRemoteShipment(null);
      return;
    }
    operationsApi.trackShipment(selectedOrderId).then(setRemoteShipment).catch(() => setRemoteShipment(null));
  }, [selectedOrderId]);

  const handleSearchOrder = async () => {
    if (!searchId.trim()) return;
    const found = orders.find((x: any) => x.orderId.toUpperCase() === searchId.trim().toUpperCase());
    if (found) {
      setSelectedOrderId(found.orderId);
      toast.success(`Lot Ticket "${searchId.toUpperCase()}" loaded!`);
      return;
    }
    try {
      await operationsApi.trackShipment(searchId.trim());
      setSelectedOrderId(searchId.trim().toUpperCase());
      toast.success(`Tracking loaded for "${searchId.toUpperCase()}"`);
    } catch {
      toast.error(`Ticket "${searchId.toUpperCase()}" not found.`);
      setSelectedOrderId(null);
    }
  };

  // Mock Progression Helper
  const handleSimulateTransit = () => {
    if (!order) return;

    // Progression loop: pending -> dispatched -> transit -> delivered
    const currentStatus = order.subOrders[0]?.trackingStatus || 'pending';
    let nextStatus: TrackingStatus = 'dispatched';

    if (currentStatus === 'pending') nextStatus = 'dispatched';
    else if (currentStatus === 'dispatched') nextStatus = 'transit';
    else if (currentStatus === 'transit') nextStatus = 'delivered';
    else {
      toast.success('This freight package is already marked as DELIVERED!');
      return;
    }

    order.subOrders.forEach((sub: any) => {
      updateSubOrderStatus(order.orderId, sub.sellerId, nextStatus);
    });
    toast.success(`Lot Milestone advanced: ${nextStatus.toUpperCase()}`);
  };

  const getStepActive = (status: string, milestone: string) => {
    const sIdx = statusIndex(status);
    const mIdx = statusIndex(milestone);
    return sIdx >= mIdx;
  };

  const trackingStatus = (order?.subOrders[0]?.trackingStatus || 'pending') as TrackingStatus;
  const isCancelled = order?.status === 'cancelled';
  const pill = STATUS_PILL[isCancelled ? 'cancelled' : trackingStatus];
  const carrier = remoteShipment?.courier || order?.subOrders[0]?.sellerBusinessName || 'Paperfly';
  const trackingNo = remoteShipment?.trackingNumber || order?.orderId || '—';
  const eta =
    order?.subOrders[0]?.estimatedDeliveryDate ||
    (order
      ? new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
          'en-GB',
          { day: 'numeric', month: 'short', year: 'numeric' },
        )
      : '—');

  const lineItems =
    order?.subOrders.flatMap((sub) =>
      sub.items.map((it: any) => ({
        ...it,
        sellerBusinessName: sub.sellerBusinessName,
        image: it.image as string | undefined,
        variantLabel: it.variantLabel as string | undefined,
      })),
    ) ?? [];

  const recommendations = (allProducts || []).slice(0, 6);

  const renderEmptyCard = (
    title: string,
    body: string,
    action: React.ReactNode,
  ) => (
    <div className="bg-white border border-[#E8EDF2] rounded-xl p-12 text-center shadow-sm max-w-xl mx-auto space-y-5">
      <div className="w-14 h-14 bg-[#FFF3EC] rounded-full flex items-center justify-center text-[#EB4501] mx-auto">
        <Package size={28} />
      </div>
      <div>
        <h3 className="text-lg font-extrabold text-[#1A1A2E] mb-1">{title}</h3>
        <p className="text-[12px] text-[#9AA0AC] leading-relaxed">{body}</p>
      </div>
      <div className="pt-1">{action}</div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {/* Compact navy header — constrained to feed silhouette */}
      <div className="w-full px-5 sm:px-10 pt-4">
        <div className="max-w-[1100px] mx-auto choosify-dark-surface text-white px-5 sm:px-10 pt-6 pb-8 rounded-none overflow-hidden">
          <div className="text-[12px] text-white/45 mb-4">
            <Link to="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            <span className="mx-1.5">›</span>
            <Link to="/profile/orders" className="hover:text-white/80 transition-colors">
              My Orders
            </Link>
            {order && (
              <>
                <span className="mx-1.5">›</span>
                <span className="text-[#EB4501]">{order.orderId}</span>
              </>
            )}
          </div>

          <div className="flex justify-between items-center flex-wrap gap-3.5">
            <div>
              <div className="text-[21px] font-extrabold leading-tight flex items-center gap-2">
                <MapPin size={20} className="text-[#EB4501] shrink-0" />
                Track Your Order
              </div>
              {order ? (
                <div className="text-[12px] text-white/55 mt-1">
                  {order.orderId}
                  <span className="mx-1.5">·</span>
                  {carrier}
                  <span className="mx-1.5">·</span>
                  Tracking No: {trackingNo}
                </div>
              ) : (
                <div className="text-[12px] text-white/55 mt-1">
                  Enter an order ID to see live shipment progress
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {orders.length > 0 && (
                <div className="flex gap-2">
                  <input
                    className="bg-white/5 border border-white/15 rounded-lg h-9 px-3 text-[12px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#EB4501] w-[160px] sm:w-[180px]"
                    placeholder="ORD-XXXXX"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchOrder()}
                  />
                  <button
                    type="button"
                    onClick={handleSearchOrder}
                    className="bg-[#EB4501] hover:bg-[#CF4400] text-white text-[11.5px] font-bold px-4 rounded-lg transition-colors h-9 cursor-pointer border-none"
                  >
                    Search
                  </button>
                </div>
              )}
              {order && (
                <div
                  className={`text-[11.5px] font-extrabold px-4 py-2 rounded-full ${pill.className}`}
                >
                  {pill.label}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping body */}
      <div className="max-w-[1100px] mx-auto w-full px-5 sm:px-10 pb-16 -mt-4 relative z-[2] flex-1">
        {order === null && orders.length === 0 ? (
          renderEmptyCard(
            'No orders yet',
            'Your placed orders will appear here for tracking.',
            <Link
              to="/products"
              className="inline-block bg-[#EB4501] hover:bg-[#CF4400] text-white text-[11.5px] font-bold px-6 py-2.5 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>,
          )
        ) : !order ? (
          renderEmptyCard(
            'Order not found',
            'No order matches that reference number. Please check the ID and try again.',
            <button
              type="button"
              onClick={() => setSelectedOrderId(null)}
              className="text-[12px] font-bold text-[#EB4501] hover:underline cursor-pointer bg-transparent border-none"
            >
              Clear Search
            </button>,
          )
        ) : (
          <div className="space-y-5">
            {(import.meta as any).env?.DEV && (
              <div className="bg-[#1A1A2E] p-4 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[#EB4501] shrink-0" />
                  <div>
                    <h4 className="text-[12px] font-bold text-white/90">Delivery Simulator</h4>
                    <p className="text-[11px] text-white/50">Advance status to preview timeline states</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSimulateTransit}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 text-white text-[11.5px] font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Settings size={12} className="text-[#EB4501]" />
                  Advance Transit Step
                </button>
              </div>
            )}

            {isCancelled && (
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] rounded-xl px-5 py-4 space-y-1">
                <div className="flex items-center gap-2 font-bold text-[12px]">
                  <span className="inline-block w-2 h-2 bg-[#FF000D] rounded-full animate-pulse" />
                  This order was cancelled
                </div>
                {order.cancellationReason && (
                  <p className="text-[12px] text-[#DC2626]">Reason: {order.cancellationReason}</p>
                )}
                <p className="text-[11px] text-[#9AA0AC] font-mono">
                  Cancelled on:{' '}
                  {new Date(order.cancelledAt || order.createdAt).toLocaleDateString('en-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            {remoteShipment && (
              <div className="rounded-xl border border-[#EB4501]/30 bg-[#FFF6EF] px-4 py-3 text-[12px] text-[#4B5563]">
                <div className="font-bold text-[#EB4501] text-[11px] mb-1">Live shipment status</div>
                <div>
                  Courier: {remoteShipment.courier} · Tracking: {remoteShipment.trackingNumber}
                </div>
                <div className="capitalize">Status: {remoteShipment.status.replace(/_/g, ' ')}</div>
                {remoteShipment.trackingEvents[0] && (
                  <div className="text-[11px] text-[#9AA0AC] mt-1">
                    {remoteShipment.trackingEvents[0].description}
                  </div>
                )}
              </div>
            )}

            {/* 2fr / 1fr card grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
              {/* Shipment progress — vertical timeline */}
              <div
                className={`bg-white border border-[#E8EDF2] rounded-xl px-6 py-6 sm:px-7 ${
                  isCancelled ? 'opacity-50' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                  <div className="text-[12.5px] font-extrabold text-[#1A1A2E]">SHIPMENT PROGRESS</div>
                  <div className="text-[11px] text-[#9AA0AC]">
                    Estimated delivery:{' '}
                    <strong className="text-[#1A1A2E] font-bold">{eta}</strong>
                  </div>
                </div>

                <div className="flex flex-col">
                  {TIMELINE_STEPS.map((step, idx) => {
                    const active = getStepActive(trackingStatus, step.key);
                    const current = trackingStatus === step.key && !isCancelled;
                    const isLast = idx === TIMELINE_STEPS.length - 1;
                    const lineDone = getStepActive(trackingStatus, TIMELINE_STEPS[Math.min(idx + 1, TIMELINE_STEPS.length - 1)].key) && active;
                    const Icon = step.Icon;

                    return (
                      <div key={step.key} className="flex gap-3.5">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[12px] ${
                              active
                                ? current
                                  ? 'bg-[#EB4501] text-white shadow-[0_0_0_4px_#FFF3EC]'
                                  : 'bg-[#EB4501] text-white'
                                : 'bg-[#F4F7F9] text-[#9AA0AC] border border-[#E8EDF2]'
                            }`}
                          >
                            {active && !current ? <CheckCircle size={14} /> : <Icon size={14} />}
                          </div>
                          {!isLast && (
                            <div
                              className="w-0.5 flex-1 min-h-[34px]"
                              style={{ background: lineDone || active ? '#EB4501' : '#E8EDF2' }}
                            />
                          )}
                        </div>
                        <div className={isLast ? 'pb-0' : 'pb-[22px]'}>
                          <div
                            className={`text-[13px] font-bold ${
                              active ? 'text-[#1A1A2E]' : 'text-[#9AA0AC]'
                            }`}
                          >
                            {step.label}
                          </div>
                          <div className="text-[11px] text-[#9AA0AC]">{step.sub}</div>
                          {remoteShipment?.trackingEvents?.find(
                            (ev) => ev.status?.toLowerCase().includes(step.key),
                          ) && (
                            <div className="text-[10px] text-[#9AA0AC] mt-0.5">
                              {
                                remoteShipment.trackingEvents.find((ev) =>
                                  ev.status?.toLowerCase().includes(step.key),
                                )?.location
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment note */}
                <div className="mt-5 pt-4 border-t border-[#E8EDF2] flex justify-between items-center text-[11px] text-[#9AA0AC]">
                  <span>Payment</span>
                  <span className="font-bold text-[#1A1A2E]">
                    {order.isCOD ? 'Cash on Delivery (COD)' : 'Commercial Prepayment'}
                  </span>
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-[#E8EDF2] rounded-xl p-5">
                  <div className="text-[12px] font-extrabold text-[#1A1A2E] mb-3.5 flex items-center gap-1.5">
                    <Package size={14} className="text-[#EB4501]" />
                    ITEM IN THIS ORDER
                  </div>
                  <div className="space-y-3">
                    {lineItems.map((it, iIdx) => (
                      <div key={iIdx} className="flex gap-3 items-center">
                        <div className="w-[52px] h-[52px] rounded-lg overflow-hidden shrink-0 bg-[#F4F7F9] border border-[#E8EDF2]">
                          {it.image ? (
                            <img
                              src={it.image}
                              alt={it.productTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#9AA0AC]">
                              <Package size={18} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-bold text-[#1A1A2E] truncate">
                            {it.productTitle}
                          </div>
                          <div className="text-[10.5px] text-[#9AA0AC]">
                            {it.variantLabel || it.sellerBusinessName} · Qty: {it.quantity}
                          </div>
                        </div>
                        <div className="text-[12.5px] font-bold text-[#1A1A2E] shrink-0">
                          {formatMoney(it.price * it.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-[#E8EDF2] rounded-xl p-5">
                  <div className="text-[12px] font-extrabold text-[#1A1A2E] mb-3 flex items-center gap-1.5">
                    <Truck size={14} className="text-[#EB4501]" />
                    COURIER DETAILS
                  </div>
                  <div className="text-[12px] text-[#4B5563] leading-[1.8]">
                    <div className="flex justify-between gap-3">
                      <span>Courier Partner</span>
                      <span className="font-bold text-[#1A1A2E] text-right">{carrier}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span>Tracking Number</span>
                      <span className="font-bold text-[#1A1A2E] text-right break-all">
                        {trackingNo}
                      </span>
                    </div>
                    {order.subOrders.length > 1 && (
                      <div className="flex justify-between gap-3">
                        <span>Shipments</span>
                        <span className="font-bold text-[#1A1A2E]">
                          {order.subOrders.length} splits
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (remoteShipment?.trackingNumber) {
                        toast.success(`Tracking ${remoteShipment.trackingNumber} — open courier site when linked.`);
                      } else {
                        toast('Courier tracking link will open when available.', { icon: '🚚' });
                      }
                    }}
                    className="w-full bg-[#1A1A2E] hover:bg-[#000435] text-white border-none py-2.5 rounded-lg text-[11.5px] font-bold cursor-pointer mt-3.5 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    TRACK ON COURIER SITE
                    <ExternalLink size={12} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/messages')}
                  className="bg-white border border-[#FCA5A5] text-[#FF000D] py-2.5 rounded-lg text-[11.5px] font-bold cursor-pointer hover:bg-[#FEF2F2] transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={13} />
                  Need help? Contact Support
                </button>
              </div>
            </div>

            {/* Optional sponsored banner — chrome only */}
            <div className="bg-[#FFF6EF] rounded-[10px] overflow-hidden border-[1.5px] border-dashed border-[#EB4501] relative">
              <div className="absolute top-2.5 left-3.5 bg-[#1A1A2E] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-[3px] z-[1]">
                SPONSORED
              </div>
              <div className="h-[110px] bg-gradient-to-br from-[#EB4501] to-[#2323FF] flex items-center justify-center text-white text-[12px] font-extrabold text-center px-5">
                While you wait — deals picked for you
              </div>
              <div className="px-5 py-3.5 flex justify-between items-center gap-3 flex-wrap">
                <div>
                  <div className="text-[12px] font-bold text-[#1A1A2E] mb-1">
                    Protect your new purchase
                  </div>
                  <div className="text-[11px] text-[#4B5563]">
                    Extended warranty plans starting at ৳499
                  </div>
                </div>
                <Link
                  to="/deals"
                  className="bg-[#EB4501] hover:bg-[#CF4400] text-white px-[18px] py-2 rounded-lg text-[11.5px] font-bold whitespace-nowrap transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Recommended rail from existing catalog */}
            {recommendations.length > 0 && (
              <div>
                <div className="flex justify-between items-baseline mb-3.5">
                  <div className="text-[13px] font-extrabold text-[#1A1A2E]">
                    RECOMMENDED FOR YOU
                  </div>
                  <Link
                    to="/products"
                    className="text-[11.5px] font-bold text-[#EB4501] hover:text-[#CF4400]"
                  >
                    View all recommendations →
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
                  {recommendations.map((p) => (
                    <Link
                      key={p.id}
                      to={`/products/${p.id}`}
                      className="cursor-pointer group"
                    >
                      <div className="h-[100px] rounded-lg overflow-hidden mb-2 bg-[#E8EDF2]">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          />
                        ) : null}
                      </div>
                      <div className="text-[11px] font-normal text-[#1A1A2E] mb-1 leading-snug line-clamp-2">
                        {p.title}
                      </div>
                      <div className="text-[11.5px] font-extrabold text-[#EB4501]">
                        {formatMoney(p.price)}
                      </div>
                      {p.rating != null && (
                        <div className="text-[10px] text-[#9AA0AC]">★ {p.rating.toFixed(1)}</div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
