import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Flag, Megaphone, Sparkles } from 'lucide-react';
import {
  entityTypeLabel,
  type AnnouncementAssociatedEntity,
} from '../../lib/announcements';
import { PRODUCTS, PLACEHOLDER_IMAGE } from '../../constants';

export type DynamicContentRailMode = 'announcement' | 'emi';

function resolveEntityDisplay(entity: AnnouncementAssociatedEntity) {
  if (entity.type === 'product' || entity.type === 'service') {
    const product = PRODUCTS.find((p) => String(p.id) === String(entity.id));
    if (product) {
      return {
        title: entity.title || product.title,
        subtitle:
          entity.subtitle ||
          [product.brand, product.category].filter(Boolean).join(' · ') ||
          entityTypeLabel(entity.type),
        image: entity.image || product.image || PLACEHOLDER_IMAGE,
        href: entity.href || `/products/${product.id}`,
        ctaLabel: entity.ctaLabel || 'View product',
        meta:
          product.price != null
            ? `৳${String(product.price).replace(/^\৳/, '')}`
            : undefined,
      };
    }
  }

  return {
    title: entity.title || `${entityTypeLabel(entity.type)} ${entity.id}`,
    subtitle: entity.subtitle || entityTypeLabel(entity.type),
    image: entity.image || PLACEHOLDER_IMAGE,
    href:
      entity.href ||
      (entity.type === 'guide'
        ? `/guides/${entity.id}`
        : entity.type === 'campaign'
          ? '/deals'
          : entity.type === 'brand'
            ? `/brands/${entity.id}`
            : entity.type === 'order'
              ? '/order-tracking'
              : '#'),
    ctaLabel:
      entity.ctaLabel ||
      (entity.type === 'guide'
        ? 'Open guide'
        : entity.type === 'campaign'
          ? 'View campaign'
          : entity.type === 'brand'
            ? 'View brand'
            : entity.type === 'order'
              ? 'Track order'
              : 'Open'),
    meta: undefined as string | undefined,
  };
}

function EntityCard({ entity }: { entity: AnnouncementAssociatedEntity }) {
  const display = resolveEntityDisplay(entity);

  return (
    <div className="rounded-[10px] border border-[#E8EDF2] overflow-hidden bg-white">
      <div className="aspect-[4/3] bg-[#F4F7F9] relative overflow-hidden">
        <img
          src={display.image}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
        <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md bg-white/95 text-[#EB4501] border border-[#EB4501]/20">
          {entityTypeLabel(entity.type)}
        </span>
      </div>
      <div className="p-3.5 space-y-2">
        <div>
          <h3 className="text-[13px] font-extrabold text-[#1A1A2E] leading-snug">
            {display.title}
          </h3>
          {display.subtitle ? (
            <p className="text-[11px] text-[#9AA0AC] mt-0.5">{display.subtitle}</p>
          ) : null}
        </div>
        {display.meta ? (
          <p className="text-[14px] font-extrabold text-[#EB4501] tabular-nums">
            {display.meta}
          </p>
        ) : null}
        <Link
          to={display.href}
          className="inline-flex w-full items-center justify-center gap-1.5 min-h-[38px] px-3 rounded-lg bg-[#EB4501] text-white text-[11.5px] font-bold no-underline hover:brightness-110"
        >
          {display.ctaLabel}
          <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}

const COPY: Record<
  DynamicContentRailMode,
  {
    title: string;
    empty: string;
    excerptLabel: string;
    hint: string;
    Icon: typeof Megaphone;
  }
> = {
  announcement: {
    title: 'Related to this announcement',
    empty:
      'Select an announcement in the thread to see the related product, guide, or campaign here.',
    excerptLabel: 'Announcement',
    hint: 'Click an announcement to update this panel with related content.',
    Icon: Megaphone,
  },
  emi: {
    title: 'Suggested by Emi',
    empty:
      'When Emi suggests products, brands, or deals, they appear here. Ask about something on Choosify to get started.',
    excerptLabel: 'Emi said',
    hint: 'Click an Emi reply to refresh this panel with its suggested content.',
    Icon: Sparkles,
  },
};

export type MessagesDynamicContentRailProps = {
  mode: DynamicContentRailMode;
  /** One or more entities to show as cards (Emi may return several picks). */
  entities?: AnnouncementAssociatedEntity[] | null;
  /** Optional message excerpt shown below the cards. */
  excerpt?: string | null;
  onReportProblem?: () => void;
};

/**
 * Shared right-rail for Announcements + Emi: dynamic product/brand/deal/guide cards.
 * Buyer–seller threads keep the separate Transaction Details rail.
 */
export function MessagesDynamicContentRail({
  mode,
  entities,
  excerpt,
  onReportProblem,
}: MessagesDynamicContentRailProps) {
  const copy = COPY[mode];
  const Icon = copy.Icon;
  const list = (entities || []).filter(Boolean);
  const hasCards = list.length > 0;

  return (
    <aside className="hidden xl:flex w-[260px] shrink-0 flex-col border-l border-[#E8EDF2] bg-white p-[18px] gap-5 overflow-y-auto min-h-0">
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A1A2E] mb-3">
          <Icon size={12} className="text-[#EB4501]" />
          {copy.title}
        </div>

        {!hasCards ? (
          <div className="rounded-[10px] border border-dashed border-[#E8EDF2] bg-[#F4F7F9] p-4 text-[11.5px] text-[#9AA0AC] leading-relaxed">
            {copy.empty}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((entity, idx) => (
              <EntityCard key={`${entity.type}-${entity.id}-${idx}`} entity={entity} />
            ))}
          </div>
        )}
      </div>

      {excerpt ? (
        <div>
          <div className="text-[11px] font-extrabold text-[#1A1A2E] mb-2">{copy.excerptLabel}</div>
          <p className="text-[11.5px] text-[#4B5563] leading-relaxed whitespace-pre-line line-clamp-8">
            {excerpt}
          </p>
        </div>
      ) : null}

      <div className="mt-auto pt-2 border-t border-[#E8EDF2] space-y-3">
        {onReportProblem && (
          <button
            type="button"
            onClick={onReportProblem}
            className="w-full inline-flex items-center justify-center gap-1.5 min-h-[38px] px-3 rounded-lg border border-[#E8EDF2] bg-white text-[11.5px] font-bold text-[#1A1A2E] hover:border-[#EB4501] hover:text-[#CF4400] cursor-pointer"
          >
            <Flag size={12} className="text-[#EB4501]" />
            Report to Support
          </button>
        )}
        <p className="text-[10.5px] text-[#9AA0AC] leading-relaxed">{copy.hint}</p>
      </div>
    </aside>
  );
}
