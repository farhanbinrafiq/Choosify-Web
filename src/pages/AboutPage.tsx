import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const COMPANY_NAV = [
  { href: '#about-top', icon: '🏠', label: 'About Us', id: 'about-top' },
  { href: '#suggest-brand', icon: '🏷', label: 'Suggest a Brand', id: 'suggest-brand' },
  { href: '#partnership', icon: '🤝', label: 'Partnership', id: 'partnership' },
  { href: '#advertise', icon: '📢', label: 'Advertise', id: 'advertise' },
  { href: '#b2b', icon: '🏢', label: 'B2B Solutions', id: 'b2b' },
];

const LEGAL_NAV = [
  { href: '#terms', icon: '📄', label: 'Terms of Service', id: 'terms' },
  { href: '#privacy', icon: '🔒', label: 'Privacy Policy', id: 'privacy' },
  { href: '#contact', icon: '✉', label: 'Contact Us', id: 'contact' },
];

const STATS = [
  { icon: '🏷', value: '2,400+', label: 'Brands', bg: '#FFF3EA' },
  { icon: '📦', value: '48K+', label: 'Products', bg: '#EEF0FF' },
  { icon: '⭐', value: '120K+', label: 'Reviews', bg: '#ECFDF3' },
  { icon: '👥', value: '85K+', label: 'Users', bg: '#FFF7ED' },
];

const WHY = [
  { icon: '🔍', title: 'Smart Discovery', desc: 'Find trusted products across categories with curated catalogs.', bg: '#FFF3EA' },
  { icon: '⚖', title: 'Honest Compare', desc: 'Side-by-side specs, prices, and reviews before you buy.', bg: '#EEF0FF' },
  { icon: '⭐', title: 'Real Reviews', desc: 'Community and creator insights you can actually use.', bg: '#ECFDF3' },
  { icon: '🏷', title: 'Live Deals', desc: 'Track promos and savings from verified sellers.', bg: '#FFF7ED' },
  { icon: '🛡', title: 'Shop Confident', desc: 'Verified brands, transparent info, safer decisions.', bg: '#F3E8FF' },
];

const COMPANY_ROWS = [
  { anchor: 'suggest-brand', icon: '🏷', bg: '#FFF3EA', title: 'Suggest a Brand', desc: 'Know a great Bangladeshi brand we should list? Tell us.', cta: 'Submit suggestion' },
  { anchor: 'partnership', icon: '🤝', bg: '#EEF0FF', title: 'Partnership', desc: 'Collaborate with Choosify on campaigns, content, and growth.', cta: 'Partner with us' },
  { anchor: 'advertise', icon: '📢', bg: '#ECFDF3', title: 'Advertise', desc: 'Reach high-intent shoppers across discovery surfaces.', cta: 'Advertise here' },
  { anchor: 'b2b', icon: '🏢', bg: '#FFF7ED', title: 'B2B Solutions', desc: 'Procurement tools and catalogs for teams and retailers.', cta: 'Explore B2B' },
];

const LEGAL_ROWS = [
  { anchor: 'terms', icon: '📄', bg: '#F4F7F9', title: 'Terms of Service', desc: 'Rules for using Choosify products and community features.' },
  { anchor: 'privacy', icon: '🔒', bg: '#F4F7F9', title: 'Privacy Policy', desc: 'How we collect, use, and protect your information.' },
  { anchor: 'contact', icon: '✉', bg: '#F4F7F9', title: 'Contact Us', desc: 'Reach support, partnerships, or press — we respond fast.' },
];

/** Choosify.dc.html About — sticky left nav + light hero panel + company/legal rows */
export function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.hash]);

  const activeHash = location.hash.replace('#', '') || 'about-top';

  const navLinkClass = (id: string) =>
    cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] font-semibold transition-colors',
      activeHash === id ? 'bg-[#FFF3EA] text-[#FF5B00]' : 'text-[#4B5563] hover:bg-[#F4F7F9]',
    );

  return (
    <div className="min-h-screen bg-white">
      <div
        id="about-top"
        className="max-w-[1280px] mx-auto px-5 sm:px-10 py-6 pb-[60px] grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-8 items-start scroll-mt-[104px]"
      >
        <aside className="lg:sticky lg:top-[104px] flex flex-col gap-6 order-2 lg:order-1">
          <div>
            <div className="text-[10.5px] font-extrabold text-[#9AA0AC] tracking-wide mb-2.5">ABOUT CHOOSIFY</div>
            <div className="flex flex-col gap-0.5">
              {COMPANY_NAV.map((an) => (
                <a key={an.id} href={an.href} className={navLinkClass(an.id)}>
                  <span>{an.icon}</span>
                  {an.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10.5px] font-extrabold text-[#9AA0AC] tracking-wide mb-2.5">LEGAL</div>
            <div className="flex flex-col gap-0.5">
              {LEGAL_NAV.map((an) => (
                <a key={an.id} href={an.href} className={navLinkClass(an.id)}>
                  <span>{an.icon}</span>
                  {an.label}
                </a>
              ))}
            </div>
          </div>
          <div className="bg-[#F4F7F9] rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-[34px] h-[34px] rounded-lg bg-[#000435] flex items-center justify-center text-[15px] shrink-0">
                🤖
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#1A1A2E]">Need Help?</div>
                <div className="text-[10.5px] text-[#9AA0AC]">Our support team is here to assist you.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/messages')}
              className="w-full bg-white border border-[#E5E7EB] text-[#1A1A2E] py-2.5 rounded-lg text-[11.5px] font-bold cursor-pointer hover:bg-white/90"
            >
              Contact Support
            </button>
          </div>
        </aside>

        <div className="order-1 lg:order-2 min-w-0">
          <div className="bg-[#F4F7F9] rounded-[14px] p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-center mb-8">
            <div>
              <div className="text-[11px] font-extrabold text-[#2323FF] tracking-wide mb-2.5">ABOUT CHOOSIFY</div>
              <h1 className="text-[28px] md:text-[32px] font-extrabold leading-tight text-[#1A1A2E] mb-3.5">
                Choose. Compare.
                <br />
                Decide <span className="text-[#2323FF]">Wisely.</span>
              </h1>
              <p className="text-[13px] text-[#4B5563] leading-relaxed m-0 mb-[22px]">
                Choosify is Bangladesh&apos;s smart product discovery and decision-making platform. We help you explore
                trusted products, compare prices, read real reviews, and make confident choices.
              </p>
              <div className="flex gap-6 flex-wrap">
                {STATS.map((st) => (
                  <div key={st.label} className="text-center">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-lg mx-auto mb-2"
                      style={{ background: st.bg }}
                    >
                      {st.icon}
                    </div>
                    <div className="text-base font-extrabold text-[#1A1A2E]">{st.value}</div>
                    <div className="text-[10.5px] text-[#9AA0AC]">{st.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full h-[200px] md:h-[220px] rounded-xl overflow-hidden bg-[#000435]">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"
                alt=""
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>

          <div className="text-[19px] font-extrabold text-[#1A1A2E] mb-4">Why Choosify?</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-9">
            {WHY.map((wc) => (
              <div key={wc.title} className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px]">
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center text-base mb-3"
                  style={{ background: wc.bg }}
                >
                  {wc.icon}
                </div>
                <div className="text-[12.5px] font-bold text-[#1A1A2E] mb-1.5">{wc.title}</div>
                <div className="text-[11px] text-[#9AA0AC] leading-relaxed">{wc.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3.5 mb-7">
            {COMPANY_ROWS.map((cr) => (
              <div
                key={cr.anchor}
                id={cr.anchor}
                className="bg-white border border-[#E8EDF2] rounded-xl px-[22px] py-5 grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-5 items-center scroll-mt-[104px]"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ background: cr.bg }}
                >
                  {cr.icon}
                </div>
                <div>
                  <div className="text-[14.5px] font-extrabold text-[#1A1A2E] mb-1">{cr.title}</div>
                  <div className="text-xs text-[#9AA0AC] leading-relaxed mb-1.5">{cr.desc}</div>
                  <Link to="/contact" className="text-[11.5px] font-bold text-[#2323FF]">
                    {cr.cta} →
                  </Link>
                </div>
                <span className="hidden sm:inline text-lg text-[#9AA0AC]">›</span>
              </div>
            ))}
          </div>

          <div className="text-[10.5px] font-extrabold text-[#9AA0AC] tracking-wide mb-3.5">LEGAL</div>
          <div className="flex flex-col gap-3.5">
            {LEGAL_ROWS.map((cr) => (
              <div
                key={cr.anchor}
                id={cr.anchor}
                className="bg-white border border-[#E8EDF2] rounded-xl px-[22px] py-5 grid grid-cols-[auto_1fr_auto] gap-5 items-center scroll-mt-[104px]"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ background: cr.bg }}
                >
                  {cr.icon}
                </div>
                <div>
                  <div className="text-[14.5px] font-extrabold text-[#1A1A2E] mb-1">{cr.title}</div>
                  <div className="text-xs text-[#9AA0AC] leading-relaxed">{cr.desc}</div>
                </div>
                <span className="text-lg text-[#9AA0AC]">›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
