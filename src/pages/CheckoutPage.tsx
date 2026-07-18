import React, { useState, useRef } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { useDashboard } from '../context/DashboardContext';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import { operationsApi } from '../services/operationsApi';

const KNOWN_PROMOS_FALLBACK = [
  { code: 'AARONG15', discount: 15, type: 'percentage' as const },
  { code: 'APEXFOOT26', discount: 500, type: 'flat' as const },
  { code: 'SAILOREID', discount: 20, type: 'percentage' as const },
  { code: 'ADIEXTRA10', discount: 10, type: 'percentage' as const },
];

export function CheckoutPage() {
  const { retailCart, addOrder, currentUser, buyerReputations, isFeatureEnabled } = useGlobalState();
  const { createNewThread } = useDashboard();
  
  const navigate = useNavigate();

  const activeCart = retailCart;

  // Contact States
  const [fullName, setFullName] = useState('Kamal Uddin');
  const [phone, setPhone] = useState('+880 1712-345678');
  const [address, setAddress] = useState('House 42, Road 11, Banani, Dhaka');
  const [region, setRegion] = useState('Dhaka');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'credit'>('cod');

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: 'flat' | 'percentage' } | null>(null);

  const userRep = buyerReputations?.find(rep => rep.userId === currentUser?.id);
  const codTrustScore = userRep ? userRep.codTrustScore : 100;
  const cancellationRatio = userRep ? userRep.cancellationRatio : 0;
  const isCODRestricted = codTrustScore < 50 || cancellationRatio > 40;
  const orderPlacedRef = useRef(false);

  React.useEffect(() => {
    if (isCODRestricted) {
      setPaymentMethod('credit');
    }
  }, [isCODRestricted]);

  // If cart is empty, redirect — unless we just placed an order (cart clears before navigate)
  React.useEffect(() => {
    if (orderPlacedRef.current) return;
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
  const getSlabPrice = (product: any, _qty: number) => product.price;

  const calculateSellerSubtotal = (items: typeof activeCart) => {
    return items.reduce((sum, item) => {
      const activePrice = getSlabPrice(item.product, item.quantity);
      return sum + (activePrice * item.quantity);
    }, 0);
  };

  const DELIVERY_FEE_PER_SELLER = 120;
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
  const finalTotal = Math.max(0, aggregateTotal - promoDiscount);

  const handleApplyPromo = async () => {
    if (appliedPromo) {
      toast.error('A promo code is already applied.');
      return;
    }
    const code = promoCode.trim().toUpperCase();
    try {
      const result = await operationsApi.validateCoupon({
        code,
        cartTotal: subtotal,
        userId: currentUser?.id,
        cartItems: activeCart.map((item) => ({
          id: String(item.product.id),
          price: Number(getSlabPrice(item.product, item.quantity) || 0),
          category: item.product.category,
          brand: item.product.brand,
          quantity: item.quantity,
        })),
      });
      if (!result.valid) {
        toast.error(result.reason || 'Invalid or expired promo code.');
        return;
      }
      const promoType =
        result.type === 'fixed_amount' || result.type === 'free_shipping' ? 'flat' : 'percentage';
      const discountValue =
        promoType === 'percentage'
          ? Math.round((result.discount / Math.max(subtotal, 1)) * 100)
          : result.discount;
      setAppliedPromo({ code, discount: discountValue, type: promoType });
      toast.success(
        `Promo code applied! ${promoType === 'percentage' ? `${discountValue}% OFF` : `৳${result.discount} OFF`}`,
      );
    } catch {
      const found = KNOWN_PROMOS_FALLBACK.find((p) => p.code === code);
      if (!found) {
        toast.error('Invalid or expired promo code.');
        return;
      }
      setAppliedPromo(found);
      toast.success(`Promo code applied! ${found.type === 'percentage' ? found.discount + '% OFF' : '৳' + found.discount + ' OFF'}`);
    }
  };

  const isCODEligible = aggregateTotal < 150000 && !isCODRestricted;

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
MODE: RETAIL
DELIVERY RECIPIENT: ${fullName}
CONTACT PHONE: ${phone}
DELIVERY LOCATION: ${address}, ${region}
DELIVERY METHOD: Standard Express Parcel
DELIVERY FEE: ৳${DELIVERY_FEE_PER_SELLER}

STAGED PRODUCTS IN LOT:
${itemsListStr}

LOT METRIC AMOUNT: ৳${calculateSellerSubtotal(items).toLocaleString()}
ORDER STATUS: PENDING_CONFIRMATION

"Hello Partner! Clicking above confirms receipt of this staged ticket. Our logistics representative has started routing this package. Please review the parcel invoice."`;

      // Trigger automatic buyer-seller conversation threads using existing messaging context
      createNewThread(
        `thread-${sellerId}`,
        `${sellerName} Factory Outlet`,
        `https://i.pravatar.cc/150?u=${sellerId}`,
        'retail',
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
          price: getSlabPrice(it.product, it.quantity),
          image: it.selectedVariant?.image || it.product.image,
          brand: it.product.brand,
          variantLabel: it.selectedVariant?.attributes
            ? Object.entries(it.selectedVariant.attributes)
                .map(([key, value]) => `${key}: ${value}`)
                .join(' · ')
            : undefined,
          variantSku: it.selectedVariant?.sku,
          notes: deliveryNotes.trim() || undefined,
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
      subtotal,
      deliveryTotal,
      subOrders: generatedSubOrders,
      createdAt: new Date().toISOString(),
      promoCode: appliedPromo?.code,
      promoDiscount: promoDiscount,
      promoType: appliedPromo?.type,
      paymentMethod,
      shipping: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        region,
        deliveryNotes: deliveryNotes.trim() || undefined,
      },
    };

    if (appliedPromo) {
      window.dispatchEvent(new CustomEvent('choosify-promo-applied', { detail: appliedPromo }));
    }

    sessionStorage.setItem('choosify_last_order_id', tempOrderId);
    sessionStorage.setItem('choosify_last_order_snapshot', JSON.stringify(fullOrderObject));

    // Add to global state (which automatically updates localStorage and triggers reactivity)
    addOrder(fullOrderObject);
    operationsApi.createOrder(fullOrderObject as Record<string, unknown>).catch(() => {});

    orderPlacedRef.current = true;
    toast.success('Order placed successfully! Live support thread generated.');
    
    // Navigate before cart clears so the empty-cart guard does not bounce to home
    navigate(`/order-success/${tempOrderId}`, { replace: true, state: { order: fullOrderObject } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9]">
      {/* Checkout Header — Choosify.dc.html dark band */}
      <header className="bg-[#000435] text-white px-5 sm:px-10 py-6">
        <nav className="text-xs text-white/45 mb-3" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#FF5B00] transition-colors">
            Home
          </Link>
          <span className="mx-1.5">›</span>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="hover:text-[#FF5B00] transition-colors bg-transparent border-0 text-white/45 cursor-pointer p-0 text-xs"
          >
            Cart
          </button>
          <span className="mx-1.5">›</span>
          <span className="text-white">Checkout</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight">
              SECURE <span className="text-[#FF5B00]">CHECKOUT</span>
            </h1>
            <p className="text-[12.5px] text-white/50 mt-1">
              Almost there! Review and place your order
            </p>
          </div>

          <div className="flex items-center gap-2.5" aria-label="Checkout steps">
            {[
              { num: 1, label: 'Cart', done: true },
              { num: 2, label: 'Delivery', done: true },
              { num: 3, label: 'Payment', done: false },
              { num: 4, label: 'Confirm', done: false },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2.5">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold',
                      step.done || step.num === 3
                        ? 'bg-[#FF5B00] text-white'
                        : 'bg-white/10 text-white/50 border border-white/15',
                    )}
                  >
                    {step.num}
                  </div>
                  <div
                    className={cn(
                      'text-[10px] font-bold whitespace-nowrap',
                      step.done || step.num === 3 ? 'text-white' : 'text-white/45',
                    )}
                  >
                    {step.label}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-10 h-0.5 bg-white/15 mb-5 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto w-full px-5 sm:px-10 py-7 pb-[60px] grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1">
        {/* Input Forms */}
        <div className="lg:col-span-2 space-y-[18px]">
          {/* Shipping Credentials */}
          <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 sm:p-6 space-y-5">
            <h2 className="text-[12.5px] font-extrabold text-[#1A1A2E] flex items-center gap-1.5">
              <MapPin size={16} className="text-[#FF5B00]" />
              DELIVERY INFORMATION
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="text-[10px] font-bold text-[#9AA0AC] uppercase block mb-1 leading-none">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0AC]" size={14} />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-4 text-[13px] font-semibold text-[#1A1A2E] focus:outline-none focus:border-[#FF5B00]"
                    placeholder="e.g. Kamal Hossain"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#9AA0AC] uppercase block mb-1 leading-none">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0AC]" size={14} />
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 bg-white border border-[#E5E7EB] rounded-lg pl-10 pr-4 text-[13px] font-semibold text-[#1A1A2E] focus:outline-none focus:border-[#FF5B00]"
                    placeholder="e.g. +880 1712..."
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-[#9AA0AC] uppercase block mb-1 leading-none">Delivery Address</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-11 bg-white border border-[#E5E7EB] rounded-lg px-4 text-[13px] font-semibold text-[#1A1A2E] focus:outline-none focus:border-[#FF5B00]"
                  placeholder="e.g. House No. 42, Road 11, Banani, Dhaka"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#9AA0AC] uppercase block mb-1 leading-none">Region / City</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-11 bg-white border border-[#E5E7EB] rounded-lg px-4 text-[13px] font-semibold text-[#1A1A2E] focus:outline-none focus:border-[#FF5B00] cursor-pointer"
                >
                  <option value="Dhaka">Dhaka Metro Area</option>
                  <option value="Chittagong">Chittagong City</option>
                  <option value="Sylhet">Sylhet Corporation</option>
                  <option value="Rajshahi">Rajshahi Division</option>
                  <option value="Khulna">Khulna District</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grouped Lots Packages Visualizer */}
          <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 sm:p-6 space-y-4">
            <h2 className="text-[12.5px] font-extrabold text-[#1A1A2E] flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <Truck size={16} className="text-[#FF5B00]" />
                SELLER-WISE DISPATCH SPLITS
              </span>
              <span className="text-[10.5px] text-[#9AA0AC] font-bold uppercase">
                {sellerIds.length} Warehouse Parcel{sellerIds.length === 1 ? '' : 's'}
              </span>
            </h2>

            <div className="space-y-4">
              {sellerIds.map((sellerId) => {
                const items = groupedCart[sellerId];
                const sellerName = items[0].product.brand || 'Regional Seller';
                return (
                  <div key={sellerId} className="border border-[#F1F1F3] rounded-[10px] p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold text-white uppercase tracking-wider bg-[#1A1A2E] px-2 py-0.5 rounded">
                          LOT {sellerIds.indexOf(sellerId) + 1}
                        </span>
                        <span className="text-[12.5px] font-bold text-[#1A1A2E]">{sellerName}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#9AA0AC]">Freight: ৳{DELIVERY_FEE_PER_SELLER}</span>
                    </div>

                    <div className="space-y-2">
                      {items.map((it) => (
                        <div key={it.id} className="flex justify-between items-center gap-3 py-2 border-t border-[#F4F7F9] first:border-0">
                          <span className="text-[12.5px] font-bold text-[#1A1A2E] line-clamp-1">{it.product.title}</span>
                          <span className="text-[11px] font-bold text-[#9AA0AC] text-right shrink-0">
                            {it.quantity} × ৳{getSlabPrice(it.product, it.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order notes — notes already wired to deliveryNotes above as landmark; keep optional notes section visual */}
          <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 sm:p-6">
            <h2 className="text-[12.5px] font-extrabold text-[#1A1A2E] mb-3 flex items-center gap-1.5">
              <MessageSquare size={14} className="text-[#FF5B00]" />
              ORDER NOTES (OPTIONAL)
            </h2>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="e.g. Please call before delivery, leave at the gate, etc."
              className="w-full h-[60px] rounded-lg border border-[#E5E7EB] p-2.5 text-xs text-[#1A1A2E] font-sans resize-none focus:outline-none focus:border-[#FF5B00] box-border"
            />
          </div>
        </div>

        {/* Action summaries */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 space-y-5">
            <h3 className="text-[12.5px] font-extrabold text-[#1A1A2E]">ORDER SUMMARY</h3>

            {/* Payment selection */}
            <div className="space-y-3">
              <span className="text-[10.5px] font-bold text-[#9AA0AC] uppercase block leading-none mb-1">Payment Method</span>

              {isCODRestricted && (
                <div id="cod-restriction-warning" className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-4 py-3 rounded-lg">
                  ⚠ COD is restricted on your account due to order history. Please use online payment.
                </div>
              )}

              <button
                onClick={() => setPaymentMethod('cod')}
                disabled={!isCODEligible}
                className={cn(
                  "w-full p-4 rounded-lg border text-left flex gap-4 items-start transition-all",
                  paymentMethod === 'cod' 
                    ? "border-[#FF5B00] bg-[#FF5B00]/5" 
                    : "border-[#E8EDF2] bg-white hover:bg-[#F4F7F9]",
                  !isCODEligible && "opacity-30 cursor-not-allowed"
                )}
              >
                <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 bg-white border-gray-300">
                  {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-[#FF5B00] rounded-full" />}
                </div>
                <div>
                  <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wide leading-none mb-1">Cash On Delivery</h4>
                  <p className="text-[10px] text-[#9AA0AC] font-medium leading-normal">Inspect package contents and settle amount on delivery.</p>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('credit')}
                className={cn(
                  "w-full p-4 rounded-lg border text-left flex gap-4 items-start transition-all",
                  paymentMethod === 'credit' 
                    ? "border-[#FF5B00] bg-[#FF5B00]/5" 
                    : "border-[#E8EDF2] bg-white hover:bg-[#F4F7F9]"
                )}
              >
                <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 bg-white border-gray-300">
                  {paymentMethod === 'credit' && <div className="w-2.5 h-2.5 bg-[#FF5B00] rounded-full" />}
                </div>
                <div>
                  <h4 className="text-[11px] font-extrabold text-[#1A1A2E] uppercase tracking-wide leading-none mb-1">Online / Prepayment</h4>
                  <p className="text-[10px] text-[#9AA0AC] font-medium leading-normal">Pay securely via card, bank transfer, or digital wallet.</p>
                </div>
              </button>
            </div>

            {/* Billing totals */}
            <div className="space-y-2.5 pt-2 border-t border-[#F1F1F3]">
              <div className="flex justify-between items-center text-xs text-[#4B5563]">
                <span>Products Subtotal</span>
                <span className="font-semibold text-[#1A1A2E]">৳{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-[#4B5563]">
                <span>Seller Delivery Fee</span>
                <span className="font-semibold text-[#1A1A2E]">৳{deliveryTotal.toLocaleString()}</span>
              </div>

              {appliedPromo && (
                <div className="flex justify-between items-center text-xs text-emerald-600 font-semibold">
                  <span>Promo Discount</span>
                  <span>-৳{promoDiscount.toLocaleString()}</span>
                </div>
              )}

              {/* Promo code input section */}
              {isFeatureEnabled('enable_promo_codes') && (
              <div className="border-y border-[#F1F1F3] py-4 my-1 space-y-2">
                <span className="text-[10.5px] font-bold text-[#9AA0AC] uppercase block leading-none">Have a promo code?</span>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 h-[38px] bg-white border border-[#E5E7EB] rounded-md px-3 text-xs font-semibold text-[#1A1A2E] focus:outline-none focus:border-[#FF5B00]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 h-[38px] bg-[#1A1A2E] hover:bg-[#000435] text-white text-[11px] font-bold uppercase rounded-md transition-colors cursor-pointer border-0"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg text-[10px] font-bold">
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
              )}

              <div className="pt-3 flex justify-between items-baseline border-t border-[#F1F1F3]">
                <span className="text-xs font-bold text-[#1A1A2E]">Total ({activeCart.length} Item{activeCart.length === 1 ? '' : 's'})</span>
                <span className="text-lg font-extrabold text-[#FF5B00]">৳{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Action check button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full px-6 py-3.5 bg-[#FF5B00] hover:bg-[#E8500A] text-white text-[12.5px] font-extrabold rounded-lg transition-colors cursor-pointer border-0 flex items-center justify-center gap-1.5"
            >
              <span>PROCEED TO PAYMENT</span>
              <ArrowRight size={16} />
            </button>
            <p className="text-center text-[10.5px] text-[#9AA0AC]">Your payment details are 100% secure</p>
          </div>

          {/* Guaranteed security escrow */}
          <div className="bg-[#14161f] p-[18px] rounded-xl text-white flex gap-4 items-center">
            <ShieldCheck size={28} className="text-[#FF5B00] shrink-0" />
            <div>
              <h4 className="text-[11.5px] font-extrabold leading-none mb-1">Buyer Protection</h4>
              <p className="text-[10px] text-white/50 font-medium leading-relaxed">Purchases are escrow-backed. Sellers receive instant routing with order verification.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
