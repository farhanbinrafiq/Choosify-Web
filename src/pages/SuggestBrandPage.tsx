import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { operationsApi } from '../services/operationsApi';
import { useGlobalState } from '../context/GlobalStateContext';
import { enabledSorted, fillTemplate, resolveSitePages } from '../lib/cmsSitePages';

function whyCardIcon(id: string, index: number) {
  if (id === 'local' || index === 1) {
    return <Award className="text-orange-primary w-4.5 h-4.5 shrink-0" />;
  }
  return <ShieldCheck className="text-emerald-500 w-4.5 h-4.5 shrink-0" />;
}

export function SuggestBrandPage() {
  const { siteConfig } = useGlobalState();
  const content = resolveSitePages(siteConfig?.sitePages).suggestBrand;
  const whyCards = enabledSorted(content.whyCards);
  const howSteps = enabledSorted(content.howSteps);
  const categoryOptions = enabledSorted(content.categoryOptions);

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
    <div className="min-h-screen bg-choosify-feed font-sans">
      {/* 1. HERO SECTION */}
      <StaticPageHero maxWidthClass="max-w-[1440px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/10 via-transparent to-black/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column: Title & Description */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="inline-block bg-[#FF5B00]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                {content.hero.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold text-white tracking-tight leading-tight">
                {content.hero.title}
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                {content.hero.description}
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
                    {content.hero.sideCardIcon || '💡'}
                  </div>
                  <div>
                    <h3 className="text-white text-xs font-black uppercase tracking-wider">{content.hero.sideCardTitle}</h3>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-0.5">{content.hero.sideCardSubtitle}</p>
                  </div>
                </div>
                <p className="text-white/70 text-xs leading-relaxed font-medium">
                  {content.hero.sideCardBody}
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
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                {content.whyHeading}
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {content.whyBody}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {whyCards.map((card, index) => (
                  <div key={card.id} className="bg-white border border-[#e8edf2] rounded-[5px] p-5 shadow-xs">
                    <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-2 flex items-center gap-2">
                      {whyCardIcon(card.id, index)}
                      {card.title}
                    </h4>
                    <p className="text-gray-500 text-[11px] leading-relaxed font-semibold">
                      {card.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: How Brand Discovery Works */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                {content.howHeading}
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <div className="space-y-6">
                {howSteps.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
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
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                {content.benefitsHeading}
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {content.benefitsIntro}
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 list-none text-xs text-gray-500 font-semibold">
                {content.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-orange-primary">★</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Interactive Suggestion Form (Right) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 md:p-8 shadow-xs text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5B00] to-[#EF3C23]" />
              
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
                      <h3 className="text-sm font-extrabold text-[#1A1A2E] tracking-tight mb-1">{content.formHeading}</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{content.formSubheading}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-gray-700">
                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.brandName.label}</label>
                        <input 
                          type="text" 
                          required
                          value={formData.brandName}
                          onChange={e => setFormData({...formData, brandName: e.target.value})}
                          placeholder={content.fields.brandName.placeholder}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.website.label}</label>
                        <input 
                          type="text" 
                          required
                          value={formData.website}
                          onChange={e => setFormData({...formData, website: e.target.value})}
                          placeholder={content.fields.website.placeholder}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.category.label}</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        >
                          <option value="">{content.fields.category.placeholder || 'Select a Category'}</option>
                          {categoryOptions.map((opt) => (
                            <option key={opt.id} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.country.label}</label>
                        <input 
                          type="text" 
                          value={formData.country}
                          onChange={e => setFormData({...formData, country: e.target.value})}
                          placeholder={content.fields.country.placeholder}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.reason.label}</label>
                        <textarea 
                          rows={3}
                          required
                          value={formData.reason}
                          onChange={e => setFormData({...formData, reason: e.target.value})}
                          placeholder={content.fields.reason.placeholder}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 bg-[#050514] hover:bg-orange-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group border-none cursor-pointer mt-4"
                      >
                        {content.submitLabel}
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
                      <h3 className="text-base font-extrabold text-[#1A1A2E] tracking-tight mb-1">{content.successTitle}</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">{content.successSubtitle}</p>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed font-semibold max-w-sm">
                      {fillTemplate(content.successBodyTemplate, { brandName: formData.brandName })}
                    </p>
                    <button 
                      onClick={() => {
                        setFormData({ brandName: '', website: '', category: '', country: '', reason: '' });
                        setSubmitted(false);
                      }}
                      className="px-6 py-2.5 bg-navy hover:bg-orange-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors border-none cursor-pointer"
                    >
                      {content.successResetLabel}
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
