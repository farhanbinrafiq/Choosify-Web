import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Compass, ShieldCheck, HelpCircle, Award, 
  Sparkles, Layers, Users, Zap, Calendar, Heart, ArrowRight
} from 'lucide-react';

export function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const featureCards = [
    {
      icon: <Compass className="w-6 h-6 text-orange-primary" />,
      title: 'Brand Discovery',
      desc: 'Discover vetted retail catalogs across Bangladesh. Sort alphabetically or filter down to certified outlets.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#5C2AFE]" />,
      title: 'Recommendations',
      desc: 'Read highly-researched shopping guides, expert reviews, and editor-approved product lists.'
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-500" />,
      title: 'Product Comparison',
      desc: 'Compare spec metrics side-by-side. Analyze pricing sheets across multiple sellers to secure the best rates.'
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Deals & Coupons',
      desc: 'Unlock active seller promos, hot deals, and community-submitted voucher codes to save on every checkout.'
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-500" />,
      title: 'Creator Marketplace',
      desc: 'Follow trustworthy creators who share authentic video reviews, lookbooks, and hand-on tests.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
      title: 'Community Insights',
      desc: 'Contribute rating reviews and verified purchase flags, helping other shoppers avoid online scams.'
    }
  ];

  const timelineEvents = [
    {
      year: '2024',
      title: 'Platform Foundation',
      desc: 'Choosify.bd is launched as an independent price-comparison spreadsheet directory for tech gadgets.'
    },
    {
      year: '2025',
      title: 'Ecosystem Expansion',
      desc: 'Integrated local fashion boutiques and beauty brands. Launched the verified claim badge system for sellers.'
    },
    {
      year: '2026',
      title: 'Creator Synergy',
      desc: 'Deployed the native Influencer Directory and integrated retail checkout loops to automate Dhaka shipping.'
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
            <span className="text-white">About Us</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="inline-block bg-[#E8500A]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                Our Story & Vision
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                About Choosify
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                Helping consumers discover trusted brands, products, creators, and deals. We are building Bangladesh's smartest product discovery platform.
              </p>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="bg-white/5 border border-white/10 rounded-[5px] p-6 max-w-sm w-full text-left backdrop-blur-xs relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-orange-primary/10 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <Heart size={16} className="text-orange-primary" />
                  Ecosystem of Trust
                </h3>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">
                  We empower Bangladeshi buyers with crystal-clear comparison algorithms, preventing social commerce scams and celebrating authentic boutique shops.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT SECTION */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-16 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Story & Core Sections (Left) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Section: Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h2 className="text-xl font-black text-navy uppercase tracking-tight italic">
                  Our Mission
                </h2>
                <div className="h-0.5 w-16 bg-orange-primary mb-4" />
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-semibold">
                  To establish absolute commercial transparency for consumers in Bangladesh by centralizing product data, tracking competitor pricing sheets, and vetting brand claims under a unified trust database.
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-black text-navy uppercase tracking-tight italic">
                  Our Vision
                </h2>
                <div className="h-0.5 w-16 bg-orange-primary mb-4" />
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-semibold">
                  To become the primary online starting point for any purchase decision in Bangladesh—helping millions of shoppers buy safely while supporting local artisans, verified creators, and authentic stores.
                </p>
              </div>
            </div>

            {/* Section: Why Choosify Exists */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                Why Choosify Exists
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-4" />
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-semibold">
                Online shopping in Bangladesh is highly vibrant but fragmented. Consumers face hundreds of Facebook pages, independent websites, and individual Instagram feeds daily. This leads to massive price discrepancies, listing errors, and unfortunately, widespread commercial scams.
              </p>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-semibold">
                Choosify was created to organize this chaos. By matching specific items, indexing verified store outlets, compiling active deals, and embedding authentic influencer reviews, we empower buyers with the tools they need to compare parameters and decide confidently.
              </p>
            </div>

            {/* Section: How Choosify Works */}
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                How Choosify Works
              </h2>
              <div className="h-0.5 w-16 bg-[#5C2AFE] mb-6" />
              
              <div className="space-y-6 text-xs md:text-sm">
                <div className="border-l-2 border-orange-primary pl-4 space-y-1.5">
                  <h4 className="font-black text-navy uppercase tracking-wider">For Consumers</h4>
                  <p className="text-gray-500 font-semibold leading-relaxed">
                    Search catalogs effortlessly, compare specifications, utilize checkout routes, unlock promotional codes, and view authentic video reviews before spending a single Taka.
                  </p>
                </div>

                <div className="border-l-2 border-[#5C2AFE] pl-4 space-y-1.5">
                  <h4 className="font-black text-navy uppercase tracking-wider">For Brands</h4>
                  <p className="text-gray-500 font-semibold leading-relaxed">
                    Claim your official profile page, upload SKU details, showcase your outlet maps, verify your BSTI certifications, and deploy targeted campaigns to active buyers.
                  </p>
                </div>

                <div className="border-l-2 border-emerald-500 pl-4 space-y-1.5">
                  <h4 className="font-black text-navy uppercase tracking-wider">For Creators</h4>
                  <p className="text-gray-500 font-semibold leading-relaxed">
                    Host your video lookbooks and reviews in our central directory, build direct audience followings, and earn passive commissions via affiliate deals.
                  </p>
                </div>
              </div>
            </div>

            {/* Section: Feature Cards Grid (6 cards) */}
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-black text-navy uppercase tracking-tight italic">
                Our Core Features
              </h2>
              <div className="h-0.5 w-16 bg-orange-primary mb-6" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featureCards.map((feat, idx) => (
                  <div key={idx} className="bg-white border border-[#e8edf2] rounded-[5px] p-5 hover:border-orange-primary/20 transition-all shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="mb-4">{feat.icon}</div>
                      <h4 className="text-xs font-black text-navy uppercase tracking-wider mb-2">
                        {feat.title}
                      </h4>
                      <p className="text-gray-500 text-[11px] leading-relaxed font-semibold">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Info, Timeline & Core Values (Right) */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Core Values */}
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-black text-navy uppercase tracking-widest italic pb-2 border-b border-[#e8edf2] flex items-center gap-2">
                <Award size={14} className="text-orange-primary" />
                Core Values
              </h3>
              
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-black text-navy uppercase tracking-wider mb-1">Authenticity First</h4>
                  <p className="text-gray-500 font-semibold leading-relaxed">We strictly prohibit counterfeit listings and enforce verified claim badges.</p>
                </div>
                <div>
                  <h4 className="font-black text-navy uppercase tracking-wider mb-1">Empower Buyers</h4>
                  <p className="text-gray-500 font-semibold leading-relaxed">We design neutral, data-driven comparison layouts that do not prioritize sponsored bias.</p>
                </div>
                <div>
                  <h4 className="font-black text-navy uppercase tracking-wider mb-1">Local Celebration</h4>
                  <p className="text-gray-500 font-semibold leading-relaxed">We provide premium placements to home-grown boutiques, highlighting Bangladeshi weavers and creators.</p>
                </div>
              </div>
            </div>

            {/* Platform Timeline */}
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 shadow-xs space-y-6">
              <h3 className="text-xs font-black text-navy uppercase tracking-widest italic pb-2 border-b border-[#e8edf2] flex items-center gap-2">
                <Calendar size={14} className="text-[#5C2AFE]" />
                Platform Timeline
              </h3>
              
              <div className="space-y-6 relative border-l border-gray-100 pl-4 ml-2">
                {timelineEvents.map((evt, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[25px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-orange-primary flex items-center justify-center">
                      <div className="w-1 h-1 bg-orange-primary rounded-full" />
                    </span>
                    <span className="block text-[10px] font-black text-orange-primary italic font-mono">{evt.year}</span>
                    <h4 className="text-xs font-black text-navy uppercase tracking-wider">{evt.title}</h4>
                    <p className="text-gray-500 text-[10px] leading-relaxed font-semibold">{evt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Explore Call to Action */}
            <div className="bg-gradient-to-br from-navy to-[#000435] border border-white/10 rounded-[5px] p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/10 rounded-full blur-xl pointer-events-none" />
              <h3 className="text-xs font-black uppercase tracking-widest italic mb-2">Explore Choosify</h3>
              <p className="text-white/60 text-[10px] leading-relaxed font-semibold mb-4">
                Discover brands and verify options right now inside our standard categories.
              </p>
              <button 
                onClick={() => navigate('/products')}
                className="w-full py-2.5 bg-orange-primary hover:bg-[#CF4400] text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-none shadow-md group"
              >
                Start Exploring
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
