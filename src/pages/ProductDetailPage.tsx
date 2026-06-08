import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Zap, ShoppingBag, ArrowRight, Bookmark, Share2, 
  Heart, CheckCircle2, MessageSquare, Info, Facebook, 
  Instagram, Youtube, Smartphone, Shirt, Gift, Users, Play, 
  Search, ShieldCheck, ChevronDown, Package, TrendingUp,
  Award, Globe, Save, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, MessageCircle, X, Calculator, Tag
} from 'lucide-react';
import { PRODUCTS, BRANDS, PLACEHOLDER_IMAGE } from '../constants';
import { useGlobalState } from '../context/GlobalStateContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';
import { ProductMediaGallery } from '../components/ProductMediaGallery';

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

  const [activeTab, setActiveTab ] = useState('Overview');
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [b2bQty, setB2bQty] = useState(product?.moq || 10);

  // Variant support state hooks
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedRam, setSelectedRam] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState<boolean>(false);

  // Sync state options when product changes
  React.useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      // Auto select first entry that is in stock, or just first entry
      const firstAvailable = product.variants.find((v: any) => v.stock > 0) || product.variants[0];
      if (firstAvailable) {
        if (firstAvailable.attributes.color !== undefined) setSelectedColor(firstAvailable.attributes.color);
        if (firstAvailable.attributes.size !== undefined) setSelectedSize(firstAvailable.attributes.size);
        if (firstAvailable.attributes.ram !== undefined) setSelectedRam(firstAvailable.attributes.ram);
        if (firstAvailable.attributes.storage !== undefined) setSelectedStorage(firstAvailable.attributes.storage);
      }
    } else {
      setSelectedColor('');
      setSelectedSize('');
      setSelectedRam('');
      setSelectedStorage('');
    }
  }, [product]);

  const getSelectedVariant = () => {
    if (!product || !product.variants || product.variants.length === 0) return null;
    return product.variants.find((v: any) => {
      const hasColor = v.attributes.color !== undefined;
      const hasSize = v.attributes.size !== undefined;
      const hasRam = v.attributes.ram !== undefined;
      const hasStorage = v.attributes.storage !== undefined;

      if (hasColor && v.attributes.color !== selectedColor) return false;
      if (hasSize && v.attributes.size !== selectedSize) return false;
      if (hasRam && v.attributes.ram !== selectedRam) return false;
      if (hasStorage && v.attributes.storage !== selectedStorage) return false;
      return true;
    });
  };

  const selectedVariant = getSelectedVariant();

  // Reset active image index to 0 when variant changes
  React.useEffect(() => {
    if (selectedVariant?.image) {
      setCarouselIndex(0);
    }
  }, [selectedVariant?.image]);

  // Unique attribute variants computation
  const uniqueColors = product.variants 
    ? Array.from(new Set(product.variants.map((v: any) => v.attributes.color).filter(Boolean))) as string[]
    : [];

  const uniqueSizes = product.variants 
    ? Array.from(new Set(product.variants.map((v: any) => v.attributes.size).filter(Boolean))) as string[]
    : [];

  const uniqueRams = product.variants 
    ? Array.from(new Set(product.variants.map((v: any) => v.attributes.ram).filter(Boolean))) as string[]
    : [];

  const uniqueStorages = product.variants 
    ? Array.from(new Set(product.variants.map((v: any) => v.attributes.storage).filter(Boolean))) as string[]
    : [];

  // Availability lookup helpers for disabled states
  const isSizeOptionAvailable = (size: string) => {
    if (!product.variants) return true;
    return product.variants.some((v: any) => 
      v.attributes.size === size && 
      (!selectedColor || v.attributes.color === selectedColor) &&
      v.stock > 0
    );
  };

  const isColorOptionAvailable = (color: string) => {
    if (!product.variants) return true;
    return product.variants.some((v: any) => 
      v.attributes.color === color && 
      (!selectedSize || v.attributes.size === selectedSize) &&
      v.stock > 0
    );
  };

  const isRamOptionAvailable = (ram: string) => {
    if (!product.variants) return true;
    return product.variants.some((v: any) => 
      v.attributes.ram === ram && 
      (!selectedStorage || v.attributes.storage === selectedStorage) &&
      v.stock > 0
    );
  };

  const isStorageOptionAvailable = (storage: string) => {
    if (!product.variants) return true;
    return product.variants.some((v: any) => 
      v.attributes.storage === storage && 
      (!selectedRam || v.attributes.ram === selectedRam) &&
      v.stock > 0
    );
  };

  const getColorHexClass = (colorName: string) => {
    const norm = colorName.toLowerCase();
    if (norm.includes('gray') || norm.includes('grey')) return 'bg-gray-400';
    if (norm.includes('yellow') || norm.includes('gold')) return 'bg-yellow-400';
    if (norm.includes('violet') || norm.includes('purple')) return 'bg-purple-500';
    if (norm.includes('black')) return 'bg-gray-900';
    if (norm.includes('white')) return 'bg-white border border-gray-300';
    if (norm.includes('silver') || norm.includes('platinum')) return 'bg-slate-300';
    if (norm.includes('blue')) return 'bg-blue-600';
    if (norm.includes('red') || norm.includes('crimson')) return 'bg-red-500';
    if (norm.includes('lime') || norm.includes('green')) return 'bg-lime-400';
    return 'bg-amber-600';
  };

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

  const tabs = ['Overview', 'Specifications', 'About Choosify.bd', 'Influencer Reviews', 'Comparison'];

  const productSpecs = [
    { label: "Material", value: "Premium Linen Wear" },
    { label: "Category", value: product.category || "Lifestyle" },
    { label: "Fit", value: "Standard / Regular" },
    { label: "Occasion", value: "Festive Exclusive" },
    { label: "Warranty", value: "1 Year Brand Care" },
    { label: "Gender", value: "Unisex / Mens" },
  ];

  // Stock calculations
  const isOutOfStock = product.variants && product.variants.length > 0
    ? (selectedVariant ? selectedVariant.stock === 0 : true)
    : (product.id === 3 || product.title.includes('MacBook') || product.stock === 0);

  const stockQuantity = product.variants && product.variants.length > 0
    ? (selectedVariant ? selectedVariant.stock : 0)
    : (isOutOfStock ? 0 : 58);

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
      <section className="bg-[#1a1d4e] pt-4 pb-8 overflow-y-auto relative border-b border-white/5" style={{ height: '900px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-full max-w-4xl mx-auto mb-6">
            <ProductMediaGallery product={product} selectedVariantImage={selectedVariant?.image} />
          </div>

          <div className="w-full max-w-4xl mx-auto text-left text-white relative mt-6 bg-transparent p-0 border-none shadow-none">
             <div className="relative">
                {/* Row 1: Brand / Category and Reviews/Stock status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-[0.25em] block font-sans">
                         {product.brand?.toUpperCase()} . {product.category?.toUpperCase()}
                      </span>
                   </div>
                   
                   <div className="flex flex-col sm:items-end gap-1.5 shrink-0 sm:text-right">
                     <div className="flex items-center gap-2 text-white/80">
                       <div className="flex text-[#FF6B00] gap-0.5">
                         {[1,2,3,4,5].map(i => (
                           <Star key={i} size={11} className={cn("fill-current", i <= Math.floor(product.rating || 4) ? "text-[#FF6B00]" : "text-white/20")} />
                         ))}
                       </div>
                       <span className="text-[11px] font-bold text-white/70 font-sans leading-none">{product.rating} &nbsp;({product.reviews || 840} reviews)</span>
                     </div>
                     <div>
                       {isOutOfStock ? (
                         <span className="inline-flex items-center h-6 px-3 bg-red-500/10 rounded-full border border-red-500/30">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                           <span className="text-[8.5px] font-black text-red-400 uppercase tracking-widest italic ml-1.5">Out of Stock</span>
                         </span>
                       ) : (
                         <span className="inline-flex items-center h-6 px-3 bg-[#1100FF]/80 text-white rounded-full text-[8.5px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(17,0,255,0.4)] border border-white/10">
                           IN STOCK: {stockQuantity} UNITS LEFT
                         </span>
                       )}
                     </div>
                   </div>
                </div>

                {/* Row 2: Title */}
                <h1 className="text-[30px] font-sans font-black text-white tracking-tighter leading-[0.95] uppercase mb-2 text-left" style={{ fontSize: '30px' }}>
                  {product.title}
                </h1>

                {/* Row 3: Price Display & Quick controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-white/10 pb-4">
                  <div className="text-[25px] font-extrabold text-[#FF6B00] italic uppercase tracking-tight font-sans leading-none" style={{ fontSize: '25px' }}>
                    BDT - {product.price}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => toast.success("Self-price tracking alert scheduled!")}
                      className="h-10 px-5 border border-white/30 hover:bg-white/5 hover:border-white/50 text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center bg-transparent"
                    >
                      PRICE ALERT
                    </button>
                    <button 
                      onClick={() => setIsQuoteModalOpen(true)}
                      className="h-10 px-5 border border-white/30 hover:bg-white/5 hover:border-white/50 text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center bg-transparent"
                    >
                      GET FACTORY QUOTE
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied directly to clipboard!");
                      }}
                      className="w-10 h-10 rounded-full bg-white hover:bg-white/90 text-[#120713] flex items-center justify-center transition-all shadow-md"
                      title="Share link"
                    >
                      <Share2 size={15} />
                    </button>
                    <button 
                      onClick={() => toast.success("Product bookmarked!")}
                      className="w-10 h-10 rounded-full bg-white hover:bg-white/95 text-[#120713] flex items-center justify-center transition-all shadow-md"
                      title="Save Bookmark"
                    >
                      <Bookmark size={15} />
                    </button>
                  </div>
                </div>
             </div>

             {/* Dynamic Variants & Beautiful Interactive Callouts */}
             <div className="w-full border-t border-white/10 pt-4 flex flex-col items-center justify-center text-center space-y-4 font-sans">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.25em] block">SELECT OPTIONS</span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">COLOR: {selectedColor || 'SUNSET ORANGE'}</span>
                </div>

                {/* Colors dots */}
                <div className="flex justify-center gap-4">
                  {uniqueColors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2",
                          isSelected ? "border-[#FF6B00] bg-transparent" : "border-transparent bg-transparent hover:border-white/20"
                        )}
                      >
                        <span className={cn("w-6 h-6 rounded-full block shadow-md", getColorHexClass(color))} />
                      </button>
                    );
                  })}
                </div>

                {/* Size options capsules */}
                <div className="flex flex-col items-center gap-3 w-full max-w-md">
                  <div className="flex flex-wrap justify-center gap-3">
                    {(uniqueSizes.length > 0 ? uniqueSizes : ['8GB/128GB', '12GB/256GB', '12GB/512GB', '16GB/1TB']).map((size) => {
                      const isSelected = selectedSize === size || selectedRam === size || selectedStorage === size || (size === '12GB/256GB' && !selectedSize);
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (uniqueSizes.length > 0) setSelectedSize(size);
                            else if (uniqueRams.includes(size)) setSelectedRam(size);
                          }}
                          className={cn(
                            "h-9 px-5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center justify-center font-mono",
                            isSelected 
                              ? "bg-transparent border-[#FF6B00] text-white" 
                              : "bg-transparent border-white/25 text-white/80 hover:bg-white/5 hover:border-white/40 hover:text-white"
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                    <button onClick={() => setIsSizeChartOpen(true)} className="text-[10px] font-bold text-[#FF6B00] uppercase hover:underline italic flex items-center gap-1 ml-2 self-center font-sans tracking-widest pl-1">
                      SIZE GUIDE
                    </button>
                  </div>
                </div>

                {/* Commercial Primary Buttons aligned horizontally */}
                {mode === 'retail' ? (
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg pt-4">
                     <button 
                       onClick={() => {
                         addToCart(product, 1);
                         toast.success(`Added ${product.title} to your Retail Cart!`);
                       }}
                       className="h-12 px-8 bg-[#FF6B00] hover:bg-[#FF5B00] text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-[#FF6B00]/15 flex items-center justify-center gap-2 flex-1 w-full"
                     >
                       ADD TO CART
                     </button>
                     <Link 
                       to={`/brands/${brandId}`}
                       className="h-12 px-8 bg-white hover:bg-gray-100 text-[#120713] rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2.5 flex-1 w-full border border-white/10"
                     >
                       VISIT OFFICIAL STORE <span className="w-5 h-5 rounded-full bg-[#1100FF] text-white flex items-center justify-center text-[8px] font-bold">➔</span>
                     </Link>
                  </div>
                ) : (
                  /* B2B Wholesale channels calculator inside the dark theme wrapper as well! */
                  <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm text-left">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
                     
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-white/10">
                       <div className="text-left">
                         <span className="text-[10px] font-black text-[#FF5B00] uppercase tracking-widest italic block mb-1 text-left font-sans">B2B Wholesale Channel</span>
                         <h4 className="text-lg font-black text-white uppercase tracking-tighter italic text-left font-sans">Bulk Trade Sourcing Panel</h4>
                       </div>
                       <div className="bg-[#FF5B00]/10 border border-[#FF5B00]/30 text-[#FF5B00] text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase italic tracking-wider">
                         MOQ: {product.moq || 10} Units Enforced
                       </div>
                     </div>

                     {/* Quantity slabs layout */}
                     {product.pricingTiers && (
                       <div className="mb-6 text-left">
                         <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-2 italic font-sans">Sourcing Pricing Slabs</span>
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

                     {/* Calculator */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                       <div className="space-y-2 text-left">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#FFF]/40 font-sans">
                           <span>Enter Order Qty:</span>
                           {product.moq && b2bQty < product.moq && (
                             <span className="text-red-500 font-bold font-mono">Below MOQ</span>
                           )}
                         </div>
                         <div className="flex items-center justify-between bg-[#0A0B1E]/60 border border-white/10 rounded-xl px-4 py-2">
                           <button 
                             type="button"
                             onClick={() => setB2bQty(Math.max(1, b2bQty - 1))}
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
                             onClick={() => setB2bQty(b2bQty + 1)}
                             className="text-white/60 hover:text-white font-black text-sm p-1"
                           >
                             +
                           </button>
                         </div>
                       </div>

                       <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center text-left">
                         <div>
                           <span className="text-[8px] font-black text-white/40 uppercase tracking-widest italic block font-sans">Calculated Total</span>
                           <span className="text-xl font-mono font-black text-white font-sans">৳{activeTotalPrice.toLocaleString()}</span>
                         </div>
                         <div className="text-right">
                           <span className="text-[8px] font-black text-white/40 uppercase tracking-widest italic block font-sans">Unit Active</span>
                           <span className="text-[11px] font-black text-orange-primary font-mono">৳{activeUnitPrice.toLocaleString()} / pc</span>
                         </div>
                       </div>
                     </div>

                     {/* Action buttons */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                       <button 
                         onClick={handleAddToCartClick}
                         className={cn(
                           "py-4 w-full rounded-xl font-black text-[12px] uppercase tracking-widest italic transition-all shadow-xl flex items-center justify-center gap-2 font-sans",
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
                         className="py-4 w-full bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl font-black text-[12px] uppercase tracking-widest italic transition-all flex items-center justify-center gap-2 font-sans"
                       >
                         Request Business Quote
                       </button>
                     </div>

                     {/* Sourcing details */}
                     <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-4 text-left font-sans">
                       <div>
                         <span className="text-[7.5px] font-black text-white/30 uppercase block font-sans">Invoicing</span>
                         <span className="text-[9px] font-bold text-white/70">GST / BIN Compliant</span>
                       </div>
                       <div>
                         <span className="text-[7.5px] font-black text-[#FFF]/30 uppercase block font-sans">Sample Sourcing</span>
                         <span className="text-[9px] font-bold text-[#FF5B00]">Samples Available</span>
                       </div>
                       <div>
                         <span className="text-[7.5px] font-black text-white/30 uppercase block font-sans">Audit Verification</span>
                         <span className="text-[9px] font-bold text-white/70">SGS Factory Pass</span>
                       </div>
                     </div>
                  </div>
                )}
             </div>
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
         <div className="max-w-[1700px] mx-auto px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 items-start w-full relative">
               
               {/* Left Column Section (Column 1) */}
               <div className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
                  {/* QUICK PRODUCT OVERVIEW CARD */}
                  <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl p-6 space-y-6">
                     <h3 className="text-xs font-black text-navy tracking-tight uppercase border-b border-gray-150 pb-4">
                        QUICK <span className="text-orange-primary">PRODUCT</span> OVERVIEW
                     </h3>

                     {/* Section 1 */}
                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black text-navy tracking-wide">
                           <Tag size={16} className="text-orange-primary" />
                           PRODUCT QUALITY & MATERIAL
                        </div>
                        <div className="pl-6 space-y-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-relaxed">
                           <div>• WATER PROOF IPS67/DF</div>
                           <div>• GORILLA GLASS VICTUS 2</div>
                           <div>• 2 YEARS DISPLAY WARRANTY</div>
                        </div>
                     </div>

                     {/* Section 2 */}
                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black text-navy tracking-wide">
                           <Award size={16} className="text-orange-primary" />
                           FEATURES & BENEFITS
                        </div>
                        <div className="pl-6 space-y-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-relaxed">
                           <div>• 15 DAYS REPLACEMENT WITH FULL REFUND GUARANTEE</div>
                           <div>• EMI FACILITIES WITH ZERO 0% INTEREST</div>
                           <div>• 2 YEARS DISPLAY WARRANTY</div>
                           <div>• FREE COD DELIVERY ALL OVER BANGLADESH</div>
                           <div>• 3 HOURS DELIVERY INSIDE DHAKA METRO</div>
                           <div>• ONLINE & OFFLINE ORDER FACILITY</div>
                           <div>• FREE GIFTS & GOODIES</div>
                        </div>
                     </div>

                     {/* Section 3 */}
                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black text-navy tracking-wide">
                           <Users size={16} className="text-orange-primary" />
                           AUDIENCE & USE CASE
                        </div>
                        <div className="pl-6 space-y-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-relaxed">
                           <div>• BUSINESS PROFESSIONALS</div>
                           <div>• VLOGGERS & CONTENT CREATORS</div>
                           <div>• POWER USERS & GAMERS</div>
                           <div>• MALE, FEMALE, YOUTH & KIDS</div>
                        </div>
                     </div>

                     {/* Section 4 */}
                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black text-navy tracking-wide">
                           <ShieldCheck size={16} className="text-orange-primary" />
                           CUSTOMER SUPPORT, TRUST & ASSURANCE
                        </div>
                        <div className="pl-6 space-y-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-relaxed">
                           <div>• 15 DAYS REPLACEMENT WITH FULL REFUND GUARANTEE</div>
                           <div>• EMI FACILITIES WITH ZERO 0% INTEREST</div>
                           <div>• 3 YEARS DISPLAY WARRANTY</div>
                           <div>• FREE COD DELIVERY ALL OVER BANGLADESH</div>
                           <div>• 3 HOURS DELIVERY INSIDE DHAKA METRO</div>
                           <div>• ONLINE & OFFLINE ORDER FACILITY</div>
                           <div>• FREE GIFTS & GOODIES</div>
                        </div>
                     </div>

                     {/* Section 5 */}
                     <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black text-navy tracking-wide">
                           <span className="text-orange-primary font-black text-base">#</span>
                           BEST FOR #TAGS.
                        </div>
                        <div className="pl-6 flex flex-wrap gap-1.5 pt-1">
                           {['#premium buyers', '#equality driven', '#festive wear', '#deshi vibe collection', '#trend setter', '#old money/summer collection', '#beach wear'].map((tag) => (
                              <span key={tag} className="text-[9px] font-black text-orange-primary bg-orange-primary/5 px-2 py-0.5 rounded-full transition-colors hover:bg-orange-primary/10 cursor-default">
                                 {tag}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* SPECIFICATIONS TABLE */}
                  <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl overflow-hidden p-6 space-y-4">
                     <h3 className="text-xs font-black text-navy uppercase tracking-tight pb-2 border-b border-gray-50">
                        SPECIFICATIONS
                     </h3>
                     <div className="divide-y divide-gray-100 text-[11px] font-bold">
                        {[
                           { label: "BRAND", value: "Sailor" },
                           { label: "CATEGORY", value: "Women's Dress" },
                           { label: "MATERIAL", value: "Premium Cotton" },
                           { label: "ORIGIN", value: "Made In Bangladesh" },
                           { label: "WARRANTY", value: "N/A" },
                           { label: "PRODUCT", value: "3 Pc Shalwar Kameez" },
                           { label: "COLOR", value: "Dark Blue" },
                           { label: "SIZE", value: "34 - 42" },
                           { label: "CODE", value: "Code #SKU-123-SU03" },
                           { label: "MISC", value: "Available In All Store" }
                        ].map((spec, i) => (
                           <div key={i} className={cn("flex justify-between py-3 px-3", i % 2 !== 0 ? "bg-gray-50/50" : "bg-white")}>
                              <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[9px]">{spec.label}</span>
                              <span className="text-navy font-black text-right">{spec.value}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Middle Column Section (Column 2) */}
               <div className="lg:col-span-6 space-y-8 min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
                  {/* PRICE ACROSS STORES TABLE CARD */}
                  <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl overflow-hidden">
                     <div className="p-6 flex items-center justify-between border-b border-gray-50">
                        <h3 className="text-sm font-black text-navy uppercase tracking-tight">
                           PRICE ACROSS <span className="text-orange-primary">STORES</span>
                        </h3>
                        <span className="text-[10px] font-black text-orange-primary italic uppercase tracking-wider">3 Stores Available</span>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-[#0A0A1F] text-white">
                                 <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-wider">Store</th>
                                 <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-wider text-center">Price</th>
                                 <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-wider text-center">Delivery</th>
                                 <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-wider text-center">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-150">
                              {[
                                 { name: "DARAZ", logo: "D", rating: "4.5", price: "BDT 38,000", delivery: "3 - 5 DAYS" },
                                 { name: "APPLEGADGETSBD", logo: "A", rating: "4.5", price: "BDT 39,000", delivery: "24 HOURS" },
                                 { name: "PICKABOO", logo: "P", rating: "4.5", price: "BDT 39,500", delivery: "1 HOUR DELIVERY DHAKA METRO ONLY" }
                              ].map((store, i) => (
                                 <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4.5">
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center font-black text-navy text-[11px] font-mono shadow-sm">
                                             {store.logo}
                                          </div>
                                          <div className="flex flex-col">
                                             <span className="text-[11px] font-black text-navy uppercase tracking-tight">{store.name}</span>
                                             <div className="flex items-center gap-0.5">
                                                <Star size={8} className="fill-orange-primary text-orange-primary" />
                                                <span className="text-[8px] font-black text-gray-400">{store.rating}</span>
                                             </div>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4.5 text-center">
                                       <span className="text-xs font-black text-orange-primary italic tracking-tight">{store.price}</span>
                                    </td>
                                    <td className="px-6 py-4.5 text-center max-w-[150px]">
                                       <span className="text-[8.5px] font-extrabold text-gray-400 uppercase tracking-wider leading-tight block">{store.delivery}</span>
                                    </td>
                                    <td className="px-6 py-4.5 text-center">
                                       <button 
                                          onClick={() => toast.success(`Redirecting to ${store.name}...`)}
                                          className="px-4 py-2 border border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 text-[8.5px] font-black uppercase tracking-widest rounded-full transition-all italic leading-none"
                                       >
                                          GO TO STORE
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>

                  {/* INFLUENCER & CREATOR REVIEWS CARD (The dark deep purple box) */}
                  <div className="bg-gradient-to-b from-[#220B1B] to-[#0A0208] text-white p-6 rounded-[24px] space-y-6 border border-white/5 shadow-2xl">
                     <div className="text-center space-y-1 mb-2">
                        <h3 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-white">
                           INFLUENCER & CREATOR REVIEWS
                        </h3>
                        <p className="text-[8.5px] font-black text-white/40 uppercase tracking-[0.3em] italic">
                           TRUSTED EXPERTS BREAKING DOWN APEX
                        </p>
                     </div>

                     {/* Featured Landscape Card */}
                     <div className="bg-white rounded-[20px] overflow-hidden shadow-xl flex flex-col md:flex-row border border-gray-100 text-navy">
                        <div className="md:w-7/12 relative h-[180px] md:h-auto min-h-[180px] bg-black group overflow-hidden">
                           <img 
                              src="https://images.unsplash.com/photo-1511119253457-36e78921865c?w=1200&h=800&fit=crop" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80" 
                              alt="Reviewer Banner"
                           />
                           <div className="absolute top-3 left-3">
                              <span className="bg-orange-primary text-white text-[7.5px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest italic flex items-center gap-1 shadow-md">
                                 <div className="w-1 h-1 rounded-full bg-white animate-pulse" /> TRENDING NOW
                              </span>
                           </div>
                           <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-all duration-300">
                              <Play size={14} className="fill-current ml-0.5" />
                           </button>
                           <div className="absolute bottom-3 left-3 right-3 text-white">
                              <p className="text-[7.5px] font-black uppercase tracking-wider opacity-60 italic leading-none mb-1">CREATOR SPOTLIGHT</p>
                              <h4 className="text-lg font-black italic tracking-tight leading-none">Apex Special Edition</h4>
                           </div>
                        </div>
                        <div className="md:w-5/12 p-5 flex flex-col justify-between bg-white relative">
                           <div className="space-y-2">
                              <span className="text-[8px] font-black text-orange-primary uppercase tracking-widest block italic">IN-DEPTH REVIEW</span>
                              <h4 className="text-base font-black text-navy italic tracking-tight leading-tight">Why Apex remains a Top Choice in 2024!</h4>
                              <p className="text-[9.5px] text-gray-500 font-bold leading-relaxed">
                                 Watch as we dive deep into the performance and build quality of Apex's latest collection. From real-world testing to expert analysis.
                              </p>
                           </div>
                           <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                              <div className="flex flex-col">
                                 <div className="text-[9px] font-black text-navy italic uppercase tracking-wider">TECH REVIEW BD</div>
                                 <div className="text-[7.5px] font-black text-gray-400 uppercase tracking-widest">Dhaka Headquarters</div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy text-[8.5px] font-black uppercase tracking-tight shadow-sm italic">
                                 Apex
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Row of 3 Cards */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Card 1 */}
                        <div className="bg-white/5 backdrop-blur-md rounded-[16px] overflow-hidden border border-white/10 flex flex-col h-full group hover:border-white/20 transition-all">
                           <div className="aspect-[3/4] relative overflow-hidden bg-black">
                              <img 
                                 src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop" 
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                                 alt="Style Showcase"
                              />
                              <div className="absolute top-2 left-2">
                                 <span className="bg-orange-primary/95 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider italic">FASHION VIBES</span>
                              </div>
                              <div className="absolute bottom-2 left-2 right-2 text-white">
                                 <h4 className="text-[10px] font-black italic tracking-tight leading-tight drop-shadow-md">Apex Style Showcase</h4>
                              </div>
                           </div>
                           <div className="p-2.5 flex items-center gap-2 mt-auto border-t border-white/5 bg-black/20">
                              <div className="w-6 h-6 rounded-md overflow-hidden bg-white/10 flex-shrink-0">
                                 <img src="https://i.pravatar.cc/100?u=style" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                 <span className="text-[8.5px] font-black text-white/90 truncate leading-none mb-0.5">Style Maven</span>
                                 <span className="text-[7px] font-bold text-white/40 truncate">@stylemaven • 12m</span>
                              </div>
                           </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white/5 backdrop-blur-md rounded-[16px] overflow-hidden border border-white/10 flex flex-col h-full group hover:border-white/20 transition-all">
                           <div className="aspect-[3/4] relative overflow-hidden bg-black">
                              <img 
                                 src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop" 
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                                 alt="A Deep Dive"
                              />
                              <div className="absolute top-2 left-2">
                                 <span className="bg-blue-600/95 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider italic">FOOTWEAR</span>
                              </div>
                              <div className="absolute bottom-2 left-2 right-2 text-white">
                                 <h4 className="text-[10px] font-black italic tracking-tight leading-tight drop-shadow-md">Apex Collection: A Deep Dive</h4>
                              </div>
                           </div>
                           <div className="p-2.5 flex items-center gap-2 mt-auto border-t border-white/5 bg-black/20">
                              <div className="w-6 h-6 rounded-md overflow-hidden bg-white/10 flex-shrink-0">
                                 <img src="https://i.pravatar.cc/100?u=bbtech" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                 <span className="text-[8.5px] font-black text-white/90 truncate leading-none mb-0.5">BB Tech Reviews</span>
                                 <span className="text-[7px] font-bold text-white/40 truncate">@bbtech • 15h</span>
                              </div>
                           </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white/5 backdrop-blur-md rounded-[16px] overflow-hidden border border-white/10 flex flex-col h-full group hover:border-white/20 transition-all">
                           <div className="aspect-[3/4] relative overflow-hidden bg-black">
                              <img 
                                 src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop" 
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" 
                                 alt="Creative Showcase"
                              />
                              <div className="absolute top-2 left-2">
                                 <span className="bg-purple-600/95 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider italic">UNBOXING</span>
                              </div>
                              <div className="absolute bottom-2 left-2 right-2 text-white">
                                 <h4 className="text-[10px] font-black italic tracking-tight leading-tight drop-shadow-md">Finding The Perfect Build in Apex</h4>
                              </div>
                           </div>
                           <div className="p-2.5 flex items-center gap-2 mt-auto border-t border-white/5 bg-black/20">
                              <div className="w-6 h-6 rounded-md overflow-hidden bg-white/10 flex-shrink-0">
                                 <img src="https://i.pravatar.cc/100?u=avishek" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                 <span className="text-[8.5px] font-black text-white/90 truncate leading-none mb-0.5">Avishek Mojumder</span>
                                 <span className="text-[7px] font-bold text-white/40 truncate">@avishek • 1d</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* PUBLIC REVIEWS CARD TO MATCH ATTACHED SCREENSHOT */}
                  <div className="bg-white rounded-[40px] p-8 border border-gray-100/80 shadow-2xl shadow-gray-100/40 space-y-8">
                     <div className="text-center flex flex-col items-center">
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase text-navy">
                           PUBLIC <span className="text-orange-primary">REVIEWS</span>
                        </h3>
                        <p className="text-[9px] font-black text-navy/40 uppercase tracking-[0.3em] italic mt-1">
                           VERIFIED BUYER REVIEWS
                        </p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                           {
                              name: "Tanvir Hasan",
                              avatar: "https://i.pravatar.cc/150?u=tanvir",
                              time: "POSTED 2 WEEKS AGO",
                              rating: "5",
                              content: "The material quality of the new Apex collection is absolutely top-notch. I was skeptical about the price but after wearing it once, I can say it's worth every taka. The fit is perfect for large build individuals as well.",
                              date: "APRIL 2024",
                              helpful: 124,
                              images: [
                                 "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop",
                                 "https://images.unsplash.com/photo-1541643600914-78b084683601?w=150&h=150&fit=crop"
                              ]
                           },
                           {
                              name: "Nusrat Jahan",
                              avatar: "https://i.pravatar.cc/150?u=nusrat",
                              time: "POSTED 1 MONTH AGO",
                              rating: "4.8",
                              content: "Beautiful designs! I bought three different items and all of them were delivered on time. The online sizing chart was very accurate which was a relief. Highly recommend the fusion wear collection.",
                              date: "MARCH 2024",
                              helpful: 89,
                              images: [
                                 "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&h=150&fit=crop"
                              ]
                           }
                        ].map((review, i) => (
                           <div key={i} className="bg-white rounded-[32px] p-6 border border-gray-150/50 shadow-xl flex flex-col h-full gap-5">
                              {/* Header row */}
                              <div className="flex items-start justify-between gap-3">
                                 <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl border-2 border-orange-primary/20 p-0.5 bg-white flex-shrink-0">
                                       <img src={review.avatar} className="w-full h-full rounded-xl object-cover" alt={review.name} />
                                    </div>
                                    <div className="flex flex-col">
                                       <div className="flex items-center gap-2 flex-wrap">
                                          <h4 className="text-xs font-black text-navy uppercase tracking-tight italic">{review.name}</h4>
                                          <div className="bg-[#E6FBF0] text-[#059669] text-[7.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider h-4 inline-flex items-center gap-0.5">
                                             <CheckCircle2 size={8} /> VERIFIED
                                          </div>
                                       </div>
                                       <span className="text-[7.5px] font-black text-gray-400 tracking-wider mt-1 uppercase italic">{review.time}</span>
                                    </div>
                                 </div>
                                 <div className="flex flex-col items-end flex-shrink-0">
                                    <div className="flex gap-0.5 mb-1">
                                       {[1,2,3,4,5].map(star => (
                                          <Star key={star} size={9} className={cn("fill-current", star <= Math.floor(Number(review.rating)) ? "text-orange-primary" : "text-gray-100")} />
                                       ))}
                                    </div>
                                    <div className="text-xs font-black text-navy italic tracking-tighter">
                                       {review.rating}<span className="text-gray-300 text-[10px] ml-0.5">/ 5</span>
                                    </div>
                                 </div>
                              </div>

                              {/* Images row */}
                              <div className="flex gap-2">
                                 {review.images.map((img, idx) => (
                                    <div key={idx} className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                                       <img src={img} className="w-full h-full object-cover" alt="review upload" />
                                    </div>
                                 ))}
                              </div>

                              {/* Content box */}
                              <div className="bg-[#F8FAFC] rounded-[24px] p-4 relative min-h-[90px] flex items-center mb-auto">
                                 <MessageSquare size={24} className="absolute -top-2.5 -right-2 text-orange-primary/10 fill-current transform rotate-12" />
                                 <p className="text-[10px] text-navy font-bold leading-normal italic tracking-tight">
                                    "{review.content}"
                                 </p>
                              </div>

                              {/* Footer row */}
                              <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                                 <div>
                                    <span className="text-[7px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">PURCHASE DATE</span>
                                    <span className="text-[9px] font-black text-navy uppercase tracking-wider">{review.date}</span>
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                    <button 
                                       onClick={() => toast.success("Thanks for voting this review as helpful!")}
                                       className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-500 hover:text-navy hover:border-navy transition-all"
                                    >
                                       <ThumbsUp size={10} />
                                       <span className="text-[8px] font-black uppercase tracking-wider">HELPFUL ({review.helpful})</span>
                                    </button>
                                    <button 
                                       onClick={() => toast.success("Thanks for the feedback!")}
                                       className="w-7 h-7 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                                    >
                                       <ThumbsDown size={10} />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Load more */}
                     <div className="flex justify-center pt-2">
                        <button 
                           onClick={() => toast.success("All reviews are fully loaded.")}
                           className="w-full py-4 bg-[#f5f7fb] text-[#8a92a6] font-bold text-[9.5px] uppercase tracking-[0.2em] rounded-[18px] hover:bg-[#0c133c] hover:text-white hover:shadow-lg transition-all border border-transparent italic flex items-center justify-center"
                        >
                           LOAD MORE REVIEWS
                        </button>
                     </div>
                  </div>

               </div>

               {/* Right Side Column (Column 3) */}
               <div className="lg:col-span-3 space-y-8 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
                  {/* SAMSUNG BRAND CARD */}
                  <div className="bg-white rounded-[24px] overflow-hidden shadow-xl border border-gray-100 group">
                     <div className="p-6 flex flex-col items-center text-center">
                        <div className="relative mb-4 mt-2">
                           <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center p-2.5 shadow-lg scale-100 group-hover:scale-105 transition-transform duration-500">
                              <div className="font-black text-sm text-white tracking-widest uppercase">SAMSUNG</div>
                           </div>
                           <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-primary flex items-center justify-center text-white border-2 border-white shadow-md">
                              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                                 <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                              </svg>
                           </div>
                        </div>

                        <h4 className="text-lg font-black text-navy uppercase tracking-widest mb-1">SAMSUNG</h4>
                        
                        <div className="flex gap-0.5 mb-6">
                           {[1,2,3,4,5].map(i => (
                              <Star key={i} size={11} className="fill-orange-primary text-orange-primary" />
                           ))}
                        </div>

                        <div className="space-y-2.5 w-full">
                           <button 
                              onClick={handleMessageOrder}
                              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[9.5px] font-black uppercase tracking-wider transform active:scale-98 transition-all inline-flex items-center justify-center gap-1.5 leading-none"
                           >
                              MESSAGE TO ORDER
                           </button>
                           
                           <div className="grid grid-cols-2 gap-2">
                              <button 
                                 onClick={handleLoveBrand}
                                 className="py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 text-[8.5px] font-black uppercase tracking-widest transition-all leading-none"
                              >
                                 FOLLOW THE BRAND
                              </button>
                              <button 
                                 onClick={() => toast.success("Contacting Samsung Official Desk...")}
                                 className="py-3 rounded-xl bg-orange-primary hover:bg-orange-600 text-white text-[8.5px] font-black uppercase tracking-widest transition-all leading-none"
                              >
                                 CONTACT US
                              </button>
                           </div>
                           
                           <Link 
                              to={`/brands/${brandId}`}
                              className="w-full py-3.5 rounded-xl bg-navy text-white text-[9.5px] font-black uppercase tracking-wider hover:bg-orange-primary transition-all inline-block leading-none mt-2"
                           >
                              VIEW BRAND PROFILE
                           </Link>
                        </div>

                        {/* Social Icons row */}
                        <div className="flex justify-center gap-3 mt-6 pt-5 border-t border-gray-150 w-full">
                           {[
                              { icon: <Facebook size={12}/>, label: "Facebook", color: "hover:text-blue-600" },
                              { icon: <Instagram size={12}/>, label: "Instagram", color: "hover:text-pink-500" },
                              { icon: <Share2 size={12}/>, label: "TikTok", color: "hover:text-cyan-400" },
                              { icon: <Youtube size={12}/>, label: "YouTube", color: "hover:text-red-500" }
                           ].map((item, i) => (
                              <div key={i} className="flex flex-col items-center gap-1 cursor-pointer group/soc">
                                 <div className={cn("w-7 h-7 rounded-full bg-gray-50 border border-gray-150 flex items-center justify-center text-gray-400 transition-all group-hover/soc:bg-gray-100 group-hover/soc:scale-110", item.color)}>
                                    {item.icon}
                                 </div>
                                 <span className="text-[7px] font-extrabold text-gray-400 uppercase tracking-widest">{item.label}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* PHYSICAL STORES */}
                  <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xl space-y-4">
                     <h3 className="text-xs font-black text-navy uppercase tracking-tight pb-2 border-b border-gray-50">
                        PHYSICAL <span className="text-orange-primary">STORES</span>
                     </h3>
                     <div className="space-y-3">
                        {[
                           "BASUNDHARA CITY COMPLEX, LEVEL 5, BLOCK B, SHOP 54",
                           "JAMUNA FUTURE PARK, LEVEL 3, ZONE A, SHOP 120",
                           "JAMUNA FUTURE PARK, LEVEL 2, ZONE A, SHOP 121"
                        ].map((loc, i) => (
                           <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5 hover:bg-navy hover:border-navy hover:text-white transition-all duration-300 group">
                              <Globe size={14} className="text-orange-primary flex-shrink-0 mt-0.5 group-hover:text-white" />
                              <span className="text-[9.5px] font-black text-navy uppercase tracking-wide leading-tight group-hover:text-white">{loc}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* PRODUCT VERDICT */}
                  <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-xl space-y-5">
                     <h3 className="text-xs font-black text-navy uppercase tracking-tight pb-2 border-b border-gray-50">
                        PRODUCT <span className="text-orange-primary">VERDICT</span>
                     </h3>
                     
                     {/* What We Like section */}
                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-orange-primary uppercase tracking-widest flex items-center gap-1.5 italic">
                           <ThumbsUp size={12} /> WHAT WE LIKE:
                        </h4>
                        <div className="pl-3.5 space-y-1.5">
                           {['Brand Value', 'Fabric Quality', 'Product Range', 'Nationwide Store', 'Online Order'].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-[10px] font-black text-navy uppercase">
                                 <div className="w-1 h-1 rounded-full bg-orange-primary" /> {item}
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* What to consider section */}
                     <div className="space-y-3 pt-2 border-t border-gray-50">
                        <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5 italic">
                           <ThumbsDown size={12} /> WHAT TO CONSIDER:
                        </h4>
                        <div className="pl-3.5 space-y-1.5">
                           {['Price Range', 'Age Limit', 'Refund Policy', 'Limited Stock', 'Delivery'].map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-[10px] font-black text-navy uppercase opacity-70">
                                 <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> {item}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </main>

  

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
