import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Send, FileText, CheckCircle2, 
  Sparkles, Clock, Lock
} from 'lucide-react';
import { CREATORS } from '../data/creators';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';
import { ClaimProfileModal } from '../components/ClaimProfileModal';
import { CreatorProfileHero } from '../components/creator/CreatorProfileHero';
import { CreatorOverviewFeed } from '../components/creator/CreatorOverviewFeed';
import {
  CreatorVideosTab,
  CreatorGuidesTab,
  CreatorReviewsTab,
  getCreatorReviewDemo,
} from '../components/creator/CreatorProfileTabFeeds';
import { useRegisterPageFilters } from '../components/FilterEngine';

type CreatorProfileTab =
  | 'Overview'
  | 'Guides'
  | 'Videos'
  | 'Reviews'
  | 'Collections'
  | 'Deals'
  | 'About';

export function CreatorProfilePage() {
  const creatorHeroRef = useRef<HTMLDivElement>(null);
  const { id } = useParams<{ id: string }>();
  const { openVideo, getCreatorClaimStatus, updateCreatorClaimStatus, creatorClaimStatuses } = useGlobalState();

  // Find creator or fallback safely to first creator
  const creator = CREATORS.find(c => c.id === id) || CREATORS[0];
  const [profileTab, setProfileTab] = useState<CreatorProfileTab>('Overview');

  useRegisterPageFilters({
    pageName: creator ? creator.name : 'Creator Profile',
    renderSearch: null,
    sectionNav: null,
    quickFilters: [
      { id: 'overview', label: 'Overview', active: profileTab === 'Overview', onClick: () => setProfileTab('Overview') },
      { id: 'videos', label: 'Videos', active: profileTab === 'Videos', onClick: () => setProfileTab('Videos') },
      { id: 'reviews', label: 'Reviews', active: profileTab === 'Reviews', onClick: () => setProfileTab('Reviews') },
    ],
    renderFilters: null,
    activeFilterCount: 0,
    onClearAll: null
  }, [creator, profileTab]);

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

  const reviewDemo = getCreatorReviewDemo(creator);

  return (
    <div className="flex flex-col min-h-screen bg-choosify-feed">
      
      {/* 1. CREATOR HERO SECTION — Choosify.dc.html */}
      <div ref={creatorHeroRef}>
        <CreatorProfileHero
          creator={creator}
          claimStatus={localClaimStatus}
          trustScore={rating}
          reviewCountLabel={`${reviewsCount}+ deliveries`}
          onShare={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Profile link copied to clipboard!');
          }}
          onMessage={() => {
            if (localClaimStatus !== 'verified') {
              toast.error('Business Tools Locked — Creator must claim this profile to activate campaign briefs.', { duration: 4000 });
            } else {
              setIsModalOpen(true);
            }
          }}
          onClaim={() => {
            toast.loading('Initiating secure creator identity matching...', { duration: 1500 });
            setTimeout(() => {
              updateCreatorClaimStatus(creator.id, 'pending');
              toast.success('Claim submitted successfully! Creator profile status changed to Pending Review.', { duration: 5000 });
            }, 1500);
          }}
          facts={[
            { icon: '📹', label: 'Videos', value: String(creator.videos?.length ?? 0) },
            { icon: '✦', label: 'Reels', value: String(creator.reels?.length ?? 0) },
            { icon: '✍', label: 'Blogs', value: String(creator.blogs?.length ?? 0) },
            { icon: '♥', label: 'Followers', value: String(followersCount).replace(' Base', '') },
            { icon: '★', label: 'Reviews', value: String(reviewsCount) },
            { icon: '🏷', label: 'Best for', value: String(creator.bestFor || 'Tech') },
          ]}
          extraActions={
            <>
              <button
                type="button"
                onClick={() => {
                  const newState = !isLoved;
                  setIsLoved(newState);
                  toast.success(newState ? `Added ${creator.name} to favorites!` : `Removed ${creator.name} from favorites`);
                }}
                className={
                  isLoved
                    ? 'inline-flex items-center gap-1.5 bg-[#FF000D] text-white border border-[#FF000D] px-[18px] py-2.5 rounded-lg text-xs font-bold'
                    : 'inline-flex items-center gap-1.5 bg-white text-[#1A1A2E] border border-[#E5E7EB] px-[18px] py-2.5 rounded-lg text-xs font-semibold hover:bg-[#F4F7F9]'
                }
              >
                <Heart size={13} className={isLoved ? 'fill-current' : ''} />
                {isLoved ? 'Loved' : 'Love'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (localClaimStatus !== 'verified') {
                    toast.error('Business Tools Locked — Creator must claim this profile to activate campaign briefs.', { duration: 4000 });
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className={
                  localClaimStatus !== 'verified'
                    ? 'inline-flex items-center gap-1.5 bg-[#F4F7F9] text-[#9AA0AC] border border-[#E8EDF2] px-[18px] py-2.5 rounded-lg text-xs font-semibold cursor-not-allowed opacity-80'
                    : 'inline-flex items-center gap-1.5 bg-white text-[#1A1A2E] border border-[#E5E7EB] px-[18px] py-2.5 rounded-lg text-xs font-semibold hover:bg-[#F4F7F9]'
                }
              >
                {localClaimStatus !== 'verified' ? <Lock size={13} /> : <Sparkles size={13} />}
                Ask For Branding
              </button>
              {localClaimStatus === 'pending' && (
                <div className="inline-flex items-center gap-1.5 bg-[#FF000D] text-white border border-[#FF000D] px-[18px] py-2.5 rounded-lg text-xs font-bold">
                  <Clock size={13} /> Verification Pending
                </div>
              )}
            </>
          }
        />
      </div>

      {/* Profile tabs — Choosify.dc.html green underline */}
      <div className="sticky z-40 w-full bg-choosify-feed border-b border-[#E8EDF2] choosify-sticky-section-nav">
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 flex gap-7 overflow-x-auto">
          {(
            [
              { id: 'Overview' as const, count: '' },
              { id: 'Guides' as const, count: String(creator.blogs.length || '') },
              { id: 'Videos' as const, count: String(creator.videos.length + creator.reels.length || '') },
              { id: 'Reviews' as const, count: String(reviewDemo.community.length || '') },
              { id: 'Collections' as const, count: '48' },
              { id: 'Deals' as const, count: '56' },
              { id: 'About' as const, count: '' },
            ] as const
          ).map((tab) => {
            const active = profileTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProfileTab(tab.id)}
                className={cn(
                  'shrink-0 py-3.5 text-[13px] font-bold cursor-pointer whitespace-nowrap border-0 border-b-2 bg-transparent transition-colors',
                  active
                    ? 'text-[#07DD05] border-[#07DD05]'
                    : 'text-[#6B7280] border-transparent hover:text-[#1A1A2E]',
                )}
              >
                {tab.id}
                {tab.count ? (
                  <span className="text-[#9AA0AC] font-semibold ml-1">{tab.count}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed body */}
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8 lg:px-10 py-6 w-full">
            <main className="w-full pb-10 space-y-10">
               
               {searchFilter && (
                  <div className="bg-white border border-[#e8edf2] rounded-[10px] p-4 text-xs font-bold text-navy flex items-center justify-between">
                     <span>Filtered content matching &ldquo;{searchFilter}&rdquo;</span>
                     <button 
                       onClick={() => {setSearchFilter(''); setCurrentSearchInput('');}}
                       className="text-orange-primary hover:underline uppercase text-[10px] font-black border-0 bg-transparent cursor-pointer"
                     >
                       Reset filters
                     </button>
                  </div>
               )}

               {profileTab === 'Overview' && (
                 <CreatorOverviewFeed
                   creator={creator}
                   onViewAllContent={() => setProfileTab('Videos')}
                   onViewAllReviews={() => setProfileTab('Reviews')}
                 />
               )}

               {profileTab === 'Videos' && (
                 <CreatorVideosTab
                   videos={filteredVideos}
                   reels={filteredReels}
                   onOpenVideo={(url, title, isShort) => openVideo(url, title, isShort)}
                 />
               )}

               {profileTab === 'Guides' && (
                 <CreatorGuidesTab blogs={filteredBlogs} />
               )}

               {profileTab === 'Reviews' && (
                 <CreatorReviewsTab
                   community={reviewDemo.community}
                   latestProducts={reviewDemo.latestProducts}
                 />
               )}

               {profileTab === 'Collections' && (
                 <p className="text-[13px] text-[#4B5563] leading-relaxed">
                   {creator.name.split(' ')[0]} has curated collections spanning budget phones, creator laptops, and smart home starter kits.
                 </p>
               )}

               {profileTab === 'Deals' && (
                 <p className="text-[13px] text-[#4B5563] leading-relaxed">
                   Exclusive creator deals and affiliate offers will appear here when campaigns are live.
                 </p>
               )}

               {profileTab === 'About' && (
                 <div className="text-[13px] text-[#4B5563] leading-relaxed space-y-3">
                   <p>{creator.bio}</p>
                   <p>Based in Dhaka, Bangladesh. On Choosify since 2021 · Best for {creator.bestFor}.</p>
                 </div>
               )}

            </main>
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
                   <h3 className="text-sm font-extrabold tracking-tight text-white">
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
                       <label className="block text-[12px] font-semibold tracking-tight text-[#9AA0AC] mb-1.5">
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
                       <label className="block text-[12px] font-semibold tracking-tight text-[#9AA0AC] mb-1.5">
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
                       <label className="block text-[12px] font-semibold tracking-tight text-[#9AA0AC] mb-1.5">
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
                       <label className="block text-[12px] font-semibold tracking-tight text-[#9AA0AC] mb-1.5">
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
                         className="px-5 py-2.5 rounded-lg bg-[#EB4501] hover:brightness-110 text-white text-[12px] font-bold tracking-tight flex items-center gap-1.5 shadow-sm cursor-pointer border-0"
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
                         className="px-5 py-2.5 rounded-lg bg-white text-[#1A1A2E] hover:bg-[#F4F7F9] text-[12px] font-bold tracking-tight cursor-pointer transition-all border-0"
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
