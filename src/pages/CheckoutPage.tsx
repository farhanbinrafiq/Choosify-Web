import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  FileText,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

const KNOWN_PROMOS = [
  { code: 'AARONG15', discount: 15, type: 'percentage' as const },
  { code: 'APEXFOOT26', discount: 500, type: 'flat' as const },
  { code: 'SAILOREID', discount: 20, type: 'percentage' as const },
  { code: 'ADIEXTRA10', discount: 10, type: 'percentage' as const },
];

export function CheckoutPage() {
  const { mode, retailCart, wholesaleCart, createOrder, addOrder, clearCart, currentUser, buyerReputations } = useGlobalState();
  const { createNewThread } = useDashboard();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Find out if checking out retail or wholesale
  const sourceMode: 'retail' | 'wholesale' = (location.state as any)?.sourceMode || mode;
  const isQuotationRequest = (location.state as any)?.isQuotationRequest || false;
  const tradeLicense = (location.state as any)?.tradeLicense || localStorage.getItem('b2b_trade_license') || 'TR-2026/89412';
  const companyName = (location.state as any)?.companyName || localStorage.getItem('b2b_company_name') || 'Apex Distributors Ltd';

  const activeCart = sourceMode === 'wholesale' ? wholesaleCart : retailCart;

  // Contact States
  const [fullName, setFullName] = useState('Kamal Uddin');
  const [phone, setPhone] = useState('+880 1712-345678');
  const [address, setAddress] = useState('House 42, Road 11, Banani, Dhaka');
  const [region, setRegion] = useState('Dhaka');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'credit'>('cod');

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: 'flat' | 'percentage' } | null>(null);

  const handleApplyPromo = () => {
    const found = KNOWN_PROMOS.find(p => p.code === promoCode.trim().toUpperCase());
    if (!found) { toast.error('Invalid or expired promo code.'); return; }
    if (appliedPromo) { toast.error('A promo code is already applied.'); return; }
    setAppliedPromo(found);
    toast.success(`Promo code applied! ${found.type === 'percentage' ? found.discount + '% OFF' : '৳' + found.discount + ' OFF'}`);
  };

  const userRep = buyerReputations?.find(rep => rep.userId === currentUser?.id);
  const codTrustScore = userRep ? userRep.codTrustScore : 100;
  const cancellationRatio = userRep ? userRep.cancellationRatio : 0;
  const isCODRestricted = codTrustScore < 50 || cancellationRatio > 40;

  React.useEffect(() => {
    if (isCODRestricted) {
      setPaymentMethod('credit');
    }
  }, [isCODRestricted]);

  // If cart is empty, redirect
  React.useEffect(() => {
    if (activeCart.length === 0) {
      toast.error('No items in checkout buffer!');
      navigate('/');
    }
  }, [activeCart, navigate]);

  // Group items by seller
  const groupedCart = activeCart.reduce((acc: { [key: string]: typeof activeCart }, item) => {
    const sellerId = item.product.sellerId || 'seller-general';
    if (!acc[sellerId]) acc[sellerId] = [];
    acc[sellerId].push(item);
    return acc;
  }, {});

  const sellerIds = Object.keys(groupedCart);

  // Helper function to resolve dynamic unit price based on pricing tiers/slabs
  const getSlabPrice = (product: any, qty: number) => {
    if (sourceMode === 'retail') return product.price;
    const tiers = product.pricingTiers || product.quantitySlabs || [];
    if (!tiers || tiers.length === 0) return product.price;

    let activeSlabPrice = product.price;
    const sortedTiers = [...tiers].sort((a, b) => b.minQuantity - a.minQuantity);
    
    for (const tier of sortedTiers) {
      if (qty >= tier.minQuantity) {
        activeSlabPrice = tier.price;
        break;
      }
    }
    return activeSlabPrice;
  };

  const calculateSellerSubtotal = (items: typeof activeCart) => {
    return items.reduce((sum, item) => {
      const activePrice = getSlabPrice(item.product, item.quantity);
      return sum + (activePrice * item.quantity);
    }, 0);
  };

  const DELIVERY_FEE_PER_SELLER = sourceMode === 'wholesale' ? 500 : 120;
  const deliveryTotal = sellerIds.length * DELIVERY_FEE_PER_SELLER;

  const subtotal = activeCart.reduce((sum, item) => {
    const activePrice = getSlabPrice(item.product, item.quantity);
    return sum + (activePrice * item.quantity);
  }, 0);

  const aggregateTotal = subtotal + deliveryTotal;

  const promoDiscount = appliedPromo
    ? appliedPromo.type === 'percentage'
      ? Math.round(subtotal * appliedPromo.discount / 100)
      : appliedPromo.discount
    : 0;
  const finalTotal = aggregateTotal - promoDiscount;

  // COD support limits (retail under 150k, B2B quote allowed)
  const isCODEligible = (sourceMode === 'retail' ? (aggregateTotal < 150000) : !isQuotationRequest) && !isCODRestricted;

  const handlePlaceOrder = () => {
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      toast.error('Please deliver all shipping credentials!');
      return;
    }

    // Trigger global order engine
    const tempOrderId = 'ORD-' + Math.floor(Math.random() * 90000 + 10000);
    const splitCount = sellerIds.length;

    // Generate SubOrders structure
    const generatedSubOrders = sellerIds.map((sellerId, sIdx) => {
      const items = groupedCart[sellerId];
      const sellerName = items[0].product.brand || 'Merchant partner';
      const itemsListStr = items.map(it => {
        const up = getSlabPrice(it.product, it.quantity);
        return `• ${it.product.title} (${it.quantity} units @ ৳${up.toLocaleString()})`;
      }).join('\n');

      const invoiceIdStr = `INV-${sellerId.toUpperCase().slice(0, 4)}-${Math.floor(Math.random() * 90000 + 10000)}`;

      // Construct Thread starter messages containing products list status details
      const startMsg = `ORDER REFERENCE: ${tempOrderId}
INVOICE ID: ${invoiceIdStr}
MODE: ${sourceMode.toUpperCase()}
DELIVERY RECIPIENT: ${fullName}
CONTACT PHONE: ${phone}
DELIVERY LOCATION: ${address}, ${region}
DELIVERY METHOD: ${sourceMode === 'wholesale' ? 'B2B Cargo Freight' : 'Standard Express Parcel'}
DELIVERY FEE: ৳${DELIVERY_FEE_PER_SELLER}

STAGED PRODUCTS IN LOT:
${itemsListStr}

LOT METRIC AMOUNT: ৳${calculateSellerSubtotal(items).toLocaleString()}
TRADE LICENSE SECURE: ${sourceMode === 'wholesale' ? tradeLicense : 'NOT APPLICABLE'}
ORDER STATUS: PENDING_CONFIRMATION

"Hello Partner! Clicking above confirms receipt of this staged ticket. Our logistics representative has started routing this package. Please review the parcel invoice."`;

      // Trigger automatic buyer-seller conversation threads using existing messaging context
      createNewThread(
        `thread-${sellerId}`,
        `${sellerName} Factory Outlet`,
        `https://i.pravatar.cc/150?u=${sellerId}`,
        sourceMode === 'wholesale' ? 'wholesale' : 'retail',
        `New lot transaction initialized (${tempOrderId})`,
        tempOrderId
      );

      // Seed the elaborate starter ticket block inside the thread
      setTimeout(() => {
        // Post first system details ticket
        const threadElements = localStorage.getItem('choosify_thread_messages');
        if (threadElements) {
          try {
            const parsed = JSON.parse(threadElements);
            const exists = parsed.some((x: any) => x.threadId === `thread-${sellerId}` && x.text.includes(tempOrderId));
            if (!exists) {
              const newMsg = {
                id: Date.now() + Math.floor(Math.random() * 50),
                threadId: `thread-${sellerId}`,
                text: startMsg,
                sender: 'other',
                senderName: `${sellerName} Factory Support`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: `https://i.pravatar.cc/150?u=${sellerId}`
              };
              localStorage.setItem('choosify_thread_messages', JSON.stringify([...parsed, newMsg]));
            }
          } catch (e) {}
        }
      }, 300);

      return {
        sellerId,
        sellerBusinessName: sellerName,
        items: items.map(it => ({
          productId: it.product.id,
          productTitle: it.product.title,
          quantity: it.quantity,
          price: getSlabPrice(it.product, it.quantity)
        })),
        deliveryFee: DELIVERY_FEE_PER_SELLER,
        invoiceId: invoiceIdStr,
        trackingStatus: 'pending' as const
      };
    });

    const fullOrderObject = {
      orderId: tempOrderId,
      buyerId: 'user-standard',
      isCOD: paymentMethod === 'cod',
      isSplit: splitCount > 1,
      overallTotal: finalTotal,
      subOrders: generatedSubOrders,
      createdAt: new Date().toISOString()
    };

    if (appliedPromo) {
      window.dispatchEvent(new CustomEvent('choosify-promo-applied', { detail: appliedPromo }));
    }

    // Add to global state (which automatically updates localStorage and triggers reactivity)
    addOrder(fullOrderObject);

    // Clear active cart
    clearCart();

    toast.success('Order placed successfully! Live support thread generated.');
    
    // Auto-open newly spawned buyer-seller conversation thread
    const firstThreadId = sellerIds.length > 0 ? `thread-${sellerIds[0]}` : 'thread-general';
    navigate(`/messages/${firstThreadId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      {/* Checkout Header */}
      <div className="choosify-dark-gradient text-white py-12 px-4 md:px-8 border-b border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <button 
              onClick={() => navigate(-1)} 
              className="group text-xs font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest italic flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              Adjust Cart Staging
            </button>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">
              Verification &amp; <span className="text-orange-primary">Checkout</span>
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">
              Source Stream: <span className="text-[#F96500]">{sourceMode === 'wholesale' ? 'FACTORY B2B WHOLESALE' : 'STANDARD CLIENT RETAIL'}</span>
            </p>
          </div>
          <div className="flex gap-4 items-center">
            {sourceMode === 'wholesale' && (
              <div className="bg-[#F96500]/10 border border-[#F96500]/30 px-5 py-3 rounded-[5px]">
                <span className="text-[8px] font-black text-white uppercase tracking-widest block mb-0.5 leading-none">Registered License ID</span>
                <span className="text-xs font-black text-[#F96500] italic font-mono uppercase">{tradeLicense}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Input Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Credentials */}
          <div className="bg-white border border-gray-100 rounded-[5px] p-8 shadow-sm space-y-6">
            <h2 className="text-base font-black text-navy uppercase italic tracking-widest border-b pb-4 flex items-center gap-2">
              <MapPin size={16} className="text-orange-primary" />
              Recipient Cargo Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 leading-none">Recipient Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-11 pr-4 text-xs font-black text-navy focus:outline-none focus:border-orange-primary"
                    placeholder="e.g. Kamal Hossain"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 leading-none">Mobile Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl pl-11 pr-4 text-xs font-black text-navy focus:outline-none focus:border-orange-primary"
                    placeholder="e.g. +880 1712..."
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 leading-none">Fulfillment Staging Location</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl px-4 text-xs font-black text-navy focus:outline-none focus:border-orange-primary"
                  placeholder="e.g. House No. 42, Road 11, Banani, Dhaka"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 leading-none">Region/Metro Zone</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl px-4 text-xs font-black text-navy focus:outline-none focus:border-orange-primary cursor-pointer"
                >
                  <option value="Dhaka">Dhaka Metro Area</option>
                  <option value="Chittagong">Chittagong City</option>
                  <option value="Sylhet">Sylhet Corporation</option>
                  <option value="Rajshahi">Rajshahi Division</option>
                  <option value="Khulna">Khulna District</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 leading-none">Cargo Dispatch Notes</label>
                <input 
                  type="text" 
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full h-12 bg-gray-50/50 border border-gray-100 rounded-xl px-4 text-xs font-black text-navy focus:outline-none focus:border-orange-primary"
                  placeholder="e.g. Fragile lot, call before dispatch..."
                />
              </div>
            </div>
          </div>

          {/* Grouped Lots Packages Visualizer */}
          <div className="bg-white border border-gray-100 rounded-[5px] p-8 shadow-sm space-y-6">
            <h2 className="text-base font-black text-navy uppercase italic tracking-widest border-b pb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Truck size={16} className="text-orange-primary" />
                Seller-wise Dispatch Splits
              </span>
              <span className="text-[8px] bg-navy text-white px-2 py-1 rounded font-black italic tracking-widest uppercase">
                {sellerIds.length} Warehouse Parcels
              </span>
            </h2>

            <div className="space-y-6">
              {sellerIds.map((sellerId) => {
                const items = groupedCart[sellerId];
                const sellerName = items[0].product.brand || 'Regional Seller';
                return (
                  <div key={sellerId} className="border border-gray-100 rounded-[5px] p-6 bg-[#F8FAFC]/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-white italic uppercase tracking-wider bg-navy px-2 py-1 rounded">
                          LOT SPLIT {sellerIds.indexOf(sellerId) + 1}
                        </span>
                        <span className="text-xs font-black text-navy italic">{sellerName} Outlet</span>
                      </div>
                      <span className="text-[10px] font-black text-orange-primary italic">Freight: ৳{DELIVERY_FEE_PER_SELLER}</span>
                    </div>

                    <div className="space-y-2">
                      {items.map((it) => (
                        <div key={it.id} className="flex justify-between items-center bg-white border border-gray-50 px-4 py-2.5 rounded-xl">
                          <span className="text-[11px] font-bold text-navy line-clamp-1">{it.product.title}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase text-right shrink-0">
                            {it.quantity} x ৳{getSlabPrice(it.product, it.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action summaries */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-[5px] p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-navy uppercase italic tracking-tighter border-b pb-4">Staging Settlement</h3>

            {/* Payment selection */}
            <div className="space-y-3">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Select Payment Settlement</span>

              {isCODRestricted && (
                <div id="cod-restriction-warning" className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-4 py-3 rounded-xl">
                  ⚠ COD is restricted on your account due to order history. Please use online payment.
                </div>
              )}

              <button
                onClick={() => setPaymentMethod('cod')}
                disabled={!isCODEligible}
                className={cn(
                  "w-full p-4 rounded-[5px] border text-left flex gap-4 items-start transition-all",
                  paymentMethod === 'cod' 
                    ? "border-[#F96500] bg-[#F96500]/5" 
                    : "border-gray-100 bg-white hover:bg-gray-50",
                  !isCODEligible && "opacity-30 cursor-not-allowed"
                )}
              >
                <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 bg-white border-gray-300">
                  {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[#F96500] rounded-full" />}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-navy uppercase tracking-widest italic leading-none mb-1">Cash On Delivery</h4>
                  <p className="text-[8px] text-gray-400 font-medium leading-normal">Inspect package contents and settle amount directly with Papefly/RedX agents on pickup.</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('credit')}
                className={cn(
                  "w-full p-4 rounded-[5px] border text-left flex gap-4 items-start transition-all",
                  paymentMethod === 'credit' 
                    ? "border-[#F96500] bg-[#F96500]/5" 
                    : "border-gray-100 bg-white hover:bg-gray-50"
                )}
              >
                <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 bg-white border-gray-300">
                  {paymentMethod === 'credit' && <div className="w-2.5 h-2.5 bg-[#F96500] rounded-full" />}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-navy uppercase tracking-widest italic leading-none mb-1">Commercial Credit / Prepayment</h4>
                  <p className="text-[8px] text-gray-400 font-medium leading-normal">Submit corporate payment advice, bank wire instruction, or request open terms invoicing ledger.</p>
                </div>
              </button>
            </div>

            {/* Billing totals */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                <span>Products lot staging</span>
                <span className="text-navy">৳{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                <span>Split freight dispatch</span>
                <span className="text-navy">৳{deliveryTotal.toLocaleString()}</span>
              </div>

              {appliedPromo && (
                <div className="flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">
                  <span>Promo Discount</span>
                  <span>-৳{promoDiscount.toLocaleString()}</span>
                </div>
              )}

              {/* Promo code input section */}
              <div className="border-y py-4 my-2 space-y-2">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none">Voucher Code</span>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 h-10 bg-gray-50/50 border border-gray-100 rounded-xl px-4 text-xs font-black text-navy focus:outline-none focus:border-orange-primary"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="h-10 px-4 bg-navy hover:bg-[#E8500A] text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-colors border-none"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl text-[10px] font-bold">
                    <span>✓ {appliedPromo.code} applied — saving ৳{promoDiscount.toLocaleString()}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setAppliedPromo(null);
                        setPromoCode('');
                      }}
                      className="text-emerald-800 hover:text-red-500 font-extrabold text-xs ml-2 cursor-pointer bg-transparent border-none"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-between items-center font-black italic">
                <span className="text-xs uppercase tracking-widest text-[#0A0A1F]">Settlement Total</span>
                <span className="text-2xl text-orange-primary tracking-tight">৳{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Action check button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full h-14 bg-orange-primary hover:bg-[#0A0B1E] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full flex items-center justify-between px-8 shadow-lg shadow-orange-primary/10 transition-all italic hover:scale-[1.01]"
            >
              <span>{sourceMode === 'wholesale' ? 'Authorize Wholesale Lot' : 'Confirm & Place Retail Order'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Guaranteed security escrow */}
          <div className="bg-navy p-6 rounded-[5px] text-white flex gap-4 items-center">
            <ShieldCheck size={32} className="text-orange-primary shrink-0" />
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest italic leading-none mb-1">Double Shield Protection</h4>
              <p className="text-[8px] text-white/50 font-medium leading-relaxed">Purchases are escrow-backed. All factories receive instant routing advice containing order verification logs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
