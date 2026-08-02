import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, Home, Package } from 'lucide-react';
import { operationsApi } from '../services/operationsApi';
import { useGlobalState } from '../context/GlobalStateContext';
import { usePageBreadcrumbs } from '../context/BreadcrumbContext';
import type { Order } from '../types/schemas';

type Outcome = 'success' | 'fail' | 'cancel';

/**
 * SSLCommerz browser return landing — the redirect itself is NOT proof of payment.
 * We poll GET /operations/orders/:id until paymentStatus settles (IPN + validation).
 */
export function PaymentReturnPage() {
  usePageBreadcrumbs({ hidden: true });
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { updateOrder, addClaimedOrder } = useGlobalState();

  const outcome = (params.get('outcome') || 'success') as Outcome;
  const orderId = params.get('orderId') || '';
  const [paymentStatus, setPaymentStatus] = useState<Order['paymentStatus'] | 'unknown'>(
    'unknown',
  );
  const [pollError, setPollError] = useState('');
  const [ticks, setTicks] = useState(0);

  const mirrorOrder = (row: Record<string, unknown>) => {
    const status = row.paymentStatus as Order['paymentStatus'] | undefined;
    setPaymentStatus(status || 'unknown');
    const mapped = {
      orderId: String(row.orderId || orderId),
      buyerId: String(row.buyerId || ''),
      isCOD: Boolean(row.isCOD),
      isSplit: Boolean(row.isSplit),
      overallTotal: Number(row.overallTotal) || 0,
      subOrders: Array.isArray(row.subOrders) ? (row.subOrders as Order['subOrders']) : [],
      createdAt: String(row.createdAt || new Date().toISOString()),
      status: row.status as Order['status'],
      paymentMethod: row.paymentMethod as Order['paymentMethod'],
      paymentProvider: row.paymentProvider as Order['paymentProvider'],
      paymentStatus: status,
      paymentTranId: typeof row.paymentTranId === 'string' ? row.paymentTranId : undefined,
      paymentValId: typeof row.paymentValId === 'string' ? row.paymentValId : undefined,
      paidAmount: row.paidAmount !== undefined ? Number(row.paidAmount) : undefined,
      paidAt: typeof row.paidAt === 'string' ? row.paidAt : undefined,
      paymentValidatedAt:
        typeof row.paymentValidatedAt === 'string' ? row.paymentValidatedAt : undefined,
      shipping: row.shipping as Order['shipping'],
    } satisfies Order;
    updateOrder(mapped.orderId, mapped);
    addClaimedOrder(mapped);
    return status;
  };

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let timer: number | undefined;

    const poll = async () => {
      try {
        const row = await operationsApi.getOrder(orderId);
        if (cancelled) return;
        const status = mirrorOrder(row);
        setPollError('');
        setTicks((t) => t + 1);
        // Keep polling while success landing and still unpaid/pending (IPN may lag).
        if (outcome === 'success' && (status === 'pending' || status === 'unpaid' || !status)) {
          timer = window.setTimeout(poll, 2500);
        }
      } catch (err) {
        if (cancelled) return;
        setPollError((err as Error)?.message || 'Could not refresh payment status');
        timer = window.setTimeout(poll, 4000);
      }
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- poll once per orderId/outcome
  }, [orderId, outcome]);

  useEffect(() => {
    if (paymentStatus === 'paid' && orderId) {
      const t = window.setTimeout(() => {
        navigate(`/order-success/${orderId}`, { replace: true });
      }, 1200);
      return () => window.clearTimeout(t);
    }
  }, [paymentStatus, orderId, navigate]);

  const title = useMemo(() => {
    if (outcome === 'fail') return 'Payment failed';
    if (outcome === 'cancel') return 'Payment cancelled';
    if (paymentStatus === 'paid') return 'Payment confirmed';
    return 'Confirming your payment…';
  }, [outcome, paymentStatus]);

  const detail = useMemo(() => {
    if (outcome === 'fail') {
      return 'The gateway reported a failed attempt. Your order was not charged. You can retry from checkout.';
    }
    if (outcome === 'cancel') {
      return 'You cancelled the payment. No charge was made. Your order is still awaiting payment.';
    }
    if (paymentStatus === 'paid') {
      return 'We independently verified this payment with the gateway. Redirecting to your order confirmation…';
    }
    return 'We’re waiting for the payment gateway to confirm this transaction. This page does not treat the browser redirect as proof of payment.';
  }, [outcome, paymentStatus]);

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white border border-[#E8EDF2] rounded-xl p-8 text-center shadow-sm">
        {outcome === 'success' && paymentStatus !== 'paid' && (
          <Clock className="w-12 h-12 text-amber-500 mx-auto mb-4 animate-pulse" />
        )}
        {outcome === 'success' && paymentStatus === 'paid' && (
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        )}
        {(outcome === 'fail' || outcome === 'cancel') && (
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        )}

        <h1 className="text-lg font-extrabold text-[#1A1A2E] mb-2">{title}</h1>
        <p className="text-xs text-[#9AA0AC] mb-4 leading-relaxed">{detail}</p>

        {orderId && (
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-6">
            Order {orderId}
            {ticks > 0 && paymentStatus !== 'paid' && outcome === 'success'
              ? ` · checking… (${ticks})`
              : ''}
          </p>
        )}

        {pollError && (
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
            {pollError}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          {orderId && (
            <Link
              to={`/order-success/${orderId}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#EB4501] hover:bg-[#CF4400] text-white text-[11px] font-bold uppercase tracking-wide rounded-lg transition-colors"
            >
              <Package size={14} />
              View order
            </Link>
          )}
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-[#E8EDF2] text-[#1A1A2E] text-[11px] font-bold uppercase tracking-wide rounded-lg hover:bg-[#F4F7F9] transition-colors"
          >
            <Home size={14} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
