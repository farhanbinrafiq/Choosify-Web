import React, { useState, useEffect, useRef } from 'react';
import { Camera, Plus, ChevronRight, Info, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function PostOfferPage() {
  const [step, setStep] = useState(1);
  // Step 1 fields
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Mobile & Gadgets');
  const [brand, setBrand] = useState('');
  // Step 2 fields
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=200&h=200&fit=crop'
  ]);
  // Step 3 fields
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [isDeal, setIsDeal] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  // Step 4 fields
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerRegion, setSellerRegion] = useState('Dhaka');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem('choosify_offer_draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.productName) setProductName(draft.productName);
        if (draft.category) setCategory(draft.category);
        if (draft.brand) setBrand(draft.brand);
        if (draft.imagePreviewUrls) setImagePreviewUrls(draft.imagePreviewUrls);
        if (draft.price) setPrice(draft.price);
        if (draft.originalPrice) setOriginalPrice(draft.originalPrice);
        if (draft.stock) setStock(draft.stock);
        if (draft.description) setDescription(draft.description);
        if (draft.isDeal !== undefined) setIsDeal(draft.isDeal);
        if (draft.promoCode) setPromoCode(draft.promoCode);
        if (draft.sellerName) setSellerName(draft.sellerName);
        if (draft.sellerPhone) setSellerPhone(draft.sellerPhone);
        if (draft.sellerRegion) setSellerRegion(draft.sellerRegion);
      } catch (e) {
        console.error("Error loading draft", e);
      }
    }
  }, []);

  const saveDraft = () => {
    const draft = {
      productName,
      category,
      brand,
      imagePreviewUrls,
      price,
      originalPrice,
      stock,
      description,
      isDeal,
      promoCode,
      sellerName,
      sellerPhone,
      sellerRegion,
    };
    localStorage.setItem('choosify_offer_draft', JSON.stringify(draft));
    toast.success('Draft saved!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages(prev => [...prev, ...fileArray]);
      const urls = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages(prev => [...prev, ...fileArray]);
      const urls = fileArray.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!productName.trim()) {
        toast.error('Product Name is required.');
        return;
      }
      if (!brand.trim()) {
        toast.error('Brand is required.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (imagePreviewUrls.length === 0) {
        toast.error('Please upload at least one image.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
        toast.error('Please enter a valid price (৳).');
        return;
      }
      if (originalPrice && (isNaN(Number(originalPrice)) || Number(originalPrice) < Number(price))) {
        toast.error('Original Price cannot be less than current Price.');
        return;
      }
      if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) {
        toast.error('Stock Quantity must be a valid non-negative number.');
        return;
      }
      if (!description.trim() || description.trim().length < 10) {
        toast.error('Please provide a product description of at least 10 characters.');
        return;
      }
      if (isDeal && !promoCode.trim()) {
        toast.error('Please enter a Promo Code for this Deal.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!sellerName.trim()) {
        toast.error('Seller Business Name is required.');
        return;
      }
      if (!sellerPhone.trim()) {
        toast.error('Seller Phone is required.');
        return;
      }
      if (!agreeToTerms) {
        toast.error('You must agree to the Terms & Conditions.');
        return;
      }
      
      // Submit
      window.dispatchEvent(new CustomEvent('choosify-offer-submitted', { 
        detail: { productName, category, brand, price, description, sellerName } 
      }));
      toast.success('Offer submitted! Our team will review within 24 hours.');
      
      // Reset form & clear draft
      setProductName('');
      setCategory('Mobile & Gadgets');
      setBrand('');
      setImages([]);
      setImagePreviewUrls([
        'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1707251759491-18d48607ea0c?w=200&h=200&fit=crop'
      ]);
      setPrice('');
      setOriginalPrice('');
      setStock('');
      setDescription('');
      setIsDeal(false);
      setPromoCode('');
      setSellerName('');
      setSellerPhone('');
      setSellerRegion('Dhaka');
      setAgreeToTerms(false);
      setStep(1);
      localStorage.removeItem('choosify_offer_draft');
    }
  };

  return (
    <div className="flex flex-col min-h-screen choosify-dark-gradient py-12 px-8">
      <div className="max-w-4xl mx-auto w-full">
         <div className="mb-12">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 italic">Post Your Offer</h1>
            <div className="flex items-center gap-4">
               <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full button-gradient transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
               </div>
               <span className="text-orange-primary font-black uppercase text-[10px] tracking-widest whitespace-nowrap">
                 Step {step} of 4 — {['Basic Info', 'Media Upload', 'Pricing & Details', 'Seller Info'][step - 1]}
               </span>
            </div>
         </div>

         <div className="bg-white rounded-[5px] p-12 shadow-2xl space-y-16">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <section className="space-y-8">
                <h3 className="text-xl font-black text-navy uppercase tracking-tighter italic border-b-2 border-orange-primary/10 pb-4">Section 1 — Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Product Name</label>
                      <input 
                        type="text" 
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. Samsung Galaxy S24 Ultra - Titanium Black" 
                        className="w-full h-14 pl-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-primary/10 transition-all font-semibold" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-14 px-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none border-none font-semibold"
                      >
                         <option>Mobile & Gadgets</option>
                         <option>Fashion & Clothing</option>
                         <option>Home & Kitchen</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Brand</label>
                      <input 
                        type="text" 
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g. Samsung" 
                        className="w-full h-14 pl-6 rounded-2xl bg-ice-blue font-semibold focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-primary/10" 
                      />
                   </div>
                </div>
              </section>
            )}

            {/* Step 2: Media Upload */}
            {step === 2 && (
              <section className="space-y-8">
                <h3 className="text-xl font-black text-navy uppercase tracking-tighter italic border-b-2 border-orange-primary/10 pb-4">Section 2 — Media Upload</h3>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div 
                   onClick={() => fileInputRef.current?.click()}
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={handleDrop}
                   className="border-[3px] border-dashed border-gray-100 rounded-[10px] p-12 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-orange-primary/50 transition-all bg-gray-50/50"
                >
                   <div className="w-16 h-16 rounded-full bg-ice-blue flex items-center justify-center text-orange-primary mb-4 group-hover:scale-110 transition-all">
                      <Camera size={32} />
                   </div>
                   <h4 className="text-lg font-black text-navy mb-2">Drag & Drop Photos</h4>
                   <p className="text-gray-400 text-sm max-w-[240px]">High resolution JPEG or PNG images only. Minimum 800x800px.</p>
                </div>
                <div className="flex gap-4 flex-wrap">
                   {imagePreviewUrls.map((url, idx) => (
                     <div key={idx} className="w-24 h-24 rounded-[10px] bg-ice-blue relative overflow-hidden group">
                        <img src={url} className="w-full h-full object-cover" />
                        <div 
                           onClick={(e) => {
                             e.stopPropagation();
                             setImagePreviewUrls(prev => prev.filter((_, i) => i !== idx));
                             setImages(prev => prev.filter((_, i) => i !== idx));
                           }}
                           className="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
                        >
                           <Plus className="text-white rotate-45" size={24} />
                        </div>
                        {idx === 0 && <span className="absolute bottom-1 left-1 bg-orange-primary text-white text-[6px] font-black px-1.5 py-0.5 rounded uppercase">Primary</span>}
                     </div>
                   ))}
                   <button 
                     type="button"
                     onClick={() => fileInputRef.current?.click()}
                     className="w-24 h-24 rounded-[10px] border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:text-orange-primary hover:border-orange-primary/30 transition-all cursor-pointer bg-transparent"
                   >
                     <Plus />
                   </button>
                </div>
              </section>
            )}

            {/* Step 3: Pricing & Details */}
            {step === 3 && (
              <section className="space-y-8">
                <h3 className="text-xl font-black text-navy uppercase tracking-tighter italic border-b-2 border-orange-primary/10 pb-4">Section 3 — Pricing & Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Price (৳)</label>
                      <input 
                        type="number" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 115000" 
                        className="w-full h-14 pl-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-primary/10 transition-all font-semibold" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Original Price (৳) (Optional)</label>
                      <input 
                        type="number" 
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="e.g. 125000" 
                        className="w-full h-14 pl-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-primary/10 transition-all font-semibold" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Stock Quantity</label>
                      <input 
                        type="number" 
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="e.g. 5" 
                        className="w-full h-14 pl-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-primary/10 transition-all font-semibold" 
                      />
                   </div>
                   <div className="space-y-2 md:col-span-3">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Description</label>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide details about the deal, specs, warranty etc. (minimum 10 characters)" 
                        className="w-full h-32 p-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-primary/10 transition-all font-semibold resize-none" 
                      />
                   </div>
                   
                   <div className="space-y-4 md:col-span-3">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                         <input 
                           type="checkbox" 
                           checked={isDeal}
                           onChange={(e) => setIsDeal(e.target.checked)}
                           className="w-5 h-5 rounded accent-[#E8500A]" 
                         />
                         <span className="text-xs font-black uppercase text-navy tracking-wider">Is this a promotional deal?</span>
                      </label>
                      
                      {isDeal && (
                        <div className="space-y-2 transition-all">
                           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Promo Code</label>
                           <input 
                             type="text" 
                             value={promoCode}
                             onChange={(e) => setPromoCode(e.target.value)}
                             placeholder="e.g. GADGET10" 
                             className="w-full h-14 pl-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-primary/10 transition-all font-semibold" 
                           />
                        </div>
                      )}
                   </div>
                </div>
              </section>
            )}

            {/* Step 4: Seller Info */}
            {step === 4 && (
              <section className="space-y-8">
                <h3 className="text-xl font-black text-navy uppercase tracking-tighter italic border-b-2 border-orange-primary/10 pb-4">Section 4 — Seller Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Business / Seller Name</label>
                      <input 
                        type="text" 
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        placeholder="e.g. Farhan's Gadget World" 
                        className="w-full h-14 pl-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-primary/10 transition-all font-semibold" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone Number</label>
                      <input 
                        type="text" 
                        value={sellerPhone}
                        onChange={(e) => setSellerPhone(e.target.value)}
                        placeholder="e.g. +88017XXXXXXXX" 
                        className="w-full h-14 pl-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-primary/10 transition-all font-semibold" 
                      />
                   </div>
                   <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Division / region</label>
                      <select 
                        value={sellerRegion}
                        onChange={(e) => setSellerRegion(e.target.value)}
                        className="w-full h-14 px-6 rounded-2xl bg-ice-blue focus:bg-white focus:outline-none border-none font-semibold"
                      >
                         <option>Dhaka</option>
                         <option>Chattogram</option>
                         <option>Rajshahi</option>
                         <option>Khulna</option>
                         <option>Barishal</option>
                         <option>Sylhet</option>
                         <option>Rangpur</option>
                         <option>Mymensingh</option>
                      </select>
                   </div>
                   
                   <div className="space-y-2 md:col-span-2 mt-4">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                         <input 
                           type="checkbox" 
                           checked={agreeToTerms}
                           onChange={(e) => setAgreeToTerms(e.target.checked)}
                           className="w-5 h-5 rounded accent-[#E8500A]" 
                         />
                         <span className="text-xs font-black uppercase text-navy tracking-wider">I agree to the terms of service and guarantee product authenticity.</span>
                      </label>
                   </div>
                </div>
              </section>
            )}

            <section className="space-y-8">
               <div className="bg-ice-blue rounded-[10px] p-6 flex gap-4 border border-blue-grey/30">
                  <Info className="text-orange-primary shrink-0" size={24} />
                  <div>
                    <h5 className="font-black text-navy text-sm uppercase mb-1">First Time Seller?</h5>
                    <p className="text-gray-500 text-xs leading-relaxed">Ensure your product details match the official specifications to get the "Verified Offer" badge which increases trust by 80%.</p>
                  </div>
               </div>
               
               <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                  {step > 1 && (
                     <button 
                       type="button"
                       onClick={() => setStep(prev => prev - 1)}
                       className="flex-1 h-14 border-2 border-blue-grey text-navy font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-ice-blue transition-all cursor-pointer bg-transparent"
                     >
                       Back
                     </button>
                  )}
                  <button 
                     type="button"
                     onClick={saveDraft}
                     className="flex-1 h-14 border-2 border-blue-grey text-navy font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-ice-blue transition-all cursor-pointer bg-transparent"
                  >
                     Save Draft
                  </button>
                  <button 
                     type="button"
                     onClick={handleContinue}
                     className="flex-[2] h-14 button-gradient text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    {step === 4 ? (
                      <>Submit Offer <CheckCircle2 size={18} /></>
                    ) : (
                      <>Continue to Next Step <ChevronRight size={18} /></>
                    )}
                  </button>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
