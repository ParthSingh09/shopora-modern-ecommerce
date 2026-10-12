import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, reviewCount, size = 'sm' }) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-shopora-muted">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((index) => {
          const isFilled = rating >= index;
          const isHalf = !isFilled && rating >= index - 0.5;

          return (
            <Star
              key={index}
              className={`${iconSize} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-slate-600'
              }`}
            />
          );
        })}
      </div>
      <span className="font-semibold text-slate-200">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-shopora-muted">({reviewCount})</span>
      )}
    </div>
  );
};
