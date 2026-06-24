import React from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

// Perfect inline SVG for TikTok
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.73 4.1 1.12 1.09 2.62 1.7 4.18 1.8v3.91c-1.85-.01-3.61-.68-5.07-1.82V14.5c.04 3.39-2.14 6.55-5.4 7.63-3.25 1.08-6.9-.32-8.56-3.32C1.65 15.82 2.45 11.9 5.31 9.87c1.78-1.27 4.14-1.55 6.16-.72.01-.16.02-.32.02-.48V4.83c-1.41-.35-2.88-.16-4.16.54-2.1 1.15-3.35 3.51-3.14 5.92.21 2.42 2.01 4.54 4.38 5.17 2.37.64 4.96-.2 6.09-2.26.47-.86.7-1.84.66-2.82V.02Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer 
      className="w-full footer-brand-gradient text-gray-400 font-sans relative overflow-hidden" 
      id="global-footer"
    >
      {/* Core untextured brand gradient backdrop */}

      {/* TOP SECTION (main footer body) */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] pt-[64px] pb-[48px] relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          
          {/* Column 1 (left): Tagline text + social icons */}
          <div className="md:col-span-5 lg:col-span-6 flex flex-col justify-start">
            
            {/* Tagline (no logo in this area) */}
            <p className="text-white/65 text-[14px] leading-relaxed max-w-[280px] mb-8 font-normal text-center md:text-left mx-auto md:mx-0">
              Bangladesh's Smartest Product Discovery Platform. Find The Best Brand, Compare Price, And Shop With Confidence
            </p>

            {/* Connect With Us Section */}
            <h4 className="text-white font-semibold uppercase tracking-[0.1em] text-[13px] mb-[20px] text-center md:text-left">
              Connect With Us
            </h4>

            {/* Social icons row */}
            <div className="flex items-center justify-center md:justify-start gap-6 flex-wrap">
              
              {/* Facebook */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <a 
                  href="https://www.facebook.com/choosify.bd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95"
                  aria-label="Visit Choosify on Facebook"
                  title="Visit Choosify on Facebook"
                >
                  <Facebook size={20} />
                </a>
                <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">
                  Facebook
                </span>
              </div>

              {/* Instagram */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <a 
                  href="https://www.instagram.com/choosify.bd/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95"
                  aria-label="Visit Choosify on Instagram"
                  title="Visit Choosify on Instagram"
                >
                  <Instagram size={20} />
                </a>
                <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">
                  Instagram
                </span>
              </div>

              {/* TikTok */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <a 
                  href="https://www.tiktok.com/@choosify5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95"
                  aria-label="Visit Choosify on TikTok"
                  title="Visit Choosify on TikTok"
                >
                  <TikTokIcon size={20} />
                </a>
                <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">
                  TikTok
                </span>
              </div>

              {/* YouTube */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer">
                <a 
                  href="https://www.youtube.com/@choosifybd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white hover:border-[#F97316] hover:text-[#F97316] hover:bg-[#F97316]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] transition-all duration-300 active:scale-95"
                  aria-label="Visit Choosify on YouTube"
                  title="Visit Choosify on YouTube"
                >
                  <Youtube size={20} />
                </a>
                <span className="text-[14px] text-white/50 group-hover:text-[#F97316] font-normal transition-colors">
                  YouTube
                </span>
              </div>

            </div>

          </div>

          {/* Right Section containing Columns 2, 3, 4 */}
          <div className="md:col-span-7 lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">
            
            {/* Column 2: DISCOVER */}
            <div className="flex flex-col">
              <h4 className="text-white font-semibold uppercase tracking-[0.1em] text-[13px] mb-[20px]">
                DISCOVER
              </h4>
              <div className="flex flex-col leading-[2.2]">
                <Link to="/brands" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  Top Brands
                </Link>
                <Link to="/products" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  New Arrival
                </Link>
                <Link to="/compare" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  Compare Tool
                </Link>
                <Link to="/deals" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  Best Deals
                </Link>
              </div>
            </div>

            {/* Column 3: COMPANY */}
            <div className="flex flex-col">
              <h4 className="text-white font-semibold uppercase tracking-[0.1em] text-[13px] mb-[20px]">
                COMPANY
              </h4>
              <div className="flex flex-col leading-[2.2]">
                <Link to="/contact" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  Suggest a brand
                </Link>
                <Link to="/contact" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  Partnership
                </Link>
                <Link to="/contact" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  Advertise
                </Link>
                <Link to="/dashboard" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  b2b
                </Link>
              </div>
            </div>

            {/* Column 4: LEGAL */}
            <div className="flex flex-col col-span-2 sm:col-span-1">
              <h4 className="text-white font-semibold uppercase tracking-[0.1em] text-[13px] mb-[20px]">
                LEGAL
              </h4>
              <div className="flex flex-col leading-[2.2]">
                <Link to="/terms" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  Terms
                </Link>
                <Link to="/privacy" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  Policy
                </Link>
                <Link to="/contact" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  Contact us
                </Link>
                <Link to="/about" className="text-white/65 text-[14px] hover:text-white transition-colors">
                  About
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* GIANT LOWER DECORATIVE LOGO AREA */}
      <div 
        className="w-full relative overflow-hidden ml-0 mt-[3px] mb-[3px]"
        id="giant-footer-logo"
      >
        <svg 
          id="Layer_1" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 2585.84 505.4" 
          className="w-full h-auto block select-none pointer-events-none opacity-[0.95] transition-transform duration-500 hover:scale-[1.01]"
        >
          <g>
            <g>
              <path fill="#ef3c23" d="M921.65,303.09c0-47.35-38.42-85.71-85.76-85.71s-85.76,38.36-85.76,85.71,38.42,85.76,85.76,85.76c8.22,0,16.14-1.17,23.65-3.3-3.3-5.38-5.23-11.77-5.23-18.57,0-19.74,15.99-35.73,35.68-35.73,8.93,0,17.1,3.3,23.34,8.68,5.33-11.16,8.32-23.65,8.32-36.84Z"/>
              <path fill="#ef3c23" d="M356.15,303.09c0-47.35-38.42-85.71-85.76-85.71s-85.76,38.36-85.76,85.71c0,47.35,38.42,85.76,85.76,85.76,8.22,0,16.14-1.17,23.65-3.3-3.3-5.38-5.23-11.77-5.23-18.57,0-19.74,15.99-35.73,35.68-35.73,8.93,0,17.1,3.3,23.34,8.68,5.33-11.16,8.32-23.65,8.32-36.84Z"/>
              <path fill="#ef3c23" d="M252.7,505.4C113.36,505.4,0,392.04,0,252.7S113.36,0,252.7,0s252.7,113.36,252.7,252.7-113.36,252.7-252.7,252.7ZM252.7,57.74c-107.5,0-194.96,87.46-194.96,194.96s87.46,194.96,194.96,194.96,194.96-87.46,194.96-194.96S360.2,57.74,252.7,57.74Z"/>
              <path fill="#ef3c23" d="M779.18,505.4c-139.34,0-252.7-113.36-252.7-252.7S639.84,0,779.18,0s252.7,113.36,252.7,252.7-113.36,252.7-252.7,252.7ZM779.18,57.74c-107.5,0-194.96,87.46-194.96,194.96s87.46,194.96,194.96,194.96,194.96-87.46,194.96-194.96-87.46-194.96-194.96-194.96Z"/>
            </g>
            <g>
              <path fill="#fff" d="M1094.27,260.83c0-54.18,36.9-95.48,93.45-95.48,48.09,0,77.9,27.43,84.31,66.7h-51.45c-3.72-16.59-14.55-27.09-32.15-27.09-26.77,0-40.3,22.01-40.3,55.88s13.53,55.19,40.3,55.19c19.62,0,31.48-11.85,33.85-32.51h51.13c-1.7,40.97-34.21,72.8-84.31,72.8-57.58,0-94.83-41.64-94.83-95.48Z"/>
              <path fill="#fff" d="M1351.4,350.56h-53.18V98.64h53.18v69.42c0,1.68,0,16.25-.35,28.1h1.03c10.84-19.3,29.11-30.81,54.18-30.81,39.59,0,62.64,26.4,62.64,66.7v118.52h-52.83v-108.36c0-19.64-10.48-32.84-30.13-32.84-20.65,0-34.53,16.59-34.53,39.62v101.58Z"/>
              <path fill="#fff" d="M1494.41,260.83c0-54.18,37.92-95.48,95.5-95.48s94.8,41.31,94.8,95.48-37.57,95.48-94.8,95.48-95.5-41.64-95.5-95.48ZM1630.88,260.83c0-34.21-14.91-57.56-41.32-57.56s-41.29,23.35-41.29,57.56,14.2,56.89,41.29,56.89,41.32-23.03,41.32-56.89Z"/>
              <path fill="#fff" d="M1703.14,260.83c0-54.18,37.92-95.48,95.5-95.48s94.8,41.31,94.8,95.48-37.57,95.48-94.8,95.48-95.5-41.64-95.5-95.48ZM1839.61,260.83c0-34.21-14.91-57.56-41.32-57.56s-41.29,23.35-41.29,57.56,14.2,56.89,41.29,56.89,41.32-23.03,41.32-56.89Z"/>
              <path fill="#fff" d="M1908.8,295.02h50.11c3.05,16.94,15.93,26.42,36.58,26.42,18.98,0,29.81-7.79,29.81-20.65,0-16.25-21.35-18.29-46.39-23.03-32.19-6.09-64.69-14.22-64.69-56.21,0-36.9,33.53-56.2,75.85-56.2,50.11,0,75.18,21.67,79.92,53.15h-49.43c-3.4-12.86-13.56-19.3-30.49-19.3s-26.74,6.78-26.74,18.29c0,13.54,19.62,15.58,44.34,19.97,32.19,5.75,68.76,14.22,68.76,59.6,0,38.95-34.56,59.26-81.27,59.26-52.16,0-83.64-25.05-86.36-61.29Z"/>
              <rect fill="#fff" x="2102.94" y="170.41" width="53.18" height="180.15"/>
              <path fill="#fff" d="M2260.83,204.96v145.61h-53.18v-145.61h-27.09v-34.54h27.09v-15.23c0-19.3,4.74-32.84,15.26-42.33,11.83-10.5,30.46-14.55,53.47-14.22,7.12,0,14.59.34,22.02,1.35v37.92c-26.74-1.01-37.57.69-37.57,21v11.51h37.57v34.54h-37.57Z"/>
              <path fill="#fff" d="M2335.71,410.16v-41.64h2.72c.67.34,15.9.34,17.28.34,16.57,0,24.72-6.09,25.71-18.29,0-6.09-3.05-19.97-9.46-36.23l-55.88-143.92h55.88l23.02,69.09c8.11,24.38,14.91,62.64,14.91,62.64h.67s8.11-38.6,15.9-62.64l22.02-69.09h52.83l-64.34,184.56c-14.59,41.64-31.16,55.86-65.69,55.86-1.7,0-34.56-.34-35.58-.67Z"/>
              <path fill="#ef3c23" d="M2129.7,152.15c15.9,0,28.78-12.9,28.78-28.8,0-15.9-12.88-28.8-28.78-28.8-15.9,0-28.8,12.9-28.8,28.8,0,2.76.39,5.42,1.11,7.94,1.81-1.11,3.95-1.76,6.24-1.76,6.63,0,12,5.37,12,11.98,0,3-1.11,5.74-2.91,7.84,3.75,1.79,7.94,2.79,12.37,2.79Z"/>
            </g>
          </g>
          <g>
            <path fill="#fff" d="M2529.31,313.17h17.3c7.28,0,12.13,4.22,12.13,10.5,0,4.43-2.06,7.81-6.91,9.13v.16c3.48,1,5.27,3.01,5.75,7.6.53,5.33.32,9.39,1.64,9.97v.37h-7.33c-.95-.42-1.06-4.64-1.37-8.7-.32-4.11-2.64-6.44-7.38-6.44h-6.17v15.14h-7.65v-37.72ZM2536.96,329.84h8.12c4.17,0,6.22-2.16,6.22-5.17s-1.95-5.33-6.01-5.33h-8.33v10.5Z"/>
            <path fill="#fff" d="M2543.58,375.14c-11.29,0-21.9-4.4-29.88-12.38-7.98-7.98-12.38-18.59-12.38-29.88s4.4-21.9,12.38-29.88c7.98-7.98,18.59-12.38,29.88-12.38s21.9,4.4,29.88,12.38c7.98,7.98,12.38,18.59,12.38,29.88s-4.4,21.9-12.38,29.88c-7.98,7.98-18.59,12.38-29.88,12.38ZM2543.58,299.28c-18.53,0-33.6,15.07-33.6,33.6s15.07,33.6,33.6,33.6,33.6-15.07,33.6-33.6-15.07-33.6-33.6-33.6Z"/>
          </g>
        </svg>
      </div>

      {/* Thin horizontal divider line above BOTTOM BAR */}
      <div className="w-full border-t border-white/10" />

      {/* BOTTOM BAR */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[14px] text-white/70 font-normal">
          {/* Left Copyright Text */}
          <div className="text-center md:text-left">
            © 2026 <span className="text-[#ef3c23] font-semibold">Choosify</span>. Made In Bangladesh
          </div>

          {/* Right Slogan Text */}
          <div className="text-center md:text-right">
            Choose <span className="text-[#ef3c23] font-semibold">Easy</span>, Compare & Decide <span className="text-[#ef3c23] font-semibold">Wisely</span>.
          </div>
        </div>
      </div>
    </footer>
  );
}
