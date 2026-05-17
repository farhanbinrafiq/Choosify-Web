import React from 'react';
import { Star, Heart, ExternalLink, Bookmark, ArrowRight, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useDashboard } from '../context/DashboardContext';
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
        className="bg-white rounded-[32px] p-5 md:p-6 h-full flex flex-col md:flex-row gap-6 relative overflow-hidden group shadow-3xl cursor-pointer border border-gray-100"
      >
         {/* Background accent */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
         
         <div className="relative z-20 flex-shrink-0 w-full md:w-[40%] aspect-square md:aspect-auto md:h-full bg-gray-50 rounded-[20px] flex items-center justify-center p-6 overflow-hidden">
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                <button 
                  onClick={toggleSave}
                  className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center shadow-xl group-hover:scale-110 transition-all",
                    isSaved ? "bg-[#F96500] border-[#F96500] text-white" : "border-[#F96500]/20 text-[#F96500] bg-white"
                  )}
                >
                   <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
                </button>
                <button 
                   onClick={handleCompare}
                   className={cn(
                     "w-8 h-8 rounded-full border flex items-center justify-center transition-all bg-white shadow-xl group-hover:scale-110",
                     isInCompare ? "bg-[#07DD05] border-[#07DD05] text-white" : "border-[#1B5CFF]/20 text-[#1B5CFF]"
                   )}
                >
                   <Layers size={16} />
                </button>
             </div>
            
            <img 
              src={product.image} 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000 relative z-10" 
              alt={product.title} 
            />
         </div>
  
         <div className="relative z-10 flex-1 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{product.brand || 'APEX'}</span>
                  <div className="bg-[#FF5B00] text-white text-[8px] font-black px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 italic uppercase tracking-[0.1em] shadow-orange-primary/20">
                     <Star size={10} className="fill-current" /> FEATURED
                  </div>
               </div>
               {product.discount && (
                 <span className="bg-rose-500/10 text-rose-500 text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic border border-rose-500/10">{product.discount} OFF</span>
               )}
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black text-navy uppercase italic tracking-tighter leading-none mb-6 group-hover:text-orange-primary transition-colors">
              {product.title}
            </h3>

            <div className="mb-6">
               <StockProgress sm />
            </div>
            
            <div className="flex items-end justify-between gap-4">
               <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic text-left">ULTIMATE OFFER</span>
                  <span className="text-3xl font-black text-[#FF5B00] italic leading-none tracking-tighter">BDT {product.price}</span>
               </div>
               
               <button className="flex flex-col items-center group/btn-featured-mini shrink-0">
                  <div className="w-12 h-12 rounded-full border-2 border-[#1B5CFF] flex items-center justify-center text-[#1B5CFF] group-hover/btn-featured-mini:bg-[#1B5CFF] group-hover/btn-featured-mini:text-white transition-all shadow-lg active:scale-90">
                     <ArrowRight size={20} className="-rotate-45" />
                  </div>
                  <span className="text-[9px] font-black text-[#1B5CFF] uppercase mt-1.5 tracking-[0.1em] italic">Go Buy</span>
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
        className="bg-white rounded-[15px] p-4 flex flex-col gap-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative"
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
           <img src={product.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={product.title} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">{product.brand || 'APEX'}</span>
            <div className={cn("text-[8px] font-black text-white px-3 py-1 rounded-full uppercase tracking-tighter leading-none italic bg-orange-primary", product.tagColor)}>
              {product.tag || 'HOT'}
            </div>
          </div>
          <h4 className="text-[11px] font-black text-navy leading-tight line-clamp-2 min-h-[2.2em] group-hover:text-orange-primary transition-colors">
            {product.title}
          </h4>
          
          <StockProgress sm />
          
          <div className="flex items-center justify-between gap-4 mt-2">
             <span className="text-[15px] font-black text-orange-primary italic leading-none shrink-0">BDT {product.price}</span>
             <button className="flex flex-col items-center group/btn-mini shrink-0">
                <div className="w-9 h-9 rounded-full border border-[#1B5CFF] flex items-center justify-center text-[#1B5CFF] group-hover/btn-mini:bg-[#1B5CFF] group-hover/btn-mini:text-white transition-all shadow-md">
                   <ArrowRight size={16} className="-rotate-45" />
                </div>
                <span className="text-[8px] font-black text-[#1B5CFF] uppercase mt-1.5 tracking-tighter italic">Go Buy</span>
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
          <img src={product.image} alt={product.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
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
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{product.brand || 'APEX'}</span>
            <div className={cn("text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-tighter leading-none italic bg-[#FF5B00]", product.tagColor)}>
              {product.tag || 'HOT'}
            </div>
          </div>
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
            <button className="flex items-center gap-3 px-10 py-3.5 bg-[#1B5CFF] text-white rounded-xl text-[12px] font-black uppercase tracking-widest italic shadow-xl shadow-blue-500/20 hover:scale-105 transition-all w-full sm:w-auto justify-center">
              GO BUY NOW <ArrowRight size={16} className="-rotate-45" />
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
        <h3 className="text-[14px] font-black text-navy line-clamp-2 mb-2 group-hover:text-orange-primary transition-colors min-h-[40px] leading-tight tracking-tighter uppercase italic">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="text-orange-primary font-black uppercase text-[9px] tracking-[0.2em]">{product.brand || 'CHOSEN'}</span>
          <div className="w-1 h-1 bg-gray-100 rounded-full" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={8} className={cn(i < Math.floor(product.rating || 4) ? "fill-orange-primary text-orange-primary" : "text-gray-200")} />
            ))}
            <span className="text-[9px] font-bold text-gray-400 ml-1">4.8</span>
          </div>
        </div>

        <div className="mb-6">
          <StockProgress sm />
        </div>
        
        <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
             <span className="text-[9px] font-black text-gray-300 uppercase italic tracking-widest leading-none mb-1 text-left">Market Price</span>
             <div className="flex items-center gap-2">
                <span className="text-[18px] font-black text-orange-primary italic leading-none whitespace-nowrap">BDT {product.price}</span>
                {product.originalPrice && (
                  <span className="text-[9px] font-bold text-gray-400 uppercase italic line-through whitespace-nowrap opacity-60">৳{product.originalPrice}</span>
                )}
             </div>
          </div>
          
          <button className="h-10 px-6 shrink-0 rounded-full bg-navy text-white flex items-center justify-center gap-2 group-hover:bg-orange-primary transition-all shadow-xl shadow-navy/10 active:scale-95 w-full sm:w-auto">
             <span className="text-[9px] font-black uppercase tracking-widest italic">Details</span>
             <ArrowRight size={14} className="-rotate-45" />
          </button>
        </div>
      </div>

    </div>
  );
}

