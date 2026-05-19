import React from 'react';
import { CheckCircle2, Smartphone, Shirt, Sparkles, Home, Cpu, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LoginSignUpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 bg-orange-primary relative flex flex-col p-8 md:p-12 lg:p-24 orange-brand-gradient overflow-hidden">
           <div className="mt-auto relative z-10">
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-8 tracking-tighter italic">
                Bangladesh's Most Trusted <br/> <span className="text-orange-primary">Product Discovery</span> Platform
              </h1>
              <div className="space-y-6">
                {["Compare thousands of products", "Find the best deals", "Read expert guides"].map((point, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-accent flex items-center justify-center text-white"><CheckCircle2 size={16} /></div>
                    <span className="text-white font-bold text-lg">{point}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center p-8 md:p-12 lg:p-24">
           <div className="max-w-md w-full mx-auto">
              <div className="flex gap-12 border-b border-gray-100 mb-12">
                 <button className="pb-4 text-2xl font-black text-navy uppercase tracking-tighter border-b-4 border-orange-primary italic">Sign In</button>
                 <button className="pb-4 text-2xl font-black text-gray-300 uppercase tracking-tighter italic">Sign Up</button>
              </div>
              <div className="space-y-8">
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black text-navy uppercase tracking-tighter italic">Welcome Back 👋</h2>
                    <input type="email" placeholder="Email Address" className="w-full h-14 pl-4 rounded-xl bg-ice-blue border-none focus:ring-2 focus:ring-orange-primary outline-none font-semibold" />
                    <input type="password" placeholder="Password" className="w-full h-14 pl-4 rounded-xl bg-ice-blue border-none focus:ring-2 focus:ring-orange-primary outline-none font-semibold" />
                 </div>
                 <button className="w-full h-16 button-gradient text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-orange-primary/30">Log In Now</button>
                 <div className="grid grid-cols-2 gap-4">
                    <button className="h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-3 font-bold text-navy hover:bg-ice-blue transition-all">Google</button>
                    <button className="h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center gap-3 font-bold text-navy hover:bg-ice-blue transition-all">Facebook</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
