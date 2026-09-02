import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Lock, Package, ShieldCheck, XCircle } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import {
  operationsApi,
  type OrderClaimPreview,
  type ManualOfferClaimPreview,
} from '../services/operationsApi';
import { toast } from '../lib/notify';
import type { Order } from '../types/schemas';

type LoadState = 'loading' | 'ready' | 'not_found' | 'expired' | 'claimed_by_other';
type Mode = 'manual_offer' | 'legacy';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

/**
 * Public "Review & Confirm Order" page — reached from the secure link a
 * seller sends after preparing a Manual Order for an external customer.
 * The raw token in the URL only *identifies* the pending claim; ownership
 * is bound server-side after the customer signs in with a VERIFIED matching
 * identity and confirms. Falls back to the legacy operations-order claim
 * flow for older links.
 */
export function OrderConfirmPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUser, addClaimedOrder } = useGlobalState();

  const [state, setState] = useState<LoadState>('loading');
  const [mode, setMode] = useState<Mode>('manual_offer');
  const [offer, setOffer] = useState<ManualOfferClaimPreview | null>(null);
  const [preview, setPreview] = useState<OrderClaimPreview | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [idError, setIdError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const mo = await operationsApi.getManualOfferClaim(token);
        if (cancelled) return;
        setMode('manual_offer');
        setOffer(mo);
        if (mo.status === 'expired') setState('expired');
        else if (mo.alreadyClaimed && mo.status !== 'accepted') setState('claimed_by_other');
        else setState('ready');
        return;
      } catch {
        /* not a manual-offer token — try the legacy flow */
      }
      try {
        const legacy = await operationsApi.getOrderClaim(token);
        if (cancelled) return;
        setMode('legacy');
        setPreview(legacy);
        setState('ready');
      } catch {
        if (!cancelled) setState('not_found');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const goToSignIn = () => {
    const next = encodeURIComponent(location.pathname);
    navigate(`/login?next=${next}`, { state: { from: location.pathname } });
  };

  // ── Manual-offer confirm ───────────────────────────────────────────────
  const handleConfirmOffer = async (action: 'confirm' | 'decline') => {
    if (!token) return;
    setConfirming(true);
    setIdError(null);
    try {
      const { order } = await operationsApi.confirmManualOfferClaim(token, action);
      if (action === 'decline') {
        toast.success('Order declined. The seller has been notified.');
        navigate('/');
        return;
      }
      toast.success('Order confirmed — it is now in your My Orders.');
      const o = order as Record<string, unknown> | null;
      navigate('/dashboard?tab=my-orders', o ? { state: { order: o } } : undefined);
    } catch (err) {
      const message = (err as Error)?.message || 'Could not confirm this order — try again.';
      if (/already been confirmed/i.test(message)) setState('claimed_by_other');
      else if (/expired/i.test(message)) setState('expired');
      else if (/verified email|different email address|confirm your email/i.test(message)) setIdError(message);
      else toast.error(message);
    } finally {
      setConfirming(false);
    }
  };

  // ── Legacy operations-order confirm (unchanged behavior) ───────────────
  const handleConfirmLegacy = async () => {
    if (!token || !preview) return;
    setConfirming(true);
    try {
      const claimed = await operationsApi.confirmOrderClaim(token, {
        buyerId: currentUser.id,
        buyerName: currentUser.name,
      });
      const subOrders = (preview.subOrders || []).map((sub) => ({
        sellerId: sub.sellerId,
        sellerBusinessName: sub.sellerBusinessName,
        items: sub.items.map((item) => ({
          productId: item.productId,
          productTitle: item.productTitle,
          quantity: item.quantity,
          price: item.price,
          productType: item.productType,
        })),
        deliveryFee: sub.deliveryFee,
        invoiceId: sub.invoiceId,
        trackingStatus: (sub.trackingStatus as Order['subOrders'][number]['trackingStatus']) || 'pending',
      }));
      const order: Order = {
        orderId: String((claimed as { orderId?: string }).orderId || preview.orderId),
        buyerId: currentUser.id,
        isCOD: preview.isCOD,
        isSplit: subOrders.length > 1,
        overallTotal: preview.overallTotal,
        subOrders,
        createdAt: preview.createdAt,
        status: 'confirmed',
      };
      addClaimedOrder(order);
      toast.success('Order confirmed and added to your order history!');
      navigate('/order-tracking', { state: { order } });
    } catch (err) {
      const message = (err as Error)?.message || 'Could not confirm this order — try again.';
      if (message.toLowerCase().includes('already been confirmed')) setState('claimed_by_other');
      else toast.error(message);
    } finally {
      setConfirming(false);
    }
  };

  if (state === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-medium text-[#9AA0AC]">Loading order…</p>
      </div>
    );
  }

  if (state === 'not_found' || state === 'expired') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 gap-3">
        <XCircle size={40} className="text-[#9AA0AC]" />
        <h1 className="text-lg font-extrabold text-[#1A1A2E]">
          {state === 'expired' ? 'This order link has expired' : 'This order link is invalid'}
        </h1>
        <p className="text-[13px] text-[#9AA0AC] max-w-sm">
          Contact the seller who sent it and ask them to prepare the order again.
        </p>
        <Link to="/" className="mt-2 text-[13px] font-bold text-[#FF5B00] hover:underline">
          Go to Choosify.bd →
        </Link>
      </div>
    );
  }

  if (state === 'claimed_by_other') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 gap-3">
        <XCircle size={40} className="text-[#9AA0AC]" />
        <h1 className="text-lg font-extrabold text-[#1A1A2E]">Already confirmed</h1>
        <p className="text-[13px] text-[#9AA0AC] max-w-sm">
          This order has already been confirmed by another Choosify.bd account. If that wasn&apos;t
          you, contact the seller.
        </p>
      </div>
    );
  }

  // ── Manual-offer render ───────────────────────────────────────────────
  if (mode === 'manual_offer' && offer) {
    const done = offer.status === 'accepted';
    return (
      <div className="max-w-lg mx-auto px-5 py-10">
        <div className="bg-white rounded-2xl border border-[#E8EDF2] shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <Package size={16} className="text-[#FF5B00]" />
            <span className="text-[10.5px] font-extrabold uppercase tracking-wide text-[#9AA0AC]">
              {offer.sellerName || 'Choosify seller'}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-[#1A1A2E] mb-1">
            {done ? 'Order confirmed' : 'Review your Choosify order'}
          </h1>
          <p className="text-[12.5px] text-[#9AA0AC] mb-5">
            Prepared {formatDate(offer.createdAt)}
            {offer.provenanceSource ? ` · ${offer.provenanceSource.replace('external_', '')}` : ''}
          </p>

          <div className="flex flex-col gap-3 mb-5">
            {offer.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-3 text-[13px]">
                <div className="min-w-0">
                  <div className="font-bold text-[#1A1A2E] truncate">{item.productTitle}</div>
                  <div className="text-[11px] text-[#9AA0AC]">Qty {item.quantity}</div>
                </div>
                <div className="font-extrabold text-[#1A1A2E] shrink-0">
                  ৳{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[12px] text-[#4B5563]">
            <span>Subtotal</span>
            <span>৳{offer.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-[12px] text-[#4B5563] mb-1">
            <span>Delivery</span>
            <span>৳{offer.deliveryTotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-[#F1F1F3] mb-1">
            <span className="text-[12px] font-bold text-[#4B5563]">Total</span>
            <span className="text-[15px] font-extrabold text-[#FF5B00]">
              ৳{offer.overallTotal.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-[#9AA0AC] mb-4">
            You&apos;ll choose or confirm your delivery address on the next step. Payment: Cash on
            Delivery.
          </div>

          {done ? (
            <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg px-4 py-3">
              <CheckCircle2 size={16} className="text-[#07A828] shrink-0" />
              <p className="text-[12.5px] font-semibold text-[#166534]">
                This order is confirmed and in your My Orders.
              </p>
            </div>
          ) : !isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={goToSignIn}
                className="w-full h-11 rounded-lg bg-[#FF5B00] text-white text-[13px] font-bold hover:bg-[#EF3C23] cursor-pointer border-none"
              >
                Sign in or create an account to confirm
              </button>
              <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#9AA0AC]">
                <Lock size={11} />
                New to Choosify? Create your account on the next screen — you&apos;ll come right back
                here. The order links to the account with the verified email it was prepared for.
              </p>
            </>
          ) : (
            <>
              {idError ? (
                <div className="mb-3 bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-4 py-3">
                  <p className="text-[12px] font-semibold text-[#991B1B]">{idError}</p>
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => handleConfirmOffer('confirm')}
                disabled={confirming}
                className="w-full h-11 rounded-lg bg-[#FF5B00] text-white text-[13px] font-bold hover:bg-[#EF3C23] disabled:opacity-50 cursor-pointer border-none"
              >
                {confirming ? 'Confirming…' : `Claim & Confirm Order as ${currentUser.name}`}
              </button>
              <button
                type="button"
                onClick={() => handleConfirmOffer('decline')}
                disabled={confirming}
                className="w-full h-10 mt-2 rounded-lg border border-[#E8EDF2] text-[#4B5563] text-[12.5px] font-bold hover:bg-[#F8FAFC] disabled:opacity-50 cursor-pointer bg-white"
              >
                Decline this order
              </button>
              <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#9AA0AC]">
                <ShieldCheck size={11} />
                Confirming links the order to your Choosify account and order history.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Legacy render (unchanged) ─────────────────────────────────────────
  if (!preview) return null;
  const items = preview.subOrders.flatMap((sub) => sub.items);
  const alreadyClaimed = preview.claimed;

  return (
    <div className="max-w-lg mx-auto px-5 py-10">
      <div className="bg-white rounded-2xl border border-[#E8EDF2] shadow-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <Package size={16} className="text-[#FF5B00]" />
          <span className="text-[10.5px] font-extrabold uppercase tracking-wide text-[#9AA0AC]">
            Order #{preview.orderId}
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-[#1A1A2E] mb-1">
          {alreadyClaimed ? 'Order confirmed' : 'View & Confirm Your Order'}
        </h1>
        <p className="text-[12.5px] text-[#9AA0AC] mb-5">
          Created {formatDate(preview.createdAt)}
          {preview.platformSource ? ` via ${preview.platformSource}` : ''}
        </p>

        <div className="flex flex-col gap-3 mb-5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3 text-[13px]">
              <div className="min-w-0">
                <div className="font-bold text-[#1A1A2E] truncate">{item.productTitle}</div>
                <div className="text-[11px] text-[#9AA0AC]">Qty {item.quantity}</div>
              </div>
              <div className="font-extrabold text-[#1A1A2E] shrink-0">
                ৳{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#F1F1F3] mb-1">
          <span className="text-[12px] font-bold text-[#4B5563]">Total</span>
          <span className="text-[15px] font-extrabold text-[#FF5B00]">
            ৳{preview.overallTotal.toLocaleString()}
          </span>
        </div>
        <div className="text-[11px] text-[#9AA0AC] mb-5">
          Payment: {preview.isCOD ? 'Cash on Delivery (COD)' : 'Online Payment'}
        </div>

        {alreadyClaimed ? (
          <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg px-4 py-3">
            <CheckCircle2 size={16} className="text-[#07A828] shrink-0" />
            <p className="text-[12.5px] font-semibold text-[#166534]">
              This order has been confirmed{preview.claimedByName ? ` by ${preview.claimedByName}` : ''} and
              is in their order history.
            </p>
          </div>
        ) : !isLoggedIn ? (
          <>
            <button
              type="button"
              onClick={goToSignIn}
              className="w-full h-11 rounded-lg bg-[#FF5B00] text-white text-[13px] font-bold hover:bg-[#EF3C23] cursor-pointer border-none"
            >
              Sign in to confirm this order
            </button>
            <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#9AA0AC]">
              <Lock size={11} />
              New to Choosify.bd? You can create an account on the next screen — you&apos;ll be brought
              right back here.
            </p>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleConfirmLegacy}
              disabled={confirming}
              className="w-full h-11 rounded-lg bg-[#FF5B00] text-white text-[13px] font-bold hover:bg-[#EF3C23] disabled:opacity-50 cursor-pointer border-none"
            >
              {confirming ? 'Confirming…' : `Confirm Order as ${currentUser.name}`}
            </button>
            <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#9AA0AC]">
              <ShieldCheck size={11} />
              This links the order to your Choosify.bd account and order history.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderConfirmPage;
