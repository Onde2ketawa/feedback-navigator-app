
import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ 
  rating, 
  maxRating = 5 
}) => {
  // Ensure rating is a proper number between 1-5
  const validRating = typeof rating === 'number' && !isNaN(rating) 
    ? Math.min(Math.max(Math.round(rating), 1), maxRating) 
    : 1;

  return (
    <div className="flex">
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star 
          key={i} 
          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < validRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};
