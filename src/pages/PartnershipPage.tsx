import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Briefcase, Award, Zap, 
  ArrowRight, ShieldCheck
} from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { useGlobalState } from '../context/GlobalStateContext';
import { enabledSorted, fillTemplate, resolveSitePages } from '../lib/cmsSitePages';
import {
  FieldError,
  InquiryFormError,
  InquiryHoneypot,
  InquiryOptionsError,
  InquirySuccessPanel,
  inquiryInputClass,
  inquiryLabelClass,
  useInquiryOptions,
  useInquirySubmit,
  useSignedInContact,
} from '../components/inquiry/inquiryForm';

function partnershipIcon(key?: string) {
  const k = (key || '').toLowerCase();
  if (k === 'users' || k === 'creator') return <Users className="w-6 h-6 text-[#5C2AFE]" />;
  if (k === 'zap' || k === 'affiliate') return <Zap className="w-6 h-6 text-amber-500" />;
  if (k === 'briefcase' || k === 'agency') return <Briefcase className="w-6 h-6 text-emerald-500" />;
  return <Award className="w-6 h-6 text-orange-primary" />;
}

export function PartnershipPage() {
  const { siteConfig } = useGlobalState();
  const content = resolveSitePages(siteConfig?.sitePages).partnership;
  const categories = enabledSorted(content.categories);
  const { options, error: optionsError, retry: retryOptions } = useInquiryOptions();
  const modelOptions = options?.partnershipModels ?? [];
  const signedIn = useSignedInContact();
  const inquiry = useInquirySubmit();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const emptyForm = () => ({
    companyName: '',
    contactName: signedIn.name,
    email: signedIn.email,
    partnershipType: '',
    message: '',
  });
  const [formData, setFormData] = useState(emptyForm);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      email: prev.email || signedIn.email,
      contactName: prev.contactName || signedIn.name,
    }));
  }, [signedIn.email, signedIn.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await inquiry.submit({
      inquiryType: 'partnership',
      brandName: formData.companyName,
      contactPerson: formData.contactName,
      email: formData.email,
      partnershipModel: formData.partnershipType,
      message: formData.message,
      companyFax: honeypot,
    });
  };

  const fe = inquiry.fieldErrors;

  return (
    <div className="min-h-screen bg-choosify-feed font-sans">
      {/* 1. HERO SECTION */}
      <StaticPageHero maxWidthClass="max-w-[1440px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/10 via-transparent to-black/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column */}
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

            {/* Right Column: Hero Information Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-[5px] p-6 max-w-sm w-full text-left backdrop-blur-xs relative overflow-hidden"
              >
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-lg">
                    {content.hero.sideCardIcon || '🤝'}
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
          
          {/* Partnership Categories & Info (Left) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            
            {/* Partner With Choosify */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                {content.partnerHeading}
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {content.partnerBody}
              </p>
            </div>

            {/* Grid of Categories (Partnership Categories) */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#1A1A2E] tracking-tight mb-6">
                {content.categoriesHeading}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white border border-[#e8edf2] rounded-[5px] p-6 hover:border-orange-primary/20 transition-colors shadow-xs relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 rounded-bl-full group-hover:bg-orange-primary/5 transition-colors" />
                    <div className="mb-4 relative z-10">{partnershipIcon(cat.icon || cat.id)}</div>
                    <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-2 relative z-10">
                      {cat.title}
                    </h4>
                    <p className="text-gray-500 text-[11px] leading-relaxed font-semibold relative z-10">
                      {cat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Value Proposition */}
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 text-left relative overflow-hidden shadow-xs">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-primary/5 rounded-full blur-xl pointer-events-none" />
              <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500 w-5 h-5 shrink-0" />
                {content.credibilityTitle}
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                {content.credibilityBody}
              </p>
            </div>

          </div>

          {/* Proposal Submission Form (Right) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 md:p-8 shadow-xs text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5B00] to-[#EF3C23]" />
              
              <AnimatePresence mode="wait">
                {inquiry.status !== 'success' ? (
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

                    <form onSubmit={handleSubmit} noValidate className="relative space-y-4 text-xs font-semibold text-gray-700">
                      <InquiryHoneypot value={honeypot} onChange={setHoneypot} />
                      <div className="space-y-1.5 text-left">
                        <label htmlFor="pt-company" className={inquiryLabelClass}>{content.fields.companyName.label}</label>
                        <input
                          id="pt-company"
                          type="text"
                          required
                          maxLength={options?.limits.name}
                          value={formData.companyName}
                          onChange={e => { setFormData({ ...formData, companyName: e.target.value }); inquiry.clearFieldError('brandName'); }}
                          placeholder={content.fields.companyName.placeholder}
                          aria-invalid={Boolean(fe.brandName)}
                          className={inquiryInputClass}
                        />
                        <FieldError message={fe.brandName} />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="pt-contact" className={inquiryLabelClass}>{content.fields.contactName.label}</label>
                        <input
                          id="pt-contact"
                          type="text"
                          required
                          autoComplete="name"
                          maxLength={options?.limits.name}
                          value={formData.contactName}
                          onChange={e => { setFormData({ ...formData, contactName: e.target.value }); inquiry.clearFieldError('contactPerson'); }}
                          placeholder={content.fields.contactName.placeholder}
                          aria-invalid={Boolean(fe.contactPerson)}
                          className={inquiryInputClass}
                        />
                        <FieldError message={fe.contactPerson} />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="pt-email" className={inquiryLabelClass}>{content.fields.email.label}</label>
                        <input
                          id="pt-email"
                          type="email"
                          required
                          autoComplete="email"
                          maxLength={options?.limits.email}
                          value={formData.email}
                          onChange={e => { setFormData({ ...formData, email: e.target.value }); inquiry.clearFieldError('email'); }}
                          placeholder={content.fields.email.placeholder}
                          aria-invalid={Boolean(fe.email)}
                          className={inquiryInputClass}
                        />
                        <FieldError message={fe.email} />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="pt-model" className={inquiryLabelClass}>{content.fields.partnershipModel.label || 'Partnership Model'} *</label>
                        <select
                          id="pt-model"
                          required
                          value={formData.partnershipType}
                          onChange={e => { setFormData({ ...formData, partnershipType: e.target.value }); inquiry.clearFieldError('partnershipModel'); }}
                          disabled={!options}
                          aria-invalid={Boolean(fe.partnershipModel)}
                          className={inquiryInputClass}
                        >
                          <option value="">{options ? 'Select a partnership model' : 'Loading…'}</option>
                          {modelOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <FieldError message={fe.partnershipModel} />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="pt-message" className={inquiryLabelClass}>{content.fields.message.label}</label>
                        <textarea
                          id="pt-message"
                          rows={4}
                          maxLength={options?.limits.message}
                          value={formData.message}
                          onChange={e => { setFormData({ ...formData, message: e.target.value }); inquiry.clearFieldError('message'); }}
                          placeholder={content.fields.message.placeholder}
                          className={`${inquiryInputClass} resize-none`}
                        />
                        <FieldError message={fe.message} />
                      </div>

                      {optionsError ? <InquiryOptionsError message={optionsError} onRetry={retryOptions} /> : null}
                      <InquiryFormError message={inquiry.error} />

                      <button
                        type="submit"
                        disabled={inquiry.submitting}
                        className="w-full py-3 bg-[#050514] hover:bg-orange-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group border-none cursor-pointer mt-4 disabled:opacity-60 disabled:cursor-wait"
                      >
                        {inquiry.submitting ? 'Sending…' : content.submitLabel}
                        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                    <InquirySuccessPanel
                      title={content.successTitle}
                      subtitle={content.successSubtitle}
                      referenceId={inquiry.referenceId}
                      body={fillTemplate(content.successBodyTemplate, {
                        companyName: formData.companyName,
                        contactName: formData.contactName,
                      })}
                      resetLabel={content.successResetLabel}
                      onReset={() => {
                        setFormData(emptyForm());
                        inquiry.reset();
                      }}
                    />
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
