import React, { useState } from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight, 
  Truck, 
  Store, 
  AlertTriangle, 
  FileText,
  BadgePercent
} from 'lucide-react';
import toast from 'react-hot-toast';

export function B2BCartPage() {
  const { wholesaleCart, updateCartQuantity, removeFromCart, clearCart } = useGlobalState();
  const navigate = useNavigate();

  // B2B user information
  const [tradeLicense, setTradeLicense] = useState(localStorage.getItem('b2b_trade_license') || 'TR-2026/89412');
  const [companyName, setCompanyName] = useState(localStorage.getItem('b2b_company_name') || 'Apex Distributors Ltd');
  const [isQuotationRequest, setIsQuotationRequest] = useState(false);

  // Group items by seller
  const groupedCart = wholesaleCart.reduce((acc: { [key: string]: typeof wholesaleCart }, item) => {
    const sellerId = item.product.sellerId || 'seller-general';
    if (!acc[sellerId]) acc[sellerId] = [];
    acc[sellerId].push(item);
    return acc;
  }, {});

  const sellerIds = Object.keys(groupedCart);

  // Helper function to resolve dynamic unit price based on pricing tiers/slabs
  const getSlabPrice = (product: any, qty: number) => {
    const tiers = product.pricingTiers || product.quantitySlabs || [];
    if (!tiers || tiers.length === 0) return product.price;

    // Slabs are usually sorted by minQuantity ascending
    // Find highest slab where quantity >= minQuantity
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

  const calculateSellerSubtotal = (items: typeof wholesaleCart) => {
    return items.reduce((sum, item) => {
      const activePrice = getSlabPrice(item.product, item.quantity);
      return sum + (activePrice * item.quantity);
    }, 0);
  };

  // Base Wholesale Heavy Delivery fee: ৳500 per seller cargo truck
  const DELIVERY_FEE_PER_SELLER = 500;
  const deliveryTotal = sellerIds.length * DELIVERY_FEE_PER_SELLER;

  const subtotal = wholesaleCart.reduce((sum, item) => {
    const activePrice = getSlabPrice(item.product, item.quantity);
    return sum + (activePrice * item.quantity);
  }, 0);

  const aggregateTotal = subtotal + deliveryTotal;

  // MOQ Enforcement check
  const getMOQWarnings = () => {
    const warnings: string[] = [];
    wholesaleCart.forEach(item => {
      const moq = item.product.moq || 1;
      if (item.quantity < moq) {
        warnings.push(`"${item.product.title}" has an MOQ requirement of ${moq} units (current: ${item.quantity}).`);
      }
    });
    return warnings;
  };

  const moqWarnings = getMOQWarnings();
  const hasMOQViolations = moqWarnings.length > 0;

  const handleQtyChange = (item: any, amount: number) => {
    const newQty = item.quantity + amount;
    if (newQty <= 0) {
      removeFromCart(item.id);
    } else {
      if (item.product.stock !== undefined && newQty > item.product.stock) {
        toast.error(`Only ${item.product.stock} wholesale-lots left in stock.`);
        return;
      }
      updateCartQuantity(item.id, newQty);
    }
  };

  const handleProceedToCheckout = () => {
    if (wholesaleCart.length === 0) {
      toast.error('Your B2B Cart is empty!');
      return;
    }

    if (hasMOQViolations) {
      toast.error('Minimum Order Quantity requirements not met! Adjust volumes before proceeding.');
      return;
    }

    if (!tradeLicense.trim()) {
      toast.error('Trade License number is required for verified bulk processing!');
      return;
    }

    // Save company info
    localStorage.setItem('b2b_trade_license', tradeLicense);
    localStorage.setItem('b2b_company_name', companyName);

    navigate('/checkout', { 
      state: { 
        sourceMode: 'wholesale',
        isQuotationRequest,
        tradeLicense,
        companyName
      } 
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Hero Header */}
      <div className="w-full bg-[#050514] pt-12 pb-16 px-4 md:px-8 relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F96500]/10 via-[#050514] to-[#050514] opacity-95" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">
            <Link to="/" className="hover:text-white transition-all">Home</Link>
            <ChevronRight size={10} />
            <span className="text-orange-primary">Wholesale B2B Panel</span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic mb-2">
            Wholesale B2B <span className="text-orange-primary">Manager</span>
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Procure whole pallets, realize volume-slab price drops, and manage commercial quotation agreements.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 flex-1">
        {wholesaleCart.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-[32px] p-16 text-center shadow-sm max-w-2xl mx-auto flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-[#050514]/5 rounded-full flex items-center justify-center text-[#F96500]">
              <ShoppingBag size={40} className="animate-bounce" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-navy uppercase italic tracking-tighter mb-2">B2B Wholesale Cart is Empty</h3>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Load pallet stock lots to procure container batches</p>
            </div>
            <Link to="/products">
              <button className="bg-navy hover:bg-orange-primary text-white text-[11px] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full transition-all italic">
                Open Wholesale Marketplace
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-8">
              {/* MOQ Alarm Header if any */}
              {hasMOQViolations && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-[24px] flex items-start gap-4 text-red-700">
                  <AlertTriangle className="shrink-0 text-red-500" size={20} />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest italic mb-1">MOQ Requirements Breached</h4>
                    <p className="text-[10px] font-semibold mb-2 text-red-600 leading-relaxed">
                      One or more bulk inventory lots in this cart have not met the Minimum Order Quantity set by the seller factories:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-[9px] font-bold text-red-500/90 tracking-wide uppercase">
                      {moqWarnings.map((warn, wIdx) => <li key={wIdx}>{warn}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {/* Grouped Lots list */}
              {sellerIds.map((sellerId) => {
                const items = groupedCart[sellerId];
                const sellerName = items[0].product.brand || 'B2B Factory Partner';
                const sellerSubtotal = calculateSellerSubtotal(items);

                return (
                  <div key={sellerId} className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm transition-all hover:shadow-md">
                    {/* Factory Header */}
                    <div className="bg-navy/5 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#050514] flex items-center justify-center text-white">
                          <Store size={14} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-black text-navy uppercase tracking-widest italic">{sellerName} Group</h3>
                            <span className="text-[7.5px] bg-green-100 text-green-700 border border-green-200 uppercase font-black px-1 rounded">FACTORY VERIFIED</span>
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase">DIRECT PORT SHIPMENT • FREIGHT STAGING</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">Lot Subtotal</span>
                        <span className="text-sm font-black text-[#F96500] italic">৳{sellerSubtotal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className="divide-y divide-gray-100">
                      {items.map((item) => {
                        const product = item.product;
                        const moq = product.moq || 1;
                        const activePrice = getSlabPrice(product, item.quantity);
                        const tiers = product.pricingTiers || product.quantitySlabs || [];

                        return (
                          <div key={item.id} className="p-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                              {/* Product LOT image */}
                              <div className="w-20 h-20 bg-white border border-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                                <img src={product.image} className="w-full h-full object-contain" alt={product.title} />
                              </div>

                              {/* Lots Details */}
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start gap-2 mb-1">
                                    <Link to={`/products/${product.id}`} className="text-[13px] font-black text-navy uppercase italic tracking-tight hover:text-orange-primary transition-colors line-clamp-1">
                                      {product.title} Lot
                                    </Link>
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="text-[9px] bg-gray-100 text-navy font-black uppercase tracking-widest px-1.5 py-0.5 rounded">{product.category}</span>
                                    <span className={cn(
                                      "text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase italic",
                                      item.quantity < moq ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                                    )}>
                                      Factory MOQ: {moq} units (Selected: {item.quantity})
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-50 mt-2">
                                  {/* Volume Lot Adjuster */}
                                  <div className="flex items-center gap-1 border border-gray-100 rounded-full bg-white p-1">
                                    <button 
                                      onClick={() => handleQtyChange(item, -1)}
                                      className="w-7 h-7 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-navy transition-colors"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <span className="text-xs font-black px-4 text-navy italic">{item.quantity} units</span>
                                    <button 
                                      onClick={() => handleQtyChange(item, 1)}
                                      className="w-7 h-7 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-navy transition-colors"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  </div>

                                  {/* Price breakdowns */}
                                  <div className="text-right">
                                    <span className="text-[8.5px] font-black text-gray-400 block pb-1">
                                      LOT UNIT UNIT PRICE: <span className="text-navy">৳{activePrice.toLocaleString()}</span>
                                    </span>
                                    <span className="text-[15px] font-black text-orange-primary italic leading-none">
                                      ৳{(activePrice * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* SLAB PROGRESS VISUALIZER */}
                            {tiers.length > 0 && (
                              <div className="bg-[#F8FAFC]/70 rounded-2xl p-4 mt-4 border border-gray-100">
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-2 leading-none">Wholesale Volume Slabs Breakdown</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {tiers.map((t, tIdx) => {
                                    const nextTier = tiers[tIdx + 1];
                                    const isActive = item.quantity >= t.minQuantity && (!nextTier || item.quantity < nextTier.minQuantity);
                                    return (
                                      <div 
                                        key={tIdx} 
                                        className={cn(
                                          "p-2.5 rounded-xl border transition-all text-left",
                                          isActive 
                                            ? "bg-[#F96500]/5 border-[#F96500]/25 shadow-sm" 
                                            : "bg-white border-gray-100"
                                        )}
                                      >
                                        <div className="flex justify-between items-center mb-0.5">
                                          <span className="text-[8.5px] font-black uppercase text-navy italic">{t.minQuantity}+ units</span>
                                          {isActive && (
                                            <span className="text-[6.5px] bg-[#F96500]/15 text-[#F96500] font-black uppercase tracking-widest px-1 py-0.5 rounded italic">ACTIVE DROP</span>
                                          )}
                                        </div>
                                        <span className="text-[11px] font-black text-navy">৳{t.price.toLocaleString()}/unit</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Group Freight Delivery Breakdown */}
                    <div className="bg-[#F8FAFC]/55 border-t border-gray-100 px-6 py-4 flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest italic">
                      <Truck size={14} className="text-[#F96500]" />
                      <span>Commercial Heavy Cargo Logistics Staging (৳{DELIVERY_FEE_PER_SELLER})</span>
                    </div>
                  </div>
                );
              })}

              {/* Action utilities */}
              <div className="flex items-center justify-between pt-4">
                <Link to="/products" className="text-xs font-black text-navy hover:text-[#F96500] transition-colors uppercase tracking-widest italic flex items-center gap-1">
                  ← Return to B2B Catalog
                </Link>
                <button 
                  onClick={() => {
                    clearCart();
                    toast.success('B2B Wholesale Lot Cleared.');
                  }}
                  className="text-xs font-black text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest italic"
                >
                  Clear LOT Database
                </button>
              </div>
            </div>

            {/* B2B Commercial Sidebar Summary */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-[28px] p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-navy uppercase italic tracking-tighter border-b pb-4">Corporate Staging</h3>

                {/* Verified Trade License Input Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 leading-none">Trade License Number (Required)</label>
                    <input 
                      type="text"
                      className="w-full h-11 border border-gray-100 px-4 rounded-xl text-xs font-black text-navy uppercase focus:outline-none focus:border-[#F96500] bg-gray-50/50"
                      placeholder="e.g. TR-2026/84210"
                      value={tradeLicense}
                      onChange={(e) => setTradeLicense(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2 leading-none">Registered Company Name</label>
                    <input 
                      type="text"
                      className="w-full h-11 border border-gray-100 px-4 rounded-xl text-xs font-black text-navy focus:outline-none focus:border-[#F96500] bg-gray-50/50"
                      placeholder="e.g. Reliance Logistics BD"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Subtotals & Staging breakdown */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    <span>Corporate Base Goods</span>
                    <span className="text-navy">৳{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-start text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    <div>
                      <span>Cargo Staging Freight</span>
                      <p className="text-[8px] text-gray-300 font-bold lowercase italic tracking-normal">Grouped heavy freight cargo ({sellerIds.length} Lots)</p>
                    </div>
                    <span className="text-navy">৳{deliveryTotal.toLocaleString()}</span>
                  </div>

                  {/* Quote Checkbox */}
                  <div className="bg-navy p-4 rounded-2xl text-white space-y-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="quotation_req"
                        checked={isQuotationRequest}
                        onChange={(e) => setIsQuotationRequest(e.target.checked)}
                        className="accent-[#F96500] w-4 h-4 rounded"
                      />
                      <label htmlFor="quotation_req" className="text-[9px] font-black uppercase tracking-widest italic select-none cursor-pointer text-white">
                        Request Factory Quote First
                      </label>
                    </div>
                    <p className="text-[8px] text-white/60 font-medium leading-relaxed font-sans">
                      Check this option if your procurement team requires a pro-forma commercial invoice and payment schedule before dispatch.
                    </p>
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center font-black italic">
                    <span className="text-xs uppercase tracking-widest text-[#0A0A1F]">Grand Total</span>
                    <span className="text-2xl text-[#F96500] tracking-tight">৳{aggregateTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Proceed Checkout button */}
                <button
                  disabled={hasMOQViolations || !tradeLicense.trim()}
                  onClick={handleProceedToCheckout}
                  className="w-full h-14 bg-navy hover:bg-[#F96500] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full flex items-center justify-between px-8 shadow-lg shadow-navy/25 transition-all italic hover:scale-[1.01] active:scale-95 disabled:opacity-40"
                >
                  <span>{isQuotationRequest ? 'Request Commercial Quote' : 'Initiate Staging Order'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Secure Trust Badge */}
              <div className="bg-[#050514] p-6 border border-white/5 rounded-[24px] text-white flex gap-4 items-center">
                <ShieldCheck size={32} className="text-[#F96500] shrink-0" />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest italic leading-none mb-1">Corporate Freight Vault Protected</h4>
                  <p className="text-[8px] text-white/50 font-medium leading-relaxed">Direct manufacturer escrow protocols, bonded freight carriers, full export invoices standard across all districts.</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
