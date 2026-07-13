import React from 'react';
import { AuthBackground } from '../components/auth/AuthBackground';
import { EMIComponent } from '../components/auth/EMIComponent';
import { AuthCard } from '../components/auth/AuthCard';
import { Headset, Bot } from 'lucide-react';

export const AuthPage = () => {
  return (
    <div className="min-h-screen relative font-sans">
      <AuthBackground />
      
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-30 px-12 py-8 flex justify-between items-center text-white">
        <div className="text-2xl font-black tracking-tighter">choosify</div>
        <div className="flex gap-6 items-center">
          <button className="text-sm font-bold opacity-80 hover:opacity-100 transition-opacity">Need help?</button>
          <button className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 border border-white/10 hover:bg-white/20 transition-all">
            <Bot size={18} />
            Ask EMI
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-12 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 w-full">
          {/* Left Side: Brand Story */}
          <div className="flex flex-col justify-center text-white pt-24">
            <h1 className="text-[64px] leading-[1.1] font-black tracking-tighter mb-8">
              Smarter choices.<br />
              <span className="text-[#FF5B00]">Better decisions.</span>
            </h1>
            <p className="text-xl text-white/80 mb-12 max-w-lg font-medium">Compare, discover and shop the best products with confidence.</p>
            <div className="space-y-6">
              {[
                { title: '100% Verified Products & Brands', desc: 'Only authentic and trusted listings' },
                { title: 'Unbiased Comparisons', desc: 'No paid promotions, just real insights' },
                { title: 'Curated Picks for You', desc: 'AI-powered recommendations' }
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 text-lg">
                  <div className="mt-1 w-8 h-8 rounded-full bg-[#FF5B00]/20 flex items-center justify-center text-[#FF5B00] border border-[#FF5B00]/30">✓</div>
                  <div>
                    <div className="font-bold">{item.title}</div>
                    <div className="text-sm text-white/60">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side: Auth Card */}
          <div className="flex justify-end items-center pt-24">
            <AuthCard />
          </div>
        </div>
      </div>

      <EMIComponent />
    </div>
  );
};
