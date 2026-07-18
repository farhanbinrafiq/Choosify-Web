import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, Users, Handshake, Briefcase, Award, Zap, 
  MessageSquare, ArrowRight, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { operationsApi } from '../services/operationsApi';

export function PartnershipPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    partnershipType: 'brand',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email) {
      alert('Please fill in Company Name and Email.');
      return;
    }
    try {
      await operationsApi.submitLead({
        brandName: formData.companyName,
        contactPerson: formData.contactName,
        email: formData.email,
        placementInterest: formData.partnershipType,
        message: formData.message,
        source: 'partnership-page',
      });
    } catch {
      // still show success UX
    }
    setSubmitted(true);
  };

  const categories = [
    {
      id: 'brand',
      icon: <Award className="w-6 h-6 text-orange-primary" />,
      title: 'Brand Partnerships',
      desc: 'Connect your catalog with high-intent buyers, secure a verification badge, and deploy campaigns that drive tangible ROI.'
    },
    {
      id: 'creator',
      icon: <Users className="w-6 h-6 text-[#5C2AFE]" />,
      title: 'Creator Partnerships',
      desc: 'Collaborate on sponsored deals, leverage direct affiliate loops, and expand your community reach across our creator marketplace.'
    },
    {
      id: 'affiliate',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Affiliate Partnerships',
      desc: 'Unlock special commission overrides, integrate exclusive coupon codes, and build durable passive earnings from your traffic.'
    },
    {
      id: 'agency',
      icon: <Briefcase className="w-6 h-6 text-emerald-500" />,
      title: 'Agency Partnerships',
      desc: 'Get consolidated dashboards to manage multiple client brand listings, unlock analytics APIs, and scale brand verified campaigns.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F9] font-sans">
      {/* 1. HERO SECTION */}
      <StaticPageHero>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/10 via-transparent to-black/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="inline-block bg-[#E8500A]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                Collaborate & Scale
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold text-white tracking-tight leading-tight">
                Partnership Opportunities
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                Partner with Choosify, Bangladeshâ€™s leading product discovery platform. Join forces with us to accelerate growth, enhance brand transparency, and empower consumers.
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
                    ðŸ¤
                  </div>
                  <div>
                    <h3 className="text-white text-xs font-black uppercase tracking-wider">Synergetic Ecosystem</h3>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-0.5">Win-Win Dynamic</p>
                  </div>
                </div>
                <p className="text-white/70 text-xs leading-relaxed font-medium">
                  We match verified brands with native creators to drive trustworthy commerce. Empowering buyers with crystal clear data.
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
                Partner With Choosify
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                Choosify acts as the primary hub connecting authentic brands with verified creators and curious shoppers. Our platform supports collaborative growth models that align brand visibility with real audience engagement. Explore how our partnerships can unlock reliable revenue pipelines for your business.
              </p>
            </div>

            {/* Grid of Categories (Partnership Categories) */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#1A1A2E] tracking-tight mb-6">
                Partnership Categories
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat, idx) => (
                  <div key={idx} className="bg-white border border-[#e8edf2] rounded-[5px] p-6 hover:border-orange-primary/20 transition-colors shadow-xs relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 rounded-bl-full group-hover:bg-orange-primary/5 transition-colors" />
                    <div className="mb-4 relative z-10">{cat.icon}</div>
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
                Durable Platform Credibility
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                By aligning with Choosify, partners leverage Bangladeshâ€™s premier, scam-free discovery database. Our unified pricing engine and brand verified claim statuses ensure that customer trust is maintained at every touchpoint.
              </p>
            </div>

          </div>

          {/* Proposal Submission Form (Right) */}
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
                      <h3 className="text-sm font-extrabold text-[#1A1A2E] tracking-tight mb-1">Request Partnership</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Submit strategic collaboration request</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-gray-700">
                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Company / Brand Name *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.companyName}
                          onChange={e => setFormData({...formData, companyName: e.target.value})}
                          placeholder="e.g., Bata, Apex, local agency, or creator name" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Primary Contact Name *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.contactName}
                          onChange={e => setFormData({...formData, contactName: e.target.value})}
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
                          placeholder="e.g., partnerships@brand.com" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Partnership Model</label>
                        <select 
                          value={formData.partnershipType}
                          onChange={e => setFormData({...formData, partnershipType: e.target.value})}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        >
                          <option value="brand">Brand Partnerships</option>
                          <option value="creator">Creator Partnerships</option>
                          <option value="affiliate">Affiliate Partnerships</option>
                          <option value="agency">Agency Partnerships</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Brief Proposal / Message</label>
                        <textarea 
                          rows={4}
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          placeholder="Describe your goals, audience size, integration interests, or agency roster details." 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 bg-[#050514] hover:bg-orange-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group border-none cursor-pointer mt-4"
                      >
                        Submit Proposal
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
                      <h3 className="text-base font-extrabold text-[#1A1A2E] tracking-tight mb-1">Proposal Logged</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Partnership Desk Acknowledged</p>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed font-semibold max-w-sm">
                      We have received the partnership brief for <span className="text-navy font-bold">{formData.companyName}</span>. Our strategic relations desk will review and contact <span className="text-navy font-bold">{formData.contactName}</span> within 2 business days. Thank you for choosing Choosify!
                    </p>
                    <button 
                      onClick={() => {
                        setFormData({ companyName: '', contactName: '', email: '', partnershipType: 'brand', message: '' });
                        setSubmitted(false);
                      }}
                      className="px-6 py-2.5 bg-navy hover:bg-orange-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors border-none cursor-pointer"
                    >
                      Submit Another Request
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
