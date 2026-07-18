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
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';
import { ProductCard } from '../components/ProductCard';

export function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = (location.state as any)?.order;
  const { clearCart } = useGlobalState();

  React.useEffect(() => {
    // Clear cart after successful order display
    const timer = setTimeout(() => {
      if (typeof clearCart === 'function') clearCart();
    }, 500);
    return () => clearTimeout(timer);
  }, [clearCart]);

  const handleDownloadInvoice = () => {
    toast.success('Invoice file compiled successfully! Initializing download buffer.');
  };

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F4F7F9] items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white border border-[#E8EDF2] rounded-xl p-8 text-center shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-lg font-extrabold text-[#1A1A2E] mb-2">No order to display</h1>
          <p className="text-xs text-[#9AA0AC] mb-6">
            Place an order from checkout to see your confirmation summary here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF5B00] hover:bg-[#E8500A] text-white text-[11px] font-bold uppercase tracking-wide rounded-lg transition-colors"
          >
            <Home size={14} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const activeOrder = order || defaultOrder;
  const orderId = activeOrder.orderId;
  const orderFullName = activeOrder.fullName || defaultOrder.fullName;
  const orderPhone = activeOrder.phone || defaultOrder.phone;
  const orderAddress = activeOrder.address || defaultOrder.address;
  const orderLandmark = activeOrder.landmark || defaultOrder.landmark;

  // Formatting date and time
  const formattedDate = activeOrder.createdAt && activeOrder.createdAt !== defaultOrder.createdAt
    ? new Date(activeOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'May 12, 2025';
  
  const formattedTime = activeOrder.createdAt && activeOrder.createdAt !== defaultOrder.createdAt
    ? new Date(activeOrder.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '10:18 AM';

  // Calculate costs dynamically or fallback to exact matching sums
  const subOrdersList = activeOrder.subOrders || defaultOrder.subOrders;
  const totalProductsSubtotal = subOrdersList.reduce((acc: number, sub: any) => {
    const items = sub.items || [];
    return acc + items.reduce((itAcc: number, item: any) => itAcc + (item.price * item.quantity), 0);
  }, 0);

  const totalDeliveryFee = subOrdersList.reduce((acc: number, sub: any) => acc + (sub.deliveryFee || 0), 0);
  const platformFee = 80;
  const overallTotalPaid = totalProductsSubtotal + totalDeliveryFee + platformFee;

  // Interactive slide ref for Recommended Carousel
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Matches recommended products from screenshot
  const recommendedProducts = [
    {
      id: 201,
      title: "Apex Men's Sports Sneakers",
      price: 4200,
      originalPrice: 4900,
      rating: 4.6,
      reviews: 128,
      category: "Fashion & Lifestyle",
      categoryLabel: "FASHION",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
    },
    {
      id: 202,
      title: "Sony WH-1000XM5 Wireless Headphones",
      price: 28900,
      originalPrice: 34900,
      rating: 4.7,
      reviews: 845,
      category: "Tech & Electronics",
      categoryLabel: "ELECTRONICS",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop"
    },
    {
      id: 203,
      title: "MacBook Air M3 13-inch Laptop",
      price: 132000,
      originalPrice: 139000,
      rating: 4.8,
      reviews: 672,
      category: "Tech & Electronics",
      categoryLabel: "ELECTRONICS",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"
    },
    {
      id: 204,
      title: "Samsung Galaxy Watch 6 Classic",
      price: 25800,
      originalPrice: 29900,
      rating: 4.5,
      reviews: 310,
      category: "Tech & Electronics",
      categoryLabel: "ELECTRONICS",
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop"
    },
    {
      id: 205,
      title: "iPhone 15 Pro Max 256GB",
      price: 145000,
      originalPrice: 155000,
      rating: 4.6,
      reviews: 542,
      category: "Mobiles & Phones",
      categoryLabel: "PHONES",
      image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=400&h=400&fit=crop"
    },
    {
      id: 206,
      title: "Canon EOS R50 Mirrorless Camera",
      price: 85900,
      originalPrice: 92900,
      rating: 4.5,
      reviews: 217,
      category: "Tech & Electronics",
      categoryLabel: "ELECTRONICS",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop"
    }
  ];

  const pointsEarned = Math.max(10, Math.round(order.overallTotal / 100));

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9] pb-16">
      {/* Confirmation hero — Choosify.dc.html Order Success */}
      <div ref={heroRef} className="w-full bg-[#000435] text-white px-5 sm:px-10 pt-6 pb-10 text-center">
        <nav className="text-xs text-white/45 text-left mb-5" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#FF5B00] transition-colors">
            Home
          </Link>
          <span className="mx-1.5">›</span>
          <span>Order Success</span>
          <span className="mx-1.5">›</span>
          <span className="text-[#FF5B00]">{order.orderId}</span>
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

      <div
        id="order-success-details"
        className="max-w-[1100px] mx-auto w-full px-5 sm:px-10 -mt-[30px] relative z-[2] space-y-5"
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
            <div className="text-[13px] font-extrabold text-[#FF5B00]">{pointsEarned} Choosify Points</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
          <div className="space-y-4">
            {/* Shipping */}
            {shipping && (
              <div className="bg-white border border-[#E8EDF2] rounded-xl p-5 sm:px-6">
                <h2 className="text-xs font-extrabold text-[#1A1A2E] mb-3.5 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#FF5B00]" />
                  DELIVERY DETAILS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-6 text-left">
                  <div className="flex items-start gap-3">
                    <User size={16} className="text-[#9AA0AC] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[9.5px] font-bold text-[#9AA0AC] uppercase">Recipient</p>
                      <p className="text-[12.5px] font-semibold text-[#1A1A2E]">{shipping.fullName}</p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column (35%) */}
          <div className="space-y-6">
            
            {/* ORDER & PAYMENT SUMMARY */}
            <div className="bg-white rounded-2xl border border-[#EEF2F7] shadow-sm p-6 md:p-8 text-left">
              <h3 className="text-base font-black uppercase text-[#050B2C] tracking-tight border-b border-[#EEF2F7] pb-4 mb-5">
                Order &amp; Payment Summary
              </h3>

              <div className="space-y-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider pb-4 mb-4 border-b border-[#EEF2F7]">
                <div className="flex justify-between items-center">
                  <span>Products Subtotal</span>
                  <span className="font-mono text-[#050B2C]">৳{totalProductsSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span>Seller Delivery Fee</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[9px] cursor-pointer" title="Supplier fulfillment delivery fee">?</span>
                  </div>
                  <span className="font-mono text-[#050B2C]">৳{totalDeliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span>Platform Service Fee</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-[9px] cursor-pointer" title="Fidelity routing security charge">?</span>
                  </div>
                  <span className="font-mono text-[#050B2C]">৳{platformFee}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-5">
                <div>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider leading-none mb-1.5">Total Paid</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide leading-none">Net sum amount</p>
                </div>
                <p className="text-2xl font-mono font-black text-[#FF5B00] leading-none">
                  ৳{overallTotalPaid.toLocaleString()}
                </p>
              </div>
            </div>

            {/* SECURE PAYMENT CARD */}
            <div className="bg-[#ECFDF5] border border-emerald-500/15 rounded-xl p-4 flex items-start gap-3.5 text-left">
              <div className="w-9 h-9 rounded-lg bg-[#10B981]/15 flex items-center justify-center text-[#10B981] shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-emerald-900 tracking-tight mb-0.5 leading-none">Secure Payment</h4>
                <p className="text-[10px] text-emerald-600 font-bold leading-normal">Your payment details are 100% secure protected by SSL encryption.</p>
              </div>
            </div>

            {/* RATE ORDER CARD */}
            <div className="bg-[#050B2C] rounded-2xl p-6 text-left text-white relative overflow-hidden shadow-md">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5B00]/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2 bg-[#FF5B00]/10 border border-[#FF5B00]/20 rounded-full px-2.5 py-1 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF5B00] animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-wider text-[#FF5B00] leading-none">Love Choosify?</span>
                </div>
                <h4 className="text-sm font-black uppercase text-white tracking-tight leading-tight mb-2">
                  Rate your experience &amp; earn 20 points!
                </h4>
                <p className="text-[10px] text-gray-400 font-bold leading-normal mb-5 uppercase tracking-wide">
                  Help us optimize our verification routing algorithm.
                </p>

                <button 
                  onClick={() => {
                    toast.success('Thank you for rating! 20 points credited.');
                  }}
                  className="w-full py-3 bg-[#FF5B00] hover:bg-[#E04F00] active:scale-98 text-white text-[10.5px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  <span>Rate Order</span>
                  <Star className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Order Timeline Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="bg-white rounded-2xl border border-[#EEF2F7] shadow-sm p-6 md:p-8 text-left">
          
          <div className="flex items-center justify-between mb-8 border-b border-[#EEF2F7] pb-4">
            <div>
              <h3 className="text-base font-black uppercase text-[#050B2C] tracking-tight">
                What's Next?
              </h3>
              <p className="text-xs font-semibold text-[#6B7280] mt-1">
                We'll keep you updated at every step. Track your packages in real-time.
              </p>
            </div>
            <button 
              onClick={() => navigate('/order-tracking', { state: { order: activeOrder } })}
              className="px-4 py-1.5 border border-[#FF5B00] hover:bg-[#FF5B00]/5 bg-white rounded-lg text-[10px] font-black uppercase tracking-wider text-[#FF5B00] transition-all cursor-pointer"
            >
              Track Order
            </button>
          </div>

          {/* Stepper Grid Row */}
          <div className="relative flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4 md:pt-4">
            <div className="absolute top-[21px] left-8 right-8 h-0.5 border-t border-dashed border-gray-200 hidden md:block z-0" />
            
            {[
              {
                label: 'Order Confirmed',
                desc: 'May 12, 10:18 AM',
                status: 'completed',
                icon: CheckCircle2,
                color: 'border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E]'
              },
              {
                label: 'Seller Confirmation',
                desc: 'We will notify you',
                status: 'active',
                icon: Store,
                color: 'border-[#FF5B00] bg-[#FF5B00]/15 text-[#FF5B00]'
              },
              {
                label: 'Order Packed',
                desc: 'Soon',
                status: 'future',
                icon: Package,
                color: 'border-gray-200 bg-gray-50 text-gray-400'
              },
              {
                label: 'Out for Delivery',
                desc: 'Soon',
                status: 'future',
                icon: Truck,
                color: 'border-gray-200 bg-gray-50 text-gray-400'
              },
              {
                label: 'Delivered',
                desc: 'Estimated: May 14-16',
                status: 'future',
                icon: Home,
                color: 'border-gray-200 bg-gray-50 text-gray-400'
              }
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} className="flex md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-3 flex-1 relative z-10 w-full md:w-auto">
                  <div className={cn(
                    "w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 bg-white shadow-sm relative",
                    step.color
                  )}>
                    <StepIcon className="w-5 h-5 stroke-[2.5]" />
                    {step.status === 'active' && (
                      <span className="absolute inset-0 rounded-full border-2 border-[#FF5B00] animate-ping opacity-30 pointer-events-none" />
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      "text-[11px] font-black uppercase tracking-tight",
                      step.status === 'future' ? 'text-gray-400' : 'text-[#050B2C]'
                    )}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 leading-none tracking-wider">
                      {step.desc}
                    </p>
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
                  <Package size={14} className="text-[#FF5B00]" />
                  ITEMS &amp; INVOICES ({order.subOrders.length} SELLER{order.subOrders.length === 1 ? '' : 'S'})
                </h2>
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="text-[11px] font-bold text-[#FF5B00] bg-transparent border-0 cursor-pointer hover:underline"
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
                <CreditCard size={14} className="text-[#FF5B00]" />
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
                <span className="text-lg font-extrabold text-[#FF5B00]">{formatMoney(order.overallTotal)}</span>
              </div>
              <div className="bg-[#F0FDF4] rounded-lg px-3 py-2.5 flex items-center gap-2">
                <div className="text-[#16A34A] text-sm">🛡</div>
                <div>
                  <div className="text-[11px] font-bold text-[#16A34A]">Secure Payment</div>
                  <div className="text-[10px] text-[#16A34A]">Your payment details are 100% secure</div>
                </div>
              </div>
            </div>

            <div className="bg-[#000435] rounded-xl p-[18px] sm:px-5 text-white">
              <div className="text-xs font-extrabold mb-1.5">LOVE CHOOSIFY?</div>
              <div className="text-[11px] text-white/50 mb-3.5">Rate your experience and earn 20 points!</div>
              <button
                type="button"
                onClick={() => toast.success('Thanks! Rating will open in a future update.')}
                className="bg-[#FF5B00] hover:bg-[#E8500A] text-white border-0 px-[18px] py-2.5 rounded-lg text-[11px] font-bold cursor-pointer"
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
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E8EDF2] bg-white hover:border-[#FF5B00]/40 hover:text-[#FF5B00] text-[11px] font-bold uppercase tracking-wide text-[#1A1A2E] transition-colors"
            >
              <Home size={14} />
              Continue shopping
            </Link>
            <Link
              to="/profile/orders"
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E8EDF2] bg-white hover:border-[#FF5B00]/40 hover:text-[#FF5B00] text-[11px] font-bold uppercase tracking-wide text-[#1A1A2E] transition-colors"
            >
              <ShoppingBag size={14} />
              View my orders
            </Link>
            <button
              type="button"
              onClick={() => navigate('/order-tracking', { state: { order } })}
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-[#E8EDF2] bg-white hover:border-[#FF5B00]/40 hover:text-[#FF5B00] text-[11px] font-bold uppercase tracking-wide text-[#1A1A2E] transition-colors cursor-pointer"
            >
              <Truck size={14} />
              Track this order
            </button>
            <button
              type="button"
              onClick={() => navigate('/messages')}
              className="flex items-center justify-center gap-2 h-11 rounded-lg bg-[#FF5B00] hover:bg-[#E8500A] text-white text-[11px] font-bold uppercase tracking-wide transition-colors cursor-pointer border-0"
            >
              Contact Support
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
      </section>

      {/* Back to Home routing */}
      <div className="text-center pt-4">
        <Link to="/" className="text-xs font-black text-[#050B2C] uppercase tracking-widest hover:text-[#FF5B00] transition-all">
          ← Return to Home Shopping Stream
        </Link>
      </div>

    </div>
  );
}
