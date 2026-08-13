import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Sparkles, Megaphone, BarChart3, 
  Layers, Users2, ArrowRight
} from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { operationsApi } from '../services/operationsApi';
import { useGlobalState } from '../context/GlobalStateContext';
import { enabledSorted, fillTemplate, resolveSitePages } from '../lib/cmsSitePages';

const STAT_VALUE_COLORS = ['text-[#5C2AFE]', 'text-orange-primary', 'text-emerald-500'] as const;

function placementIcon(key?: string) {
  const k = (key || '').toLowerCase();
  if (k === 'trending' || k === 'deals') return <TrendingUp className="w-5 h-5 text-rose-500" />;
  if (k === 'layers' || k === 'recs') return <Layers className="w-5 h-5 text-indigo-500" />;
  if (k === 'megaphone' || k === 'home') return <Megaphone className="w-5 h-5 text-amber-500" />;
  if (k === 'users' || k === 'creators') return <Users2 className="w-5 h-5 text-emerald-500" />;
  return <Sparkles className="w-5 h-5 text-orange-primary" />;
}

export function AdvertisePage() {
  const { siteConfig } = useGlobalState();
  const content = resolveSitePages(siteConfig?.sitePages).advertise;
  const audienceStats = enabledSorted(content.audienceStats);
  const placements = enabledSorted(content.placements);
  const budgetOptions = enabledSorted(content.budgetOptions);
  const placementOptions = enabledSorted(content.placementOptions);
  const defaultBudget = budgetOptions[0]?.value || 'under-50k';
  const defaultPlacement = placementOptions[0]?.value || 'sponsored-brands';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    brandName: '',
    contactPerson: '',
    email: '',
    budget: defaultBudget,
    placementInterest: defaultPlacement,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName || !formData.email) {
      alert('Please fill in Brand Name and Email.');
      return;
    }
    try {
      await operationsApi.submitLead({
        brandName: formData.brandName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        budget: formData.budget,
        placementInterest: formData.placementInterest,
        message: formData.message,
        source: 'advertise-page',
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-choosify-feed font-sans">
      {/* 1. HERO SECTION */}
      <StaticPageHero maxWidthClass="max-w-[1440px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#EB4501]/10 via-transparent to-black/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="inline-block bg-[#EB4501]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                {content.hero.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold text-white tracking-tight leading-tight">
                {content.hero.title}
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                {content.hero.description}
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
                  {content.hero.sideCardTitle}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">
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
          
          {/* Advertise Details (Left) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            
            {/* Why Advertise */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                {content.whyHeading}
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {content.whyBody}
              </p>
            </div>

            {/* Audience Overview */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                {content.audienceHeading}
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {audienceStats.map((stat, i) => (
                  <div key={stat.id} className="bg-white border border-[#e8edf2] rounded-[5px] p-5 shadow-xs text-center">
                    <span className={`block text-2xl font-black italic font-mono mb-1 ${STAT_VALUE_COLORS[i % STAT_VALUE_COLORS.length]}`}>{stat.value}</span>
                    <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Opportunities (Advertising Types) */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                {content.placementsHeading}
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              
              <div className="space-y-4">
                {placements.map((ad) => (
                  <div key={ad.id} className="bg-white border border-[#e8edf2] rounded-[5px] p-5 flex gap-4 items-start shadow-xs">
                    <div className="p-3 rounded-full bg-gray-50 shrink-0">{placementIcon(ad.icon || ad.id)}</div>
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
                  {content.pricingTitle}
                </h4>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed font-semibold">
                {content.pricingBody}
              </p>
            </div>

          </div>

          {/* Inquiry Form (Right) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 md:p-8 shadow-xs text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EB4501] to-[#CF4400]" />
              
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
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.contactPerson.label}</label>
                        <input 
                          type="text" 
                          required
                          value={formData.contactPerson}
                          onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                          placeholder={content.fields.contactPerson.placeholder}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.email.label}</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder={content.fields.email.placeholder}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.budget.label}</label>
                        <select 
                          value={formData.budget}
                          onChange={e => setFormData({...formData, budget: e.target.value})}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        >
                          {budgetOptions.map((opt) => (
                            <option key={opt.id} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.placementInterest.label}</label>
                        <select 
                          value={formData.placementInterest}
                          onChange={e => setFormData({...formData, placementInterest: e.target.value})}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        >
                          {placementOptions.map((opt) => (
                            <option key={opt.id} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.message.label}</label>
                        <textarea 
                          rows={3}
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          placeholder={content.fields.message.placeholder}
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
                      {fillTemplate(content.successBodyTemplate, {
                        brandName: formData.brandName,
                        contactPerson: formData.contactPerson,
                      })}
                    </p>
                    <button 
                      onClick={() => {
                        setFormData({ brandName: '', contactPerson: '', email: '', budget: defaultBudget, placementInterest: defaultPlacement, message: '' });
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
