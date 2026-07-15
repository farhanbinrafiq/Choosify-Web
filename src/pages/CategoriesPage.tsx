import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Search, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Camera, 
  Watch, 
  Speaker, 
  Gamepad, 
  Tv,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CategoryCard } from '../components/CategoryCard';

// ==========================================
// MOCK DATA
// ==========================================

const CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Smartphone,
    color: 'bg-blue-500/10 text-blue-600',
    itemCount: 12450,
    subcategories: [
      'Smartphones', 'Laptops', 'Tablets', 'Wearables', 'Audio', 'Cameras'
    ],
    featuredBrand: 'Apple',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    icon: Watch,
    color: 'bg-pink-500/10 text-pink-600',
    itemCount: 45200,
    subcategories: [
      'Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Jewelry'
    ],
    featuredBrand: 'Nike',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'home',
    name: 'Home & Living',
    icon: Tv,
    color: 'bg-amber-500/10 text-amber-600',
    itemCount: 32100,
    subcategories: [
      'Furniture', 'Decor', 'Kitchen', 'Bedding', 'Bath', 'Lighting'
    ],
    featuredBrand: 'IKEA',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'beauty',
    name: 'Health & Beauty',
    icon: Award,
    color: 'bg-emerald-500/10 text-emerald-600',
    itemCount: 18900,
    subcategories: [
      'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Personal Care'
    ],
    featuredBrand: 'Sephora',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    icon: TrendingUp,
    color: 'bg-orange-500/10 text-orange-600',
    itemCount: 15400,
    subcategories: [
      'Exercise Equipment', 'Outdoor Gear', 'Athletic Clothing', 'Cycling'
    ],
    featuredBrand: 'Patagonia',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2000&auto=format&fit=crop'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Gamepad,
    color: 'bg-purple-500/10 text-purple-600',
    itemCount: 8700,
    subcategories: [
      'Consoles', 'Video Games', 'Accessories', 'PC Gaming', 'VR'
    ],
    featuredBrand: 'PlayStation',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop'
  }
];

const TRENDING_SEARCHES = [
  "iPhone 15 Pro Max",
  "Nike Air Force 1",
  "Sony WH-1000XM5",
  "Dyson Airwrap",
  "PlayStation 5",
  "Herman Miller"
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export function CategoriesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Record<string, boolean>>({});
  const [showAllSubcategories, setShowAllSubcategories] = useState<Record<string, boolean>>({});

  // Filter categories based on search
  const filteredCategories = CATEGORIES.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.subcategories.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategoryIds(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const toggleShowAll = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllSubcategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F7F9] text-slate-800 font-sans pb-24">
      
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-100 pt-16 pb-12 px-6 md:px-10">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#000435] tracking-tight mb-4">
                Explore Categories
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">
                Discover millions of products across thousands of trusted brands. Everything you need, organized perfectly.
              </p>
            </div>

            {/* SEARCH BAR */}
            <div className="w-full md:w-[400px] relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5B00]/20 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              />
            </div>
          </div>

          {/* TRENDING SEARCHES */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mr-2">Trending:</span>
            {TRENDING_SEARCHES.map((term, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(term)}
                className="text-sm font-medium text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 mt-12 w-full">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-[#000435] mb-2">No categories found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your search terms or browse all categories.</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-8 px-8 py-3 bg-[#000435] text-white rounded-xl font-bold hover:bg-[#FF5B00] transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredCategories.map((category, idx) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  title={category.name}
                  image={category.image}
                  count={category.itemCount}
                  items={category.subcategories}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* BOTTOM CTA */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 mt-16">
        <div className="bg-[#000435] rounded-[32px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5B00]/20 rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-slate-300 font-medium text-lg">
              Our complete catalog includes millions of items. Use our advanced search or browse all products.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <Link 
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#FF5B00] text-white rounded-2xl font-bold text-lg hover:bg-[#EB4501] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
            >
              Browse All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
