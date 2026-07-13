import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, Mail, MessageCircle, Share2, Phone, MapPin, 
  HelpCircle, ArrowRight, ShieldCheck, CheckCircle
} from 'lucide-react';

export function ContactPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject) {
      alert('Please fill in Name, Email, and Subject fields.');
      return;
    }
    setSubmitted(true);
  };

  const contactSectors = [
    {
      title: 'General Support',
      desc: 'Got questions about price comparisons, local deal updates, or user accounts? Our support team is ready to help.',
      badge: 'Help Desk'
    },
    {
      title: 'Brand Support',
      desc: 'Need assistance claiming your brand page, adjusting listing descriptions, or managing discount coupons?',
      badge: 'Sellers Desk'
    },
    {
      title: 'Creator Support',
      desc: 'Encountered issues syncing your TikTok profile or updating your directory portfolio? Let’s resolve it.',
      badge: 'Creators Desk'
    },
    {
      title: 'Business Inquiries',
      desc: 'Interested in bespoke B2B API integrations, sponsored guide campaigns, or corporate advertising plans?',
      badge: 'BD Team'
    }
  ];

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5 text-orange-primary" />,
      label: 'Email Support',
      value: 'support@choosify.bd',
      desc: 'Response within 24 hours'
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-emerald-500" />,
      label: 'Messenger Support',
      value: 'fb.com/choosify.bd',
      desc: 'Live chat during working hours'
    },
    {
      icon: <Share2 className="w-5 h-5 text-[#5C2AFE]" />,
      label: 'Social Channels',
      value: '@choosify.bd',
      desc: 'DM us on Instagram or TikTok'
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
            <span className="text-white">Contact Us</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="inline-block bg-[#FF5B00]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                Get In Touch
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                Contact Choosify
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                We're here to assist. Connect with our dedicated support, brand verification, and business development relations desk.
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
                  Dhaka HQ
                </h3>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">
                  Level 11, Gulshan Commerce Center, Road 45, Gulshan-2, Dhaka, Bangladesh.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT SECTION */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Support Channels & Methods Cards (Left) */}
          <div className="lg:col-span-7 space-y-12 text-left">
            
            {/* Support Sectors */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                Support Channels
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactSectors.map((sector, idx) => (
                  <div key={idx} className="bg-white border border-[#e8edf2] rounded-[5px] p-6 shadow-xs relative">
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
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                Contact Methods
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactMethods.map((method, idx) => (
                  <div key={idx} className="bg-white border border-[#e8edf2] rounded-[5px] p-5 text-center shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                      {method.icon}
                    </div>
                    <h4 className="text-[10px] font-black text-navy uppercase tracking-widest mb-1">
                      {method.label}
                    </h4>
                    <span className="block text-xs font-black text-orange-primary truncate mb-1">
                      {method.value}
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
                Commitment to Prompt Responses
              </h4>
              <p className="text-gray-500 text-xs leading-relaxed font-semibold">
                We prioritize user and seller satisfaction above all. Our general SLA response window is under 24 hours for verified sellers, and 48 hours for general community inquiries. Thank you for helping us maintain a transparent marketplace!
              </p>
            </div>

          </div>

          {/* Message Form (Right) */}
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
                      <h3 className="text-sm font-black text-navy uppercase tracking-widest italic mb-1">Send A Message</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Fill in parameters below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-gray-700">
                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Your Name *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g., Farhan Bin Rafiq" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          placeholder="e.g., support@brand.com" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Subject *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                          placeholder="e.g., Verification Dispute, Guide Suggestion" 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[10px] uppercase tracking-wider text-navy font-bold">Message Content *</label>
                        <textarea 
                          rows={4}
                          required
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          placeholder="How can we help? Provide order details or profile link if relevant." 
                          className="w-full p-3 bg-gray-50/50 border border-gray-200 rounded-[5px] outline-none text-navy focus:border-orange-primary transition-colors font-medium resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-3 bg-[#050514] hover:bg-orange-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md transition-all flex items-center justify-center gap-2 group border-none cursor-pointer mt-4"
                      >
                        Submit Message
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
                      <h3 className="text-base font-black text-navy uppercase tracking-widest italic mb-1">Message Logged</h3>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Support Desk Notified</p>
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed font-semibold max-w-sm">
                      We have logged your query. Our team will review your message regarding <span className="text-navy font-bold">"{formData.subject}"</span> and reply back to <span className="text-navy font-bold">{formData.email}</span> shortly. Thank you for reaching out!
                    </p>
                    <button 
                      onClick={() => {
                        setFormData({ name: '', email: '', subject: '', message: '' });
                        setSubmitted(false);
                      }}
                      className="px-6 py-2.5 bg-navy hover:bg-orange-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors border-none cursor-pointer"
                    >
                      Send Another Message
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
