import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Star, Truck, BarChart2,
  Lock, MessageSquare, RefreshCw, Send, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { B2B_SUPPLIERS } from '../../data/b2bData';
import toast from 'react-hot-toast';

export function B2BProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allProducts, addToCart, submitRfq } = useGlobalState();

  const [quantity, setQuantity] = useState<number>(0);
  const [inquiryMsg, setInquiryMsg] = useState('');

  // Find product
  const product = allProducts.find(p => p.id === Number(id));

  // Initialize MOQ once product is loaded
  React.useEffect(() => {
    if (product) {
      setQuantity(product.moq || 10);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#081120] text-white flex flex-col items-center justify-center p-8">
        <ShoppingCart size={48} className="text-gray-500 mb-4 animate-bounce" />
        <p className="text-lg font-black italic">B2B Wholesale Product Not Found</p>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-[#FF0038] rounded-xl text-xs font-black uppercase tracking-widest italic text-white shadow-md">
          Back to B2B Catalog
        </button>
      </div>
    );
  }

  // Find connected supplier
  const supplierIdMap = product.sellerId || 'supp-2';
  // Let's link supplier by sellerId to database
  const connectedSupplier = B2B_SUPPLIERS.find(s => s.id === 'supp-2') || B2B_SUPPLIERS[1];

  // Price calculations based on selected quantity slabs
  const getApplicablePrice = (qty: number) => {
    const slabs = product.pricingTiers || product.quantitySlabs || [];
    if (slabs.length === 0) return product.price;

    let applicablePrice = product.price;
    // Sort slabs in descending order
    const sortedSlabs = [...slabs].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const slab of sortedSlabs) {
      if (qty >= slab.minQuantity) {
        applicablePrice = slab.price;
        break;
      }
    }
    return applicablePrice;
  };

  const activePrice = getApplicablePrice(quantity);
  const totalCost = activePrice * quantity;

  // Handle Add Core Bulk Order To Cart
  const handleAddToBulkCart = () => {
    const minQty = product.moq || 10;
    if (quantity < minQty) {
      toast.error(`Volumetric MOQ is strictly enforced. Minimum ${minQty} units required.`);
      return;
    }
    addToCart(product, quantity);
  };

  // Quick RFQ submitter for custom specs
  const handleCustomQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRfq({
      item: `Custom request for ${product.title}`,
      category: product.category || 'Tech & Electronics',
      quantity,
      targetPrice: activePrice,
      notes: inquiryMsg || `Required bulk freight packaging or custom labeling options.`
    });
    setInquiryMsg('');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-16 selection:bg-[#FF0038] selection:text-white">
      
      {/* 1. COMPACT CRUMB NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <button 
          onClick={() => navigate('/b2b/products')}
          className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-[#FF0038] bg-[#F7F8FA] border border-slate-200 hover:bg-[#FF0038] hover:text-white hover:border-[#FF0038] px-4 py-2.5 rounded-xl italic transition-all shadow-sm"
        >
          <ArrowLeft size={12} /> B2B Slabs Directory
        </button>
      </div>

      {/* 2. MAIN SPEC GRID */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Product Image & Factory Stats Carousel - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="aspect-square rounded-[32px] bg-[#F7F8FA] overflow-hidden border border-slate-200 relative shadow-md">
            <img src={product.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute bottom-4 left-4 right-4 bg-[#081120]/95 p-4 rounded-2xl border-none text-white">
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Escrow Protected Cargo Standard</span>
              <p className="text-xs text-slate-300 font-bold mt-1">Insured freight delivery with customs certified bill declarations.</p>
            </div>
          </div>

          {/* Slabs Detail Box */}
          {product.pricingTiers && (
            <div className="bg-[#F7F8FA] border border-slate-200 p-6 rounded-[28px] space-y-3 shadow-sm text-slate-800">
              <h3 className="font-black text-[#081120] italic text-xs uppercase tracking-wider">Volumetric Pricing Slabs</h3>
              <div className="space-y-2.5">
                {product.pricingTiers.map((tier, index) => {
                  const isActive = quantity >= tier.minQuantity;
                  return (
                    <div 
                      key={index} 
                      className={`flex justify-between items-center px-4 py-2.5 rounded-xl border transition-all ${
                        isActive 
                          ? 'bg-[#FF0038]/5 border-[#FF0038] text-[#FF0038] font-black shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-500 font-medium'
                      }`}
                    >
                      <span className="text-xs font-bold">Buy {tier.minQuantity}+ units</span>
                      <span className="text-sm font-black font-mono italic">৳{tier.price.toLocaleString()} / Unit</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Commercial Details Specs - 7 cols */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 bg-[#081120]/5 border border-[#081120]/10 text-[#081120] rounded-full text-[9px] font-black tracking-[0.2em] uppercase font-mono">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-[#081120] italic uppercase tracking-tighter leading-none">
              {product.title}
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Sourced by: <span className="text-[#FF0038] hover:underline cursor-pointer font-bold" onClick={() => navigate(`/b2b/supplier/${connectedSupplier.slug}`)}>{connectedSupplier.name}</span>
            </p>
          </div>

          {/* Description statement */}
          <div className="text-sm text-slate-650 leading-relaxed font-sans font-medium">
            {product.description}
          </div>

          {/* Interactive Escrow pricing slab tool */}
          <div className="bg-[#F7F8FA] border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm relative text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Commercial Rate</p>
                <p className="text-3xl font-black text-[#081120] font-mono italic mt-1">৳{activePrice.toLocaleString()} <span className="text-xs text-slate-400 font-bold tracking-normal font-sans">/ Unit</span></p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Volume Price (Estimate)</p>
                <p className="text-2xl font-black text-emerald-600 font-mono italic mt-1">৳{totalCost.toLocaleString()}</p>
              </div>
            </div>

            {/* Quantity Controls Input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 font-mono">
                  Enter Required Bulk Quantity (MOQ: {product.moq || 10})
                </label>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(product.moq || 10, prev - 10))}
                    className="h-10 w-12 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-black text-slate-800"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setQuantity(val);
                    }}
                    className="flex-1 h-10 bg-white border border-slate-200 rounded-lg text-center font-mono font-black italic text-slate-800 focus:outline-none focus:border-[#FF0038]"
                  />
                  <button 
                    onClick={() => setQuantity(prev => prev + 10)}
                    className="h-10 w-12 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-black text-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Instant Freight Escrow Add to Cart */}
              <div className="pt-5 md:pt-0">
                <button 
                  onClick={handleAddToBulkCart}
                  className="w-full h-12 bg-[#FF0038] hover:bg-[#d6002f] border-none text-white rounded-xl text-xs font-black uppercase tracking-widest italic transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} /> Add Lot To Freight Cart
                </button>
              </div>
            </div>
          </div>

          {/* Custom Specification Form / RFQ */}
          <div className="bg-[#081120] border-none rounded-[32px] p-6 md:p-8 space-y-4 text-white shadow-xl">
            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Request custom specifications lot</h3>
            <p className="text-xs text-slate-300 font-medium">Have customized branding tag ideas or need special certification audit reports? Submit a custom factory directive sheet below.</p>

            <form onSubmit={handleCustomQuoteSubmit} className="space-y-4">
              <textarea 
                value={inquiryMsg}
                onChange={(e) => setInquiryMsg(e.target.value)}
                rows={3}
                required
                placeholder="e.g. Combed 100% Cotton, bio-washed, custom woven label inside, individual polybag packaging..."
                className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-[#FF0038] resize-none"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-[#FF0038] border-none text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all flex items-center gap-2"
              >
                Send Custom Factory Spec <Send size={10} />
              </button>
            </form>
          </div>

          {/* Trade Assurance Safeguard Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-[#F7F8FA] border border-slate-200 rounded-2xl flex gap-3.5 items-start shadow-sm text-slate-800">
              <div className="p-2 bg-[#FF0038]/10 text-[#FF0038] rounded-xl shrink-0"><Lock size={16} /></div>
              <div>
                <h4 className="font-black text-[#081120] italic text-xs uppercase tracking-wide">Choosify Escrow Assurance</h4>
                <p className="text-[10px] text-slate-500 leading-normal font-medium mt-1">Funds are protected under 100% lock tier until freight delivery logs are signed by warehouse dispatchers.</p>
              </div>
            </div>
            <div className="p-5 bg-[#F7F8FA] border border-slate-200 rounded-2xl flex gap-3.5 items-start shadow-sm text-slate-800">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl shrink-0"><Truck size={16} /></div>
              <div>
                <h4 className="font-black text-[#081120] italic text-xs uppercase tracking-wide">Heavy cargo line routes</h4>
                <p className="text-[10px] text-slate-500 leading-normal font-medium mt-1">Fast flat-bed logistics with secure real-time tracking from plant yard directly to Dhaka, Gazipur lanes.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
