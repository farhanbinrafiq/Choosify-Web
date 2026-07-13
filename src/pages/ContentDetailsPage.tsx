import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Play, Bookmark, Share2, Award, CheckCircle2, XCircle, 
  ThumbsUp, MessageSquare, Plus, Check, Star, ArrowUpRight, Youtube,
  Trophy, TrendingUp, Cpu, Battery, Camera, Smartphone, HelpCircle, 
  ShieldCheck, Info, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';
import { CreatorReviewCard } from '../components/CreatorReviewCard';
import { PRODUCTS } from '../constants';
import toast from 'react-hot-toast';

// Reusable Sub-components

function Accordion({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className=" rounded-xl overflow-hidden mb-4 bg-white hover:shadow-soft transition-shadow">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-white focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#000435] text-lg">{title}</span>
        </div>
        <div className={cn("w-8 h-8 rounded-full bg-body-bg flex items-center justify-center transition-transform duration-300", isOpen && "rotate-180")}>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L13 1" stroke="#000435" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-5 pt-0 ">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ContentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock data representing the CMS content payload
  const content = {
    type: "BUYING GUIDE",
    title: "Is the Samsung Galaxy S24 Ultra Still Worth It in Late 2026?",
    subtitle: "We put Samsung's 2024 flagship to the test in 2026 to see if it still holds up against newer smartphones.",
    coverImage: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2000&auto=format&fit=crop",
    author: {
      name: "Farhan Ahmed",
      avatar: "https://i.pravatar.cc/150?u=farhan",
      verified: true,
      role: "Tech Expert & Reviewer",
      bio: "10+ years of experience reviewing consumer tech products. I test, compare, and recommend the best products to help you buy wisely."
    },
    date: "Jan 12, 2026",
    readTime: "12 min read",
    views: "24.6K views",
    rating: 4.8,
    reviews: "13.4K",
    
    overallWinner: {
      product: "Samsung Galaxy S24 Ultra",
      badge: "BEST FLAGSHIP PHONE",
      image: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=600&auto=format&fit=crop",
      rating: 4.8,
      reviewsCount: "13.4K reviews",
      score: 9.4,
      scoreLabel: "EXCELLENT",
      highlights: [
        "Best Display Quality",
        "Top Tier Performance",
        "Excellent Camera System",
        "Long-term Software Support"
      ]
    },
    
    takeaways: [
      { icon: Smartphone, text: "Still one of the best displays in any smartphone" },
      { icon: Cpu, text: "Snapdragon 8 Gen 3 still delivers flagship performance" },
      { icon: Camera, text: "Camera system remains versatile and reliable" },
      { icon: ShieldCheck, text: "7 years OS updates make it future proof" },
      { icon: TrendingUp, text: "Better value now compared to launch price" }
    ],

    verdict: {
      buyIf: "Want a premium phone with best-in-class display and camera.",
      considerIf: "You want the latest chip and minor design changes.",
      notForYouIf: "You want the absolute newest features and AI capabilities.",
      overall: "Still an excellent flagship in 2026 and better value than ever.",
      summary: "The Samsung Galaxy S24 Ultra remains one of the most complete flagship smartphones in 2026. Its display, performance, camera system, and long software support make it a smart buy even today.",
      chips: ["Best Display", "Powerful Performance", "Versatile Camera", "Long-term Value", "Future Proof"]
    },

    evaluations: [
      { id: "design", title: "Design & Build Quality", content: "The titanium frame still feels premium and the squared-off corners give it a distinct look..." },
      { id: "display", title: "Display Performance", content: "The anti-reflective coating is a game changer, making it easily readable even in direct sunlight..." },
      { id: "performance", title: "Performance & Hardware", content: "The Snapdragon 8 Gen 3 holds up incredibly well against newer chips..." },
      { id: "camera", title: "Camera System", content: "The 200MP main sensor and 5x optical zoom continue to deliver exceptional photos and videos..." },
      { id: "battery", title: "Battery Life", content: "The 5000mAh battery easily lasts a full day, although charging speeds could be faster compared to modern standards..." },
      { id: "software", title: "Software & UI", content: "With 7 years of promised updates, the phone will remain secure and up-to-date for years..." },
      { id: "price", title: "Price & Value", content: "Given the price drops since launch, it offers much better value now..." },
      { id: "score", title: "Final Score", content: "Overall, the S24 Ultra scores an impressive 9.4/10." }
    ],
    
    faqs: [
      { question: "Is the S24 Ultra worth buying in 2026?", answer: "Yes, especially if you find it at a discounted price. Its hardware and software support make it a viable option for years to come." },
      { question: "How does it compare to S25 Ultra?", answer: "The S25 Ultra offers a newer chip and slightly refined design, but the day-to-day experience remains very similar." },
      { question: "Will it get Android 15 and 16?", answer: "Yes, Samsung promised 7 years of OS updates for the S24 series." },
      { question: "Is the camera still good for photography?", answer: "Absolutely. The 200MP sensor and versatile zoom lenses remain top-tier." }
    ],
    
    relatedProducts: PRODUCTS.slice(0, 4),
    relatedGuides: [
      { id: "1", cover: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600&auto=format&fit=crop", title: "Best Phones Under BDT 50,000 in 2026", category: "BUYING GUIDE", readTime: "8 min read", views: "18K views", badgeClass: "bg-blue-600" },
      { id: "2", cover: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop", title: "iPhone 15 Pro Max vs Samsung S24 Ultra", category: "COMPARISON", readTime: "10 min read", views: "22K views", badgeClass: "bg-purple-600" },
      { id: "3", cover: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?q=80&w=600&auto=format&fit=crop", title: "Best Camera Phones in 2026", category: "BUYING GUIDE", readTime: "7 min read", views: "15K views", badgeClass: "bg-amber-600" },
      { id: "4", cover: "https://images.unsplash.com/photo-1605236453806-6ff368536b8e?q=80&w=600&auto=format&fit=crop", title: "How to Extend Your Phone Battery Life", category: "TIPS & TRICKS", readTime: "5 min read", views: "16K views", badgeClass: "bg-emerald-600" }
    ],
    tags: ["Samsung Galaxy S24 Ultra review", "S24 Ultra 2026", "Best flagship phone 2026", "Samsung S24 Ultra camera", "S24 Ultra vs iPhone 15 Pro Max", "Is S24 Ultra worth buying"]
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved' : 'Saved to your collection');
  };

  return (
    <div className="bg-body-bg min-h-screen font-sans antialiased pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="w-full bg-[#000435] text-white pt-10 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-purple-900/20 to-transparent pointer-events-none" />
        
        <div className="max-w-[1440px] mx-auto relative z-10">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-8 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/discover" className="hover:text-white transition-colors">Discover</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/categories/buying-guides" className="hover:text-white transition-colors">Buying Guides</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate max-w-[200px] sm:max-w-xs">{content.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl">
              <span className="inline-block bg-[#FF5B00] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
                {content.type}
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                {content.title}
              </h1>
              
              <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed max-w-xl">
                {content.subtitle}
              </p>
              
              {/* Creator Info & Metadata */}
              <div className="flex flex-wrap items-center gap-6 mb-10">
                <div className="flex items-center gap-3">
                  <img src={content.author.avatar} alt={content.author.name} className="w-12 h-12 rounded-full " />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-white">{content.author.name}</span>
                      {content.author.verified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <span>Updated {content.date}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>{content.readTime}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <span>{content.views}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button className="bg-[#FF5B00] hover:bg-[#EB4501] text-white px-8 py-3.5 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#FF5B00]/20">
                  <Play className="w-5 h-5 fill-white" /> Watch Video
                </button>
                <button 
                  onClick={handleSave}
                  className={cn(
                    "px-6 py-3.5 rounded-full font-bold transition-all flex items-center gap-2",
                    isSaved ? "bg-white text-[#000435]" : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  <Bookmark className={cn("w-5 h-5", isSaved && "fill-[#000435]")} /> 
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full font-bold transition-all flex items-center gap-2 ">
                  <Share2 className="w-5 h-5" /> Share
                </button>
                
                <div className="flex-1 min-w-[200px] flex justify-end">
                  <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full font-bold transition-all flex items-center gap-2  ml-auto"
                  >
                    {isFollowing ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Image/Video */}
            <div className="relative">
              <div className="aspect-[4/3] md:aspect-video lg:aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl relative group">
                <img src={content.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center  group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1 fill-white" />
                </button>
                
                {/* Pagination Dots (simulated) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <div className="w-8 h-1.5 rounded-full bg-[#FF5B00]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT WRAPPER */}
      <main className="max-w-[1440px] mx-auto px-6 lg:px-12 -mt-10 relative z-20">
        
        {/* 2. TOP SUMMARY CARD */}
        <div className="bg-[#000435] rounded-[32px] p-8 md:p-10 flex flex-col lg:flex-row items-center gap-10 shadow-2xl mb-16 relative overflow-hidden ">
          {/* Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="w-full lg:w-[350px] shrink-0 bg-white/5 rounded-[24px] p-6  relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-500/20 to-transparent" />
            <img src={content.overallWinner.image} alt={content.overallWinner.product} className="w-full h-48 object-contain mb-4 drop-shadow-xl z-10" />
          </div>

          <div className="flex-1 text-white z-10">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-[#FF5B00]" />
              <span className="text-xl font-extrabold uppercase tracking-wider text-white">OVERALL WINNER</span>
            </div>
            
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div>
                <span className="inline-block bg-[#FF5B00] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded mb-3">
                  {content.overallWinner.badge}
                </span>
                <h2 className="text-3xl font-extrabold mb-3 leading-tight max-w-sm">{content.overallWinner.product}</h2>
                <div className="flex items-center gap-2 mb-6 text-sm">
                  <div className="flex text-[#FF5B00]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold">{content.overallWinner.rating}</span>
                  <span className="text-white/60">({content.overallWinner.reviewsCount})</span>
                </div>
                <Link to="/products/1" className="text-[#FF5B00] font-bold flex items-center gap-1 text-sm hover:text-[#EB4501] transition-colors group">
                  View on Choosify <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="space-y-3">
                {content.overallWinner.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="font-medium text-white/90">{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/5  rounded-[20px] p-6 text-center min-w-[150px]">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Choosify Rating</div>
                <div className="text-5xl font-extrabold text-[#FF5B00] mb-2">{content.overallWinner.score}</div>
                <div className="text-sm font-medium text-slate-400 mb-3">Out of 10</div>
                <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider rounded-full">
                  {content.overallWinner.scoreLabel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. KEY TAKEAWAYS */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">KEY TAKEAWAYS</h2>
          <div className="flex flex-wrap gap-4">
            {content.takeaways.map((item, idx) => (
              <div key={idx} className="bg-white rounded-[20px] p-6 flex items-start gap-4 flex-1 min-w-[250px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] ">
                <div className="w-10 h-10 rounded-xl bg-body-bg flex items-center justify-center shrink-0 text-[#FF5B00]">
                  <item.icon className="w-5 h-5" />
                </div>
                <p className="text-[#050B2C] font-medium text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. RECOMMENDATIONS & QUICK VERDICT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 mb-16 items-start">
          {/* Left Panel */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">RECOMMENDATIONS &<br/>QUICK VERDICT</h2>
            
            <div className="space-y-4">
              {/* Buy If */}
              <div className="bg-white rounded-[20px] p-6 shadow-soft ">
                <div className="flex items-center gap-2 mb-2 text-emerald-600 font-bold uppercase tracking-wider text-sm">
                  <CheckCircle2 className="w-5 h-5" /> BUY IF YOU
                </div>
                <p className="text-slate-600 font-medium pl-7">{content.verdict.buyIf}</p>
              </div>
              
              {/* Consider If */}
              <div className="bg-white rounded-[20px] p-6 shadow-soft ">
                <div className="flex items-center gap-2 mb-2 text-amber-500 font-bold uppercase tracking-wider text-sm">
                  <HelpCircle className="w-5 h-5" /> CONSIDER IF
                </div>
                <p className="text-slate-600 font-medium pl-7">{content.verdict.considerIf}</p>
              </div>

              {/* Not For You If */}
              <div className="bg-white rounded-[20px] p-6 shadow-soft ">
                <div className="flex items-center gap-2 mb-2 text-red-500 font-bold uppercase tracking-wider text-sm">
                  <XCircle className="w-5 h-5" /> NOT FOR YOU IF
                </div>
                <p className="text-slate-600 font-medium pl-7">{content.verdict.notForYouIf}</p>
              </div>

              {/* Quick Verdict */}
              <div className="bg-white rounded-[20px] p-6 shadow-soft ">
                <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold uppercase tracking-wider text-sm">
                  <Info className="w-5 h-5" /> VERDICT
                </div>
                <p className="text-slate-600 font-medium pl-7">{content.verdict.overall}</p>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">WHY THIS WON</h2>
            <div className="bg-[#000435] text-white rounded-[32px] p-8 md:p-10 shadow-xl ">
              <h3 className="text-[#FF5B00] font-extrabold uppercase tracking-widest mb-4">THE VERDICT</h3>
              <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10 text-white/90">
                {content.verdict.summary}
              </p>
              <div className="flex flex-wrap gap-3">
                {content.verdict.chips.map((chip, idx) => (
                  <span key={idx} className="bg-white/10  text-white font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-white/20 transition-colors cursor-default">
                    <Check className="w-4 h-4 text-emerald-400" /> {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. DETAIL EVALUATION */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">DETAIL EVALUATION</h2>
          <div className="space-y-1">
            {content.evaluations.map((evalItem, idx) => (
              <Accordion key={evalItem.id} title={evalItem.title} defaultOpen={idx === 0}>
                <p className="text-slate-600 font-medium leading-relaxed">{evalItem.content}</p>
              </Accordion>
            ))}
          </div>
        </div>

        {/* 6. OTHER PRODUCTS MENTIONED */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">OTHER PRODUCTS MENTIONED</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide relative group">
            {content.relatedProducts.map(product => (
              <div key={product.id} className="min-w-[280px] lg:min-w-[300px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
            {/* Scroll Right Button Overlay */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-12 h-12 rounded-full bg-white shadow-lg  flex items-center justify-center text-[#000435] hover:bg-slate-50 transition-colors z-10">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* 7. ABOUT AUTHOR & IN THIS GUIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 mb-16">
          {/* Author */}
          <div className="bg-white rounded-[24px] p-8  shadow-soft flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">ABOUT THE AUTHOR</div>
              <div className="flex items-start gap-5 mb-6">
                <img src={content.author.avatar} alt={content.author.name} className="w-20 h-20 rounded-full bg-slate-100" />
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-extrabold text-xl text-[#000435]">{content.author.name}</span>
                    {content.author.verified && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <div className="text-[#FF5B00] font-bold text-sm mb-3">{content.author.role}</div>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">{content.author.bio}</p>
                </div>
              </div>
              <div className="flex gap-3 mb-8">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#FF5B00] hover:text-white transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#FF5B00] hover:text-white transition-colors">
                  <span className="font-bold font-serif text-lg">X</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#FF5B00] hover:text-white transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1  text-slate-700 font-bold py-3 rounded-full hover:bg-slate-50 transition-colors">
                View Profile
              </button>
              <button className="flex-1 bg-[#FF5B00] text-white font-bold py-3 rounded-full hover:bg-[#EB4501] transition-colors">
                Follow
              </button>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-white rounded-[24px] p-8  shadow-soft">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">IN THIS GUIDE</div>
            <ul className="space-y-4">
              {[
                "Why the S24 Ultra is still relevant in 2026",
                "Performance test results",
                "Camera comparison",
                "Battery and charging test",
                "Price analysis & final verdict"
              ].map((item, idx) => (
                <li key={idx}>
                  <button className="flex items-start gap-4 text-left group">
                    <span className="text-slate-400 font-bold group-hover:text-[#FF5B00] transition-colors">{idx + 1}.</span>
                    <span className="text-slate-700 font-medium group-hover:text-[#FF5B00] transition-colors">{item}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 8. FAQ & RATINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 mb-16">
          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="space-y-1 mb-4">
              {content.faqs.map((faq, idx) => (
                <Accordion key={idx} title={faq.question} defaultOpen={idx === 0}>
                  <p className="text-slate-600 font-medium leading-relaxed">{faq.answer}</p>
                </Accordion>
              ))}
            </div>
            <button className="w-full  text-[#000435] font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors">
              View All FAQs
            </button>
          </div>

          {/* Ratings */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-6">WHAT READERS SAY</h2>
            <div className="bg-white rounded-[24px] p-8  shadow-soft">
              <div className="flex items-center gap-6 mb-8">
                <div>
                  <div className="text-6xl font-extrabold text-[#000435]">4.8</div>
                  <div className="flex text-[#FF5B00] mt-2 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                  <div className="text-sm font-bold text-slate-400">2.4K ratings</div>
                </div>
                
                <div className="flex-1 space-y-2">
                  {[
                    { stars: 5, pct: 75 },
                    { stars: 4, pct: 18 },
                    { stars: 3, pct: 5 },
                    { stars: 2, pct: 1 },
                    { stars: 1, pct: 1 }
                  ].map(row => (
                    <div key={row.stars} className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-slate-500 w-12 text-right">{row.stars} Stars</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-[#FF5B00] rounded-full" style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="font-medium text-slate-400 w-8 text-right">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="w-full  text-[#000435] font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors">
                Write a Comment
              </button>
            </div>
          </div>
        </div>

        {/* 9. YOU MAY ALSO LIKE */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider">YOU MAY ALSO LIKE</h2>
            <button className="text-sm font-bold text-slate-600 flex items-center gap-2 hover:text-[#FF5B00] transition-colors  px-4 py-2 rounded-full">
              View All Guides <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide relative group">
            {content.relatedGuides.map(guide => (
              <div key={guide.id} className="min-w-[280px] lg:min-w-[320px] shrink-0 snap-start cursor-pointer group/card">
                <div className="aspect-[4/3] rounded-[24px] overflow-hidden relative mb-4">
                  <img src={guide.cover} alt={guide.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className={cn("absolute top-4 left-4 text-[10px] font-bold text-white px-3 py-1 rounded-full uppercase tracking-wider", guide.badgeClass)}>
                    {guide.category}
                  </span>
                </div>
                <h3 className="font-extrabold text-xl text-[#000435] leading-tight mb-2 group-hover/card:text-[#FF5B00] transition-colors">{guide.title}</h3>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span>{guide.readTime}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>{guide.views}</span>
                </div>
              </div>
            ))}
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-12 h-12 rounded-full bg-white shadow-lg  flex items-center justify-center text-[#000435] hover:bg-slate-50 transition-colors z-10">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* 10. POPULAR SEARCHES */}
        <div className="pt-8 ">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular searches for this guide</h3>
          <div className="flex flex-wrap gap-3">
            {content.tags.map((tag, idx) => (
              <button key={idx} className="bg-white  text-slate-600 font-medium text-sm px-4 py-2 rounded-full  hover:text-[#FF5B00] transition-colors shadow-soft">
                {tag}
              </button>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

// ArrowRight icon was missing from imports, define simple component
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
