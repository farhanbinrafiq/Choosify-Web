import React from 'react';
import type { StudioPanelId } from '../../../hooks/useSpotlightExperienceBuilder';
import { cn } from '../../../lib/utils';
import {
  Layout,
  Search,
  Compass,
  Sparkles,
  Eye,
  Link2,
  ShoppingBag,
  Image,
} from 'lucide-react';

const PANELS: { id: StudioPanelId; label: string; icon: React.ReactNode }[] = [
  { id: 'editor', label: 'Editor', icon: <Layout size={16} /> },
  { id: 'media', label: 'Media', icon: <Image size={16} /> },
  { id: 'commerce', label: 'Commerce', icon: <ShoppingBag size={16} /> },
  { id: 'relationships', label: 'Links', icon: <Link2 size={16} /> },
  { id: 'seo', label: 'SEO', icon: <Search size={16} /> },
  { id: 'discovery', label: 'Discovery', icon: <Compass size={16} /> },
  { id: 'ai', label: 'AI', icon: <Sparkles size={16} /> },
  { id: 'preview', label: 'Preview', icon: <Eye size={16} /> },
];

interface SpotlightSidebarProps {
  activePanel: StudioPanelId;
  onPanelChange: (panel: StudioPanelId) => void;
}

export function SpotlightSidebar({ activePanel, onPanelChange }: SpotlightSidebarProps) {
  return (
    <aside className="w-14 md:w-48 shrink-0 border-r border-[#e8edf2] bg-white flex flex-col py-3" aria-label="Studio panels">
      {PANELS.map((panel) => (
        <button
          key={panel.id}
          type="button"
          onClick={() => onPanelChange(panel.id)}
          className={cn(
            'flex items-center gap-2 px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide transition-colors',
            activePanel === panel.id
              ? 'bg-[#F8FBFD] text-[#E8500A] border-r-2 border-[#E8500A]'
              : 'text-gray-400 hover:text-navy hover:bg-[#F8FBFD]',
          )}
          aria-current={activePanel === panel.id ? 'page' : undefined}
        >
          {panel.icon}
          <span className="hidden md:inline">{panel.label}</span>
        </button>
      ))}
    </aside>
  );
}
