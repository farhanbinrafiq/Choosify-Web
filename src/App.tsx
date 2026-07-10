import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageSeo } from './components/PageSeo';
import { GoogleAnalyticsRouteTracker } from './components/GoogleAnalyticsRouteTracker';
import { ScrollToTop } from './components/ScrollToTop';
import { FloatingOverlays } from './components/FloatingOverlays';
import { PageBreadcrumbsBar } from './components/PageBreadcrumbs';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { DashboardProvider } from './context/DashboardContext';
import { GlobalStateProvider } from './context/GlobalStateContext';
import { DrawerFilterProvider, FloatingFilterProvider } from './components/FilterEngine';
import { StudioEditProvider } from './context/StudioEditContext';
import { StudioEditPanel } from './components/studio/StudioEditPanel';
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
const GuideDetailPage = lazy(() => import('./pages/GuideDetailPage').then(m => ({ default: m.GuideDetailPage })));
const GuideProductsPage = lazy(() => import('./pages/GuideProductsPage').then(m => ({ default: m.GuideProductsPage })));
const LoginSignUpPage = lazy(() => import('./pages/LoginSignUpPage').then(m => ({ default: m.LoginSignUpPage })));
const PostOfferPage = lazy(() => import('./pages/PostOfferPage').then(m => ({ default: m.PostOfferPage })));
const WhatsOnPage = lazy(() => import('./pages/WhatsOnPage').then(m => ({ default: m.WhatsOnPage })));
const BrandPostDetailPage = lazy(() => import('./pages/BrandPostDetailPage').then(m => ({ default: m.BrandPostDetailPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const CreatorsPage = lazy(() => import('./pages/CreatorsPage').then(m => ({ default: m.CreatorsPage })));
const CreatorProfilePage = lazy(() => import('./pages/CreatorProfilePage').then(m => ({ default: m.CreatorProfilePage })));

const SuggestBrandPage = lazy(() => import('./pages/SuggestBrandPage').then(m => ({ default: m.SuggestBrandPage })));
const PartnershipPage = lazy(() => import('./pages/PartnershipPage').then(m => ({ default: m.PartnershipPage })));
const AdvertisePage = lazy(() => import('./pages/AdvertisePage').then(m => ({ default: m.AdvertisePage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const FAQPage = lazy(() => import('./pages/FAQPage').then(m => ({ default: m.FAQPage })));

const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const BrandDealsPage = lazy(() => import('./pages/BrandDealsPage').then(m => ({ default: m.BrandDealsPage })));
const RetailCartPage = lazy(() => import('./pages/RetailCartPage').then(m => ({ default: m.RetailCartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage').then(m => ({ default: m.OrderSuccessPage })));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const MessagesPage = lazy(() => import('./pages/MessagesPage').then(m => ({ default: m.MessagesPage })));
const CustomerOrdersPage = lazy(() => import('./pages/CustomerOrdersPage').then(m => ({ default: m.CustomerOrdersPage })));
const EmiPage = lazy(() => import('./pages/EmiPage').then(m => ({ default: m.EmiPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));




import { useGlobalState } from './context/GlobalStateContext';
import { isNavPathEnabled } from './lib/featureFlags';
import { perfRouteTransition } from './utils/performanceDev';

function FeatureFlagRoute({
  flag,
  fallback = '/',
  children,
}: {
  flag: string;
  fallback?: string;
  children: React.ReactNode;
}) {
  const { isFeatureEnabled } = useGlobalState();
  if (!isFeatureEnabled(flag)) {
    return <Navigate to={fallback} replace />;
  }
  return <>{children}</>;
}

function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { isFeatureEnabled } = useGlobalState();
  const location = useLocation();
  const allowedDuringMaintenance = ['/login', '/contact', '/about'];
  if (
    isFeatureEnabled('maintenance_mode') &&
    !allowedDuringMaintenance.some((path) => location.pathname.startsWith(path))
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A1F] text-white p-8">
        <div className="text-center max-w-md space-y-4">
          <h1 className="text-2xl font-black uppercase tracking-tight italic">Maintenance Mode</h1>
          <p className="text-white/60 text-sm">
            Choosify is undergoing scheduled updates. Please check back soon or contact support.
          </p>
          <Link to="/contact" className="inline-block text-orange-primary font-bold text-sm uppercase tracking-widest">
            Contact Support
          </Link>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

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
  const isCompactShell = location.pathname === '/login';
  const isMessagesShell = location.pathname.startsWith('/messages');

  useEffect(() => {
    perfRouteTransition(location.pathname);
  }, [location.pathname]);

  return (
    <div className="antialiased selection:bg-orange-primary selection:text-white">
      {/* Navbar renders on the auth page too, so users can get back home via the logo */}
      <Navbar />
      <MaintenanceGate>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/products" element={<PageWrapper><AllProductsPage /></PageWrapper>} />
            <Route path="/products/:id" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
            <Route path="/brands" element={<PageWrapper><BrandsPage /></PageWrapper>} />
            <Route path="/brands/:id" element={<PageWrapper><BrandDetailPage /></PageWrapper>} />
            <Route path="/brands/:id/products" element={<PageWrapper><BrandDetailPage /></PageWrapper>} />
            <Route path="/categories" element={<PageWrapper><CategoriesPage /></PageWrapper>} />
            <Route path="/deals" element={<PageWrapper><DealsPage /></PageWrapper>} />
            <Route path="/compare" element={<FeatureFlagRoute flag="enable_comparison_engine"><PageWrapper><ComparePage /></PageWrapper></FeatureFlagRoute>} />
            <Route path="/guides" element={<PageWrapper><GuidesPage /></PageWrapper>} />
            <Route path="/blogs" element={<Navigate to="/guides" replace />} />
            <Route path="/blogs/:id" element={<PageWrapper><GuideDetailPage /></PageWrapper>} />
            <Route path="/guides/:id" element={<PageWrapper><GuideDetailPage /></PageWrapper>} />
            <Route path="/recommendations" element={<PageWrapper><GuidesPage /></PageWrapper>} />
            <Route path="/recommendations/:id" element={<PageWrapper><GuideDetailPage /></PageWrapper>} />
            <Route path="/guides/:id/products" element={<PageWrapper><GuideProductsPage /></PageWrapper>} />
            <Route path="/login" element={<LoginSignUpPage />} />
            <Route path="/post-offer" element={<ProtectedRoute><PageWrapper><PostOfferPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/whats-on" element={<PageWrapper><WhatsOnPage /></PageWrapper>} />
            <Route path="/whats-on/:slug" element={<PageWrapper><BrandPostDetailPage /></PageWrapper>} />
            <Route path="/customer-favorite" element={<Navigate to="/whats-on" replace />} />
            <Route path="/search" element={<PageWrapper><SearchPage /></PageWrapper>} />
            <Route path="/emi" element={<FeatureFlagRoute flag="enable_emi_assistant"><PageWrapper><EmiPage /></PageWrapper></FeatureFlagRoute>} />
            <Route path="/creators" element={<FeatureFlagRoute flag="creator_hub"><PageWrapper><CreatorsPage /></PageWrapper></FeatureFlagRoute>} />
            <Route path="/creators/:id" element={<FeatureFlagRoute flag="creator_hub"><PageWrapper><CreatorProfilePage /></PageWrapper></FeatureFlagRoute>} />
            
            <Route path="/suggest-brand" element={<PageWrapper><SuggestBrandPage /></PageWrapper>} />
            <Route path="/partnership" element={<PageWrapper><PartnershipPage /></PageWrapper>} />
            <Route path="/advertise" element={<PageWrapper><AdvertisePage /></PageWrapper>} />
            <Route path="/terms" element={<PageWrapper><TermsPage /></PageWrapper>} />
            <Route path="/privacy" element={<PageWrapper><PrivacyPage /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
            <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
            <Route path="/faq" element={<PageWrapper><FAQPage /></PageWrapper>} />

            <Route path="/brand-deals" element={<FeatureFlagRoute flag="enable_brand_deals_page"><PageWrapper><BrandDealsPage /></PageWrapper></FeatureFlagRoute>} />
            <Route path="/cart/retail" element={<PageWrapper><RetailCartPage /></PageWrapper>} />
            <Route path="/checkout" element={<ProtectedRoute><PageWrapper><CheckoutPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/order-success/:orderId" element={<PageWrapper><OrderSuccessPage /></PageWrapper>} />
            <Route path="/order-success" element={<PageWrapper><OrderSuccessPage /></PageWrapper>} />
            <Route path="/order-tracking" element={<PageWrapper><OrderTrackingPage /></PageWrapper>} />
            <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><DashboardPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><PageWrapper><MessagesPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/messages/:threadId" element={<ProtectedRoute><PageWrapper><MessagesPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/profile/orders" element={<ProtectedRoute><PageWrapper><CustomerOrdersPage /></PageWrapper></ProtectedRoute>} />
            <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      </MaintenanceGate>
      {!isCompactShell && <FloatingOverlays />}
      {!isCompactShell && !isMessagesShell && <Footer />}
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
            <GoogleAnalyticsRouteTracker />
            <PageSeo />
            <DrawerFilterProvider>
              <FloatingFilterProvider>
                <StudioEditProvider>
                <BreadcrumbProvider>
                  <AppContent />
                </BreadcrumbProvider>
                <StudioEditPanel />
                </StudioEditProvider>
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
      className="pb-0 mobile-fab-safe sm:pb-0"
    >
      <PageBreadcrumbsBar />
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
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const daysSince =
        (Date.now() - Number(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissedAgain = localStorage.getItem('pwa-prompt-dismissed');
      if (dismissedAgain) {
        const daysSinceDismiss =
          (Date.now() - Number(dismissedAgain)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismiss < 7) return;
      }
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
    localStorage.setItem(
      'pwa-prompt-dismissed',
      String(Date.now())
    );
  };

  // Don't show if already installed as PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return null;
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] left-3 right-3 
                    sm:bottom-[120px]
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

