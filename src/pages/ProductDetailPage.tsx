import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Zap, ShoppingBag, ArrowRight, Bookmark, Share2, 
  Heart, CheckCircle2, MessageSquare, Info, Facebook, 
  Instagram, Youtube, Smartphone, Shirt, Gift, Users, Play, 
  Search, ShieldCheck, ChevronDown, Package, TrendingUp,
  Award, Globe, Save, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, MessageCircle, X, Calculator
} from 'lucide-react';
import { PRODUCTS, BRANDS, PLACEHOLDER_IMAGE } from '../constants';
import { useGlobalState } from '../context/GlobalStateContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { allProducts, allBrands, addToCart, mode } = useGlobalState();
  const product: any = allProducts.find((p: any) => p.id === Number(id)) || allProducts.find((p: any) => p.id === Number(id) + 1000) || allProducts[0];
  const brandObj = allBrands.find((b: any) => b.id === product.brandId);
  const brandId = brandObj ? brandObj.id : 1;
  const brandName = brandObj ? brandObj.name : 'Apex';

  const [activeTab, setActiveTab] = useState('Overview');
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [b2bQty, setB2bQty] = useState(product?.moq || 10);

  // Sync qty with state product MOQ
  React.useEffect(() => {
    if (product) {
      setB2bQty(product.moq || 1);
    }
  }, [product]);

  const getActiveUnitPrice = () => {
    if (!product.pricingTiers || product.pricingTiers.length === 0) {
      return product.price;
    }
    let activeSlab = product.pricingTiers[0];
    for (const tier of product.pricingTiers) {
      if (b2bQty >= tier.minQuantity) {
        activeSlab = tier;
      }
    }
    return activeSlab.price;
  };

  const activeUnitPrice = getActiveUnitPrice();
  const activeTotalPrice = activeUnitPrice * b2bQty;

  // Custom Quote Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteNotes, setQuoteNotes] = useState('');
  const [quoteBusinessName, setQuoteBusinessName] = useState('');

  const handleAddToCartClick = () => {
    if (mode === 'wholesale' && product.moq && b2bQty < product.moq) {
      toast.error(`Minimum order quantity is ${product.moq} units for wholesale.`);
      return;
    }
    addToCart(product, b2bQty);
    toast.success(`Added ${b2bQty} units of ${product.title} to your cart successfully!`);
  };

  const tabs = ['Overview', 'Specifications', 'About Choosify.bd', 'Influencer Reviews', 'Public Reviews', 'Comparison'];

  const heroImages = [
    product.image,
    "https://images.unsplash.com/photo-1511119253457-36e78921865c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b830c6050?w=1200&h=800&fit=crop",
  ];

  const handleNext = () => setCarouselIndex((prev) => (prev + 1) % heroImages.length);
  const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  const productSpecs = [
    { label: "Material", value: "Premium Linen Wear" },
    { label: "Category", value: product.category || "Lifestyle" },
    { label: "Fit", value: "Standard / Regular" },
    { label: "Occasion", value: "Festive Exclusive" },
    { label: "Warranty", value: "1 Year Brand Care" },
    { label: "Gender", value: "Unisex / Mens" },
  ];

  // Stock calculations
  const isOutOfStock = product.id === 3 || product.title.includes('MacBook');
  const stockQuantity = isOutOfStock ? 0 : 58;

  // Retrieve matching products for "Similar Products From Similar Brands"
  const similarProducts: any[] = allProducts.filter((p: any) => p.id !== product.id).slice(0, 3);

  const handleLoveBrand = () => {
    toast.success(`You added ${product.brand} to your Favorite Brands!`);
  };

  const handleMessageOrder = () => {
    toast.success(`Inbound chat connected. Messaging support desk for ${product.brand} ${product.title}...`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-[#050514] pt-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 italic">
          <Link to="/" className="hover:text-orange-primary transition-colors">Home</Link>
          <ArrowRight size={10} />
          <Link to="/products" className="hover:text-orange-primary transition-colors">Products</Link>
          <ArrowRight size={10} />
          <span className="text-white/60">{product.category}</span>
          <ArrowRight size={10} />
          <span className="text-orange-primary">{product.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-[#050514] pt-6 pb-24 overflow-hidden relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 md:gap-5 h-[320px] md:h-[580px] mb-12">
            {heroImages.map((img, i) => {
              const isActive = i === carouselIndex;
              
              return (
                <motion.div
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  initial={false}
                  animate={{
                    width: isActive ? (isMobile ? '100%' : '60%') : (isMobile ? '0%' : '12%'),
                    flex: isActive ? 10 : 1,
                    opacity: isActive ? 1 : 0.6,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                  className={cn(
                    "relative h-full rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer group",
                    !isActive && "hidden md:block"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="product detail banner" />
                  <div className={cn(
                     "absolute inset-0 transition-opacity duration-700",
                     isActive ? "bg-gradient-to-t from-black/40 via-transparent to-transparent" : "bg-black/20"
                  )} />
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-12 mb-16">
            <div className="flex gap-4">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={cn(
                    "h-1.5 transition-all duration-500 rounded-full",
                    carouselIndex === i ? "w-20 bg-orange-primary" : "w-3 bg-white/10 hover:bg-white/20"
                  )}
                />
              ))}
            </div>
            
            <div className="flex gap-6">
              <button 
                onClick={handlePrev} 
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90 shadow-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext} 
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90 shadow-sm"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center lg:items-end lg:flex-row justify-between gap-8 lg:gap-0">
             <div className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left w-full">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-1">BRAND / {product.category?.toUpperCase()}</span>
                   <div className="h-px w-12 bg-white/20" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-tight lg:leading-none">{product.brand} {product.title}</h1>
                
                {/* Pricing + Mandatory Stock Status near price */}
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mt-6">
                   <div className="flex flex-col items-center sm:items-start">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-3xl md:text-4xl font-black text-orange-primary italic tracking-tighter leading-none">৳ {product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xl font-bold text-white/30 line-through italic">৳{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex">
                           {[1,2,3,4,5].map(i => <Star key={i} size={14} className={cn("fill-current", i <= 4 ? "text-orange-primary" : "text-white/20")} />)}
                        </div>
                        <span className="text-white/60 text-xs font-bold italic">{product.rating} ({product.reviews || '1.5k'} reviews)</span>
                      </div>
                   </div>

                   {/* Mandatory Stock Status Placement (Green/Red) */}
                   <div className="flex items-center">
                     {isOutOfStock ? (
                       <span className="flex items-center gap-2 bg-red-500/20 px-5 py-2.5 rounded-full border border-red-500/30">
                         <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                         <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic leading-none">Out of Stock</span>
                       </span>
                     ) : (
                       <span className="flex items-center gap-2 bg-green-500/20 px-5 py-2.5 rounded-full border border-green-500/30">
                         <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                         <span className="text-[10px] font-black text-green-500 uppercase tracking-widest italic leading-none">In Stock ({stockQuantity} Units Left)</span>
                       </span>
                     )}
                   </div>

                   {product.originalPrice && (
                     <div className="bg-[#10B981] text-white px-6 py-2 rounded-xl flex flex-col items-center justify-center transform -rotate-3 shadow-xl h-fit">
                        <span className="text-xs font-black italic mb-0.5">SAVE</span>
                        <span className="text-lg font-black italic leading-none">৳{parseInt(product.originalPrice.replace(/,/g, '')) - parseInt(product.price.replace(/,/g, ''))}</span>
                     </div>
                   )}
                </div>

                {/* Hero Primary Buttons correctly updated and renamed per requirements */}
                {mode === 'retail' ? (
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                    <Link to={`/brands/${brandId}`} className="bg-orange-primary text-white text-[11px] md:text-[12px] font-black uppercase px-8 md:px-12 py-4 md:py-5 rounded-full tracking-[0.2em] shadow-2xl shadow-orange-primary/30 hover:scale-105 active:scale-95 transition-all italic border border-white/10">
                      Visit Official Website
                    </Link>
                    <button className="bg-white/10 text-white text-[11px] md:text-[12px] font-black uppercase px-6 md:px-8 py-4 md:py-5 rounded-full tracking-[0.2em] hover:bg-white/20 transition-all italic border border-white/10 flex items-center gap-2">
                      <Zap size={16} className="text-orange-primary fill-current" /> Price Alert
                    </button>
                    <button 
                      onClick={() => {
                        addToCart(product, 1);
                        toast.success(`Added ${product.title} to your Retail Cart!`);
                      }}
                      className="bg-navy text-white text-[11px] md:text-[12px] font-black uppercase px-6 md:px-8 py-4 md:py-5 rounded-full tracking-[0.2em] hover:bg-navy/80 transition-all italic border border-white/10 flex items-center gap-2"
                    >
                      <ShoppingBag size={16} className="text-orange-primary fill-current" /> Add to Retail Cart
                    </button>
                  </div>
                ) : (
                  <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 mt-8 relative overflow-hidden backdrop-blur-sm">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
                     
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-white/10">
                       <div className="text-left">
                         <span className="text-[10px] font-black text-[#FF5B00] uppercase tracking-widest italic block mb-1 text-left">B2B Wholesale Channel</span>
                         <h4 className="text-lg font-black text-white uppercase tracking-tighter italic text-left">Bulk Trade Sourcing Panel</h4>
                       </div>
                       <div className="bg-[#FF5B00]/10 border border-[#FF5B00]/30 text-[#FF5B00] text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase italic tracking-wider">
                         MOQ: {product.moq || 10} Units Enforced
                       </div>
                     </div>

                     {/* Quantity slabs layout */}
                     {product.pricingTiers && (
                       <div className="mb-6 text-left">
                         <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2 italic">Sourcing Pricing Slabs</span>
                         <div className="grid grid-cols-3 gap-3">
                           {product.pricingTiers.map((tier: any, tIdx: number) => {
                             const isCurrentSlab = b2bQty >= tier.minQuantity && 
                               (tIdx === product.pricingTiers.length - 1 || b2bQty < product.pricingTiers[tIdx + 1].minQuantity);
                             return (
                               <div 
                                 key={tIdx} 
                                 className={cn(
                                   "rounded-xl p-3 border text-center transition-all bg-white/5",
                                   isCurrentSlab ? "border-[#FF5B00] bg-[#FF5B00]/5 scale-102" : "border-white/10"
                                 )}
                               >
                                 <div className="text-[9px] font-black text-white/55">{tier.minQuantity}+ Pcs</div>
                                 <div className="text-base font-black font-mono text-orange-primary mt-1">৳{tier.price.toLocaleString()}</div>
                                 {isCurrentSlab && (
                                   <div className="text-[7px] font-black text-[#FF5B00] uppercase tracking-tighter mt-1 italic">✓ Selected</div>
                                 )}
                               </div>
                             );
                           })}
                         </div>
                       </div>
                     )}

                     {/* Interactive bulk ordering calculator with live quantity validations */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                       <div className="space-y-2 text-left">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#FFF]/40">
                           <span>Enter Order Qty:</span>
                           {product.moq && b2bQty < product.moq && (
                             <span className="text-red-500 font-bold font-mono">Below MOQ</span>
                           )}
                         </div>
                         <div className="flex items-center justify-between bg-[#0A0B1E]/60 border border-white/10 rounded-xl px-4 py-2">
                           <button 
                             type="button"
                             onClick={() => setB2bQty(Math.max(1, b2bQty - 5))}
                             className="text-white/60 hover:text-white font-black text-sm p-1"
                           >
                             -
                           </button>
                           <input 
                             type="number" 
                             value={b2bQty} 
                             onChange={(e) => setB2bQty(Math.max(1, parseInt(e.target.value) || 1))}
                             className="w-20 text-center bg-transparent border-none text-white focus:outline-none font-bold font-mono"
                           />
                           <button 
                             type="button"
                             onClick={() => setB2bQty(b2bQty + 5)}
                             className="text-white/60 hover:text-white font-black text-sm p-1"
                           >
                             +
                           </button>
                         </div>
                       </div>

                       <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center text-left">
                         <div>
                           <span className="text-[8px] font-black text-white/40 uppercase tracking-widest italic block">Calculated Total</span>
                           <span className="text-xl font-mono font-black text-white">৳{activeTotalPrice.toLocaleString()}</span>
                         </div>
                         <div className="text-right">
                           <span className="text-[8px] font-black text-white/40 uppercase tracking-widest italic block">Unit Active</span>
                           <span className="text-[11px] font-black text-orange-primary font-mono">৳{activeUnitPrice.toLocaleString()} / pc</span>
                         </div>
                       </div>
                     </div>

                     {/* Action buttons */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                       <button 
                         onClick={handleAddToCartClick}
                         className={cn(
                           "py-4 w-full rounded-xl font-black text-[12px] uppercase tracking-widest italic transition-all shadow-xl flex items-center justify-center gap-2",
                           product.moq && b2bQty < product.moq
                             ? "bg-gray-700/50 text-white/40 border border-white/5 cursor-not-allowed"
                             : "bg-[#FF5B00] text-white shadow-[#FF5B00]/20 hover:scale-[1.02] hover:brightness-110 active:scale-95"
                         )}
                         disabled={product.moq && b2bQty < product.moq}
                       >
                         <ShoppingBag size={15} /> Add to B2B Cart
                       </button>
                       <button 
                         onClick={() => setIsQuoteModalOpen(true)}
                         className="py-4 w-full bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl font-black text-[12px] uppercase tracking-widest italic transition-all flex items-center justify-center gap-2"
                       >
                         Request Business Quote
                       </button>
                     </div>

                     {/* Verification & invoice dealer details */}
                     <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-4 text-left">
                       <div>
                         <span className="text-[7.5px] font-black text-white/30 uppercase block">Invoicing</span>
                         <span className="text-[9px] font-bold text-white/70">GST / BIN Compliant</span>
                       </div>
                       <div>
                         <span className="text-[7.5px] font-black text-[#FFF]/30 uppercase block">Sample Sourcing</span>
                         <span className="text-[9px] font-bold text-[#FF5B00]">Samples Available</span>
                       </div>
                       <div>
                         <span className="text-[7.5px] font-black text-white/30 uppercase block">Audit Verification</span>
                         <span className="text-[9px] font-bold text-white/70">SGS Factory Pass</span>
                       </div>
                     </div>
                  </div>
                )}
             </div>

             <div className="flex flex-col items-end gap-8 mt-12 lg:mt-0 shadow-lg md:shadow-none">
                <div className="flex gap-4">
                   {[
                     { icon: <Save size={18}/>, label: "Save", color: "hover:text-blue-400" },
                     { icon: <Facebook size={18}/>, label: "FB", color: "hover:text-blue-600" },
                     { icon: <Instagram size={18}/>, label: "IG", color: "hover:text-pink-500" },
                     { icon: <Youtube size={18}/>, label: "YT", color: "hover:text-red-500" },
                     { icon: <Share2 size={18}/>, label: "TK", color: "hover:text-cyan-400" }
                   ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                         <div className={cn("w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 transition-all group-hover:bg-white group-hover:scale-110", item.color)}>
                            {item.icon}
                         </div>
                         <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{item.label}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Tabs Sub-Nav */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
         <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
               {tabs.map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "text-[10px] font-black uppercase tracking-[0.25em] relative h-full transition-all whitespace-nowrap",
                      activeTab === tab ? "text-navy" : "text-gray-300 hover:text-navy"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                       <motion.div 
                         layoutId="product-active-tab-indicator"
                         className="absolute bottom-0 left-0 w-full h-1 bg-orange-primary rounded-t-full" 
                       />
                    )}
                  </button>
               ))}
            </div>
            <button className="flex items-center gap-2 text-gray-400 hover:text-navy transition-colors">
               <span className="text-[10px] font-black uppercase tracking-widest">Share Now</span>
               <Share2 size={14} />
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      <main className="bg-[#F8FAFC] py-10">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8">
               
               {/* Left Column Section: Structured EXACTLY to requirement:
                   1. About Product 
                   2. Best For 
                   3. Specifications 
                   4. Stores To Buy From
               */}
               <div className="flex-1 space-y-8">
                  
                  {/* 1. About Product Grid */}
                  <section className="bg-white rounded-[32px] p-12 border border-gray-100 shadow-xl overflow-hidden relative">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                     <h2 className="text-3xl font-black text-navy italic tracking-tighter mb-8 uppercase">About Product</h2>
                     <p className="text-gray-400 font-bold leading-relaxed mb-12 italic uppercase text-[11px] tracking-wider max-w-3xl">
                        {product.description || "Premium styling with comfortable native weave materials. Recommended by style desk experts."}
                     </p>
                     
                     <div className="grid grid-cols-2 lg:grid-cols-2 gap-12 mb-12">
                        {/* Pros */}
                        <div className="space-y-6">
                           <h4 className="text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-2 italic">
                             <ThumbsUp size={16} /> WHAT WE LIKE
                           </h4>
                           <div className="space-y-4">
                             {['Premium Build Quality', 'Authentic Design Standards', 'High Wearing Longevity'].map((pro, i) => (
                               <div key={i} className="flex items-center gap-3 text-xs font-black text-navy italic">
                                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {pro}
                               </div>
                             ))}
                           </div>
                        </div>
                        {/* Cons */}
                        <div className="space-y-6">
                           <h4 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2 italic">
                             <ThumbsDown size={16} /> WHAT TO CONSIDER
                           </h4>
                           <div className="space-y-4">
                             {['Premium Pricing Strategy', 'High demand limit stock'].map((con, i) => (
                               <div key={i} className="flex items-center gap-3 text-xs font-black text-navy italic opacity-60">
                                 <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> {con}
                               </div>
                             ))}
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-gray-50">
                        {[
                          { icon: <Users className="text-blue-500" />, label: "Audience", val: "All Gender" },
                          { icon: <Shirt className="text-green-500" />, label: "Style", val: product.category || "Casual" },
                          { icon: <TrendingUp className="text-purple-500" />, label: "Trend", val: "2024 Collection" },
                          { icon: <Smartphone className="text-pink-500" />, label: "Fitting", val: "Standard" },
                          { icon: <Package className="text-orange-500" />, label: "Material", val: "Premium Verified" },
                          { icon: <Gift className="text-red-500" />, label: "Store", val: product.brand }
                        ].map((item, i) => (
                           <div key={i} className="flex items-start gap-4 group">
                              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-navy transition-all duration-300">
                                 {React.cloneElement(item.icon, { size: 22, className: "group-hover:text-white" })}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">{item.label}</span>
                                 <span className="text-xs font-black text-navy italic">{item.val}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>

                  {/* 2. Best For */}
                  <section className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-xl">
                    <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-6 italic">Best For</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Premium Buyers', 'Quality Driven Trendsetters', 'Exquisite Fashion Wear', 'Corporate Outings'].map((tag) => (
                        <div key={tag} className="px-6 py-3 bg-[#F4F9FF] border border-blue-100 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 group hover:bg-blue-600 hover:text-white transition-all cursor-default">
                          <CheckCircle2 size={12} /> {tag}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 3. Specifications Table */}
                  <section className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl" id="Specifications">
                     <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-navy italic tracking-tighter uppercase">Specifications</h3>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic font-mono">Updated June 2026</span>
                     </div>
                     <div className="p-0">
                        <table className="w-full border-separate border-spacing-0">
                           <tbody>
                              {productSpecs.map((spec, i) => (
                                 <tr key={i} className={cn(i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]")}>
                                    <td className="py-6 px-10 text-[10px] font-black text-gray-300 uppercase tracking-widest border-r border-gray-50 w-1/3 italic">{spec.label}</td>
                                    <td className="py-6 px-10 text-xs font-black text-navy italic">{spec.value}</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </section>

                  {/* 4. Stores To Buy From (Renamed from Store Comparison) */}
                  <section className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl" id="Comparison">
                     <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-navy italic tracking-tighter uppercase">Stores To Buy From</h3>
                        <span className="text-[10px] font-black text-orange-primary uppercase tracking-widest italic font-bold">{product.stores?.length || 1} Merchant Outlets</span>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="bg-gray-50">
                                 <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Store</th>
                                 <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                                 <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery</th>
                                 <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {((product.stores as any[]) || [
                                { name: 'Official Store', price: product.price, delivery: 'Fast', link: '#' }
                              ]).map((store, i) => (
                                 <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-6">
                                       <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center font-black text-navy text-[10px]">{(typeof store === 'string' ? store : store.name)?.[0] || 'S'}</div>
                                          <div className="flex flex-col">
                                             <span className="text-xs font-black text-navy italic uppercase">{typeof store === 'string' ? store : store.name}</span>
                                             <div className="flex items-center gap-1">
                                                <Star size={10} className="fill-orange-primary text-orange-primary" />
                                                <span className="text-[9px] font-black text-gray-300">{typeof store === 'string' ? '4.5' : (store.rating || '4.5')}</span>
                                             </div>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-10 py-6">
                                       <span className="text-sm font-black text-navy italic tracking-tighter">৳{typeof store === 'string' ? product.price : (store.price || product.price)}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{typeof store === 'string' ? '1-3 Days' : (store.delivery || '1-3 Days')}</span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                       <a href={typeof store === 'string' ? '#' : (store.link || '#')} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-navy text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-orange-primary transition-all italic">
                                          Go To Website
                                       </a>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </section>

               </div>

               {/* Right Side Column (Sidebar): Updated per requirements:
                   - Removed: starts from, availability, product advice card
                   - Added: Like Brand, Message to Order, View Brand Profile
                   - Moved: Physical stores below this card
               */}
               <aside className="lg:w-[380px] space-y-8">
                  {/* Brand Profile Card with added required action buttons */}
                  <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 group">
                     <div className="p-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-3xl bg-navy flex items-center justify-center p-3 shadow-2xl scale-100 group-hover:scale-110 transition-transform duration-500 mb-6">
                           <div className="text-center font-black text-3xl text-white italic tracking-tighter leading-none">{(product.brand || brandName || 'A')[0]}</div>
                        </div>
                        <h4 className="text-3xl font-black text-navy italic tracking-tighter mb-2">{product.brand}</h4>
                        <div className="flex items-center gap-2 mb-8 justify-center">
                           <div className="flex gap-0.5">
                              {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-orange-primary text-orange-primary" />)}
                           </div>
                           <span className="text-[11px] font-black text-navy/40 italic">Brand Authenticated</span>
                        </div>

                        {/* REPLACED BUTTON ELEMENTS per guidelines */}
                        <div className="space-y-3.5 w-full">
                           <button 
                             onClick={handleLoveBrand}
                             className="w-full py-5 rounded-[20px] bg-red-500 hover:bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all italic leading-none flex items-center justify-center gap-2"
                           >
                             <Heart size={14} className="fill-current" />
                             Like Brand
                           </button>
                           
                           <button 
                             onClick={handleMessageOrder}
                             className="w-full py-5 rounded-[20px] bg-[#25D366] hover:bg-green-600 text-white text-[10px] font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all italic leading-none flex items-center justify-center gap-2"
                           >
                             <MessageCircle size={14} className="fill-current" />
                             Message to Order
                           </button>
                           
                           <Link 
                             to={`/brands/${brandId}`}
                             className="w-full py-5 rounded-[20px] bg-navy text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-primary transition-all italic inline-block leading-none"
                           >
                             View Brand Profile
                           </Link>
                        </div>
                     </div>
                  </div>

                  {/* MOVED: Physical Stores section inside the sidebar below the profile card */}
                  <section className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="text-lg font-black text-navy italic tracking-tight uppercase">Physical Stores</h3>
                       <button className="text-[9px] font-black text-orange-primary uppercase tracking-widest italic hover:underline">GPS Map</button>
                    </div>
                    <div className="space-y-4">
                      {((product as any).locations || [
                        'Bashundhara City Complex, Level 5, Block B, Shop 54',
                        'Jamuna Future Park, Level 3, Zone A, Shop 122'
                      ]).map((loc: string, i: number) => (
                        <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:bg-navy hover:border-navy hover:text-white transition-all duration-300">
                          <Globe size={18} className="text-orange-primary group-hover:text-white transition-colors" />
                          <span className="text-[11px] font-black text-navy uppercase italic group-hover:text-white transition-colors leading-tight">{loc}</span>
                        </div>
                      ))}
                    </div>
                  </section>
               </aside>

            </div>
         </div>
      </main>

      {/* Influencer & Youtuber Reviews */}
      <section className="bg-[#050514] py-16 overflow-hidden relative border-y border-white/5">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
         
         <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full px-6 py-2 flex items-center gap-3 shadow-xl transform -translate-y-12">
               <Users size={16} className="text-orange-primary" />
               <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">Creator Community</span>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center mb-16">
               <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-4 uppercase leading-none">Influencer & Youtuber Reviews</h3>
               <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic mb-2">Trusted Experts Breaking Down {product.brand}</p>
            </div>

            {/* Featured Video */}
            <div className="bg-white rounded-[32px] overflow-hidden mb-12 shadow-2xl flex flex-col lg:flex-row border border-white/5 bg-white/5 backdrop-blur-xl text-navy">
               <div className="lg:w-3/5 relative group h-[400px] lg:h-auto min-h-[400px]">
                  <img 
                    src="https://images.unsplash.com/photo-1511119253457-36e78921865c?w=1200&h=800&fit=crop" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    alt="Reviewer Banner"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-8 left-8">
                     <span className="bg-orange-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic flex items-center gap-2 shadow-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> TRENDING NOW
                     </span>
                  </div>
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                     <Play size={28} className="fill-current ml-1" />
                  </button>
                  <div className="absolute bottom-10 left-10 text-white flex gap-6 items-end">
                     <div className="flex flex-col items-start">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2 italic">Creator Desk</p>
                        <h4 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-1">{product.brand} Special Edition</h4>
                      </div>
                  </div>
               </div>
               <div className="lg:w-2/5 p-12 flex flex-col justify-center bg-white relative">
                  <span className="text-[10px] font-black text-orange-primary uppercase tracking-[0.4em] mb-6 block italic px-3 py-1 border-l-2 border-orange-primary w-fit">VERIFIED EXPERT</span>
                  <h4 className="text-3xl md:text-4xl font-black text-navy italic tracking-tighter leading-tight mb-6">Why {product.brand} {product.title} stands out!</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">
                     A complete walkthrough of the texture, reliability and fitting of these luxury premium series models.
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                     <div className="flex flex-col">
                        <div className="text-xs font-black text-navy italic uppercase tracking-wider mb-1">Tech Review BD</div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dhaka Headquarters</div>
                     </div>
                     <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-white text-[10px] font-black uppercase tracking-tight shadow-xl italic">Choosify.bd</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Public Review Section */}
      <section className="bg-[#F8FAFC] py-16 border-t border-gray-100 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
            <div className="text-center mb-20 flex flex-col items-center">
               <h2 className="text-6xl font-black text-navy italic tracking-tighter mb-4 uppercase">Public Reviews</h2>
               <div className="bg-white rounded-full px-8 py-2.5 shadow-sm border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic font-mono">Actual Verified Customers</span>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full mb-20 animate-in fade-in duration-500">
               {[
                 {
                   name: "Tanvir Hasan",
                   avatar: "https://i.pravatar.cc/150?u=tanvir",
                   time: "POSTED 2 WEEKS AGO",
                   rating: "5",
                   content: `Outstanding weave texture. Simply the finest release by ${product.brand} this season. Elegant fitting with great durability!`,
                   date: "MAY 2026",
                   helpful: 124,
                   images: [product.image]
                 },
                 {
                   name: "Nusrat Jahan",
                   avatar: "https://i.pravatar.cc/150?u=nusrat",
                   time: "POSTED 1 MONTH AGO",
                   rating: "4.8",
                   content: "A beautiful design that exceeds standard expectation! Fitting was perfect.",
                   date: "APRIL 2026",
                   helpful: 89,
                   images: [product.image]
                 }
               ].map((review, i) => (
                  <div key={i} className="bg-white rounded-[60px] p-12 shadow-2xl shadow-navy/5 border border-white flex flex-col h-full">
                     <div className="flex items-start justify-between mb-10">
                        <div className="flex items-center gap-5">
                           <div className="w-16 h-16 rounded-2xl border-2 border-orange-primary/20 p-1 bg-white">
                              <img src={review.avatar} className="w-full h-full rounded-xl object-cover" alt={review.name} />
                           </div>
                           <div className="flex flex-col">
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className="text-xl font-black text-navy italic tracking-tighter uppercase">{review.name}</h4>
                                 <div className="bg-[#D1FAE5] text-[#059669] text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                    <CheckCircle2 size={10} /> VERIFIED
                                 </div>
                              </div>
                              <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">{review.time}</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end">
                           <div className="flex gap-1 mb-1">
                              {[1,2,3,4,5].map(star => (
                                 <Star key={star} size={14} className={cn("fill-current", star <= Math.floor(Number(review.rating)) ? "text-orange-primary" : "text-gray-100")} />
                              ))}
                           </div>
                           <div className="text-xl font-black text-navy italic tracking-tighter">
                              {review.rating}<span className="text-gray-300 text-xs ml-1">/ 5</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4 mb-10">
                        {review.images.map((img, idx) => (
                           <div key={idx} className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                              <img src={img} className="w-full h-full object-cover" alt="review product upload" />
                           </div>
                        ))}
                     </div>

                     <div className="bg-[#F8FAFC] rounded-[40px] p-10 relative mb-auto">
                        <MessageSquare size={32} className="absolute -top-4 -right-4 text-orange-primary/10 fill-current transform rotate-12" />
                        <p className="text-sm text-navy font-bold leading-relaxed italic tracking-tight">
                           {review.content}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* MANDATORY: "Similar Products From Similar Brands" New Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-navy italic tracking-tighter mb-3 uppercase">Similar Products From Similar Brands</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Alternate handpicked choices curated from {product.brand}'s equivalent category matches</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarProducts.map((p: any) => (
              <div 
                key={p.id} 
                onClick={() => {
                  navigate(`/products/${p.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 flex flex-col group hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <div className="aspect-square rounded-[24px] overflow-hidden mb-6 relative">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={p.title} />
                  <div className="absolute top-4 left-4 bg-navy text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest italic">{p.brand}</div>
                </div>
                <h4 className="text-xl font-black text-navy italic tracking-tight mb-2 uppercase leading-none">{p.title}</h4>
                <div className="flex items-center gap-2 mb-6">
                  {[1,2,3,4].map(star => <Star key={star} size={10} className="fill-orange-primary text-orange-primary" />)}
                  <span className="text-[9px] font-bold text-gray-400">({p.rating})</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-black text-navy italic">৳{p.price}</span>
                  <span className="px-5 py-3 bg-navy hover:bg-orange-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full transition-colors italic inline-block">Compare Now</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-[#050514] py-16 overflow-hidden relative border-t border-white/5">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex flex-col items-center mb-16">
              <div className="bg-white rounded-full px-6 py-2 flex items-center gap-3 shadow-xl mb-4">
                 <div className="w-5 h-5 bg-orange-primary rounded flex items-center justify-center p-1">
                    <Save size={14} className="text-white" />
                 </div>
                 <span className="text-[10px] font-black text-navy uppercase tracking-widest italic">Compare With Similar Products</span>
              </div>
              <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] italic">Side By Side Specs Comparison</p>
           </div>

           <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-white/5 flex flex-col md:flex-row relative z-10">
              {/* Left Labels Column */}
              <div className="md:w-1/4 p-10 flex flex-col">
                 <div className="mb-20">
                    <h4 className="text-orange-primary text-2xl font-black italic tracking-tighter uppercase mb-1">COMPARING</h4>
                    <div className="text-4xl font-black text-navy italic tracking-tighter">2 Products</div>
                 </div>
                 <div className="flex flex-col gap-14">
                    {['Price', 'Rating', 'Reviews', 'Category', 'Fitting'].map((label) => (
                       <div key={label} className="text-xl font-black text-navy/40 italic tracking-tight">{label}</div>
                    ))}
                 </div>
              </div>

              {/* Product Columns Container */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3">
                 {[
                   { 
                     name: `${product.brand} Elite Version`, 
                     brand: product.brand, 
                     price: `৳${product.price}`, 
                     rating: product.rating, 
                     reviews: product.reviews || "1.2k", 
                     category: product.category || "Lifestyle", 
                     value: "Standard", 
                     img: product.image,
                     active: true,
                     color: "bg-orange-primary"
                   },
                   { 
                     name: `${similarProducts[0]?.brand} Competitor`, 
                     brand: similarProducts[0]?.brand || "Alternative", 
                     price: `৳${similarProducts[0]?.price || "2,500"}`, 
                     rating: similarProducts[0]?.rating || "4.5", 
                     reviews: similarProducts[0]?.reviews || "85", 
                     category: similarProducts[0]?.category || "Lifestyle", 
                     value: "Standard", 
                     img: similarProducts[0]?.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
                     color: "bg-[#6366F1]"
                   },
                   { 
                     name: `${similarProducts[1]?.brand} Competitor`, 
                     brand: similarProducts[1]?.brand || "Alternative", 
                     price: `৳${similarProducts[1]?.price || "3,200"}`, 
                     rating: similarProducts[1]?.rating || "4.4", 
                     reviews: similarProducts[1]?.reviews || "110", 
                     category: similarProducts[1]?.category || "Lifestyle", 
                     value: "Standard", 
                     img: similarProducts[1]?.image || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
                     color: "bg-[#6366F1]"
                   }
                 ].map((comp, idx) => (
                    <div key={idx} className={cn("flex flex-col border-l border-gray-50 bg-[#F8FAFC]/30 group transition-all", idx === 0 && "bg-white")}>
                       <div className={cn("h-1 w-full", comp.color)} />
                       <div className="p-10 flex flex-col">
                          <div className="aspect-square rounded-[24px] overflow-hidden mb-6 border-4 border-white shadow-xl">
                             <img src={comp.img} className="w-full h-full object-cover" alt="product cover thumbnail" />
                          </div>
                          <div className="mb-8">
                             <div className="flex items-center gap-1 text-orange-primary text-[8px] font-black uppercase italic mb-1">
                                <Star size={10} className="fill-current" /> THIS PRODUCT
                             </div>
                             <h5 className="text-[13px] font-black text-navy/80 italic tracking-tight leading-tight mb-0.5">{comp.name}</h5>
                             <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{comp.brand}</div>
                          </div>

                          <div className="flex flex-col gap-12">
                             <div className="text-xl font-black text-navy italic tracking-tighter">{comp.price}</div>
                             <div className="flex items-center gap-2">
                                <span className="text-xl font-black text-navy italic tracking-tighter">{comp.rating}</span>
                                <div className="flex gap-0.5">
                                   {[1,2,3,4,5].map(s => <Star key={s} size={12} className={cn(s <= 4 ? "fill-orange-primary text-orange-primary" : "text-gray-200")} />)}
                                </div>
                             </div>
                             <div className="text-xl font-black text-navy italic tracking-tighter">{comp.reviews}</div>
                             <div className="text-xl font-black text-orange-primary italic tracking-tight">{comp.category}</div>
                             <div className="text-xl font-black text-navy italic tracking-tight">{comp.value}</div>
                          </div>

                          <button className={cn(
                            "mt-12 w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic",
                            comp.active ? "bg-orange-primary text-white shadow-xl shadow-orange-primary/20" : "bg-[#6366F1] text-white shadow-xl shadow-[#6366F1]/20 group-hover:scale-105"
                          )}>
                             {comp.active ? "Selected" : "View Details"}
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="w-full bg-[#F4F9FF] border-t border-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
             <ShieldCheck size={40} className="text-blue-600" />
           </div>
           <div className="space-y-2">
             <h4 className="text-2xl font-black text-navy italic tracking-tighter uppercase leading-none">Choosify.bd Trust Statement</h4>
             <p className="text-[14px] font-bold text-gray-400 uppercase tracking-widest italic">“Only verified sellers and unbiased brands are listed on Choosify.bd.”</p>
           </div>
        </div>
      </section>

      {/* Quote Request Popup Modal */}
      <AnimatePresence>
        {isQuoteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-navy border border-white/10 text-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
            >
              <button 
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="text-[#FF5B00]" size={24} />
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Factory Trade Quotation</h3>
              </div>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success(`Trade Request for ${b2bQty} pcs submitted! Factory manager will reach out within 2 hours.`);
                  setIsQuoteModalOpen(false);
                }} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5 text-left">Product / Offer Target</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={product?.title} 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5 text-left">Volume (Min {product?.moq || 10})</label>
                    <input 
                      type="number" 
                      required 
                      min={product?.moq || 10}
                      value={b2bQty} 
                      onChange={(e) => setB2bQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-[#050514] border border-white/15 rounded-xl px-4 py-3 text-xs text-white outline-none font-bold font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5 text-left">Active Slab Rate</label>
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-orange-primary font-black font-mono">
                      ৳{activeUnitPrice.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5 text-left">Company Trade Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Dhaka Apparel Holdings" 
                    value={quoteBusinessName} 
                    onChange={(e) => setQuoteBusinessName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FF5B00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-black uppercase tracking-widest text-[#FFF]/40 mb-1.5 text-left">Custom Sourcing Remarks</label>
                  <textarea 
                    rows={3} 
                    required 
                    placeholder="Describe custom logistics packaging or customized brand tags required..." 
                    value={quoteNotes} 
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="w-full bg-[#050514] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-orange-primary transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full h-12 bg-[#FF5B00] text-white text-[11px] font-black uppercase tracking-widest italic rounded-xl shadow-lg shadow-orange-primary/20 hover:scale-[1.02] hover:brightness-110 active:scale-95 transition-all"
                  >
                    Submit RFQ Proposal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
