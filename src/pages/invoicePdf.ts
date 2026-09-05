/**
 * Direct .pdf generation for the canonical customer invoice — mirrors
 * choosify-admin-4.0's src/pages/admin/invoicePdf.ts 1:1 (same layout, same
 * branding, same jsPDF/autoTable pagination approach, same embedded Satoshi
 * typeface, same "BDT" plain-ASCII money formatting) so buyer, seller, and
 * admin all get a visually identical PDF from the SAME canonical Operations
 * order data. The two files can't literally share code (separate repos, no
 * shared package), so this is a deliberate line-for-line port — any visual
 * change to one should be mirrored in the other.
 *
 * Zero independent financial calculations: every number here is computed the
 * same way InvoicePage.tsx computes it on-screen (sum of price*qty, plus
 * deliveryFee) — never a second, different total.
 *
 * Typography: the canonical global Satoshi typeface is embedded into the PDF
 * itself (loadSatoshiPdfFonts() below), not left on jsPDF's built-in
 * Helvetica. Only Regular + Bold are embedded (the only two styles this file
 * requests), loaded from public/fonts/satoshi-pdf/*.ttf (jsPDF requires an
 * actual TTF/OTF it can parse — the woff2 files the browser uses for
 * on-screen text are not usable here). jsPDF's `putOnlyUsedFonts` subsets the
 * embedded font to only the glyphs actually printed, consistent with the
 * Fontshare Free Font EULA's "secured, read-only" embedding requirement. If
 * font loading fails for any reason, buildInvoicePdf falls back to jsPDF's
 * built-in Helvetica rather than failing the download.
 *
 * PDF-currency note: Satoshi is Latin-only — it has no more coverage of
 * ৳ (U+09F3, Bengali) than jsPDF's built-in fonts, and jsPDF's own
 * WinAnsi/AFM metrics force a broken glyph + per-character spacing bug for
 * any unmapped code point regardless of which font is active. So every PDF
 * monetary value goes through ONE helper, formatPdfMoney(), which renders
 * "BDT 18,990" — plain ASCII, correct glyph widths, normal spacing. The
 * on-screen invoice and print view are untouched and keep showing ৳.
 */
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import type { Order, SubOrder } from '../types/schemas';

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const CHUNK = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

export type SatoshiPdfFonts = { regular: string; bold: string };

/** Fetches the two embeddable Satoshi TTF weights this file uses (Regular,
 *  Bold) as base64. Only ever fetched at PDF-generation time, never on page
 *  load — the woff2 @font-face set used for on-screen text is separate and
 *  already loaded regardless. Returns null (not a throw) on failure so the
 *  caller can fall back to Helvetica. */
export async function loadSatoshiPdfFonts(): Promise<SatoshiPdfFonts | null> {
  try {
    const [regularRes, boldRes] = await Promise.all([
      fetch('/fonts/satoshi-pdf/Satoshi-Regular.ttf'),
      fetch('/fonts/satoshi-pdf/Satoshi-Bold.ttf'),
    ]);
    if (!regularRes.ok || !boldRes.ok) return null;
    const [regularBuf, boldBuf] = await Promise.all([regularRes.arrayBuffer(), boldRes.arrayBuffer()]);
    return { regular: arrayBufferToBase64(regularBuf), bold: arrayBufferToBase64(boldBuf) };
  } catch {
    return null;
  }
}

const BRAND = {
  navy: [24, 21, 76] as [number, number, number],
  coral: [239, 60, 35] as [number, number, number],
  orange: [255, 91, 0] as [number, number, number],
  muted: [107, 114, 128] as [number, number, number],
  hairline: [232, 237, 242] as [number, number, number],
};

const PAGE_W = 210; // A4 mm
const MARGIN = 14;

/** The ONE PDF money formatter — every monetary string in the generated PDF
 *  goes through this. Plain ASCII "BDT" prefix (see file header for why). */
function formatPdfMoney(n: number): string {
  return `BDT ${Math.round(n).toLocaleString('en-US')}`;
}

/** `Choosify-Invoice-INV-2B2F-94547.pdf`-style — strips anything unsafe for a filename. */
export function invoicePdfFilename(invoiceNumber: string | null | undefined, fallback: string): string {
  const base = (invoiceNumber || fallback || 'invoice').trim();
  const safe = base.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `Choosify-Invoice-${safe || 'document'}.pdf`;
}

function drawMetadataRow(
  doc: jsPDF,
  opts: { xRight: number; y: number; colWidth: number; label: string; value: string; big?: boolean; font: string },
): number {
  const { xRight, y, colWidth, label, value, big, font } = opts;
  const labelSize = 7.5;
  const valueSize = big ? 13 : 9;
  const labelLineH = labelSize * 0.42;
  const valueLineH = valueSize * 0.42;

  doc.setFont(font, 'bold');
  doc.setFontSize(labelSize);
  doc.setTextColor(...BRAND.muted);
  doc.text(label.toUpperCase(), xRight, y, { align: 'right' });

  doc.setFont(font, big ? 'bold' : 'normal');
  doc.setFontSize(valueSize);
  doc.setTextColor(...(big ? BRAND.coral : BRAND.navy));

  const lines = doc.splitTextToSize(String(value || '—'), colWidth) as string[];
  let ly = y + labelLineH + 1.6;
  for (const line of lines) {
    doc.text(line, xRight, ly, { align: 'right' });
    ly += valueLineH + 0.8;
  }
  return ly + 2;
}

export type InvoicePdfInput = {
  order: Order;
  sub: SubOrder;
  invoiceDate: string;
  paymentMethodLabel: string;
  paymentStatusLabel: string;
  /** data: URL for the official Choosify horizontal navy logo. */
  logoDataUrl?: string | null;
  satoshiFonts?: SatoshiPdfFonts | null;
};

/** Builds the finished jsPDF document. Caller decides save vs. blob vs. preview. */
export function buildInvoicePdf({
  order,
  sub,
  invoiceDate,
  paymentMethodLabel,
  paymentStatusLabel,
  logoDataUrl,
  satoshiFonts,
}: InvoicePdfInput): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true, putOnlyUsedFonts: true });

  let FONT = 'helvetica';
  if (satoshiFonts) {
    try {
      doc.addFileToVFS('Satoshi-Regular.ttf', satoshiFonts.regular);
      doc.addFont('Satoshi-Regular.ttf', 'Satoshi', 'normal');
      doc.addFileToVFS('Satoshi-Bold.ttf', satoshiFonts.bold);
      doc.addFont('Satoshi-Bold.ttf', 'Satoshi', 'bold');
      FONT = 'Satoshi';
    } catch {
      FONT = 'helvetica';
    }
  }

  // Same shape as admin's InvoiceViewModel.lines — computed once here so both
  // the table body and the running totals below read the exact same numbers.
  const lines = sub.items.map((it) => ({
    title: it.productTitle,
    variantLabel:
      it.variantLabel?.trim() ||
      (it.selectedOptions
        ? Object.entries(it.selectedOptions)
            .map(([k, v]) => `${k}: ${v}`)
            .join(' · ')
        : undefined),
    variantSku: it.variantSku,
    serviceCategory: it.productType === 'service' ? it.serviceCategory : undefined,
    qty: it.quantity,
    unitPrice: it.price,
    lineTotal: it.price * it.quantity,
  }));
  const itemsSubtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const deliveryTotal = sub.deliveryFee;
  const grandTotal = itemsSubtotal + deliveryTotal;

  // ── Header (page 1 only) ──
  let y = MARGIN;
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, 'PNG', MARGIN, y, 44.75, 10, undefined, 'FAST');
    } catch {
      /* fall through to text wordmark if the image can't be decoded */
    }
  }
  doc.setFont(FONT, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text('CHOOSIFY MARKETPLACE', MARGIN, y + 16);
  doc.setFont(FONT, 'normal');
  doc.setFontSize(8);
  doc.text('choosify.bd', MARGIN, y + 21);
  doc.text('support@choosify.bd', MARGIN, y + 25);

  doc.setFont(FONT, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.navy);
  doc.text('BUSINESS ADDRESS', PAGE_W - MARGIN, y, { align: 'right' });
  doc.setFont(FONT, 'normal');
  doc.text('Uttara, Dhaka - 1230, Bangladesh', PAGE_W - MARGIN, y + 5, { align: 'right' });
  doc.setTextColor(...BRAND.muted);
  doc.text('Trade License: TR-2026-REG-1099', PAGE_W - MARGIN, y + 9.5, { align: 'right' });

  y += 32;
  doc.setDrawColor(...BRAND.hairline);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  // ── Billed To (left column) / Invoice meta (right column) ──
  doc.setFont(FONT, 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.muted);
  doc.text('BILLED TO', MARGIN, y);
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.navy);
  doc.text(order.shipping?.fullName || 'Buyer', MARGIN, y + 6);
  doc.setFont(FONT, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 70);
  const addrLine = `${order.shipping?.address || '—'}${order.shipping?.region ? `, ${order.shipping.region}` : ''}`;
  const billedToColWidth = 95;
  const addrLines = doc.splitTextToSize(addrLine, billedToColWidth) as string[];
  const addrLineH = 8.5 * 0.42;
  addrLines.forEach((line, i) => doc.text(line, MARGIN, y + 12 + i * addrLineH));
  const phoneY = y + 12 + addrLines.length * addrLineH + 2.5;
  doc.text(`Phone: ${order.shipping?.phone || '—'}`, MARGIN, phoneY);

  const metaX = PAGE_W - MARGIN;
  const metaColWidth = 85;
  let my = y;
  my = drawMetadataRow(doc, { xRight: metaX, y: my, colWidth: metaColWidth, label: 'Invoice Number', value: sub.invoiceId ? `#${sub.invoiceId}` : '—', font: FONT });
  my = drawMetadataRow(doc, { xRight: metaX, y: my, colWidth: metaColWidth, label: 'Invoice Amount', value: formatPdfMoney(grandTotal), big: true, font: FONT });
  my = drawMetadataRow(doc, { xRight: metaX, y: my, colWidth: metaColWidth, label: 'Order Reference', value: order.orderId, font: FONT });
  my = drawMetadataRow(doc, { xRight: metaX, y: my, colWidth: metaColWidth, label: 'Invoice Date', value: invoiceDate, font: FONT });

  const billedToBottom = phoneY + 3;
  y = Math.max(billedToBottom, my) + 4;
  doc.setDrawColor(...BRAND.hairline);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 6;

  // ── Sold by strip ──
  const soldByLabel = 'SOLD BY';
  const sellerName = sub.sellerBusinessName || 'Choosify Marketplace Seller';
  const chipText = 'MARKETPLACE SELLER';
  doc.setFont(FONT, 'bold');
  doc.setFontSize(7);
  const chipWidth = doc.getTextWidth(chipText) + 8;
  const sellerNameMaxWidth = PAGE_W - MARGIN * 2 - 8 - chipWidth - 6;
  doc.setFontSize(9.5);
  const sellerNameLines = doc.splitTextToSize(sellerName, sellerNameMaxWidth) as string[];
  const stripH = Math.max(12, 4.5 + sellerNameLines.length * 4.2 + 2);

  doc.setFillColor(248, 248, 248);
  doc.roundedRect(MARGIN, y, PAGE_W - MARGIN * 2, stripH, 1.5, 1.5, 'F');
  doc.setFont(FONT, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.muted);
  doc.text(soldByLabel, MARGIN + 4, y + 4.5);
  doc.setFont(FONT, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 30, 40);
  sellerNameLines.forEach((line, i) => doc.text(line, MARGIN + 4, y + 9.5 + i * 4.2));
  doc.setFont(FONT, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...BRAND.orange);
  doc.text(chipText, PAGE_W - MARGIN - 4, y + 7.5, { align: 'right' });
  y += stripH + 6;

  // ── Items table ──
  autoTable(doc, {
    startY: y,
    margin: { left: MARGIN, right: MARGIN, bottom: 26 },
    head: [['Item', 'Qty', 'Rate', 'Amount']],
    body: lines.map((line) => [
      [line.title, line.serviceCategory, line.variantLabel, line.variantSku ? `SKU ${line.variantSku}` : '']
        .filter(Boolean)
        .join('\n'),
      String(line.qty),
      formatPdfMoney(line.unitPrice),
      formatPdfMoney(line.lineTotal),
    ]),
    styles: { font: FONT, fontSize: 8.5, cellPadding: 3, textColor: [30, 30, 40], lineColor: BRAND.hairline, lineWidth: 0.1, overflow: 'linebreak' },
    headStyles: { fillColor: [255, 255, 255], textColor: BRAND.muted, fontStyle: 'bold', fontSize: 7.5, lineWidth: { bottom: 0.3 }, lineColor: [200, 200, 210] },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 14, halign: 'right' },
      2: { cellWidth: 32, halign: 'right' },
      3: { cellWidth: 34, halign: 'right', fontStyle: 'bold' },
    },
    rowPageBreak: 'avoid',
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        doc.setFont(FONT, 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...BRAND.muted);
        doc.text(`Invoice #${sub.invoiceId || '—'} - Order ${order.orderId}`, MARGIN, 10);
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sy = (doc as any).lastAutoTable.finalY + 8;
  const pageH = doc.internal.pageSize.getHeight();
  const CLOSING_BLOCK_H = 68;
  if (sy > pageH - CLOSING_BLOCK_H) {
    doc.addPage();
    sy = MARGIN;
  }

  const sumX = PAGE_W - MARGIN;
  const sumLabelX = sumX - 60;
  doc.setFont(FONT, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.muted);
  doc.text('Subtotal:', sumLabelX, sy);
  doc.setTextColor(30, 30, 40);
  doc.text(formatPdfMoney(itemsSubtotal), sumX, sy, { align: 'right' });
  sy += 6;
  doc.setTextColor(...BRAND.muted);
  doc.text('Delivery Fee:', sumLabelX, sy);
  doc.setTextColor(30, 30, 40);
  doc.text(formatPdfMoney(deliveryTotal), sumX, sy, { align: 'right' });
  sy += 4;
  doc.setDrawColor(...BRAND.hairline);
  doc.line(sumLabelX, sy, sumX, sy);
  sy += 6;
  doc.setFont(FONT, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.coral);
  doc.text('Total:', sumLabelX, sy);
  doc.text(formatPdfMoney(grandTotal), sumX, sy, { align: 'right' });
  sy += 8;

  doc.setFillColor(...BRAND.navy);
  doc.setFont(FONT, 'bold');
  doc.setFontSize(7);
  const badgeW = doc.getTextWidth(paymentMethodLabel.toUpperCase()) + 8;
  doc.roundedRect(sumX - badgeW, sy - 3.5, badgeW, 6, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(paymentMethodLabel.toUpperCase(), sumX - badgeW / 2, sy, { align: 'center' });
  sy += 6.5;
  doc.setFont(FONT, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...BRAND.muted);
  const statusLines = doc.splitTextToSize(paymentStatusLabel, 90) as string[];
  statusLines.forEach((line, i) => doc.text(line, sumX, sy + i * 3.6, { align: 'right' }));
  sy += statusLines.length * 3.6 + 8;

  doc.setDrawColor(...BRAND.coral);
  doc.setLineWidth(0.8);
  doc.line(MARGIN, sy, PAGE_W - MARGIN, sy);
  sy += 7;
  doc.setFont(FONT, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...BRAND.navy);
  doc.text('Thanks for shopping with Choosify.', MARGIN, sy);
  sy += 5;
  doc.setFont(FONT, 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...BRAND.muted);
  doc.text('This is a system-generated invoice - no signature required. Powered by Choosify.bd', MARGIN, sy);

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont(FONT, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...BRAND.muted);
    doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, pageH - 8, { align: 'right' });
  }

  return doc;
}
