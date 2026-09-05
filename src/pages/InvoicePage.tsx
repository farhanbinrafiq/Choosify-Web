import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Loader2, ShieldCheck } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { operationsApi } from '../services/operationsApi';
import type { Order, SubOrder } from '../types/schemas';
import { toast } from '../lib/notify';
import { usePageBreadcrumbs } from '../context/BreadcrumbContext';

/** Fetches the same logo used on-screen and returns it as a data: URL for
 *  jsPDF's addImage (same-origin static asset — no CORS concerns). Mirrors
 *  choosify-admin's OperationsInvoiceView.loadLogoDataUrl(). */
async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch('/brand/choosify-logo-horizontal-navy.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

/**
 * Real, canonical invoice — replaces the plain-text mockup CustomerOrdersPage
 * used to generate client-side. Pulls the actual Order + SubOrder from the
 * Operations engine (GET /operations/orders/:id, already authorizes buyer /
 * order's seller / staff server-side) rather than any Commerce-era or
 * fabricated data. This same design is mirrored in choosify-admin's
 * OperationsInvoiceView so buyer, seller, and admin see one invoice.
 */
export function InvoicePage() {
  usePageBreadcrumbs({ hidden: true });
  const { orderId, sellerId } = useParams<{ orderId: string; sellerId: string }>();
  const navigate = useNavigate();
  const { currentUser, isLoggedIn } = useGlobalState();

  const [order, setOrder] = useState<Order | null>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pdfState, setPdfState] = useState<'idle' | 'generating' | 'error'>('idle');
  /** Mirrors choosify-admin's OperationsInvoiceView invoicePrep lifecycle: an
   *  invoice number is minted lazily, the first time ANY authorized viewer
   *  (staff, the seller, or — since the server-side authorization widening
   *  that shipped alongside this — the buyer) actually opens the invoice.
   *  Without this, a buyer opening their invoice before a seller/staff ever
   *  had would see no invoice number at all (undefined), the core gap this
   *  page previously had. */
  const [invoicePrep, setInvoicePrep] = useState<'pending' | 'ready' | 'unavailable'>('pending');
  const [unavailableReason, setUnavailableReason] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !sellerId) return;
    let cancelled = false;
    setLoadState('loading');
    setInvoicePrep('pending');
    operationsApi
      .getOrder(orderId)
      .then(async (row) => {
        if (cancelled) return;
        const typedOrder = row as unknown as Order;
        setOrder(typedOrder);
        setLoadState('ready');

        const existingInvoiceId = typedOrder.subOrders.find((s) => s.sellerId === sellerId)?.invoiceId;
        if (existingInvoiceId) {
          if (!cancelled) setInvoicePrep('ready');
          return;
        }
        try {
          const result = await operationsApi.ensureInvoiceNumber(orderId, sellerId);
          if (cancelled) return;
          if (!result.eligible || !result.invoiceId) {
            setInvoicePrep('unavailable');
            setUnavailableReason(
              result.reason === 'not_eligible_status'
                ? 'This order is awaiting payment or was cancelled — no invoice is issued for it.'
                : "This order's financial data hasn't been finalized yet, so an invoice can't be generated.",
            );
            return;
          }
          setOrder((prev) =>
            prev
              ? {
                  ...prev,
                  subOrders: prev.subOrders.map((s) =>
                    s.sellerId === sellerId ? { ...s, invoiceId: result.invoiceId! } : s,
                  ),
                }
              : prev,
          );
          setInvoicePrep('ready');
        } catch (err) {
          if (cancelled) return;
          setInvoicePrep('unavailable');
          setUnavailableReason(err instanceof Error ? err.message : 'Unable to prepare this invoice.');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : 'Failed to load invoice.');
        setLoadState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, sellerId]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#F0F8FF]">
        <ShieldCheck className="w-10 h-10 text-[#FF5B00] mb-3" />
        <p className="text-sm font-bold text-[#1A1A2E] mb-4">Sign in to view this invoice.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-[#FF5B00] text-white rounded-lg text-xs font-bold uppercase tracking-wider"
        >
          Log in
        </button>
      </div>
    );
  }

  if (loadState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-bold text-[#6B7280]">
        Loading invoice…
      </div>
    );
  }

  if (loadState === 'error' || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-sm font-bold text-[#1A1A2E] mb-2">Couldn&apos;t load this invoice.</p>
        <p className="text-xs text-[#6B7280] mb-4">{loadError || 'Invoice not found.'}</p>
        <Link to="/profile/orders" className="text-xs font-bold text-[#FF5B00] underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  if (order.buyerId !== currentUser?.id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-sm font-bold text-[#1A1A2E]">You don&apos;t have access to this invoice.</p>
      </div>
    );
  }

  if (invoicePrep === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm font-bold text-[#6B7280]">
        Preparing invoice…
      </div>
    );
  }

  if (invoicePrep === 'unavailable') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-3">
        <ShieldCheck className="w-10 h-10 text-amber-500" />
        <p className="text-sm font-bold text-[#1A1A2E]">Invoice unavailable</p>
        <p className="text-xs text-[#6B7280] max-w-sm">{unavailableReason}</p>
        <Link to="/profile/orders" className="text-xs font-bold text-[#FF5B00] underline">
          Back to My Orders
        </Link>
      </div>
    );
  }

  const sub: SubOrder | undefined = order.subOrders.find((s) => s.sellerId === sellerId);
  if (!sub) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-sm font-bold text-[#1A1A2E]">This seller&apos;s invoice couldn&apos;t be found on this order.</p>
      </div>
    );
  }

  const subtotal = sub.items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const total = subtotal + sub.deliveryFee;
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';
  const paymentLabel = order.isCOD ? 'Cash on Delivery' : order.paymentMethod === 'online' ? 'Online Payment' : 'Credit / EMI';
  const paidLabel = order.isCOD
    ? order.codDeliveryFeePaid
      ? 'Delivery fee paid online, balance due on delivery'
      : 'Balance due on delivery'
    : order.paidAt
      ? `Paid ${new Date(order.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`
      : 'Awaiting payment';

  /** Mirrors choosify-admin's OperationsInvoiceView.downloadPdf(): same
   *  canonical invoice data (no separate calculation), same Satoshi-embedded
   *  PDF builder ported 1:1, dynamically imported so jsPDF/autoTable never
   *  load into the bundle for pages that never open an invoice. */
  const downloadPdf = async () => {
    if (pdfState === 'generating') return;
    setPdfState('generating');
    try {
      const [{ buildInvoicePdf, invoicePdfFilename, loadSatoshiPdfFonts }, logoDataUrl] = await Promise.all([
        import('./invoicePdf'),
        loadLogoDataUrl(),
      ]);
      const satoshiFonts = await loadSatoshiPdfFonts();
      const doc = buildInvoicePdf({
        order,
        sub,
        invoiceDate,
        paymentMethodLabel: paymentLabel,
        paymentStatusLabel: paidLabel,
        logoDataUrl,
        satoshiFonts,
      });
      doc.save(invoicePdfFilename(sub.invoiceId, order.orderId));
      setPdfState('idle');
    } catch (err) {
      setPdfState('error');
      toast.error(err instanceof Error ? err.message : 'Failed to generate PDF.');
      setTimeout(() => setPdfState('idle'), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] p-4 sm:p-8">
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            .no-print { display: none !important; }
            /* This page renders inside the storefront's always-on Navbar/
               Footer shell (App.tsx never excludes /invoice from either) --
               neither has a .no-print class of its own, so print/PDF output
               was showing the whole site chrome around the invoice. Hide
               them by their own stable ids instead of restructuring the
               route just for this page. */
            #main-navbar, #global-footer { display: none !important; }
            body { background: #ffffff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .invoice-card { box-shadow: none !important; border: none !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
            /* Multi-page hygiene -- same rules as the admin invoice's print
               output: repeat the item-table header on each page, never split
               a row, keep the billing/summary blocks from being cut mid-block. */
            .invoice-card table thead { display: table-header-group !important; }
            .invoice-card table tr { break-inside: avoid !important; page-break-inside: avoid !important; }
            .invoice-billing, .invoice-summary { break-inside: avoid !important; page-break-inside: avoid !important; }
            @page { margin: 15mm; size: A4; }
          }
        `,
      }} />

      <div className="max-w-[840px] mx-auto mb-6 flex items-center justify-between gap-4 no-print">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E8EDF2] rounded-lg text-xs font-bold text-[#6B7280] hover:text-[#FF5B00] hover:border-[#FF5B00]/40 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-[#E8EDF2] text-[#6B7280] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Printer size={14} /> Print Invoice
          </button>
          <button
            onClick={downloadPdf}
            disabled={pdfState === 'generating'}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FF5B00] hover:bg-[#EF3C23] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
          >
            {pdfState === 'generating' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {pdfState === 'generating' ? 'Generating PDF…' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="invoice-card max-w-[840px] mx-auto bg-white rounded-lg border border-[#E8EDF2] shadow-2xl p-6 sm:p-12 flex flex-col justify-between">
        <div>
          {/* Choosify header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
            <div>
              <img src="/brand/choosify-logo-horizontal-navy.svg" alt="Choosify" className="h-10 w-auto max-w-[220px] mb-2" />
              <div className="text-[11px] font-black tracking-widest text-slate-400 uppercase">Choosify Marketplace</div>
              <div className="text-xs text-slate-400 mt-2 leading-relaxed font-medium">
                choosify.bd<br />
                support@choosify.bd
              </div>
            </div>
            <div className="sm:text-right font-medium">
              <div className="text-[11px] font-black tracking-widest text-slate-900 uppercase mb-1">Business Address</div>
              <div className="text-xs text-slate-800 leading-relaxed">
                <span className="font-semibold text-slate-900">Uttara, Dhaka - 1230, Bangladesh</span><br />
                Trade License: TR-2026-REG-1099
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-5" />

          {/* Billed to / invoice meta */}
          <div className="invoice-billing grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <div>
              <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2">Billed To</div>
              <div className="text-base font-extrabold text-[#18154C]">{order.shipping?.fullName || currentUser?.name || 'Buyer'}</div>
              <div className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                {order.shipping?.address || '—'}{order.shipping?.region ? `, ${order.shipping.region}` : ''}<br />
                Phone: {order.shipping?.phone || '—'}
              </div>
            </div>
            <div className="flex flex-col md:items-end">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-left md:text-right">
                <div className="text-slate-400 uppercase tracking-wider font-semibold">Invoice Number</div>
                <div className="font-extrabold text-[#18154C]">#{sub.invoiceId}</div>

                <div className="text-slate-400 uppercase tracking-wider font-semibold self-center">Invoice Amount</div>
                <div className="text-[26px] font-black text-[#FF5B00] leading-none">৳ {total.toLocaleString()}</div>

                <div className="text-slate-400 uppercase tracking-wider font-semibold">Order Reference</div>
                <div className="font-semibold text-slate-800">{order.orderId}</div>

                <div className="text-slate-400 uppercase tracking-wider font-semibold">Invoice Date</div>
                <div className="font-semibold text-slate-800">{invoiceDate}</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-5" />

          {/* Seller strip -- real business name only, no fabricated license/verification claims */}
          <div className="bg-[#F8F8F8] border border-slate-100 rounded-lg p-4 flex items-center justify-between gap-4 mb-5">
            <div>
              <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">Sold By</div>
              <div className="font-extrabold text-slate-900 text-sm">{sub.sellerBusinessName || 'Choosify Marketplace Seller'}</div>
            </div>
            <span className="text-[9.5px] font-black text-[#FF5B00] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Marketplace Seller
            </span>
          </div>

          {/* Items table -- every real line item, not a single hardcoded row */}
          <div className="mb-6">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase text-left">Item</th>
                  <th className="pb-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase text-right">Qty</th>
                  <th className="pb-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase text-right">Rate</th>
                  <th className="pb-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sub.items.map((item, idx) => (
                  <tr key={item.itemId || idx} className="border-b border-slate-100">
                    <td className="py-4">
                      <div className="font-bold text-[#18154C] text-sm">{item.productTitle}</div>
                      {item.productType === 'service' && item.serviceCategory && (
                        <div className="text-[11px] text-slate-400 mt-1">{item.serviceCategory}</div>
                      )}
                      {/* Purchased variant snapshot (size/color/etc) + SKU -- the
                          actual ordered selection, not the product's current
                          options. Same fields the canonical admin invoice reads
                          off this identical order record. */}
                      {(() => {
                        const variantLabel =
                          item.variantLabel?.trim() ||
                          (item.selectedOptions
                            ? Object.entries(item.selectedOptions)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(' · ')
                            : undefined);
                        if (!variantLabel && !item.variantSku) return null;
                        return (
                          <div className="text-[11px] text-slate-500 mt-1">
                            {variantLabel}
                            {variantLabel && item.variantSku ? ' · ' : ''}
                            {item.variantSku ? `SKU ${item.variantSku}` : ''}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="py-4 text-right text-slate-700 font-medium">{item.quantity}</td>
                    <td className="py-4 text-right text-slate-700 font-medium">৳ {item.price.toLocaleString()}</td>
                    <td className="py-4 text-right text-slate-900 font-extrabold">৳ {(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="invoice-summary flex justify-end mb-6">
            <div className="w-full sm:w-[300px] text-xs space-y-2 font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee:</span>
                <span>৳ {sub.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-[#FF5B00] border-t border-slate-100 pt-2.5">
                <span>Total:</span>
                <span className="text-base font-black">৳ {total.toLocaleString()}</span>
              </div>
              <div className="text-right space-y-1">
                <span className="inline-block mt-2 text-[10px] font-bold text-white bg-[#18154C] px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {paymentLabel}
                </span>
                <div className="text-[10.5px] text-slate-500">{paidLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-[#FF5B00] pt-5 flex justify-between items-start">
          <div className="max-w-[80%]">
            <div className="text-lg font-extrabold text-[#18154C] mb-1">Thanks for shopping with Choosify.</div>
            <div className="text-[10px] text-slate-400 leading-relaxed">
              This is a system-generated invoice — no signature required. Powered by Choosify.bd
            </div>
          </div>
          <img src="/brand/choosify-logo-icon.svg" alt="" className="w-14 h-14 opacity-15 object-contain shrink-0" />
        </div>
      </div>
    </div>
  );
}
