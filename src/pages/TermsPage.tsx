import React, { useEffect, useMemo, useState } from 'react';
import { Scale, FileText } from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { useGlobalState } from '../context/GlobalStateContext';
import { enabledSorted, resolveSitePages } from '../lib/cmsSitePages';

export function TermsPage() {
  const { siteConfig } = useGlobalState();
  const doc = resolveSitePages(siteConfig?.sitePages).terms;
  const sections = useMemo(() => enabledSorted(doc.sections), [doc.sections]);
  const [activeSection, setActiveSection] = useState(sections[0]?.id || 'intro');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (sections[0]?.id) setActiveSection(sections[0].id);
  }, [sections]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-choosify-feed font-sans text-left">
      <div
        className="fixed top-0 left-0 h-1 bg-orange-primary z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      <StaticPageHero maxWidthClass="max-w-[1440px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF5B00]/10 via-transparent to-black/30 pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <span className="inline-block bg-[#FF5B00]/10 text-orange-primary text-[9px] font-mono font-black uppercase tracking-[0.25em] px-3.5 py-1 rounded-full border border-orange-primary/10">
                {doc.hero.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-[2.5rem] font-extrabold text-white tracking-tight leading-tight">
                {doc.hero.title}
              </h1>
              <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-xl">
                {doc.hero.description}
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="bg-white/5 border border-white/10 rounded-[5px] p-6 max-w-sm w-full text-left backdrop-blur-xs relative overflow-hidden">
                <h3 className="text-xs font-black uppercase tracking-wider text-white mb-2 flex items-center gap-2">
                  <Scale size={16} className="text-orange-primary" />
                  {doc.hero.sideCardTitle || 'Legal Integrity'}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed font-semibold">
                  {doc.hero.sideCardBody}
                </p>
              </div>
            </div>
          </div>
        </div>
      </StaticPageHero>

      <div className="max-w-[1440px] mx-auto px-6 md:px-[64px] py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-28 space-y-6 flex-shrink-0 text-left">
            <div className="bg-white border border-[#e8edf2] rounded-[5px] p-6 shadow-xs">
              <h3 className="text-[13px] font-bold text-[#1A1A2E] tracking-tight mb-4 pb-2 border-b border-[#e8edf2] flex items-center gap-2">
                <FileText size={14} className="text-orange-primary" />
                {doc.indexTitle}
              </h3>
              <nav className="flex flex-col space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-[5px] transition-all border-none cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-orange-primary/5 text-orange-primary font-black'
                        : 'text-gray-500 hover:text-navy hover:bg-gray-50'
                    }`}
                  >
                    {sec.indexLabel}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-8 bg-white border border-[#e8edf2] rounded-[5px] p-8 md:p-12 shadow-xs space-y-12 leading-relaxed text-left">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="space-y-4 scroll-mt-24">
                <h2 className="text-lg md:text-xl font-extrabold text-[#1A1A2E] tracking-tight flex items-center gap-2">
                  <span className="text-orange-primary">{section.number}.</span> {section.title}
                </h2>
                <div className="h-0.5 w-16 bg-orange-primary mb-4" />
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="text-gray-600 text-xs md:text-sm font-semibold">
                    {p}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 ? (
                  <ul className="pl-5 list-disc text-xs md:text-sm text-gray-500 font-semibold space-y-2">
                    {section.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : null}
                {section.contactBox ? (
                  <div className="bg-gray-50 border border-[#e8edf2] rounded-[5px] p-5 space-y-2 text-xs md:text-sm text-gray-700 font-semibold mt-4">
                    {section.contactBox.email ? (
                      <p>
                        <span className="text-navy font-bold">{section.contactBox.emailLabel || 'Email'}:</span>{' '}
                        {section.contactBox.email}
                      </p>
                    ) : null}
                    {section.contactBox.address ? (
                      <p>
                        <span className="text-navy font-bold">{section.contactBox.addressLabel || 'Address'}:</span>{' '}
                        {section.contactBox.address}
                      </p>
                    ) : null}
                    {section.contactBox.responseWindow ? (
                      <p>
                        <span className="text-navy font-bold">{section.contactBox.responseLabel || 'Response Window'}:</span>{' '}
                        {section.contactBox.responseWindow}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
