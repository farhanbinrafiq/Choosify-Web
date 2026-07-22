import React, { useMemo, useRef } from 'react';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  MessageSquare,
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  Package,
  Home,
  X,
} from 'lucide-react';
import { toast } from '../lib/notify';
import { useGlobalState } from '../context/GlobalStateContext';
import type { Order } from '../types/schemas';
import { cn } from '../lib/utils';
import { usePageBreadcrumbs } from '../context/BreadcrumbContext';

const formatMoney = (amount: number) => `৳${amount.toLocaleString()}`;

const formatDateTime = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

export function OrderSuccessPage() {
  usePageBreadcrumbs({ hidden: true });
  const heroRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, clearCart } = useGlobalState();

  const locationOrder = (location.state as { order?: Order } | null)?.order;

  const order = useMemo(() => {
    if (locationOrder) return locationOrder;

    const targetId = orderId || sessionStorage.getItem('choosify_last_order_id');
    if (targetId) {
      const match = orders.find((o) => o.orderId === targetId);
      if (match) return match;
    }

    const savedSnapshot = sessionStorage.getItem('choosify_last_order_snapshot');
    if (savedSnapshot) {
      try {
        const parsed = JSON.parse(savedSnapshot) as Order;
        if (!targetId || parsed.orderId === targetId) return parsed;
      } catch {}
    }

    return orders[0] ?? null;
  }, [locationOrder, orderId, orders]);

  React.useEffect(() => {
    if (typeof clearCart === 'function') clearCart();
  }, [clearCart]);

  const subtotal =
    order?.subtotal ??
    order?.subOrders.reduce(
      (sum, sub) => sum + sub.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      0,
    ) ??
    0;

  const deliveryTotal =
    order?.deliveryTotal ??
    order?.subOrders.reduce((sum, sub) => sum + sub.deliveryFee, 0) ??
    0;

  const handleDownloadInvoice = () => {
    toast.success('Invoice ready — PDF download will be available in a future update.');
  };

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-choosify-feed items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white border border-[#E8EDF2] rounded-xl p-8 text-center shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-lg font-extrabold text-[#1A1A2E] mb-2">No order to display</h1>
          <p className="text-xs text-[#9AA0AC] mb-6">
            Place an order from checkout to see your confirmation summary here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#EB4501] hover:bg-[#CF4400] text-white text-[11px] font-bold uppercase tracking-wide rounded-lg transition-colors"
          >
            <Home size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const shipping = order.shipping;
  const paymentLabel =
    order.paymentMethod === 'cod' || order.isCOD
      ? 'Cash on Delivery (COD)'
      : 'Commercial Credit / Prepayment';

  const pointsEarned = Math.max(10, Math.round(order.overallTotal / 100));

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed pb-16">
      {/* Confirmation hero — constrained to feed silhouette */}
      <div className="w-full px-5 sm:px-10 pt-4">
        <div
          ref={heroRef}
          className="max-w-[1100px] mx-auto choosify-dark-surface text-white px-5 sm:px-10 pt-6 pb-10 text-center rounded-none overflow-hidden"
        >
          <nav className="text-xs text-white/45 text-left mb-5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#CF4400] transition-colors">
              Home
            </Link>
            <span className="mx-1.5">›</span>
            <span>Order Success</span>
            <span className="mx-1.5">›</span>
            <span className="text-[#EB4501]">{order.orderId}</span>
          </nav>

          <div className="w-16 h-16 rounded-full bg-[rgba(7,208,80,0.15)] border-2 border-[#07DD05] flex items-center justify-center text-[#07DD05] mx-auto mb-[18px]">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl font-extrabold mb-2.5 leading-tight">
            THANK YOU — YOUR ORDER IS <span className="text-[#07DD05]">CONFIRMED!</span>
          </h1>
          <p className="text-[13px] text-white/55 max-w-[520px] mx-auto">
            Order <strong className="text-white font-mono">{order.orderId}</strong> has been recorded.
            Sellers have been notified and your items will be on the way soon.
          </p>
          <p className="text-[11.5px] text-white/45 mt-3.5">
            {formatDateTime(order.createdAt)}
          </p>
        </div>
      </div>

      <div
        id="order-success-details"
        className="max-w-[1100px] mx-auto w-full px-5 sm:px-10 -mt-[16px] sm:-mt-[24px] md:-mt-[30px] relative z-[2] space-y-5"
      >
        {/* Overlapping summary card */}
        <div className="bg-white rounded-xl border border-[#E8EDF2] p-[22px] sm:px-[26px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] gap-5 items-center shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          <div>
            <div className="text-[9.5px] font-bold text-[#9AA0AC] mb-1">ORDER ID</div>
            <div className="text-[13px] font-bold text-[#1A1A2E] font-mono">{order.orderId}</div>
          </div>
          <div>
            <div className="text-[9.5px] font-bold text-[#9AA0AC] mb-1">ORDER TYPE</div>
            <div className="text-[13px] font-bold text-[#1A1A2E]">
              Retail{order.isSplit ? ' · Split shipment' : ''}
            </div>
          </div>
          <div>
            <div className="text-[9.5px] font-bold text-[#9AA0AC] mb-1">ORDER DATE</div>
            <div className="text-[13px] font-bold text-[#1A1A2E]">{formatDateTime(order.createdAt)}</div>
          </div>
          <div className="bg-[#FFF6EF] rounded-lg px-4 py-2.5 text-center">
            <div className="text-[10px] text-[#9AA0AC]">You will earn</div>
            <div className="text-[13px] font-extrabold text-[#EB4501]">{pointsEarned} Choosify Points</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
          <div className="space-y-4">
            {/* Shipping */}
            {shipping && (
              <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 sm:px-6">
                <h2 className="text-xs font-extrabold text-[#1A1A2E] mb-3.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#EB4501]" />
                  DELIVERY DETAILS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-6 text-left">
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-[#9AA0AC] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9.5px] font-bold text-[#9AA0AC] uppercase">Recipient</p>
                      <p className="text-[12.5px] font-semibold text-[#1A1A2E]">{shipping.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-[#9AA0AC] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9.5px] font-bold text-[#9AA0AC] uppercase">Mobile Number</p>
                      <p className="text-[12.5px] font-semibold text-[#1A1A2E]">{shipping.phone}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-start gap-3">
                    <MapPin size={16} className="text-[#9AA0AC] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9.5px] font-bold text-[#9AA0AC] uppercase">Delivery Address</p>
                      <p className="text-[12.5px] font-semibold text-[#1A1A2E]">
                        {shipping.address}
                        {shipping.region ? `, ${shipping.region}` : ''}
                      </p>
                    </div>
                  </div>
                  {shipping.deliveryNotes && (
                    <div className="md:col-span-2 flex items-start gap-3">
                      <Truck size={16} className="text-[#9AA0AC] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9.5px] font-bold text-[#9AA0AC] uppercase">Delivery notes</p>
                        <p className="text-sm text-[#4B5563]">{shipping.deliveryNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Invoices / line items */}
            <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 sm:px-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xs font-extrabold text-[#1A1A2E] flex items-center gap-1.5">
                  <Package size={14} className="text-[#EB4501]" />
                  ITEMS &amp; INVOICES ({order.subOrders.length} SELLER{order.subOrders.length === 1 ? '' : 'S'})
                </h2>
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="text-[11px] font-bold text-[#EB4501] bg-transparent border-0 cursor-pointer hover:underline"
                >
                  Download Invoice
                </button>
              </div>

              <div className="space-y-4">
                {order.subOrders.map((sub, idx) => {
                  const lotSubtotal = sub.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                  const lotTotal = lotSubtotal + sub.deliveryFee;

                  return (
                    <div
                      key={sub.invoiceId}
                      className="border border-[#F1F1F3] rounded-[10px] overflow-hidden"
                    >
                      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-extrabold text-[#4B5563] bg-[#F1F1F3] uppercase tracking-wide px-2 py-0.5 rounded inline-block mb-1.5">
                            Invoice #{idx + 1}
                          </span>
                          <p className="text-[12.5px] font-bold text-[#1A1A2E]">{sub.sellerBusinessName}</p>
                          <p className="text-[10.5px] font-mono text-[#9AA0AC]">ID: {sub.invoiceId}</p>
                        </div>
                        <span
                          className={cn(
                            'text-[9.5px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-xl',
                            sub.trackingStatus === 'pending'
                              ? 'bg-[#FFF3EC] text-[#EB4501]'
                              : 'bg-emerald-50 text-emerald-700',
                          )}
                        >
                          {sub.trackingStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <ul className="divide-y divide-[#F4F7F9]">
                        {sub.items.map((item, itemIdx) => {
                          const extended = item as typeof item & {
                            image?: string;
                            brand?: string;
                            variantLabel?: string;
                            variantSku?: string;
                            notes?: string;
                          };
                          return (
                            <li
                              key={`${item.productId}-${itemIdx}`}
                              className="flex items-center gap-3 px-4 py-3"
                            >
                              {extended.image ? (
                                <img
                                  src={extended.image}
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover border border-[#E8EDF2] shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-[#F4F7F9] border border-[#E8EDF2] shrink-0" />
                              )}
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-xs font-bold text-[#1A1A2E] line-clamp-2">{item.productTitle}</p>
                                {extended.brand && (
                                  <p className="text-[10px] text-[#9AA0AC] font-semibold uppercase mt-0.5">
                                    {extended.brand}
                                  </p>
                                )}
                                <p className="text-[10px] text-[#9AA0AC] mt-0.5">
                                  Qty {item.quantity} × {formatMoney(item.price)}
                                </p>
                                {(extended.variantLabel || extended.variantSku) && (
                                  <p className="text-[9px] text-[#9AA0AC] font-semibold uppercase mt-1">
                                    {[extended.variantLabel, extended.variantSku ? `SKU ${extended.variantSku}` : null]
                                      .filter(Boolean)
                                      .join(' · ')}
                                  </p>
                                )}
                                {extended.notes && (
                                  <p className="text-[10px] text-gray-500 mt-1 italic line-clamp-2">
                                    Note: {extended.notes}
                                  </p>
                                )}
                              </div>
                              <p className="text-[12.5px] font-bold text-[#1A1A2E] shrink-0">
                                {formatMoney(item.price * item.quantity)}
                              </p>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="px-4 py-3 space-y-1.5 text-[11px] border-t border-[#F1F1F3]">
                        <div className="flex justify-between text-[#4B5563]">
                          <span>Subtotal</span>
                          <span>{formatMoney(lotSubtotal)}</span>
                        </div>
                        <div className="flex justify-between text-[#4B5563]">
                          <span>Delivery Fee</span>
                          <span>{formatMoney(sub.deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between font-extrabold text-[#1A1A2E] text-xs pt-1">
                          <span>Lot Total</span>
                          <span>{formatMoney(lotTotal)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Payment totals */}
            <div className="bg-white border border-[#E8EDF2] rounded-xl p-5">
              <h2 className="text-xs font-extrabold text-[#1A1A2E] mb-3.5 flex items-center gap-1.5">
                <CreditCard size={14} className="text-[#EB4501]" />
                ORDER &amp; PAYMENT SUMMARY
              </h2>
              <div className="space-y-2 text-xs text-[#4B5563] mb-3.5">
                <div className="flex justify-between">
                  <span>Products Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Seller Delivery Fee</span>
                  <span>{formatMoney(deliveryTotal)}</span>
                </div>
                {(order.promoDiscount ?? 0) > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Promo ({order.promoCode})</span>
                    <span>-{formatMoney(order.promoDiscount ?? 0)}</span>
                  </div>
                )}
                <div className="text-[10px] text-[#9AA0AC] pt-1">{paymentLabel}</div>
              </div>
              <div className="flex justify-between items-baseline pt-3.5 border-t border-[#F1F1F3] mb-3.5">
                <span className="text-xs font-bold text-[#1A1A2E]">TOTAL PAID</span>
                <span className="text-lg font-extrabold text-[#EB4501]">{formatMoney(order.overallTotal)}</span>
              </div>
              <div className="bg-[#F0FDF4] rounded-lg px-3 py-2.5 flex items-center gap-2">
                <div className="text-[#16A34A] text-sm">🛡</div>
                <div>
                  <div className="text-[11px] font-bold text-[#16A34A]">Secure Payment</div>
                  <div className="text-[10px] text-[#16A34A]">Your payment details are 100% secure</div>
                </div>
              </div>
            </div>

            <div className="choosify-dark-surface rounded-xl p-[18px] sm:px-5 text-white">
              <div className="text-xs font-extrabold mb-1.5">LOVE CHOOSIFY?</div>
              <div className="text-[11px] text-white/50 mb-3.5">Rate your experience and earn 20 points!</div>
              <button
                type="button"
                onClick={() => toast.success('Thanks! Rating will open in a future update.')}
                className="bg-[#EB4501] hover:bg-[#CF4400] text-white border-0 px-[18px] py-2.5 rounded-lg text-[11px] font-bold cursor-pointer"
              >
                RATE ORDER ★
              </button>
            </div>
          </div>
        </div>

        {/* Next steps — user chooses when to leave */}
        <div className="bg-white border border-[#E8EDF2] rounded-xl p-[22px] sm:px-[26px]">
          <h2 className="text-xs font-extrabold text-[#1A1A2E] mb-2">WHAT&apos;S NEXT?</h2>
          <p className="text-[11px] text-[#9AA0AC] mb-4">
            We&apos;ll keep you updated at every step. Stay on this page as long as you need.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E8EDF2] bg-white hover:border-[#EB4501]/40 hover:text-[#CF4400] text-[11px] font-bold uppercase tracking-wide text-[#1A1A2E] transition-colors"
            >
              <Home size={14} />
              Continue shopping
            </Link>
            <Link
              to="/profile/orders"
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E8EDF2] bg-white hover:border-[#EB4501]/40 hover:text-[#CF4400] text-[11px] font-bold uppercase tracking-wide text-[#1A1A2E] transition-colors"
            >
              <ShoppingBag size={14} />
              View my orders
            </Link>
            <button
              type="button"
              onClick={() => navigate('/order-tracking', { state: { order } })}
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E8EDF2] bg-white hover:border-[#EB4501]/40 hover:text-[#CF4400] text-[11px] font-bold uppercase tracking-wide text-[#1A1A2E] transition-colors cursor-pointer"
            >
              <Truck size={14} />
              Track this order
            </button>
            <button
              type="button"
              onClick={() => navigate('/messages')}
              className="flex items-center justify-center gap-2 h-11 rounded-lg bg-[#EB4501] hover:bg-[#CF4400] text-white text-[11px] font-bold uppercase tracking-wide transition-colors cursor-pointer border-0"
            >
              <MessageSquare size={14} />
              Message sellers
              <ArrowRight size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold text-[#9AA0AC] uppercase tracking-widest hover:text-[#1A1A2E] transition-colors bg-transparent border-0 cursor-pointer"
          >
            <X size={12} />
            Close this page
          </button>
        </div>
      </div>
    </div>
  );
}
