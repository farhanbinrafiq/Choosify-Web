import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { AllProductsPage } from './pages/AllProductsPage';
import { BrandsPage } from './pages/BrandsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BrandDetailPage } from './pages/BrandDetailPage';
import { DealsPage } from './pages/DealsPage';
import { ComparePage } from './pages/ComparePage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { GuideProductsPage } from './pages/GuideProductsPage';
import { LoginSignUpPage } from './pages/LoginSignUpPage';
import { PostOfferPage } from './pages/PostOfferPage';
import { BrandProductPage } from './pages/BrandProductPage';
import { DashboardPage } from './pages/DashboardPage';
import { DashboardProvider } from './context/DashboardContext';
import { Toaster } from 'react-hot-toast';
import { MobileNav } from './components/MobileNav';
import { AnimatePresence, motion } from 'motion/react';

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
              <span className="text-white font-bold tracking-tight lowercase">choosify</span>
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
        <div className="p-12 space-y-32">
          {screens.map((screen) => (
            <div key={screen.id}>
              <ScreenPreview title={screen.title} id={screen.id}>
                {screen.content}
              </ScreenPreview>
            </div>
          ))}
        </div>
        
        <footer className="py-20 text-center border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-30 grayscale saturate-0">
            <div className="w-6 h-6 border-2 border-navy rounded-full flex items-center justify-center">
              <div className="w-2 h-2 border-2 border-navy rounded-full"></div>
            </div>
            <span className="text-navy font-bold tracking-tight lowercase">choosify</span>
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
          <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      {!isOverview && <Footer />}
      
      {/* Auth Gate Simulation (PRD Requirement) */}
      {!isOverview && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-[#050514]/90 backdrop-blur-xl border border-white/20 rounded-full px-8 py-4 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Log in to unlock full curated experience</span>
            <div className="h-4 w-px bg-white/10" />
            <Link to="/login" className="px-6 py-2 bg-orange-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest italic hover:scale-105 transition-all">Sign In</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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
