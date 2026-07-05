import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faq';
import { StaticPageHero } from '../components/StaticPageHero';

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-sans text-left">
      <StaticPageHero className="h-[280px]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FF5B00]/10 via-transparent to-black/30" />
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 md:px-[64px]">
          <div className="mb-6 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/40">
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight size={10} className="text-white/20" />
            <span className="text-white">FAQ</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-primary/15 text-orange-primary">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-gray-300 md:text-base">
                Quick answers about comparing products, verified brands, deals, and how Choosify works.
              </p>
            </div>
          </div>
        </div>
      </StaticPageHero>

      <section className="mx-auto max-w-[900px] px-6 py-12 md:px-[64px] md:py-16">
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article
                key={item.question}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <h2 className="text-base font-black text-[#1A1D4E] md:text-lg">{item.question}</h2>
                  <ChevronRight
                    size={18}
                    className={`shrink-0 text-orange-primary transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-gray-100 px-6 pb-6 pt-2 text-sm leading-relaxed text-gray-600">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-orange-200 bg-orange-50 px-6 py-5 text-sm text-gray-700">
          Still need help? Visit our{' '}
          <Link to="/contact" className="font-bold text-orange-primary hover:underline">
            Contact page
          </Link>{' '}
          or email{' '}
          <a href="mailto:support@choosify.bd" className="font-bold text-orange-primary hover:underline">
            support@choosify.bd
          </a>
          .
        </div>
      </section>
    </div>
  );
}
