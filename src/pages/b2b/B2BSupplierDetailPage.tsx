import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, MapPin, ShieldCheck, Mail, Phone, Calendar, 
  ArrowLeft, Star, Award, Layers, Users, Globe2, RefreshCw, Send,
  Search, Youtube, ChevronDown, CheckCircle2, Bookmark, ChevronLeft, ChevronRight, 
  Zap, TrendingUp, HelpCircle, AlertCircle, Share2, MessageCircle, BarChart3, 
  Play, Smartphone, Gift, Shirt, Info, Package, DollarSign, ThumbsUp, Heart
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { B2B_SUPPLIERS, B2BSupplier } from '../../data/b2bData';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useCarousel } from '../../hooks/useCarousel';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// Safe inline SVG Social Icons to prevent lucide-react compilation errors
const FacebookIcon = ({ size = 16, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 16, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedInIcon = ({ size = 16, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const AlibabaIcon = ({ size = 16, ...props }: CustomIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1-8.5h-2v2H9v-2H7v-2h2v-2h2v2h2v2zm3 6h-2v2h-2v-2H10v-2h2V9h2v2h2v2z"/>
  </svg>
);

export function B2BSupplierDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { allProducts, allBrands } = useGlobalState();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoved, setIsLoved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  // Sourcing Accordion states
  const [productLineIndex, setProductLineIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);

  // RFQ fields state
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryQty, setInquiryQty] = useState(100);
  const [inquiryMsg, setInquiryMsg] = useState('');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Find supplier
  const supplier = B2B_SUPPLIERS.find(s => s.slug === slug) || B2B_SUPPLIERS.find(b => b.slug === 'sailor-denim-mills') || B2B_SUPPLIERS[0];

  // Sourcing Catalog associated with this supplier
  const relatedProducts = allProducts.filter(p => p.brandId === (supplier.id === 'supp-3' ? 3 : 1) || p.category === 'Fashion & Lifestyle');

  const carouselItems = [
    { name: "Advanced Fabric Finishing", category: "Fabric Finishing Lines", img: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=1200&h=800&fit=crop" },
    { name: "Automated Loom Weaving", category: "Mill Structure Looms", img: "https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=1200&h=800&fit=crop" },
    { name: "Denim Laser Burners", category: "Precision Material Cutters", img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&h=800&fit=crop" },
    { name: "Steam Press & Final Inspect", category: "Global Export Packing", img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=800&fit=crop" }
  ];

  const handleProductLineNext = () => setProductLineIndex((prev) => (prev + 1) % carouselItems.length);
  const handleProductLinePrev = () => setProductLineIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  // Dynamic high-fidelity Supplier Sourcing Resolver
  const overviewData = {
    address: supplier.address.toUpperCase(),
    website: `sourcing.${supplier.slug}.com`,
    map: "https://www.google.com/maps",
    email: `sourcing@${supplier.slug}.com`,
    phone: `+880-2-${100000 + Math.floor(Math.random() * 800000)}`,
    priceRange: `BDT ${(supplier.minimumOrderValue / 1000).toLocaleString()}K - ${(supplier.minimumOrderValue * 10 / 1000).toLocaleString()}K Bulk Target`,
    ageRange: `EXPORT EXPERIENCE: ${supplier.yearsInBusiness} YEARS ACTIVE`,
    audience: `REGIONS: ${supplier.exportRegions.join(', ')}`,
    services: [
      "OEKO-TEX STANDARD COMPLIANT DYEING",
      "COMMERCIAL ESCROW SUPPORT VIA CHOOSIFY B2B",
      "DIRECT SEAPORT CONTAINER HANDLING (CHITTAGONG PORT)",
      "PRE-SHIPMENT PLANT INSPECTION VERIFIED",
      "INTERNATIONAL CONTAINER PACKAGING CERTIFIED",
      "24/7 ONLINE COMMERCIAL SUPPORT HOTLINES"
    ],
    tags: supplier.certifications.slice(0, 3).map(c => `#${c.replace(/[^a-zA-Z0-9]/g, '')}`).concat([
      `#MOQ${supplier.minimumOrderValue > 100000 ? '1000' : '200'}`,
      "#VerifiedSupplier",
      "#ExportActive"
    ])
  };

  const popularCats = [
    { label: 'DENIM WEAVING', img: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400&h=600&fit=crop' },
    { label: 'LASER FINISHING', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=600&fit=crop' },
    { label: 'EXPORT DEPOT', img: 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=400&h=600&fit=crop' }
  ];

  const renderSupplierLogo = (suppObj: any) => {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-[#081120] w-full text-white px-2 py-3 select-none">
        <span className="font-serif tracking-widest text-[24px] font-bold leading-none uppercase text-[#FF0038]">
          {suppObj.logo}
        </span>
        <span className="text-[6px] tracking-[0.25em] font-mono text-gray-400 font-bold uppercase mt-1.5">
          mill supplier
        </span>
      </div>
    );
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquirySubject.trim()) {
      toast.error('Please specify the subject for inquiry');
      return;
    }
    toast.success(`Broadcasting commercial inquiry to ${supplier.name} sales desk! Ref: B2B-INQ-${Math.floor(1000 + Math.random()*9000)}`);
    setInquirySubject('');
    setInquiryMsg('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#EEF1F8]">
      
      {/* 1. Supplier Hero Section (Mirrors Retail Brand Hero Section) */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: 'linear-gradient(135deg, #020710 0%, #081120 50%, #15050B 100%)'
        }}
        className="relative pt-10 pb-12 overflow-hidden border-b border-white/5 animate-fade-in"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF0038] rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Global Breadcrumbs in Hero Area */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full mb-6">
          <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-black uppercase tracking-widest">
            <Link to="/b2b" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-white/20" />
            <Link to="/b2b/suppliers" className="hover:text-white transition-colors">Suppliers</Link>
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-white">{supplier.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start">
              
              {/* Left Side: Supplier Profile Details */}
              <div className="flex-1 w-full text-center lg:text-left">
                 <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
                    
                    {/* Brand avatar container styled matching Retail logo mockup */}
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white overflow-hidden flex items-center justify-center shadow-2xl border-4 border-white relative shrink-0">
                       {renderSupplierLogo(supplier)}
                       <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-[#FF0038] rounded-full flex items-center justify-center text-white border-2 border-[#081120] shadow-lg">
                          <CheckCircle2 size={13} fill="currentColor" className="text-white stroke-[#FF0038]" />
                       </div>
                    </div>

                    <div className="flex-1">
                       <div className="flex flex-col sm:flex-row items-center gap-3 mb-2 flex-wrap justify-center sm:justify-start">
                          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none">{supplier.name}</h1>
                          <div className="bg-[#4DBC15] px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
                             <ShieldCheck size={11} className="text-white" />
                             <span className="text-[9px] font-black text-white uppercase tracking-widest italic whitespace-nowrap">Verified Supplier</span>
                          </div>
                       </div>
                       
                       <p className="text-[10px] md:text-[11px] font-extrabold text-[#FF0038]/90 uppercase tracking-[0.2em] mb-4">
                         {supplier.type} • {supplier.district} Sourcing Hub
                       </p>

                       <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-start">
                          <div className="flex items-center gap-2">
                             <Heart size={14} className="text-[#FF0038] fill-current" />
                             <span className="text-white font-extrabold text-[10px] uppercase tracking-widest italic">50K+ Sourcing Volume Negotiated</span>
                          </div>
                          <div className="h-4 w-px bg-white/10 hidden sm:block" />
                          <div className="flex items-center gap-2">
                             <TrendingUp size={14} className="text-green-accent" />
                             <span className="text-white font-extrabold text-[10px] uppercase tracking-widest italic">Reliability: {(supplier.ratings * 20).toFixed(0)}/100</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Action buttons inside landing board (Mirrors Retail CTA Placement) */}
                 <div className="flex flex-wrap gap-3.5 mb-8 justify-center sm:justify-start text-white">
                    <button 
                      onClick={() => {
                        const rfqSec = document.getElementById('b2b-direct-rfq-block');
                        if (rfqSec) rfqSec.scrollIntoView({ behavior: 'smooth' });
                        toast.success("Navigating to Direct Commercial RFQ lot form!");
                      }}
                      className="bg-[#FF0038] hover:bg-[#d6002f] text-white text-[10px] md:text-[11px] font-black uppercase px-6 md:px-8 py-3.5 md:py-4.5 rounded-full tracking-wider shadow-xl transition-all transform hover:scale-105 active:scale-95 italic border border-[#FF0038]/30 flex items-center gap-2 cursor-pointer"
                    >
                       <Mail size={14} /> Submit RFQ Quote
                    </button>
                    
                    <button 
                      onClick={() => {
                        setIsFollowed(!isFollowed);
                        toast.success(isFollowed ? `Unsubscribed from ${supplier.name} bulk catalogs!` : `Sourcing notifications enabled for ${supplier.name}!`);
                      }}
                      className={cn(
                        "text-[10px] md:text-[11px] font-black uppercase px-6 md:px-8 py-3.5 md:py-4.5 rounded-full tracking-wider transition-all transform hover:scale-105 active:scale-95 italic border cursor-pointer",
                        isFollowed
                          ? "bg-[#4DBC15] text-white border-[#4DBC15]" 
                          : "bg-white text-[#081120] border-white hover:bg-gray-50"
                      )}
                    >
                       {isFollowed ? "Following Sourcing" : "Follow Supplier"}
                    </button>

                    <button 
                      onClick={() => {
                        const reviewSec = document.getElementById('buyer-reviews-section');
                        if (reviewSec) reviewSec.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40 text-[10px] md:text-[11px] font-black uppercase px-6 md:px-8 py-3.5 md:py-4.5 rounded-full tracking-wider transition-all italic"
                    >
                       View Trade Feedback
                    </button>
                 </div>
                 
                 {/* Social Find Us On Container with customized loyalty/sourcing channels */}
                 <div className="flex items-center gap-4 mt-8 flex-wrap justify-center sm:justify-start">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest border-b-2 border-[#FF0038] pb-1 italic">Industrial Directory channels</span>
                    <div className="flex items-center gap-5">
                      <a href="#" className="group flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full border border-white/10 hover:border-white bg-white/5 group-hover:bg-[#0077B5] flex items-center justify-center text-white transition-all shadow-md">
                            <LinkedInIcon size={15} />
                          </div>
                          <span className="text-[8px] font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">LinkedIn</span>
                      </a>
                      <a href="#" className="group flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full border border-white/10 hover:border-white bg-white/5 group-hover:bg-[#FF6600] flex items-center justify-center text-white transition-all shadow-md">
                            <AlibabaIcon size={15} />
                          </div>
                          <span className="text-[8px] font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">Alibaba</span>
                      </a>
                      <a href="#" className="group flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full border border-white/10 hover:border-white bg-white/5 group-hover:bg-[#1877F2] flex items-center justify-center text-white transition-all shadow-md">
                            <FacebookIcon size={15} />
                          </div>
                          <span className="text-[8px] font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">Facebook</span>
                      </a>
                      <a href="#" className="group flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-full border border-white/10 hover:border-white bg-white/5 group-hover:bg-[#FF0000] flex items-center justify-center text-white transition-all shadow-md">
                            <Youtube size={15} />
                          </div>
                          <span className="text-[8px] font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">YouTube</span>
                      </a>
                    </div>
                 </div>
              </div>

              {/* Right Side: Trust Scorecard (Mirrors Retail Score Card Side Panel) */}
              <div className="w-full lg:w-[420px] relative">
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF0038]/10 blur-2xl rounded-full translate-x-1/3 -translate-y-1/3" />
                    
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <div className="text-[9px] font-black uppercase text-[#4DBC15] tracking-widest mb-0.5">Sourcing Trust Rating</div>
                          <div className="text-5xl font-black italic">{supplier.ratings} <span className="text-xl text-white/55">/5</span></div>
                       </div>
                       <div className="text-right">
                          <div className="flex gap-0.5 justify-end mb-1">
                             {[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} className="fill-[#FF0038] text-[#FF0038]" />)}
                          </div>
                          <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Based on {supplier.reviewsCount} Buyer Audits</div>
                       </div>
                    </div>

                    {/* Progress sliders matching Retail Brand detail layout */}
                    <div className="space-y-3.5 mb-6">
                       {[
                          { label: "Fabric Quality", value: 94, color: "bg-[#FF0038]" },
                          { label: "Loom Speeds", value: 88, color: "bg-[#4DBC15]" },
                          { label: "Wholesale Value", value: 92, color: "bg-[#FF0038]" },
                          { label: "Export Delivery", value: 90, color: "bg-[#4DBC15]" },
                          { label: "Pallet Packaging", value: 85, color: "bg-[#4DBC15]" }
                       ].map((m, i) => (
                          <div key={i} className="flex items-center gap-3">
                             <div className="w-20 text-[9px] font-bold uppercase tracking-wider text-white/60">{m.label}</div>
                             <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${m.value}%` }}
                                  transition={{ delay: 0.3, duration: 0.8 }}
                                  className={cn("h-full rounded-full", m.color)} 
                                />
                             </div>
                             <div className="w-8 text-[9px] font-black text-right text-white/80">{m.value}%</div>
                          </div>
                       ))}
                    </div>

                    {/* Recommend Sourcing board */}
                    <div className="flex items-center justify-between pt-5 border-t border-white/10">
                       <div className="text-center w-full">
                          <div className="text-4xl font-black text-[#50DC17] leading-none mb-1">96%</div>
                          <div className="text-[9px] font-black text-white/50 uppercase tracking-widest">Of Buyers Recommend This Industrial Mill</div>
                       </div>
                    </div>
                 </div>

                 {/* Floating Save/Share controls on bottom right */}
                 <div className="absolute -bottom-6 right-4 flex items-center gap-3 z-20">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Supplier share link copied to clipboard!");
                      }}
                      className="w-11 h-11 rounded-full bg-white text-[#081120] shadow-xl border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-gray-50"
                    >
                       <Share2 size={16} />
                    </button>
                    <button 
                      onClick={() => toast.success(`${supplier.name} added to your active suppliers vault!`)}
                      className="w-11 h-11 rounded-full bg-white text-[#081120] shadow-xl border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-gray-55"
                    >
                       <Bookmark size={15} />
                    </button>
                 </div>
              </div>

            </div>
        </div>
      </motion.section>

      {/* 2. Main 3-Column Layout (Mirrors Retail exactly) */}
      <div className="max-w-[1700px] mx-auto px-6 py-10 w-full">
         <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_250px] xl:grid-cols-[300px_minmax(0,1fr)_280px] gap-10 lg:gap-12 xl:gap-16 2xl:gap-24 items-start w-full">
            
            {/* LEFT COLUMN: SUPPLIER OVERVIEW, MANUFACTURING CATEGORIES (Mirrors Retail Left Column) */}
            <div className="flex flex-col gap-8 w-full lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
               
               {/* A. Supplier Overview Section */}
               <div id="supplier-overview-panel" className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
                  <h3 className="text-lg font-black text-[#081120] tracking-tight uppercase border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                     <span className="w-1.5 h-4 bg-[#FF0038] rounded-full inline-block" />
                     Supplier Overview
                  </h3>

                  <div className="space-y-6">
                     {/* Plant Address */}
                     <div className="group">
                        <div className="flex items-center gap-2.5 mb-1.5">
                           <div className="w-6 h-6 rounded-lg bg-[#FF0038]/10 text-[#FF0038] flex items-center justify-center">
                              <CheckCircle2 size={13} fill="currentColor" className="text-[#FF0038] stroke-white" />
                           </div>
                           <h4 className="text-[11px] font-black text-[#081120] uppercase tracking-wider">Plant Address & Logistics</h4>
                        </div>
                        <div className="pl-8 text-xs text-gray-500 font-bold leading-relaxed space-y-1.5">
                           <p className="uppercase">{overviewData.address}</p>
                           <div>
                              <span className="text-[#FF0038] font-black">PORTAL:</span>{' '}
                              <a href={`https://${overviewData.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#081120]">
                                 {overviewData.website}
                              </a>
                           </div>
                           <div>
                              <span className="text-[#FF0038] font-black">MAPS:</span>{' '}
                              <a href={overviewData.map} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#081120] truncate block max-w-full">
                                 {overviewData.map}
                              </a>
                           </div>
                        </div>
                     </div>

                     {/* Commercial Contacts */}
                     <div className="group">
                        <div className="flex items-center gap-2.5 mb-1.5">
                           <div className="w-6 h-6 rounded-lg bg-[#FF0038]/10 text-[#FF0038] flex items-center justify-center">
                              <CheckCircle2 size={13} fill="currentColor" className="text-[#FF0038] stroke-white" />
                           </div>
                           <h4 className="text-[11px] font-black text-[#081120] uppercase tracking-wider">Commercial Contacts</h4>
                        </div>
                        <div className="pl-8 text-xs text-gray-500 font-bold space-y-1">
                           <p className="truncate"><span className="text-[#081120] font-black">EMAIL:</span> {overviewData.email}</p>
                           <p><span className="text-[#081120] font-black">PHONE:</span> {overviewData.phone}</p>
                        </div>
                     </div>

                     {/* Minimum Order Value & Export Area */}
                     <div className="group">
                        <div className="flex items-center gap-2.5 mb-1.5">
                           <div className="w-6 h-6 rounded-lg bg-[#FF0038]/10 text-[#FF0038] flex items-center justify-center">
                              <CheckCircle2 size={13} fill="currentColor" className="text-[#FF0038] stroke-white" />
                           </div>
                           <h4 className="text-[11px] font-black text-[#081120] uppercase tracking-wider">Target MOQ & Sourcing Experience</h4>
                        </div>
                        <div className="pl-8 text-xs text-gray-500 font-bold space-y-1">
                           <p><span className="text-[#081120] font-black">LOT TARGET:</span> {overviewData.priceRange}</p>
                           <p>{overviewData.ageRange}</p>
                           <p className="uppercase">{overviewData.audience}</p>
                        </div>
                     </div>

                     {/* Trade Terms & Safety Specialties */}
                     <div className="group">
                        <div className="flex items-center gap-2.5 mb-1.5">
                           <div className="w-6 h-6 rounded-lg bg-[#FF0038]/10 text-[#FF0038] flex items-center justify-center">
                              <CheckCircle2 size={13} fill="currentColor" className="text-[#FF0038] stroke-white" />
                           </div>
                           <h4 className="text-[11px] font-black text-[#081120] uppercase tracking-wider">Trade Terms & Warranties</h4>
                        </div>
                        <ul className="pl-8 space-y-1.5">
                           {overviewData.services.map((srv, idx) => (
                              <li key={idx} className="text-[10px] text-gray-500 font-bold uppercase tracking-wide flex items-start gap-1.5">
                                 <span className="text-[#FF0038] text-xs leading-none">•</span>
                                 <span>{srv}</span>
                              </li>
                           ))}
                        </ul>
                     </div>

                     {/* Tags */}
                     <div className="group">
                        <div className="flex items-center gap-2.5 mb-2.5">
                           <div className="w-6 h-6 rounded-lg bg-[#FF0038]/10 text-[#FF0038] flex items-center justify-center">
                              <CheckCircle2 size={13} fill="currentColor" className="text-[#FF0038] stroke-white" />
                           </div>
                           <h4 className="text-[11px] font-black text-[#081120] uppercase tracking-wider">Best For #TradeTags</h4>
                        </div>
                        <div className="pl-8 flex flex-wrap gap-1.5">
                           {overviewData.tags.map((tag, idx) => (
                              <span key={idx} className="text-[9px] font-black text-[#FF0038] bg-[#FFF0E8] px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#FF0038]/5 select-none">
                                 {tag}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* B. Manufacturing Previews Section */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
                  <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                     <h3 className="text-sm font-black text-[#081120] uppercase tracking-tight flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-[#FF0038] rounded-full inline-block" />
                        Mill Segments
                     </h3>
                     <span className="text-[9px] font-black text-[#FF0038] uppercase tracking-wider hover:underline cursor-pointer" onClick={() => navigate('/b2b/products')}>Inspect All</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                     {popularCats.map((cat, idx) => (
                        <div key={idx} className="flex flex-col items-center group cursor-pointer" onClick={() => navigate('/b2b/products')}>
                           <div className="w-full aspect-[2/3] rounded-xl overflow-hidden relative border border-gray-100 shadow-sm mb-2 group-hover:shadow-md transition-all">
                              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute inset-0 bg-[#081120]/10 group-hover:bg-transparent transition-colors" />
                           </div>
                           <span className="text-[9px] font-black text-[#081120] tracking-wider uppercase text-center group-hover:text-[#FF0038] transition-colors leading-tight">
                              {cat.label}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>

            </div>

            {/* CENTER FEED: PRODUCTS CATALOG, AUDIT VIDEO REPORT, ALTERNATIVE MILL MATRIX, VERIFIED BUYERS FEEDBACK  (Mirrors Retail Center Column) */}
            <div className="flex flex-col gap-8 w-full min-w-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2">
               
               {/* A. Factory Operation Lines (Mirrors Retail Product Line Carousel) */}
               <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h2 className="text-xl md:text-2xl font-black text-[#081120] tracking-tight uppercase flex items-center gap-2">
                           <span className="w-1.5 h-5 bg-[#FF0038] rounded-full inline-block" />
                           Machinery & Production lines
                        </h2>
                     </div>
                     <span className="text-[10px] font-black text-[#FF0038] hover:underline uppercase tracking-wider cursor-pointer" onClick={() => navigate('/b2b/products')}>Direct Factory Catalog</span>
                  </div>

                  {/* Interactive accordions section (Reuses Retail Accordion Code Exactly) */}
                  <div className="flex flex-col md:flex-row gap-3.5 h-[340px] md:h-[460px] overflow-hidden w-full">
                     {carouselItems.map((item, idx) => {
                        const isActive = idx === productLineIndex;
                        return (
                           <motion.div
                             key={idx}
                             onClick={() => setProductLineIndex(idx)}
                             initial={false}
                             animate={{
                               width: isActive ? (isMobile ? '100%' : '60%') : (isMobile ? '0%' : '13%'),
                               flex: isActive ? 10 : 1,
                               opacity: isActive ? 1 : 0.75,
                             }}
                             transition={{
                               type: "spring",
                               stiffness: 85,
                               damping: 17
                             }}
                             className={cn(
                               "relative h-full rounded-2xl overflow-hidden cursor-pointer group",
                               !isActive && "hidden md:block"
                             )}
                           >
                             <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" />
                             <div className={cn(
                                "absolute inset-0 transition-opacity duration-700",
                                isActive ? "bg-gradient-to-t from-black/85 via-black/25 to-transparent" : "bg-black/35"
                             )} />

                             {/* Sideway labels for collapsed panels */}
                             {!isActive && (
                                <div className="absolute inset-x-0 bottom-12 flex justify-center translate-y-10 group-hover:translate-y-0 transition-transform">
                                   <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em] italic origin-center rotate-[-90deg] whitespace-nowrap">
                                      {item.name}
                                   </span>
                                </div>
                             )}

                             {/* Full Title on active panels */}
                             {isActive && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 15 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="absolute inset-0 p-8 flex flex-col justify-end items-start"
                                >
                                   <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.3em] mb-1 italic">{item.category}</span>
                                   <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                                      {item.name}
                                   </h3>
                                </motion.div>
                             )}
                           </motion.div>
                        );
                     })}
                  </div>

                  {/* Accordion Carousel buttons and paginations */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div className="flex gap-2.5">
                        {carouselItems.map((_, idx) => (
                           <button
                             key={idx}
                             onClick={() => setProductLineIndex(idx)}
                             className={cn(
                               "h-1.5 transition-all duration-300 rounded-full",
                               productLineIndex === idx ? "w-10 bg-[#FF0038]" : "w-2 bg-gray-200 hover:bg-gray-300"
                             )}
                           />
                        ))}
                     </div>
                     
                     <div className="flex gap-3">
                        <button onClick={handleProductLinePrev} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 bg-white transition-all active:scale-95 shadow-sm cursor-pointer">
                           <ChevronLeft size={18} className="text-[#081120]" />
                        </button>
                        <button onClick={handleProductLineNext} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 bg-white transition-all active:scale-95 shadow-sm cursor-pointer">
                           <ChevronRight size={18} className="text-[#081120]" />
                        </button>
                     </div>
                  </div>

                  {/* Primary browse all button below */}
                  <div className="mt-8 border-t border-gray-50 pt-6 flex justify-center">
                     <span 
                       onClick={() => navigate('/b2b/products')}
                       className="bg-[#FF0038] hover:bg-[#d6002f] text-white text-xs font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.97] italic inline-flex items-center gap-2 cursor-pointer"
                     >
                        Explore Wholesale Catalog
                     </span>
                  </div>
               </div>

               {/* B. Factory Inspection & Walkthrough Video Reports (Mirrors Retail Influencer & YouTuber Reviews) */}
               <div className="bg-[#081120] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-white/5 animate-fade-in_quick">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF0038]/5 blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 mb-4 bg-white/5 border border-white/10 rounded-full px-3 py-1 w-fit">
                     <Users size={12} className="text-[#FF0038]" />
                     <span className="text-[8px] font-black uppercase tracking-widest italic text-white/70">Audit Verification Reports</span>
                  </div>

                  <div className="mb-8">
                     <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tight mb-2">
                        Plant Walkthrough & Audit Videos
                     </h3>
                     <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 italic">
                        Independent Inspectors Verifying {supplier.name} Facilities
                     </p>
                  </div>

                  {/* Main YouTube Feature block */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                     <div className="relative aspect-video lg:aspect-auto lg:h-[300px] group overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=800&h=600&fit=crop" 
                          alt="Factory Audit Stream" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-black/30" />
                        
                        <div className="absolute top-4 left-4">
                           <span className="bg-[#FF0038] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-wider italic flex items-center gap-1.5 shadow-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE FACILITY FLOW
                           </span>
                        </div>
                        
                        <button 
                          onClick={() => toast.success("Opening independent plant inspection stream...")}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#FF0038] flex items-center justify-center text-white shadow-2xl transform scale-100 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                        >
                           <Play size={20} className="fill-current ml-1" />
                        </button>
                        
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                           <span className="text-[8px] tracking-widest uppercase text-white/50 block font-black mb-1">Auditor spotlight</span>
                           <h4 className="text-lg md:text-xl font-black italic tracking-tight">{supplier.name} Factory Plant Overview</h4>
                        </div>
                     </div>

                     <div className="p-6 md:p-8 flex flex-col justify-center bg-white/5 backdrop-blur-md">
                        <span className="text-[9px] font-black text-[#FF0038] tracking-widest block uppercase mb-3 italic">INDEPENDENT REPORT</span>
                        <h4 className="text-base md:text-lg font-black italic tracking-tight leading-snug mb-3">
                           Comprehensive Inspection of Capacity Operations
                        </h4>
                        <p className="text-xs text-white/60 font-medium leading-relaxed mb-6">
                           Complete audit checking processing looms, labor compliance, eco-treatment plants, and mass carton logistics. Verified under BSCI standard parameters.
                        </p>
                        
                        <div className="w-full h-px bg-white/10 mb-5" />
                        
                        <div className="flex items-center justify-between flex-wrap gap-4">
                           <div>
                              <div className="text-[10px] font-black text-white italic">Bureau Veritas BD</div>
                              <div className="text-[8px] font-black text-white/40 tracking-wider uppercase">Conducted at {supplier.district} Mill</div>
                           </div>
                           <span className="text-[10px] font-black uppercase text-[#FF0038] tracking-widest bg-white/5 px-3 py-1.5 rounded border border-white/5 select-none">CHOOSIFY APPROVED</span>
                        </div>
                     </div>
                  </div>

                  {/* Sourcing Clips and Audit reels (Mirrors YouTube Reels section) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                     
                     {/* Reel Card */}
                     <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 h-[280px] relative flex flex-col group">
                        <div className="absolute inset-0">
                           <img src="https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=600&h=800&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Loom Speed Reel" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        </div>
                        
                        <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center text-white font-extrabold border border-white/10">
                           <Smartphone size={13} />
                        </div>
                        <div className="absolute top-3 right-3 bg-[#FF0038]/90 backdrop-blur-md rounded-full text-[7px] font-black px-2.5 py-1 uppercase tracking-wider text-white">
                           Loom Speed Report
                        </div>

                        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FF0038] shadow-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transform scale-90 group-hover:scale-100 transition-all cursor-pointer">
                           <Play size={14} className="fill-current ml-0.5" />
                        </div>

                        <div className="mt-auto p-4 relative z-10">
                           <h5 className="text-sm font-black italic tracking-tight text-white mb-2 leading-tight">
                              Weaving Mill High Speed RPM Check
                           </h5>
                           <div className="flex items-center gap-2 justify-between border-t border-white/10 pt-2 text-[9px]">
                              <span className="text-white/60 font-black tracking-wider uppercase">@millmasters</span>
                              <span className="text-white/40 font-bold">18K Sourcing Views</span>
                           </div>
                        </div>
                     </div>

                     {/* Second Review Card */}
                     <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col group text-white">
                        <div className="relative h-28 overflow-hidden bg-black">
                           <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Dyeing Facility" />
                           <div className="absolute inset-0 bg-black/10" />
                           <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center border border-white/10">
                              <Youtube size={14} className="text-red-600" />
                           </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col text-white">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex gap-0.5">
                                 {[1,2,3,4,5].map(i => <Star key={i} size={8} className="fill-[#FF0038] text-[#FF0038]" />)}
                              </div>
                              <span className="text-[7px] text-white/40 tracking-wider font-extrabold uppercase font-mono">ASTM COMPLIANCE</span>
                           </div>
                           <h5 className="text-xs font-black italic tracking-tight uppercase leading-snug mb-1.5">Fabric Tear & Weight Stress Check</h5>
                           <p className="text-[10px] text-white/50 leading-relaxed font-semibold italic mb-4">Independent testing with custom tensile strain weights on raw fabrics.</p>
                           
                           <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-white/60">
                              <span className="font-extrabold">SGS Quality Lab BD</span>
                              <span className="text-white/30">12K Views • 5.0 Rating</span>
                           </div>
                        </div>
                     </div>

                     {/* Third Review Card */}
                     <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col group text-white">
                        <div className="relative h-28 overflow-hidden bg-black">
                           <img src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400&h=300&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Treatment Plant" />
                           <div className="absolute inset-0 bg-black/10" />
                           <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md rounded-full w-7 h-7 flex items-center justify-center border border-white/10">
                              <Youtube size={14} className="text-red-600" />
                           </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col text-white">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex gap-0.5">
                                 {[1,2,3,4].map(i => <Star key={i} size={8} className="fill-[#FF0038] text-[#FF0038]" />)}
                              </div>
                              <span className="text-[7px] text-white/40 tracking-wider font-extrabold uppercase font-mono">ECO INSPECTION</span>
                           </div>
                           <h5 className="text-xs font-black italic tracking-tight uppercase leading-snug mb-1.5">Effluent Treatment Ecology Audit</h5>
                           <p className="text-[10px] text-white/50 leading-relaxed font-semibold italic mb-4">Water recycling purity and zero sulfur pollutant footprint parameters checked.</p>
                           
                           <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-white/60">
                              <span className="font-extrabold">EcoAudit Bangladesh</span>
                              <span className="text-white/30">8.4K Views • 4.8 Rating</span>
                           </div>
                        </div>
                     </div>

                  </div>
               </div>

               {/* C. Wholesale Active Factory Lots (Reuses Retail Product Grid EXACTLY, with requested B2B visual enhancements) */}
               <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <h3 className="text-xl md:text-2xl font-black text-[#081120] tracking-tight uppercase flex items-center gap-2">
                           <span className="w-1.5 h-5 bg-[#FF0038] rounded-full inline-block" />
                           Active Factory Sourcing Lots
                        </h3>
                     </div>
                     <span className="text-[10px] font-black text-[#FF0038] hover:underline uppercase tracking-wider cursor-pointer" onClick={() => navigate('/b2b/products')}>Inspect Sourcing Lots</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedProducts.slice(0, 4).map((p) => {
                      const basePrice = p.pricingTiers?.[0]?.price || p.price;
                      const maxSavings = p.pricingTiers?.[p.pricingTiers.length - 1]?.price || basePrice;
                      
                      return (
                        <div 
                          key={p.id}
                          className="bg-white border border-gray-100/80 hover:border-[#FF0038]/30 rounded-3xl p-5 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between shadow-sm hover:shadow-md animate-fade-in"
                        >
                          <div>
                            {/* Product Image and Sourcing Badges */}
                            <div className="w-full aspect-video rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 relative">
                              <img src={p.image} className="w-full h-full object-cover group-hover:scale-102 transition-all duration-700" alt="" />
                              
                              {/* MOQ badge (B2B ENHANCEMENT) */}
                              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#081120] rounded-lg text-[8px] font-black text-white uppercase font-mono tracking-wider shadow-md">
                                MOQ: {p.moq || 200} Pcs
                              </div>

                              {/* Supplier Origin Hub Tag (B2B ENHANCEMENT) */}
                              <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-[#FF0038] text-white rounded-lg text-[8px] font-black uppercase font-sans tracking-tight shadow-md">
                                {supplier.district} Sourcing Hub
                              </div>
                            </div>
                            <div className="mt-3.5">
                              <span className="text-[8px] font-black text-[#FF0038] uppercase tracking-widest font-mono">{p.category}</span>
                              <h4 className="font-black text-[#081120] italic mt-0.5 group-hover:text-[#FF0038] transition-colors line-clamp-1 text-base">{p.title}</h4>
                            </div>
                          </div>

                          {/* Slashed Bulk Tier Pricing (B2B ENHANCEMENT) */}
                          <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider font-mono">Wholesale Lot Tiers</p>
                              <p className="text-sm font-black text-[#4DBC15] italic font-mono mt-0.5">
                                ৳{Math.floor(basePrice * 0.85).toLocaleString()} - ৳{basePrice.toLocaleString()} <span className="text-[8px] text-gray-400 font-sans font-bold">/ Pcs</span>
                              </p>
                            </div>

                            {/* Bulk Sourcing Inquiry Button (B2B ENHANCEMENT) */}
                            <button 
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setInquirySubject(`Bulk Inquiry on: ${p.title}`);
                                 const rfqSec = document.getElementById('b2b-direct-rfq-block');
                                 if (rfqSec) rfqSec.scrollIntoView({ behavior: 'smooth' });
                                 toast.success(`Broadcasting commercial subject targeted for lots!`);
                              }}
                              className="bg-[#081120] text-white hover:bg-[#FF0038] transition-colors text-[8px] font-extrabold px-3 py-2 rounded-xl uppercase tracking-wider flex items-center gap-1 shadow-sm uppercase italic"
                            >
                              Inquire Block <ArrowLeft size={8} className="rotate-180 text-white" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
               </div>

               {/* D. Alternative Sourcing Matrix comparison table (Mirrors Retail Similar Brands Comparison Table) */}
               <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80">
                  <h3 className="text-xl md:text-2xl font-black text-[#081120] tracking-tight uppercase mb-8 text-center italic">
                     Alternative Mill Sourcing Matrix
                  </h3>

                  <div className="overflow-x-auto no-scrollbar rounded-2xl border border-gray-100">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider italic">
                              <th className="py-4.5 px-6">Supplier Identity</th>
                              <th className="py-4.5 px-6 text-center">Quality Standard</th>
                              <th className="py-4.5 px-6 text-center">Bulk Pricing</th>
                              <th className="py-4.5 px-6 text-center">TrustScore</th>
                              <th className="py-4.5 px-6 text-right">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs">
                           {[
                              { name: "Sailor Denim Mills Ltd.", loc: "supp-1", logo: "SD", quality: "Export Premium", price: "Highly Uniform (৳৳)", score: "4.9" },
                              { name: "Epyllion Trade Syndicate", loc: "supp-2", logo: "EP", quality: "Wholesale Master", price: "Direct Mill Rate (৳৳৳)", score: "4.8" },
                              { name: "Apex Wholesale Industrial", loc: "supp-3", logo: "AW", quality: "Pallet Lots", price: "High Volume (৳৳)", score: "4.7" },
                              { name: "Sylhet Artisanal Gems & Pearl", loc: "supp-4", logo: "SG", quality: "Pink Pearls Craft", price: "Agro / Small Lot (৳)", score: "4.4" }
                           ].map((item, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                 <td className="py-4.5 px-6">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-[#081120] text-white font-extrabold flex items-center justify-center text-[10px]">
                                          {item.logo}
                                       </div>
                                       <span className="font-extrabold text-[#081120] italic">{item.name}</span>
                                    </div>
                                 </td>
                                 <td className="py-4.5 px-6 text-center">
                                    <span className="px-2.5 py-0.5 bg-[#4DBC15]/10 text-[#4DBC15] text-[8px] font-black uppercase rounded tracking-wider italic">
                                       {item.quality}
                                    </span>
                                 </td>
                                 <td className="py-4.5 px-6 text-center text-[10px] font-semibold text-gray-500 italic">{item.price}</td>
                                 <td className="py-4.5 px-6 text-center">
                                    <div className="flex items-center justify-center gap-1 text-[11px] font-extrabold text-navy italic">
                                       <Star size={10} className="fill-[#FF0038] text-[#FF0038]" />
                                       <span>{item.score}</span>
                                    </div>
                                 </td>
                                 <td className="py-4.5 px-6 text-right">
                                    <button onClick={() => {
                                       toast.success(`Redirecting to ${item.name} Sourcing portal!`);
                                       navigate(`/b2b/supplier/${item.loc === 'supp-1' ? 'sailor-denim-mills' : item.loc === 'supp-2' ? 'epyllion-trade-syndicate' : item.loc === 'supp-3' ? 'apex-wholesale' : 'sylhet-artisanal-gems'}`);
                                    }} className="px-4 py-1.5 border border-[#081120] hover:bg-[#081120] hover:text-white text-[#081120] font-black text-[9px] uppercase tracking-wider rounded-full italic transition-all inline-block cursor-pointer">
                                       Inspect
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               {/* E. Direct Factory Representative RFQ form container (B2B Direct addition inside identical layout block) */}
               <div id="b2b-direct-rfq-block" className="bg-[#081120] border-none rounded-[32px] p-6 md:p-8 shadow-2xl relative text-white animate-fade-in">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF0038]/10 blur-3xl rounded-full" />
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                     <span className="w-1.5 h-4 bg-[#FF0038] rounded-full inline-block" />
                     Direct Sourcing Commercial RFQ Lot
                  </h3>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-6">Secured under Choosify Escrow protection & mass cargo delivery SLA</p>

                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                     <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-[#FF0038] mb-1.5">Sourcing Subject / Lot parameters</label>
                        <input 
                           type="text" 
                           value={inquirySubject}
                           onChange={(e) => setInquirySubject(e.target.value)}
                           required
                           placeholder="e.g. Combed Cotton Denim Lot 12oz 5,000 Yards target"
                           className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FF0038]"
                        />
                     </div>

                     <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-[#FF0038] mb-1.5">Sourcing Target Batch Quantity (Pcs/Yards)</label>
                        <input 
                           type="number" 
                           value={inquiryQty}
                           onChange={(e) => setInquiryQty(Number(e.target.value))}
                           min={150}
                           required
                           className="w-full h-12 px-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FF0038]"
                        />
                     </div>

                     <div>
                        <label className="block text-[8px] font-black uppercase tracking-widest text-[#FF0038] mb-1.5">Custom Plant Directives & Yarn specifications</label>
                        <textarea 
                           value={inquiryMsg}
                           onChange={(e) => setInquiryMsg(e.target.value)}
                           rows={4}
                           required
                           placeholder="Specify your denim washing parameters, customized carton layering, printing color standard options, and shipping seaport configurations."
                           className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-[#FF0038] resize-none"
                        />
                     </div>

                     <button 
                        type="submit"
                        className="w-full h-14 bg-[#FF0038] hover:bg-[#d6002f] text-white rounded-xl text-xs font-black uppercase tracking-widest italic transition-all shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer"
                     >
                        Broadcast Sourcing Slabs Inquiry <Send size={12} />
                     </button>
                  </form>
               </div>

               {/* F. Verified Sourcing Buyers Lot testimonals (Mirrors Retail Public Reviews Customer Dashboard EXACTLY) */}
               <div id="buyer-reviews-section" className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100/80 animate-fade-in">
                  <div className="text-center mb-8 border-b border-gray-100 pb-5">
                     <h3 className="text-xl md:text-2xl font-black text-[#081120] tracking-tight uppercase mb-2">
                        Buyers Trade Testimonials
                     </h3>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic bg-gray-55 border border-gray-100 rounded-full px-4 py-1.5 w-fit mx-auto">
                        Verified Bulk Procurement lot feedback
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {[
                        {
                           name: "Tanvir Hasan",
                           role: "Procurement Manager, Dhaka Apparel Syndicate",
                           date: "2 weeks ago",
                           purchaseDate: "April 2024 Lot Deliveries",
                           comment: `The weaving uniformity of the combed fabric lot executed by ${supplier.name} is outstanding. Independent inspection reports were accurate, and seaport direct delivery met our strict SLA timelines. Will continue mass sourcing.`,
                           rating: 5,
                           verified: true,
                           productImages: [
                              "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=400&h=400&fit=crop",
                              "https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=400&h=400&fit=crop"
                           ],
                           dp: "https://i.pravatar.cc/150?u=tanvirlot",
                           helpful: 124
                        },
                        {
                           name: "Nusrat Jahan",
                           role: "Sourcing Director, Stockholm Cotton Trade",
                           date: "1 month ago",
                           purchaseDate: "March 2024 Lot Deliveries",
                           comment: "Ecological treatment parameter is highly authentic. We got our Oeko-Tex certification standards double verified by on-site third party labs. Highly cooperative commercial desk representing professional mills.",
                           rating: 4.8,
                           verified: true,
                           productImages: [
                              "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop"
                           ],
                           dp: "https://i.pravatar.cc/150?u=nusratlot",
                           helpful: 89
                        }
                     ].map((review, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100/50 rounded-2xl p-6 flex flex-col group hover:shadow-md transition-shadow duration-300">
                           <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                              <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#FF0038] p-0.5 bg-white">
                                    <img src={review.dp} className="w-full h-full object-cover rounded-lg" alt={review.name} />
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                       <span className="font-extrabold text-[#081120] text-sm italic">{review.name}</span>
                                       {review.verified && (
                                          <span className="bg-[#4DBC15]/10 text-[#4DBC15] text-[7px] font-black uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                             <CheckCircle2 size={8} className="text-[#4DBC15]" /> Sourcing Approved
                                          </span>
                                       )}
                                    </div>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mt-0.5 leading-snug">{review.role}</span>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="flex gap-0.5 justify-end">
                                    {[1, 2, 3, 4, 5].map(star => (
                                       <Star key={star} size={10} className={cn("fill-current", star <= review.rating ? "text-[#FF0038]" : "text-gray-200")} />
                                    ))}
                                 </div>
                                 <div className="text-sm font-black text-[#081120] mt-0.5 italic">{review.rating} <span className="text-[8px] text-gray-300 font-sans">/ 5</span></div>
                              </div>
                           </div>

                           {/* Media Files */}
                           <div className="flex gap-2 mb-4">
                              {review.productImages.map((img, j) => (
                                 <div key={j} className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 cursor-zoom-in">
                                    <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="review attachments" />
                                 </div>
                              ))}
                           </div>

                           <div className="p-4 bg-white border border-gray-100 rounded-xl mb-4 relative flex-1">
                              <p className="text-xs text-navy/80 font-bold leading-relaxed italic">
                                 "{review.comment}"
                              </p>
                           </div>

                           <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100/50 font-sans">
                              <div className="flex flex-col">
                                 <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest italic mb-0.5">Commercial Lot deliveries</span>
                                 <span className="text-[9px] font-black text-[#081120] uppercase tracking-wider italic">{review.purchaseDate}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                 <button 
                                   onClick={() => toast.success("Marked buyer feedback as helpful!")}
                                   className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-gray-100 hover:border-navy text-[#081120] font-black text-[9px] uppercase tracking-widest italic transition-colors cursor-pointer"
                                 >
                                    <ThumbsUp size={10} /> Helpful ({review.helpful})
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-8 flex justify-center">
                     <button onClick={() => toast.success("Loading all trade testimonials...")} className="px-10 py-3.5 border border-[#081120] text-[#081120] hover:bg-[#081120] hover:text-white transition-all text-[9.5px] font-black uppercase tracking-widest rounded-full italic cursor-pointer">
                        View All Testimonial Logs
                     </button>
                  </div>
               </div>

            </div>

            {/* RIGHT COLUMN: WHOLESALE SPOT DEALS & PROMO LOTS, SPONSORED ADS (Mirrors Retail Right Column) */}
            <div className="flex flex-col gap-8 w-full lg:max-w-[250px] xl:max-w-[280px] flex-shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-10 pr-2 no-scrollbar">
               
               {/* A. Sourcing Spot Slabs Deals (Mirrors Retail Promo Codes Section) */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80">
                  <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
                     <h3 className="text-sm font-black text-[#081120] uppercase tracking-tight flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-[#FF0038] rounded-full inline-block" />
                        Mill Spot Deals
                     </h3>
                     <span onClick={() => navigate('/deals')} className="text-[9px] font-black text-[#FF0038] uppercase tracking-wider hover:underline cursor-pointer">View All</span>
                  </div>

                  <div className="space-y-4">
                     {[
                        { title: "Direct Mill Sign-Up Promo", discount: "10% LOWER TRIAL MOQ", code: "SIGNUPB2B", expiry: "Trial Batches Only" },
                        { title: "Seaport Freight Spot Offer", discount: "SAVE BDT 30,000 FLAT", code: "FREIGHT30", expiry: "Freight Insurance Slabs Included" },
                        { title: "Spot Fabric Wash Promo", discount: "SAVE BDT 15,000 VALUE", code: "WASHCLEAR", expiry: "Bulk Dye Orders Only" }
                     ].map((promo, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group hover:shadow-sm transition-all duration-305">
                           <div className="w-8 h-8 rounded-full bg-[#FFF0E8] text-[#FF0038] flex items-center justify-center mb-2 shadow-sm shrink-0">
                              <Gift size={15} />
                           </div>
                           <h4 className="text-[10px] font-black text-[#081120] uppercase tracking-wider mb-0.5 leading-tight">{promo.title}</h4>
                           <div className="text-xs font-black text-[#FF0038] italic uppercase mb-3 leading-none">{promo.discount}</div>
                           
                           <button 
                             onClick={() => {
                               navigator.clipboard.writeText(promo.code);
                               toast.success(`Spot Code ${promo.code} copied!`);
                             }}
                             className="w-full py-2 bg-white rounded-xl border border-dashed border-gray-200 hover:border-[#FF0038] font-mono text-[11px] font-extrabold text-[#081120] tracking-widest uppercase transition-colors flex flex-col items-center justify-center cursor-pointer"
                           >
                              <span className="text-[7px] text-gray-400 font-sans tracking-wide uppercase font-black">SPOT COUPON CODE</span>
                              <span>{promo.code}</span>
                           </button>
                           
                           <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-2">{promo.expiry}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* B. Sponsored Mill Ad (Mirrors Retail Sponsored Ad Section) */}
               <div className="bg-[#050D1A] rounded-3xl p-6 text-white text-center relative overflow-hidden shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                  <div className="relative z-10">
                     <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest block w-fit mx-auto mb-4 font-mono">
                        SPONSORED MILL SPOT
                     </span>
                     
                     <div className="w-full aspect-square rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-lg">
                        <img 
                           src="https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=600&h=600&fit=crop" 
                           alt="Sponsor AD" 
                           className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                        />
                     </div>
                     
                     <h4 className="font-serif text-lg font-bold tracking-widest uppercase mb-1">APEX SILK</h4>
                     <p className="text-[9px] font-black text-white/50 tracking-wider uppercase mb-3 font-mono">Premium bulk textile loom lots</p>
                     
                     <p className="text-[11px] text-white/70 font-medium leading-relaxed mb-6 px-1 font-sans">
                        Raw pure weave silk and wholesale elastomer rubber blocks. Direct seaport container routing from Kanchpur.
                     </p>
                     
                     <button onClick={() => {
                        toast.success("Opening Apex Wholesale spotlight items...");
                        navigate('/b2b/supplier/apex-wholesale');
                     }} className="w-full bg-[#FF0038] hover:bg-[#d6002f] text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-full shadow-lg hover:shadow-[#FF0038]/20 transition-all cursor-pointer">
                        Inspect Mill Slabs
                     </button>
                  </div>
               </div>

            </div>

         </div>
      </div>

    </div>
  );
}
