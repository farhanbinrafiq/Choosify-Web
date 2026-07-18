import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { getEditorialContent } from '../data/dynamicContentDb';

import { ContentHeroCard } from '../components/ui/content/ContentHeroCard';
import { ContentAuthorCard } from '../components/ui/content/ContentAuthorCard';
import { RichTextSection } from '../components/ui/content/RichTextSection';
import { ComparisonGuideCard } from '../components/ui/content/ComparisonGuideCard';
import { ProsConsCard } from '../components/ui/content/ProsConsCard';
import { VerdictCard } from '../components/ui/content/VerdictCard';
import { CalloutCard } from '../components/ui/content/CalloutCard';
import { ChecklistCard } from '../components/ui/content/ChecklistCard';
import { VideoEmbedCard } from '../components/ui/content/VideoEmbedCard';
import { GalleryGrid } from '../components/ui/content/GalleryGrid';
import { ContentTOC } from '../components/ui/content/ContentTOC';
import { ReadingProgressBar } from '../components/ui/content/ReadingProgressBar';
import { SpotlightCard } from '../components/SpotlightCard';
import { BrandCard } from '../components/BrandCard';
import { CreatorReviewCard } from '../components/CreatorReviewCard';
import { PublicReviewCard } from '../components/PublicReviewCard';
import { DealCard } from '../components/DealCard';
import { Button } from '../components/ui/buttons/Button';
import { Badge } from '../components/ui/badges/Badge';
import { FAQAccordionCard } from '../components/ui/faq/FAQAccordionCard';
import { FAQPill } from '../components/ui/faq/FAQPill';
import { FaqPill } from '../components/FaqPill';
import { TrustStatementCard } from '../components/ui/trust/TrustStatementCard';
import { StickyNavigation } from '../components/ui/navigation/StickyNavigation';

export function ContentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Resolve content data using our dynamic content database
  const content = getEditorialContent(id) as any;
  
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Interactive comments state
  const [comments, setComments] = useState<{
    id: number;
    user: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
    likes: number;
    liked?: boolean;
  }[]>([
    { id: 1, user: 'Abrar Chowdhury', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', rating: 5, comment: 'Hands down the most helpful guide. Finally a resource that actually tests these on our local Bangladeshi roads and weather conditions!', date: '2 days ago', likes: 18 },
    { id: 2, user: 'Tasnim Karim', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', rating: 4, comment: 'Completely agree about the anti-reflective screen. It makes outdoor maps navigation so much easier. Exceptional write-up.', date: '1 day ago', likes: 6 }
  ]);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);
  
  // Active FAQ Category state
  const [activeFaqCategory, setActiveFaqCategory] = useState('General');

  useEffect(() => {
    // Scroll to top when loading new content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const commentObj = {
      id: comments.length + 1,
      user: 'Anonymous Shopper',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      rating: newCommentRating,
      comment: newCommentText.trim(),
      date: 'Just now',
      likes: 0
    };

    setComments([commentObj, ...comments]);
    setNewCommentText('');
    toast.success('Your review has been posted successfully!');
  };

  const handleLikeComment = (commentId: number) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          liked: !c.liked,
          likes: c.liked ? c.likes - 1 : c.likes + 1
        };
      }
      return c;
    }));
  };

  // Related Products helper
  const relatedProducts = content.relatedProducts || content.productsMentioned || [];

  // Gallery fallback helper (specifically populated for default S24 view to look professional)
  const gallery = content.gallery || (content.id === '1' || content.id === 'samsung-s24' ? [
    { src: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', alt: 'Device back details', caption: 'Premium camera module and finish' },
    { src: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', alt: 'Ergonomics and grip', caption: 'Handheld feel and button placement' },
    { src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', alt: 'Under direct sunlight', caption: 'Highly readable 2600-nit screen' }
  ] : []);

  // Deals helper mapped dynamically from priceStores
  const deals = content.deals || (content.priceStores ? content.priceStores.map((store: any, index: number) => {
    const matchedProduct = (relatedProducts && relatedProducts[index % relatedProducts.length]) || PRODUCTS[index % PRODUCTS.length];
    return {
      id: matchedProduct.id + '-' + index,
      title: `${matchedProduct.title} (${store.name})`,
      brand: matchedProduct.brand || store.name,
      image: matchedProduct.image,
      price: parseInt(store.price.replace(/[^0-9]/g, '')) || matchedProduct.price,
      originalPrice: Math.round((parseInt(store.price.replace(/[^0-9]/g, '')) || matchedProduct.price) * 1.15),
      discount: '15% OFF',
      rating: store.rating || matchedProduct.rating,
      reviewsText: `${matchedProduct.reviews || '50'} reviews`,
      claimedPercent: 42 + (index * 18) % 50,
      likes: matchedProduct.likes || 120
    };
  }) : []);

  // Trust statements helper with professional default values
  const trustStatement = content.trustStatement || [
    { title: 'BSTI Certified Products Only', description: 'All recommended cosmetics, electronics, and food items are verified against Bangladesh Standards and Testing Institution safety regulations.' },
    { title: 'Independent Lab Testing', description: 'Our sound engineers, pilots, and tech curators physically test and unbox all products in local Dhaka environments.' },
    { title: 'Zero Sponsored Bias', description: 'Our editorial opinions remain 100% independent. We only display valid merchant deals with official warranties.' }
  ];

  // Callouts helper with high-quality, contextual local hints
  const callouts = content.callouts || [
    { variant: 'tip' as const, title: 'Pro Tip: Local Warranty Validation', content: 'Always check the importer seal on the retail box. Scan the bar code and match it with the Bangladesh Customs clearance database to ensure you receive a genuine product with official manufacturer warranty support.' },
    { variant: 'warning' as const, title: 'Important Warning: Grey Market Risks', content: 'Purchasing from unauthorized grey market dealers in Dhaka might save you 10-15% upfront, but you risk getting refurbished units with zero warranty coverage or counterfeit chargers.' },
    ...(content.campaignBlock ? [{ variant: 'sponsored' as const, title: 'Sponsored Campaign Note', content: `This review highlights products featured in the ${content.campaignBlock.sponsorName} festive campaign. Use the code ${content.campaignBlock.voucherCode} for maximum savings.` }] : []),
    { variant: 'expert' as const, title: 'Expert Note: Sound/Performance Analysis', content: 'Our laboratory tests show that operating these devices in high-humidity climates (like the summer months in Bangladesh) requires regular cleaning of charging pins and speaker meshes to avoid long-term oxide buildup.' }
  ];

  // Filtered FAQs selector
  const getFilteredFaqs = () => {
    if (!content.faqs) return [];
    if (activeFaqCategory === 'General') {
      return content.faqs;
    }
    const filtered = content.faqs.filter((faq: any) => {
      const q = faq.question.toLowerCase();
      const a = faq.answer.toLowerCase();
      if (activeFaqCategory === 'Warranty') {
        return q.includes('warranty') || a.includes('warranty') || q.includes('guarantee') || a.includes('guarantee');
      }
      if (activeFaqCategory === 'Returns') {
        return q.includes('return') || a.includes('return') || q.includes('exchange') || a.includes('exchange');
      }
      if (activeFaqCategory === 'Payment') {
        return q.includes('payment') || a.includes('payment') || q.includes('price') || a.includes('price') || q.includes('cash') || a.includes('cash');
      }
      return false;
    });
    
    // Fallback category specific FAQs if no match exists in the guide
    if (filtered.length === 0) {
      if (activeFaqCategory === 'Warranty') {
        return [
          { question: `Does ${content.brand || 'the brand'} cover official warranty in Bangladesh?`, answer: 'Yes, official distributor outlets cover 12-month parts and service warranty upon presenting the valid tax invoice.' }
        ];
      }
      if (activeFaqCategory === 'Returns') {
        return [
          { question: 'What is the return/exchange window for online orders?', answer: 'You can exchange any unboxing defect or size misfit at any local authorized retailer within 7 days of delivery.' }
        ];
      }
      if (activeFaqCategory === 'Payment') {
        return [
          { question: 'What payment options and EMI plans are supported?', answer: 'We support all major Bangladeshi credit cards with up to 12-month 0% interest EMI options, bKash, Nagad, and Cash on Delivery.' }
        ];
      }
    }
    return filtered;
  };

  return (
    <div id="choosify_universal_details_page" className="bg-[#F8F9FC] min-h-screen font-sans antialiased text-[#000435] pb-24">
      <ReadingProgressBar isSticky={true} />

      {/* 1. HERO */}
      <ContentHeroCard
        coverImage={content.coverImage}
        categoryBadge={content.type}
        categoryBadgeBg={content.badgeBg}
        title={content.title}
        subtitle={content.subtitle}
        author={content.author}
        publishedDate={content.date}
        readTime={content.readTime}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Discover', href: '/discover' },
          { label: content.type }
        ]}
        onShare={() => toast.success("Share link copied")}
        onSave={() => {
          setIsSaved(!isSaved);
          toast.success(isSaved ? "Removed from saved" : "Saved to your library");
        }}
        onLike={() => {
          setIsFollowing(!isFollowing);
          toast.success("Liked!");
        }}
        isSaved={isSaved}
        isLiked={isFollowing}
      />

      {/* 2. STICKY NAV */}
      <StickyNavigation 
        items={[
          { id: 'overview', label: 'Overview' },
          ...(content.videoUrl ? [{ id: 'media', label: 'Media' }] : []),
          ...(gallery.length ? [{ id: 'gallery', label: 'Gallery' }] : []),
          ...(content.comparisonGuide ? [{ id: 'comparison', label: 'Comparison' }] : []),
          ...(content.creatorReview ? [{ id: 'review', label: 'Creator Review' }] : []),
          ...(content.evaluations?.length ? [{ id: 'evaluations', label: 'Evaluations' }] : []),
          ...(callouts.length ? [{ id: 'callouts', label: 'Callouts' }] : []),
          ...(deals.length || content.campaignBlock ? [{ id: 'shopping-intelligence', label: 'Shopping' }] : []),
          ...(relatedProducts.length ? [{ id: 'products', label: 'Products' }] : []),
          { id: 'comments', label: 'Comments' },
          ...(content.faqs?.length ? [{ id: 'faqs', label: 'FAQs' }] : [])
        ]}
        activeId="overview"
        onItemClick={(id: string) => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="flex-1 w-full max-w-4xl space-y-12">
          
            {/* MEDIA / VIDEO */}
            {content.videoUrl && (
              <section id="media" className="space-y-6">
                <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> MEDIA EXCLUSIVE
                </h2>
                <VideoEmbedCard
                  url={content.videoUrl}
                  platform={
                    content.videoUrl.includes('tiktok') ? 'tiktok' :
                    content.videoUrl.includes('instagram') ? 'instagram' :
                    content.videoUrl.includes('vimeo') ? 'vimeo' :
                    content.videoUrl.includes('facebook') ? 'facebook' : 'youtube'
                  }
                  aspectRatio={content.type === 'Reels' || content.type === 'Shorts' ? '9:16' : '16:9'}
                  title={content.title}
                />
              </section>
            )}

            {/* GALLERY */}
            {gallery && gallery.length > 0 && (
              <section id="gallery" className="space-y-6">
                <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> GALLERY
                </h2>
                <GalleryGrid images={gallery} />
              </section>
            )}

            {/* CALLOUTS */}
            {callouts && callouts.length > 0 && (
              <section id="callouts" className="space-y-4">
                <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> SHOPPING TIPS & WARNINGS
                </h2>
                {callouts.map((callout: any, idx: number) => (
                  <CalloutCard key={idx} variant={callout.variant || 'info'} title={callout.title} content={callout.content} />
                ))}
              </section>
            )}

            {/* SHOPPING INTELLIGENCE & CAMPAIGN */}
            {(deals.length > 0 || content.campaignBlock || (trustStatement && trustStatement.length > 0)) && (
              <section id="shopping-intelligence" className="space-y-6">
                <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> SHOPPING INTELLIGENCE
                </h2>
                {content.campaignBlock && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <DealCard 
                      variant="promo" 
                      deal={{
                        title: content.campaignBlock.sponsorName,
                        subtitle: content.campaignBlock.discountAmount,
                        code: content.campaignBlock.voucherCode,
                        label: 'Campaign',
                        cta: content.campaignBlock.ctaText
                      }} 
                    />
                    <CalloutCard 
                      variant="sponsored" 
                      title="Sponsored Campaign" 
                      content={`This is an official campaign by ${content.campaignBlock.sponsorName}. Valid for ${content.campaignBlock.durationDays} days.`} 
                    />
                  </div>
                )}
                {deals && deals.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {deals.map((deal: any, idx: number) => (
                      <DealCard key={idx} variant="product" product={deal} />
                    ))}
                  </div>
                )}
                {trustStatement && trustStatement.length > 0 && (
                  <TrustStatementCard statements={trustStatement} />
                )}
              </section>
            )}

            {/* COMPARISON / WINNER */}
            {content.comparisonGuide && (
              <section id="comparison">
                <ComparisonGuideCard
                  productA={{
                    name: content.comparisonGuide.productA.name,
                    image: content.comparisonGuide.productA.image,
                    score: content.comparisonGuide.productA.score,
                    price: content.comparisonGuide.productA.price,
                    specs: content.comparisonGuide.productA.specs,
                    badge: "Winner",
                    badgeVariant: "orange"
                  }}
                  productB={{
                    name: content.comparisonGuide.productB.name,
                    image: content.comparisonGuide.productB.image,
                    score: content.comparisonGuide.productB.score,
                    price: content.comparisonGuide.productB.price,
                    specs: content.comparisonGuide.productB.specs,
                    badge: "Runner Up",
                    badgeVariant: "blue"
                  }}
                  comparisonSummary={content.comparisonGuide.comparisonVerdict}
                />
              </section>
            )}

            {/* OVERALL WINNER / QUICK VIEW (from buying guides) */}
            {content.overallWinner && (
              <section id="winner">
                 <ComparisonGuideCard
                  productA={{
                    name: content.overallWinner.product,
                    image: content.overallWinner.image,
                    score: content.overallWinner.score,
                    price: "View Price",
                    specs: content.overallWinner.highlights,
                    badge: content.overallWinner.badge,
                    badgeVariant: "orange"
                  }}
                  productB={{
                    name: "Alternative Option",
                    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
                    score: 8.0,
                    price: "View Price",
                    specs: ["Great alternative", "Similar specs"],
                    badge: "Runner Up",
                    badgeVariant: "blue"
                  }}
                />
              </section>
            )}

            {/* TAKEAWAYS / CHECKLIST */}
            {content.takeaways && content.takeaways.length > 0 && (
              <ChecklistCard 
                title="Key Takeaways"
                items={content.takeaways.map((t: any, i: number) => ({ id: String(i), text: t.text, completed: true }))}
              />
            )}

            {/* RICH CONTENT BODY (Simulated from evaluations or generic content) */}
            {content.evaluations && content.evaluations.length > 0 && (
              <section id="evaluations" className="space-y-8">
                {content.evaluations.map((evalItem: any) => (
                  <div key={evalItem.id}>
                    <RichTextSection>
                      <h2>{evalItem.title}</h2>
                      <p>{evalItem.content}</p>
                    </RichTextSection>
                    {evalItem.score && (
                      <div className="mt-4">
                        <Badge variant="green">Score: {evalItem.score}/10</Badge>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* PROS & CONS */}
            {content.creatorReview?.pros && content.creatorReview?.cons && (
              <section id="pros-cons">
                <ProsConsCard 
                  pros={content.creatorReview.pros}
                  cons={content.creatorReview.cons}
                />
              </section>
            )}

            {/* VERDICT */}
            {content.verdict && (
              <section id="verdict">
                <VerdictCard 
                  verdict={content.verdict.overall}
                  recommendation={content.verdict.summary}
                  bestFor={content.verdict.buyIf}
                  avoidIf={content.verdict.notForYouIf}
                  chips={content.verdict.chips}
                />
              </section>
            )}

            {/* RELATED BRANDS */}
            {content.relatedBrands && content.relatedBrands.length > 0 && (
              <section id="brands">
                <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> RELATED BRANDS
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {content.relatedBrands.map((brand: any) => (
                    <BrandCard key={brand.id} brand={brand} />
                  ))}
                </div>
              </section>
            )}

                        {/* RELATED BRANDS */}
            <section id="brands">
              <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> FEATURED BRANDS
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <BrandCard brand={{
                  id: 'samsung',
                  name: 'Samsung',
                  logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop',
                  isVerified: true,
                  rating: 4.7, reviews: 2100000, category: "Tech", priceRange: "৳10K-100K"
                }} />
                <BrandCard brand={{
                  id: 'apple',
                  name: 'Apple',
                  logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&h=100&fit=crop',
                  isVerified: true,
                  rating: 4.9, reviews: 3500000, category: "Tech", priceRange: "৳20K-200K"
                }} />
                <BrandCard brand={{
                  id: 'xiaomi',
                  name: 'Xiaomi',
                  logo: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop',
                  isVerified: true,
                  rating: 4.5, reviews: 1800000, category: "Tech", priceRange: "৳5K-50K"
                }} />
                <BrandCard brand={{
                  id: 'sony',
                  name: 'Sony',
                  logo: 'https://images.unsplash.com/photo-1514222325255-738d8f28f117?w=100&h=100&fit=crop',
                  isVerified: true,
                  rating: 4.8, reviews: 1200000, category: "Tech", priceRange: "৳15K-150K"
                }} />
              </div>
            </section>

            {/* AUTHOR */}
            <section id="author">
              <ContentAuthorCard 
                author={content.author}
                onFollow={() => {
                  setIsFollowing(!isFollowing);
                  toast.success(isFollowing ? "Unfollowed" : "Following author");
                }}
                isFollowing={isFollowing}
              />
            </section>

            {/* RELATED PRODUCTS */}
            {relatedProducts && relatedProducts.length > 0 && (
              <section id="products" className="space-y-6">
                <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> FEATURED PRODUCTS
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
                  {relatedProducts.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* PUBLIC REVIEWS / COMMENTS */}
            <section id="comments" className="space-y-6">
              <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> COMMUNITY DISCUSSION
              </h2>
              
              {/* Comment Input Form using Design System Button */}
              <form onSubmit={handlePostComment} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-extrabold text-[#000435] uppercase tracking-wider">Write a community review</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewCommentRating(star)}
                        className="p-0.5 focus:outline-none"
                      >
                        <Star className={cn("w-5 h-5", star <= newCommentRating ? "fill-[#FF5B00] text-[#FF5B00]" : "text-slate-300")} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Share your experience with this product in Bangladesh..."
                    className="w-full min-h-[100px] border border-slate-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-[#FF5B00]/20 focus:border-[#FF5B00] focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" size="md">
                    Post Review
                  </Button>
                </div>
              </form>

              <div className="space-y-4 mb-6">
                {comments.map((c: any) => (
                  <PublicReviewCard 
                    key={c.id}
                    review={{
                      name: c.user,
                      avatar: c.avatar,
                      rating: c.rating,
                      comment: c.comment,
                      date: c.date,
                      helpful: c.likes
                    }}
                    onHelpfulClick={() => handleLikeComment(c.id)}
                  />
                ))}
              </div>
            </section>

            {/* FAQ */}
            {content.faqs && content.faqs.length > 0 && (
              <section id="faqs" className="space-y-6">
                <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> FREQUENTLY ASKED QUESTIONS
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['General', 'Warranty', 'Returns', 'Payment'].map((category) => (
                    <FAQPill 
                      key={category} 
                      label={category} 
                      isActive={activeFaqCategory === category}
                      onClick={() => setActiveFaqCategory(category)}
                    />
                  ))}
                </div>

                {/* Editorial context FaqPills */}
                <div className="flex flex-wrap gap-2.5 mb-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <FaqPill 
                    label="Who wrote this guide?" 
                    answer="This guide is curated by our certified category experts after rigorous hands-on product testing and retail verification."
                  />
                  <FaqPill 
                    label="Is this review sponsored?" 
                    answer="No, our reviews are 100% independent. We do not accept sponsorships to bias our product recommendations or comparisons."
                  />
                  <FaqPill 
                    label="How often is this updated?" 
                    answer="We re-verify prices, stocks, and consumer ratings every single week to ensure you get the absolute latest shopping intelligence."
                  />
                  <FaqPill 
                    label="Where are stores sourced?" 
                    answer="We pull pricing dynamically from verified physical and online retail partners across Bangladesh to offer live comparison data."
                  />
                  <FaqPill 
                    label="How to ask custom queries?" 
                    answer="Feel free to scroll down to the Community Discussion section below to ask any specific product question to our experts!"
                  />
                </div>

                <div className="space-y-4">
                  {getFilteredFaqs().map((faq: any, idx: number) => (
                    <FAQAccordionCard key={idx} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </section>
            )}

            {/* RELATED CONTENT */}
            {content.relatedGuides && content.relatedGuides.length > 0 && (
              <section id="related-content">
                <h2 className="text-2xl font-black text-[#000435] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#FF5B00] rounded-full" /> YOU MAY ALSO LIKE
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {content.relatedGuides.map((guide: any) => (
                    guide.category === 'CREATOR REVIEW' ? (
                      <CreatorReviewCard 
                        key={guide.id}
                        review={{
                          id: guide.id,
                          cover: guide.cover,
                          title: guide.title,
                          creator: {
                            name: "Author",
                            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
                            verified: true
                          },
                          duration: guide.readTime,
                          views: guide.views,
                          date: "Recently",
                          category: guide.category,
                          categoryColor: guide.badgeClass,
                          platform: 'choosify'
                        }}
                        onClick={() => navigate(`/discover/${guide.id}`)}
                      />
                    ) : (
                      <SpotlightCard 
                        key={guide.id}
                        variant="standard"
                        cover={guide.cover}
                        title={guide.title}
                        category={guide.category}
                        badgeBg={guide.badgeClass}
                        publisher="Choosify"
                        date={guide.readTime}
                        views={guide.views}
                        onClick={() => navigate(`/discover/${guide.id}`)}
                      />
                    )
                  ))}
                </div>
              </section>
            )}

            {/* POPULAR TAGS */}
            {content.tags && content.tags.length > 0 && (
              <section id="tags" className="pt-8 border-t border-slate-200/60">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Popular searches</h3>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag: string, idx: number) => (
                    <Badge key={idx} variant="outline" className="text-slate-600 border-slate-200 cursor-pointer hover:border-[#FF5B00] hover:text-[#FF5B00]">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Sidebar - TOC */}
          <aside className="hidden lg:block w-80 shrink-0">
             <ContentTOC 
                headings={[
                  ...(content.videoUrl ? [{ id: 'media', title: 'Video Review', level: 2 }] : []),
                  ...(gallery.length ? [{ id: 'gallery', title: 'Gallery', level: 2 }] : []),
                  ...(content.comparisonGuide ? [{ id: 'comparison', title: 'Comparison', level: 2 }] : []),
                  ...(content.evaluations?.length ? [{ id: 'evaluations', title: 'Evaluations', level: 2 }] : []),
                  ...(callouts.length ? [{ id: 'callouts', title: 'Shopping Tips', level: 2 }] : []),
                  ...(deals.length || content.campaignBlock ? [{ id: 'shopping-intelligence', title: 'Shopping', level: 2 }] : []),
                  ...(content.verdict ? [{ id: 'verdict', title: 'The Verdict', level: 2 }] : []),
                  ...(relatedProducts.length ? [{ id: 'products', title: 'Related Products', level: 2 }] : []),
                  { id: 'comments', title: 'Community Discussion', level: 2 },
                  ...(content.faqs?.length ? [{ id: 'faqs', title: 'FAQs', level: 2 }] : [])
                ]}
             />
          </aside>

        </div>
      </main>
    </div>
  );
}
