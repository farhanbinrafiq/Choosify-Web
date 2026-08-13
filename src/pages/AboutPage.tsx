import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useGlobalState } from '../context/GlobalStateContext';
import { enabledSorted, resolveSitePages } from '../lib/cmsSitePages';

/** Choosify.dc.html About — sticky left nav + light hero panel + company/legal rows */
export function AboutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { siteConfig } = useGlobalState();
  const content = resolveSitePages(siteConfig?.sitePages).about;
  const companyNav = enabledSorted(content.companyNav);
  const legalNav = enabledSorted(content.legalNav);
  const stats = enabledSorted(content.stats);
  const whyCards = enabledSorted(content.whyCards);
  const companyRows = enabledSorted(content.companyRows);
  const legalRows = enabledSorted(content.legalRows);

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
      activeHash === id ? 'bg-[#FFF3EA] text-[#EB4501]' : 'text-[#4B5563] hover:bg-[#F4F7F9]',
    );

  return (
    <div className="min-h-screen bg-white">
      <div
        id="about-top"
        className="max-w-[1280px] mx-auto px-5 sm:px-10 py-6 pb-[60px] grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-8 items-start scroll-mt-[104px]"
      >
        <aside className="lg:sticky lg:top-[104px] flex flex-col gap-6 order-2 lg:order-1">
          <div>
            <div className="text-[10.5px] font-extrabold text-[#9AA0AC] tracking-wide mb-2.5">{content.companyNavLabel}</div>
            <div className="flex flex-col gap-0.5">
              {companyNav.map((an) => (
                <a key={an.id} href={an.href} className={navLinkClass(an.id)}>
                  <span>{an.icon}</span>
                  {an.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10.5px] font-extrabold text-[#9AA0AC] tracking-wide mb-2.5">{content.legalNavLabel}</div>
            <div className="flex flex-col gap-0.5">
              {legalNav.map((an) => (
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
                <div className="text-xs font-extrabold text-[#1A1A2E]">{content.helpBox.title}</div>
                <div className="text-[10.5px] text-[#9AA0AC]">{content.helpBox.description}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(content.helpBox.ctaHref || '/messages')}
              className="w-full bg-white border border-[#E5E7EB] text-[#1A1A2E] py-2.5 rounded-lg text-[11.5px] font-bold cursor-pointer hover:bg-white/90"
            >
              {content.helpBox.ctaLabel}
            </button>
          </div>
        </aside>

        <div className="order-1 lg:order-2 min-w-0">
          <div className="bg-[#F4F7F9] rounded-xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-center mb-8">
            <div>
              <div className="text-[11px] font-extrabold text-[#2323FF] tracking-wide mb-2.5">{content.heroEyebrow}</div>
              <h1 className="text-[28px] md:text-[32px] font-extrabold leading-tight text-[#1A1A2E] mb-3.5">
                {content.heroTitleLine1}
                <br />
                {content.heroTitleLine2Prefix} <span className="text-[#2323FF]">{content.heroTitleAccent}</span>
              </h1>
              <p className="text-[13px] text-[#4B5563] leading-relaxed m-0 mb-[22px]">{content.heroDescription}</p>
              <div className="flex gap-6 flex-wrap">
                {stats.map((st) => (
                  <div key={st.id || st.label} className="text-center">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-lg mx-auto mb-2"
                      style={{ background: st.bg || '#FFF3EA' }}
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
                src={content.heroImageUrl}
                alt=""
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          </div>

          <div className="text-[19px] font-extrabold text-[#1A1A2E] mb-4">{content.whyHeading}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-9">
            {whyCards.map((wc) => (
              <div key={wc.id || wc.title} className="bg-white border border-[#E8EDF2] rounded-[10px] p-[18px]">
                <div
                  className="w-9 h-9 rounded-[9px] flex items-center justify-center text-base mb-3"
                  style={{ background: wc.bg || '#FFF3EA' }}
                >
                  {wc.icon}
                </div>
                <div className="text-[12.5px] font-bold text-[#1A1A2E] mb-1.5">{wc.title}</div>
                <div className="text-[11px] text-[#9AA0AC] leading-relaxed">{wc.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3.5 mb-7">
            {companyRows.map((cr) => (
              <div
                key={cr.id}
                id={cr.id}
                className="bg-white border border-[#E8EDF2] rounded-xl px-[22px] py-5 grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-5 items-center scroll-mt-[104px]"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ background: cr.bg || '#FFF3EA' }}
                >
                  {cr.icon}
                </div>
                <div>
                  <div className="text-[14.5px] font-extrabold text-[#1A1A2E] mb-1">{cr.title}</div>
                  <div className="text-xs text-[#9AA0AC] leading-relaxed mb-1.5">{cr.desc}</div>
                  <Link to={cr.href || '/contact'} className="text-[11.5px] font-bold text-[#2323FF]">
                    {cr.cta} →
                  </Link>
                </div>
                <span className="hidden sm:inline text-lg text-[#9AA0AC]">›</span>
              </div>
            ))}
          </div>

          <div className="text-[10.5px] font-extrabold text-[#9AA0AC] tracking-wide mb-3.5">{content.legalSectionLabel}</div>
          <div className="flex flex-col gap-3.5">
            {legalRows.map((cr) => (
              <div
                key={cr.id}
                id={cr.id}
                className="bg-white border border-[#E8EDF2] rounded-xl px-[22px] py-5 grid grid-cols-[auto_1fr_auto] gap-5 items-center scroll-mt-[104px]"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ background: cr.bg || '#F4F7F9' }}
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
