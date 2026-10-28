import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { useGlobalState } from '../context/GlobalStateContext';
import { enabledSorted, fillTemplate, resolveSitePages } from '../lib/cmsSitePages';
import { uploadSuggestionImage } from '../services/mediaUpload';
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
  const { options, error: optionsError, retry: retryOptions } = useInquiryOptions();
  const signedIn = useSignedInContact();
  const inquiry = useInquirySubmit();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const emptyForm = () => ({
    brandName: '',
    website: '',
    categoryId: '',
    country: '',
    reason: '',
    email: signedIn.email,
    contactName: signedIn.name,
    description: '',
    location: '',
    priceRange: '',
    tags: '',
    socials: {} as Record<string, string>,
    logo: '',
    coverImage: '',
  });
  const [uploading, setUploading] = useState<'' | 'logo' | 'coverImage'>('');
  const [uploadError, setUploadError] = useState('');
  const pickImage = async (field: 'logo' | 'coverImage', file: File) => {
    setUploading(field);
    setUploadError('');
    try {
      const url = await uploadSuggestionImage(file);
      setFormData((prev) => ({ ...prev, [field]: url }));
      inquiry.clearFieldError(field);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading('');
    }
  };
  const [formData, setFormData] = useState(emptyForm);
  const [honeypot, setHoneypot] = useState('');

  // Signed-in details can arrive after first render; only fill fields the user hasn't typed in.
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
      inquiryType: 'suggest_brand',
      brandName: formData.brandName,
      website: formData.website,
      categoryId: formData.categoryId || undefined,
      country: formData.country,
      message: formData.reason,
      email: formData.email,
      contactPerson: formData.contactName,
      description: formData.description || undefined,
      location: formData.location || undefined,
      priceRange: formData.priceRange || undefined,
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      socialLinks: Object.fromEntries(Object.entries(formData.socials).filter(([, v]) => v.trim())),
      ...(signedIn.email && formData.logo ? { logo: formData.logo } : {}),
      ...(signedIn.email && formData.coverImage ? { coverImage: formData.coverImage } : {}),
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
                        <label htmlFor="sb-brand" className={inquiryLabelClass}>{content.fields.brandName.label}</label>
                        <input
                          id="sb-brand"
                          type="text"
                          required
                          maxLength={options?.limits.name}
                          value={formData.brandName}
                          onChange={e => { setFormData({ ...formData, brandName: e.target.value }); inquiry.clearFieldError('brandName'); }}
                          placeholder={content.fields.brandName.placeholder}
                          aria-invalid={Boolean(fe.brandName)}
                          className={inquiryInputClass}
                        />
                        <FieldError message={fe.brandName} />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="sb-website" className={inquiryLabelClass}>{content.fields.website.label}</label>
                        <input
                          id="sb-website"
                          type="text"
                          inputMode="url"
                          required
                          maxLength={options?.limits.url}
                          value={formData.website}
                          onChange={e => { setFormData({ ...formData, website: e.target.value }); inquiry.clearFieldError('website'); }}
                          placeholder={content.fields.website.placeholder}
                          aria-invalid={Boolean(fe.website)}
                          className={inquiryInputClass}
                        />
                        <FieldError message={fe.website} />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="sb-category" className={inquiryLabelClass}>{content.fields.category.label}</label>
                        <select
                          id="sb-category"
                          value={formData.categoryId}
                          onChange={e => { setFormData({ ...formData, categoryId: e.target.value }); inquiry.clearFieldError('categoryId'); }}
                          disabled={!options}
                          aria-invalid={Boolean(fe.categoryId)}
                          className={inquiryInputClass}
                        >
                          <option value="">{options ? content.fields.category.placeholder || 'Select a Category' : 'Loading categories…'}</option>
                          {(options?.categories ?? []).filter((c) => !c.parentId).map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <FieldError message={fe.categoryId} />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="sb-country" className={inquiryLabelClass}>{content.fields.country.label}</label>
                        <input
                          id="sb-country"
                          type="text"
                          maxLength={options?.limits.country}
                          value={formData.country}
                          onChange={e => { setFormData({ ...formData, country: e.target.value }); inquiry.clearFieldError('country'); }}
                          placeholder={content.fields.country.placeholder}
                          className={inquiryInputClass}
                        />
                        <FieldError message={fe.country} />
                      </div>

                      <fieldset className="space-y-4 rounded-xl border border-[#E8EDF2] p-4 text-left" data-testid="sb-profile-details">
                        <legend className="px-1 text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Brand details (optional)</legend>
                        <p className="text-[11.5px] text-[#6B7280]">
                          These help us create the brand's profile faster once it's approved.
                        </p>
                        <div className="space-y-1.5">
                          <label htmlFor="sb-description" className={inquiryLabelClass}>Short description</label>
                          <textarea
                            id="sb-description"
                            rows={2}
                            maxLength={600}
                            value={formData.description}
                            onChange={(e) => { setFormData({ ...formData, description: e.target.value }); inquiry.clearFieldError('description'); }}
                            placeholder="What the brand makes or sells"
                            className={`${inquiryInputClass} resize-none`}
                          />
                          <FieldError message={fe.description} />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <label htmlFor="sb-location" className={inquiryLabelClass}>Location</label>
                            <input
                              id="sb-location"
                              type="text"
                              maxLength={120}
                              value={formData.location}
                              onChange={(e) => { setFormData({ ...formData, location: e.target.value }); inquiry.clearFieldError('location'); }}
                              placeholder="e.g. Dhaka, Bangladesh"
                              className={inquiryInputClass}
                            />
                            <FieldError message={fe.location} />
                          </div>
                          <div className="space-y-1.5">
                            <label htmlFor="sb-price" className={inquiryLabelClass}>Price range</label>
                            <input
                              id="sb-price"
                              type="text"
                              maxLength={60}
                              value={formData.priceRange}
                              onChange={(e) => { setFormData({ ...formData, priceRange: e.target.value }); inquiry.clearFieldError('priceRange'); }}
                              placeholder="e.g. ৳1,000 – ৳20,000"
                              className={inquiryInputClass}
                            />
                            <FieldError message={fe.priceRange} />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="sb-tags" className={inquiryLabelClass}>Best for</label>
                          <input
                            id="sb-tags"
                            type="text"
                            maxLength={600}
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="What they're best known for, separated by commas — e.g. Men's Shirts, Sunglasses"
                            className={inquiryInputClass}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {(['facebook', 'instagram', 'youtube', 'tiktok', 'linkedin'] as const).map((k) => (
                            <div key={k} className="space-y-1.5">
                              <label htmlFor={`sb-${k}`} className={`${inquiryLabelClass} capitalize`}>{k}</label>
                              <input
                                id={`sb-${k}`}
                                type="url"
                                maxLength={500}
                                value={formData.socials[k] || ''}
                                onChange={(e) => { setFormData({ ...formData, socials: { ...formData.socials, [k]: e.target.value } }); inquiry.clearFieldError('socialLinks'); }}
                                placeholder={`https://${k === 'youtube' ? 'youtube.com/@' : `${k}.com/`}…`}
                                className={inquiryInputClass}
                              />
                            </div>
                          ))}
                        </div>
                        <FieldError message={fe.socialLinks} />
                        {signedIn.email ? (
                          <div className="grid gap-4 sm:grid-cols-2" data-testid="sb-images">
                            {(['logo', 'coverImage'] as const).map((field) => (
                              <div key={field} className="space-y-1.5">
                                <span className={inquiryLabelClass}>{field === 'logo' ? 'Logo' : 'Cover image'}</span>
                                <label
                                  htmlFor={`sb-${field}`}
                                  className="flex h-24 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#D1D5DB] bg-[#F8FAFC] text-[11px] font-bold text-[#6B7280]"
                                >
                                  {formData[field] ? (
                                    <img src={formData[field]} alt="" className="h-full w-full object-cover" data-testid={`sb-${field}-preview`} />
                                  ) : uploading === field ? (
                                    'Uploading…'
                                  ) : (
                                    'Choose an image'
                                  )}
                                </label>
                                <input
                                  id={`sb-${field}`}
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/avif"
                                  className="hidden"
                                  disabled={Boolean(uploading)}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    e.target.value = '';
                                    if (file) void pickImage(field, file);
                                  }}
                                />
                                {formData[field] && (
                                  <button type="button" className="text-[11px] font-bold text-red-600" onClick={() => setFormData({ ...formData, [field]: '' })}>
                                    Remove
                                  </button>
                                )}
                                <FieldError message={fe[field]} />
                              </div>
                            ))}
                            {uploadError && <p className="text-[11px] font-semibold text-red-600 sm:col-span-2">{uploadError}</p>}
                          </div>
                        ) : (
                          <p className="text-[11.5px] text-[#6B7280]" data-testid="sb-images-signin">
                            Sign in to add the brand's logo and cover image.
                          </p>
                        )}
                      </fieldset>

                      <div className="space-y-1.5 text-left">
                        <label htmlFor="sb-reason" className={inquiryLabelClass}>{content.fields.reason.label}</label>
                        <textarea
                          id="sb-reason"
                          rows={3}
                          required
                          maxLength={options?.limits.message}
                          value={formData.reason}
                          onChange={e => { setFormData({ ...formData, reason: e.target.value }); inquiry.clearFieldError('message'); }}
                          placeholder={content.fields.reason.placeholder}
                          aria-invalid={Boolean(fe.message)}
                          className={`${inquiryInputClass} resize-none`}
                        />
                        <FieldError message={fe.message} />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5 text-left">
                          <label htmlFor="sb-email" className={inquiryLabelClass}>Your Email *</label>
                          <input
                            id="sb-email"
                            type="email"
                            required
                            autoComplete="email"
                            maxLength={options?.limits.email}
                            value={formData.email}
                            onChange={e => { setFormData({ ...formData, email: e.target.value }); inquiry.clearFieldError('email'); }}
                            placeholder="So we can follow up"
                            aria-invalid={Boolean(fe.email)}
                            className={inquiryInputClass}
                          />
                          <FieldError message={fe.email} />
                        </div>
                        <div className="space-y-1.5 text-left">
                          <label htmlFor="sb-name" className={inquiryLabelClass}>Your Name</label>
                          <input
                            id="sb-name"
                            type="text"
                            autoComplete="name"
                            maxLength={options?.limits.name}
                            value={formData.contactName}
                            onChange={e => { setFormData({ ...formData, contactName: e.target.value }); inquiry.clearFieldError('contactPerson'); }}
                            className={inquiryInputClass}
                          />
                          <FieldError message={fe.contactPerson} />
                        </div>
                      </div>

                      {optionsError ? <InquiryOptionsError message={optionsError} onRetry={retryOptions} /> : null}
                      <InquiryFormError message={inquiry.error} />

                      <button
                        type="submit"
                        disabled={inquiry.submitting || Boolean(uploading)}
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
                      body={fillTemplate(content.successBodyTemplate, { brandName: formData.brandName })}
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
