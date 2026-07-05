import React, { useMemo, useRef } from 'react';
import { HeroScrollCue, HERO_SCROLL_CUE_PADDING } from '../components/HeroScrollCue';
import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  MessageSquare,
  Download,
  MapPin,
  Phone,
  User,
  CreditCard,
  Truck,
  Package,
  FileText,
  Home,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../context/GlobalStateContext';
import type { Order } from '../types/schemas';
import { cn } from '../lib/utils';

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
        <div className="max-w-md w-full bg-white border border-[#e8edf2] rounded-[5px] p-8 text-center shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-lg font-black text-[#1A1D4E] uppercase italic mb-2">No order to display</h1>
          <p className="text-xs text-gray-500 mb-6">
            Place an order from checkout to see your confirmation summary here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#E8500A] hover:bg-[#CF4400] text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-colors"
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

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed pb-16">
      {/* Confirmation hero */}
      <div
        ref={heroRef}
        className={cn('w-full border-b border-white/5 relative', HERO_SCROLL_CUE_PADDING)}
      >
        <div className="absolute inset-0 hero-gradient" />
        <div className="max-w-4xl mx-auto px-4 py-10 md:py-14 relative z-10 text-center text-white">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/15 border border-green-400/40 rounded-full flex items-center justify-center text-green-400 mx-auto mb-5">
            <CheckCircle2 size={36} className="md:w-11 md:h-11" />
          </div>
          <p className="text-[9px] font-black text-[#FF6B00] uppercase tracking-[0.25em] italic mb-2">
            Payment &amp; order staged successfully
          </p>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic mb-3">
            Thank you — your order is <span className="text-green-400">confirmed</span>
          </h1>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
            Order <span className="text-white font-mono">{order.orderId}</span> has been recorded.
            Sellers have been notified and support threads are ready if you need updates.
          </p>
          <p className="text-[10px] text-white/40 font-mono mt-3">{formatDateTime(order.createdAt)}</p>
        </div>
        <HeroScrollCue anchorRef={heroRef} scrollTargetId="order-success-details" />
      </div>

      <div id="order-success-details" className="max-w-4xl mx-auto w-full px-4 py-8 md:py-10 -mt-6 relative z-20 space-y-6">
        {/* Order meta */}
        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 md:p-8 shadow-sm">
          <h2 className="text-sm font-black text-[#1A1D4E] uppercase italic tracking-widest border-b border-[#e8edf2] pb-3 mb-5 flex items-center gap-2">
            <FileText size={16} className="text-[#E8500A]" />
            Order summary
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <dt className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest">Order ID</dt>
              <dd className="text-sm font-mono font-black text-[#1A1D4E] mt-0.5">{order.orderId}</dd>
            </div>
            <div>
              <dt className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest">Order type</dt>
              <dd className="text-xs font-black text-[#1A1D4E] uppercase mt-0.5">
                Retail
                {order.isSplit ? ' · Split shipment' : ''}
              </dd>
            </div>
            <div>
              <dt className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest">Payment method</dt>
              <dd className="text-xs font-bold text-[#1A1D4E] mt-0.5 flex items-center gap-1.5">
                <CreditCard size={13} className="text-[#E8500A]" />
                {paymentLabel}
              </dd>
            </div>
            <div>
              <dt className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest">Status</dt>
              <dd className="text-xs font-black text-amber-600 uppercase mt-0.5">Pending confirmation</dd>
            </div>
            {order.promoCode && (
              <div className="sm:col-span-2">
                <dt className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest">Promo applied</dt>
                <dd className="text-xs font-bold text-emerald-600 mt-0.5">
                  {order.promoCode} — saved {formatMoney(order.promoDiscount ?? 0)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Shipping */}
        {shipping && (
          <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 md:p-8 shadow-sm">
            <h2 className="text-sm font-black text-[#1A1D4E] uppercase italic tracking-widest border-b border-[#e8edf2] pb-3 mb-5 flex items-center gap-2">
              <MapPin size={16} className="text-[#E8500A]" />
              Delivery details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <User size={16} className="text-[#8a9bb0] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest">Recipient</p>
                  <p className="text-sm font-bold text-[#1A1D4E]">{shipping.fullName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#8a9bb0] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest">Phone</p>
                  <p className="text-sm font-bold text-[#1A1D4E]">{shipping.phone}</p>
                </div>
              </div>
              <div className="md:col-span-2 flex items-start gap-3">
                <MapPin size={16} className="text-[#8a9bb0] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest">Address</p>
                  <p className="text-sm font-bold text-[#1A1D4E]">
                    {shipping.address}
                    {shipping.region ? `, ${shipping.region}` : ''}
                  </p>
                </div>
              </div>
              {shipping.deliveryNotes && (
                <div className="md:col-span-2 flex items-start gap-3">
                  <Truck size={16} className="text-[#8a9bb0] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black text-[#8a9bb0] uppercase tracking-widest">Delivery notes</p>
                    <p className="text-sm text-gray-600">{shipping.deliveryNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invoices / line items */}
        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-sm font-black text-[#1A1D4E] uppercase italic tracking-widest border-b border-[#e8edf2] pb-3 flex items-center gap-2">
            <Package size={16} className="text-[#E8500A]" />
            Items &amp; invoices ({order.subOrders.length} seller{order.subOrders.length === 1 ? '' : 's'})
          </h2>

          <div className="space-y-5">
            {order.subOrders.map((sub, idx) => {
              const lotSubtotal = sub.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
              const lotTotal = lotSubtotal + sub.deliveryFee;

              return (
                <div
                  key={sub.invoiceId}
                  className="border border-[#e8edf2] rounded-[5px] overflow-hidden"
                >
                  <div className="bg-[#F8FAFC] px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#e8edf2]">
                    <div>
                      <span className="text-[9px] font-black text-white bg-[#1A1D4E] uppercase tracking-widest px-2 py-0.5 rounded italic">
                        Invoice {idx + 1}
                      </span>
                      <p className="text-xs font-black text-[#1A1D4E] mt-1">{sub.sellerBusinessName}</p>
                      <p className="text-[10px] font-mono text-[#8a9bb0]">ID: {sub.invoiceId}</p>
                    </div>
                    <span
                      className={cn(
                        'text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded',
                        sub.trackingStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100',
                      )}
                    >
                      {sub.trackingStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <ul className="divide-y divide-[#e8edf2]">
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
                              className="w-12 h-12 rounded-[5px] object-cover border border-[#e8edf2] shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-[5px] bg-gray-100 border border-[#e8edf2] shrink-0" />
                          )}
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-xs font-bold text-[#1A1D4E] line-clamp-2">{item.productTitle}</p>
                            {extended.brand && (
                              <p className="text-[10px] text-[#8a9bb0] font-semibold uppercase mt-0.5">
                                {extended.brand}
                              </p>
                            )}
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              Qty {item.quantity} × {formatMoney(item.price)}
                            </p>
                            {(extended.variantLabel || extended.variantSku) && (
                              <p className="text-[9px] text-[#8a9bb0] font-semibold uppercase mt-1">
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
                          <p className="text-xs font-black text-[#1A1D4E] shrink-0">
                            {formatMoney(item.price * item.quantity)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="px-4 py-3 bg-gray-50/80 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-gray-500 font-semibold">
                      <span>Subtotal</span>
                      <span>{formatMoney(lotSubtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500 font-semibold">
                      <span>Delivery fee</span>
                      <span>{formatMoney(sub.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between font-black text-[#1A1D4E] pt-1 border-t border-[#e8edf2]">
                      <span>Lot total</span>
                      <span className="text-[#E8500A]">{formatMoney(lotTotal)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment totals */}
        <div className="bg-[#1A1D4E] rounded-[5px] p-6 md:p-8 text-white">
          <h2 className="text-[10px] font-black text-[#FF6B00] uppercase tracking-[0.2em] mb-4">
            Payment summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/70">
              <span>Products subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Delivery fees</span>
              <span>{formatMoney(deliveryTotal)}</span>
            </div>
            {(order.promoDiscount ?? 0) > 0 && (
              <div className="flex justify-between text-green-400 font-semibold">
                <span>Promo ({order.promoCode})</span>
                <span>-{formatMoney(order.promoDiscount ?? 0)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-white/10">
              <span className="text-xs font-black uppercase tracking-widest">Total paid / due</span>
              <span className="text-2xl font-black italic text-white">{formatMoney(order.overallTotal)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="mt-5 inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/15 px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <Download size={14} className="text-[#FF6B00]" />
            Download invoice
          </button>
        </div>

        {/* Next steps — user chooses when to leave */}
        <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 md:p-8 shadow-sm">
          <h2 className="text-sm font-black text-[#1A1D4E] uppercase italic tracking-widest mb-2">
            What would you like to do next?
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            You can stay on this page as long as you need. Close it or use the links below when you are ready.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#e8edf2] bg-white hover:border-[#E8500A]/30 hover:text-[#E8500A] text-[10px] font-black uppercase tracking-widest text-[#1A1D4E] transition-colors"
            >
              <Home size={14} />
              Continue shopping
            </Link>
            <Link
              to="/profile/orders"
              className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#e8edf2] bg-white hover:border-[#E8500A]/30 hover:text-[#E8500A] text-[10px] font-black uppercase tracking-widest text-[#1A1D4E] transition-colors"
            >
              <ShoppingBag size={14} />
              View my orders
            </Link>
            <button
              type="button"
              onClick={() => navigate('/order-tracking', { state: { order } })}
              className="flex items-center justify-center gap-2 h-12 rounded-xl border border-[#e8edf2] bg-white hover:border-[#E8500A]/30 hover:text-[#E8500A] text-[10px] font-black uppercase tracking-widest text-[#1A1D4E] transition-colors cursor-pointer"
            >
              <Truck size={14} />
              Track this order
            </button>
            <button
              type="button"
              onClick={() => navigate('/messages')}
              className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#E8500A] hover:bg-[#CF4400] text-white text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer border-0"
            >
              <MessageSquare size={14} />
              Message sellers
              <ArrowRight size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold text-[#8a9bb0] uppercase tracking-widest hover:text-[#1A1D4E] transition-colors bg-transparent border-0 cursor-pointer"
          >
            <X size={12} />
            Close this page
          </button>
        </div>
      </div>
    </div>
  );
}
