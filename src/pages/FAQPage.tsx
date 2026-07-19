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
    <div className="min-h-screen bg-[#F4F7F9] font-sans text-left">
      <StaticPageHero maxWidthClass="max-w-[1440px]">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-10 py-8">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-white/45">
            <Link to="/" className="transition-colors hover:text-white/80">
              Home
            </Link>
            <span>›</span>
            <span className="text-[#FF5B00]">FAQ</span>
          </div>
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF5B00]/15 text-[#FF5B00] shrink-0">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-white">
                Frequently asked questions
              </h1>
              <p className="mt-2 max-w-2xl text-[13px] font-medium leading-relaxed text-white/55">
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
