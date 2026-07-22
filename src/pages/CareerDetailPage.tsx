import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building2, CheckCircle2, MapPin, Upload } from 'lucide-react';
import { StaticPageHero } from '../components/StaticPageHero';
import { operationsApi, type PublicJobPosting } from '../services/operationsApi';
import { FALLBACK_JOB_POSTINGS, employmentTypeLabel } from '../lib/careersSeed';

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function CareerDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const [job, setJob] = useState<PublicJobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    operationsApi
      .getPublicJob(slug)
      .then((row) => {
        if (!cancelled) setJob(row);
      })
      .catch(() => {
        const fallback = FALLBACK_JOB_POSTINGS.find(
          (row) => (row.slug === slug || row.id === slug) && row.status === 'open',
        );
        if (!cancelled) {
          if (fallback) setJob(fallback);
          else setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!job) return;
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and email are required.');
      return;
    }
    if (!resumeFile) {
      setFormError('Please attach your resume / CV (PDF, DOC, or DOCX).');
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const base64Data = await fileToBase64(resumeFile);
      let resumeUrl = '';
      let resumeFileName = resumeFile.name;
      try {
        const uploaded = await operationsApi.uploadResume({
          data: base64Data,
          mimeType: resumeFile.type || 'application/pdf',
          fileName: resumeFile.name,
        });
        resumeUrl = uploaded.url;
        resumeFileName = uploaded.fileName || resumeFile.name;
      } catch {
        // Local/dev without Cloudinary: still accept application with a placeholder URL.
        resumeUrl = `local-upload://${encodeURIComponent(resumeFile.name)}`;
      }
      await operationsApi.submitJobApplication({
        jobId: job.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        resumeUrl,
        resumeFileName,
        coverLetter: form.coverLetter.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-choosify-feed flex items-center justify-center text-sm text-[#9AA0AC]">
        Loading role…
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen bg-choosify-feed px-5 py-16 text-center">
        <Briefcase className="w-8 h-8 text-orange-primary mx-auto mb-3" />
        <h1 className="text-xl font-extrabold text-[#1A1A2E]">Role not found</h1>
        <p className="text-sm text-[#5C6478] mt-2">This posting may be closed or the link is outdated.</p>
        <Link to="/careers" className="inline-flex items-center gap-2 mt-5 text-sm font-bold text-orange-primary">
          <ArrowLeft size={14} /> Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-choosify-feed font-sans">
      <StaticPageHero maxWidthClass="max-w-[1100px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#EB4501]/10 via-transparent to-black/20 pointer-events-none" />
        <div className="relative z-10 w-full px-6 sm:px-10 py-10">
          <Link to="/careers" className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white/60 hover:text-white mb-4">
            <ArrowLeft size={14} /> All careers
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{job.title}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80 bg-white/10 rounded-full px-2.5 py-1">
              <Building2 size={12} /> {job.department}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80 bg-white/10 rounded-full px-2.5 py-1">
              <MapPin size={12} /> {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-primary bg-orange-primary/15 rounded-full px-2.5 py-1">
              {employmentTypeLabel(job.employmentType)}
            </span>
          </div>
        </div>
      </StaticPageHero>

      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-10 py-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        <article className="bg-white border border-[#E8EDF2] rounded-[14px] p-6 sm:p-8 space-y-8">
          <section>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1A1A2E] mb-2">Overview</h2>
            <p className="text-sm text-[#5C6478] leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </section>
          <section>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1A1A2E] mb-2">Responsibilities</h2>
            <p className="text-sm text-[#5C6478] leading-relaxed whitespace-pre-wrap">{job.responsibilities}</p>
          </section>
          <section>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#1A1A2E] mb-2">Requirements</h2>
            <p className="text-sm text-[#5C6478] leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
          </section>
        </article>

        <aside className="bg-white border border-[#E8EDF2] rounded-[14px] p-5 sm:p-6 sticky top-[88px]">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-extrabold text-[#1A1A2E]">Application submitted</h3>
              <p className="text-sm text-[#5C6478] mt-2">
                Thanks — we will review your application and get back to you by email.
              </p>
              <Link to="/careers" className="inline-block mt-5 text-sm font-bold text-orange-primary">
                Browse more roles
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h2 className="text-base font-extrabold text-[#1A1A2E]">Apply for this role</h2>
              <p className="text-xs text-[#9AA0AC]">PDF, DOC, or DOCX resume required.</p>
              {(
                [
                  ['name', 'Full name', 'text'],
                  ['email', 'Email', 'email'],
                  ['phone', 'Phone', 'tel'],
                ] as const
              ).map(([key, label, type]) => (
                <label key={key} className="block text-[11px] font-bold uppercase tracking-wider text-[#9AA0AC]">
                  {label}
                  <input
                    type={type}
                    required={key !== 'phone'}
                    value={form[key]}
                    onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                    className="mt-1.5 w-full rounded-[10px] border border-[#E8EDF2] px-3.5 py-2.5 text-sm text-[#1A1A2E] font-medium normal-case"
                  />
                </label>
              ))}
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9AA0AC]">
                Resume / CV
                <div className="mt-1.5 relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center gap-2 rounded-[10px] border border-dashed border-[#E8EDF2] px-3.5 py-3 text-sm text-[#5C6478]">
                    <Upload size={16} className="text-orange-primary shrink-0" />
                    <span className="truncate">{resumeFile ? resumeFile.name : 'Choose file'}</span>
                  </div>
                </div>
              </label>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9AA0AC]">
                Cover letter / message
                <textarea
                  value={form.coverLetter}
                  onChange={(event) => setForm((prev) => ({ ...prev, coverLetter: event.target.value }))}
                  rows={5}
                  className="mt-1.5 w-full rounded-[10px] border border-[#E8EDF2] px-3.5 py-2.5 text-sm text-[#1A1A2E] font-medium normal-case"
                  placeholder="Tell us why you are a fit…"
                />
              </label>
              {formError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-[10px] px-3 py-2">
                  {formError}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-[10px] bg-orange-primary text-white text-[12px] font-black uppercase tracking-wider py-3 disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit application'}
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
