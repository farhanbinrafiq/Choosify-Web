import React, { useState, useEffect, useMemo } from 'react';
import { DETAIL_SINGLE_FEED } from "../lib/pageLayout";
import { StickySectionNav } from '../components/StickySectionNav';
import { useSectionScrollSpy } from '../hooks/useSectionScrollSpy';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Youtube, Instagram, Facebook, Award, Heart, Check, 
  ExternalLink, Mail, Phone, Video, Send, FileText, CheckCircle2, 
  AlertCircle, Sparkles, BookOpen, Clock, Play, ShieldCheck, TrendingUp, Info, 
  ChevronRight, Share2, Bookmark, Flame, Star, X, MessageCircle, BarChart3, Users, Package, Gift, Search, Lock
} from 'lucide-react';
import { CREATORS, Creator } from '../data/creators';
import { cn } from '../lib/utils';
import { PublicReviewCard } from '../components/PublicReviewCard';
import { useGlobalState } from '../context/GlobalStateContext';
import { ClaimProfileModal } from '../components/ClaimProfileModal';
import { FollowButton } from '../components/FollowButton';
import { useRegisterPageFilters } from '../components/FilterEngine';

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
  const navigate = useNavigate();
  const { openVideo, getCreatorClaimStatus, updateCreatorClaimStatus, creatorClaimStatuses } = useGlobalState();

  // Find creator or fallback safely to first creator
  const creator = CREATORS.find(c => c.id === id) || CREATORS[0];

  useRegisterPageFilters({
    pageName: creator ? creator.name : 'Creator Profile',
    renderSearch: null,
    quickFilters: [
      { id: 'about', label: 'ℹ️ About', active: true, onClick: () => {} },
      { id: 'collabs', label: '🤝 Collaborations', active: false, onClick: () => {} },
      { id: 'reviews', label: '⭐ Reviews', active: false, onClick: () => {} }
    ],
    renderFilters: null,
    activeFilterCount: 0,
    onClearAll: null
  }, [creator]);

  const [localClaimStatus, setLocalClaimStatus] = useState<'verified' | 'pending' | 'community'>(() => getCreatorClaimStatus(creator.id));
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  useEffect(() => {
    setLocalClaimStatus(getCreatorClaimStatus(creator.id));
  }, [creator.id, creatorClaimStatuses]);

  // Augmented details matching standard rating system
  const rating = creator.id === 'creator-farhan' ? 4.9 :
                 creator.id === 'creator-sarah' ? 4.8 :
                 creator.id === 'creator-mily' ? 4.9 :
                 creator.id === 'creator-imtiaz' ? 4.7 : 4.6;

  const reviewsCount = creator.id === 'creator-farhan' ? 240 :
                       creator.id === 'creator-sarah' ? 190 :
                       creator.id === 'creator-mily' ? 150 :
                       creator.id === 'creator-imtiaz' ? 80 : 70;

  const followersCount = creator.id === 'creator-farhan' ? '450K Base' :
                         creator.id === 'creator-sarah' ? '310K Base' :
                         creator.id === 'creator-mily' ? '210K Base' :
                         creator.id === 'creator-imtiaz' ? '180K Base' : '180K Base';

  // Interaction States
  const [isJoined, setIsJoined] = useState(false); // follow state
  const [isLoved, setIsLoved] = useState(false); // love favorite state
  const [isModalOpen, setIsModalOpen] = useState(false); // structured brief outreach modal state
  
  // Structured Brief Outreach Form States
  const [productDetails, setProductDetails] = useState('');
  const [collabType, setCollabType] = useState('Product Review');
  const [requirements, setRequirements] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  // Submit Outcome Status
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [searchFilter, setSearchFilter] = useState('');
  const [currentSearchInput, setCurrentSearchInput] = useState('');

  const creatorSectionNavItems = useMemo(
    () => [
      { id: 'videos-section', label: 'Videos', icon: <Youtube size={13} /> },
      { id: 'reels-section', label: 'Reels', icon: <Instagram size={13} /> },
      { id: 'blogs-section', label: 'Blogs', icon: <BookOpen size={13} /> },
      {
        id: 'brand-reviews-section',
        label: 'Reviews',
        icon: <ShieldCheck size={13} />,
      },
      { id: 'creator-overview-section', label: 'Overview', icon: <Award size={13} /> },
    ],
    [],
  );

  const { activeId: activeSectionId, scrollToSection } = useSectionScrollSpy(
    creatorSectionNavItems,
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productDetails || !requirements) {
      toast.error('Please fill in both product details and campaign requirements.');
      return;
    }
    setSubmitSuccess(true);
    toast.success('Structured collaboration request finalized!');
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

  // Safe filtering of items based on inline search phrase
  const filteredVideos = creator.videos.filter(v => 
    v.title.toLowerCase().includes(searchFilter.toLowerCase().trim())
  );
  
  const filteredReels = creator.reels.filter(r => 
    r.title.toLowerCase().includes(searchFilter.toLowerCase().trim())
  );

  const filteredBlogs = creator.blogs.filter(b => 
    b.title.toLowerCase().includes(searchFilter.toLowerCase().trim()) ||
    b.excerpt?.toLowerCase().includes(searchFilter.toLowerCase().trim())
  );

  // Brand Reviews Support
  const getBrandReviewsForCreator = (creatorId: string) => {
    switch (creatorId) {
      case 'creator-farhan':
        return [
          {
            name: "Apex Footwear Ltd. (Marketing)",
            date: "3 weeks ago",
            purchaseDate: "May 2026",
            comment: "Farhan delivered exceptionally high-quality smartphone integration video for our new smart-infused winter sneaker line. Communication was lightning fast and the content yielded a 15% increase in conversion rates!",
            rating: 5,
            verified: true,
            productImages: [
              "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
            ],
            dp: "https://i.pravatar.cc/150?u=apex",
            helpful: 42
          },
          {
            name: "Yellow Clothing (Sponsorship Lead)",
            date: "1 month ago",
            purchaseDate: "April 2026",
            comment: "Excellent video review quality. Farhan explained our fabric tech and winter jacket line styling perfectly in one of his Tech & Lifestyle integration videos. Deliverables were provided on time with detailed metrics.",
            rating: 4.8,
            verified: true,
            productImages: [
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop"
            ],
            dp: "https://i.pravatar.cc/150?u=yellow",
            helpful: 28
          }
        ];
      case 'creator-sarah':
        return [
          {
            name: "La Mode Bridal & Casuals",
            date: "2 weeks ago",
            purchaseDate: "May 2026",
            comment: "Sarah's reel showcasing our casual cotton kurtis went viral within 48 hours! Her aesthetics match our brand perfectly. Over 3,000 direct store clicks recorded in Bangladesh.",
            rating: 5,
            verified: true,
            productImages: [
              "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop"
            ],
            dp: "https://i.pravatar.cc/150?u=lamode",
            helpful: 55
          },
          {
            name: "Sajgoj Wear (Brand Executive)",
            date: "1 month ago",
            purchaseDate: "March 2026",
            comment: "Super professional and punctual. Sarah created a dedicated skincare and cosmetics lookbook. Excellent lighting, editing, and natural product presentation.",
            rating: 4.7,
            verified: true,
            productImages: [
               "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop"
            ],
            dp: "https://i.pravatar.cc/150?u=sajgoj",
            helpful: 31
          }
        ];
      case 'creator-imtiaz':
        return [
          {
            name: "Dhaka Dine-In Group",
            date: "1 week ago",
            purchaseDate: "June 2026",
            comment: "Imtiaz's spicy vlogging style brought massive foot traffic to our Dhanmondi branch relaunch. The video was deeply engaging, high-energy, and completely worth the budget.",
            rating: 5,
            verified: true,
            productImages: [
               "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop"
            ],
            dp: "https://i.pravatar.cc/150?u=dhakadine",
            helpful: 19
          },
          {
            name: "Secret Recipe BD",
            date: "3 weeks ago",
            purchaseDate: "May 2026",
            comment: "Great enthusiasm and on-time delivery. Imtiaz did an amazing job breaking down our special recipe cheese cakes. Easy to coordinate and very responsive.",
            rating: 4.5,
            verified: true,
            productImages: [
               "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop"
            ],
            dp: "https://i.pravatar.cc/150?u=secretrecipe",
            helpful: 14
          }
        ];
      case 'creator-mily':
        return [
          {
            name: "Sailor Fashion (Marketing Lead)",
            date: "4 days ago",
            purchaseDate: "June 2026",
            comment: "Mily's travel lookbook featuring our summer outfits was exceptionally beautiful. Her cinematography is film-grade. We will definitely work with her again!",
            rating: 5,
            verified: true,
            productImages: [
               "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop"
            ],
            dp: "https://i.pravatar.cc/150?u=sailor",
            helpful: 67
          },
          {
            name: "Cats Eye Lifestyle",
            date: "1 month ago",
            purchaseDate: "April 2026",
            comment: "Highly professional. Mily made sure our casual blazer line was presented with high luxury appeal. Very pleased with the metrics.",
            rating: 4.8,
            verified: true,
            productImages: [
               "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop"
            ],
            dp: "https://i.pravatar.cc/150?u=catseye",
            helpful: 41
          }
        ];
      default:
        return [
          {
            name: "Daraz BD Sponsor Rep",
            date: "2 weeks ago",
            purchaseDate: "May 2026",
            comment: "Excellent collaboration experience. Highly professional and clean delivery parameters. Our click-through rates beat expectations.",
            rating: 4.8,
            verified: true,
            productImages: [
               "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
            ],
            dp: "https://i.pravatar.cc/150?u=daraz",
            helpful: 12
          }
        ];
    }
  };

  const allReviews = getBrandReviewsForCreator(creator.id);
  const filteredReviews = allReviews.filter(r => 
    r.name.toLowerCase().includes(searchFilter.toLowerCase().trim()) ||
    r.comment.toLowerCase().includes(searchFilter.toLowerCase().trim())
  );

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      
      {/* 1. CREATOR HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hero-gradient relative pt-10 pb-12 overflow-hidden border-b border-white/5"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 blur-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-primary rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Global Breadcrumbs in Hero Area */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full mb-6 text-left">
          <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-black uppercase tracking-widest">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} className="text-white/20" />
            <Link to="/creators" className="hover:text-white transition-colors">Creators</Link>
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-white">{creator.name}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
            <div className="flex flex-col lg:grid lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.6fr_1fr] gap-8 xl:gap-12 lg:items-stretch w-full">
              
              {/* Left Side: Creator Profile Details */}
              <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-6 order-1 lg:order-none lg:justify-between lg:h-full">
                 <div className="w-full flex-1 flex flex-col items-center lg:items-start gap-6">
                    {/* Rounded Frame for profile image */}
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white overflow-hidden flex items-center justify-center shadow-2xl border-4 border-white relative shrink-0 mx-auto lg:mx-0 object-cover">
                       <img src={creator.avatar} className="w-full h-full object-cover" alt={creator.name} referrerPolicy="no-referrer" />
                       {localClaimStatus === 'verified' && (
                          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-orange-primary rounded-full flex items-center justify-center text-white border-2 border-[#10133A] shadow-lg">
                             <CheckCircle2 size={13} fill="currentColor" className="text-white stroke-orange-primary" />
                          </div>
                       )}
                    </div>

                    <div className="w-full flex-1 flex flex-col items-center lg:items-start">
                       <div className="flex flex-col sm:flex-row items-center gap-3 mb-2 flex-wrap justify-center lg:justify-start">
                          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter leading-none text-center lg:text-left">{creator.name}</h1>
                          {localClaimStatus === 'verified' && (
                             <div className="bg-[#4DBC15] px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
                                <ShieldCheck size={11} className="text-white" />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest italic whitespace-nowrap">Verified Creator</span>
                             </div>
                          )}
                          {localClaimStatus === 'pending' && (
                             <div className="bg-amber-500 px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
                                <Info size={11} className="text-white" />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest italic whitespace-nowrap animate-pulse">Verification Pending</span>
                             </div>
                          )}
                          {localClaimStatus === 'community' && (
                             <div className="bg-white/10 border border-white/20 px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
                                <Info size={11} className="text-white/60" />
                                <span className="text-[9px] font-black text-white/80 uppercase tracking-widest italic whitespace-nowrap">Community Creator Profile</span>
                             </div>
                          )}
                       </div>
                       
                       <p className="text-[10px] md:text-[11px] font-extrabold text-orange-primary/90 uppercase tracking-[0.2em] mb-3 text-center lg:text-left">
                         {creator.handle} • Best For {creator.bestFor}
                       </p>

                       <p className="text-xs md:text-sm font-medium text-white/70 max-w-md mb-4 text-center lg:text-left leading-relaxed">
                         {creator.bio}
                       </p>

                       <div className="flex items-center gap-4 flex-wrap justify-center lg:justify-start">
                          <div className="flex items-center gap-2">
                             <Heart size={14} className="text-orange-primary fill-current" />
                             <span className="text-white font-extrabold text-[9px] md:text-[10px] uppercase tracking-widest italic whitespace-nowrap">{followersCount} Followers</span>
                          </div>
                          <div className="h-4 w-px bg-white/15 hidden sm:block" />
                          <div className="flex items-center gap-2">
                             <TrendingUp size={14} className="text-green-acc text-green-500" />
                             <span className="text-white font-extrabold text-[9px] md:text-[10px] uppercase tracking-widest italic whitespace-nowrap">Trust Score: {creator.score}/100</span>
                          </div>
                       </div>
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap gap-3.5 justify-center lg:justify-start text-white w-full">
                       
                       {/* Loved CTA */}
                       <button 
                         onClick={() => {
                           const newState = !isLoved;
                           setIsLoved(newState);
                           toast.success(newState ? `Added ${creator.name} to favorites!` : `Removed ${creator.name} from favorites`);
                         }}
                         className={cn(
                           "text-[10px] md:text-[11px] font-black uppercase px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-4.5 rounded-full tracking-wider shadow-xl transition-all transform hover:scale-105 active:scale-95 italic border flex items-center gap-2 cursor-pointer",
                           isLoved 
                             ? "bg-white text-orange-primary border-white shadow-white/5" 
                             : "bg-orange-primary text-white border-orange-primary/30 hover:bg-[#ff5d14]"
                         )}
                       >
                          <Heart size={14} className={cn("transition-colors", isLoved && "fill-current text-orange-primary")} />
                          {isLoved ? "Loved" : "Love Creator"}
                       </button>

                       {/* Follow CTA */}
                       <FollowButton 
                         id={creator.id}
                         name={creator.name}
                         type="creator"
                         className="px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-4.5 rounded-full"
                       />

                       {/* Ask For Branding CTA */}
                        <button 
                          onClick={() => {
                             if (localClaimStatus !== 'verified') {
                                toast.error("Business Tools Locked — Creator must claim this profile to activate campaign briefs.", { duration: 4000 });
                             } else {
                                setIsModalOpen(true);
                             }
                          }}
                          className={cn(
                             "text-[10px] md:text-[11px] font-black uppercase px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-4.5 rounded-full tracking-wider transition-all italic cursor-pointer flex items-center gap-1.5",
                             localClaimStatus !== 'verified'
                               ? "bg-white/5 text-white/45 border border-white/10 cursor-not-allowed opacity-65"
                               : "bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40"
                          )}
                        >
                           {localClaimStatus !== 'verified' ? <Lock size={13} className="text-white/40" /> : <Sparkles size={13} />}
                           Ask For Branding
                           {localClaimStatus !== 'verified' && <span className="text-[7.5px] text-white/40 bg-white/5 border border-white/10 px-1 py-0.5 rounded ml-1 tracking-widest font-mono font-black">LOCKED</span>}
                        </button>

                        {localClaimStatus === 'community' && (
                           <button 
                             onClick={() => {
                                toast.loading("Initiating secure creator identity matching...", { duration: 1500 });
                                setTimeout(() => {
                                   updateCreatorClaimStatus(creator.id, 'pending');
                                   toast.success("Claim submitted successfully! Creator profile status changed to Pending Review.", { duration: 5000 });
                                }, 1500);
                             }}
                             className="text-[10px] md:text-[11px] font-black uppercase px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-4.5 rounded-full tracking-wider shadow-xl transition-all transform hover:scale-105 active:scale-95 italic border cursor-pointer bg-white text-navy border-white hover:bg-gray-100 flex items-center gap-1.5"
                           >
                              <ShieldCheck size={14} className="shrink-0" />
                              <span>Claim Profile</span>
                           </button>
                        )}

                        {localClaimStatus === 'pending' && (
                           <div className="text-[10px] md:text-[11px] font-black uppercase px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-4.5 rounded-full tracking-wider shadow-md bg-amber-500 text-white border border-amber-500/35 italic flex items-center gap-1.5 select-none hover:cursor-default">
                              <Clock size={14} className="shrink-0" />
                              <span>Verification Pending</span>
                           </div>
                        )}
                    </div>
                 </div>

                  {/* Find Us On Indicators */}
                  <div className="hidden lg:flex items-center gap-4 mt-2 flex-wrap justify-start">
                     <span className="text-white text-[10px] font-black uppercase tracking-widest border-b-2 border-orange-primary pb-1 italic">Find Us On</span>
                     <div className="flex items-center gap-5">
                        {creator.platforms.map(platform => {
                           let platformUrl = "#";
                           let iconComp = <Youtube size={20} />;
                           
                           if (platform === 'YouTube') {
                              iconComp = <Youtube size={20} />;
                           } else if (platform === 'Instagram') {
                              iconComp = <Instagram size={20} />;
                           } else if (platform === 'Facebook') {
                              iconComp = <Facebook size={20} />;
                           } else if (platform === 'TikTok') {
                              iconComp = <TikTokIcon size={20} />;
                           }

                           return (
                             <a key={platform} href={platformUrl} className="group flex flex-col items-center gap-1.5 focus:outline-none">
                                <div className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95 shadow-md">
                                  {iconComp}
                                </div>
                                <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">{platform}</span>
                             </a>
                           );
                        })}
                     </div>
                  </div>
              </div>

              {/* Right Side: Trust scoring scorecard card */}
              <div className="w-full lg:w-full max-w-md relative order-3 lg:order-none lg:flex lg:flex-col lg:justify-between lg:h-full">
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white relative overflow-hidden group mb-auto text-left">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-primary/10 blur-2xl rounded-full translate-x-1/3 -translate-y-1/3" />
                    
                    <div className="flex justify-between items-start mb-6">
                       <div>
                          <div className="text-[9px] font-black uppercase text-[#4DBC15] tracking-widest mb-0.5">Trust Score</div>
                          <div className="text-5xl font-black italic">{rating} <span className="text-xl text-white/55">/5</span></div>
                       </div>
                       <div className="text-right">
                          <div className="flex gap-0.5 justify-end mb-1">
                             {[1, 2, 3, 4, 5].map(i => (
                               <Star key={i} size={13} className={cn("fill-orange-primary text-orange-primary", i > Math.floor(rating) && "text-white/20 fill-white/20")} />
                             ))}
                          </div>
                          <div className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Based on {reviewsCount}+ Deliveries</div>
                       </div>
                    </div>

                    <div className="space-y-3.5 mb-6">
                       {[
                          { label: "Reach", value: creator.score - 5, color: "bg-orange-primary" },
                          { label: "Alignment", value: creator.score + 2 > 100 ? 100 : creator.score + 2, color: "bg-[#4DBC15]" },
                          { label: "Engagement", value: creator.score - 8, color: "bg-orange-primary" },
                          { label: "Quality", value: creator.score + 4 > 100 ? 100 : creator.score + 4, color: "bg-[#4DBC15]" },
                          { label: "Conversion", value: creator.score - 2, color: "bg-[#4DBC15]" }
                       ].map((m, i) => (
                          <div key={i} className="flex items-center gap-3">
                             <div className="w-16 text-[9px] font-bold uppercase tracking-wider text-white/60">{m.label}</div>
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

                    <div className="flex items-center justify-between pt-5 border-t border-white/10">
                       <div className="text-center w-full">
                          <div className="text-4xl font-black text-[#50DC17] leading-none mb-1">{creator.score}%</div>
                          <div className="text-[9px] font-black text-white/50 uppercase tracking-widest">Trust Recommendation Ratio</div>
                       </div>
                    </div>
                 </div>

                 {/* Save / share bookmarks */}
                 <div className="absolute lg:relative -bottom-6 lg:bottom-auto right-4 lg:right-auto flex items-center lg:justify-end gap-3 z-20 mt-4 lg:mt-0 lg:pt-2.5">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Profile link copied to clipboard!");
                      }}
                      className="w-11 h-11 rounded-full bg-white text-navy shadow-xl border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-gray-100"
                    >
                       <Share2 size={16} />
                    </button>
                    <button 
                      onClick={() => toast.success(`${creator.name} added to your bookmarks!`)}
                      className="w-11 h-11 rounded-full bg-white text-navy shadow-xl border border-gray-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer hover:bg-gray-100"
                    >
                       <Bookmark size={15} />
                    </button>
                 </div>
              </div>

                {/* Mobile platform Find Us On indicators */}
                <div className="flex lg:hidden items-center gap-3 sm:gap-4 mt-8 flex-wrap justify-center order-5 w-full">
                   <span className="text-white text-[10px] font-black uppercase tracking-widest border-b-2 border-orange-primary pb-1 italic">Find Us On</span>
                   <div className="flex items-center gap-3.5 sm:gap-5 justify-center flex-wrap">
                     {creator.platforms.map(platform => (
                       <a key={platform} href="#" className="group flex flex-col items-center gap-1.5 focus:outline-none">
                          <div className="w-9.5 h-9.5 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95 shadow-md">
                            {platform === 'YouTube' && <Youtube size={18} />}
                            {platform === 'Instagram' && <Instagram size={18} />}
                            {platform === 'Facebook' && <Facebook size={18} />}
                            {platform === 'TikTok' && <TikTokIcon size={18} />}
                          </div>
                          <span className="text-[11px] sm:text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">{platform}</span>
                       </a>
                     ))}
                   </div>
                </div>

            </div>
        </div>
      </motion.section>

      {/* 2. SECTION SUMMARY BAR */}
      <div className="w-full hero-gradient text-white py-4.5 border-y border-white/5 font-space font-black italic uppercase tracking-[0.2em] text-[11px] md:text-xs">
         <div className="max-w-[1440px] mx-auto px-6 flex flex-wrap justify-center sm:justify-around items-center gap-y-4 gap-x-12 text-center">
            <div className="flex items-center gap-2">
               <span className="text-orange-primary text-lg font-space font-black">▶</span>
               <span>{creator.videos.length} YouTube Videos</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
               <span className="text-orange-primary text-lg font-space font-black">✦</span>
               <span>{creator.reels.length} Reels & Shorts</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
               <span className="text-orange-primary text-lg font-space font-black">✍</span>
               <span>{creator.blogs.length} Case Blogs</span>
            </div>
         </div>
      </div>

      <StickySectionNav
        sections={creatorSectionNavItems}
        activeId={activeSectionId}
        onNavigate={scrollToSection}
        allLabel="Creator"
        profileLabel="Creator profile"
      />

      {/* 4. UNIFIED SCROLLABLE BODY WRAPPER */}
      <div className="max-w-[1440px] mx-auto px-4 py-5 w-full">
         <div className={`${DETAIL_SINGLE_FEED}`}>
            <main className="w-full pb-10 space-y-16">
               
               {/* Search Active Notification indicator */}
               {searchFilter && (
                  <div className="bg-white border border-[#e8edf2] rounded-[5px] p-4 text-xs font-bold text-navy flex items-center justify-between">
                     <span>Filtered content matching &ldquo;{searchFilter}&rdquo;</span>
                     <button 
                       onClick={() => {setSearchFilter(''); setCurrentSearchInput('');}}
                       className="text-orange-primary hover:underline uppercase text-[10px] font-black border-0 bg-transparent cursor-pointer"
                     >
                       Reset filters
                     </button>
                  </div>
               )}

               {/* Dedicated Section 1: YouTube Videos */}
               <section id="videos-section" className="scroll-mt-44 text-left">
                  <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
                     <h3 className="text-lg md:text-xl font-black uppercase tracking-tight italic text-navy flex items-center gap-2 leading-none">
                        <Youtube className="text-red-650 text-[#FF0000]" size={20} /> Featured YouTube Videos
                     </h3>
                     <span className="text-[9px] text-[#8a9bb0] font-bold uppercase tracking-widest">Landscape Row</span>
                  </div>

                  {filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredVideos.map(video => {
                        const isGuide = !!video.associatedGuideId;
                        const cardContent = (
                          <div className="bg-white border border-[#e8edf2] rounded-[5px] overflow-hidden group hover:border-[#E8500A]/35 transition-all shadow-sm relative h-full flex flex-col">
                            <div className="relative aspect-video bg-black overflow-hidden select-none">
                              <img 
                                src={video.thumbnail} 
                                alt={video.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              
                              {/* Content Type Badge */}
                              {isGuide ? (
                                <div className="absolute top-3 left-3 z-10 bg-[#E8500A] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-[6px] shadow-sm flex items-center gap-1.5 border border-white/10">
                                  <Award size={10} className="stroke-[2.5]" /> Full Guide
                                </div>
                              ) : (
                                <div className="absolute top-3 left-3 z-10 bg-black/75 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-[6px] shadow-sm flex items-center gap-1.5 border border-white/10">
                                  <Video size={10} className="stroke-[2.5]" /> Video
                                </div>
                              )}

                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                  <Play size={16} className="fill-white stroke-none ml-0.5" />
                                </div>
                              </div>
                              <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider text-white">
                                {video.duration}
                              </span>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <h4 className="text-xs md:text-sm font-extrabold text-navy line-clamp-2 leading-snug group-hover:text-orange-primary transition-colors mb-2 italic">
                                {video.title}
                              </h4>
                              <span className="text-[10px] font-mono text-gray-500">{video.views}</span>
                            </div>
                          </div>
                        );

                        if (isGuide) {
                          return (
                            <Link key={video.id} to={`/guides/${video.associatedGuideId}`} className="block h-full cursor-pointer">
                              {cardContent}
                            </Link>
                          );
                        } else {
                          return (
                            <button key={video.id} type="button" onClick={() => openVideo(video.url, video.title, false)} className="block w-full text-left focus:outline-none h-full cursor-pointer">
                              {cardContent}
                            </button>
                          );
                        }
                      })}
                    </div>
                  ) : (
                     <div className="py-12 bg-white rounded-[5px] border border-[#e8edf2] text-center text-gray-500 text-xs font-black uppercase tracking-wider">
                        No videos matched search phrase.
                     </div>
                  )}
               </section>

               {/* Dedicated Section 2: Shorts & Reels */}
               <section id="reels-section" className="scroll-mt-44 text-left">
                  <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
                     <h3 className="text-lg md:text-xl font-black uppercase tracking-tight italic text-navy flex items-center gap-2 leading-none">
                        <Instagram className="text-pink-650 text-[#C13584]" size={20} /> Influencer Reels & Shorts
                     </h3>
                     <span className="text-[9px] text-[#8a9bb0] font-bold uppercase tracking-widest">Vertical Grid</span>
                  </div>

                  {filteredReels.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredReels.map(reel => {
                        const isGuide = !!reel.associatedGuideId;
                        const cardContent = (
                          <div className="bg-white border border-[#e8edf2] rounded-[5px] overflow-hidden group hover:border-[#E8500A]/35 transition-all shadow-sm relative h-full flex flex-col">
                            <div className="relative aspect-[9/16] bg-black overflow-hidden select-none">
                              <img 
                                src={reel.thumbnail} 
                                alt={reel.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all" />
                              
                              {/* Content Type Badge */}
                              {isGuide ? (
                                <div className="absolute top-3 left-3 z-10 bg-[#E8500A] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-[6px] shadow-sm flex items-center gap-1.5 border border-white/10">
                                  <Award size={10} className="stroke-[2.5]" /> Full Guide
                                </div>
                              ) : (
                                <div className="absolute top-3 left-3 z-10 bg-[#C13584] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-[6px] shadow-sm flex items-center gap-1.5 border border-white/10">
                                  <Play size={10} className="stroke-[2.5]" /> Reel
                                </div>
                              )}

                              <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                                <span className="text-[9px] font-mono font-extrabold bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-white">
                                  {reel.views}
                                </span>
                                <span className="text-[9px] font-mono font-extrabold bg-[#C13584] px-1.5 py-0.5 rounded text-white flex items-center gap-0.5">
                                  ♥ {reel.likes}
                                </span>
                              </div>

                              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                <Video size={10} className="stroke-[2.5]" />
                              </div>
                            </div>

                            <div className="p-3 flex-1 flex flex-col justify-between">
                              <p className="text-[11px] font-black text-gray-800 line-clamp-2 leading-relaxed italic">
                                {reel.title}
                              </p>
                            </div>
                          </div>
                        );

                        if (isGuide) {
                          return (
                            <Link key={reel.id} to={`/guides/${reel.associatedGuideId}`} className="block h-full cursor-pointer focus:outline-none">
                              {cardContent}
                            </Link>
                          );
                        } else {
                          return (
                            <button key={reel.id} type="button" onClick={() => openVideo(reel.url, reel.title, true)} className="block w-full text-left focus:outline-none h-full cursor-pointer">
                              {cardContent}
                            </button>
                          );
                        }
                      })}
                    </div>
                  ) : (
                    <div className="py-12 bg-white rounded-[5px] border border-[#e8edf2] text-center text-gray-500 text-xs font-black uppercase tracking-wider">
                       No shorts/reels matched search phrase.
                    </div>
                  )}
               </section>

               {/* Dedicated Section 3: Insights & Case Blogs */}
               <section id="blogs-section" className="scroll-mt-44 text-left">
                  <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-200">
                     <h3 className="text-lg md:text-xl font-black uppercase tracking-tight italic text-navy flex items-center gap-2 leading-none">
                        <BookOpen className="text-orange-primary" size={20} /> Research Blogs & Case Essays
                     </h3>
                     <span className="text-[9px] text-[#8a9bb0] font-bold uppercase tracking-widest">Separate Section</span>
                  </div>

                  {filteredBlogs.length > 0 ? (
                    <div className="space-y-4">
                      {filteredBlogs.map(blog => {
                        const isGuide = !!blog.associatedGuideId;
                        return (
                          <div key={blog.id} className="bg-white border border-[#e8edf2] rounded-[5px] p-5 hover:border-orange-primary/10 transition-colors flex flex-col md:flex-row gap-6 shadow-sm relative overflow-hidden">
                            {/* Visual Indicator Badge */}
                            <div className="absolute top-4 right-4 z-10">
                              {isGuide ? (
                                <span className="bg-[#E8500A] text-white text-[8.5px] font-black uppercase tracking-widest px-2.5 py-1 rounded-[6px] border border-[#E8500A]/10 shadow-xs">
                                  Full Guide
                                </span>
                              ) : (
                                <span className="bg-gray-50 text-gray-500 text-[8.5px] font-black uppercase tracking-widest px-2.5 py-1 rounded-[6px] border border-gray-200">
                                  Article
                                </span>
                              )}
                            </div>

                            {blog.thumbnail && (
                              <div className="w-full md:w-48 h-32 rounded-[5px] overflow-hidden shrink-0 bg-gray-55 relative object-cover">
                                <img 
                                  src={blog.thumbnail} 
                                  alt={blog.title} 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}

                            <div className="flex-1 flex flex-col justify-center">
                              <div className="flex items-center gap-4 text-[9px] font-mono font-bold text-gray-500 uppercase mb-2">
                                <span className="flex items-center gap-1"><Clock size={10} /> {blog.readTime}</span>
                                <span>•</span>
                                <span>{blog.date}</span>
                              </div>
                              
                              {isGuide ? (
                                <Link to={`/guides/${blog.associatedGuideId}`}>
                                  <h4 className="text-base md:text-lg font-extrabold text-[#10133A] hover:text-orange-primary transition-colors tracking-tight mb-2 italic">
                                    {blog.title}
                                  </h4>
                                </Link>
                              ) : (
                                <a href={blog.url && blog.url !== '#' ? blog.url : "https://medium.com"} target="_blank" rel="noopener noreferrer">
                                  <h4 className="text-base md:text-lg font-extrabold text-[#10133A] hover:text-orange-primary transition-colors tracking-tight mb-2 italic">
                                    {blog.title}
                                  </h4>
                                </a>
                              )}

                              <p className="text-xs text-gray-400 font-semibold leading-relaxed mb-4">
                                {blog.excerpt}
                              </p>

                              {isGuide ? (
                                <Link to={`/guides/${blog.associatedGuideId}`} className="text-[10px] font-black uppercase tracking-widest text-[#E8500A] hover:underline inline-flex items-center gap-1">
                                  Read Guide <ChevronRight size={10} />
                                </Link>
                              ) : (
                                <a href={blog.url && blog.url !== '#' ? blog.url : "https://medium.com"} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:underline inline-flex items-center gap-1">
                                  Read Article <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 bg-white rounded-[5px] border border-[#e8edf2] text-center text-gray-500 text-xs font-black uppercase tracking-wider">
                       No insights matched search phrase.
                    </div>
                  )}
               </section>

            </main>

         {/* SECTION 5 — BRAND REVIEWS */}
         <div id="brand-reviews-section" className="scroll-mt-36 w-full bg-white rounded-[5px] p-6 md:p-8 shadow-sm border border-gray-100/80 text-left">
            <div className="text-center mb-8 border-b border-gray-100 pb-5">
               <h3 className="text-xl md:text-2xl font-black text-[#1A1D4E] tracking-tight uppercase mb-2">
                  Brand Reviews
               </h3>
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 w-fit mx-auto">
                  Verified Brand Collaboration Experiences & Feedback
               </p>
            </div>

            {filteredReviews.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {filteredReviews.map((review, i) => (
                     <PublicReviewCard
                        key={i}
                        review={review}
                        onHelpfulClick={() => toast.success("Marked as helpful!")}
                     />
                  ))}
               </div>
            ) : (
               <div className="py-12 bg-white rounded-[5px] border border-gray-100 text-center text-gray-400 text-xs font-black uppercase tracking-wider">
                  No brand reviews matched search phrase.
               </div>
            )}

            <div className="mt-8 flex justify-center">
               <button 
                  onClick={() => toast.success("All verified brand reviews are synchronized and loaded.")} 
                  className="px-10 py-3.5 border border-[#1A1D4E] text-[#1A1D4E] hover:bg-[#1A1D4E] hover:text-white transition-all text-[9.5px] font-black uppercase tracking-widest rounded-full italic cursor-pointer bg-white"
               >
                  Load More Reviews
               </button>
            </div>
         </div>

         {/* SECTION 6 — CREATOR OVERVIEW */}
         <div id="creator-overview-section" className="bg-white rounded-[5px] p-6 md:p-8 border border-gray-100 shadow-sm scroll-mt-36 text-left">
            <div className="text-center mb-8 border-b border-gray-100 pb-5">
               <h3 className="text-2xl font-black text-[#1A1D4E] tracking-tight uppercase mb-1">
                  Creator Overview
               </h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic font-mono bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 w-fit mx-auto">
                  Detailed overview of this creator
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
               {/* 1. About & Connections */}
               <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 flex flex-col justify-between group hover:shadow-md transition-shadow">
                  <div>
                     <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                           <Award size={16} className="text-[#E8500A]" />
                        </div>
                        <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Background & Bio</h4>
                     </div>
                     <div className="text-xs text-gray-500 font-semibold leading-relaxed space-y-2 text-left">
                        <p className="italic">"{creator.bio}"</p>
                        <div className="pt-2">
                           <span className="text-[#E8500A] font-black">SUPPORTED PLATFORMS:</span>{' '}
                           <span className="text-[#1A1D4E] uppercase font-black">{creator.platforms.join(', ')}</span>
                        </div>
                     </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/50">
                     <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); toast.success('Redirecting to primary video channel...'); }} 
                        className="text-[10px] font-black text-[#E8500A] uppercase tracking-wider hover:underline flex items-center gap-1"
                     >
                        Visit Primary Channel <span>➜</span>
                     </a>
                  </div>
               </div>

               {/* 2. Collaboration Preferences */}
               <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                     <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                           <Mail size={16} className="text-[#E8500A]" />
                        </div>
                        <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Collaboration Contacts</h4>
                     </div>
                     <div className="text-xs text-gray-500 font-semibold leading-relaxed space-y-3 text-left">
                        <p className="flex items-center gap-2 truncate"><span className="text-[#1A1D4E] font-black">EMAIL:</span> <span className="font-mono">{creator.email}</span></p>
                        <p className="flex items-center gap-2 truncate"><span className="text-[#1A1D4E] font-black">PHONE:</span> <span className="font-mono">{creator.phone}</span></p>
                        <p className="flex items-center gap-2"><span className="text-[#1A1D4E] font-black">RESPONSE:</span> 24-48 Hours</p>
                     </div>
                  </div>
               </div>

               {/* 3. Audience Profile */}
               <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                     <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                           <Users size={16} className="text-[#E8500A]" />
                        </div>
                        <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Audience & Reach</h4>
                     </div>
                     <div className="text-xs text-gray-500 font-semibold leading-relaxed space-y-2 text-left">
                        <p><span className="text-[#1A1D4E] font-black">REACH:</span> <span className="font-black text-[#E8500A]">{followersCount}</span></p>
                        <p className="uppercase"><span className="text-[#1A1D4E] font-black">DEMOGRAPHICS:</span> 18-34 Years (74%)</p>
                        <p className="uppercase text-[#E8500A]"><span className="text-[#1A1D4E] font-black">TOP FEED:</span> Bangladesh Market</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
               {/* 4. Specialties & Format */}
               <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2.5 mb-4 border-b border-gray-200/50 pb-3">
                     <div className="w-8 h-8 rounded-xl bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                        <Sparkles size={16} className="text-[#E8500A]" />
                     </div>
                     <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Formats & Specializations</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                     {[
                        "Dedicated Sponsorship Video",
                        "Sponsorship Shoutout / Placement",
                        "Short Form Reels & Videos",
                        "Social Media Photo Feature",
                        "Creator Consultation Panel",
                        "Niche Affiliate Marketing"
                     ].map((srv, idx) => (
                        <div key={idx} className="text-[10px] text-gray-600 font-bold uppercase tracking-wide flex items-start gap-2">
                           <span className="text-[#E8500A] text-xs leading-none">•</span>
                           <span>{srv}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* 5. Best For #Tags */}
               <div className="bg-gray-50 rounded-[5px] p-6 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2.5 mb-4 border-b border-gray-200/50 pb-3">
                     <div className="w-8 h-8 rounded-xl bg-[#E8500A]/10 text-[#E8500A] flex items-center justify-center">
                        <Flame size={16} className="text-[#E8500A]" />
                     </div>
                     <h4 className="text-xs font-black text-[#1A1D4E] uppercase tracking-wider">Hashtags & Focus Topics</h4>
                  </div>
                  <div className="flex flex-wrap gap-2 text-left">
                     {[`#${creator.bestFor}BD`, ...creator.bestForTags.map(tag => `#${tag.replace(/\s+/g, '')}`), '#DhakaCreators', '#BrandingBD'].map((tag, idx) => (
                        <span key={idx} className="text-[9px] font-black text-[#E8500A] bg-[#FFF0E8] px-3 py-1.5 rounded-full uppercase tracking-wider border border-[#E8500A]/5 select-none hover:scale-105 transition-all duration-100">
                           {tag}
                        </span>
                     ))}
                  </div>
               </div>
            </div>

            {/* Dynamic Claiming Experience Integration */}
            {localClaimStatus === 'community' && (
               <div className="mt-8 p-6 bg-gradient-to-r from-orange-55 to-amber-50 rounded-[5px] border-2 border-orange-200 shadow-xs flex flex-col md:flex-row items-center gap-6 animate-fade-in text-left">
                  <div className="w-12 h-12 rounded-full bg-orange-primary/10 flex items-center justify-center shrink-0 font-bold text-orange-primary">
                     <Sparkles className="w-5 h-5 text-orange-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-orange-100 text-orange-800">
                        Community Creator Profile
                     </span>
                     <h4 className="text-sm font-black text-navy uppercase tracking-tight leading-none mb-1">Claim Your Creator Profile</h4>
                     <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                        This creator profile contains publicly available information and platform-curated content. This profile has not yet been claimed by the creator.
                     </p>
                     
                     {/* Benefits Section */}
                     <div className="pt-2">
                        <p className="text-[10px] font-black text-navy uppercase tracking-widest mb-2">Claim your profile to:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                           <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                              <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                              <span>Manage creator information & bio</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                              <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                              <span>Showcase verified social content & reels</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                              <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                              <span>Collaborate directly with brands</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                              <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                              <span>Receive official campaign invitations</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold sm:col-span-2">
                              <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                              <span>Access exhaustive audience & creator analytics</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="shrink-0 w-full md:w-auto self-stretch flex items-center justify-center">
                     <button 
                        onClick={() => {
                           toast.loading("Initiating secure creator registration link...", { duration: 1500 });
                           setTimeout(() => {
                              updateCreatorClaimStatus(creator.id, 'pending'); toast.success("Verification link generated! Ready for social credential matching review.");
                           }, 1500);
                        }}
                        className="w-full md:w-auto px-6 py-3.5 bg-orange-primary hover:bg-[#ff5d14] text-white font-black uppercase text-[10px] tracking-widest italic rounded-full shadow-lg hover:shadow-orange-primary/20 active:scale-95 transition-all text-center cursor-pointer border-none"
                     >
                        Claim Creator Profile
                     </button>
                  </div>
               </div>
            )}

            {localClaimStatus === 'pending' && (
               <div className="mt-8 p-6 bg-amber-50 rounded-[5px] border-2 border-amber-200 shadow-xs flex items-center gap-4 animate-fade-in text-left">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                     <Clock className="w-5 h-5 text-amber-700 animate-pulse" />
                  </div>
                  <div className="flex-1">
                     <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 mb-1">
                        Ownership Verification Pending
                     </span>
                     <h4 className="text-sm font-black text-navy uppercase tracking-tight leading-none mb-1">Claim Review Underway</h4>
                     <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                        Our moderators are actively reviewing your submitted credentials against this creator's public profile link. Expected completion in 12-24 hours.
                     </p>
                  </div>
               </div>
            )}
         </div>

         </div>
      </div>

      {/* =======================================================
          OUTREACH STRUCTURAL BRIEF WINDOW DIALOG SYSTEM
          ======================================================= */}
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
                   <FileText className="text-orange-primary" size={16} />
                   <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
                     Request Collaboration
                   </h3>
                 </div>
                 <button 
                   onClick={resetFormAndModal}
                   className="text-gray-400 hover:text-white text-xs font-bold font-mono tracking-widest uppercase transition-colors cursor-pointer border-0 bg-transparent"
                 >
                   [Dismiss]
                 </button>
               </div>

               {/* Modal Core Area */}
               <div className="p-6 overflow-y-auto max-h-[80vh] text-left">
                 
                 {!submitSuccess ? (
                   // Campaign Proposing Structured Form
                   <form onSubmit={handleFormSubmit} className="space-y-5">
                     
                     {/* Asset name */}
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
                         className="w-full px-4 py-2.5 bg-[#030310] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-primary"
                       />
                       <span className="text-[8px] text-gray-500 mt-1 block">What product or asset category are you promoting?</span>
                     </div>

                     {/* Collab Format Type */}
                     <div>
                       <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                         2. Campaign Format Type *
                       </label>
                       <select
                         value={collabType}
                         onChange={(e) => setCollabType(e.target.value)}
                         className="w-full px-4 py-2.5 bg-[#030310] border border-white/10 rounded-xl text-xs text-white outline-none focus:border-orange-primary appearance-none cursor-pointer"
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
                         placeholder="Explain the review scope, delivery format (e.g. a dedicated video feature vs organic Instagram short), and core product highlights..."
                         className="w-full px-4 py-2.5 bg-[#030310] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-primary resize-none"
                       />
                       <span className="text-[8px] text-gray-500 mt-1 block">Detailed requirements description for this creator.</span>
                     </div>

                     {/* Optional budget range details */}
                     <div>
                       <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                         4. Estimated Campaign Budget (Optional)
                       </label>
                       <input
                         type="text"
                         value={budgetRange}
                         onChange={(e) => setBudgetRange(e.target.value)}
                         placeholder="e.g. BDT 30,000 - 50,000"
                         className="w-full px-4 py-2.5 bg-[#030310] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-orange-primary"
                       />
                     </div>

                     {/* Contact detail callbacks */}
                     <div className="border-t border-white/5 pt-4 space-y-4">
                       <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
                         5. Optional Callback Channels
                       </span>
                       
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-[8px] font-bold text-gray-450 uppercase mb-1">Email</label>
                           <input
                             type="email"
                             value={contactEmail}
                             onChange={(e) => setContactEmail(e.target.value)}
                             placeholder="marketing@acme.com"
                             className="w-full px-3 py-2 bg-[#030310] border border-white/10 rounded-lg text-xs text-white placeholder-gray-600 outline-none focus:border-orange-primary"
                           />
                         </div>

                         <div>
                           <label className="block text-[8px] font-bold text-gray-450 uppercase mb-1">Phone Number</label>
                           <input
                             type="tel"
                             value={contactPhone}
                             onChange={(e) => setContactPhone(e.target.value)}
                             placeholder="+880 17..."
                             className="w-full px-3 py-2 bg-[#030310] border border-white/10 rounded-lg text-xs text-white placeholder-gray-600 outline-none focus:border-orange-primary"
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
                         className="px-5 py-2.5 rounded-lg bg-orange-primary hover:bg-[#CF4400] text-white text-[9px] font-black uppercase tracking-widest italic flex items-center gap-1.5 shadow-md cursor-pointer border-0"
                       >
                         Submit Briefing <Send size={11} />
                       </button>
                     </div>

                   </form>
                 ) : (
                   // Campaign proposed successful outcome screen
                   <div className="space-y-6">
                     
                     <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-3">
                       <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={16} />
                       <div>
                         <h4 className="text-xs font-black uppercase tracking-wider text-green-500">Request Dispatched To {creator.name}</h4>
                         <p className="text-[10px] text-gray-400 leading-relaxed mt-1 uppercase">
                           Structured briefing parameters have been saved under trust benchmarks. The digital curator will review the payload parameters and direct replies to provided contact points.
                         </p>
                       </div>
                     </div>

                     {/* Structured brief summaries */}
                     <div className="bg-[#030310] border border-white/10 rounded-xl p-5 select-text relative">
                       <div className="absolute top-3 right-3 px-2 py-0.5 bg-white/5 rounded text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                         DISPATCH BRIEFING payload
                       </div>
                       
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-primary mb-4 pb-2 border-b border-white/5">
                         Collab Proposal Summary
                       </h4>

                       <div className="space-y-3.5 text-xs">
                         <div>
                           <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block">Target Asset Name</span>
                           <span className="font-semibold text-white">{productDetails}</span>
                         </div>

                         <div>
                           <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block">Selected Campaign Format</span>
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
                             <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block">Estimations Budget limit</span>
                             <span className="font-semibold text-white">{budgetRange}</span>
                           </div>
                         )}

                         {(contactEmail || contactPhone) && (
                           <div className="border-t border-white/5 pt-3 mt-3">
                             <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Return Channels</span>
                             <div className="flex flex-wrap gap-2">
                               {contactEmail && (
                                 <span className="bg-white/5 text-[10px] font-mono px-2 py-0.5 rounded text-gray-300 border border-white/5">
                                   Email: {contactEmail}
                                 </span>
                               )}
                               {contactPhone && (
                                 <span className="bg-white/5 text-[10px] font-mono px-2 py-0.5 rounded text-gray-300 border border-white/5">
                                   Tel: {contactPhone}
                                 </span>
                               )}
                             </div>
                           </div>
                         )}
                       </div>
                     </div>

                     <div className="flex justify-end pt-2">
                       <button
                         onClick={resetFormAndModal}
                         className="px-6 py-2.5 rounded-full bg-white text-navy focus:bg-gray-100 text-[10px] font-black uppercase tracking-widest italic cursor-pointer transition-all border-0"
                       >
                         [Dismiss Preview Screen]
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
