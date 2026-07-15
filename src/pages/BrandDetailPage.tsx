import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { 
  Globe, MessageSquare, Phone, MapPinned, ShieldCheck, Mail
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { cn } from '../lib/utils';
import { ProductCard } from '../components/ProductCard';
import { CreatorReviewCard, CreatorReview } from '../components/CreatorReviewCard';
import { PublicReviewCard } from '../components/PublicReviewCard';
import { VideoModal } from '../components/VideoModal';
import { BRAND_STORES_DB, BrandStoreDeal } from '../data/brandStoresData';
import { BRAND_STORES_LOCATIONS, BRAND_OVERVIEW_DETAILS } from '../data/brandStoreLocations';
import { BrandOverviewCard } from '../components/ui/cards/BrandOverviewCard';
import { PhysicalStoreCard } from '../components/ui/cards/PhysicalStoreCard';
import { UnifiedProfileHero } from '../components/ui/cards/UnifiedProfileHero';
import { DealCard } from '../components/DealCard';
import { StickyNavigation } from '../components/ui/navigation/StickyNavigation';
import { Button } from '../components/ui/buttons/Button';
import { Badge } from '../components/ui/badges/Badge';

// Fallback dynamic creator reviews generator for any brand
const getCreatorReviewsForBrand = (brandId: string): CreatorReview[] => {
  if (brandId === 'apple' || brandId === 'samsung' || brandId === 'xiaomi' || brandId === 'walton') {
    return [
      {
        id: "cr-1",
        cover: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600&auto=format&fit=crop",
        title: `${brandId === 'apple' ? 'iPhone 15 Pro' : brandId === 'samsung' ? 'S24 Ultra' : 'Redmi Note 13'} - 30 Days Later Truth!`,
        creator: { name: "Marques Brownlee", avatar: "https://i.pravatar.cc/150?u=mb", verified: true },
        duration: "14:20",
        views: "3.2M views",
        date: "2 weeks ago",
        category: "Review",
        categoryColor: "bg-purple-500",
        platform: "youtube" as const
      },
      {
        id: "cr-2",
        cover: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=600&auto=format&fit=crop",
        title: `Don't buy the new ${brandId} until you watch this...`,
        creator: { name: "Mrwhosetheboss", avatar: "https://i.pravatar.cc/150?u=mr", verified: true },
        duration: "18:45",
        views: "1.8M views",
        date: "1 month ago",
        category: "Comparison",
        categoryColor: "bg-blue-500",
        platform: "youtube" as const
      },
      {
        id: "cr-3",
        cover: "https://images.unsplash.com/photo-1605236453806-6ff368524d8e?q=80&w=600&auto=format&fit=crop",
        title: `${brandId.toUpperCase()} Ecosystem Setup 2025`,
        creator: { name: "iJustine", avatar: "https://i.pravatar.cc/150?u=ij", verified: true },
        duration: "12:10",
        views: "890K views",
        date: "3 days ago",
        category: "Ecosystem",
        categoryColor: "bg-[#FF5B00]",
        platform: "youtube" as const
      }
    ];
  }
  return [
    {
      id: "cr-def-1",
      cover: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop",
      title: `${brandId.toUpperCase()} - Complete Buyer's Guide`,
      creator: { name: "Tech Expert", avatar: "https://i.pravatar.cc/150?u=te", verified: false },
      duration: "08:30",
      views: "45K views",
      date: "1 week ago",
      category: "Guide",
      categoryColor: "bg-gray-500",
      platform: "youtube" as const
    }
  ];
};

const getCustomerReviewsForBrand = () => {
  return [
    {
      id: "pr-1",
      name: "Ahmed R.",
      rating: 5,
      date: "Oct 12, 2024",
      text: "The delivery from the official store was incredibly fast. Got authentic product with valid warranty.",
      avatar: "https://i.pravatar.cc/150?u=ar",
      helpful: 24,
      tags: ["Fast Delivery", "Authentic"]
    },
    {
      id: "pr-2",
      name: "Sarah T.",
      rating: 4,
      date: "Sep 28, 2024",
      text: "Great experience overall. The packaging was pristine. Only taking one star off because customer service took 2 hours to reply.",
      avatar: "https://i.pravatar.cc/150?u=st",
      helpful: 12,
      tags: ["Good Packaging"]
    },
    {
      id: "pr-3",
      name: "Faisal K.",
      rating: 5,
      date: "Sep 15, 2024",
      text: "100% genuine product. Verified the serial number on the official website immediately after receiving it.",
      avatar: "https://i.pravatar.cc/150?u=fk",
      helpful: 56,
      tags: ["Genuine", "Verified"]
    }
  ];
};

export function BrandDetailPage() {
  const { id } = useParams();
  const { allProducts } = useGlobalState();
  const [selectedReview, setSelectedReview] = useState<CreatorReview | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // States
  const [showAllDeals, setShowAllDeals] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState<Record<string, number>>({});
  
  const [selectedStoreType, setSelectedStoreType] = useState('All');
  const [selectedCity] = useState('Dhaka');

  // Fallback to apple if brand not found to avoid crash during demo
  const brandId = id && BRAND_STORES_DB[id] ? id : 'apple';
  const brand = BRAND_STORES_DB[brandId];

  // Derived Data
  const brandProducts = useMemo(() => {
    return allProducts.filter(p => p.brand?.toLowerCase() === brand.name.toLowerCase());
  }, [allProducts, brand.name]);

  const creatorReviews = useMemo(() => {
    return getCreatorReviewsForBrand(brandId);
  }, [brandId]);

  const customerReviews = useMemo(() => {
    return getCustomerReviewsForBrand();
  }, []);

  const overviewDetails = useMemo(() => {
    return BRAND_OVERVIEW_DETAILS[brandId] || BRAND_OVERVIEW_DETAILS['apple'];
  }, [brandId]);

  const stores = useMemo(() => {
    const brandLocs = BRAND_STORES_LOCATIONS[brandId] || BRAND_STORES_LOCATIONS['apple'] || [];
    return brandLocs.filter(s => {
      const typeMatch = selectedStoreType === 'All' || s.type === selectedStoreType;
      const cityMatch = selectedCity === 'All' || s.city === selectedCity;
      return typeMatch && cityMatch;
    });
  }, [brandId, selectedStoreType, selectedCity]);

  // Handlers
  const toggleFollow = () => {
    setIsFollowed(!isFollowed);
    if (!isFollowed) toast.success(`Following ${brand.name} official store`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Brand store link copied to clipboard");
  };

  const handleHelpful = (id: string) => {
    setHelpfulCount(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    toast.success("Marked as helpful");
  };

  const handleNavClick = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 145;
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

  const navigationTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'deals', label: 'Deals & Coupons' },
    { id: 'products', label: 'Products' },
    { id: 'creator-reviews', label: 'Creator Reviews' },
    { id: 'public-reviews', label: 'Public Reviews' },
    { id: 'brand-overview', label: 'Brand Overview' },
    { id: 'stores', label: 'Stores' }
  ];

  return (
    <>
      <VideoModal review={selectedReview} onClose={() => setSelectedReview(null)} />
      <div className="bg-[#F5F8FD] min-h-screen text-[#050B2C] pb-24 font-sans antialiased">
      
        {/* 1. BRAND HERO WITH INTEGRATED STICKY NAVIGATION */}
        <div id="overview">
          <UnifiedProfileHero 
            type="brand"
            id={brand.id}
            name={brand.name}
            verified={brand.verified}
            handle={`@${brand.id}`}
            category="Tech & Electronics"
            country={brand.location}
            founded={brand.founded}
            tagline={brand.slogan}
            logoUrl={brand.logoUrl}
            websiteUrl={brand.website}
            bannerImage={brand.bannerImage}
            bannerClass={brand.bannerClass}
            accentColor={brand.accentColor}
            socials={{
              fb: brand.contacts?.fb || '#',
              ig: brand.contacts?.ig || '#',
              website: brand.website,
            }}
            score={{
              value: brand.score,
              max: "5.0",
              reviewsCountLabel: `${brand.reviewsCount} reviews`,
              recommendPctLabel: `${brand.recommendPct || '90%'} of customers recommend ${brand.name.split(' ')[0]}`,
              breakdown: [
                { label: "Quality", value: Number(brand.metrics?.quality || 4.6) },
                { label: "Value", value: Number(brand.metrics?.value || 4.3) },
                { label: "Durability", value: Number(brand.metrics?.durability || 4.2) },
                { label: "Delivery", value: Number(brand.metrics?.support || 4.3) },
                { label: "Support", value: Number(brand.metrics?.design || 4.0) }
              ]
            }}
            isFollowed={isFollowed}
            onToggleFollow={toggleFollow}
            onShare={handleShare}
            navigationItems={navigationTabs}
            activeTabId={activeTab}
            onTabClick={(tabId) => handleNavClick(tabId)}
          />
        </div>

        {/* 3. TOP DEALS ON BRAND */}
        <section id="deals" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-28 mt-8">
          <div className="flex items-end justify-between mb-6 border-b border-[#EEF2F7] pb-4">
            <div className="text-left">
              <h2 className="text-2xl font-black text-[#050B2C] uppercase tracking-tight">
                Top Store Deals & Coupons
              </h2>
              <p className="text-xs font-bold text-[#6B7280] mt-1.5">
                Save instantly on {brand.name} direct orders with certified codes
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                setShowAllDeals(!showAllDeals);
                toast.success(showAllDeals ? "Collapsed deals list" : "Expanded all available offers and student promotions!");
              }}
            >
              {showAllDeals ? "SHOW FEWER DEALS" : "VIEW ALL AVAILABLE OFFERS"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brand.deals.slice(0, showAllDeals ? undefined : 3).map((deal: BrandStoreDeal) => (
              <DealCard key={deal.id} deal={{
                label: deal.badge,
                title: deal.title,
                subtitle: deal.description,
                code: deal.code,
                bg: `bg-[${brand.accentColor}]`
              }} />
            ))}
          </div>
        </section>

        {/* 4. ALL PRODUCTS FROM THIS BRAND */}
        <section id="products" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-28">
          <div className="flex items-end justify-between mb-6 border-b border-[#EEF2F7] pb-4">
            <div className="text-left">
              <h2 className="text-2xl font-black text-[#050B2C] uppercase tracking-tight flex items-center gap-2">
                <span>Official Catalog</span>
                <Badge variant="default" className="bg-[#050B2C] text-white text-[10px] ml-2">
                  {brandProducts.length} Items
                </Badge>
              </h2>
              <p className="text-xs font-bold text-[#6B7280] mt-1.5">
                100% genuine products shipped directly from {brand.name} distribution centers
              </p>
            </div>
            {brandProducts.length > 5 && (
              <Button 
                variant="outline"
                onClick={() => {
                  setShowAllProducts(!showAllProducts);
                }}
              >
                {showAllProducts ? "VIEW LESS" : "VIEW ALL PRODUCTS"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {brandProducts.slice(0, showAllProducts ? undefined : 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 5. CREATOR REVIEWS */}
        <section id="creator-reviews" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-28">
          <div className="text-left mb-6 border-b border-[#EEF2F7] pb-4">
            <h2 className="text-2xl font-black text-[#050B2C] uppercase tracking-tight">
              Top Creator Reviews
            </h2>
            <p className="text-xs font-bold text-[#6B7280] mt-1.5">
              Watch independent, unsponsored deep-dives before buying
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorReviews.map((review) => (
              <CreatorReviewCard
                key={review.id}
                review={review}
                onClick={() => setSelectedReview(review)}
              />
            ))}
          </div>
        </section>

        {/* 6. PUBLIC CUSTOMER REVIEWS */}
        <section id="public-reviews" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-28">
          <div className="flex items-end justify-between mb-6 border-b border-[#EEF2F7] pb-4">
            <div className="text-left">
              <h2 className="text-2xl font-black text-[#050B2C] uppercase tracking-tight">
                Verified Customer Feedback
              </h2>
              <p className="text-xs font-bold text-[#6B7280] mt-1.5">
                Authentic experiences from buyers who purchased from this specific official store
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerReviews.map((rev) => (
              <PublicReviewCard 
                 key={rev.id}
                 review={{
                   name: rev.name,
                   rating: rev.rating,
                   date: rev.date,
                   comment: rev.text,
                   verified: true,
                   helpful: helpfulCount[rev.id] || rev.helpful,
                   avatar: rev.avatar,
                 }}
                 onHelpfulClick={() => handleHelpful(rev.id)}
                 onOptionsClick={() => toast.success("Flagged review for audit validation.")}
              />
            ))}
          </div>
        </section>

        {/* 7. UNIFIED BRAND OVERVIEW SECTION */}
        <section id="brand-overview" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-28">
           <BrandOverviewCard 
             brand={brand} 
             overviewDetails={overviewDetails} 
             accentColor={brand.accentColor} 
           />
        </section>

        {/* 8. PHYSICAL STORES & EXPERIENCE CENTERS */}
        <section id="stores" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12 scroll-mt-28">
           <div className="text-left mb-6 border-b border-[#EEF2F7] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-[#050B2C] uppercase tracking-tight">
                Authorized Stores & Service Centers
              </h2>
              <p className="text-xs font-bold text-[#6B7280] mt-1.5">
                Find physical locations for walk-in purchases and warranty claims
              </p>
            </div>
            
            <div className="flex gap-2">
              <div className="flex gap-2 p-1 bg-white rounded-lg border border-slate-200">
                {['All', 'Experience Center', 'Authorized Reseller', 'Service Center'].map(type => (
                  <Button 
                    key={type}
                    onClick={() => setSelectedStoreType(type)}
                    variant={selectedStoreType === type ? "primary" : "outline"}
                    className={cn(
                      "px-3 py-1.5 h-auto text-[10px] whitespace-nowrap",
                      selectedStoreType === type ? "bg-[#000435] text-white hover:bg-[#000435]/90 border-[#000435]" : "text-slate-500 border-transparent hover:bg-slate-100"
                    )}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stores.map((store: any, idx: number) => (
              <PhysicalStoreCard 
                key={idx}
                image={store.image}
                storeName={store.name}
                address={`${store.address}, ${store.city}`}
                isOpen={store.status === 'Open Now'}
                hours={store.hours}
                onViewMap={() => toast.success(`Opening directions to ${store.name}`)}
              />
            ))}
          </div>
        </section>

        {/* 9. BRAND CONTACT FOOTER */}
        <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 mb-12">
          <div className="bg-[#050B2C] border border-white/5 rounded-3xl p-8 text-white text-left relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
              <div className="lg:col-span-4 space-y-4">
                <h3 className="text-lg font-black uppercase tracking-widest text-white leading-none">
                  {brand.name} Contacts
                </h3>
                <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                  Connect with verified authorized agents of {brand.name} directly. Official business verification guarantees direct line safety.
                </p>
                <div className="flex gap-3 pt-2">
                  <a href={brand.contacts.website} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-orange-600 flex items-center justify-center text-white transition-all">
                    <Globe size={16} />
                  </a>
                  <a href={`https://wa.me/${brand.contacts.whatsapp.replace('+', '')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-emerald-600 flex items-center justify-center text-white transition-all">
                    <MessageSquare size={16} />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">SUPPORT HELPLINE</span>
                  <p className="text-sm font-black text-white flex items-center gap-1.5">
                    <Phone size={14} className="text-orange-500" />
                    <span>{brand.contacts.support}</span>
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">OFFICIAL EMAIL</span>
                  <p className="text-sm font-black text-white flex items-center gap-1.5">
                    <Mail size={14} className="text-orange-500" />
                    <span className="break-all">{brand.contacts.email}</span>
                  </p>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">FLAGSHIP STORE PLAZA</span>
                  <p className="text-xs font-black text-white flex items-center gap-1.5">
                    <MapPinned size={14} className="text-orange-500 shrink-0" />
                    <span>{brand.contacts.storeLocator}</span>
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-5">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Business Compliance</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed mt-2.5">
                  This brand stores its catalogs directly with Choosify under active commercial business license registries. Counterfeits are strictly audited with premium refund coverage flags.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  <span>100% Verified Authentic Store</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
