import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Star, Plus } from 'lucide-react';
import { Button } from '../buttons/Button';

export interface WriteReviewCardProps {
  onSubmit?: (data: { rating: number; review: string; photos: File[] }) => void;
  className?: string;
}

export const WriteReviewCard: React.FC<WriteReviewCardProps> = ({
  onSubmit,
  className
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ rating, review, photos });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...newPhotos]);
    }
  };

  return (
    <div className={cn("bg-white rounded-2xl border border-slate-100 p-6 md:p-8 flex flex-col", className)}>
      <h3 className="text-lg font-extrabold text-[#000435] mb-6">Write your review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-8 h-8 cursor-pointer transition-colors",
                  (hoverRating || rating) >= star ? "fill-[#EB4501] text-[#EB4501]" : "text-slate-200"
                )}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        {/* Review Textarea */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Your Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            className="w-full min-h-[120px] rounded-xl border border-slate-200 p-4 text-sm font-medium focus:border-[#000435] focus:ring-1 focus:ring-[#000435] outline-none transition-all resize-y"
            required
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Add Photos (optional)</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {photos.map((photo, idx) => (
              <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative">
                <img src={URL.createObjectURL(photo)} alt="Upload preview" className="w-full h-full object-cover" />
              </div>
            ))}
            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#EB4501] hover:bg-orange-50 transition-colors shrink-0">
              <Plus className="w-6 h-6 text-slate-400" />
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <Button variant="primary" className="w-full mt-4" type="submit">
          Submit Review
        </Button>
      </form>
    </div>
  );
};
