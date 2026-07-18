import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Lock, FileText } from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';

export function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('collect');
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
    { id: 'collect', label: '1. Information We Collect' },
    { id: 'use', label: '2. How We Use Information' },
    { id: 'cookies', label: '3. Cookies & Tracking' },
    { id: 'security', label: '4. Security Measures' },
    { id: 'third-party', label: '5. Third Party Services' },
    { id: 'rights', label: '6. User Rights' },
    { id: 'retention', label: '7. Data Retention' },
    { id: 'contact', label: '8. Contact Information' }
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
    <div className="min-h-screen bg-[#F4F7F9] font-sans text-left">
      {/* Reading progress indicator bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-orange-primary z-50 transition-all duration-100" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 1. HERO SECTION */}
      <StaticPageHero>
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/10 via-transparent to-black/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-4 text-left">
              <span className="inline-block bg-[#E8500A]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                User Protection
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold text-white tracking-tight leading-tight">
                Privacy Policy
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                We are committed to securing your data. Learn how we collect, store, and utilize your information. Last updated: June 2026.
              </p>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="bg-white/5 border border-white/10 rounded-[5px] p-6 max-w-sm w-full text-left backdrop-blur-xs relative overflow-hidden">
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <Lock size={16} className="text-orange-primary" />
                  Secure Handling
                </h3>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">
                  Our privacy rules ensure absolute confidentiality, in compliance with standard digital protection regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </StaticPageHero>

      {/* 2. BODY CONTENT SECTION */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sticky Left Navigation Index */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-28 space-y-6 flex-shrink-0 text-left">
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 shadow-xs">
              <h3 className="text-[13px] font-bold text-[#1A1A2E] tracking-tight mb-4 pb-2 border-b border-[#e8edf2] flex items-center gap-2">
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
            
            {/* Section: Information We Collect */}
            <div id="collect" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-extrabold text-[#1A1A2E] tracking-tight flex items-center gap-2">
                <span className="text-orange-primary">01.</span> Information We Collect
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                We collect personal parameters to deliver dynamic product comparisons and secure retail checkout loops. This includes:
              </p>
              <ul className="pl-5 list-disc text-xs md:text-sm text-gray-500 font-semibold space-y-2">
                <li><span className="text-navy font-bold">Personal Credentials:</span> Full name, email address, physical shipping coordinates, telephone numbers, and profile details provided during account creation or checkout.</li>
                <li><span className="text-navy font-bold">Seller Information:</span> Brand registration numbers, outlet licenses, and representative contacts.</li>
                <li><span className="text-navy font-bold">Usage Metrics:</span> Browser type, device IP addresses, viewed product comparison categories, and clicked deal voucher codes.</li>
              </ul>
            </div>

            {/* Section: How We Use Information */}
            <div id="use" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-extrabold text-[#1A1A2E] tracking-tight flex items-center gap-2">
                <span className="text-orange-primary">02.</span> How We Use Information
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Choosify utilizes stored parameters strictly for standard operational purposes, including:
              </p>
              <ul className="pl-5 list-disc text-xs md:text-sm text-gray-500 font-semibold space-y-2">
                <li>Operating and optimizing our price comparison calculators and discovery feeds.</li>
                <li>Fulfilling customer orders and processing retail checkout logistics with registered sellers.</li>
                <li>Responding to brand suggestion proposals and partnership forms.</li>
                <li>Detecting fraudulent ratings, fake product reviews, or bot scraping activities.</li>
              </ul>
            </div>

            {/* Section: Cookies & Tracking */}
            <div id="cookies" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-extrabold text-[#1A1A2E] tracking-tight flex items-center gap-2">
                <span className="text-orange-primary">03.</span> Cookies & Tracking Technologies
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                We use tracking cookies, local session storage parameters, and diagnostic tools to persist user selections (e.g., comparison items, dashboard layout preferences, and active carts).
              </p>
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                You can adjust your browser properties to decline cookie tracking, though some parts of the comparison platform or checkout cycles may not operate seamlessly.
              </p>
            </div>

            {/* Section: Security Measures */}
            <div id="security" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-extrabold text-[#1A1A2E] tracking-tight flex items-center gap-2">
                <span className="text-orange-primary">04.</span> Security Measures
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                We implement industry-standard administrative, physical, and technological security barriers to safeguard your personal credentials from unauthorized modification, access, exposure, or destruction.
              </p>
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                All checkout routes and form submissions are protected via Secure Sockets Layer (SSL) encryption, ensuring data transmission remains private.
              </p>
            </div>

            {/* Section: Third Party Services */}
            <div id="third-party" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-extrabold text-[#1A1A2E] tracking-tight flex items-center gap-2">
                <span className="text-orange-primary">05.</span> Third Party Services
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Our platform includes links to third-party brand websites, seller outlets, and creator social profiles. We do not control or assume liability for the privacy guidelines or content hosted on external, third-party sites. We recommend reviewing their policies on their respective platforms.
              </p>
            </div>

            {/* Section: User Rights */}
            <div id="rights" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-extrabold text-[#1A1A2E] tracking-tight flex items-center gap-2">
                <span className="text-orange-primary">06.</span> User Rights
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                Depending on your geographic location, you retain key rights regarding your personal information, including:
              </p>
              <ul className="pl-5 list-disc text-xs md:text-sm text-gray-500 font-semibold space-y-2">
                <li>The right to inspect what personal credentials we store.</li>
                <li>The right to request immediate correction of outdated or incorrect shipping/contact records.</li>
                <li>The right to request total deletion of your profile database and account history from our systems.</li>
              </ul>
            </div>

            {/* Section: Data Retention */}
            <div id="retention" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-extrabold text-[#1A1A2E] tracking-tight flex items-center gap-2">
                <span className="text-orange-primary">07.</span> Data Retention
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                We store collected data only as long as necessary to fulfill active comparison and retail services, support legal compliance audits, or resolve platform disputes. Profile data is kept until an explicit deletion request is received and verified.
              </p>
            </div>

            {/* Section: Contact Information */}
            <div id="contact" className="space-y-4 scroll-mt-24">
              <h2 className="text-lg md:text-xl font-extrabold text-[#1A1A2E] tracking-tight flex items-center gap-2">
                <span className="text-orange-primary">08.</span> Contact Information
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm font-semibold">
                For security inquiries, privacy complaints, or data deletion requests, please contact our data protection office at:
              </p>
              <div className="bg-gray-50 border border-[#e8edf2] rounded-[5px] p-5 space-y-2 text-xs md:text-sm text-gray-700 font-semibold mt-4">
                <p><span className="text-navy font-bold">Email:</span> privacy@choosify.bd</p>
                <p><span className="text-navy font-bold">Office Address:</span> Level 11, Gulshan Commerce Center, Gulshan-2, Dhaka, Bangladesh</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
