import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, FileSpreadsheet, Plus, Minus, Info, Calculator, Sparkles, Building2 } from 'lucide-react';
import { useGlobalState, CartItem } from '../context/GlobalStateContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const {
    mode,
    retailCart,
    wholesaleCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder
  } = useGlobalState();

  const [dealerCompanyName, setDealerCompanyName] = useState('Apex Distributors Ltd');
  const [dealerTaxId, setDealerTaxId] = useState('TIN-291848123');
  const [isQuotationFlow, setIsQuotationFlow] = useState(false);

  const cartItems = mode === 'retail' ? retailCart : wholesaleCart;

  // Calculates the price based on slabs for a given quantity
  const getSlabPrice = (item: CartItem) => {
    const product = item.product;
    const slabs = product.pricingTiers || product.quantitySlabs || [];
    if (slabs.length === 0) return product.price;

    let applicablePrice = product.price;
    // Sort slabs descending by minQuantity
    const sortedSlabs = [...slabs].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const slab of sortedSlabs) {
      if (item.quantity >= slab.minQuantity) {
        applicablePrice = slab.price;
        break;
      }
    }
    return applicablePrice;
  };

  // Calculates savings compared to base wholesale tier (first slab) or retail price
  const getItemBasePrice = (item: CartItem) => {
    return item.product.price;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = getSlabPrice(item);
      return acc + (price * item.quantity);
    }, 0);
  };

  const calculateOriginalSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const basePrice = getItemBasePrice(item);
      return acc + (basePrice * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const originalSubtotal = calculateOriginalSubtotal();
  const bulkSavings = originalSubtotal - subtotal;

  const handleQtyChange = (item: CartItem, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(item.id);
      return;
    }
    
    // Check MOQ limit in Wholesale Mode
    if (mode === 'wholesale') {
      const moq = item.product.moq || 10;
      if (newQty < moq) {
        toast.error(`Minimum Order Quantity (MOQ) is ${moq} units.`);
        return;
      }
    }

    updateCartQuantity(item.id, newQty);
  };

  const validateCartBeforeCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }

    if (mode === 'wholesale') {
      // Ensure all items satisfy MOQ
      for (const item of cartItems) {
        const moq = item.product.moq || 10;
        if (item.quantity < moq) {
          toast.error(`"${item.product.title}" requires a minimum of ${moq} units.`);
          return false;
        }
      }

      // Check business details
      if (!dealerCompanyName.trim() || !dealerTaxId.trim()) {
        toast.error('Dealer Business Name and Tax/TIN ID are required for B2B Wholesale checkout.');
        return false;
      }
    }

    return true;
  };

  const handleCheckout = () => {
    onClose();
    if (mode === 'retail') {
      navigate('/cart/retail');
    } else {
      navigate('/cart/b2b');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white text-navy z-50 flex flex-col shadow-2xl overflow-hidden border-l border-gray-100"
          >
            {/* Header */}
            <div className={cn(
              "p-6 flex items-center justify-between border-b text-white",
              mode === 'wholesale' ? "bg-navy" : "bg-orange-primary"
            )}>
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 animate-pulse" />
                <div>
                  <h3 className="text-lg font-black uppercase italic tracking-tight">
                    {mode === 'retail' ? 'Retail Cart' : 'B2B Wholesale Portal'}
                  </h3>
                  <p className="text-[9px] uppercase tracking-widest text-white/70 font-bold italic">
                    {mode === 'retail' ? 'Standard Personal Checkout' : 'Business Tiered Freight Invoicing'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mode Indicator & Switcher */}
            <div className="bg-[#F8FAFC] px-6 py-3 flex items-center justify-between border-b border-gray-100 text-[10px] font-black uppercase tracking-widest italic">
              <span className="text-gray-400">Current Order Stream:</span>
              <span className={cn(
                "px-3 py-1 rounded-full text-white",
                mode === 'retail' ? "bg-orange-primary" : "bg-navy"
               )}>
                ● {mode === 'retail' ? 'Retail' : 'Wholesale Mode Active'}
              </span>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cartItems.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center gap-4 text-gray-300">
                  <ShoppingBag size={48} className="stroke-1" />
                  <div className="text-xs font-black uppercase tracking-widest italic">
                    You have no items in your {mode === 'retail' ? 'Retail' : 'Wholesale'} cart.
                  </div>
                  {mode === 'wholesale' && (
                    <p className="text-[10px] max-w-xs leading-relaxed font-bold">
                      Add authorized B2B items from the products lineup to configure price slabs and execute distributor requests.
                    </p>
                  )}
                </div>
              ) : (
                cartItems.map((item) => {
                  const product = item.product;
                  const itemPrice = getSlabPrice(item);
                  const isWholesaleItem = mode === 'wholesale' && product.moq;
                  const moq = product.moq || 10;
                  
                  return (
                    <div 
                      key={item.id} 
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 hover:bg-white hover:shadow-lg transition-all duration-300"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center p-2">
                        <img src={product.image} className="w-full h-full object-contain" alt={product.title} />
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h4 className="text-xs font-black text-navy uppercase italic tracking-tight line-clamp-1">
                              {product.title}
                            </h4>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{product.brand || 'Apex'}</span>
                            {isWholesaleItem && (
                              <span className="bg-navy/10 text-navy text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter italic">
                                MOQ {moq} Units
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tiered Price Slabs Badge Overlay */}
                        {isWholesaleItem && product.pricingTiers && (
                          <div className="bg-[#E0F2FE] border border-blue-100 p-2 rounded-lg mb-3">
                            <div className="flex items-center justify-between text-[8px] font-black text-blue-700 uppercase tracking-widest mb-1 italic">
                              <span className="flex items-center gap-1"><Calculator size={10} /> Active Tier Slabs:</span>
                              <span>Save with larger loads</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-[8px] font-mono font-bold text-blue-500">
                              {product.pricingTiers.map((t: any, idx: number) => {
                                const isActive = item.quantity >= t.minQuantity && 
                                  (idx === product.pricingTiers.length - 1 || item.quantity < product.pricingTiers[idx + 1].minQuantity);
                                return (
                                  <div 
                                    key={idx} 
                                    className={cn(
                                      "p-1 rounded text-center border transition-all",
                                      isActive ? "bg-blue-600 text-white border-blue-600 font-extrabold shadow-sm scale-105" : "bg-white border-blue-50/55"
                                    )}
                                  >
                                    Qty {t.minQuantity}+: ৳{t.price}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="flex items-end justify-between gap-4">
                          {/* Quantity selector */}
                          <div className="flex items-center gap-1 border border-gray-100 rounded-full bg-white p-1">
                            <button 
                              onClick={() => handleQtyChange(item, item.quantity - 1)}
                              className="w-6 h-6 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-500"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="text-xs font-black px-3 text-navy italic">{item.quantity}</span>
                            <button 
                              onClick={() => handleQtyChange(item, item.quantity + 1)}
                              className="w-6 h-6 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-500"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          {/* Dynamic price */}
                          <div className="text-right">
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest block leading-none mb-1">UNIT PRICE</span>
                            <span className="text-[13px] font-black text-orange-primary italic leading-none">৳{itemPrice.toLocaleString()}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })
              )}

              {/* Wholesale Dealer Business Information Section */}
              {mode === 'wholesale' && cartItems.length > 0 && (
                <div className="p-5 bg-navy/5 rounded-[24px] border border-navy/10 space-y-4">
                  <div className="flex items-center gap-2 mb-2 text-navy">
                    <Building2 size={16} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest italic">Authorized Dealer Credentials</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Company / Business Name *</label>
                      <input 
                        type="text" 
                        value={dealerCompanyName}
                        onChange={(e) => setDealerCompanyName(e.target.value)}
                        className="w-full h-10 px-3 bg-white text-xs font-bold rounded-xl border border-gray-200 focus:outline-none focus:border-navy text-navy focus:ring-1 focus:ring-navy" 
                        placeholder="e.g. Apex Outlets Corp."
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Tax/Trade License Number (TIN/BIN) *</label>
                      <input 
                        type="text" 
                        value={dealerTaxId}
                        onChange={(e) => setDealerTaxId(e.target.value)}
                        className="w-full h-10 px-3 bg-white text-xs font-bold rounded-xl border border-gray-200 focus:outline-none focus:border-navy text-navy focus:ring-1 focus:ring-navy" 
                        placeholder="e.g. BIN-291848123"
                      />
                    </div>
                  </div>

                  {/* Dynamic B2B Switch options: Standard Credit Inbound Order vs PDF Request Inquiry Proposal */}
                  <div className="pt-3 border-t border-navy/10 flex items-center justify-between">
                    <span className="text-[9px] font-black text-navy uppercase tracking-widest italic">Order Routing Protocol:</span>
                    <div className="flex bg-white border border-gray-200 rounded-lg p-0.5">
                      <button 
                        onClick={() => setIsQuotationFlow(false)}
                        className={cn(
                          "px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-tight",
                          !isQuotationFlow ? "bg-navy text-white" : "text-gray-400 hover:text-navy"
                        )}
                      >
                        Book Dispatch
                      </button>
                      <button 
                        onClick={() => setIsQuotationFlow(true)}
                        className={cn(
                          "px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-tight flex items-center gap-1",
                          isQuotationFlow ? "bg-navy text-white text-orange-primary" : "text-gray-400 hover:text-navy"
                        )}
                      >
                        <FileSpreadsheet size={10} /> Get Quote
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary Container */}
            {cartItems.length > 0 && (
              <div className="bg-[#F8FAFC] border-t border-gray-100 p-6 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
                {/* Math breakdown */}
                <div className="space-y-2">
                  {mode === 'wholesale' && bulkSavings > 0 && (
                    <div className="flex justify-between items-center bg-green-50 px-4 py-2 rounded-lg text-green-700 text-[9px] font-black uppercase tracking-widest italic">
                      <span className="flex items-center gap-1"><Sparkles size={12} /> B2B Slabs Applied Savings:</span>
                      <span>-৳{bulkSavings.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    <span>Invoiced Subtotal</span>
                    <span className={cn(bulkSavings > 0 && "line-through")}>৳{originalSubtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center text-navy font-black italic">
                    <span className="text-[12px] uppercase tracking-widest">Aggregate Total</span>
                    <span className="text-xl tracking-tight text-orange-primary leading-none">৳{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="text-[8px] font-bold text-gray-400 leading-tight text-right">
                    {mode === 'retail' 
                      ? 'Local fast parcel delivery and taxes calculated at dispatch.' 
                      : 'B2B Cargo freight charges are integrated statically into seller master invoice.'}
                  </div>
                </div>

                {/* Confirm Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className={cn(
                    "w-full h-14 rounded-2xl flex items-center justify-between px-8 text-[11px] font-black uppercase tracking-[0.2em] italic shadow-xl transition-all cursor-pointer hover:scale-[1.01] active:scale-95 text-white",
                    mode === 'wholesale' 
                      ? isQuotationFlow 
                        ? "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700" 
                        : "bg-navy shadow-navy/20 hover:bg-orange-primary"
                      : "bg-orange-primary shadow-orange-primary/20 hover:bg-navy"
                  )}
                >
                  <span>
                    {mode === 'retail' 
                      ? 'Proceed to Order' 
                      : isQuotationFlow ? 'Transmit Quotation Inquiry' : 'Place Wholesale Order'}
                  </span>
                  <ArrowRight size={18} className="animate-bounce" />
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
