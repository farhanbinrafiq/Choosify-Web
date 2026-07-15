import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowRight, Package, Award, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useGlobalState } from "../context/GlobalStateContext";
import { useDashboard } from "../context/DashboardContext";
import { FaqPill } from "../components/FaqPill";
import { CreatorReviewCard, CreatorReview } from "../components/CreatorReviewCard";
import { VideoModal } from "../components/VideoModal";

import { ProductHeroCTACard } from "../components/ui/cards/ProductHeroCTACard";
import { StickyNavigation } from "../components/ui/navigation/StickyNavigation";
import { SpecificationCard } from "../components/ui/cards/SpecificationCard";
import { PublicReviewCard } from "../components/PublicReviewCard";
import { WriteReviewCard } from "../components/ui/reviews/WriteReviewCard";
import { BoxContentsCard } from "../components/ui/cards/BoxContentsCard";
import { TrustScoreCard } from "../components/ui/trust/TrustScoreCard";
import { TrustStatementCard } from "../components/ui/trust/TrustStatementCard";
import { ProductOverviewCard } from "../components/ui/cards/ProductOverviewCard";
import { PriceAcrossStoresCard } from "../components/ui/cards/PriceAcrossStoresCard";
import { FAQAccordionCard } from "../components/ui/faq/FAQAccordionCard";
import { Button } from "../components/ui/buttons/Button";






const getProductBoxContents = (prod: any) => {
  const brandLower = prod.brand?.toLowerCase() || '';
  const titleLower = prod.title?.toLowerCase() || '';
  const isApple = brandLower === 'apple' || titleLower.includes('apple') || titleLower.includes('iphone') || titleLower.includes('macbook');
  const isSamsung = brandLower === 'samsung' || titleLower.includes('galaxy') || titleLower.includes('s24');
  const isSony = brandLower === 'sony' || titleLower.includes('1000xm5');
  const isApex = brandLower === 'apex';

  if (isApple) {
    return {
      contents: [
        { name: "iPhone 15 Pro Max", desc: "Featuring Grade 5 Titanium design and A17 Pro Chip" },
        { name: "USB-C Charge Cable (1m)", desc: "Premium braided design, matching the titanium colorway" },
        { name: "Official Documentation", desc: "Quick Start Guide & Apple Safety leaflet" },
        { name: "SIM Ejector Tool", desc: "Standard stainless-steel SIM pin" }
      ],
      benefits: [
        { title: "Complimentary 20W Fast Charger", desc: "Exclusive Choosify partner benefit (Since Apple doesn't package one in the retail box)", badge: "Exclusive Gift" },
        { title: "Liquid Silicone Protective Case", desc: "Anti-drop protective case in matching dark colors", badge: "Gift" },
        { title: "Official Apple Care+ Local Assist", desc: "Get prioritized local assistance across Dhaka authorized centers", badge: "Service Benefit" },
        { title: "Free Express Shipping", desc: "Guaranteed same-day courier dispatch inside Dhaka", badge: "Delivery Benefit" }
      ]
    };
  } else if (isSamsung) {
    return {
      contents: [
        { name: "Samsung Galaxy S24 Ultra", desc: "With embedded S-Pen" },
        { name: "USB-C to USB-C Cable", desc: "High-speed power and data sync cable" },
        { name: "Ejection Pin", desc: "SIM tray ejection tool" },
        { name: "Quick Start Guide", desc: "Official product manual and warranty booklet" }
      ],
      benefits: [
        { title: "S-Pen Replacement Nibs", desc: "Extra tips for your S-Pen stylus", badge: "Accessory" },
        { title: "Samsung SmartTag 2", desc: "Track your phone and keys effortlessly", badge: "Exclusive Gift" },
        { title: "12-Month Screen Replacement", desc: "One-time free screen replacement warranty locally", badge: "Free Warranty" },
        { title: "Free Official Installation Support", desc: "Full data migration via SmartSwitch from older phones", badge: "Free Support" }
      ]
    };
  } else if (isSony) {
    return {
      contents: [
        { name: "Sony WH-1000XM5 Headphones", desc: "State-of-the-art noise-cancelling headphones" },
        { name: "Premium Carrying Case", desc: "Hard-shell fabric case with magnet closure" },
        { name: "USB-C Charging Cable", desc: "Premium quality charging cord" },
        { name: "3.5mm Headphone Jack Cable", desc: "Gold-plated auxiliary audio connector" },
        { name: "Plug Adapter for In-flight Use", desc: "Dual prong airplane adapter" }
      ],
      benefits: [
        { title: "Complimentary Headphone Stand", desc: "Premium aluminum desk stand accessory", badge: "Gift" },
        { title: "Sony Music 3-Month Voucher", desc: "Hi-Res streaming platform membership coupon", badge: "Bonus Item" },
        { title: "Extra 6-Month Local Warranty", desc: "Additional warranty covering driver malfunctions", badge: "Free Warranty" }
      ]
    };
  } else if (isApex) {
    return {
      contents: [
        { name: "Apex Men's Ultima Pro Shoes", desc: "Surgically engineered sport runner footwear" },
        { name: "Ortholite Pro Insoles", desc: "Injected memory-foam arch support" },
        { name: "Extra Premium Shoelaces", desc: "Reflective dark shoelaces for night running" }
      ],
      benefits: [
        { title: "Apex Premium Shoe Care Kit", desc: "Sneaker cleaning gel and horsehair brush set", badge: "Exclusive Gift" },
        { title: "30-Day Hassle-Free Exchange", desc: "Return or exchange size at any physical outlet", badge: "Service Benefit" }
      ]
    };
  }

  return {
    contents: [
      { name: prod.title || "Product Main Unit", desc: "Official retail edition" },
      { name: "User Documentation & Manuals", desc: "Detailed setup instructions" },
      { name: "Standard Connectivity Cable", desc: "Compatible interface cable" }
    ],
    benefits: [
      { title: "Free Premium Accessories Package", desc: "Curated custom kit matching your purchase", badge: "Exclusive Gift" },
      { title: "Free Express Tracked Delivery", desc: "Fully insured transit with live location updates", badge: "Delivery Benefit" },
      { title: "Choosify Verified Authenticity Seal", desc: "100% money-back guarantee against counterfeits", badge: "Guarantee" }
    ]
  };
};

const getStorePrices = (prod: any) => {
  const rawPrice = typeof prod.price === 'string' ? prod.price.replace(/,/g, '') : String(prod.price || '167500');
  const basePrice = Number(rawPrice) || 167500;
  return [
    {
      name: "Apple Bangladesh Flagship",
      avatar: "https://i.pravatar.cc/100?u=applebd",
      price: basePrice,
      originalPrice: basePrice + 17500,
      rating: 4.9,
      deliveryTime: "Instant / Same-day",
      deliveryCost: "Free Delivery",
      isOfficial: true,
      isVerified: true,
      coupon: "APPLEOFFICIAL",
      cashback: "10% Cashback with AMEX",
      stock: "In Stock"
    },
    {
      name: "Gadget & Gear (Partner)",
      avatar: "https://i.pravatar.cc/100?u=gg",
      price: basePrice + 1200,
      originalPrice: basePrice + 10000,
      rating: 4.8,
      deliveryTime: "1 Day Delivery",
      deliveryCost: "Free Delivery",
      isOfficial: false,
      isVerified: true,
      coupon: "GGCHOOSE500",
      cashback: "BDT 3,000 Flat on City Bank AMEX",
      stock: "In Stock"
    },
    {
      name: "Pickaboo Shop",
      avatar: "https://i.pravatar.cc/100?u=pb",
      price: basePrice - 1900,
      originalPrice: basePrice + 8000,
      rating: 4.7,
      deliveryTime: "1-2 Days",
      deliveryCost: "BDT 100 Delivery",
      isOfficial: false,
      isVerified: true,
      coupon: "PICKAPRO1000",
      cashback: "Up to BDT 5,000 on bKash",
      stock: "Limited Stock"
    },
    {
      name: "Daraz Express",
      avatar: "https://i.pravatar.cc/100?u=daraz",
      price: basePrice - 3500,
      originalPrice: basePrice + 12000,
      rating: 4.3,
      deliveryTime: "3-5 Days",
      deliveryCost: "BDT 150 Delivery",
      isOfficial: false,
      isVerified: false,
      coupon: "DARAZBEST",
      cashback: "5% cashback on credit cards",
      stock: "In Stock"
    },
    {
      name: "Ryans Computers",
      avatar: "https://i.pravatar.cc/100?u=ryans",
      price: basePrice + 2500,
      originalPrice: basePrice + 15000,
      rating: 4.6,
      deliveryTime: "2 Days",
      deliveryCost: "Free Delivery",
      isOfficial: false,
      isVerified: true,
      coupon: "RYAN500",
      cashback: "No cashback available",
      stock: "In Stock"
    }
  ];
};

const CREATOR_REVIEWS_MOCK = [
  {
    id: "1",
    cover: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=600&auto=format&fit=crop",
    title: "iPhone 15 Pro Max 30 Days Later - The Truth!",
    creator: { name: "Marques Brownlee", avatar: "https://i.pravatar.cc/150?u=mb", verified: true },
    duration: "14:20",
    views: "1.2M",
    date: "2 weeks ago",
    category: "Long Term Review",
    categoryColor: "bg-blue-600",
    platform: "youtube" as const
  },
  {
    id: "2",
    cover: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop",
    title: "iPhone 15 Pro Camera Test vs S24 Ultra",
    creator: { name: "Mrwhosetheboss", avatar: "https://i.pravatar.cc/150?u=mr", verified: true },
    duration: "18:45",
    views: "850K",
    date: "1 month ago",
    category: "Camera Test",
    categoryColor: "bg-purple-600",
    platform: "youtube" as const
  },
  {
    id: "3",
    cover: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?q=80&w=600&auto=format&fit=crop",
    title: "Is the Titanium actually better? Drop Test!",
    creator: { name: "JerryRigEverything", avatar: "https://i.pravatar.cc/150?u=jr", verified: true },
    duration: "08:12",
    views: "2.1M",
    date: "3 weeks ago",
    category: "Durability Test",
    categoryColor: "bg-red-600",
    platform: "youtube" as const
  },
  {
    id: "4",
    cover: "https://images.unsplash.com/photo-1605236453806-6ff368536b8e?q=80&w=600&auto=format&fit=crop",
    title: "Top 10 Hidden Features in iOS 17 & iPhone 15 Pro",
    creator: { name: "iJustine", avatar: "https://i.pravatar.cc/150?u=ij", verified: true },
    duration: "12:05",
    views: "450K",
    date: "5 days ago",
    category: "Tips & Tricks",
    categoryColor: "bg-emerald-600",
    platform: "instagram" as const
  },
  {
    id: "5",
    cover: "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=600&auto=format&fit=crop",
    title: "Gaming on A17 Pro - Console Level Quality?",
    creator: { name: "Dave2D", avatar: "https://i.pravatar.cc/150?u=d2d", verified: true },
    duration: "10:30",
    views: "320K",
    date: "1 week ago",
    category: "Gaming Test",
    categoryColor: "bg-amber-600",
    platform: "youtube" as const,
    sponsor: "Sponsored"
  },
  {
    id: "6",
    cover: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=600&auto=format&fit=crop",
    title: "Is the iPhone 15 Pro Max Worth the Premium price?",
    creator: { name: "Sam Sheffer", avatar: "https://i.pravatar.cc/150?u=sam", verified: true },
    duration: "09:40",
    views: "180K",
    date: "3 days ago",
    category: "Buyer Guide",
    categoryColor: "bg-teal-600",
    platform: "youtube" as const
  },
  {
    id: "7",
    cover: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600&auto=format&fit=crop",
    title: "Unboxing the natural titanium iPhone 15 Pro Max",
    creator: { name: "UrAvgConsumer", avatar: "https://i.pravatar.cc/150?u=ur", verified: true },
    duration: "06:15",
    views: "410K",
    date: "6 days ago",
    category: "Unboxing",
    categoryColor: "bg-indigo-600",
    platform: "tiktok" as const
  },
  {
    id: "8",
    cover: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=600&auto=format&fit=crop",
    title: "iPhone 15 Pro Max Cinematography Walkthrough",
    creator: { name: "Peter McKinnon", avatar: "https://i.pravatar.cc/150?u=peter", verified: true },
    duration: "15:10",
    views: "620K",
    date: "3 weeks ago",
    category: "Cinematography",
    categoryColor: "bg-pink-600",
    platform: "youtube" as const
  }
];

export function ProductDetailPage() {
  const { id } = useParams();

  const { allProducts, addToCart: globalAddToCart } = useGlobalState();
  const { addRecentlyViewed } = useDashboard();
  
  const [selectedReview, setSelectedReview] = useState<CreatorReview | null>(null);

  const [activeSection, setActiveSection] = useState("overview");
  const [showAllCreators, setShowAllCreators] = useState(false);
  const [redirectingStore, setRedirectingStore] = useState<string | null>(null);

  const product = useMemo<any>(() => {
    const found = allProducts.find((p: any) => p.id === Number(id)) || {
      id: 1,
      title: "Apple iPhone 15 Pro Max (256GB)",
      price: "167,500",
      reviews: "12.4K",
      rating: 4.8
    };
    return found;
  }, [id, allProducts]);

  useEffect(() => {
    if (product?.id) {
      addRecentlyViewed(product);
    }
  }, [product?.id, addRecentlyViewed]);

  const boxInfo = useMemo(() => getProductBoxContents(product), [product]);

  const sortedStores = useMemo(() => getStorePrices(product), [product]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 140; // Navbar (80) + Sticky Page Nav (60)
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      
      const sections = [
        { id: "overview", el: document.getElementById("overview") },
        { id: "specifications", el: document.getElementById("specifications") },
        { id: "creator-reviews", el: document.getElementById("creator-reviews") },
        { id: "public-reviews", el: document.getElementById("public-reviews") },
        { id: "box-contents", el: document.getElementById("box-contents") },
        { id: "product-overview", el: document.getElementById("product-overview") },
        { id: "prices", el: document.getElementById("prices") },
        { id: "faq", el: document.getElementById("faq") }
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.el) {
          const top = section.el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const images = [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2000&auto=format&fit=crop",
  ];


  const handleAddToCart = () => {
    globalAddToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: images[0],
      store: "Apple Store"
    }, 1);
    toast.success("Added to Cart!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9] text-slate-800 font-sans pb-24 selection:bg-[#FF5B00] selection:text-white">
      
      
      {/* 1. PRODUCT HERO */}
      <div id="overview" className="max-w-[1600px] mx-auto px-6 md:px-10 pt-6 pb-12 scroll-mt-36">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 flex flex-wrap items-center gap-1.5 uppercase tracking-wider mb-8">
          <Link to="/" className="hover:text-slate-600 transition-colors">Home</Link>
          <span className="text-slate-400 font-bold">&gt;</span>
          <Link to="/products" className="hover:text-slate-600 transition-colors">Products</Link>
          <span className="text-slate-400 font-bold">&gt;</span>
          <span className="hover:text-slate-600 transition-colors cursor-pointer">Electronics</span>
          <span className="text-slate-400 font-bold">&gt;</span>
          <span className="hover:text-slate-600 transition-colors cursor-pointer">Smartphones</span>
          <span className="text-slate-400 font-bold">&gt;</span>
          <span className="text-slate-800 font-extrabold">{product.title}</span>
        </nav>

        <ProductHeroCTACard
          image={images[0]}
          title={product.title}
          subtitle="Titanium Black"
          rating={4.8}
          reviewCount={product.reviews}
          price="BDT 167,500"
          originalPrice="BDT 185,000"
          discountBadge="-9%"
          cashbackText="Get up to ৳ 8,000 cashback"
          colors={[
            { label: "Titanium Black", value: "Titanium Black", colorHex: "#2d2d2d" },
            { label: "Titanium Blue", value: "Titanium Blue", colorHex: "#2c3d4a" },
            { label: "Titanium Natural", value: "Titanium Natural", colorHex: "#959187" },
            { label: "Titanium White", value: "Titanium White", colorHex: "#e3e4e5" }
          ]}
          storages={[
            { label: "256GB", value: "256GB" },
            { label: "512GB", value: "512GB" },
            { label: "1TB", value: "1TB" }
          ]}
          onBuyNow={handleAddToCart}
          onWishlist={() => toast.success("Added to Wishlist")}
          onCompare={() => toast.success("Added to Compare")}
        />
      </div>

      {/* 2. STICKY NAVIGATION */}
      <StickyNavigation
        items={[
          { id: "specifications", label: "Specifications" },
          { id: "creator-reviews", label: "Creator Reviews" },
          { id: "public-reviews", label: "Public Reviews" },
          { id: "box-contents", label: "Box Contents" },
          { id: "product-overview", label: "Product Overview" },
          { id: "prices", label: "Prices Across Stores" },
          { id: "faq", label: "FAQs" },
        ]}
        activeId={activeSection}
        onItemClick={scrollToSection}
        productInfo={{
          image: images[0],
          title: product.title,
          price: "BDT 167,500"
        }}
        onCtaClick={handleAddToCart}
      />

{/* 4. CONTENT AREA */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-12 flex flex-col gap-16">
        
        {/* SECTION 1: SPECIFICATIONS */}
        <section id="specifications" className="scroll-mt-36">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-2">PRODUCT SPECIFICATIONS</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">TECHNICAL DETAILS & COMPREHENSIVE FEATURES</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-12">
              <SpecificationCard 
                title="PRODUCT SPECIFICATIONS"
                specs={[
                  { label: "BRAND", value: "Apple" },
                  { label: "CATEGORY", value: "Smartphones" },
                  { label: "DISPLAY", value: "6.7\" Super Retina XDR" },
                  { label: "STORAGE", value: "256GB" },
                  { label: "CHIPSET", value: "A17 Pro Chip" },
                  { label: "CAMERA", value: "48MP Main + 12MP Ultra Wide" },
                  { label: "BATTERY", value: "Up to 29 Hours" },
                  { label: "RATING", value: "4.8 / 5" },
                  { label: "Dimensions", value: "159.9 x 76.7 x 8.25 mm" },
                  { label: "Weight", value: "221 g" },
                  { label: "Screen Finish", value: "Ceramic Shield Front" },
                  { label: "Chassis Material", value: "Grade 5 Titanium design" },
                  { label: "Water Resistance", value: "IP68 Rated (up to 6m for 30m)" },
                  { label: "Connector Port", value: "USB-C with USB 3 speed" }
                ]}
                onViewAll={() => toast.success("Opening full specifications sheet")}
              />
            </div>
          </div>
        </section>

{/* SECTION 2: CREATOR REVIEWS */}
        <section id="creator-reviews" className="scroll-mt-36">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-2">CREATOR REVIEWS</h2>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">WATCH TRUSTED INFLUENCER INSIGHTS BEFORE BUYING</p>
            </div>
            <Button 
              variant="ghost"
              onClick={() => setShowAllCreators(!showAllCreators)}
              className="text-xs font-bold text-[#FF5B00] uppercase tracking-wider flex items-center gap-1 hover:text-[#EB4501] group cursor-pointer self-start md:self-auto"
            >
              {showAllCreators ? "SHOW FEWER REVIEWS" : "VIEW ALL REVIEWS"} 
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREATOR_REVIEWS_MOCK.slice(0, showAllCreators ? 8 : 4).map((review) => (
              <CreatorReviewCard key={review.id} review={review} onClick={() => setSelectedReview(review)} />
            ))}
          </div>
        </section>

        {/* SECTION 3: PUBLIC REVIEWS */}
        <section id="public-reviews" className="scroll-mt-36">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-[#000435] uppercase tracking-wider mb-2">PUBLIC REVIEWS</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">GENUINE CUSTOMER FEEDBACK & VERIFIED PURCHASE REVIEWS</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Write Review Form */}
            <div className="lg:col-span-4 lg:sticky lg:top-36">
              <WriteReviewCard onSubmit={(data) => {
                if (data.rating === 0) {
                  toast.error("Please pick a star rating first!");
                } else {
                  toast.success("Thank you! Your review has been submitted for verification.");
                }
              }} />
            </div>

            {/* Review Cards List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {[
                {
                  name: "Tawhid Hossain",
                  days: "2 days ago",
                  text: "Absolutely incredible device! The camera quality is mind-blowing and the performance is next level. Battery life is also exceptional, easily getting me through a full day of heavy shooting.",
                  helpful: 123,
                  images: [1,2,3]
                },
                {
                  name: "Nusrat Jahan",
                  days: "5 days ago",
                  text: "Upgraded from iPhone 12 Pro Max and the difference is incredible. The dynamic island and premium titanium build feel so luxurious and feather-light. Worth every single penny.",
                  helpful: 96,
                  images: [1,2,3]
                }
              ].map((review, i) => (
                <PublicReviewCard 
                  key={i} 
                  review={{
                    name: review.name,
                    rating: 5,
                    time: review.days,
                    comment: review.text,
                    verified: true,
                    helpful: review.helpful,
                    images: review.images.map(() => "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=200&auto=format&fit=crop")
                  }} 
                  onHelpfulClick={() => toast.success("Marked review as helpful")}
                />
              ))}
                
              <Button 
                variant="secondary" 
                className="w-full mt-2" 
                onClick={() => toast.success("Loading older reviews...")}
              >
                LOAD MORE REVIEWS
              </Button>
            </div>
          </div>
        </section>


        {/* SECTION 4: BOX CONTENTS & COMPLIMENTARY FEATURES */}
        <section id="box-contents" className="scroll-mt-36">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-1">
              <BoxContentsCard
                title="BOX CONTENTS"
                items={[
                  ...boxInfo.contents.map(c => ({ label: c.name + " - " + c.desc, icon: Package })),
                  ...boxInfo.benefits.map(b => ({ label: b.title + " - " + b.desc, icon: Award }))
                ]}
              />
            </div>
            <div className="lg:col-span-1">
              <TrustScoreCard
                overallScore={9.2}
                categories={[
                  { label: "Product Authenticity", score: 9.5 },
                  { label: "Seller Reliability", score: 9.1 },
                  { label: "User Reviews", score: 9.0 },
                  { label: "Safety & Policy", score: 9.3 }
                ]}
              />
            </div>
            <div className="lg:col-span-1">
              <TrustStatementCard
                statements={[
                  { title: "100% Genuine Products", description: "Sourced from official & trusted sellers" },
                  { title: "Safe & Secure Payments", description: "Your payments are fully protected" },
                  { title: "Easy Returns & Refunds", description: "Hassle-free returns within 7 days" },
                  { title: "Dedicated Customer Support", description: "We're here to help you anytime" }
                ]}
              />
            </div>
          </div>
        </section>


        {/* SECTION 5: PRODUCT OVERVIEW */}
        <section id="product-overview" className="scroll-mt-36">
          <ProductOverviewCard
            summary={"The " + product.title + " provides outstanding values. It is a premier option for customers looking for advanced reliability, durable design elements, and high-performance capabilities in daily workflows. Highly recommended for demanding power users, active content creators, and corporate professionals who expect high-end displays, top-of-the-line internal chipsets, and long-term durability."}
            sections={[
              {
                title: "Key Features",
                features: [
                  "Premium Space Grade Materials",
                  "High Strength Outer Screen Panel",
                  "Rigid Internal Framing Architecture",
                  "IP68 Certified Ingress Rating",
                  "Significant Processing Speed Increase",
                  "Optimal Thermal Dissipation Core",
                  "Low Latency Mobile Refresh Rate",
                  "Intelligent Battery Management",
                  "12-Month Official Local Warranty",
                  "Rapid Service Centers Availability"
                ]
              }
            ]}
          />
        </section>


        {/* SECTION 6: PRICES ACROSS STORES */}
        <section id="prices" className="scroll-mt-36">
          <PriceAcrossStoresCard 
            stores={sortedStores.map((store, i) => ({
              id: i.toString(),
              storeName: store.name,
              logo: store.avatar,
              price: "BDT " + store.price.toLocaleString(),
              cashback: store.cashback,
              onViewStore: () => {
                setRedirectingStore(store.name);
                setTimeout(() => {
                  setRedirectingStore(null);
                  toast.success(`Successfully connected to ${store.name}!`);
                }, 2500);
              }
            }))}
            onViewAllStores={() => toast.success("Loading all stores...")}
          />
        </section>

        
        {/* SECTION 7: FAQ */}
        <section id="faq" className="scroll-mt-36">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-2">Frequently Asked Questions</h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">QUICK QUESTIONS & COLLAPSIBLE DETAILED RESPONSES</p>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center mb-8 max-w-4xl mx-auto px-4">
            <FaqPill 
              label="Is the product original?" 
              answer="Yes, all products on Choosify are 100% genuine, sourced from certified brand distributors, with intact factory serial numbers."
            />
            <FaqPill 
              label="How can I track my order?" 
              answer="You can monitor real-time shipment progress directly from your dashboard or via the carrier SMS updates sent upon dispatch."
            />
            <FaqPill 
              label="What's your return policy?" 
              answer="Enjoy 7-day hassle-free exchange or full refund on items verified to have manufacturing defects or sizing mismatch."
            />
            <FaqPill 
              label="Warranty details?" 
              answer="Most electronics carry a 1-Year Brand Warranty. Warranty claims are easily made at authorized local service centers."
            />
            <FaqPill 
              label="Shipping times?" 
              answer="Dhaka metropolitan delivery takes 24-48 hours. Nationwide deliveries to other regions take between 2 to 4 business days."
            />
          </div>

          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            <FAQAccordionCard 
              question="Is the product original?"
              answer="Yes, all products on Choosify are 100% original and sourced from authorized sellers."
            />
            <FAQAccordionCard 
              question="How can I track my order?"
              answer="You can track your order status directly from your dashboard using your order ID."
            />
            <FAQAccordionCard 
              question="What is your return policy?"
              answer="We offer a 7-day hassle-free return policy for any defective items."
            />
          </div>
        </section>

        {/* TRUST STATEMENT AND FOOTER PROMO */}
        <div className="mt-12 mb-4">
          <div className="bg-white rounded-t-[32px] border-t border-x border-slate-100 p-8 flex flex-col md:flex-row items-center justify-center gap-6 shadow-[0_-10px_30px_rgb(0,0,0,0.02)] max-w-5xl mx-auto -mb-6 relative z-10">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-emerald-500" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-extrabold text-[#000435] uppercase tracking-wider mb-2">CHOOSIFY.BD TRUST STATEMENT</h3>
              <p className="text-base text-slate-500 font-medium">We only partner with verified sellers to ensure genuine products and the best experience as in Choosify.</p>
            </div>
          </div>
          
          <div className="bg-[#0B0F19] rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl relative z-0 border border-white/5 overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5B00]/10 rounded-full blur-[80px] pointer-events-none"></div>
             
             <div className="flex-1 relative z-10 text-center md:text-left mb-6 md:mb-0">
               <h4 className="font-extrabold text-xl md:text-2xl uppercase tracking-wider mb-2">UPGRADE TO CHOOSIFY PRIME</h4>
               <p className="text-sm md:text-base text-slate-400 font-medium">Get premium deals, exclusive offers & early access to top launches.</p>
               <button 
                 onClick={() => toast.success("Welcome to Choosify Prime!")}
                 className="text-[#FF5B00] text-sm font-bold uppercase tracking-wider mt-4 hover:text-white transition-colors cursor-pointer"
               >
                 UPGRADE NOW
               </button>
             </div>
             
             <div className="shrink-0 relative z-10">
                <Award className="w-20 h-20 text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]" />
             </div>
          </div>
        </div>

      </div>

      {/* Video Modal playback */}
      {selectedReview && (
        <VideoModal 
          review={selectedReview} 
          onClose={() => setSelectedReview(null)} 
        />
      )}

      {/* Dynamic Simulated Redirection Backdrop Overlay */}
      <AnimatePresence>
        {redirectingStore && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[32px] p-8 md:p-10 max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-pulse border border-emerald-100 shadow-inner">
                <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-2">SECURE REDIRECT</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                Redirecting securely to <span className="font-extrabold text-[#FF5B00]">{redirectingStore}</span>...
                You are leaving Choosify to complete your purchase on their partner platform.
              </p>
              <div className="w-full bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center justify-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Choosify Authenticity Guarantee active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#FF5B00] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-[#FF5B00] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-[#FF5B00] rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
