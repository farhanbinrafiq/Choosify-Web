import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Youtube, Instagram, Facebook, Award, Heart, Check, 
  ExternalLink, Mail, Phone, Video, Send, FileText, CheckCircle2, 
  Sparkles, BookOpen, Clock, Play, ShieldCheck, Info, 
  ChevronRight, Share2, Bookmark, Flame, Star, MessageCircle, Users, 
  Laptop, Smartphone, Cpu, Headphones, Camera, Gamepad, Trophy, MapPin, Briefcase, GraduationCap, Globe, ChevronLeft
} from 'lucide-react';
import { CREATORS } from '../data/creators';
import { cn } from '../lib/utils';
import { FollowButton } from '../components/FollowButton';
import { UnifiedProfileHero } from '../components/ui/cards/UnifiedProfileHero';

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
    </svg>
  );
}

export function CreatorProfilePage() {
  const { id } = useParams<{ id: string }>();
  
  // Find creator (defaults to Farhan Bin Rafiq)
  const creator = CREATORS.find(c => c.id === id) || CREATORS.find(c => c.id === 'creator-farhan') || CREATORS[0];

  // Interaction States
  const [isLoved, setIsLoved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Structured Brief Outreach Form States
  const [productDetails, setProductDetails] = useState('');
  const [collabType, setCollabType] = useState('Product Review');
  const [requirements, setRequirements] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  // Submit Outcome Status
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Active section for sticky navigation scrollspy
  const [activeSection, setActiveSection] = useState('overview');

  // Carousel slider index for community reviews
  const [reviewIndex, setReviewIndex] = useState(0);

  // Auto-scrollspy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;

      const sections = [
        { id: 'featured-content', name: 'guides' },
        { id: 'videos-section', name: 'videos' },
        { id: 'brand-reviews-section', name: 'reviews' },
        { id: 'collections-section', name: 'collections' },
        { id: 'deals-section', name: 'deals' },
        { id: 'about-section', name: 'about' }
      ];

      if (window.scrollY < 300) {
        setActiveSection('overview');
        return;
      }

      let currentSection = 'overview';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = section.name;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (idStr: string) => {
    if (idStr === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('overview');
    } else {
      const el = document.getElementById(idStr);
      if (el) {
        const offset = 120;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        const nameMap: { [key: string]: string } = {
          'featured-content': 'guides',
          'videos-section': 'videos',
          'brand-reviews-section': 'reviews',
          'collections-section': 'collections',
          'deals-section': 'deals',
          'about-section': 'about'
        };
        setActiveSection(nameMap[idStr] || 'overview');
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productDetails || !requirements) {
      toast.error('Please fill in both product details and campaign requirements.');
      return;
    }
    setSubmitSuccess(true);
    toast.success('Recommendation request dispatched successfully!');
  };

  const resetFormAndModal = () => {
    setIsModalOpen(false);
    setSubmitSuccess(false);
    setProductDetails('');
    setCollabType('Product Review');
    setRequirements('');
    setBudgetRange('');
    setContactEmail('');
    setContactPhone('');
  };

  const activeTabId = activeSection === 'overview' ? 'overview' :
                      activeSection === 'guides' ? 'featured-content' :
                      activeSection === 'videos' ? 'videos-section' :
                      activeSection === 'reviews' ? 'brand-reviews-section' :
                      activeSection === 'collections' ? 'collections-section' :
                      activeSection === 'deals' ? 'deals-section' : 'about-section';

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F8FD]">
      
      {/* 1. UNIFIED CREATOR HERO */}
      <div id="overview">
        <UnifiedProfileHero 
          type="creator"
          id={creator.id}
          name={creator.name}
          verified={true}
          handle={creator.handle}
          title="Sr. Tech Analyst & Digital Product Researcher"
          country="Dhaka, Bangladesh"
          bio={creator.bio}
          logoUrl={creator.avatar}
          bannerClass="from-[#020516] to-[#120F26]"
          socials={{
            youtube: '#',
            ig: '#',
            tiktok: '#',
            fb: '#',
            website: '#',
          }}
          score={{
            value: "4.9",
            max: "5",
            reviewsCountLabel: "Based on 12.4K+ reviews",
            recommendPctLabel: "98% Recommendation Rate",
            breakdown: [
              { label: "Research", value: 4.9 },
              { label: "Transparency", value: 4.9 },
              { label: "Quality", value: 4.8 },
              { label: "Helpfulness", value: 4.9 },
              { label: "Consistency", value: 4.8 }
            ]
          }}
          isFollowed={isLoved}
          onToggleFollow={() => {
            setIsLoved(!isLoved);
            toast.success(!isLoved ? `Following ${creator.name}!` : `Unfollowed ${creator.name}.`);
          }}
          onShare={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Profile link copied to clipboard!");
          }}
          onMessage={() => setIsModalOpen(true)}
          navigationItems={[
            { id: 'overview', label: 'Overview' },
            { id: 'featured-content', label: 'Guides', count: '254' },
            { id: 'videos-section', label: 'Videos', count: '128' },
            { id: 'brand-reviews-section', label: 'Reviews', count: '1.2K' },
            { id: 'collections-section', label: 'Collections', count: '48' },
            { id: 'deals-section', label: 'Deals', count: '56' },
            { id: 'about-section', label: 'About' }
          ]}
          activeTabId={activeTabId}
          onTabClick={(tabId) => scrollToSection(tabId)}
        />
      </div>

      {/* 2. FLOATING STATISTICS CARD */}
      <div className="relative z-20 -mt-10 max-w-7xl mx-auto w-full px-4 md:px-8 select-none">
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_10px_30px_rgba(5,11,44,0.06)] border border-[#EEF2F7] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-4 md:gap-y-0 text-left md:divide-x divide-gray-100">
          
          {[
            { label: "Followers", value: "12.4K", icon: Users },
            { label: "Guides Published", value: "254", icon: BookOpen },
            { label: "Total Views", value: "1.2M+", icon: Play },
            { label: "Positive Feedback", value: "98%", icon: Heart },
            { label: "Avg Rating", value: "4.9/5", icon: Star },
            { label: "Expert Awards", value: "32", icon: Trophy }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-3.5 px-3 py-1 first:pt-0 sm:pt-0 md:pl-4 first:pl-0">
                <div className="w-10 h-10 rounded-2xl bg-[#FF5B00]/10 text-[#FF5B00] flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-[#050B2C] leading-none mb-0.5">{stat.value}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            );
          })}

        </div>
      </div>


      {/* 4. MAIN CONTENT SECTION */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 w-full flex flex-col gap-12">
        
        {/* ==================== FEATURED CONTENT ==================== */}
        <section id="featured-content" className="scroll-mt-32 text-left">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-black text-[#050B2C] tracking-tight uppercase italic flex items-center gap-2">
              <Award className="text-[#FF5B00]" size={22} />
              Featured Content
            </h2>
            <button 
              onClick={() => toast.success("Redirecting to all guides and reviews content pool...")}
              className="text-xs font-black text-[#FF5B00] hover:underline uppercase tracking-widest flex items-center gap-1 border-0 bg-transparent cursor-pointer"
            >
              View All Content <span>➔</span>
            </button>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Card 1: Buying Guide */}
            <div className="bg-white border border-[#EEF2F7] rounded-3xl overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col relative">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop" 
                  alt="Best Running Shoes for 2025" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#FF5B00] text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                  BUYING GUIDE
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#050B2C] leading-snug group-hover:text-[#FF5B00] transition-colors mb-2">
                    Best Running Shoes for 2025
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold mb-4 leading-relaxed line-clamp-2">
                    An exhaustively researched breakdown of the top athletic performance models arriving this season.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                  <Clock size={11} />
                  <span>12 min read</span>
                  <span>•</span>
                  <span>May 8, 2025</span>
                </div>
              </div>
            </div>

            {/* Card 2: Creator Review */}
            <div className="bg-white border border-[#EEF2F7] rounded-3xl overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col relative">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop" 
                  alt="30 Day Review: Samsung S24 Ultra" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-purple-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                  CREATOR REVIEW
                </div>
                {/* Central Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#FF5B00] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play size={18} className="fill-white stroke-none ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#050B2C] leading-snug group-hover:text-[#FF5B00] transition-colors mb-2">
                    30 Day Review: Samsung S24 Ultra
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold mb-4 leading-relaxed line-clamp-2">
                    A thorough look into daily performance, photography capabilities, and AI-enabled features.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                  <Video size={11} />
                  <span>18 min video</span>
                  <span>•</span>
                  <span>May 5, 2025</span>
                </div>
              </div>
            </div>

            {/* Card 3: Collection */}
            <div className="bg-white border border-[#EEF2F7] rounded-3xl overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col relative">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop" 
                  alt="Minimal Desk Setup Ideas for 2025" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                  COLLECTION
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#050B2C] leading-snug group-hover:text-[#FF5B00] transition-colors mb-2">
                    Minimal Desk Setup Ideas for 2025
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold mb-4 leading-relaxed line-clamp-2">
                    A curated selection of accessories, task lights, and cable organizers to maximize focus and aesthetics.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                  <Globe size={11} />
                  <span>8 items</span>
                  <span>•</span>
                  <span>May 3, 2025</span>
                </div>
              </div>
            </div>

            {/* Card 4: Brand Story */}
            <div className="bg-white border border-[#EEF2F7] rounded-3xl overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col relative">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop" 
                  alt="Behind Aarong's Summer Collection" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-amber-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                  BRAND STORY
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#050B2C] leading-snug group-hover:text-[#FF5B00] transition-colors mb-2">
                    Behind Aarong's Summer Collection
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold mb-4 leading-relaxed line-clamp-2">
                    Taking a detailed look at indigenous fabric production, regional patterns, and tailoring methodologies.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                  <Clock size={11} />
                  <span>10 min read</span>
                  <span>•</span>
                  <span>Apr 30, 2025</span>
                </div>
              </div>
            </div>

            {/* Float scroll chevron arrow */}
            <button 
              onClick={() => toast.success("Browsing next set of items...")}
              className="absolute right-[-14px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-150 shadow-lg hover:scale-110 active:scale-95 transition-all text-[#050B2C] flex items-center justify-center cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>

          </div>
        </section>

        {/* ==================== EXPERTISE & REVIEWS DUAL SECTION ==================== */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left mt-4">
          
          {/* Left Column: Expertise & Topics */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
              <h2 className="text-xl md:text-2xl font-black text-[#050B2C] tracking-tight uppercase italic flex items-center gap-2">
                <Sparkles className="text-[#FF5B00]" size={20} />
                Expertise & Topics
              </h2>
            </div>

            {/* Grid of 6 White Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: "Smartphones", count: "128 Guides", icon: Smartphone },
                { title: "Laptops", count: "96 Guides", icon: Laptop },
                { title: "PC Components", count: "82 Guides", icon: Cpu },
                { title: "Audio", count: "76 Guides", icon: Headphones },
                { title: "Cameras", count: "64 Guides", icon: Camera },
                { title: "Gaming", count: "52 Guides", icon: Gamepad }
              ].map((exp, i) => {
                const ExpIcon = exp.icon;
                return (
                  <div 
                    key={i} 
                    className="bg-white border border-[#EEF2F7] rounded-2xl p-4.5 flex items-center gap-3.5 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => toast.success(`Viewing comprehensive ${exp.title} research guidelines.`)}
                  >
                    <div className="w-11 h-11 rounded-xl bg-gray-50 text-[#FF5B00] flex items-center justify-center shrink-0 border border-gray-100">
                      <ExpIcon size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#050B2C] uppercase tracking-wide leading-tight mb-0.5">{exp.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{exp.count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Latest Reviews */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
              <h2 className="text-xl md:text-2xl font-black text-[#050B2C] tracking-tight uppercase italic flex items-center gap-2">
                <Star className="text-[#FF5B00]" size={20} />
                Latest Reviews
              </h2>
              <button 
                onClick={() => scrollToSection('brand-reviews-section')}
                className="text-[10px] font-black text-[#FF5B00] hover:underline uppercase tracking-widest border-none bg-transparent cursor-pointer"
              >
                View All ➔
              </button>
            </div>

            {/* Vertical list of 3 rows */}
            <div className="space-y-4">
              {[
                { 
                  num: "1", 
                  title: "Samsung Galaxy S24 Ultra", 
                  stars: 4.9, 
                  date: "May 5, 2025", 
                  img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&h=120&fit=crop" 
                },
                { 
                  num: "2", 
                  title: "Sony WH-1000XM5 Headphones", 
                  stars: 4.8, 
                  date: "Apr 28, 2025", 
                  img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&h=120&fit=crop" 
                },
                { 
                  num: "3", 
                  title: "Dell XPS 15 (2024)", 
                  stars: 4.7, 
                  date: "Apr 20, 2025", 
                  img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop" 
                }
              ].map((rev, i) => (
                <div key={i} className="bg-white border border-[#EEF2F7] rounded-2xl p-3 flex items-center gap-4 hover:shadow-md transition-shadow relative">
                  <span className="text-sm font-black text-gray-300 w-4 text-center shrink-0">{rev.num}</span>
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img src={rev.img} alt={rev.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-[#050B2C] leading-snug truncate hover:text-[#FF5B00] cursor-pointer" onClick={() => toast.success(`Viewing review metadata: ${rev.title}`)}>
                      {rev.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5 text-[#FF5B00]">
                        {[1, 2, 3, 4, 5].map(starNum => (
                          <Star key={starNum} size={9} className="fill-current" />
                        ))}
                      </div>
                      <span className="text-[9.5px] font-bold text-gray-400">{rev.stars}</span>
                      <span className="text-gray-300 text-[9px]">•</span>
                      <span className="text-[9.5px] font-semibold text-gray-400">{rev.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ==================== WHY FOLLOW FARHAN STRIP ==================== */}
        <section className="bg-[#050B2C] text-white rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden text-center mt-4 select-none">
          {/* Radial light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF5B00]/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8">
            Why Follow {creator.name.split(' ')[0]}?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-left">
            {[
              { 
                title: "In-Depth Research", 
                desc: "Detailed analysis and real world testing", 
                icon: Globe 
              },
              { 
                title: "Honest Reviews", 
                desc: "Unbiased opinions you can trust", 
                icon: CheckCircle2 
              },
              { 
                title: "Smart Recommendations", 
                desc: "Curated picks based on your needs", 
                icon: Sparkles 
              },
              { 
                title: "Always Updated", 
                desc: "Latest trends and market insights", 
                icon: Clock 
              }
            ].map((col, idx) => {
              const ColIcon = col.icon;
              return (
                <div key={idx} className="space-y-3.5">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[#FF5B00] border border-white/15">
                    <ColIcon size={20} />
                  </div>
                  <h4 className="text-sm font-extrabold tracking-wide uppercase">{col.title}</h4>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">{col.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================== INFORMATION GRID (3 COLUMNS) ==================== */}
        <section id="about-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left mt-4 scroll-mt-32">
          
          {/* Column 1: Creator Overview */}
          <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-[#050B2C] uppercase italic tracking-tight pb-4 border-b border-gray-100 mb-6 flex items-center gap-2">
                <Info size={18} className="text-[#FF5B00]" />
                Creator Overview
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Award size={12} className="text-[#FF5B00]" /> Background & Bio
                  </h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    Senior Tech Analyst & Digital Product Researcher with 10+ years of experience analyzing electronic imports, consumer durables, and PC components in the Bangladesh market. I help consumers make smarter buying decisions through detailed research, comparison, and real-world testing.
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#FF5B00]" /> Areas of Expertise
                  </h4>
                  <p className="text-xs text-[#050B2C] font-extrabold tracking-wide">
                    Smartphones, Laptops, PC Components, Audio, Cameras, Gaming, Home Tech & More
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Globe size={12} className="text-[#FF5B00]" /> Content Platforms
                  </h4>
                  <p className="text-xs text-[#050B2C] font-extrabold tracking-wide uppercase">
                    YouTube, Instagram, TikTok, Facebook, Website
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <a href="#" onClick={(e) => { e.preventDefault(); toast.success("Redirecting to subscriber dashboard hub..."); }} className="text-[10px] font-black uppercase text-[#FF5B00] tracking-widest hover:underline flex items-center gap-1">
                Explore Analytics <span>➜</span>
              </a>
            </div>
          </div>

          {/* Column 2: Partnerships & Collaborations */}
          <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-[#050B2C] uppercase italic tracking-tight pb-4 border-b border-gray-100 mb-6 flex items-center gap-2">
                <Users size={18} className="text-[#FF5B00]" />
                Partnerships & Collabs
              </h3>

              <div className="space-y-6">
                {/* Brand Logos */}
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">TOP BRAND PARTNERS</h4>
                  <div className="grid grid-cols-3 gap-2 text-center select-none">
                    <span className="py-2.5 px-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black tracking-widest text-[#0066CC]">SAMSUNG</span>
                    <span className="py-2.5 px-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black tracking-widest text-[#FF6700]">Xiaomi</span>
                    <span className="py-2.5 px-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black tracking-widest text-[#505050]">ASUS</span>
                    <span className="py-2.5 px-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black tracking-widest text-[#000000]">SONY</span>
                    <span className="py-2.5 px-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black tracking-widest text-[#0085C3]">DELL</span>
                    <span className="py-2.5 px-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black tracking-widest text-[#83B81A]">acer</span>
                  </div>
                </div>

                {/* Collaboration Types */}
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">COLLABORATION TYPES</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["Product Reviews", "Brand Stories", "Buying Guides", "Tech Analysis", "Comparisons", "Live Sessions"].map((badgeText, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-gray-100 border border-gray-100 text-[#050B2C] text-[9px] font-bold uppercase rounded-lg">
                        {badgeText}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <button onClick={() => setIsModalOpen(true)} className="text-[10px] font-black uppercase text-[#FF5B00] tracking-widest hover:underline flex items-center gap-1 border-0 bg-transparent cursor-pointer">
                Propose Collaboration <span>➜</span>
              </button>
            </div>
          </div>

          {/* Column 3: Contact & Reach */}
          <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 md:p-8 hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-[#050B2C] uppercase italic tracking-tight pb-4 border-b border-gray-100 mb-6 flex items-center gap-2">
                <Mail size={18} className="text-[#FF5B00]" />
                Contact & Reach
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-55 flex items-center justify-center border border-gray-100 shrink-0 text-[#FF5B00]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Business Inquiries</h5>
                    <p className="text-xs font-mono font-bold text-[#050B2C] break-all">farhan.tech@researcher.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-55 flex items-center justify-center border border-gray-100 shrink-0 text-[#FF5B00]">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Response Time</h5>
                    <p className="text-xs font-bold text-[#050B2C]">24 - 48 Hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-55 flex items-center justify-center border border-gray-100 shrink-0 text-[#FF5B00]">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Preferred Contact</h5>
                    <p className="text-xs font-bold text-[#050B2C]">Email Callback Handler</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-gray-55 flex items-center justify-center border border-gray-100 shrink-0 text-[#FF5B00]">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</h5>
                    <p className="text-xs font-bold text-[#050B2C]">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-wider leading-relaxed">
              For collaboration opportunities and partnerships
            </div>
          </div>

        </section>

        {/* ==================== BRAND REVIEWS (SCROLLABLE & INTERACTIVE LIST) ==================== */}
        <section id="brand-reviews-section" className="scroll-mt-32 w-full bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#EEF2F7] text-left mt-4 select-none">
          <div className="text-center mb-8 border-b border-gray-100 pb-5">
            <h3 className="text-xl md:text-2xl font-black text-[#050B2C] tracking-tight uppercase mb-1">
              Verified Brand Reviews
            </h3>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 w-fit mx-auto">
              Experiences shared by Domestic and International product partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Review 1 */}
            <div className="p-5 rounded-2xl border border-[#EEF2F7] bg-gray-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center border border-blue-200">
                      AP
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#050B2C]">Apex Footwear Ltd.</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">May 2026 • Verified Partner</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-[#FF5B00]">
                    {[1, 2, 3, 4, 5].map(starNum => <Star key={starNum} size={11} className="fill-current" />)}
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed italic mb-4">
                  "Farhan delivered exceptionally high-quality smartphone integration video for our new smart-infused winter sneaker line. Communication was lightning fast and the content yielded a 15% increase in conversion rates!"
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>Campaign: Smart Footwear Launch</span>
                <span className="text-[#FF5B00] cursor-pointer" onClick={() => toast.success("Feedback marked as helpful!")}>Helpful (42)</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-5 rounded-2xl border border-[#EEF2F7] bg-gray-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FF6700]/10 text-[#FF6700] font-bold flex items-center justify-center border border-[#FF6700]/20">
                      XM
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#050B2C]">Xiaomi BD Sponsorships</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Apr 2026 • Verified Partner</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-[#FF5B00]">
                    {[1, 2, 3, 4, 5].map(starNum => <Star key={starNum} size={11} className="fill-current" />)}
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed italic mb-4">
                  "Unparalleled technical precision in analysis. Farhan provided a breakdown of our high refresh display tech that perfectly resonated with both hardcore enthusiasts and casual shoppers alike."
                </p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>Campaign: Redmi Note Review Series</span>
                <span className="text-[#FF5B00] cursor-pointer" onClick={() => toast.success("Feedback marked as helpful!")}>Helpful (35)</span>
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => toast.success("All verified brand reviews are loaded successfully.")} 
              className="px-10 py-3.5 border border-[#050B2C] text-[#050B2C] hover:bg-[#050B2C] hover:text-white transition-all text-[10px] font-black uppercase tracking-widest rounded-full bg-white cursor-pointer"
            >
              Load More Reviews
            </button>
          </div>
        </section>

        {/* ==================== COMMUNITY TESTIMONIALS (What The Community Says) ==================== */}
        <section className="scroll-mt-32 w-full text-left select-none">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-black text-[#050B2C] tracking-tight uppercase italic flex items-center gap-2">
              <Users className="text-[#FF5B00]" size={22} />
              What The Community Says
            </h2>
            <button 
              onClick={() => toast.success("Showing comprehensive community comments dashboard...")}
              className="text-xs font-black text-[#FF5B00] hover:underline uppercase tracking-widest flex items-center gap-1 border-0 bg-transparent cursor-pointer"
            >
              View All Reviews <span>➔</span>
            </button>
          </div>

          {/* Testimonial cards list (3-column layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Card 1 */}
            <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow relative">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=tanvir" className="w-full h-full object-cover" alt="Tanvir" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#050B2C]">Tanvir Hossain</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={10} className="text-green-500 fill-green-500/10" />
                        <span className="text-[9px] text-green-500 font-extrabold tracking-wide uppercase">Verified Buyer</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-[#FF5B00]">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-current" />)}
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed italic mb-4">
                  "Farhan bhai's reviews are so detailed and honest. Always helps me make the right decision!"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[9.5px] font-bold text-[#050B2C] bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer" onClick={() => toast.success("Opening referenced Samsung S24 Ultra review parameters...")}>
                  📖 Samsung Galaxy S24 Ultra Review
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow relative">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=nusrat" className="w-full h-full object-cover" alt="Nusrat" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#050B2C]">Nusrat Jahan</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={10} className="text-green-500 fill-green-500/10" />
                        <span className="text-[9px] text-green-500 font-extrabold tracking-wide uppercase">Verified Buyer</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-[#FF5B00]">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-current" />)}
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed italic mb-4">
                  "The most reliable tech reviewer in Bangladesh. His buying guides are gold!"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[9.5px] font-bold text-[#050B2C] bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer" onClick={() => toast.success("Opening referenced Laptop Guide...")}>
                  📖 Best Laptop Guide 2025
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#EEF2F7] rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow relative">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=rashed" className="w-full h-full object-cover" alt="Rashed" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#050B2C]">Rashed Ahmed</h4>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={10} className="text-green-500 fill-green-500/10" />
                        <span className="text-[9px] text-green-500 font-extrabold tracking-wide uppercase">Verified Buyer</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-[#FF5B00]">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-current" />)}
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed italic mb-4">
                  "Love how he explains everything in simple terms. Super helpful for beginners like me."
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[9.5px] font-bold text-[#050B2C] bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer" onClick={() => toast.success("Opening referenced PC Build Guide...")}>
                  📖 PC Build Guide
                </span>
              </div>
            </div>

            {/* Carousel navigation controls on sides */}
            <button 
              onClick={() => toast.success("Switched to preceding testimonial reviews...")}
              className="absolute left-[-14px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-150 shadow-lg hover:scale-110 active:scale-95 transition-all text-[#050B2C] flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => toast.success("Switched to succeeding testimonial reviews...")}
              className="absolute right-[-14px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-gray-150 shadow-lg hover:scale-110 active:scale-95 transition-all text-[#050B2C] flex items-center justify-center cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>

          </div>

          {/* Indicators dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <span className="w-2 h-2 rounded-full bg-[#FF5B00]" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          </div>
        </section>

      </main>

      {/* ==================== OUTREACH COLLABORATION DIALOG SYSTEM ==================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#09091E] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
            >
              
              {/* Modal Header */}
              <div className="bg-[#030310] px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#FF5B00]" size={16} />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
                    Request Recommendation / Collab
                  </h3>
                </div>
                <button 
                  onClick={resetFormAndModal}
                  className="text-gray-400 hover:text-white text-xs font-bold font-mono tracking-widest uppercase transition-colors cursor-pointer border-0 bg-transparent"
                >
                  [Dismiss]
                </button>
              </div>

              {/* Modal Body Area */}
              <div className="p-6 overflow-y-auto max-h-[80vh] text-left">
                
                {!submitSuccess ? (
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    
                    {/* Brand / Product details */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                        1. Brand / Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={productDetails}
                        onChange={(e) => setProductDetails(e.target.value)}
                        placeholder="e.g. Acme Tech Airflow Pro ANC Earbuds"
                        className="w-full px-4 py-2.5 bg-[#030310] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-[#FF5B00]"
                      />
                    </div>

                    {/* Campaign type */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                        2. Campaign Format Type *
                      </label>
                      <select
                        value={collabType}
                        onChange={(e) => setCollabType(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#030310] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-[#FF5B00] appearance-none cursor-pointer"
                      >
                        <option value="Product Review">Product Review</option>
                        <option value="Sponsored Post">Sponsored Post</option>
                        <option value="Video Feature">Video Feature</option>
                        <option value="Social Campaign">Social Campaign</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Campaign Requirements */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                        3. Campaign Requirements *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        placeholder="Explain your review parameters, budget limit, or launch schedule..."
                        className="w-full px-4 py-2.5 bg-[#030310] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-[#FF5B00] resize-none"
                      />
                    </div>

                    {/* Budget range */}
                    <div>
                      <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                        4. Estimated Campaign Budget (Optional)
                      </label>
                      <input
                        type="text"
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        placeholder="e.g. BDT 30,000 - 50,000"
                        className="w-full px-4 py-2.5 bg-[#030310] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-[#FF5B00]"
                      />
                    </div>

                    {/* Contact callback channel */}
                    <div className="border-t border-white/5 pt-4 space-y-4">
                      <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
                        5. Callback Channel (At least one)
                      </span>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Email</label>
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="marketing@acme.com"
                            className="w-full px-3 py-2 bg-[#030310] border border-white/10 rounded-lg text-xs text-white placeholder-gray-600 outline-none focus:border-[#FF5B00]"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-bold text-gray-400 uppercase mb-1">Phone Number</label>
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="+880 17..."
                            className="w-full px-3 py-2 bg-[#030310] border border-white/10 rounded-lg text-xs text-white placeholder-gray-600 outline-none focus:border-[#FF5B00]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* CTA Actions */}
                    <div className="pt-3 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={resetFormAndModal}
                        className="px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer border-0 bg-transparent"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-lg bg-[#FF5B00] hover:bg-[#E05000] text-white text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1.5 shadow-md cursor-pointer border-0"
                      >
                        Submit Request <Send size={11} />
                      </button>
                    </div>

                  </form>
                ) : (
                  // Outcome view
                  <div className="space-y-6">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
                      <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={16} />
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-green-500">Request Dispatched To {creator.name}</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed mt-1 uppercase">
                          The request payload has been saved successfully under secure dispatch benchmarks. The creator will respond directly to the provided callback channels.
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#030310] border border-white/10 rounded-xl p-5 select-text relative">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FF5B00] mb-4 pb-2 border-b border-white/5">
                        Dispatch payload Summary
                      </h4>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block">Product Name</span>
                          <span className="font-semibold text-white">{productDetails}</span>
                        </div>

                        <div>
                          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block">Campaign Format</span>
                          <span className="font-semibold text-white">{collabType}</span>
                        </div>

                        <div>
                          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block">Requirements Scope</span>
                          <p className="text-xs text-gray-300 leading-relaxed bg-[#09091E] p-3 rounded-lg border border-white/5 mt-1">
                            {requirements}
                          </p>
                        </div>

                        {budgetRange && (
                          <div>
                            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block">Budget Limit</span>
                            <span className="font-semibold text-white">{budgetRange}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={resetFormAndModal}
                        className="px-6 py-2.5 rounded-full bg-white text-navy focus:bg-gray-100 text-[10px] font-black uppercase tracking-widest italic cursor-pointer transition-all border-0"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Custom Folder Icon
function FolderIcon({ size = 16, className = "" }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}
