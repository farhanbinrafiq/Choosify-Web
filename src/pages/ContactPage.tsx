import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, MessageCircleMore, Share2, MapPin, 
  ArrowRight
} from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { operationsApi } from '../services/operationsApi';
import { useGlobalState } from '../context/GlobalStateContext';
import { enabledSorted, fillTemplate, resolveSitePages } from '../lib/cmsSitePages';

function methodIcon(iconKey?: string) {
  if (iconKey === 'messenger') return <MessageCircleMore className="w-5 h-5 text-[#EB4501]" />;
  if (iconKey === 'social') return <Share2 className="w-5 h-5 text-[#5C2AFE]" />;
  return <Mail className="w-5 h-5 text-orange-primary" />;
}

export function ContactPage() {
  const { siteConfig } = useGlobalState();
  const content = resolveSitePages(siteConfig?.sitePages).contact;
  const channels = enabledSorted(content.channels);
  const methods = enabledSorted(content.methods);
  const footer = siteConfig?.footer;
  const supportEmail = footer?.contactEmail || 'support@choosify.bd';

  const hqAddress = (() => {
    if (content.useGlobalOfficeAddress) {
      const lines = footer?.bangladeshOffice?.lines?.filter(Boolean);
      if (lines?.length) return lines.join(', ');
    }
    return content.hqAddress;
  })();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject) {
      alert('Please fill in Name, Email, and Subject fields.');
      return;
    }
    try {
      await operationsApi.submitLead({
        brandName: formData.subject,
        contactPerson: formData.name,
        email: formData.email,
        placementInterest: 'contact',
        message: formData.message,
        source: 'contact-page',
      });
    } catch {
      // still show success UX
    }
    setSubmitted(true);
  };

  const resolveMethodValue = (value: string) =>
    content.useGlobalSupportEmail
      ? fillTemplate(value, { supportEmail })
      : value;

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
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-primary/10 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-orange-primary" />
                  {content.hqTitle}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">
                  {hqAddress}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </StaticPageHero>

      {/* 2. BODY CONTENT SECTION */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Support Channels & Methods Cards (Left) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            
            {/* Support Sectors */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                {content.channelsHeading}
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {channels.map((sector) => (
                  <div key={sector.id} className="bg-white border border-[#e8edf2] rounded-[5px] p-6 shadow-xs relative">
                    <span className="absolute top-4 right-4 px-2 py-0.5 bg-gray-50 border border-gray-150 text-[8px] font-black uppercase tracking-wider text-gray-400 rounded-xs">
                      {sector.badge}
                    </span>
                    <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-2 pr-16">
                      {sector.title}
                    </h4>
                    <p className="text-gray-500 text-[11px] leading-relaxed font-semibold">
                      {sector.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                {content.methodsHeading}
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {methods.map((method) => (
                  <div key={method.id} className="bg-white border border-[#e8edf2] rounded-[5px] p-5 text-center shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                      {methodIcon(method.iconKey)}
                    </div>
                    <h4 className="text-[10px] font-black text-navy uppercase tracking-widest mb-1">
                      {method.title}
                    </h4>
                    <span className="block text-xs font-black text-orange-primary truncate mb-1">
                      {resolveMethodValue(method.value)}
                    </span>
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      {method.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time SLA */}
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 text-left relative overflow-hidden shadow-xs">
              <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-2">
                {content.commitmentTitle}
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                {content.commitmentBody}
              </p>
            </div>

          </div>

          {/* Message Form (Right) */}
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
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.name.label}</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder={content.fields.name.placeholder}
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
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.subject.label}</label>
                        <input 
                          type="text" 
                          required
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                          placeholder={content.fields.subject.placeholder}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">{content.fields.message.label}</label>
                        <textarea 
                          rows={4}
                          required
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
                        subject: formData.subject,
                        email: formData.email,
                      })}
                    </p>
                    <button 
                      onClick={() => {
                        setFormData({ name: '', email: '', subject: '', message: '' });
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
