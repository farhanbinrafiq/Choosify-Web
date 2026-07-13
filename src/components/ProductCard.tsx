import React, { useState } from 'react';
import { Star, Heart, ExternalLink, Bookmark, ArrowRight, Layers, ImageOff, Plus, ChevronLeft, ChevronRight, ShoppingCart, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { PLACEHOLDER_IMAGE } from '../constants';
import toast from 'react-hot-toast';

function getProductCardImages(product: any): string[] {
  const mainImage = product.image || PLACEHOLDER_IMAGE;
  const isTechOrMobile = product.category?.toLowerCase().includes('tech') || 
                        product.category?.toLowerCase().includes('mobile') ||
                        product.category?.toLowerCase().includes('gaming') ||
                        product.category?.toLowerCase().includes('appliance');
  
  const isFashion = product.category?.toLowerCase().includes('fashion') || 
                    product.category?.toLowerCase().includes('lifestyle') ||
                    product.category?.toLowerCase().includes('jewelry');

  if (isTechOrMobile) {
    return [
      mainImage,
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop'
    ];
  } else if (isFashion) {
    return [
      mainImage,
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b830c6050?w=400&h=400&fit=crop'
    ];
  } else {
    return [
      mainImage,
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop'
    ];
  }
}

function getRecommendationData(product: any) {
  const title = (product.title || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();

  // Pre-mapped tags based on standard model criteria
  if (product.id === 1 || title.includes('s24') || title.includes('s25') || title.includes('s26')) {
    return {
      tags: ['#BEST_CAMERA', '#BEST_DISPLAY', '#CONTENT_CREATION', '#PREMIUM_PICK', '#FLAGSHIP'],
      verdict: "Best for premium users seeking ultimate camera zoom and brightness."
    };
  }
  if (product.id === 2 || title.includes('wh-1000xm5') || title.includes('sony')) {
    return {
      tags: ['#PREMIUM_PICK', '#EDITOR_CHOICE', '#TRAVEL_FRIENDLY', '#QUALITY_DRIVEN'],
      verdict: "Outstanding long-session active noise cancellation for frequent travelers."
    };
  }
  if (product.id === 3 || title.includes('macbook') || title.includes('m3')) {
    return {
      tags: ['#PREMIUM_PICK', '#LONG_BATTERY', '#CREATOR_FRIENDLY', '#EDITOR_CHOICE'],
      verdict: "Perfect fanless everyday carrying laptop for modern remote creatives."
    };
  }
  if (product.id === 4 || title.includes('air max') || title.includes('nike')) {
    return {
      tags: ['#BEST_VALUE', '#QUALITY_DRIVEN', '#TRAVEL_FRIENDLY', '#EDITOR_CHOICE'],
      verdict: "Superb foot arch support and ventilation for daily walking tasks."
    };
  }
  if (product.id === 5 || title.includes('oled') || title.includes('c3') || title.includes('tv')) {
    return {
      tags: ['#BEST_DISPLAY', '#BEST_GAMING', '#PREMIUM_PICK', '#FLAGSHIP'],
      verdict: "Premier high-refresh 120Hz display with true-pitch black OLED panels."
    };
  }
  if (product.id === 6 || title.includes('ultima pro') || brand.includes('apex')) {
    return {
      tags: ['#BEST_VALUE', '#QUALITY_DRIVEN', '#TRAVEL_FRIENDLY', '#UNDER_50000'],
      verdict: "Impressive responsive midsole cushion for everyday urban jogging."
    };
  }
  if (product.id === 7 || title.includes('a35') || title.includes('galaxy a')) {
    return {
      tags: ['#BEST_VALUE', '#LONG_BATTERY', '#UNDER_50000', '#BUSINESS_USERS'],
      verdict: "Outstanding long-term software support commitments at mid-range budget."
    };
  }
  if (product.id === 8 || title.includes('redmi') || title.includes('note 13')) {
    return {
      tags: ['#BEST_VALUE', '#FAST_CHARGING', '#UNDER_50000', '#PHOTOGRAPHY'],
      verdict: "Astounding 200MP sensor clarity with fast wire recharging."
    };
  }
  if (product.id === 9 || title.includes('poco') || title.includes('x6')) {
    return {
      tags: ['#BEST_GAMING', '#BEST_CPU', '#BEST_VALUE', '#UNDER_50000'],
      verdict: "Supreme raw graphics rendering chipset performance for esports gamers."
    };
  }
  if (product.id === 10 || title.includes('realme 12')) {
    return {
      tags: ['#PHOTOGRAPHY', '#EDITOR_CHOICE', '#UNDER_50000', '#QUALITY_DRIVEN'],
      verdict: "Elite periscope optical portrait camera at mid-tier pricing."
    };
  }

  // Dynamic values
  const tags: string[] = [];
  let verdict = "Excellent all-rounder delivering dependable regular service.";

  const priceStr = String(product.price || '').replace(/,/g, '');
  const priceVal = parseFloat(priceStr);
  
  if (cat.includes('phone') || cat.includes('mobile')) {
    tags.push('#BEST_DISPLAY', '#BUSINESS_USERS');
    if (priceVal && priceVal < 50000) {
      tags.push('#UNDER_50000');
    }
    if (priceVal && priceVal >= 100000) {
      tags.push('#FLAGSHIP', '#PREMIUM_PICK');
      verdict = "Premium tier flagship with flawless craftsmanship and power.";
    } else {
      tags.push('#BEST_VALUE');
      verdict = "Exceptional daily capabilities without standard flagship price markup.";
    }
  } else if (cat.includes('fashion') || cat.includes('lifestyle') || cat.includes('shoe')) {
    tags.push('#QUALITY_DRIVEN', '#TRAVEL_FRIENDLY');
    if (priceVal && priceVal < 10000) {
      tags.push('#BEST_VALUE');
    }
    verdict = "Versatile design certified for excellent all-day usage situations.";
  } else {
    tags.push('#QUALITY_DRIVEN', '#EDITOR_CHOICE');
    if (priceVal && priceVal < 100000) {
      tags.push('#BEST_VALUE');
    }
  }

  // Ensure tags is 3-6 items
  while (tags.length < 3) {
    tags.push('#EDITOR_CHOICE');
  }
  const finalTags = Array.from(new Set(tags)).slice(0, 6);

  return { tags: finalTags, verdict };
}

function ProductCardImageCarousel({ images, alt, containerClassName }: { images: string[], alt: string, containerClassName?: string }) {
  const [idx, setIdx] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIdx((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    setIdx(i);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 30) {
      setIdx((prev) => (prev + 1) % images.length);
    } else if (diff < -30) {
      setIdx((prev) => (prev - 1 + images.length) % images.length);
    }
    setStartX(null);
  };

  return (
    <div 
      className={cn("relative w-full h-full select-none overflow-hidden group/carousel flex items-center justify-center", containerClassName)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={images[idx]}
        alt={alt}
        loading="lazy"
        onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}
        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
      />
      
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/75 hover:bg-white border-0 flex items-center justify-center text-navy shadow-sm transition-opacity opacity-0 group-hover/carousel:opacity-100 z-30"
          >
            <ChevronLeft size={12} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/75 hover:bg-white border-0 flex items-center justify-center text-navy shadow-sm transition-opacity opacity-0 group-hover/carousel:opacity-100 z-30"
          >
            <ChevronRight size={12} strokeWidth={2.5} />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30 bg-black/10 px-1.5 py-0.5 rounded-full backdrop-blur-xs">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => handleDotClick(e, i)}
              className={cn(
                "h-1 rounded-full transition-all duration-300 border-none p-0 cursor-pointer",
                idx === i ? "w-2.5 bg-[#FF5B00]" : "w-1 bg-white/60 hover:bg-white"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductCard({ 
  product, 
  variant = 'grid',
  showCountdown = false,
  imageContainerStyle,
  titleStyle,
  isGuideDetail = false,
  isDashboard = false
}: { 
  product: any, 
  variant?: 'grid' | 'list' | 'compact' | 'featured',
  showCountdown?: boolean,
  key?: React.Key,
  imageContainerStyle?: React.CSSProperties,
  titleStyle?: React.CSSProperties,
  isGuideDetail?: boolean,
  isDashboard?: boolean
}) {
  const navigate = useNavigate();
  const { savedProducts, setSavedProducts, addToCompare, comparedProducts, setComparedProducts } = useDashboard();
  const { mode, allBrands, addToCart } = useGlobalState();

  const brandObj = allBrands?.find((b: any) => b.id === product.brandId);
  const brandName = brandObj ? brandObj.name : (product.brand || 'APEX');
  
  const isSaved = savedProducts.some(p => p.id === product.id);
  const isInCompare = comparedProducts.some(p => p.id === product.id);

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      setSavedProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success('Removed from vault');
    } else {
      setSavedProducts(prev => [...prev, product]);
      toast.success('Saved to vault');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCompare(product);
  };

  const stock = product.stock || 12;
  const soldPercent = product.soldPercent || 85;

  const StockProgress = ({ sm = false }: { sm?: boolean }) => (
    <div className={cn("flex flex-col gap-1.5", sm ? "w-full mb-3" : "w-full mb-6")}>
      <div className={cn("flex items-center justify-between font-black uppercase italic", sm ? "text-[8px]" : "text-[10px]")}>
        <span className="text-gray-400">Stock Left: <span className="text-orange-primary">{stock}</span></span>
        <span className="text-[#1B5CFF]">Sold percentage: {soldPercent}%</span>
      </div>
      <div className={cn("w-full bg-gray-100 rounded-full overflow-hidden", sm ? "h-1" : "h-1.5")}>
        <div className="h-full bg-orange-primary" style={{ width: `${soldPercent}%` }} />
      </div>
    </div>
  );

  if (variant === 'featured') {
    return (
      <div 
        onClick={() => navigate(`/products/${product.id}`)}
        className="bg-white rounded-[5px] p-5 md:p-6 h-full flex flex-col md:flex-row gap-6 relative overflow-hidden group border border-[#e8edf2] hover:border-[#E8500A]/30 transition-all duration-300 cursor-pointer"
      >
         {/* Background accent */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl group-hover:scale-125 transition-transform duration-500" />
         
         <div className="relative z-20 flex-shrink-0 w-full md:w-[45%] xl:w-[40%] aspect-[16/10] md:h-full bg-gray-50 rounded-[5px] flex items-center justify-center p-3 md:p-4 overflow-hidden">
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                <button 
                  onClick={toggleSave}
                  className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center transition-transform hover:scale-105 z-20 shadow-none",
                    isSaved ? "bg-[#E8500A] border-[#E8500A] text-white" : "border-gray-200 text-[#E8500A] bg-white"
                  )}
                >
                   <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
                </button>
                <button 
                   onClick={handleCompare}
                   className={cn(
                     "w-8 h-8 rounded-full border flex items-center justify-center transition-transform hover:scale-105 z-20 shadow-none bg-white",
                     isInCompare ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-blue-600"
                   )}
                >
                   <Layers size={14} />
                 </button>
                 <button
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     if (comparedProducts.length >= 4) {
                       toast.error('Comparison limit reached (4 products max)');
                       return;
                     }
                     const alreadyAdded = comparedProducts.some((p: any) => String(p.id) === String(product.id));
                     if (alreadyAdded) {
                       toast('Already in comparison');
                       return;
                     }
                     setComparedProducts((prev: any[]) => [product, ...prev]);
                     toast.success('Added to compare!');
                   }}
                   title="Add to Compare"
                   className={cn(
                     "w-8 h-8 rounded-full border flex items-center justify-center transition-transform hover:scale-105 z-20 shadow-none bg-white",
                     isInCompare ? "bg-emerald-600 border-emerald-600 text-white" : "border-gray-200 text-blue-600"
                   )}
                 >
                   <LayoutGrid size={14} />
                 </button>
                 <button className="hidden" onClick={() => {}}>
                </button>
             </div>
            
            <ProductCardImageCarousel 
              images={getProductCardImages(product)} 
              alt={product.title} 
              containerClassName="absolute inset-0 p-3 md:p-4 z-10"
            />
         </div>
  
         <div className="relative z-10 flex-1 flex flex-col justify-center py-2 px-1">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{brandName}</span>
                  <div className="bg-[#E8500A]/10 text-[#E8500A] text-[9.5px] font-semibold px-2.5 py-1 rounded flex items-center gap-1 uppercase tracking-wide leading-none">
                     <Star size={11} className="fill-current text-[#E8500A]" /> FEATURED
                  </div>
               </div>
               {product.discount && (
                 <span className="bg-rose-500/10 text-rose-500 text-[10px] font-semibold px-2 px-1 rounded uppercase border border-rose-500/10 leading-none">{product.discount} OFF</span>
               )}
            </div>
            
            <h3 
              className="text-xl md:text-2xl font-semibold text-[#1a1a2e] uppercase tracking-tight leading-snug mb-4 group-hover:text-orange-primary transition-colors line-clamp-2"
              style={titleStyle}
            >
              {product.title}
            </h3>
 
            <div className="mb-4">
               <StockProgress sm />
            </div>
            
            <div className="flex items-end justify-between gap-4 pt-4 border-t border-gray-150 select-none shrink-0 w-full">
               <div className="flex flex-col text-left min-w-0">
                  <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest leading-none mb-1">SPECIAL VALUE</span>
                  <span className="text-2xl font-mono font-bold text-[#E8500A] leading-none whitespace-nowrap">BDT {product.price}</span>
               </div>
               
               <button 
                 type="button" 
                 onClick={(e) => { e.stopPropagation(); if (isGuideDetail) { navigate(`/products/${product.id}`); } else { const qty = mode === 'retail' ? 1 : (product.moq || 10); addToCart(product, qty); } }} 
                 className="w-10 h-10 rounded-full hover:bg-[#CF4400] text-white bg-[#E8500A] cursor-pointer transition-all duration-200 shrink-0 border-0 flex items-center justify-center shadow-md hover:scale-[1.05] active:scale-95"
                 aria-label={isGuideDetail ? 'Shop Now' : 'Add to cart'}
                 title={isGuideDetail ? 'Shop Now' : 'Add to cart'}
               >
                 {isGuideDetail ? <ArrowRight size={16} className="stroke-[2.5]" /> : <ShoppingCart size={16} className="stroke-[2.5]" />}
               </button>
            </div>
         </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        onClick={() => navigate(`/products/${product.id}`)}
        className="bg-white rounded-[5px] p-3 flex flex-col border border-[#e8edf2] hover:border-[#E8500A]/30 hover:scale-[1.01] transition-all duration-300 cursor-pointer group relative w-full min-h-[270px] md:min-h-[290px] h-full box-border animate-in fade-in"
      >
        <div 
          className="w-full h-[155px] md:h-[175px] bg-gray-50 rounded-[5px] relative overflow-hidden flex items-center justify-center p-1 md:p-1.5 select-none shrink-0"
          style={imageContainerStyle}
        >
            <div className="absolute top-2 left-2 z-25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
               <button 
                 onClick={toggleSave}
                 className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center transition-transform hover:scale-105 bg-white border-gray-100 shadow-none",
                    isSaved ? "text-[#E8500A]" : "text-gray-400 hover:text-[#E8500A]"
                 )}
               >
                  <Bookmark size={10} className={isSaved ? "fill-current" : ""} />
               </button>
               <button 
                 onClick={handleCompare}
                 className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center transition-transform hover:scale-105 bg-white border-gray-100 shadow-none",
                    isInCompare ? "text-green-600" : "text-gray-400 hover:text-blue-500"
                 )}
               >
                  <Layers size={10} />
               </button>
               <button
                 onClick={(e) => {
                   e.preventDefault();
                   e.stopPropagation();
                   if (comparedProducts.length >= 4) {
                     toast.error('Comparison limit reached (4 products max)');
                     return;
                   }
                   const alreadyAdded = comparedProducts.some((p: any) => String(p.id) === String(product.id));
                   if (alreadyAdded) {
                     toast('Already in comparison');
                     return;
                   }
                   setComparedProducts((prev: any[]) => [product, ...prev]);
                   toast.success('Added to compare!');
                 }}
                 title="Add to Compare"
                 className={cn(
                   "w-6 h-6 rounded-full border flex items-center justify-center transition-transform hover:scale-105 bg-white border-gray-100 shadow-none",
                   isInCompare ? "text-green-600" : "text-gray-400 hover:text-blue-500"
                 )}
               >
                 <LayoutGrid size={14} />
               </button>
               <button className="hidden" onClick={() => {}}>
               </button>
            </div>
            
            <ProductCardImageCarousel 
              images={getProductCardImages(product)} 
              alt={product.title} 
              containerClassName="absolute inset-0 p-1 md:p-1.5"
            />
        </div>
        
        <div className="flex flex-col pt-2 flex-grow min-h-0 text-left justify-between select-none">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between gap-1 w-full leading-none">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[80px]">{brandName}</span>
              <div className="flex items-center gap-0.5 shrink-0 ml-auto bg-gray-50 px-1 py-0.5 rounded leading-none">
                <Star size={7} className="fill-orange-primary text-orange-primary" />
                <span className="text-[8.5px] font-semibold text-gray-500">4.8</span>
              </div>
            </div>
            
            {mode === 'wholesale' && (
              <div className="flex flex-wrap gap-1 mt-0.5">
                <span className="bg-orange-primary/10 text-[#E8500A] text-[6.5px] font-semibold px-1 rounded uppercase tracking-wider leading-none">
                  Wholesale Approved
                </span>
              </div>
            )}

            <h4 className="text-[11px] font-semibold text-[#1a1a2e] leading-snug line-clamp-1 group-hover:text-orange-primary transition-colors min-h-[14px] truncate leading-none mt-1">
              {product.title}
            </h4>
          </div>
          
                    <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between gap-2.5 w-full select-none shrink-0 overflow-hidden">
             <div className="flex flex-col text-left min-w-0">
                <span className="text-[6.5px] font-medium text-gray-400 uppercase tracking-widest leading-none mb-1">
                  {mode === 'wholesale' ? 'Bulk Price' : 'Market Price'}
                </span>
                <div className="flex flex-col text-left justify-center">
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#E8500A] leading-none whitespace-nowrap">BDT {product.price.toLocaleString()}</span>
                  {product.originalPrice ? (
                    <span className="text-[8px] font-mono text-gray-400 line-through leading-none mt-0.5 whitespace-nowrap">৳{product.originalPrice}</span>
                  ) : (
                    <span className="text-[8px] font-mono text-transparent select-none leading-none mt-0.5 whitespace-nowrap">Placeholder</span>
                  )}
                </div>
             </div>
             
             <button 
                type="button" 
                onClick={(e) => { 
                  e.stopPropagation(); if (isGuideDetail) { navigate(`/products/${product.id}`); return; }
                  const qty = mode === 'retail' ? 1 : (product.moq || 10); 
                  addToCart(product, qty); 
                  toast.success(`Successfully added ${product.title} to your cart!`);
                }} 
                className="w-8 h-8 rounded-full hover:bg-[#CF4400] text-white bg-[#E8500A] cursor-pointer transition-all duration-200 shrink-0 border-0 flex items-center justify-center shadow-md hover:scale-[1.05] active:scale-95"
                aria-label={isGuideDetail ? 'Shop Now' : 'Add to cart'}
                title={isGuideDetail ? 'Shop Now' : 'Add to cart'}
             >
                {isGuideDetail ? <ArrowRight size={13} className="stroke-[2.5]" /> : <ShoppingCart size={13} className="stroke-[2.5]" />}
               </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    // Enrich with high fidelity reference-image properties
    const categoryLabel = product.categoryLabel || (product.category ? String(product.category).split('&')[0].trim().toUpperCase() : 'TECH');
    const ratingVal = product.rating || 4.7;
    const reviewsCountText = product.reviewsText || (product.reviews ? (product.reviews >= 1000 ? `${(product.reviews/1000).toFixed(1)}K` : `${product.reviews}`) : '120');
    const displayPrice = typeof product.price === 'string' ? parseFloat(product.price.replace(/,/g, '')) : product.price;
    const origPrice = product.originalPrice ? (typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice.replace(/,/g, '')) : product.originalPrice) : null;
    
    // Calculate saveText dynamically if not present
    let saveText = product.saveText;
    if (!saveText && origPrice && displayPrice) {
      const savings = origPrice - displayPrice;
      if (savings > 0) {
        const pct = Math.round((savings / origPrice) * 100);
        saveText = `Save ৳${savings.toLocaleString()} (${pct}%)`;
      }
    }
    if (!saveText) saveText = '—';

    // Specific high fidelity mapping for hearts and bookmarks based on reference image
    const heartsCount = product.hearts || (100 + (product.id * 77) % 1300);
    const bookmarksCount = product.bookmarks || (10 + (product.id * 31) % 400);

    // Specific high fidelity badges mapping
    let badges = product.badges;
    if (!badges) {
      badges = [];
      if (product.id === 1 || product.id === 7 || product.id === 1001 || product.id === 1007) {
        badges.push({ text: 'FEATURED', type: 'featured' });
      } else if (product.id === 2 || product.id === 1002) {
        badges.push({ text: 'BEST SELLER', type: 'bestseller' });
      } else if (product.id === 8 || product.id === 1008) {
        badges.push({ text: 'BEST DEAL', type: 'bestdeal' });
      } else if (product.id === 6 || product.id === 11 || product.id === 1006 || product.id === 1011 || product.tag === 'NEW') {
        badges.push({ text: 'NEW', type: 'new' });
      }

      if (origPrice && displayPrice) {
        const pct = Math.round(((origPrice - displayPrice) / origPrice) * 100);
        if (pct > 0) {
          badges.push({ text: `-${pct}%`, type: 'discount' });
        }
      }
    }

    return (
      <div 
        onClick={() => navigate(`/products/${product.id}`)}
        className="bg-white rounded-xl border border-gray-200 hover:border-[#FF5B00]/40 transition-all duration-300 flex flex-col md:flex-row gap-5 p-4 group cursor-pointer text-left hover:shadow-md relative overflow-hidden"
      >
        <div className="w-full md:w-44 h-44 bg-gray-50 rounded-xl relative overflow-hidden flex items-center justify-center p-2 select-none shrink-0">
          <ProductCardImageCarousel 
            images={getProductCardImages(product)} 
            alt={product.title} 
            containerClassName="absolute inset-0 p-2"
          />
          
          {/* Top-left Badges inside carousel */}
          <div className="absolute top-3 left-3 z-25 flex flex-wrap gap-1.5 pointer-events-none">
            {badges.map((badge, idx) => {
              let badgeStyle = "bg-gray-800 text-white";
              if (badge.type === 'featured') badgeStyle = "bg-[#0F172A] text-white";
              else if (badge.type === 'bestseller') badgeStyle = "bg-[#F97316] text-white";
              else if (badge.type === 'bestdeal') badgeStyle = "bg-[#F59E0B] text-white";
              else if (badge.type === 'new') badgeStyle = "bg-[#10B981] text-white";
              else if (badge.type === 'discount') badgeStyle = "bg-[#EF4444] text-white";
              
              return (
                <span 
                  key={idx} 
                  className={cn(
                    "text-[9px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide leading-none",
                    badgeStyle
                  )}
                >
                  {badge.type === 'featured' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                  {badge.text}
                </span>
              );
            })}
          </div>

          {/* Float Action buttons on hover */}
          <div className="absolute top-3 right-3 z-25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1.5">
            <button 
              onClick={toggleSave}
              className={cn(
                "w-7 h-7 rounded-full border flex items-center justify-center transition-transform hover:scale-105 bg-white border-gray-150 shadow-sm",
                isSaved ? "text-[#FF5B00] border-[#FF5B00]/20" : "text-gray-400 hover:text-[#FF5B00]"
              )}
            >
               <Bookmark size={12} className={isSaved ? "fill-current" : ""} />
            </button>
            <button 
              onClick={handleCompare}
              className={cn(
                 "w-7 h-7 rounded-full border flex items-center justify-center transition-transform hover:scale-105 bg-white border-gray-150 shadow-sm",
                 isInCompare ? "text-green-600 border-green-200" : "text-gray-400 hover:text-blue-500"
              )}
            >
               <Layers size={12} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">
              {categoryLabel}
            </div>
            
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-snug line-clamp-2 group-hover:text-[#FF5B00] transition-colors mb-2">
              {product.title}
            </h3>

            <div className="flex items-center gap-1 select-none mb-4">
              <Star size={14} className="fill-[#F97316] text-[#F97316]" />
              <span className="text-xs font-bold text-gray-800 ml-0.5">{ratingVal}</span>
              <span className="text-xs font-medium text-gray-400">({reviewsCountText})</span>
            </div>

            {mode === 'wholesale' && (
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="bg-[#FF5B00]/10 text-[#FF5B00] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wide leading-none">
                  WHOLESALE APPROVED
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 pt-3 border-t border-gray-100">
            <div className="flex flex-col text-left">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-[#EF4444]">৳{displayPrice.toLocaleString()}</span>
                {origPrice && (
                  <span className="text-xs font-bold text-gray-300 line-through">৳{origPrice.toLocaleString()}</span>
                )}
              </div>
              <div className="text-xs font-bold text-[#10B981] mt-0.5">
                {saveText}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-gray-400">
                <button 
                  onClick={toggleSave}
                  className="flex items-center gap-1.5 hover:text-[#FF5B00] transition-colors bg-transparent border-0 cursor-pointer p-0"
                >
                  <Heart size={15} className={isSaved ? "fill-[#FF5B00] text-[#FF5B00]" : ""} />
                  <span className="text-xs font-bold">{heartsCount.toLocaleString()}</span>
                </button>
                <span className="text-gray-200">|</span>
                <button 
                  onClick={handleCompare}
                  className="flex items-center gap-1.5 hover:text-blue-500 transition-colors bg-transparent border-0 cursor-pointer p-0"
                >
                  <Layers size={14} className={isInCompare ? "text-green-500" : ""} />
                  <span className="text-xs font-bold">{bookmarksCount.toLocaleString()}</span>
                </button>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); if (isGuideDetail) { navigate(`/products/${product.id}`); return; }
                  const qty = mode === 'retail' ? 1 : (product.moq || 10);
                  addToCart(product, qty);
                  toast.success(`Successfully added ${product.title} to your cart!`);
                }}
                className="w-10 h-10 rounded-full hover:bg-[#E04F00] text-white bg-[#FF5B00] cursor-pointer transition-all duration-200 shrink-0 border-0 flex items-center justify-center shadow-md hover:scale-105 active:scale-95"
                aria-label={isGuideDetail ? 'Shop Now' : 'Add to cart'}
                title={isGuideDetail ? 'Shop Now' : 'Add to cart'}
              >
                {isGuideDetail ? <ArrowRight size={16} className="stroke-[2.5]" /> : <ShoppingCart size={16} className="stroke-[2.5]" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enrich with high fidelity reference-image properties
  const categoryLabel = product.categoryLabel || (product.category ? String(product.category).split('&')[0].trim().toUpperCase() : 'TECH');
  const ratingVal = product.rating || 4.7;
  const reviewsCountText = product.reviewsText || (product.reviews ? (product.reviews >= 1000 ? `${(product.reviews/1000).toFixed(1)}K` : `${product.reviews}`) : '120');
  const displayPrice = typeof product.price === 'string' ? parseFloat(product.price.replace(/,/g, '')) : product.price;
  const origPrice = product.originalPrice ? (typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice.replace(/,/g, '')) : product.originalPrice) : null;
  
  // Calculate saveText dynamically if not present
  let saveText = product.saveText;
  if (!saveText && origPrice && displayPrice) {
    const savings = origPrice - displayPrice;
    if (savings > 0) {
      const pct = Math.round((savings / origPrice) * 100);
      saveText = `Save ৳${savings.toLocaleString()} (${pct}%)`;
    }
  }
  if (!saveText) saveText = '—';

  // Specific high fidelity mapping for hearts and bookmarks based on reference image
  const heartsCount = product.hearts || (100 + (product.id * 77) % 1300);
  const bookmarksCount = product.bookmarks || (10 + (product.id * 31) % 400);

  // Specific high fidelity badges mapping
  let badges = product.badges;
  if (!badges) {
    badges = [];
    if (product.id === 1 || product.id === 7 || product.id === 1001 || product.id === 1007) {
      badges.push({ text: 'FEATURED', type: 'featured' });
    } else if (product.id === 2 || product.id === 1002) {
      badges.push({ text: 'BEST SELLER', type: 'bestseller' });
    } else if (product.id === 8 || product.id === 1008) {
      badges.push({ text: 'BEST DEAL', type: 'bestdeal' });
    } else if (product.id === 6 || product.id === 11 || product.id === 1006 || product.id === 1011 || product.tag === 'NEW') {
      badges.push({ text: 'NEW', type: 'new' });
    }

    if (origPrice && displayPrice) {
      const pct = Math.round(((origPrice - displayPrice) / origPrice) * 100);
      if (pct > 0) {
        badges.push({ text: `-${pct}%`, type: 'discount' });
      }
    }
  }

  const isCustomFluid = !isDashboard && !isGuideDetail;

  return (
    <div 
      className={cn(
        "bg-white rounded-xl border border-gray-200 hover:border-[#FF5B00]/40 hover:shadow-md transition-all duration-300 group flex flex-col relative p-3 overflow-hidden cursor-pointer w-full text-left"
      )}
      onClick={() => navigate(`/products/${product.id}`)}
      id={`product-${product.id}`}
      style={isCustomFluid ? undefined : {
        boxSizing: 'border-box' as const,
        width: isDashboard ? '199.5px' : '229.328px',
        height: isDashboard ? '268.5px' : '411px'
      }}
    >
      {/* Badges and Image carousel */}
      <div className={cn(
        "relative w-full bg-gray-50 overflow-hidden flex items-center justify-center rounded-lg shrink-0",
        isDashboard ? "h-[120px] p-1" : "h-[160px] p-2"
      )}>
        <ProductCardImageCarousel 
          images={getProductCardImages(product)} 
          alt={product.title} 
          containerClassName="absolute inset-0 p-2"
        />

        {/* Top-left Badge Pills */}
        <div className="absolute top-2 left-2 z-25 flex flex-wrap gap-1 pointer-events-none">
          {badges.map((badge, idx) => {
            let badgeStyle = "bg-gray-800 text-white";
            if (badge.type === 'featured') badgeStyle = "bg-[#0F172A] text-white";
            else if (badge.type === 'bestseller') badgeStyle = "bg-[#F97316] text-white";
            else if (badge.type === 'bestdeal') badgeStyle = "bg-[#F59E0B] text-white";
            else if (badge.type === 'new') badgeStyle = "bg-[#10B981] text-white";
            else if (badge.type === 'discount') badgeStyle = "bg-[#EF4444] text-white";
            
            return (
              <span 
                key={idx} 
                className={cn(
                  "text-[8px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wide leading-none",
                  badgeStyle
                )}
              >
                {badge.type === 'featured' && <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />}
                {badge.text}
              </span>
            );
          })}
        </div>

        {/* Saved/Compare Quick action overlay on Hover */}
        <div className="absolute top-2 right-2 z-25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
          <button 
            onClick={toggleSave}
            className={cn(
              "w-6 h-6 rounded-full border flex items-center justify-center bg-white border-gray-150 shadow-sm transition-transform hover:scale-105",
              isSaved ? "text-[#FF5B00] border-[#FF5B00]/15" : "text-gray-400 hover:text-[#FF5B00]"
            )}
          >
             <Bookmark size={10} className={isSaved ? "fill-current" : ""} />
          </button>
          <button 
            onClick={handleCompare}
            className={cn(
              "w-6 h-6 rounded-full border flex items-center justify-center bg-white border-gray-150 shadow-sm transition-transform hover:scale-105",
              isInCompare ? "text-green-500 border-green-200" : "text-gray-400 hover:text-blue-500"
            )}
          >
             <Layers size={10} />
          </button>
        </div>
      </div>
      
      {/* Product Information */}
      <div className="pt-2 flex flex-col flex-grow min-h-0 justify-between">
        <div>
          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
            {categoryLabel}
          </div>

          <h3 className={cn(
            "font-extrabold text-gray-900 group-hover:text-[#FF5B00] transition-colors leading-tight mb-1 line-clamp-2",
            isDashboard ? "text-[11px]" : "text-[13px]"
          )}>
            {product.title}
          </h3>

          <div className="flex items-center gap-1 select-none mb-1.5">
            <Star size={11} className="fill-[#F97316] text-[#F97316]" />
            <span className="text-[10px] font-bold text-gray-800">{ratingVal}</span>
            <span className="text-[10px] font-medium text-gray-400">({reviewsCountText})</span>
          </div>

          {/* New Recommendation Snapshot Section for Guide Detail */}
          {isGuideDetail && (() => {
             const recData = getRecommendationData(product);
             return (
                <div className="mt-2 pt-1.5 border-t border-dashed border-gray-200 text-left">
                   <div className="text-[7.5px] font-black text-[#FF5B00] uppercase tracking-wider mb-1 leading-none font-mono">
                      RECOMMENDATION ON THIS
                   </div>
                   <div className="flex flex-wrap gap-1 max-h-[30px] overflow-hidden leading-none">
                      {recData.tags.map((tag) => (
                         <span key={tag} className="px-1 py-0.5 text-[6.5px] font-bold bg-[#FF5B00]/5 text-[#FF5B00] rounded-full uppercase tracking-wider font-sans border border-[#FF5B00]/10 whitespace-nowrap inline-block">
                            {tag}
                         </span>
                      ))}
                   </div>
                   {recData.verdict && (
                      <p className="text-[8px] font-semibold text-gray-500 italic mt-1 line-clamp-1 leading-snug">
                         "{recData.verdict}"
                      </p>
                   )}
                </div>
             );
          })()}
        </div>
        
        {/* Pricing & Footer Actions */}
        <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col gap-2">
          {/* Prices Row */}
          <div className="flex flex-col text-left min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[14px] font-black text-[#EF4444] leading-none whitespace-nowrap">
                ৳{displayPrice.toLocaleString()}
              </span>
              {origPrice && (
                <span className="text-[10px] font-bold text-gray-300 line-through leading-none whitespace-nowrap">
                  ৳{origPrice.toLocaleString()}
                </span>
              )}
            </div>
            <div className="text-[10px] font-bold text-[#10B981] mt-0.5 leading-none">
              {saveText}
            </div>
          </div>

          {/* Social icons & Add to Cart */}
          <div className="flex items-center justify-between gap-1 mt-1">
            <div className="flex items-center gap-2 text-gray-400 shrink-0">
              <button 
                onClick={toggleSave}
                className="flex items-center gap-1 hover:text-[#FF5B00] transition-colors bg-transparent border-0 cursor-pointer p-0"
                title="Heart"
              >
                <Heart size={12} className={isSaved ? "fill-[#FF5B00] text-[#FF5B00]" : ""} />
                <span className="text-[9.5px] font-bold">{heartsCount.toLocaleString()}</span>
              </button>
              <span className="text-gray-200 text-[10px]">|</span>
              <button 
                onClick={handleCompare}
                className="flex items-center gap-1 hover:text-blue-500 transition-colors bg-transparent border-0 cursor-pointer p-0"
                title="Bookmark"
              >
                <Bookmark size={11} className={isSaved ? "fill-current text-[#FF5B00]" : ""} />
                <span className="text-[9.5px] font-bold">{bookmarksCount.toLocaleString()}</span>
              </button>
            </div>

            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation(); if (isGuideDetail) { navigate(`/products/${product.id}`); return; }
                const qty = mode === 'retail' ? 1 : (product.moq || 10);
                addToCart(product, qty);
                toast.success(`Successfully added ${product.title} to your cart!`);
              }}
              className="w-7 h-7 rounded-full hover:bg-[#E04F00] text-white bg-[#FF5B00] cursor-pointer transition-all duration-200 shrink-0 border-0 flex items-center justify-center shadow-md hover:scale-105 active:scale-95 p-0"
              aria-label={isGuideDetail ? 'Shop Now' : 'Add to cart'}
              title={isGuideDetail ? 'Shop Now' : 'Add to cart'}
            >
               {isGuideDetail ? <ArrowRight size={11} className="stroke-[2.5]" /> : <ShoppingCart size={11} className="stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

