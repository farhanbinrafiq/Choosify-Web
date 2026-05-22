import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { DashboardProvider } from './context/DashboardContext';
import { GlobalStateProvider } from './context/GlobalStateContext';
import { Toaster } from 'react-hot-toast';
import { MobileNav } from './components/MobileNav';
import { AnimatePresence, motion } from 'motion/react';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingFallback } from './components/LoadingFallback';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AllProductsPage = lazy(() => import('./pages/AllProductsPage').then(m => ({ default: m.AllProductsPage })));
const BrandsPage = lazy(() => import('./pages/BrandsPage').then(m => ({ default: m.BrandsPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const BrandDetailPage = lazy(() => import('./pages/BrandDetailPage').then(m => ({ default: m.BrandDetailPage })));
const DealsPage = lazy(() => import('./pages/DealsPage').then(m => ({ default: m.DealsPage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(m => ({ default: m.ComparePage })));
const GuidesPage = lazy(() => import('./pages/GuidesPage').then(m => ({ default: m.GuidesPage })));
const GuideDetailPage = lazy(() => import('./pages/GuideDetailPage').then(m => ({ default: m.GuideDetailPage })));
const GuideProductsPage = lazy(() => import('./pages/GuideProductsPage').then(m => ({ default: m.GuideProductsPage })));
const LoginSignUpPage = lazy(() => import('./pages/LoginSignUpPage').then(m => ({ default: m.LoginSignUpPage })));
const PostOfferPage = lazy(() => import('./pages/PostOfferPage').then(m => ({ default: m.PostOfferPage })));
const BrandProductPage = lazy(() => import('./pages/BrandProductPage').then(m => ({ default: m.BrandProductPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const BrandDealsPage = lazy(() => import('./pages/BrandDealsPage').then(m => ({ default: m.BrandDealsPage })));
const RetailCartPage = lazy(() => import('./pages/RetailCartPage').then(m => ({ default: m.RetailCartPage })));
const B2BCartPage = lazy(() => import('./pages/B2BCartPage').then(m => ({ default: m.B2BCartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const SellerIncomingOrdersPage = lazy(() => import('./pages/SellerIncomingOrdersPage').then(m => ({ default: m.SellerIncomingOrdersPage })));
const SellerOrderDetailsPage = lazy(() => import('./pages/SellerOrderDetailsPage').then(m => ({ default: m.SellerOrderDetailsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Shell for all 13 screens overview
function Overview() {
  const screens = [
    { title: "01. Homepage", id: "screen-1", content: <HomePage /> },
    { title: "02. All Products", id: "screen-2", content: <AllProductsPage /> },
    { title: "03. List View", id: "screen-3", content: <AllProductsPage /> },
    { title: "04. All Brands", id: "screen-4", content: <BrandsPage /> },
    { title: "05. All Categories", id: "screen-5", content: <CategoriesPage /> },
    { title: "06. Brand Detail", id: "screen-6", content: <BrandDetailPage /> },
    { title: "07. Product Detail", id: "screen-7", content: <ProductDetailPage /> },
    { title: "08. Deals Page", id: "screen-8", content: <DealsPage /> },
    { title: "09. Compare Tool", id: "screen-9", content: <ComparePage /> },
    { title: "10. Recommendations", id: "screen-10", content: <GuidesPage /> },
    { title: "12. Login / Sign Up", id: "screen-12", content: <LoginSignUpPage /> },
    { title: "13. Post Your Offer", id: "screen-13", content: <PostOfferPage /> },
    { title: "14. Brand Wise Deals", id: "screen-14", content: <BrandDealsPage /> },
  ];

  return (
    <div className="flex bg-[#f4f7f9] h-screen overflow-hidden font-sans">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-navy border-r border-white/10 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
           <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 border-2 border-orange-primary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 border-2 border-orange-primary rounded-full"></div>
              </div>
              <span className="text-white font-bold tracking-tight lowercase">choosify.bd</span>
           </div>
           <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Design System v1.0</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
          <div className="text-[9px] uppercase tracking-widest text-white/30 mb-4 px-2 font-black">13-Screen Stack</div>
          {screens.map((screen) => (
            <a
              key={screen.id}
              href={`#${screen.id}`}
              className="block px-3 py-2 rounded text-[#D6E1EC]/60 hover:text-white hover:bg-white/5 text-[11px] font-semibold transition-all border border-transparent hover:border-white/5"
            >
              {screen.title}
            </a>
          ))}
        </div>
        
        <div className="p-4 bg-black/20 text-center">
           <button className="w-full py-2 bg-orange-primary text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg shadow-orange-primary/20">
              Export PDF
           </button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <Suspense fallback={<LoadingFallback />}>
          <div className="p-12 space-y-32">
            {screens.map((screen) => (
              <div key={screen.id}>
                <ScreenPreview title={screen.title} id={screen.id}>
                  {screen.content}
                </ScreenPreview>
              </div>
            ))}
          </div>
        </Suspense>
        
        <footer className="py-20 text-center border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-30 grayscale saturate-0">
            <div className="w-6 h-6 border-2 border-navy rounded-full flex items-center justify-center">
              <div className="w-2 h-2 border-2 border-navy rounded-full"></div>
            </div>
            <span className="text-navy font-bold tracking-tight lowercase">choosify.bd</span>
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Bangladesh's Most Trusted Product Discovery Platform</p>
        </footer>
      </main>
    </div>
  );
}

function ScreenPreview({ title, children, id }: { title: string, children: React.ReactNode, id: string }) {
  return (
    <div id={id} className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between border-b-2 border-navy/10 pb-4">
        <div className="flex items-baseline gap-4">
          <h2 className="text-3xl font-black text-navy uppercase tracking-tighter italic">{title}</h2>
          <span className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Responsive Desktop</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-500 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-green-accent"></div>
              Active View
           </div>
           <div className="px-3 py-1 bg-navy text-white text-[10px] font-bold rounded uppercase tracking-widest">1440 × 900</div>
        </div>
      </div>
      <div className="w-full bg-white shadow-high-density overflow-hidden border border-gray-100 rounded-lg relative aspect-video">
        <div className="h-full overflow-y-auto">
          <Navbar />
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isOverview = location.pathname === '/overview';

  return (
    <div className="antialiased selection:bg-orange-primary selection:text-white">
      {!isOverview && <Navbar />}
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/products" element={<PageWrapper><AllProductsPage /></PageWrapper>} />
            <Route path="/products/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
            <Route path="/brands" element={<PageWrapper><BrandsPage /></PageWrapper>} />
            <Route path="/brands/:id" element={<PageWrapper><BrandDetailPage /></PageWrapper>} />
            <Route path="/brands/:id/products" element={<PageWrapper><BrandProductPage /></PageWrapper>} />
            <Route path="/categories" element={<PageWrapper><CategoriesPage /></PageWrapper>} />
            <Route path="/deals" element={<PageWrapper><DealsPage /></PageWrapper>} />
            <Route path="/compare" element={<PageWrapper><ComparePage /></PageWrapper>} />
            <Route path="/guides" element={<PageWrapper><GuidesPage /></PageWrapper>} />
            <Route path="/guides/:id" element={<PageWrapper><GuideDetailPage /></PageWrapper>} />
            <Route path="/guides/:id/products" element={<PageWrapper><GuideProductsPage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><LoginSignUpPage /></PageWrapper>} />
            <Route path="/post-offer" element={<PageWrapper><PostOfferPage /></PageWrapper>} />
            <Route path="/brand-deals" element={<PageWrapper><BrandDealsPage /></PageWrapper>} />
            <Route path="/cart/retail" element={<PageWrapper><RetailCartPage /></PageWrapper>} />
            <Route path="/cart/b2b" element={<PageWrapper><B2BCartPage /></PageWrapper>} />
            <Route path="/checkout" element={<PageWrapper><CheckoutPage /></PageWrapper>} />
            <Route path="/order-success" element={<PageWrapper><OrderSuccessPage /></PageWrapper>} />
            <Route path="/order-tracking" element={<PageWrapper><OrderTrackingPage /></PageWrapper>} />
            <Route path="/seller/orders" element={<PageWrapper><SellerIncomingOrdersPage /></PageWrapper>} />
            <Route path="/seller/orders/:id" element={<PageWrapper><SellerOrderDetailsPage /></PageWrapper>} />
            <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
            <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      {!isOverview && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <GlobalStateProvider>
          <DashboardProvider>
            <Toaster 
              position="top-center" 
              toastOptions={{
                style: {
                  background: '#050514',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '11px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontStyle: 'italic',
                  borderRadius: '12px',
                },
              }} 
            />
            <ScrollToTop />
            <AppContent />
            <MobileNav />
          </DashboardProvider>
        </GlobalStateProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}


function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
