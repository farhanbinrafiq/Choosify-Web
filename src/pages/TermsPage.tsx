import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Scale, FileText, ArrowRight } from 'lucide-react';

export function TermsPage() {
  const [activeSection, setActiveSection] = useState('intro');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'intro', label: '1. Introduction' },
    { id: 'user-resp', label: '2. User Responsibilities' },
    { id: 'seller-resp', label: '3. Seller Responsibilities' },
    { id: 'creator-resp', label: '4. Creator Responsibilities' },
    { id: 'intellectual-prop', label: '5. Intellectual Property' },
    { id: 'prohibited-act', label: '6. Prohibited Activities' },
    { id: 'termination', label: '7. Account Termination' },
    { id: 'disclaimers', label: '8. Disclaimers' },
    { id: 'contact', label: '9. Contact Information' }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // sticky header offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-sans text-left">
      {/* Reading progress indicator bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-orange-primary z-50 transition-all duration-100" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative h-[303px] flex items-center choosify-dark-gradient text-white overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/10 via-transparent to-black/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-white">Terms of Service</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <span className="inline-block bg-[#FF5B00]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                Legal Standards
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                Terms of Service
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                Please read these terms carefully before accessing or using Choosify. Last updated: June 2026.
              </p>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="bg-white/5 border border-white/10 rounded-[5px] p-6 max-w-sm w-full text-left backdrop-blur-xs relative overflow-hidden">
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <Scale size={16} className="text-orange-primary" />
                  Legal Integrity
                </h3>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">
                  By using our product discovery platform, comparison tools, and deal portals, you agree to comply with our global user rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT SECTION */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sticky Left Navigation Index (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-28 space-y-6 flex-shrink-0 text-left">
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 shadow-xs">
              <h3 className="text-xs font-black text-navy uppercase tracking-widest italic mb-4 pb-2 border-b border-[#e8edf2] flex items-center gap-2">
                <FileText size={14} className="text-orange-primary" />
                Document Index
              </h3>
              <nav className="flex flex-col space-y-1">
                {sections.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all border-none cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-orange-primary/5 text-orange-primary font-black'
                        : 'text-gray-500 hover:text-navy hover:bg-gray-50'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Legal Content Body (Right) */}
          <div className="lg:col-span-8 bg-white border border-[#e8edf2] rounded-[5px] p-8 md:p-12 shadow-xs space-y-12 leading-relaxed text-left">
            
            {/* Section: Introduction */}
            <div id="intro" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight italic flex items-center gap-2">
                <span className="text-orange-primary">01.</span> Introduction
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Welcome to Choosify (owned and operated by Choosify.bd). These Terms of Service ("Terms") govern your access to and use of our website, mobile applications, product discovery catalogs, pricing comparison engines, coupon code features, and seller services (collectively, the "Platform").
              </p>
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                By accessing, browsing, registering for, or using any part of the Platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not agree to these Terms, please refrain from using our Platform immediately.
              </p>
            </div>

            {/* Section: User Responsibilities */}
            <div id="user-resp" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight italic flex items-center gap-2">
                <span className="text-orange-primary">02.</span> User Responsibilities
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                As a user of Choosify, you agree to utilize the Platform solely for lawful purposes and in absolute compliance with these Terms. Specifically:
              </p>
              <ul className="pl-5 list-disc text-xs md:text-sm text-gray-500 font-semibold space-y-2">
                <li>You must provide truthful, accurate, and current information when registering an account, proposing brand suggestions, or leaving public product reviews.</li>
                <li>You are solely responsible for protecting the confidentiality of your account password and for all activity occurring under your account.</li>
                <li>You agree not to bypass, disable, or interfere with any security features or comparison validation mechanisms integrated into the Platform.</li>
              </ul>
            </div>

            {/* Section: Seller Responsibilities */}
            <div id="seller-resp" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight italic flex items-center gap-2">
                <span className="text-orange-primary">03.</span> Seller Responsibilities
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Sellers who claim brand profiles, submit wholesale products, or post coupon offers on Choosify must adhere to high standards of commercial honesty:
              </p>
              <ul className="pl-5 list-disc text-xs md:text-sm text-gray-500 font-semibold space-y-2">
                <li>Sellers must guarantee the authenticity of listed items. Listing replica, counterfeit, or misleadingly branded goods is strictly prohibited and subject to immediate ban.</li>
                <li>Sellers must maintain honest and accurate inventory, pricing parameters, and delivery options inside their dashboards.</li>
                <li>Sellers are legally liable for fulfilling orders processed via integrated retail checkout loops and maintaining BSTI certifications where applicable.</li>
              </ul>
            </div>

            {/* Section: Creator Responsibilities */}
            <div id="creator-resp" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight italic flex items-center gap-2">
                <span className="text-orange-primary">04.</span> Creator Responsibilities
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Influencers and creators registered on our Directory agree to maintain integrity in their recommendations and sponsored videos:
              </p>
              <ul className="pl-5 list-disc text-xs md:text-sm text-gray-500 font-semibold space-y-2">
                <li>Creators must disclose any affiliate relationships, paid sponsorships, or promotional perks related to products they feature or review on the Platform.</li>
                <li>Creators are prohibited from posting false reviews, misleading rating boosts, or unverified claims regarding brand products.</li>
              </ul>
            </div>

            {/* Section: Intellectual Property */}
            <div id="intellectual-prop" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight italic flex items-center gap-2">
                <span className="text-orange-primary">05.</span> Intellectual Property
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                The Platform design, code, logos, trademarks, visual assets, text layouts, comparison algorithms, and databases are the exclusive intellectual property of Choosify.bd and are protected by Bangladeshi intellectual property laws.
              </p>
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Users retain ownership of content they publish (such as review text or suggested brand descriptions) but grant Choosify an infinite, royalty-free, global license to display, index, and promote that user-generated content across our discovery ecosystems.
              </p>
            </div>

            {/* Section: Prohibited Activities */}
            <div id="prohibited-act" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight italic flex items-center gap-2">
                <span className="text-orange-primary">06.</span> Prohibited Activities
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Users are strictly forbidden from engaging in the following behaviors on Choosify:
              </p>
              <ul className="pl-5 list-disc text-xs md:text-sm text-gray-500 font-semibold space-y-2">
                <li>Using web scrapers, data miners, or bots to harvest product comparison lists, creator directories, or deal databases without our express written permission.</li>
                <li>Posting abusive, pornographic, harassing, or defamatory text inside public reviews or brand suggestion descriptions.</li>
                <li>Creating fake accounts to boost store ratings, post fake deals, or spam competitor listings.</li>
              </ul>
            </div>

            {/* Section: Account Termination */}
            <div id="termination" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight italic flex items-center gap-2">
                <span className="text-orange-primary">07.</span> Account Termination
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Choosify reserves the absolute right to suspend, terminate, or restrict access to any user, creator, or seller account at our sole discretion, without prior notice, for conduct that violates these Terms, harms our community, or compromises the commercial integrity of the Platform.
              </p>
            </div>

            {/* Section: Disclaimers */}
            <div id="disclaimers" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight italic flex items-center gap-2">
                <span className="text-orange-primary">08.</span> Disclaimers
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Choosify is a product discovery and price comparison platform. While we make every effort to verify seller authenticity and catalog data accuracy, we do not warrant or guarantee that any seller offers, deal codes, specifications, or pricing descriptions listed on the Platform are completely error-free or current at any given instant.
              </p>
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Our Platform is provided "as is" and "as available," without warranties of any kind, whether express or implied.
              </p>
            </div>

            {/* Section: Contact Information */}
            <div id="contact" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight italic flex items-center gap-2">
                <span className="text-orange-primary">09.</span> Contact Information
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                If you have any questions, compliance inquiries, or disputes regarding these Terms of Service, please reach out to our legal compliance office at:
              </p>
              <div className="bg-gray-50 border border-[#e8edf2] rounded-[5px] p-5 space-y-2 text-xs md:text-sm text-gray-700 font-semibold mt-4">
                <p><span className="text-navy font-bold">Email:</span> legal@choosify.bd</p>
                <p><span className="text-navy font-bold">Address:</span> Level 11, Gulshan Commerce Center, Gulshan-2, Dhaka, Bangladesh</p>
                <p><span className="text-navy font-bold">Response Window:</span> 3 Business Days</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
