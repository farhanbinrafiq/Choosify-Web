import React, { useState } from 'react';
import { 
  Zap, Info, Star, ShieldCheck, ShoppingBag, 
  ChevronDown, ChevronUp, Plus, X, Sparkles,
  Trophy, Medal, Activity, Scale, CreditCard,
  Truck, ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ComparisonMetric {
  label: string;
  subLabel?: string;
  values: string[];
  type?: 'text' | 'rating' | 'score' | 'tag' | 'badge';
  highlight?: boolean;
}

interface ComparisonSection {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  metrics: ComparisonMetric[];
}

export function CompareEngine() {
  const [selectedProducts, setSelectedProducts] = useState([
    {
      id: 1,
      brand: 'Sailor',
      name: 'Ultra Cotton Pro',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=400&fit=crop',
      tag: 'Our Choice',
      price: 2800,
      rating: 4.8,
      isWinner: true
    },
    {
      id: 2,
      brand: 'Yellow',
      name: 'Premium Ethnic',
      image: 'https://images.unsplash.com/photo-1598533341505-da5e5b3f272a?w=400&h=400&fit=crop',
      tag: 'Trending',
      price: 3200,
      rating: 4.5
    },
    {
      id: 3,
      brand: 'Infinity',
      name: 'Modern Casual',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
      tag: 'Budget',
      price: 1800,
      rating: 4.2
    }
  ]);

  const [openSections, setOpenSections] = useState<string[]>(['Pricing', 'Quality & Rating', 'Product Details', 'Purchase & Returns']);

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const sections: ComparisonSection[] = [
    {
      title: 'Pricing',
      icon: <CreditCard size={18} className="text-orange-primary" />,
      subtitle: 'Market rates and value analysis',
      metrics: [
        { label: 'Current Price', subLabel: 'VAT Included', values: ['৳2,800', '৳3,200', '৳1,800'], highlight: true },
        { label: 'Value for Money', subLabel: 'Performance / Price Ratio', values: ['Excellent', 'Good', 'Best'], type: 'badge' },
        { label: 'Clearance', subLabel: 'Applicable Coupons', values: ['15% OFF', '10% OFF', 'No Offer'], type: 'tag' }
      ]
    },
    {
      title: 'Quality & Rating',
      icon: <Star size={18} className="text-orange-primary" />,
      subtitle: 'Expert and community benchmarks',
      metrics: [
        { label: 'Customer Rating', subLabel: 'Market Consensus', values: ['4.8/5.0', '4.5/5.0', '4.2/5.0'], type: 'rating' },
        { label: 'Influencer Score', subLabel: 'Direct Reviewers', values: ['95/100', '88/100', '82/100'], type: 'score' },
        { label: 'Build Quality', values: ['Premium', 'High-End', 'Standard'] },
        { label: 'Durability', values: ['High (5 yrs)', 'Robust (3 yrs)', 'Standard (2 yrs)'] },
        { label: 'Experience', values: ['Supreme', 'Comfort', 'Basic'] }
      ]
    },
    {
      title: 'Product Details',
      icon: <Plus size={18} className="text-orange-primary" />,
      subtitle: 'Technical specifications',
      metrics: [
        { label: 'Available Sizes', values: ['S-3XL', 'M-XXL', 'S-XL'] },
        { label: 'Outer Material', values: ['Premium Cotton', 'Silk Blend', 'Cotton Mix'] },
        { label: 'Waterproof', values: ['No', 'Splash Proof', 'No'] },
        { label: 'Grip/Fit', values: ['Custom Fit', 'Tailored', 'Regular Fit'] }
      ]
    },
    {
      title: 'Purchase & Returns',
      icon: <Truck size={18} className="text-orange-primary" />,
      subtitle: 'Ordering logistics',
      metrics: [
        { label: 'Warranty', values: ['1 Year', '6 Months', 'None'] },
        { label: 'Defect Policy', values: ['30 Days', '15 Days', '7 Days'], highlight: true },
        { label: 'Availability', values: ['Stock Ready', 'Pre-Order', 'Limited'] }
      ]
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC]">
      {/* Compare Engine Header (Reference Image Style) */}
      <div className="bg-[#05051A] px-6 relative overflow-hidden text-center flex flex-col justify-center items-center" style={{ height: '500px' }}>
         <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent pointer-events-none" />
         
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-6xl"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
               COMPARE <span className="text-[#FF7A00]">ENGINE</span>
            </h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] italic max-w-2xl mx-auto mb-16">
               Select up to 3 products and get a side-by-side breakdown of the brand, quality, price points, and features.
            </p>

            {/* Product Selection Slots */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {selectedProducts.map((p, idx) => (
                  <div key={idx} className="relative">
                     <div className="bg-[#0A0A26] border border-white/5 rounded-[5px] p-6 text-left group hover:border-[#FF7A00]/30 transition-all shadow-2xl flex flex-col justify-between h-48">
                        {p.isWinner && (
                           <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FF7A00] text-white text-[8px] font-black px-4 py-1 rounded-full uppercase tracking-widest z-20 shadow-xl">
                              Winner
                           </div>
                        )}
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 p-2 shrink-0">
                              <img src={p.image} className="w-full h-full object-contain" alt={p.name} />
                           </div>
                           <div className="min-w-0">
                              <span className="text-[#FF7A00] text-[9px] font-black uppercase italic tracking-widest block leading-none">{p.brand}</span>
                              <h4 className="text-white text-xs font-bold italic line-clamp-2 mt-1">{p.name}</h4>
                           </div>
                        </div>
                        <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 mt-4">
                           <Activity size={12} /> Replace
                        </button>
                     </div>
                  </div>
               ))}
               
               {/* Empty Slot */}
               <div className="bg-transparent border-2 border-dashed border-white/10 rounded-[5px] flex flex-col items-center justify-center p-6 group cursor-pointer hover:border-white/20 transition-all h-48">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-white/10 group-hover:text-white transition-all mb-4">
                     <Plus size={24} />
                  </div>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic group-hover:text-white/40">Add Product</span>
               </div>
            </div>

            {/* Quick Action Bar */}
            <div className="mt-12 flex items-center gap-4 justify-center">
               <div className="flex items-center gap-4 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full">
                  <span className="text-[10px] font-black text-white/40 uppercase italic tracking-widest">Compare Mode:</span>
                  <div className="flex items-center gap-3">
                     <button className="text-[10px] font-black text-[#FF7A00] uppercase italic">Side-by-Side</button>
                     <div className="w-px h-3 bg-white/10" />
                     <button className="text-[10px] font-black text-white/40 uppercase italic hover:text-white">Highlights Only</button>
                  </div>
               </div>
               <button className="bg-orange-primary text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-xl shadow-orange-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Clear All
               </button>
            </div>
         </motion.div>
      </div>

      {/* Comparison Engine Body */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-30 pb-32">
         {/* Main comparison Row */}
         <div className="bg-white rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden">
            
            {/* Table Header Row (Products Meta) */}
            <div className="overflow-x-auto no-scrollbar">
               <div className="min-w-[800px] grid grid-cols-[1.5fr_2.5fr] gap-px bg-gray-100">
                  <div className="bg-[#FAF9F5]/80 p-8 md:p-10 flex flex-col justify-center">
                     <h3 className="text-xl md:text-2xl font-black text-navy italic uppercase mb-2">Category Breakdown</h3>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">In-depth feature analysis</p>
                  </div>
                  <div className="bg-white grid grid-cols-3 divide-x divide-gray-100">
                     {selectedProducts.map((p, idx) => (
                        <div key={idx} className="p-6 md:p-8 flex flex-col items-center text-center">
                           <div className="w-10 h-10 md:w-12 md:h-12 mb-4">
                              <img src={p.image} className="w-full h-full object-contain" alt={p.name} />
                           </div>
                           <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest italic mb-1">Model</span>
                           <h4 className="text-xs font-black text-navy italic uppercase leading-none mb-4">{p.name}</h4>
                           <div className="flex items-center gap-1.5 mb-6">
                              <div className="flex items-center gap-0.5">
                                 {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} size={10} className={s <= Math.floor(p.rating) ? "text-[#FFD700] fill-current" : "text-gray-200"} />
                                 ))}
                              </div>
                              <span className="text-[10px] font-black text-navy italic">{p.rating}</span>
                           </div>
                           <button className={cn(
                              "w-full py-2 md:py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic transition-all active:scale-95",
                              p.isWinner ? "bg-[#059669] text-white shadow-lg shadow-[#059669]/20" : "bg-[#FF5C38] text-white shadow-lg shadow-[#FF5C38]/20"
                           )}>
                              Shop Now <ArrowRight size={12} className="inline ml-1" />
                           </button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Sections Accordion */}
            <div className="divide-y divide-gray-100">
               {sections.map((section) => (
                  <div key={section.title} className="bg-white">
                     <button 
                       onClick={() => toggleSection(section.title)}
                       className="w-full px-10 py-8 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
                     >
                        <div className="flex items-center gap-6">
                           <div className="w-10 h-10 rounded-xl bg-orange-primary/5 flex items-center justify-center text-orange-primary">
                              {section.icon}
                           </div>
                           <div className="text-left">
                              <h4 className="text-lg font-black text-navy uppercase italic tracking-tighter leading-none">{section.title}</h4>
                              <p className="text-[10px] font-bold text-gray-400 italic mt-1">{section.subtitle}</p>
                           </div>
                        </div>
                        {openSections.includes(section.title) ? <ChevronUp className="text-gray-300" /> : <ChevronDown className="text-gray-300" />}
                     </button>

                     <AnimatePresence>
                        {openSections.includes(section.title) && (
                           <motion.div 
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             className="overflow-hidden bg-[#FAF9F5]/30"
                           >
                              <div className="divide-y divide-gray-100 overflow-x-auto no-scrollbar">
                                 {section.metrics.map((metric, midx) => (
                                    <div key={midx} className="min-w-[800px] grid grid-cols-[1.5fr_2.5fr] gap-px bg-gray-100">
                                       <div className="bg-white p-8 flex flex-col justify-center">
                                          <h5 className="text-xs font-black text-navy uppercase italic tracking-tighter">{metric.label}</h5>
                                          {metric.subLabel && <p className="text-[9px] font-bold text-gray-400 italic mt-1">{metric.subLabel}</p>}
                                       </div>
                                       <div className="bg-white grid grid-cols-3 divide-x divide-gray-100">
                                          {metric.values.map((val, vidx) => (
                                             <div key={vidx} className="p-10 flex items-center justify-center text-center">
                                                {metric.type === 'rating' ? (
                                                   <div className="flex flex-col items-center gap-2">
                                                      <span className="text-base font-black text-navy italic">{val}</span>
                                                      <div className="flex items-center gap-0.5">
                                                         {[1, 2, 3, 4, 5].map(s => (
                                                            <Star key={s} size={10} className={s <= 4 ? "text-[#FFD700] fill-current" : "text-gray-100"} />
                                                         ))}
                                                      </div>
                                                   </div>
                                                ) : metric.type === 'score' ? (
                                                   <div className="flex flex-col items-center gap-2">
                                                      <span className="text-base font-black text-navy italic">{val}</span>
                                                      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                         <div className="h-full bg-orange-primary" style={{ width: `${parseInt(val)}%` }} />
                                                      </div>
                                                   </div>
                                                ) : metric.type === 'badge' ? (
                                                   <span className={cn(
                                                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic",
                                                      val === 'Excellent' ? "bg-green-100 text-green-700" : val === 'Good' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                                                   )}>
                                                      {val}
                                                   </span>
                                                ) : metric.type === 'tag' ? (
                                                   <span className="text-[10px] font-black text-orange-primary uppercase italic underline decoration-2 underline-offset-4">
                                                      {val}
                                                   </span>
                                                ) : (
                                                   <span className={cn(
                                                      "text-sm font-bold text-navy italic opacity-70",
                                                      metric.highlight && "text-base font-black opacity-100 text-[#FF5C38]"
                                                   )}>
                                                      {val}
                                                   </span>
                                                )}
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               ))}
            </div>

            {/* Bottom Verdict Integration (Influence / Community Wisdom) */}
            <div className="bg-[#FAF9F5] p-10 border-t border-gray-100">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {selectedProducts.map((p, idx) => (
                     <div key={idx} className="bg-white rounded-[5px] p-8 border border-gray-100 shadow-none relative pt-12">
                        <div className="absolute top-0 right-8 -translate-y-1/2">
                           <div className="w-10 h-10 rounded-full bg-[#FAF9F5] border border-gray-100 flex items-center justify-center text-orange-primary shadow-none">
                              <MessageSquare size={16} />
                           </div>
                        </div>
                        <h5 className="text-[10px] font-black text-navy uppercase italic tracking-widest mb-4 opacity-40">Community Verdict</h5>
                        <p className="text-[13px] font-bold text-navy italic leading-relaxed opacity-70 mb-6">
                           "The {p.name} offers incredible {idx === 0 ? 'premium materials' : idx === 1 ? 'ethnic appeal' : 'value for money'} that justifies its market position."
                        </p>
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-gray-100 p-0.5">
                              <img src={`https://i.pravatar.cc/150?u=${p.id}`} className="w-full h-full rounded-full object-cover" alt="User" />
                           </div>
                           <div>
                              <span className="text-[10px] font-black text-navy uppercase italic block">Sabbir Ahmed</span>
                              <span className="text-[8px] font-bold text-blue-500 uppercase tracking-tighter italic">Verified Buyer</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Final Discovery Verdict (Based on Image bottom) */}
            <div className="bg-[#0A0A1F] p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8 md:gap-12 border-t border-white/5">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-primary/10 flex items-center justify-center text-orange-primary shrink-0 border border-orange-primary/20">
                   <Trophy size={32} className="md:w-[40px] md:h-[40px]" />
                </div>
                <div className="flex-1">
                   <h3 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">Discovery Verdict</h3>
                   <p className="text-white/40 text-xs md:text-[13px] font-bold italic leading-relaxed max-w-2xl">
                      For performance and long-term value, <span className="text-white">Sailor Ultra Cotton Pro</span> offers premium quality at a competitive rating.
                   </p>
                </div>
                <div className="w-full md:w-auto bg-white/5 border border-white/10 rounded-[5px] p-6 md:p-8 flex flex-col items-center">
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic mb-2">Final Recommendation</span>
                   <span className="text-2xl md:text-3xl font-black text-[#FF7A00] italic leading-none mb-6">SAILOR PRO</span>
                   <button className="w-full md:w-auto bg-[#059669] text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-2xl shadow-[#059669]/30 hover:scale-105 active:scale-95 transition-all">
                      View Model Details
                   </button>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}

const MessageSquare = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
