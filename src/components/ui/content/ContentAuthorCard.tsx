import React from 'react';
import { CheckCircle2, UserPlus, Globe, Twitter, Instagram, Linkedin } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../buttons/Button';
import { Badge } from '../badges/Badge';

export interface ContentAuthorCardProps {
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
    role?: string;
    organization?: string;
    bio?: string;
    socials?: {
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      website?: string;
    };
  };
  onFollow?: () => void;
  isFollowing?: boolean;
  className?: string;
}

export const ContentAuthorCard: React.FC<ContentAuthorCardProps> = ({
  author,
  onFollow,
  isFollowing,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all hover:shadow-md", className)}>
      <div className="relative shrink-0">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-slate-100">
          <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
        </div>
        {author.verified && (
          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-white" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-[#000435] flex items-center gap-2">
              {author.name}
            </h3>
            {(author.role || author.organization) && (
              <p className="text-sm font-bold text-slate-500 mt-1">
                {author.role} {author.organization && <span className="text-[#EB4501]">@ {author.organization}</span>}
              </p>
            )}
          </div>
          {onFollow && (
            <Button 
              onClick={onFollow}
              variant={isFollowing ? "outline" : "primary"} 
              className={cn("shrink-0 gap-2", isFollowing ? "border-slate-200 text-slate-700" : "bg-[#000435] text-white hover:bg-[#CF4400]")}
            >
              <UserPlus size={16} /> {isFollowing ? 'Following' : 'Follow Author'}
            </Button>
          )}
        </div>

        {author.bio && (
          <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">
            {author.bio}
          </p>
        )}

        {author.socials && Object.values(author.socials).some(Boolean) && (
          <div className="flex items-center gap-3 pt-2">
            {author.socials.website && (
              <a href={author.socials.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#CF4400] hover:bg-orange-50 transition-colors">
                <Globe size={14} />
              </a>
            )}
            {author.socials.twitter && (
              <a href={author.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-50 transition-colors">
                <Twitter size={14} />
              </a>
            )}
            {author.socials.instagram && (
              <a href={author.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition-colors">
                <Instagram size={14} />
              </a>
            )}
            {author.socials.linkedin && (
              <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Linkedin size={14} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
