import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Lock, Package, ShieldCheck, XCircle } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { operationsApi, type OrderClaimPreview } from '../services/operationsApi';
import { toast } from '../lib/notify';
import type { Order } from '../types/schemas';

type LoadState = 'loading' | 'ready' | 'not_found' | 'claimed_by_other';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

/** Public "View & Confirm Order" page — reached from the link a seller sends after
 * creating a manual order in the Meta inbox. Requires sign-in to claim the order into
 * the buyer's own order history. */
export function OrderConfirmPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUser, addClaimedOrder } = useGlobalState();

  const [state, setState] = useState<LoadState>('loading');
  const [preview, setPreview] = useState<OrderClaimPreview | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    operationsApi
      .getOrderClaim(token)
      .then((data) => {
        if (cancelled) return;
        setPreview(data);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('not_found');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleConfirm = async () => {
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
        orderId: String((claimed as any).orderId || preview.orderId),
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
      if (message.toLowerCase().includes('already been confirmed')) {
        setState('claimed_by_other');
      } else {
        toast.error(message);
      }
    } finally {
      setConfirming(false);
    }
  };

  const goToSignIn = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  if (state === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm font-medium text-[#9AA0AC]">Loading order…</p>
      </div>
    );
  }

  if (state === 'not_found') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 gap-3">
        <XCircle size={40} className="text-[#9AA0AC]" />
        <h1 className="text-lg font-extrabold text-[#1A1A2E]">This order link is invalid</h1>
        <p className="text-[13px] text-[#9AA0AC] max-w-sm">
          The link may have expired or the order may have already been removed. Contact the seller who
          sent it if you think this is a mistake.
        </p>
        <Link to="/" className="mt-2 text-[13px] font-bold text-[#EB4501] hover:underline">
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
          This order has already been confirmed by another Choosify.bd account. If that wasn&apos;t you,
          contact the seller.
        </p>
      </div>
    );
  }

  if (!preview) return null;

  const items = preview.subOrders.flatMap((sub) => sub.items);
  const alreadyClaimed = preview.claimed;

  return (
    <div className="max-w-lg mx-auto px-5 py-10">
      <div className="bg-white rounded-2xl border border-[#E8EDF2] shadow-sm p-6">
        <div className="flex items-center gap-2 mb-1">
          <Package size={16} className="text-[#EB4501]" />
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
          <span className="text-[15px] font-extrabold text-[#EB4501]">
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
              className="w-full h-11 rounded-lg bg-[#EB4501] text-white text-[13px] font-bold hover:bg-[#CF4400] cursor-pointer border-none"
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
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full h-11 rounded-lg bg-[#EB4501] text-white text-[13px] font-bold hover:bg-[#CF4400] disabled:opacity-50 cursor-pointer border-none"
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
