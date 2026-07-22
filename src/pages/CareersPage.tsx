import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, ArrowRight, Building2 } from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { operationsApi, type PublicJobPosting } from '../services/operationsApi';
import { FALLBACK_JOB_POSTINGS, employmentTypeLabel } from '../lib/careersSeed';

export function CareersPage() {
  const [jobs, setJobs] = useState<PublicJobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    operationsApi
      .listPublicJobs()
      .then((rows) => {
        if (!cancelled) setJobs(rows);
      })
      .catch(() => {
        if (!cancelled) setJobs(FALLBACK_JOB_POSTINGS.filter((job) => job.status === 'open'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-choosify-feed font-sans">
      <StaticPageHero maxWidthClass="max-w-[1100px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#EB4501]/10 via-transparent to-black/20 pointer-events-none" />
        <div className="relative z-10 w-full px-6 sm:px-10 py-10">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-primary mb-3">Careers</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight max-w-2xl">
            Build the future of verified discovery with Choosify
          </h1>
          <p className="mt-4 text-sm sm:text-[15px] text-white/65 max-w-xl leading-relaxed">
            We are a Dhaka-rooted product team helping shoppers compare trusted brands with confidence.
            Join us to ship marketplace experiences that feel fast, clear, and genuinely useful.
          </p>
        </div>
      </StaticPageHero>

      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-10 py-10 space-y-10">
        <section className="bg-white border border-[#E8EDF2] rounded-[14px] p-6 sm:p-8">
          <h2 className="text-lg font-extrabold text-[#1A1A2E] mb-2">About working at Choosify</h2>
          <p className="text-sm text-[#5C6478] leading-relaxed max-w-3xl">
            Placeholder culture copy — we care about craft, shipping, and respectful collaboration. You will work
            across storefront and seller tools with designers, engineers, and growth partners. Remote-friendly where
            noted; otherwise we gather in Dhaka for focused product sprints.
          </p>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#1A1A2E]">Open positions</h2>
              <p className="text-sm text-[#5C6478] mt-1">Find a role that matches your craft.</p>
            </div>
            {!loading && (
              <span className="text-xs font-bold text-[#9AA0AC] uppercase tracking-wider">
                {jobs.length} open
              </span>
            )}
          </div>

          {loading ? (
            <div className="bg-white border border-[#E8EDF2] rounded-[14px] px-6 py-16 text-center text-sm text-[#9AA0AC]">
              Loading roles…
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white border border-[#E8EDF2] rounded-[14px] px-6 py-16 text-center">
              <Briefcase className="w-8 h-8 text-orange-primary mx-auto mb-3" />
              <h3 className="text-base font-extrabold text-[#1A1A2E]">No open positions right now</h3>
              <p className="text-sm text-[#5C6478] mt-2 max-w-md mx-auto">
                Check back soon — we post new roles here as soon as they open. You can also reach us via Contact.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-orange-primary"
              >
                Contact us <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/careers/${job.slug}`}
                  className="block bg-white border border-[#E8EDF2] rounded-[14px] p-5 sm:p-6 hover:border-orange-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-[16px] font-extrabold text-[#1A1A2E]">{job.title}</h3>
                      <p className="text-sm text-[#5C6478] mt-2 leading-relaxed line-clamp-2">{job.summary}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5C6478] bg-[#F4F7F9] rounded-full px-2.5 py-1">
                          <Building2 size={12} /> {job.department}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5C6478] bg-[#F4F7F9] rounded-full px-2.5 py-1">
                          <MapPin size={12} /> {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-primary bg-orange-primary/10 rounded-full px-2.5 py-1">
                          {employmentTypeLabel(job.employmentType)}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[12px] font-bold text-orange-primary shrink-0">
                      View role <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
