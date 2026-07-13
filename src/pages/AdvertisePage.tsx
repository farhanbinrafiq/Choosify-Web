import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, TrendingUp, Sparkles, Megaphone, Target, BarChart3, 
  Layers, Users2, Star, ArrowRight, DollarSign, CheckCircle
} from 'lucide-react';

export function AdvertisePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    brandName: '',
    contactPerson: '',
    email: '',
    budget: 'under-50k',
    placementInterest: 'sponsored-brands',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName || !formData.email) {
      alert('Please fill in Brand Name and Email.');
      return;
    }
    setSubmitted(true);
  };

  const adTypes = [
    {
      icon: <Sparkles className="w-5 h-5 text-orange-primary" />,
      title: 'Sponsored Brands',
      desc: 'Get featured at the top of brand listings and search pages. Drive high-visibility branding directly above alphabetical arrays.'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-rose-500" />,
      title: 'Sponsored Deals',
      desc: 'Pin your discount coupon, clearance code, or hot deal to the top of the popular "Deals" and category feeds.'
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      title: 'Sponsored Recommendations',
      desc: 'Embed your top-selling products inside highly-vetted community shopping guides and expert recommendation blogs.'
    },
    {
      icon: <Megaphone className="w-5 h-5 text-amber-500" />,
      title: 'Homepage Placement',
      desc: 'Capture absolute attention with hero carousel banners or dedicated bento-grid display items on our central discovery homepage.'
    },
    {
      icon: <Users2 className="w-5 h-5 text-emerald-500" />,
      title: 'Creator Collaborations',
      desc: 'Let us match your catalog with viral local TikTokers and Instagram influencers to deploy authentic social campaigns.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative h-[303px] flex items-center choosify-dark-gradient text-white overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/10 via-transparent to-black/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-white">Advertise</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="inline-block bg-[#FF5B00]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                Premium Brand Exposure
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                Advertise on Choosify
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                Reach thousands of high-intent Bangladeshi shoppers actively comparing pricing, seeking recommendations, and preparing to purchase.
              </p>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-[5px] p-6 max-w-sm w-full text-left backdrop-blur-xs relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#5C2AFE]/10 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <BarChart3 size={16} className="text-orange-primary" />
                  Targeting Precision
                </h3>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">
                  We don't do blind eyeballs. Choosify positions your brand right where active purchase comparisons occur. Ensure your catalog remains top-of-mind.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT SECTION */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Advertise Details (Left) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            
            {/* Why Advertise */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                Why Advertise
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                Traditional social platforms bombard users with interrupting feeds. On Choosify, users come with an active intention: **Compare, Discovery, and Purchase**. Advertising here guarantees alignment with customers at the bottom of the buying funnel, boosting click-through rates and campaign efficiency.
              </p>
            </div>

            {/* Audience Overview */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                Audience Overview
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-[#e8edf2] rounded-[5px] p-5 shadow-xs text-center">
                  <span className="block text-2xl font-black text-[#5C2AFE] italic font-mono mb-1">150K+</span>
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Monthly Shoppers</span>
                </div>
                <div className="bg-white border border-[#e8edf2] rounded-[5px] p-5 shadow-xs text-center">
                  <span className="block text-2xl font-black text-orange-primary italic font-mono mb-1">75%</span>
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Dhaka-Based Buyers</span>
                </div>
                <div className="bg-white border border-[#e8edf2] rounded-[5px] p-5 shadow-xs text-center">
                  <span className="block text-2xl font-black text-emerald-500 italic font-mono mb-1">4.2m+</span>
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Monthly Impressions</span>
                </div>
              </div>
            </div>

            {/* Placement Opportunities (Advertising Types) */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                Placement Opportunities
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              
              <div className="space-y-4">
                {adTypes.map((ad, i) => (
                  <div key={i} className="bg-white border border-[#e8edf2] rounded-[5px] p-5 flex gap-4 items-start shadow-xs">
                    <div className="p-3 rounded-full bg-gray-50 shrink-0">{ad.icon}</div>
                    <div>
                      <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-1">
                        {ad.title}
                      </h4>
                      <p className="text-gray-500 text-xs leading-relaxed font-medium">
                        {ad.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Panel */}
            <div className="bg-orange-primary/5 border border-orange-primary/10 rounded-[5px] p-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">💎</span>
                <h4 className="text-xs font-black text-navy uppercase tracking-wider">
                  Custom Pricing Available
                </h4>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed font-semibold">
                No rigid packages. We structure custom pricing tailored directly to your brand’s monthly budget, target category, and specific conversion goals. Start scaling from small community campaigns upwards!
              </p>
            </div>

          </div>

          {/* Inquiry Form (Right) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 md:p-8 shadow-xs text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5B00] to-[#FF5B00]" />
              
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-sm font-black text-navy uppercase tracking-widest italic mb-1">Talk To Our Team</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Start building your custom campaign</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-gray-700">
                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Brand Name *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.brandName}
                          onChange={e => setFormData({...formData, brandName: e.target.value})}
                          placeholder="e.g., Bata Bangladesh, Apex, Sailor" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Contact Person *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.contactPerson}
                          onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                          placeholder="e.g., Farhan Rafiq" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Business Email *</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="e.g., marketing@brand.com" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Monthly Budget Scope</label>
                        <select 
                          value={formData.budget}
                          onChange={e => setFormData({...formData, budget: e.target.value})}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        >
                          <option value="under-50k">Under ৳50,000 / month</option>
                          <option value="50k-150k">৳50,000 - ৳150,000 / month</option>
                          <option value="150k-500k">৳150,000 - ৳500,000 / month</option>
                          <option value="above-500k">Above ৳500,000 / month</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Placement Interest</label>
                        <select 
                          value={formData.placementInterest}
                          onChange={e => setFormData({...formData, placementInterest: e.target.value})}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        >
                          <option value="sponsored-brands">Sponsored Brands Spotlight</option>
                          <option value="sponsored-deals">Sponsored Deals & Promo Pins</option>
                          <option value="sponsored-recs">Sponsored Guide Placement</option>
                          <option value="homepage">Homepage Banner Spots</option>
                          <option value="creator-collabs">Influencer Collaborations</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Campaign Goals</label>
                        <textarea 
                          rows={3}
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          placeholder="Describe what products you wish to spotlight, your launch timeline, etc." 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 bg-[#050514] hover:bg-orange-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group border-none cursor-pointer mt-4"
                      >
                        Talk To Our Team
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 px-2 text-center flex flex-col items-center justify-center space-y-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center text-3xl">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-base font-black text-navy uppercase tracking-widest italic mb-1">Inquiry Sent</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Campaign Desk Notified</p>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed font-semibold max-w-sm">
                      We have logged your campaign parameters for <span className="text-navy font-bold">{formData.brandName}</span>. An advertising manager will contact <span className="text-navy font-bold">{formData.contactPerson}</span> with custom mock media-kit and CTR models in 24 hours.
                    </p>
                    <button 
                      onClick={() => {
                        setFormData({ brandName: '', contactPerson: '', email: '', budget: 'under-50k', placementInterest: 'sponsored-brands', message: '' });
                        setSubmitted(false);
                      }}
                      className="px-6 py-2.5 bg-navy hover:bg-orange-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors border-none cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
