import React from 'react';
import { SpotlightCard } from './SpotlightCard';

export interface CreatorReview {
  id: string;
  cover: string;
  title: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  duration: string;
  views: string;
  date: string;
  category: string;
  categoryColor: string;
  platform: 'youtube' | 'instagram' | 'tiktok' | 'choosify';
  sponsor?: string;
}

interface Props {
  review: CreatorReview;
  onClick?: () => void;
  className?: string;
}

export function CreatorReviewCard({ review, onClick, className }: Props) {
  return (
    <SpotlightCard
      id={review.id}
      variant="video"
      title={review.title}
      image={review.cover}
      creator={review.creator}
      duration={review.duration}
      views={review.views}
      date={review.date}
      badge={review.category}
      badgeBg={review.categoryColor}
      sponsorBadge={review.sponsor}
      onClick={onClick}
      className={className}
    />
  );
}
