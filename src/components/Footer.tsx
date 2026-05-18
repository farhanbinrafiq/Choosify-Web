import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full dark-brand-gradient pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        {/* Brand Column */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex flex-col items-center group scale-75 origin-left">
              <div className="flex gap-1 mb-[-4px]">
                <div className="w-4 h-4 rounded-full border-2 border-orange-primary flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-orange-primary rounded-full" />
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-orange-primary flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-orange-primary rounded-full" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight lowercase font-sans text-white">choosify.bd</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium leading-relaxed mb-10 max-w-xs">
            Bangladesh's Premier Product Discovery Partner. Find the Best Stores, Compare Price, and Shop with Confidence.
          </p>
          
          <div className="flex gap-4">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-orange-primary hover:text-white transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col">
          <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Section</h4>
          <div className="flex flex-col gap-4">
            {['Track Products', 'Shoe Brand', 'Compare Price', 'Recommendations'].map((link) => (
              <Link key={link} to="#" className="text-gray-400 text-sm font-medium hover:text-orange-primary transition-colors">{link}</Link>
            ))}
          </div>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col">
          <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Company</h4>
          <div className="flex flex-col gap-4">
            {['About Platform', 'Membership', 'Our Mission', 'Careers'].map((link) => (
              <Link key={link} to="#" className="text-gray-400 text-sm font-medium hover:text-orange-primary transition-colors">{link}</Link>
            ))}
          </div>
        </div>

        {/* Links Column 3 */}
        <div className="flex flex-col">
          <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Help</h4>
          <div className="flex flex-col gap-4">
            {['Terms', 'Policy', 'Contact us', 'Forum'].map((link) => (
              <Link key={link} to="#" className="text-gray-400 text-sm font-medium hover:text-orange-primary transition-colors">{link}</Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-orange-primary uppercase tracking-widest">© 2026 Choosify.bd</span>
           <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">| Project development</span>
        </div>
        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest italic group cursor-pointer hover:text-orange-primary transition-colors">
           Choose, Verify, Compare & Shop Better
        </div>
      </div>
    </footer>
  );
}
