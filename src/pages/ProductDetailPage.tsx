import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Zap, ShoppingBag, ArrowRight, Bookmark, Share2, 
  Heart, CheckCircle2, MessageSquare, Info, Facebook, 
  Instagram, Youtube, Smartphone, Shirt, Gift, Users, Play, 
  Search, ShieldCheck, ChevronDown, Package, TrendingUp,
  Award, Globe, Save, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { PRODUCTS, BRANDS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === Number(id)) || PRODUCTS[0];
  const brandObj = BRANDS.find(b => b.name === product.brand);
  const brandId = brandObj ? brandObj.id : 1;

  const [activeTab, setActiveTab] = useState('Overview');
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const tabs = ['Overview', 'Specifications', 'About Choosify', 'Influencer Reviews', 'Public Reviews', 'Comparison'];

  const heroImages = [
    "https://images.unsplash.com/photo-1511119253457-36e78921865c?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b830c6050?w=1200&h=800&fit=crop",
  ];

  const productSpecs = [
    { label: "Material", value: "Premium Linen" },
    { label: "Category", value: "Ethnic Wear" },
    { label: "Fit", value: "Regular Fit" },
    { label: "Occasion", value: "Eid Specials" },
    { label: "Season", value: "Monsoon 2024" },
    { label: "Gender", value: "Women's" },
  ];

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
      <section className="bg-[#050514] pt-6 pb-16 overflow-hidden relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[500px]">
             {heroImages.map((img, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "relative rounded-[32px] overflow-hidden group border border-white/5",
                    i === 0 ? "col-span-12 md:col-span-3 h-[300px] md:h-full" : 
                    i === 1 ? "col-span-12 md:col-span-5 h-[400px] md:h-full" : 
                    i === 2 ? "col-span-6 md:col-span-2 h-[200px] md:h-full" : 
                    "col-span-6 md:col-span-2 h-[200px] md:h-full"
                  )}
                >
                  <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="product" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             ))}
          </div>

          <div className="mt-8 flex flex-col lg:flex-row items-end justify-between">
             <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-1">BRAND / {product.category?.toUpperCase()}</span>
                   <div className="h-px w-12 bg-white/20" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none">{product.brand} {product.title}</h1>
                
                {/* Pricing Section Refined */}
                <div className="flex items-center gap-8 mt-6">
                   <div className="flex flex-col">
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-4xl font-black text-orange-primary italic tracking-tighter leading-none">৳ {product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xl font-bold text-white/30 line-through italic">৳{product.originalPrice}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                           {[1,2,3,4,5].map(i => <Star key={i} size={14} className={cn("fill-current", i <= 4 ? "text-orange-primary" : "text-white/20")} />)}
                        </div>
                        <span className="text-white/60 text-xs font-bold italic">{product.rating} ({product.reviews || '1.5k'} reviews)</span>
                      </div>
                   </div>

                   {product.originalPrice && (
                     <div className="bg-[#10B981] text-white px-6 py-2 rounded-xl flex flex-col items-center justify-center transform -rotate-3 shadow-xl">
                        <span className="text-sm font-black italic">SAVE</span>
                        <span className="text-xl font-black italic">৳{parseInt(product.originalPrice.replace(/,/g, '')) - parseInt(product.price.replace(/,/g, ''))}</span>
                     </div>
                   )}
                </div>

                <div className="flex gap-4 mt-8">
                  <Link to={`/brands/${brandId}`} className="bg-orange-primary text-white text-[12px] font-black uppercase px-12 py-5 rounded-full tracking-[0.2em] shadow-2xl shadow-orange-primary/30 hover:scale-105 active:scale-95 transition-all italic border border-white/10">
                    Visit Official Store
                  </Link>
                  <button className="bg-white/10 text-white text-[12px] font-black uppercase px-8 py-5 rounded-full tracking-[0.2em] hover:bg-white/20 transition-all italic border border-white/10 flex items-center gap-2">
                    <Zap size={16} className="text-orange-primary fill-current" /> Price Alert
                  </button>
                  <button className="bg-navy text-white text-[12px] font-black uppercase px-8 py-5 rounded-full tracking-[0.2em] hover:bg-navy/80 transition-all italic border border-white/10 flex items-center gap-2">
                    <Heart size={16} className="text-orange-primary" /> Follow Brand
                  </button>
                </div>
             </div>

             <div className="flex flex-col items-end gap-8 mt-12 lg:mt-0">
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
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
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
                         layoutId="product-active-tab"
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
               {/* Left Column: Details */}
               <div className="flex-1 space-y-8">
                  {/* Store Comparison Table (PRD Requirement) */}
                  <section className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl" id="Comparison">
                     <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-navy italic tracking-tighter uppercase">Store Comparison</h3>
                        <span className="text-[10px] font-black text-orange-primary uppercase tracking-widest italic">{product.stores?.length || 0} Stores Available</span>
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
                                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{typeof store === 'string' ? '3-5 Days' : (store.delivery || '3-5 Days')}</span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                       <a href={typeof store === 'string' ? '#' : (store.link || '#')} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-navy text-white text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-orange-primary transition-all italic">
                                          Go To Store
                                       </a>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </section>

                  {/* Best For Tags (PRD Requirement) */}
                  <section className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-xl">
                    <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-6 italic">Best For</h3>
                    <div className="flex flex-wrap gap-3">
                      {((product as any).bestForTags || ['Premium Buyers', 'Quality Driven', 'Fashion Icons']).map((tag: string) => (
                        <div key={tag} className="px-6 py-3 bg-[#F4F9FF] border border-blue-100 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 group hover:bg-blue-600 hover:text-white transition-all cursor-default">
                          <CheckCircle2 size={12} /> {tag}
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* About Section */}
                  <section className="bg-white rounded-[32px] p-12 border border-gray-100 shadow-xl overflow-hidden relative">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                     <h2 className="text-3xl font-black text-navy italic tracking-tighter mb-8 uppercase">About This Product</h2>
                     <p className="text-gray-400 font-bold leading-relaxed mb-12 italic uppercase text-[11px] tracking-wider max-w-3xl">
                        {(product as any).description || "Best Suited For Premium Buyers Who Value Quality Over Price. High-performance material meets executive design standards."}
                     </p>
                     
                     <div className="grid grid-cols-2 lg:grid-cols-2 gap-12 mb-12">
                        {/* Pros */}
                        <div className="space-y-6">
                          <h4 className="text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-2 italic">
                            <ThumbsUp size={16} /> WHAT WE LIKE
                          </h4>
                          <div className="space-y-4">
                            {((product as any).pros || ['Premium Build Quality', 'Authentic Design', 'High Durability']).map((pro: string, i: number) => (
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
                            {((product as any).cons || ['Premium Pricing', 'Limited Availability']).map((con: string, i: number) => (
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
                          { icon: <Shirt className="text-green-500" />, label: "Style", val: product.category },
                          { icon: <TrendingUp className="text-purple-500" />, label: "Trend", val: "2024 Collection" },
                          { icon: <Smartphone className="text-pink-500" />, label: "Fitting", val: "Standard" },
                          { icon: <Package className="text-orange-500" />, label: "Material", val: "Premium Verified" },
                          { icon: <Gift className="text-red-500" />, label: "Store", val: product.brand }
                        ].map((item, i) => (
                           <div key={i} className="flex items-start gap-4 group">
                              <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-navy transition-all duration-300">
                                 {React.cloneElement(item.icon as React.ReactElement, { size: 22, className: "group-hover:text-white" })}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">{item.label}</span>
                                 <span className="text-xs font-black text-navy italic">{item.val}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </section>

                  {/* Offline Store Locations (PRD Requirement) */}
                  <section className="bg-white rounded-[32px] p-10 border border-gray-100 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-2xl font-black text-navy italic tracking-tighter uppercase">Physical Stores</h3>
                       <button className="text-[10px] font-black text-orange-primary uppercase tracking-widest italic hover:underline">View Map</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {((product as any).locations || [
                        'Bashundhara City Shopping Complex, Level 5, Block C',
                        'Jamuna Future Park, Ground Floor, Shop 102'
                      ]).map((loc: string, i: number) => (
                        <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:bg-navy hover:border-navy transition-all">
                          <Globe size={20} className="text-orange-primary group-hover:text-white transition-colors" />
                          <span className="text-[11px] font-black text-navy uppercase italic group-hover:text-white transition-colors">{loc}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Specifications */}
                  <section className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl" id="Specifications">
                     <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-2xl font-black text-navy italic tracking-tighter uppercase">Specifications</h3>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Updated May 2024</span>
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
                     <div className="p-6 bg-gray-50 flex justify-center">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-navy transition-colors">
                           <span className="text-[9px] font-black uppercase tracking-widest">Load Details</span>
                           <ChevronDown size={14} />
                        </button>
                     </div>
                  </section>
               </div>

               {/* Right Column: Sidebar */}
               <aside className="lg:w-[380px] space-y-8">
                  {/* Brand Profile Card (Reference image sidebar) */}
                  <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 group">
                     <div className="p-10 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-3xl bg-navy flex items-center justify-center p-3 shadow-2xl scale-100 group-hover:scale-110 transition-transform duration-500 mb-6">
                           <img src={product.image} className="w-full h-full object-contain" alt="brand" />
                        </div>
                        <h4 className="text-3xl font-black text-navy italic tracking-tighter mb-2">{product.brand}</h4>
                        <div className="flex items-center gap-2 mb-8">
                           <div className="flex">
                              {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-orange-primary text-orange-primary" />)}
                           </div>
                           <span className="text-[11px] font-black text-navy/40 italic">4.9 Score</span>
                        </div>
                        
                        <div className="w-full grid grid-cols-2 gap-4 mb-8">
                           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 italic transition-all group-hover:bg-orange-primary group-hover:text-white text-navy">
                              <div className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Starts From</div>
                              <div className="text-xl font-black tracking-tighter">৳1,200</div>
                           </div>
                           <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 italic transition-all group-hover:bg-blue-400 group-hover:text-white text-navy">
                              <div className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Availability</div>
                              <div className="text-xl font-black tracking-tighter italic">In Stock</div>
                           </div>
                        </div>

                        <button className="w-full py-5 rounded-[20px] bg-navy text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-orange-primary transition-all mb-4 italic">
                           Price Analytics
                        </button>
                        <button className="w-full py-5 rounded-[20px] bg-white border-2 border-navy text-navy text-[10px] font-black uppercase tracking-[0.25em] hover:bg-navy hover:text-white transition-all italic">
                           Compare Deal
                        </button>
                     </div>
                  </div>

                  {/* Product Advice Card */}
                  <div className="bg-[#050514] rounded-[32px] p-10 border border-white/5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-full bg-blue-500/10 blur-[80px] translate-x-1/2" />
                     <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                           <Zap size={20} />
                        </div>
                        <h5 className="text-white font-black text-sm uppercase tracking-widest italic">Product Advice</h5>
                     </div>
                     <p className="text-white/40 text-[11px] font-medium leading-relaxed italic mb-8 border-l-2 border-orange-primary pl-4 uppercase tracking-wider">
                        Tested by Choosify Experts. This product is recommended for its high-quality fabric and authentic design. Great for festive occasions.
                     </p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-orange-primary p-1">
                           <img src="https://i.pravatar.cc/100?img=32" className="w-full h-full rounded-full object-cover" alt="expert" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-white font-black text-xs italic">Auntie Mirpur</span>
                           <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">Fashion Expert</span>
                        </div>
                     </div>
                  </div>
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

            {/* Featured Row */}
            <div className="bg-white rounded-[32px] overflow-hidden mb-12 shadow-2xl flex flex-col lg:flex-row border border-white/5 bg-white/5 backdrop-blur-xl text-navy">
               <div className="lg:w-3/5 relative group h-[400px] lg:h-auto min-h-[400px]">
                  <img 
                    src="https://images.unsplash.com/photo-1511119253457-36e78921865c?w=1200&h=800&fit=crop" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    alt="Featured Review"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-8 left-8">
                     <span className="bg-orange-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic flex items-center gap-2 shadow-xl">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> TRENDING NOW
                     </span>
                  </div>
                  <div className="absolute top-8 right-8">
                     <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <Youtube size={24} />
                     </div>
                  </div>
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                     <Play size={28} className="fill-current ml-1" />
                  </button>
                  <div className="absolute bottom-10 left-10 text-white flex gap-6 items-end">
                     <div className="flex flex-col items-start">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2 italic">Creator Spotlight</p>
                        <h4 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none mb-1">{product.brand} Special Edition</h4>
                        <div className="w-20 h-1.5 bg-orange-primary rounded-full mt-2" />
                     </div>
                  </div>
               </div>
               <div className="lg:w-2/5 p-12 flex flex-col justify-center bg-white relative">
                  <span className="text-[10px] font-black text-orange-primary uppercase tracking-[0.4em] mb-6 block italic px-3 py-1 border-l-2 border-orange-primary w-fit">IN-DEPTH REVIEW</span>
                  <h4 className="text-3xl md:text-4xl font-black text-navy italic tracking-tighter leading-tight mb-6">Why {product.brand} remains a Top Choice in 2024!</h4>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">
                    Watch as we dive deep into the performance and build quality of {product.brand}'s latest collection. From real-world testing to expert analysis.
                  </p>
                  
                  <div className="w-full h-[1px] bg-gray-100 mb-8" />
                  
                  <div className="flex items-center justify-between">
                     <div className="flex flex-col">
                        <div className="text-xs font-black text-navy italic uppercase tracking-wider mb-1">Tech Review BD</div>
                        <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live from Dhaka</div>
                     </div>
                     <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-white text-[10px] font-black uppercase tracking-tight shadow-xl italic">Choosify</div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Portrait Card */}
               <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-white/5 flex flex-col group lg:row-span-1 h-[600px] relative">
                  <div className="absolute inset-0">
                     <img 
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1200&fit=crop" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                        alt="Reel Review"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  </div>
                  
                  <div className="absolute top-8 left-8">
                     <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                        <Smartphone size={18} />
                     </div>
                  </div>

                  <div className="absolute top-8 right-8">
                     <span className="bg-orange-primary/90 backdrop-blur-md text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest italic flex items-center gap-2">
                        Product Reel <Zap size={10} className="fill-current" />
                     </span>
                  </div>

                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl transform scale-90 group-hover:scale-100 transition-all opacity-0 group-hover:opacity-100">
                     <Play size={24} className="fill-current ml-1" />
                  </button>

                  <div className="absolute bottom-24 left-8 right-8">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                 <img src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-full h-full object-cover" alt="avatar" />
                              </div>
                           ))}
                        </div>
                        <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">+25k Views</span>
                     </div>
                     <h5 className="text-2xl font-black text-white italic tracking-tighter mb-2 leading-tight">{product.brand} Style Showcase</h5>
                  </div>

                  <div className="mt-auto p-8 relative z-10 flex items-center justify-between bg-black/20 backdrop-blur-md">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-white border-2 border-orange-primary overflow-hidden">
                            <img src="https://i.pravatar.cc/100?img=44" className="w-full h-full object-cover" alt="Fashion Ally" />
                         </div>
                         <div>
                            <div className="text-xs font-black text-white italic">Style Maven</div>
                            <div className="text-[9px] font-bold text-white/50">@stylemaven • 1.2m</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-1 text-orange-primary">
                         <Star size={10} className="fill-current" />
                         <span className="text-[10px] font-black">5.0</span>
                      </div>
                  </div>
               </div>

               {/* Regular Square Cards Container */}
               <div className="flex flex-col gap-8 lg:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                     {/* Square Card 1 */}
                     <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col group h-full">
                        <div className="relative h-64 overflow-hidden">
                           <img 
                              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                              alt="Review Card"
                           />
                           <div className="absolute inset-0 bg-navy/20" />
                           <div className="absolute top-6 right-6">
                              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                                 <Youtube size={20} />
                              </div>
                           </div>
                           <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl transform scale-0 group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                              <Play size={20} className="fill-current ml-1" />
                           </button>
                        </div>
                        <div className="p-8 flex-1 flex flex-col text-navy">
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-1.5">
                                 {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-orange-primary text-orange-primary" />)}
                              </div>
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Authentic</span>
                           </div>
                           <h5 className="text-xl font-black text-navy italic tracking-tighter leading-tight mb-4">{product.brand} Collection: A Deep Dive</h5>
                           <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8 italic">
                              Testing the durability and comfort of this latest {product.brand} release.
                           </p>
                           
                           <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center text-white font-black text-[10px] shadow-lg italic">RD</div>
                                  <div>
                                     <div className="text-xs font-black text-navy italic">BD Tech Guys</div>
                                     <div className="text-[9px] font-bold text-gray-400">@bdtechguys • 420k</div>
                                  </div>
                               </div>
                               <Heart size={16} className="text-gray-200 group-hover:text-red-500 transition-colors" />
                           </div>
                        </div>
                     </div>

                     {/* Square Card 2 */}
                     <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col group h-full">
                        <div className="relative h-64 overflow-hidden">
                           <img 
                              src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                              alt="Review Card"
                           />
                           <div className="absolute inset-0 bg-navy/20" />
                           <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl transform scale-0 group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                              <Play size={20} className="fill-current ml-1" />
                           </button>
                        </div>
                        <div className="p-8 flex-1 flex flex-col text-navy">
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-1.5">
                                 {[1,2,3,4].map(i => <Star key={i} size={10} className="fill-orange-primary text-orange-primary" />)}
                              </div>
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Review</span>
                           </div>
                           <h5 className="text-xl font-black text-navy italic tracking-tighter leading-tight mb-4">Finding The Perfect Build in {product.brand}</h5>
                           <p className="text-xs text-gray-400 font-medium leading-relaxed mb-8 italic">
                              Exploring original luxury quality and how to verify authenticity.
                           </p>
                           
                           <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-orange-primary text-white flex items-center justify-center text-white font-black text-[10px] shadow-lg italic">AM</div>
                                  <div>
                                     <div className="text-xs font-black text-navy italic">Auntie Mirpur</div>
                                     <div className="text-[9px] font-bold text-gray-400">@auntiemirpur • 150k</div>
                                  </div>
                               </div>
                               <Heart size={16} className="text-gray-200 group-hover:text-red-500 transition-colors" />
                           </div>
                        </div>
                     </div>
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
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Verified Customer Experiences</span>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full mb-20">
               {[
                 {
                   name: "Tanvir Hasan",
                   avatar: "https://i.pravatar.cc/150?u=tanvir",
                   time: "POSTED 2 WEEKS AGO",
                   rating: "5",
                   content: "The fabric quality of the new Sailor Eid collection is absolutely top-notch. I was skeptical about the price but after wearing it once, I can say it's worth every taka. The fit is perfect for large build individuals as well.",
                   date: "APRIL 2024",
                   helpful: 124,
                   images: [
                     "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
                     "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop"
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
                     "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop"
                   ]
                 }
               ].map((review, i) => (
                  <div 
                    key={i}
                    className="bg-white rounded-[60px] p-12 shadow-2xl shadow-navy/5 border border-white flex flex-col h-full"
                  >
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
                              <img src={img} className="w-full h-full object-cover" alt="review product" />
                           </div>
                        ))}
                     </div>

                     <div className="bg-[#F8FAFC] rounded-[40px] p-10 relative mb-auto">
                        <MessageSquare size={32} className="absolute -top-4 -right-4 text-orange-primary/10 fill-current transform rotate-12" />
                        <p className="text-sm text-navy font-bold leading-relaxed italic tracking-tight">
                           {review.content}
                        </p>
                     </div>

                     <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-50">
                        <div className="flex flex-col gap-1">
                           <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">PURCHASE DATE</span>
                           <span className="text-[11px] font-black text-navy uppercase italic">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <button className="flex items-center gap-3 px-8 py-4 bg-white border border-gray-100 rounded-full shadow-xl shadow-gray-200/40 hover:bg-navy hover:text-white transition-all group group-active:scale-95">
                              <ThumbsUp size={16} className="text-navy group-hover:text-white transition-colors" />
                              <span className="text-[10px] font-black uppercase tracking-widest italic">HELPFUL ({review.helpful})</span>
                           </button>
                           <button className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-100 transition-all shadow-xl shadow-gray-200/40 group-active:scale-95">
                              <ThumbsDown size={18} />
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <button className="px-16 py-5 border-2 border-navy text-navy font-black text-[11px] uppercase tracking-[0.3em] rounded-full hover:bg-navy hover:text-white transition-all shadow-2xl shadow-navy/10 transform hover:scale-105 active:scale-95 italic">
               Load More Reviews
            </button>
         </div>
      </section>

      {/* Comparison Section (Matches Reference Image) */}
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
              <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] italic">Side By Side Specs Vs Top Alternative Brands & Products</p>
           </div>

           <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-white/5 flex flex-col md:flex-row relative z-10">
              {/* Left Labels Column */}
              <div className="md:w-1/4 p-10 flex flex-col">
                 <div className="mb-20">
                    <h4 className="text-orange-primary text-2xl font-black italic tracking-tighter uppercase mb-1">COMPARING</h4>
                    <div className="text-4xl font-black text-navy italic tracking-tighter">2 Products</div>
                 </div>
                 <div className="flex flex-col gap-14">
                    {['Price', 'Rating', 'Reviews', 'Category', 'Brand Value'].map((label) => (
                       <div key={label} className="text-xl font-black text-navy/40 italic tracking-tight">{label}</div>
                    ))}
                 </div>
              </div>

              {/* Product Columns Container */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3">
                 {[
                   { 
                     name: `${product.brand} Eid Collection 2025`, 
                     brand: product.brand, 
                     price: "3,000", 
                     rating: "4.6", 
                     reviews: "550", 
                     category: "Fashion", 
                     value: "AAA", 
                     img: product.image,
                     active: true,
                     color: "bg-orange-primary"
                   },
                   { 
                     name: `Sailor Eid Collection 2025`, 
                     brand: "Sailor", 
                     price: "3,000", 
                     rating: "4.6", 
                     reviews: "550", 
                     category: "Fashion", 
                     value: "AAA", 
                     img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
                     color: "bg-[#6366F1]"
                   },
                   { 
                     name: `Sailor Eid Collection 2025`, 
                     brand: "Sailor", 
                     price: "3,000", 
                     rating: "4.6", 
                     reviews: "550", 
                     category: "Fashion", 
                     value: "AAA", 
                     img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
                     color: "bg-[#6366F1]"
                   }
                 ].map((comp, idx) => (
                    <div key={idx} className={cn("flex flex-col border-l border-gray-50 bg-[#F8FAFC]/30 group transition-all", idx === 0 && "bg-white")}>
                       <div className={cn("h-1 w-full", comp.color)} />
                       <div className="p-10 flex flex-col">
                          <div className="aspect-square rounded-[24px] overflow-hidden mb-6 border-4 border-white shadow-xl">
                             <img src={comp.img} className="w-full h-full object-cover" alt="product" />
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
                             <div className="text-xl font-black text-orange-primary italic tracking-tight">{comp.value}</div>
                          </div>

                          <button className={cn(
                            "mt-12 w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic",
                            comp.active ? "bg-orange-primary text-white shadow-xl shadow-orange-primary/20" : "bg-[#6366F1] text-white shadow-xl shadow-[#6366F1]/20 group-hover:scale-105"
                          )}>
                             {comp.active ? "Selected" : "View"}
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="flex justify-center -mt-6 relative z-20">
              <button className="px-32 py-5 bg-[#6366F1] text-white text-[11px] font-black rounded-2xl uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all italic border-4 border-[#050514]">
                 Open Comparison Tool
              </button>
           </div>
        </div>
      </section>
      {/* Sticky Mobile CTA (PRD Requirement) */}
      <div className="lg:hidden fixed bottom-12 left-6 right-6 z-[60] flex items-center justify-between p-4 bg-navy rounded-[24px] shadow-[0_20px_50px_rgba(0,4,53,0.3)] border border-white/10 animate-in slide-in-from-bottom-2">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Lowest Price</span>
          <span className="text-xl font-black text-orange-primary italic tracking-tight">৳{product.price}</span>
        </div>
        <button 
          onClick={() => {
            setActiveTab('Comparison');
            const el = document.getElementById('Comparison');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 bg-white text-navy text-[10px] font-black uppercase tracking-widest rounded-full italic hover:bg-orange-primary hover:text-white transition-all shadow-xl"
        >
          View Stores
        </button>
      </div>

      {/* Trust Section (PRD Requirement) */}
      <section className="w-full bg-[#F4F9FF] border-t border-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-10 text-center md:text-left">
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
             <ShieldCheck size={40} className="text-blue-600" />
           </div>
           <div className="space-y-2">
             <h4 className="text-2xl font-black text-navy italic tracking-tighter uppercase leading-none">Choosify Trust Statement</h4>
             <p className="text-[14px] font-bold text-gray-400 uppercase tracking-widest italic">“Only verified sellers and unbiased brands are listed on Choosify.”</p>
           </div>
        </div>
      </section>
    </div>
  );
}
