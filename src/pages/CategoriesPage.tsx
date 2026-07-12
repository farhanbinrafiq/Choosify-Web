import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface CategoryCardData {
  id: string;
  name: string;
  image: string;
  icon: keyof typeof LucideIcons;
  iconBg: string;
  products: number;
  brands: number;
  deals: number;
  description: string;
}

export function CategoriesPage() {
  const navigate = useNavigate();
  const [selectedPill, setSelectedPill] = useState<string>('ALL CATEGORIES');

  // Exact 10 categories from reference image with exact stats
  const categories: CategoryCardData[] = [
    {
      id: 'fashion-lifestyle',
      name: 'Fashion & Lifestyle',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=450&fit=crop',
      icon: 'Shirt',
      iconBg: 'bg-[#FF4A82]',
      products: 320,
      brands: 85,
      deals: 18,
      description: 'Discover the latest clothing trends, footwear, bags, and fashion accessories.'
    },
    {
      id: 'jewelry-accessories',
      name: 'Jewelry & Accessories',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=450&fit=crop',
      icon: 'Gem',
      iconBg: 'bg-[#9D3FE7]',
      products: 248,
      brands: 62,
      deals: 12,
      description: 'Elegant diamond rings, luxury watches, precious necklaces, and everyday jewelry.'
    },
    {
      id: 'mobiles-phones',
      name: 'Mobiles & Phones',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=450&fit=crop',
      icon: 'Smartphone',
      iconBg: 'bg-[#2F80ED]',
      products: 156,
      brands: 35,
      deals: 10,
      description: 'Explore smartphones, tablets, smartwatches, and essential accessories.'
    },
    {
      id: 'sporting-playstation',
      name: 'Sporting & PlayStation',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=450&fit=crop',
      icon: 'Dumbbell',
      iconBg: 'bg-[#27AE60]',
      products: 184,
      brands: 48,
      deals: 14,
      description: 'Fitness gear, running shoes, console consoles, gaming controllers, and accessories.'
    },
    {
      id: 'gaming-entertainment',
      name: 'Gaming & Entertainment',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=450&fit=crop',
      icon: 'Gamepad2',
      iconBg: 'bg-[#6F52ED]',
      products: 210,
      brands: 55,
      deals: 16,
      description: 'RGB desktop builds, gaming keyboards, headsets, and immersive media systems.'
    },
    {
      id: 'food-restaurants',
      name: 'Food & Restaurants',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=450&fit=crop',
      icon: 'Utensils',
      iconBg: 'bg-[#F2994A]',
      products: 312,
      brands: 78,
      deals: 22,
      description: 'Fresh organic groceries, restaurant deliveries, dining deals, and sweet bakes.'
    },
    {
      id: 'tech-electronics',
      name: 'Tech & Electronics',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=450&fit=crop',
      icon: 'Laptop',
      iconBg: 'bg-[#1A5ED4]',
      products: 582,
      brands: 120,
      deals: 30,
      description: 'Premium laptops, development desktops, active headphones, and productivity tech.'
    },
    {
      id: 'tv-appliances',
      name: 'TV & Appliances',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&h=450&fit=crop',
      icon: 'Tv',
      iconBg: 'bg-[#00D1B2]',
      products: 268,
      brands: 65,
      deals: 15,
      description: 'Modern smart TVs, smart home refrigerators, ovens, and helpful workspace devices.'
    },
    {
      id: 'home-living',
      name: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=450&fit=crop',
      icon: 'Home',
      iconBg: 'bg-[#B57C48]',
      products: 476,
      brands: 95,
      deals: 20,
      description: 'Designer armchairs, workspace lighting, cozy beds, and modern lifestyle ornaments.'
    },
    {
      id: 'baby-maternity',
      name: 'Baby & Maternity',
      image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&h=450&fit=crop',
      icon: 'Smile',
      iconBg: 'bg-[#FD7082]',
      products: 198,
      brands: 42,
      deals: 10,
      description: 'Organic baby food, adorable teddy bears, secure play toys, and cozy diapers.'
    }
  ];

  // Map pill categories to filter the list
  const filteredCategories = categories.filter((cat) => {
    if (selectedPill === 'ALL CATEGORIES') return true;
    if (selectedPill === 'Fashion' && (cat.id === 'fashion-lifestyle' || cat.id === 'jewelry-accessories')) return true;
    if (selectedPill === 'Tech & Electronics' && (cat.id === 'tech-electronics' || cat.id === 'mobiles-phones' || cat.id === 'gaming-entertainment' || cat.id === 'tv-appliances')) return true;
    if (selectedPill === 'Home & Living' && cat.id === 'home-living') return true;
    if (selectedPill === 'Beauty & Health' && cat.id === 'baby-maternity') return true;
    if (selectedPill === 'Sports & Outdoors' && cat.id === 'sporting-playstation') return true;
    return false;
  });

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="bg-[#F6F8FB] min-h-screen relative font-sans pb-16">
      
      {/* SECTION 1: UPPER GLOWING HERO BANNER - Deep violet to warm orange radial highlight */}
      <div className="bg-gradient-to-r from-[#0C0A24] via-[#120F35] to-[#0D0B26] py-12 md:py-16 text-white relative overflow-hidden shadow-sm">
        {/* Abstract grids and background blur glows exactly matching screenshot */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-[130px] pointer-events-none -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[130px] pointer-events-none -translate-y-1/2" />
        
        <div className="max-w-[1360px] mx-auto px-6 relative z-10">
          
          {/* Breadcrumb matching exact design */}
          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-5">
            <Link to="/" className="hover:text-[#E8500A] transition-colors">Home</Link>
            <LucideIcons.ChevronRight className="w-2.5 h-2.5 text-gray-600" />
            <span className="text-white">Categories</span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-3 max-w-xl text-left">
            Shop by <span className="text-[#E8500A]">Categories</span>
          </h1>
          <p className="text-gray-300 text-xs md:text-sm font-semibold max-w-2xl mb-8 leading-relaxed text-left">
            Explore 2,500+ products across every category. Discover, compare & shop from verified brands.
          </p>

          {/* Row of 5 Glowing Stat Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl">
            {[
              { label: 'Products', value: '2,500+', icon: 'ShoppingBag', color: 'text-[#E8500A] bg-[#E8500A]/10' },
              { label: 'Verified Brands', value: '500+', icon: 'ShieldCheck', color: 'text-[#2F80ED] bg-[#2F80ED]/10' },
              { label: 'Deals & Offers', value: '120+', icon: 'Tag', color: 'text-[#27AE60] bg-[#27AE60]/10' },
              { label: 'Buying Guides', value: '300+', icon: 'BookOpen', color: 'text-[#6F52ED] bg-[#6F52ED]/10' },
              { label: 'Creators', value: '200+', icon: 'Users', color: 'text-[#FD7082] bg-[#FD7082]/10' }
            ].map((stat, idx) => {
              const Icon = (LucideIcons as any)[stat.icon] || LucideIcons.Package;
              return (
                <div 
                  key={idx} 
                  className="bg-[#12102E]/60 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5 backdrop-blur-md hover:border-white/10 transition-colors"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", stat.color)}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="text-left">
                    <p className="font-mono text-base font-black text-white leading-none">{stat.value}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 leading-none tracking-wider">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: EXPLORE / QUICK FILTER BAR (Overlapping the banner) */}
      <div className="max-w-[1360px] mx-auto px-4 -mt-6 relative z-30 mb-10">
        <div className="bg-white rounded-2xl border border-[#e8edf2] shadow-sm p-3.5 flex items-center flex-wrap gap-2 justify-start md:justify-between">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider px-2">Explore:</span>
            
            {[
              'ALL CATEGORIES',
              'Fashion',
              'Tech & Electronics',
              'Home & Living',
              'Beauty & Health',
              'Sports & Outdoors',
              'More Categories'
            ].map((pill) => {
              const isActive = selectedPill === pill;
              return (
                <button
                  key={pill}
                  onClick={() => setSelectedPill(pill)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-1",
                    isActive
                      ? "bg-[#FFF0E8] border-[#E8500A] text-[#E8500A]"
                      : "bg-white border-gray-100 hover:border-gray-300 text-gray-600 hover:text-gray-900"
                  )}
                >
                  {pill} {pill !== 'ALL CATEGORIES' && <span className="opacity-50 font-sans ml-0.5 font-normal">&gt;</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: ALL CATEGORIES HEADER & ACTION BUTTONS */}
      <div className="max-w-[1360px] mx-auto px-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h2 className="font-sans text-xl md:text-2xl font-black uppercase text-[#1A1D4E] tracking-tight leading-none mb-2">
            All Categories
          </h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide leading-none">
            Choose a category to explore products, brands, deals and more
          </p>
        </div>

        {/* Categories action buttons matching visual mock */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E8500A] bg-[#FFF0E8] rounded-xl text-[#E8500A] text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors hover:bg-orange-100/50">
            <LucideIcons.Grid className="w-3.5 h-3.5" /> CATEGORIES
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-300 bg-white rounded-xl text-[#1A1D4E] text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors">
            <LucideIcons.List className="w-3.5 h-3.5 text-gray-400" /> BROWSE
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-300 bg-white rounded-xl text-[#1A1D4E] text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors">
            <LucideIcons.Sliders className="w-3.5 h-3.5 text-gray-400" /> FILTER
          </button>
        </div>
      </div>

      {/* SECTION 4: THE 10 CATEGORY CARDS GRID */}
      <div className="max-w-[1360px] mx-auto px-6 mb-12">
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <LucideIcons.PackageX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-semibold text-sm uppercase tracking-wide">No categories found matching your filter.</p>
            <button 
              onClick={() => setSelectedPill('ALL CATEGORIES')}
              className="mt-4 px-4 py-2 bg-[#E8500A] text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {filteredCategories.map((cat) => {
              const Icon = (LucideIcons as any)[cat.icon] || LucideIcons.Package;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="group cursor-pointer bg-white rounded-2xl border border-[#e8edf2] p-3 shadow-sm hover:border-[#E8500A]/30 hover:shadow-md transition-all duration-300 flex flex-col text-left"
                >
                  {/* Card Image Wrapper with aspect-[1.4] */}
                  <div className="aspect-[1.4] w-full relative overflow-hidden bg-slate-900 rounded-xl mb-6 shrink-0">
                    <img
                      src={cat.image}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                    {/* Overlapping circle icon in lower-left corner of the image */}
                    <div className="absolute -bottom-4 left-3.5 z-20">
                      <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md border-2 border-white", cat.iconBg)}>
                        <Icon className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Stats */}
                  <div className="px-1 pb-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans text-xs font-black uppercase text-[#1A1D4E] tracking-tight group-hover:text-[#E8500A] transition-colors leading-tight mb-1.5">
                        {cat.name}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-semibold leading-relaxed line-clamp-2 mb-4">
                        {cat.description}
                      </p>
                    </div>

                    {/* Stats footer line */}
                    <div className="flex items-center justify-between text-[9px] font-bold border-t border-gray-100 pt-3 mt-1 uppercase tracking-wider text-gray-500">
                      <span>
                        <span className="text-[#E8500A] font-extrabold mr-0.5">{cat.products}</span> Products
                      </span>
                      <span className="text-gray-300">|</span>
                      <span>
                        <span className="text-[#E8500A] font-extrabold mr-0.5">{cat.brands}</span> Brands
                      </span>
                      <span className="text-gray-300">|</span>
                      <span>
                        <span className="text-[#E8500A] font-extrabold mr-0.5">{cat.deals}</span> Deals
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 5: VALUE PROPOSITIONS BAR / TRUST BAR */}
      <div className="max-w-[1360px] mx-auto px-6 mb-10">
        <div className="bg-white border border-[#e8edf2] rounded-2xl p-5 md:p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { 
              icon: 'ShieldCheck', 
              color: 'bg-blue-50 text-blue-500', 
              title: '100% Verified', 
              desc: 'All products & brands are verified' 
            },
            { 
              icon: 'Tag', 
              color: 'bg-emerald-50 text-emerald-500', 
              title: 'Best Price Guarantee', 
              desc: 'Find the best prices with smart comparison' 
            },
            { 
              icon: 'RotateCcw', 
              color: 'bg-orange-50 text-orange-500', 
              title: 'Easy Returns', 
              desc: '7-day easy returns on eligible products' 
            },
            { 
              icon: 'Lock', 
              color: 'bg-indigo-50 text-indigo-500', 
              title: 'Secure Payments', 
              desc: '100% secure payments protected by SSL' 
            },
            { 
              icon: 'Headphones', 
              color: 'bg-purple-50 text-purple-500', 
              title: '24/7 Support', 
              desc: 'We are here to help you anytime' 
            }
          ].map((item, i) => {
            const Icon = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;
            return (
              <div key={i} className="flex items-start gap-3 text-left">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", item.color)}>
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-[#1A1D4E] tracking-tight leading-none mb-1.5">{item.title}</h4>
                  <p className="text-[9px] text-gray-400 font-bold leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 6: POPULAR SEARCHES */}
      <div className="max-w-[1360px] mx-auto px-6 text-left">
        <div className="bg-white border border-[#e8edf2] rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <h3 className="font-sans text-[11px] font-black uppercase text-[#1A1D4E] tracking-wider leading-none">
              Popular Searches
            </h3>
            <Link to="/products" className="text-[10px] font-black text-[#E8500A] uppercase tracking-wider flex items-center gap-0.5 hover:text-[#CF4400] transition-colors">
              View All <LucideIcons.ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'iPhone 15', 
              'Samsung S24', 
              'AirPods Pro', 
              'MacBook Air', 
              'Sony WH-1000XM5', 
              'Nike Air Max', 
              'Galaxy Watch 6', 
              'Home Appliances', 
              'Gaming PC'
            ].map((tag) => (
              <Link
                key={tag}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className="px-3.5 py-2 bg-[#F6F8FB] hover:bg-[#FFF0E8] border border-[#e8edf2] hover:border-[#E8500A]/30 rounded-xl text-[10px] font-bold text-gray-600 hover:text-[#E8500A] transition-all flex items-center gap-1.5"
              >
                <LucideIcons.Search className="w-3 h-3 text-gray-400" />
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
