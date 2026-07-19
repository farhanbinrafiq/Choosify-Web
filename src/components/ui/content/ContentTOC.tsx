import React, { useEffect, useState } from 'react';
import { List } from 'lucide-react';
import { cn } from '../../../lib/utils';

export interface TOCHeading {
  id: string;
  title: string;
  level: number;
}

export interface ContentTOCProps {
  headings: TOCHeading[];
  activeId?: string;
  onNavigate?: (id: string) => void;
  className?: string;
}

export const ContentTOC: React.FC<ContentTOCProps> = ({
  headings,
  activeId: externalActiveId,
  onNavigate,
  className
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string>(headings[0]?.id || '');

  const activeId = externalActiveId !== undefined ? externalActiveId : internalActiveId;

  // Setup intersection observer if no external activeId control is provided
  useEffect(() => {
    if (externalActiveId !== undefined) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInternalActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings, externalActiveId]);

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setInternalActiveId(id);
      }
    }
  };

  if (!headings || headings.length === 0) return null;

  return (
    <div className={cn("bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24", className)}>
      <h3 className="text-xs font-black text-[#000435] uppercase tracking-widest flex items-center gap-2 mb-4">
        <List className="w-4 h-4 text-[#EB4501]" /> TABLE OF CONTENTS
      </h3>
      <nav className="space-y-1">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => handleNavigate(e, heading.id)}
              className={cn(
                "block py-2 text-sm font-semibold transition-all border-l-2",
                heading.level === 2 ? "pl-4" : "pl-8 text-xs",
                isActive 
                  ? "border-[#EB4501] text-[#EB4501] bg-orange-50/50" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {heading.title}
            </a>
          );
        })}
      </nav>
    </div>
  );
};
