/**
 * "Your own pages" made in Website Studio → Pages (/pages/<slug>).
 * Shows the PUBLISHED page (GET /website/published/page:<slug>); inside a Website Studio draft
 * preview it shows the draft instead. Structured blocks only — every block is drawn here in the
 * Choosify style (no HTML from the CMS).
 */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { usePageBreadcrumbs } from '../context/BreadcrumbContext';

type Card = { id: string; enabled: boolean; icon: string; title: string; text: string; imageUrl: string; href: string };
type Faq = { id: string; enabled: boolean; question: string; answer: string };
type Block =
  | { id: string; type: 'text'; enabled: boolean; heading: string; body: string }
  | { id: string; type: 'image'; enabled: boolean; imageUrl: string; alt: string; caption: string }
  | { id: string; type: 'cards'; enabled: boolean; heading: string; items: Card[] }
  | { id: string; type: 'cta'; enabled: boolean; heading: string; text: string; buttonLabel: string; buttonHref: string }
  | { id: string; type: 'faq'; enabled: boolean; heading: string; items: Faq[] };
type Content = {
  title: string;
  seoDescription: string;
  hero: { eyebrow: string; heading: string; text: string; imageUrl: string; buttonLabel: string; buttonHref: string };
  blocks: Block[];
};

const API_BASE = (((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL as string | undefined) || '/api/v1').replace(/\/$/, '');

function SmartLink({ href, className, children, testId }: { href: string; className?: string; children: React.ReactNode; testId?: string }) {
  if (/^https:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} data-testid={testId}>
        {children}
      </a>
    );
  }
  if (/^(mailto:|tel:|#)/i.test(href)) return <a href={href} className={className} data-testid={testId}>{children}</a>;
  return (
    <Link to={href || '/'} className={className} data-testid={testId}>
      {children}
    </Link>
  );
}

/** Plain text → paragraphs; lines starting with "- " become bullet lists. */
function Body({ text }: { text: string }) {
  const parts = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="space-y-3 text-[14px] leading-relaxed text-[#4B5563]">
      {parts.map((p, i) => {
        const lines = p.split('\n');
        if (lines.every((l) => /^\s*-\s+/.test(l))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^\s*-\s+/, '')}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        );
      })}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  if (block.type === 'text') {
    return (
      <section className="rounded-2xl border border-[#E8EDF2] bg-white p-6 md:p-8" data-testid="cp-block-text">
        {block.heading ? <h2 className="mb-3 text-[20px] font-extrabold text-[#1A1A2E]">{block.heading}</h2> : null}
        <Body text={block.body} />
      </section>
    );
  }
  if (block.type === 'image') {
    if (!block.imageUrl) return null;
    return (
      <figure data-testid="cp-block-image">
        <img src={block.imageUrl} alt={block.alt} className="w-full rounded-2xl object-cover" loading="lazy" />
        {block.caption ? <figcaption className="mt-2 text-center text-[12px] text-[#9AA0AC]">{block.caption}</figcaption> : null}
      </figure>
    );
  }
  if (block.type === 'cards') {
    const items = block.items.filter((c) => c.enabled && (c.title || c.text));
    if (!items.length) return null;
    return (
      <section data-testid="cp-block-cards">
        {block.heading ? <h2 className="mb-4 text-[20px] font-extrabold text-[#1A1A2E]">{block.heading}</h2> : null}
        <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${items.length >= 3 ? 'lg:grid-cols-3' : ''}`}>
          {items.map((c) => {
            const inner = (
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8EDF2] bg-white">
                {c.imageUrl ? <img src={c.imageUrl} alt="" className="h-40 w-full object-cover" loading="lazy" /> : null}
                <div className="flex flex-1 flex-col p-5">
                  {!c.imageUrl && c.icon ? <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF3EA] text-[18px]">{c.icon}</div> : null}
                  {c.title ? <div className="mb-1.5 text-[15px] font-extrabold text-[#1A1A2E]">{c.title}</div> : null}
                  {c.text ? <div className="text-[13px] leading-relaxed text-[#6B7280]">{c.text}</div> : null}
                  {c.href ? <div className="mt-auto pt-3 text-[12px] font-bold text-[#FF5B00]">Learn more →</div> : null}
                </div>
              </div>
            );
            return c.href ? (
              <SmartLink key={c.id} href={c.href} className="block h-full no-underline transition-transform hover:-translate-y-0.5">
                {inner}
              </SmartLink>
            ) : (
              <div key={c.id}>{inner}</div>
            );
          })}
        </div>
      </section>
    );
  }
  if (block.type === 'cta') {
    return (
      <section className="flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-[#3B1E3F] via-[#2A1846] to-[#2B1A4A] px-6 py-6 sm:flex-row sm:items-center sm:px-8" data-testid="cp-block-cta">
        <div className="min-w-0 flex-1">
          {block.heading ? <div className="text-[18px] font-extrabold text-white">{block.heading}</div> : null}
          {block.text ? <div className="mt-1 text-[13.5px] text-white/70">{block.text}</div> : null}
        </div>
        {block.buttonLabel && block.buttonHref ? (
          <SmartLink href={block.buttonHref} className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#FF5B00] px-6 py-3 text-[13px] font-extrabold uppercase tracking-wide text-white no-underline shadow-md hover:brightness-110" testId="cp-cta-button">
            {block.buttonLabel}
          </SmartLink>
        ) : null}
      </section>
    );
  }
  if (block.type === 'faq') {
    const items = block.items.filter((q) => q.enabled && q.question);
    if (!items.length) return null;
    return (
      <section className="rounded-2xl border border-[#E8EDF2] bg-white p-6 md:p-8" data-testid="cp-block-faq">
        {block.heading ? <h2 className="mb-3 text-[20px] font-extrabold text-[#1A1A2E]">{block.heading}</h2> : null}
        <div className="divide-y divide-[#E8EDF2]">
          {items.map((q) => (
            <details key={q.id} className="group py-3">
              <summary className="cursor-pointer list-none text-[14px] font-bold text-[#1A1A2E] marker:hidden">
                <span className="mr-2 inline-block text-[#FF5B00] transition-transform group-open:rotate-90">›</span>
                {q.question}
              </summary>
              <div className="mt-2 pl-5">
                <Body text={q.answer} />
              </div>
            </details>
          ))}
        </div>
      </section>
    );
  }
  return null;
}

export function CustomPageView({ content }: { content: Content }) {
  const h = content.hero;
  return (
    <div className="min-h-screen bg-[#F4F7F9]" data-testid="custom-page">
      <div className="mx-auto w-full max-w-[1100px] space-y-6 px-5 py-6 pb-[60px] sm:px-10">
        <section className={`grid grid-cols-1 items-center gap-6 rounded-2xl bg-white p-6 md:p-10 ${h.imageUrl ? 'md:grid-cols-[1.1fr_0.9fr]' : ''}`} data-testid="cp-hero">
          <div>
            {h.eyebrow ? <div className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wide text-[#2323FF]">{h.eyebrow}</div> : null}
            <h1 className="mb-3 text-[28px] font-extrabold leading-tight text-[#1A1A2E] md:text-[34px]">{h.heading || content.title}</h1>
            {h.text ? <p className="m-0 text-[14px] leading-relaxed text-[#4B5563]">{h.text}</p> : null}
            {h.buttonLabel && h.buttonHref ? (
              <SmartLink href={h.buttonHref} className="mt-5 inline-flex rounded-lg bg-[#FF5B00] px-6 py-3 text-[13px] font-extrabold uppercase tracking-wide text-white no-underline shadow-md hover:brightness-110">
                {h.buttonLabel}
              </SmartLink>
            ) : null}
          </div>
          {h.imageUrl ? <img src={h.imageUrl} alt="" className="h-[220px] w-full rounded-xl object-cover md:h-[260px]" /> : null}
        </section>
        {content.blocks.filter((b) => b.enabled).map((b) => (
          <BlockView key={b.id} block={b} />
        ))}
      </div>
    </div>
  );
}

export function CustomPage({ slug: slugProp }: { slug?: string }) {
  const params = useParams<{ slug: string }>();
  const slug = (slugProp || params.slug || '').toLowerCase();
  const { siteConfig } = useGlobalState();
  const previewDraft = (siteConfig?.websiteStudio as { customPages?: Record<string, Content> } | undefined)?.customPages?.[slug];
  const [state, setState] = useState<{ status: 'loading' | 'ok' | 'missing'; content?: Content }>({ status: 'loading' });

  useEffect(() => {
    if (previewDraft) return;
    let alive = true;
    setState({ status: 'loading' });
    fetch(`${API_BASE}/website/published/${encodeURIComponent(`page:${slug}`)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => alive && setState(j?.data?.content ? { status: 'ok', content: j.data.content as Content } : { status: 'missing' }))
      .catch(() => alive && setState({ status: 'missing' }));
    return () => {
      alive = false;
    };
  }, [slug, previewDraft]);

  const content = previewDraft || state.content;
  // Crumbs: Home › <page title> (the /pages segment is not a real page).
  usePageBreadcrumbs(
    content?.title ? { replaceItems: [{ name: 'Home', path: '/' }, { name: content.title, path: `/pages/${slug}` }] } : { hidden: state.status !== 'ok' },
    [content?.title, slug, state.status],
  );
  useEffect(() => {
    if (content?.title) document.title = `${content.title} | Choosify`;
  }, [content?.title]);

  if (content) return <CustomPageView content={content} />;
  if (state.status === 'loading') return <div className="min-h-[50vh]" />;
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 text-center" data-testid="custom-page-missing">
      <div>
        <div className="text-[22px] font-extrabold text-[#1A1A2E]">Page not found</div>
        <p className="mt-1 text-[13px] text-[#6B7280]">This page doesn’t exist or isn’t published.</p>
        <Link to="/" className="mt-4 inline-block text-[13px] font-bold text-[#FF5B00]">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default CustomPage;
