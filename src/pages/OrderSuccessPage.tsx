import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  User, 
  Phone, 
  Package, 
  Download, 
  CreditCard, 
  Star, 
  Gift, 
  Truck, 
  Home, 
  Store, 
  Calendar, 
  Clock, 
  Mail, 
  ShieldCheck, 
  Headphones, 
  Copy 
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

  // Pixel perfect fallback matching the ORD-12121 screenshot exactly
  const defaultOrder = {
    orderId: 'ORD-12121',
    buyerId: 'user-standard',
    isCOD: true,
    isSplit: false,
    overallTotal: 3320,
    promoDiscount: 0,
    createdAt: '2025-05-12T10:18:00.000Z',
    subOrders: [
      {
        sellerId: 'apex',
        sellerBusinessName: 'Apex',
        items: [
          {
            productId: 'apex-loafer',
            productTitle: "Apex Men's Royal Loafer",
            quantity: 1,
            price: 3200,
            size: '42',
            color: 'Blue',
            product: {
              id: 'apex-loafer',
              title: "Apex Men's Royal Loafer",
              price: 3200,
              image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
              category: 'Fashion & Lifestyle'
            }
          }
        ],
        deliveryFee: 120,
        invoiceId: 'INV-SEL-12121',
        trackingStatus: 'pending'
      }
    ],
    fullName: 'Kamal Uddin',
    phone: '+880 1712-345678',
    address: 'House 42, Road 11, Banani, Dhaka-1213',
    region: 'Dhaka, Bangladesh',
    landmark: 'Beside Banani Cafe'
  };

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

  return (
    <div className="bg-[#F5F8FD] min-h-screen text-[#111827] pb-24 font-sans text-left relative">
      
      {/* Breadcrumb line on dark navy background */}
      <div className="bg-[#050B2C] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center gap-2 text-xs text-gray-400 font-semibold border-b border-white/5">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 stroke-[3px]" />
          <span className="hover:text-white transition-colors cursor-pointer">Order Success</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 stroke-[3px]" />
          <span className="text-[#FF5B00] font-black font-mono">{orderId}</span>
        </div>
      </div>

      {/* 1. Order Success Hero */}
      <section className="bg-gradient-to-r from-[#050B2C] via-[#0E0B30] to-[#120F3B] py-14 md:py-18 text-white relative overflow-hidden shadow-sm">
        
        {/* Decorative Grid Patterns and Lights */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px] pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#FF5B00]/10 rounded-full blur-[130px] pointer-events-none -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center">
          
          {/* Centered green confirmation icon */}
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full bg-[#22C55E]/10 animate-ping duration-1000" />
              <div className="absolute w-16 h-16 rounded-full bg-[#22C55E]/20" />
              <div className="w-12 h-12 rounded-full bg-[#22C55E] flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 z-10">
                <CheckCircle2 className="w-6 h-6 stroke-[3]" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight uppercase leading-none">
            THANK YOU — YOUR ORDER IS <span className="text-[#22C55E]">CONFIRMED!</span>
          </h1>

          <p className="text-gray-300 text-sm md:text-base font-semibold max-w-2xl mx-auto leading-relaxed mb-6">
            Order <span className="text-white font-black font-mono">{orderId}</span> has been recorded. Sellers have been notified and your items will be on the way soon.
          </p>

          {/* Subtitle centered underneath */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400 font-semibold bg-black/20 backdrop-blur-md rounded-full px-6 py-2.5 w-fit mx-auto border border-white/5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{formattedDate}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-600 hidden sm:inline" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{formattedTime}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-600 hidden sm:inline" />
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF5B00]" />
              <span>We've sent a confirmation email to <span className="text-white font-bold">kamaluddin@gmail.com</span></span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Floating Order Summary Card (overlapping the hero) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-30 mb-10">
        <div className="bg-white rounded-2xl border border-[#EEF2F7] shadow-xl p-5 md:p-6.5 flex flex-col lg:flex-row items-stretch justify-between gap-6">
          
          {/* Standard Meta info Grid with equal column alignment */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 flex-1 items-center">
            
            <div className="text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm md:text-base font-black text-[#050B2C]">{orderId}</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(orderId);
                    toast.success('Order ID copied to clipboard');
                  }}
                  className="text-gray-400 hover:text-[#FF5B00] transition-colors p-0.5 cursor-pointer border-none bg-transparent"
                  title="Copy Order ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-left border-l border-[#EEF2F7] pl-4 md:pl-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order Type</p>
              <p className="text-xs md:text-sm font-black text-[#050B2C] uppercase tracking-wide">
                {activeOrder.isSplit ? 'Split Lot' : 'Retail'}
              </p>
            </div>

            <div className="text-left border-l border-[#EEF2F7] pl-4 md:pl-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order Date</p>
              <p className="text-xs md:text-sm font-black text-[#050B2C]">
                {formattedDate} • {formattedTime}
              </p>
            </div>

            <div className="text-left border-l border-[#EEF2F7] pl-4 md:pl-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Method</p>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-xs md:text-sm font-black text-[#050B2C] leading-none">
                  {activeOrder.isCOD !== false ? 'Cash on Delivery (COD)' : 'Card/MFS Paid'}
                </p>
              </div>
            </div>

            <div className="text-left border-l border-[#EEF2F7] pl-4 md:pl-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order Status</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF5B00] animate-pulse" />
                <p className="text-xs md:text-sm font-black text-[#FF5B00] uppercase tracking-wide leading-none">
                  Pending Confirmation
                </p>
              </div>
            </div>

          </div>

          {/* Points reward Box on the right */}
          <div className="bg-[#FFF8F3] border border-[#FF5B00]/15 rounded-xl p-4 flex items-center justify-between gap-4 lg:w-80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF5B00]/10 flex items-center justify-center text-[#FF5B00] shrink-0">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">You will earn</p>
                <p className="text-xs font-black text-[#050B2C] mt-1">47 Choosify Points</p>
                <p className="text-[9px] text-gray-400 font-semibold mt-0.5">once your order is delivered.</p>
              </div>
            </div>
            <Gift className="w-8 h-8 text-[#FF5B00]/25 stroke-[1.5] hidden sm:block" />
          </div>

        </div>
      </section>

      {/* 3. Main content: Two Column Layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (65%) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* DELIVERY DETAILS CARD */}
            <div className="bg-white rounded-2xl border border-[#EEF2F7] shadow-sm p-6 md:p-8 text-left">
              <div className="flex items-center justify-between border-b border-[#EEF2F7] pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF5B00]/10 flex items-center justify-center text-[#FF5B00]">
                    <MapPin className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-black uppercase text-[#050B2C] tracking-tight">
                    Delivery Details
                  </h3>
                </div>
                <button 
                  onClick={() => toast.success('Address editing context loaded')}
                  className="px-4 py-1.5 border border-[#EEF2F7] hover:border-gray-300 rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#050B2C] transition-all cursor-pointer bg-white"
                >
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                
                {/* Recipient */}
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1.5">Recipient</p>
                    <p className="text-sm font-black text-[#050B2C]">{orderFullName}</p>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1.5">Mobile Number</p>
                    <p className="text-sm font-black text-[#050B2C]">{orderPhone}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="flex gap-3 md:col-span-2 border-t border-gray-50 pt-5">
                  <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1.5">Delivery Address</p>
                    <p className="text-sm font-black text-[#050B2C] leading-relaxed whitespace-pre-line">{orderAddress}</p>
                  </div>
                </div>

                {/* Landmark */}
                <div className="flex gap-3 md:col-span-2 border-t border-gray-50 pt-5">
                  <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                    <MapPin className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-1.5">Landmark (Optional)</p>
                    <p className="text-sm font-black text-[#050B2C]">{orderLandmark}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* ITEMS & INVOICES CARD */}
            <div className="bg-white rounded-2xl border border-[#EEF2F7] shadow-sm p-6 md:p-8 text-left">
              <div className="flex items-center justify-between border-b border-[#EEF2F7] pb-4 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FF5B00]/10 flex items-center justify-center text-[#FF5B00]">
                    <Package className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-black uppercase text-[#050B2C] tracking-tight">
                    Items &amp; Invoices ({subOrdersList.length} Seller)
                  </h3>
                </div>
                <button 
                  onClick={handleDownloadInvoice}
                  className="flex items-center gap-1.5 px-4 py-1.5 border border-[#EEF2F7] hover:border-[#FF5B00] bg-white rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-600 hover:text-[#FF5B00] transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Invoice</span>
                </button>
              </div>

              <div className="space-y-6">
                {subOrdersList.map((subOrder: any, idx: number) => {
                  const subItems = subOrder.items || [];
                  const subtotalVal = subItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
                  const deliveryFeeVal = subOrder.deliveryFee || 120;
                  const lotTotalVal = subtotalVal + deliveryFeeVal;

                  return (
                    <div key={idx} className="border border-[#EEF2F7] rounded-xl overflow-hidden bg-gray-50/20">
                      
                      {/* Suborder Header bar */}
                      <div className="bg-[#F8FAFC] border-b border-[#EEF2F7] px-4.5 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="bg-white border border-gray-200 text-[#050B2C] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider leading-none">
                            Invoice #{idx + 1}
                          </span>
                          <div className="text-left">
                            <span className="text-xs font-black text-[#050B2C]">{subOrder.sellerBusinessName || 'Apex'}</span>
                            <span className="text-[10px] font-mono text-gray-400 block mt-0.5 leading-none uppercase">ID: {subOrder.invoiceId || `INV-SEL-12121`}</span>
                          </div>
                        </div>
                        <span className="bg-amber-100 text-[#FF5B00] text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider leading-none">
                          PENDING
                        </span>
                      </div>

                      {/* Item list */}
                      <div className="divide-y divide-[#EEF2F7] px-4.5">
                        {subItems.map((item: any, itemIdx: number) => (
                          <div key={itemIdx} className="py-4.5 flex items-center gap-4">
                            
                            {/* Thumbnail */}
                            <div className="w-14 h-14 bg-white border border-[#EEF2F7] rounded-lg p-1.5 overflow-hidden shrink-0 flex items-center justify-center">
                              <img 
                                src={item.product?.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop'} 
                                alt={item.productTitle} 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="text-xs font-black text-[#050B2C] uppercase truncate hover:text-[#FF5B00] transition-colors leading-snug">
                                {item.productTitle}
                              </h4>
                              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase mt-1 leading-none">
                                {item.size && <span>Size: <span className="text-gray-700">{item.size}</span></span>}
                                {item.size && item.color && <span className="w-px h-2.5 bg-gray-200" />}
                                {item.color && <span>Color: <span className="text-gray-700">{item.color}</span></span>}
                                {(item.size || item.color) && <span className="w-px h-2.5 bg-gray-200" />}
                                <span>Qty: <span className="text-gray-700">{item.quantity}</span> • ৳{item.price.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Total Cost */}
                            <div className="text-right shrink-0">
                              <p className="text-sm font-mono font-black text-[#050B2C]">৳{(item.price * item.quantity).toLocaleString()}</p>
                            </div>

                          </div>
                        ))}
                      </div>

                      {/* Lot Summary footer */}
                      <div className="bg-[#FBFDFE] border-t border-[#EEF2F7] px-4.5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider space-y-2 text-left">
                        <div className="flex justify-between items-center">
                          <span>Subtotal</span>
                          <span className="font-mono text-[#050B2C]">৳{subtotalVal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Delivery Fee</span>
                          <span className="font-mono text-[#050B2C]">৳{deliveryFeeVal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-150 pt-2 text-sm font-black text-[#050B2C]">
                          <span>Lot Total</span>
                          <span className="font-mono text-[#FF5B00]">৳{lotTotalVal.toLocaleString()}</span>
                        </div>
                      </div>

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
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Recommended Products Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-12 text-left relative">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-base font-black uppercase text-[#050B2C] tracking-tight">
              Recommended For You
            </h3>
            <p className="text-xs font-semibold text-[#6B7280] mt-1">
              Curated matches tailored to your shopping preferences
            </p>
          </div>
          <Link 
            to="/products" 
            className="text-xs font-black text-[#FF5B00] uppercase tracking-wider flex items-center gap-0.5 hover:text-[#FF5B00] transition-colors"
          >
            <span>View all recommendations</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        <div className="relative group/rec">
          <button 
            onClick={slideLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-9 h-9 rounded-full bg-white border border-[#EEF2F7] shadow-md flex items-center justify-center text-gray-700 hover:text-[#FF5B00] transition-colors z-20 cursor-pointer opacity-0 group-hover/rec:opacity-100"
            title="Slide Left"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1 scroll-smooth"
          >
            {recommendedProducts.map((prod) => (
              <div key={prod.id} className="w-[230px] shrink-0">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>

          <button 
            onClick={slideRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-9 h-9 rounded-full bg-white border border-[#EEF2F7] shadow-md flex items-center justify-center text-gray-700 hover:text-[#FF5B00] transition-colors z-20 cursor-pointer opacity-0 group-hover/rec:opacity-100"
            title="Slide Right"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </section>

      {/* 6. Support section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5B00]/10 flex items-center justify-center text-[#FF5B00] shrink-0">
              <Headphones className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-[#050B2C] tracking-tight leading-none mb-1.5">
                Need help?
              </h3>
              <p className="text-xs text-gray-400 font-bold leading-normal uppercase tracking-wide">
                Our standard live verification support team is available 24/7.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4.5">
            <button 
              onClick={() => toast.success('Redirecting to Choosify Help Center')}
              className="px-6 py-3 border border-[#EEF2F7] hover:border-gray-300 rounded-xl text-[10.5px] font-black uppercase tracking-wider text-gray-700 bg-white transition-all cursor-pointer"
            >
              Visit Help Center
            </button>
            <button 
              onClick={() => toast.success('Initializing live chat stream with support agents')}
              className="px-6 py-3 border border-[#FF5B00]/20 bg-[#FF5B00]/5 hover:bg-[#FF5B00]/10 rounded-xl text-[10.5px] font-black uppercase tracking-wider text-[#FF5B00] transition-all cursor-pointer"
            >
              Contact Support
            </button>
          </div>
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
