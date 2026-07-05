import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, ShieldCheck, BarChart3, Users2, Truck, Network, 
  Settings, Layers, Database, ArrowRight, Building, CheckCircle
} from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';

export function B2BSolutionsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    solutionInterest: 'verification',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email) {
      alert('Please fill in Company Name and Email.');
      return;
    }
    setSubmitted(true);
  };

  const businessCapabilityCards = [
    {
      icon: <Layers className="w-6 h-6 text-orange-primary" />,
      title: 'Marketplace Presence',
      desc: 'Build high-density responsive digital storefront catalogs mapped accurately inside our localized search directory.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#5C2AFE]" />,
      title: 'Brand Verification',
      desc: 'Secure an official verified status. Establish user trust and eliminate local counterfeit competitors.'
    },
    {
      icon: <Truck className="w-6 h-6 text-emerald-500" />,
      title: 'Product Distribution',
      desc: 'Optimize wholesale inventories and manage retail shipping models targeted specifically at high-conversion zones.'
    },
    {
      icon: <Users2 className="w-6 h-6 text-indigo-500" />,
      title: 'Influencer Campaigns',
      desc: 'Deploy native campaigns across our verified creator directory to generate organic social proof and viral videos.'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-500" />,
      title: 'Analytics & Insights',
      desc: 'Unlock comprehensive click metrics, price-comparison heatmaps, and local competitor research databases.'
    },
    {
      icon: <Database className="w-6 h-6 text-cyan-500" />,
      title: 'B2B Sourcing API',
      desc: 'Integrate your core inventory management tools directly into our pricing comparisons via custom webhook setups.'
    },
    {
      icon: <Settings className="w-6 h-6 text-rose-500" />,
      title: 'Seller Dashboard',
      desc: 'Unified controls to adjust prices, track custom vouchers, manage orders, and message pending leads in real-time.'
    },
    {
      icon: <Network className="w-6 h-6 text-teal-500" />,
      title: 'Multi-Channel Commerce',
      desc: 'Connect your offline boutique outlets with online profiles seamlessly, driving high local physical footfall.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-sans">
      {/* 1. HERO SECTION */}
      <StaticPageHero>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/10 via-transparent to-black/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="inline-block bg-[#E8500A]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                Enterprise Commerce Hub
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                Business Solutions
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                Scale your retail operation, verify your authenticity, analyze competitor trends, and sync inventory catalogs with Bangladesh's smartest product comparison ecosystem.
              </p>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-[5px] p-6 max-w-sm w-full text-left backdrop-blur-xs relative overflow-hidden"
              >
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <Building size={16} className="text-orange-primary" />
                  B2B Sourcing Desk
                </h3>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">
                  Gain verified claim badges, eliminate physical-digital sales friction, and leverage automated comparison charts to showcase quality.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </StaticPageHero>

      {/* 2. BODY CONTENT SECTION */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Business Capabilities Grid (Left) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            
            {/* Core Capability Summary */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                Strategic B2B Capabilities
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                Choosify empowers brands with structured visibility models to increase local consumer trust. Whether you run a premier shopping mall outlet or a major digital boutique, our customized business capabilities streamline lead conversions and combat counterfeit competition.
              </p>
            </div>

            {/* Feature Grid: 6-8 cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-navy uppercase tracking-tight italic mb-6">
                Capability Solutions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {businessCapabilityCards.map((feat, idx) => (
                  <div key={idx} className="bg-white border border-[#e8edf2] rounded-[5px] p-6 hover:border-orange-primary/20 transition-colors shadow-xs relative group text-left">
                    <div className="mb-4 relative z-10">{feat.icon}</div>
                    <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-2 relative z-10">
                      {feat.title}
                    </h4>
                    <p className="text-gray-500 text-[11px] leading-relaxed font-semibold relative z-10">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Integration Section */}
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 text-left relative overflow-hidden shadow-xs">
              <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-2">
                Unified Data Integration
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                Our team assists B2B partners in syncing real-time SKU pricing, stocking states, and coupon codes directly with their internal inventory systems. Reduce double-entry errors and present transparent offers to the comparison feeds automatically.
              </p>
            </div>

          </div>

          {/* Book Consultation Form (Right) */}
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
                      <h3 className="text-sm font-black text-navy uppercase tracking-widest italic mb-1">Book A Consultation</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Arrange brief technical alignment call</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-gray-700">
                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Company Name *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.companyName}
                          onChange={e => setFormData({...formData, companyName: e.target.value})}
                          placeholder="e.g., Apex Footwear, Aarong Group" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Contact Representative *</label>
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
                          placeholder="e.g., corporate@brand.com" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Solution Focus</label>
                        <select 
                          value={formData.solutionInterest}
                          onChange={e => setFormData({...formData, solutionInterest: e.target.value})}
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        >
                          <option value="verification">Official Brand Verification Badge</option>
                          <option value="api-sync">SKU Inventory API Sync</option>
                          <option value="creators">Influencer Campaign Packages</option>
                          <option value="analytics">Market Insights & Competitor Data</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Business Context / Message</label>
                        <textarea 
                          rows={4}
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          placeholder="Describe your active channels, SKU volumes, or technical sync goals." 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 bg-[#050514] hover:bg-orange-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group border-none cursor-pointer mt-4"
                      >
                        Book A Consultation
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
                      <h3 className="text-base font-black text-navy uppercase tracking-widest italic mb-1">Consultation Booked</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">B2B Relations Desk Engaged</p>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed font-semibold max-w-sm">
                      We have received the consultation request for <span className="text-navy font-bold">{formData.companyName}</span>. A business development consultant will schedule an alignment call with <span className="text-navy font-bold">{formData.contactName}</span> shortly. Thank you for partnering with Choosify!
                    </p>
                    <button 
                      onClick={() => {
                        setFormData({ companyName: '', contactName: '', email: '', solutionInterest: 'verification', message: '' });
                        setSubmitted(false);
                      }}
                      className="px-6 py-2.5 bg-navy hover:bg-orange-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors border-none cursor-pointer"
                    >
                      Book Another Consultation
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
