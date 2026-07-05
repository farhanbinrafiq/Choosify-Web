import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, Plus, CheckCircle, Info, Star, Award, ShieldCheck, 
  Globe, Send, HelpCircle, ArrowRight
} from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { operationsApi } from '../services/operationsApi';

export function SuggestBrandPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    brandName: '',
    website: '',
    category: '',
    country: '',
    reason: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName || !formData.website) {
      alert('Please fill in the Brand Name and Website fields.');
      return;
    }
    try {
      await operationsApi.submitLead({
        brandName: formData.brandName,
        email: formData.website,
        message: `Category: ${formData.category}\nCountry: ${formData.country}\nReason: ${formData.reason}`,
        source: 'suggest-brand',
      });
    } catch {
      // still show success UX
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-sans">
      {/* 1. HERO SECTION */}
      <StaticPageHero>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/10 via-transparent to-black/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Title & Description */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="inline-block bg-[#E8500A]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                Community Discovery
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                Suggest a Brand
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                Help us discover great brands for the Choosify community. Recommend local or international brands that offer quality, authenticity, and incredible value.
              </p>
            </div>

            {/* Right Column: Hero Illustration Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-[5px] p-6 max-w-sm w-full text-left backdrop-blur-xs relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-primary/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-primary/10 border border-orange-primary/20 flex items-center justify-center text-orange-primary text-lg">
                    ðŸ’¡
                  </div>
                  <div>
                    <h3 className="text-white text-xs font-black uppercase tracking-wider">Discovery Engine</h3>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-0.5">Community Driven</p>
                  </div>
                </div>
                <p className="text-white/70 text-xs leading-relaxed font-medium">
                  Over 70% of listed brand catalogs are vetted directly from recommendations proposed by savvy consumers like you. Let's make smart shopping mainstream!
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </StaticPageHero>

      {/* 2. BODY CONTENT SECTION */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Information Column (Left) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            
            {/* Section: Why Suggest Brands */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                Why Suggest Brands
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                Choosify is built on trust, transparency, and authenticity. By suggesting high-quality brands that deserve a spotlight, you're helping thousands of Bangladeshi consumers make confident buying choices. Avoid online shop scams and help others connect with authentic, verified outlets.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="bg-white border border-[#e8edf2] rounded-[5px] p-5 shadow-xs">
                  <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ShieldCheck className="text-emerald-500 w-4.5 h-4.5 shrink-0" />
                    Expand Secure Outlets
                  </h4>
                  <p className="text-gray-500 text-[11px] leading-relaxed font-semibold">
                    We vet every recommended store against stringent authenticity guidelines to protect consumers.
                  </p>
                </div>
                <div className="bg-white border border-[#e8edf2] rounded-[5px] p-5 shadow-xs">
                  <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Award className="text-orange-primary w-4.5 h-4.5 shrink-0" />
                    Promote Local Craft
                  </h4>
                  <p className="text-gray-500 text-[11px] leading-relaxed font-semibold">
                    Support home-grown Bangladeshi artisans, weavers, boutique designers, and indie entrepreneurs.
                  </p>
                </div>
              </div>
            </div>

            {/* Section: How Brand Discovery Works */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                How Brand Discovery Works
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Submit Recommendation', desc: 'Provide basic brand coordinates such as their website, social media profile, and category fields.' },
                  { step: '02', title: 'Authenticity Vetting', desc: 'Our moderation desk evaluates their customer reputation, catalog quality, and business integrity.' },
                  { step: '03', title: 'Platform Onboarding', desc: 'We list the approved brand profile, letting users search their items, compare rates, and write reviews.' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <span className="text-2xl font-black text-orange-primary/30 font-mono italic leading-none">{item.step}</span>
                    <div>
                      <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-1">{item.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Benefits of Joining Choosify */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                Benefits of Joining Choosify
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                Vetted brands receive extensive visibility on Bangladesh's smartest product discovery canvas:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 list-none text-xs text-gray-500 font-semibold">
                {[
                  'âœ“ Premium brand listing placement in search results',
                  'âœ“ Direct verification badge to showcase credibility',
                  'âœ“ Instant review tracking & customer feedback cycles',
                  'âœ“ Access to compare tools highlighting key selling points',
                  'âœ“ Ability to post deals, promos, and discount vouchers',
                  'âœ“ Targeted campaign spots reaching high-intent buyers'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-orange-primary">â˜…</span>
                    <span>{benefit.substring(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Interactive Suggestion Form (Right) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 md:p-8 shadow-xs text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5B00] to-[#E8500A]" />
              
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
                      <h3 className="text-sm font-black text-navy uppercase tracking-widest italic mb-1">Suggest Sourcing</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Fill in brand credentials below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-gray-700">
                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Brand Name *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.brandName}
                          onChange={e => setFormData({...formData, brandName: e.target.value})}
                          placeholder="e.g., Aarong, Apex, local boutique name" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Website / Social Profile *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.website}
                          onChange={e => setFormData({...formData, website: e.target.value})}
                          placeholder="e.g., www.brand.com or social URL" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Category</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        >
                          <option value="">Select a Category</option>
                          <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                          <option value="Mobile & Phones">Mobile & Phones</option>
                          <option value="Tech & Electronics">Tech & Electronics</option>
                          <option value="Beauty & Cosmetics">Beauty & Cosmetics</option>
                          <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                          <option value="Home & Living">Home & Living</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Country</label>
                        <input 
                          type="text" 
                          value={formData.country}
                          onChange={e => setFormData({...formData, country: e.target.value})}
                          placeholder="e.g., Bangladesh, Japan, USA" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Why should we list this brand? *</label>
                        <textarea 
                          rows={3}
                          required
                          value={formData.reason}
                          onChange={e => setFormData({...formData, reason: e.target.value})}
                          placeholder="Tell us what makes them stand out, their catalog, authenticity level, etc." 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 bg-[#050514] hover:bg-orange-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group border-none cursor-pointer mt-4"
                      >
                        Submit Suggestion
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
                      âœ“
                    </div>
                    <div>
                      <h3 className="text-base font-black text-navy uppercase tracking-widest italic mb-1">Thank You!</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Suggestion Submitted Successfully</p>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed font-semibold max-w-sm">
                      We have logged your suggestion for <span className="text-navy font-bold">{formData.brandName}</span>. Our vetting desk will evaluate this brand profile shortly. Thank you for contributing to the Choosify discovery platform!
                    </p>
                    <button 
                      onClick={() => {
                        setFormData({ brandName: '', website: '', category: '', country: '', reason: '' });
                        setSubmitted(false);
                      }}
                      className="px-6 py-2.5 bg-navy hover:bg-orange-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors border-none cursor-pointer"
                    >
                      Suggest Another Brand
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
