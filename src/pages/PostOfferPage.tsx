import React from 'react';
import { Camera, Plus, ChevronRight, Upload, Info, CheckCircle2 } from 'lucide-react';

export function PostOfferPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy py-12 px-8">
      <div className="max-w-4xl mx-auto w-full">
         <div className="mb-12">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic">Post Your Offer</h1>
            <div className="flex items-center gap-4">
               <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[25%] h-full button-gradient" />
               </div>
               <span className="text-orange-primary font-black uppercase text-[10px] tracking-widest whitespace-nowrap">Step 1 of 4 — Basic Info</span>
            </div>
         </div>

         <div className="bg-white rounded-[5px] p-12 shadow-2xl space-y-16">
            <section className="space-y-8">
               <h3 className="text-xl font-black text-navy uppercase tracking-tighter italic border-b-2 border-orange-primary/10 pb-4">Section 1 — Basic Information</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 md:col-span-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Product Name</label>
                     <input type="text" placeholder="e.g. Samsung Galaxy S24 Ultra - Titanium Black" className="w-full h-14 pl-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-primary/10 transition-all font-semibold" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</label>
                     <select className="w-full h-14 px-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none border-none font-semibold">
                        <option>Mobile & Gadgets</option>
                        <option>Fashion & Clothing</option>
                        <option>Home & Kitchen</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Brand</label>
                     <input type="text" placeholder="e.g. Samsung" className="w-full h-14 pl-6 rounded-2xl bg-ice-blue font-semibold" />
                  </div>
               </div>
            </section>

            <section className="space-y-8">
               <h3 className="text-xl font-black text-navy uppercase tracking-tighter italic border-b-2 border-orange-primary/10 pb-4">Section 2 — Media Upload</h3>
               <div className="border-[3px] border-dashed border-gray-100 rounded-[10px] p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-orange-primary/50 transition-all bg-gray-50/50">
                  <div className="w-16 h-16 rounded-full bg-ice-blue flex items-center justify-center text-orange-primary mb-4 group-hover:scale-110 transition-all">
                     <Camera size={32} />
                  </div>
                  <h4 className="text-lg font-black text-navy mb-2">Drag & Drop Photos</h4>
                  <p className="text-gray-400 text-sm max-w-[240px]">High resolution JPEG or PNG images only. Minimum 800x800px.</p>
               </div>
               <div className="flex gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-24 h-24 rounded-[10px] bg-ice-blue relative overflow-hidden group">
                       <img src={`https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=200&h=200&fit=crop`} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <Plus className="text-white rotate-45" size={24} />
                       </div>
                       {i === 1 && <span className="absolute bottom-1 left-1 bg-orange-primary text-white text-[6px] font-black px-1.5 py-0.5 rounded uppercase">Primary</span>}
                    </div>
                  ))}
                  <button className="w-24 h-24 rounded-[10px] border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:text-orange-primary hover:border-orange-primary/30 transition-all"><Plus /></button>
               </div>
            </section>

            <section className="space-y-8">
               <div className="bg-ice-blue rounded-[10px] p-6 flex gap-4 border border-blue-grey/30">
                  <Info className="text-orange-primary shrink-0" size={24} />
                  <div>
                    <h5 className="font-black text-navy text-sm uppercase mb-1">First Time Seller?</h5>
                    <p className="text-gray-500 text-xs leading-relaxed">Ensure your product details match the official specifications to get the "Verified Offer" badge which increases trust by 80%.</p>
                  </div>
               </div>
               
               <div className="flex gap-4">
                  <button className="flex-1 h-14 border-2 border-blue-grey text-navy font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-ice-blue transition-all">Save Draft</button>
                  <button className="flex-[2] h-14 button-gradient text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                    Continue to Next Step <ChevronRight size={18} />
                  </button>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
