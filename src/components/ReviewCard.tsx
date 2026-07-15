import React, { memo } from 'react';
import { CreatorReviewCard, CreatorReview } from './CreatorReviewCard';
import { PublicReviewCard, ReviewData } from './PublicReviewCard';

interface ReviewCardProps {
  variant?: 'public' | 'creator';
  review: any; // Can be ReviewData or CreatorReview
  isDark?: boolean;
  showActions?: boolean;
  onHelpfulClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onClick?: () => void;
  className?: string;
}

export const ReviewCard = memo(function ReviewCard({
  variant = 'public',
  review,
  isDark = false,
  showActions = false,
  onHelpfulClick,
  onEditClick,
  onDeleteClick,
  onClick,
  className
}: ReviewCardProps) {
  if (variant === 'creator') {
    return <CreatorReviewCard review={review as CreatorReview} onClick={onClick} className={className} />;
  }

  return (
    <PublicReviewCard
      review={review as ReviewData}
      isDark={isDark}
      showActions={showActions}
      onHelpfulClick={onHelpfulClick}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
    />
  );
});
