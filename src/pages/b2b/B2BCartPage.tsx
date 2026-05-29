import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, ArrowLeft, ShieldCheck, CreditCard, Ship, 
  HelpCircle, CheckCircle2, ShieldAlert, Award, FileSpreadsheet
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import toast from 'react-hot-toast';

export function B2BCartPage() {
  const navigate = useNavigate();
  const { 
    wholesaleCart, 
    removeFromCart, 
    updateCartQuantity, 
    createOrder,
    clearCart
  } = useGlobalState();

  // Price calculations based on slab levels
  const calculateItemPrice = (item: any) => {
    const product = item.product;
    const slabs = product.pricingTiers || product.quantitySlabs || [];
    if (slabs.length === 0) return product.price;

    let price = product.price;
    const sortedSlabs = [...slabs].sort((a,b) => b.minQuantity - a.minQuantity);
    for (const slab of sortedSlabs) {
      if (item.quantity >= slab.minQuantity) {
        price = slab.price;
        break;
      }
    }
    return price;
  };

  const getSavingsPerUnit = (item: any) => {
    const product = item.product;
    const basePrice = product.price;
    const currentPrice = calculateItemPrice(item);
    return basePrice - currentPrice;
  };

  const cartTotal = wholesaleCart.reduce((sum, item) => {
    const price = calculateItemPrice(item);
    return sum + (price * item.quantity);
  }, 0);

  // Heavy cargo transport cost
  const deliveryFreight = wholesaleCart.length > 0 ? 1500 : 0;
  const overallTotal = cartTotal + deliveryFreight;

  const handleCheckoutSlabs = () => {
    if (wholesaleCart.length === 0) {
      toast.error('Wholesale cart is currently empty');
      return;
    }
    const orderCreated = createOrder(true); // Default to COD
    if (orderCreated) {
      toast.success('B2B Wholesale Escrow Contract Created Successfully!');
      navigate('/order-success');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-880 font-sans pb-16 selection:bg-[#FF0038] selection:text-white">
      
      {/* 1. COMPACT HEADER */}
      <div className="bg-gradient-to-br from-[#081120] via-[#0b1b33] to-[#FF0038] py-14 border-none text-white relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <button 
            onClick={() => navigate('/b2b/products')}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#FF0038] bg-[#F7F8FA] border border-slate-200 px-4 py-2.5 rounded-xl italic hover:bg-white hover:border-white hover:text-[#081120] transition-all font-bold"
          >
            <ArrowLeft size={12} /> B2B Slabs directory
          </button>
          
          <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mt-4">
            B2B Commercial Cart
          </h1>
          <p className="text-xs text-slate-200 mt-2 font-medium tracking-wide">
            Process bulk trade orders, preview active volume discounts, and manage automated warehouse consignment invoices.
          </p>
        </div>
      </div>

      {/* 2. MAIN CART GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Bulk Items - 8 cols */}
        <div className="lg:col-span-8 space-y-6">
          {wholesaleCart.length === 0 ? (
            <div className="bg-[#F7F8FA] border border-slate-200 p-16 rounded-[36px] text-center text-slate-800 shadow-sm">
              <ShoppingBag size={48} className="text-slate-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-xl font-black italic text-[#081120]">Your B2B Cart is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed font-medium">Add wholesale ready product lots from certified local manufacturers with strict volume requirements.</p>
              <button 
                onClick={() => navigate('/b2b/products')}
                className="mt-6 px-6 py-3 bg-[#FF0038] hover:bg-[#d6002f] border-none text-white rounded-xl text-xs font-black uppercase tracking-widest italic transition-all shadow-md"
              >
                Browse Slabs Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wholesaleCart.map((item) => {
                const product = item.product;
                const unitPrice = calculateItemPrice(item);
                const itemTotal = unitPrice * item.quantity;
                const savingsPerUnit = getSavingsPerUnit(item);
                const totalSavings = savingsPerUnit * item.quantity;

                return (
                  <div 
                    key={item.id}
                    className="bg-[#F7F8FA] border border-slate-200 rounded-[28px] p-6 relative overflow-hidden group hover:border-[#FF0038]/30 transition-all duration-300 shadow-sm text-slate-850"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      
                      {/* Image Thumbnail */}
                      <div className="w-24 h-24 rounded-2xl bg-white overflow-hidden border border-slate-200 shrink-0 self-center">
                        <img src={product.image} className="w-full h-full object-cover" alt="" />
                      </div>

                      {/* Detail Text Column */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#FF0038] font-mono">{product.category}</span>
                            <h4 className="font-black italic text-[#081120] text-base mt-0.5 line-clamp-1">{product.title}</h4>
                          </div>
                          
                          <button 
                            onClick={() => {
                              removeFromCart(item.id);
                              toast.success('Removed bulk lot line from cart');
                            }}
                            className="p-2 text-slate-400 hover:text-[#FF0038] transition-colors"
                            title="Remove lot Line"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Slab indicators */}
                        {totalSavings > 0 && (
                          <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-lg font-mono">
                            ✓ Volume Slab Activated (Saved ৳{totalSavings.toLocaleString()})
                          </div>
                        )}

                        {/* Pricing details math */}
                        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-200 mt-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Adjust Lot Qty:</span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => updateCartQuantity(item.id, Math.max(product.moq || 10, item.quantity - 10))}
                                className="h-7 w-8 bg-white hover:bg-[#FF0038]/10 border border-slate-200 rounded font-black text-xs text-[#081120]"
                              >
                                -
                              </button>
                              <span className="w-12 text-center text-xs font-mono font-black italic text-slate-800">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.id, item.quantity + 10)}
                                className="h-7 w-8 bg-white hover:bg-[#FF0038]/10 border border-slate-200 rounded font-black text-xs text-[#081120]"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="text-right font-sans">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block header font-sans">Active Price</span>
                            <span className="text-sm font-black text-[#081120] font-mono italic">
                              ৳{unitPrice.toLocaleString()} <span className="text-slate-400 text-[10px] font-bold font-sans">/ unit</span>
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Commercial Checkout Lock Summary - 4 cols */}
        {wholesaleCart.length > 0 && (
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#081120] border-none rounded-[32px] p-6 shadow-xl relative text-slate-200">
              <h3 className="text-lg font-black text-white italic uppercase tracking-tight border-b border-white/10 pb-3">
                Bulk Trade Settlement
              </h3>

              <div className="pt-6 space-y-3 pb-6 border-b border-white/10">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-400 font-sans">Slabs Base rate:</span>
                  <span className="text-white font-mono font-bold">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-slate-400 font-sans">Heavy flat-bed shipping:</span>
                  <span className="text-white font-mono font-bold">Official Freight (৳{deliveryFreight.toLocaleString()})</span>
                </div>
                <div className="flex justify-between items-center text-base font-black italic uppercase text-white pt-2 border-t border-white/10">
                  <span className="font-sans">Overall total budget:</span>
                  <span className="text-emerald-400 font-mono italic">৳{overallTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Guarantees checklist */}
              <div className="space-y-3.5 py-6 font-sans">
                <div className="flex gap-2.5 items-start">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <p className="text-[10px] text-slate-300 font-medium">Automated commercial slab tax compliant invoice generated.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <CheckCircle2 size={16} className="text-[#FF0038] shrink-0" />
                  <p className="text-[10px] text-slate-300 font-medium">Locked 15-day factory escrow protections standard apply.</p>
                </div>
              </div>

              <button 
                onClick={handleCheckoutSlabs}
                className="w-full h-12 bg-[#FF0038] hover:bg-[#d6002f] border-none text-white rounded-lg text-xs font-black uppercase tracking-widest italic transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                Create Escrow Settlement order
              </button>
            </div>

            <div className="bg-[#F7F8FA] border border-slate-200 p-6 rounded-[28px] space-y-3 text-center text-slate-800">
              <FileSpreadsheet size={24} className="text-[#FF0038] mx-auto" />
              <h4 className="font-black text-[#081120] italic text-xs uppercase tracking-wide">Export Commercial Quote</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-normal font-sans">Download a certified XLSX file of your current slab rates to present to corporate purchase directors.</p>
              <button 
                onClick={() => toast.success('Downloaded trade quota PDF details')}
                className="w-full h-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[9px] font-black uppercase tracking-widest italic rounded-lg transition-all mt-2"
              >
                Download Quote Sheets
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
