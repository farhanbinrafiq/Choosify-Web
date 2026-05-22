import React from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, ChevronRight, Truck, Store, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function RetailCartPage() {
  const { retailCart, updateCartQuantity, removeFromCart, clearCart } = useGlobalState();
  const navigate = useNavigate();

  // Group items by seller
  const groupedCart = retailCart.reduce((acc: { [key: string]: typeof retailCart }, item) => {
    const sellerId = item.product.sellerId || 'seller-general';
    if (!acc[sellerId]) acc[sellerId] = [];
    acc[sellerId].push(item);
    return acc;
  }, {});

  const sellerIds = Object.keys(groupedCart);

  const calculateSellerSubtotal = (items: typeof retailCart) => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  // Base Delivery fee: ৳120 per seller as they are separate deliveries and packages
  const DELIVERY_FEE_PER_SELLER = 120;
  const deliveryTotal = sellerIds.length * DELIVERY_FEE_PER_SELLER;

  const subtotal = retailCart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const aggregateTotal = subtotal + deliveryTotal;

  // COD is eligible for retail orders under ৳150,000
  const isCODEligible = aggregateTotal < 150000;

  const handleQtyChange = (item: any, amount: number) => {
    const newQty = item.quantity + amount;
    if (newQty <= 0) {
      removeFromCart(item.id);
    } else {
      if (item.product.stock !== undefined && newQty > item.product.stock) {
        toast.error(`Only ${item.product.stock} units currently in stock for ${item.product.title}`);
        return;
      }
      updateCartQuantity(item.id, newQty);
    }
  };

  const handleProceedToCheckout = () => {
    if (retailCart.length === 0) {
      toast.error('Your Retail Cart is empty!');
      return;
    }

    // Verify stock before checkout
    for (const item of retailCart) {
      if (item.product.stock === 0) {
        toast.error(`"${item.product.title}" is out of stock! Please remove before checkout.`);
        return;
      }
    }

    navigate('/checkout', { state: { sourceMode: 'retail' } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Hero Header */}
      <div className="w-full bg-[#0A0B1E] pt-12 pb-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-primary/10 via-[#0A0A1F] to-[#0A0A1F] opacity-90" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-white transition-all">Home</Link>
            <ChevronRight size={10} />
            <span className="text-orange-primary">Shopping Cart</span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-2">
            Retail Shopping <span className="text-orange-primary">Cart</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Manage your retail items, compute grouped seller-level delivery, and checkout securely.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 flex-1">
        {retailCart.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[32px] p-16 text-center shadow-sm max-w-2xl mx-auto flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-orange-primary/5 rounded-full flex items-center justify-center text-orange-primary">
              <ShoppingBag size={40} className="animate-bounce" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-navy uppercase italic tracking-tighter mb-2">Your Retail Cart Is Empty</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Add personal items to start checking out</p>
            </div>
            <Link to="/products">
              <button className="bg-navy hover:bg-orange-primary text-white text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all italic">
                Return To Catalog
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-8">
              {sellerIds.map((sellerId) => {
                const items = groupedCart[sellerId];
                const sellerName = items[0].product.brand || 'General Vendor';
                const sellerSubtotal = calculateSellerSubtotal(items);

                return (
                  <div key={sellerId} className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm transition-all hover:shadow-md">
                    {/* Seller Header Section */}
                    <div className="bg-navy/5 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white">
                          <Store size={14} />
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-navy uppercase tracking-widest italic">{sellerName} Outlet</h3>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">Fulfillment Stream • Dhaka Warehouse</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Seller Subtotal</span>
                        <span className="text-sm font-black text-navy italic">৳{sellerSubtotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Group Items */}
                    <div className="divide-y divide-gray-100">
                      {items.map((item) => {
                        const product = item.product;
                        const itemPrice = product.price;
                        const isStockAvailable = product.stock === undefined || product.stock > 0;

                        return (
                          <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50/50 transition-all">
                            {/* Product Image */}
                            <div className="w-20 h-20 bg-white border border-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                              <img src={product.image} className="w-full h-full object-contain" alt={product.title} />
                            </div>

                            {/* Content info */}
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start gap-2 mb-1">
                                  <Link to={`/products/${product.id}`} className="text-[13px] font-black text-navy uppercase italic tracking-tight hover:text-orange-primary transition-colors line-clamp-1">
                                    {product.title}
                                  </Link>
                                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{product.category}</span>
                                  {product.stock !== undefined && (
                                    <span className={cn(
                                      "text-[8px] font-black px-2 py-0.5 rounded uppercase italic",
                                      product.stock === 0 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-600"
                                    )}>
                                      {product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} Left`}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-4 pt-2">
                                {/* Quantity Toggles */}
                                <div className="flex items-center gap-1 border border-gray-100 rounded-full bg-white p-1">
                                  <button 
                                    onClick={() => handleQtyChange(item, -1)}
                                    className="w-7 h-7 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-navy transition-colors"
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="text-xs font-black px-3 text-navy italic">{item.quantity}</span>
                                  <button 
                                    disabled={product.stock !== undefined && item.quantity >= product.stock}
                                    onClick={() => handleQtyChange(item, 1)}
                                    className="w-7 h-7 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-navy transition-colors disabled:opacity-30"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>

                                {/* Extended Price */}
                                <div className="text-right">
                                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest block leading-none mb-1">EXT. TOTAL</span>
                                  <span className="text-[14px] font-black text-orange-primary italic">৳{(itemPrice * item.quantity).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Group Delivery Breakdown */}
                    <div className="bg-[#F8FAFC]/55 border-t border-gray-100 px-6 py-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                      <Truck size={14} className="text-navy" />
                      <span>Delivery Option: Paperfly Dispatch (৳{DELIVERY_FEE_PER_SELLER})</span>
                    </div>
                  </div>
                );
              })}

              {/* Action utilities */}
              <div className="flex items-center justify-between pt-4">
                <Link to="/products" className="text-xs font-black text-navy hover:text-orange-primary transition-colors uppercase tracking-widest italic flex items-center gap-1">
                  ← Continue Shopping
                </Link>
                <button 
                  onClick={() => {
                    clearCart();
                    toast.success('Retail Cart Cleared successfully.');
                  }}
                  className="text-xs font-black text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest italic"
                >
                  Clear Entire Cart
                </button>
              </div>
            </div>

            {/* Sidebar Summary Card */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[28px] p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-navy uppercase italic tracking-tighter border-b pb-4">Order Summary</h3>

                {/* Subtotals & Fees */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    <span>Retail Card Subtotal</span>
                    <span className="text-navy">৳{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-start text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    <div>
                      <span>Parcel Freight Shipping</span>
                      <p className="text-[8px] text-gray-300 font-bold lowercase italic tracking-normal">Grouped per seller ({sellerIds.length} Packages)</p>
                    </div>
                    <span className="text-navy">৳{deliveryTotal.toLocaleString()}</span>
                  </div>

                  {/* Cash on Delivery Eligibility */}
                  <div className={cn(
                    "flex items-start gap-3 p-4 rounded-2xl border text-[9px] font-black uppercase tracking-wider italic",
                    isCODEligible ? "bg-green-50/50 border-green-100 text-green-700" : "bg-red-50/50 border-red-100 text-red-600"
                  )}>
                    {isCODEligible ? (
                      <>
                        <ShieldCheck size={18} className="shrink-0 text-green-600" />
                        <div>
                          <span>COD Eligible</span>
                          <p className="text-[7.5px] font-bold text-green-500/80 tracking-normal lowercase italic">This checkout qualifies for Cash on Delivery support.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={18} className="shrink-0 text-red-500" />
                        <div>
                          <span>COD High Value Limit Exceeded</span>
                          <p className="text-[7.5px] font-bold text-red-500/80 tracking-normal lowercase italic">Orders over ৳150,000 require business prepayment or manual confirmation.</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center font-black italic">
                    <span className="text-xs uppercase tracking-widest text-[#0A0A1F]">Grand Total</span>
                    <span className="text-2xl text-orange-primary tracking-tight">৳{aggregateTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Proceed Checkout button */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full h-14 bg-orange-primary hover:bg-navy text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full flex items-center justify-between px-8 shadow-lg shadow-orange-primary/10 transition-all italic hover:scale-[1.01] active:scale-95"
                >
                  <span>Checkout Retail Cart</span>
                  <ArrowRight size={16} />
                </button>

                <p className="text-[8.5px] font-bold text-gray-400 leading-relaxed text-center italic">
                  Complete local fast parcel service. Standard NID-verification is pre-configured on checkouts for safety.
                </p>
              </div>

              {/* Secure Trust Badge */}
              <div className="bg-navy p-6 rounded-[24px] text-white flex gap-4 items-center">
                <ShieldCheck size={32} className="text-orange-primary shrink-0" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest italic leading-none mb-1">Shoosify.bd Secure Guaranteed</h4>
                  <p className="text-[8px] text-white/60 font-medium leading-relaxed">Verified suppliers, active disputes monitors, secure Cash-on-Delivery logistics protocols nationwide.</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
