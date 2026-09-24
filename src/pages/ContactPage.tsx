import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, MessageCircleMore, Share2, MapPin, 
  ArrowRight
} from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { useGlobalState } from '../context/GlobalStateContext';
import { enabledSorted, fillTemplate, resolveSitePages } from '../lib/cmsSitePages';
import {
  FieldError,
  InquiryFormError,
  InquiryHoneypot,
  InquirySuccessPanel,
  inquiryInputClass,
  inquiryLabelClass,
  useInquirySubmit,
  useSignedInContact,
} from '../components/inquiry/inquiryForm';

function methodIcon(iconKey?: string) {
  if (iconKey === 'messenger') return <MessageCircleMore className="w-5 h-5 text-[#FF5B00]" />;
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

  const signedIn = useSignedInContact();
  const inquiry = useInquirySubmit();
  const emptyForm = () => ({ name: signedIn.name, email: signedIn.email, subject: '', message: '' });
  const [formData, setFormData] = useState(emptyForm);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    setFormData((prev) => ({ ...prev, email: prev.email || signedIn.email, name: prev.name || signedIn.name }));
  }, [signedIn.email, signedIn.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await inquiry.submit({
      inquiryType: 'general_contact',
      contactPerson: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      companyFax: honeypot,
    });
  };

  const fe = inquiry.fieldErrors;

  const resolveMethodValue = (value: string) =>
    content.useGlobalSupportEmail
      ? fillTemplate(value, { supportEmail })
      : value;

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
                        <label htmlFor="ct-name" className={inquiryLabelClass}>{content.fields.name.label}</label>
                        <input
                          id="ct-name"
                          type="text"
                          required
                          autoComplete="name"
                          maxLength={120}
                          value={formData.name}
                          onChange={e => { setFormData({ ...formData, name: e.target.value }); inquiry.clearFieldError('contactPerson'); }}
                          placeholder={content.fields.name.placeholder}
                          aria-invalid={Boolean(fe.contactPerson)}
                          className={inquiryInputClass}
                        />
                        <FieldError message={fe.contactPerson} />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="ct-email" className={inquiryLabelClass}>{content.fields.email.label}</label>
                        <input
                          id="ct-email"
                          type="email"
                          required
                          autoComplete="email"
                          maxLength={254}
                          value={formData.email}
                          onChange={e => { setFormData({ ...formData, email: e.target.value }); inquiry.clearFieldError('email'); }}
                          placeholder={content.fields.email.placeholder}
                          aria-invalid={Boolean(fe.email)}
                          className={inquiryInputClass}
                        />
                        <FieldError message={fe.email} />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="ct-subject" className={inquiryLabelClass}>{content.fields.subject.label}</label>
                        <input
                          id="ct-subject"
                          type="text"
                          required
                          maxLength={160}
                          value={formData.subject}
                          onChange={e => { setFormData({ ...formData, subject: e.target.value }); inquiry.clearFieldError('subject'); }}
                          placeholder={content.fields.subject.placeholder}
                          aria-invalid={Boolean(fe.subject)}
                          className={inquiryInputClass}
                        />
                        <FieldError message={fe.subject} />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="ct-message" className={inquiryLabelClass}>{content.fields.message.label}</label>
                        <textarea
                          id="ct-message"
                          rows={4}
                          required
                          maxLength={4000}
                          value={formData.message}
                          onChange={e => { setFormData({ ...formData, message: e.target.value }); inquiry.clearFieldError('message'); }}
                          placeholder={content.fields.message.placeholder}
                          aria-invalid={Boolean(fe.message)}
                          className={`${inquiryInputClass} resize-none`}
                        />
                        <FieldError message={fe.message} />
                      </div>

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
                        subject: formData.subject,
                        email: formData.email,
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
