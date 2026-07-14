import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { FloatingOverlays } from './components/FloatingOverlays';
import { DashboardProvider } from './context/DashboardContext';
import { GlobalStateProvider } from './context/GlobalStateContext';
import { DrawerFilterProvider, FloatingFilterProvider } from './components/FilterEngine';
import { Toaster } from 'react-hot-toast';
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
const ContentDetailsPage = lazy(() => import('./pages/ContentDetailsPage').then(m => ({ default: m.ContentDetailsPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));
const PostOfferPage = lazy(() => import('./pages/PostOfferPage').then(m => ({ default: m.PostOfferPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const CreatorsPage = lazy(() => import('./pages/CreatorsPage').then(m => ({ default: m.CreatorsPage })));
const CreatorProfilePage = lazy(() => import('./pages/CreatorProfilePage').then(m => ({ default: m.CreatorProfilePage })));

const SuggestBrandPage = lazy(() => import('./pages/SuggestBrandPage').then(m => ({ default: m.SuggestBrandPage })));
const PartnershipPage = lazy(() => import('./pages/PartnershipPage').then(m => ({ default: m.PartnershipPage })));
const AdvertisePage = lazy(() => import('./pages/AdvertisePage').then(m => ({ default: m.AdvertisePage })));
const B2BSolutionsPage = lazy(() => import('./pages/B2BSolutionsPage').then(m => ({ default: m.B2BSolutionsPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));

const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const BrandDealsPage = lazy(() => import('./pages/BrandDealsPage').then(m => ({ default: m.BrandDealsPage })));
const RetailCartPage = lazy(() => import('./pages/RetailCartPage').then(m => ({ default: m.RetailCartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const SellerIncomingOrdersPage = lazy(() => import('./pages/SellerIncomingOrdersPage').then(m => ({ default: m.SellerIncomingOrdersPage })));
const SellerOrderDetailsPage = lazy(() => import('./pages/SellerOrderDetailsPage').then(m => ({ default: m.SellerOrderDetailsPage })));
const MessagesPage = lazy(() => import('./pages/MessagesPage').then(m => ({ default: m.MessagesPage })));
const CustomerOrdersPage = lazy(() => import('./pages/CustomerOrdersPage').then(m => ({ default: m.CustomerOrdersPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));




// Shell for all 15 screens overview
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
    { title: "10. Discover", id: "screen-10", content: <GuidesPage /> },
    { title: "12. Login / Sign Up", id: "screen-12", content: <AuthPage /> },
    { title: "13. Post Your Offer", id: "screen-13", content: <PostOfferPage /> },
    { title: "14. Brand Wise Deals", id: "screen-14", content: <BrandDealsPage /> },
    { title: "15. Creators Directory", id: "screen-15", content: <CreatorsPage /> },
    { title: "16. Creator Profile", id: "screen-16", content: <CreatorProfilePage /> },
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

import { useGlobalState } from './context/GlobalStateContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useGlobalState();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const location = useLocation();
  const isOverview = location.pathname === '/overview';
  const { mode } = useGlobalState();

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
            <Route path="/brands/:id/products" element={<PageWrapper><BrandDetailPage /></PageWrapper>} />
            <Route path="/categories" element={<PageWrapper><CategoriesPage /></PageWrapper>} />
            <Route path="/deals" element={<PageWrapper><DealsPage /></PageWrapper>} />
            <Route path="/compare" element={<PageWrapper><ComparePage /></PageWrapper>} />
            <Route path="/discover" element={<PageWrapper><GuidesPage /></PageWrapper>} />
            <Route path="/discover/:id" element={<PageWrapper><ContentDetailsPage /></PageWrapper>} />
            <Route path="/guides" element={<Navigate to="/discover" replace />} />
            <Route path="/guides/:id" element={<Navigate to="/discover/:id" replace />} />
            <Route path="/recommendations" element={<Navigate to="/discover" replace />} />
            <Route path="/recommendations/:id" element={<Navigate to="/discover/:id" replace />} />
            <Route path="/login" element={<PageWrapper><AuthPage /></PageWrapper>} />
            <Route path="/signup" element={<PageWrapper><AuthPage /></PageWrapper>} />
            <Route path="/post-offer" element={<ProtectedRoute><PageWrapper><PostOfferPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/search" element={<PageWrapper><SearchPage /></PageWrapper>} />
            <Route path="/creators" element={<PageWrapper><CreatorsPage /></PageWrapper>} />
            <Route path="/creators/:id" element={<PageWrapper><CreatorProfilePage /></PageWrapper>} />
            
            <Route path="/suggest-brand" element={<PageWrapper><SuggestBrandPage /></PageWrapper>} />
            <Route path="/partnership" element={<PageWrapper><PartnershipPage /></PageWrapper>} />
            <Route path="/advertise" element={<PageWrapper><AdvertisePage /></PageWrapper>} />
            <Route path="/b2b" element={<PageWrapper><B2BSolutionsPage /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
            <Route path="/privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />

            <Route path="/brand-deals" element={<PageWrapper><BrandDealsPage /></PageWrapper>} />
            <Route path="/cart/retail" element={<PageWrapper><RetailCartPage /></PageWrapper>} />
            <Route path="/checkout" element={<ProtectedRoute><PageWrapper><CheckoutPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/order-success" element={<PageWrapper><OrderSuccessPage /></PageWrapper>} />
            <Route path="/order-tracking" element={<PageWrapper><OrderTrackingPage /></PageWrapper>} />
            <Route path="/seller/orders" element={<ProtectedRoute><PageWrapper><SellerIncomingOrdersPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/seller/orders/:id" element={<ProtectedRoute><PageWrapper><SellerOrderDetailsPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><DashboardPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/cashbook*" element={<Navigate to="/" replace />} />
            <Route path="/messages" element={<ProtectedRoute><PageWrapper><MessagesPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/messages/:threadId" element={<ProtectedRoute><PageWrapper><MessagesPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/profile/orders" element={<ProtectedRoute><PageWrapper><CustomerOrdersPage /></PageWrapper></ProtectedRoute>} />
            <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      {!isOverview && <FloatingOverlays />}
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
            <DrawerFilterProvider>
              <FloatingFilterProvider>
                <AppContent />
              </FloatingFilterProvider>
            </DrawerFilterProvider>
            <PWAInstallPrompt />
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
      className="pb-0"
    >
      {children}
    </motion.div>
  );
}

// PWA Install Prompt — shows Android "Add to Home Screen" banner
function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = 
    React.useState<any>(null);
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show after 30 seconds to not interrupt initial browse
      setTimeout(() => setShowPrompt(true), 30000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener(
      'beforeinstallprompt', handler
    );
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem(
      'pwa-prompt-dismissed', 
      String(Date.now())
    );
  };

  // Check if dismissed recently
  React.useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const daysSince = 
        (Date.now() - Number(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) setShowPrompt(false);
    }
  }, []);

  // Don't show if already installed as PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-[120px] left-3 right-3 
                    lg:left-auto lg:right-6 lg:bottom-[200px] 
                    lg:w-80 z-[150] 
                    choosify-dark-gradient border border-white/10 
                    rounded-2xl p-4 shadow-2xl
                    flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-orange-primary/10 
                      border border-orange-primary/20 
                      flex items-center justify-center shrink-0">
        <div className="w-4 h-4 border-2 border-orange-primary 
                        rounded-full flex items-center 
                        justify-center">
          <div className="w-1.5 h-1.5 border-2 
                          border-orange-primary rounded-full" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[11px] font-black uppercase 
                      tracking-wider">
          Install Choosify
        </p>
        <p className="text-white/40 text-[10px] mt-0.5 
                      leading-relaxed">
          Add to home screen for faster access
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleDismiss}
          className="text-white/30 hover:text-white/60 
                     text-[10px] font-bold uppercase 
                     tracking-wider transition-colors"
        >
          Later
        </button>
        <button
          onClick={handleInstall}
          className="bg-orange-primary text-white 
                     text-[10px] font-black uppercase 
                     tracking-wider px-3 py-2 
                     rounded-lg whitespace-nowrap"
        >
          Install
        </button>
      </div>
    </div>
  );
}

