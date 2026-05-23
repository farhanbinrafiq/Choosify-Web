import React from 'react';
import { Star, Heart, ExternalLink, Bookmark, ArrowRight, Layers, ImageOff, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useDashboard } from '../context/DashboardContext';
import { useGlobalState } from '../context/GlobalStateContext';
import { PLACEHOLDER_IMAGE } from '../constants';
import toast from 'react-hot-toast';

export function ProductCard({ 
  product, 
  variant = 'grid',
  showCountdown = false
}: { 
  product: any, 
  variant?: 'grid' | 'list' | 'compact' | 'featured',
  showCountdown?: boolean,
  key?: React.Key
}) {
  const navigate = useNavigate();
  const { savedProducts, setSavedProducts, addToCompare, comparedProducts } = useDashboard();
  const { mode, allBrands, addToCart } = useGlobalState();

  const brandObj = allBrands?.find((b: any) => b.id === product.brandId);
  const brandName = brandObj ? brandObj.name : (product.brand || 'APEX');
  
  const isSaved = savedProducts.some(p => p.id === product.id);
  const isInCompare = comparedProducts.some(p => p.id === product.id);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  };

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
        className="bg-white rounded-[32px] p-5 md:p-6 h-full flex flex-col md:flex-row gap-6 relative overflow-hidden group shadow-3xl cursor-pointer border border-gray-100"
      >
         {/* Background accent */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
         
         <div className="relative z-20 flex-shrink-0 w-full md:w-[65%] aspect-[16/10] md:h-full bg-[#f8fafc] rounded-[24px] flex items-center justify-center p-8 overflow-hidden">
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <button 
                  onClick={toggleSave}
                  className={cn(
                    "w-10 h-10 rounded-full border flex items-center justify-center shadow-xl group-hover:scale-110 transition-all",
                    isSaved ? "bg-[#F96500] border-[#F96500] text-white" : "border-[#F96500]/20 text-[#F96500] bg-white"
                  )}
                >
                   <Bookmark size={20} className={isSaved ? "fill-current" : ""} />
                </button>
                <button 
                   onClick={handleCompare}
                   className={cn(
                     "w-10 h-10 rounded-full border flex items-center justify-center transition-all bg-white shadow-xl group-hover:scale-110",
                     isInCompare ? "bg-[#07DD05] border-[#07DD05] text-white" : "border-[#1B5CFF]/20 text-[#1B5CFF]"
                   )}
                >
                   <Layers size={20} />
                </button>
             </div>
            
            <img 
              src={product.image} 
              loading="lazy"
              onError={handleImageError}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-1000 relative z-10" 
              alt={product.title} 
            />
         </div>
  
         <div className="relative z-10 flex-1 flex flex-col justify-center py-4 px-2">
            <div className="flex items-center justify-between mb-5">
               <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic">{brandName}</span>
                  <div className="bg-[#FF5B00] text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 italic uppercase tracking-[0.1em] shadow-orange-primary/20 leading-none">
                     <Star size={12} className="fill-current" /> FEATURED
                  </div>
               </div>
               {product.discount && (
                 <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-4 py-2 rounded-full uppercase italic border border-rose-500/10 leading-none">{product.discount} OFF</span>
               )}
            </div>
            
            <h3 className="text-2xl md:text-4xl font-black text-navy uppercase italic tracking-tighter leading-[1.1] mb-6 group-hover:text-orange-primary transition-colors line-clamp-3">
              {product.title}
            </h3>

            <div className="mb-8">
               <StockProgress sm />
            </div>
            
            <div className="flex items-end justify-between gap-6 pt-6 border-t border-gray-100">
               <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic text-left leading-none">ULTIMATE OFFER</span>
                  <span className="text-4xl font-black text-[#FF5B00] italic leading-none tracking-tighter">BDT {product.price}</span>
               </div>
               
               <button type="button" onClick={(e) => { e.stopPropagation(); const qty = mode === 'retail' ? 1 : (product.moq || 10); addToCart(product, qty); }} className="flex flex-col items-center group/btn-featured-mini shrink-0">
                  <div className="w-14 h-14 rounded-full border-2 border-[#1B5CFF] flex items-center justify-center text-[#1B5CFF] group-hover/btn-featured-mini:bg-[#1B5CFF] group-hover/btn-featured-mini:text-white transition-all shadow-xl active:scale-90">
                     <Plus size={24} />
                  </div>
                  <span className="text-[10px] font-black text-[#1B5CFF] uppercase mt-2 tracking-widest italic">{mode === 'retail' ? 'Add To Cart' : `Bulk Add (${product.moq || 10})`}</span>
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
        className="bg-white rounded-[15px] p-4 flex flex-col gap-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative h-full"
      >
        <div className="w-full aspect-square bg-gray-50 rounded-[12px] relative overflow-hidden flex items-center justify-center p-3">
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
               <button 
                 onClick={toggleSave}
                 className={cn(
                    "w-7 h-7 rounded-full border flex items-center justify-center shadow-sm hover:scale-110 transition-transform",
                    isSaved ? "bg-[#F96500] border-[#F96500] text-white" : "bg-white border-gray-100 text-[#F96500]"
                 )}
               >
                  <Bookmark size={12} className={isSaved ? "fill-current" : ""} />
               </button>
               <button 
                 onClick={handleCompare}
                 className={cn(
                    "w-7 h-7 rounded-full border flex items-center justify-center shadow-sm hover:scale-110 transition-transform",
                    isInCompare ? "bg-[#07DD05] border-[#07DD05] text-white" : "bg-white border-gray-100 text-[#1B5CFF]"
                 )}
               >
                  <Layers size={12} />
               </button>
            </div>
           <img 
             src={product.image} 
             loading="lazy"
             onError={handleImageError}
             className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
             alt={product.title} 
           />
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{brandName}</span>
            <div className={cn("text-[8px] font-black text-white px-3 py-1 rounded-full uppercase tracking-tighter leading-none italic bg-orange-primary", product.tagColor)}>
              {product.tag || 'HOT'}
            </div>
          </div>
          {mode === 'wholesale' && (
            <div className="flex flex-wrap gap-1">
              <span className="bg-[#FF5B00] text-white text-[6px] font-black px-1 py-0.5 rounded uppercase tracking-tighter italic">
                WHOLESALE
              </span>
              <span className="bg-[#FF5B00]/10 text-[#FF5B00] border border-[#FF5B00]/10 text-[6px] font-black px-1 py-0.5 rounded uppercase tracking-tighter italic">
                DISTRIBUTOR
              </span>
            </div>
          )}
          <h4 className="text-[11px] font-black text-navy leading-tight line-clamp-2 min-h-[2.2em] group-hover:text-orange-primary transition-colors">
            {product.title}
          </h4>
          
          <StockProgress sm />
          
          <div className="flex items-center justify-between gap-2 mt-auto pt-2.5 border-t border-gray-100 w-full select-none">
             <div className="flex flex-col text-left justify-center shrink-0">
                <span className="text-[14px] font-black text-orange-primary italic leading-none">BDT {product.price}</span>
                {product.originalPrice && (
                  <span className="text-[9.5px] font-mono font-bold text-gray-400 line-through mt-1 leading-none">৳{product.originalPrice}</span>
                )}
             </div>
             <button 
               type="button" 
               onClick={(e) => { 
                 e.stopPropagation(); 
                 const qty = mode === 'retail' ? 1 : (product.moq || 10); 
                 addToCart(product, qty); 
                 toast.success(`Successfully added ${product.title} to your verification basket!`);
               }} 
               className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF5B00] to-[#E8500A] text-white flex flex-col items-center justify-center shrink-0 hover:scale-[1.05] active:scale-[0.96] transition-transform shadow-md border-0 pointer-events-auto"
               aria-label="Add to cart"
             >
                {mode === 'retail' ? (
                   <>
                      <span className="text-[7.5px] font-black uppercase font-space tracking-tight leading-none">Add To</span>
                      <span className="text-[7.5px] font-black uppercase font-space tracking-tight leading-none mt-0.5">Cart</span>
                   </>
                ) : (
                   <>
                      <span className="text-[7.5px] font-black uppercase font-space tracking-tight leading-none">Bulk</span>
                      <span className="text-[7.5px] font-black uppercase font-space tracking-tight leading-none mt-0.5">Add</span>
                   </>
                )}
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="bg-white rounded-[15px] shadow-sm flex gap-6 p-5 hover:shadow-2xl transition-all group border border-gray-100 cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
        <div className="w-40 h-40 flex-shrink-0 bg-gray-50 rounded-[12px] relative overflow-hidden flex items-center justify-center p-4">
          <img 
            src={product.image} 
            alt={product.title} 
            loading="lazy"
            onError={handleImageError}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
            <button 
              onClick={toggleSave}
              className={cn(
                "w-8 h-8 rounded-full border flex items-center justify-center shadow-sm transition-all",
                isSaved ? "bg-[#F96500] border-[#F96500] text-white" : "bg-white border-gray-100 text-[#F96500]"
              )}
            >
               <Bookmark size={14} className={isSaved ? "fill-current" : ""} />
            </button>
            <button 
              onClick={handleCompare}
              className={cn(
                 "w-8 h-8 rounded-full border flex items-center justify-center shadow-sm transition-all",
                 isInCompare ? "bg-[#07DD05] border-[#07DD05] text-white" : "bg-white border-gray-100 text-[#1B5CFF]"
              )}
            >
               <Layers size={14} />
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col py-1">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{brandName}</span>
            <div className={cn("text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-tighter leading-none italic bg-[#FF5B00]", product.tagColor)}>
              {product.tag || 'HOT'}
            </div>
          </div>
          {mode === 'wholesale' && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="bg-gradient-to-r from-[#FF5B00] to-[#FF7A00] text-white text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-tighter italic">
                WHOLESALE
              </span>
              <span className="bg-[#FF5B00]/10 text-[#FF5B00] border border-[#FF5B00]/20 text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-tighter italic">
                BULK PRICE
              </span>
              <span className="bg-[#0A0B1E] text-[#FF5B00] border border-[#FF5B00]/20 text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-tighter italic">
                DISTRIBUTOR
              </span>
              <span className="bg-orange-primary/5 text-orange-primary/80 text-[7px] font-black px-2 py-0.5 rounded uppercase tracking-tighter italic">
                SUPPLIER APPROVED
              </span>
            </div>
          )}
          <h3 className="text-lg font-black text-navy leading-tight line-clamp-1 mb-2 group-hover:text-orange-primary transition-colors uppercase italic tracking-tighter">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={cn(i < Math.floor(product.rating || 4) ? "fill-orange-primary text-orange-primary" : "text-gray-100")} />
            ))}
            <span className="text-[10px] text-gray-400 font-black ml-1 tracking-tighter uppercase">( {product.reviews || 0} REVIEWS )</span>
          </div>

          <StockProgress />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-orange-primary italic leading-none">BDT {product.price}</span>
              {product.originalPrice && (
                <span className="text-[14px] text-gray-300 line-through font-black italic">BDT {product.originalPrice}</span>
              )}
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const qty = mode === 'retail' ? 1 : (product.moq || 10);
                addToCart(product, qty);
              }}
              className="flex items-center gap-3 px-10 py-3.5 bg-[#1B5CFF] hover:bg-orange-primary text-white rounded-xl text-[12px] font-black uppercase tracking-widest italic shadow-xl shadow-blue-500/20 hover:scale-105 transition-all w-full sm:w-auto justify-center"
            >
              {mode === 'retail' ? 'ADD TO RETAIL CART' : `BULK ADD (${product.moq || 10} units)`} <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-[20px] shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full relative border border-gray-100 overflow-hidden cursor-pointer" 
      onClick={() => navigate(`/products/${product.id}`)}
      id={`product-${product.id}`}
    >
      <div className="relative aspect-[1/1.1] bg-[#F9FAFB] overflow-hidden flex items-center justify-center p-5 mt-2 mx-2 rounded-[15px]">
        <img 
          src={product.image} 
          alt={product.title} 
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <button 
            onClick={toggleSave}
            className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center shadow-sm hover:scale-110 transition-transform",
              isSaved ? "bg-[#F96500] border-[#F96500] text-white" : "bg-white border-gray-100 text-[#F96500]"
            )}
          >
             <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
          </button>
          <button 
            onClick={handleCompare}
            className={cn(
               "w-10 h-10 rounded-full border flex items-center justify-center shadow-sm hover:scale-110 transition-transform",
               isInCompare ? "bg-[#07DD05] border-[#07DD05] text-white" : "bg-white border-gray-100 text-[#1B5CFF]"
            )}
          >
             <Layers size={18} />
          </button>
        </div>
        {product.tag && (
          <div className={cn("absolute top-4 right-4 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter leading-none italic shadow-md", product.tagColor || "bg-orange-primary")}>
            {product.tag}
          </div>
        )}
        
        {showCountdown && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-3 bg-white/80 backdrop-blur-md py-2 rounded-full border border-white/40 shadow-xl z-20">
             <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-navy italic leading-none">08</span>
                <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">hrs</span>
             </div>
             <div className="w-px h-3 bg-gray-200" />
             <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-orange-primary italic leading-none">42</span>
                <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">min</span>
             </div>
             <div className="w-px h-3 bg-gray-200" />
             <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-navy italic leading-none">12</span>
                <span className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">sec</span>
             </div>
          </div>
        )}
      </div>
      
      <div className="p-6 pb-8 flex flex-col flex-1">
        {mode === 'wholesale' && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            <span className="bg-gradient-to-r from-[#FF5B00] to-[#FF7A00] text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter italic">
              WHOLESALE
            </span>
            <span className="bg-[#FF5B00]/10 text-[#FF5B00] border border-[#FF5B00]/20 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter italic">
              BULK PRICE
            </span>
            <span className="bg-[#0A0A1F] text-[#FF5B00] border border-[#FF5B00]/20 text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter italic">
              SUPPLIER
            </span>
          </div>
        )}
        <h3 className="text-[14px] font-black text-navy line-clamp-2 mb-2 group-hover:text-orange-primary transition-colors min-h-[40px] leading-tight tracking-tighter uppercase italic">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-3 mb-4 w-full">
          <span className="text-orange-primary font-black uppercase text-[9px] tracking-[0.2em]">{brandName}</span>
          <div className="w-1 h-1 bg-gray-100 rounded-full animate-ping" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={8} className={cn(i < Math.floor(product.rating || 4) ? "fill-orange-primary text-orange-primary" : "text-gray-200")} />
            ))}
            <span className="text-[9px] font-bold text-gray-400 ml-1">4.8</span>
          </div>
          {mode === 'wholesale' && product.moq && (
            <span className="ml-auto bg-navy text-[#FF5B00] border border-[#FF5B00]/20 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter italic">
              MOQ {product.moq} Pcs
            </span>
          )}
        </div>

        <div className="mb-6">
          <StockProgress sm />
        </div>

        {/* Display bulk slabs information on the card for quick selection */}
        {mode === 'wholesale' && product.pricingTiers && (
          <div className="mb-4 bg-[#F8FAFC] border border-gray-100 rounded-xl p-2.5">
            <div className="text-[7.5px] font-black text-navy uppercase tracking-widest mb-1 italic">Business Wholesale Slabs:</div>
            <div className="flex items-center gap-2 justify-between">
              {product.pricingTiers.slice(0, 3).map((tier: any, tIdx: number) => (
                <div key={tIdx} className="bg-white border border-gray-100 rounded-lg p-1 text-center flex-1 max-w-[70px]">
                  <div className="text-[6.5px] font-black text-gray-400 uppercase tracking-tight">{tier.minQuantity}+ Pcs</div>
                  <div className="text-[8.5px] font-black font-mono text-[#FF5B00]">৳{tier.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
             <span className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest leading-none mb-1 text-left">
               {mode === 'wholesale' ? 'Active Slab Price' : 'Market Price'}
             </span>
             <div className="flex items-center gap-2">
                <span className="text-[18px] font-black text-orange-primary italic leading-none whitespace-nowrap">
                  BDT {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-[9px] font-bold text-gray-400 uppercase italic line-through whitespace-nowrap opacity-60">৳{product.originalPrice}</span>
                )}
             </div>
          </div>
          
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const qty = mode === 'retail' ? 1 : (product.moq || 10);
              addToCart(product, qty);
            }}
            className="h-10 px-6 shrink-0 rounded-full bg-[#FF5B00] text-white flex items-center justify-center gap-2 hover:bg-navy transition-all shadow-xl shadow-orange-primary/10 active:scale-95 w-full sm:w-auto"
          >
             <span className="text-[9px] font-black uppercase tracking-widest italic leading-none">
               {mode === 'wholesale' ? `Bulk Add (${product.moq || 10})` : 'Add To Cart'}
             </span>
             <Plus size={12} />
          </button>
        </div>
      </div>

    </div>
  );
}

