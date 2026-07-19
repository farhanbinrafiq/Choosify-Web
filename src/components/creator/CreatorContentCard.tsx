import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export type CreatorContentCardProps = {
  title: string;
  tag: string;
  tagBg: string;
  meta: string;
  image?: string;
  showPlay?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
};

/** Choosify.dc.html Featured Content card — 150px media, tag, gradient title, meta */
export function CreatorContentCard({
  title,
  tag,
  tagBg,
  meta,
  image,
  showPlay = false,
  href,
  onClick,
  className,
}: CreatorContentCardProps) {
  const body = (
    <>
      <div className="relative h-[150px] rounded-[10px] overflow-hidden mb-2 bg-[#1A1A2E]">
        {image ? (
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2323FF]/35 to-[#EB4501]/25" />
        )}
        <span
          className="absolute top-2 left-2 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded pointer-events-none"
          style={{ background: tagBg }}
        >
          {tag}
        </span>
        {showPlay && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-black/40 border-[1.5px] border-white/90 flex items-center justify-center">
              <div
                className="w-0 h-0 border-solid border-y-[5px] border-y-transparent border-l-[8px] border-l-white ml-0.5"
                aria-hidden
              />
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-2.5 pt-[22px] pb-2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
          <div className="text-xs font-bold text-white leading-snug line-clamp-2">{title}</div>
        </div>
      </div>
      <div className="text-[10.5px] text-[#9AA0AC]">{meta}</div>
    </>
  );

  const shell = cn('block text-left cursor-pointer no-underline', className);

  if (href) {
    return (
      <Link to={href} className={shell}>
        {body}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(shell, 'w-full border-0 bg-transparent p-0')}>
        {body}
      </button>
    );
  }

  return <div className={shell}>{body}</div>;
}

export const CREATOR_FEED_GRID =
  'grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5';
